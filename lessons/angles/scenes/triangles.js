// A triangle with draggable corners: the angle sum, the exterior angle and special triangles.
FD.add({
  id: 'triangles',
  title: 'Angles in triangles',
  tab: 'Triangles',
  icon: 'shapes',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Interior angle', 'An angle inside the shape, at a corner (vertex).'],
    ['Exterior angle', 'The angle between one side and the next side extended outwards.'],
    ['Isosceles', 'Two equal sides and two equal base angles.'],
    ['Equilateral', 'Three equal sides and three angles of \\(60^\\circ\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, { vb: '0 0 420 300', drag: true, label: 'A triangle with its three angles', ctrls: '<p class="small">Drag the three corners of the triangle.</p>' });
    let T = { A: [70, 250], B: [350, 250], C: [230, 70] }, live = false;
    const angs = () => { const x = Math.round(G.deg(T.A, T.B, T.C)), y = Math.round(G.deg(T.B, T.A, T.C)); return [x, y, 180 - x - y]; };
    // opts: proof (parallel line through C), ext (exterior angle at B), ticks (isosceles marks: 'iso' | 'eq')
    a.tri = (t, o = {}) => {
      if (t) T = { A: t[0], B: t[1], C: t[2] };
      const { A, B, C } = T, [x, y, z] = angs();
      let s = G.poly([A, B, C]);
      if (o.ext) { const D = G.lerp(A, B, 1.28); s += G.line(B, D, 'g-dash') + G.arc(B, D, C, 34, (x + z) + '°', 'g-arc3', 54); }
      s += G.arc(A, B, C, 30, x + '°', 'g-arc2', 50) + G.arc(B, A, C, 30, o.ext === 'hide' ? '' : y + '°', 'g-arc', 50);
      if (o.proof) {
        const L = [C[0] - 140, C[1]], R = [C[0] + 140, C[1]];
        s += G.line(L, R, 'g-ln') + G.arrows([C[0] - 120, C[1]], [C[0] - 40, C[1]]) + G.arrows(A, B) + G.arc(C, L, A, 30, x + '°', 'g-arc2', 48) + G.arc(C, R, B, 30, y + '°', 'g-arc', 48);
      }
      s += G.arc(C, A, B, o.proof ? 22 : 30, z + '°', 'g-arc3', o.proof ? 38 : 50);
      if (o.ticks) { s += G.ticks(A, C) + G.ticks(B, C); if (o.ticks === 'eq') s += G.ticks(A, B); }
      if (live) s += ['A', 'B', 'C'].map((k) => G.handle(T[k], k)).join('');
      a.draw(s);
      return [x, y, z];
    };
    FD.dragIn(a.svg, (n, px, py) => { T[n] = [FD.clamp(Math.round(px / 5) * 5, 40, 380), FD.clamp(Math.round(py / 5) * 5, 40, 260)]; a.sync(); });
    a.onSync(() => {
      const [x, y, z] = a.tri();
      const d = (FD.G.deg(T.A, T.B, T.C) + FD.G.deg(T.B, T.A, T.C));
      if (d < 3 || d > 177) { a.msg('That is almost a straight line. Pull a corner out.', 'bad'); return; }
      const eq = (p, q) => Math.abs(p - q) < 1;
      const kind = eq(x, y) && eq(y, z) ? 'equilateral' : eq(x, y) || eq(y, z) || eq(x, z) ? 'isosceles' : 'scalene';
      const big = Math.max(x, y, z), how = big === 90 ? 'right-angled' : big > 90 ? 'obtuse-angled' : 'acute-angled';
      a.msg(`\\(${x}^\\circ + ${y}^\\circ + ${z}^\\circ = 180^\\circ\\). This triangle is <b>${kind}</b> and <b>${how}</b>.`);
    });
    a.live = (on) => { live = on; };
    a.tri();
    return a;
  },
  steps: [
    {
      title: 'The angles of a triangle add up to 180°',
      text: '<p>Whatever its shape, the three angles inside a triangle <b>add up to \\(180^\\circ\\)</b>.</p>',
      async on(a, ctx) {
        a.off(); a.live(false);
        for (const t of [[[70, 250], [350, 250], [230, 70]], [[60, 250], [300, 250], [110, 90]], [[90, 240], [370, 200], [250, 60]]]) {
          const [x, y, z] = a.tri(t); a.msg(`\\(${x}^\\circ + ${y}^\\circ + ${z}^\\circ = 180^\\circ\\)`);
          if (!(await ctx.sleep(1500))) return;
        }
      },
    },
    {
      title: 'Why? Use a parallel line',
      text: '<p>Draw a line through the top corner, <b>parallel</b> to the bottom side.</p><p>The two new angles are <b>alternate angles</b>, so they equal the two bottom angles. The three angles at the top make a <b>straight line</b>: \\(180^\\circ\\).</p>',
      tip: 'This is a proof: it works for every triangle, not just the ones we measured.',
      async on(a, ctx) { a.off(); a.live(false); a.tri([[70, 250], [350, 250], [230, 80]]); if (!(await ctx.sleep(900))) return; a.tri(null, { proof: true }); a.msg('Alternate angles are equal, and angles on a straight line add up to 180°.'); },
    },
    {
      title: 'The exterior angle',
      text: '<p>Extend one side. The <b>exterior angle</b> equals the <b>sum of the two opposite interior angles</b>.</p><p>Here the exterior angle is \\(52^\\circ + 74^\\circ = 126^\\circ\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.tri([[60, 250], [300, 250], [184.4, 90.8]], { ext: 'hide' });
        await a.play(ctx, [['\\text{interior angle at the corner} = 180 - 52 - 74 = 54^\\circ', 'angles in a triangle'], ['\\text{exterior angle} = 180 - 54 = 126^\\circ', 'angles on a straight line'], ['126 = 52 + 74', 'exterior angle = sum of the opposite interior angles']], 1500, (i) => { if (i === 2) a.tri(null, { ext: true }); });
      },
    },
    {
      title: 'Isosceles and equilateral triangles',
      text: '<p>An <b>isosceles</b> triangle has two equal sides (marked with dashes) and two equal <b>base angles</b>.</p><p>If the top angle is \\(40^\\circ\\), each base angle is \\((180 - 40) \\div 2 = 70^\\circ\\).</p>',
      tip: 'An equilateral triangle has three equal sides, so every angle is 180 ÷ 3 = 60°.',
      async on(a, ctx) {
        a.off(); a.live(false); a.tri([[127, 250], [293, 250], [210, 22]], { ticks: 'iso' });
        if (!(await a.play(ctx, [['180 - 40 = 140', 'angles in a triangle add up to 180°'], ['140 \\div 2 = 70^\\circ', 'base angles of an isosceles triangle are equal']], 1500))) return;
        a.tri([[110, 250], [310, 250], [210, 77]], { ticks: 'eq' }); a.msg('Equilateral: three angles of \\(60^\\circ\\).');
      },
    },
    {
      title: 'Try it: drag the corners',
      text: '<p>Drag the corners to make different triangles. The sum is always \\(180^\\circ\\).</p><p>Can you make an <b>isosceles</b> triangle? A <b>right-angled</b> one?</p>',
      tip: 'Corners snap to a grid, so you can make exact angles.',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'triangles',
  gens: [
    () => { let p, q; do { p = FD.rnd(25, 110); q = FD.rnd(20, 100); } while (p + q > 160); return { type: 'num', q: `Two angles of a triangle are \\(${p}^\\circ\\) and \\(${q}^\\circ\\). Work out the third angle.`, a: 180 - p - q, unit: '°', why: `Angles in a triangle add up to \\(180^\\circ\\): \\(180 - ${p} - ${q} = ${180 - p - q}^\\circ\\).` }; },
    () => { const top = 2 * FD.rnd(10, 60); return { type: 'num', q: `An isosceles triangle has a top (apex) angle of \\(${top}^\\circ\\). Work out the size of one base angle.`, a: (180 - top) / 2, unit: '°', why: `\\(180 - ${top} = ${180 - top}\\), and the two base angles are equal: \\(${180 - top} \\div 2 = ${(180 - top) / 2}^\\circ\\).` }; },
    () => { let p, q; do { p = FD.rnd(25, 90); q = FD.rnd(25, 90); } while (p + q > 160); return { type: 'num', q: `In a triangle, two interior angles are \\(${p}^\\circ\\) and \\(${q}^\\circ\\). Work out the exterior angle at the third corner.`, a: p + q, unit: '°', why: `The exterior angle equals the sum of the two opposite interior angles: \\(${p} + ${q} = ${p + q}^\\circ\\).` }; },
    () => { const b = FD.rnd(25, 80); return { type: 'num', q: `An isosceles triangle has a base angle of \\(${b}^\\circ\\). Work out the top (apex) angle.`, a: 180 - 2 * b, unit: '°', why: `Both base angles are \\(${b}^\\circ\\): \\(180 - 2 \\times ${b} = ${180 - 2 * b}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'triangles',
  items: [
    { type: 'num', q: 'A triangle has angles \\(47^\\circ\\), \\(68^\\circ\\) and \\(x\\). Find \\(x\\).', a: 65, unit: '°', why: '\\(180 - 47 - 68 = 65^\\circ\\).' },
    { type: 'num', q: 'The angles of a triangle are \\(x\\), \\(2x\\) and \\(3x\\). Find \\(x\\).', a: 30, unit: '°', why: '\\(6x = 180\\), so \\(x = 30^\\circ\\).' },
    { type: 'mcq', q: 'An isosceles triangle has a base angle of \\(35^\\circ\\). What is the third angle?', opts: ['\\(110^\\circ\\)', '\\(35^\\circ\\)', '\\(145^\\circ\\)', '\\(72.5^\\circ\\)'], why: '\\(180 - 35 - 35 = 110^\\circ\\).' },
    { type: 'tf', q: 'A triangle can have two obtuse angles.', a: false, why: 'Two obtuse angles already add up to more than 180°.' },
    { type: 'num', q: 'Two interior angles are \\(58^\\circ\\) and \\(71^\\circ\\). What is the exterior angle at the third corner?', a: 129, unit: '°', why: '\\(58 + 71 = 129^\\circ\\).' },
  ],
});
