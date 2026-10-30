FD.add({
  id: 'proportion',
  title: 'Direct proportion',
  tab: 'Proportion',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Direct proportion', 'Two quantities that grow at the same rate: double one and the other doubles.'],
    ['Unitary method', 'Find the value of <b>one</b> first, then multiply to find any amount.'],
    ['Scale factor', 'The number you multiply by, e.g. a recipe for 4 made for 6 uses a scale factor of \\(\\tfrac64 = 1.5\\).'],
  ],
  mount(el) {
    const base = [['flour', 300, 'g'], ['butter', 150, 'g'], ['sugar', 100, 'g'], ['eggs', 2, '']];
    const a = FD.board(el, 'pr-s', '<div id="bm"></div>', `
      <label class="ctrl">People <input type="range" id="rn" min="1" max="16" value="6"><output id="on">6</output></label>`, () => sync());
    a.bm = FD.barModel(a.$('#bm'));
    const sync = () => {
      const n = +a.$('#rn').value, k = n / 4; a.$('#on').textContent = n;
      a.bm([{ name: 'for 4', parts: 4, total: '300 g flour' }, { name: `for ${n}`, parts: n, total: `${FD.round(300 * k, 1)} g flour` }], 75);
      a.big(base.map(([t, v, u]) => `\\text{${t}: } ${FD.round(v * k, 2)}${u ? '\\text{ ' + u + '}' : ''}`).join(' \\quad '));
      a.msg(`For 1 person, divide by 4. For ${n} people, multiply by ${n}: scale factor ${FD.round(k, 3)}.${!Number.isInteger(2 * k) ? ' (You cannot use part of an egg: round sensibly!)' : ''}`);
    };
    a.$('#rn').addEventListener('input', sync);
    a.bm([{ name: 'for 4', parts: 4 }]);
    return a;
  },
  steps: [
    {
      title: 'Find one, then multiply',
      text: '<p>5 notebooks cost £3.50. How much do 8 notebooks cost?</p><p>Find the cost of <b>one</b> notebook first.</p>',
      tip: 'Write the quantity you want to find on the right of each line.',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '5 books', parts: 5, total: '£3.50' }, { name: '8 books', parts: 8, total: '£5.60' }], '70p');
        await a.lines([['5 \\text{ notebooks} \\to \\pounds 3.50', ''], ['1 \\text{ notebook} \\to 3.50 \\div 5 = \\pounds 0.70', 'divide'], ['8 \\text{ notebooks} \\to 8 \\times 0.70 = \\pounds 5.60', 'multiply']], ctx, 1300);
      },
    },
    {
      title: 'Recipes',
      text: '<p>A recipe for 4 people uses 300 g of flour. How much flour is needed for 6 people?</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'for 4', parts: 4, total: '300 g' }, { name: 'for 6', parts: 6, total: '450 g' }], 75);
        await a.lines([['1 \\text{ person} \\to 300 \\div 4 = 75 \\text{ g}', ''], ['6 \\text{ people} \\to 6 \\times 75 = 450 \\text{ g}', ''], ['\\text{or: } 300 \\times \\tfrac{6}{4} = 450', 'scale factor 1.5']], ctx, 1300);
      },
    },
    {
      title: 'Is it in proportion?',
      text: '<p>Two quantities are in <b>direct proportion</b> if their ratio stays the same. On a graph they make a straight line through (0, 0).</p><p>Taxi fares with a fixed starting charge are <b>not</b> in direct proportion.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '2 kg', parts: 2, total: '£3' }, { name: '6 kg', parts: 6, total: '£9' }], '£1.50');
        await a.lines([['\\frac{3}{2} = \\frac{9}{6} = 1.5', 'same ratio: in proportion'], ['\\text{taxi: } \\pounds 3 + \\pounds 2 \\text{ per km}', '2 km £7, 4 km £11: not doubled']], ctx, 1500);
      },
    },
    {
      title: 'A problem in context',
      text: '<p>A machine fills 240 bottles in 15 minutes. At the same rate, how many bottles does it fill in 40 minutes?</p>',
      async on(a, ctx) {
        a.reset();
        await a.lines([['1 \\text{ minute} \\to 240 \\div 15 = 16 \\text{ bottles}', ''], ['40 \\text{ minutes} \\to 40 \\times 16 = 640 \\text{ bottles}', '']], ctx, 1300);
      },
    },
    {
      title: 'Try it: scale the recipe',
      text: '<p>The recipe is for 4 people. Choose how many people you are cooking for: every ingredient is scaled by the same factor.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'proportion',
  gens: [
    () => { const n1 = FD.rnd(2, 9), unit = FD.pick([15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 120]), n2 = FD.rnd(2, 15), item = FD.pick(['pens', 'tickets', 'cakes', 'bottles of water']); return { type: 'num', q: `${n1} ${item} cost ${FD.gbp((n1 * unit) / 100)}. How much do ${n2} ${item} cost, in pounds?`, a: FD.dec((n2 * unit) / 100), why: `One costs \\(${FD.dec((n1 * unit) / 100)} \\div ${n1} = ${FD.dec(unit / 100)}\\). ${n2} cost \\(${n2} \\times ${FD.dec(unit / 100)} = ${FD.dec((n2 * unit) / 100)}\\).` }; },
    () => { const p1 = FD.pick([2, 3, 4, 5, 6, 8]), q = FD.pick([50, 60, 75, 100, 120, 150, 200, 250]), g = q * p1, p2 = FD.rnd(1, 12); return { type: 'num', q: `A recipe for ${p1} people uses ${g} g of rice. How much rice is needed for ${p2} people, in grams?`, a: q * p2, why: `For 1 person: \\(${g} \\div ${p1} = ${q}\\) g. For ${p2}: \\(${p2} \\times ${q} = ${q * p2}\\) g.` }; },
    () => { const r = FD.pick([4, 6, 8, 12, 15, 20]), t1 = FD.pick([5, 10, 15, 20, 30]), t2 = FD.pick([25, 40, 45, 60, 90]); return { type: 'num', q: `A printer prints ${r * t1} pages in ${t1} minutes. How many pages does it print in ${t2} minutes?`, a: r * t2, why: `Per minute: \\(${r * t1} \\div ${t1} = ${r}\\). In ${t2} minutes: \\(${t2} \\times ${r} = ${r * t2}\\).` }; },
  ],
});

FD.check({
  section: 'proportion',
  items: [
    { type: 'num', q: '6 apples cost £1.80. How much do 10 apples cost, in pounds?', a: 3, why: 'One costs £0.30; ten cost £3.' },
    { type: 'num', q: 'A recipe for 8 uses 600 ml of milk. How much milk for 3 people, in ml?', a: 225, why: '\\(600 \\div 8 = 75\\), \\(3 \\times 75 = 225\\).' },
    { type: 'tf', q: 'If 3 kg of potatoes cost £2.40, then 6 kg cost £4.80 (same price per kg).', a: true, why: 'Double the mass, double the cost.' },
    { type: 'mcq', q: 'Which of these is in direct proportion?', opts: ['Cost of petrol and litres bought', 'A person’s age and height', 'Taxi fare with a £3 start charge and distance', 'Temperature and time of day'], why: 'Each litre costs the same, so double the litres means double the cost.' },
  ],
});
