// Higher: cubic graphs y = ax³ + … and reciprocal graphs y = k/x, shown side by side with a chooser.
const CU_SHAPES = [
  { t: 'y = x^3', f: (x) => x ** 3, d: 'An S-shaped curve through the origin, rising from bottom-left to top-right.' },
  { t: 'y = -x^3', f: (x) => -(x ** 3), d: 'The same S-shape reflected: falling from top-left to bottom-right.' },
  { t: 'y = x^3 - 4x', f: (x) => x ** 3 - 4 * x, d: 'A cubic with two turning points; it crosses the \\(x\\)-axis three times (−2, 0, 2).' },
  { t: 'y = \\frac{4}{x}', f: (x) => 4 / x, d: 'A reciprocal graph: two separate branches. It never touches the axes (asymptotes).' },
  { t: 'y = -\\frac{4}{x}', f: (x) => -4 / x, d: 'Reciprocal with negative \\(k\\): branches in the top-left and bottom-right.' },
];
FD.add({
  id: 'cubic-recip',
  title: 'Cubic and reciprocal graphs',
  tab: 'Cubic & reciprocal',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Cubic graph', 'The graph of \\(y = ax^3 + bx^2 + cx + d\\). It can have up to two turning points.'],
    ['Reciprocal graph', 'The graph of \\(y = \\frac{k}{x}\\). It has two branches and is not defined at \\(x = 0\\).'],
    ['Asymptote', 'A line that a graph gets closer and closer to but never meets.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'cu-c', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="s">${CU_SHAPES.map((s, i) => `<button class="btn ${i ? '' : 'primary'}" data-i="${i}">\\(${s.t}\\)</button>`).join('')}</div>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-4, 4], y: [-8, 8], step: 1, ystep: 2, label: 'Cubic and reciprocal graphs' });
    a.shape = (i, pts) => { const S = CU_SHAPES[i]; g.draw(i >= 3 ? g.curve(S.f, '', -4, -0.02) + g.curve(S.f, '', 0.02, 4) : g.curve(S.f), (pts || []).map(([x, y]) => g.pt(x, y, 'hot')).join('')); a.big(S.t); a.msg(S.d); };
    a.$('[data-k="s"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; a.$('[data-k="s"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); a.shape(+b.dataset.i); });
    a.onTry = () => { a.$('[data-k="s"]').querySelectorAll('.btn').forEach((x, i) => x.classList.toggle('primary', !i)); a.shape(0); };
    a.shape(0);
    return a;
  },
  steps: [
    {
      title: 'Cubic graphs',
      text: '<p>\\(y = x^3\\): plot \\((-2, -8)\\), \\((-1, -1)\\), \\((0, 0)\\), \\((1, 1)\\), \\((2, 8)\\). The curve is S-shaped.</p>',
      async on(a) { a.tryMode(false); a.shape(0, [[-2, -8], [-1, -1], [0, 0], [1, 1], [2, 8]]); },
    },
    {
      title: 'Cubics with turning points',
      text: '<p>\\(y = x^3 - 4x = x(x - 2)(x + 2)\\) crosses the \\(x\\)-axis three times. A positive \\(x^3\\) term means it ends going up on the right.</p>',
      async on(a) { a.tryMode(false); a.shape(2, [[-2, 0], [0, 0], [2, 0]]); },
    },
    {
      title: 'Reciprocal graphs',
      text: '<p>\\(y = \\frac{4}{x}\\): you cannot divide by 0, so there is no point at \\(x = 0\\). The graph has two branches that get closer to the axes but never touch them.</p>',
      tip: 'For \\(y = \\frac{k}{x}\\), every point has \\(xy = k\\).',
      async on(a) { a.tryMode(false); a.shape(3, [[1, 4], [2, 2], [4, 1], [-1, -4], [-2, -2]]); },
    },
    {
      title: 'Try it: recognise the shapes',
      text: '<p>Choose each equation and learn its shape. In the exam you may be asked to match equations to sketches.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'cubic-recip',
  gens: [
    () => { const i = FD.rnd(0, 4), N = ['an S-shape rising to the right', 'an S-shape falling to the right', 'a cubic crossing the x-axis three times', 'two branches in the top-right and bottom-left', 'two branches in the top-left and bottom-right']; return { type: 'mcq', q: `Which description matches the graph of \\(${CU_SHAPES[i].t}\\)?`, opts: [N[i], ...N.filter((x, k) => k !== i)].slice(0, 4), why: CU_SHAPES[i].d }; },
    () => { const k = FD.pick([2, 3, 4, 6, 8, 12]), x = FD.pick([-4, -2, -1, 1, 2, 3, 4].filter((v) => k % v === 0)); return { type: 'num', q: `Complete the table for \\(y = \\dfrac{${k}}{x}\\): find \\(y\\) when \\(x = ${x}\\).`, a: k / x, why: `\\(${k} \\div ${x < 0 ? `(${x})` : x} = ${k / x}\\).` }; },
    () => { const x = FD.rnd(-3, 3), c = FD.rnd(-5, 5); return { type: 'num', q: `\\(y = x^3 ${FD.sg(c)}\\). Find \\(y\\) when \\(x = ${x}\\).`, a: x ** 3 + c, why: `\\((${x})^3 = ${x ** 3}\\), so \\(y = ${x ** 3 + c}\\).` }; },
  ],
});

FD.check({
  section: 'cubic-recip',
  items: [
    { type: 'num', q: '\\(y = x^3 - 2x\\). Find \\(y\\) when \\(x = -2\\).', a: -4, why: '\\(-8 + 4\\).' },
    { type: 'mcq', q: 'Which graph is not defined at \\(x = 0\\)?', opts: ['\\(y = \\frac{5}{x}\\)', '\\(y = x^3\\)', '\\(y = x^2 + 5\\)', '\\(y = 5x\\)'], why: 'You cannot divide by 0.' },
    { type: 'mcq', q: 'The graph of \\(y = x^3\\) passes through…', opts: ['\\((-2, -8)\\)', '\\((-2, 8)\\)', '\\((2, 6)\\)', '\\((3, 9)\\)'], why: '\\((-2)^3 = -8\\).' },
  ],
});
