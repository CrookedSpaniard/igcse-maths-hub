// Midpoint: the average of the x-coordinates and of the y-coordinates.
FD.add({
  id: 'midpoint',
  title: 'The midpoint of a line segment',
  tab: 'Midpoint',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Line segment', 'Part of a line with two end points.'],
    ['Midpoint', 'The point exactly halfway between the end points: \\(\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-m', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(A\\): x <input type="range" data-k="x1" min="-6" max="6" value="-4"><output data-k="ox1">−4</output></label>
        <label class="ctrl">y <input type="range" data-k="y1" min="-6" max="6" value="-1"><output data-k="oy1">−1</output></label>
        <label class="ctrl">\\(B\\): x <input type="range" data-k="x2" min="-6" max="6" value="4"><output data-k="ox2">4</output></label>
        <label class="ctrl">y <input type="range" data-k="y2" min="-6" max="6" value="5"><output data-k="oy2">5</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A line segment and its midpoint' });
    a.seg = (x1, y1, x2, y2, mid = true) => {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      g.draw(g.line(x1, y1, x2, y2, 'curve') + (mid ? g.line(x1, y1, x2, y1, 'g-line') + g.line(x2, y1, x2, y2, 'g-line') : ''), g.pt(x1, y1) + g.pt(x2, y2) + g.lbl(x1, y1, 'A') + g.lbl(x2, y2, 'B') + (mid ? g.pt(mx, my, 'hot') + g.lbl(mx, my, `M${slPt(FD.num(mx), FD.num(my))}`) : ''));
    };
    const sync = () => {
      const v = ['x1', 'y1', 'x2', 'y2'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['x1', 'y1', 'x2', 'y2'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String(v[i]).replace('-', '−'); });
      a.seg(...v);
      a.big(`M = \\left(\\frac{${v[0]} + ${v[2] < 0 ? `(${v[2]})` : v[2]}}{2}, \\frac{${v[1]} + ${v[3] < 0 ? `(${v[3]})` : v[3]}}{2}\\right) = (${FD.num((v[0] + v[2]) / 2)}, ${FD.num((v[1] + v[3]) / 2)})`);
    };
    ['x1', 'y1', 'x2', 'y2'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.seg(-4, -1, 4, 5, false);
    return a;
  },
  steps: [
    {
      title: 'Halfway across, halfway up',
      text: '<p>\\(A(-4, -1)\\) and \\(B(4, 5)\\). Halfway between \\(-4\\) and 4 is 0. Halfway between \\(-1\\) and 5 is 2.</p><p>The midpoint is \\(M(0, 2)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); a.seg(-4, -1, 4, 5, false); if (!(await ctx.sleep(1300))) return; a.seg(-4, -1, 4, 5); },
    },
    {
      title: 'The formula',
      text: '<p>Add the \\(x\\)-coordinates and halve. Add the \\(y\\)-coordinates and halve.</p>',
      on: FD.walk([['M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)', ''], ['A(1, 6), \\; B(7, -2)', ''], ['M = \\left(\\frac{8}{2}, \\frac{4}{2}\\right) = (4, 2)', '']], (a) => { a.seg(1, 6, 6, -2); a.big(''); }),
    },
    {
      title: 'Working backwards',
      text: '<p>The midpoint of \\(AB\\) is \\(M(3, 1)\\) and \\(A\\) is \\((1, -2)\\). \\(B\\) is the same step again from \\(M\\): \\(+2\\) across and \\(+3\\) up, so \\(B(5, 4)\\).</p>',
      tip: 'A to M is the same step as M to B.',
      on: FD.walk([['A \\to M: \\; (+2, +3)', ''], ['M \\to B: \\; (+2, +3)', 'the same step'], ['B = (5, 4)', '']], (a) => { a.seg(1, -2, 5, 4); a.big(''); }),
    },
    {
      title: 'Try it: move the end points',
      text: '<p>Move \\(A\\) and \\(B\\). The midpoint is always halfway along and halfway up.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'midpoint',
  gens: [
    () => { const [x1, y1, x2, y2] = [FD.rnd(-8, 8), FD.rnd(-8, 8), FD.rnd(-8, 8), FD.rnd(-8, 8)]; return { type: 'num', q: `Find the midpoint of \\(A${slPt(x1, y1)}\\) and \\(B${slPt(x2, y2)}\\).`, a: [(x1 + x2) / 2, (y1 + y2) / 2], fields: ['\\(x\\) =', '\\(y\\) ='], why: `\\(\\left(\\dfrac{${x1} + ${x2 < 0 ? `(${x2})` : x2}}{2}, \\dfrac{${y1} + ${y2 < 0 ? `(${y2})` : y2}}{2}\\right) = (${FD.num((x1 + x2) / 2)}, ${FD.num((y1 + y2) / 2)})\\).` }; },
    () => { const [x1, y1, mx, my] = [FD.rnd(-5, 5), FD.rnd(-5, 5), FD.rnd(-4, 4), FD.rnd(-4, 4)]; return { type: 'num', q: `\\(M${slPt(mx, my)}\\) is the midpoint of \\(AB\\). \\(A\\) is \\(${slPt(x1, y1)}\\). Find \\(B\\).`, a: [2 * mx - x1, 2 * my - y1], fields: ['\\(x\\) =', '\\(y\\) ='], why: `From \\(A\\) to \\(M\\): \\((${mx - x1}, ${my - y1})\\). Do it again from \\(M\\): \\(B${slPt(2 * mx - x1, 2 * my - y1)}\\).` }; },
  ],
});

FD.check({
  section: 'midpoint',
  items: [
    { type: 'num', q: 'Find the midpoint of \\((2, 3)\\) and \\((8, 9)\\).', a: [5, 6], fields: ['\\(x\\) =', '\\(y\\) ='], why: '\\((10 \\div 2, 12 \\div 2)\\).' },
    { type: 'num', q: 'Find the midpoint of \\((-3, 4)\\) and \\((5, -1)\\).', a: [1, 1.5], fields: ['\\(x\\) =', '\\(y\\) ='], why: '\\((2 \\div 2, 3 \\div 2)\\).' },
    { type: 'num', q: 'The midpoint of \\(PQ\\) is \\((0, 0)\\) and \\(P\\) is \\((4, -6)\\). Find \\(Q\\).', a: [-4, 6], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'The same step again from the midpoint.' },
  ],
});
