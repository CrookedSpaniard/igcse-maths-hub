// Compound measures: a formula triangle and a car moving along a road.
FD.add({
  id: 'compound',
  title: 'Speed, density and pressure',
  tab: 'Compound measures',
  icon: 'calc',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Compound measure', 'A measure made from two others, like speed (distance and time) or density (mass and volume).'],
    ['Speed', '\\(\\text{speed} = \\dfrac{\\text{distance}}{\\text{time}}\\), in km/h or m/s.'],
    ['Density', '\\(\\text{density} = \\dfrac{\\text{mass}}{\\text{volume}}\\), in g/cm³ or kg/m³.'],
    ['Pressure', '\\(\\text{pressure} = \\dfrac{\\text{force}}{\\text{area}}\\), in newtons per square metre (N/m²).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A formula triangle and a road',
      ctrls: `<div class="row"><label>Find <select id="fx"><option value="S">speed</option><option value="D">distance</option><option value="T">time</option></select></label></div>
        <label class="ctrl">Distance (km) <input type="range" id="d" min="10" max="300" step="10" value="120"><output id="od">120</output></label>
        <label class="ctrl">Speed (km/h) <input type="range" id="s" min="10" max="120" step="5" value="60"><output id="os">60</output></label>
        <label class="ctrl">Time (h) <input type="range" id="t" min="0.5" max="6" step="0.5" value="1.5"><output id="ot">1.5</output></label>`,
    });
    // tri: labels [top, left, right]; cover = 0, 1, 2 (which part is hidden); car: fraction along the road (null = no road)
    a.scene = (lbl, cover = -1, car = null, marks = []) => {
      const T = [120, 30], L = [30, 200], R = [210, 200], yM = 115;
      let s = G.poly([T, L, R], 'g-fill2');
      const regions = [`M${T[0]} ${T[1]}L${T[0] - 45} ${yM}H${T[0] + 45}Z`, `M${L[0]} ${L[1]}L${T[0] - 45} ${yM}H${T[0]}V${L[1]}Z`, `M${R[0]} ${R[1]}L${T[0] + 45} ${yM}H${T[0]}V${R[1]}Z`];
      if (cover >= 0) s += `<path class="g-fill" d="${regions[cover]}"/>`;
      s += G.line([T[0] - 45, yM], [T[0] + 45, yM]) + G.line([T[0], yM], [T[0], L[1]]);
      s += G.t([120, 85], lbl[0], cover === 0 ? 'l' : '') + G.t([82, 165], lbl[1], cover === 1 ? 'l' : '') + G.t([158, 165], lbl[2], cover === 2 ? 'l' : '');
      s += G.t([120, 222], cover === 0 ? `${lbl[0]} = ${lbl[1]} × ${lbl[2]}` : cover === 1 ? `${lbl[1]} = ${lbl[0]} ÷ ${lbl[2]}` : cover === 2 ? `${lbl[2]} = ${lbl[0]} ÷ ${lbl[1]}` : '', 'l');
      if (car !== null) {
        const x = 40 + car * 320;
        s += G.line([40, 270], [360, 270]) + marks.map(([f, t]) => G.line([40 + f * 320, 262], [40 + f * 320, 278], 'g-thin') + G.t([40 + f * 320, 290], t, 's')).join('');
        s += `<rect class="g-bar on" x="${(x - 16).toFixed(1)}" y="248" width="32" height="16" rx="5"/>` + G.dot([x - 9, 266], 'g-dot k', 4) + G.dot([x + 9, 266], 'g-dot k', 4);
      }
      a.draw(s);
    };
    a.drive = async (ctx, hours, marks) => { for (let i = 0; i <= 40; i++) { a.scene(['D', 'S', 'T'], -1, i / 40, marks.filter(([f]) => f <= i / 40 + 1e-9)); if (!(await ctx.sleep(Math.max(20, (hours * 900) / 40)))) return false; } return true; };
    a.onSync(() => {
      const f = a.q('#fx').value, d = a.val('d'), t = a.val('t'), s = a.val('s');
      a.out('d', d); a.out('t', t); a.out('s', s);
      ['d', 's', 't'].forEach((k) => { a.q('#' + k).closest('label').hidden = k === f.toLowerCase(); });
      let D = d;
      if (f === 'S') a.big(`S = \\frac{D}{T} = \\frac{${d}}{${t}} = ${FD.num(FD.round(d / t, 2))}\\ \\text{km/h}`);
      if (f === 'D') { D = s * t; a.big(`D = S \\times T = ${s} \\times ${t} = ${FD.num(D)}\\ \\text{km}`); }
      if (f === 'T') { const T = d / s; a.big(`T = \\frac{D}{S} = \\frac{${d}}{${s}} = ${FD.num(FD.round(T, 2))}\\ \\text{h}`); a.msg(`That is ${Math.floor(T + 1e-9)} h ${Math.round((T - Math.floor(T + 1e-9)) * 60)} min${T % (1 / 60) > 1e-6 ? ' (to the nearest minute)' : ''}.`); } else a.msg('');
      a.scene(['D', 'S', 'T'], { D: 0, S: 1, T: 2 }[f], 1, [[0, '0 km'], [1, FD.num(D) + ' km']]);
    });
    a.scene(['D', 'S', 'T']);
    return a;
  },
  steps: [
    {
      title: 'Speed: distance per hour',
      text: '<p>A car travels \\(150\\) km in \\(2\\) hours. Each hour it goes \\(150 \\div 2 = 75\\) km.</p><p>Its average <b>speed</b> is \\(75\\) km/h (kilometres per hour).</p>',
      async on(a, ctx) {
        a.off();
        if (!(await a.drive(ctx, 2, [[0, '0 h'], [0.5, '1 h · 75 km'], [1, '2 h · 150 km']]))) return;
        a.big('S = \\frac{D}{T} = \\frac{150}{2} = 75\\ \\text{km/h}');
      },
    },
    {
      title: 'The formula triangle',
      text: '<p>Put <b>D</b> (distance) on top, <b>S</b> (speed) and <b>T</b> (time) underneath. Cover what you want to find:</p><p>\\(S = \\dfrac{D}{T}\\), \\(\\ D = S \\times T\\), \\(\\ T = \\dfrac{D}{S}\\).</p>',
      async on(a, ctx) { a.off(); for (const c of [1, 0, 2]) { a.scene(['D', 'S', 'T'], c); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'Watch the time units',
      text: '<p>A cyclist rides \\(18\\) km in \\(45\\) minutes. Find the speed in km/h.</p><p>Change the minutes into hours first: \\(45\\) min \\(= \\frac{45}{60} = 0.75\\) h.</p>',
      tip: '0.75 h is NOT 75 minutes. 1 h 30 min = 1.5 h, and 20 min = 1/3 h.',
      async on(a, ctx) {
        a.off(); a.scene(['D', 'S', 'T'], 1);
        await a.play(ctx, [['T = 45 \\div 60 = 0.75\\ \\text{h}', 'minutes to hours'], ['S = \\frac{18}{0.75} = 24\\ \\text{km/h}', 'speed = distance ÷ time']]);
      },
    },
    {
      title: 'Density',
      text: '<p><b>Density</b> is mass per unit of volume. Use the same kind of triangle with <b>M</b> on top.</p><p>A metal block has mass \\(540\\) g and volume \\(200\\ \\text{cm}^3\\).</p>',
      async on(a, ctx) {
        a.off(); a.scene(['M', 'D', 'V'], 1);
        if (!(await a.play(ctx, [['D = \\frac{M}{V} = \\frac{540}{200}', ''], ['= 2.7\\ \\text{g/cm}^3', 'grams per cubic centimetre']]))) return;
        a.scene(['M', 'D', 'V'], 0); a.msg('To find a mass: \\(M = D \\times V\\).');
      },
    },
    {
      title: 'Pressure',
      text: '<p><b>Pressure</b> is force per unit of area: \\(P = \\dfrac{F}{A}\\). Force is measured in newtons (N).</p><p>A box pushes down with a force of \\(600\\) N on an area of \\(1.5\\ \\text{m}^2\\).</p>',
      tip: 'The same force on a smaller area gives a bigger pressure. That is why a knife cuts.',
      async on(a, ctx) {
        a.off(); a.scene(['F', 'P', 'A'], 1);
        if (!(await a.play(ctx, [['P = \\frac{F}{A} = \\frac{600}{1.5}', ''], ['= 400\\ \\text{N/m}^2', 'newtons per square metre']]))) return;
        a.scene(['F', 'P', 'A'], 0); a.msg('To find a force: \\(F = P \\times A\\).');
      },
    },
    {
      title: 'Try it: the speed triangle',
      text: '<p>Choose what to find, then change the distance and the time. The highlighted part of the triangle is what you are finding.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'compound',
  gens: [
    () => { const s = FD.rnd(4, 24) * 5, t = FD.pick([0.5, 1.5, 2, 2.5, 3, 4]); return { type: 'num', q: `A train travels \\(${FD.tn(s * t)}\\) km in \\(${FD.tn(t)}\\) hours. Work out its average speed.`, a: s, unit: 'km/h', why: `\\(S = D \\div T = ${FD.tn(s * t)} \\div ${FD.tn(t)} = ${s}\\) km/h.` }; },
    () => { const s = FD.rnd(3, 20) * 6, m = FD.pick([10, 20, 30, 40, 50, 90]); return { type: 'num', q: `A bus travels at \\(${s}\\) km/h for \\(${m}\\) minutes. How far does it go?`, a: (s * m) / 60, unit: 'km', why: `\\(${m}\\) min \\(= ${m} \\div 60\\) h. \\(D = S \\times T = ${s} \\times \\frac{${m}}{60} = ${FD.tn((s * m) / 60)}\\) km.` }; },
    () => { const d = FD.pick([2.7, 7.8, 8.9, 1.2, 0.8, 11.3, 2.5]), v = FD.rnd(2, 40) * 10; return { type: 'num', q: `A piece of material has density \\(${d}\\ \\text{g/cm}^3\\) and volume \\(${v}\\ \\text{cm}^3\\). Work out its mass.`, a: FD.round(d * v, 2), unit: 'g', why: `\\(M = D \\times V = ${d} \\times ${v} = ${FD.tn(FD.round(d * v, 2))}\\) g.` }; },
    () => { const p = FD.rnd(2, 30) * 50, A = FD.pick([0.5, 2, 2.5, 4, 5, 0.25]); return { type: 'num', q: `A force of \\(${FD.tn(p * A)}\\) N acts on an area of \\(${A}\\ \\text{m}^2\\). Work out the pressure.`, a: p, unit: 'N/m²', why: `\\(P = F \\div A = ${FD.tn(p * A)} \\div ${A} = ${FD.tn(p)}\\ \\text{N/m}^2\\).` }; },
    () => { const s = FD.pick([36, 54, 72, 90, 108, 18]); return { type: 'num', q: `Change \\(${s}\\) km/h into metres per second (m/s).`, a: s / 3.6, unit: 'm/s', why: `\\(${s}\\) km/h \\(= ${s * 1000}\\) m in \\(3600\\) s. \\(${s * 1000} \\div 3600 = ${s / 3.6}\\) m/s.` }; },
  ],
});

FD.check({
  section: 'compound',
  items: [
    { type: 'num', q: 'A car travels \\(210\\) km in \\(3\\) hours. What is its average speed?', a: 70, unit: 'km/h', why: '\\(210 \\div 3 = 70\\).' },
    { type: 'num', q: 'How long does it take to walk \\(10\\) km at \\(4\\) km/h? Give your answer in hours.', a: 2.5, unit: 'h', why: '\\(T = 10 \\div 4 = 2.5\\) hours (2 h 30 min).' },
    { type: 'mcq', q: '\\(1.25\\) hours is…', opts: ['1 h 15 min', '1 h 25 min', '1 h 2.5 min', '125 min'], why: '\\(0.25 \\times 60 = 15\\) minutes.' },
    { type: 'num', q: 'A force of \\(240\\) N acts on an area of \\(0.8\\ \\text{m}^2\\). What is the pressure?', a: 300, unit: 'N/m²', why: '\\(240 \\div 0.8 = 300\\ \\text{N/m}^2\\).' },
    { type: 'num', q: 'A stone has mass \\(390\\) g and volume \\(150\\ \\text{cm}^3\\). Work out its density.', a: 2.6, unit: 'g/cm³', why: '\\(390 \\div 150 = 2.6\\).' },
  ],
});
