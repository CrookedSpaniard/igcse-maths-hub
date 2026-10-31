// Differentiating ax^n: bring the power down and reduce it by one. A curve and its gradient graph side by side.
const caTerm = (a, n) => (n === 0 ? `${a}` : `${a === 1 ? '' : a === -1 ? '-' : a}x${n === 1 ? '' : `^{${n}}`}`);
FD.add({
  id: 'differentiate',
  title: 'Differentiating powers of x',
  tab: 'Differentiate',
  icon: 'calc',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['\\(\\dfrac{dy}{dx}\\)', 'The derivative: the gradient function of \\(y\\).'],
    ['Power rule', 'If \\(y = ax^n\\), then \\(\\dfrac{dy}{dx} = nax^{n - 1}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ca-d', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-3" max="3" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(n\\) <input type="range" data-k="n" min="-2" max="4" value="3"><output data-k="on">3</output></label>
        <label class="ctrl">Tangent at \\(x\\) <input type="range" data-k="x" min="-2" max="2" step="0.25" value="1"><output data-k="ox">1</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-3, 3], y: [-8, 8], step: 1, ystep: 2, label: 'A curve, its tangent and its gradient function' });
    a.show = (A, n, x) => {
      const f = (t) => A * t ** n, d = (t) => n * A * t ** (n - 1), cut = n < 0;
      const curve = (h, cls) => (cut ? g.curve(h, cls, -3, -0.05) + g.curve(h, cls, 0.05, 3) : g.curve(h, cls));
      g.draw(curve(f, '') + curve(d, 'ca-dash') + (x != null && !(cut && !x) ? FD.tangent(g, f, d, x, 0.8) : ''));
    };
    const sync = () => {
      let A = +a.$('[data-k="a"]').value; if (!A) { A = 1; a.$('[data-k="a"]').value = 1; }
      let n = +a.$('[data-k="n"]').value; let x = +a.$('[data-k="x"]').value;
      if (n < 0 && !x) { x = 1; a.$('[data-k="x"]').value = 1; }
      ['a', 'n', 'x'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([A, n, x][i]).replace('-', '−'); });
      a.show(A, n, x);
      a.big(`y = ${caTerm(A, n)} \\;\\Rightarrow\\; \\frac{dy}{dx} = ${n ? caTerm(n * A, n - 1) : '0'}`);
      a.msg(`At \\(x = ${x}\\) the gradient is \\(${FD.num(FD.round(n * A * x ** (n - 1), 3))}\\). The dashed curve is the gradient function.`);
    };
    ['a', 'n', 'x'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(1, 2, 1);
    return a;
  },
  steps: [
    {
      title: 'The gradient of y = x²',
      text: '<p>For \\(y = x^2\\), the gradient at \\(x\\) is always \\(2x\\): at \\(x = 1\\) it is 2, at \\(x = 3\\) it is 6. So \\(\\frac{dy}{dx} = 2x\\).</p>',
      async on(a, ctx) { a.tryMode(false); for (const x of [-2, -1, 0, 1, 2]) { a.show(1, 2, x); a.big(`x = ${x}: \\; \\frac{dy}{dx} = ${2 * x}`); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'The power rule',
      text: '<p>Multiply by the power, then take 1 off the power. A number on its own has gradient 0.</p>',
      tip: 'Differentiate each term separately.',
      on: FD.walk([['y = x^5 \\Rightarrow \\frac{dy}{dx} = 5x^4', ''], ['y = 3x^4 \\Rightarrow \\frac{dy}{dx} = 12x^3', '4 × 3'], ['y = 7x \\Rightarrow \\frac{dy}{dx} = 7', 'x¹ → x⁰ = 1'], ['y = 9 \\Rightarrow \\frac{dy}{dx} = 0', 'constant'], ['y = 2x^3 - 5x^2 + 4 \\Rightarrow 6x^2 - 10x', 'term by term']], (a) => { a.show(1, 3, 1); a.big(''); }, 1300),
    },
    {
      title: 'Negative powers',
      text: '<p>Write fractions as negative powers first: \\(\\frac{4}{x} = 4x^{-1}\\). Then the same rule works.</p>',
      on: FD.walk([['y = \\frac{4}{x} = 4x^{-1}', ''], ['\\frac{dy}{dx} = -4x^{-2} = -\\frac{4}{x^2}', '× (−1), power − 1'], ['y = \\frac{1}{x^2} = x^{-2} \\Rightarrow -2x^{-3}', '']], (a) => { a.show(4, -1, 1); a.big(''); }, 1400),
    },
    {
      title: 'Gradient at a point',
      text: '<p>To find the gradient of \\(y = x^3 - 4x\\) at \\(x = 2\\): differentiate, then substitute.</p>',
      on: FD.walk([['\\frac{dy}{dx} = 3x^2 - 4', ''], ['x = 2: \\; 3(4) - 4 = 8', 'the gradient is 8']], (a) => { a.show(1, 3, 2); a.big(''); }),
    },
    {
      title: 'Try it: the power rule',
      text: '<p>Choose \\(a\\) and \\(n\\) in \\(y = ax^n\\). The dashed curve is \\(\\frac{dy}{dx}\\). Move the tangent and compare its gradient with the dashed curve.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'differentiate',
  gens: [
    () => { const t = [[FD.rndNZ(-4, 5), 3], [FD.rndNZ(-6, 6), 2], [FD.rndNZ(-9, 9), 1], [FD.rnd(-9, 9), 0]]; const y = FD.poly(t.map((p) => p[0])), d = FD.poly([3 * t[0][0], 2 * t[1][0], t[2][0]]); return { type: 'alg', q: `Find \\(\\dfrac{dy}{dx}\\) when \\(y = ${y}\\).`, a: FD.poly([3 * t[0][0], 2 * t[1][0], t[2][0]], 'x', true), lhs: '\\frac{dy}{dx} =', form: 'expanded', show: `\\(${d}\\)`, hint: 'Type powers with ^, e.g. 6x^2 - 10x + 3.', why: `Term by term: \\(${caTerm(t[0][0], 3)} \\to ${caTerm(3 * t[0][0], 2)}\\), \\(${caTerm(t[1][0], 2)} \\to ${caTerm(2 * t[1][0], 1)}\\), \\(${caTerm(t[2][0], 1)} \\to ${t[2][0]}\\), constant → 0. So \\(${d}\\).` }; },
    () => { const A = FD.rndNZ(-3, 4), B = FD.rndNZ(-6, 6), x = FD.rnd(-3, 3); return { type: 'num', q: `Find the gradient of \\(y = ${FD.poly([A, 0, B, 0])}\\) at the point where \\(x = ${x}\\).`, a: 3 * A * x * x + B, why: `\\(\\dfrac{dy}{dx} = ${FD.poly([3 * A, 0, B])}\\). At \\(x = ${x}\\): \\(${3 * A}(${x * x}) ${FD.sg(B)} = ${3 * A * x * x + B}\\).` }; },
    () => { const k = FD.rnd(2, 8); return { type: 'mcq', q: `Differentiate \\(y = \\dfrac{${k}}{x}\\).`, opts: [`\\(-\\dfrac{${k}}{x^2}\\)`, `\\(\\dfrac{${k}}{x^2}\\)`, `\\(${k}\\)`, `\\(-${k}x\\)`], why: `\\(${k}x^{-1} \\to -${k}x^{-2} = -\\dfrac{${k}}{x^2}\\).` }; },
  ],
});

FD.check({
  section: 'differentiate',
  items: [
    { type: 'alg', q: 'Differentiate \\(y = 4x^3 - 2x^2 + 5x - 1\\).', a: '12x^2-4x+5', lhs: '\\frac{dy}{dx} =', form: 'expanded', show: '\\(12x^2 - 4x + 5\\)', why: 'Term by term.' },
    { type: 'num', q: 'Find the gradient of \\(y = x^2 + 3x\\) at \\(x = 4\\).', a: 11, why: '\\(2x + 3 = 11\\).' },
    { type: 'mcq', q: 'If \\(y = 6\\), then \\(\\frac{dy}{dx}\\) is…', opts: ['0', '6', '1', '6x'], why: 'A horizontal line has gradient 0.' },
    { type: 'mcq', q: 'Differentiate \\(y = \\frac{1}{x^3}\\).', opts: ['\\(-\\frac{3}{x^4}\\)', '\\(\\frac{3}{x^2}\\)', '\\(-\\frac{1}{3x^2}\\)', '\\(-3x^2\\)'], why: '\\(x^{-3} \\to -3x^{-4}\\).' },
  ],
});
