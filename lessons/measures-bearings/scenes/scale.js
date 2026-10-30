// Map scales: measure on the map with a ruler, then scale up to the real distance.
FD.add({
  id: 'scale',
  title: 'Scale drawings and maps',
  tab: 'Scales',
  icon: 'geometry',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Scale 1 : n', '1 unit on the map stands for \\(n\\) of the same units in real life.'],
    ['Scale drawing', 'An accurate drawing where every length is the real length divided by the same number.'],
  ],
  mount(el) {
    const G = FD.G, CM = 40, A = [50, 120];
    const a = FD.stage(el, {
      vb: '0 0 420 260', label: 'A map with two towns and a ruler',
      ctrls: `<div class="row"><label>Scale <select id="sc"><option value="25000">1 : 25 000</option><option value="50000" selected>1 : 50 000</option><option value="100000">1 : 100 000</option><option value="200000">1 : 200 000</option></select></label></div>
        <label class="ctrl">Distance on the map (cm) <input type="range" id="cm" min="1" max="8" step="0.5" value="6"><output id="ocm">6</output></label>`,
    });
    // m = map distance in cm; r = how much of the ruler to show (0..1)
    a.map = (m, r = 1, label = '') => {
      const B = [A[0] + m * CM, A[1]];
      let s = `<path class="g-fill2" opacity=".55" d="M0 40 C 80 10, 160 70, 240 30 S 380 20, 420 50 V 0 H 0 Z"/><path class="g-dash" d="M20 230 C 120 190, 200 250, 300 210 S 400 200, 420 215"/>`;
      s += G.line(A, B, 'g-hl') + G.dot(A, 'g-dot k', 7) + G.dot(B, 'g-dot k', 7) + G.t([A[0], A[1] - 18], 'A') + G.t([B[0], B[1] - 18], 'B');
      if (label) s += G.t([(A[0] + B[0]) / 2, A[1] - 18], label, 'l');
      if (r > 0) {
        const len = 8 * CM * r;
        s += `<rect class="g-fill" x="${A[0]}" y="${A[1] + 16}" width="${len.toFixed(1)}" height="34" rx="3"/>`;
        for (let k = 0; k <= 16 * r + 1e-9; k++) { const x = A[0] + k * CM / 2; s += G.line([x, A[1] + 16], [x, A[1] + (k % 2 ? 24 : 30)], 'g-thin'); if (k % 2 === 0) s += G.t([x, A[1] + 40], k / 2, 's'); }
      }
      a.draw(s);
    };
    a.onSync(() => {
      const sc = +a.q('#sc').value, m = a.val('cm'), real = m * sc;
      a.out('cm', m); a.map(m);
      a.big(`${m}\\ \\text{cm} \\times ${FD.tn(sc)} = ${FD.tn(real)}\\ \\text{cm}`);
      a.msg(`\\(= ${FD.tn(real / 100)}\\ \\text{m} = ${FD.tn(real / 100000)}\\ \\text{km}\\) in real life.`);
    });
    a.map(6, 0);
    return a;
  },
  steps: [
    {
      title: 'What a scale means',
      text: '<p>The map scale is <b>1 : 50 000</b>. Every <b>1 cm</b> on the map stands for <b>50 000 cm</b> in real life.</p><p>\\(50\\,000\\ \\text{cm} = 500\\ \\text{m}\\), so 1 cm on the map is half a kilometre.</p>',
      on(a) { a.off(); a.map(6, 0); a.big('1 : 50\\,000'); },
    },
    {
      title: 'Measure, then multiply',
      text: '<p>Measure the map distance from A to B with a ruler: <b>6 cm</b>.</p><p>Multiply by the scale, then change the units.</p>',
      async on(a, ctx) {
        a.off();
        for (let r = 0; r <= 1.0001; r += 0.05) { a.map(6, r); if (!(await ctx.sleep(40))) return; }
        a.map(6, 1, '6 cm');
        await a.play(ctx, [['6 \\times 50\\,000 = 300\\,000\\ \\text{cm}', 'multiply by the scale'], ['300\\,000\\ \\text{cm} = 3000\\ \\text{m} = 3\\ \\text{km}', '÷ 100, then ÷ 1000']]);
      },
    },
    {
      title: 'Real distance to map distance',
      text: '<p>Two villages are \\(4.5\\) km apart. How far apart are they on a map with scale \\(1 : 25\\,000\\)?</p><p>Change to centimetres first, then <b>divide</b> by the scale.</p>',
      tip: 'Real → map: divide. Map → real: multiply.',
      async on(a, ctx) {
        a.off(); a.map(4.5, 0, '?');
        await a.play(ctx, [['4.5\\ \\text{km} = 4500\\ \\text{m} = 450\\,000\\ \\text{cm}', ''], ['450\\,000 \\div 25\\,000 = 18\\ \\text{cm}', 'divide by the scale']]);
      },
    },
    {
      title: 'Scale drawings',
      text: '<p>A plan of a room uses the scale <b>1 cm to 2 m</b>. On the plan the room is \\(5.5\\) cm by \\(4\\) cm.</p><p>Every length is multiplied by 2 m: the real room is \\(11\\) m by \\(8\\) m.</p>',
      async on(a, ctx) {
        a.off(); a.draw(`<rect class="g-fill" x="100" y="40" width="220" height="160"/>` + FD.G.t([210, 220], '5.5 cm → 11 m', 'l') + FD.G.t([335, 120], '4 cm', 'st') + FD.G.t([210, 120], 'plan of the room', 's'));
        await a.play(ctx, [['5.5 \\times 2 = 11\\ \\text{m}', 'length'], ['4 \\times 2 = 8\\ \\text{m}', 'width']]);
      },
    },
    {
      title: 'Try it: use the map',
      text: '<p>Change the distance on the map and the scale. Read off the real distance.</p>',
      tip: 'On a 1 : 100 000 map, 1 cm is exactly 1 km.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'scale',
  gens: [
    () => { const sc = FD.pick([10000, 20000, 25000, 50000, 100000, 200000]), m = FD.rnd(2, 18) / 2; return { type: 'num', q: `A map has a scale of \\(1 : ${FD.tn(sc)}\\). Two towns are \\(${FD.tn(m)}\\) cm apart on the map. How far apart are they in real life, in kilometres?`, a: FD.round((m * sc) / 100000, 6), unit: 'km', why: `\\(${FD.tn(m)} \\times ${FD.tn(sc)} = ${FD.tn(m * sc)}\\) cm. Divide by 100 000 to get km: \\(${FD.tn(FD.round((m * sc) / 100000, 6))}\\) km.` }; },
    () => { const sc = FD.pick([25000, 50000, 100000, 200000]), m = FD.rnd(2, 20) / 2, km = (m * sc) / 100000; return { type: 'num', q: `On a map with scale \\(1 : ${FD.tn(sc)}\\), how many centimetres represent \\(${FD.tn(km)}\\) km?`, a: m, unit: 'cm', why: `\\(${FD.tn(km)}\\) km \\(= ${FD.tn(km * 100000)}\\) cm. \\(${FD.tn(km * 100000)} \\div ${FD.tn(sc)} = ${FD.tn(m)}\\) cm.` }; },
    () => { const k = FD.pick([2, 3, 4, 5]), l = FD.rnd(3, 15) / 2; return { type: 'num', q: `A scale drawing uses 1 cm to represent ${k} m. A wall is \\(${FD.tn(l)}\\) cm long on the drawing. How long is the real wall?`, a: k * l, unit: 'm', why: `\\(${FD.tn(l)} \\times ${k} = ${FD.tn(k * l)}\\) m.` }; },
  ],
});

FD.check({
  section: 'scale',
  items: [
    { type: 'num', q: 'On a \\(1 : 50\\,000\\) map, two points are \\(8\\) cm apart. What is the real distance in km?', a: 4, unit: 'km', why: '\\(8 \\times 50\\,000 = 400\\,000\\) cm \\(= 4\\) km.' },
    { type: 'num', q: 'A road is \\(6\\) km long. How long is it on a \\(1 : 200\\,000\\) map, in cm?', a: 3, unit: 'cm', why: '\\(600\\,000 \\div 200\\,000 = 3\\) cm.' },
    { type: 'mcq', q: 'A scale of 1 cm to 5 km is the same as…', opts: ['\\(1 : 500\\,000\\)', '\\(1 : 5000\\)', '\\(1 : 50\\,000\\)', '\\(1 : 5\\)'], why: '\\(5\\) km \\(= 500\\,000\\) cm.' },
    { type: 'tf', q: 'To go from a real distance to a map distance you multiply by the scale.', a: false, why: 'Real → map: divide. Map → real: multiply.' },
  ],
});
