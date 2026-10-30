// Cyclic quadrilaterals (opposite angles add up to 180°) and the alternate segment theorem.
FD.add({
  id: 'cyclic',
  title: 'Cyclic quadrilaterals and the alternate segment',
  tab: 'Cyclic & alternate',
  icon: 'shapes',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Cyclic quadrilateral', 'A quadrilateral with all four corners on a circle.'],
    ['Alternate segment theorem', 'The angle between a tangent and a chord equals the angle in the alternate (opposite) segment.'],
  ],
  mount(el) {
    const G = FD.G, { C, R, P, ang } = FD.CT;
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'A cyclic quadrilateral, or a tangent and a chord',
      ctrls: `<div class="row"><label>Theorem <select id="md"><option value="cyc">Cyclic quadrilateral</option><option value="alt">Alternate segment theorem</option></select></label></div><p class="small">Drag the blue points round the circle.</p>`,
    });
    let q = [200, 300, 30, 110], b = 20, c = 140, live = false;
    a.cyc = (qq = q) => {
      q = qq.slice(); const V = q.map((t) => P(t)), A = q.map((_, i) => ang(V[i], V[(i + 3) % 4], V[(i + 1) % 4]));
      const cls = ['g-arc', 'g-arc2', 'g-arc', 'g-arc2'];
      let s = G.circ(C, R) + G.poly(V, 'g-fill');
      V.forEach((v, i) => { s += G.arc(v, V[(i + 3) % 4], V[(i + 1) % 4], 24, A[i] + '°', cls[i], 42); });
      s += V.map((v, i) => (live ? G.handle(v, i) : G.dot(v, 'g-dot k', 4)) + G.t(G.polar(C, R + 16, q[i]), 'ABCD'[i])).join('');
      a.draw(s);
      return A;
    };
    a.alt = (bb = b, cc = c, step = 2) => {
      b = bb; c = cc; const A = P(270), B = P(b), Cc = P(c), T = [A[0] + 150, A[1]];
      let s = G.circ(C, R) + G.line([A[0] - 150, A[1]], T) + G.line(A, B) + (step >= 1 ? G.line(Cc, A) + G.line(Cc, B) : '');
      s += G.arc(A, T, B, 30, ang(A, T, B) + '°', 'g-arc', 50);
      if (step >= 2) s += G.arc(Cc, A, B, 26, ang(Cc, A, B) + '°', 'g-arc', 46);
      s += G.dot(A, 'g-dot k', 4) + G.t([A[0], A[1] + 18], 'A') + G.t(G.polar(C, R + 16, b), 'B') + G.t(G.polar(C, R + 16, c), 'C');
      s += live ? G.handle(B, 'B') + G.handle(Cc, 'C') : G.dot(B, 'g-dot k', 4) + G.dot(Cc, 'g-dot k', 4);
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, px, py) => {
      let t = Math.atan2(C[1] - py, px - C[0]) * 180 / Math.PI; if (t < 0) t += 360;
      if (a.q('#md').value === 'cyc') {
        // keep the corners in order round the circle
        const i = +n, prev = q[(i + 3) % 4], next = q[(i + 1) % 4], inside = (x, lo, hi) => ((x - lo + 360) % 360) < ((hi - lo + 360) % 360);
        if (inside(t, prev + 8, next - 8)) q[i] = t;
      } else if (n === 'B') b = FD.clamp(t > 270 ? t - 360 : t, -60, 80);
      else c = FD.clamp(t, 100, 250);
      a.sync();
    });
    a.onSync(() => {
      if (a.q('#md').value === 'cyc') { const A = a.cyc(); a.msg(`\\(A + C = ${A[0]} + ${A[2]} = ${A[0] + A[2]}^\\circ\\) and \\(B + D = ${A[1]} + ${A[3]} = ${A[1] + A[3]}^\\circ\\)${A[0] + A[2] !== 180 ? ' (rounding)' : ''}.`); }
      else { a.alt(); a.msg('The angle between the tangent and the chord \\(AB\\) equals the angle at \\(C\\) in the alternate segment.'); }
    });
    a.live = (on) => { live = on; };
    a.cyc();
    return a;
  },
  steps: [
    {
      title: 'Cyclic quadrilaterals',
      text: '<p>A <b>cyclic quadrilateral</b> has all four corners on a circle.</p><p>Its <b>opposite angles add up to \\(180^\\circ\\)</b>: \\(A + C = 180^\\circ\\) and \\(B + D = 180^\\circ\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 40; t += 2) { const A = a.cyc([200 + t, 300 - t / 2, 30 + t, 110]); a.msg(`\\(${A[0]} + ${A[2]} = ${A[0] + A[2]}^\\circ\\)`); if (!(await ctx.sleep(70))) return; } },
    },
    {
      title: 'Worked example',
      text: '<p>\\(ABCD\\) is a cyclic quadrilateral with \\(\\angle A = 74^\\circ\\) and \\(\\angle B = 102^\\circ\\). Find \\(\\angle C\\) and \\(\\angle D\\).</p>',
      tip: 'Reason: “opposite angles of a cyclic quadrilateral add up to 180°”.',
      async on(a, ctx) { a.off(); a.live(false); a.cyc([200, 250, 356, 38]); await a.play(ctx, [['\\angle C = 180 - 74 = 106^\\circ', 'opposite angles of a cyclic quadrilateral'], ['\\angle D = 180 - 102 = 78^\\circ', '']]); },
    },
    {
      title: 'The alternate segment theorem',
      text: '<p>Draw a tangent at \\(A\\) and a chord \\(AB\\). The angle between them equals the angle \\(ACB\\) in the <b>alternate segment</b>, on the other side of the chord.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (const st of [0, 1, 2]) { a.alt(20, 140, st); if (!(await ctx.sleep(1100))) return; } for (let t = 140; t <= 220; t += 3) { a.alt(20, t, 2); if (!(await ctx.sleep(45))) return; } },
    },
    {
      title: 'Try it: drag the points',
      text: '<p>Choose a theorem and drag the points. For the quadrilateral, keep the corners in order round the circle.</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'cyclic',
  gens: [
    () => { const t = FD.rnd(55, 130); return { type: 'num', q: `\\(ABCD\\) is a cyclic quadrilateral. \\(\\angle ABC = ${t}^\\circ\\). Work out \\(\\angle ADC\\).`, a: 180 - t, unit: '°', why: `Opposite angles of a cyclic quadrilateral add up to 180°: \\(180 - ${t} = ${180 - t}^\\circ\\).` }; },
    () => { const t = FD.rnd(30, 80); return { type: 'num', q: `\\(TA\\) is a tangent to a circle at \\(A\\). \\(AB\\) is a chord and \\(C\\) is on the circle in the alternate segment. The angle between the tangent and \\(AB\\) is \\(${t}^\\circ\\). Work out \\(\\angle ACB\\).`, a: t, unit: '°', why: 'Alternate segment theorem: the angle between the tangent and the chord equals the angle in the alternate segment.' }; },
    () => { const k = FD.pick([2, 3, 4, 5]), t = 180 / (k + 1); return { type: 'num', q: `In a cyclic quadrilateral, two opposite angles are \\(x\\) and \\(${k}x\\). Find \\(x\\).`, a: t, unit: '°', why: `\\(x + ${k}x = 180\\), so \\(${k + 1}x = 180\\) and \\(x = ${t}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'cyclic',
  items: [
    { type: 'num', q: '\\(PQRS\\) is cyclic and \\(\\angle P = 83^\\circ\\). Find \\(\\angle R\\).', a: 97, unit: '°', why: '\\(180 - 83 = 97^\\circ\\).' },
    { type: 'mcq', q: 'A cyclic quadrilateral is one that…', opts: ['has all four vertices on a circle', 'has four equal sides', 'has rotational symmetry', 'contains a circle touching all sides'], why: 'All four corners lie on the circumference.' },
    { type: 'num', q: 'A tangent at \\(A\\) makes an angle of \\(58^\\circ\\) with the chord \\(AB\\). Find the angle subtended by \\(AB\\) at a point in the alternate segment.', a: 58, unit: '°', why: 'Alternate segment theorem.' },
    { type: 'tf', q: 'Opposite angles of every quadrilateral add up to 180°.', a: false, why: 'Only for cyclic quadrilaterals.' },
  ],
});
