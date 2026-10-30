// Interior angles: split an n-sided polygon into (n − 2) triangles from one corner.
FD.PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 11: '11-sided polygon', 12: '12-sided polygon (dodecagon)' };
// Vertices of an n-gon centred at c, radius r; wobble > 0 makes it irregular (same shape every time for the same n).
FD.ngon = (n, c = [210, 150], r = 112, wobble = 0) => Array.from({ length: n }, (_, i) => FD.G.polar(c, r * (1 - wobble * (((i * 7 + n) % 5) / 5)), 90 + (360 * i) / n + (wobble ? ((i * 13) % 7) * 3 : 0)));

FD.add({
  id: 'interior',
  title: 'Interior angles of polygons',
  tab: 'Interior angles',
  icon: 'shapes',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Polygon', 'A closed flat shape with straight sides. Pentagon 5, hexagon 6, heptagon 7, octagon 8, nonagon 9, decagon 10.'],
    ['Regular polygon', 'All sides equal and all angles equal.'],
    ['Interior angle', 'An angle inside the polygon at a vertex.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A polygon split into triangles from one corner',
      ctrls: `<label class="ctrl">Number of sides \\(n\\) <input type="range" id="n" min="3" max="12" value="6"><output id="on">6</output></label>
        <div class="row"><label><input type="checkbox" id="irr"> Make it irregular</label></div>`,
    });
    a.show = (n, k = n - 2, wob = 0) => {
      const P = FD.ngon(n, [210, 150], 120, wob);
      let s = G.poly(P, 'g-fill');
      for (let i = 1; i <= Math.min(k, n - 2); i++) s += `<polygon class="${i % 2 ? 'g-fill2' : 'g-fill'} g-in" points="${[P[0], P[i], P[i + 1]].map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
      for (let i = 2; i < n - 1 && i <= k; i++) s += G.line(P[0], P[i], 'g-thin');
      s += G.dot(P[0], 'g-dot', 6);
      if (k >= n - 2) for (let i = 1; i <= n - 2; i++) s += G.t(G.lerp(G.mid(P[i], P[i + 1]), P[0], 0.33), i, 's');
      a.draw(s);
    };
    a.onSync(() => {
      const n = a.val('n'), irr = a.q('#irr').checked;
      a.out('n', n); a.show(n, n - 2, irr ? 0.3 : 0);
      a.big(`(${n} - 2) \\times 180^\\circ = ${(n - 2) * 180}^\\circ`);
      a.msg(`A ${FD.PNAME[n]} splits into <b>${n - 2} triangles</b>.${irr ? ' Irregular: the angles are different, but the sum is the same.' : ` Regular: each angle is \\(${(n - 2) * 180} \\div ${n} = ${FD.tn(FD.round(((n - 2) * 180) / n, 2))}^\\circ\\).`}`);
    });
    a.show(6);
    return a;
  },
  steps: [
    {
      title: 'Split it into triangles',
      text: '<p>Choose one corner and draw every diagonal from it. A hexagon (6 sides) splits into <b>4 triangles</b>.</p><p>The triangles’ angles make up all the interior angles, so the sum is \\(4 \\times 180^\\circ = 720^\\circ\\).</p>',
      async on(a, ctx) { a.off(); for (let k = 0; k <= 4; k++) { a.show(6, k); if (!(await ctx.sleep(800))) return; } a.big('4 \\times 180^\\circ = 720^\\circ'); },
    },
    {
      title: 'Always two fewer triangles',
      text: '<p>A polygon with \\(n\\) sides splits into \\(n - 2\\) triangles. So:</p><p class="mbig">\\(\\text{sum of interior angles} = (n - 2) \\times 180^\\circ\\)</p>',
      async on(a, ctx) {
        a.off();
        for (const n of [4, 5, 6, 8, 10]) { a.show(n); a.big(`n = ${n}: \\ (${n} - 2) \\times 180^\\circ = ${(n - 2) * 180}^\\circ`); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'One angle of a regular polygon',
      text: '<p>In a <b>regular</b> polygon all the angles are equal, so divide the sum by the number of angles.</p><p>Regular octagon:</p>',
      async on(a, ctx) {
        a.off(); a.show(8);
        await a.play(ctx, [['\\text{sum} = (8 - 2) \\times 180 = 1080^\\circ', ''], ['\\text{each angle} = 1080 \\div 8 = 135^\\circ', 'all 8 angles are equal']]);
      },
    },
    {
      title: 'Find a missing angle',
      text: '<p>A pentagon has angles \\(100^\\circ\\), \\(120^\\circ\\), \\(95^\\circ\\), \\(110^\\circ\\) and \\(x\\). Find \\(x\\).</p>',
      tip: 'This works for any polygon, regular or not.',
      async on(a, ctx) {
        a.off(); a.show(5, 3, 0.3);
        await a.play(ctx, [['\\text{sum} = (5 - 2) \\times 180 = 540^\\circ', ''], ['x = 540 - (100 + 120 + 95 + 110)', ''], ['x = 540 - 425 = 115^\\circ', '']]);
      },
    },
    {
      title: 'Try it: change the number of sides',
      text: '<p>Use the slider to change the number of sides. Count the triangles and watch the angle sum.</p><p>Tick <b>irregular</b> to check that the sum does not depend on the shape.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'interior',
  gens: [
    () => { const n = FD.rnd(5, 20); return { type: 'num', q: `Work out the sum of the interior angles of a polygon with ${n} sides${FD.PNAME[n] && n <= 10 ? ` (a ${FD.PNAME[n]})` : ''}.`, a: (n - 2) * 180, unit: '°', why: `\\((${n} - 2) \\times 180 = ${n - 2} \\times 180 = ${(n - 2) * 180}^\\circ\\).` }; },
    () => { const n = FD.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]); return { type: 'num', q: `Work out the size of one interior angle of a regular polygon with ${n} sides.`, a: ((n - 2) * 180) / n, unit: '°', why: `Sum \\(= (${n} - 2) \\times 180 = ${(n - 2) * 180}^\\circ\\). Each angle \\(= ${(n - 2) * 180} \\div ${n} = ${((n - 2) * 180) / n}^\\circ\\).` }; },
    () => { const n = FD.pick([5, 6]); const S = (n - 2) * 180; let ang, x; do { ang = Array.from({ length: n - 1 }, () => FD.rnd(90, 150)); x = S - ang.reduce((p, q) => p + q, 0); } while (x < 70 || x > 170); return { type: 'num', q: `A ${FD.PNAME[n]} has angles ${ang.map((v) => `\\(${v}^\\circ\\)`).join(', ')} and \\(x\\). Find \\(x\\).`, a: x, unit: '°', why: `Sum \\(= (${n} - 2) \\times 180 = ${S}^\\circ\\). \\(x = ${S} - ${ang.reduce((p, q) => p + q, 0)} = ${x}^\\circ\\).` }; },
    () => { const n = FD.rnd(5, 14); return { type: 'num', q: `The interior angles of a polygon add up to \\(${(n - 2) * 180}^\\circ\\). How many sides does it have?`, a: n, why: `\\(${(n - 2) * 180} \\div 180 = ${n - 2}\\) triangles, so \\(n - 2 = ${n - 2}\\) and \\(n = ${n}\\).` }; },
  ],
});

FD.check({
  section: 'interior',
  items: [
    { type: 'num', q: 'Work out the sum of the interior angles of a heptagon (7 sides).', a: 900, unit: '°', why: '\\((7 - 2) \\times 180 = 900^\\circ\\).' },
    { type: 'num', q: 'Work out one interior angle of a regular hexagon.', a: 120, unit: '°', why: '\\(720 \\div 6 = 120^\\circ\\).' },
    { type: 'mcq', q: 'Why is the formula \\((n - 2) \\times 180^\\circ\\)?', opts: ['Diagonals from one corner make \\(n - 2\\) triangles', 'Each angle is 180° minus 2', 'There are \\(n - 2\\) right angles', 'Two of the angles are always 180°'], why: 'From one vertex you can draw diagonals that make \\(n - 2\\) triangles.' },
    { type: 'num', q: 'The interior angles of a polygon add up to \\(1440^\\circ\\). How many sides has it?', a: 10, why: '\\(1440 \\div 180 = 8\\), so \\(n - 2 = 8\\) and \\(n = 10\\).' },
  ],
});
