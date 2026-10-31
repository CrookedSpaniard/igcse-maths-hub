// Finding an angle: work out the ratio of two sides, then use the inverse function on the calculator.
FD.add({
  id: 'trigangles',
  title: 'Finding angles with inverse trig',
  tab: 'Trig: angles',
  icon: 'geometry',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Inverse trig', '\\(\\sin^{-1}\\), \\(\\cos^{-1}\\) and \\(\\tan^{-1}\\) turn a ratio back into an angle (SHIFT + sin on most calculators).'],
  ],
  mount(el) {
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A right-angled triangle with two known sides and an unknown angle',
      ctrls: `<label class="ctrl">Opposite (cm) <input type="range" id="o" min="1" max="10" step="0.5" value="5"><output id="oo">5</output></label>
        <label class="ctrl">Adjacent (cm) <input type="range" id="d" min="1" max="12" step="0.5" value="8"><output id="od">8</output></label>`,
    });
    a.tri = (op, ad, lb, hl) => { const h = Math.hypot(op, ad), th = Math.atan2(op, ad) * 180 / Math.PI; FD.trigTri(a, { th, hyp: h, k: Math.min(18, 190 / h), thLabel: lb.th, labels: lb, hl }); };
    a.onSync(() => {
      const op = a.val('o'), ad = a.val('d'), th = Math.atan(op / ad) * 180 / Math.PI;
      a.out('o', op); a.out('d', ad);
      a.tri(op, ad, { th: FD.num(FD.round(th, 1)) + '°', opp: op + ' cm', adj: ad + ' cm', hyp: '' }, ['opp', 'adj']);
      a.big(`\\theta = \\tan^{-1}\\left(\\frac{${op}}{${ad}}\\right) = ${FD.num(FD.round(th, 1))}^\\circ`);
    });
    a.tri(5, 8, { th: 'θ', opp: '5 cm', adj: '8 cm', hyp: '' }, ['opp', 'adj']);
    return a;
  },
  steps: [
    {
      title: 'Two sides known, angle unknown',
      text: '<p>The opposite side is 5 cm and the adjacent side is 8 cm. Opposite and adjacent: use <b>tan</b>.</p>',
      async on(a, ctx) { a.off(); a.tri(5, 8, { th: 'θ', opp: '5 cm', adj: '8 cm', hyp: '' }, ['opp', 'adj']); await a.play(ctx, [['\\tan\\theta = \\frac{5}{8} = 0.625', 'TOA'], ['\\theta = \\tan^{-1}(0.625) = 32.0^\\circ', '1 d.p.']]); },
    },
    {
      title: 'Using sin⁻¹ and cos⁻¹',
      text: '<p>Hypotenuse 9 cm and adjacent 4 cm: use <b>cos</b>.</p>',
      tip: 'Keep the full calculator value until the end, then round.',
      async on(a, ctx) { a.off(); a.tri(Math.sqrt(65), 4, { th: 'θ', opp: '', adj: '4 cm', hyp: '9 cm' }, ['adj', 'hyp']); await a.play(ctx, [['\\cos\\theta = \\frac{4}{9}', 'CAH'], ['\\theta = \\cos^{-1}\\left(\\frac{4}{9}\\right) = 63.6^\\circ', '1 d.p.']]); },
    },
    {
      title: 'A problem in context',
      text: '<p>A ramp rises 1.2 m over a horizontal distance of 6 m. Find the angle the ramp makes with the ground.</p>',
      async on(a, ctx) { a.off(); a.tri(1.2, 6, { th: 'θ', opp: '1.2 m', adj: '6 m', hyp: '' }, ['opp', 'adj']); await a.play(ctx, [['\\tan\\theta = \\frac{1.2}{6} = 0.2', ''], ['\\theta = \\tan^{-1}(0.2) = 11.3^\\circ', '']]); },
    },
    {
      title: 'Try it: change the sides',
      text: '<p>Change the opposite and adjacent sides. The angle is found with \\(\\tan^{-1}\\).</p>',
      tip: 'When opposite = adjacent, the angle is exactly 45°.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'trigangles',
  gens: [
    () => { const [f, n1, n2] = FD.pick([['tan', 'opposite', 'adjacent'], ['sin', 'opposite', 'hypotenuse'], ['cos', 'adjacent', 'hypotenuse']]); let p, q; do { p = FD.rnd(2, 15); q = FD.rnd(2, 15); } while (f !== 'tan' && p >= q); const th = (Math[f === 'tan' ? 'atan' : f === 'sin' ? 'asin' : 'acos'](p / q) * 180) / Math.PI; return { type: 'num', q: `In a right-angled triangle, the ${n1} side to angle \\(\\theta\\) is \\(${p}\\) cm and the ${n2} is \\(${q}\\) cm. Work out \\(\\theta\\) to 1 decimal place.`, a: FD.round(th, 1), tol: 0.05, unit: '°', why: `\\(\\${f}\\theta = \\frac{${p}}{${q}}\\), so \\(\\theta = \\${f}^{-1}\\left(\\frac{${p}}{${q}}\\right) = ${FD.tn(FD.round(th, 1))}^\\circ\\).` }; },
    () => { const h = FD.rnd(20, 90) / 10, d = FD.rnd(30, 150) / 10, th = (Math.atan(h / d) * 180) / Math.PI; return { type: 'num', q: `A ramp rises \\(${FD.tn(h)}\\) m over a horizontal distance of \\(${FD.tn(d)}\\) m. Work out the angle between the ramp and the horizontal, to 1 d.p.`, a: FD.round(th, 1), tol: 0.05, unit: '°', why: `\\(\\tan\\theta = \\frac{${FD.tn(h)}}{${FD.tn(d)}}\\), \\(\\theta = ${FD.tn(FD.round(th, 1))}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'trigangles',
  items: [
    { type: 'num', q: 'Opposite 7 cm, hypotenuse 14 cm. Find the angle.', a: 30, unit: '°', why: '\\(\\sin^{-1}(0.5) = 30^\\circ\\).' },
    { type: 'num', q: 'Opposite 6 cm, adjacent 6 cm. Find the angle.', a: 45, unit: '°', why: '\\(\\tan^{-1}(1) = 45^\\circ\\).' },
    { type: 'num', q: 'Adjacent 5 cm, hypotenuse 13 cm. Find the angle to 1 d.p.', a: 67.4, tol: 0.05, unit: '°', why: '\\(\\cos^{-1}(5/13) = 67.38…^\\circ\\).' },
    { type: 'mcq', q: 'Which key finds an angle from its sine?', opts: ['\\(\\sin^{-1}\\)', '\\(\\sin\\)', '\\(1 \\div \\sin\\)', '\\(\\sin^2\\)'], why: 'The inverse function \\(\\sin^{-1}\\).' },
  ],
});
