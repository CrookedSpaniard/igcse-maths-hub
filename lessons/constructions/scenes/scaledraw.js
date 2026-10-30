// Solving a problem with a scale drawing: draw two sides and the angle between, measure the third side.
FD.add({
  id: 'scaledraw',
  title: 'Problems with scale drawings',
  tab: 'Scale drawings',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Scale', 'How real lengths are shrunk, e.g. 1 cm represents 10 m. Angles stay the same size.'],
    ['Scale drawing', 'An accurate drawing that you can measure to find a real length or angle.'],
  ],
  mount(el) {
    const G = FD.G, A = [110, 250], K = 20;
    const a = FD.stage(el, {
      vb: '0 0 420 280', label: 'A scale drawing of a triangular field',
      ctrls: `<label class="ctrl">First side (m) <input type="range" id="p" min="40" max="130" step="10" value="80"><output id="op">80</output></label>
        <label class="ctrl">Second side (m) <input type="range" id="q" min="30" max="90" step="10" value="60"><output id="oq">60</output></label>
        <label class="ctrl">Angle between <input type="range" id="t" min="20" max="120" step="5" value="50"><output id="ot">50°</output></label>`,
    });
    // p, q real lengths (m), t angle; scale 1 cm : 10 m. stage: 1 base, 2 angle, 3 second side, 4 measured
    a.field = (p, q, t, st = 4) => {
      const B = [A[0] + (p / 10) * K, A[1]], C = G.polar(A, (q / 10) * K, t), third = G.dist(B, C) / K;
      let s = G.line(A, B) + G.t([(A[0] + B[0]) / 2, A[1] + 18], `${p / 10} cm`, 's');
      if (st >= 2) s += G.arc(A, B, C, 30, t + '°', 'g-arc', 50) + (st === 2 ? G.line(A, G.polar(A, (q / 10) * K * 1.3, t), 'g-dash') : '');
      if (st >= 3) s += G.line(A, C) + G.t(G.lerp(A, C, 0.55).map((v, i) => v + (i ? -4 : -26)), `${q / 10} cm`, 's');
      if (st >= 4) s += G.line(B, C, 'g-hl') + G.t(G.lerp(B, C, 0.5).map((v, i) => v + (i ? -12 : 12)), `${FD.num(FD.round(third, 1))} cm`, 'l st');
      s += G.dot(A, 'g-dot k', 4) + G.dot(B, 'g-dot k', 4) + (st >= 3 ? G.dot(C, 'g-dot k', 4) : '');
      a.draw(s);
      return FD.round(third, 1);
    };
    a.onSync(() => {
      const p = a.val('p'), q = a.val('q'), t = a.val('t');
      a.out('p', p); a.out('q', q); a.out('t', t + '°');
      const m = a.field(p, q, t);
      a.big(`${FD.num(m)}\\ \\text{cm} \\times 10 = ${FD.num(FD.round(m * 10, 0))}\\ \\text{m}`);
      a.msg('Scale 1 cm to 10 m: measure the third side on the drawing, then multiply by 10.');
    });
    a.field(80, 60, 50, 0);
    return a;
  },
  steps: [
    {
      title: 'Choose a scale',
      text: '<p>A field is a triangle. Two fences are <b>80 m</b> and <b>60 m</b> long with an angle of \\(50^\\circ\\) between them. How long is the third fence?</p><p>Use the scale <b>1 cm to 10 m</b>: 80 m becomes 8 cm and 60 m becomes 6 cm.</p>',
      on(a) { a.off(); a.field(80, 60, 50, 1); },
    },
    {
      title: 'Draw it accurately',
      text: '<p>Draw the 8 cm side. Use a protractor to draw the \\(50^\\circ\\) angle, then measure 6 cm along the new line.</p>',
      async on(a, ctx) { a.off(); for (const st of [1, 2, 3]) { a.field(80, 60, 50, st); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Measure and scale back up',
      text: '<p>Join the ends and <b>measure</b> the third side: about 6.2 cm.</p><p>Change it back to real life with the scale: \\(6.2 \\times 10 = 62\\) m.</p>',
      tip: 'A scale drawing gives an approximate answer. Measure carefully to the nearest millimetre.',
      async on(a, ctx) { a.off(); a.field(80, 60, 50, 4); await a.play(ctx, [['\\text{measured} \\approx 6.2\\ \\text{cm}', 'to the nearest mm'], ['6.2 \\times 10 = 62\\ \\text{m}', '1 cm represents 10 m']]); },
    },
    {
      title: 'Try it: change the field',
      text: '<p>Change the two sides and the angle. Read the measured third side and convert it to metres.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'scaledraw',
  gens: [
    () => { const k = FD.pick([2, 5, 10, 20, 50]), d = FD.rnd(12, 95) / 10; return { type: 'num', q: `On a scale drawing, 1 cm represents ${k} m. You measure a length of \\(${FD.tn(d)}\\) cm. What is the real length?`, a: FD.round(d * k, 2), unit: 'm', why: `\\(${FD.tn(d)} \\times ${k} = ${FD.tn(FD.round(d * k, 2))}\\) m.` }; },
    () => { const k = FD.pick([2, 4, 5, 10, 20]), L = k * FD.rnd(4, 19) / 2; return { type: 'num', q: `A scale drawing uses 1 cm to represent ${k} m. How long should a ${FD.num(L)} m wall be drawn?`, a: L / k, unit: 'cm', why: `\\(${FD.tn(L)} \\div ${k} = ${FD.tn(L / k)}\\) cm.` }; },
    () => FD.pick([
      { type: 'tf', q: 'On a scale drawing, angles are drawn the same size as the real angles.', a: true, why: 'Only lengths are scaled; angles do not change.' },
      { type: 'mcq', q: 'A real angle is \\(70^\\circ\\). On a 1 cm to 5 m scale drawing it is…', opts: ['\\(70^\\circ\\)', '\\(14^\\circ\\)', '\\(350^\\circ\\)', '\\(35^\\circ\\)'], why: 'Angles are not scaled.' },
    ]),
  ],
});

FD.check({
  section: 'scaledraw',
  items: [
    { type: 'num', q: 'Scale 1 cm to 20 m. A path measures 4.3 cm on the drawing. How long is the real path?', a: 86, unit: 'm', why: '\\(4.3 \\times 20 = 86\\) m.' },
    { type: 'num', q: 'Scale 1 cm to 5 km. Two ships are 17.5 km apart. How far apart are they on the drawing, in cm?', a: 3.5, unit: 'cm', why: '\\(17.5 \\div 5 = 3.5\\) cm.' },
    { type: 'mcq', q: 'Why is an answer from a scale drawing only approximate?', opts: ['Drawing and measuring are only accurate to about a millimetre', 'Scales are always wrong', 'Angles change size', 'The scale is a guess'], why: 'Small drawing errors are multiplied by the scale.' },
    { type: 'tf', q: 'If 1 cm represents 10 m, then 1 mm represents 1 m.', a: true, why: '\\(1\\) mm is a tenth of 1 cm, so it represents a tenth of 10 m.' },
  ],
});
