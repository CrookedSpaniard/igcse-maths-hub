FD.add({
  id: 'bestbuy',
  title: 'Best buys and exchange rates',
  tab: 'Best buys',
  icon: 'calc',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Best buy', 'The better value pack: the lowest price per unit (or the most for £1).'],
    ['Exchange rate', 'How much of one currency you get for one unit of another, e.g. £1 = €1.15.'],
    ['Converting', 'Multiply to go from £ to the other currency; divide to come back.'],
  ],
  mount(el) {
    const a = FD.board(el, 'bb-s', '<div id="bm"></div>', `
      <label class="ctrl">Exchange rate: £1 = € <input type="range" id="rr" min="100" max="130" value="115"><output id="or">1.15</output></label>
      <label class="ctrl">Pounds (£) <input type="range" id="rp" min="10" max="500" step="10" value="200"><output id="op">200</output></label>`, () => sync());
    a.bm = FD.barModel(a.$('#bm'));
    const sync = () => {
      const r = +a.$('#rr').value / 100, p = +a.$('#rp').value; a.$('#or').textContent = r.toFixed(2); a.$('#op').textContent = p;
      a.bm([{ name: '£', parts: 4, total: FD.gbp(p) }, { name: '€', parts: 4, total: '€' + FD.round(p * r, 2).toFixed(2) }]);
      a.big(`\\pounds ${p} \\times ${r.toFixed(2)} = €${FD.round(p * r, 2).toFixed(2)} \\qquad €${p} \\div ${r.toFixed(2)} = \\pounds ${FD.round(p / r, 2).toFixed(2)}`);
      a.msg('Pounds → euros: multiply by the rate. Euros → pounds: divide.');
    };
    ['#rr', '#rp'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.bm([{ name: 'small', parts: 3 }, { name: 'large', parts: 5 }]);
    return a;
  },
  steps: [
    {
      title: 'Which is better value?',
      text: '<p>A 300 g jar of jam costs £1.80. A 500 g jar costs £2.75. Which is the better buy?</p><p>Work out the <b>price per gram</b> (or per 100 g) for each.</p>',
      tip: 'Compare like with like: both per 100 g, or both grams per £1.',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '300 g', parts: 3, total: '£1.80' }, { name: '500 g', parts: 5, total: '£2.75' }]);
        await a.lines([['\\pounds 1.80 \\div 3 = 60\\text{p per } 100\\text{ g}', 'small jar'], ['\\pounds 2.75 \\div 5 = 55\\text{p per } 100\\text{ g}', 'large jar'], ['\\text{the 500 g jar is better value}', 'lower price per 100 g']], ctx, 1400);
      },
    },
    {
      title: 'Another way: how much for £1?',
      text: '<p>You can also compare <b>how much you get for £1</b>. More for £1 is better value.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '300 g', parts: 3, total: '£1.80' }, { name: '500 g', parts: 5, total: '£2.75' }]);
        await a.lines([['300 \\div 1.80 = 166.7 \\text{ g per } \\pounds 1', ''], ['500 \\div 2.75 = 181.8 \\text{ g per } \\pounds 1', 'more: better value']], ctx, 1400);
      },
    },
    {
      title: 'Exchange rates',
      text: '<p>The exchange rate is £1 = €1.15. Mo changes £200 into euros. Later he changes €69 back into pounds.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '£', parts: 4, total: '£200' }, { name: '€', parts: 4, total: '€230' }]);
        await a.lines([['200 \\times 1.15 = €230', '£ → €: multiply'], ['69 \\div 1.15 = \\pounds 60', '€ → £: divide']], ctx, 1400);
      },
    },
    {
      title: 'Comparing prices in two countries',
      text: '<p>Trainers cost £85 in London and €95 in Madrid. With £1 = €1.15, where are they cheaper?</p>',
      async on(a, ctx) {
        a.reset();
        await a.lines([['€95 \\div 1.15 = \\pounds 82.61', 'Madrid price in pounds'], ['\\pounds 82.61 < \\pounds 85', 'cheaper in Madrid']], ctx, 1400);
      },
    },
    {
      title: 'Try it: change your money',
      text: '<p>Choose an exchange rate and an amount. See pounds turned into euros, and the same number of euros turned back into pounds.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'bestbuy',
  gens: [
    () => { let m1, m2, p1, p2; do { m1 = FD.pick([200, 250, 300, 400, 500]); m2 = FD.pick([600, 750, 800, 1000]); p1 = FD.rnd(80, 300); p2 = FD.rnd(200, 700); } while (Math.abs(p1 / m1 - p2 / m2) < 0.0004 || !Number.isInteger(p1 / 5) || !Number.isInteger(p2 / 5)); const best = p1 / m1 < p2 / m2 ? 0 : 1; const opts = [`${m1} g for ${FD.gbp(p1 / 100)}`, `${m2} g for ${FD.gbp(p2 / 100)}`]; return { type: 'mcq', q: 'Which pack is the better buy?', opts: best ? [opts[1], opts[0]] : opts, why: `Price per 100 g: ${FD.round((p1 / m1) * 100, 2)}p and ${FD.round((p2 / m2) * 100, 2)}p. The lower one is better value.` }; },
    () => { const r = FD.pick([1.1, 1.15, 1.2, 1.25, 1.3, 1.4, 1.6]), p = FD.pick([20, 40, 50, 80, 100, 150, 200, 250, 400]), cur = FD.pick([['euros', '€'], ['dollars', '$']]); return { type: 'num', q: `£1 = ${cur[1]}${r}. Change £${p} into ${cur[0]}.`, a: FD.round(p * r, 2), why: `Multiply: \\(${p} \\times ${r} = ${FD.round(p * r, 2)}\\).` }; },
    () => { const r = FD.pick([1.2, 1.25, 1.5, 1.6, 2]), p = FD.pick([20, 40, 60, 80, 100, 120, 200]), e = FD.round(p * r, 2); return { type: 'num', q: `£1 = $${r}. Change $${e} into pounds.`, a: p, why: `Divide: \\(${e} \\div ${r} = ${p}\\).` }; },
  ],
});

FD.check({
  section: 'bestbuy',
  items: [
    { type: 'mcq', q: 'Which is the better buy?', opts: ['6 rolls for £2.40', '4 rolls for £1.80', 'They are the same', 'You cannot tell'], why: '40p per roll against 45p per roll.' },
    { type: 'num', q: '£1 = €1.20. Change £75 into euros.', a: 90, why: '\\(75 \\times 1.2 = 90\\).' },
    { type: 'num', q: '£1 = $1.25. Change $150 into pounds.', a: 120, why: '\\(150 \\div 1.25 = 120\\).' },
    { type: 'tf', q: 'To change euros into pounds, multiply by the rate £1 = €1.15.', a: false, why: 'Divide by 1.15.' },
  ],
});
