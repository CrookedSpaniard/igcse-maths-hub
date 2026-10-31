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

// Tables of values and plotting: points appear one by one, then the curve through them.
const cuTable = (xs, f) => `<table class="cu-tab"><tr><th>\\(x\\)</th>${xs.map((x) => `<td>${String(x).replace('-', '−')}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${xs.map((x) => `<td>${String(FD.round(f(x), 2)).replace('-', '−')}</td>`).join('')}</tr></table>`;

FD.add({
  id: 'plotting',
  title: 'Tables of values and plotting',
  tab: 'Plotting',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Table of values', 'A table of \\(x\\) values and the \\(y\\) values that the equation gives.'],
    ['Quadratic graph', 'The graph of \\(y = ax^2 + bx + c\\): a smooth U- or ∩-shaped curve called a parabola.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'cu-p', side: true,
      vis: '<div data-k="g"></div><div class="cu-tabh" data-k="tab"></div>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-2" max="2" step="0.5" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(b\\) <input type="range" data-k="b" min="-4" max="4" value="-2"><output data-k="ob">−2</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-5" max="5" value="-3"><output data-k="oc">−3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 360, x: [-3, 4], y: [-6, 10], step: 1, ystep: 2, label: 'Plotting a graph from a table of values' });
    const xs = [-2, -1, 0, 1, 2, 3, 4];
    a.plot = (f, upto = 99, curve = true) => {
      const shown = xs.slice(0, upto);
      g.draw(curve ? g.curve(f, '', -2, 4) : '', shown.map((x) => g.pt(x, f(x), 'hot')).join(''));
      a.$('[data-k="tab"]').innerHTML = cuTable(xs, f); FD.typeset(a.$('[data-k="tab"]'));
    };
    const sync = () => {
      const [A, B, C] = ['a', 'b', 'c'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['a', 'b', 'c'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([A, B, C][i]).replace('-', '−'); });
      a.plot((x) => A * x * x + B * x + C);
      a.big(`y = ${FD.poly([A, B, C])}`);
      a.msg(A === 0 ? 'With \\(a = 0\\) there is no \\(x^2\\) term: the graph is a straight line.' : A > 0 ? 'Positive \\(x^2\\) term: a ∪ shape.' : 'Negative \\(x^2\\) term: a ∩ shape.');
    };
    ['a', 'b', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.plot((x) => x * x - 2 * x - 3, 0, false);
    return a;
  },
  steps: [
    {
      title: 'Make a table of values',
      text: '<p>For \\(y = x^2 - 2x - 3\\), substitute each \\(x\\). Take care with negatives: when \\(x = -2\\), \\(y = (-2)^2 - 2(-2) - 3 = 4 + 4 - 3 = 5\\).</p>',
      tip: 'Square negative numbers in brackets: \\((-2)^2 = 4\\).',
      async on(a, ctx) { a.tryMode(false); a.big('y = x^2 - 2x - 3'); for (let k = 0; k <= 7; k++) { a.plot((x) => x * x - 2 * x - 3, k, false); if (!(await ctx.sleep(600))) return; } },
    },
    {
      title: 'Join with a smooth curve',
      text: '<p>Plot the points and join them with a <b>smooth curve</b>, not straight lines. The bottom of the curve is rounded, even between two points.</p>',
      async on(a) { a.tryMode(false); a.plot((x) => x * x - 2 * x - 3); a.big('y = x^2 - 2x - 3'); },
    },
    {
      title: 'Straight lines too',
      text: '<p>A linear equation like \\(y = 2x - 1\\) gives points in a <b>straight line</b>. Three points are enough; use a ruler.</p>',
      async on(a) { a.tryMode(false); a.plot((x) => 2 * x - 1); a.big('y = 2x - 1'); },
    },
    {
      title: 'Try it: build a graph',
      text: '<p>Change \\(a\\), \\(b\\) and \\(c\\) in \\(y = ax^2 + bx + c\\). Watch the table and the curve change.</p>',
      tip: 'Set \\(a = 0\\): what happens?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'plotting',
  gens: [
    () => { const b = FD.rnd(-4, 4), c = FD.rnd(-6, 6), x = FD.rnd(-3, 3); return { type: 'num', q: `\\(y = ${FD.poly([1, b, c])}\\). Find the value of \\(y\\) when \\(x = ${x}\\).`, a: x * x + b * x + c, why: `\\((${x})^2 ${b ? `${FD.sg(b)}(${x})` : ''} ${c ? FD.sg(c) : ''} = ${x * x} ${b ? FD.sg(b * x) : ''} ${c ? FD.sg(c) : ''} = ${x * x + b * x + c}\\).` }; },
    () => { const m = FD.rndNZ(-3, 3), c = FD.rnd(-4, 4), x = FD.rnd(-3, 3); return { type: 'num', q: `Complete the table for \\(y = ${FD.poly([m, c])}\\): what is \\(y\\) when \\(x = ${x}\\)?`, a: m * x + c, why: `\\(${m}(${x}) ${FD.sg(c)} = ${m * x + c}\\).` }; },
  ],
});

FD.check({
  section: 'plotting',
  items: [
    { type: 'num', q: '\\(y = x^2 + 3x\\). Find \\(y\\) when \\(x = -4\\).', a: 4, why: '\\(16 - 12\\).' },
    { type: 'num', q: '\\(y = 2x^2 - 5\\). Find \\(y\\) when \\(x = -3\\).', a: 13, why: '\\(18 - 5\\).' },
    { type: 'mcq', q: 'The points of \\(y = x^2 - 4\\) should be joined with…', opts: ['a smooth curve', 'straight lines with a ruler', 'a single straight line', 'nothing'], why: 'Quadratic graphs are smooth curves.' },
    { type: 'tf', q: 'The graph of \\(y = 3x + 2\\) is a curve.', a: false, why: 'It is linear: a straight line.' },
  ],
});
