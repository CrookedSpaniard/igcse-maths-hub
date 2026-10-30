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

// Solving by factorising: y = (x − p)(x − q) crosses the x-axis at p and q.
const quBr = (r) => `(${FD.poly([1, -r])})`;
const quRoots = (p, q) => ({ type: 'num', a: [p, q], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true });

FD.add({
  id: 'solve-fact',
  title: 'Solving by factorising',
  tab: 'Factorising',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Quadratic equation', 'An equation with an \\(x^2\\) term and no higher power, written as \\(ax^2 + bx + c = 0\\).'],
    ['Roots', 'The solutions of the equation: where the graph crosses the \\(x\\)-axis.'],
    ['Zero product rule', 'If \\(A \\times B = 0\\), then \\(A = 0\\) or \\(B = 0\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-f', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Root \\(p\\) <input type="range" data-k="p" min="-5" max="5" value="2"><output data-k="op">2</output></label>
        <label class="ctrl">Root \\(q\\) <input type="range" data-k="q" min="-5" max="5" value="-3"><output data-k="oq">−3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 360, x: [-6, 6], y: [-10, 10], step: 1, ystep: 2, label: 'A parabola and its roots' });
    a.para = (p, q, show = true) => {
      g.draw(g.curve((x) => (x - p) * (x - q)), show ? g.pt(p, 0, 'hot') + g.pt(q, 0, 'hot') + g.lbl(p, 0, `x = ${p}`) + (p !== q ? g.lbl(q, 0, `x = ${q}`) : '') : '');
    };
    const sync = () => {
      const p = +a.$('[data-k="p"]').value, q = +a.$('[data-k="q"]').value;
      a.$('[data-k="op"]').textContent = String(p).replace('-', '−'); a.$('[data-k="oq"]').textContent = String(q).replace('-', '−');
      a.para(p, q);
      a.big(`${FD.poly([1, -(p + q), p * q])} = 0`);
      a.msg(`\\(${quBr(p)}${quBr(q)} = 0\\), so \\(x = ${p}\\) or \\(x = ${q}\\)${p === q ? ' (the same root twice)' : ''}.`);
    };
    ['p', 'q'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.para(2, 3, false);
    return a;
  },
  steps: [
    {
      title: 'Zero times anything is zero',
      text: '<p>If two numbers multiply to give 0, at least one of them must be 0.</p><p>So if \\((x - 2)(x - 3) = 0\\), then \\(x - 2 = 0\\) <b>or</b> \\(x - 3 = 0\\).</p>',
      on: FD.walk([['(x - 2)(x - 3) = 0', ''], ['x - 2 = 0 \\;\\text{ or }\\; x - 3 = 0', 'one bracket must be 0'], ['x = 2 \\;\\text{ or }\\; x = 3', 'two solutions']], (a) => { a.para(2, 3); a.big(''); }),
    },
    {
      title: 'Factorise, then solve',
      text: '<p>\\(x^2 + x - 12 = 0\\). Factorise the left side first: two numbers that multiply to \\(-12\\) and add to 1 are 4 and \\(-3\\).</p>',
      tip: 'The equation must equal 0 before you factorise.',
      on: FD.walk([['x^2 + x - 12 = 0', ''], ['(x + 4)(x - 3) = 0', 'factorise'], ['x = -4 \\;\\text{ or }\\; x = 3', '']], (a) => { a.para(-4, 3); a.big(''); }),
    },
    {
      title: 'Rearrange to = 0 first',
      text: '<p>\\(x^2 = 5x\\): do <b>not</b> divide by \\(x\\) (you would lose the answer \\(x = 0\\)). Move everything to one side.</p>',
      on: FD.walk([['x^2 - 5x = 0', 'subtract 5x'], ['x(x - 5) = 0', 'common factor'], ['x = 0 \\;\\text{ or }\\; x = 5', '']], (a) => { a.para(0, 5); a.big(''); }),
    },
    {
      title: 'Difference of two squares',
      text: '<p>\\(x^2 - 16 = 0\\) gives \\((x + 4)(x - 4) = 0\\), so \\(x = \\pm 4\\).</p>',
      on: FD.walk([['x^2 - 16 = 0', ''], ['(x + 4)(x - 4) = 0', ''], ['x = -4 \\;\\text{ or }\\; x = 4', '']], (a) => { a.para(-4, 4); a.big(''); }),
    },
    {
      title: 'Try it: roots and the graph',
      text: '<p>Choose the two roots. The graph of the quadratic crosses the \\(x\\)-axis exactly at them.</p>',
      tip: 'Make p = q. The graph just touches the axis.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'solve-fact',
  gens: [
    () => { let p, q; do { p = FD.rnd(-9, 9); q = FD.rnd(-9, 9); } while (p === q || !p || !q); return { ...quRoots(p, q), q: `Solve \\(${FD.poly([1, -(p + q), p * q])} = 0\\)`, why: `Factorise: \\(${quBr(p)}${quBr(q)} = 0\\). So \\(x = ${p}\\) or \\(x = ${q}\\).` }; },
    () => { const k = FD.rndNZ(-9, 9); return { ...quRoots(0, k), q: `Solve \\(x^2 = ${k}x\\)`, why: `\\(x^2 - ${k < 0 ? `(${k})` : k}x = 0\\), so \\(x(x ${k < 0 ? '+' : '-'} ${Math.abs(k)}) = 0\\). \\(x = 0\\) or \\(x = ${k}\\).` }; },
    () => { const k = FD.rnd(2, 12); return { ...quRoots(k, -k), q: `Solve \\(x^2 - ${k * k} = 0\\)`, why: `\\((x + ${k})(x - ${k}) = 0\\), so \\(x = ${k}\\) or \\(x = -${k}\\).` }; },
  ],
});

FD.check({
  section: 'solve-fact',
  items: [
    { ...quRoots(-2, -5), q: 'Solve \\(x^2 + 7x + 10 = 0\\)', why: '\\((x + 2)(x + 5) = 0\\).' },
    { ...quRoots(6, -2), q: 'Solve \\(x^2 - 4x - 12 = 0\\)', why: '\\((x - 6)(x + 2) = 0\\).' },
    { ...quRoots(0, 3), q: 'Solve \\(x^2 - 3x = 0\\)', why: '\\(x(x - 3) = 0\\).' },
    { type: 'mcq', q: 'Why is dividing \\(x^2 = 8x\\) by \\(x\\) a mistake?', opts: ['You lose the solution \\(x = 0\\)', 'You cannot divide by a letter', 'It gives \\(x = 64\\)', 'It is not a mistake'], why: '\\(x(x - 8) = 0\\) has two solutions, 0 and 8.' },
  ],
});
