// Volume of a prism: area of the cross-section (shaded at the front) × length. Cuboids, triangular prisms, cylinders.

// Unit-cube grid lines on the three visible faces of an l × w × h cuboid drawn with projection P.
FD.cubeGrid = (P, l, w, h, n = 1) => {
  const G = FD.G; let s = '';
  for (let i = n; i < l; i += n) s += G.line(P([i, 0, 0]), P([i, 0, h]), 'g-thin') + G.line(P([i, 0, h]), P([i, w, h]), 'g-thin');
  for (let j = n; j < h; j += n) s += G.line(P([0, 0, j]), P([l, 0, j]), 'g-thin') + G.line(P([l, 0, j]), P([l, w, j]), 'g-thin');
  for (let m = n; m < w; m += n) s += G.line(P([0, m, h]), P([l, m, h]), 'g-thin') + G.line(P([l, m, 0]), P([l, m, h]), 'g-thin');
  return s;
};
// A cylinder lying along the depth: circular cross-section (radius r) at the front, length L.
FD.cylLying = (r, L, box) => {
  const G = FD.G, { P, k } = FD.d3([], [], { box, fit: [[0, 0, 0], [2 * r, 0, 2 * r], [0, L, 0], [2 * r, L, 2 * r]] });
  const F = P([r, 0, r]), B = P([r, L, r]), R = r * k, d0 = G.dist(F, B) || 1, d = [(B[0] - F[0]) / d0, (B[1] - F[1]) / d0], n = [-d[1] * R, d[0] * R];
  const phi = (Math.atan2(-d[1], d[0]) * 180) / Math.PI;
  return { P, k, F, R, s: G.circ(B, R, 'g-ghost') + G.poly([[F[0] + n[0], F[1] + n[1]], [B[0] + n[0], B[1] + n[1]], [B[0] - n[0], B[1] - n[1]], [F[0] - n[0], F[1] - n[1]]], 'g-fill').replace('<polygon', '<polygon style="stroke:none"')
    + `<path class="g-ln" style="fill:none" d="${FD.arcD(B, R, phi - 90, phi + 90)}"/>` + G.line([F[0] + n[0], F[1] + n[1]], [B[0] + n[0], B[1] + n[1]]) + G.line([F[0] - n[0], F[1] - n[1]], [B[0] - n[0], B[1] - n[1]]) + G.circ(F, R, 'g-fill2') };
};

FD.add({
  id: 'prisms',
  title: 'Volume of prisms and cylinders',
  tab: 'Volume',
  icon: 'geometry',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Volume', 'The amount of space inside a solid, measured in cubic units such as \\(\\text{cm}^3\\).'],
    ['Cross-section', 'The shape you see when you slice straight through a prism. It is the same all the way along.'],
    ['Volume of a prism', '\\(V = \\text{area of cross-section} \\times \\text{length}\\). For a cylinder, \\(V = \\pi r^2 h\\).'],
  ],
  mount(el) {
    const G = FD.G, box = [60, 30, 300, 230];
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A prism with its cross-section shaded',
      ctrls: `<label class="ctrl">Prism <select id="ty"><option value="0">Cuboid</option><option value="1">Triangular prism</option><option value="2">Cylinder</option></select></label>
        <label class="ctrl">Width / radius (cm) <input type="range" id="p" min="1" max="8" value="4"><output id="op">4</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="q" min="1" max="8" value="3"><output id="oq">3</output></label>
        <label class="ctrl">Length (cm) <input type="range" id="L" min="1" max="12" value="6"><output id="oL">6</output></label>`,
    });
    // ty 0 cuboid p × q × L (cross-section at the front), 1 triangle base p height q, 2 cylinder radius p; grid shows unit cubes
    a.prism = (ty, p, q, L, grid = false, lab = {}) => {
      let s;
      if (ty === 0) { const r = FD.d3(FD.cubV(p, L, q), FD.cubE, { box, faces: [[[0, 1, 5, 4], 'g-fill2'], [[4, 5, 6, 7], 'g-fill'], [[1, 2, 6, 5], 'g-fill']] }); s = r.s + (grid ? FD.cubeGrid(r.P, p, L, q) : '') + G.t([r.P([p / 2, 0, 0])[0], r.P([0, 0, 0])[1] + 16], lab.p || '', 's') + G.t([r.P([0, 0, q / 2])[0] - 8, r.P([0, 0, q / 2])[1]], lab.q || '', 's en') + G.t([r.P([p, L / 2, 0])[0] + 10, r.P([p, L / 2, 0])[1] + 6], lab.L || '', 's st'); }
      else if (ty === 1) { const r = FD.d3(FD.triV(p, q, L), FD.triE, { box, faces: [[[1, 4, 5, 2], 'g-fill'], [[0, 1, 2], 'g-fill2']] }); s = r.s + G.line(r.P([p / 2, 0, 0]), r.P([p / 2, 0, q]), 'g-dash') + G.t([r.P([p / 2, 0, 0])[0], r.P([0, 0, 0])[1] + 16], lab.p || '', 's') + G.t([r.P([p / 2, 0, q / 2])[0] - 8, r.P([0, 0, q / 2])[1]], lab.q || '', 's en') + G.t([r.P([p, L / 2, 0])[0] + 10, r.P([p, L / 2, 0])[1] + 6], lab.L || '', 's st'); }
      else { const c = FD.cylLying(p, L, box); s = c.s + G.line(c.F, [c.F[0] + c.R, c.F[1]], 'g-ln') + G.t([c.F[0] + c.R / 2, c.F[1] - 10], lab.p || '', 's') + G.t([c.P([2 * p, L / 2, 0])[0] + 10, c.P([2 * p, L / 2, 0])[1] + 6], lab.L || '', 's st'); }
      a.draw(s);
    };
    a.onSync(() => {
      const ty = a.val('ty'), p = a.val('p'), q = a.val('q'), L = a.val('L'), A = [p * q, (p * q) / 2, Math.PI * p * p][ty];
      a.out('p', p); a.out('q', q); a.out('L', L);
      a.prism(ty, p, q, L, false, { p: ty === 2 ? `r = ${p}` : `${p} cm`, q: `${q} cm`, L: `${L} cm` });
      a.big(`V = ${[`${p} \\times ${q}`, `\\tfrac12 \\times ${p} \\times ${q}`, `\\pi \\times ${p}^2`][ty]} \\times ${L} = ${FD.num(FD.round(A * L, 1))}\\ \\text{cm}^3`);
      a.msg(`Cross-section area \\(= ${FD.tn(FD.round(A, 2))}\\ \\text{cm}^2\\)${ty === 2 ? ' (the height slider is not used)' : ''}`);
    });
    a.prism(0, 4, 2, 3, true, { p: '4 cm', q: '2 cm', L: '3 cm' });
    return a;
  },
  steps: [
    {
      title: 'Counting cubes',
      text: '<p>A cuboid 4 cm by 3 cm by 2 cm is built from \\(1\\ \\text{cm}^3\\) cubes. Each layer has \\(4 \\times 2 = 8\\) cubes, and there are 3 layers.</p><p class="mbig">\\(V = l \\times w \\times h\\)</p>',
      async on(a, ctx) { a.off(); a.prism(0, 4, 2, 3, true, { p: '4 cm', q: '2 cm', L: '3 cm' }); await a.play(ctx, [['V = 4 \\times 2 \\times 3', '8 cubes in each of 3 layers'], ['V = 24\\ \\text{cm}^3', '']]); },
    },
    {
      title: 'Any prism',
      text: '<p>The front face of each layer is the <b>cross-section</b>. Whatever its shape, the volume is:</p><p class="mbig">\\(V = \\text{area of cross-section} \\times \\text{length}\\)</p><p>Here the cross-section is a triangle, base 4 cm and height 3 cm, and the prism is 10 cm long.</p>',
      async on(a, ctx) { a.off(); a.prism(1, 4, 3, 10, false, { p: '4 cm', q: '3 cm', L: '10 cm' }); await a.play(ctx, [['\\text{area} = \\tfrac12 \\times 4 \\times 3 = 6\\ \\text{cm}^2', 'cross-section'], ['V = 6 \\times 10 = 60\\ \\text{cm}^3', '']]); },
    },
    {
      title: 'Cylinders',
      text: '<p>A cylinder is like a prism with a <b>circle</b> as its cross-section.</p><p class="mbig">\\(V = \\pi r^2 h\\)</p><p>Here \\(r = 3\\) cm and the length (height) is 10 cm.</p>',
      async on(a, ctx) { a.off(); a.prism(2, 3, 0, 10, false, { p: '3 cm', L: '10 cm' }); await a.play(ctx, [['V = \\pi \\times 3^2 \\times 10 = 90\\pi', ''], ['V = 282.7\\ \\text{cm}^3', '1 d.p.']]); },
    },
    {
      title: 'Working backwards',
      text: '<p>A cylinder has volume \\(500\\ \\text{cm}^3\\) and radius 5 cm. How long is it?</p>',
      tip: 'Substitute what you know, then rearrange.',
      async on(a, ctx) { a.off(); a.prism(2, 5, 0, 6.37, false, { p: '5 cm', L: 'h' }); await a.play(ctx, [['\\pi \\times 5^2 \\times h = 500', ''], ['h = \\frac{500}{25\\pi} = 6.37\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Try it: build a prism',
      text: '<p>Choose a prism and change its size. Double the length: what happens to the volume?</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'prisms',
  gens: [
    () => { const l = FD.rnd(2, 15), w = FD.rnd(2, 12), h = FD.rnd(2, 10); return { type: 'num', q: `A cuboid is \\(${l}\\) cm long, \\(${w}\\) cm wide and \\(${h}\\) cm high. Work out its volume.`, a: l * w * h, unit: 'cm³', why: `\\(${l} \\times ${w} \\times ${h} = ${l * w * h}\\ \\text{cm}^3\\).` }; },
    () => { const b = FD.rnd(2, 12), h = FD.rnd(2, 12), L = FD.rnd(3, 20), V = (b * h * L) / 2; return { type: 'num', q: `A triangular prism is \\(${L}\\) cm long. Its cross-section is a triangle with base \\(${b}\\) cm and perpendicular height \\(${h}\\) cm. Work out its volume.`, a: V, unit: 'cm³', why: `Cross-section \\(= \\tfrac12 \\times ${b} \\times ${h} = ${FD.tn((b * h) / 2)}\\). \\(V = ${FD.tn((b * h) / 2)} \\times ${L} = ${FD.tn(V)}\\ \\text{cm}^3\\).` }; },
    () => { const r = FD.rnd(1, 12), h = FD.rnd(2, 25), V = Math.PI * r * r * h; return { type: 'num', q: `A cylinder has radius \\(${r}\\) cm and height \\(${h}\\) cm. Work out its volume, to 1 decimal place.`, a: FD.round(V, 1), tol: 0.05, unit: 'cm³', why: `\\(\\pi \\times ${r}^2 \\times ${h} = ${r * r * h}\\pi = ${FD.tn(FD.round(V, 1))}\\ \\text{cm}^3\\).` }; },
    () => { const A = FD.rnd(5, 60), L = FD.rnd(3, 20); return { type: 'num', q: `A prism has a cross-section of area \\(${A}\\ \\text{cm}^2\\) and a length of \\(${L}\\) cm. Work out its volume.`, a: A * L, unit: 'cm³', why: `\\(${A} \\times ${L} = ${A * L}\\ \\text{cm}^3\\).` }; },
    () => { const l = FD.rnd(2, 12), w = FD.rnd(2, 10), h = FD.rnd(2, 10), V = l * w * h; return { type: 'num', q: `A cuboid has volume \\(${V}\\ \\text{cm}^3\\). Its base is \\(${l}\\) cm by \\(${w}\\) cm. Work out its height.`, a: h, unit: 'cm', why: `\\(${V} \\div (${l} \\times ${w}) = ${V} \\div ${l * w} = ${h}\\) cm.` }; },
    () => { const r = FD.rnd(2, 10), V = FD.rnd(100, 2000), h = V / (Math.PI * r * r); return { type: 'num', q: `A cylinder has volume \\(${V}\\ \\text{cm}^3\\) and radius \\(${r}\\) cm. Work out its height, to 1 decimal place.`, a: FD.round(h, 1), tol: 0.05, unit: 'cm', why: `\\(h = \\frac{${V}}{\\pi \\times ${r}^2} = \\frac{${V}}{${r * r}\\pi} = ${FD.tn(FD.round(h, 1))}\\) cm.` }; },
  ],
});

FD.check({
  section: 'prisms',
  items: [
    { type: 'num', q: 'Find the volume of a 5 cm by 4 cm by 3 cm cuboid.', a: 60, unit: 'cm³', why: '\\(5 \\times 4 \\times 3\\).' },
    { type: 'num', q: 'A prism has cross-section area \\(12\\ \\text{cm}^2\\) and length 7 cm. Find its volume.', a: 84, unit: 'cm³', why: '\\(12 \\times 7\\).' },
    { type: 'num', q: 'A cylinder has radius 2 cm and height 5 cm. Its volume is \\(k\\pi\\ \\text{cm}^3\\). Enter \\(k\\).', a: 20, why: '\\(\\pi \\times 4 \\times 5 = 20\\pi\\).' },
    { type: 'tf', q: 'Doubling the length of a prism doubles its volume.', a: true, why: 'The cross-section stays the same, so \\(V\\) doubles.' },
  ],
});
