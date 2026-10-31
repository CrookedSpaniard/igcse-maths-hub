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

// Intersections: the curve y = x² − 2x − 1 and a line y = mx + c. The x-values where they cross
// solve x² − 2x − 1 = mx + c, i.e. x² − (2 + m)x − (1 + c) = 0.
const gsRoots = (A, B, C) => { const D = B * B - 4 * A * C; return D < 0 ? [] : D === 0 ? [-B / (2 * A)] : [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)]; };

FD.add({
  id: 'intersections',
  title: 'Intersections of a line and a curve',
  tab: 'Intersections',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Point of intersection', 'A point where two graphs cross. Its \\(x\\)-coordinate solves \\(y_1 = y_2\\).'],
    ['\\(y_2 - y_1 = 0\\)', 'Where two graphs meet, the difference between them is zero.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'gs-i', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<p class="ab-ask">Curve \\(y = x^2 - 2x - 1\\); line \\(y = mx + c\\)</p>
        <label class="ctrl">\\(m\\) <input type="range" data-k="m" min="-3" max="3" step="0.5" value="1"><output data-k="om">1</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-5" max="5" value="1"><output data-k="oc">1</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-3, 5], y: [-4, 10], step: 1, ystep: 2, label: 'A curve and a straight line' });
    const f = (x) => x * x - 2 * x - 1;
    a.cross = (m, c, diff = false) => {
      const xs = gsRoots(1, -(2 + m), -(1 + c));
      g.draw(g.curve(f) + g.curve((x) => m * x + c, 'c2') + (diff ? g.curve((x) => f(x) - (m * x + c), 'gs-diff') : ''), xs.map((x) => g.pt(x, m * x + c, 'hot') + g.line(x, m * x + c, x, 0, 'g-line')).join('') + (diff ? xs.map((x) => g.pt(x, 0)).join('') : ''));
      return xs;
    };
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, c = +a.$('[data-k="c"]').value;
      a.$('[data-k="om"]').textContent = String(m).replace('-', '−'); a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      const xs = a.cross(m, c);
      a.big(`x^2 - 2x - 1 = ${FD.poly([m, c])}`);
      a.msg(xs.length ? `Solutions: \\(x \\approx ${xs.map((x) => FD.round(x, 2)).join('\\) and \\(x \\approx ')}\\).` : 'The line misses the curve: no real solutions.', xs.length ? 'good' : 'bad');
    };
    ['m', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.cross(1, 1);
    return a;
  },
  steps: [
    {
      title: 'Read the crossing points',
      text: '<p>The curve \\(y = x^2 - 2x - 1\\) and the line \\(y = x + 1\\) cross twice. At each crossing both \\(y\\) values are equal, so the \\(x\\)-values solve \\(x^2 - 2x - 1 = x + 1\\).</p>',
      async on(a) { a.tryMode(false); a.cross(1, 1); a.big('x \\approx -0.56 \\;\\text{ or }\\; x \\approx 3.56'); },
    },
    {
      title: 'The same as y₂ − y₁ = 0',
      text: '<p>Subtract: \\(x^2 - 2x - 1 - (x + 1) = x^2 - 3x - 2\\). The roots of this new curve (dashed) are exactly the same \\(x\\)-values.</p>',
      tip: 'Graphs give estimates. Read to the nearest small square.',
      async on(a, ctx) { a.tryMode(false); a.cross(1, 1); a.big('x^2 - 3x - 2 = 0'); if (!(await ctx.sleep(1000))) return; a.cross(1, 1, true); },
    },
    {
      title: 'Try it: move the line',
      text: '<p>Move the line. When it crosses twice there are two solutions; when it just touches there is one; when it misses there are none.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'intersections',
  gens: [
    () => { let p, q; do { p = FD.rnd(-3, 2); q = FD.rnd(-1, 5); } while (p >= q); const m = p + q - 2, c = -1 - p * q; return { type: 'num', q: `The curve \\(y = x^2 - 2x - 1\\) and the line \\(y = ${FD.poly([m, c])}\\) cross. Find the \\(x\\)-coordinates of the crossing points.`, a: [p, q], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: `\\(x^2 - 2x - 1 = ${FD.poly([m, c])}\\) gives \\(${FD.poly([1, -(m + 2), -(1 + c)])} = 0\\), so \\((x ${FD.sg(-p)})(x ${FD.sg(-q)}) = 0\\): \\(x = ${p}\\) or \\(x = ${q}\\).` }; },
  ],
});

FD.check({
  section: 'intersections',
  items: [
    { type: 'num', q: 'Find the \\(x\\)-coordinates where \\(y = x^2\\) meets \\(y = 2x + 3\\).', a: [3, -1], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: '\\(x^2 - 2x - 3 = (x - 3)(x + 1) = 0\\).' },
    { type: 'mcq', q: 'The graphs of \\(y = f(x)\\) and \\(y = g(x)\\) cross at \\(x = 1.4\\) and \\(x = -2.1\\). These solve…', opts: ['\\(f(x) - g(x) = 0\\)', '\\(f(x) = 0\\)', '\\(g(x) = 0\\)', '\\(f(x) + g(x) = 0\\)'], why: 'At a crossing, \\(f(x) = g(x)\\).' },
    { type: 'tf', q: 'If a line misses a curve completely, the equation formed by setting them equal has no real solutions.', a: true, why: 'There is no \\(x\\) where they are equal.' },
  ],
});
