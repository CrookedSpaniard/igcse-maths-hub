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

// Statements to sort: [TeX, kind, reason]
const AB_KINDS = ['Expression', 'Equation', 'Formula', 'Identity'];
const AB_BANK = [
  ['5x - 2y + 7', 0, 'There is no = sign. It is a collection of terms.'],
  ['3a^2 + 4a', 0, 'No = sign, so it is an expression.'],
  ['2x + 5 = 17', 1, 'It is only true for one value of \\(x\\) (\\(x = 6\\)).'],
  ['4(n - 1) = 20', 1, 'It is true for one value: \\(n = 6\\).'],
  ['A = l \\times w', 2, 'It links different quantities: the area of a rectangle from its length and width.'],
  ['v = u + at', 2, 'A rule linking velocity, starting velocity, acceleration and time.'],
  ['P = 2(l + w)', 2, 'A rule for the perimeter of a rectangle.'],
  ['2(x + 3) \\equiv 2x + 6', 3, 'Both sides are equal for <b>every</b> value of \\(x\\), so we use \\(\\equiv\\).'],
  ['x^2 - 9 \\equiv (x + 3)(x - 3)', 3, 'True for every value of \\(x\\).'],
  ['7y - 3y \\equiv 4y', 3, 'True whatever \\(y\\) is.'],
];

FD.add({
  id: 'notation',
  title: 'Terms, expressions, equations and formulae',
  tab: 'Notation',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Term', 'One part of an expression, separated by + or −, like \\(5x\\), \\(-2y\\) or \\(7\\).'],
    ['Expression', 'Terms added or subtracted, with no = sign, like \\(5x - 2y + 7\\).'],
    ['Equation', 'Two expressions with = between them, true only for certain values: \\(2x + 5 = 17\\).'],
    ['Formula', 'A rule that links quantities, like \\(A = lw\\).'],
    ['Identity', 'True for every value of the letters. Written with \\(\\equiv\\): \\(2(x + 3) \\equiv 2x + 6\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ab-not',
      vis: '<div class="ab-terms" data-k="terms"></div>',
      tryHtml: `<p class="ab-ask">Which kind is this?</p><div class="mbig" data-k="st"></div>
        <div class="chk-btns ab-kinds">${AB_KINDS.map((k, i) => `<button class="btn" data-i="${i}">${k}</button>`).join('')}</div>
        <div class="chk-btns"><button class="btn ghost" data-k="new">New statement ↻</button></div>`,
    });
    const terms = a.$('[data-k="terms"]');
    a.terms = (list, lit = -1) => {
      terms.innerHTML = list.map((t, i) => `<span class="ab-t ${i === lit ? 'on' : ''} ${t.op ? 'op' : ''}">${FD.tex(t.t || t.op)}</span>`).join('');
    };
    let cur = AB_BANK[0];
    const ask = () => {
      let n; do { n = FD.pick(AB_BANK); } while (n === cur); cur = n;
      a.$('[data-k="st"]').innerHTML = FD.tex(cur[0], true); a.msg('');
      a.$('.ab-kinds').querySelectorAll('.btn').forEach((b) => { b.disabled = false; b.classList.remove('primary'); });
    };
    a.$('.ab-kinds').addEventListener('click', (e) => {
      const b = e.target.closest('.btn'); if (!b) return;
      const ok = +b.dataset.i === cur[1];
      a.msg(`${ok ? '✓ Yes: ' : `✗ No, it is ${/^[AEI]/.test(AB_KINDS[cur[1]]) ? 'an' : 'a'} <b>${AB_KINDS[cur[1]].toLowerCase()}</b>. `}${cur[2]}`, ok ? 'good' : 'bad');
      if (ok) b.classList.add('primary');
    });
    a.$('[data-k="new"]').addEventListener('click', ask);
    a.onTry = () => { a.terms([]); a.big(''); ask(); };
    return a;
  },
  steps: [
    {
      title: 'Letters stand for numbers',
      text: '<p>In algebra a letter stands for a number we do not know yet, or a number that can change (a <b>variable</b>).</p><p>We write algebra in a short way: no × sign, the number first, and powers for repeated multiplying.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.terms([]); a.big('');
        a.work([['3 \\times x = 3x', 'number first, no × sign'], ['a \\times b = ab', 'letters side by side'], ['y \\times y = y^2', '“y squared”'], ['x \\div 4 = \\frac{x}{4}', 'divide: write a fraction']]);
        for (let i = 0; i < 4; i++) { a.upto(i); if (!(await ctx.sleep(1200))) return; }
      },
    },
    {
      title: 'Terms and expressions',
      text: '<p>An <b>expression</b> is made of <b>terms</b>. The sign in front of a term belongs to it.</p><p>\\(5x - 2y + 7\\) has three terms: \\(5x\\), \\(-2y\\) and \\(7\\).</p>',
      tip: 'A term with no letter, like 7, is called a constant.',
      async on(a, ctx) {
        a.tryMode(false); a.big('');
        const list = [{ t: '5x' }, { t: '-2y' }, { t: '+7' }];
        for (let i = 0; i <= 3; i++) { a.terms(list, i < 3 ? i : -1); if (!(await ctx.sleep(1000))) return; }
        a.msg('3 terms: \\(5x\\), \\(-2y\\) and \\(7\\).');
      },
    },
    {
      title: 'Equation, formula or identity?',
      text: '<p>An <b>equation</b> is true only for certain values. A <b>formula</b> links quantities. An <b>identity</b> is true for <b>every</b> value and uses \\(\\equiv\\).</p>',
      tip: 'An expression has no = sign at all.',
      async on(a, ctx) {
        a.tryMode(false); a.terms([]); a.big('');
        a.work([['2x + 5 = 17', 'equation: only x = 6 works'], ['A = lw', 'formula: area of a rectangle'], ['2(x + 3) \\equiv 2x + 6', 'identity: true for every x'], ['4x^2 - x', 'expression: no = sign']]);
        for (let i = 0; i < 4; i++) { a.upto(i); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Testing an identity',
      text: '<p>To see that \\(2(x + 3) \\equiv 2x + 6\\), try any value. With \\(x = 4\\): both sides give 14. With \\(x = -1\\): both give 4.</p><p>An equation like \\(2x + 5 = 17\\) fails for most values.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.terms([]);
        for (const x of [4, -1, 10]) {
          a.big(`x = ${x}: \\quad 2(${x} + 3) = ${2 * (x + 3)}, \\quad 2(${x}) + 6 = ${2 * x + 6}`);
          if (!(await ctx.sleep(1300))) return;
        }
        a.msg('Equal every time: it is an identity.');
      },
    },
    {
      title: 'Try it: name the statement',
      text: '<p>Decide whether each statement is an <b>expression</b>, an <b>equation</b>, a <b>formula</b> or an <b>identity</b>.</p>',
      tip: 'Look for the sign first: none, = or ≡.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'notation',
  gens: [
    () => { const s = FD.pick(AB_BANK); return { type: 'mcq', q: `What is \\(${s[0]}\\)?`, opts: [AB_KINDS[s[1]], ...AB_KINDS.filter((k, i) => i !== s[1])], why: s[2] }; },
    () => { const a = FD.rnd(2, 9), b = FD.rnd(2, 9), c = FD.rnd(1, 12), x = FD.pick(['x', 'a', 'n', 'p']), y = FD.pick(['y', 'b', 'm', 'q']); return { type: 'num', q: `How many terms are in \\(${a}${x}^2 - ${b}${y} + ${c} - ${x}${y}\\)?`, a: 4, why: `The terms are \\(${a}${x}^2\\), \\(-${b}${y}\\), \\(${c}\\) and \\(-${x}${y}\\).` }; },
    () => { const n = FD.rnd(2, 9), x = FD.pick(['a', 'b', 'p', 't']); return { type: 'mcq', q: `Which is the short way to write \\(${n} \\times ${x} \\times ${x}\\)?`, opts: [`\\(${n}${x}^2\\)`, `\\(${n}${x}${x}\\)`, `\\(${2 * n}${x}\\)`, `\\(${n} + ${x}^2\\)`], why: `\\(${x} \\times ${x} = ${x}^2\\), and the number goes first: \\(${n}${x}^2\\).` }; },
  ],
});

FD.check({
  section: 'notation',
  items: [
    { type: 'mcq', q: 'Which of these is an <b>equation</b>?', opts: ['\\(3x - 1 = 11\\)', '\\(3x - 1\\)', '\\(3(x - 1) \\equiv 3x - 3\\)', '\\(V = IR\\)'], why: '\\(3x - 1 = 11\\) is true only when \\(x = 4\\).' },
    { type: 'tf', q: '\\(5(y + 2) \\equiv 5y + 10\\) is an identity.', a: true, why: 'Both sides are equal for every value of \\(y\\).' },
    { type: 'num', q: 'How many terms are there in \\(4a^2 - 3ab + b - 9\\)?', a: 4, why: '\\(4a^2\\), \\(-3ab\\), \\(b\\) and \\(-9\\).' },
    { type: 'mcq', q: 'Write \\(m \\times 7 \\times n\\) in the short way.', opts: ['\\(7mn\\)', '\\(m7n\\)', '\\(7 + mn\\)', '\\(7m + n\\)'], why: 'Number first, then the letters, usually in alphabetical order.' },
    { type: 'sort', q: 'Sort each statement.', bins: ['Expression', 'Equation', 'Formula'], rows: [['\\(6p + 2q\\)', 0], ['\\(x + 9 = 4\\)', 1], ['\\(C = 2\\pi r\\)', 2], ['\\(t^2 - 3t\\)', 0]], why: 'No = sign: expression. True for one value: equation. A rule linking quantities: formula.' },
  ],
});
