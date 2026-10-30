// The quadratic formula with sliders for a, b and c; the discriminant decides how many roots.
FD.add({
  id: 'formula',
  title: 'The quadratic formula',
  tab: 'Formula',
  icon: 'calc',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Quadratic formula', '\\(x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\) solves \\(ax^2 + bx + c = 0\\).'],
    ['Discriminant', '\\(b^2 - 4ac\\). Positive: two roots. Zero: one repeated root. Negative: no real roots.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-q', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-3" max="3" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(b\\) <input type="range" data-k="b" min="-8" max="8" value="3"><output data-k="ob">3</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-8" max="8" value="-5"><output data-k="oc">−5</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 360, x: [-6, 6], y: [-10, 10], step: 1, ystep: 2, label: 'Graph of y = ax² + bx + c' });
    a.solve = (A, B, C) => {
      const D = B * B - 4 * A * C, r = D >= 0 ? [(-B + Math.sqrt(D)) / (2 * A), (-B - Math.sqrt(D)) / (2 * A)] : [];
      g.draw(g.curve((x) => A * x * x + B * x + C), r.filter((x) => Math.abs(x) <= 6).map((x) => g.pt(x, 0, 'hot')).join(''));
      return { D, r };
    };
    const sync = () => {
      let A = +a.$('[data-k="a"]').value; if (!A) { A = 1; a.$('[data-k="a"]').value = 1; }
      const B = +a.$('[data-k="b"]').value, C = +a.$('[data-k="c"]').value;
      ['a', 'b', 'c'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([A, B, C][i]).replace('-', '−'); });
      const { D, r } = a.solve(A, B, C);
      a.big(`x = \\frac{${-B} \\pm \\sqrt{${D}}}{${2 * A}}`);
      a.msg(D > 0 ? `\\(b^2 - 4ac = ${D} > 0\\): two roots, \\(x = ${FD.round(r[0], 2)}\\) and \\(x = ${FD.round(r[1], 2)}\\).` : D === 0 ? `\\(b^2 - 4ac = 0\\): one repeated root, \\(x = ${FD.round(r[0], 2)}\\).` : `\\(b^2 - 4ac = ${D} < 0\\): no real roots. The curve does not cross the \\(x\\)-axis.`, D < 0 ? 'bad' : 'good');
    };
    ['a', 'b', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.solve(1, 3, -5);
    return a;
  },
  steps: [
    {
      title: 'When factorising does not work',
      text: '<p>\\(x^2 + 3x - 5 = 0\\) does not factorise with whole numbers. The <b>quadratic formula</b> works for every quadratic.</p><p>\\(x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)</p>',
      async on(a) { a.tryMode(false); a.solve(1, 3, -5); a.big('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'); },
    },
    {
      title: 'Use it carefully',
      text: '<p>Write down \\(a\\), \\(b\\) and \\(c\\) first, with their signs. Then substitute, using brackets for negatives.</p>',
      tip: 'On the calculator, work out the square root part first, then do the + and the − separately.',
      on: FD.walk([['a = 1, \\; b = 3, \\; c = -5', ''], ['x = \\frac{-3 \\pm \\sqrt{3^2 - 4(1)(-5)}}{2(1)}', ''], ['x = \\frac{-3 \\pm \\sqrt{29}}{2}', ''], ['x = 1.19 \\;\\text{ or }\\; x = -4.19', '2 d.p.']], (a) => { a.solve(1, 3, -5); a.big(''); }, 1500),
    },
    {
      title: 'The discriminant',
      text: '<p>The part under the square root, \\(b^2 - 4ac\\), tells you how many solutions there are, and whether the graph crosses the \\(x\\)-axis.</p>',
      async on(a, ctx) { a.tryMode(false); for (const [A, B, C, t] of [[1, 2, -3, 'positive: 2 roots'], [1, 2, 1, 'zero: 1 root'], [1, 2, 4, 'negative: no roots']]) { const { D } = a.solve(A, B, C); a.big(`b^2 - 4ac = ${D}`); a.msg(`\\(${FD.poly([A, B, C])} = 0\\): ${t}`, D < 0 ? 'bad' : 'good'); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'Try it: a, b and c',
      text: '<p>Change \\(a\\), \\(b\\) and \\(c\\). The formula updates and the roots are marked on the graph. Find values with no real roots.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'formula',
  gens: [
    () => { let A, B, C, D; do { A = FD.rnd(1, 4); B = FD.rnd(-9, 9); C = FD.rndNZ(-9, 9); D = B * B - 4 * A * C; } while (D <= 0 || Number.isInteger(Math.sqrt(D))); const r1 = (-B + Math.sqrt(D)) / (2 * A), r2 = (-B - Math.sqrt(D)) / (2 * A); return { type: 'num', q: `Solve \\(${FD.poly([A, B, C])} = 0\\). Give your answers to 2 decimal places.`, a: [FD.round(r1, 2), FD.round(r2, 2)], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.006, why: `\\(a = ${A}, b = ${B}, c = ${C}\\). \\(x = \\dfrac{${-B} \\pm \\sqrt{${D}}}{${2 * A}}\\) = ${FD.round(r1, 2)} or ${FD.round(r2, 2)}.` }; },
    () => { const A = FD.rnd(1, 3), B = FD.rnd(-6, 6), C = FD.rnd(-6, 6), D = B * B - 4 * A * C; return { type: 'mcq', q: `How many real solutions does \\(${FD.poly([A, B, C])} = 0\\) have?`, opts: D > 0 ? ['Two', 'One', 'None', 'Three'] : D === 0 ? ['One', 'Two', 'None', 'Three'] : ['None', 'One', 'Two', 'Three'], why: `\\(b^2 - 4ac = ${B * B} - ${4 * A * C} = ${D}\\), which is ${D > 0 ? 'positive' : D === 0 ? 'zero' : 'negative'}.` }; },
  ],
});

FD.check({
  section: 'formula',
  items: [
    { type: 'num', q: 'Solve \\(x^2 + 4x - 7 = 0\\). Give your answers to 2 decimal places.', a: [1.32, -5.32], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.006, why: '\\(x = \\frac{-4 \\pm \\sqrt{44}}{2}\\).' },
    { type: 'num', q: 'Solve \\(2x^2 - 3x - 4 = 0\\). Give your answers to 2 decimal places.', a: [2.35, -0.85], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.006, why: '\\(x = \\frac{3 \\pm \\sqrt{41}}{4}\\).' },
    { type: 'num', q: 'Work out the discriminant of \\(3x^2 + 2x + 1\\).', a: -8, why: '\\(4 - 12 = -8\\): no real roots.' },
  ],
});
