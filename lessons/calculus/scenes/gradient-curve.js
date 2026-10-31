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

// A tangent sliding along y = f(x); its gradient is shown and plotted as a second graph (the gradient function).
// FD.tangent(g, f, df, x, len) — SVG for the tangent line at x, of half-length len along x.
FD.tangent = (g, f, df, x, len = 1.5) => g.line(x - len, f(x) - len * df(x), x + len, f(x) + len * df(x), 'ca-tan') + g.pt(x, f(x), 'hot');
const CA_F = (x) => x * x - 2 * x - 2, CA_D = (x) => 2 * x - 2;

FD.add({
  id: 'gradient-curve',
  title: 'The gradient of a curve',
  tab: 'Gradient of a curve',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Tangent', 'A straight line that just touches the curve at one point, going the same way as the curve there.'],
    ['Gradient of a curve', 'The gradient of the tangent at that point. It changes from point to point.'],
    ['Rate of change', 'How fast \\(y\\) changes as \\(x\\) changes: the gradient.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ca-g', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<label class="ctrl">\\(x\\) <input type="range" data-k="x" min="-2" max="4" step="0.25" value="2.5"><output data-k="ox">2.5</output></label>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-3, 5], y: [-5, 9], step: 1, ystep: 2, label: 'A curve with a tangent' });
    a.at = (x, chord) => {
      const ch = chord ? g.line(x, CA_F(x), x + chord, CA_F(x + chord), 'ca-chord') + g.pt(x + chord, CA_F(x + chord)) : '';
      g.draw(g.curve(CA_F) + (chord ? '' : FD.tangent(g, CA_F, CA_D, x)) + ch, chord ? g.pt(x, CA_F(x), 'hot') : '');
    };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = String(x).replace('-', '−');
      a.at(x);
      a.big(`\\text{gradient at } x = ${x}: \\; ${FD.num(CA_D(x))}`);
      a.msg(CA_D(x) > 0 ? 'Positive: the curve is going up here.' : CA_D(x) < 0 ? 'Negative: the curve is going down here.' : 'Zero: the tangent is flat. This is the turning point.');
    };
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    a.at(2.5);
    return a;
  },
  steps: [
    {
      title: 'The steepness changes',
      text: '<p>On \\(y = x^2 - 2x - 2\\) the curve goes down, flattens out, then goes up more and more steeply. The <b>rate of change</b> is not constant.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let x = -2; x <= 4; x += 0.5) { a.at(x); a.msg(`At \\(x = ${x}\\) the gradient is ${FD.num(CA_D(x))}.`); if (!(await ctx.sleep(450))) return; } },
    },
    {
      title: 'Gradient = gradient of the tangent',
      text: '<p>To measure the gradient at a point, draw the <b>tangent</b> there and find its gradient (rise over run).</p><p>At \\(x = 3\\), the tangent has gradient 4.</p>',
      tip: 'Without calculus you can estimate it: draw the tangent carefully with a ruler.',
      async on(a) { a.tryMode(false); a.at(3); a.big('\\text{gradient at } x = 3: \\; 4'); a.msg(''); },
    },
    {
      title: 'Chords get closer to the tangent',
      text: '<p>A <b>chord</b> joins two points on the curve. As the second point moves closer, the gradient of the chord gets closer to the gradient of the tangent.</p>',
      async on(a, ctx) { a.tryMode(false); for (const h of [2, 1, 0.5, 0.2, 0.05]) { a.at(3, h); a.big(`\\text{chord gradient} = ${FD.num(FD.round((CA_F(3 + h) - CA_F(3)) / h, 3))}`); if (!(await ctx.sleep(900))) return; } a.at(3); a.big('\\to 4'); },
    },
    {
      title: 'Try it: slide the tangent',
      text: '<p>Move the point along the curve. Where is the gradient positive, negative and zero?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'gradient-curve',
  gens: [
    () => { const x1 = FD.rnd(-2, 3), run = FD.rnd(1, 3), rise = FD.rndNZ(-6, 8); return { type: 'num', q: `A tangent to a curve at \\(x = ${x1}\\) passes through two points that are ${run} across and ${Math.abs(rise)} ${rise > 0 ? 'up' : 'down'} from each other. Estimate the gradient of the curve at \\(x = ${x1}\\).`, a: rise / run, tol: 0.01, show: `\\(${FD.ftex(rise, run)}\\)`, hint: 'A fraction is fine.', why: `Gradient of the tangent \\(= \\dfrac{${rise}}{${run}} = ${FD.ftex(rise, run)}\\).` }; },
    () => { const k = FD.rnd(0, 2), d = ['positive', 'zero', 'negative'][k]; return { type: 'mcq', q: `At a point where a curve is ${['going up', 'at its lowest point', 'going down'][k]}, the gradient is…`, opts: [d, ...['positive', 'zero', 'negative'].filter((x) => x !== d), 'undefined'], why: `${['Going up: positive', 'At a turning point the tangent is flat: zero', 'Going down: negative'][k]}.` }; },
  ],
});

FD.check({
  section: 'gradient-curve',
  items: [
    { type: 'mcq', q: 'The gradient of a curve at a point is the gradient of…', opts: ['the tangent at that point', 'the line through the origin', 'the \\(x\\)-axis', 'the chord to the origin'], why: 'The tangent goes the same way as the curve there.' },
    { type: 'tf', q: 'The gradient of \\(y = x^2\\) is the same at every point.', a: false, why: 'It changes: the curve gets steeper.' },
    { type: 'num', q: 'A tangent passes through \\((1, 2)\\) and \\((3, 8)\\). What is its gradient?', a: 3, why: '\\(\\frac{6}{2}\\).' },
  ],
});
