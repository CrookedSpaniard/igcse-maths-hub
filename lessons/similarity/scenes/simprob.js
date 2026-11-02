// Higher: problems with similar solids. Whatever you are given (areas, volumes), go back to the length factor k first.
FD.add({
  id: 'simprob',
  title: 'Problems with similar solids',
  tab: 'Problems',
  icon: 'target',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['From areas to k', 'Area factor \\(= k^2\\), so \\(k = \\sqrt{\\text{area factor}}\\).'],
    ['From volumes to k', 'Volume factor \\(= k^3\\), so \\(k = \\sqrt[3]{\\text{volume factor}}\\). Mass and capacity scale like volume.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'Two similar cones',
      ctrls: `<label class="ctrl">Small height (cm) <input type="range" id="h1" min="2" max="10" value="4"><output id="oh1">4</output></label>
        <label class="ctrl">Large height (cm) <input type="range" id="h2" min="2" max="20" value="6"><output id="oh2">6</output></label>`,
    });
    const cone = (x, y, H, lab, cls) => { const R = H * 0.45, ry = R * 0.28; return `<path class="${cls}" d="M${x - R} ${y} L${x} ${y - H} L${x + R} ${y} A${R} ${ry} 0 0 1 ${x - R} ${y} Z"/><path class="g-dash" style="fill:none" d="M${x - R} ${y} A${R} ${ry} 0 0 1 ${x + R} ${y}"/>` + G.t([x, y + ry + 16], lab, 's'); };
    // Heights in cm drawn with a shared scale so the cones really are similar.
    a.cones = (h1, h2, l1 = `${h1} cm`, l2 = `${h2} cm`) => {
      const u = Math.min(230 / Math.max(h1, h2), 300 / (0.9 * (h1 + h2) + 4));
      a.draw(cone(40 + 0.45 * h1 * u, 240, h1 * u, l1, 'g-fill') + cone(40 + 0.9 * h1 * u + 40 + 0.45 * h2 * u, 240, h2 * u, l2, 'g-fill2'));
    };
    a.onSync(() => {
      const h1 = a.val('h1'), h2 = a.val('h2'), k = h2 / h1, f = (v) => FD.num(FD.round(v, 2));
      a.out('h1', h1); a.out('h2', h2);
      a.cones(h1, h2);
      a.big(`k = \\frac{${h2}}{${h1}} = ${f(k)},\\ k^2 = ${f(k * k)},\\ k^3 = ${f(k ** 3)}`);
      a.msg(`If the small cone has surface area \\(20\\ \\text{cm}^2\\) and volume \\(16\\ \\text{cm}^3\\), the large one has \\(${FD.tn(FD.round(20 * k * k, 2))}\\ \\text{cm}^2\\) and \\(${FD.tn(FD.round(16 * k ** 3, 2))}\\ \\text{cm}^3\\).`);
    });
    a.cones(4, 6, 'A', 'B');
    return a;
  },
  steps: [
    {
      title: 'From area to volume',
      text: '<p>Cones A and B are similar. Their surface areas are \\(20\\ \\text{cm}^2\\) and \\(45\\ \\text{cm}^2\\). The volume of A is \\(16\\ \\text{cm}^3\\). Find the volume of B.</p>',
      tip: 'Do not multiply the volume by the area factor. Go area → k → volume.',
      async on(a, ctx) { a.off(); a.cones(4, 6, 'A: 20 cm²', 'B: 45 cm²'); await a.play(ctx, [['k^2 = \\frac{45}{20} = 2.25', 'area factor'], ['k = \\sqrt{2.25} = 1.5', 'length factor'], ['V = 16 \\times 1.5^3 = 54\\ \\text{cm}^3', 'volume factor \\(k^3\\)']], 1400); },
    },
    {
      title: 'From volume to length',
      text: '<p>Two similar cones have volumes \\(54\\ \\text{cm}^3\\) and \\(250\\ \\text{cm}^3\\). The smaller is 9 cm tall. How tall is the larger?</p>',
      async on(a, ctx) { a.off(); a.cones(9, 15, '9 cm', '?'); await a.play(ctx, [['k^3 = \\frac{250}{54} = \\frac{125}{27}', 'volume factor'], ['k = \\sqrt[3]{\\tfrac{125}{27}} = \\tfrac53', 'cube root'], ['h = 9 \\times \\tfrac53 = 15\\ \\text{cm}', '']], 1400); },
    },
    {
      title: 'Mass and capacity',
      text: '<p>Mass and capacity depend on <b>volume</b>, so they scale by \\(k^3\\).</p><p>Two similar statues made of the same metal are 20 cm and 60 cm tall. The small one has a mass of 1.2 kg.</p>',
      async on(a, ctx) { a.off(); a.cones(2, 6, '20 cm', '60 cm'); await a.play(ctx, [['k = \\frac{60}{20} = 3', ''], ['\\text{mass} = 1.2 \\times 3^3 = 32.4\\ \\text{kg}', 'mass scales like volume']], 1400); },
    },
    {
      title: 'Try it: two similar cones',
      text: '<p>Change the two heights and watch the length, area and volume factors.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'simprob',
  gens: [
    () => { const k = FD.pick([1.5, 2, 2.5, 3]), A1 = FD.rnd(2, 20) * 4, V1 = FD.rnd(2, 20) * 8; return { type: 'num', q: `Two solids are similar. Their surface areas are \\(${A1}\\ \\text{cm}^2\\) and \\(${FD.tn(A1 * k * k)}\\ \\text{cm}^2\\). The smaller solid has volume \\(${V1}\\ \\text{cm}^3\\). Work out the volume of the larger solid.`, a: FD.round(V1 * k ** 3, 4), unit: 'cm³', why: `\\(k^2 = ${FD.tn(A1 * k * k)} \\div ${A1} = ${FD.tn(k * k)}\\), so \\(k = ${FD.tn(k)}\\). \\(V = ${V1} \\times ${FD.tn(k)}^3 = ${FD.tn(FD.round(V1 * k ** 3, 4))}\\ \\text{cm}^3\\).` }; },
    () => { const k = FD.pick([1.5, 2, 3, 4]), V1 = FD.rnd(2, 15) * 8, h1 = FD.rnd(2, 12) * 2; return { type: 'num', q: `Two similar containers have volumes \\(${V1}\\ \\text{cm}^3\\) and \\(${FD.tn(V1 * k ** 3)}\\ \\text{cm}^3\\). The smaller container is \\(${h1}\\) cm tall. Work out the height of the larger container.`, a: h1 * k, unit: 'cm', why: `\\(k^3 = ${FD.tn(V1 * k ** 3)} \\div ${V1} = ${FD.tn(k ** 3)}\\), so \\(k = \\sqrt[3]{${FD.tn(k ** 3)}} = ${FD.tn(k)}\\). \\(${h1} \\times ${FD.tn(k)} = ${FD.tn(h1 * k)}\\) cm.` }; },
    () => { const k = FD.pick([2, 3, 4, 5]), V1 = FD.rnd(2, 12), A1 = FD.rnd(3, 30); return { type: 'num', q: `Two similar solids have volumes \\(${V1}\\ \\text{cm}^3\\) and \\(${V1 * k ** 3}\\ \\text{cm}^3\\). The smaller has surface area \\(${A1}\\ \\text{cm}^2\\). Work out the surface area of the larger.`, a: A1 * k * k, unit: 'cm²', why: `\\(k^3 = ${k ** 3}\\), so \\(k = ${k}\\) and \\(k^2 = ${k * k}\\). \\(${A1} \\times ${k * k} = ${A1 * k * k}\\ \\text{cm}^2\\).` }; },
    () => { const h1 = FD.rnd(5, 20), k = FD.pick([2, 3, 4]), m = FD.rnd(2, 30) / 10; return { type: 'num', q: `Two similar models are made of the same material. They are \\(${h1}\\) cm and \\(${h1 * k}\\) cm tall. The smaller model has a mass of \\(${FD.tn(m)}\\) kg. Work out the mass of the larger model.`, a: FD.round(m * k ** 3, 4), unit: 'kg', why: `\\(k = ${k}\\). Mass scales like volume: \\(${FD.tn(m)} \\times ${k}^3 = ${FD.tn(FD.round(m * k ** 3, 4))}\\) kg.` }; },
  ],
});

FD.check({
  section: 'simprob',
  items: [
    { type: 'num', q: 'Two similar solids have areas in the ratio \\(4 : 9\\). What is the ratio of their volumes? Enter the larger number when the smaller is 8.', a: 27, why: '\\(k = \\tfrac32\\), volumes \\(8 : 27\\).' },
    { type: 'num', q: 'Volumes of two similar solids are 2 and 54 cm³. What is the length scale factor?', a: 3, why: '\\(\\sqrt[3]{27} = 3\\).' },
    { type: 'mcq', q: 'The mass of a solid model scales with…', opts: ['\\(k^3\\)', '\\(k^2\\)', '\\(k\\)', 'it does not change'], why: 'Mass depends on volume.' },
    { type: 'tf', q: 'If the areas of two similar shapes are in the ratio 1 : 25, their lengths are in the ratio 1 : 5.', a: true, why: '\\(\\sqrt{25} = 5\\).' },
  ],
});
