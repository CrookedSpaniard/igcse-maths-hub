// Higher: the line through two points. m = (y2 − y1)/(x2 − x1), then c from one point.
FD.add({
  id: 'two-points',
  title: 'The line through two points',
  tab: 'Two points',
  icon: 'graph',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Gradient from two points', '\\(m = \\dfrac{y_2 - y_1}{x_2 - x_1}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-t', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(A\\): x <input type="range" data-k="x1" min="-5" max="5" value="-2"><output data-k="ox1">−2</output></label>
        <label class="ctrl">y <input type="range" data-k="y1" min="-5" max="5" value="-3"><output data-k="oy1">−3</output></label>
        <label class="ctrl">\\(B\\): x <input type="range" data-k="x2" min="-5" max="5" value="3"><output data-k="ox2">3</output></label>
        <label class="ctrl">y <input type="range" data-k="y2" min="-5" max="5" value="2"><output data-k="oy2">2</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'The line through two points' });
    a.two = (x1, y1, x2, y2) => {
      if (x1 === x2) { g.draw(`<line class="curve" x1="${g.ax.X(x1)}" y1="${g.ax.Y(-6)}" x2="${g.ax.X(x1)}" y2="${g.ax.Y(6)}"/>`, g.pt(x1, y1) + g.pt(x2, y2)); return null; }
      const m = (y2 - y1) / (x2 - x1), c = y1 - m * x1;
      g.draw(g.curve((x) => m * x + c) + g.line(x1, y1, x2, y1, 'sl-run') + g.line(x2, y1, x2, y2, 'sl-rise'), g.pt(x1, y1, 'hot') + g.pt(x2, y2, 'hot') + g.lbl(x1, y1, 'A') + g.lbl(x2, y2, 'B'));
      return [m, c];
    };
    const sync = () => {
      const v = ['x1', 'y1', 'x2', 'y2'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['x1', 'y1', 'x2', 'y2'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String(v[i]).replace('-', '−'); });
      const r = a.two(...v);
      if (!r) { a.big(`x = ${v[0]}`); a.msg('A vertical line: the run is 0, so the gradient is undefined.', 'bad'); return; }
      a.big(`m = \\frac{${v[3]} - ${v[1] < 0 ? `(${v[1]})` : v[1]}}{${v[2]} - ${v[0] < 0 ? `(${v[0]})` : v[0]}} = ${FD.ftex(v[3] - v[1], v[2] - v[0])}`);
      const dy = v[3] - v[1], dx = v[2] - v[0], mT = FD.ftex(dy, dx), cN = v[1] * dx - dy * v[0];
      const mx = !dy ? '' : `${mT === '1' ? '' : mT === '-1' ? '-' : mT}x`;
      const cT = !cN ? '' : `${mx ? (cN * dx < 0 ? ' - ' : ' + ') : cN * dx < 0 ? '-' : ''}${FD.ftex(Math.abs(cN), Math.abs(dx))}`;
      a.msg(`The line is \\(y = ${mx}${cT || (mx ? '' : '0')}\\).`);
    };
    ['x1', 'y1', 'x2', 'y2'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.two(-2, -3, 3, 2);
    return a;
  },
  steps: [
    {
      title: 'Gradient from coordinates',
      text: '<p>\\(A(-2, -3)\\) and \\(B(3, 2)\\). The change in \\(y\\) is \\(2 - (-3) = 5\\). The change in \\(x\\) is \\(3 - (-2) = 5\\).</p><p>\\(m = \\frac{5}{5} = 1\\).</p>',
      tip: 'Subtract in the same order on the top and the bottom.',
      async on(a) { a.tryMode(false); a.two(-2, -3, 3, 2); a.big('m = \\frac{y_2 - y_1}{x_2 - x_1}'); },
    },
    {
      title: 'Find the equation',
      text: '<p>Find the equation of the line through \\((1, 4)\\) and \\((3, 10)\\).</p>',
      on: FD.walk([['m = \\frac{10 - 4}{3 - 1} = 3', ''], ['y = 3x + c', ''], ['4 = 3(1) + c \\Rightarrow c = 1', 'substitute a point'], ['y = 3x + 1', '']], (a) => { a.two(1, 4, 3, 10); a.big(''); }),
    },
    {
      title: 'Try it: two points',
      text: '<p>Move \\(A\\) and \\(B\\). The gradient and the equation of the line through them update.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'two-points',
  gens: [
    () => { let x1, x2, m, c; do { x1 = FD.rnd(-5, 4); x2 = FD.rnd(-5, 6); m = FD.rndNZ(-4, 4); c = FD.rnd(-6, 6); } while (x1 === x2); const y1 = m * x1 + c, y2 = m * x2 + c; return { type: 'num', q: `Find the equation of the line through \\(${slPt(x1, y1)}\\) and \\(${slPt(x2, y2)}\\) in the form \\(y = mx + c\\).`, a: [m, c], fields: ['\\(m\\) =', '\\(c\\) ='], why: `\\(m = \\dfrac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}} = ${m}\\). Then \\(${y1} = ${m}(${x1}) + c\\), so \\(c = ${c}\\).` }; },
  ],
});

FD.check({
  section: 'two-points',
  items: [
    { type: 'num', q: 'Find the gradient of the line through \\((2, 5)\\) and \\((6, 13)\\).', a: 2, why: '\\(\\frac{8}{4}\\).' },
    { type: 'num', q: 'Find the gradient of the line through \\((-1, 4)\\) and \\((3, -4)\\).', a: -2, why: '\\(\\frac{-8}{4}\\).' },
    { type: 'mcq', q: 'The line through \\((0, 3)\\) and \\((2, 7)\\) is…', opts: ['\\(y = 2x + 3\\)', '\\(y = 3x + 2\\)', '\\(y = 2x + 7\\)', '\\(y = 4x + 3\\)'], why: '\\(m = 2\\), \\(c = 3\\).' },
  ],
});
