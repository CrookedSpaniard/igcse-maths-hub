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

// Coordinates in four quadrants: walk along x, then up/down y. Missing vertex of a shape.
const slPt = (x, y) => `(${String(x).replace('-', '−')}, ${String(y).replace('-', '−')})`;

FD.add({
  id: 'coordinates',
  title: 'Coordinates in four quadrants',
  tab: 'Coordinates',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Coordinates \\((x, y)\\)', 'The \\(x\\)-coordinate (across) comes first, then the \\(y\\)-coordinate (up or down).'],
    ['Origin', 'The point \\((0, 0)\\) where the axes cross.'],
    ['Quadrant', 'One of the four parts the axes split the grid into.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-c', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(x\\) <input type="range" data-k="x" min="-6" max="6" value="3"><output data-k="ox">3</output></label>
        <label class="ctrl">\\(y\\) <input type="range" data-k="y" min="-6" max="6" value="-2"><output data-k="oy">−2</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'Coordinate grid' });
    a.g = g;
    // walk from the origin: along to x, then up/down to y
    a.walk = (x, y, stage = 2, more = '') => {
      const path = stage >= 1 ? g.line(0, 0, x, 0, 'sl-walk') : '';
      const up = stage >= 2 ? g.line(x, 0, x, y, 'sl-walk') : '';
      g.draw(path + up + more, (stage >= 2 ? g.pt(x, y, 'hot') + g.lbl(x, y, slPt(x, y)) : '') + g.pt(0, 0));
    };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value;
      a.$('[data-k="ox"]').textContent = String(x).replace('-', '−'); a.$('[data-k="oy"]').textContent = String(y).replace('-', '−');
      a.walk(x, y);
      const q = !x || !y ? 'on an axis' : `in the ${x > 0 ? (y > 0 ? 'top-right' : 'bottom-right') : y > 0 ? 'top-left' : 'bottom-left'} quadrant`;
      a.big(slPt(x, y)); a.msg(`${x >= 0 ? 'Right' : 'Left'} ${Math.abs(x)}, then ${y >= 0 ? 'up' : 'down'} ${Math.abs(y)}: ${q}.`);
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.walk(3, -2, 0);
    return a;
  },
  steps: [
    {
      title: 'Along, then up or down',
      text: '<p>To plot \\((3, -2)\\), start at the origin. Go <b>along</b> 3 (the \\(x\\)-coordinate), then <b>down</b> 2 (the \\(y\\)-coordinate is negative).</p>',
      tip: '“Along the corridor, then up the stairs”: \\(x\\) always comes first.',
      async on(a, ctx) { a.tryMode(false); a.big('(3, -2)'); for (const s of [0, 1, 2]) { a.walk(3, -2, s); if (!(await ctx.sleep(1000))) return; } },
    },
    {
      title: 'Four quadrants',
      text: '<p>Negative \\(x\\) is to the left of the \\(y\\)-axis. Negative \\(y\\) is below the \\(x\\)-axis. Points can be in any of the four quadrants.</p>',
      async on(a, ctx) { a.tryMode(false); for (const [x, y] of [[4, 2], [-3, 5], [-5, -1], [2, -4]]) { a.walk(x, y); a.big(slPt(x, y)); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Coordinates from a shape',
      text: '<p>\\(A(-2, 1)\\), \\(B(3, 1)\\) and \\(C(3, -3)\\) are three corners of a rectangle \\(ABCD\\). The fourth corner \\(D\\) has the same \\(x\\) as \\(A\\) and the same \\(y\\) as \\(C\\): \\(D(-2, -3)\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('');
        const sh = (n) => `<path class="sl-shape" d="M${a.g.ax.X(-2)} ${a.g.ax.Y(1)}L${a.g.ax.X(3)} ${a.g.ax.Y(1)}L${a.g.ax.X(3)} ${a.g.ax.Y(-3)}${n > 3 ? `L${a.g.ax.X(-2)} ${a.g.ax.Y(-3)}Z` : ''}"/>`;
        a.g.draw(sh(3), a.g.pt(-2, 1) + a.g.pt(3, 1) + a.g.pt(3, -3) + a.g.lbl(-2, 1, 'A') + a.g.lbl(3, 1, 'B') + a.g.lbl(3, -3, 'C'));
        if (!(await ctx.sleep(1500))) return;
        a.g.draw(sh(4), a.g.pt(-2, 1) + a.g.pt(3, 1) + a.g.pt(3, -3) + a.g.pt(-2, -3, 'hot') + a.g.lbl(-2, 1, 'A') + a.g.lbl(3, 1, 'B') + a.g.lbl(3, -3, 'C') + a.g.lbl(-2, -3, 'D(−2, −3)'));
      },
    },
    {
      title: 'Try it: plot a point',
      text: '<p>Move the sliders. Watch the path from the origin: along first, then up or down.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'coordinates',
  gens: [
    () => { const x = FD.rndNZ(-6, 6), y = FD.rndNZ(-6, 6); return { type: 'mcq', q: `Which description takes you from the origin to \\(${slPt(x, y)}\\)?`, opts: [`${x > 0 ? 'right' : 'left'} ${Math.abs(x)}, ${y > 0 ? 'up' : 'down'} ${Math.abs(y)}`, `${y > 0 ? 'right' : 'left'} ${Math.abs(y)}, ${x > 0 ? 'up' : 'down'} ${Math.abs(x)}`, `${x > 0 ? 'left' : 'right'} ${Math.abs(x)}, ${y > 0 ? 'up' : 'down'} ${Math.abs(y)}`, `${x > 0 ? 'right' : 'left'} ${Math.abs(x)}, ${y > 0 ? 'down' : 'up'} ${Math.abs(y)}`].filter((o, i, s) => s.indexOf(o) === i).concat(['stay at the origin']).slice(0, 4), why: `The \\(x\\)-coordinate ${x} is along (${x > 0 ? 'right' : 'left'}); the \\(y\\)-coordinate ${y} is ${y > 0 ? 'up' : 'down'}.` }; },
    () => { const x1 = FD.rnd(-5, 0), x2 = x1 + FD.rnd(2, 5), y1 = FD.rnd(-5, 0), y2 = y1 + FD.rnd(2, 5); return { type: 'num', q: `\\(A${slPt(x1, y2)}\\), \\(B${slPt(x2, y2)}\\) and \\(C${slPt(x2, y1)}\\) are three corners of a rectangle \\(ABCD\\). Find the coordinates of \\(D\\).`, a: [x1, y1], fields: ['\\(x\\) =', '\\(y\\) ='], why: `\\(D\\) is below \\(A\\) (same \\(x\\) = ${x1}) and level with \\(C\\) (same \\(y\\) = ${y1}): \\(D${slPt(x1, y1)}\\).` }; },
  ],
});

FD.check({
  section: 'coordinates',
  items: [
    { type: 'mcq', q: 'Which point is 4 to the left of the origin and 1 up?', opts: ['\\((-4, 1)\\)', '\\((1, -4)\\)', '\\((4, -1)\\)', '\\((-1, 4)\\)'], why: '\\(x\\) first: −4; then \\(y\\): 1.' },
    { type: 'mcq', q: 'In which quadrant is \\((-3, -5)\\)?', opts: ['Bottom-left', 'Top-left', 'Bottom-right', 'Top-right'], why: 'Both coordinates are negative.' },
    { type: 'num', q: 'A square has corners \\((1, 1)\\), \\((4, 1)\\) and \\((4, 4)\\). Find the fourth corner.', a: [1, 4], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'Same \\(x\\) as \\((1, 1)\\), same \\(y\\) as \\((4, 4)\\).' },
    { type: 'tf', q: 'The point \\((0, -3)\\) is on the \\(x\\)-axis.', a: false, why: '\\(x = 0\\) means it is on the \\(y\\)-axis.' },
  ],
});
