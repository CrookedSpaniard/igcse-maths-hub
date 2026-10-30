// Two parallel lines cut by a transversal. The eight angles, and the F, Z and C pairs.
FD.add({
  id: 'parallel',
  title: 'Angles in parallel lines',
  tab: 'Parallel lines',
  icon: 'geometry',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Transversal', 'A line that crosses two (or more) other lines.'],
    ['Corresponding angles', 'Angles in the same position at each crossing (an F shape). Equal.'],
    ['Alternate angles', 'Angles on opposite sides of the transversal, between the parallel lines (a Z shape). Equal.'],
    ['Co-interior angles', 'Angles on the same side of the transversal, between the parallel lines (a C shape). They add up to \\(180^\\circ\\).'],
  ],
  mount(el) {
    const G = FD.G, C = [210, 160], Y1 = 105, Y2 = 215;
    const a = FD.stage(el, {
      vb: '0 0 420 320', drag: true, label: 'Two parallel lines and a transversal',
      ctrls: `<div class="row"><label>Show <select id="pr"><option value="corr">Corresponding angles (F)</option><option value="alt">Alternate angles (Z)</option><option value="co">Co-interior angles (C)</option><option value="all">All eight angles</option></select></label></div>
        <label class="ctrl">Angle \\(a\\) <input type="range" id="th" min="35" max="145" value="62"><output id="oth">62°</output></label>`,
    });
    let th = 62;
    // which: list of [crossing 0|1, quadrant 0..3, colour 1|2]; quadrants: 0 above-right, 1 above-left, 2 below-left, 3 below-right.
    a.show = (t, which = [], shape = '') => {
      th = t;
      const k = 1 / Math.tan((t * Math.PI) / 180), P = [C[0] + (C[1] - Y1) * k, Y1], Q = [C[0] - (Y2 - C[1]) * k, Y2];
      const ends = [G.polar(C, 140, t), G.polar(C, 140, t + 180)];
      const bounds = [[0, t], [t, 180], [180, 180 + t], [180 + t, 360]];
      let s = G.line([30, Y1], [390, Y1]) + G.line([30, Y2], [390, Y2]) + G.arrows([30, Y1], [390, Y1], 1, 'g-ln') + G.arrows([30, Y2], [390, Y2], 1, 'g-ln');
      which.forEach(([c, qd, col]) => {
        const v = c ? Q : P, [f, to] = bounds[qd], val = Math.round(to - f);
        s += G.sector(v, 30, f, to, col === 2 ? 'g-arc2' : 'g-arc', val + '°', 48);
      });
      s += G.line(ends[1], ends[0]);
      if (shape) s += `<path class="g-hl" opacity=".55" d="${shape(P, Q)}"/>`;
      s += G.dot(P, 'g-dot k', 4) + G.dot(Q, 'g-dot k', 4);
      if (a.q('.try') && !a.q('.try').hidden) s += G.handle(ends[0], 'r');
      a.draw(s);
      return { P, Q };
    };
    const F = (P, Q) => { const T = G.lerp(Q, P, 1.45); return `M${P[0] + 70} ${Y1}H${P[0]}M${T[0].toFixed(1)} ${T[1].toFixed(1)}L${Q[0]} ${Q[1]}H${Q[0] + 70}`; };
    const Z = (P, Q) => `M${P[0] - 70} ${Y1}H${P[0]}L${Q[0]} ${Q[1]}H${Q[0] + 70}`;
    const Cs = (P, Q) => `M${P[0] + 70} ${Y1}H${P[0]}L${Q[0]} ${Q[1]}H${Q[0] + 70}`;
    a.sets = {
      corr: [[[0, 0, 1], [1, 0, 1]], F, 'Corresponding angles are <b>equal</b> (F shape).'],
      alt: [[[0, 2, 1], [1, 0, 1]], Z, 'Alternate angles are <b>equal</b> (Z shape).'],
      co: [[[0, 3, 1], [1, 0, 2]], Cs, 'Co-interior angles <b>add up to 180°</b> (C shape).'],
      all: [[[0, 0, 1], [0, 1, 2], [0, 2, 1], [0, 3, 2], [1, 0, 1], [1, 1, 2], [1, 2, 1], [1, 3, 2]], null, 'Only <b>two different sizes</b>, and they add up to 180°.'],
    };
    FD.dragIn(a.svg, (n, x, y) => { const t = Math.round(Math.atan2(C[1] - y, x - C[0]) * 180 / Math.PI); a.q('#th').value = FD.clamp(t < 0 ? t + 180 : t, 35, 145); a.sync(); });
    a.onSync(() => {
      const t = a.val('th'), [w, sh, txt] = a.sets[a.q('#pr').value];
      a.out('th', t + '°'); a.show(t, w, sh); a.msg(txt);
    });
    a.show(62);
    return a;
  },
  steps: [
    {
      title: 'Parallel lines and a transversal',
      text: '<p><b>Parallel</b> lines never meet. They are marked with matching arrows.</p><p>A <b>transversal</b> crosses both lines and makes <b>eight angles</b>: four at each crossing.</p>',
      async on(a, ctx) {
        a.off(); a.show(62);
        if (!(await ctx.sleep(900))) return;
        a.show(62, a.sets.all[0]); a.msg(a.sets.all[2]);
      },
    },
    {
      title: 'Corresponding angles: F',
      text: '<p>Angles in the <b>same position</b> at each crossing are <b>corresponding angles</b>. They are equal.</p><p>Look for an <b>F</b> shape (it may be backwards or upside down).</p>',
      async on(a, ctx) { a.off(); for (const t of [62, 75, 50]) { a.show(t, a.sets.corr[0], a.sets.corr[1]); a.msg(a.sets.corr[2]); if (!(await ctx.sleep(1000))) return; } },
    },
    {
      title: 'Alternate angles: Z',
      text: '<p><b>Alternate angles</b> are between the parallel lines, on <b>opposite sides</b> of the transversal. They are equal.</p><p>Look for a <b>Z</b> shape.</p>',
      async on(a, ctx) { a.off(); for (const t of [62, 75, 50]) { a.show(t, a.sets.alt[0], a.sets.alt[1]); a.msg(a.sets.alt[2]); if (!(await ctx.sleep(1000))) return; } },
    },
    {
      title: 'Co-interior angles: C',
      text: '<p><b>Co-interior angles</b> (also called <b>allied</b> angles) are between the parallel lines, on the <b>same side</b> of the transversal. They <b>add up to \\(180^\\circ\\)</b>.</p><p>Look for a <b>C</b> shape.</p>',
      tip: 'Co-interior angles are the only pair that are NOT equal.',
      async on(a, ctx) { a.off(); for (const t of [62, 75, 50]) { a.show(t, a.sets.co[0], a.sets.co[1]); a.msg(a.sets.co[2]); if (!(await ctx.sleep(1000))) return; } },
    },
    {
      title: 'Worked example: give reasons',
      text: '<p>The angle above the top line on the right is \\(62^\\circ\\). Find the angle below the bottom line on the left, giving a reason for each step.</p>',
      tip: 'In the exam, “give reasons” means write the angle fact in words for every step.',
      async on(a, ctx) {
        a.off(); a.show(62, [[0, 0, 1]]);
        await a.play(ctx, [['\\text{bottom crossing, above right} = 62^\\circ', 'corresponding angles are equal'], ['\\text{bottom crossing, below left} = 62^\\circ', 'vertically opposite angles are equal']], 1500, (i) => a.show(62, i === 0 ? [[0, 0, 1], [1, 0, 1]] : [[0, 0, 1], [1, 0, 1], [1, 2, 2]]));
      },
    },
    {
      title: 'Try it: tilt the transversal',
      text: '<p>Drag the blue dot to tilt the transversal, and choose a pair of angles. Watch which angles stay equal.</p>',
      tip: 'However you tilt it, there are only two different angle sizes.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'parallel',
  gens: [
    () => { const x = FD.rnd(35, 145), [nm, ans, r] = FD.pick([['corresponding', x, 'Corresponding angles are equal'], ['alternate', x, 'Alternate angles are equal'], ['co-interior', 180 - x, 'Co-interior angles add up to 180°']]); return { type: 'num', q: `A transversal crosses two parallel lines. One angle is \\(${x}^\\circ\\). Work out the angle that is <b>${nm}</b> to it.`, a: ans, unit: '°', why: `${r}${nm === 'co-interior' ? `: \\(180 - ${x} = ${ans}^\\circ\\)` : `, so it is \\(${x}^\\circ\\)`}.` }; },
    () => { let x, m, k; do { m = FD.rnd(2, 5); k = FD.rnd(-15, 30); x = FD.rnd(10, 40); } while (m * x + k < 30 || m * x + k > 150 || k === 0); const ang = m * x + k; return { type: 'num', q: `Two co-interior angles between parallel lines are \\((${m}x ${k < 0 ? '-' : '+'} ${Math.abs(k)})^\\circ\\) and \\(${180 - ang}^\\circ\\). Find \\(x\\).`, a: x, why: `Co-interior angles add up to 180°: \\(${m}x ${k < 0 ? '-' : '+'} ${Math.abs(k)} + ${180 - ang} = 180\\), so \\(${m}x = ${m * x}\\) and \\(x = ${x}\\).` }; },
    () => FD.pick([
      { type: 'mcq', q: 'Which pair of angles in parallel lines makes a <b>Z</b> shape?', opts: ['Alternate angles', 'Corresponding angles', 'Co-interior angles', 'Vertically opposite angles'], why: 'Alternate angles: Z shape, equal.' },
      { type: 'mcq', q: 'Which pair of angles in parallel lines adds up to \\(180^\\circ\\)?', opts: ['Co-interior angles', 'Alternate angles', 'Corresponding angles', 'Vertically opposite angles'], why: 'Co-interior (allied) angles: C shape, add up to 180°.' },
      { type: 'mcq', q: 'Which pair of angles in parallel lines makes an <b>F</b> shape?', opts: ['Corresponding angles', 'Alternate angles', 'Co-interior angles', 'Angles on a straight line'], why: 'Corresponding angles: F shape, equal.' },
    ]),
  ],
});

FD.check({
  section: 'parallel',
  items: [
    { type: 'mcq', q: 'Alternate angles are…', opts: ['equal', 'add up to 180°', 'add up to 90°', 'add up to 360°'], why: 'Alternate angles (Z) are equal.' },
    { type: 'num', q: 'Two parallel lines are cut by a transversal. One co-interior angle is \\(118^\\circ\\). Find the other one.', a: 62, unit: '°', why: '\\(180 - 118 = 62^\\circ\\).' },
    { type: 'tf', q: 'Corresponding angles are only equal when the lines are parallel.', a: true, why: 'The F, Z and C facts need parallel lines.' },
    { type: 'num', q: 'Corresponding angles are \\((2x + 14)^\\circ\\) and \\(80^\\circ\\). Find \\(x\\).', a: 33, why: '\\(2x + 14 = 80\\), so \\(2x = 66\\) and \\(x = 33\\).' },
    { type: 'mcq', q: 'Which reason is written correctly for an exam?', opts: ['Alternate angles are equal', 'Z angles', 'They look the same', 'F rule'], why: 'Use the proper name of the fact. “Z angles” or “F angles” do not get the mark.' },
  ],
});
