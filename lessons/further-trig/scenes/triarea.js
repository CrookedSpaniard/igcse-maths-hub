// Area = ½ab sin C: the height of the triangle is b sin C.
FD.add({
  id: 'triarea',
  title: 'Area of a triangle: ½ab sin C',
  tab: '½ab sin C',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Area of a triangle', '\\(\\text{Area} = \\tfrac12 ab\\sin C\\): two sides and the angle between them.'],
  ],
  mount(el) {
    const G = FD.G, C0 = [70, 240], K = 25;
    const a = FD.stage(el, {
      vb: '0 0 420 280', label: 'A triangle with two sides and the angle between them',
      ctrls: `<label class="ctrl">\\(a\\) (cm) <input type="range" id="a" min="4" max="12" step="0.5" value="10"><output id="oa">10</output></label>
        <label class="ctrl">\\(b\\) (cm) <input type="range" id="b" min="3" max="9" step="0.5" value="7"><output id="ob">7</output></label>
        <label class="ctrl">\\(C\\) <input type="range" id="c" min="15" max="165" value="40"><output id="oc">40°</output></label>`,
    });
    // C at the left; side a along the base to B, side b up to A at angle C. h: show the height.
    a.tri = (sa, sb, ang, h = true, lb = {}) => {
      const k = Math.min(K, 300 / (sa + Math.max(0, -sb * Math.cos((ang * Math.PI) / 180))), 190 / (sb * Math.sin((ang * Math.PI) / 180) || 1));
      const x0 = C0[0] + Math.max(0, -sb * Math.cos((ang * Math.PI) / 180)) * k, C = [x0, C0[1]], B = [x0 + sa * k, C0[1]], A = G.polar(C, sb * k, ang), F = [A[0], C0[1]];
      let s = '';
      if (h) s += G.line([Math.min(C[0], F[0]), C0[1]], [Math.max(C[0], F[0]), C0[1]], 'g-dash') + G.line(A, F, 'g-hl2') + G.right(F, A, [F[0] + (F[0] >= C[0] ? 1 : -1), F[1]], 10) + G.t([F[0] + 8, (A[1] + F[1]) / 2], lb.h || 'h', 'l2 st');
      FD.TRI(a, [A, B, C], { sides: { a: lb.a || `a = ${sa}`, b: lb.b || `b = ${sb}`, c: '' }, angs: { C: lb.C || ang + '°' }, hlAng: 'C', extra: s });
    };
    a.onSync(() => {
      const sa = a.val('a'), sb = a.val('b'), c = a.val('c');
      a.out('a', sa); a.out('b', sb); a.out('c', c + '°');
      a.tri(sa, sb, c);
      a.big(`\\tfrac12 \\times ${sa} \\times ${sb} \\times \\sin ${c}^\\circ = ${FD.num(FD.round(0.5 * sa * sb * Math.sin((c * Math.PI) / 180), 2))}\\ \\text{cm}^2`);
    });
    a.tri(10, 7, 40, false, { a: 'a', b: 'b', C: 'C' });
    return a;
  },
  steps: [
    {
      title: 'Half base times height',
      text: '<p>Area of a triangle \\(= \\tfrac12 \\times \\text{base} \\times \\text{height}\\). Take side \\(a\\) as the base.</p><p>The height \\(h\\) is opposite angle \\(C\\) in a right-angled triangle with hypotenuse \\(b\\), so \\(h = b\\sin C\\).</p>',
      async on(a, ctx) { a.off(); a.tri(10, 7, 40, false, { a: 'a', b: 'b', C: 'C' }); if (!(await ctx.sleep(1000))) return; a.tri(10, 7, 40, true, { a: 'a', b: 'b', C: 'C' }); a.big('h = b \\sin C'); },
    },
    {
      title: 'The formula',
      text: '<p class="mbig">\\(\\text{Area} = \\tfrac12 ab\\sin C\\)</p><p>Use any two sides and the angle <b>between</b> them.</p>',
      async on(a, ctx) { a.off(); a.tri(10, 7, 40, true, { a: '10 cm', b: '7 cm' }); await a.play(ctx, [['\\text{Area} = \\tfrac12 \\times 10 \\times 7 \\times \\sin 40^\\circ', ''], ['= 22.5\\ \\text{cm}^2', '3 s.f.']]); },
    },
    {
      title: 'It works for obtuse angles too',
      text: '<p>If \\(C\\) is obtuse the height falls outside the triangle, but \\(\\sin C\\) is still positive and the formula still works.</p>',
      tip: 'Working backwards: if the area is known you can find an angle with sin⁻¹ (remember the obtuse answer too).',
      async on(a, ctx) { a.off(); a.tri(8, 6, 130, true, { a: '8 cm', b: '6 cm' }); await a.play(ctx, [['\\tfrac12 \\times 8 \\times 6 \\times \\sin 130^\\circ = 18.4\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Try it: change the triangle',
      text: '<p>Change the two sides and the angle between them. When is the area largest?</p>',
      tip: 'sin C is biggest at 90°.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'triarea',
  gens: [
    () => { const x = FD.rnd(3, 15), y = FD.rnd(3, 15), C = FD.rnd(20, 160), A = 0.5 * x * y * Math.sin((C * Math.PI) / 180); return { type: 'num', q: `Two sides of a triangle are \\(${x}\\) cm and \\(${y}\\) cm, and the angle between them is \\(${C}^\\circ\\). Work out the area to 3 s.f.`, a: FD.sigfig(A, 3), tol: A >= 10 ? 0.05 : 0.005, unit: 'cm²', why: `\\(\\tfrac12 \\times ${x} \\times ${y} \\times \\sin ${C}^\\circ = ${FD.tn(FD.sigfig(A, 3))}\\ \\text{cm}^2\\).` }; },
    () => { const x = FD.rnd(5, 14), y = FD.rnd(5, 14), C = FD.rnd(20, 80), A = FD.round(0.5 * x * y * Math.sin((C * Math.PI) / 180), 1), c = (Math.asin(A / (0.5 * x * y)) * 180) / Math.PI; return { type: 'num', q: `A triangle has sides \\(${x}\\) cm and \\(${y}\\) cm with an <b>acute</b> angle \\(\\theta\\) between them. Its area is \\(${FD.tn(A)}\\ \\text{cm}^2\\). Find \\(\\theta\\) to the nearest degree.`, a: Math.round(c), tol: 0.5, unit: '°', why: `\\(\\sin\\theta = \\frac{${FD.tn(A)}}{\\tfrac12 \\times ${x} \\times ${y}} = ${FD.tn(FD.round(A / (0.5 * x * y), 4))}\\), \\(\\theta = ${Math.round(c)}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'triarea',
  items: [
    { type: 'num', q: 'Sides 6 cm and 10 cm with \\(30^\\circ\\) between them. Find the area.', a: 15, unit: 'cm²', why: '\\(\\tfrac12 \\times 6 \\times 10 \\times 0.5 = 15\\).' },
    { type: 'num', q: 'Sides 8 cm and 8 cm with \\(150^\\circ\\) between them. Find the area.', a: 16, unit: 'cm²', why: '\\(\\tfrac12 \\times 64 \\times \\sin 150^\\circ = 32 \\times 0.5\\).' },
    { type: 'mcq', q: 'In \\(\\tfrac12 ab\\sin C\\), the angle \\(C\\) must be…', opts: ['between sides \\(a\\) and \\(b\\)', 'opposite side \\(a\\)', 'a right angle', 'the largest angle'], why: 'The included angle.' },
    { type: 'tf', q: 'An equilateral triangle with side 4 cm has area \\(\\tfrac12 \\times 4 \\times 4 \\times \\sin 60^\\circ\\).', a: true, why: 'All angles are 60°: \\(6.93\\ \\text{cm}^2\\).' },
  ],
});
