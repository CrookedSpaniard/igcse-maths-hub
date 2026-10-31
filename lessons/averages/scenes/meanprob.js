FD.add({
  id: 'meanprob',
  title: 'Problems with the mean',
  tab: 'Mean problems',
  icon: 'target',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Total from the mean', 'Total = mean × number of values.'],
    ['Combined mean', 'Add the totals of the groups, then divide by the total number of values.'],
  ],
  mount(el) {
    const known = [62, 75, 58, 81];
    const a = FD.board(el, 'mp-s', '<div id="st"></div>', `
      <label class="ctrl">Mean wanted <input type="range" id="rm" min="60" max="85" value="70"><output id="om">70</output></label>`, () => sync());
    a.stk = FD.stacks(a.$('#st'));
    const sync = () => {
      const m = +a.$('#rm').value, need = 5 * m - known.reduce((s, x) => s + x, 0); a.$('#om').textContent = m;
      a.stk([...known, Math.max(need, 0)]);
      a.big(`5 \\times ${m} - (62 + 75 + 58 + 81) = ${5 * m} - 276 = ${need}`);
      a.msg(need > 100 ? `You would need ${need} marks out of 100 in the last test: impossible!` : `Ravi needs ${need} in the last test for a mean of ${m}.`, need > 100 ? 'bad' : 'good');
    };
    a.$('#rm').addEventListener('input', sync);
    a.stk([62, 75, 58, 81, 74]);
    return a;
  },
  steps: [
    {
      title: 'Work backwards to the total',
      text: '<p>The mean of 5 numbers is 12. What is their total?</p><p>Mean = total ÷ number, so <b>total = mean × number</b>: \\(12 \\times 5 = 60\\).</p>',
      async on(a, ctx) { a.reset(); a.stk([12, 12, 12, 12, 12]); a.big('\\text{total} = 12 \\times 5 = 60'); },
    },
    {
      title: 'A missing value',
      text: '<p>Ravi’s first four test marks are 62, 75, 58 and 81. He wants a mean of 70 after five tests. What must he score in the fifth?</p>',
      async on(a, ctx) {
        a.reset(); a.stk([62, 75, 58, 81, 74]);
        await a.lines([['5 \\times 70 = 350', 'total needed'], ['62 + 75 + 58 + 81 = 276', 'total so far'], ['350 - 276 = 74', 'fifth mark']], ctx, 1300);
      },
    },
    {
      title: 'Combining groups',
      text: '<p>Class A: 20 students, mean 64. Class B: 30 students, mean 74. What is the mean of all 50?</p>',
      tip: 'It is NOT (64 + 74) ÷ 2 = 69: the classes are different sizes.',
      async on(a, ctx) {
        a.reset(); a.stk([64, 74]);
        await a.lines([['20 \\times 64 = 1280', 'class A total'], ['30 \\times 74 = 2220', 'class B total'], ['\\frac{1280 + 2220}{50} = 70', 'combined mean']], ctx, 1300);
      },
    },
    {
      title: 'Try it: what do I need?',
      text: '<p>Choose the mean Ravi wants after five tests. The last stack shows the mark he needs in test 5.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'meanprob',
  gens: [
    () => { const n = FD.rnd(4, 9), m = FD.rnd(5, 30); return { type: 'num', q: `The mean of ${n} numbers is ${m}. What is their total?`, a: n * m, why: `Total = mean × number = \\(${m} \\times ${n} = ${n * m}\\).` }; },
    () => { const n = FD.rnd(4, 6), m = FD.rnd(10, 40), known = Array.from({ length: n - 1 }, () => FD.rnd(m - 8, m + 8)), last = n * m - known.reduce((s, x) => s + x, 0); return { type: 'num', q: `${n} numbers have a mean of ${m}. ${n - 1} of them are ${known.join(', ')}. Find the last number.`, a: last, why: `Total \\(${n} \\times ${m} = ${n * m}\\). Known total ${known.reduce((s, x) => s + x, 0)}. Last: \\(${n * m} - ${known.reduce((s, x) => s + x, 0)} = ${last}\\).` }; },
    () => { let n1, m1, n2, m2, c; do { n1 = FD.rnd(5, 30); n2 = FD.rnd(5, 30); m1 = FD.rnd(20, 80); m2 = FD.rnd(20, 80); c = (n1 * m1 + n2 * m2) / (n1 + n2); } while (!Number.isInteger(FD.dec(c * 10))); return { type: 'num', q: `Group A has ${n1} people with a mean age of ${m1}. Group B has ${n2} people with a mean age of ${m2}. Find the mean age of all ${n1 + n2} people.`, a: FD.dec(c), why: `Totals: \\(${n1} \\times ${m1} = ${n1 * m1}\\), \\(${n2} \\times ${m2} = ${n2 * m2}\\). \\(\\dfrac{${n1 * m1 + n2 * m2}}{${n1 + n2}} = ${FD.dec(c)}\\).` }; },
  ],
});

FD.check({
  section: 'meanprob',
  items: [
    { type: 'num', q: 'The mean of 6 numbers is 15. What is their total?', a: 90, why: '\\(6 \\times 15\\).' },
    { type: 'num', q: 'Three numbers have a mean of 8. Two of them are 5 and 9. What is the third?', a: 10, why: '\\(24 - 14 = 10\\).' },
    { type: 'num', q: '10 boys have a mean height of 160 cm and 15 girls have a mean height of 150 cm. Find the mean height of all 25.', a: 154, why: '\\((1600 + 2250) \\div 25 = 154\\).' },
    { type: 'tf', q: 'To combine two means you can always just average them.', a: false, why: 'Only if the groups are the same size.' },
  ],
});
