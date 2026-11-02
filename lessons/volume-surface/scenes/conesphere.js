// Higher: pyramids and cones (one third of the prism), curved surface of a cone πrl, and the sphere 4/3 πr³, 4πr².
FD.add({
  id: 'conesphere',
  title: 'Pyramids, cones and spheres',
  tab: 'Cones and spheres',
  icon: 'geometry',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Pyramid and cone', '\\(V = \\tfrac13 \\times \\text{area of base} \\times h\\); for a cone \\(V = \\tfrac13 \\pi r^2 h\\).'],
    ['Slant height', 'The length \\(l\\) from the apex of a cone to the edge of its base: \\(l = \\sqrt{r^2 + h^2}\\).'],
    ['Curved surface of a cone', '\\(\\pi r l\\)'],
    ['Sphere', '\\(V = \\tfrac43 \\pi r^3\\) and surface area \\(= 4\\pi r^2\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A pyramid, cone or sphere with its measurements',
      ctrls: `<label class="ctrl">Solid <select id="ty"><option value="0">Square-based pyramid</option><option value="1">Cone</option><option value="2">Sphere</option></select></label>
        <label class="ctrl">Radius / base edge (cm) <input type="range" id="r" min="2" max="10" value="4"><output id="or">4</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="h" min="3" max="15" value="9"><output id="oh">9</output></label>`,
    });
    a.solid = (ty, r, h, lab = {}) => {
      let s;
      if (ty === 0) {
        const d = FD.d3([[0, 0, 0], [r, 0, 0], [r, r, 0], [0, r, 0], [r / 2, r / 2, h]], [[0, 1], [1, 2], [2, 3, 1], [3, 0, 1], [0, 4], [1, 4], [2, 4], [3, 4, 1]], { box: [90, 30, 240, 240], faces: [[[0, 1, 4], 'g-fill2'], [[1, 2, 4], 'g-fill']] });
        const T = d.P([r / 2, r / 2, h]), O = d.P([r / 2, r / 2, 0]);
        s = d.s + G.line(T, O, 'g-dash') + G.t([O[0] + 8, (T[1] + O[1]) / 2], lab.h || 'h', 'l2 st') + G.t([d.P([r / 2, 0, 0])[0], d.P([0, 0, 0])[1] + 16], lab.r || '', 's');
      } else if (ty === 1) {
        const k = Math.min(120 / r, 220 / h), c = [200, 260], R = r * k, H = h * k;
        s = FD.cone(c, R, H) + G.line([c[0], c[1] - H], c, 'g-dash') + G.line(c, [c[0] + R, c[1]], 'g-ln') + G.t([c[0] + R / 2, c[1] + 16], lab.r || 'r', 's') + G.t([c[0] - 8, c[1] - H / 2], lab.h || 'h', 'l2 en') + G.t([c[0] + R / 2 + 12, c[1] - H / 2], lab.l || 'l', 'l st');
      } else {
        const c = [200, 150], R = 110;
        s = FD.sph(c, R) + G.line(c, [c[0] + R, c[1]], 'g-hl2') + G.dot(c, 'g-dot', 4) + G.t([c[0] + R / 2, c[1] - 12], lab.r || 'r', 'l2');
      }
      a.draw(s);
    };
    a.onSync(() => {
      const ty = a.val('ty'), r = a.val('r'), h = a.val('h');
      a.out('r', r); a.out('h', h);
      a.solid(ty, r, h, { r: `${r} cm`, h: `${h} cm`, l: `l = ${FD.num(FD.round(Math.hypot(r, h), 2))}` });
      if (ty === 0) { a.big(`V = \\tfrac13 \\times ${r}^2 \\times ${h} = ${FD.num(FD.round((r * r * h) / 3, 1))}\\ \\text{cm}^3`); a.msg('A third of the cuboid with the same base and height.'); }
      if (ty === 1) { a.big(`V = \\tfrac13 \\pi \\times ${r}^2 \\times ${h} = ${FD.num(FD.round((Math.PI * r * r * h) / 3, 1))}\\ \\text{cm}^3`); a.msg(`Curved surface \\(= \\pi \\times ${r} \\times ${FD.tn(FD.round(Math.hypot(r, h), 2))} = ${FD.tn(FD.round(Math.PI * r * Math.hypot(r, h), 1))}\\ \\text{cm}^2\\)`); }
      if (ty === 2) { a.big(`V = \\tfrac43 \\pi \\times ${r}^3 = ${FD.num(FD.round((4 / 3) * Math.PI * r ** 3, 1))}\\ \\text{cm}^3`); a.msg(`Surface area \\(= 4\\pi \\times ${r}^2 = ${FD.tn(FD.round(4 * Math.PI * r * r, 1))}\\ \\text{cm}^2\\) (the height slider is not used)`); }
    });
    a.solid(0, 6, 10, { r: '6 cm', h: '10 cm' });
    return a;
  },
  steps: [
    {
      title: 'Pyramids: one third',
      text: '<p>A pyramid holds exactly <b>one third</b> of the prism with the same base and height.</p><p class="mbig">\\(V = \\tfrac13 \\times \\text{area of base} \\times h\\)</p><p>Here the base is a 6 cm square and the height is 10 cm.</p>',
      async on(a, ctx) { a.off(); a.solid(0, 6, 10, { r: '6 cm', h: '10 cm' }); await a.play(ctx, [['V = \\tfrac13 \\times 6^2 \\times 10', ''], ['V = 120\\ \\text{cm}^3', '']]); },
    },
    {
      title: 'Volume of a cone',
      text: '<p>A cone is a pyramid with a circular base.</p><p class="mbig">\\(V = \\tfrac13 \\pi r^2 h\\)</p><p>Here \\(r = 4\\) cm and the <b>vertical</b> height is 9 cm.</p>',
      async on(a, ctx) { a.off(); a.solid(1, 4, 9, { r: '4 cm', h: '9 cm', l: 'l' }); await a.play(ctx, [['V = \\tfrac13 \\times \\pi \\times 4^2 \\times 9 = 48\\pi', ''], ['V = 150.8\\ \\text{cm}^3', '1 d.p.']]); },
    },
    {
      title: 'Surface area of a cone',
      text: '<p>The curved surface uses the <b>slant height</b> \\(l\\), not the vertical height.</p><p class="mbig">\\(\\text{curved surface} = \\pi r l\\)</p><p>\\(r = 3\\) cm and \\(h = 4\\) cm. Find \\(l\\) with Pythagoras first.</p>',
      tip: 'Total surface area of a solid cone = πrl + πr² (add the circular base).',
      async on(a, ctx) { a.off(); a.solid(1, 3, 4, { r: '3 cm', h: '4 cm', l: 'l' }); await a.play(ctx, [['l = \\sqrt{3^2 + 4^2} = 5\\ \\text{cm}', 'Pythagoras'], ['\\pi \\times 3 \\times 5 = 15\\pi', 'curved surface'], ['15\\pi + \\pi \\times 3^2 = 24\\pi = 75.4\\ \\text{cm}^2', 'total']]); },
    },
    {
      title: 'Spheres',
      text: '<p class="mbig">\\(V = \\tfrac43 \\pi r^3\\)</p><p class="mbig">\\(\\text{surface area} = 4\\pi r^2\\)</p><p>Here \\(r = 6\\) cm.</p>',
      async on(a, ctx) { a.off(); a.solid(2, 6, 0, { r: '6 cm' }); await a.play(ctx, [['V = \\tfrac43 \\times \\pi \\times 6^3 = 288\\pi = 904.8\\ \\text{cm}^3', ''], ['SA = 4 \\times \\pi \\times 6^2 = 144\\pi = 452.4\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Hemispheres',
      text: '<p>A hemisphere is half a sphere. Its volume is half of \\(\\tfrac43 \\pi r^3\\). Its total surface area is half of \\(4\\pi r^2\\) <b>plus</b> the flat circle \\(\\pi r^2\\).</p><p>Here \\(r = 5\\) cm.</p>',
      async on(a, ctx) { a.off(); a.solid(2, 5, 0, { r: '5 cm' }); await a.play(ctx, [['V = \\tfrac23 \\times \\pi \\times 5^3 = 261.8\\ \\text{cm}^3', ''], ['SA = 2\\pi \\times 5^2 + \\pi \\times 5^2 = 75\\pi = 235.6\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Try it: choose a solid',
      text: '<p>Choose a solid and change its size.</p>',
      tip: 'Double the radius of a sphere: its volume becomes 8 times as big.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'conesphere',
  gens: [
    () => { const r = FD.rnd(2, 12), h = FD.rnd(3, 20), V = (Math.PI * r * r * h) / 3; return { type: 'num', q: `A cone has base radius \\(${r}\\) cm and vertical height \\(${h}\\) cm. Work out its volume, to 1 decimal place.`, a: FD.round(V, 1), tol: 0.05, unit: 'cm³', why: `\\(\\tfrac13 \\pi \\times ${r}^2 \\times ${h} = ${FD.tn(FD.round((r * r * h) / 3, 3))}\\pi = ${FD.tn(FD.round(V, 1))}\\ \\text{cm}^3\\).` }; },
    () => { const [r, h, l] = FD.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]), tot = FD.pick([true, false]), S = Math.PI * r * l + (tot ? Math.PI * r * r : 0); return { type: 'num', q: `A solid cone has base radius \\(${r}\\) cm and vertical height \\(${h}\\) cm. Work out its ${tot ? 'total surface area' : 'curved surface area'}, to 1 decimal place.`, a: FD.round(S, 1), tol: 0.05, unit: 'cm²', why: `\\(l = \\sqrt{${r}^2 + ${h}^2} = ${l}\\). Curved surface \\(= \\pi \\times ${r} \\times ${l} = ${r * l}\\pi\\)${tot ? `; add the base \\(${r * r}\\pi\\): \\(${r * l + r * r}\\pi\\)` : ''} \\(= ${FD.tn(FD.round(S, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const r = FD.rnd(1, 15), V = (4 / 3) * Math.PI * r ** 3; return { type: 'num', q: `A sphere has radius \\(${r}\\) cm. Work out its volume, to 1 decimal place.`, a: FD.round(V, 1), tol: 0.05, unit: 'cm³', why: `\\(\\tfrac43 \\pi \\times ${r}^3 = ${FD.tn(FD.round(V, 1))}\\ \\text{cm}^3\\).` }; },
    () => { const r = FD.rnd(1, 15), S = 4 * Math.PI * r * r; return { type: 'num', q: `A sphere has radius \\(${r}\\) cm. Work out its surface area, to 1 decimal place.`, a: FD.round(S, 1), tol: 0.05, unit: 'cm²', why: `\\(4\\pi \\times ${r}^2 = ${4 * r * r}\\pi = ${FD.tn(FD.round(S, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const s = FD.rnd(2, 12), h = 3 * FD.rnd(1, 8); return { type: 'num', q: `A pyramid has a square base of side \\(${s}\\) cm and a vertical height of \\(${h}\\) cm. Work out its volume.`, a: (s * s * h) / 3, unit: 'cm³', why: `\\(\\tfrac13 \\times ${s * s} \\times ${h} = ${(s * s * h) / 3}\\ \\text{cm}^3\\).` }; },
    () => { const r = FD.pick([3, 6, 9, 12]), k = (4 * r ** 3) / 3; return { type: 'num', q: `A sphere has volume \\(${FD.tn(FD.round(k, 2))}\\pi\\ \\text{cm}^3\\). Work out its radius.`, a: r, unit: 'cm', why: `\\(\\tfrac43 \\pi r^3 = ${FD.tn(FD.round(k, 2))}\\pi\\), so \\(r^3 = ${r ** 3}\\) and \\(r = ${r}\\) cm.` }; },
  ],
});

FD.check({
  section: 'conesphere',
  items: [
    { type: 'num', q: 'A cone has \\(r = 3\\) cm and \\(h = 10\\) cm. Its volume is \\(k\\pi\\ \\text{cm}^3\\). Enter \\(k\\).', a: 30, why: '\\(\\tfrac13 \\times 9 \\times 10 = 30\\).' },
    { type: 'num', q: 'A sphere has radius 3 cm. Its surface area is \\(k\\pi\\ \\text{cm}^2\\). Enter \\(k\\).', a: 36, why: '\\(4 \\times 9\\).' },
    { type: 'mcq', q: 'The curved surface area of a cone uses…', opts: ['the slant height \\(l\\)', 'the vertical height \\(h\\)', 'the diameter only', 'the volume'], why: '\\(\\pi r l\\).' },
    { type: 'num', q: 'A pyramid has base area \\(30\\ \\text{cm}^2\\) and height 8 cm. Find its volume.', a: 80, unit: 'cm³', why: '\\(\\tfrac13 \\times 30 \\times 8\\).' },
  ],
});
