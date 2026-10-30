// An on-screen calculator. keys(seq) lights the keys of a sequence one by one.
FD.CX_KEYS = ['(', ')', 'x²', '√', '÷', '7', '8', '9', '^', '×', '4', '5', '6', 'a/b', '−', '1', '2', '3', '(−)', '+', '0', '.', '×10ˣ', 'ANS', '='];
FD.calc = (host) => {
  host.innerHTML = `<div class="cx"><div class="cx-body"><div class="cx-scr"><div class="cx-in"></div><div class="cx-out"></div></div><div class="cx-keys">${FD.CX_KEYS.map((k) => `<span class="cx-k" data-k="${k}">${k}</span>`).join('')}</div></div><div class="cx-seq"></div></div>`;
  const $ = (s) => host.querySelector(s);
  return {
    show(seq, upto, out) {
      const done = seq.slice(0, upto);
      $('.cx-in').textContent = done.join(' ');
      $('.cx-out').textContent = upto >= seq.length ? out : '';
      host.querySelectorAll('.cx-k').forEach((k) => k.classList.toggle('on', upto > 0 && k.dataset.k === seq[upto - 1]));
      $('.cx-seq').innerHTML = seq.map((k, i) => `<span style="opacity:${i < upto ? 1 : 0.35}">${k}</span>`).join('');
    },
  };
};
// Calculations: [TeX, key sequence, display, note]
FD.CX = [
  ['\\frac{4.5 + 7.3}{2.1 - 0.6}', ['(', '4', '.', '5', '+', '7', '.', '3', ')', '÷', '(', '2', '.', '1', '−', '0', '.', '6', ')', '='], '7.8666666…', 'Put brackets round the top and the bottom.'],
  ['\\sqrt{3.2^2 + 4.1^2}', ['√', '(', '3', '.', '2', 'x²', '+', '4', '.', '1', 'x²', ')', '='], '5.2009614…', 'Close the bracket after everything under the root.'],
  ['(-3)^4', ['(', '(−)', '3', ')', '^', '4', '='], '81', 'Without brackets, −3^4 gives −81.'],
  ['\\tfrac{3}{8} + \\tfrac{5}{6}', ['3', 'a/b', '8', '+', '5', 'a/b', '6', '='], '29/24', 'The fraction key keeps the answer exact.'],
  ['2.4 \\times 10^{5} \\div (6 \\times 10^{-3})', ['2', '.', '4', '×10ˣ', '5', '÷', '(', '6', '×10ˣ', '(−)', '3', ')', '='], '40 000 000', 'Use ×10ˣ for standard form.'],
];

FD.add({
  id: 'calculator',
  title: 'Using a scientific calculator',
  tab: 'Calculator',
  icon: 'calc',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Brackets', 'A calculator follows BIDMAS. Use brackets for the top and bottom of a fraction, and for negative numbers you raise to a power.'],
    ['(−) key', 'Makes a number negative. It is different from the subtract key.'],
    ['Display', 'Write down all the figures on the display first, then round.'],
    ['Sense check', 'Estimate first, so you can spot a key you pressed by mistake.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ca-s', '<div id="cx"></div>', `
      <div class="bd-row"><label>Calculation <select id="pick">${FD.CX.map((c, i) => `<option value="${i}">Example ${i + 1}</option>`).join('')}</select></label></div>
      <div class="bd-btns"><button class="btn" id="bKey">Press the next key ▶</button><button class="btn ghost" id="bAll">Show all</button></div>`, () => start());
    a.cx = FD.calc(a.$('#cx'));
    let k = 0;
    const cur = () => FD.CX[+a.$('#pick').value];
    const start = () => { k = 0; const c = cur(); a.big(c[0]); a.cx.show(c[1], 0, c[2]); a.msg(c[3]); };
    a.$('#pick').addEventListener('input', start);
    a.$('#bKey').addEventListener('click', () => { const c = cur(); if (k < c[1].length) k++; a.cx.show(c[1], k, c[2]); });
    a.$('#bAll').addEventListener('click', () => { const c = cur(); k = c[1].length; a.cx.show(c[1], k, c[2]); });
    a.run = async (i, ctx, ms = 260) => { const c = FD.CX[i]; a.big(c[0]); for (let s = 0; s <= c[1].length; s++) { a.cx.show(c[1], s, c[2]); if (!(await ctx.sleep(ms))) return false; } a.msg(c[3]); return true; };
    a.cx.show(FD.CX[0][1], 0, '');
    return a;
  },
  steps: [
    {
      title: 'Fractions need brackets',
      text: '<p>Work out \\(\\dfrac{4.5 + 7.3}{2.1 - 0.6}\\). The fraction line is a bracket: type <b>( top ) ÷ ( bottom )</b>.</p><p>Without brackets the calculator does 7.3 ÷ 2.1 first and gives the wrong answer.</p>',
      async on(a, ctx) { a.reset(); await a.run(0, ctx); },
    },
    {
      title: 'Powers and roots',
      text: '<p>For \\(\\sqrt{3.2^2 + 4.1^2}\\), open a bracket after the root and close it at the end.</p><p>For \\((-3)^4\\), use the (−) key <b>inside</b> brackets.</p>',
      async on(a, ctx) { a.reset(); if (!(await a.run(1, ctx, 220))) return; if (!(await ctx.sleep(1000))) return; await a.run(2, ctx, 300); },
    },
    {
      title: 'Fractions and standard form',
      text: '<p>The <b>a/b</b> key gives exact fraction answers. The <b>×10ˣ</b> key types standard form.</p>',
      tip: 'The S⇔D key switches an answer between a fraction and a decimal.',
      async on(a, ctx) { a.reset(); if (!(await a.run(3, ctx, 300))) return; if (!(await ctx.sleep(1000))) return; await a.run(4, ctx, 220); },
    },
    {
      title: 'Writing down and rounding',
      text: '<p>Write down <b>all</b> the figures on the display first, then round to what the question asks. This earns method marks even if you round wrongly.</p>',
      async on(a, ctx) {
        a.reset(); a.cx.show(FD.CX[1][1], FD.CX[1][1].length, FD.CX[1][2]);
        await a.lines([['\\sqrt{3.2^2 + 4.1^2} = 5.2009614\\dots', 'all the figures'], ['= 5.20 \\; (3 \\text{ s.f.})', 'then round'], ['\\text{estimate: } \\sqrt{9 + 16} = 5 \\; \\checkmark', 'sense check']], ctx, 1400);
      },
    },
    {
      title: 'Try it: press the keys',
      text: '<p>Choose a calculation and press the keys one at a time. Try it on your own calculator too.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'calculator',
  gens: [
    () => { let p, q, r, s; do { p = FD.rnd(12, 99) / 10; q = FD.rnd(12, 99) / 10; r = FD.rnd(30, 99) / 10; s = FD.rnd(1, 29) / 10; } while (r - s < 0.5); const v = (p + q) / (r - s); return { type: 'num', q: `Use your calculator to work out \\(\\dfrac{${p} + ${q}}{${r} - ${s}}\\). Give your answer to 3 significant figures.`, a: FD.sigfig(v, 3), tol: Math.abs(FD.sigfig(v, 3)) * 0.0006 + 1e-9, why: `Type ( ${p} + ${q} ) ÷ ( ${r} − ${s} ) =. Display: ${v.toFixed(6)}… → ${FD.sigfig(v, 3)}.` }; },
    () => { const p = FD.rnd(11, 99) / 10, q = FD.rnd(11, 99) / 10, v = Math.sqrt(p * p + q * q); return { type: 'num', q: `Work out \\(\\sqrt{${p}^2 + ${q}^2}\\). Give your answer to 2 decimal places.`, a: FD.round(v, 2), tol: 0.0051, why: `√ ( ${p} x² + ${q} x² ) = ${v.toFixed(5)}… → ${FD.round(v, 2).toFixed(2)}.` }; },
    () => { const b = FD.rnd(2, 6), k = FD.pick([2, 4]); return { type: 'mcq', q: `Which key sequence works out \\((-${b})^{${k}}\\) correctly?`, opts: [`( (−) ${b} ) ^ ${k} =`, `(−) ${b} ^ ${k} =`, `− ${b} ^ ${k} =`, `${b} ^ ${k} (−) =`], why: `Without brackets the calculator works out \\(-(${b}^{${k}}) = -${b ** k}\\). With brackets it gives ${b ** k}.` }; },
  ],
});

FD.check({
  section: 'calculator',
  items: [
    { type: 'num', q: 'Work out \\(\\dfrac{12.6 \\times 3.4}{5.1 + 2.9}\\). Give your answer to 3 significant figures.', a: 5.36, tol: 0.006, why: '\\(42.84 \\div 8 = 5.355\\) → 5.36.' },
    { type: 'num', q: 'Work out \\(\\sqrt{17.3 - 2.9} \\times 1.5\\).', a: 5.69, tol: 0.006, why: '\\(\\sqrt{14.4} = 3.7947\\dots\\), × 1.5 = 5.692… (accept 5.69).' },
    { type: 'mcq', q: 'Ben types 8 + 4 ÷ 2 = for \\(\\dfrac{8 + 4}{2}\\). What does he get?', opts: ['10', '6', '12', '4'], why: 'The calculator divides first: 8 + 2 = 10. He needed ( 8 + 4 ) ÷ 2 = 6.' },
    { type: 'tf', q: 'You should write down all the figures on the display before rounding.', a: true, why: 'It shows your method and avoids rounding errors.' },
  ],
});
