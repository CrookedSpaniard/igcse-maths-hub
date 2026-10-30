// Higher: each equation is a straight line; the solution is the point where they cross.
FD.add({
  id: 'sim-graphs',
  title: 'Simultaneous equations and graphs',
  tab: 'Graphs',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Point of intersection', 'Where two graphs cross. Its coordinates satisfy both equations.'],
    ['Parallel lines', 'Lines with the same gradient never cross, so the equations have no solution.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'si-g', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Line 1: \\(m_1\\) <input type="range" data-k="m1" min="-3" max="3" step="0.5" value="1"><output data-k="om1">1</output></label>
        <label class="ctrl">\\(c_1\\) <input type="range" data-k="c1" min="-5" max="5" value="1"><output data-k="oc1">1</output></label>
        <label class="ctrl">Line 2: \\(m_2\\) <input type="range" data-k="m2" min="-3" max="3" step="0.5" value="-1"><output data-k="om2">−1</output></label>
        <label class="ctrl">\\(c_2\\) <input type="range" data-k="c2" min="-5" max="5" value="5"><output data-k="oc2">5</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'Two straight lines' });
    a.lines = (m1, c1, m2, c2) => {
      const f1 = (x) => m1 * x + c1, f2 = (x) => m2 * x + c2;
      if (m1 === m2) { g.draw(g.curve(f1) + g.curve(f2, 'c2')); return null; }
      const x = (c2 - c1) / (m1 - m2), y = f1(x);
      g.draw(g.curve(f1) + g.curve(f2, 'c2'), Math.abs(x) <= 6 && Math.abs(y) <= 6 ? g.pt(x, y, 'hot') + g.lbl(x, y, `(${FD.round(x, 2)}, ${FD.round(y, 2)})`) : '');
      return [x, y];
    };
    const sync = () => {
      const v = ['m1', 'c1', 'm2', 'c2'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['m1', 'c1', 'm2', 'c2'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String(v[i]).replace('-', '−'); });
      const p = a.lines(...v);
      a.big(`y = ${FD.poly([v[0], v[1]])}, \\quad y = ${FD.poly([v[2], v[3]])}`);
      a.msg(p ? `They cross at \\((${FD.round(p[0], 2)}, ${FD.round(p[1], 2)})\\): this is the solution of both equations.` : 'Same gradient: the lines are parallel and never meet, so there is no solution.', p ? 'good' : 'bad');
    };
    ['m1', 'c1', 'm2', 'c2'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.lines(1, 1, -1, 5);
    return a;
  },
  steps: [
    {
      title: 'Each equation is a line',
      text: '<p>\\(y = x + 1\\) is a straight line. Every point on it fits the equation. \\(y = -x + 5\\) is another line.</p><p>The point on <b>both</b> lines is where they cross: \\((2, 3)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); a.lines(1, 1, 1, 1); if (!(await ctx.sleep(1000))) return; a.lines(1, 1, -1, 5); a.msg('Crossing point \\((2, 3)\\): \\(x = 2\\), \\(y = 3\\).'); },
    },
    {
      title: 'Algebra gives the same answer',
      text: '<p>Solve \\(y = x + 1\\) and \\(x + y = 5\\) by substitution. You get exactly the crossing point.</p>',
      tip: 'Reading a graph gives an estimate; algebra gives the exact answer.',
      on: FD.walk([['x + (x + 1) = 5', 'substitute'], ['2x = 4 \\Rightarrow x = 2', ''], ['y = 3', 'so the lines meet at (2, 3)']], (a) => { a.lines(1, 1, -1, 5); a.big(''); }),
    },
    {
      title: 'Parallel lines: no solution',
      text: '<p>\\(y = 2x + 1\\) and \\(y = 2x - 3\\) have the same gradient. They never meet, so there is <b>no</b> pair of values that fits both.</p>',
      async on(a) { a.tryMode(false); a.lines(2, 1, 2, -3); a.big(''); a.msg('Parallel: no point of intersection.', 'bad'); },
    },
    {
      title: 'Try it: move the lines',
      text: '<p>Change the gradients and intercepts. Watch the crossing point. What happens when \\(m_1 = m_2\\)?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'sim-graphs',
  gens: [
    () => { let m1, m2, x, c1, c2; do { m1 = FD.rndNZ(-3, 3); m2 = FD.rndNZ(-3, 3); x = FD.rnd(-4, 4); c1 = FD.rnd(-5, 5); c2 = m1 * x + c1 - m2 * x; } while (m1 === m2 || Math.abs(c2) > 9); const y = m1 * x + c1; return { type: 'num', q: `The lines \\(y = ${FD.poly([m1, c1])}\\) and \\(y = ${FD.poly([m2, c2])}\\) cross at a point. Find its coordinates.`, a: [x, y], fields: ['\\(x\\) =', '\\(y\\) ='], why: `Set them equal: \\(${FD.poly([m1, c1])} = ${FD.poly([m2, c2])}\\), so \\(${m1 - m2}x = ${c2 - c1}\\), \\(x = ${x}\\), \\(y = ${y}\\).` }; },
    () => { const m = FD.rndNZ(-3, 4), c = FD.rnd(-5, 5); let d; do { d = FD.rnd(-5, 5); } while (d === c); return { type: 'mcq', q: `How many solutions do \\(y = ${FD.poly([m, c])}\\) and \\(y = ${FD.poly([m, d])}\\) have?`, opts: ['None: the lines are parallel', 'One', 'Two', 'Infinitely many'], why: `Both have gradient ${m}, so they are parallel and never meet.` }; },
  ],
});

FD.check({
  section: 'sim-graphs',
  items: [
    { type: 'num', q: 'Where do \\(y = 2x - 1\\) and \\(y = x + 2\\) cross?', a: [3, 5], fields: ['\\(x\\) =', '\\(y\\) ='], why: '\\(2x - 1 = x + 2\\), \\(x = 3\\), \\(y = 5\\).' },
    { type: 'mcq', q: 'The graphs of two equations cross at \\((4, -1)\\). The solution of the simultaneous equations is…', opts: ['\\(x = 4, y = -1\\)', '\\(x = -1, y = 4\\)', '\\(x = 4\\) only', 'there is no solution'], why: 'The coordinates of the crossing point.' },
    { type: 'tf', q: '\\(y = 3x + 2\\) and \\(y = 3x - 5\\) have exactly one solution.', a: false, why: 'Same gradient: parallel lines, no solution.' },
  ],
});
