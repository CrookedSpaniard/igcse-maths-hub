// Volume units: a 1 cm cube is 10 × 10 × 10 = 1000 small mm cubes. Capacity: 1 litre = 1000 cm³.
FD.add({
  id: 'volunits',
  title: 'Volume units and capacity',
  tab: 'Volume units',
  icon: 'target',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Volume units', '\\(1\\ \\text{cm}^3 = 1000\\ \\text{mm}^3\\), \\(1\\ \\text{m}^3 = 1\\,000\\,000\\ \\text{cm}^3\\).'],
    ['Capacity', 'How much a container holds. \\(1\\ \\text{litre} = 1000\\ \\text{cm}^3\\) and \\(1\\ \\text{ml} = 1\\ \\text{cm}^3\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A cube divided into smaller cubes',
      ctrls: `<label class="ctrl">Edge of the cube (cm) <input type="range" id="e" min="1" max="50" value="10"><output id="oe">10</output></label>`,
    });
    // A cube split into n × n × n small cubes; top and bottom labels.
    a.cube = (n, top, side) => {
      const r = FD.d3(FD.cubV(1, 1, 1), FD.cubE, { box: [100, 40, 220, 210], faces: FD.cubF });
      a.draw(r.s + FD.cubeGrid(r.P, 1, 1, 1, 1 / n) + G.t([r.P([0.5, 0, 0])[0], r.P([0, 0, 0])[1] + 18], top, 's') + G.t([r.P([0, 0, 0.5])[0] - 10, r.P([0, 0, 0.5])[1]], side, 's en'));
    };
    a.onSync(() => {
      const e = a.val('e'), V = e ** 3;
      a.out('e', e);
      a.cube(e <= 10 ? e : 10, `${e} cm`, `${e} cm`);
      a.big(`${e}^3 = ${FD.num(V)}\\ \\text{cm}^3`);
      a.msg(`\\(= ${FD.tn(V * 1000)}\\ \\text{mm}^3 = ${FD.tn(V / 1000)}\\) litres`);
    });
    a.cube(10, '1 cm = 10 mm', '10 mm');
    return a;
  },
  steps: [
    {
      title: 'Cubic centimetres and millimetres',
      text: '<p>A 1 cm cube is 10 mm along each edge, so it holds \\(10 \\times 10 \\times 10 = 1000\\) cubes of \\(1\\ \\text{mm}^3\\).</p><p class="mbig">\\(1\\ \\text{cm}^3 = 1000\\ \\text{mm}^3\\)</p>',
      on(a) { a.off(); a.cube(10, '1 cm = 10 mm', '10 mm'); },
    },
    {
      title: 'Cubic metres',
      text: '<p>A 1 m cube is 100 cm along each edge.</p><p class="mbig">\\(1\\ \\text{m}^3 = 100^3 = 1\\,000\\,000\\ \\text{cm}^3\\)</p>',
      tip: 'Cube the length conversion: 1 m = 100 cm, so 1 m³ = 100³ cm³.',
      async on(a, ctx) { a.off(); a.cube(10, '1 m = 100 cm', '100 cm'); await a.play(ctx, [['2.5\\ \\text{m}^3 = 2.5 \\times 1\\,000\\,000 = 2\\,500\\,000\\ \\text{cm}^3', 'big unit to small: multiply'], ['8000\\ \\text{mm}^3 = 8000 \\div 1000 = 8\\ \\text{cm}^3', 'small unit to big: divide']]); },
    },
    {
      title: 'Capacity: litres and millilitres',
      text: '<p>A cube 10 cm by 10 cm by 10 cm holds exactly <b>1 litre</b>.</p><ul><li>\\(1\\ \\text{litre} = 1000\\ \\text{cm}^3\\)</li><li>\\(1\\ \\text{ml} = 1\\ \\text{cm}^3\\)</li><li>\\(1\\ \\text{m}^3 = 1000\\) litres</li></ul>',
      async on(a, ctx) { a.off(); a.cube(10, '10 cm', '10 cm'); await a.play(ctx, [['10 \\times 10 \\times 10 = 1000\\ \\text{cm}^3 = 1\\ \\text{litre}', ''], ['4500\\ \\text{cm}^3 = 4500 \\div 1000 = 4.5\\ \\text{litres}', '']]); },
    },
    {
      title: 'Try it: change the cube',
      text: '<p>Change the edge of the cube and read its volume in \\(\\text{cm}^3\\), \\(\\text{mm}^3\\) and litres.</p>',
      tip: 'Which edge length gives exactly 1 litre?',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'volunits',
  gens: [
    () => {
      const [from, to, f] = FD.pick([['cm³', 'mm³', 1000], ['m³', 'cm³', 1000000], ['mm³', 'cm³', 0.001], ['cm³', 'm³', 0.000001], ['litres', 'cm³', 1000], ['cm³', 'litres', 0.001], ['m³', 'litres', 1000], ['ml', 'cm³', 1]]);
      const v = f >= 1 ? FD.pick([FD.rnd(2, 95) / 10, FD.rnd(2, 40)]) : FD.rnd(1, 99) * (f === 0.001 ? 100 : 100000);
      const ans = FD.round(v * f, 6), g = f >= 1 ? f : FD.round(1 / f, 0);
      return { type: 'num', q: `Change \\(${FD.tn(v)}\\) ${from} into ${to}.`, a: ans, unit: to, why: f === 1 ? '\\(1\\) ml \\(= 1\\ \\text{cm}^3\\), so the number stays the same.' : `${f > 1 ? 'Multiply' : 'Divide'} by \\(${FD.tn(g)}\\): \\(${FD.tn(v)} ${f > 1 ? '\\times' : '\\div'} ${FD.tn(g)} = ${FD.tn(ans)}\\).` };
    },
    () => { const l = FD.rnd(10, 60), w = FD.rnd(10, 40), h = FD.rnd(10, 40), V = l * w * h; return { type: 'num', q: `A fish tank is a cuboid \\(${l}\\) cm by \\(${w}\\) cm by \\(${h}\\) cm. How many litres of water does it hold when full?`, a: V / 1000, unit: 'litres', why: `\\(${l} \\times ${w} \\times ${h} = ${FD.tn(V)}\\ \\text{cm}^3\\), and \\(${FD.tn(V)} \\div 1000 = ${FD.tn(V / 1000)}\\) litres.` }; },
  ],
});

FD.check({
  section: 'volunits',
  items: [
    { type: 'mcq', q: '\\(1\\ \\text{cm}^3 =\\)', opts: ['\\(1000\\ \\text{mm}^3\\)', '\\(100\\ \\text{mm}^3\\)', '\\(10\\ \\text{mm}^3\\)', '\\(1\\,000\\,000\\ \\text{mm}^3\\)'], why: '\\(10^3\\).' },
    { type: 'num', q: 'Change 3.2 litres into cm³.', a: 3200, unit: 'cm³', why: '\\(\\times 1000\\).' },
    { type: 'num', q: 'Change \\(0.6\\ \\text{m}^3\\) into \\(\\text{cm}^3\\).', a: 600000, unit: 'cm³', why: '\\(\\times 1\\,000\\,000\\).' },
    { type: 'tf', q: '\\(1\\) ml is the same as \\(1\\ \\text{cm}^3\\).', a: true, why: 'Yes: 1000 ml = 1 litre = 1000 cm³.' },
  ],
});
