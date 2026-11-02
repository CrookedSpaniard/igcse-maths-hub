// Nets and surface area: unfold a cuboid, a triangular prism and a cylinder, then add the areas of the faces.

// A net drawn from pieces in maths coordinates (y up), fitted to the stage: {r: [x, y, w, h]}, {p: [[x, y], …]} or
// {c: [x, y, radius]}, each with a class cls and a label t written at its centre (or at `at`). The net spans y from ymin to ymin + H.
FD.net = (items, W, H, box = [25, 20, 370, 260], ymin = 0) => {
  const G = FD.G, k = Math.min(box[2] / W, box[3] / H), x0 = box[0] + (box[2] - W * k) / 2, y0 = box[1] + (box[3] + H * k) / 2 + ymin * k;
  const P = ([x, y]) => [x0 + x * k, y0 - y * k];
  return items.map((it) => {
    let s, m;
    if (it.r) { const [x, y, w, h] = it.r; s = G.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(P), it.cls || 'g-fill'); m = [x + w / 2, y + h / 2]; }
    else if (it.p) { s = G.poly(it.p.map(P), it.cls || 'g-fill'); m = it.p.reduce((a, p) => [a[0] + p[0] / it.p.length, a[1] + p[1] / it.p.length], [0, 0]); }
    else { const [x, y, r] = it.c; s = G.circ(P([x, y]), r * k, it.cls || 'g-fill'); m = [x, y]; }
    return s + (it.t ? G.t(P(it.at || m), it.t, 's') : '');
  }).join('');
};
// Cuboid net: a strip side | bottom | side | top (height w), with the front and back on the bottom face.
FD.cubNet = (l, w, h, lab = true) => {
  const t = (x, y) => (lab ? `${FD.num(x * y)}` : '');
  return FD.net([
    { r: [0, h, h, w], cls: 'g-arc3', t: t(h, w) }, { r: [h, h, l, w], cls: 'g-fill2', t: t(l, w) }, { r: [h + l, h, h, w], cls: 'g-arc3', t: t(h, w) },
    { r: [2 * h + l, h, l, w], cls: 'g-fill2', t: t(l, w) }, { r: [h, 0, l, h], cls: 'g-fill', t: t(l, h) }, { r: [h, h + w, l, h], cls: 'g-fill', t: t(l, h) },
  ], 2 * h + 2 * l, w + 2 * h);
};

FD.add({
  id: 'surface',
  title: 'Nets and surface area',
  tab: 'Surface area',
  icon: 'shapes',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Net', 'A flat shape that folds up to make a solid.'],
    ['Surface area', 'The total area of all the faces of a solid, in square units.'],
    ['Curved surface of a cylinder', 'Unrolled, it is a rectangle \\(2\\pi r\\) long and \\(h\\) high: area \\(2\\pi rh\\).'],
  ],
  mount(el) {
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'The net of a solid with the area of each face',
      ctrls: `<label class="ctrl">Length (cm) <input type="range" id="l" min="2" max="10" value="5"><output id="ol">5</output></label>
        <label class="ctrl">Width (cm) <input type="range" id="w" min="1" max="8" value="3"><output id="ow">3</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="h" min="1" max="6" value="2"><output id="oh">2</output></label>`,
    });
    a.box = (l, w, h) => a.draw(FD.d3(FD.cubV(l, w, h), FD.cubE, { faces: FD.cubF }).s + FD.G.t([210, 285], `${l} cm × ${w} cm × ${h} cm`, 's'));
    a.prismNet = () => a.draw(FD.net([
      { r: [0, 0, 3, 10], cls: 'g-fill', t: '30' }, { r: [3, 0, 4, 10], cls: 'g-fill', t: '40' }, { r: [7, 0, 5, 10], cls: 'g-fill', t: '50' },
      { p: [[3, 10], [7, 10], [3, 13]], cls: 'g-fill2', t: '6', at: [4.3, 11] }, { p: [[3, 0], [7, 0], [3, -3]], cls: 'g-fill2', t: '6', at: [4.3, -1] },
    ], 12, 16, [60, 20, 300, 260], -3) + FD.G.t([370, 150], 'length 10', 's'));
    a.cylNet = (r, h) => { const C = 2 * Math.PI * r; a.draw(FD.net([{ r: [0, 0, C, h], cls: 'g-fill', t: `2πr × h` }, { c: [C / 2, h + r, r], cls: 'g-fill2', t: 'πr²' }, { c: [C / 2, -r, r], cls: 'g-fill2', t: 'πr²' }], C, h + 4 * r, undefined, -2 * r)); };
    a.onSync(() => {
      const l = a.val('l'), w = a.val('w'), h = a.val('h');
      a.out('l', l); a.out('w', w); a.out('h', h);
      a.draw(FD.cubNet(l, w, h));
      a.big(`2(${l * w} + ${l * h} + ${w * h}) = ${2 * (l * w + l * h + w * h)}\\ \\text{cm}^2`);
      a.msg('Faces come in three matching pairs (same colour).');
    });
    a.box(5, 3, 2);
    return a;
  },
  steps: [
    {
      title: 'Unfold the solid',
      text: '<p>Cut a cuboid along some edges and lay it flat: you get a <b>net</b>. A cuboid 5 cm by 3 cm by 2 cm has <b>6 rectangular faces</b> in three matching pairs.</p>',
      async on(a, ctx) { a.off(); a.box(5, 3, 2); if (!(await ctx.sleep(1500))) return; a.draw(FD.cubNet(5, 3, 2, false)); },
    },
    {
      title: 'Surface area of a cuboid',
      text: '<p>The <b>surface area</b> is the total area of the net. Find each pair, then add.</p>',
      tip: 'Check you have 6 faces for a cuboid.',
      async on(a, ctx) { a.off(); a.draw(FD.cubNet(5, 3, 2)); await a.play(ctx, [['2 \\times (5 \\times 3) = 30', 'top and bottom'], ['2 \\times (5 \\times 2) = 20', 'front and back'], ['2 \\times (3 \\times 2) = 12', 'two ends'], ['SA = 30 + 20 + 12 = 62\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'A triangular prism',
      text: '<p>A prism 10 cm long has a right-angled triangle with sides 3, 4 and 5 cm as its cross-section. Its net has <b>2 triangles</b> and <b>3 rectangles</b>.</p>',
      async on(a, ctx) { a.off(); a.prismNet(); await a.play(ctx, [['2 \\times \\tfrac12 \\times 3 \\times 4 = 12', 'two triangles'], ['3 \\times 10 + 4 \\times 10 + 5 \\times 10 = 120', 'three rectangles'], ['SA = 132\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'A cylinder',
      text: '<p>Unroll the curved surface of a cylinder: it is a <b>rectangle</b>. Its length is the circumference \\(2\\pi r\\).</p><p class="mbig">\\(SA = 2\\pi r^2 + 2\\pi rh\\)</p><p>Here \\(r = 3\\) cm and \\(h = 10\\) cm.</p>',
      tip: 'Some questions only want the curved surface, 2πrh. Read carefully.',
      async on(a, ctx) { a.off(); a.cylNet(3, 10); await a.play(ctx, [['2 \\times \\pi \\times 3^2 = 18\\pi', 'two circles'], ['2 \\times \\pi \\times 3 \\times 10 = 60\\pi', 'curved surface'], ['SA = 78\\pi = 245.0\\ \\text{cm}^2', '1 d.p.']]); },
    },
    {
      title: 'Try it: change the cuboid',
      text: '<p>Change the length, width and height and watch the net and its total area.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'surface',
  gens: [
    () => { const l = FD.rnd(2, 12), w = FD.rnd(2, 10), h = FD.rnd(1, 9), S = 2 * (l * w + l * h + w * h); return { type: 'num', q: `A cuboid is \\(${l}\\) cm by \\(${w}\\) cm by \\(${h}\\) cm. Work out its surface area.`, a: S, unit: 'cm²', why: `\\(2(${l} \\times ${w} + ${l} \\times ${h} + ${w} \\times ${h}) = 2(${l * w} + ${l * h} + ${w * h}) = ${S}\\ \\text{cm}^2\\).` }; },
    () => { const e = FD.rnd(2, 12); return { type: 'num', q: `A cube has edges of \\(${e}\\) cm. Work out its surface area.`, a: 6 * e * e, unit: 'cm²', why: `6 faces, each \\(${e} \\times ${e} = ${e * e}\\): \\(6 \\times ${e * e} = ${6 * e * e}\\ \\text{cm}^2\\).` }; },
    () => { const r = FD.rnd(2, 10), h = FD.rnd(3, 20), S = 2 * Math.PI * r * r + 2 * Math.PI * r * h; return { type: 'num', q: `A closed cylinder has radius \\(${r}\\) cm and height \\(${h}\\) cm. Work out its total surface area, to 1 decimal place.`, a: FD.round(S, 1), tol: 0.05, unit: 'cm²', why: `\\(2\\pi \\times ${r}^2 + 2\\pi \\times ${r} \\times ${h} = ${2 * r * r + 2 * r * h}\\pi = ${FD.tn(FD.round(S, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const r = FD.rnd(2, 10), h = FD.rnd(3, 20), S = 2 * Math.PI * r * h; return { type: 'num', q: `A tin is a cylinder with radius \\(${r}\\) cm and height \\(${h}\\) cm. A label covers the curved surface only. Work out the area of the label, to 1 decimal place.`, a: FD.round(S, 1), tol: 0.05, unit: 'cm²', why: `Curved surface \\(= 2\\pi rh = 2\\pi \\times ${r} \\times ${h} = ${FD.tn(FD.round(S, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const [p, q, r] = FD.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]), L = FD.rnd(5, 20), S = p * q + (p + q + r) * L; return { type: 'num', q: `A triangular prism is \\(${L}\\) cm long. Its cross-section is a right-angled triangle with sides \\(${p}\\) cm, \\(${q}\\) cm and \\(${r}\\) cm. Work out its surface area.`, a: S, unit: 'cm²', why: `Two triangles: \\(2 \\times \\tfrac12 \\times ${p} \\times ${q} = ${p * q}\\). Rectangles: \\((${p} + ${q} + ${r}) \\times ${L} = ${(p + q + r) * L}\\). Total \\(${S}\\ \\text{cm}^2\\).` }; },
  ],
});

FD.check({
  section: 'surface',
  items: [
    { type: 'num', q: 'Find the surface area of a 4 cm by 3 cm by 2 cm cuboid.', a: 52, unit: 'cm²', why: '\\(2(12 + 8 + 6) = 52\\).' },
    { type: 'num', q: 'Find the surface area of a cube with edges of 5 cm.', a: 150, unit: 'cm²', why: '\\(6 \\times 25\\).' },
    { type: 'mcq', q: 'The curved surface of a cylinder unrolls into a…', opts: ['rectangle', 'circle', 'triangle', 'sector'], why: 'Its length is the circumference \\(2\\pi r\\).' },
    { type: 'num', q: 'A closed cylinder has \\(r = 1\\) cm and \\(h = 4\\) cm. Its surface area is \\(k\\pi\\ \\text{cm}^2\\). Enter \\(k\\).', a: 10, why: '\\(2\\pi + 8\\pi = 10\\pi\\).' },
  ],
});
