// Stationary points of y = x³ + bx² + cx + d: dy/dx = 0 gives flat tangents at the turning points.
FD.add({
  id: 'stationary',
  title: 'Stationary points',
  tab: 'Turning points',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Stationary point', 'A point where the gradient is 0: \\(\\frac{dy}{dx} = 0\\).'],
    ['Maximum / minimum', 'A turning point at the top of a hill (maximum) or the bottom of a valley (minimum).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ca-s', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<p class="ab-ask">\\(y = x^3 - 3px\\) · move the tangent</p>
        <label class="ctrl">\\(p\\) <input type="range" data-k="p" min="1" max="3" step="0.25" value="1"><output data-k="op">1</output></label>
        <label class="ctrl">Tangent at \\(x\\) <input type="range" data-k="x" min="-2.5" max="2.5" step="0.25" value="0"><output data-k="ox">0</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-3, 3], y: [-8, 8], step: 1, ystep: 2, label: 'A cubic with its turning points' });
    a.cubic = (p, x) => {
      const f = (t) => t ** 3 - 3 * p * t, d = (t) => 3 * t * t - 3 * p, r = Math.sqrt(p);
      g.draw(g.curve(f) + (x != null ? FD.tangent(g, f, d, x, 0.8) : ''), g.pt(-r, f(-r), 'c2') + g.pt(r, f(r), 'c2') + g.lbl(-r, f(-r), 'max') + g.lbl(r, f(r), 'min'));
      return d(x || 0);
    };
    const sync = () => {
      const p = +a.$('[data-k="p"]').value, x = +a.$('[data-k="x"]').value;
      a.$('[data-k="op"]').textContent = p; a.$('[data-k="ox"]').textContent = String(x).replace('-', '−');
      const grad = a.cubic(p, x);
      a.big(`\\frac{dy}{dx} = 3x^2 - ${FD.num(3 * p)} = ${FD.num(FD.round(grad, 3))}`);
      a.msg(Math.abs(grad) < 1e-9 ? '✓ Gradient 0: a stationary point.' : grad > 0 ? 'Gradient positive: going up.' : 'Gradient negative: going down.', Math.abs(grad) < 1e-9 ? 'good' : 'bad');
    };
    ['p', 'x'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.cubic(1, null);
    return a;
  },
  steps: [
    {
      title: 'Flat tangents',
      text: '<p>At the top of a hill and the bottom of a valley the tangent is flat: the gradient is 0. These are <b>stationary points</b> (turning points).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (const x of [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5]) { a.cubic(1, x); if (!(await ctx.sleep(500))) return; } a.cubic(1, -1); },
    },
    {
      title: 'Solve dy/dx = 0',
      text: '<p>Find the stationary points of \\(y = x^3 - 3x\\).</p>',
      on: FD.walk([['\\frac{dy}{dx} = 3x^2 - 3', ''], ['3x^2 - 3 = 0 \\Rightarrow x^2 = 1', 'set it equal to 0'], ['x = 1 \\text{ or } x = -1', ''], ['(1, -2) \\text{ and } (-1, 2)', 'substitute into y']], (a) => { a.cubic(1, null); a.big(''); }, 1400),
    },
    {
      title: 'Maximum or minimum?',
      text: '<p>Use the shape of the graph. A positive \\(x^3\\) cubic goes up, down, then up again: the left turning point \\((-1, 2)\\) is a <b>maximum</b> and the right one \\((1, -2)\\) is a <b>minimum</b>.</p>',
      tip: 'For a quadratic: ∪ shape (positive \\(x^2\\)) has a minimum; ∩ shape has a maximum.',
      async on(a) { a.tryMode(false); a.cubic(1, null); a.big('\\text{max } (-1, 2), \\quad \\text{min } (1, -2)'); },
    },
    {
      title: 'Try it: find the flat spots',
      text: '<p>Change \\(p\\) and move the tangent. Find the two places where the gradient is exactly 0.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'stationary',
  gens: [
    () => { const h = FD.rndNZ(-4, 4), k = FD.rnd(-6, 6), up = Math.random() < .5, s = up ? 1 : -1; return { type: 'num', q: `Find the coordinates of the turning point of \\(y = ${FD.poly([s, -2 * s * h, s * h * h + k])}\\).`, a: [h, k], fields: ['\\(x\\) =', '\\(y\\) ='], why: `\\(\\dfrac{dy}{dx} = ${FD.poly([2 * s, -2 * s * h])} = 0\\) gives \\(x = ${h}\\). Then \\(y = ${k}\\). It is a ${up ? 'minimum (∪ shape)' : 'maximum (∩ shape)'}.` }; },
    () => { const p = FD.pick([1, 4, 9]), r = Math.sqrt(p); return { type: 'num', q: `Find the \\(x\\)-coordinates of the stationary points of \\(y = x^3 - ${3 * p}x\\).`, a: [r, -r], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: `\\(3x^2 - ${3 * p} = 0\\), \\(x^2 = ${p}\\), \\(x = \\pm ${r}\\).` }; },
  ],
});

FD.check({
  section: 'stationary',
  items: [
    { type: 'num', q: 'Find the \\(x\\)-coordinate of the turning point of \\(y = x^2 - 8x + 3\\).', a: 4, why: '\\(2x - 8 = 0\\).' },
    { type: 'mcq', q: 'The turning point of \\(y = 5 + 6x - x^2\\) is a…', opts: ['maximum', 'minimum', 'neither', 'point where the curve crosses the axis'], why: 'Negative \\(x^2\\): ∩ shape.' },
    { type: 'num', q: 'Find the \\(y\\)-coordinate of the turning point of \\(y = x^2 + 6x + 1\\).', a: -8, why: '\\(x = -3\\): \\(9 - 18 + 1\\).' },
    { type: 'tf', q: 'At a stationary point, \\(\\frac{dy}{dx} = 0\\).', a: true, why: 'The tangent is horizontal.' },
  ],
});
