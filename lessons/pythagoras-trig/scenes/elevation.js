// Angles of elevation and depression: measured up or down from the horizontal.
FD.add({
  id: 'elevation',
  title: 'Angles of elevation and depression',
  tab: 'Elevation',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Angle of elevation', 'The angle you look UP through, measured from the horizontal.'],
    ['Angle of depression', 'The angle you look DOWN through, measured from the horizontal.'],
  ],
  mount(el) {
    const G = FD.G, GY = 260, PX = 60;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'An observer looking up at the top of a tower',
      ctrls: `<label class="ctrl">Distance to the tower (m) <input type="range" id="d" min="10" max="80" step="5" value="40"><output id="od">40</output></label>
        <label class="ctrl">Angle of elevation <input type="range" id="t" min="10" max="70" value="35"><output id="ot">35°</output></label>`,
    });
    // d metres from the tower, angle t; dep: also show the angle of depression from the top
    a.scene = (d, t, dep = false, lb = {}) => {
      const k = Math.min(280 / d, 220 / (d * Math.tan((t * Math.PI) / 180))), TX = PX + d * k, h = d * Math.tan((t * Math.PI) / 180), Top = [TX, GY - h * k], Eye = [PX, GY];
      let s = G.line([20, GY], [400, GY], 'g-ln') + `<rect class="g-fill2" x="${TX}" y="${Top[1]}" width="22" height="${h * k}"/>` + G.line(Eye, Top, 'g-hl') + G.arc(Eye, [TX, GY], Top, 40, lb.t || t + '°', 'g-arc', 62);
      s += G.dot(Eye, 'g-dot k', 5) + G.t([(PX + TX) / 2, GY + 18], lb.d || d + ' m', 's') + G.t([TX + 28, (GY + Top[1]) / 2], lb.h || 'h', 'l2 st');
      if (dep) s += G.line(Top, [Top[0] - 150, Top[1]], 'g-dash') + G.arc(Top, [Top[0] - 150, Top[1]], Eye, 40, lb.dep || t + '°', 'g-arc3', 62);
      a.draw(s);
      return h;
    };
    a.onSync(() => {
      const d = a.val('d'), t = a.val('t');
      a.out('d', d); a.out('t', t + '°');
      const h = a.scene(d, t, true);
      a.big(`h = ${d} \\tan ${t}^\\circ = ${FD.num(FD.round(h, 1))}\\ \\text{m}`);
      a.msg('The angle of depression from the top equals the angle of elevation from the ground (alternate angles).');
    });
    a.scene(40, 35);
    return a;
  },
  steps: [
    {
      title: 'Looking up: elevation',
      text: '<p>You stand on level ground and look up at the top of a tower. The <b>angle of elevation</b> is measured <b>up from the horizontal</b>.</p>',
      async on(a, ctx) { a.off(); for (let t = 5; t <= 35; t += 1) { a.scene(40, t); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Worked example: elevation',
      text: '<p>You are 30 m from a building. The angle of elevation of the top is \\(52^\\circ\\). How tall is the building?</p><p>You know the adjacent side and want the opposite side: <b>tan</b>.</p>',
      async on(a, ctx) { a.off(); a.scene(30, 52, false, { d: '30 m' }); await a.play(ctx, [['\\tan 52^\\circ = \\frac{h}{30}', 'TOA'], ['h = 30 \\tan 52^\\circ = 38.4\\ \\text{m}', '3 s.f.']]); },
    },
    {
      title: 'Looking down: depression',
      text: '<p>From the top, look down at the point where you were standing. The <b>angle of depression</b> is measured <b>down from the horizontal</b>.</p><p>The horizontal at the top is parallel to the ground, so the angles of depression and elevation are <b>alternate angles</b>: they are equal.</p>',
      tip: 'Never measure an angle of depression from the vertical wall.',
      on(a) { a.off(); a.scene(40, 35, true); },
    },
    {
      title: 'Worked example: depression',
      text: '<p>From the top of a 45 m cliff, the angle of depression of a boat is \\(18^\\circ\\). How far is the boat from the foot of the cliff?</p>',
      async on(a, ctx) { a.off(); a.scene(138.5, 18, true, { d: 'd', h: '45 m', t: '18°', dep: '18°' }); await a.play(ctx, [['\\tan 18^\\circ = \\frac{45}{d}', 'the angle at the boat is also 18°'], ['d = \\frac{45}{\\tan 18^\\circ} = 138\\ \\text{m}', '3 s.f.']]); },
    },
    {
      title: 'Try it: change the distance and angle',
      text: '<p>Move further away or change the angle of elevation. Watch the height of the tower and the equal angle of depression.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'elevation',
  gens: [
    () => { const d = FD.rnd(10, 80), t = FD.rnd(15, 65), h = d * Math.tan((t * Math.PI) / 180); return { type: 'num', q: `A point on level ground is \\(${d}\\) m from the foot of a tower. The angle of elevation of the top is \\(${t}^\\circ\\). Work out the height of the tower, to 3 s.f.`, a: FD.sigfig(h, 3), tol: h >= 100 ? 0.5 : h >= 10 ? 0.05 : 0.005, unit: 'm', why: `\\(h = ${d} \\tan ${t}^\\circ = ${FD.tn(FD.sigfig(h, 3))}\\) m.` }; },
    () => { const h = FD.rnd(20, 120), t = FD.rnd(10, 50), d = h / Math.tan((t * Math.PI) / 180); return { type: 'num', q: `From the top of a \\(${h}\\) m cliff, the angle of depression of a boat is \\(${t}^\\circ\\). How far is the boat from the foot of the cliff? Give 3 s.f.`, a: FD.sigfig(d, 3), tol: d >= 100 ? 0.5 : 0.05, unit: 'm', why: `The angle of elevation from the boat is also \\(${t}^\\circ\\) (alternate angles). \\(d = \\frac{${h}}{\\tan ${t}^\\circ} = ${FD.tn(FD.sigfig(d, 3))}\\) m.` }; },
    () => { const h = FD.rnd(10, 60), d = FD.rnd(20, 100), t = (Math.atan(h / d) * 180) / Math.PI; return { type: 'num', q: `A tree \\(${h}\\) m tall is \\(${d}\\) m away on level ground. Work out the angle of elevation of the top of the tree, to 1 d.p.`, a: FD.round(t, 1), tol: 0.05, unit: '°', why: `\\(\\tan\\theta = \\frac{${h}}{${d}}\\), \\(\\theta = ${FD.tn(FD.round(t, 1))}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'elevation',
  items: [
    { type: 'mcq', q: 'An angle of depression is measured…', opts: ['down from the horizontal', 'down from the vertical', 'up from the horizontal', 'from north'], why: 'Both elevation and depression are measured from the horizontal.' },
    { type: 'tf', q: 'The angle of depression from A to B equals the angle of elevation from B to A.', a: true, why: 'They are alternate angles between parallel horizontals.' },
    { type: 'num', q: 'You stand 50 m from a tower; the angle of elevation of the top is \\(45^\\circ\\). How tall is the tower?', a: 50, unit: 'm', why: '\\(50 \\tan 45^\\circ = 50\\).' },
    { type: 'num', q: 'From a 30 m cliff the angle of depression of a buoy is \\(30^\\circ\\). How far is the buoy from the foot of the cliff, to 3 s.f.?', a: 52.0, tol: 0.05, unit: 'm', why: '\\(30 \\div \\tan 30^\\circ = 51.96…\\)' },
  ],
});
