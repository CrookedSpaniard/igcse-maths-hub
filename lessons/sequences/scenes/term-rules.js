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

// Growing patterns (matchstick squares) and term chips with the differences shown between them.
// FD.terms(host)(list, { gaps, upto }) — chips for the terms, with +d arrows when gaps is true.
FD.terms = (host) => (list, { gaps = false, upto = 99, lbl } = {}) => {
  host.innerHTML = `<div class="sq-row">${list.map((t, i) => `<span class="sq-c ${i < upto ? 'on' : ''}">${i < upto ? FD.num(t) : '?'}${lbl ? `<small>${lbl(i)}</small>` : ''}</span>${gaps && i < list.length - 1 ? `<span class="sq-g ${i + 1 < upto ? 'on' : ''}">${list[i + 1] - t >= 0 ? '+' : '−'}${FD.num(Math.abs(list[i + 1] - t))}</span>` : ''}`).join('')}</div>`;
};
// Matchstick squares in a row: n squares use 3n + 1 sticks.
const sqSticks = (n) => {
  const s = 34, x0 = 10, y0 = 14;
  let out = `<line class="sq-m" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + s}"/>`;
  for (let i = 0; i < n; i++) { const x = x0 + i * s; out += `<line class="sq-m" x1="${x}" y1="${y0}" x2="${x + s}" y2="${y0}"/><line class="sq-m" x1="${x}" y1="${y0 + s}" x2="${x + s}" y2="${y0 + s}"/><line class="sq-m" x1="${x + s}" y1="${y0}" x2="${x + s}" y2="${y0 + s}"/>`; }
  return `<svg class="sq-pat" viewBox="0 0 ${20 + n * s} ${y0 * 2 + s}" role="img" aria-label="${n} squares made of ${3 * n + 1} matchsticks">${out}</svg>`;
};

FD.add({
  id: 'term-rules',
  title: 'Term-to-term and position-to-term rules',
  tab: 'Rules',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Term', 'Each number in a sequence. The 1st term, 2nd term, …'],
    ['Term-to-term rule', 'How to get from one term to the next, e.g. “add 3”.'],
    ['Position-to-term rule', 'How to work out a term from its position \\(n\\), e.g. “3n + 2”.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sq-s',
      vis: '<div class="sq-pats" data-k="pats"></div><div class="sq-host" data-k="t"></div>',
      tryHtml: `<label class="ctrl">First term <input type="range" data-k="f" min="-10" max="20" value="4"><output data-k="of">4</output></label>
        <div class="seg-row" data-k="op"><button class="btn primary" data-o="+">add</button><button class="btn" data-o="×">multiply by</button></div>
        <label class="ctrl">Number <input type="range" data-k="k" min="-5" max="6" value="3"><output data-k="ok">3</output></label>`,
    });
    const T = FD.terms(a.$('[data-k="t"]'));
    a.t = T;
    a.pats = (ns) => { a.$('[data-k="pats"]').innerHTML = ns.map((n) => `<div class="sq-p">${sqSticks(n)}<b>${3 * n + 1}</b></div>`).join(''); };
    let op = '+';
    const sync = () => {
      const f = +a.$('[data-k="f"]').value, k = +a.$('[data-k="k"]').value;
      a.$('[data-k="of"]').textContent = String(f).replace('-', '−'); a.$('[data-k="ok"]').textContent = String(k).replace('-', '−');
      const list = [f]; for (let i = 1; i < 6; i++) list.push(op === '+' ? list[i - 1] + k : list[i - 1] * k);
      a.pats([]); T(list, { gaps: op === '+' });
      a.big(`\\text{Rule: } ${op === '+' ? (k < 0 ? `\\text{subtract } ${-k}` : `\\text{add } ${k}`) : `\\text{multiply by } ${k}`}`);
      a.msg(op === '+' ? 'Adding the same number each time makes an <b>arithmetic</b> (linear) sequence.' : 'Multiplying by the same number each time makes a <b>geometric</b> sequence.');
    };
    a.$('[data-k="op"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; op = b.dataset.o; a.$('[data-k="op"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    ['f', 'k'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'A growing pattern',
      text: '<p>Squares made of matchsticks: 1 square needs 4 sticks, 2 squares need 7, 3 squares need 10.</p><p>Each new square adds <b>3</b> sticks. The sequence is 4, 7, 10, 13, …</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let n = 1; n <= 4; n++) { a.pats(Array.from({ length: n }, (_, i) => i + 1)); a.t([4, 7, 10, 13], { gaps: true, upto: n }); if (!(await ctx.sleep(1000))) return; } },
    },
    {
      title: 'Term-to-term rule',
      text: '<p>The <b>term-to-term</b> rule says how to get the next term: here “start at 4 and add 3”.</p><p>Use it to continue: 16, 19, 22, …</p>',
      tip: 'Look at the differences between terms first.',
      async on(a) { a.tryMode(false); a.pats([]); a.t([4, 7, 10, 13, 16, 19, 22], { gaps: true }); a.big('\\text{Start at 4, add 3}'); },
    },
    {
      title: 'Position-to-term rule',
      text: '<p>A <b>position-to-term</b> rule works out any term from its position \\(n\\). For the sticks: \\(3n + 1\\).</p><p>The 1st term is \\(3(1) + 1 = 4\\), the 10th is \\(3(10) + 1 = 31\\), without listing the others.</p>',
      async on(a) { a.tryMode(false); a.pats([]); a.t([4, 7, 10, 13, 16], { lbl: (i) => `n = ${i + 1}` }); a.big('3n + 1: \\quad n = 10 \\Rightarrow 31'); },
    },
    {
      title: 'Other kinds of sequence',
      text: '<p>Not every sequence adds the same number. Some multiply, and some, like the square numbers, have differences that change.</p>',
      on: FD.walk([['3, 6, 12, 24, \\dots', '× 2 each time (geometric)'], ['1, 4, 9, 16, 25, \\dots', 'square numbers: n²'], ['1, 1, 2, 3, 5, 8, \\dots', 'add the two previous terms (Fibonacci)']], (a) => { a.pats([]); a.t([]); a.big(''); }, 1500),
    },
    {
      title: 'Try it: make a sequence',
      text: '<p>Choose a first term and a rule. Add a number for an arithmetic sequence, or multiply for a geometric one.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'term-rules',
  gens: [
    () => { const f = FD.rnd(-10, 20), d = FD.rndNZ(-7, 9), t = Array.from({ length: 4 }, (_, i) => f + i * d); return { type: 'num', q: `Find the next term: \\(${t.join(', ')}, \\dots\\)`, a: f + 4 * d, why: `The rule is ${d > 0 ? `add ${d}` : `subtract ${-d}`}: \\(${t[3]} ${FD.sg(d)} = ${f + 4 * d}\\).` }; },
    () => { const f = FD.rnd(1, 5), r = FD.pick([2, 3, -2]), t = Array.from({ length: 4 }, (_, i) => f * r ** i); return { type: 'num', q: `Find the next term: \\(${t.join(', ')}, \\dots\\)`, a: f * r ** 4, why: `Each term is multiplied by ${r}: \\(${t[3]} \\times ${r < 0 ? `(${r})` : r} = ${f * r ** 4}\\).` }; },
    () => { const m = FD.rnd(2, 7), c = FD.rnd(-6, 9), n = FD.rnd(5, 30); return { type: 'num', q: `The position-to-term rule is \\(${FD.poly([m, c], 'n')}\\). Find the ${n}th term.`, a: m * n + c, why: `\\(${m} \\times ${n} ${FD.sg(c)} = ${m * n + c}\\).` }; },
  ],
});

FD.check({
  section: 'term-rules',
  items: [
    { type: 'num', q: 'Find the next term: 23, 19, 15, 11, …', a: 7, why: 'Subtract 4.' },
    { type: 'mcq', q: 'What is the term-to-term rule for 2, 6, 18, 54, …?', opts: ['Multiply by 3', 'Add 4', 'Add 12', 'Multiply by 2'], why: '\\(2 \\times 3 = 6\\), \\(6 \\times 3 = 18\\).' },
    { type: 'num', q: 'The nth term of a sequence is \\(5n - 2\\). Find the 20th term.', a: 98, why: '\\(5(20) - 2\\).' },
    { type: 'num', q: 'In the matchstick pattern (1 square: 4 sticks, 2 squares: 7, 3 squares: 10), how many sticks are needed for 8 squares?', a: 25, why: '\\(3(8) + 1 = 25\\).' },
  ],
});
