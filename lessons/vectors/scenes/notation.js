// ---- Algebra kit (shared by the Area 2 and 3 lessons) ----
// FD.mk(el, { cls, vis, side, tryHtml }): a stage with an optional picture, a big formula, a verdict line,
//   worked lines and a "Try it" panel. Returns { root, $, big, msg, work, upto, tryMode, onTry }.
// FD.walk(lines, pre?, gap?): a step that resets the stage and reveals worked lines one by one.
// TYPES.alg: typed algebra answers, marked by value at random points, e.g. { type: 'alg', q, a: '(x+3)(x-2)', form: 'factorised', show, why }.
FD.mk = (el, { cls = '', vis = '', side = false, tryHtml = '' } = {}) => {
  el.innerHTML = `<div class="sim kit ${cls}${side ? ' duo' : ''}"><div class="kit-main">${vis ? `<div class="kit-vis">${vis}</div>` : ''}<div class="kit-side"><div class="mbig" data-k="big"></div><p class="verdict" data-k="msg"></p><div class="eq-work" data-k="work"></div></div></div>${tryHtml ? `<div class="card ctrls kit-try" data-k="try" hidden>${tryHtml}</div>` : ''}</div>`;
  const root = el.firstElementChild, $ = (s) => root.querySelector(s), k = (n) => root.querySelector(`[data-k="${n}"]`);
  let w = null;
  const api = {
    root, $, onTry: null,
    big(t) { k('big').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t = '', c = 'good') { k('msg').className = 'verdict ' + c; k('msg').innerHTML = t; },
    work(lines, c) { k('work').innerHTML = ''; w = lines ? FD.work(k('work'), lines, c) : null; },
    upto(i) { if (w) w.upto(i); },
    tryMode(on) { const t = k('try'); if (t) t.hidden = !on; api.work(null); api.msg(''); if (on && api.onTry) api.onTry(); },
  };
  return api;
};
FD.walk = (lines, pre, gap = 1300) => async (a, ctx) => {
  a.tryMode(false); if (pre) pre(a);
  a.work(lines);
  for (let i = 0; i < lines.length; i++) { a.upto(i); if (!(await ctx.sleep(gap))) return; }
};
// Reads an algebraic expression ("3x^2 - 2(x+1)", "y = (x-c)/m") into a function of its letters, or null.
FD.algFn = (raw) => {
  const s = String(raw || '').replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3').replace(/^[a-zA-Z]=/, '');
  const raw2 = s.match(/\d+\.?\d*|\.\d+|[a-zA-Z]|[()+\-*/^]/g) || [];
  if (!s || raw2.join('') !== s) return null;
  const t = [];
  raw2.forEach((x) => { const p = t[t.length - 1]; if (p != null && /[\w.)]$/.test(p) && /^[\w.(]/.test(x)) t.push('*'); t.push(x); });
  let i = 0;
  const atom = () => {
    const x = t[i++];
    if (x === '(') { const v = sum(); if (t[i++] !== ')') throw 0; return v; }
    if (x != null && /^[\d.]/.test(x)) return () => +x;
    if (x != null && /^[a-zA-Z]$/.test(x)) return (e) => e[x];
    throw 0;
  };
  const pow = () => { const b = atom(); if (t[i] === '^') { i++; const p = un(); return (e) => b(e) ** p(e); } return b; };
  const un = () => { if (t[i] === '-') { i++; const v = un(); return (e) => -v(e); } if (t[i] === '+') { i++; return un(); } return pow(); };
  const prod = () => { let v = un(); while (t[i] === '*' || t[i] === '/') { const o = t[i++], r = un(), l = v; v = o === '*' ? (e) => l(e) * r(e) : (e) => l(e) / r(e); } return v; };
  const sum = () => { let v = prod(); while (t[i] === '+' || t[i] === '-') { const o = t[i++], r = prod(), l = v; v = o === '+' ? (e) => l(e) + r(e) : (e) => l(e) - r(e); } return v; };
  try { const f = sum(); return i === t.length ? f : null; } catch (e) { return null; }
};
// Number of terms at the top level ("3x + 2y - 1" → 3) and whether it is a product of brackets.
FD.algShape = (raw) => {
  const s = String(raw || '').replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/^[a-zA-Z]=/, '');
  let d = 0, terms = 1;
  [...s].forEach((c, j) => { if (c === '(') d++; else if (c === ')') d--; else if (!d && j > 0 && (c === '+' || c === '-') && !/[\^*/(]/.test(s[j - 1])) terms++; });
  return { terms, brackets: s.includes('(') };
};
FD.algSame = (u, v) => {
  const f = FD.algFn(u), g = FD.algFn(v);
  if (!f || !g) return false;
  const vars = [...new Set((String(u) + String(v)).replace(/^[a-zA-Z]=|=/g, '').match(/[a-zA-Z]/g) || [])];
  let n = 0;
  for (let k = 0; k < 12 && n < 6; k++) {
    const e = {}; vars.forEach((x) => { e[x] = +(Math.random() * 6 - 2.5).toFixed(3) || 1.3; });
    const a = f(e), b = g(e);
    if (!isFinite(b)) continue;
    if (!isFinite(a) || Math.abs(a - b) > 1e-6 * (1 + Math.abs(b))) return false;
    n++;
  }
  return n >= 3;
};
const algTex = (s) => String(s).replace(/\*/g, ' \\times ').replace(/\^\(?(-?\w+)\)?/g, '^{$1}');
TYPES.alg = (it, body, finish) => {
  body.innerHTML = `
    <div class="num-row"><label class="num-f">${it.lhs ? `<span>\\(${it.lhs}\\)</span>` : ''}<input class="num-in alg-in" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Your answer"></label>
      <button class="btn small-btn chk-go" disabled>Check answer</button></div>
    <p class="alg-prev" aria-hidden="true"></p>
    <p class="chk-hint">${it.hint || 'Type powers with ^, for example 3x^2 - 5x + 2.'}</p>`;
  const inp = body.querySelector('.alg-in'), go = body.querySelector('.chk-go'), prev = body.querySelector('.alg-prev');
  inp.addEventListener('input', () => { go.disabled = !inp.value.trim(); prev.innerHTML = inp.value.trim() ? FD.tex(algTex(inp.value.trim().replace(/^[a-zA-Z]=/, ''))) : ''; });
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !go.disabled) go.click(); });
  go.addEventListener('click', () => {
    if (body.dataset.done) return;
    body.dataset.done = 1; go.hidden = true; inp.readOnly = true;
    const sh = FD.algShape(inp.value), want = FD.algShape(it.a);
    let ok = FD.algSame(inp.value, it.a);
    if (ok && it.form === 'factorised') ok = sh.terms === 1 && sh.brackets;
    if (ok && it.form === 'expanded') ok = !sh.brackets && sh.terms <= want.terms;
    if (ok && it.form === 'simplified') ok = sh.terms <= want.terms && (want.brackets || !sh.brackets);
    inp.classList.add(ok ? 'right' : 'wrong');
    if (!ok) body.insertAdjacentHTML('beforeend', `<p class="num-want">Answer: ${it.show || `\\(${algTex(it.a)}\\)`}</p>`);
    finish(ok ? 1 : 0);
  });
  return 1;
};
// A graph: FD.graph(host, axesOptions) draws the grid once and returns helpers that write SVG for a layer
// clipped to the plot area: curve(f, cls, a, b), pt(x, y, cls), lbl(x, y, text, cls), line(x1, y1, x2, y2, cls).
let kitClip = 0;
FD.graph = (host, o) => {
  const ax = FD.axes(o), id = 'kclip' + ++kitClip, p = o.pad || 28;
  host.innerHTML = `<svg class="graph" viewBox="0 0 ${ax.w} ${ax.h}" role="img" aria-label="${o.label || 'Graph'}">${ax.grid()}
    <clipPath id="${id}"><rect x="${p}" y="${p}" width="${ax.w - 2 * p}" height="${ax.h - 2 * p}"/></clipPath><g clip-path="url(#${id})" class="g-clip"></g><g class="g-top"></g></svg>`;
  const clip = host.querySelector('.g-clip'), top = host.querySelector('.g-top');
  const inX = (x) => Math.max(p + 2, Math.min(ax.w - p - 2, x)), inY = (y) => Math.max(p + 12, Math.min(ax.h - p - 4, y));
  return {
    ax, svg: host.querySelector('svg'),
    draw(under, over = '') { clip.innerHTML = under; top.innerHTML = over; },
    curve: (f, cls = '', a, b) => `<path class="curve ${cls}" d="${ax.path(f, a, b)}"/>`,
    line: (x1, y1, x2, y2, cls = 'g-line') => `<line class="${cls}" x1="${ax.X(x1)}" y1="${ax.Y(y1)}" x2="${ax.X(x2)}" y2="${ax.Y(y2)}"/>`,
    pt: (x, y, cls = '') => `<circle class="pt ${cls}" cx="${ax.X(x)}" cy="${ax.Y(y)}" r="6"/>`,
    // a label next to (x, y): it flips to the left near the right edge and stays inside the plot
    lbl: (x, y, t, cls = '') => { const X = ax.X(x), right = X > ax.w * .62; return `<text class="g-lbl ${cls}" x="${inX(X + (right ? -10 : 10))}" y="${inY(ax.Y(y) - 10)}" text-anchor="${right ? 'end' : 'start'}">${t}</text>`; },
  };
};
// A polynomial from its coefficients, highest power first: FD.poly([1, -3, 2]) → "x^{2} - 3x + 2".
// plain = true writes "x^2" so it can be used as a typed-answer key.
FD.poly = (cs, v = 'x', plain = false) => {
  const n = cs.length - 1;
  let s = '';
  cs.forEach((c, i) => {
    const p = n - i, a = Math.abs(c);
    if (!c) return;
    const body = (a === 1 && p ? '' : String(+a.toFixed(6))) + (p ? v + (p > 1 ? (plain ? `^${p}` : `^{${p}}`) : '') : '');
    s += s ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body;
  });
  return s || '0';
};
// " + 3" / " - 3": a signed number to put after another term.
FD.sg = (n) => (n < 0 ? ` - ${-n}` : ` + ${n}`);
// Tests in a part that mixes tiers: Q items on Higher-only sections and LONG items with h: true are left out
// for Foundation students. Keep them at the end of their lists so saved answers still line up.
FD.tierTest = (cfg) => FD.test({ ...cfg, Q: cfg.Q.filter((q) => FD.inTier(FD.section(q[4]))), LONG: cfg.LONG.filter((l) => FD.tier === 'H' || !l.h) });
// ---- end of kit ----

// ---- Vector helpers (shared by the vectors scenes) ----
// FD.cv(x, y): a column vector in TeX. FD.vecG(api, label): a square grid without axes (x 0–12, y 0–8).
// FD.vArrow(g, x1, y1, x2, y2, cls, label): SVG for an arrow with a head and an optional bold label beside it.
// g only needs g.ax.X / g.ax.Y, so a plain pixel diagram can pass { ax: { X: (x) => x, Y: (y) => y } }.
FD.cv = (x, y) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;
FD.vecG = (a, label) => {
  const g = FD.graph(a.$('[data-k="g"]'), { w: 480, h: 340, x: [0, 12], y: [0, 8], step: 1, pad: 20, labels: false, label });
  g.svg.classList.add('vg');
  return g;
};
FD.vArrow = (g, x1, y1, x2, y2, cls = '', label = '') => {
  const X1 = g.ax.X(x1), Y1 = g.ax.Y(y1), X2 = g.ax.X(x2), Y2 = g.ax.Y(y2), L = Math.hypot(X2 - X1, Y2 - Y1);
  if (L < 1) return '';
  const ux = (X2 - X1) / L, uy = (Y2 - Y1) / L, h = Math.min(15, L * 0.45), bx = X2 - ux * h, by = Y2 - uy * h;
  const head = `${X2},${Y2} ${bx - uy * h * 0.5},${by + ux * h * 0.5} ${bx + uy * h * 0.5},${by - ux * h * 0.5}`;
  const lx = (X1 + X2) / 2 + uy * 16, ly = (Y1 + Y2) / 2 - ux * 16;
  return `<g class="vec ${cls}"><line x1="${X1}" y1="${Y1}" x2="${bx}" y2="${by}"/><polygon points="${head}"/>${label ? `<text x="${lx}" y="${ly + 5}">${label}</text>` : ''}</g>`;
};
FD.mn = (n) => String(n).replace('-', '−');
// ---- end of vector helpers ----

FD.add({
  id: 'notation',
  title: 'Vectors and column vectors',
  tab: 'Notation',
  icon: 'vector',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Vector', 'A quantity with a size (magnitude) <b>and</b> a direction, drawn as an arrow. Velocity and force are vectors.'],
    ['Scalar', 'A quantity with a size only, such as mass, time or speed.'],
    ['Column vector', '\\(\\begin{pmatrix} x \\\\ y \\end{pmatrix}\\): \\(x\\) across (right is positive) and \\(y\\) up (up is positive).'],
    ['Notation', 'A vector is written \\(\\mathbf{a}\\) in print, \\(\\underline{a}\\) by hand, or \\(\\overrightarrow{AB}\\) for the arrow from \\(A\\) to \\(B\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 've-n', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Across \\(x\\) <input type="range" data-k="x" min="-5" max="5" value="4"><output data-k="ox">4</output></label>
        <label class="ctrl">Up \\(y\\) <input type="range" data-k="y" min="-4" max="4" value="3"><output data-k="oy">3</output></label>`,
    });
    const g = FD.vecG(a, 'Vectors drawn as arrows on a grid');
    a.g = g;
    // the vector (x, y) from (x0, y0), with its "across" and "up" parts dashed
    a.parts = (x0, y0, x, y) => g.line(x0, y0, x0 + x, y0, 'g-line') + g.line(x0 + x, y0, x0 + x, y0 + y, 'g-line');
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value;
      a.$('[data-k="ox"]').textContent = FD.mn(x); a.$('[data-k="oy"]').textContent = FD.mn(y);
      const x0 = 6 - x / 2, y0 = 4 - y / 2;
      g.draw(a.parts(x0, y0, x, y) + FD.vArrow(g, x0, y0, x0 + x, y0 + y, 'v1', 'v'));
      a.big(`\\mathbf{v} = ${FD.cv(x, y)}`);
      const across = x ? `${Math.abs(x)} ${x > 0 ? 'right' : 'left'}` : 'no move across', up = y ? `${Math.abs(y)} ${y > 0 ? 'up' : 'down'}` : 'no move up or down';
      a.msg(x || y ? `${across}, ${up}.` : 'The zero vector: no movement at all.');
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    g.draw(FD.vArrow(g, 2, 2, 6, 5, 'v1', 'a'));
    return a;
  },
  steps: [
    {
      title: 'Size and direction',
      text: '<p>A <b>vector</b> tells you how far <b>and</b> which way. “5 km” is a distance (a scalar). “5 km north-east” is a vector.</p><p>We draw a vector as an arrow: its length is the size, the arrowhead shows the direction.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(''); a.msg('');
        for (let t = 0.1; t <= 1.001; t += 0.1) { a.g.draw(FD.vArrow(a.g, 2, 2, 2 + 4 * t, 2 + 3 * t, 'v1', t > 0.9 ? 'a' : '')); if (!(await ctx.sleep(90))) return; }
      },
    },
    {
      title: 'Column vectors',
      text: '<p>A <b>column vector</b> gives the movement in two parts: the top number is <b>across</b>, the bottom number is <b>up</b>.</p><p>This arrow goes 4 right and 3 up, so \\(\\mathbf{a} = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}\\).</p>',
      tip: 'Left and down are negative, just like coordinates.',
      async on(a) { a.tryMode(false); a.g.draw(a.parts(2, 2, 4, 3) + FD.vArrow(a.g, 2, 2, 6, 5, 'v1', 'a'), a.g.lbl(3.6, 1.6, '4 across') + a.g.lbl(6.1, 3.6, '3 up')); a.big(`\\mathbf{a} = ${FD.cv(4, 3)}`); a.msg(''); },
    },
    {
      title: 'Ways of writing a vector',
      text: '<p>In print a vector is <b>bold</b>: \\(\\mathbf{a}\\). By hand, underline it: \\(\\underline{a}\\).</p><p>The vector from point \\(A\\) to point \\(B\\) is written \\(\\overrightarrow{AB}\\). To find it, subtract the coordinates: \\(B - A\\).</p>',
      async on(a) {
        a.tryMode(false);
        a.g.draw(FD.vArrow(a.g, 2, 2, 6, 5, 'v1'), a.g.pt(2, 2) + a.g.pt(6, 5) + a.g.lbl(2, 2, 'A (2, 2)') + a.g.lbl(6, 5, 'B (6, 5)'));
        a.big(`\\overrightarrow{AB} = ${FD.cv('6 - 2', '5 - 2')} = ${FD.cv(4, 3)}`); a.msg('');
      },
    },
    {
      title: 'Equal vectors',
      text: '<p>Vectors are <b>equal</b> when they have the same size and the same direction. Where they start does not matter.</p><p>All three arrows here are \\(\\mathbf{a} = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(`\\mathbf{a} = ${FD.cv(4, 3)}`); a.msg('');
        const at = [[1, 1], [6, 1], [3, 4]];
        for (let n = 1; n <= 3; n++) { a.g.draw(at.slice(0, n).map(([x, y]) => FD.vArrow(a.g, x, y, x + 4, y + 3, 'v1', 'a')).join('')); if (!(await ctx.sleep(700))) return; }
      },
    },
    {
      title: 'The negative of a vector',
      text: '<p>\\(-\\mathbf{a}\\) has the same length as \\(\\mathbf{a}\\) but points the <b>opposite</b> way: change the sign of both numbers.</p><p>Going backwards along an arrow: \\(\\overrightarrow{BA} = -\\overrightarrow{AB}\\).</p>',
      async on(a) { a.tryMode(false); a.g.draw(FD.vArrow(a.g, 1, 2, 5, 5, 'v1', 'a') + FD.vArrow(a.g, 11, 6, 7, 3, 'v2', '−a')); a.big(`-\\mathbf{a} = ${FD.cv(-4, -3)}`); a.msg(''); },
    },
    {
      title: 'Try it: build a vector',
      text: '<p>Change the two numbers of the column vector and watch the arrow. Make it point left, then down.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'notation',
  gens: [
    () => {
      const x = FD.rndNZ(-6, 6), y = FD.rndNZ(-6, 6);
      return { type: 'num', q: `A vector moves ${Math.abs(x)} ${x > 0 ? 'right' : 'left'} and ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}. Write it as a column vector.`, a: [x, y], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(x, y)}\\)`, why: `Top: across (${x > 0 ? 'right is +' : 'left is −'}). Bottom: up or down (${y > 0 ? 'up is +' : 'down is −'}). So \\(${FD.cv(x, y)}\\).` };
    },
    () => {
      let x1, y1, x2, y2;
      do { x1 = FD.rnd(-5, 6); y1 = FD.rnd(-5, 6); x2 = FD.rnd(-5, 6); y2 = FD.rnd(-5, 6); } while (x1 === x2 || y1 === y2);
      const back = Math.random() < 0.35, dx = back ? x1 - x2 : x2 - x1, dy = back ? y1 - y2 : y2 - y1, v = back ? 'BA' : 'AB';
      return { type: 'num', q: `\\(A\\) is \\((${x1}, ${y1})\\) and \\(B\\) is \\((${x2}, ${y2})\\). Find \\(\\overrightarrow{${v}}\\) as a column vector.`, a: [dx, dy], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(dx, dy)}\\)`, why: `\\(\\overrightarrow{${v}}\\) = ${back ? 'A − B' : 'B − A'}: \\(${FD.cv(`${back ? x1 : x2} - (${back ? x2 : x1})`, `${back ? y1 : y2} - (${back ? y2 : y1})`)} = ${FD.cv(dx, dy)}\\).` };
    },
    () => {
      let x, y;
      do { x = FD.rndNZ(-7, 7); y = FD.rndNZ(-7, 7); } while (Math.abs(x) === Math.abs(y));
      return { type: 'mcq', q: `\\(\\mathbf{p} = ${FD.cv(x, y)}\\). Which vector is \\(-\\mathbf{p}\\)?`, opts: [`\\(${FD.cv(-x, -y)}\\)`, `\\(${FD.cv(-x, y)}\\)`, `\\(${FD.cv(x, -y)}\\)`, `\\(${FD.cv(y, x)}\\)`], why: `Change the sign of both numbers: \\(${FD.cv(-x, -y)}\\).` };
    },
    () => {
      const s = FD.pick([
        ['A wind of 20 km/h from the west', ['A speed of 20 km/h', 'A temperature of 20 °C', 'A time of 20 minutes']],
        ['A force of 8 newtons pulling downwards', ['A mass of 8 kg', 'A length of 8 m', 'An area of 8 m²']],
        ['A walk of 3 km due north', ['A distance of 3 km', 'A volume of 3 litres', 'A cost of £3']],
      ]);
      return { type: 'mcq', q: 'Which of these is a vector?', opts: [s[0], ...s[1]], why: `A vector has a size and a direction. Only “${s[0]}” gives a direction.` };
    },
  ],
});

FD.check({
  section: 'notation',
  items: [
    { type: 'tf', q: 'A vector has a size and a direction.', a: true, why: 'That is what makes it a vector rather than a scalar.' },
    { type: 'num', q: 'A vector goes 3 left and 5 up. Write it as a column vector.', a: [-3, 5], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(-3, 5)}\\)`, why: 'Left is negative, up is positive.' },
    { type: 'num', q: '\\(P\\) is \\((1, 4)\\) and \\(Q\\) is \\((6, -2)\\). Find \\(\\overrightarrow{PQ}\\).', a: [5, -6], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(5, -6)}\\)`, why: `\\(Q - P = ${FD.cv('6 - 1', '-2 - 4')} = ${FD.cv(5, -6)}\\).` },
    { type: 'mcq', q: `\\(\\overrightarrow{AB} = ${FD.cv(2, -7)}\\). What is \\(\\overrightarrow{BA}\\)?`, opts: [`\\(${FD.cv(-2, 7)}\\)`, `\\(${FD.cv(2, 7)}\\)`, `\\(${FD.cv(-7, 2)}\\)`, `\\(${FD.cv(2, -7)}\\)`], why: 'Going back the other way: \\(\\overrightarrow{BA} = -\\overrightarrow{AB}\\).' },
    { type: 'tf', q: 'Two arrows with the same length and direction but different starting points are equal vectors.', a: true, why: 'The position does not matter for a vector.' },
  ],
});
