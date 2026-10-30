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

// Substitution: v = u + at with sliders; the values drop into the formula.
FD.add({
  id: 'substitution',
  title: 'Substituting into formulae',
  tab: 'Substitution',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Substitute', 'Replace each letter with its number.'],
    ['Subject', 'The letter on its own on one side of a formula. In \\(v = u + at\\) the subject is \\(v\\).'],
    ['BIDMAS', 'The order of operations: Brackets, Indices, Division and Multiplication, Addition and Subtraction.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fo-s',
      vis: '<div class="fo-card" data-k="card"></div>',
      tryHtml: `<label class="ctrl">\\(u\\) (m/s) <input type="range" data-k="u" min="-10" max="20" value="5"><output data-k="ou">5</output></label>
        <label class="ctrl">\\(a\\) (m/s²) <input type="range" data-k="a" min="-5" max="5" value="2"><output data-k="oa">2</output></label>
        <label class="ctrl">\\(t\\) (s) <input type="range" data-k="t" min="0" max="10" value="3"><output data-k="ot">3</output></label>`,
    });
    const card = a.$('[data-k="card"]');
    a.card = (f, vals) => { card.innerHTML = `<div class="mbig">${FD.tex(f, true)}</div><div class="fo-vals">${vals.map(([k, v]) => `<span class="fo-v">\\(${k} = ${v}\\)</span>`).join('')}</div>`; FD.typeset(card); };
    const sync = () => {
      const [u, ac, t] = ['u', 'a', 't'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['u', 'a', 't'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([u, ac, t][i]).replace('-', '−'); });
      a.card('v = u + at', [['u', u], ['a', ac], ['t', t]]);
      const br = (n) => (n < 0 ? `(${n})` : n);
      a.big(`v = ${u} + ${br(ac)} \\times ${t} = ${u} + ${br(ac * t)} = ${u + ac * t}`);
      a.msg(`The final velocity is ${u + ac * t} m/s.`);
    };
    ['u', 'a', 't'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Put the numbers in',
      text: '<p>The formula \\(v = u + at\\) gives a velocity. To find \\(v\\) when \\(u = 5\\), \\(a = 2\\) and \\(t = 3\\), <b>substitute</b>: replace each letter with its number.</p>',
      tip: '\\(at\\) means \\(a \\times t\\). Multiply before you add.',
      on: FD.walk([['v = u + at', ''], ['v = 5 + 2 \\times 3', 'substitute'], ['v = 5 + 6', 'multiply first'], ['v = 11', '']], (a) => { a.card('v = u + at', [['u', 5], ['a', 2], ['t', 3]]); a.big(''); }),
    },
    {
      title: 'Negative numbers: use brackets',
      text: '<p>Put negative numbers in brackets. Find \\(P = 3x^2 - 2y\\) when \\(x = -4\\) and \\(y = -5\\).</p>',
      tip: '\\((-4)^2 = 16\\), but \\(-4^2 = -16\\). The bracket matters!',
      on: FD.walk([['P = 3x^2 - 2y', ''], ['P = 3(-4)^2 - 2(-5)', 'brackets round negatives'], ['P = 3 \\times 16 + 10', 'square first; − × − = +'], ['P = 58', '']], (a) => { a.card('P = 3x^2 - 2y', [['x', -4], ['y', -5]]); a.big(''); }, 1400),
    },
    {
      title: 'Fractions and powers',
      text: '<p>A fraction line works like a bracket: work out the top and the bottom first.</p>',
      on: FD.walk([['T = \\frac{a + b}{2c}', 'a = 7, b = 11, c = 3'], ['T = \\frac{7 + 11}{2 \\times 3}', ''], ['T = \\frac{18}{6} = 3', '']], (a) => { a.card('T = \\frac{a + b}{2c}', [['a', 7], ['b', 11], ['c', 3]]); a.big(''); }, 1400),
    },
    {
      title: 'Try it: v = u + at',
      text: '<p>Change the starting velocity \\(u\\), the acceleration \\(a\\) and the time \\(t\\). Work out \\(v\\) in your head first, then check.</p>',
      tip: 'Make \\(a\\) negative: the object is slowing down.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'substitution',
  gens: [
    () => { const l = FD.pick([1.5, 2.5, 3.2, 4.5, 0.8, 6.4]), w = FD.pick([0.5, 0.25, 0.75, 1.5]); return { type: 'num', q: `\\(A = lw + 2l\\). Find \\(A\\) when \\(l = ${l}\\) and \\(w = ${w === 0.5 ? '\\frac12' : w === 0.25 ? '\\frac14' : w === 0.75 ? '\\frac34' : '1.5'}\\).`, a: FD.round(l * w + 2 * l, 4), tol: 0.001, why: `\\(A = ${l} \\times ${w} + 2 \\times ${l} = ${FD.round(l * w, 4)} + ${FD.round(2 * l, 4)} = ${FD.round(l * w + 2 * l, 4)}\\).` }; },
    () => { const p = FD.rnd(2, 6), q = FD.rnd(2, 9), x = FD.rndNZ(-6, 6), y = FD.rndNZ(-6, 6), v = p * x * x - q * y, br = (n) => (n < 0 ? `(${n})` : n); return { type: 'num', q: `\\(W = ${p}x^2 - ${q}y\\). Find \\(W\\) when \\(x = ${x}\\) and \\(y = ${y}\\).`, a: v, why: `\\(W = ${p} \\times ${br(x)}^2 - ${q} \\times ${br(y)} = ${p * x * x} ${FD.sg(-q * y)} = ${v}\\).` }; },
    () => { let a, b, c; do { a = FD.rnd(-9, 12); b = FD.rnd(-5, 12); c = FD.rnd(1, 5); } while ((a + b) % (2 * c)); return { type: 'num', q: `\\(T = \\dfrac{a + b}{2c}\\). Find \\(T\\) when \\(a = ${a}\\), \\(b = ${b}\\) and \\(c = ${c}\\).`, a: (a + b) / (2 * c), why: `Top: \\(${a} + ${b < 0 ? `(${b})` : b} = ${a + b}\\). Bottom: \\(2 \\times ${c} = ${2 * c}\\). \\(T = ${a + b} \\div ${2 * c} = ${(a + b) / (2 * c)}\\).` }; },
    () => { const u = FD.rnd(0, 15), ac = FD.rnd(-4, 6), t = FD.rnd(1, 10); return { type: 'num', q: `\\(v = u + at\\). Work out \\(v\\) when \\(u = ${u}\\), \\(a = ${ac}\\) and \\(t = ${t}\\).`, a: u + ac * t, why: `\\(v = ${u} + ${ac < 0 ? `(${ac})` : ac} \\times ${t} = ${u} ${FD.sg(ac * t)} = ${u + ac * t}\\).` }; },
  ],
});

FD.check({
  section: 'substitution',
  items: [
    { type: 'num', q: '\\(A = \\frac12 bh\\). Find \\(A\\) when \\(b = 9\\) and \\(h = 4\\).', a: 18, why: '\\(\\frac12 \\times 9 \\times 4 = 18\\).' },
    { type: 'num', q: '\\(y = 5 - x^2\\). Find \\(y\\) when \\(x = -3\\).', a: -4, why: '\\(5 - (-3)^2 = 5 - 9 = -4\\).' },
    { type: 'num', q: '\\(s = ut + \\frac12 at^2\\). Find \\(s\\) when \\(u = 4\\), \\(a = 10\\), \\(t = 3\\).', a: 57, why: '\\(4 \\times 3 + \\frac12 \\times 10 \\times 9 = 12 + 45 = 57\\).' },
    { type: 'num', q: '\\(P = 4x - 2y\\). Find \\(P\\) when \\(x = 2.5\\) and \\(y = \\frac34\\).', a: 8.5, why: '\\(4 \\times 2.5 - 2 \\times \\frac34 = 10 - 1.5 = 8.5\\).' },
    { type: 'mcq', q: 'What is \\(2a^2\\) when \\(a = -5\\)?', opts: ['50', '−50', '100', '−100'], why: '\\(2 \\times (-5)^2 = 2 \\times 25 = 50\\).' },
  ],
});
