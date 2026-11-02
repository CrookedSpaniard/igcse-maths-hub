// Higher: enlarge by k and areas multiply by k², volumes by k³. Unit squares and unit cubes show why.

// A k × k × k cube in oblique projection at bottom-left corner o, u px per unit, with unit-cube grid lines.
FD.gridCube = (o, u, k, cls = 'g-fill2') => {
  const G = FD.G, P = ([x, y, z]) => [o[0] + (x + 0.383 * y) * u, o[1] - (z + 0.321 * y) * u];
  const V = [[0, 0, 0], [k, 0, 0], [k, k, 0], [0, k, 0], [0, 0, k], [k, 0, k], [k, k, k], [0, k, k]].map(P);
  let s = G.poly([V[0], V[1], V[5], V[4]], cls) + G.poly([V[4], V[5], V[6], V[7]], cls) + G.poly([V[1], V[2], V[6], V[5]], cls);
  for (let i = 1; i < k; i++) {
    s += G.line(P([i, 0, 0]), P([i, 0, k]), 'g-thin') + G.line(P([i, 0, k]), P([i, k, k]), 'g-thin') + G.line(P([0, 0, i]), P([k, 0, i]), 'g-thin');
    s += G.line(P([k, 0, i]), P([k, k, i]), 'g-thin') + G.line(P([0, i, k]), P([k, i, k]), 'g-thin') + G.line(P([k, i, 0]), P([k, i, k]), 'g-thin');
  }
  return s;
};

FD.add({
  id: 'areavol',
  title: 'Areas and volumes of similar shapes',
  tab: 'k² and k³',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Length scale factor', '\\(k\\): every length is multiplied by \\(k\\).'],
    ['Area scale factor', '\\(k^2\\): every area is multiplied by \\(k^2\\).'],
    ['Volume scale factor', '\\(k^3\\): every volume is multiplied by \\(k^3\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'Squares and cubes enlarged by a scale factor',
      ctrls: `<label class="ctrl">Scale factor \\(k\\) <input type="range" id="k" min="1" max="4" value="2"><output id="ok">2</output></label>`,
    });
    // show: 'sq' squares only, 'cu' cubes only, 'both'
    a.scene = (k, show = 'both') => {
      let s = '';
      if (show !== 'cu') {
        const u = 24, y0 = 135;
        s += G.poly([[20, y0], [20 + u, y0], [20 + u, y0 - u], [20, y0 - u]], 'g-fill') + G.t([32, y0 + 14], '1', 's');
        s += G.poly([[70, y0], [70 + k * u, y0], [70 + k * u, y0 - k * u], [70, y0 - k * u]], 'g-fill2') + G.t([70 + (k * u) / 2, y0 + 14], `${k}`, 's');
        for (let i = 1; i < k; i++) s += G.line([70 + i * u, y0], [70 + i * u, y0 - k * u], 'g-thin') + G.line([70, y0 - i * u], [70 + k * u, y0 - i * u], 'g-thin');
        s += G.t([70 + k * u + 12, y0 - (k * u) / 2], `area × ${k * k}`, 'l st');
      }
      if (show !== 'sq') {
        const u = 22, y0 = show === 'cu' ? 230 : 285;
        s += FD.gridCube([20, y0], u, 1, 'g-fill') + FD.gridCube([80, y0], u, k) + G.t([80 + k * u * 1.383 + 12, y0 - k * u * 0.6], `volume × ${k ** 3}`, 'l st');
      }
      a.draw(s);
    };
    a.onSync(() => {
      const k = a.val('k');
      a.out('k', k);
      a.scene(k);
      a.big(`k = ${k},\\ k^2 = ${k * k},\\ k^3 = ${k ** 3}`);
      a.msg(`${k * k} squares fit in the big square; ${k ** 3} cubes fit in the big cube.`);
    });
    a.scene(2, 'sq');
    return a;
  },
  steps: [
    {
      title: 'Areas: k²',
      text: '<p>Enlarge a square by scale factor 2. Its sides double, but it holds <b>4</b> of the original squares.</p><p>Enlarge by 3 and it holds <b>9</b>. Areas are multiplied by \\(k^2\\).</p>',
      async on(a, ctx) { a.off(); a.scene(2, 'sq'); a.big('2^2 = 4'); if (!(await ctx.sleep(1800))) return; a.scene(3, 'sq'); a.big('3^2 = 9'); },
    },
    {
      title: 'Volumes: k³',
      text: '<p>Enlarge a cube by scale factor 2. It holds \\(2 \\times 2 \\times 2 = 8\\) of the original cubes.</p><p>Volumes are multiplied by \\(k^3\\).</p>',
      async on(a, ctx) { a.off(); a.scene(2, 'cu'); a.big('2^3 = 8'); if (!(await ctx.sleep(1800))) return; a.scene(3, 'cu'); a.big('3^3 = 27'); },
    },
    {
      title: 'Any similar shapes',
      text: '<p>This works for <b>any</b> similar shapes or solids, not just squares and cubes.</p><ul><li>lengths × \\(k\\)</li><li>areas × \\(k^2\\)</li><li>volumes × \\(k^3\\)</li></ul><p>Two similar cylinders are 5 cm and 15 cm tall. The small one has surface area \\(40\\ \\text{cm}^2\\) and volume \\(50\\ \\text{cm}^3\\).</p>',
      tip: 'Always find the length factor k first.',
      async on(a, ctx) { a.off(); a.scene(3); await a.play(ctx, [['k = \\frac{15}{5} = 3', 'lengths'], ['40 \\times 3^2 = 360\\ \\text{cm}^2', 'surface area'], ['50 \\times 3^3 = 1350\\ \\text{cm}^3', 'volume']]); },
    },
    {
      title: 'Try it: change k',
      text: '<p>Change the scale factor and watch how much faster the volume grows than the area.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'areavol',
  gens: [
    () => { const k = FD.pick([2, 3, 4, 5, 1.5, 2.5]), A = FD.rnd(3, 40); return { type: 'num', q: `Two shapes are similar. The lengths of the large shape are \\(${FD.tn(k)}\\) times the lengths of the small one. The small shape has area \\(${A}\\ \\text{cm}^2\\). Work out the area of the large shape.`, a: FD.round(A * k * k, 4), unit: 'cm²', why: `Area factor \\(= ${FD.tn(k)}^2 = ${FD.tn(k * k)}\\). \\(${A} \\times ${FD.tn(k * k)} = ${FD.tn(FD.round(A * k * k, 4))}\\ \\text{cm}^2\\).` }; },
    () => { const k = FD.pick([2, 3, 4, 5]), V = FD.rnd(2, 30); return { type: 'num', q: `Two solids are similar with length scale factor \\(${k}\\). The smaller solid has volume \\(${V}\\ \\text{cm}^3\\). Work out the volume of the larger solid.`, a: V * k ** 3, unit: 'cm³', why: `Volume factor \\(= ${k}^3 = ${k ** 3}\\). \\(${V} \\times ${k ** 3} = ${V * k ** 3}\\ \\text{cm}^3\\).` }; },
    () => { const h1 = FD.rnd(2, 8), k = FD.pick([2, 3, 4]), A2 = FD.rnd(2, 20) * k * k; return { type: 'num', q: `Two similar bottles have heights \\(${h1}\\) cm and \\(${h1 * k}\\) cm. The label on the larger bottle has area \\(${A2}\\ \\text{cm}^2\\). Work out the area of the label on the smaller bottle.`, a: A2 / (k * k), unit: 'cm²', why: `\\(k = ${h1 * k} \\div ${h1} = ${k}\\), area factor \\(${k * k}\\). Going to the smaller bottle, divide: \\(${A2} \\div ${k * k} = ${A2 / (k * k)}\\ \\text{cm}^2\\).` }; },
    () => { const k = FD.rnd(2, 6), w = FD.pick(['area', 'volume']); return { type: 'num', q: `A shape is enlarged with length scale factor \\(${k}\\). By what number is its ${w} multiplied?`, a: w === 'area' ? k * k : k ** 3, why: w === 'area' ? `\\(${k}^2 = ${k * k}\\).` : `\\(${k}^3 = ${k ** 3}\\).` }; },
  ],
});

FD.check({
  section: 'areavol',
  items: [
    { type: 'num', q: 'Lengths are multiplied by 3. Areas are multiplied by…', a: 9, why: '\\(3^2\\).' },
    { type: 'num', q: 'Lengths are multiplied by 2. A volume of \\(15\\ \\text{cm}^3\\) becomes…', a: 120, unit: 'cm³', why: '\\(15 \\times 8\\).' },
    { type: 'mcq', q: 'Two similar shapes have lengths in the ratio \\(1 : 4\\). Their areas are in the ratio…', opts: ['\\(1 : 16\\)', '\\(1 : 4\\)', '\\(1 : 8\\)', '\\(1 : 64\\)'], why: '\\(4^2 = 16\\).' },
    { type: 'tf', q: 'If the lengths of a solid are doubled, its volume is doubled.', a: false, why: 'It is multiplied by \\(2^3 = 8\\).' },
  ],
});
