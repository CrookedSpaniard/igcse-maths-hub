// Gradient as rise over run, with a right-angled triangle drawn on the line.
FD.add({
  id: 'gradient',
  title: 'Gradient',
  tab: 'Gradient',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Gradient', 'How steep a line is: \\(\\dfrac{\\text{change in } y}{\\text{change in } x}\\) (“rise over run”).'],
    ['Positive / negative gradient', 'Positive: the line goes up from left to right. Negative: it goes down.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-g', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Rise <input type="range" data-k="r" min="-6" max="6" value="3"><output data-k="or">3</output></label>
        <label class="ctrl">Run <input type="range" data-k="u" min="1" max="6" value="2"><output data-k="ou">2</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A line with a gradient triangle' });
    a.tri = (rise, run, x0 = -2, y0 = -2) => {
      const m = rise / run, f = (x) => y0 + m * (x - x0);
      g.draw(g.curve(f) + g.line(x0, y0, x0 + run, y0, 'sl-run') + g.line(x0 + run, y0, x0 + run, y0 + rise, 'sl-rise'),
        g.lbl(x0 + run / 2 - 0.5, y0 - 0.2, `run ${run}`) + g.lbl(x0 + run, y0 + rise / 2, `rise ${String(rise).replace('-', '−')}`));
    };
    const sync = () => {
      const r = +a.$('[data-k="r"]').value, u = +a.$('[data-k="u"]').value;
      a.$('[data-k="or"]').textContent = String(r).replace('-', '−'); a.$('[data-k="ou"]').textContent = u;
      a.tri(r, u);
      a.big(`\\text{gradient} = \\frac{${r}}{${u}} = ${FD.num(FD.round(r / u, 3))}`);
      a.msg(r > 0 ? 'Positive: the line goes up from left to right.' : r < 0 ? 'Negative: the line goes down from left to right.' : 'Zero: a horizontal line.');
    };
    ['r', 'u'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.tri(3, 2);
    return a;
  },
  steps: [
    {
      title: 'Rise over run',
      text: '<p>Draw a right-angled triangle under the line. The <b>run</b> is how far across, the <b>rise</b> is how far up.</p><p>Gradient \\(= \\frac{\\text{rise}}{\\text{run}} = \\frac{3}{2} = 1.5\\).</p>',
      async on(a) { a.tryMode(false); a.tri(3, 2); a.big('\\frac{3}{2} = 1.5'); },
    },
    {
      title: 'Negative gradients',
      text: '<p>When the line goes <b>down</b> from left to right, the rise is negative: here \\(\\frac{-4}{2} = -2\\).</p>',
      tip: 'Always read the line from left to right.',
      async on(a) { a.tryMode(false); a.tri(-4, 2, -2, 3); a.big('\\frac{-4}{2} = -2'); },
    },
    {
      title: 'Any triangle gives the same answer',
      text: '<p>A bigger triangle on the same line has a bigger rise and run, but the same ratio: \\(\\frac{6}{4} = \\frac{3}{2}\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.tri(3, 2); a.big('\\frac{3}{2}'); if (!(await ctx.sleep(1400))) return; a.tri(6, 4); a.big('\\frac{6}{4} = \\frac{3}{2}'); },
    },
    {
      title: 'Try it: rise and run',
      text: '<p>Change the rise and the run. Make the line steeper, flatter, and slope downwards.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'gradient',
  gens: [
    () => { const run = FD.rnd(1, 6), rise = FD.rndNZ(-8, 8); return { type: 'num', q: `A line goes ${rise > 0 ? 'up' : 'down'} ${Math.abs(rise)} squares for every ${run} square${run > 1 ? 's' : ''} across (left to right). What is its gradient?`, a: rise / run, tol: 0.01, show: `\\(${FD.ftex(rise, run)}\\)`, hint: 'A fraction like 3/2 or -4/3 is fine.', why: `Gradient \\(= \\dfrac{${rise}}{${run}} = ${FD.ftex(rise, run)}\\).` }; },
  ],
});

FD.check({
  section: 'gradient',
  items: [
    { type: 'num', q: 'A line rises 10 for a run of 2. Find its gradient.', a: 5, why: '\\(10 \\div 2\\).' },
    { type: 'num', q: 'A line goes down 3 for every 4 across. Find its gradient.', a: -0.75, show: '\\(-\\tfrac34\\)', hint: 'A fraction is fine.', why: '\\(\\frac{-3}{4}\\).' },
    { type: 'mcq', q: 'Which line is steepest?', opts: ['gradient −5', 'gradient 3', 'gradient \\(\\frac12\\)', 'gradient 0'], why: 'Steepness is the size of the gradient: 5 is the largest.' },
    { type: 'tf', q: 'A horizontal line has gradient 0.', a: true, why: 'The rise is 0.' },
  ],
});
