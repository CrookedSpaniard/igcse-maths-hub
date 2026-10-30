FD.add({
  id: 'problems',
  title: 'Compound interest problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Original amount', 'Divide by the multiplier to the power \\(n\\): \\(P = A \\div m^n\\).'],
    ['Finding the rate', 'Find the multiplier \\(m\\) from \\(m^n = A \\div P\\), then turn it into a percentage.'],
    ['Finding the number of years', 'Multiply year by year (or try values of \\(n\\)) until you pass the target.'],
  ],
  mount(el) {
    const a = FD.board(el, 'pb-s', '<div id="yb"></div>', `
      <label class="ctrl">Value (£) <input type="range" id="rp" min="10000" max="40000" step="1000" value="20000"><output id="op">20000</output></label>
      <label class="ctrl">Loss a year (%) <input type="range" id="rr" min="5" max="30" value="15"><output id="or">15</output></label>
      <label class="ctrl">Target (£) <input type="range" id="rt" min="2000" max="20000" step="1000" value="10000"><output id="ot">10000</output></label>`, () => sync());
    a.yb = FD.ybars(a.$('#yb'));
    const sync = () => {
      const P = +a.$('#rp').value, r = +a.$('#rr').value, T = Math.min(+a.$('#rt').value, P - 1000), m = FD.dec(1 - r / 100);
      a.$('#op').textContent = P; a.$('#or').textContent = r; a.$('#ot').textContent = T;
      let n = 0; while (P * m ** n >= T && n < 40) n++;
      a.yb(FD.series(P, m, Math.min(Math.max(n, 1), 10)));
      a.big(`${P} \\times ${m}^{${n - 1}} = ${FD.r2(P * m ** (n - 1))} \\qquad ${P} \\times ${m}^{${n}} = ${FD.r2(P * m ** n)}`);
      a.msg(`The value first drops below £${T} after <b>${n} year${n === 1 ? '' : 's'}</b>.`);
    };
    ['#rp', '#rr', '#rt'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.yb(FD.series(20000, 0.85, 4));
    return a;
  },
  steps: [
    {
      title: 'Finding the original amount',
      text: '<p>After 3 years at 4% compound interest, an account holds £2812.16. How much was put in?</p><p>Forwards you multiply by \\(1.04^3\\), so backwards you <b>divide</b> by it.</p>',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(2500, 1.04, 3));
        await a.lines([['P \\times 1.04^3 = 2812.16', ''], ['P = 2812.16 \\div 1.04^3', ''], ['P = \\pounds 2500', '']], ctx, 1300);
      },
    },
    {
      title: 'Finding the rate',
      text: '<p>£5000 grows to £5832 in 2 years of compound interest. What is the rate?</p>',
      tip: 'Check: \\(5000 \\times 1.08^2 = 5832\\). ✓',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(5000, 1.08, 2));
        await a.lines([['5000 \\times m^2 = 5832', ''], ['m^2 = 5832 \\div 5000 = 1.1664', ''], ['m = \\sqrt{1.1664} = 1.08', ''], ['\\text{rate} = 8\\%', '']], ctx, 1300);
      },
    },
    {
      title: 'Finding the number of years',
      text: '<p>A car worth £20 000 loses 15% of its value each year. After how many years is it first worth <b>less than £10 000</b>?</p><p>Try values of \\(n\\) until the value goes below £10 000.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 6; k++) { a.yb(FD.series(20000, 0.85, 5), { shown: k }); if (!(await ctx.sleep(500))) return; }
        await a.lines([['20\\,000 \\times 0.85^4 = 10\\,440.13', 'still above'], ['20\\,000 \\times 0.85^5 = 8874.11', 'below £10 000'], ['\\text{after } 5 \\text{ years}', '']], ctx, 1300);
      },
    },
    {
      title: 'Try it: when does it drop below?',
      text: '<p>Choose the value of a car, its yearly depreciation and a target. Find the first year the value is below the target.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'problems',
  gens: [
    () => { const P = FD.pick([1000, 2000, 2500, 4000, 5000, 8000]), r = FD.pick([2, 3, 4, 5, 6]), n = FD.rnd(2, 4), A = FD.r2(P * (1 + r / 100) ** n); return { type: 'num', q: `After ${n} years at ${r}% compound interest, an account holds ${FD.gbp(A)}. How much was invested at the start, to the nearest pound?`, a: P, tol: 0.5, why: `\\(${A} \\div ${FD.dec(1 + r / 100)}^{${n}} = ${FD.r2(A / (1 + r / 100) ** n)} \\approx ${P}\\).` }; },
    () => { const P = FD.pick([1000, 2000, 5000, 10000]), r = FD.pick([2, 4, 5, 6, 8, 10, 12, 20]), A = FD.r2(P * (1 + r / 100) ** 2); return { type: 'num', q: `£${P} grows to ${FD.gbp(A)} after 2 years of compound interest. What is the annual rate of interest?`, a: r, unit: '%', why: `\\(m^2 = ${A} \\div ${P} = ${FD.dec(A / P)}\\), so \\(m = \\sqrt{${FD.dec(A / P)}} = ${FD.dec(1 + r / 100)}\\): a rate of ${r}%.` }; },
    () => { let P, r, T, n; do { P = FD.pick([8000, 10000, 15000, 20000]); r = FD.pick([10, 12, 15, 20, 25]); T = P / 2; n = 0; while (P * (1 - r / 100) ** n >= T) n++; } while (n > 8); return { type: 'num', q: `A machine worth £${P} depreciates by ${r}% a year. After how many whole years is it first worth less than half its original value?`, a: n, why: `\\(${FD.dec(1 - r / 100)}^{${n - 1}} = ${((1 - r / 100) ** (n - 1)).toFixed(4)}\\) (not yet below 0.5) and \\(${FD.dec(1 - r / 100)}^{${n}} = ${((1 - r / 100) ** n).toFixed(4)}\\) (below 0.5). So ${n} years.` }; },
  ],
});

FD.check({
  section: 'problems',
  items: [
    { type: 'num', q: 'After 2 years at 5% compound interest an account holds £1102.50. How much was invested, in pounds?', a: 1000, why: '\\(1102.50 \\div 1.05^2 = 1000\\).' },
    { type: 'num', q: '£800 grows to £968 in 2 years of compound interest. What is the annual rate?', a: 10, unit: '%', why: '\\(m^2 = 1.21\\), \\(m = 1.1\\): 10%.' },
    { type: 'num', q: 'A population of 1000 grows by 20% a year. After how many whole years is it first more than 2000?', a: 4, why: '\\(1.2^3 = 1.728\\), \\(1.2^4 = 2.0736\\).' },
    { type: 'mcq', q: 'A value after 5 years of 3% depreciation is V. The original value is…', opts: ['\\(V \\div 0.97^5\\)', '\\(V \\times 0.97^5\\)', '\\(V \\div 1.03^5\\)', '\\(V \\times 1.15\\)'], why: 'Undo × 0.97⁵ by dividing.' },
  ],
});
