// Harder regions: several sloping boundaries; find the inequalities, and the integer points inside.
const IN_HARD = [
  { conds: [[1, 1, 5, '<='], [0, 1, 1, '>='], [-2, 1, 0, '<']], t: 'x + y \\le 5, \\; y \\ge 1, \\; y < 2x' },
  { conds: [[1, 2, 6, '<'], [1, 0, -1, '>'], [-1, 1, -3, '>=']], t: 'x + 2y < 6, \\; x > -1, \\; y \\ge x - 3' },
  { conds: [[2, 1, 4, '>='], [0, 1, 4, '<='], [1, 0, 4, '<=']], t: '2x + y \\ge 4, \\; y \\le 4, \\; x \\le 4' },
];
const inIntPts = (conds) => { const r = []; for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) if (conds.every((c) => inOk(c, x, y))) r.push([x, y]); return r; };

FD.add({
  id: 'regions-h',
  title: 'Harder regions',
  tab: 'Harder regions',
  icon: 'graph',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Integer coordinates', 'Points whose \\(x\\) and \\(y\\) are both whole numbers, like \\((2, -1)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'in-h', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">Next region ↻</button><button class="btn primary" data-k="pts">Show integer points</button></div>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A region bounded by three lines' });
    a.region = (conds, pts) => FD.region(g, conds, pts);
    let k = 0;
    const show = (pts) => { const R = IN_HARD[k]; a.region(R.conds, pts ? inIntPts(R.conds) : []); a.big(R.t); a.msg(pts ? `${inIntPts(R.conds).length} points with integer coordinates. Points on a dashed line do not count.` : ''); };
    a.$('[data-k="new"]').addEventListener('click', () => { k = (k + 1) % IN_HARD.length; show(false); });
    a.$('[data-k="pts"]').addEventListener('click', () => show(true));
    a.onTry = () => show(false);
    return a;
  },
  steps: [
    {
      title: 'Rearrange to y = … first',
      text: '<p>\\(x + 2y < 6\\) is easier to draw as \\(y < 3 - \\frac{x}{2}\\): a dashed line with gradient \\(-\\frac12\\) through \\((0, 3)\\). The region is below it.</p>',
      tip: 'Dividing by a positive number keeps the sign; by a negative, it flips.',
      async on(a) { a.tryMode(false); a.region([[1, 2, 6, '<']], [[0, 0]]); a.big('x + 2y < 6'); },
    },
    {
      title: 'Write the inequalities for a region',
      text: '<p>Working backwards: for each side of the region find the equation of the line, then decide which side of it the region is and whether the line is solid or dashed.</p>',
      on: FD.walk([['y \\ge 1', 'above the solid horizontal line'], ['x + y \\le 5', 'below the solid line through (5, 0) and (0, 5)'], ['y < 2x', 'below the dashed line through the origin']], (a) => { a.region(IN_HARD[0].conds); a.big(''); }, 1500),
    },
    {
      title: 'Points with integer coordinates',
      text: '<p>Count the points inside the region whose coordinates are whole numbers. Points on a solid line count; points on a dashed line do not.</p>',
      async on(a) { a.tryMode(false); a.region(IN_HARD[0].conds, inIntPts(IN_HARD[0].conds)); a.big(IN_HARD[0].t); a.msg(`${inIntPts(IN_HARD[0].conds).length} points.`); },
    },
    {
      title: 'Try it: count the points',
      text: '<p>For each region, count the points with integer coordinates in your head, then press <b>Show integer points</b> to check.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'regions-h',
  gens: [
    () => { const R = FD.pick(IN_HARD), [x, y] = [FD.rnd(-2, 5), FD.rnd(-2, 5)], ok = R.conds.every((c) => inOk(c, x, y)); return { type: 'tf', q: `Does \\((${x}, ${y})\\) lie in the region \\(${R.t}\\)?`, a: ok, why: `Check each one: ${R.conds.map((c) => `\\(${inCondTex(c)}\\) ${inOk(c, x, y) ? '✓' : '✗'}`).join(', ')}.` }; },
    () => { const s = FD.rnd(3, 6); const pts = inIntPts([[1, 0, 0, '>'], [0, 1, 0, '>'], [1, 1, s, '<']]); return { type: 'num', q: `How many points with integer coordinates satisfy \\(x > 0\\), \\(y > 0\\) and \\(x + y < ${s}\\)?`, a: pts.length, why: `List them by \\(x\\): ${Array.from({ length: s - 2 }, (_, i) => `\\(x = ${i + 1}\\): ${s - i - 2}`).join(', ')}. Total ${pts.length}.` }; },
  ],
});

FD.check({
  section: 'regions-h',
  items: [
    { type: 'mcq', q: 'Which inequality describes the region below the dashed line through \\((0, 4)\\) and \\((2, 0)\\)?', opts: ['\\(y < 4 - 2x\\)', '\\(y > 4 - 2x\\)', '\\(y \\le 4 - 2x\\)', '\\(y < 2x + 4\\)'], why: 'Gradient −2, intercept 4; below and dashed.' },
    { type: 'num', q: 'How many points with integer coordinates satisfy \\(y \\ge 0\\), \\(x \\ge 0\\) and \\(x + y \\le 2\\)?', a: 6, why: '(0,0), (1,0), (2,0), (0,1), (1,1), (0,2).' },
    { type: 'tf', q: '\\(2x + y < 5\\) can be drawn as the region below the line \\(y = 5 - 2x\\).', a: true, why: 'Subtract \\(2x\\): \\(y < 5 - 2x\\).' },
  ],
});
