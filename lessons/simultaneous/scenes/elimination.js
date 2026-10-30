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

// Elimination: line the equations up, then add or subtract them so one letter disappears.
// An equation is [a, b, c] meaning ax + by = c.
const siTerm = (k, v, first) => (k === 0 ? '' : `${k < 0 ? (first ? '-' : ' - ') : first ? '' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`);
const siEq = ([a, b, c]) => `${siTerm(a, 'x', true)}${siTerm(b, 'y', !a)} &= ${c}`;
const siSys = (e1, e2, extra) => `\\begin{aligned} ${siEq(e1)} \\\\ ${siEq(e2)}${extra ? ` \\\\ \\hline ${extra}` : ''} \\end{aligned}`;
// A random system with integer solution; same = 'x' | 'y' | null for a matching coefficient.
const siRand = (same) => {
  let x, y, a, b, d, e;
  do {
    x = FD.rndNZ(-6, 8); y = FD.rndNZ(-6, 8);
    a = FD.rnd(1, 6); b = FD.rndNZ(-5, 6); d = FD.rnd(1, 6); e = FD.rndNZ(-5, 6);
    if (same === 'y') e = FD.pick([b, -b]);
    if (same === 'x') d = a;
  } while (a * e - b * d === 0 || (same === 'x' && b === e) || (same === 'y' && a === d));
  return { e1: [a, b, a * x + b * y], e2: [d, e, d * x + e * y], x, y };
};

FD.add({
  id: 'elimination',
  title: 'Solving by elimination',
  tab: 'Elimination',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Simultaneous equations', 'Two equations with the same two unknowns. The solution makes <b>both</b> true.'],
    ['Eliminate', 'Get rid of one unknown by adding or subtracting the equations.'],
    ['Coefficient', 'The number in front of a letter: in \\(3x - 2y\\), the coefficient of \\(y\\) is \\(-2\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'si-e',
      tryHtml: '<p class="ab-ask">The \\(y\\) terms have the same size. Add or subtract?</p><div class="chk-btns" data-k="ops"><button class="btn" data-o="1">Add the equations</button><button class="btn" data-o="-1">Subtract the equations</button></div><div class="chk-btns"><button class="btn ghost" data-k="new">New pair ↻</button></div>',
    });
    let s;
    const ask = () => { s = siRand('y'); a.big(siSys(s.e1, s.e2)); a.msg(''); a.work(null); };
    a.$('[data-k="ops"]').addEventListener('click', (e) => {
      const b = e.target.closest('.btn'); if (!b) return;
      const k = +b.dataset.o, [A, B, C] = s.e1, [D, E, F] = s.e2;
      const r = [A + k * D, B + k * E, C + k * F];
      if (r[1] !== 0) { a.big(siSys(s.e1, s.e2, siEq(r))); a.msg(`The \\(y\\) terms did not cancel: \\(${B} ${k > 0 ? '+' : '-'} (${E}) = ${r[1]}\\). Try the other one.`, 'bad'); return; }
      a.big(siSys(s.e1, s.e2, `${siTerm(r[0], 'x', true)} &= ${r[2]}`));
      a.msg(`✓ The \\(y\\)'s cancel (${Math.sign(B) === Math.sign(E) ? 'same signs: subtract' : 'different signs: add'}). So \\(x = ${s.x}\\), and substituting gives \\(y = ${s.y}\\).`);
    });
    a.$('[data-k="new"]').addEventListener('click', ask);
    a.onTry = ask;
    return a;
  },
  steps: [
    {
      title: 'Two equations, two unknowns',
      text: '<p>\\(x + y = 10\\) has lots of solutions: 3 and 7, 4 and 6… \\(x - y = 4\\) also has lots.</p><p>Only <b>one pair</b> fits both: \\(x = 7, y = 3\\). Finding it is solving <b>simultaneous equations</b>.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(siSys([1, 1, 10], [1, -1, 4])); for (const [x, y] of [[3, 7], [5, 5], [7, 3]]) { a.msg(`\\(x = ${x}, y = ${y}\\): first ${x + y === 10 ? '✓' : '✗'}, second ${x - y === 4 ? '✓' : '✗'}`, x - y === 4 ? 'good' : 'bad'); if (!(await ctx.sleep(1200))) return; } },
    },
    {
      title: 'Add to eliminate',
      text: '<p>The \\(y\\) terms are \\(+y\\) and \\(-y\\): <b>different signs</b>. Adding the equations makes them cancel.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(siSys([1, 1, 10], [1, -1, 4]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([1, 1, 10], [1, -1, 4], '2x &= 14'));
        a.work([['x = 7', '÷ 2'], ['7 + y = 10 \\Rightarrow y = 3', 'substitute into the first'], ['\\text{Check: } 7 - 3 = 4 \\;\\checkmark', 'use the other equation']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Subtract to eliminate',
      text: '<p>\\(3x + 2y = 16\\) and \\(x + 2y = 8\\). Both have \\(+2y\\): the <b>same sign</b>. Subtract to cancel them.</p>',
      tip: 'Same Signs Subtract. Different signs: add.',
      async on(a, ctx) {
        a.tryMode(false); a.big(siSys([3, 2, 16], [1, 2, 8]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([3, 2, 16], [1, 2, 8], '2x &= 8'));
        a.work([['x = 4', ''], ['4 + 2y = 8 \\Rightarrow y = 2', 'substitute'], ['\\text{Check: } 3(4) + 2(2) = 16 \\;\\checkmark', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: add or subtract?',
      text: '<p>Look at the signs of the matching \\(y\\) terms. Choose <b>add</b> or <b>subtract</b> to eliminate \\(y\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

const siGen = (same) => () => { const s = siRand(same); return { type: 'num', q: `Solve the simultaneous equations \\(${siEq(s.e1).replace('&', '')}\\) and \\(${siEq(s.e2).replace('&', '')}\\).`, a: [s.x, s.y], fields: ['\\(x\\) =', '\\(y\\) ='], why: `Eliminate one letter, solve for the other, then substitute back: \\(x = ${s.x}\\), \\(y = ${s.y}\\). Check in both equations.` }; };
FD.practice({ section: 'elimination', gens: [siGen('y'), siGen('x')] });

FD.check({
  section: 'elimination',
  items: [
    { type: 'num', q: 'Solve \\(x + y = 12\\) and \\(x - y = 2\\).', a: [7, 5], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'Add: \\(2x = 14\\), \\(x = 7\\), \\(y = 5\\).' },
    { type: 'num', q: 'Solve \\(4x + 3y = 22\\) and \\(x + 3y = 13\\).', a: [3, 10 / 3], fields: ['\\(x\\) =', '\\(y\\) ='], tol: 0.01, show: '\\(x = 3, y = \\tfrac{10}{3}\\)', why: 'Subtract: \\(3x = 9\\), \\(x = 3\\). \\(3 + 3y = 13\\), \\(y = \\frac{10}{3}\\).' },
    { type: 'mcq', q: 'To eliminate \\(y\\) from \\(5x - 2y = 1\\) and \\(3x + 2y = 15\\) you should…', opts: ['add the equations', 'subtract the equations', 'multiply both by 2', 'divide by \\(y\\)'], why: '\\(-2y\\) and \\(+2y\\) have different signs: add.' },
    { type: 'tf', q: '\\(x = 2, y = 1\\) is the solution of \\(x + y = 3\\) and \\(2x - y = 4\\).', a: false, why: '\\(2(2) - 1 = 3\\), not 4. The solution is \\(x = \\frac73\\), \\(y = \\frac23\\).' },
  ],
});
