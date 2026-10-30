FD.add({
  id: 'ofamount',
  title: 'Percentages of amounts',
  tab: 'Of amounts',
  icon: 'calc',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['10% and 1%', 'Divide by 10 and by 100. Build other percentages from them.'],
    ['Multiplier', 'The percentage as a decimal: 35% of an amount = 0.35 × the amount.'],
    ['As a percentage of', '\\(\\dfrac{\\text{part}}{\\text{whole}} \\times 100\\). Use the same units for both.'],
  ],
  mount(el) {
    const a = FD.board(el, 'oa-s', '<div id="pb"></div>', `
      <label class="ctrl">Amount (£) <input type="range" id="ra" min="10" max="500" step="10" value="240"><output id="oa">240</output></label>
      <label class="ctrl">Percentage <input type="range" id="rp" min="1" max="100" value="35"><output id="op">35%</output></label>`, () => sync());
    a.pb = FD.pbar(a.$('#pb'));
    const sync = () => {
      const A = +a.$('#ra').value, p = +a.$('#rp').value, v = FD.dec((A * p) / 100); a.$('#oa').textContent = A; a.$('#op').textContent = p + '%';
      a.pb(p, { marks: [{ p, top: FD.gbp(v) }, { p: 100, top: FD.gbp(A) }] });
      a.big(`${p}\\% \\text{ of } ${A} = ${FD.dec(p / 100)} \\times ${A} = ${v}`);
      a.msg(`10% = £${FD.dec(A / 10)} and 1% = £${FD.dec(A / 100)}.`);
    };
    ['#ra', '#rp'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.pb(0);
    return a;
  },
  steps: [
    {
      title: 'Build it from 10% and 1%',
      text: '<p>Find 35% of £240 without a calculator.</p><p>10% is \\(240 \\div 10 = 24\\). Then 30% is \\(3 \\times 24 = 72\\) and 5% is half of 10%: 12.</p>',
      async on(a, ctx) {
        a.reset();
        a.pb(10, { marks: [{ p: 10, top: '£24' }, { p: 100, top: '£240' }] });
        await a.lines([['10\\% = 240 \\div 10 = 24', ''], ['30\\% = 3 \\times 24 = 72', ''], ['5\\% = 24 \\div 2 = 12', 'half of 10%'], ['35\\% = 72 + 12 = £84', '']], ctx, 1200);
        a.pb(35, { marks: [{ p: 35, top: '£84' }, { p: 100, top: '£240' }] });
      },
    },
    {
      title: 'Use a multiplier',
      text: '<p>With a calculator, change the percentage into a decimal and multiply. This works for any percentage.</p>',
      tip: 'The decimal 0.35 is called the multiplier for 35%.',
      async on(a, ctx) {
        a.reset(); a.pb(35, { marks: [{ p: 35, top: '£84' }] });
        await a.lines([['35\\% \\text{ of } 240 = 0.35 \\times 240 = 84', ''], ['17.5\\% \\text{ of } 60 = 0.175 \\times 60 = 10.5', '£10.50']], ctx, 1400);
      },
    },
    {
      title: 'One number as a percentage of another',
      text: '<p>Ella scored 18 out of 40. What percentage is that?</p><p>Write it as a fraction, <b>part over whole</b>, then multiply by 100.</p>',
      async on(a, ctx) {
        a.reset();
        await a.lines([['\\frac{18}{40} \\times 100', 'part over whole'], ['= 0.45 \\times 100 = 45\\%', '']], ctx, 1300);
        a.pb(45, { marks: [{ p: 45, top: '18' }, { p: 100, top: '40' }] });
      },
    },
    {
      title: 'Same units first',
      text: '<p>What is 45p as a percentage of £2? Change both into <b>pence</b> first: £2 = 200p.</p>',
      tip: 'Mixed units (cm and m, minutes and hours) must be made the same.',
      async on(a, ctx) {
        a.reset();
        await a.lines([['\\pounds 2 = 200\\text{p}', ''], ['\\frac{45}{200} \\times 100 = 22.5\\%', '']], ctx, 1300);
        a.pb(22.5, { marks: [{ p: 22.5, top: '45p' }, { p: 100, top: '200p' }] });
      },
    },
    {
      title: 'Try it: any percentage of any amount',
      text: '<p>Choose an amount and a percentage. The bar shows the part you want; 10% and 1% are given to help.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'ofamount',
  gens: [
    () => { const p = FD.pick([10, 20, 5, 15, 25, 30, 35, 40, 45, 60, 75, 1, 2, 12]), A = FD.pick([20, 40, 60, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600]); const v = FD.dec((p * A) / 100); return { type: 'num', q: `Find ${p}% of £${A}.`, a: v, hint: 'Give your answer in pounds.', why: `10% of ${A} = ${A / 10}, 1% = ${FD.dec(A / 100)}. ${p}% = \\(${FD.dec(p / 100)} \\times ${A} = ${v}\\), so ${FD.gbp(v)}.` }; },
    () => { let part, whole; do { whole = FD.pick([20, 25, 40, 50, 80, 200, 250, 400]); part = FD.rnd(1, whole - 1); } while (!Number.isInteger(FD.dec((part / whole) * 1000))); const p = FD.dec((part / whole) * 100); return { type: 'num', q: `Write ${part} as a percentage of ${whole}.`, a: p, unit: '%', why: `\\(\\dfrac{${part}}{${whole}} \\times 100 = ${p}\\%\\).` }; },
    () => { const m = FD.pick([6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 90]); return { type: 'num', q: `What is ${m} minutes as a percentage of 2 hours?`, a: FD.dec((m / 120) * 100), unit: '%', why: `2 hours = 120 minutes. \\(\\dfrac{${m}}{120} \\times 100 = ${FD.dec((m / 120) * 100)}\\%\\).` }; },
  ],
});

FD.check({
  section: 'ofamount',
  items: [
    { type: 'num', q: 'Find 15% of £80.', a: 12, hint: 'Give your answer in pounds.', why: '10% = 8, 5% = 4, total 12.' },
    { type: 'num', q: 'Find 2.5% of 360.', a: 9, why: '\\(0.025 \\times 360 = 9\\).' },
    { type: 'num', q: 'A test has 25 marks. Joe scores 21. What is his percentage?', a: 84, unit: '%', why: '\\(\\tfrac{21}{25} \\times 100 = 84\\%\\).' },
    { type: 'mcq', q: 'What is the multiplier for 7%?', opts: ['0.07', '0.7', '7', '1.07'], why: '\\(7 \\div 100 = 0.07\\).' },
    { type: 'num', q: 'What is 30 cm as a percentage of 1.2 m?', a: 25, unit: '%', why: '1.2 m = 120 cm; \\(\\tfrac{30}{120} \\times 100 = 25\\%\\).' },
  ],
});
