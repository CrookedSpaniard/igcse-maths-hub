// Reading scales on measuring instruments, the 12-hour and 24-hour clock, and sensible estimates.
FD.SCALES = {
  kg: { name: 'Kitchen scales (kg)', lo: 0, hi: 5, major: 1, minor: 5, unit: 'kg' },
  ml: { name: 'Measuring jug (ml)', lo: 0, hi: 500, major: 100, minor: 4, unit: 'ml' },
  deg: { name: 'Thermometer (°C)', lo: -20, hi: 40, major: 10, minor: 5, unit: '°C' },
  cm: { name: 'Ruler (cm)', lo: 0, hi: 10, major: 1, minor: 10, unit: 'cm' },
};
FD.add({
  id: 'reading',
  title: 'Reading scales, time and estimates',
  tab: 'Scales & time',
  icon: 'calc',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Division', 'The gap between two marks on a scale. Work out what one small division is worth before you read the scale.'],
    ['24-hour clock', 'Times written with four digits from 00:00 to 23:59. 3:40 pm is 15:40.'],
    ['Estimate', 'A sensible rough value, e.g. a door is about 2 m tall.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 260', label: 'A measuring scale with a pointer',
      ctrls: `<div class="row"><label>Instrument <select id="ins">${Object.entries(FD.SCALES).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('')}</select></label></div>
        <label class="ctrl">Pointer <input type="range" id="pv" min="0" max="100" value="62"><output id="opv"></output></label>`,
    });
    const X0 = 30, X1 = 390;
    // Draw a straight scale with a pointer at value v.
    a.scale = (k, v, hi = false) => {
      const S = FD.SCALES[k], X = (x) => X0 + ((x - S.lo) / (S.hi - S.lo)) * (X1 - X0), step = S.major / S.minor;
      let s = `<rect class="g-fill2" x="${X0 - 12}" y="90" width="${X1 - X0 + 24}" height="70" rx="8"/>`;
      for (let x = S.lo, i = 0; x <= S.hi + 1e-9; x = S.lo + ++i * step) {
        const major = i % S.minor === 0;
        s += G.line([X(x), 90], [X(x), major ? 120 : 106], major ? 'g-ln' : 'g-thin');
        if (major) s += G.t([X(x), 136], FD.num(FD.round(x, 3)));
      }
      if (hi) { const x = S.lo + S.major; s += G.line([X(S.lo), 70], [X(x), 70], 'g-hl') + G.t([X(S.lo), 54], `${S.minor} divisions = ${S.major} ${S.unit}`, 'l st'); }
      s += G.vec([X(v), 200], [X(v), 96], 'g-vec') + G.t([X(v), 220], FD.num(FD.round(v, 3)) + ' ' + S.unit, 'l');
      a.draw(s);
    };
    // Clock face showing h:m (24-hour h).
    a.clock = (h, m, label = '') => {
      const C = [130, 130], R = 105;
      let s = G.circ(C, R, 'g-fill2');
      for (let i = 0; i < 60; i++) { const big = i % 5 === 0; s += G.line(G.polar(C, R - (big ? 14 : 7), 90 - i * 6), G.polar(C, R - 2, 90 - i * 6), big ? 'g-ln' : 'g-thin'); }
      for (let i = 1; i <= 12; i++) s += G.t(G.polar(C, R - 28, 90 - i * 30), i, 's');
      s += G.line(C, G.polar(C, 55, 90 - ((h % 12) + m / 60) * 30), 'g-hl') + G.line(C, G.polar(C, 82, 90 - m * 6), 'g-ln') + G.dot(C, 'g-dot k', 5);
      const pm = h >= 12, h12 = h % 12 === 0 ? 12 : h % 12, mm = String(m).padStart(2, '0');
      s += G.t([330, 105], `${h12}:${mm} ${pm ? 'pm' : 'am'}`) + G.t([330, 145], `${String(h).padStart(2, '0')}:${mm}`, 'l') + (label ? G.t([330, 185], label, 's') : '');
      a.draw(s);
    };
    a.onSync(() => {
      const k = a.q('#ins').value, S = FD.SCALES[k], step = S.major / S.minor, n = Math.round((S.hi - S.lo) / step);
      const v = S.lo + Math.round((a.val('pv') / 100) * n) * step;
      a.q('#opv').textContent = FD.num(FD.round(v, 3)) + ' ' + S.unit;
      a.scale(k, FD.round(v, 3), true);
      a.msg(`Each small division is \\(${S.major} \\div ${S.minor} = ${FD.tn(step)}\\) ${S.unit}.`);
    });
    a.scale('kg', 3.4);
    return a;
  },
  steps: [
    {
      title: 'What is one division worth?',
      text: '<p>Before you read a scale, work out what each <b>small division</b> is worth.</p><p>On these scales there are <b>5 divisions</b> between 0 and 1 kg, so each one is \\(1 \\div 5 = 0.2\\) kg.</p>',
      async on(a, ctx) { a.off(); a.scale('kg', 0, true); for (let v = 0; v <= 3.4 + 1e-9; v += 0.2) { a.scale('kg', FD.round(v, 1), true); if (!(await ctx.sleep(160))) return; } a.msg('The pointer is 2 divisions after 3 kg: \\(3 + 2 \\times 0.2 = 3.4\\) kg.'); },
    },
    {
      title: 'Negative numbers on a scale',
      text: '<p>A thermometer can go below zero. Here each small division is \\(10 \\div 5 = 2^\\circ\\text{C}\\).</p><p>The pointer is 3 divisions below 0: \\(-6^\\circ\\text{C}\\).</p>',
      async on(a, ctx) { a.off(); a.scale('deg', 20, true); if (!(await ctx.sleep(800))) return; for (let v = 20; v >= -6; v -= 2) { a.scale('deg', v, true); if (!(await ctx.sleep(150))) return; } },
    },
    {
      title: '12-hour and 24-hour clock',
      text: '<p>The 24-hour clock counts on after 12 noon: 1 pm is 13:00, 3:40 pm is <b>15:40</b>. Midnight is 00:00.</p><p>A train leaves at <b>09:45</b> and arrives at <b>13:20</b>. How long is the journey?</p>',
      tip: 'Count up in steps to the next whole hour. Never subtract times like ordinary decimals: 13.20 − 9.45 is wrong!',
      async on(a, ctx) {
        a.off(); a.clock(9, 45, 'leaves');
        if (!(await a.play(ctx, [['09{:}45 \\to 10{:}00', '15 min'], ['10{:}00 \\to 13{:}00', '3 h'], ['13{:}00 \\to 13{:}20', '20 min'], ['\\text{total} = 3\\ \\text{h}\\ 35\\ \\text{min}', '']], 1300))) return;
        a.clock(13, 20, 'arrives');
      },
    },
    {
      title: 'Sensible estimates',
      text: '<p>Know some everyday sizes to make <b>sensible estimates</b>:</p><ul><li>a door is about \\(2\\) m tall,</li><li>an adult is about \\(1.7\\) m tall and has a mass of about \\(70\\) kg,</li><li>a can of drink holds about \\(330\\) ml,</li><li>a bag of sugar has a mass of \\(1\\) kg.</li></ul>',
      tip: 'A car about 4 m long is twice as long as a door is tall.',
      on(a) { a.off(); a.scale('cm', 8.5, false); a.msg('A pencil is about 15 cm long; a paper clip is about 3 cm.'); },
    },
    {
      title: 'Try it: read the scale',
      text: '<p>Choose an instrument and move the pointer. Work out what one division is worth, then read the value before you look at the label.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'reading',
  gens: [
    () => { const [major, minor] = FD.pick([[1, 5], [10, 5], [100, 4], [1, 10], [50, 5], [20, 4]]), step = major / minor, base = FD.rnd(1, 6) * major, k = FD.rnd(1, minor - 1); return { type: 'num', q: `On a scale, the big marks go up in ${major}s and there are ${minor} small divisions between big marks. The pointer is ${k} small division${k > 1 ? 's' : ''} after the ${FD.num(base)} mark. What is the reading?`, a: FD.round(base + k * step, 6), why: `One division \\(= ${major} \\div ${minor} = ${FD.tn(step)}\\). Reading \\(= ${FD.tn(base)} + ${k} \\times ${FD.tn(step)} = ${FD.tn(FD.round(base + k * step, 6))}\\).` }; },
    () => { let h1, m1, h2, m2, d; do { h1 = FD.rnd(6, 15); m1 = FD.rnd(0, 11) * 5; h2 = FD.rnd(h1 + 1, 23); m2 = FD.rnd(0, 11) * 5; d = h2 * 60 + m2 - h1 * 60 - m1; } while (d <= 0); const f = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; return { type: 'num', q: `A bus leaves at ${f(h1, m1)} and arrives at ${f(h2, m2)}. How many <b>minutes</b> does the journey take?`, a: d, unit: 'min', why: `From ${f(h1, m1)} to ${f(h2, m2)} is ${Math.floor(d / 60)} h ${d % 60} min \\(= ${Math.floor(d / 60)} \\times 60 + ${d % 60} = ${d}\\) minutes.` }; },
    () => { const h = FD.rnd(13, 23), m = FD.rnd(0, 11) * 5, mm = String(m).padStart(2, '0'); return { type: 'mcq', q: `Write ${h}:${mm} using the 12-hour clock.`, opts: [`${h - 12}:${mm} pm`, `${h - 12}:${mm} am`, `${h - 10}:${mm} pm`, `${h}:${mm} pm`], why: `Subtract 12 from the hour and use pm: ${h} − 12 = ${h - 12}.` }; },
    () => FD.pick([
      { type: 'mcq', q: 'Which is the most sensible estimate for the height of a classroom door?', opts: ['2 m', '20 cm', '20 m', '2 km'], why: 'A door is a little taller than an adult: about 2 m.' },
      { type: 'mcq', q: 'Which is the most sensible estimate for the mass of an apple?', opts: ['150 g', '15 kg', '1.5 g', '1500 kg'], why: 'An apple has a mass of roughly 100–200 g.' },
      { type: 'mcq', q: 'Which is the most sensible estimate for the capacity of a teacup?', opts: ['250 ml', '25 litres', '2.5 ml', '2500 litres'], why: 'A cup holds about a quarter of a litre.' },
      { type: 'mcq', q: 'Which is the most sensible estimate for the length of a car?', opts: ['4 m', '40 cm', '40 m', '0.4 km'], why: 'A family car is about 4 m long.' },
    ]),
  ],
});

FD.check({
  section: 'reading',
  items: [
    { type: 'num', q: 'A jug has marks every 100 ml with 4 small divisions between them. The water is 3 divisions above the 200 ml mark. How much water is in the jug?', a: 275, unit: 'ml', why: 'One division \\(= 100 \\div 4 = 25\\) ml. \\(200 + 3 \\times 25 = 275\\) ml.' },
    { type: 'mcq', q: '7:25 pm in the 24-hour clock is…', opts: ['19:25', '07:25', '17:25', '19:52'], why: 'Add 12 to the hour: \\(7 + 12 = 19\\).' },
    { type: 'mcq', q: 'A film starts at 18:50 and lasts 2 hours 25 minutes. When does it finish?', opts: ['21:15', '20:75', '21:25', '20:15'], why: '18:50 + 2 h = 20:50; + 10 min = 21:00; + 15 min = 21:15.' },
    { type: 'mcq', q: 'The most sensible estimate for the mass of an adult is…', opts: ['70 kg', '7 kg', '700 kg', '70 g'], why: 'Adults are typically 50–90 kg.' },
  ],
});
