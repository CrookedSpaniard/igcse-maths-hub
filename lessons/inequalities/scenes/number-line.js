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

// A number line from −6 to 6. draw({ lo, loIn, hi, hiIn, or, ints }) shades lo..hi (null = no end, an arrow);
// `or` is a second range drawn too (for answers like x < −2 or x > 3); ints are dots on the line.
FD.numLine = (host) => {
  host.innerHTML = '<svg class="nl" viewBox="0 0 560 110" role="img" aria-label="Number line"></svg>';
  const svg = host.firstElementChild, X = (v) => 40 + (v + 6) * 40;
  const seg = ({ lo = null, loIn = false, hi = null, hiIn = false }) => {
    if (lo == null && hi == null) return '';
    const a = lo == null ? 16 : X(lo), b = hi == null ? 544 : X(hi);
    return `<line class="nl-bar" x1="${a}" y1="40" x2="${b}" y2="40"/>${lo == null ? '<path class="nl-arr" d="M14 40 l12 -7 v14 z"/>' : `<circle class="nl-c ${loIn ? 'in' : ''}" cx="${a}" cy="40" r="8"/>`}${hi == null ? '<path class="nl-arr" d="M546 40 l-12 -7 v14 z"/>' : `<circle class="nl-c ${hiIn ? 'in' : ''}" cx="${b}" cy="40" r="8"/>`}`;
  };
  return (r = {}) => {
    svg.innerHTML = '<line class="nl-ax" x1="16" y1="70" x2="544" y2="70"/>'
      + Array.from({ length: 13 }, (_, i) => `<line class="nl-ax" x1="${X(i - 6)}" y1="63" x2="${X(i - 6)}" y2="77"/><text class="nl-t" x="${X(i - 6)}" y="98">${String(i - 6).replace('-', '−')}</text>`).join('')
      + seg(r) + (r.or ? seg(r.or) : '')
      + (r.ints || []).map((v) => `<circle class="nl-i" cx="${X(v)}" cy="70" r="6"/>`).join('');
  };
};
// TeX for a range: lo < x ≤ hi etc.
const inTex = ({ lo = null, loIn, hi = null, hiIn }) => (lo != null && hi != null ? `${lo} ${loIn ? '\\le' : '<'} x ${hiIn ? '\\le' : '<'} ${hi}` : lo != null ? `x ${loIn ? '\\ge' : '>'} ${lo}` : `x ${hiIn ? '\\le' : '<'} ${hi}`);
const inInts = ({ lo = -99, loIn, hi = 99, hiIn }) => { const r = []; for (let v = -6; v <= 6; v++) if ((lo == null || v > lo || (loIn && v === lo)) && (hi == null || v < hi || (hiIn && v === hi))) r.push(v); return r; };

FD.add({
  id: 'number-line',
  title: 'Symbols and number lines',
  tab: 'Number lines',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['\\(<\\) and \\(>\\)', 'Less than, greater than. The number itself is <b>not</b> included: open circle ○.'],
    ['\\(\\le\\) and \\(\\ge\\)', 'Less than or equal to, greater than or equal to. The number <b>is</b> included: closed circle ●.'],
    ['Integer', 'A whole number: …, −2, −1, 0, 1, 2, …'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'in-n',
      vis: '<div class="nl-host" data-k="nl"></div>',
      tryHtml: `<label class="ctrl">Left end <input type="range" data-k="lo" min="-6" max="5" value="-2"><output data-k="olo">−2</output></label>
        <label class="ctrl">Right end <input type="range" data-k="hi" min="-5" max="6" value="3"><output data-k="ohi">3</output></label>
        <div class="seg-row"><label class="in-chk"><input type="checkbox" data-k="li" checked> include left end (≤)</label><label class="in-chk"><input type="checkbox" data-k="ri"> include right end (≤)</label></div>`,
    });
    const nl = FD.numLine(a.$('[data-k="nl"]'));
    a.nl = (r, showInts) => { nl({ ...r, ints: showInts ? inInts(r) : [] }); a.big(inTex(r)); };
    const sync = () => {
      let lo = +a.$('[data-k="lo"]').value, hi = +a.$('[data-k="hi"]').value;
      if (hi <= lo) { hi = lo + 1; a.$('[data-k="hi"]').value = hi; }
      a.$('[data-k="olo"]').textContent = String(lo).replace('-', '−'); a.$('[data-k="ohi"]').textContent = String(hi).replace('-', '−');
      const r = { lo, hi, loIn: a.$('[data-k="li"]').checked, hiIn: a.$('[data-k="ri"]').checked };
      a.nl(r, true);
      a.msg(`Integers that fit: ${inInts(r).join(', ').replace(/-/g, '−') || 'none'}.`);
    };
    ['lo', 'hi', 'li', 'ri'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.nl({ lo: 3 });
    return a;
  },
  steps: [
    {
      title: 'Four symbols',
      text: '<p>\\(x > 3\\): \\(x\\) is greater than 3. \\(x < 3\\): less than 3. \\(x \\ge 3\\): greater than <b>or equal to</b> 3. \\(x \\le 3\\): less than or equal to 3.</p><p>The point of the sign always points to the smaller number.</p>',
      async on(a, ctx) { a.tryMode(false); for (const r of [{ lo: 3 }, { hi: 3 }, { lo: 3, loIn: true }, { hi: 3, hiIn: true }]) { a.nl(r); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Open or closed circle?',
      text: '<p>On a number line, an <b>open circle</b> ○ means the number is not included (\\(<\\), \\(>\\)). A <b>closed circle</b> ● means it is included (\\(\\le\\), \\(\\ge\\)).</p>',
      async on(a, ctx) { a.tryMode(false); a.nl({ lo: -1 }); a.msg('\\(x > -1\\): open circle, −1 is not included.'); if (!(await ctx.sleep(1600))) return; a.nl({ lo: -1, loIn: true }); a.msg('\\(x \\ge -1\\): closed circle, −1 is included.'); },
    },
    {
      title: 'Two-sided inequalities and integers',
      text: '<p>\\(-2 \\le x < 3\\) means \\(x\\) is between −2 and 3: −2 is included, 3 is not.</p><p>The <b>integers</b> that satisfy it are −2, −1, 0, 1, 2.</p>',
      tip: 'Check both ends carefully. It is easy to miss −2 or to include 3.',
      async on(a) { a.tryMode(false); a.nl({ lo: -2, loIn: true, hi: 3 }, true); a.msg('Integers: −2, −1, 0, 1, 2.'); },
    },
    {
      title: 'Try it: build an inequality',
      text: '<p>Move the ends and choose whether each end is included. Read the inequality and the list of integers that fit.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'number-line',
  gens: [
    () => { const lo = FD.rnd(-5, 2), hi = lo + FD.rnd(2, 5), loIn = Math.random() < .5, hiIn = Math.random() < .5, ints = inInts({ lo, hi, loIn, hiIn }); return { type: 'num', q: `How many integers satisfy \\(${inTex({ lo, hi, loIn, hiIn })}\\)?`, a: ints.length, why: `They are ${ints.join(', ').replace(/-/g, '−')}: ${ints.length} integers.` }; },
    () => { const v = FD.rnd(-5, 5), k = FD.rnd(0, 3), s = ['x > ' + v, 'x \\ge ' + v, 'x < ' + v, 'x \\le ' + v][k]; return { type: 'mcq', q: `Which description matches \\(${s}\\) on a number line?`, opts: [['Open circle at ' + v + ', arrow to the right', 'Closed circle at ' + v + ', arrow to the right', 'Open circle at ' + v + ', arrow to the left', 'Closed circle at ' + v + ', arrow to the left'][k], ...['Open circle at ' + v + ', arrow to the right', 'Closed circle at ' + v + ', arrow to the right', 'Open circle at ' + v + ', arrow to the left', 'Closed circle at ' + v + ', arrow to the left'].filter((x, i) => i !== k)].map((o) => o.replace(/-/g, '−')), why: `${k % 2 ? 'Closed' : 'Open'} circle because ${v} ${k % 2 ? 'is' : 'is not'} included; arrow ${k < 2 ? 'right (bigger numbers)' : 'left (smaller numbers)'}.` }; },
  ],
});

FD.check({
  section: 'number-line',
  items: [
    { type: 'mcq', q: 'Which inequality means “\\(x\\) is at least 4”?', opts: ['\\(x \\ge 4\\)', '\\(x > 4\\)', '\\(x \\le 4\\)', '\\(x < 4\\)'], why: 'At least 4: 4 or more.' },
    { type: 'num', q: 'List the integers that satisfy \\(-3 < x \\le 1\\). How many are there?', a: 4, why: '−2, −1, 0, 1.' },
    { type: 'tf', q: 'On a number line, \\(x < 5\\) is shown with a closed circle at 5.', a: false, why: '5 is not included, so it is an open circle.' },
    { type: 'mcq', q: 'Which number satisfies \\(-1 \\le x < 2\\)?', opts: ['−1', '2', '−2', '3'], why: '−1 is included; 2 is not.' },
  ],
});
