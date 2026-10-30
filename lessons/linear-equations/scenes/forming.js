// Forming equations: a shape with expressions for its sides; set up an equation from a fact, solve, answer.
FD.add({
  id: 'forming',
  title: 'Forming and solving equations',
  tab: 'Forming',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Form an equation', 'Write the facts in the question as an equation, using a letter for the unknown.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'le-fm', side: true,
      vis: '<svg class="fm-tri" viewBox="0 0 320 220" role="img" aria-label="A triangle with angles x, 2x and x + 20" data-k="tri"></svg>',
      tryHtml: `<p class="ab-ask">Angles: \\(x\\), \\(2x\\) and \\(x + k\\). They add up to 180°.</p>
        <label class="ctrl">\\(k\\) <input type="range" data-k="k" min="0" max="60" step="4" value="20"><output data-k="ok">20</output></label>`,
    });
    const tri = a.$('[data-k="tri"]');
    a.tri = (labels, hl) => {
      tri.innerHTML = `<polygon class="fm-poly" points="30,190 290,190 120,30"/>
        <text class="g-lbl ${hl ? 'fm-hl' : ''}" x="64" y="178">${labels[0]}</text><text class="g-lbl ${hl ? 'fm-hl' : ''}" x="232" y="178">${labels[1]}</text><text class="g-lbl ${hl ? 'fm-hl' : ''}" x="122" y="66" text-anchor="middle">${labels[2]}</text>`;
    };
    const sync = () => {
      const k = +a.$('[data-k="k"]').value; a.$('[data-k="ok"]').textContent = k;
      const x = (180 - k) / 4;
      a.tri(['x', '2x', `x + ${k}`]);
      a.big(`x + 2x + x + ${k} = 180`);
      a.work([[`4x + ${k} = 180`, 'collect'], [`4x = ${180 - k}`, `− ${k}`], [`x = ${x}`, '÷ 4']]); a.upto(2);
      a.msg(`The angles are ${x}°, ${2 * x}° and ${x + k}°. Total: ${x + 2 * x + x + k}° ✓`);
    };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    a.tri(['x', '2x', 'x + 20']);
    return a;
  },
  steps: [
    {
      title: 'Use a fact to write an equation',
      text: '<p>The angles of this triangle are \\(x\\), \\(2x\\) and \\(x + 20\\). Angles in a triangle add up to 180°.</p><p>So \\(x + 2x + x + 20 = 180\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.tri(['x', '2x', 'x + 20']); a.big(''); if (!(await ctx.sleep(1200))) return; a.tri(['x', '2x', 'x + 20'], true); a.big('x + 2x + x + 20 = 180'); },
    },
    {
      title: 'Solve it, then answer the question',
      text: '<p>Solve the equation. Then use \\(x\\) to answer what was asked: here, the size of each angle.</p>',
      tip: 'Check: do the three angles add to 180°?',
      on: FD.walk([['4x + 20 = 180', 'collect like terms'], ['4x = 160', ''], ['x = 40', ''], ['\\text{Angles: } 40°, 80°, 60°', 'answer the question']], (a) => { a.tri(['40°', '80°', '60°']); a.big(''); }),
    },
    {
      title: 'Problems in words',
      text: '<p>Ali is 3 years older than Ben. Cara is twice as old as Ben. Their ages add up to 43. How old is Ben?</p><p>Let Ben be \\(b\\). Then Ali is \\(b + 3\\) and Cara is \\(2b\\).</p>',
      on: FD.walk([['b + (b + 3) + 2b = 43', 'add the ages'], ['4b + 3 = 43', ''], ['4b = 40 \\Rightarrow b = 10', ''], ['\\text{Ben is 10 years old.}', 'answer in words']], (a) => { a.tri(['', '', '']); a.big(''); }),
    },
    {
      title: 'Try it: change the triangle',
      text: '<p>Change \\(k\\) in the third angle \\(x + k\\). The equation and the angles update. They always add up to 180°.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'forming',
  gens: [
    () => { let k, x; do { k = FD.rnd(1, 15) * 2; x = (180 - k) / 4; } while (x % 1); return { type: 'num', q: `The angles of a triangle are \\(x\\), \\(2x\\) and \\(x + ${k}\\) degrees. Find \\(x\\).`, a: x, why: `\\(x + 2x + x + ${k} = 180\\), so \\(4x = ${180 - k}\\) and \\(x = ${x}\\).` }; },
    () => { const w = FD.rnd(3, 12), d = FD.rnd(2, 8), P = 2 * (w + w + d); return { type: 'num', q: `A rectangle is \\(${d}\\) cm longer than it is wide. Its perimeter is ${P} cm. Find its width.`, a: w, why: `Width \\(w\\), length \\(w + ${d}\\). \\(2w + 2(w + ${d}) = ${P}\\), so \\(4w + ${2 * d} = ${P}\\), \\(4w = ${P - 2 * d}\\), \\(w = ${w}\\).` }; },
    () => { const b = FD.rnd(4, 15), d = FD.rnd(1, 6), m = FD.rnd(2, 3), tot = b + (b + d) + m * b; return { type: 'num', q: `Amy has \\(${d}\\) more sweets than Ben. Cal has ${m} times as many as Ben. Together they have ${tot}. How many does Ben have?`, a: b, why: `Ben \\(n\\), Amy \\(n + ${d}\\), Cal \\(${m}n\\). \\(${m + 2}n + ${d} = ${tot}\\), so \\(n = ${b}\\).` }; },
  ],
});

FD.check({
  section: 'forming',
  items: [
    { type: 'num', q: 'I think of a number, multiply it by 4 and subtract 7. The answer is 29. What was my number?', a: 9, why: '\\(4n - 7 = 29\\), \\(4n = 36\\).' },
    { type: 'num', q: 'The angles on a straight line are \\(3x\\) and \\(x + 40\\). Find \\(x\\).', a: 35, why: '\\(4x + 40 = 180\\), \\(4x = 140\\).' },
    { type: 'num', q: 'A square has side \\((2x + 1)\\) cm and perimeter 36 cm. Find \\(x\\).', a: 4, why: '\\(4(2x + 1) = 36\\), \\(2x + 1 = 9\\).' },
    { type: 'mcq', q: 'Pens cost \\(p\\) pence. 5 pens and a 60p ruler cost £2.10. Which equation is correct?', opts: ['\\(5p + 60 = 210\\)', '\\(5p + 60 = 2.10\\)', '\\(5(p + 60) = 210\\)', '\\(p + 300 = 210\\)'], why: 'Use the same units: £2.10 = 210p.' },
  ],
});
