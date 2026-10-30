FD.add({
  id: 'addsub',
  title: 'Adding, subtracting and calculators',
  tab: '+ and −',
  icon: 'calc',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Adding and subtracting', 'Change both numbers to ordinary numbers (or to the same power of 10) first. You cannot just add the powers.'],
    ['Calculator key', 'Use ×10ˣ (or EXP): 3.2 ×10ˣ 5 types \\(3.2 \\times 10^5\\).'],
    ['Reading the display', 'A display such as 4.7E-06 means \\(4.7 \\times 10^{-6}\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'as-s', '<div class="mbig" id="eq"></div>', `
      <label class="ctrl">First A <input type="range" id="a1" min="10" max="99" value="32"><output id="o1">3.2</output></label>
      <label class="ctrl">Second A <input type="range" id="a2" min="10" max="99" value="45"><output id="o2">4.5</output></label>
      <label class="ctrl">Second power (first is 5) <input type="range" id="n2" min="2" max="5" value="4"><output id="o3">4</output></label>`, () => sync());
    a.eq = (t) => { a.$('#eq').innerHTML = FD.tex(t, true); };
    const sync = () => {
      const A1 = +a.$('#a1').value / 10, A2 = +a.$('#a2').value / 10, n2 = +a.$('#n2').value; a.$('#o1').textContent = A1; a.$('#o2').textContent = A2; a.$('#o3').textContent = n2;
      const x = Math.round(A1 * 1e5), y = Math.round(A2 * 10 ** n2);
      a.eq(`${A1} \\times 10^5 + ${A2} \\times 10^{${n2}}`);
      a.big(`= ${FD.ordTex(x)} + ${FD.ordTex(y)} = ${FD.ordTex(x + y)} = ${FD.sfTex(x + y)}`);
      a.msg('Write both as ordinary numbers, add, then change back to standard form.');
    };
    ['#a1', '#a2', '#n2'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.eq('');
    return a;
  },
  steps: [
    {
      title: 'Adding: use ordinary numbers',
      text: '<p>\\(3.2 \\times 10^5 + 4.5 \\times 10^4\\). The powers are different, so you cannot just add the A parts.</p><p>Write both as ordinary numbers first.</p>',
      tip: 'Never add the powers when you add the numbers!',
      async on(a, ctx) {
        a.reset(); a.eq('3.2 \\times 10^5 + 4.5 \\times 10^4');
        await a.lines([['= 320\\,000 + 45\\,000', ''], ['= 365\\,000', ''], ['= 3.65 \\times 10^5', '']], ctx, 1300);
      },
    },
    {
      title: 'Subtracting',
      text: '<p>\\(6 \\times 10^{-3} - 8 \\times 10^{-4}\\). The same method works with small numbers.</p>',
      async on(a, ctx) {
        a.reset(); a.eq('6 \\times 10^{-3} - 8 \\times 10^{-4}');
        await a.lines([['= 0.006 - 0.0008', ''], ['= 0.0052', ''], ['= 5.2 \\times 10^{-3}', '']], ctx, 1300);
      },
    },
    {
      title: 'Using a calculator',
      text: '<p>Type standard form with the <b>×10ˣ</b> key (on some calculators EXP). For \\(\\dfrac{3.2 \\times 10^5}{4 \\times 10^{-3}}\\): 3.2 ×10ˣ 5 ÷ 4 ×10ˣ −3 =.</p><p>The answer \\(8 \\times 10^7\\) may appear as 80 000 000 or as 8E+07.</p>',
      tip: 'If you type × 10 ^ yourself, put brackets round each number.',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{3.2 \\times 10^5}{4 \\times 10^{-3}}');
        await a.lines([['= 80\\,000\\,000', 'calculator'], ['= 8 \\times 10^7', ''], ['\\text{display } 4.7\\text{E-}06 = 4.7 \\times 10^{-6}', 'reading a display']], ctx, 1400);
      },
    },
    {
      title: 'Try it: add two numbers',
      text: '<p>Choose two numbers in standard form. They are changed into ordinary numbers, added, then changed back.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'addsub',
  gens: [
    () => { const A1 = FD.rnd(11, 99), A2 = FD.rnd(11, 99), n1 = FD.rnd(4, 7), d = FD.rnd(1, 2), x = A1 * 10 ** (n1 - 1), y = A2 * 10 ** (n1 - d - 1), [A, n] = FD.sfp(x + y); return { type: 'num', q: `Work out \\(${A1 / 10} \\times 10^{${n1}} + ${A2 / 10} \\times 10^{${n1 - d}}\\). Give your answer in standard form.`, a: [A, n], fields: ['A =', 'n ='], why: `\\(${FD.ordTex(x)} + ${FD.ordTex(y)} = ${FD.ordTex(x + y)} = ${A} \\times 10^{${n}}\\).` }; },
    () => { const A1 = FD.rnd(2, 9), A2 = FD.rnd(1, 9), n = FD.rnd(2, 5), x = A1 * 10 ** -n, y = A2 * 10 ** (-n - 1), r = +(x - y).toPrecision(8), [A, m] = FD.sfp(r); return { type: 'num', q: `Work out \\(${A1} \\times 10^{-${n}} - ${A2} \\times 10^{-${n + 1}}\\). Give your answer in standard form.`, a: [A, m], fields: ['A =', 'n ='], why: `\\(${+x.toPrecision(6)} - ${+y.toPrecision(6)} = ${r} = ${A} \\times 10^{${m}}\\).` }; },
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rndNZ(-9, 9); return { type: 'mcq', q: `A calculator shows ${A}E${n < 0 ? '-' : '+'}${String(Math.abs(n)).padStart(2, '0')}. What number is this?`, opts: [`\\(${A} \\times 10^{${n}}\\)`, `\\(${A}^{${n}}\\)`, `\\(${A} \\times ${n}\\)`, `\\(${A} \\times 10^{${-n}}\\)`], why: `E${n < 0 ? '-' : '+'}${String(Math.abs(n)).padStart(2, '0')} means “times 10 to the power ${n}”.` }; },
  ],
});

FD.check({
  section: 'addsub',
  items: [
    { type: 'num', q: 'Work out \\(5 \\times 10^4 + 3 \\times 10^3\\) in standard form.', a: [5.3, 4], fields: ['A =', 'n ='], why: '\\(50\\,000 + 3000 = 53\\,000\\).' },
    { type: 'num', q: 'Work out \\(4 \\times 10^{-2} - 7 \\times 10^{-3}\\) in standard form.', a: [3.3, -2], fields: ['A =', 'n ='], why: '\\(0.04 - 0.007 = 0.033\\).' },
    { type: 'tf', q: '\\(2 \\times 10^3 + 3 \\times 10^4 = 5 \\times 10^7\\)', a: false, why: '\\(2000 + 30\\,000 = 32\\,000 = 3.2 \\times 10^4\\).' },
    { type: 'mcq', q: 'Which key sequence enters \\(6.1 \\times 10^{-4}\\)?', opts: ['6.1 ×10ˣ (−) 4', '6.1 × 10 × −4', '6.1 ^ −4', '6.1 ×10ˣ 4 −'], why: 'Number, ×10ˣ key, then the power.' },
  ],
});
