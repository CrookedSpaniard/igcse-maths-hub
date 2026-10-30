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

// y = kx: a slider for k, the graph through the origin and a table of values.
const prTable = (xs, f, xl = 'x', yl = 'y') => `<table class="pr-tab"><tr><th>\\(${xl}\\)</th>${xs.map((x) => `<td>${FD.num(x)}</td>`).join('')}</tr><tr><th>\\(${yl}\\)</th>${xs.map((x) => `<td>${FD.num(FD.round(f(x), 2))}</td>`).join('')}</tr></table>`;

FD.add({
  id: 'direct',
  title: 'Direct proportion: y = kx',
  tab: 'y ∝ x',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Directly proportional', '\\(y \\propto x\\): when \\(x\\) is multiplied by a number, \\(y\\) is multiplied by the same number.'],
    ['Constant of proportionality', 'The number \\(k\\) in \\(y = kx\\). It never changes.'],
    ['\\(\\propto\\)', 'The symbol for “is proportional to”.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'pr-d', side: true,
      vis: '<div data-k="g"></div><div class="pr-tabh" data-k="tab"></div>',
      tryHtml: '<label class="ctrl">\\(k\\) <input type="range" data-k="k" min="0.5" max="6" step="0.5" value="2.5"><output data-k="ok">2.5</output></label>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 420, h: 320, x: [0, 10], y: [0, 40], step: 1, ystep: 5, label: 'Graph of y = kx' });
    a.show = (k, pts = []) => {
      g.draw(g.curve((x) => k * x), pts.map(([x, y]) => g.pt(x, y, 'hot')).join('') + g.lbl(9, Math.min(38, k * 9), `y = ${k}x`));
      a.$('[data-k="tab"]').innerHTML = prTable([1, 2, 4, 8], (x) => k * x); FD.typeset(a.$('[data-k="tab"]'));
    };
    const sync = () => { const k = +a.$('[data-k="k"]').value; a.$('[data-k="ok"]').textContent = k; a.show(k); a.big(`y = ${k}x`); a.msg('Double \\(x\\) and \\(y\\) doubles. The line always goes through \\((0, 0)\\).'); };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    a.show(3);
    return a;
  },
  steps: [
    {
      title: 'What direct proportion means',
      text: '<p>Petrol costs £1.50 a litre. Twice as many litres cost twice as much; 10 times as many cost 10 times as much.</p><p>The cost \\(C\\) is <b>directly proportional</b> to the litres \\(L\\): \\(C \\propto L\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); a.show(3); for (const x of [2, 4, 8]) { a.show(3, [[x, 3 * x]]); if (!(await ctx.sleep(900))) return; } a.big('y = 3x'); },
    },
    {
      title: 'Write it as a formula',
      text: '<p>\\(y \\propto x\\) becomes \\(y = kx\\). The graph is a straight line through the origin with gradient \\(k\\).</p>',
      tip: 'The ∝ sign is always replaced by “= k ×”.',
      async on(a) { a.tryMode(false); a.show(3); a.big('y \\propto x \\;\\Rightarrow\\; y = kx'); },
    },
    {
      title: 'Find k, then use it',
      text: '<p>\\(y\\) is directly proportional to \\(x\\). When \\(x = 4\\), \\(y = 14\\). Find \\(y\\) when \\(x = 10\\).</p>',
      on: FD.walk([['y = kx', 'write the formula'], ['14 = k \\times 4 \\Rightarrow k = 3.5', 'substitute the pair you know'], ['y = 3.5x', 'write the formula with k'], ['x = 10: \\; y = 3.5 \\times 10 = 35', 'use it']], (a) => { a.show(3.5, [[4, 14], [10, 35]]); a.big(''); }, 1500),
    },
    {
      title: 'Try it: change k',
      text: '<p>Move the slider for \\(k\\). Watch the line get steeper. Look at the table: when \\(x\\) doubles, so does \\(y\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'direct',
  gens: [
    () => { const k = FD.pick([1.5, 2, 2.5, 3, 4, 5, 6, 7, 12]), x1 = FD.rnd(2, 8), x2 = FD.rnd(3, 15); return { type: 'num', q: `\\(y\\) is directly proportional to \\(x\\). When \\(x = ${x1}\\), \\(y = ${FD.num(k * x1)}\\). Find \\(y\\) when \\(x = ${x2}\\).`, a: k * x2, why: `\\(y = kx\\): \\(${FD.num(k * x1)} = ${x1}k\\), so \\(k = ${k}\\). Then \\(y = ${k} \\times ${x2} = ${FD.num(k * x2)}\\).` }; },
    () => { const k = FD.pick([2, 3, 4, 5, 8]), x1 = FD.rnd(2, 6), y2 = k * FD.rnd(3, 12); return { type: 'num', q: `\\(P \\propto t\\). When \\(t = ${x1}\\), \\(P = ${k * x1}\\). Find \\(t\\) when \\(P = ${y2}\\).`, a: y2 / k, why: `\\(P = kt\\), \\(k = ${k * x1} \\div ${x1} = ${k}\\). So \\(${y2} = ${k}t\\) and \\(t = ${y2 / k}\\).` }; },
  ],
});

FD.check({
  section: 'direct',
  items: [
    { type: 'num', q: '\\(y \\propto x\\) and \\(y = 24\\) when \\(x = 6\\). Find \\(k\\).', a: 4, why: '\\(24 = 6k\\).' },
    { type: 'num', q: '\\(y = 4x\\). Find \\(y\\) when \\(x = 7.5\\).', a: 30, why: '\\(4 \\times 7.5\\).' },
    { type: 'mcq', q: 'Which graph shows \\(y \\propto x\\)?', opts: ['A straight line through the origin', 'A straight line that does not pass through the origin', 'A curve that goes down', 'A horizontal line'], why: '\\(y = kx\\) is a straight line through \\((0, 0)\\).' },
    { type: 'tf', q: 'If \\(y \\propto x\\) and \\(x\\) is tripled, then \\(y\\) is tripled.', a: true, why: '\\(k(3x) = 3(kx)\\).' },
  ],
});
