// Features of y = (x − p)(x − q): roots p and q, symmetry line halfway, turning point on it, y-intercept pq.
FD.add({
  id: 'parabolas',
  title: 'Features of quadratic graphs',
  tab: 'Parabolas',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Roots', 'Where the curve crosses the \\(x\\)-axis (\\(y = 0\\)).'],
    ['Line of symmetry', 'The vertical line that the parabola is symmetrical about, halfway between the roots.'],
    ['Turning point', 'The lowest point of a ∪ (minimum) or the highest point of a ∩ (maximum).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'cu-f', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Root \\(p\\) <input type="range" data-k="p" min="-4" max="2" value="-1"><output data-k="op">−1</output></label>
        <label class="ctrl">Root \\(q\\) <input type="range" data-k="q" min="-2" max="5" value="3"><output data-k="oq">3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 380, x: [-5, 6], y: [-10, 8], step: 1, ystep: 2, label: 'A parabola with its key features' });
    a.feat = (p, q, show = 4) => {
      const f = (x) => (x - p) * (x - q), m = (p + q) / 2;
      g.draw(g.curve(f) + (show > 1 ? g.line(m, -10, m, 8, 'g-line') : ''),
        (show > 0 ? g.pt(p, 0, 'hot') + g.pt(q, 0, 'hot') : '') + (show > 2 ? g.pt(m, f(m), 'c2') + g.lbl(m, f(m), `(${FD.num(m)}, ${FD.num(f(m))})`) : '') + (show > 3 ? g.pt(0, p * q) : ''));
    };
    const sync = () => {
      const p = +a.$('[data-k="p"]').value, q = +a.$('[data-k="q"]').value;
      a.$('[data-k="op"]').textContent = String(p).replace('-', '−'); a.$('[data-k="oq"]').textContent = String(q).replace('-', '−');
      const m = (p + q) / 2;
      a.feat(p, q);
      a.big(`y = ${FD.poly([1, -(p + q), p * q])}`);
      a.msg(`Roots \\(${p}\\) and \\(${q}\\); symmetry \\(x = ${FD.num(m)}\\); minimum \\((${FD.num(m)}, ${FD.num((m - p) * (m - q))})\\); \\(y\\)-intercept \\(${p * q}\\).`);
    };
    ['p', 'q'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.feat(-1, 3, 0);
    return a;
  },
  steps: [
    {
      title: 'Roots',
      text: '<p>The graph of \\(y = x^2 - 2x - 3\\) crosses the \\(x\\)-axis at \\(x = -1\\) and \\(x = 3\\). These are the <b>roots</b>: the solutions of \\(x^2 - 2x - 3 = 0\\).</p>',
      async on(a) { a.tryMode(false); a.feat(-1, 3, 1); a.big('y = x^2 - 2x - 3'); },
    },
    {
      title: 'Line of symmetry and turning point',
      text: '<p>The line of symmetry is halfway between the roots: \\(x = \\frac{-1 + 3}{2} = 1\\). The turning point is on it: \\(y = 1 - 2 - 3 = -4\\), so the minimum is \\((1, -4)\\).</p>',
      tip: 'Substitute the \\(x\\) of the symmetry line to find the turning point.',
      async on(a, ctx) { a.tryMode(false); a.feat(-1, 3, 2); if (!(await ctx.sleep(1300))) return; a.feat(-1, 3, 3); },
    },
    {
      title: 'The y-intercept',
      text: '<p>The curve crosses the \\(y\\)-axis when \\(x = 0\\): \\(y = -3\\), the constant term.</p>',
      async on(a) { a.tryMode(false); a.feat(-1, 3, 4); a.msg('\\(y\\)-intercept \\((0, -3)\\).'); },
    },
    {
      title: 'Try it: move the roots',
      text: '<p>Move the two roots. The line of symmetry stays halfway between them and the turning point moves with it.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'parabolas',
  gens: [
    () => { let p, q; do { p = FD.rnd(-5, 3); q = FD.rnd(-3, 6); } while (p >= q); const m = (p + q) / 2; return { type: 'num', q: `A parabola crosses the \\(x\\)-axis at \\(x = ${p}\\) and \\(x = ${q}\\). What is the equation of its line of symmetry? Give the value of \\(x\\).`, a: m, why: `Halfway: \\(\\dfrac{${p} + ${q}}{2} = ${FD.num(m)}\\), so \\(x = ${FD.num(m)}\\).` }; },
    () => { let p, q; do { p = FD.rnd(-5, 3); q = FD.rnd(-3, 6); } while (p >= q || (p + q) % 2); const m = (p + q) / 2; return { type: 'num', q: `Find the coordinates of the turning point of \\(y = ${FD.poly([1, -(p + q), p * q])}\\). Its roots are ${p} and ${q}.`, a: [m, (m - p) * (m - q)], fields: ['\\(x\\) =', '\\(y\\) ='], why: `Symmetry line \\(x = ${m}\\). \\(y = (${m} ${FD.sg(-p)})(${m} ${FD.sg(-q)}) = ${(m - p) * (m - q)}\\).` }; },
  ],
});

FD.check({
  section: 'parabolas',
  items: [
    { type: 'num', q: 'A parabola has roots \\(x = 2\\) and \\(x = 8\\). Find the \\(x\\)-coordinate of its turning point.', a: 5, why: 'Halfway between 2 and 8.' },
    { type: 'num', q: 'Where does \\(y = x^2 + 4x - 7\\) cross the \\(y\\)-axis? Give the \\(y\\)-coordinate.', a: -7, why: 'Put \\(x = 0\\).' },
    { type: 'mcq', q: 'The graph of \\(y = -x^2 + 4\\) has…', opts: ['a maximum point', 'a minimum point', 'no turning point', 'two turning points'], why: 'Negative \\(x^2\\): ∩ shape.' },
  ],
});
