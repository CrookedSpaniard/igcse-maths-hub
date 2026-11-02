// 3D solids: names, faces, edges and vertices. Flat-faced solids are drawn in oblique projection.

// Draws a solid from 3D vertices [x, y, z] (y goes back into the page). E: [i, j, hidden]; faces: [[indices], class]
// are filled under the edges. The drawing is scaled to fit box [x, y, w, h]. Returns the svg, the projection P and the scale k.
FD.d3 = (V, E, o = {}) => {
  const G = FD.G, box = o.box || [70, 30, 280, 240], q = ([x, y, z]) => [x + 0.383 * y, z + 0.321 * y];
  const Q = V.concat(o.fit || []).map(q), xs = Q.map((p) => p[0]), ys = Q.map((p) => p[1]);
  const mx = Math.min(...xs), Mx = Math.max(...xs), my = Math.min(...ys), My = Math.max(...ys);
  const k = Math.min(box[2] / (Mx - mx || 1), box[3] / (My - my || 1));
  const x0 = box[0] + (box[2] - (Mx - mx) * k) / 2 - mx * k, yb = box[1] + (box[3] + (My - my) * k) / 2 + my * k;
  const P = (v) => { const [a, b] = q(v); return [x0 + a * k, yb - b * k]; };
  let s = (o.faces || []).map(([f, c]) => G.poly(f.map((i) => P(V[i])), c || 'g-fill').replace('<polygon', '<polygon style="stroke:none"')).join('');
  s += E.map(([i, j, h]) => G.line(P(V[i]), P(V[j]), h ? 'g-dash' : 'g-ln')).join('');
  return { s, P, k };
};
FD.cubV = (l, w, h) => [[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0], [0, 0, h], [l, 0, h], [l, w, h], [0, w, h]];
FD.cubE = [[0, 1], [1, 2], [2, 3, 1], [3, 0, 1], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7, 1]];
FD.cubF = [[[0, 1, 5, 4], 'g-fill'], [[4, 5, 6, 7], 'g-fill2'], [[1, 2, 6, 5], 'g-arc3']];
// Triangular prism: triangle (base b, height t) at the front, length L going back.
FD.triV = (b, t, L) => [[0, 0, 0], [b, 0, 0], [b / 2, 0, t], [0, L, 0], [b, L, 0], [b / 2, L, t]];
FD.triE = [[0, 1], [1, 2], [2, 0], [3, 4, 1], [4, 5], [5, 3, 1], [0, 3, 1], [1, 4], [2, 5]];
FD.triF = [[[0, 1, 2], 'g-fill2'], [[1, 4, 5, 2], 'g-fill']];
// Upright curved solids drawn front-on: c centre of the base, r radius, h height (SVG units).
FD.cyl = (c, r, h, top = 'g-fill2') => {
  const ry = r * 0.28, [x, y] = c;
  return `<path class="g-fill" style="stroke:none" d="M${x - r} ${y} L${x - r} ${y - h} L${x + r} ${y - h} L${x + r} ${y} A${r} ${ry} 0 0 1 ${x - r} ${y} Z"/>`
    + `<path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/><path class="g-ln" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 0 ${x + r} ${y}"/>`
    + FD.G.line([x - r, y], [x - r, y - h]) + FD.G.line([x + r, y], [x + r, y - h]) + `<ellipse class="${top}" cx="${x}" cy="${y - h}" rx="${r}" ry="${ry}"/>`;
};
FD.cone = (c, r, h) => {
  const ry = r * 0.28, [x, y] = c;
  return `<path class="g-fill" d="M${x - r} ${y} L${x} ${y - h} L${x + r} ${y} A${r} ${ry} 0 0 1 ${x - r} ${y} Z"/><path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/>`;
};
FD.sph = (c, r) => {
  const [x, y] = c, ry = r * 0.28;
  return FD.G.circ(c, r, 'g-fill') + `<path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/><path class="g-ln" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 0 ${x + r} ${y}"/>`;
};

FD.SOLIDS = [
  { name: 'Cube', F: 6, E: 12, V: 8, d: () => FD.d3(FD.cubV(4, 4, 4), FD.cubE, { faces: FD.cubF }).s },
  { name: 'Cuboid', F: 6, E: 12, V: 8, d: () => FD.d3(FD.cubV(6, 3, 3.5), FD.cubE, { faces: FD.cubF }).s },
  { name: 'Triangular prism', F: 5, E: 9, V: 6, d: () => FD.d3(FD.triV(4, 3, 6), FD.triE, { faces: FD.triF }).s },
  { name: 'Square-based pyramid', F: 5, E: 8, V: 5, d: () => FD.d3([[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0], [2, 2, 4]], [[0, 1], [1, 2], [2, 3, 1], [3, 0, 1], [0, 4], [1, 4], [2, 4], [3, 4, 1]], { faces: [[[0, 1, 4], 'g-fill2'], [[1, 2, 4], 'g-fill']] }).s },
  { name: 'Triangular-based pyramid (tetrahedron)', F: 4, E: 6, V: 4, d: () => FD.d3([[0, 0, 0], [4, 0, 0], [2, 3.46, 0], [2, 1.15, 3.3]], [[0, 1], [1, 2, 1], [2, 0, 1], [0, 3], [1, 3], [2, 3, 1]], { faces: [[[0, 1, 3], 'g-fill2']] }).s },
  { name: 'Cylinder', F: 3, E: 2, V: 0, curved: true, d: () => FD.cyl([180, 235], 75, 170) },
  { name: 'Cone', F: 2, E: 1, V: 1, curved: true, d: () => FD.cone([180, 230], 85, 190) },
  { name: 'Sphere', F: 1, E: 0, V: 0, curved: true, d: () => FD.sph([180, 145], 105) },
];

FD.add({
  id: 'solids',
  title: 'Naming solids: faces, edges and vertices',
  tab: '3D solids',
  icon: 'shapes',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Face', 'A flat (or curved) surface of a solid.'],
    ['Edge', 'A line where two faces meet.'],
    ['Vertex', 'A corner, where edges meet. The plural is <b>vertices</b>.'],
    ['Prism', 'A solid with the same cross-section all the way through.'],
    ['Pyramid', 'A solid with a flat base and triangular faces that meet at one vertex (the apex).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A 3D solid drawn with its hidden edges dashed',
      ctrls: `<label class="ctrl">Solid <select id="so">${FD.SOLIDS.map((s, i) => `<option value="${i}">${s.name}</option>`).join('')}</select></label>`,
    });
    a.show = (i, extra = '') => { a.draw(FD.SOLIDS[i].d() + extra); const s = FD.SOLIDS[i]; a.big(`F = ${s.F},\\ E = ${s.E},\\ V = ${s.V}`); };
    // The cube with one face, one edge and one vertex picked out.
    a.parts = () => {
      const r = FD.d3(FD.cubV(4, 4, 4), FD.cubE, { faces: [[[0, 1, 5, 4], 'g-fill'], [[4, 5, 6, 7], 'g-fill2'], [[1, 2, 6, 5], 'g-fill']] }), P = (v) => r.P(v);
      a.draw(r.s + G.line(P([4, 0, 0]), P([4, 0, 4]), 'g-hl') + G.dot(P([4, 4, 4]), 'g-dot', 7)
        + G.t(G.mid(P([0, 0, 4]), P([4, 4, 4])), 'face', 'l') + G.t([P([4, 0, 2])[0] - 10, P([4, 0, 2])[1]], 'edge', 'l en') + G.t([P([4, 4, 4])[0] + 12, P([4, 4, 4])[1] - 6], 'vertex', 'l st'));
      a.big('F = 6,\\ E = 12,\\ V = 8');
    };
    a.onSync(() => {
      const i = a.val('so'), s = FD.SOLIDS[i];
      a.show(i);
      a.msg(s.curved ? `${s.name}: count curved surfaces as faces too.` : `Check: \\(F + V - E = ${s.F} + ${s.V} - ${s.E} = 2\\)`);
    });
    a.parts();
    return a;
  },
  steps: [
    {
      title: 'Faces, edges and vertices',
      text: '<p>A <b>cube</b> has 6 square <b>faces</b>. Two faces meet at an <b>edge</b>. Edges meet at a corner, called a <b>vertex</b>.</p><p>Hidden edges at the back are drawn <b>dashed</b>.</p>',
      on(a) { a.off(); a.parts(); },
    },
    {
      title: 'Prisms',
      text: '<p>A <b>prism</b> has the same <b>cross-section</b> all the way through. It is named after that shape.</p><p>A <b>triangular prism</b> has two triangular ends and three rectangular faces. A cuboid is a prism with a rectangle as its cross-section.</p>',
      on(a) { a.off(); a.show(2); },
    },
    {
      title: 'Pyramids',
      text: '<p>A <b>pyramid</b> has a base, and triangular faces that meet at the top vertex, the <b>apex</b>.</p><p>It is named after its base: this is a <b>square-based pyramid</b>.</p>',
      on(a) { a.off(); a.show(3); },
    },
    {
      title: 'Curved surfaces',
      text: '<p>A <b>cylinder</b> has 2 flat circular faces and 1 curved face. A <b>cone</b> has 1 flat face, 1 curved face and 1 vertex (its apex). A <b>sphere</b> has just one curved face.</p>',
      async on(a, ctx) { a.off(); for (const i of [5, 6, 7]) { a.show(i); if (!(await ctx.sleep(1600))) return; } },
    },
    {
      title: 'A useful check',
      text: '<p>For any solid with flat faces and straight edges:</p><p class="mbig">\\(F + V - E = 2\\)</p><p>Cube: \\(6 + 8 - 12 = 2\\).</p>',
      tip: 'This is Euler’s formula. Use it to check your counting.',
      on(a) { a.off(); a.show(0); a.msg('\\(6 + 8 - 12 = 2\\) ✓'); },
    },
    {
      title: 'Try it: choose a solid',
      text: '<p>Choose each solid in turn. Count its faces, edges and vertices before you look at the answer.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'solids',
  gens: [
    () => {
      const D = [['two identical triangular ends joined by three rectangles', 'Triangular prism'], ['six square faces', 'Cube'], ['a square base and four triangular faces meeting at a point', 'Square-based pyramid'], ['two circular faces and one curved face', 'Cylinder'], ['one circular face, one curved face and one vertex', 'Cone'], ['one curved face and no edges', 'Sphere'], ['four triangular faces', 'Triangular-based pyramid'], ['six rectangular faces, not all squares', 'Cuboid']];
      const [d, n] = FD.pick(D), others = D.map((x) => x[1]).filter((x) => x !== n).sort(() => Math.random() - 0.5).slice(0, 3);
      return { type: 'mcq', q: `A solid has ${d}. What is it called?`, opts: [n, ...others], why: `It is a ${n.toLowerCase()}.` };
    },
    () => {
      const n = FD.rnd(3, 8), names = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' }, pr = FD.pick([true, false]), what = FD.pick(['faces', 'edges', 'vertices']);
      const v = pr ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
      return { type: 'num', q: `How many ${what} does a ${pr ? 'prism' : 'pyramid'} have if its ${pr ? 'cross-section' : 'base'} is a ${names[n]}?`, a: v, why: pr ? `Two ${names[n]} ends and ${n} rectangles: ${n + 2} faces, ${3 * n} edges (${n} + ${n} + ${n}), ${2 * n} vertices.` : `A ${names[n]} base and ${n} triangles: ${n + 1} faces, ${2 * n} edges, ${n + 1} vertices (including the apex).` };
    },
    () => { const n = FD.rnd(3, 10), F = n + 2, V = 2 * n; return { type: 'num', q: `A solid with flat faces has \\(${F}\\) faces and \\(${V}\\) vertices. Use \\(F + V - E = 2\\) to work out how many edges it has.`, a: F + V - 2, why: `\\(E = F + V - 2 = ${F} + ${V} - 2 = ${F + V - 2}\\).` }; },
  ],
});

FD.check({
  section: 'solids',
  items: [
    { type: 'num', q: 'How many edges does a cuboid have?', a: 12, why: '4 on top, 4 on the bottom and 4 going up.' },
    { type: 'num', q: 'How many vertices does a square-based pyramid have?', a: 5, why: '4 on the base and the apex.' },
    { type: 'mcq', q: 'A solid with the same cross-section all the way through is a…', opts: ['prism', 'pyramid', 'sphere', 'cone'], why: 'That is what a prism is.' },
    { type: 'tf', q: 'A triangular prism has 6 faces.', a: false, why: '2 triangles + 3 rectangles = 5 faces.' },
  ],
});
