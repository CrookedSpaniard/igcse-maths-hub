FD.add({
  id: 'change',
  title: 'Percentage increase, decrease and change',
  tab: 'Change',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Multiplier for an increase', '\\(1 + \\tfrac{p}{100}\\). Increase by 15%: × 1.15.'],
    ['Multiplier for a decrease', '\\(1 - \\tfrac{p}{100}\\). Decrease by 20%: × 0.8.'],
    ['Percentage change', '\\(\\dfrac{\\text{change}}{\\text{original}} \\times 100\\). Used for percentage profit and loss.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ch-s', '<div id="pb"></div>', `
      <label class="ctrl">Original (£) <input type="range" id="ra" min="20" max="400" step="10" value="80"><output id="oa">80</output></label>
      <label class="ctrl">Change (%) <input type="range" id="rp" min="-50" max="50" value="15"><output id="op">+15%</output></label>`, () => sync());
    a.pb = FD.pbar(a.$('#pb'));
    const sync = () => {
      const A = +a.$('#ra').value, p = +a.$('#rp').value, m = FD.dec(1 + p / 100), v = FD.dec(A * m);
      a.$('#oa').textContent = A; a.$('#op').textContent = (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + '%';
      a.pb(100 + p, { max: 150, marks: [{ p: 100 + p, top: FD.gbp(v) }] });
      a.big(`${A} \\times ${m} = ${v}`);
      a.msg(p >= 0 ? `An increase of ${p}%: you have ${100 + p}% of the original, so multiply by ${m}.` : `A decrease of ${-p}%: you have ${100 + p}% of the original, so multiply by ${m}.`, p >= 0 ? 'good' : 'bad');
    };
    ['#ra', '#rp'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.pb(100, { max: 150 });
    return a;
  },
  steps: [
    {
      title: 'Increase by a percentage',
      text: '<p>A bike costs £80. The price goes up by 15%. You now pay 100% + 15% = <b>115%</b> of the old price.</p><p>115% as a decimal is 1.15: the <b>multiplier</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(100, { max: 150, marks: [{ p: 100, top: '£80' }] });
        if (!(await ctx.sleep(1000))) return;
        a.pb(115, { max: 150, marks: [{ p: 115, top: '£92' }] });
        await a.lines([['80 \\times 1.15 = 92', 'new price £92'], ['\\text{or: } 15\\% \\text{ of } 80 = 12, \\; 80 + 12 = 92', 'the long way']], ctx, 1400);
      },
    },
    {
      title: 'Decrease by a percentage',
      text: '<p>In a sale, £80 is reduced by 20%. You pay 100% − 20% = <b>80%</b>, so multiply by 0.8.</p>',
      tip: 'Multipliers: +5% → 1.05, +40% → 1.4, −3% → 0.97, −35% → 0.65.',
      async on(a, ctx) {
        a.reset(); a.pb(100, { max: 150, marks: [{ p: 100, top: '£80' }] });
        if (!(await ctx.sleep(1000))) return;
        a.pb(80, { max: 150, marks: [{ p: 80, top: '£64' }] });
        await a.lines([['80 \\times 0.8 = 64', 'sale price £64']], ctx, 1400);
      },
    },
    {
      title: 'Percentage change',
      text: '<p>A shop buys a lamp for £50 and sells it for £62. What is the percentage <b>profit</b>?</p><p>Divide the <b>change</b> by the <b>original</b> amount.</p>',
      tip: 'Always divide by the ORIGINAL amount, not the new one.',
      async on(a, ctx) {
        a.reset(); a.pb(124, { max: 150, marks: [{ p: 100, top: '£50' }, { p: 124, top: '£62' }] });
        await a.lines([['\\text{change} = 62 - 50 = 12', ''], ['\\frac{12}{50} \\times 100 = 24\\%', 'percentage profit'], ['\\text{a loss: } \\frac{\\text{decrease}}{\\text{original}} \\times 100', 'the same idea']], ctx, 1400);
      },
    },
    {
      title: 'Problems in context',
      text: '<p>Simple problems: a pay rise, a discount, a population that falls. Find the multiplier, then multiply.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(103, { max: 150, marks: [{ p: 103, top: '£25 750' }] });
        await a.lines([['\\text{pay rise of } 3\\% \\text{ on } \\pounds 25\\,000', ''], ['25\\,000 \\times 1.03 = 25\\,750', ''], ['\\text{town of } 8000 \\text{ falls by } 6\\%: \\; 8000 \\times 0.94 = 7520', '']], ctx, 1500);
      },
    },
    {
      title: 'Try it: increase or decrease',
      text: '<p>Choose an amount and a percentage change. The bar shows the new amount as a percentage of the original.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'change',
  gens: [
    () => { const A = FD.pick([40, 60, 80, 120, 150, 200, 250, 300, 360, 400, 450, 500]), p = FD.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 8, 4]), up = FD.rnd(0, 1), m = FD.dec(up ? 1 + p / 100 : 1 - p / 100), v = FD.dec(A * m); return { type: 'num', q: `${up ? 'Increase' : 'Decrease'} £${A} by ${p}%.`, a: v, hint: 'Give your answer in pounds.', why: `Multiplier: ${up ? `100% + ${p}%` : `100% − ${p}%`} = ${FD.dec(m * 100)}% = ${m}. \\(${A} \\times ${m} = ${v}\\).` }; },
    () => { let o, n, p; do { o = FD.pick([20, 25, 40, 50, 80, 120, 200, 250, 400]); p = FD.pick([5, 10, 15, 20, 25, 30, 35, 40, 60, -10, -15, -20, -25, -30, -40]); n = FD.dec(o * (1 + p / 100)); } while (!Number.isInteger(n * 100)); return { type: 'num', q: `A price changes from £${o} to ${FD.gbp(n)}. Find the percentage ${p > 0 ? 'increase' : 'decrease'}.`, a: Math.abs(p), unit: '%', why: `Change = \\(${FD.dec(Math.abs(n - o))}\\). \\(\\dfrac{${FD.dec(Math.abs(n - o))}}{${o}} \\times 100 = ${Math.abs(p)}\\%\\).` }; },
    () => { const p = FD.pick([2, 3, 4, 6, 9, 12, 15, 17, 22, 35, 45, 65, 85]), up = FD.rnd(0, 1); return { type: 'num', q: `What is the multiplier for a ${p}% ${up ? 'increase' : 'decrease'}?`, a: FD.dec(up ? 1 + p / 100 : 1 - p / 100), why: `${up ? `100% + ${p}% = ${100 + p}%` : `100% − ${p}% = ${100 - p}%`} = ${FD.dec(up ? 1 + p / 100 : 1 - p / 100)}.` }; },
  ],
});

FD.check({
  section: 'change',
  items: [
    { type: 'num', q: 'Increase 250 by 12%.', a: 280, why: '\\(250 \\times 1.12 = 280\\).' },
    { type: 'num', q: 'A £45 jacket has 30% off. What is the sale price, in pounds?', a: 31.5, hint: 'Give your answer in pounds.', why: '\\(45 \\times 0.7 = 31.50\\).' },
    { type: 'mcq', q: 'What is the multiplier for a 4% decrease?', opts: ['0.96', '0.04', '0.6', '1.04'], why: '100% − 4% = 96%.' },
    { type: 'num', q: 'A car bought for £8000 is sold for £6800. Find the percentage loss.', a: 15, unit: '%', why: '\\(\\tfrac{1200}{8000} \\times 100 = 15\\%\\).' },
    { type: 'tf', q: 'To find a percentage change, divide the change by the new amount.', a: false, why: 'Divide by the original amount.' },
  ],
});
