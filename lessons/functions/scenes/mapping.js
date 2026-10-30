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

// A mapping diagram: inputs in one oval, outputs in the other, an arrow for each input.
// FD.mapping(host)(pairs, upto) — pairs = [[input, output], …].
FD.mapping = (host) => (pairs, upto = 99) => {
  const n = pairs.length, gap = Math.min(42, 200 / n), top = 125 - ((n - 1) * gap) / 2;
  const outs = [...new Set(pairs.map((p) => p[1]))];
  const yo = (v) => 125 - ((outs.length - 1) * gap) / 2 + outs.indexOf(v) * gap;
  host.innerHTML = `<svg class="map" viewBox="0 0 420 250" role="img" aria-label="Mapping diagram">
    <ellipse class="map-set" cx="90" cy="125" rx="62" ry="112"/><ellipse class="map-set" cx="330" cy="125" rx="62" ry="112"/>
    <text class="map-h" x="90" y="10">input</text><text class="map-h" x="330" y="10">output</text>
    ${pairs.map(([x], i) => `<text class="map-t" x="90" y="${top + i * gap + 6}">${String(FD.num(x)).replace('-', '−')}</text>`).join('')}
    ${outs.map((v) => `<text class="map-t" x="330" y="${yo(v) + 6}">${pairs.findIndex((p) => p[1] === v) < upto ? String(FD.num(v)).replace('-', '−') : ''}</text>`).join('')}
    ${pairs.slice(0, upto).map(([, y], i) => `<line class="map-a" x1="116" y1="${top + i * gap}" x2="300" y2="${yo(y)}" marker-end="url(#mapArr)"/>`).join('')}
    <defs><marker id="mapArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="map-arr"/></marker></defs>
  </svg>`;
};

FD.add({
  id: 'mapping',
  title: 'Functions and function notation',
  tab: 'Notation',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Function', 'A rule that maps every input to exactly <b>one</b> output.'],
    ['\\(f(x)\\)', 'The output of function \\(f\\) when the input is \\(x\\). \\(f(3)\\) means “put 3 in”.'],
    ['\\(f : x \\mapsto 2x + 3\\)', 'Another way to write \\(f(x) = 2x + 3\\): “\\(f\\) maps \\(x\\) to \\(2x + 3\\)”.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fn-m', side: true,
      vis: '<div class="map-host" data-k="m"></div>',
      tryHtml: `<label class="ctrl">\\(f(x) = mx + c\\): m <input type="range" data-k="m" min="-3" max="4" value="2"><output data-k="om">2</output></label>
        <label class="ctrl">c <input type="range" data-k="c" min="-5" max="5" value="3"><output data-k="oc">3</output></label>
        <div class="seg-row" data-k="sq"><button class="btn primary" data-s="0">\\(mx + c\\)</button><button class="btn" data-s="1">\\(x^2 + c\\)</button></div>`,
    });
    const M = FD.mapping(a.$('[data-k="m"]'));
    a.map = M;
    let sq = 0;
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, c = +a.$('[data-k="c"]').value;
      a.$('[data-k="om"]').textContent = String(m).replace('-', '−'); a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      const f = sq ? (x) => x * x + c : (x) => m * x + c;
      M([-2, -1, 0, 1, 2].map((x) => [x, f(x)]));
      a.big(`f(x) = ${sq ? FD.poly([1, 0, c]) : FD.poly([m, c])}`);
      a.msg(sq ? 'Two inputs can share an output (\\(f(-2) = f(2)\\)), but each input still has only one output: it is a function.' : 'Every input has exactly one arrow: it is a function.');
    };
    ['m', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.$('[data-k="sq"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; sq = +b.dataset.s; a.$('[data-k="sq"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.onTry = sync;
    M([[1, 5], [2, 7], [3, 9]], 0);
    return a;
  },
  steps: [
    {
      title: 'A rule from one set to another',
      text: '<p>The rule “double, then add 3” takes each input to one output: 1 → 5, 2 → 7, 3 → 9.</p><p>A rule like this, where every input has <b>exactly one</b> output, is a <b>function</b>.</p>',
      async on(a, ctx) { a.tryMode(false); a.big('x \\mapsto 2x + 3'); for (let k = 0; k <= 3; k++) { a.map([[1, 5], [2, 7], [3, 9]], k); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Function notation',
      text: '<p>We name the function \\(f\\) and write \\(f(x) = 2x + 3\\) or \\(f : x \\mapsto 2x + 3\\).</p><p>\\(f(4)\\) means the output when the input is 4: \\(f(4) = 2(4) + 3 = 11\\).</p>',
      tip: '\\(f(4)\\) does <b>not</b> mean \\(f \\times 4\\).',
      on: FD.walk([['f(x) = 2x + 3', ''], ['f(4) = 2(4) + 3 = 11', 'replace x by 4'], ['f(-1) = 2(-1) + 3 = 1', ''], ['f(a + 1) = 2(a + 1) + 3 = 2a + 5', 'any expression can go in']], (a) => { a.map([[4, 11], [-1, 1]]); a.big(''); }),
    },
    {
      title: 'Solving f(x) = a value',
      text: '<p>\\(f(x) = 17\\) asks which <b>input</b> gives the output 17. Solve \\(2x + 3 = 17\\): \\(x = 7\\).</p>',
      on: FD.walk([['f(x) = 17', ''], ['2x + 3 = 17', ''], ['x = 7', '']], (a) => { a.map([[7, 17]]); a.big(''); }),
    },
    {
      title: 'Try it: draw the mapping',
      text: '<p>Change the function. Watch the arrows. With \\(x^2 + c\\), two different inputs can give the same output, and it is still a function.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'mapping',
  gens: [
    () => { const m = FD.rndNZ(-5, 6), c = FD.rnd(-9, 9), x = FD.rnd(-6, 8); return { type: 'num', q: `\\(f(x) = ${FD.poly([m, c])}\\). Find \\(f(${x})\\).`, a: m * x + c, why: `\\(${m}(${x}) ${FD.sg(c)} = ${m * x + c}\\).` }; },
    () => { const p = FD.rnd(1, 3), c = FD.rnd(-6, 6), x = FD.rnd(-4, 4); return { type: 'num', q: `\\(g : x \\mapsto ${FD.poly([p, 0, c])}\\). Find \\(g(${x})\\).`, a: p * x * x + c, why: `\\(${p === 1 ? '' : p}(${x})^2 ${FD.sg(c)} = ${p * x * x + c}\\).` }; },
    () => { const m = FD.rnd(2, 7), c = FD.rndNZ(-9, 9), x = FD.rnd(-5, 9); return { type: 'num', q: `\\(h(x) = ${FD.poly([m, c])}\\). Solve \\(h(x) = ${m * x + c}\\).`, a: x, why: `\\(${FD.poly([m, c])} = ${m * x + c}\\), so \\(${m}x = ${m * x}\\) and \\(x = ${x}\\).` }; },
  ],
});

FD.check({
  section: 'mapping',
  items: [
    { type: 'num', q: '\\(f(x) = 5 - 3x\\). Find \\(f(-2)\\).', a: 11, why: '\\(5 - 3(-2) = 5 + 6\\).' },
    { type: 'num', q: '\\(f(x) = x^2 + 2x\\). Find \\(f(3)\\).', a: 15, why: '\\(9 + 6\\).' },
    { type: 'num', q: '\\(f(x) = 4x - 1\\). Solve \\(f(x) = 23\\).', a: 6, why: '\\(4x = 24\\).' },
    { type: 'mcq', q: '\\(f : x \\mapsto 3x^2\\). What is \\(f(2a)\\)?', opts: ['\\(12a^2\\)', '\\(6a^2\\)', '\\(6a\\)', '\\(36a^2\\)'], why: '\\(3(2a)^2 = 3 \\times 4a^2\\).' },
  ],
});
