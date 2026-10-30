// Bearings: a north line at A, a draggable point B, the clockwise angle from north, and the back bearing.
FD.add({
  id: 'bearings',
  title: 'Bearings',
  tab: 'Bearings',
  icon: 'target',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Bearing', 'A direction given as an angle measured <b>from north</b>, <b>clockwise</b>, written with <b>three figures</b>, e.g. 065°.'],
    ['Back bearing', 'The bearing for the return journey. It differs from the bearing by \\(180^\\circ\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, { vb: '0 0 420 300', drag: true, label: 'Two points with north lines and a bearing', ctrls: '<p class="small">Drag point B. Tick the box to see the bearing of A from B too.</p><div class="row"><label><input type="checkbox" id="back"> Show the back bearing</label></div>' });
    const A = [190, 175];
    let b = 65, d = 100, live = false;
    const fig = (x) => String(Math.round(x) % 360).padStart(3, '0') + '°';
    const north = (P, len = 70) => G.vec([P[0], P[1] + 8], [P[0], P[1] - len], 'g-vec2') + G.t([P[0], P[1] - len - 12], 'N', 'l2');
    a.show = (bb, back = false, dd = 100) => {
      b = bb; d = dd;
      const B = G.polar(A, d, 90 - b), bk = (b + 180) % 360;
      let s = north(A) + G.sector(A, 34, 90 - b, 90, 'g-arc', fig(b), 54);
      if (back) s += north(B, 55) + G.sector(B, 26, 90 - bk, 90, 'g-arc3', fig(bk), 44);
      s += G.line(A, B) + G.dot(A, 'g-dot k', 5) + G.t([A[0] - 14, A[1] + 14], 'A') + G.t(G.polar(B, 18, 90 - b), 'B');
      s += live ? G.handle(B, 'B') : G.dot(B, 'g-dot k', 5);
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, x, y) => {
      let t = Math.round(90 - Math.atan2(A[1] - y, x - A[0]) * 180 / Math.PI); t = (t + 360) % 360;
      a.q('#back').dataset.b = t; a.q('#back').dataset.d = FD.clamp(G.dist(A, [x, y]), 60, 100); a.sync();
    });
    a.onSync(() => {
      const bk = a.q('#back'), t = +(bk.dataset.b || b), dd = +(bk.dataset.d || d);
      a.show(t, bk.checked, dd);
      a.big(`\\text{bearing of B from A} = ${fig(t).replace('°', '^\\circ')}`);
      a.msg(bk.checked ? `Bearing of A from B: \\(${t} ${t < 180 ? '+' : '-'} 180 = ${fig((t + 180) % 360).replace('°', '^\\circ')}\\)` : '');
    });
    // A protractor on a baseline with an angle of t degrees (measured from the right-hand zero).
    a.protractor = (t, sweep = t) => {
      const C = [210, 225], R = 150;
      let s = `<path class="g-fill2" opacity=".6" d="M${C[0] - R} ${C[1]}A${R} ${R} 0 0 1 ${C[0] + R} ${C[1]}Z"/>`;
      for (let i = 0; i <= 180; i++) { const big = i % 10 === 0, mid = i % 5 === 0; s += G.line(G.polar(C, R - (big ? 16 : mid ? 10 : 5), i), G.polar(C, R, i), big ? 'g-ln' : 'g-thin'); }
      for (let i = 0; i <= 180; i += 30) s += G.t(G.polar(C, R - 28, i), i, 's') + G.t(G.polar(C, R - 48, i), 180 - i, 's');
      s += G.sector(C, 40, 0, sweep, 'g-arc', sweep >= t ? t + '°' : '', 60) + G.line([C[0] - R - 10, C[1]], [C[0] + R + 10, C[1]]) + G.line(C, G.polar(C, R + 8, sweep), 'g-hl') + G.dot(C, 'g-dot k', 5);
      a.draw(s);
    };
    a.live = (on) => { live = on; };
    a.show(65);
    return a;
  },
  steps: [
    {
      title: 'Three rules',
      text: '<p>A <b>bearing</b> is an angle that gives a direction. It is always:</p><ol><li>measured <b>from north</b>,</li><li>measured <b>clockwise</b>,</li><li>written with <b>three figures</b>.</li></ol>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 65; t += 2.5) { a.show(t); if (!(await ctx.sleep(30))) return; } a.show(65); a.big('065^\\circ'); },
    },
    {
      title: 'Three figures',
      text: '<p>Write \\(65^\\circ\\) as <b>065°</b>, and \\(8^\\circ\\) as <b>008°</b>. Bigger angles already have three figures: <b>140°</b>.</p><p>Due east is 090°, due south is 180°, due west is 270°.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (const t of [8, 90, 140, 180, 270]) { a.show(t); a.big(String(t).padStart(3, '0') + '^\\circ'); if (!(await ctx.sleep(1200))) return; } },
    },
    {
      title: 'Bearings bigger than 180°',
      text: '<p>B is to the north-west of A. Keep turning clockwise from north all the way round: the bearing is <b>310°</b>.</p><p>If the angle anticlockwise from north is \\(50^\\circ\\), the bearing is \\(360 - 50 = 310^\\circ\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 310; t += 5) { a.show(t); if (!(await ctx.sleep(18))) return; } a.big('360 - 50 = 310^\\circ'); },
    },
    {
      title: 'The back bearing',
      text: '<p>The bearing of B from A is 065°. What is the bearing of <b>A from B</b>?</p><p>Draw a north line at B. The two north lines are parallel, so the angles are linked by co-interior angles: add \\(180^\\circ\\).</p>',
      tip: 'If the bearing is less than 180°, add 180°. If it is more than 180°, subtract 180°.',
      async on(a, ctx) { a.off(); a.live(false); a.show(65); if (!(await ctx.sleep(900))) return; a.show(65, true); await a.play(ctx, [['65 + 180 = 245^\\circ', 'bearing of A from B']]); },
    },
    {
      title: 'Measuring an angle with a protractor',
      text: '<p>Put the centre of the protractor on the <b>vertex</b> and line up \\(0^\\circ\\) with one arm. Count round from that zero to the other arm.</p><p>Protractors have two scales. Use the one that starts at \\(0^\\circ\\) on your arm: here \\(57^\\circ\\), not \\(123^\\circ\\).</p>',
      tip: 'Check: an acute angle must be less than 90°. Measure to the nearest degree.',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 57; t += 3) { a.protractor(57, t); if (!(await ctx.sleep(40))) return; } a.protractor(57); a.big('57^\\circ'); },
    },
    {
      title: 'Try it: drag B',
      text: '<p>Drag B around A and read the bearing. Tick the box to see the back bearing from B.</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'bearings',
  gens: [
    () => { const t = FD.rnd(5, 355); return { type: 'num', q: `The bearing of Q from P is \\(${String(t).padStart(3, '0')}^\\circ\\). Work out the bearing of P from Q.`, a: (t + 180) % 360, unit: '°', why: `${t < 180 ? `Less than 180°, so add 180: \\(${t} + 180 = ${t + 180}^\\circ\\)` : `More than 180°, so subtract 180: \\(${t} - 180 = ${t - 180}^\\circ\\)`}.` }; },
    () => { const [d, t] = FD.pick([['east', 90], ['south', 180], ['west', 270], ['north-east', 45], ['south-east', 135], ['south-west', 225], ['north-west', 315]]); return { type: 'num', q: `What is the bearing of a ship sailing due <b>${d}</b>?`, a: t, unit: '°', why: `Clockwise from north: ${d} is \\(${String(t).padStart(3, '0')}^\\circ\\).` }; },
    () => { const t = FD.rnd(5, 175); return { type: 'num', q: `A protractor is placed on an angle. One scale reads \\(${t}^\\circ\\) and the other reads \\(${180 - t}^\\circ\\). The angle is ${t < 90 ? 'acute' : t > 90 ? 'obtuse' : 'a right angle'}. What is its size?`, a: t, unit: '°', why: `The two scales always add up to 180°. ${t < 90 ? 'An acute angle is less than 90°' : t > 90 ? 'An obtuse angle is more than 90°' : 'It is 90°'}, so the angle is \\(${t}^\\circ\\).` }; },
    () => { const x = FD.rnd(10, 80); return { type: 'num', q: `B is \\(${x}^\\circ\\) <b>anticlockwise</b> from north, seen from A. Work out the bearing of B from A.`, a: 360 - x, unit: '°', why: `Bearings go clockwise: \\(360 - ${x} = ${360 - x}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'bearings',
  items: [
    { type: 'mcq', q: 'How is a bearing of \\(7^\\circ\\) written?', opts: ['007°', '7°', '070°', '700°'], why: 'Three figures: 007°.' },
    { type: 'num', q: 'The bearing of B from A is \\(120^\\circ\\). Find the bearing of A from B.', a: 300, unit: '°', why: '\\(120 + 180 = 300^\\circ\\).' },
    { type: 'num', q: 'The bearing of X from Y is \\(250^\\circ\\). Find the bearing of Y from X.', a: 70, unit: '°', why: '\\(250 - 180 = 070^\\circ\\).' },
    { type: 'mcq', q: 'A protractor shows \\(38^\\circ\\) on one scale and \\(142^\\circ\\) on the other. The angle is obtuse. Its size is…', opts: ['\\(142^\\circ\\)', '\\(38^\\circ\\)', '\\(180^\\circ\\)', '\\(104^\\circ\\)'], why: 'Obtuse means more than 90°, so use the 142° scale.' },
    { type: 'tf', q: 'Bearings are measured anticlockwise from north.', a: false, why: 'Clockwise from north.' },
  ],
});
