// Choosing the line to draw: with the graph of y = x² − 3x drawn, solve x² − 4x + 1 = 0 by
// rearranging to x² − 3x = x − 1 and drawing y = x − 1.
const GS_TASKS = [
  { eq: 'x^2 - 4x + 1 = 0', m: 1, c: -1, steps: ['x^2 - 3x - x + 1 = 0', 'x^2 - 3x = x - 1'] },
  { eq: 'x^2 - 3x - 2 = 0', m: 0, c: 2, steps: ['x^2 - 3x = 2'] },
  { eq: 'x^2 - 5x + 2 = 0', m: 2, c: -2, steps: ['x^2 - 3x - 2x + 2 = 0', 'x^2 - 3x = 2x - 2'] },
  { eq: 'x^2 - x - 3 = 0', m: -2, c: 3, steps: ['x^2 - 3x + 2x - 3 = 0', 'x^2 - 3x = -2x + 3'] },
];
FD.add({
  id: 'which-line',
  title: 'Choosing the line to draw',
  tab: 'Which line?',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Rearranging to match', 'Make one side of the new equation exactly the same as the curve already drawn; the other side is the line to draw.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'gs-w', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">Next equation ↻</button><button class="btn primary" data-k="show">Show the line</button></div>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-2, 5], y: [-4, 8], step: 1, ystep: 2, label: 'The graph of y = x² − 3x and a line' });
    const f = (x) => x * x - 3 * x;
    a.task = (i, line) => {
      const T = GS_TASKS[i], xs = gsRoots(1, -(3 + T.m), -T.c);
      g.draw(g.curve(f) + (line ? g.curve((x) => T.m * x + T.c, 'c2') : ''), line ? xs.map((x) => g.pt(x, T.m * x + T.c, 'hot')).join('') : '');
      a.big(T.eq);
      a.work(line ? [...T.steps.map((s) => [s, '']), [`\\text{draw } y = ${FD.poly([T.m, T.c])}`, ''], [`x \\approx ${xs.map((x) => FD.round(x, 1)).join(' \\text{ or } ')}`, 'read the crossings']] : null);
      if (line) a.upto(99);
    };
    let k = 0;
    a.$('[data-k="new"]').addEventListener('click', () => { k = (k + 1) % GS_TASKS.length; a.task(k, false); });
    a.$('[data-k="show"]').addEventListener('click', () => a.task(k, true));
    a.onTry = () => a.task(k, false);
    a.task(0, false);
    return a;
  },
  steps: [
    {
      title: 'Use the graph you already have',
      text: '<p>The graph of \\(y = x^2 - 3x\\) is drawn. To solve \\(x^2 - 4x + 1 = 0\\), rearrange it so the left side is \\(x^2 - 3x\\).</p>',
      on: FD.walk([['x^2 - 4x + 1 = 0', ''], ['x^2 - 3x - x + 1 = 0', 'split −4x into −3x − x'], ['x^2 - 3x = x - 1', 'move the rest across']], (a) => a.task(0, false), 1500),
    },
    {
      title: 'Draw the line and read off',
      text: '<p>The right side gives the line to draw: \\(y = x - 1\\). The solutions are the \\(x\\)-values where the line crosses the curve: about 0.3 and 3.7.</p>',
      tip: 'Check your line: the two sides of the rearranged equation must still be equal to the original.',
      async on(a) { a.tryMode(false); a.task(0, true); },
    },
    {
      title: 'Try it: which line?',
      text: '<p>For each equation, work out the line to draw on \\(y = x^2 - 3x\\), then press <b>Show the line</b>.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'which-line',
  gens: [
    () => { const m = FD.rndNZ(-3, 3), c = FD.rnd(-4, 4); return { type: 'mcq', q: `The graph of \\(y = x^2 - 3x\\) is drawn. Which line should you draw to solve \\(${FD.poly([1, -(3 + m), -c])} = 0\\)?`, opts: [`\\(y = ${FD.poly([m, c])}\\)`, `\\(y = ${FD.poly([-m, -c])}\\)`, `\\(y = ${FD.poly([m, -c])}\\)`, `\\(y = ${FD.poly([3 + m, c])}\\)`, `\\(y = ${FD.poly([m, c + 1])}\\)`, `\\(y = ${FD.poly([m + 1, c])}\\)`].filter((o, i, s) => s.indexOf(o) === i).slice(0, 4), why: `Rearrange: \\(x^2 - 3x = ${FD.poly([m, c])}\\), so draw \\(y = ${FD.poly([m, c])}\\).` }; },
  ],
});

FD.check({
  section: 'which-line',
  items: [
    { type: 'mcq', q: 'The graph of \\(y = x^2 + x\\) is drawn. Which line solves \\(x^2 - x - 4 = 0\\)?', opts: ['\\(y = 2x + 4\\)', '\\(y = x + 4\\)', '\\(y = -2x - 4\\)', '\\(y = 4\\)'], why: '\\(x^2 + x = 2x + 4\\).' },
    { type: 'mcq', q: 'The graph of \\(y = x^2 - 2\\) is drawn. Which line solves \\(x^2 - 5 = 0\\)?', opts: ['\\(y = 3\\)', '\\(y = 5\\)', '\\(y = -3\\)', '\\(y = x - 5\\)'], why: '\\(x^2 - 2 = 3\\).' },
    { type: 'tf', q: 'To solve \\(\\sin x = 0.4\\) with the graph of \\(y = \\sin x\\), you draw the line \\(y = 0.4\\).', a: true, why: 'The crossings give the solutions.' },
  ],
});
