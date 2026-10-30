FD.add({
  id: 'compound',
  title: 'Compound interest and depreciation',
  tab: 'Compound',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['The formula', 'Amount after \\(n\\) years = original \\(\\times\\) multiplier\\(^n\\).'],
    ['Depreciation', 'Losing value over time, like a car or a phone. The multiplier is less than 1.'],
    ['Per annum (p.a.)', 'Per year.'],
  ],
  mount(el) {
    const a = FD.board(el, 'cp-s', '<div id="yb"></div>', `
      <label class="ctrl">Start value (£) <input type="range" id="rp" min="1000" max="20000" step="500" value="12000"><output id="op">12000</output></label>
      <label class="ctrl">Change per year (%) <input type="range" id="rr" min="-30" max="20" value="-15"><output id="or">−15</output></label>
      <label class="ctrl">Years <input type="range" id="rn" min="1" max="10" value="5"><output id="on">5</output></label>`, () => sync());
    a.yb = FD.ybars(a.$('#yb'));
    const sync = () => {
      const P = +a.$('#rp').value, r = +a.$('#rr').value, n = +a.$('#rn').value, m = FD.dec(1 + r / 100); a.$('#op').textContent = P; a.$('#or').textContent = r < 0 ? '−' + -r : r; a.$('#on').textContent = n;
      a.yb(FD.series(P, m, n));
      a.big(`${P} \\times ${m}^{${n}} = ${FD.r2(P * m ** n)}`);
      a.msg(r < 0 ? `Depreciation of ${-r}% a year: multiply by ${m} each year.` : r > 0 ? `Growth of ${r}% a year: multiply by ${m} each year.` : 'No change.', r < 0 ? 'bad' : 'good');
    };
    ['#rp', '#rr', '#rn'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.yb(FD.series(1000, 1.05, 0));
    return a;
  },
  steps: [
    {
      title: 'Jump straight to year n',
      text: '<p>Multiplying by 1.1 three times is the same as multiplying by \\(1.1^3\\). So</p><p>amount = original × multiplier<sup>n</sup>.</p>',
      tip: 'On a calculator: 1000 × 1.1 x□ 3 =',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(1000, 1.1, 3));
        await a.lines([['1000 \\times 1.1 \\times 1.1 \\times 1.1', ''], ['= 1000 \\times 1.1^3 = 1331', '']], ctx, 1300);
      },
    },
    {
      title: 'An example',
      text: '<p>£2500 is invested at 3.5% compound interest per year. Find the amount after 6 years.</p>',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(2500, 1.035, 6));
        await a.lines([['\\text{multiplier} = 1 + 0.035 = 1.035', ''], ['2500 \\times 1.035^6 = 3073.138\\dots', ''], ['\\approx \\pounds 3073.14', 'money: 2 decimal places']], ctx, 1300);
      },
    },
    {
      title: 'Depreciation',
      text: '<p>A car costs £12 000 and loses 15% of its value each year. What is it worth after 5 years?</p><p>The multiplier for a 15% <b>decrease</b> is 0.85.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 6; k++) { a.yb(FD.series(12000, 0.85, 5), { shown: k }); if (!(await ctx.sleep(600))) return; }
        await a.lines([['12\\,000 \\times 0.85^5 = 5324.46\\dots', ''], ['\\approx \\pounds 5324.46', '']], ctx, 1300);
      },
    },
    {
      title: 'Interest earned',
      text: '<p>If a question asks for the <b>interest</b>, subtract the original amount at the end.</p>',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(800, 1.04, 3));
        await a.lines([['800 \\times 1.04^3 = 899.89', 'amount (to 2 d.p.)'], ['899.89 - 800 = \\pounds 99.89', 'interest']], ctx, 1300);
      },
    },
    {
      title: 'Try it: grow or shrink',
      text: '<p>Choose a start value, a yearly percentage change (negative for depreciation) and the number of years.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'compound',
  gens: [
    () => { const P = FD.pick([500, 1200, 2000, 3500, 4000, 6000, 8000]), r = FD.pick([2, 2.5, 3, 4, 5, 6]), n = FD.rnd(2, 8), v = FD.r2(P * (1 + r / 100) ** n); return { type: 'num', q: `£${P} is invested at ${r}% per year compound interest. Work out the amount after ${n} years. Give your answer to the nearest penny.`, a: v, tol: 0.011, hint: 'In pounds, to 2 decimal places.', why: `\\(${P} \\times ${FD.dec(1 + r / 100)}^{${n}} = ${(P * (1 + r / 100) ** n).toFixed(4)}\\dots \\approx ${v.toFixed(2)}\\).` }; },
    () => { const P = FD.pick([9000, 12000, 15000, 18000, 24000]), r = FD.pick([10, 12, 15, 20, 25]), n = FD.rnd(2, 5), v = FD.r2(P * (1 - r / 100) ** n); return { type: 'num', q: `A van costs £${P}. It depreciates by ${r}% each year. Work out its value after ${n} years, to the nearest penny.`, a: v, tol: 0.011, hint: 'In pounds, to 2 decimal places.', why: `Multiplier \\(1 - ${r / 100} = ${FD.dec(1 - r / 100)}\\). \\(${P} \\times ${FD.dec(1 - r / 100)}^{${n}} = ${v.toFixed(2)}\\).` }; },
    () => { const r = FD.pick([3, 4, 6, 7, 12, 15]), up = FD.rnd(0, 1), n = FD.rnd(2, 9); return { type: 'mcq', q: `Which calculation gives the value of £5000 after ${n} years of ${up ? `${r}% compound interest` : `${r}% depreciation`} per year?`, opts: [`\\(5000 \\times ${FD.dec(up ? 1 + r / 100 : 1 - r / 100)}^{${n}}\\)`, `\\(5000 \\times ${FD.dec(r / 100)}^{${n}}\\)`, `\\(5000 \\times ${FD.dec(up ? 1 + r / 100 : 1 - r / 100)} \\times ${n}\\)`, `\\(5000 \\times ${FD.dec(up ? 1 - r / 100 : 1 + r / 100)}^{${n}}\\)`], why: `The multiplier is ${FD.dec(up ? 1 + r / 100 : 1 - r / 100)}, used once for every year: power ${n}.` }; },
  ],
});

FD.check({
  section: 'compound',
  items: [
    { type: 'num', q: '£3000 at 2% compound interest per year. Work out the amount after 4 years, to the nearest penny.', a: 3247.30, tol: 0.011, hint: 'In pounds, to 2 decimal places.', why: '\\(3000 \\times 1.02^4 = 3247.2964\\dots\\)' },
    { type: 'num', q: 'A computer worth £900 depreciates by 30% a year. What is it worth after 2 years, in pounds?', a: 441, why: '\\(900 \\times 0.7^2 = 441\\).' },
    { type: 'mcq', q: 'What is the multiplier for 8% depreciation per year?', opts: ['0.92', '1.08', '0.08', '0.8'], why: '100% − 8% = 92%.' },
    { type: 'num', q: '£1500 is invested at 4% compound interest for 3 years. How much <b>interest</b> is earned, to the nearest penny?', a: 187.30, tol: 0.011, hint: 'In pounds, to 2 decimal places.', why: '\\(1500 \\times 1.04^3 = 1687.296\\), so the interest is £187.30.' },
  ],
});
