FD.add({
  id: 'share',
  title: 'Sharing in a ratio',
  tab: 'Sharing',
  icon: 'shapes',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Total parts', 'Add the numbers in the ratio: 2 : 3 has 5 parts.'],
    ['One part', 'The amount divided by the total number of parts.'],
    ['Difference', 'If you know the difference between two shares, it matches the difference in parts.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sh-s', '<div id="bm"></div>', `
      <label class="ctrl">Amount (£) <input type="range" id="rt" min="10" max="300" step="5" value="60"><output id="ot">60</output></label>
      <label class="ctrl">Ana's parts <input type="range" id="ra" min="1" max="7" value="2"><output id="oa">2</output></label>
      <label class="ctrl">Ben's parts <input type="range" id="rb" min="1" max="7" value="3"><output id="ob">3</output></label>`, () => sync());
    a.bm = FD.barModel(a.$('#bm'));
    const sync = () => {
      const T = +a.$('#rt').value, x = +a.$('#ra').value, y = +a.$('#rb').value, one = FD.dec(T / (x + y));
      a.$('#ot').textContent = T; a.$('#oa').textContent = x; a.$('#ob').textContent = y;
      a.bm([{ name: 'Ana', parts: x, total: FD.gbp(one * x) }, { name: 'Ben', parts: y, total: FD.gbp(one * y) }], Number.isInteger(one) ? one : FD.round(one, 2));
      a.big(`${T} \\div ${x + y} = ${FD.round(one, 2)} \\text{ per part}`);
      a.msg(Number.isInteger(one * 100) ? `Check: ${FD.gbp(one * x)} + ${FD.gbp(one * y)} = £${T}.` : 'One part is not an exact amount of money here: the shares are rounded to the nearest penny.');
    };
    ['#rt', '#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.bm([{ name: 'Ana', parts: 2 }, { name: 'Ben', parts: 3 }]);
    return a;
  },
  steps: [
    {
      title: 'Three steps',
      text: '<p>Share £60 between Ana and Ben in the ratio 2 : 3.</p><p>1. Add the parts: 5. &nbsp;2. One part: \\(60 \\div 5 = 12\\). &nbsp;3. Multiply: Ana \\(2 \\times 12\\), Ben \\(3 \\times 12\\).</p>',
      tip: 'Check: the shares add up to the amount.',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'Ana', parts: 2 }, { name: 'Ben', parts: 3 }]);
        if (!(await a.lines([['2 + 3 = 5 \\text{ parts}', ''], ['60 \\div 5 = 12', 'one part']], ctx, 1200))) return;
        a.bm([{ name: 'Ana', parts: 2, total: '£24' }, { name: 'Ben', parts: 3, total: '£36' }], 12);
        a.big('\\text{Ana } \\pounds 24, \\quad \\text{Ben } \\pounds 36');
      },
    },
    {
      title: 'Three people',
      text: '<p>Share 180 g of sweets in the ratio 1 : 3 : 5. The method is the same with more parts.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'Cy', parts: 1, total: '20 g' }, { name: 'Di', parts: 3, total: '60 g' }, { name: 'Ed', parts: 5, total: '100 g' }], 20);
        await a.lines([['1 + 3 + 5 = 9', ''], ['180 \\div 9 = 20', 'one part'], ['20, \\; 60, \\; 100 \\text{ g}', '']], ctx, 1200);
      },
    },
    {
      title: 'When you know one share',
      text: '<p>Paint is mixed red : white = 2 : 7. Lia uses 21 litres of white. How much red does she use?</p><p>7 parts = 21 litres, so one part = 3 litres.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'red', parts: 2, total: '6 L' }, { name: 'white', parts: 7, total: '21 L' }], 3);
        await a.lines([['7 \\text{ parts} = 21', ''], ['1 \\text{ part} = 3', ''], ['\\text{red} = 2 \\times 3 = 6 \\text{ litres}', '']], ctx, 1200);
      },
    },
    {
      title: 'When you know the difference',
      text: '<p>Sam and Tia share money in the ratio 3 : 8. Tia gets £35 more than Sam. How much does Sam get?</p><p>The difference is \\(8 - 3 = 5\\) parts.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'Sam', parts: 3, total: '£21' }, { name: 'Tia', parts: 8, total: '£56' }], 7);
        await a.lines([['5 \\text{ parts} = \\pounds 35', 'the difference'], ['1 \\text{ part} = \\pounds 7', ''], ['\\text{Sam} = 3 \\times 7 = \\pounds 21', '']], ctx, 1200);
      },
    },
    {
      title: 'Try it: share the money',
      text: '<p>Choose an amount and a ratio. The bar model shows one part in each box, and each person’s share.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'share',
  gens: [
    () => { let p, q; do { p = FD.rnd(1, 7); q = FD.rnd(1, 7); } while (FD.gcd(p, q) !== 1); const one = FD.rnd(2, 30), T = one * (p + q), ask = FD.rnd(0, 1); return { type: 'num', q: `Share £${T} in the ratio ${p} : ${q}. How much is the ${ask ? 'larger' : 'smaller'} share?`, a: one * (ask ? Math.max(p, q) : Math.min(p, q)), why: `${p + q} parts. One part = \\(${T} \\div ${p + q} = ${one}\\). Shares: £${one * p} and £${one * q}.` }; },
    () => { const r = [FD.rnd(1, 4), FD.rnd(1, 5), FD.rnd(1, 6)], one = FD.rnd(3, 20), s = r[0] + r[1] + r[2], T = one * s; return { type: 'num', q: `${T} sweets are shared in the ratio ${r.join(' : ')}. How many does the last person get?`, a: one * r[2], why: `${s} parts. One part = \\(${T} \\div ${s} = ${one}\\). Last share: \\(${r[2]} \\times ${one} = ${one * r[2]}\\).` }; },
    () => { let p, q; do { p = FD.rnd(1, 6); q = FD.rnd(p + 1, 9); } while (FD.gcd(p, q) !== 1); const one = FD.rnd(2, 15); return { type: 'num', q: `Ali and Bea share money in the ratio ${p} : ${q}. Bea gets £${one * (q - p)} more than Ali. How much does Ali get?`, a: one * p, why: `Difference: \\(${q} - ${p} = ${q - p}\\) parts = £${one * (q - p)}, so one part = £${one}. Ali: \\(${p} \\times ${one} = ${one * p}\\).` }; },
    () => { let p, q; do { p = FD.rnd(1, 7); q = FD.rnd(1, 9); } while (FD.gcd(p, q) !== 1 || p === q); const one = FD.rnd(2, 12); return { type: 'num', q: `Sand and cement are mixed in the ratio ${p} : ${q}. There are ${one * p} kg of sand. How much cement is needed, in kg?`, a: one * q, why: `${p} parts = ${one * p} kg, so one part = ${one} kg. Cement: \\(${q} \\times ${one} = ${one * q}\\) kg.` }; },
  ],
});

FD.check({
  section: 'share',
  items: [
    { type: 'num', q: 'Share £84 in the ratio 3 : 4. What is the larger share, in pounds?', a: 48, why: '\\(84 \\div 7 = 12\\), \\(4 \\times 12 = 48\\).' },
    { type: 'num', q: 'Share 150 in the ratio 1 : 2 : 7. What is the largest share?', a: 105, why: '\\(150 \\div 10 = 15\\), \\(7 \\times 15 = 105\\).' },
    { type: 'num', q: 'Boys : girls = 4 : 5. There are 36 boys. How many girls are there?', a: 45, why: '4 parts = 36, 1 part = 9, 5 parts = 45.' },
    { type: 'num', q: 'Red : blue = 2 : 5. There are 12 more blue than red. How many red are there?', a: 8, why: '3 parts = 12, 1 part = 4, red = 8.' },
  ],
});
