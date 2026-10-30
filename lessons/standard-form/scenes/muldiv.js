FD.add({
  id: 'muldiv',
  title: 'Multiplying and dividing',
  tab: '× and ÷',
  icon: 'calc',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Multiplying', 'Multiply the A parts and <b>add</b> the powers: \\((a \\times 10^m)(b \\times 10^n) = ab \\times 10^{m+n}\\).'],
    ['Dividing', 'Divide the A parts and <b>subtract</b> the powers.'],
    ['Tidy up', 'If the new A is not between 1 and 10, adjust it at the end.'],
  ],
  mount(el) {
    const a = FD.board(el, 'md-s', '<div class="mbig" id="eq"></div>', `
      <label class="ctrl">First A <input type="range" id="a1" min="1" max="9" value="4"><output id="o1">4</output></label>
      <label class="ctrl">First power <input type="range" id="n1" min="-5" max="8" value="6"><output id="o2">6</output></label>
      <label class="ctrl">Second A <input type="range" id="a2" min="1" max="9" value="3"><output id="o3">3</output></label>
      <label class="ctrl">Second power <input type="range" id="n2" min="-5" max="8" value="-2"><output id="o4">−2</output></label>
      <div class="bd-row"><label>Operation <select id="op"><option value="m">×</option><option value="d">÷</option></select></label></div>`, () => sync());
    a.eq = (t) => { a.$('#eq').innerHTML = FD.tex(t, true); };
    const sync = () => {
      const [A1, N1, A2, N2] = ['a1', 'n1', 'a2', 'n2'].map((k, i) => { const v = +a.$('#' + k).value; a.$('#o' + (i + 1)).textContent = v < 0 ? '−' + -v : v; return v; }), m = a.$('#op').value === 'm';
      const raw = m ? A1 * A2 : FD.round(A1 / A2, 6), pw = m ? N1 + N2 : N1 - N2, [A, n] = FD.sfp(raw * 10 ** pw);
      a.eq(`(${A1} \\times 10^{${N1}}) ${m ? '\\times' : '\\div'} (${A2} \\times 10^{${N2}})`);
      a.big(`= ${raw} \\times 10^{${pw}}${raw >= 10 || raw < 1 ? ` = ${FD.round(A, 4)} \\times 10^{${n}}` : ''}`);
      a.msg(`${m ? 'Multiply' : 'Divide'} the numbers: ${raw}. ${m ? 'Add' : 'Subtract'} the powers: ${pw}.${raw >= 10 || raw < 1 ? ' Then tidy A so it is between 1 and 10.' : ''}`);
    };
    ['#a1', '#n1', '#a2', '#n2', '#op'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.eq('');
    return a;
  },
  steps: [
    {
      title: 'Multiplying',
      text: '<p>Work out \\((4 \\times 10^6) \\times (2 \\times 10^3)\\) without a calculator.</p><p>Group the numbers and the powers of 10: \\(4 \\times 2 = 8\\) and \\(10^6 \\times 10^3 = 10^9\\).</p>',
      async on(a, ctx) {
        a.reset(); a.eq('(4 \\times 10^6) \\times (2 \\times 10^3)');
        await a.lines([['= (4 \\times 2) \\times (10^6 \\times 10^3)', ''], ['= 8 \\times 10^{9}', 'add the powers']], ctx, 1300);
      },
    },
    {
      title: 'Tidy the answer',
      text: '<p>\\((5 \\times 10^4) \\times (6 \\times 10^{-7})\\): \\(5 \\times 6 = 30\\), which is too big for A.</p>',
      tip: 'Write 30 as \\(3 \\times 10^1\\), then add that 1 to the power.',
      async on(a, ctx) {
        a.reset(); a.eq('(5 \\times 10^4) \\times (6 \\times 10^{-7})');
        await a.lines([['= 30 \\times 10^{-3}', '4 + (−7) = −3'], ['= 3 \\times 10^{1} \\times 10^{-3}', ''], ['= 3 \\times 10^{-2}', '']], ctx, 1300);
      },
    },
    {
      title: 'Dividing',
      text: '<p>\\((6 \\times 10^8) \\div (3 \\times 10^5)\\): divide the numbers and <b>subtract</b> the powers.</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{6 \\times 10^8}{3 \\times 10^5}');
        await a.lines([['= \\frac{6}{3} \\times 10^{8 - 5}', ''], ['= 2 \\times 10^{3}', ''], ['\\frac{2 \\times 10^3}{8 \\times 10^{-2}} = 0.25 \\times 10^5 = 2.5 \\times 10^4', 'tidy: 0.25 is too small']], ctx, 1300);
      },
    },
    {
      title: 'Try it: multiply and divide',
      text: '<p>Choose two numbers in standard form and an operation. Watch the numbers and the powers being dealt with separately.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'muldiv',
  gens: [
    () => { const a1 = FD.rnd(1, 9), a2 = FD.rnd(1, 9), n1 = FD.rnd(-4, 8), n2 = FD.rnd(-4, 8), [A, n] = FD.sfp(a1 * a2 * 10 ** (n1 + n2)); return { type: 'num', q: `Work out \\((${a1} \\times 10^{${n1}}) \\times (${a2} \\times 10^{${n2}})\\). Give your answer in standard form.`, a: [A, n], fields: ['A =', 'n ='], why: `\\(${a1} \\times ${a2} = ${a1 * a2}\\) and \\(${n1} + ${n2 < 0 ? `(${n2})` : n2} = ${n1 + n2}\\): \\(${a1 * a2} \\times 10^{${n1 + n2}}${a1 * a2 >= 10 ? ` = ${A} \\times 10^{${n}}` : ''}\\).` }; },
    () => { let a1, a2; do { a2 = FD.rnd(2, 9); a1 = a2 * FD.rnd(1, 4); } while (a1 > 9); const n1 = FD.rnd(-3, 9), n2 = FD.rnd(-3, 6), [A, n] = FD.sfp((a1 / a2) * 10 ** (n1 - n2)); return { type: 'num', q: `Work out \\((${a1} \\times 10^{${n1}}) \\div (${a2} \\times 10^{${n2}})\\). Give your answer in standard form.`, a: [A, n], fields: ['A =', 'n ='], why: `\\(${a1} \\div ${a2} = ${a1 / a2}\\) and \\(${n1} - ${n2 < 0 ? `(${n2})` : n2} = ${n1 - n2}\\): \\(${A} \\times 10^{${n}}\\).` }; },
    () => { const a1 = FD.rnd(2, 9), n1 = FD.rnd(2, 5); return { type: 'num', q: `Work out \\((${a1} \\times 10^{${n1}})^2\\). Give your answer in standard form.`, a: FD.sfp(a1 * a1 * 10 ** (2 * n1)), fields: ['A =', 'n ='], why: `\\(${a1}^2 = ${a1 * a1}\\) and \\((10^{${n1}})^2 = 10^{${2 * n1}}\\): \\(${FD.sfTex(a1 * a1 * 10 ** (2 * n1))}\\).` }; },
  ],
});

FD.check({
  section: 'muldiv',
  items: [
    { type: 'num', q: 'Work out \\((3 \\times 10^4) \\times (2 \\times 10^5)\\) in standard form.', a: [6, 9], fields: ['A =', 'n ='], why: '\\(6 \\times 10^9\\).' },
    { type: 'num', q: 'Work out \\((8 \\times 10^{3}) \\times (5 \\times 10^{-6})\\) in standard form.', a: [4, -2], fields: ['A =', 'n ='], why: '\\(40 \\times 10^{-3} = 4 \\times 10^{-2}\\).' },
    { type: 'num', q: 'Work out \\((9 \\times 10^{7}) \\div (3 \\times 10^{2})\\) in standard form.', a: [3, 5], fields: ['A =', 'n ='], why: '\\(3 \\times 10^5\\).' },
    { type: 'mcq', q: '\\((2 \\times 10^3) \\div (4 \\times 10^{5}) = \\)', opts: ['\\(5 \\times 10^{-3}\\)', '\\(0.5 \\times 10^{-2}\\)', '\\(5 \\times 10^{-2}\\)', '\\(2 \\times 10^{-2}\\)'], why: '\\(0.5 \\times 10^{-2} = 5 \\times 10^{-3}\\) (tidy A).' },
  ],
});
