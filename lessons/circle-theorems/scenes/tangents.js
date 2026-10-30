// Chord and tangent properties: tangent ⟂ radius, two equal tangents from a point, the perpendicular from the centre bisects a chord.
FD.add({
  id: 'tangents',
  title: 'Chord and tangent properties',
  tab: 'Chords & tangents',
  icon: 'geometry',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Perpendicular', 'At right angles (90°).'],
    ['Tangent–radius property', 'A tangent is perpendicular to the radius at the point where it touches the circle.'],
    ['Equal tangents', 'The two tangents from a point outside a circle are the same length.'],
  ],
  mount(el) {
    const G = FD.G, { C, R, P } = FD.CT;
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'A circle with tangents and a chord',
      ctrls: `<div class="row"><label>Property <select id="md"><option value="tan">Tangent and radius</option><option value="two">Two tangents from a point</option><option value="chord">Perpendicular to a chord</option></select></label></div><p class="small">Drag the blue point.</p>`,
    });
    let th = 60, E = [370, 110], ch = [200, 320], live = false;
    const unit = (u) => { const d = Math.hypot(u[0], u[1]); return [u[0] / d, u[1] / d]; };
    a.tan = (t = th, lbl = '') => {
      th = t; const T = P(t), u = unit([T[0] - C[0], T[1] - C[1]]), v = [-u[1], u[0]];
      let s = G.circ(C, R) + G.line(C, T, 'g-hl2') + G.line([T[0] - v[0] * 120, T[1] - v[1] * 120], [T[0] + v[0] * 120, T[1] + v[1] * 120], 'g-hl') + G.right(T, C, [T[0] + v[0], T[1] + v[1]], 14) + G.dot(C, 'g-dot k', 4) + G.t([C[0] - 14, C[1] + 4], 'O');
      s += live ? G.handle(T, 'T') : G.dot(T, 'g-dot', 5);
      a.draw(s + lbl);
    };
    // Tangent points from E.
    const touch = () => { const d = G.dist(C, E), al = Math.acos(R / d) * 180 / Math.PI, base = Math.atan2(C[1] - E[1], E[0] - C[0]) * 180 / Math.PI; return [P(base + al), P(base - al)]; };
    a.two = (e = E, extra = '') => {
      E = e; const [T1, T2] = touch();
      let s = G.circ(C, R) + G.poly([C, T1, E, T2], 'g-fill') + G.line(E, T1, 'g-hl') + G.line(E, T2, 'g-hl') + G.ticks(E, T1) + G.ticks(E, T2) + G.right(T1, C, E, 12) + G.right(T2, C, E, 12) + G.line(C, E, 'g-dash');
      s += G.dot(C, 'g-dot k', 4) + G.t([C[0] - 14, C[1] + 4], 'O') + G.t([T1[0], T1[1] - 14], 'A') + G.t([T2[0], T2[1] + 16], 'B') + (live ? G.handle(E, 'E') : G.dot(E, 'g-dot k', 5)) + G.t([E[0] + 4, E[1] - 16], 'P');
      a.draw(s + extra);
      return [G.dist(E, T1), G.dist(E, T2)];
    };
    a.chord = (c = ch) => {
      ch = c; const A = P(c[0]), B = P(c[1]), M = G.mid(A, B);
      let s = G.circ(C, R) + G.line(A, B, 'g-hl') + G.line(C, M, 'g-hl2') + G.right(M, C, B, 12) + G.ticks(A, M) + G.ticks(M, B) + G.dot(C, 'g-dot k', 4) + G.t([C[0] - 14, C[1] - 6], 'O') + G.t([M[0] + 12, M[1] + 14], 'M');
      s += live ? G.handle(A, 'A') + G.handle(B, 'B') : G.dot(A, 'g-dot k', 4) + G.dot(B, 'g-dot k', 4);
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, x, y) => {
      const ang = Math.atan2(C[1] - y, x - C[0]) * 180 / Math.PI;
      if (n === 'T') th = ang;
      if (n === 'E') { const p = [FD.clamp(x, 20, 400), FD.clamp(y, 20, 280)]; if (G.dist(p, C) > R + 25) E = p; }
      if (n === 'A') ch = [ang, ch[1]];
      if (n === 'B') ch = [ch[0], ang];
      a.sync();
    });
    a.onSync(() => {
      const m = a.q('#md').value;
      if (m === 'tan') { a.tan(th); a.msg('The angle between the tangent and the radius is always \\(90^\\circ\\).'); }
      if (m === 'two') { const [l1, l2] = a.two(E); a.msg(`\\(PA = ${FD.round(l1 / 30, 1)}\\) cm and \\(PB = ${FD.round(l2 / 30, 1)}\\) cm: the two tangents are equal.`); }
      if (m === 'chord') { a.chord(ch); a.msg('The line from the centre perpendicular to the chord cuts the chord in half.'); }
    });
    a.live = (on) => { live = on; };
    a.tan(60);
    return a;
  },
  steps: [
    {
      title: 'Tangent meets radius at 90°',
      text: '<p>A tangent touches the circle at one point. The radius to that point is <b>perpendicular</b> to the tangent: they meet at \\(90^\\circ\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 60; t <= 150; t += 3) { a.tan(t); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Two tangents from a point',
      text: '<p>From a point \\(P\\) outside the circle you can draw <b>two</b> tangents, \\(PA\\) and \\(PB\\). They are the <b>same length</b>.</p><p>\\(OAPB\\) is a kite, with right angles at \\(A\\) and \\(B\\).</p>',
      on(a) { a.off(); a.live(false); a.two([370, 110]); },
    },
    {
      title: 'Worked example',
      text: '<p>\\(PA\\) and \\(PB\\) are tangents. \\(\\angle APB = 70^\\circ\\). Find \\(\\angle AOB\\).</p>',
      tip: 'Exam reason: “the tangent to a circle is perpendicular to the radius”.',
      async on(a, ctx) {
        a.off(); a.live(false); a.two([200 + 105 / Math.sin(35 * Math.PI / 180), 150]);
        await a.play(ctx, [['\\angle OAP = \\angle OBP = 90^\\circ', 'tangent ⟂ radius'], ['\\angle AOB = 360 - 90 - 90 - 70', 'angles in a quadrilateral'], ['\\angle AOB = 110^\\circ', '']]);
      },
    },
    {
      title: 'The perpendicular from the centre to a chord',
      text: '<p>A line from the centre that is <b>perpendicular to a chord</b> cuts the chord <b>in half</b>.</p><p>So the perpendicular bisector of any chord passes through the centre.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 60; t += 3) { a.chord([200 - t, 320 + t / 2]); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Try it: drag the points',
      text: '<p>Choose a property and drag the blue points. Check that the right angles and equal lengths always stay.</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'tangents',
  gens: [
    () => { const p = FD.rnd(20, 140); return { type: 'num', q: `\\(PA\\) and \\(PB\\) are tangents to a circle with centre \\(O\\). \\(\\angle APB = ${p}^\\circ\\). Work out \\(\\angle AOB\\).`, a: 180 - p, unit: '°', why: `\\(\\angle OAP = \\angle OBP = 90^\\circ\\) (tangent ⟂ radius). In quadrilateral \\(OAPB\\): \\(360 - 90 - 90 - ${p} = ${180 - p}^\\circ\\).` }; },
    () => { const t = FD.rnd(20, 70); return { type: 'num', q: `\\(PT\\) is a tangent to a circle with centre \\(O\\), touching it at \\(T\\). \\(\\angle TOP = ${t}^\\circ\\). Work out \\(\\angle OPT\\).`, a: 90 - t, unit: '°', why: `\\(\\angle OTP = 90^\\circ\\) (tangent ⟂ radius). \\(\\angle OPT = 180 - 90 - ${t} = ${90 - t}^\\circ\\).` }; },
    () => { const L = FD.rnd(3, 20) * 2; return { type: 'num', q: `A chord \\(AB\\) is \\(${L}\\) cm long. \\(M\\) is the foot of the perpendicular from the centre to \\(AB\\). How long is \\(AM\\)?`, a: L / 2, unit: 'cm', why: `The perpendicular from the centre bisects the chord: \\(${L} \\div 2 = ${L / 2}\\) cm.` }; },
    () => { const L = FD.rnd(4, 18); return { type: 'num', q: `Two tangents are drawn from \\(P\\) to a circle, touching it at \\(A\\) and \\(B\\). \\(PA = ${L}\\) cm. How long is \\(PB\\)?`, a: L, unit: 'cm', why: 'Tangents from the same point are equal in length.' }; },
  ],
});

FD.check({
  section: 'tangents',
  items: [
    { type: 'mcq', q: 'The angle between a tangent and the radius at the point of contact is…', opts: ['\\(90^\\circ\\)', '\\(180^\\circ\\)', '\\(45^\\circ\\)', '\\(60^\\circ\\)'], why: 'Tangent ⟂ radius.' },
    { type: 'num', q: '\\(PA\\), \\(PB\\) are tangents from \\(P\\) and \\(O\\) is the centre. \\(\\angle AOB = 112^\\circ\\). Find \\(\\angle APB\\).', a: 68, unit: '°', why: '\\(360 - 90 - 90 - 112 = 68^\\circ\\).' },
    { type: 'tf', q: 'The perpendicular from the centre of a circle to a chord bisects the chord.', a: true, why: 'It cuts the chord into two equal halves.' },
    { type: 'num', q: '\\(PT\\) is a tangent at \\(T\\); \\(O\\) is the centre; \\(\\angle OPT = 34^\\circ\\). Find \\(\\angle TOP\\).', a: 56, unit: '°', why: '\\(180 - 90 - 34 = 56^\\circ\\).' },
  ],
});
