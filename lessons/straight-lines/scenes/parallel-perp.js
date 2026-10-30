// Higher: parallel lines share m; perpendicular gradients multiply to −1.
FD.add({
  id: 'parallel-perp',
  title: 'Parallel and perpendicular lines',
  tab: 'Parallel & perpendicular',
  icon: 'graph',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Parallel', 'Lines with the same gradient never meet.'],
    ['Perpendicular', 'Lines at right angles. Their gradients multiply to −1: \\(m_2 = -\\frac{1}{m_1}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-p', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="k"><button class="btn primary" data-k2="par">Parallel</button><button class="btn" data-k2="perp">Perpendicular</button></div>
        <label class="ctrl">\\(m\\) of the first line <input type="range" data-k="m" min="-3" max="3" step="0.5" value="2"><output data-k="om">2</output></label>
        <label class="ctrl">Through \\((x, y)\\): x <input type="range" data-k="px" min="-4" max="4" value="1"><output data-k="opx">1</output></label>
        <label class="ctrl">y <input type="range" data-k="py" min="-4" max="4" value="-2"><output data-k="opy">−2</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A line and a parallel or perpendicular line' });
    a.pair = (m, c, m2, px, py) => g.draw(g.curve((x) => m * x + c) + (isFinite(m2) ? g.curve((x) => m2 * (x - px) + py, 'c2') : `<line class="curve c2" x1="${g.ax.X(px)}" y1="${g.ax.Y(-6)}" x2="${g.ax.X(px)}" y2="${g.ax.Y(6)}"/>`), g.pt(px, py, 'hot'));
    let kind = 'par';
    const sync = () => {
      let m = +a.$('[data-k="m"]').value;
      const px = +a.$('[data-k="px"]').value, py = +a.$('[data-k="py"]').value;
      if (kind === 'perp' && !m) { m = 1; a.$('[data-k="m"]').value = 1; }
      a.$('[data-k="om"]').textContent = String(m).replace('-', '−'); a.$('[data-k="opx"]').textContent = String(px).replace('-', '−'); a.$('[data-k="opy"]').textContent = String(py).replace('-', '−');
      const m2 = kind === 'par' ? m : -1 / m, c2 = py - m2 * px;
      a.pair(m, 1, m2, px, py);
      a.big(`y = ${FD.poly([m, 1])}, \\quad y = ${FD.poly([FD.round(m2, 3), FD.round(c2, 3)])}`);
      a.msg(kind === 'par' ? `Same gradient ${m}: parallel.` : `\\(${m} \\times ${FD.round(m2, 3)} = -1\\): perpendicular.`);
    };
    a.$('[data-k="k"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; kind = b.dataset.k2; a.$('[data-k="k"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    ['m', 'px', 'py'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.pair(2, 1, 2, 1, -2);
    return a;
  },
  steps: [
    {
      title: 'Parallel lines',
      text: '<p>Parallel lines have the <b>same gradient</b>. Find the line parallel to \\(y = 2x + 1\\) through \\((1, -2)\\).</p>',
      on: FD.walk([['m = 2', 'same gradient'], ['-2 = 2(1) + c \\Rightarrow c = -4', 'substitute the point'], ['y = 2x - 4', '']], (a) => { a.pair(2, 1, 2, 1, -2); a.big(''); }),
    },
    {
      title: 'Perpendicular lines',
      text: '<p>Perpendicular gradients multiply to \\(-1\\). Turn the gradient upside down and change its sign: the perpendicular to gradient 2 has gradient \\(-\\frac12\\).</p>',
      tip: '“Flip it and change the sign.”',
      on: FD.walk([['m_1 \\times m_2 = -1', ''], ['m_1 = 2 \\Rightarrow m_2 = -\\frac12', ''], ['\\text{through } (1, -2): \\; y = -\\frac12 x - \\frac32', '']], (a) => { a.pair(2, 1, -0.5, 1, -2); a.big(''); }),
    },
    {
      title: 'Try it: parallel or perpendicular',
      text: '<p>Choose the kind of line, the gradient of the first line and the point the second line passes through.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'parallel-perp',
  gens: [
    () => { const m = FD.rndNZ(-5, 5), px = FD.rnd(-4, 4), py = FD.rnd(-6, 6), c0 = FD.rnd(-5, 5); return { type: 'num', q: `Find the equation of the line parallel to \\(y = ${FD.poly([m, c0])}\\) that passes through \\(${slPt(px, py)}\\). Give \\(m\\) and \\(c\\).`, a: [m, py - m * px], fields: ['\\(m\\) =', '\\(c\\) ='], why: `Same gradient ${m}. \\(${py} = ${m}(${px}) + c\\), so \\(c = ${py - m * px}\\).` }; },
    () => { const [p, q] = FD.pick([[2, 1], [-2, 1], [3, 1], [-3, 1], [4, 1], [1, 2], [-1, 2], [-1, 4], [2, 3], [-3, 4]]), m = p / q; return { type: 'num', q: `What is the gradient of a line perpendicular to \\(y = ${FD.ftex(p, q)}x + 1\\)?`, a: -q / p, tol: 0.001, show: `\\(${FD.ftex(-q, p)}\\)`, hint: 'A fraction like -1/2 is fine.', why: `Flip \\(${FD.ftex(p, q)}\\) and change the sign: \\(m_2 = ${FD.ftex(-q, p)}\\). Check: \\(${FD.num(FD.round(m, 3))} \\times ${FD.num(FD.round(-q / p, 3))} = -1\\).` }; },
  ],
});

FD.check({
  section: 'parallel-perp',
  items: [
    { type: 'mcq', q: 'Which line is parallel to \\(y = 3x - 2\\)?', opts: ['\\(y = 3x + 5\\)', '\\(y = -3x - 2\\)', '\\(y = \\frac13 x\\)', '\\(y = 2x + 3\\)'], why: 'Same gradient 3.' },
    { type: 'num', q: 'What is the gradient of a line perpendicular to \\(y = 4x + 1\\)?', a: -0.25, show: '\\(-\\tfrac14\\)', hint: 'A fraction is fine.', why: '\\(-\\frac{1}{4}\\).' },
    { type: 'tf', q: '\\(y = 2x\\) and \\(y = -\\frac12 x + 3\\) are perpendicular.', a: true, why: '\\(2 \\times -\\frac12 = -1\\).' },
  ],
});
