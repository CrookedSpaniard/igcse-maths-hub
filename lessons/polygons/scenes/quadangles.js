// A quadrilateral with draggable corners: one diagonal makes two triangles, so the angles add up to 360°.
FD.add({
  id: 'quadangles',
  title: 'Angles in quadrilaterals',
  tab: 'Quad angles',
  icon: 'geometry',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Angle sum of a quadrilateral', 'The four interior angles add up to \\(360^\\circ\\).'],
    ['Adjacent', 'Next to each other.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, { vb: '0 0 420 280', drag: true, label: 'A quadrilateral with its four angles', ctrls: '<p class="small">Drag the four corners. Keep the shape convex (no dents).</p>' });
    let Q = [[90, 70], [330, 50], [370, 230], [60, 220]], live = false;
    const angs = () => { const r = Q.map((p, i) => Math.round(G.deg(p, Q[(i + 3) % 4], Q[(i + 1) % 4]))); r[3] = 360 - r[0] - r[1] - r[2]; return r; };
    // o.split: show the diagonal and the two triangles; o.lbl: labels to use instead of the measured angles
    a.quad = (q, o = {}) => {
      if (q) Q = q;
      const r = angs(), L = o.lbl || r.map((v) => v + '°');
      let s = '';
      if (o.split) s += G.poly([Q[0], Q[1], Q[2]], 'g-fill') + G.poly([Q[0], Q[2], Q[3]], 'g-fill2');
      else s += G.poly(Q);
      if (o.marks) s += o.marks(Q);
      const cls = ['g-arc', 'g-arc2', 'g-arc3', 'g-arc'];
      Q.forEach((p, i) => { s += G.arc(p, Q[(i + 3) % 4], Q[(i + 1) % 4], 24, L[i], cls[i], 44); });
      if (live) s += Q.map((p, i) => G.handle(p, i)).join('');
      a.draw(s);
      return r;
    };
    const convex = () => Q.every((p, i) => { const A = Q[(i + 3) % 4], B = Q[(i + 1) % 4]; return (p[0] - A[0]) * (B[1] - p[1]) - (p[1] - A[1]) * (B[0] - p[0]) > 0; });
    FD.dragIn(a.svg, (n, x, y) => {
      const old = Q[n]; Q[n] = [FD.clamp(Math.round(x / 5) * 5, 45, 375), FD.clamp(Math.round(y / 5) * 5, 40, 240)];
      if (!convex()) Q[n] = old;
      a.sync();
    });
    a.onSync(() => { const r = a.quad(); a.msg(`\\(${r.join('^\\circ + ')}^\\circ = 360^\\circ\\)`); });
    a.live = (on) => { live = on; };
    a.quad();
    return a;
  },
  steps: [
    {
      title: 'Two triangles inside',
      text: '<p>Draw a <b>diagonal</b>. It splits the quadrilateral into <b>two triangles</b>.</p><p>Each triangle has angles adding up to \\(180^\\circ\\), so the quadrilateral’s angles add up to \\(2 \\times 180^\\circ = 360^\\circ\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); const r = a.quad([[90, 70], [330, 50], [370, 230], [60, 220]]); if (!(await ctx.sleep(1000))) return; a.quad(null, { split: true }); a.msg(`\\(${r.join('^\\circ + ')}^\\circ = 360^\\circ\\)`); },
    },
    {
      title: 'Find the missing angle',
      text: '<p>Three angles of a quadrilateral are \\(85^\\circ\\), \\(110^\\circ\\) and \\(95^\\circ\\). Find the fourth angle \\(x\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.quad([[90, 70], [330, 50], [370, 230], [60, 220]], { lbl: ['85°', '110°', '95°', 'x'] });
        await a.play(ctx, [['85 + 110 + 95 = 290', ''], ['x = 360 - 290 = 70^\\circ', 'angles in a quadrilateral add up to 360°']]);
      },
    },
    {
      title: 'Use the properties too',
      text: '<p>In a <b>parallelogram</b>, opposite angles are equal and angles next to each other add up to \\(180^\\circ\\) (they are co-interior).</p><p>One angle is \\(64^\\circ\\). Find the others.</p>',
      tip: 'Check: 64 + 116 + 64 + 116 = 360 ✓',
      async on(a, ctx) {
        a.off(); a.live(false);
        const P = [[130, 70], [370, 70], [290, 230], [50, 230]];
        const marks = (Q) => FD.G.arrows(FD.G.lerp(Q[0], Q[1], .2), FD.G.lerp(Q[0], Q[1], .6)) + FD.G.arrows(FD.G.lerp(Q[3], Q[2], .2), FD.G.lerp(Q[3], Q[2], .6)) + FD.G.arrows(FD.G.lerp(Q[3], Q[0], .3), FD.G.lerp(Q[3], Q[0], .7), 2) + FD.G.arrows(FD.G.lerp(Q[2], Q[1], .3), FD.G.lerp(Q[2], Q[1], .7), 2);
        a.quad(P, { lbl: ['', '', '', '64°'], marks });
        await a.play(ctx, [['\\text{opposite angle} = 64^\\circ', 'opposite angles of a parallelogram are equal'], ['\\text{next angle} = 180 - 64 = 116^\\circ', 'co-interior angles add up to 180°']], 1500, (i) => a.quad(null, { lbl: i ? ['116°', '64°', '116°', '64°'] : ['', '64°', '', '64°'], marks }));
      },
    },
    {
      title: 'Algebra in a kite',
      text: '<p>A kite has one pair of equal opposite angles. Its angles are \\(x\\), \\(x\\), \\(2x\\) and \\(60^\\circ\\). Find \\(x\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.quad([[210, 40], [300, 196], [210, 220], [120, 196]], { lbl: ['60°', 'x', '2x', 'x'], marks: (Q) => FD.G.ticks(Q[0], Q[1]) + FD.G.ticks(Q[0], Q[3]) + FD.G.ticks(Q[1], Q[2], 2) + FD.G.ticks(Q[3], Q[2], 2) });
        await a.play(ctx, [['x + x + 2x + 60 = 360', 'angles in a quadrilateral'], ['4x = 300', ''], ['x = 75^\\circ', '']]);
      },
    },
    {
      title: 'Try it: any quadrilateral',
      text: '<p>Drag the corners to make any quadrilateral you like. The four angles always add up to \\(360^\\circ\\).</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'quadangles',
  gens: [
    () => { let p, q, r, x; do { p = FD.rnd(55, 140); q = FD.rnd(55, 140); r = FD.rnd(55, 140); x = 360 - p - q - r; } while (x < 40 || x > 170); return { type: 'num', q: `Three angles of a quadrilateral are \\(${p}^\\circ\\), \\(${q}^\\circ\\) and \\(${r}^\\circ\\). Work out the fourth angle.`, a: x, unit: '°', why: `Angles in a quadrilateral add up to \\(360^\\circ\\): \\(360 - ${p} - ${q} - ${r} = ${x}^\\circ\\).` }; },
    () => { const t = FD.rnd(40, 140); return { type: 'num', q: `One angle of a parallelogram is \\(${t}^\\circ\\). Work out the size of an angle <b>next to</b> it.`, a: 180 - t, unit: '°', why: `Adjacent angles in a parallelogram are co-interior, so they add up to 180°: \\(180 - ${t} = ${180 - t}^\\circ\\).` }; },
    () => { let k, c, x; do { k = FD.rnd(2, 4); c = FD.rnd(4, 14) * 5; x = (360 - c) / (k + 2); } while (x % 1 || x < 30 || x * k > 170); return { type: 'num', q: `The angles of a quadrilateral are \\(x\\), \\(x\\), \\(${k}x\\) and \\(${c}^\\circ\\). Find \\(x\\).`, a: x, why: `\\(${k + 2}x + ${c} = 360\\), so \\(${k + 2}x = ${360 - c}\\) and \\(x = ${x}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'quadangles',
  items: [
    { type: 'num', q: 'A quadrilateral has angles \\(90^\\circ\\), \\(90^\\circ\\), \\(125^\\circ\\) and \\(y\\). Find \\(y\\).', a: 55, unit: '°', why: '\\(360 - 90 - 90 - 125 = 55^\\circ\\).' },
    { type: 'mcq', q: 'Why do the angles of a quadrilateral add up to \\(360^\\circ\\)?', opts: ['A diagonal splits it into two triangles', 'It has four right angles', 'It has two pairs of parallel sides', 'Each angle is 90°'], why: '\\(2 \\times 180^\\circ = 360^\\circ\\).' },
    { type: 'num', q: 'In a parallelogram one angle is \\(73^\\circ\\). What is the angle opposite it?', a: 73, unit: '°', why: 'Opposite angles of a parallelogram are equal.' },
    { type: 'num', q: 'A trapezium has angles \\(70^\\circ\\) and \\(110^\\circ\\) along one slanted side, and \\(98^\\circ\\) at a third corner. Find the fourth angle.', a: 82, unit: '°', why: 'Along the other slanted side the angles are co-interior: \\(180 - 98 = 82^\\circ\\). Check: \\(70 + 110 + 98 + 82 = 360\\).' },
  ],
});
