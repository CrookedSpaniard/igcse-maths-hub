// Reasoning with polygons: a regular pentagon and one of its diagonals.
FD.add({
  id: 'polyreasons',
  title: 'Reasoning with polygons',
  tab: 'Polygons',
  icon: 'shapes',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Regular polygon', 'All sides equal and all angles equal. Each exterior angle is \\(360^\\circ \\div n\\).'],
    ['Diagonal', 'A line joining two vertices that are not next to each other.'],
  ],
  mount(el) {
    const G = FD.G, c = [210, 165], V = [162, 90, 18, 306, 234].map((t) => G.polar(c, 115, t)), [A, B, C, D, E] = V;
    return FD.chain(el, {
      label: 'A regular pentagon ABCDE with the diagonal AC',
      steps: [['\\text{exterior angle} = 360 \\div 5 = 72^\\circ', 10], ['\\angle ABC = 180 - 72 = 108^\\circ', 1], ['\\angle BAC = (180 - 108) \\div 2 = 36^\\circ', 8]],
      options: [1, 2, 7, 8, 9, 10],
      draw: (k) => {
        const X = G.lerp(A, B, 1.35);
        let s = G.poly(V) + G.line(A, C, 'g-hl2') + G.ticks(A, B) + G.ticks(B, C);
        if (k >= 1) s += G.line(B, X, 'g-dash') + G.arc(B, X, C, 22, '72°', 'g-arc3', 40);
        s += G.arc(B, A, C, 24, k >= 2 ? '108°' : '', 'g-arc2', 42) + G.arc(A, B, C, 30, k >= 3 ? '36°' : 'x', 'g-arc', 52);
        return s + ['A', 'B', 'C', 'D', 'E'].map((n, i) => G.t(G.polar(c, 134, [162, 90, 18, 306, 234][i]), n)).join('');
      },
    });
  },
  steps: [
    {
      title: 'A pentagon problem',
      text: '<p>\\(ABCDE\\) is a <b>regular pentagon</b>. \\(AC\\) is a diagonal. Find angle \\(x = \\angle BAC\\), giving reasons.</p><p>Plan: find the interior angle first, then use triangle \\(ABC\\).</p>',
      on(a) { a.off(); a.show(0); },
    },
    {
      title: 'Build the chain',
      text: '<p>Exterior angle → interior angle → isosceles triangle. \\(AB = BC\\) because the pentagon is regular, so triangle \\(ABC\\) is isosceles.</p>',
      tip: 'You could also use (5 − 2) × 180 = 540 and 540 ÷ 5 = 108: “the angles of a pentagon add up to 540°”.',
      async on(a, ctx) { a.off(); await a.walk(ctx); },
    },
    {
      title: 'Try it: choose the reasons',
      text: '<p>Choose the reason for each step of the chain, then check.</p>',
      on(a) { a.show(0); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'polyreasons',
  gens: [
    () => { const n = FD.pick([5, 6, 8, 9, 10, 12]), i = 180 - 360 / n, x = (180 - i) / 2; return { type: 'num', q: `\\(ABC\\ldots\\) is a regular polygon with ${n} sides. \\(A\\), \\(B\\), \\(C\\) are next to each other. Work out \\(\\angle BAC\\).`, a: x, unit: '°', why: `Exterior angle \\(= 360 \\div ${n} = ${360 / n}^\\circ\\) (exterior angles add up to 360°). \\(\\angle ABC = 180 - ${360 / n} = ${i}^\\circ\\) (angles on a straight line). \\(AB = BC\\), so \\(\\angle BAC = (180 - ${i}) \\div 2 = ${x}^\\circ\\) (base angles of an isosceles triangle are equal).` }; },
    () => { let p, q; do { p = FD.rnd(60, 130); q = FD.rnd(60, 130); } while (p + q > 250 || p + q < 160); const r = 360 - p - q - 90; return { type: 'num', q: `A quadrilateral has angles \\(${p}^\\circ\\), \\(${q}^\\circ\\), a right angle, and \\(x\\). Work out the exterior angle next to \\(x\\).`, a: 180 - r, unit: '°', why: `\\(x = 360 - ${p} - ${q} - 90 = ${r}^\\circ\\) (angles in a quadrilateral add up to 360°). Exterior angle \\(= 180 - ${r} = ${180 - r}^\\circ\\) (angles on a straight line add up to 180°).` }; },
  ],
});

FD.check({
  section: 'polyreasons',
  items: [
    { type: 'mcq', q: 'In a regular hexagon you write “exterior angle \\(= 360 \\div 6 = 60^\\circ\\)”. The reason is…', opts: ['Exterior angles of a polygon add up to 360°', 'Angles around a point add up to 360°', 'Angles in a quadrilateral add up to 360°', 'Angles on a straight line add up to 180°'], why: 'The exterior angles of any polygon add up to 360°.' },
    { type: 'num', q: '\\(ABCDEF\\) is a regular hexagon. Work out \\(\\angle BAC\\).', a: 30, unit: '°', why: 'Interior \\(120^\\circ\\); \\((180 - 120) \\div 2 = 30^\\circ\\).' },
    { type: 'tf', q: 'In a regular polygon, the triangle made by two neighbouring sides and a diagonal is isosceles.', a: true, why: 'The two sides are equal because the polygon is regular.' },
    { type: 'num', q: 'Each interior angle of a regular polygon is \\(140^\\circ\\). How many sides does it have?', a: 9, why: 'Exterior \\(40^\\circ\\); \\(360 \\div 40 = 9\\).' },
  ],
});
