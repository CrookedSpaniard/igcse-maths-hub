// The BIDMAS ladder: four cards; lad(k) lights level k (0 B, 1 I, 2 DM, 3 AS) and dims the levels before it.
FD.ladder = (host) => {
  host.innerHTML = `<div class="bm-ladder">${[['B', 'Brackets'], ['I', 'Indices: powers and roots'], ['D M', 'Divide, multiply: left to right'], ['A S', 'Add, subtract: left to right']].map(([b, s]) => `<div class="bm-card"><b>${b}</b><small>${s}</small></div>`).join('')}</div>`;
  const cards = [...host.querySelectorAll('.bm-card')];
  return (k = -1, dim = true) => cards.forEach((c, i) => { c.classList.toggle('on', i === k); c.classList.toggle('done', dim && k >= 0 && i < k); });
};
// Worked BIDMAS examples: [start, [[line, level], …]].
FD.BIDMAS = {
  '3 + 4 \\times 5': [['3 + \\underbrace{4 \\times 5}_{20}', 2], ['3 + 20 = 23', 3]],
  '(3 + 4) \\times 5': [['\\underbrace{(3 + 4)}_{7} \\times 5', 0], ['7 \\times 5 = 35', 2]],
  '20 - 12 \\div 4 + 1': [['20 - \\underbrace{12 \\div 4}_{3} + 1', 2], ['\\underbrace{20 - 3}_{17} + 1', 3], ['17 + 1 = 18', 3]],
  '2 \\times 3^2 - (8 - 5)': [['2 \\times 3^2 - \\underbrace{(8 - 5)}_{3}', 0], ['2 \\times \\underbrace{3^2}_{9} - 3', 1], ['\\underbrace{2 \\times 9}_{18} - 3', 2], ['18 - 3 = 15', 3]],
  '48 \\div 6 \\times 2 - 4^2 \\div 8': [['48 \\div 6 \\times 2 - \\underbrace{4^2}_{16} \\div 8', 1], ['\\underbrace{48 \\div 6}_{8} \\times 2 - 16 \\div 8', 2], ['\\underbrace{8 \\times 2}_{16} - 16 \\div 8', 2], ['16 - \\underbrace{16 \\div 8}_{2}', 2], ['16 - 2 = 14', 3]],
};

FD.add({
  id: 'bidmas',
  title: 'The order of operations (BIDMAS)',
  tab: 'BIDMAS',
  icon: 'calc',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['BIDMAS', 'The order to do a calculation: Brackets, Indices, Division and Multiplication, Addition and Subtraction.'],
    ['Indices', 'Powers and roots, like \\(5^2\\) or \\(\\sqrt{9}\\).'],
    ['Left to right', 'Division and multiplication have the same priority, so do them in the order they appear. The same for addition and subtraction.'],
  ],
  mount(el) {
    const keys = Object.keys(FD.BIDMAS);
    const a = FD.board(el, 'bm-s', '<div id="lad"></div>', `
      <div class="bd-row"><label>Calculation <select id="pre">${keys.map((k, i) => `<option value="${i}">${k.replace(/\\\\times/g, '×').replace(/\\\\div/g, '÷').replace(/\^2/g, '²')}</option>`).join('')}</select></label></div>
      <div class="bd-btns"><button class="btn" id="bNext">Next step ▶</button><button class="btn ghost" id="bAgain">↺ Start again</button></div>`, () => start());
    a.lad = FD.ladder(a.$('#lad'));
    let k = 0, L = [];
    const start = () => {
      const key = keys[+a.$('#pre').value]; L = FD.BIDMAS[key]; k = 0;
      a.work([[key, 'start'], ...L.map(([t], i) => [t, i === L.length - 1 ? 'answer' : ''])]); a.upto(0); a.lad(-1); a.msg('Press <b>Next step</b>: which operation comes first?', 'good');
      a.$('#bNext').disabled = false;
    };
    a.$('#pre').addEventListener('input', start);
    a.$('#bAgain').addEventListener('click', start);
    a.$('#bNext').addEventListener('click', () => {
      if (k >= L.length) return;
      a.lad(L[k][1], false); k++; a.upto(k);
      a.msg(['Brackets first.', 'Indices (powers) next.', 'Division and multiplication, from left to right.', 'Addition and subtraction, from left to right.'][L[k - 1][1]], 'good');
      if (k >= L.length) a.$('#bNext').disabled = true;
    });
    a.lad(-1);
    return a;
  },
  steps: [
    {
      title: 'Two different answers?',
      text: '<p>What is \\(2 + 3 \\times 4\\)?</p><p>Working left to right gives 20. But the correct answer is <b>14</b>: multiplication comes <b>before</b> addition.</p>',
      tip: 'Everyone in the world agrees on one order, so a calculation has only one answer.',
      async on(a, ctx) {
        a.reset(); a.lad(-1);
        await a.lines([['2 + 3 \\times 4', ''], ['\\textcolor{#B84545}{5 \\times 4 = 20}', '✗ left to right'], ['2 + 12 = 14', '✓ multiply first']], ctx, 1300);
        a.lad(2, false);
      },
    },
    {
      title: 'The BIDMAS order',
      text: '<p><b>B</b>rackets → <b>I</b>ndices → <b>D</b>ivision and <b>M</b>ultiplication → <b>A</b>ddition and <b>S</b>ubtraction.</p><p>D and M are on the <b>same level</b>; so are A and S.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k < 4; k++) { a.lad(k); if (!(await ctx.sleep(1000))) return; }
        a.lad(-1);
      },
    },
    {
      title: 'Same level: left to right',
      text: '<p>\\(24 \\div 4 \\times 3\\): division and multiplication are on the same level, so go <b>left to right</b>.</p><p>\\(24 \\div 4 = 6\\), then \\(6 \\times 3 = 18\\). (Not \\(24 \\div 12 = 2\\).)</p>',
      tip: 'In the same way, \\(10 - 4 + 3 = 9\\), not 3.',
      async on(a, ctx) {
        a.reset(); a.lad(2, false);
        await a.lines([['24 \\div 4 \\times 3', ''], ['\\underbrace{24 \\div 4}_{6} \\times 3', 'leftmost first'], ['6 \\times 3 = 18', '']], ctx, 1200);
      },
    },
    {
      title: 'A full example',
      text: '<p>Work out \\(5 + 2 \\times (7 - 3)^2 \\div 8\\).</p><p>Do <b>one operation at a time</b> and rewrite the line each time.</p>',
      async on(a, ctx) {
        a.reset();
        const L = [['5 + 2 \\times (\\underbrace{7 - 3}_{4})^2 \\div 8', 0], ['5 + 2 \\times \\underbrace{4^2}_{16} \\div 8', 1], ['5 + \\underbrace{2 \\times 16}_{32} \\div 8', 2], ['5 + \\underbrace{32 \\div 8}_{4}', 2], ['5 + 4 = 9', 3]];
        a.work(L.map(([t], i) => [t, ['brackets', 'indices', 'multiply (left first)', 'divide', 'add'][i]]));
        for (let i = 0; i < L.length; i++) { a.upto(i); a.lad(L[i][1]); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Try it: one step at a time',
      text: '<p>Choose a calculation. Press <b>Next step</b> to do one operation at a time. The BIDMAS card for each step lights up.</p>',
      tip: 'Before you press, say which operation comes next.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'bidmas',
  gens: [
    () => { const x = FD.rnd(2, 20), y = FD.rnd(2, 9), z = FD.rnd(2, 9), op = FD.pick(['+', '-']); const r = op === '+' ? x + y * z : x - y * z; return { type: 'num', q: `Work out \\(${x} ${op} ${y} \\times ${z}\\)`, a: r, why: `Multiply first: \\(${y} \\times ${z} = ${y * z}\\). Then \\(${x} ${op} ${y * z} = ${r}\\).` }; },
    () => { const x = FD.rnd(2, 12), y = FD.rnd(2, 12), z = FD.rnd(2, 6), w = FD.rnd(1, 20); const r = (x + y) * z - w; return { type: 'num', q: `Work out \\((${x} + ${y}) \\times ${z} - ${w}\\)`, a: r, why: `Brackets: \\(${x} + ${y} = ${x + y}\\). Multiply: \\(${x + y} \\times ${z} = ${(x + y) * z}\\). Subtract: \\(${(x + y) * z} - ${w} = ${r}\\).` }; },
    () => { const d = FD.rnd(2, 9), q = FD.rnd(2, 12), x = FD.rnd(10, 60); return { type: 'num', q: `Work out \\(${x} - ${d * q} \\div ${d}\\)`, a: x - q, why: `Divide first: \\(${d * q} \\div ${d} = ${q}\\). Then \\(${x} - ${q} = ${x - q}\\).` }; },
    () => { const b = FD.rnd(2, 6), c = FD.rnd(2, 5), x = FD.rnd(1, 30); return { type: 'num', q: `Work out \\(${x} + ${b}^2 \\times ${c}\\)`, a: x + b * b * c, why: `Index first: \\(${b}^2 = ${b * b}\\). Multiply: \\(${b * b} \\times ${c} = ${b * b * c}\\). Add: \\(${x} + ${b * b * c} = ${x + b * b * c}\\).` }; },
    () => { const q = FD.rnd(2, 9), d = FD.rnd(2, 6), m = FD.rnd(2, 5); return { type: 'num', q: `Work out \\(${q * d} \\div ${d} \\times ${m}\\)`, a: q * m, why: `Division and multiplication are on the same level: go left to right. \\(${q * d} \\div ${d} = ${q}\\), then \\(${q} \\times ${m} = ${q * m}\\).` }; },
  ],
});

FD.check({
  section: 'bidmas',
  items: [
    { type: 'num', q: 'Work out \\(10 - 2 \\times 3\\)', a: 4, why: 'Multiply first: \\(2 \\times 3 = 6\\), then \\(10 - 6 = 4\\).' },
    { type: 'num', q: 'Work out \\((10 - 2) \\times 3\\)', a: 24, why: 'Brackets first: \\(8 \\times 3 = 24\\).' },
    { type: 'num', q: 'Work out \\(3 + 4^2 \\div 2\\)', a: 11, why: '\\(4^2 = 16\\), \\(16 \\div 2 = 8\\), \\(3 + 8 = 11\\).' },
    { type: 'num', q: 'Work out \\(36 \\div 6 \\times 2\\)', a: 12, why: 'Left to right: \\(36 \\div 6 = 6\\), \\(6 \\times 2 = 12\\).' },
    { type: 'mcq', q: 'What do you do <b>first</b> in \\(7 + 18 \\div 3^2\\)?', opts: ['\\(3^2\\)', '\\(7 + 18\\)', '\\(18 \\div 3\\)', 'Work left to right'], why: 'There are no brackets, so indices come first: \\(3^2 = 9\\). Then \\(18 \\div 9 = 2\\) and \\(7 + 2 = 9\\).' },
  ],
});
