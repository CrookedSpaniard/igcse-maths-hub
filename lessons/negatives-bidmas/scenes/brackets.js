// Where to put the brackets: each choice of brackets in 2 + 3 × 4 − 1 and its value.
FD.BRK = [
  ['2 + 3 \\times 4 - 1', 13, 'no brackets: multiply first'],
  ['(2 + 3) \\times 4 - 1', 19, '\\(5 \\times 4 - 1\\)'],
  ['2 + 3 \\times (4 - 1)', 11, '\\(2 + 3 \\times 3\\)'],
  ['(2 + 3) \\times (4 - 1)', 15, '\\(5 \\times 3\\)'],
  ['2 + (3 \\times 4 - 1)', 13, 'the same as no brackets'],
];

FD.add({
  id: 'brackets',
  title: 'Brackets, powers and negatives',
  tab: 'Brackets',
  icon: 'calc',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['\\((-3)^2\\)', 'The whole of \\(-3\\) is squared: \\((-3) \\times (-3) = 9\\).'],
    ['\\(-3^2\\)', 'Only the 3 is squared, then made negative: \\(-(3 \\times 3) = -9\\).'],
    ['Fraction line', 'Works like brackets: work out the whole top and the whole bottom first, then divide.'],
  ],
  mount(el) {
    const a = FD.board(el, 'br-s', '<div id="lad"></div>', `
      <p class="small"><b>Target:</b> place the brackets in \\(2 + 3 \\times 4 - 1\\) to make <b id="tgt">15</b>.</p>
      <div class="bd-btns" id="opts">${FD.BRK.map(([t], i) => `<button class="btn small-btn" data-i="${i}">\\(${t}\\)</button>`).join('')}</div>
      <div class="bd-btns"><button class="btn ghost" id="bNew">New target ↻</button></div>`, () => newT());
    a.lad = FD.ladder(a.$('#lad'));
    let target = 15;
    const newT = () => { const vals = [...new Set(FD.BRK.map((b) => b[1]))].filter((v) => v !== target); target = FD.pick(vals); a.$('#tgt').textContent = target; a.big('2 + 3 \\times 4 - 1'); a.msg('Choose where the brackets go.', 'good'); };
    a.$('#bNew').addEventListener('click', newT);
    a.$('#opts').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      const [t, v, why] = FD.BRK[+b.dataset.i];
      a.big(`${t} = ${v}`);
      a.msg(v === target ? `✓ Yes! ${why} = ${v}.` : `That makes ${v} (${why}). Try again.`, v === target ? 'good' : 'bad');
    }));
    a.lad(-1);
    return a;
  },
  steps: [
    {
      title: '(−3)² or −3²?',
      text: '<p>In \\((-3)^2\\) the bracket says: square <b>all</b> of \\(-3\\). The answer is 9.</p><p>In \\(-3^2\\) the index comes before the minus sign: square 3, <b>then</b> make it negative. The answer is \\(-9\\).</p>',
      tip: 'On a calculator, type the brackets: ( − 3 ) x². Without them you get −9.',
      async on(a, ctx) {
        a.reset(); a.lad(1);
        await a.lines([['(-3)^2 = (-3) \\times (-3) = 9', 'the bracket is squared'], ['-3^2 = -(3 \\times 3) = -9', 'only the 3 is squared']], ctx, 1500);
      },
    },
    {
      title: 'Fraction lines are brackets',
      text: '<p>\\(\\dfrac{8 + 4}{5 - 2}\\) means \\((8 + 4) \\div (5 - 2)\\).</p><p>Work out the top and the bottom <b>first</b>, then divide.</p>',
      tip: 'On a calculator, use the fraction key or type brackets round the top and the bottom.',
      async on(a, ctx) {
        a.reset(); a.lad(0);
        await a.lines([['\\frac{8 + 4}{5 - 2} = \\frac{12}{3}', 'top and bottom first'], ['= 4', 'then divide'], ['\\text{not } 8 + 4 \\div 5 - 2', '✗ this gives 6.8']], ctx, 1400);
      },
    },
    {
      title: 'Brackets inside brackets',
      text: '<p>Start with the <b>innermost</b> brackets and work outwards.</p><p>\\(2[3 + (5 - 1)^2]\\). A number touching a bracket means multiply.</p>',
      async on(a, ctx) {
        a.reset(); a.lad(0);
        await a.lines([['2[3 + (\\underbrace{5 - 1}_{4})^2]', 'inner bracket'], ['2[3 + \\underbrace{4^2}_{16}]', 'index'], ['2 \\times 19 = 38', 'outer bracket, then multiply']], ctx, 1400);
      },
    },
    {
      title: 'Negatives in a calculation',
      text: '<p>Use BIDMAS and the sign rules together.</p><p>\\(-4 \\times 3 - (-2)^3\\)</p>',
      async on(a, ctx) {
        a.reset(); a.lad(1);
        await a.lines([['-4 \\times 3 - \\underbrace{(-2)^3}_{-8}', 'index: three negatives'], ['\\underbrace{-4 \\times 3}_{-12} - (-8)', 'multiply'], ['-12 + 8 = -4', 'subtracting a negative']], ctx, 1400);
      },
    },
    {
      title: 'Try it: place the brackets',
      text: '<p>Brackets change the answer. Choose where to put the brackets in \\(2 + 3 \\times 4 - 1\\) to hit the target number.</p>',
      tip: 'Press New target for another number to make.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'brackets',
  gens: [
    () => { const k = FD.rnd(2, 9), br = FD.rnd(0, 1); return { type: 'num', q: br ? `Work out \\((-${k})^2\\)` : `Work out \\(-${k}^2\\)`, a: br ? k * k : -k * k, why: br ? `The bracket is squared: \\((-${k}) \\times (-${k}) = ${k * k}\\).` : `The index comes before the minus: \\(${k}^2 = ${k * k}\\), so \\(-${k}^2 = -${k * k}\\).` }; },
    () => { let t1, t2, b1, b2; do { b1 = FD.rnd(3, 15); b2 = FD.rnd(1, b1 - 1); const q = FD.rnd(2, 9), top = q * (b1 - b2); t1 = FD.rnd(1, top - 1); t2 = top - t1; } while (t1 < 1 || t2 < 1); return { type: 'num', q: `Work out \\(\\dfrac{${t1} + ${t2}}{${b1} - ${b2}}\\)`, a: (t1 + t2) / (b1 - b2), why: `Top: \\(${t1} + ${t2} = ${t1 + t2}\\). Bottom: \\(${b1} - ${b2} = ${b1 - b2}\\). Then \\(${t1 + t2} \\div ${b1 - b2} = ${(t1 + t2) / (b1 - b2)}\\).` }; },
    () => { let x, y, z, w, v; do { [x, y, z, w] = [FD.rnd(2, 9), FD.rnd(2, 9), FD.rnd(2, 9), FD.rnd(1, 9)]; v = [x + y * z - w, (x + y) * z - w, x + y * (z - w), (x + y) * (z - w)]; } while (new Set(v).size < 4 || z <= w); const k = FD.rnd(1, 3), shapes = [`${x} + ${y} \\times ${z} - ${w}`, `(${x} + ${y}) \\times ${z} - ${w}`, `${x} + ${y} \\times (${z} - ${w})`, `(${x} + ${y}) \\times (${z} - ${w})`]; return { type: 'mcq', q: `Where do the brackets go to make this true? \\(\\quad ${x} + ${y} \\times ${z} - ${w} = ${v[k]}\\)`, opts: [k, ...[0, 1, 2, 3].filter((i) => i !== k)].map((i) => `\\(${shapes[i]}\\)`), why: `\\(${shapes[k]} = ${v[k]}\\). The others give ${[0, 1, 2, 3].filter((i) => i !== k).map((i) => v[i]).join(', ')}.` }; },
    () => { const x = FD.rnd(2, 6), y = FD.rnd(2, 5), z = FD.rnd(1, 4); const r = -x * y - (-z) ** 2; return { type: 'num', q: `Work out \\(-${x} \\times ${y} - (-${z})^2\\)`, a: r, why: `Index: \\((-${z})^2 = ${z * z}\\). Multiply: \\(-${x} \\times ${y} = ${-x * y}\\). Then \\(${-x * y} - ${z * z} = ${r}\\).` }; },
  ],
});

FD.check({
  section: 'brackets',
  items: [
    { type: 'num', q: 'Work out \\(-5^2\\)', a: -25, why: 'Index first: \\(5^2 = 25\\), so \\(-5^2 = -25\\).' },
    { type: 'num', q: 'Work out \\((-5)^2\\)', a: 25, why: '\\((-5) \\times (-5) = 25\\).' },
    { type: 'num', q: 'Work out \\(\\dfrac{20 + 16}{7 - 3}\\)', a: 9, why: '\\(36 \\div 4 = 9\\).' },
    { type: 'num', q: 'Work out \\(3[10 - (1 + 2)^2]\\)', a: 3, why: '\\((1 + 2)^2 = 9\\), \\(10 - 9 = 1\\), \\(3 \\times 1 = 3\\).' },
    { type: 'mcq', q: 'Which makes \\(6 + 4 \\times 5 - 2 = 30\\) true?', opts: ['\\((6 + 4) \\times (5 - 2)\\)', '\\((6 + 4) \\times 5 - 2\\)', '\\(6 + 4 \\times (5 - 2)\\)', '\\(6 + (4 \\times 5) - 2\\)'], why: '\\(10 \\times 3 = 30\\). The others give 48, 18 and 24.' },
  ],
});
