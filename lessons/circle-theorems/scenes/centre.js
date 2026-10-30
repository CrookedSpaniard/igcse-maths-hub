// Angle at the centre is twice the angle at the circumference; angle in a semicircle; angles in the same segment.
FD.add({
  id: 'centre',
  title: 'Angles at the centre and circumference',
  tab: 'Centre & segment',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Subtended', 'The angle an arc (or chord) makes at a point: the angle between the lines from its two ends to that point.'],
    ['Angle at the centre', 'The angle at the centre is twice the angle at the circumference subtended by the same arc.'],
    ['Same segment', 'Angles at the circumference subtended by the same chord, on the same side of it, are equal.'],
  ],
  mount(el) {
    const G = FD.G, { C, R, P, ang } = FD.CT;
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'A circle with angles at the centre and circumference',
      ctrls: `<div class="row"><label>Theorem <select id="md"><option value="twice">Angle at the centre</option><option value="semi">Angle in a semicircle</option><option value="same">Angles in the same segment</option></select></label></div><p class="small">Drag the blue points round the circle.</p>`,
    });
    let x = 100, y = 40, live = false;
    const lims = { twice: [-20, 200], semi: [8, 172], same: [-20, 200] };
    a.show = (mode, xa = x, ya = y) => {
      x = FD.clamp(xa, ...lims[mode]); y = FD.clamp(ya, ...lims[mode]);
      const A = mode === 'semi' ? P(180) : P(210), B = mode === 'semi' ? P(0) : P(330), X = P(x), Y = P(y);
      let s = G.circ(C, R) + G.dot(C, 'g-dot k', 4);
      const vX = ang(X, A, B);
      if (mode === 'twice') s += G.line(C, A, 'g-hl2') + G.line(C, B, 'g-hl2') + G.arc(C, A, B, 26, ang(C, A, B) + '°', 'g-arc2', 44);
      if (mode === 'semi') s += G.line(A, B, 'g-hl2');
      s += G.line(X, A) + G.line(X, B) + G.arc(X, A, B, 26, vX + '°', 'g-arc', 46);
      if (mode === 'same') s += G.line(Y, A) + G.line(Y, B) + G.arc(Y, A, B, 26, ang(Y, A, B) + '°', 'g-arc3', 46) + G.line(A, B, 'g-thin');
      s += G.dot(A, 'g-dot k', 4) + G.dot(B, 'g-dot k', 4) + G.t(G.polar(C, R + 16, mode === 'semi' ? 180 : 210), 'A') + G.t(G.polar(C, R + 16, mode === 'semi' ? 0 : 330), 'B');
      s += live ? G.handle(X, 'X') + (mode === 'same' ? G.handle(Y, 'Y') : '') : G.dot(X, 'g-dot', 5) + (mode === 'same' ? G.dot(Y, 'g-dot', 5) : '');
      a.draw(s);
      return vX;
    };
    FD.dragIn(a.svg, (n, px, py) => { let t = Math.atan2(C[1] - py, px - C[0]) * 180 / Math.PI; if (t < -90) t += 360; if (n === 'X') x = t; else y = t; a.sync(); });
    a.onSync(() => {
      const m = a.q('#md').value, v = a.show(m);
      a.msg(m === 'twice' ? `\\(120^\\circ = 2 \\times ${v}^\\circ\\): the angle at the centre is twice the angle at the circumference.` : m === 'semi' ? `The angle in a semicircle is always \\(${v}^\\circ\\).` : 'Both angles stand on the chord \\(AB\\) in the same segment, so they are equal.');
    });
    a.live = (on) => { live = on; };
    a.show('twice');
    return a;
  },
  steps: [
    {
      title: 'Twice the angle',
      text: '<p>Join the ends of arc \\(AB\\) to the centre and to a point \\(X\\) on the circumference.</p><p>The angle at the <b>centre</b> is <b>twice</b> the angle at the <b>circumference</b>: \\(120^\\circ = 2 \\times 60^\\circ\\). Move \\(X\\): it stays the same.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 30; t <= 160; t += 3) { a.show('twice', t); if (!(await ctx.sleep(45))) return; } },
    },
    {
      title: 'The angle in a semicircle',
      text: '<p>When \\(AB\\) is a <b>diameter</b>, the angle at the centre is \\(180^\\circ\\). Half of it is \\(90^\\circ\\).</p><p>The <b>angle in a semicircle is a right angle</b>.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 20; t <= 160; t += 3) { a.show('semi', t); if (!(await ctx.sleep(45))) return; } },
    },
    {
      title: 'Angles in the same segment',
      text: '<p>Two points \\(X\\) and \\(Y\\) on the same side of chord \\(AB\\). Both angles are half of the angle at the centre, so they are <b>equal</b>.</p><p><b>Angles in the same segment are equal.</b></p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 60; t += 3) { a.show('same', 150 - t, 20 + t / 2); if (!(await ctx.sleep(45))) return; } },
    },
    {
      title: 'Worked example',
      text: '<p>\\(O\\) is the centre. \\(\\angle AOB = 120^\\circ\\). \\(C\\) is on the major arc. Find \\(\\angle ACB\\). \\(D\\) is also on the major arc: find \\(\\angle ADB\\).</p>',
      tip: 'Exam reasons: “angle at the centre is twice the angle at the circumference” and “angles in the same segment are equal”.',
      async on(a, ctx) { a.off(); a.live(false); a.show('twice', 100); await a.play(ctx, [['\\angle ACB = 120 \\div 2 = 60^\\circ', 'angle at centre = 2 × angle at circumference'], ['\\angle ADB = 60^\\circ', 'angles in the same segment are equal']]); },
    },
    {
      title: 'Try it: drag round the circle',
      text: '<p>Choose a theorem and drag the blue points. Which angles change, and which stay the same?</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'centre',
  gens: [
    () => { const c = 2 * FD.rnd(20, 85); return FD.pick([{ type: 'num', q: `\\(O\\) is the centre of a circle. \\(\\angle AOB = ${c}^\\circ\\). \\(C\\) is a point on the major arc. Work out \\(\\angle ACB\\).`, a: c / 2, unit: '°', why: `The angle at the centre is twice the angle at the circumference: \\(${c} \\div 2 = ${c / 2}^\\circ\\).` }, { type: 'num', q: `\\(A\\), \\(B\\), \\(C\\) are on a circle with centre \\(O\\). \\(\\angle ACB = ${c / 2}^\\circ\\) (\\(C\\) on the major arc). Work out \\(\\angle AOB\\).`, a: c, unit: '°', why: `\\(2 \\times ${c / 2} = ${c}^\\circ\\) (angle at the centre is twice the angle at the circumference).` }]); },
    () => { const t = FD.rnd(20, 70); return { type: 'num', q: `\\(AB\\) is a diameter of a circle and \\(C\\) is on the circle. \\(\\angle CAB = ${t}^\\circ\\). Work out \\(\\angle CBA\\).`, a: 90 - t, unit: '°', why: `\\(\\angle ACB = 90^\\circ\\) (angle in a semicircle). \\(\\angle CBA = 180 - 90 - ${t} = ${90 - t}^\\circ\\).` }; },
    () => { const t = FD.rnd(25, 80); return { type: 'num', q: `\\(A, B, C, D\\) are points on a circle. \\(C\\) and \\(D\\) are on the same side of \\(AB\\). \\(\\angle ACB = ${t}^\\circ\\). Work out \\(\\angle ADB\\).`, a: t, unit: '°', why: 'Angles in the same segment are equal.' }; },
  ],
});

FD.check({
  section: 'centre',
  items: [
    { type: 'num', q: '\\(\\angle AOB = 94^\\circ\\) at the centre. Find the angle subtended by \\(AB\\) at a point on the major arc.', a: 47, unit: '°', why: 'Half of 94.' },
    { type: 'mcq', q: 'The angle in a semicircle is…', opts: ['\\(90^\\circ\\)', '\\(180^\\circ\\)', '\\(60^\\circ\\)', '\\(45^\\circ\\)'], why: 'Half of the 180° angle at the centre.' },
    { type: 'tf', q: 'Angles subtended by the same chord on the same side of it are equal.', a: true, why: 'Angles in the same segment are equal.' },
    { type: 'num', q: '\\(AB\\) is a diameter, \\(C\\) on the circle, \\(\\angle ABC = 27^\\circ\\). Find \\(\\angle BAC\\).', a: 63, unit: '°', why: '\\(\\angle ACB = 90^\\circ\\); \\(180 - 90 - 27 = 63^\\circ\\).' },
  ],
});
