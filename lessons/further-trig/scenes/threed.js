// Three dimensions: a cuboid, its space diagonal, and the angle between that diagonal and the base.
FD.add({
  id: 'threed',
  title: 'Problems in three dimensions',
  tab: '3D',
  icon: 'shapes',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Space diagonal', 'A line through the inside of a solid from one corner to the opposite corner.'],
    ['Angle between a line and a plane', 'The angle between the line and its projection (its “shadow”) on the plane.'],
    ['Pythagoras in 3D', 'For a cuboid \\(l \\times w \\times h\\), the space diagonal is \\(\\sqrt{l^2 + w^2 + h^2}\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A cuboid with a space diagonal',
      ctrls: `<label class="ctrl">Length (cm) <input type="range" id="l" min="3" max="12" value="8"><output id="ol">8</output></label>
        <label class="ctrl">Width (cm) <input type="range" id="w" min="2" max="10" value="6"><output id="ow">6</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="h" min="2" max="10" value="5"><output id="oh">5</output></label>`,
    });
    // st: 0 cuboid, 1 base diagonal AC, 2 space diagonal AG, 3 angle
    a.box = (l, w, h, st = 3) => {
      const k = Math.min(240 / (l + 0.6 * w), 230 / (h + 0.4 * w)), dx = 0.6 * k, dy = 0.4 * k;
      const P = (x, y, z) => [40 + x * k + y * dx, 270 - z * k - y * dy];
      const A = P(0, 0, 0), B = P(l, 0, 0), C = P(l, w, 0), D = P(0, w, 0), E = P(0, 0, h), F = P(l, 0, h), Gg = P(l, w, h), H = P(0, w, h);
      let s = G.poly([A, B, C, D], 'g-fill2') + G.line(D, H, 'g-dash') + G.line(A, D, 'g-dash') + G.line(D, C, 'g-dash');
      if (st >= 1) s += G.line(A, C, 'g-hl2');
      if (st >= 2) s += G.line(A, Gg, 'g-hl') + G.line(C, Gg, 'g-thin') + G.right(C, A, Gg, 9);
      if (st >= 3) s += G.arc(A, C, Gg, 34, 'θ', 'g-arc', 50);
      s += G.path([A, B, F, E, A], 'g-ln') + G.path([B, C, Gg, F], 'g-ln') + G.line(E, H) + G.line(H, Gg);
      s += [['A', A, -12, 12], ['B', B, 10, 12], ['C', C, 12, 4], ['D', D, -12, -6], ['E', E, -12, -6], ['F', F, 0, -12], ['G', Gg, 10, -10], ['H', H, -10, -10]].map(([n, p, ox, oy]) => G.t([p[0] + ox, p[1] + oy], n, 's')).join('');
      a.draw(s);
      const ac = Math.hypot(l, w), ag = Math.hypot(l, w, h);
      return { ac, ag, th: (Math.atan(h / ac) * 180) / Math.PI };
    };
    a.onSync(() => {
      const l = a.val('l'), w = a.val('w'), h = a.val('h'), r = a.box(l, w, h);
      a.out('l', l); a.out('w', w); a.out('h', h);
      a.big(`AG = \\sqrt{${l}^2 + ${w}^2 + ${h}^2} = ${FD.num(FD.round(r.ag, 2))}`);
      a.msg(`\\(AC = ${FD.tn(FD.round(r.ac, 2))}\\) cm, \\(\\theta = \\tan^{-1}\\left(\\frac{${h}}{AC}\\right) = ${FD.tn(FD.round(r.th, 1))}^\\circ\\)`);
    });
    a.box(8, 6, 5, 0);
    return a;
  },
  steps: [
    {
      title: 'Find a right-angled triangle',
      text: '<p>A cuboid is \\(8\\) cm by \\(6\\) cm by \\(5\\) cm. How long is the <b>space diagonal</b> \\(AG\\)?</p><p>First use the <b>base</b>: \\(AC\\) is the hypotenuse of a right-angled triangle on the floor.</p>',
      async on(a, ctx) { a.off(); a.box(8, 6, 5, 0); if (!(await ctx.sleep(800))) return; a.box(8, 6, 5, 1); await a.play(ctx, [['AC^2 = 8^2 + 6^2 = 100', 'base triangle ABC'], ['AC = 10\\ \\text{cm}', '']]); },
    },
    {
      title: 'Then go up',
      text: '<p>Triangle \\(ACG\\) stands upright: it has a right angle at \\(C\\).</p><p>So \\(AG^2 = AC^2 + CG^2\\), which is the same as \\(8^2 + 6^2 + 5^2\\).</p>',
      tip: 'Pythagoras in 3D: d² = l² + w² + h².',
      async on(a, ctx) { a.off(); a.box(8, 6, 5, 2); await a.play(ctx, [['AG^2 = 10^2 + 5^2 = 125', 'triangle ACG'], ['AG = \\sqrt{125} = 11.2\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'The angle between a line and a plane',
      text: '<p>The angle between \\(AG\\) and the base is the angle between \\(AG\\) and its <b>shadow</b> on the base, \\(AC\\).</p><p>Use triangle \\(ACG\\): opposite \\(CG = 5\\), adjacent \\(AC = 10\\).</p>',
      async on(a, ctx) { a.off(); a.box(8, 6, 5, 3); await a.play(ctx, [['\\tan\\theta = \\frac{5}{10}', ''], ['\\theta = \\tan^{-1}(0.5) = 26.6^\\circ', '1 d.p.']]); },
    },
    {
      title: 'Try it: change the cuboid',
      text: '<p>Change the length, width and height. Watch the space diagonal and its angle with the base.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'threed',
  gens: [
    () => { const l = FD.rnd(2, 15), w = FD.rnd(2, 15), h = FD.rnd(2, 15), d = Math.hypot(l, w, h); return { type: 'num', q: `A cuboid measures \\(${l}\\) cm by \\(${w}\\) cm by \\(${h}\\) cm. Work out the length of a space diagonal, to 3 s.f.`, a: FD.sigfig(d, 3), tol: d >= 10 ? 0.05 : 0.005, unit: 'cm', why: `\\(\\sqrt{${l}^2 + ${w}^2 + ${h}^2} = \\sqrt{${l * l + w * w + h * h}} = ${FD.tn(FD.sigfig(d, 3))}\\) cm.` }; },
    () => { const l = FD.rnd(3, 15), w = FD.rnd(3, 15), h = FD.rnd(2, 12), ac = Math.hypot(l, w), t = (Math.atan(h / ac) * 180) / Math.PI; return { type: 'num', q: `A cuboid has a base \\(${l}\\) cm by \\(${w}\\) cm and height \\(${h}\\) cm. Work out the angle between a space diagonal and the base, to 1 d.p.`, a: FD.round(t, 1), tol: 0.05, unit: '°', why: `Base diagonal \\(= \\sqrt{${l}^2 + ${w}^2} = ${FD.tn(FD.round(ac, 3))}\\). \\(\\tan\\theta = \\frac{${h}}{${FD.tn(FD.round(ac, 3))}}\\), \\(\\theta = ${FD.tn(FD.round(t, 1))}^\\circ\\).` }; },
    () => { const s = FD.rnd(4, 12), h = FD.rnd(5, 15), half = (s * Math.SQRT2) / 2, t = (Math.atan(h / half) * 180) / Math.PI; return { type: 'num', q: `A square-based pyramid has base edge \\(${s}\\) cm and its top is \\(${h}\\) cm vertically above the centre of the base. Work out the angle between a sloping edge and the base, to 1 d.p.`, a: FD.round(t, 1), tol: 0.05, unit: '°', why: `Half the base diagonal \\(= \\frac{\\sqrt{${s}^2 + ${s}^2}}{2} = ${FD.tn(FD.round(half, 3))}\\). \\(\\tan\\theta = \\frac{${h}}{${FD.tn(FD.round(half, 3))}}\\), \\(\\theta = ${FD.tn(FD.round(t, 1))}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'threed',
  items: [
    { type: 'num', q: 'A cuboid is 3 cm by 4 cm by 12 cm. Find a space diagonal.', a: 13, unit: 'cm', why: '\\(\\sqrt{9 + 16 + 144} = 13\\).' },
    { type: 'num', q: 'A cube has edges of 10 cm. Find the angle between a space diagonal and the base, to 1 d.p.', a: 35.3, tol: 0.05, unit: '°', why: 'Base diagonal \\(\\sqrt{200}\\); \\(\\tan^{-1}(10/\\sqrt{200}) = 35.26…^\\circ\\).' },
    { type: 'mcq', q: 'The angle between line \\(AG\\) and the base plane is measured between \\(AG\\) and…', opts: ['its projection on the plane', 'any line in the plane', 'a vertical line', 'the edge \\(AB\\) always'], why: 'Use the line’s shadow (projection) on the plane.' },
  ],
});
