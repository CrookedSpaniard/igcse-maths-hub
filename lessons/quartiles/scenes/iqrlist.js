FD.L15 = [12, 7, 15, 22, 9, 18, 11, 25, 14, 8, 20, 16, 13, 30, 10];

FD.add({
  id: 'iqrlist',
  title: 'Quartiles of a list',
  tab: 'Quartiles',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Lower quartile (\\(Q_1\\))', 'A quarter of the way through the ordered data: the \\(\\frac{n + 1}{4}\\)th value.'],
    ['Median (\\(Q_2\\))', 'Halfway: the \\(\\frac{n + 1}{2}\\)th value.'],
    ['Upper quartile (\\(Q_3\\))', 'Three quarters of the way: the \\(\\frac{3(n + 1)}{4}\\)th value.'],
  ],
  mount(el) {
    const a = FD.board(el, 'iq-s', '<div id="ch"></div>', `
      <div class="bd-btns"><button class="btn" id="bNew">New data ↻</button><button class="btn ghost" id="bQ">Show the quartiles</button></div>`, () => fresh());
    a.ch = FD.qChips(a.$('#ch'));
    let data = FD.L15;
    const fresh = () => { const n = FD.pick([7, 11, 15, 19]); data = Array.from({ length: n }, () => FD.rnd(1, 60)); a.ch(data, false); a.big(''); a.msg(`${n} values, in order. Where are the quartiles?`); };
    a.$('#bNew').addEventListener('click', fresh);
    a.$('#bQ').addEventListener('click', () => { const q = FD.quart(data), n = q.n; a.ch(data, true); a.big(`Q_1 = ${q.q1} \\ (${(n + 1) / 4}\\text{th}) \\quad Q_2 = ${q.med} \\ (${(n + 1) / 2}\\text{th}) \\quad Q_3 = ${q.q3} \\ (${(3 * (n + 1)) / 4}\\text{th}) \\quad \\text{IQR} = ${q.iqr}`); a.msg('Count along the ordered list to each position.'); });
    a.ch(FD.L15, false);
    return a;
  },
  steps: [
    {
      title: 'Put the data in order',
      text: '<p>The number of minutes 15 buses were late: 12, 7, 15, 22, 9, 18, 11, 25, 14, 8, 20, 16, 13, 30, 10.</p><p>First, write them <b>in order</b>.</p>',
      async on(a, ctx) { a.reset(); a.$('#ch').innerHTML = `<div class="chips">${FD.L15.map((x) => `<span>${x}</span>`).join('')}</div>`; if (!(await ctx.sleep(1300))) return; a.ch(FD.L15, false); },
    },
    {
      title: 'Find the positions',
      text: '<p>With \\(n = 15\\) values, use \\(n + 1 = 16\\):</p>',
      tip: 'These are positions in the ordered list, not the values themselves.',
      async on(a, ctx) {
        a.reset(); a.ch(FD.L15, false);
        await a.lines([['Q_1: \\frac{16}{4} = 4\\text{th value}', ''], ['Q_2: \\frac{16}{2} = 8\\text{th value}', ''], ['Q_3: \\frac{3 \\times 16}{4} = 12\\text{th value}', '']], ctx, 1300);
      },
    },
    {
      title: 'Read the quartiles',
      text: '<p>Count along: the 4th value is 10, the 8th is 14 and the 12th is 20.</p><p>So the IQR is \\(20 - 10 = 10\\) minutes. The middle half of the buses were between 10 and 20 minutes late.</p>',
      async on(a, ctx) { a.reset(); a.ch(FD.L15, true); a.big('Q_1 = 10 \\quad Q_2 = 14 \\quad Q_3 = 20 \\quad \\text{IQR} = 20 - 10 = 10'); },
    },
    {
      title: 'When the position is not a whole number',
      text: '<p>With 8 values the lower quartile is at \\(\\frac{9}{4} = 2.25\\). Take the value a quarter of the way from the 2nd to the 3rd. With the 2nd = 6 and the 3rd = 10: \\(6 + 0.25 \\times 4 = 7\\).</p>',
      async on(a, ctx) { a.reset(); const L = [3, 6, 10, 11, 15, 17, 19, 24]; a.ch(L, true); a.big('Q_1 = 6 + 0.25 \\times (10 - 6) = 7'); },
    },
    {
      title: 'Try it: find the quartiles',
      text: '<p>Press <b>New data</b>. Work out the positions and the quartiles yourself, then press <b>Show the quartiles</b> to check.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'iqrlist',
  gens: [
    () => { const n = FD.pick([7, 11, 15, 19]), l = Array.from({ length: n }, () => FD.rnd(1, 50)), q = FD.quart(l); return { type: 'num', q: `Find the lower quartile and the upper quartile of: ${l.join(', ')}.`, a: [q.q1, q.q3], fields: ['\\(Q_1 =\\)', '\\(Q_3 =\\)'], why: `In order: ${q.s.join(', ')}. \\(n + 1 = ${n + 1}\\): \\(Q_1\\) is the ${(n + 1) / 4}th value, ${q.q1}; \\(Q_3\\) is the ${(3 * (n + 1)) / 4}th value, ${q.q3}.` }; },
    () => { const n = FD.pick([7, 11, 15]), l = Array.from({ length: n }, () => FD.rnd(10, 90)), q = FD.quart(l); return { type: 'num', q: `Work out the interquartile range of: ${l.join(', ')}.`, a: q.iqr, why: `In order: ${q.s.join(', ')}. \\(Q_1 = ${q.q1}\\), \\(Q_3 = ${q.q3}\\). IQR \\(= ${q.q3} - ${q.q1} = ${q.iqr}\\).` }; },
    () => { const n = FD.pick([19, 23, 27, 31, 39, 43]); return { type: 'num', q: `A list has ${n} values in order. Which position is the upper quartile?`, a: (3 * (n + 1)) / 4, why: `\\(\\frac{3(${n} + 1)}{4} = ${(3 * (n + 1)) / 4}\\)th value.` }; },
  ],
});

FD.check({
  section: 'iqrlist',
  items: [
    { type: 'num', q: 'Find the lower quartile of 3, 5, 6, 8, 9, 12, 14.', a: 5, why: '\\(\\frac{8}{4} = 2\\)nd value.' },
    { type: 'num', q: 'Find the IQR of 4, 7, 9, 10, 13, 15, 16, 18, 21, 22, 25.', a: 12, why: '\\(n + 1 = 12\\): \\(Q_1\\) is the 3rd value, 9; \\(Q_3\\) is the 9th value, 21. IQR \\(= 21 - 9 = 12\\).' },
    { type: 'mcq', q: 'For 23 ordered values, the lower quartile is the…', opts: ['6th value', '5.75th value', '12th value', '18th value'], why: '\\(\\frac{24}{4} = 6\\).' },
    { type: 'tf', q: 'You must put the data in order before finding the quartiles.', a: true, why: 'Quartiles are positions in the ordered list.' },
  ],
});
