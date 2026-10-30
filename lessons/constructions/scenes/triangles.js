// Constructing triangles: three sides with compasses (SSS), or with a protractor (SAS, ASA).
FD.add({
  id: 'triangles',
  title: 'Constructing triangles',
  tab: 'Triangles',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Construct', 'Draw accurately with a ruler, protractor and compasses. Leave your construction arcs showing.'],
    ['Compasses', 'An instrument for drawing circles and arcs. Set them to a length with a ruler.'],
    ['Protractor', 'An instrument for measuring and drawing angles.'],
  ],
  mount(el) {
    const G = FD.G, A0 = [60, 240];
    const a = FD.stage(el, {
      vb: '0 0 420 270', label: 'A triangle being constructed',
      ctrls: `<label class="ctrl">\\(AB\\) (cm) <input type="range" id="c" min="3" max="10" step="0.5" value="7"><output id="oc">7</output></label>
        <label class="ctrl">\\(AC\\) (cm) <input type="range" id="b" min="2" max="10" step="0.5" value="5"><output id="ob">5</output></label>
        <label class="ctrl">\\(BC\\) (cm) <input type="range" id="aa" min="2" max="10" step="0.5" value="6"><output id="oaa">6</output></label>`,
    });
    // Corner C in cm (A at the origin, B at (c, 0)), from the three sides; null if impossible.
    const sss = (a_, b, c) => { const x = (c * c + b * b - a_ * a_) / (2 * c), h2 = b * b - x * x; return h2 <= 0 ? null : [x, Math.sqrt(h2)]; };
    // Draw: C in cm; k = scale (px/cm); st = what to show: base, arcA, arcB, sides; lbl = side labels
    a.tri = (c, C, st = {}, lbl = {}) => {
      const k = Math.min(30, 300 / Math.max(c, C ? C[0] : 0, 1), C ? 200 / C[1] : 30);
      const A = A0, B = [A0[0] + c * k, A0[1]], P = C ? [A0[0] + C[0] * k, A0[1] - C[1] * k] : null;
      let s = G.line(A, B) + G.dot(A, 'g-dot k', 4) + G.dot(B, 'g-dot k', 4) + G.t([A[0] - 12, A[1] + 14], 'A') + G.t([B[0] + 12, B[1] + 14], 'B');
      if (lbl.c) s += G.t([(A[0] + B[0]) / 2, A[1] + 18], lbl.c, 's');
      const ang = (V, Q) => Math.atan2(V[1] - Q[1], Q[0] - V[0]) * 180 / Math.PI;
      if (P && st.arcA != null) { const r = G.dist(A, P), m = ang(A, P); s += `<path class="g-hl2" d="${FD.arcD(A, r, m - 22, m - 22 + 44 * st.arcA)}"/>`; }
      if (P && st.arcB != null) { const r = G.dist(B, P), m = ang(B, P); s += `<path class="g-hl2" d="${FD.arcD(B, r, m + 22, m + 22 - 44 * st.arcB)}"/>`; }
      if (P && st.angA) s += G.arc(A, B, P, 30, st.angA, 'g-arc', 50);
      if (P && st.angB) s += G.arc(B, A, P, 30, st.angB, 'g-arc3', 50);
      if (P && st.rayA) s += G.line(A, G.lerp(A, P, 1.25), 'g-dash');
      if (P && st.rayB) s += G.line(B, G.lerp(B, P, 1.25), 'g-dash');
      if (P && st.sides) { s += G.line(A, P) + G.line(B, P) + G.dot(P, 'g-dot k', 4) + G.t([P[0], P[1] - 16], 'C'); if (lbl.b) s += G.t(G.lerp(A, P, 0.5).map((v, i) => v + (i ? 0 : -24)), lbl.b, 's'); if (lbl.a) s += G.t(G.lerp(B, P, 0.5).map((v, i) => v + (i ? 0 : 24)), lbl.a, 's'); }
      a.draw(s);
    };
    a.sss = sss;
    a.onSync(() => {
      const c = a.val('c'), b = a.val('b'), A_ = a.val('aa');
      a.out('c', c); a.out('b', b); a.out('aa', A_);
      const C = sss(A_, b, c);
      if (!C) { const s = [c, b, A_].sort((x, y) => x - y); a.tri(c, null); a.msg(`The arcs do not meet: \\(${s[0]} + ${s[1]} = ${s[0] + s[1]}\\) is not more than ${s[2]}. No triangle!`, 'bad'); return; }
      a.tri(c, C, { arcA: 1, arcB: 1, sides: true }, { c: c + ' cm', b: b + ' cm', a: A_ + ' cm' });
      a.msg('The two arcs cross at \\(C\\). Any two sides must add up to more than the third side.');
    });
    a.tri(7, sss(6, 5, 7));
    return a;
  },
  steps: [
    {
      title: 'Three sides: use compasses',
      text: '<p>Construct triangle \\(ABC\\) with \\(AB = 7\\) cm, \\(AC = 5\\) cm and \\(BC = 6\\) cm.</p><p><b>1.</b> Draw the longest side, \\(AB = 7\\) cm, with a ruler.</p><p><b>2.</b> Open the compasses to 5 cm and draw an arc from \\(A\\).</p>',
      async on(a, ctx) { a.off(); const C = a.sss(6, 5, 7); a.tri(7, C, {}, { c: '7 cm' }); if (!(await ctx.sleep(700))) return; for (let k = 0; k <= 1.0001; k += 0.05) { a.tri(7, C, { arcA: Math.min(k, 1) }, { c: '7 cm' }); if (!(await ctx.sleep(35))) return; } },
    },
    {
      title: 'The second arc',
      text: '<p><b>3.</b> Open the compasses to 6 cm and draw an arc from \\(B\\).</p><p><b>4.</b> Where the arcs cross is \\(C\\). Join \\(C\\) to \\(A\\) and to \\(B\\). <b>Leave the arcs</b>: they show your method.</p>',
      tip: 'If the two shorter sides add up to less than the longest side, the arcs never meet and there is no triangle.',
      async on(a, ctx) { a.off(); const C = a.sss(6, 5, 7); for (let k = 0; k <= 1.0001; k += 0.05) { a.tri(7, C, { arcA: 1, arcB: Math.min(k, 1) }, { c: '7 cm' }); if (!(await ctx.sleep(35))) return; } if (!(await ctx.sleep(500))) return; a.tri(7, C, { arcA: 1, arcB: 1, sides: true }, { c: '7 cm', b: '5 cm', a: '6 cm' }); },
    },
    {
      title: 'Two sides and the angle between',
      text: '<p>\\(AB = 6\\) cm, \\(\\angle A = 50^\\circ\\), \\(AC = 4.5\\) cm.</p><p>Draw \\(AB\\). Put the protractor on \\(A\\), mark \\(50^\\circ\\) and draw a faint line. Measure 4.5 cm along it to find \\(C\\), then join \\(C\\) to \\(B\\).</p>',
      async on(a, ctx) {
        a.off(); const C = [4.5 * Math.cos(50 * Math.PI / 180), 4.5 * Math.sin(50 * Math.PI / 180)];
        a.tri(6, C, { angA: '50°', rayA: true }, { c: '6 cm' }); if (!(await ctx.sleep(1500))) return;
        a.tri(6, C, { angA: '50°', sides: true }, { c: '6 cm', b: '4.5 cm' });
      },
    },
    {
      title: 'Two angles and a side',
      text: '<p>\\(AB = 7\\) cm, \\(\\angle A = 40^\\circ\\), \\(\\angle B = 65^\\circ\\).</p><p>Draw \\(AB\\), then draw the angle at each end with a protractor. \\(C\\) is where the two lines cross.</p>',
      async on(a, ctx) {
        a.off(); const r = Math.PI / 180, b = 7 * Math.sin(65 * r) / Math.sin(75 * r), C = [b * Math.cos(40 * r), b * Math.sin(40 * r)];
        a.tri(7, C, { angA: '40°', rayA: true }, { c: '7 cm' }); if (!(await ctx.sleep(1200))) return;
        a.tri(7, C, { angA: '40°', angB: '65°', rayA: true, rayB: true }, { c: '7 cm' }); if (!(await ctx.sleep(1200))) return;
        a.tri(7, C, { angA: '40°', angB: '65°', sides: true }, { c: '7 cm' });
      },
    },
    {
      title: 'Try it: three sides',
      text: '<p>Change the three sides. The arcs from \\(A\\) and \\(B\\) show where \\(C\\) must be.</p><p>Find three lengths that do <b>not</b> make a triangle.</p>',
      tip: 'Try 3, 4 and 8.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'triangles',
  gens: [
    () => { const s = [FD.rnd(2, 12), FD.rnd(2, 12), FD.rnd(2, 12)].sort((x, y) => x - y), ok = s[0] + s[1] > s[2]; return { type: 'tf', q: `Can you construct a triangle with sides ${s[0]} cm, ${s[1]} cm and ${s[2]} cm?`, a: ok, why: `The two shorter sides add up to \\(${s[0]} + ${s[1]} = ${s[0] + s[1]}\\) cm, which is ${ok ? 'more' : s[0] + s[1] === s[2] ? 'equal to' : 'less'} than ${s[2]} cm${ok ? '' : ', so the arcs cannot meet'}.` }; },
    () => FD.pick([
      { type: 'mcq', q: 'You are given the lengths of all three sides of a triangle. Which instruments do you need?', opts: ['Ruler and compasses', 'Protractor only', 'Ruler and protractor', 'Compasses only'], why: 'Ruler for the first side, compasses for the two arcs.' },
      { type: 'mcq', q: 'You are given two sides and the angle between them. Which instruments do you need?', opts: ['Ruler and protractor', 'Compasses only', 'Protractor only', 'Ruler and compasses only'], why: 'Ruler for the lengths, protractor for the angle.' },
      { type: 'mcq', q: 'When you construct a triangle from three sides, you should…', opts: ['leave the construction arcs showing', 'rub out the arcs', 'measure the angles first', 'draw the shortest side first'], why: 'The arcs show the examiner your method.' },
    ]),
    () => { let A, B; do { A = FD.rnd(3, 13) * 5; B = FD.rnd(3, 13) * 5; } while (A + B > 150); return { type: 'num', q: `You construct triangle \\(ABC\\) with \\(\\angle A = ${A}^\\circ\\) and \\(\\angle B = ${B}^\\circ\\). What angle should you measure at \\(C\\), as a check?`, a: 180 - A - B, unit: '°', why: `Angles in a triangle add up to 180°: \\(180 - ${A} - ${B} = ${180 - A - B}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'triangles',
  items: [
    { type: 'tf', q: 'A triangle with sides 4 cm, 5 cm and 10 cm can be constructed.', a: false, why: '\\(4 + 5 = 9 < 10\\): the arcs do not meet.' },
    { type: 'mcq', q: 'To construct a triangle with sides 8 cm, 6 cm and 5 cm, what do you draw first?', opts: ['One side, usually the longest, with a ruler', 'An angle of 60°', 'A circle of radius 8 cm', 'All three arcs'], why: 'Draw a base first, then the arcs from its ends.' },
    { type: 'mcq', q: 'After drawing \\(AB\\), you draw an arc of radius 6 cm centred on \\(A\\). This finds the points that are…', opts: ['6 cm from \\(A\\)', '6 cm from \\(B\\)', '6 cm from the line \\(AB\\)', 'on the line \\(AB\\)'], why: 'Every point on the arc is 6 cm from its centre, \\(A\\).' },
    { type: 'num', q: 'A constructed triangle has angles of \\(48^\\circ\\) and \\(77^\\circ\\). What should the third angle measure?', a: 55, unit: '°', why: '\\(180 - 48 - 77 = 55^\\circ\\).' },
  ],
});
