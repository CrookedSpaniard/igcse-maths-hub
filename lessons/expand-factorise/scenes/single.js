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

// The grid method: headers along the top (cols) and down the side (rows); cells are the products.
// draw(cols, rows, cells, { show: k cells shown, hl: index of the highlighted cell, hideHead })
FD.gridM = (host) => (cols, rows, cells, o = {}) => {
  const n = o.show == null ? 99 : o.show, flat = rows.flatMap((r, i) => cols.map((c, j) => [i, j]));
  host.innerHTML = `<div class="gm" style="grid-template-columns: 3.4rem repeat(${cols.length}, minmax(0, 1fr))">
    <span class="gm-x">×</span>${cols.map((c) => `<span class="gm-h">${o.hideHead === 'cols' ? '?' : FD.tex(c)}</span>`).join('')}
    ${rows.map((r, i) => `<span class="gm-h">${o.hideHead === 'rows' ? '?' : FD.tex(r)}</span>${cols.map((c, j) => { const k = flat.findIndex(([a, b]) => a === i && b === j); return `<span class="gm-c ${k === o.hl ? 'hl' : ''} ${k < n ? 'on' : ''}">${k < n ? FD.tex(cells[i][j]) : ''}</span>`; }).join('')}`).join('')}
  </div>`;
};
const efTerm = (c, v) => (v ? (c === 1 ? '' : c === -1 ? '-' : c) + v : String(c));

FD.add({
  id: 'single',
  title: 'Expanding single brackets',
  tab: 'Single brackets',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Expand', 'Multiply out the brackets: \\(3(x + 4) = 3x + 12\\).'],
    ['Expand and simplify', 'Multiply out, then collect like terms.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ef-s',
      vis: '<div class="gm-host" data-k="grid"></div>',
      tryHtml: `<label class="ctrl">Outside \\(k\\) <input type="range" data-k="k" min="-6" max="6" value="3"><output data-k="ok">3</output></label>
        <label class="ctrl">Inside \\(p\\) <input type="range" data-k="p" min="1" max="5" value="2"><output data-k="op">2</output></label>
        <label class="ctrl">Inside \\(q\\) <input type="range" data-k="q" min="-9" max="9" value="5"><output data-k="oq">5</output></label>`,
    });
    const grid = FD.gridM(a.$('[data-k="grid"]'));
    a.grid = grid;
    const sync = () => {
      let k = +a.$('[data-k="k"]').value; if (!k) { k = 1; a.$('[data-k="k"]').value = 1; }
      const p = +a.$('[data-k="p"]').value, q = +a.$('[data-k="q"]').value;
      ['k', 'p', 'q'].forEach((n) => { a.$(`[data-k="o${n}"]`).textContent = String({ k, p, q }[n]).replace('-', '−'); });
      grid([efTerm(p, 'x'), String(q)], [String(k)], [[efTerm(k * p, 'x'), String(k * q)]]);
      a.big(`${k === 1 ? '' : k === -1 ? '-' : k}(${FD.poly([p, q])}) = ${FD.poly([k * p, k * q])}`);
    };
    ['k', 'p', 'q'].forEach((n) => a.$(`[data-k="${n}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Multiply everything inside',
      text: '<p>To expand \\(3(x + 4)\\), multiply <b>each term</b> inside the bracket by the 3 outside.</p><p>The grid shows both products: \\(3 \\times x = 3x\\) and \\(3 \\times 4 = 12\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('3(x + 4)');
        for (let s = 0; s <= 2; s++) { a.grid(['x', '4'], ['3'], [['3x', '12']], { show: s, hl: s - 1 }); if (!(await ctx.sleep(1100))) return; }
        a.big('3(x + 4) = 3x + 12');
      },
    },
    {
      title: 'Negative numbers outside',
      text: '<p>The sign belongs to the number. In \\(-2(y - 5)\\) you multiply by \\(-2\\).</p><p>\\(-2 \\times y = -2y\\) and \\(-2 \\times -5 = +10\\).</p>',
      tip: 'Negative × negative = positive.',
      async on(a, ctx) {
        a.tryMode(false); a.big('-2(y - 5)');
        for (let s = 0; s <= 2; s++) { a.grid(['y', '-5'], ['-2'], [['-2y', '+10']], { show: s, hl: s - 1 }); if (!(await ctx.sleep(1100))) return; }
        a.big('-2(y - 5) = -2y + 10');
      },
    },
    {
      title: 'Letters outside',
      text: '<p>A letter outside works the same way: \\(x(x + 7) = x^2 + 7x\\) and \\(2a(3a - b) = 6a^2 - 2ab\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('2a(3a - b)');
        for (let s = 0; s <= 2; s++) { a.grid(['3a', '-b'], ['2a'], [['6a^2', '-2ab']], { show: s, hl: s - 1 }); if (!(await ctx.sleep(1100))) return; }
        a.big('2a(3a - b) = 6a^2 - 2ab');
      },
    },
    {
      title: 'Expand and simplify',
      text: '<p>When there are two brackets, expand each one, then <b>collect like terms</b>.</p>',
      tip: 'Take care with a minus in front of a bracket: \\(-3(x - 2) = -3x + 6\\).',
      on: FD.walk([['4(x + 3) - 3(x - 2)', ''], ['= 4x + 12 - 3x + 6', 'expand each bracket'], ['= x + 18', 'collect like terms']], (a) => { a.grid([], [], []); a.big(''); }),
    },
    {
      title: 'Try it: build your own',
      text: '<p>Choose the number outside and the two terms inside. Watch the grid and the answer change.</p>',
      tip: 'Make \\(k\\) negative and \\(q\\) negative. What happens to the last term?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'single',
  gens: [
    () => { const k = FD.rndNZ(-7, 9), p = FD.rnd(1, 5), q = FD.rndNZ(-9, 9), kt = k === 1 ? '' : k === -1 ? '-' : k; return { type: 'alg', q: `Expand \\(${kt}(${FD.poly([p, q])})\\)`, a: FD.poly([k * p, k * q], 'x', true), form: 'expanded', show: `\\(${FD.poly([k * p, k * q])}\\)`, hint: 'Type it like 6x - 15.', why: `\\(${k} \\times ${efTerm(p, 'x')} = ${efTerm(k * p, 'x')}\\) and \\(${k} \\times ${q} = ${k * q}\\). So \\(${FD.poly([k * p, k * q])}\\).` }; },
    () => { const p = FD.rnd(2, 5), q = FD.rnd(2, 6), r = FD.rnd(2, 5), s = FD.rnd(1, 7); const lin = [p - r, p * q + r * s]; return { type: 'alg', q: `Expand and simplify \\(${p}(x + ${q}) - ${r}(x - ${s})\\)`, a: FD.poly(lin, 'x', true), form: 'expanded', show: `\\(${FD.poly(lin)}\\)`, hint: 'Type it like 2x + 11.', why: `\\(${p}x + ${p * q} - ${r}x + ${r * s}\\). Collect: \\(${FD.poly(lin)}\\).` }; },
    () => { const p = FD.rnd(2, 5), q = FD.rndNZ(-8, 8); return { type: 'alg', q: `Expand \\(x(${FD.poly([p, q])})\\)`, a: FD.poly([p, q, 0], 'x', true), form: 'expanded', show: `\\(${FD.poly([p, q, 0])}\\)`, hint: 'Type powers with ^, e.g. 3x^2 + 5x.', why: `\\(x \\times ${p}x = ${p}x^2\\) and \\(x \\times ${q} = ${efTerm(q, 'x')}\\).` }; },
  ],
});

FD.check({
  section: 'single',
  items: [
    { type: 'alg', q: 'Expand \\(5(2x - 3)\\)', a: '10x-15', form: 'expanded', show: '\\(10x - 15\\)', why: '\\(5 \\times 2x = 10x\\), \\(5 \\times -3 = -15\\).' },
    { type: 'mcq', q: 'Expand \\(-4(a - 2)\\)', opts: ['\\(-4a + 8\\)', '\\(-4a - 8\\)', '\\(4a - 8\\)', '\\(-4a - 2\\)'], why: '\\(-4 \\times -2 = +8\\).' },
    { type: 'alg', q: 'Expand \\(y(3y + 4)\\)', a: '3y^2+4y', form: 'expanded', show: '\\(3y^2 + 4y\\)', why: '\\(y \\times 3y = 3y^2\\), \\(y \\times 4 = 4y\\).' },
    { type: 'alg', q: 'Expand and simplify \\(2(x + 5) + 3(x - 1)\\)', a: '5x+7', form: 'expanded', show: '\\(5x + 7\\)', why: '\\(2x + 10 + 3x - 3 = 5x + 7\\).' },
    { type: 'tf', q: '\\(3(x + 2) = 3x + 2\\)', a: false, why: 'The 3 multiplies both terms: \\(3x + 6\\).' },
  ],
});
