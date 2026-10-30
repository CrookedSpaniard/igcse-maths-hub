// Exterior angles: walk round the polygon, turning at each corner. One full turn = 360°.
FD.add({
  id: 'exterior',
  title: 'Exterior angles and regular polygons',
  tab: 'Exterior angles',
  icon: 'geometry',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Exterior angle', 'The angle you turn through at a corner when you walk round the polygon: between one side and the next side extended.'],
    ['Sum of exterior angles', 'For any polygon, the exterior angles add up to \\(360^\\circ\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A regular polygon with its exterior angles',
      ctrls: '<label class="ctrl">Number of sides \\(n\\) <input type="range" id="n" min="3" max="12" value="5"><output id="on">5</output></label>',
    });
    const cls = ['g-arc', 'g-arc2', 'g-arc3'];
    // k = how many exterior angles to show; gather = draw them all together at the centre instead
    a.show = (n, k = n, gather = false) => {
      const P = FD.ngon(n, [210, 158], 100), ext = 360 / n;
      let s = G.poly(P, gather ? 'g-ghost' : 'g-fill');
      if (!gather) {
        for (let i = 0; i < Math.min(k, n); i++) {
          const v = P[i], prev = P[(i + n - 1) % n], nx = P[(i + 1) % n], E = G.lerp(prev, v, 1.45);
          s += G.line(v, E, 'g-dash') + G.arc(v, E, nx, 24, n <= 8 ? FD.num(FD.round(ext, 1)) + '°' : '', cls[i % 3], 40);
        }
      } else {
        for (let i = 0; i < Math.min(k, n); i++) s += G.sector([210, 158], 70, 90 + i * ext, 90 + (i + 1) * ext, cls[i % 3] + ' g-in');
        s += G.t([210, 158], k >= n ? '360°' : FD.num(FD.round(ext * k, 1)) + '°');
      }
      a.draw(s);
    };
    a.onSync(() => {
      const n = a.val('n'), e = 360 / n;
      a.out('n', n); a.show(n);
      a.big(`\\text{exterior} = 360^\\circ \\div ${n} = ${FD.num(FD.round(e, 2))}^\\circ`);
      a.msg(`Interior angle \\(= 180^\\circ - ${FD.tn(FD.round(e, 2))}^\\circ = ${FD.tn(FD.round(180 - e, 2))}^\\circ\\)${360 % n ? ' (rounded)' : ''}.`);
    });
    a.show(5);
    return a;
  },
  steps: [
    {
      title: 'Turning at each corner',
      text: '<p>Imagine walking round a pentagon. At each corner you <b>turn</b> through the <b>exterior angle</b>.</p><p>Each exterior angle is between one side and the next side <b>extended</b>.</p>',
      async on(a, ctx) { a.off(); for (let k = 0; k <= 5; k++) { a.show(5, k); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'They add up to 360°',
      text: '<p>When you get back to the start you have turned <b>exactly once</b>: \\(360^\\circ\\).</p><p>Put the exterior angles together and they make a full turn, for <b>every</b> polygon.</p>',
      async on(a, ctx) { a.off(); for (let k = 0; k <= 5; k++) { a.show(5, k, true); if (!(await ctx.sleep(700))) return; } a.big('72^\\circ \\times 5 = 360^\\circ'); },
    },
    {
      title: 'Exterior and interior',
      text: '<p>At each corner the interior and exterior angles lie on a <b>straight line</b>:</p><p class="mbig">\\(\\text{interior} + \\text{exterior} = 180^\\circ\\)</p>',
      tip: 'For a regular polygon, finding the exterior angle first (360 ÷ n) is often the quickest way.',
      async on(a, ctx) {
        a.off(); a.show(10);
        await a.play(ctx, [['\\text{exterior} = 360 \\div 10 = 36^\\circ', 'regular decagon'], ['\\text{interior} = 180 - 36 = 144^\\circ', 'angles on a straight line']]);
      },
    },
    {
      title: 'How many sides?',
      text: '<p>Each interior angle of a regular polygon is \\(160^\\circ\\). How many sides does it have?</p>',
      async on(a, ctx) {
        a.off(); a.show(12);
        await a.play(ctx, [['\\text{exterior} = 180 - 160 = 20^\\circ', ''], ['n = 360 \\div 20 = 18', 'the exterior angles add up to 360°']]);
      },
    },
    {
      title: 'Try it: regular polygons',
      text: '<p>Change the number of sides. Watch the exterior angle get smaller as the polygon gets closer to a circle.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'exterior',
  gens: [
    () => { const n = FD.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]); return { type: 'num', q: `Work out the size of each exterior angle of a regular polygon with ${n} sides.`, a: 360 / n, unit: '°', why: `\\(360 \\div ${n} = ${360 / n}^\\circ\\).` }; },
    () => { const n = FD.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), e = 360 / n; return { type: 'num', q: `Each exterior angle of a regular polygon is \\(${e}^\\circ\\). How many sides does it have?`, a: n, why: `\\(n = 360 \\div ${e} = ${n}\\).` }; },
    () => { const n = FD.pick([6, 8, 9, 10, 12, 15, 18, 20, 24, 36]), i = 180 - 360 / n; return { type: 'num', q: `Each interior angle of a regular polygon is \\(${i}^\\circ\\). How many sides does it have?`, a: n, why: `Exterior \\(= 180 - ${i} = ${360 / n}^\\circ\\). \\(n = 360 \\div ${360 / n} = ${n}\\).` }; },
    () => { let e; do { e = Array.from({ length: 4 }, () => FD.rnd(40, 100)); } while (360 - e.reduce((p, q) => p + q, 0) < 25); const x = 360 - e.reduce((p, q) => p + q, 0); return { type: 'num', q: `A pentagon has exterior angles ${e.map((v) => `\\(${v}^\\circ\\)`).join(', ')} and \\(x\\). Find \\(x\\).`, a: x, unit: '°', why: `Exterior angles add up to \\(360^\\circ\\): \\(x = 360 - ${e.reduce((p, q) => p + q, 0)} = ${x}^\\circ\\).` }; },
  ],
});

FD.check({
  section: 'exterior',
  items: [
    { type: 'num', q: 'Work out each exterior angle of a regular octagon.', a: 45, unit: '°', why: '\\(360 \\div 8 = 45^\\circ\\).' },
    { type: 'num', q: 'Each exterior angle of a regular polygon is \\(24^\\circ\\). How many sides does it have?', a: 15, why: '\\(360 \\div 24 = 15\\).' },
    { type: 'tf', q: 'A regular polygon could have interior angles of \\(130^\\circ\\).', a: false, why: 'Exterior \\(= 50^\\circ\\), and \\(360 \\div 50 = 7.2\\) is not a whole number of sides.' },
    { type: 'num', q: 'Each interior angle of a regular polygon is \\(150^\\circ\\). How many sides does it have?', a: 12, why: 'Exterior \\(= 30^\\circ\\); \\(360 \\div 30 = 12\\).' },
    { type: 'mcq', q: 'The exterior angles of a 20-sided polygon add up to…', opts: ['\\(360^\\circ\\)', '\\(3240^\\circ\\)', '\\(180^\\circ\\)', '\\(3600^\\circ\\)'], why: 'Exterior angles of any polygon add up to 360°.' },
  ],
});
