FD.add({
  id: 'repeated',
  title: 'Repeated percentage change',
  tab: 'Repeated',
  icon: 'calc',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Repeated change', 'Several percentage changes one after another. Multiply by each multiplier in turn.'],
    ['Overall multiplier', 'The product of all the multipliers. Turn it back into a percentage change.'],
  ],
  mount(el) {
    const a = FD.board(el, 'rp-s', '<div id="yb"></div>', `
      <label class="ctrl">First change (%) <input type="range" id="r1" min="-50" max="50" step="5" value="20"><output id="o1">+20</output></label>
      <label class="ctrl">Second change (%) <input type="range" id="r2" min="-50" max="50" step="5" value="-25"><output id="o2">−25</output></label>`, () => sync());
    a.yb = FD.ybars(a.$('#yb'));
    const sync = () => {
      const r1 = +a.$('#r1').value, r2 = +a.$('#r2').value, m1 = FD.dec(1 + r1 / 100), m2 = FD.dec(1 + r2 / 100), M = FD.dec(m1 * m2), pc = FD.dec((M - 1) * 100);
      const f = (r) => (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r);
      a.$('#o1').textContent = f(r1); a.$('#o2').textContent = f(r2);
      a.yb([100, 100 * m1, 100 * M]);
      a.big(`${m1} \\times ${m2} = ${M}`);
      a.msg(`Overall: ${pc > 0 ? `an increase of ${pc}%` : pc < 0 ? `a decrease of ${-pc}%` : 'no change'}. ${r1 + r2 !== pc ? `Not ${f(r1 + r2)}%: the second change is a percentage of a different amount.` : ''}`, pc >= 0 ? 'good' : 'bad');
    };
    ['#r1', '#r2'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.yb([100, 120, 90]);
    return a;
  },
  steps: [
    {
      title: 'Up 10%, then down 10%',
      text: '<p>A price of £100 goes up by 10%, then down by 10%. Is it back to £100?</p><p>No: the 10% decrease is 10% of <b>£110</b>.</p>',
      tip: 'Percentages of different amounts cannot just be added.',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 3; k++) { a.yb([100, 110, 99], { shown: k }); if (!(await ctx.sleep(800))) return; }
        await a.lines([['100 \\times 1.1 = 110', ''], ['110 \\times 0.9 = 99', ''], ['1.1 \\times 0.9 = 0.99', 'overall: a 1% decrease']], ctx, 1300);
      },
    },
    {
      title: 'The overall multiplier',
      text: '<p>A price rises by 20%, then falls by 25%. Multiply the multipliers to find the <b>overall</b> change.</p>',
      async on(a, ctx) {
        a.reset(); a.yb([100, 120, 90]);
        await a.lines([['1.2 \\times 0.75 = 0.9', 'overall multiplier'], ['0.9 = 90\\%', ''], ['\\text{overall: a } 10\\% \\text{ decrease}', '']], ctx, 1300);
      },
    },
    {
      title: 'Different rates in different years',
      text: '<p>£4000 is invested: 3 years at 5% compound interest, then 2 more years at 3%.</p>',
      async on(a, ctx) {
        a.reset(); a.yb([4000, 4200, 4410, 4630.5, 4769.42, 4912.5]);
        await a.lines([['4000 \\times 1.05^3 \\times 1.03^2', 'one multiplier for each year'], ['= 4912.50\\dots', ''], ['\\approx \\pounds 4912.50', '']], ctx, 1400);
      },
    },
    {
      title: 'Repeated change in context',
      text: '<p>A population of 50 000 falls by 2% every year for 8 years. The same idea works for populations, bacteria and radioactive decay.</p>',
      async on(a, ctx) {
        a.reset(); a.yb(FD.series(50000, 0.98, 8));
        await a.lines([['50\\,000 \\times 0.98^8 = 42\\,538.15\\dots', ''], ['\\approx 42\\,538 \\text{ people}', 'a whole number of people']], ctx, 1400);
      },
    },
    {
      title: 'Try it: two changes',
      text: '<p>Choose two percentage changes. The bars show £100 after each one, and the overall change is worked out.</p>',
      tip: 'Is +50% then −50% the same as −50% then +50%?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'repeated',
  gens: [
    () => { let r1, r2, M; do { r1 = FD.pick([10, 20, 25, 30, 40, 50, -10, -20, -25, -40]); r2 = FD.pick([10, 20, 25, 30, 40, 50, -10, -20, -25, -40]); M = FD.dec((1 + r1 / 100) * (1 + r2 / 100)); } while (M === 1 || !Number.isInteger(FD.dec(M * 1000))); const pc = FD.dec((M - 1) * 100); return { type: 'num', q: `A value changes by ${r1 > 0 ? '+' : ''}${r1}%, then by ${r2 > 0 ? '+' : ''}${r2}%. What is the overall percentage change? (Use a minus sign for a decrease.)`, a: pc, unit: '%', why: `\\(${FD.dec(1 + r1 / 100)} \\times ${FD.dec(1 + r2 / 100)} = ${M}\\), which is ${pc > 0 ? `an increase of ${pc}%` : `a decrease of ${-pc}%`}.` }; },
    () => { const P = FD.pick([2000, 5000, 8000, 10000]), r1 = FD.pick([3, 4, 5]), n1 = FD.rnd(2, 3), r2 = FD.pick([1.5, 2, 2.5]), n2 = FD.rnd(1, 3), v = FD.r2(P * (1 + r1 / 100) ** n1 * (1 + r2 / 100) ** n2); return { type: 'num', q: `£${P} is invested at ${r1}% compound interest for ${n1} years, then at ${r2}% for ${n2} more year${n2 > 1 ? 's' : ''}. Work out the final amount, to the nearest penny.`, a: v, tol: 0.011, hint: 'In pounds, to 2 decimal places.', why: `\\(${P} \\times ${FD.dec(1 + r1 / 100)}^{${n1}} \\times ${FD.dec(1 + r2 / 100)}^{${n2}} = ${v.toFixed(2)}\\).` }; },
    () => { const r = FD.pick([10, 20, 30]); return { type: 'mcq', q: `A price goes up by ${r}% and then down by ${r}%. Overall, the price…`, opts: [`goes down by ${FD.dec((r * r) / 100)}%`, 'stays the same', `goes up by ${FD.dec((r * r) / 100)}%`, `goes down by ${r}%`], why: `\\(${FD.dec(1 + r / 100)} \\times ${FD.dec(1 - r / 100)} = ${FD.dec(1 - (r * r) / 10000)}\\): a decrease of ${FD.dec((r * r) / 100)}%.` }; },
  ],
});

FD.check({
  section: 'repeated',
  items: [
    { type: 'num', q: 'A price rises by 50% and then falls by 40%. What is the overall percentage change? (Use a minus sign for a decrease.)', a: -10, unit: '%', why: '\\(1.5 \\times 0.6 = 0.9\\): a 10% decrease.' },
    { type: 'mcq', q: 'Which calculation finds £300 after 2 years at 4% then 1 year at 6%?', opts: ['\\(300 \\times 1.04^2 \\times 1.06\\)', '\\(300 \\times 1.14\\)', '\\(300 \\times 1.04 \\times 1.06^2\\)', '\\(300 \\times 1.1^3\\)'], why: 'One multiplier for each year.' },
    { type: 'tf', q: 'Increasing by 20% and then by 20% again is the same as increasing by 40%.', a: false, why: '\\(1.2^2 = 1.44\\): a 44% increase.' },
    { type: 'num', q: 'A town of 20 000 people grows by 5% one year and then falls by 5% the next. How many people are there after the 2 years?', a: 19950, why: '\\(20\\,000 \\times 1.05 \\times 0.95 = 19\\,950\\).' },
  ],
});
