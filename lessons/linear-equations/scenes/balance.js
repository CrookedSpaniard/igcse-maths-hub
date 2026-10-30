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

// Balance scales: x-bags and 1-weights on each pan. The beam tilts towards the heavier side,
// using the value of x given (the true solution when it is not set).
// draw({ lx, ln, rx, rn }, x, guess?) — guess = a value of x to test; the beam tilts if it is wrong.
FD.balance = (host) => {
  host.innerHTML = `<svg class="bal" viewBox="0 -110 600 380" role="img" aria-label="Balance scales"><polygon class="bal-st" points="300,70 280,250 320,250"/><rect class="bal-st" x="230" y="248" width="140" height="10" rx="4"/><g class="bal-arm"></g></svg>`;
  const arm = host.querySelector('.bal-arm'), svg = host.querySelector('svg');
  const pile = (nx, nn, cx, top) => {
    const items = [...Array(Math.min(nx, 12)).fill('x'), ...Array(Math.min(nn, 24)).fill('1')];
    return items.map((t, k) => {
      const row = Math.floor(k / 6), col = k % 6;
      const x = cx - 84 + col * 28 + (t === 'x' ? 0 : 4), y = top - 34 - row * 34 + (t === 'x' ? 0 : 8);
      return t === 'x' ? `<g class="bal-x"><rect x="${x}" y="${y}" width="30" height="30" rx="7"/><text x="${x + 15}" y="${y + 21}">x</text></g>` : `<rect class="bal-1" x="${x}" y="${y}" width="22" height="22" rx="4"/>`;
    }).join('');
  };
  return (st, x, guess) => {
    const v = guess == null ? x : guess, L = st.lx * v + st.ln, R = st.rx * v + st.rn;
    const ang = Math.max(-11, Math.min(11, (R - L) * 1.2));
    // SVG rotation is clockwise, so a negative angle lowers the left pan
    arm.setAttribute('style', `transform: rotate(${ang}deg); transform-origin: 300px 70px;`);
    arm.innerHTML = `<line class="bal-beam" x1="110" y1="70" x2="490" y2="70"/><circle class="bal-pin" cx="300" cy="70" r="7"/>
      <g style="transform: rotate(${-ang}deg); transform-origin: 130px 70px;"><path class="bal-pan" d="M40 150 L220 150 L206 166 L54 166 Z"/><line class="bal-str" x1="130" y1="70" x2="44" y2="150"/><line class="bal-str" x1="130" y1="70" x2="216" y2="150"/></g>
      <g style="transform: rotate(${-ang}deg); transform-origin: 470px 70px;"><path class="bal-pan" d="M380 150 L560 150 L546 166 L394 166 Z"/><line class="bal-str" x1="470" y1="70" x2="384" y2="150"/><line class="bal-str" x1="470" y1="70" x2="556" y2="150"/></g>
      <g style="transform: rotate(${-ang}deg); transform-origin: 130px 70px;">${pile(st.lx, st.ln, 130, 150)}</g>
      <g style="transform: rotate(${-ang}deg); transform-origin: 470px 70px;">${pile(st.rx, st.rn, 470, 150)}</g>`;
    svg.setAttribute('aria-label', `Balance: ${st.lx} x and ${st.ln} ones on the left, ${st.rx} x and ${st.rn} ones on the right${Math.abs(L - R) < 1e-9 ? ', level' : ''}`);
  };
};
const leSide = (nx, nn) => (nx ? `${nx === 1 ? '' : nx}x` : '') + (nx && nn ? ` + ${nn}` : nx ? '' : String(nn));
const leEq = (s) => `${leSide(s.lx, s.ln)} = ${leSide(s.rx, s.rn)}`;

FD.add({
  id: 'balance',
  title: 'The balance method',
  tab: 'Balance method',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Solve', 'Find the value of the letter that makes the equation true.'],
    ['Balance method', 'Do the same operation to both sides so the equation stays true.'],
    ['Solution', 'The value that makes the equation true. Check it by substituting.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'le-b',
      vis: '<div class="bal-host" data-k="bal"></div>',
      tryHtml: `<div class="chk-btns"><button class="btn" data-k="m1">Take 1 from both sides</button><button class="btn" data-k="mx">Take an x from both sides</button><button class="btn" data-k="div">Share both sides</button></div>
        <div class="chk-btns"><button class="btn ghost" data-k="new">New puzzle ↻</button></div>`,
    });
    const bal = FD.balance(a.$('[data-k="bal"]'));
    a.bal = bal;
    let st, sol, moves = 0;
    const show = () => {
      bal(st, sol); a.big(leEq(st));
      if (st.lx === 1 && !st.rx && !st.ln) a.msg(`✓ Solved: \\(x = ${st.rn}\\) in ${moves} move${moves === 1 ? '' : 's'}. Check: it balances.`);
    };
    const newPuzzle = () => {
      // k x + b = c x + d with d = (k − c) × solution + b
      let k, c, b;
      do { sol = FD.rnd(1, 6); c = FD.rnd(0, 2); k = c + FD.rnd(1, 3); b = FD.rnd(0, 6); } while ((k - c) * sol + b > 24 || (k === 1 && !c && !b));
      st = { lx: k, ln: b, rx: c, rn: (k - c) * sol + b };
      moves = 0; a.msg(''); show();
    };
    a.$('[data-k="m1"]').addEventListener('click', () => { if (st.ln > 0 && st.rn > 0) { st.ln--; st.rn--; moves++; show(); } else a.msg('One side has no 1-weights left to take.', 'bad'); });
    a.$('[data-k="mx"]').addEventListener('click', () => { if (st.lx > 0 && st.rx > 0) { st.lx--; st.rx--; moves++; show(); } else a.msg('There is no x on one of the sides.', 'bad'); });
    a.$('[data-k="div"]').addEventListener('click', () => {
      if (st.ln || st.rx) { a.msg('Get the x\'s alone on one side and only 1-weights on the other first.', 'bad'); return; }
      if (st.lx > 1 && st.rn % st.lx === 0) { a.msg(`Share both sides into ${st.lx} equal groups: \\(x = ${st.rn / st.lx}\\).`); st.rn /= st.lx; st.lx = 1; moves++; show(); }
    });
    a.$('[data-k="new"]').addEventListener('click', newPuzzle);
    a.onTry = newPuzzle;
    bal({ lx: 2, ln: 3, rx: 0, rn: 11 }, 4);
    return a;
  },
  steps: [
    {
      title: 'An equation is a balance',
      text: '<p>\\(2x + 3 = 11\\). The left pan has two bags of \\(x\\) and 3 weights. The right pan has 11 weights. They balance.</p><p>To find \\(x\\), we must keep the scales level.</p>',
      async on(a) { a.tryMode(false); a.bal({ lx: 2, ln: 3, rx: 0, rn: 11 }, 4); a.big('2x + 3 = 11'); },
    },
    {
      title: 'Do the same to both sides',
      text: '<p>Take 3 weights off <b>both</b> pans: \\(2x = 8\\). Then share both sides into 2 equal groups: \\(x = 4\\).</p>',
      tip: 'If you only change one side, the scales tip and the equation is no longer true.',
      async on(a, ctx) {
        a.tryMode(false);
        const seq = [[{ lx: 2, ln: 3, rx: 0, rn: 11 }, '2x + 3 = 11', ''], [{ lx: 2, ln: 3, rx: 0, rn: 8 }, '2x + 3 \\;?\\; 8', 'Only the right side changed: it tips!'], [{ lx: 2, ln: 0, rx: 0, rn: 8 }, '2x = 8', '− 3 from both sides: level again.'], [{ lx: 1, ln: 0, rx: 0, rn: 4 }, 'x = 4', '÷ 2 both sides.']];
        for (const [s, t, m] of seq) { a.bal(s, 4); a.big(t); a.msg(m, m.includes('tips') ? 'bad' : 'good'); if (!(await ctx.sleep(1500))) return; }
      },
    },
    {
      title: 'Written out',
      text: '<p>We write each step and say what we did to both sides. Then <b>check</b> by substituting the answer.</p>',
      on: FD.walk([['2x + 3 = 11', ''], ['2x = 8', '− 3 both sides'], ['x = 4', '÷ 2 both sides'], ['\\text{Check: } 2(4) + 3 = 11 \\;\\checkmark', '']], (a) => { a.bal({ lx: 1, ln: 0, rx: 0, rn: 4 }, 4); a.big(''); }),
    },
    {
      title: 'Negatives and division',
      text: '<p>The same rules work with any numbers. Undo + with −, − with +, × with ÷ and ÷ with ×.</p>',
      on: FD.walk([['5x - 7 = 18 \\Rightarrow 5x = 25 \\Rightarrow x = 5', '+ 7, then ÷ 5'], ['\\frac{x}{3} + 2 = 6 \\Rightarrow \\frac{x}{3} = 4 \\Rightarrow x = 12', '− 2, then × 3'], ['4x + 9 = 1 \\Rightarrow 4x = -8 \\Rightarrow x = -2', 'answers can be negative']], (a) => { a.bal({ lx: 1, ln: 0, rx: 0, rn: 5 }, 5); a.big(''); }, 1600),
    },
    {
      title: 'Try it: solve with the scales',
      text: '<p>Use the buttons to change both pans at once. Get one \\(x\\) on its own on the left.</p><p>Can you solve it in as few moves as possible?</p>',
      tip: 'Take away the x\'s from the right first, then the weights from the left, then share.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'balance',
  gens: [
    () => { const a = FD.rnd(2, 9), x = FD.rndNZ(-9, 12), b = FD.rndNZ(-15, 15), c = a * x + b; return { type: 'num', q: `Solve \\(${a}x${FD.sg(b)} = ${c}\\)`, a: x, why: `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: \\(${a}x = ${c - b}\\). Divide by ${a}: \\(x = ${x}\\).` }; },
    () => { const d = FD.rnd(2, 6), x = d * FD.rndNZ(-5, 8), b = FD.rnd(1, 12), c = x / d + b; return { type: 'num', q: `Solve \\(\\dfrac{x}{${d}} + ${b} = ${c}\\)`, a: x, why: `Subtract ${b}: \\(\\dfrac{x}{${d}} = ${c - b}\\). Multiply by ${d}: \\(x = ${x}\\).` }; },
    () => { const a = FD.rnd(2, 8), b = FD.rnd(1, 9); let c; do { c = FD.rnd(-10, 30); } while ((c - b) % a === 0); return { type: 'num', q: `Solve \\(${a}x + ${b} = ${c}\\). Give your answer as a fraction or a decimal.`, a: (c - b) / a, tol: 0.01, show: `\\(${FD.ftex(c - b, a)}\\)`, hint: 'A fraction like 7/3 is fine.', why: `\\(${a}x = ${c - b}\\), so \\(x = ${FD.ftex(c - b, a)}\\).` }; },
  ],
});

FD.check({
  section: 'balance',
  items: [
    { type: 'num', q: 'Solve \\(3x + 4 = 19\\)', a: 5, why: '\\(3x = 15\\), \\(x = 5\\).' },
    { type: 'num', q: 'Solve \\(7x - 2 = -16\\)', a: -2, why: '\\(7x = -14\\), \\(x = -2\\).' },
    { type: 'num', q: 'Solve \\(\\frac{x}{5} - 3 = 4\\)', a: 35, why: '\\(\\frac{x}{5} = 7\\), \\(x = 35\\).' },
    { type: 'mcq', q: 'What is the first step to solve \\(4x + 9 = 33\\)?', opts: ['Subtract 9 from both sides', 'Divide the left side by 4', 'Add 9 to both sides', 'Subtract 4 from both sides'], why: 'Undo the + 9 first, on both sides.' },
    { type: 'tf', q: '\\(x = 3\\) is the solution of \\(5x - 1 = 16\\).', a: false, why: '\\(5(3) - 1 = 14\\), not 16. The solution is \\(x = 3.4\\).' },
  ],
});
