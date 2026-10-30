// Multi-step problems: each new angle is found with one fact, and the reason is written down.
FD.add({
  id: 'problems',
  title: 'Multi-step angle problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Give reasons', 'Write the angle fact you used, in words, for every angle you find.'],
    ['Base angles', 'The two equal angles of an isosceles triangle.'],
  ],
  mount(el) {
    const G = FD.G;
    const R = ['Choose a reason…', 'Alternate angles are equal', 'Corresponding angles are equal', 'Co-interior angles add up to 180°', 'Angles in a triangle add up to 180°', 'Angles on a straight line add up to 180°'];
    const sel = (id) => `<select id="${id}">${R.map((r, i) => `<option value="${i}">${r}</option>`).join('')}</select>`;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'Angle problem diagram',
      ctrls: `<div class="row"><span>\\(\\angle PQR = 64^\\circ\\) because</span>${sel('r1')}</div>
        <div class="row"><span>\\(x = 180 - 64 - 48 = 68^\\circ\\) because</span>${sel('r2')}</div>
        <div class="chk-btns"><button class="btn" id="go">Check my reasons</button></div>`,
    });
    // Problem 1: P on the top line, Q and R on the bottom line.
    const P = [200, 80], Q = [122, 240], Rr = [344, 240];
    const p1 = (k) => {
      let s = G.line([30, 80], [400, 80]) + G.line([30, 240], [400, 240]) + G.arrows([60, 80], [160, 80], 1, 'g-ln') + G.arrows([60, 240], [100, 240], 1, 'g-ln') + G.poly([P, Q, Rr]);
      s += G.arc(P, [60, 80], Q, 30, '64°', 'g-arc2', 48) + G.arc(Rr, Q, P, 30, '48°', 'g-arc', 48) + G.arc(P, Q, Rr, 26, k >= 2 ? '68°' : 'x', 'g-arc3', 44);
      if (k >= 1) s += G.arc(Q, Rr, P, 30, '64°', 'g-arc2', 48);
      s += G.t([P[0], P[1] - 16], 'P') + G.t([Q[0] - 14, Q[1] + 16], 'Q') + G.t([Rr[0] + 14, Rr[1] + 16], 'R');
      a.draw(s);
    };
    // Problem 2: isosceles ABC (AB = AC), BC extended to D.
    const A = [190, 78], B = [110, 250], C = [270, 250], D = [390, 250];
    const p2 = (k) => {
      let s = G.poly([A, B, C]) + G.line(C, D) + G.ticks(A, B) + G.ticks(A, C);
      s += G.arc(A, B, C, 28, '50°', 'g-arc', 46);
      if (k >= 1) s += G.arc(B, C, A, 28, '65°', 'g-arc2', 46) + G.arc(C, B, A, 28, '65°', 'g-arc2', 46);
      s += G.arc(C, D, A, 22, k >= 3 ? '115°' : 'y', 'g-arc3', 42);
      s += G.t([A[0], A[1] - 16], 'A') + G.t([B[0] - 14, B[1] + 14], 'B') + G.t([C[0], C[1] + 18], 'C') + G.t([D[0] - 4, D[1] + 18], 'D');
      a.draw(s);
    };
    a.p1 = p1; a.p2 = p2;
    a.q('#go').addEventListener('click', () => {
      const ok1 = a.q('#r1').value === '1', ok2 = a.q('#r2').value === '4';
      a.msg(ok1 && ok2 ? '✓ Both reasons are correct. Full marks for reasoning!' : `${ok1 ? '✓' : '✗'} first reason · ${ok2 ? '✓' : '✗'} second reason. ${!ok1 ? 'Look for the Z shape between the parallel lines.' : 'The 68° comes from the three angles of triangle PQR.'}`, ok1 && ok2 ? 'good' : 'bad');
      p1(ok1 && ok2 ? 2 : ok1 ? 1 : 0);
    });
    a.onSync(() => { a.msg(''); });
    p1(0);
    return a;
  },
  steps: [
    {
      title: 'Plan a chain of facts',
      text: '<p>Harder questions need <b>more than one fact</b>. Find any angle you can, mark it on the diagram, then use it to find the next one.</p><p>Here the lines are parallel. Find \\(x\\).</p>',
      tip: 'Always mark the angles you find on the diagram. It helps you see the next step.',
      on(a) { a.off(); a.p1(0); },
    },
    {
      title: 'Worked example 1',
      text: '<p>\\(64^\\circ\\) and \\(\\angle PQR\\) make a <b>Z</b> shape, so they are alternate angles.</p><p>Then use the triangle \\(PQR\\).</p>',
      async on(a, ctx) {
        a.off(); a.p1(0);
        await a.play(ctx, [['\\angle PQR = 64^\\circ', 'alternate angles are equal'], ['x = 180 - 64 - 48', 'angles in a triangle add up to 180°'], ['x = 68^\\circ', '']], 1500, (i) => a.p1(i === 0 ? 1 : i === 2 ? 2 : 1));
      },
    },
    {
      title: 'Worked example 2',
      text: '<p>\\(AB = AC\\), so triangle \\(ABC\\) is <b>isosceles</b>. \\(BCD\\) is a straight line. Find \\(y\\).</p>',
      async on(a, ctx) {
        a.off(); a.p2(0);
        if (!(await ctx.sleep(800))) return;
        await a.play(ctx, [['\\angle ABC = \\angle ACB = (180 - 50) \\div 2 = 65^\\circ', 'base angles of an isosceles triangle are equal'], ['y = 180 - 65', 'angles on a straight line add up to 180°'], ['y = 115^\\circ', '']], 1600, (i) => a.p2(i === 0 ? 1 : i === 2 ? 3 : 1));
      },
    },
    {
      title: 'Try it: choose the reasons',
      text: '<p>Back to problem 1. Choose the correct reason for each line, then press <b>Check my reasons</b>.</p>',
      tip: 'Exam mark schemes give a mark for each correct reason, written with the proper name.',
      on(a) { a.p1(0); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'problems',
  gens: [
    () => { let t, b; do { t = FD.rnd(30, 80); b = FD.rnd(35, 80); } while (t + b > 150); return { type: 'num', q: `Two lines are parallel. Triangle \\(PQR\\) has \\(P\\) on the top line and \\(Q\\), \\(R\\) on the bottom line, like problem 1. The angle between the top line and \\(PQ\\) is \\(${t}^\\circ\\) and \\(\\angle PRQ = ${b}^\\circ\\). Work out \\(\\angle QPR\\).`, a: 180 - t - b, unit: '°', why: `\\(\\angle PQR = ${t}^\\circ\\) (alternate angles are equal). \\(\\angle QPR = 180 - ${t} - ${b} = ${180 - t - b}^\\circ\\) (angles in a triangle add up to 180°).` }; },
    () => { const top = 2 * FD.rnd(12, 55), base = (180 - top) / 2; return { type: 'num', q: `Triangle \\(ABC\\) is isosceles with \\(AB = AC\\) and \\(\\angle BAC = ${top}^\\circ\\). \\(BC\\) is extended to \\(D\\). Work out \\(\\angle ACD\\).`, a: 180 - base, unit: '°', why: `Base angles: \\((180 - ${top}) \\div 2 = ${base}^\\circ\\) (base angles of an isosceles triangle are equal). \\(\\angle ACD = 180 - ${base} = ${180 - base}^\\circ\\) (angles on a straight line).` }; },
    () => { let p, q; do { p = FD.rnd(25, 80); q = FD.rnd(25, 80); } while (p + q > 150); const c = 180 - p - q; return { type: 'num', q: `In triangle \\(ABC\\), \\(\\angle A = ${p}^\\circ\\) and \\(\\angle B = ${q}^\\circ\\). Work out the <b>reflex</b> angle at \\(C\\) (outside the triangle).`, a: 360 - c, unit: '°', why: `\\(\\angle ACB = 180 - ${p} - ${q} = ${c}^\\circ\\) (angles in a triangle). Reflex angle \\(= 360 - ${c} = ${360 - c}^\\circ\\) (angles around a point add up to 360°).` }; },
  ],
});

FD.check({
  section: 'problems',
  items: [
    { type: 'mcq', q: 'In an isosceles triangle \\(ABC\\), \\(AB = AC\\) and \\(\\angle ABC = 70^\\circ\\). What is \\(\\angle BAC\\)?', opts: ['\\(40^\\circ\\)', '\\(70^\\circ\\)', '\\(55^\\circ\\)', '\\(110^\\circ\\)'], why: '\\(\\angle ACB = 70^\\circ\\) too, so \\(180 - 140 = 40^\\circ\\).' },
    { type: 'num', q: 'Triangle \\(ABC\\): \\(\\angle A = 38^\\circ\\), \\(\\angle B = 77^\\circ\\). \\(BC\\) is extended to \\(D\\). Work out \\(\\angle ACD\\).', a: 115, unit: '°', why: 'Exterior angle = \\(38 + 77 = 115^\\circ\\).' },
    { type: 'multi', q: 'Choose the <b>two</b> reasons that are written correctly.', need: 2, opts: [['Alternate angles are equal', true], ['Angles on a straight line add up to 180°', true], ['Z angles are the same', false], ['Because it is parallel', false]], why: 'Give the full fact with its proper name.' },
    { type: 'num', q: 'A transversal crosses two parallel lines. An angle of \\(130^\\circ\\) is corresponding to angle \\(p\\), and \\(p\\) and \\(q\\) are on a straight line. Find \\(q\\).', a: 50, unit: '°', why: '\\(p = 130^\\circ\\) (corresponding), \\(q = 180 - 130 = 50^\\circ\\) (straight line).' },
  ],
});
