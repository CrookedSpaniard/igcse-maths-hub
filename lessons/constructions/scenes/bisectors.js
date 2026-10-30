// Perpendicular bisector of a line segment, and the bisector of an angle, with compass arcs.
FD.add({
  id: 'bisectors',
  title: 'Perpendicular and angle bisectors',
  tab: 'Bisectors',
  icon: 'geometry',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Perpendicular bisector', 'The line that cuts a line segment in half at right angles. Every point on it is the same distance from both ends.'],
    ['Angle bisector', 'The line that cuts an angle into two equal angles.'],
    ['Straight edge', 'A ruler used only to draw straight lines, not to measure.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'A construction with compass arcs',
      ctrls: `<div class="row"><label>Construction <select id="md"><option value="perp">Perpendicular bisector</option><option value="ang">Angle bisector</option></select></label></div><p class="small">Drag the blue points.</p>`,
    });
    let A = [110, 160], B = [310, 160], V = [70, 250], th = 70, mode = 'perp', live = false, P = 0.25;
    const deg = (U, W) => Math.atan2(U[1] - W[1], W[0] - U[0]) * 180 / Math.PI;
    // Perpendicular bisector: k = how far through (0..4): arcs from A, arcs from B, line, check point.
    a.perp = (k = 4) => {
      const d = G.dist(A, B), r = d * 0.68, M = G.mid(A, B), h = Math.sqrt(r * r - (d / 2) ** 2), u = [(B[0] - A[0]) / d, (B[1] - A[1]) / d], n = [-u[1], u[0]];
      const X1 = [M[0] + n[0] * h, M[1] + n[1] * h], X2 = [M[0] - n[0] * h, M[1] - n[1] * h];
      let s = G.line(A, B) + G.dot(A, 'g-dot k', 4) + G.dot(B, 'g-dot k', 4) + G.t([A[0] - 6 - 10 * u[0], A[1] + 18], 'A') + G.t([B[0] + 6 + 10 * u[0], B[1] + 18], 'B');
      const arcs = (C, X, f) => { const m1 = deg(C, X1), m2 = deg(C, X2); return `<path class="g-hl2" d="${FD.arcD(C, r, m1 - 14, m1 - 14 + 28 * f)}"/><path class="g-hl2" d="${FD.arcD(C, r, m2 - 14, m2 - 14 + 28 * f)}"/>`; };
      if (k > 0) s += arcs(A, null, Math.min(k, 1));
      if (k > 1) s += arcs(B, null, Math.min(k - 1, 1));
      if (k > 2) { s += G.line(G.lerp(X1, X2, -0.2), G.lerp(X1, X2, 1.2), 'g-hl') + G.right(M, B, X1, 12) + G.ticks(A, M) + G.ticks(M, B); }
      if (k > 3) { const Q = G.lerp(X1, X2, P); s += G.line(Q, A, 'g-dash') + G.line(Q, B, 'g-dash') + (live ? G.handle(Q, 'P') : G.dot(Q, 'g-dot', 6)) + G.t([Q[0] + 16, Q[1]], 'P', 'st'); }
      if (live) s += G.handle(A, 'A') + G.handle(B, 'B');
      a.draw(s);
      return [G.dist(G.lerp(X1, X2, P), A), G.dist(G.lerp(X1, X2, P), B)];
    };
    // Angle bisector at V between directions 0° and th: k = stages (arc on both arms, two arcs, line).
    a.ang = (k = 3) => {
      const r = 95, Pp = G.polar(V, r, 0), Q = G.polar(V, r, th), bis = th / 2, rr = r * 0.85;
      const t = r * Math.cos((bis * Math.PI) / 180) + Math.sqrt(rr * rr - (r * Math.sin((bis * Math.PI) / 180)) ** 2), R = G.polar(V, t, bis);
      let s = G.line(V, G.polar(V, 290, 0)) + G.line(V, G.polar(V, 230, th)) + G.dot(V, 'g-dot k', 4) + G.t([V[0] - 12, V[1] + 14], 'V');
      if (k > 0) s += `<path class="g-hl2" d="${FD.arcD(V, r, -8, -8 + (th + 16) * Math.min(k, 1))}"/>`;
      if (k > 1) { const f = Math.min(k - 1, 1), m1 = deg(Pp, R), m2 = deg(Q, R); s += `<path class="g-hl2" d="${FD.arcD(Pp, rr, m1 - 15, m1 - 15 + 30 * f)}"/><path class="g-hl2" d="${FD.arcD(Q, rr, m2 + 15, m2 + 15 - 30 * f)}"/>`; }
      if (k > 2) s += G.line(V, G.polar(V, 280, bis), 'g-hl') + G.arc(V, Pp, R, 46, '', 'g-arc') + G.arc(V, R, Q, 52, '', 'g-arc3');
      if (live) s += G.handle(G.polar(V, 200, th), 'T');
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, x, y) => {
      const p = [FD.clamp(x, 30, 390), FD.clamp(y, 30, 270)];
      if (n === 'A' && G.dist(p, B) > 90) A = p;
      if (n === 'B' && G.dist(p, A) > 90) B = p;
      if (n === 'T') th = FD.clamp(Math.round(deg(V, p)), 20, 100);
      if (n === 'P') { const d = G.dist(A, B), r = d * 0.68, M = G.mid(A, B), h = Math.sqrt(r * r - (d / 2) ** 2), u = [(B[0] - A[0]) / d, (B[1] - A[1]) / d], nn = [-u[1], u[0]]; const X1 = [M[0] + nn[0] * h, M[1] + nn[1] * h], X2 = [M[0] - nn[0] * h, M[1] - nn[1] * h], L = G.dist(X1, X2); P = FD.clamp(((p[0] - X1[0]) * (X2[0] - X1[0]) + (p[1] - X1[1]) * (X2[1] - X1[1])) / (L * L), -0.3, 1.3); }
      a.sync();
    });
    a.onSync(() => {
      mode = a.q('#md').value;
      if (mode === 'perp') { const [pa, pb] = a.perp(4); a.msg(`\\(PA = ${FD.round(pa / 30, 1)}\\) cm and \\(PB = ${FD.round(pb / 30, 1)}\\) cm: every point on the perpendicular bisector is the same distance from \\(A\\) and \\(B\\).`); }
      else { a.ang(3); a.msg(`The angle is \\(${th}^\\circ\\); each half is \\(${FD.round(th / 2, 1)}^\\circ\\).`); }
    });
    a.live = (on) => { live = on; };
    a.reset = () => { A = [110, 160]; B = [310, 160]; th = 70; P = 0.25; };
    a.perp(0);
    return a;
  },
  steps: [
    {
      title: 'Perpendicular bisector: arcs from A',
      text: '<p>Open the compasses to <b>more than half</b> of \\(AB\\). Put the point on \\(A\\) and draw an arc above and below the line.</p>',
      async on(a, ctx) { a.off(); a.live(false); a.reset(); for (let k = 0; k <= 1.0001; k += 0.05) { a.perp(k); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Arcs from B, then join',
      text: '<p><b>Keep the compasses the same</b>. Draw arcs from \\(B\\) that cross the first arcs.</p><p>Join the two crossing points with a straight edge. This line cuts \\(AB\\) in half at \\(90^\\circ\\).</p>',
      tip: 'Do not change the compasses between the arcs from A and the arcs from B.',
      async on(a, ctx) { a.off(); a.live(false); a.reset(); for (let k = 1; k <= 3.0001; k += 0.05) { a.perp(k); if (!(await ctx.sleep(35))) return; } },
    },
    {
      title: 'Equal distances',
      text: '<p>Every point \\(P\\) on the perpendicular bisector is the <b>same distance</b> from \\(A\\) and from \\(B\\).</p>',
      on(a) { a.off(); a.live(false); a.reset(); const [pa] = a.perp(4); a.msg(`\\(PA = PB = ${FD.round(pa / 30, 1)}\\) cm`); },
    },
    {
      title: 'Bisecting an angle',
      text: '<p><b>1.</b> With the point on the vertex \\(V\\), draw an arc that crosses both arms.</p><p><b>2.</b> From each crossing point draw an arc (same radius each time) so the two arcs cross.</p><p><b>3.</b> Join \\(V\\) to the crossing point.</p>',
      async on(a, ctx) { a.off(); a.live(false); a.reset(); for (let k = 0; k <= 3.0001; k += 0.05) { a.ang(k); if (!(await ctx.sleep(35))) return; } a.msg('Two equal angles of \\(35^\\circ\\).'); },
    },
    {
      title: 'Try it: drag the points',
      text: '<p>Choose a construction. Drag \\(A\\), \\(B\\) and \\(P\\) for the perpendicular bisector, or the end of the arm for the angle bisector.</p>',
      on(a) { a.live(true); a.reset(); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'bisectors',
  gens: [
    () => { const y = FD.rnd(-3, 6), x1 = FD.rnd(-4, 3), x2 = x1 + 2 * FD.rnd(2, 5); return { type: 'num', q: `\\(A\\) is \\((${x1}, ${y})\\) and \\(B\\) is \\((${x2}, ${y})\\). The perpendicular bisector of \\(AB\\) is the line \\(x = k\\). Find \\(k\\).`, a: (x1 + x2) / 2, why: `It goes through the midpoint of \\(AB\\): \\(x = \\frac{${x1} + ${x2}}{2} = ${(x1 + x2) / 2}\\), and is perpendicular to the horizontal line \\(AB\\).` }; },
    () => { const t = 2 * FD.rnd(15, 80); return { type: 'num', q: `An angle of \\(${t}^\\circ\\) is bisected. What size is each of the two new angles?`, a: t / 2, unit: '°', why: `Bisect means cut in half: \\(${t} \\div 2 = ${t / 2}^\\circ\\).` }; },
    () => FD.pick([
      { type: 'mcq', q: 'For a perpendicular bisector, the compasses must be opened to…', opts: ['more than half the length of the line', 'exactly half the length', 'less than half the length', 'any size'], why: 'Less than half and the arcs from A and B would not meet.' },
      { type: 'tf', q: 'The perpendicular bisector of \\(AB\\) crosses \\(AB\\) at right angles at its midpoint.', a: true, why: 'Perpendicular = at 90°; bisector = cuts in half.' },
      { type: 'tf', q: 'Every point on the bisector of angle \\(V\\) is the same distance from the two arms of the angle.', a: true, why: 'That is why the angle bisector splits the angle into two equal parts.' },
      { type: 'mcq', q: 'A point \\(P\\) is the same distance from \\(A\\) and \\(B\\). Where is it?', opts: ['On the perpendicular bisector of \\(AB\\)', 'On the line \\(AB\\)', 'On the angle bisector at \\(A\\)', 'At \\(A\\)'], why: 'Points equidistant from A and B lie on the perpendicular bisector.' },
    ]),
  ],
});

FD.check({
  section: 'bisectors',
  items: [
    { type: 'mcq', q: 'Which instruments do you need to construct a perpendicular bisector?', opts: ['Straight edge and compasses', 'Protractor and ruler', 'Protractor only', 'Compasses only'], why: 'Construct with compasses and a straight edge, no protractor.' },
    { type: 'num', q: 'An angle of \\(118^\\circ\\) is bisected. Find one of the new angles.', a: 59, unit: '°', why: '\\(118 \\div 2 = 59^\\circ\\).' },
    { type: 'num', q: 'Line \\(AB\\) is 9 cm long. Its perpendicular bisector crosses it at \\(M\\). How long is \\(AM\\), in cm?', a: 4.5, unit: 'cm', why: 'The bisector cuts \\(AB\\) in half.' },
    { type: 'tf', q: 'You may rub out the construction arcs once the bisector is drawn.', a: false, why: 'Leave all construction arcs: they show your method and earn marks.' },
  ],
});
