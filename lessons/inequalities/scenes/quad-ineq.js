// Quadratic inequalities: y = (x − p)(x − q) is below the axis between the roots and above it outside.
FD.add({
  id: 'quad-ineq',
  title: 'Quadratic inequalities',
  tab: 'Quadratic',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Critical values', 'The roots of the quadratic. They split the number line into parts.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'in-q', side: true,
      vis: '<div data-k="g"></div><div class="nl-host" data-k="nl"></div>',
      tryHtml: `<div class="seg-row" data-k="op"><button class="btn primary" data-o="<">\\(< 0\\)</button><button class="btn" data-o=">">\\(> 0\\)</button></div>
        <label class="ctrl">Root \\(p\\) <input type="range" data-k="p" min="-5" max="0" value="-2"><output data-k="op">−2</output></label>
        <label class="ctrl">Root \\(q\\) <input type="range" data-k="q" min="1" max="5" value="3"><output data-k="oq">3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 300, x: [-6, 6], y: [-8, 8], step: 1, ystep: 2, label: 'A parabola and the x-axis' });
    const nl = FD.numLine(a.$('[data-k="nl"]'));
    a.show = (p, q, below) => {
      const f = (x) => (x - p) * (x - q);
      g.draw(g.curve(f, below ? 'c3' : '', -6, 6) + (below ? g.curve(f, '', p, q) : g.curve(f, '', -6, p) + g.curve(f, '', q, 6)), g.pt(p, 0, 'hot') + g.pt(q, 0, 'hot'));
      nl(below ? { lo: p, hi: q } : { hi: p, or: { lo: q } });
    };
    let below = true;
    const sync = () => {
      const p = +a.$('[data-k="p"]').value, q = +a.$('[data-k="q"]').value;
      a.$('[data-k="op"]').textContent = String(p).replace('-', '−'); a.$('[data-k="oq"]').textContent = q;
      a.show(p, q, below);
      a.big(`${FD.poly([1, -(p + q), p * q])} ${below ? '<' : '>'} 0`);
      a.msg(below ? `Below the axis between the roots: \\(${p} < x < ${q}\\).` : `Above the axis outside the roots: \\(x < ${p}\\) or \\(x > ${q}\\).`);
    };
    a.$('[data-k="op"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; below = b.dataset.o === '<'; a.$('[data-k="op"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    ['p', 'q'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(-2, 3, true);
    return a;
  },
  steps: [
    {
      title: 'Find the critical values',
      text: '<p>To solve \\(x^2 - x - 6 < 0\\), first solve \\(x^2 - x - 6 = 0\\): \\((x + 2)(x - 3) = 0\\), so \\(x = -2\\) or \\(x = 3\\).</p>',
      on: FD.walk([['x^2 - x - 6 = 0', ''], ['(x + 2)(x - 3) = 0', ''], ['x = -2, \\; x = 3', 'critical values']], (a) => { a.show(-2, 3, true); a.big(''); }),
    },
    {
      title: 'Sketch and read off',
      text: '<p>The parabola is ∪-shaped. It is <b>below</b> the \\(x\\)-axis (\\(< 0\\)) between the roots, and <b>above</b> it (\\(> 0\\)) outside them.</p>',
      tip: 'For \\(> 0\\) you need two separate inequalities: \\(x < -2\\) or \\(x > 3\\).',
      async on(a, ctx) { a.tryMode(false); a.show(-2, 3, true); a.big('x^2 - x - 6 < 0'); a.msg('Below the axis: \\(-2 < x < 3\\)'); if (!(await ctx.sleep(2200))) return; a.show(-2, 3, false); a.big('x^2 - x - 6 > 0'); a.msg('Above the axis: \\(x < -2\\) or \\(x > 3\\)'); },
    },
    {
      title: 'Try it: inside or outside?',
      text: '<p>Move the roots and choose \\(< 0\\) or \\(> 0\\). The highlighted part of the curve and the number line show the solution.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'quad-ineq',
  gens: [
    () => { const p = FD.rnd(-6, 2), q = p + FD.rnd(1, 6), lt = Math.random() < .5; return { type: 'mcq', q: `Solve \\(${FD.poly([1, -(p + q), p * q])} ${lt ? '<' : '\\ge'} 0\\)`, opts: lt ? inOpts(`${p} < x < ${q}`, [`x < ${p} \\text{ or } x > ${q}`, `x < ${q}`, `${-q} < x < ${-p}`, `x > ${p}`]) : inOpts(`x \\le ${p} \\text{ or } x \\ge ${q}`, [`${p} \\le x \\le ${q}`, `x \\ge ${q}`, `x \\le ${-q} \\text{ or } x \\ge ${-p}`, `x \\le ${p}`]), why: `Roots \\(x = ${p}\\) and \\(x = ${q}\\). The ∪-shaped curve is ${lt ? 'below the axis between them' : 'on or above the axis outside them'}.` }; },
    () => { const k = FD.rnd(2, 6); return { type: 'num', q: `How many integers satisfy \\(x^2 < ${k * k}\\)?`, a: 2 * k - 1, why: `\\(-${k} < x < ${k}\\): integers from \\(-${k - 1}\\) to \\(${k - 1}\\), which is ${2 * k - 1} integers.` }; },
  ],
});

FD.check({
  section: 'quad-ineq',
  items: [
    { type: 'mcq', q: 'Solve \\(x^2 - 9 \\le 0\\)', opts: ['\\(-3 \\le x \\le 3\\)', '\\(x \\le 3\\)', '\\(x \\le -3\\) or \\(x \\ge 3\\)', '\\(x \\le 9\\)'], why: 'Between the roots ±3, including them.' },
    { type: 'mcq', q: 'Solve \\(x^2 - 5x + 4 > 0\\)', opts: ['\\(x < 1\\) or \\(x > 4\\)', '\\(1 < x < 4\\)', '\\(x > 4\\)', '\\(x > 1\\)'], why: 'Roots 1 and 4; above the axis outside them.' },
    { type: 'tf', q: '\\(x^2 > 16\\) means \\(x > 4\\).', a: false, why: 'Also \\(x < -4\\): \\((-5)^2 = 25 > 16\\).' },
  ],
});
