// A line and a curve: y = x² + c meets y = mx + k where x² − mx + (c − k) = 0.
FD.add({
  id: 'lin-quad',
  title: 'A line and a curve',
  tab: 'Line and curve',
  icon: 'graph',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Linear and quadratic', 'One equation is a straight line, the other a curve. They can meet at 0, 1 or 2 points.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-l', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<p class="ab-ask">Curve \\(y = x^2 - 3\\) and line \\(y = mx + k\\)</p>
        <label class="ctrl">\\(m\\) <input type="range" data-k="m" min="-3" max="3" value="1"><output data-k="om">1</output></label>
        <label class="ctrl">\\(k\\) <input type="range" data-k="k" min="-6" max="6" value="3"><output data-k="ok">3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 380, x: [-5, 5], y: [-6, 12], step: 1, ystep: 2, label: 'A parabola and a straight line' });
    a.meet = (m, k, c = -3) => {
      const D = m * m - 4 * (c - k), xs = D >= 0 ? [(m + Math.sqrt(D)) / 2, (m - Math.sqrt(D)) / 2] : [];
      g.draw(g.curve((x) => x * x + c) + g.curve((x) => m * x + k, 'c2'), [...new Set(xs.map((x) => FD.round(x, 6)))].map((x) => g.pt(x, m * x + k, 'hot') + g.lbl(x, m * x + k, `(${FD.round(x, 2)}, ${FD.round(m * x + k, 2)})`)).join(''));
      return xs;
    };
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, k = +a.$('[data-k="k"]').value;
      a.$('[data-k="om"]').textContent = String(m).replace('-', '−'); a.$('[data-k="ok"]').textContent = String(k).replace('-', '−');
      const xs = a.meet(m, k);
      a.big(`x^2 - 3 = ${FD.poly([m, k])} \\Rightarrow ${FD.poly([1, -m, -3 - k])} = 0`);
      a.msg(xs.length ? (Math.abs(xs[0] - xs[1]) < 1e-9 ? 'One point: the line is a tangent.' : 'Two points of intersection.') : 'The line misses the curve: no solutions.', xs.length ? 'good' : 'bad');
    };
    ['m', 'k'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.meet(1, 3);
    return a;
  },
  steps: [
    {
      title: 'Substitute the line into the curve',
      text: '<p>Solve \\(y = x^2 - 3\\) and \\(y = x + 3\\) together. Both equal \\(y\\), so set them equal.</p>',
      on: FD.walk([['x^2 - 3 = x + 3', ''], ['x^2 - x - 6 = 0', 'rearrange'], ['(x - 3)(x + 2) = 0', ''], ['x = 3, y = 6 \\;\\text{ or }\\; x = -2, y = 1', 'find y from the line']], (a) => { a.meet(1, 3); a.big(''); }, 1400),
    },
    {
      title: 'When the linear equation is not “y = …”',
      text: '<p>\\(x^2 + y^2 = 25\\) and \\(y = x + 1\\): substitute the line into the other equation and expand.</p>',
      tip: 'Pair the answers correctly: each \\(x\\) has its own \\(y\\).',
      on: FD.walk([['x^2 + (x + 1)^2 = 25', ''], ['2x^2 + 2x - 24 = 0', ''], ['x^2 + x - 12 = 0 \\Rightarrow (x + 4)(x - 3) = 0', ''], ['(3, 4) \\;\\text{ and }\\; (-4, -3)', '']], (a) => { a.meet(1, 3); a.big(''); }, 1400),
    },
    {
      title: 'Try it: move the line',
      text: '<p>Change the gradient and the intercept. The line can cross the curve twice, touch it once, or miss it.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'lin-quad',
  gens: [
    () => { let p, q, c; do { p = FD.rnd(-4, 4); q = FD.rnd(-4, 4); c = FD.rnd(-4, 4); } while (p >= q); const m = p + q, k = c - p * q; return { type: 'num', q: `Solve \\(y = ${FD.poly([1, 0, c])}\\) and \\(y = ${FD.poly([m, k])}\\). Give the two \\(x\\) values.`, a: [p, q], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: `\\(${FD.poly([1, 0, c])} = ${FD.poly([m, k])}\\), so \\(${FD.poly([1, -m, c - k])} = 0\\): \\((x ${FD.sg(-p).trim()})(x ${FD.sg(-q).trim()}) = 0\\). \\(x = ${p}\\) or \\(x = ${q}\\); the \\(y\\) values are ${m * p + k} and ${m * q + k}.` }; },
  ],
});

FD.check({
  section: 'lin-quad',
  items: [
    { type: 'num', q: 'Solve \\(y = x^2\\) and \\(y = x + 2\\). Give the two \\(x\\) values.', a: [2, -1], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: '\\(x^2 - x - 2 = 0\\), \\((x - 2)(x + 1) = 0\\).' },
    { type: 'mcq', q: 'The line \\(y = 2x\\) and the curve \\(y = x^2 + 1\\) meet at…', opts: ['one point, \\((1, 2)\\)', 'two points', 'no points', '\\((2, 4)\\)'], why: '\\(x^2 - 2x + 1 = (x - 1)^2 = 0\\): a tangent.' },
    { type: 'mcq', q: 'To solve \\(x^2 + y^2 = 10\\) and \\(y = 3x\\), the first step is…', opts: ['\\(x^2 + (3x)^2 = 10\\)', '\\(x^2 + 3x^2 = 10\\)', '\\(x + 3x = 10\\)', '\\(y^2 = 10 - 3x\\)'], why: 'Replace \\(y\\) by \\(3x\\), keeping the bracket: \\(9x^2\\).' },
  ],
});
