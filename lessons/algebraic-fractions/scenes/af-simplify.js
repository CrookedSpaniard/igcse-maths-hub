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

// A fraction as factor chips on top and bottom; chips that match can be crossed out.
// draw(top, bottom, gone) — top/bottom are arrays of TeX factors; gone is a list of TeX factors cancelled on both sides.
FD.facFrac = (host) => (top, bot, gone = []) => {
  const chips = (list) => { const g = gone.slice(); return list.map((f) => { const k = g.indexOf(f); if (k >= 0) g.splice(k, 1); return `<span class="ff-c ${k >= 0 ? 'gone' : ''}">${FD.tex(f)}</span>`; }).join('') || '<span class="ff-c">\\(1\\)</span>'; };
  host.innerHTML = `<div class="ff"><div class="ff-row">${chips(top)}</div><div class="ff-bar"></div><div class="ff-row">${chips(bot)}</div></div>`;
  FD.typeset(host);
};
const afBr = (p) => `(${FD.poly([1, p])})`;
// Random (x+p)(x+q) / (x+p)(x+r) with distinct p, q, r.
const afTriple = () => { let p, q, r; do { p = FD.rndNZ(-7, 7); q = FD.rndNZ(-7, 7); r = FD.rndNZ(-7, 7); } while (new Set([p, q, r]).size < 3); return [p, q, r]; };

FD.add({
  id: 'af-simplify',
  title: 'Simplifying algebraic fractions',
  tab: 'Simplifying',
  icon: 'frac',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Algebraic fraction', 'A fraction whose top or bottom (or both) contains letters.'],
    ['Cancel', 'Divide the top and bottom by the same factor. You can only cancel <b>factors</b>, never single terms.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'af-s',
      vis: '<div class="ff-host" data-k="ff"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">New fraction ↻</button><button class="btn" data-k="fac">Factorise</button><button class="btn primary" data-k="can">Cancel</button></div>',
    });
    const ff = FD.facFrac(a.$('[data-k="ff"]'));
    a.ff = ff;
    let cur;
    const show = (stage) => {
      const [p, q, r] = cur;
      if (!stage) { ff([FD.poly([1, p + q, p * q])], [FD.poly([1, p + r, p * r])]); a.big(''); a.msg(''); return; }
      ff([afBr(p), afBr(q)], [afBr(p), afBr(r)], stage > 1 ? [afBr(p)] : []);
      if (stage > 1) a.msg(`\\(\\dfrac{${FD.poly([1, p + q, p * q])}}{${FD.poly([1, p + r, p * r])}} = \\dfrac{${FD.poly([1, q])}}{${FD.poly([1, r])}}\\)`);
    };
    a.$('[data-k="new"]').addEventListener('click', () => { cur = afTriple(); show(0); });
    a.$('[data-k="fac"]').addEventListener('click', () => show(1));
    a.$('[data-k="can"]').addEventListener('click', () => show(2));
    a.onTry = () => { cur = afTriple(); show(0); };
    return a;
  },
  steps: [
    {
      title: 'Cancel factors, like with numbers',
      text: '<p>\\(\\frac{12}{18} = \\frac{2 \\times 6}{3 \\times 6} = \\frac{2}{3}\\): we cancel the common <b>factor</b> 6.</p><p>Algebra works the same way: \\(\\frac{6x^2}{9x} = \\frac{2x \\times 3x}{3 \\times 3x} = \\frac{2x}{3}\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); a.ff(['2x', '3x'], ['3', '3x']); if (!(await ctx.sleep(1400))) return; a.ff(['2x', '3x'], ['3', '3x'], ['3x']); a.msg('\\(\\dfrac{6x^2}{9x} = \\dfrac{2x}{3}\\)'); },
    },
    {
      title: 'Factorise first',
      text: '<p>To simplify \\(\\frac{x^2 + 5x + 6}{x^2 - 4}\\), first <b>factorise</b> the top and the bottom. Then cancel the bracket they share.</p>',
      on: async (a, ctx) => {
        a.tryMode(false); a.ff(['x^2 + 5x + 6'], ['x^2 - 4']); a.big('');
        if (!(await ctx.sleep(1400))) return; a.ff(['(x + 2)', '(x + 3)'], ['(x + 2)', '(x - 2)']);
        if (!(await ctx.sleep(1400))) return; a.ff(['(x + 2)', '(x + 3)'], ['(x + 2)', '(x - 2)'], ['(x + 2)']);
        a.msg('\\(\\dfrac{x^2 + 5x + 6}{x^2 - 4} = \\dfrac{x + 3}{x - 2}\\)');
      },
    },
    {
      title: 'Never cancel terms',
      text: '<p>In \\(\\frac{x + 3}{x + 5}\\) you <b>cannot</b> cancel the \\(x\\)\'s. They are terms, not factors.</p><p>Test it with \\(x = 1\\): \\(\\frac{4}{6}\\) is not \\(\\frac{3}{5}\\).</p>',
      tip: 'Only cancel a whole bracket or a factor that multiplies everything.',
      async on(a) { a.tryMode(false); a.ff(['x + 3'], ['x + 5']); a.big(''); a.msg('\\(\\dfrac{x + 3}{x + 5}\\) is already in its simplest form.', 'bad'); },
    },
    {
      title: 'Watch for a minus sign',
      text: '<p>\\(3 - x = -(x - 3)\\). So \\(\\frac{3 - x}{x^2 - 9} = \\frac{-(x - 3)}{(x + 3)(x - 3)} = -\\frac{1}{x + 3}\\).</p>',
      on: FD.walk([['\\frac{3 - x}{x^2 - 9}', ''], ['= \\frac{-(x - 3)}{(x + 3)(x - 3)}', 'take out −1, factorise'], ['= -\\frac{1}{x + 3}', 'cancel (x − 3)']], (a) => { a.ff(['-1', '(x - 3)'], ['(x + 3)', '(x - 3)'], ['(x - 3)']); a.big(''); }, 1500),
    },
    {
      title: 'Try it: factorise and cancel',
      text: '<p>Press <b>New fraction</b>. Try to factorise the top and the bottom in your head, then press <b>Factorise</b> and <b>Cancel</b> to check.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'af-simplify',
  gens: [
    () => { const [p, q, r] = afTriple(); return { type: 'alg', q: `Simplify fully \\(\\dfrac{${FD.poly([1, p + q, p * q])}}{${FD.poly([1, p + r, p * r])}}\\)`, a: `(x${FD.sg(q).replace(/\s/g, '')})/(x${FD.sg(r).replace(/\s/g, '')})`, show: `\\(\\dfrac{${FD.poly([1, q])}}{${FD.poly([1, r])}}\\)`, hint: 'Type a fraction with brackets, e.g. (x + 3)/(x - 2).', why: `Factorise: \\(\\dfrac{${afBr(p)}${afBr(q)}}{${afBr(p)}${afBr(r)}}\\). Cancel \\(${afBr(p)}\\) to get \\(\\dfrac{${FD.poly([1, q])}}{${FD.poly([1, r])}}\\).` }; },
    () => { const k = FD.rnd(2, 6), p = FD.rndNZ(-7, 7); let q; do { q = FD.rndNZ(-7, 7); } while (q === p); return { type: 'alg', q: `Simplify fully \\(\\dfrac{${k}x${FD.sg(k * p)}}{${FD.poly([1, p + q, p * q])}}\\)`, a: `${k}/(x${FD.sg(q).replace(/\s/g, '')})`, show: `\\(\\dfrac{${k}}{${FD.poly([1, q])}}\\)`, hint: 'Type it like 3/(x + 4).', why: `Top: \\(${k}${afBr(p)}\\). Bottom: \\(${afBr(p)}${afBr(q)}\\). Cancel \\(${afBr(p)}\\): \\(\\dfrac{${k}}{${FD.poly([1, q])}}\\).` }; },
  ],
});

FD.check({
  section: 'af-simplify',
  items: [
    { type: 'alg', q: 'Simplify \\(\\frac{15x^3}{5x}\\)', a: '3x^2', show: '\\(3x^2\\)', why: '\\(15 \\div 5 = 3\\), \\(x^3 \\div x = x^2\\).' },
    { type: 'alg', q: 'Simplify fully \\(\\frac{x^2 + 7x + 10}{x^2 - 25}\\)', a: '(x+2)/(x-5)', show: '\\(\\frac{x + 2}{x - 5}\\)', hint: 'Type it like (x + 3)/(x - 2).', why: '\\(\\frac{(x + 2)(x + 5)}{(x + 5)(x - 5)}\\), cancel \\((x + 5)\\).' },
    { type: 'tf', q: '\\(\\frac{x + 6}{x + 2}\\) simplifies to \\(\\frac{6}{2} = 3\\).', a: false, why: 'The \\(x\\)\'s are terms, not factors, so they cannot be cancelled.' },
    { type: 'mcq', q: 'Simplify \\(\\frac{4x - 8}{x^2 - 2x}\\)', opts: ['\\(\\frac{4}{x}\\)', '\\(\\frac{4}{x - 2}\\)', '\\(\\frac{-8}{-2x}\\)', '\\(4x\\)'], why: '\\(\\frac{4(x - 2)}{x(x - 2)} = \\frac{4}{x}\\).' },
  ],
});
