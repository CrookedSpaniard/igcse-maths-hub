// Sectors (Higher): an arc and a sector are the fraction θ/360 of the circumference and of the area.
FD.add({
  id: 'sectors',
  title: 'Arc length and area of a sector',
  tab: 'Sectors',
  icon: 'geometry',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Arc', 'Part of the circumference of a circle.'],
    ['Sector', 'A “pizza slice” of a circle, between two radii and an arc.'],
    ['Arc length', '\\(\\dfrac{\\theta}{360} \\times 2\\pi r\\)'],
    ['Area of a sector', '\\(\\dfrac{\\theta}{360} \\times \\pi r^2\\)'],
  ],
  mount(el) {
    const G = FD.G, c = [150, 160], R = 105;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A circle with a shaded sector of angle theta',
      ctrls: `<label class="ctrl">Radius \\(r\\) (cm) <input type="range" id="r" min="2" max="12" value="8"><output id="or">8</output></label>
        <label class="ctrl">Angle \\(\\theta\\) <input type="range" id="t" min="10" max="350" step="5" value="135"><output id="ot">135°</output></label>`,
    });
    // hl: 'arc' highlights the arc, 'per' the arc and both radii
    a.sec = (th, o = {}) => {
      let s = G.circ(c, R, 'g-ghost') + G.sector(c, R, 0, th, 'g-fill');
      if (o.hl) s += `<path class="g-hl" d="${FD.arcD(c, R, 0, th)}"/>`;
      if (o.hl === 'per') s += G.line(c, [c[0] + R, c[1]], 'g-hl2') + G.line(c, G.polar(c, R, th), 'g-hl2');
      s += G.sector(c, 24, 0, th, 'g-arc', o.t || `${th}°`, 40) + G.t([c[0] + R / 2, c[1] + 15], o.r || 'r', 's');
      if (o.hl) s += G.t(G.polar(c, R + 18, th / 2), 'arc', 'l');
      a.draw(s);
    };
    a.onSync(() => {
      const r = a.val('r'), th = a.val('t'), L = (th / 360) * 2 * Math.PI * r, A = (th / 360) * Math.PI * r * r;
      a.out('r', r); a.out('t', th + '°');
      a.sec(th, { hl: 'arc', r: `r = ${r} cm` });
      a.big(`\\text{arc} = \\tfrac{${th}}{360} \\times 2\\pi \\times ${r} = ${FD.num(FD.round(L, 1))}\\ \\text{cm}`);
      a.msg(`Area \\(= \\tfrac{${th}}{360} \\times \\pi \\times ${r}^2 = ${FD.tn(FD.round(A, 1))}\\ \\text{cm}^2\\); perimeter \\(= ${FD.tn(FD.round(L + 2 * r, 1))}\\) cm`);
    });
    a.sec(90, { r: 'r' });
    return a;
  },
  steps: [
    {
      title: 'A fraction of the circle',
      text: '<p>A sector with angle \\(\\theta\\) at the centre is the fraction \\(\\dfrac{\\theta}{360}\\) of the whole circle.</p><p>With \\(\\theta = 90^\\circ\\) it is \\(\\tfrac{90}{360} = \\tfrac14\\) of the circle: a quarter.</p>',
      on(a) { a.off(); a.sec(90, { r: 'r' }); a.big('\\tfrac{90}{360} = \\tfrac14'); },
    },
    {
      title: 'Arc length',
      text: '<p>The arc is that fraction of the <b>circumference</b>.</p><p class="mbig">\\(\\text{arc} = \\dfrac{\\theta}{360} \\times 2\\pi r\\)</p><p>Here \\(r = 8\\) cm and \\(\\theta = 135^\\circ\\).</p>',
      async on(a, ctx) { a.off(); a.sec(135, { hl: 'arc', r: '8 cm' }); await a.play(ctx, [['\\text{arc} = \\tfrac{135}{360} \\times 2 \\times \\pi \\times 8', ''], ['= 18.8\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Area of a sector',
      text: '<p>The sector is the same fraction of the <b>area</b>.</p><p class="mbig">\\(A = \\dfrac{\\theta}{360} \\times \\pi r^2\\)</p>',
      async on(a, ctx) { a.off(); a.sec(135, { r: '8 cm' }); await a.play(ctx, [['A = \\tfrac{135}{360} \\times \\pi \\times 8^2', ''], ['= 75.4\\ \\text{cm}^2', '3 s.f.']]); },
    },
    {
      title: 'Perimeter of a sector',
      text: '<p>The perimeter goes all the way round: the arc <b>and</b> the two radii.</p>',
      tip: 'Keep the full calculator value of the arc, and round only at the end.',
      async on(a, ctx) { a.off(); a.sec(135, { hl: 'per', r: '8 cm' }); await a.play(ctx, [['P = 18.84… + 8 + 8', 'arc + two radii'], ['P = 34.8\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Working backwards',
      text: '<p>A sector of a circle with radius 6 cm has an area of \\(30\\ \\text{cm}^2\\). Find the angle \\(\\theta\\).</p>',
      async on(a, ctx) { a.off(); a.sec(95, { t: 'θ', r: '6 cm' }); await a.play(ctx, [['\\tfrac{\\theta}{360} \\times \\pi \\times 6^2 = 30', 'set up an equation'], ['\\theta = \\frac{30 \\times 360}{36\\pi} = 95.5^\\circ', '1 d.p.']]); },
    },
    {
      title: 'Try it: change the sector',
      text: '<p>Change the radius and the angle. Watch the arc length, the area and the perimeter.</p>',
      tip: 'At θ = 180° the sector is a semicircle; at 360° it is the whole circle.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'sectors',
  gens: [
    () => { const r = FD.rnd(3, 15), t = 5 * FD.rnd(4, 60), L = (t / 360) * 2 * Math.PI * r; return { type: 'num', q: `A sector of a circle has radius \\(${r}\\) cm and angle \\(${t}^\\circ\\). Work out the arc length, to 1 decimal place.`, a: FD.round(L, 1), tol: 0.05, unit: 'cm', why: `\\(\\tfrac{${t}}{360} \\times 2 \\times \\pi \\times ${r} = ${FD.tn(FD.round(L, 1))}\\) cm.` }; },
    () => { const r = FD.rnd(3, 15), t = 5 * FD.rnd(4, 60), A = (t / 360) * Math.PI * r * r; return { type: 'num', q: `A sector of a circle has radius \\(${r}\\) cm and angle \\(${t}^\\circ\\). Work out its area, to 1 decimal place.`, a: FD.round(A, 1), tol: 0.05, unit: 'cm²', why: `\\(\\tfrac{${t}}{360} \\times \\pi \\times ${r}^2 = ${FD.tn(FD.round(A, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const r = FD.rnd(3, 15), t = 5 * FD.rnd(4, 60), L = (t / 360) * 2 * Math.PI * r, P = L + 2 * r; return { type: 'num', q: `A sector of a circle has radius \\(${r}\\) cm and angle \\(${t}^\\circ\\). Work out its perimeter, to 1 decimal place.`, a: FD.round(P, 1), tol: 0.05, unit: 'cm', why: `Arc \\(= \\tfrac{${t}}{360} \\times 2\\pi \\times ${r} = ${FD.tn(FD.round(L, 3))}\\). \\(P = ${FD.tn(FD.round(L, 3))} + ${r} + ${r} = ${FD.tn(FD.round(P, 1))}\\) cm.` }; },
    () => { const r = FD.rnd(4, 15), t = FD.rnd(20, 300), L = FD.round((t / 360) * 2 * Math.PI * r, 1), th = (L * 360) / (2 * Math.PI * r); return { type: 'num', q: `An arc of a circle of radius \\(${r}\\) cm has length \\(${FD.tn(L)}\\) cm. Work out the angle at the centre, to the nearest degree.`, a: Math.round(th), tol: 0.5, unit: '°', why: `\\(\\tfrac{\\theta}{360} \\times 2\\pi \\times ${r} = ${FD.tn(L)}\\), so \\(\\theta = \\frac{${FD.tn(L)} \\times 360}{${2 * r}\\pi} = ${FD.tn(FD.round(th, 1))}^\\circ\\).` }; },
    () => { const r = FD.rnd(3, 12), t = FD.pick([30, 40, 45, 60, 72, 90, 120, 135, 150, 216, 240, 270]), A = FD.round((t / 360) * Math.PI * r * r, 1), rr = Math.sqrt((A * 360) / (t * Math.PI)); return { type: 'num', q: `A sector has angle \\(${t}^\\circ\\) and area \\(${FD.tn(A)}\\ \\text{cm}^2\\). Work out the radius, to 1 decimal place.`, a: FD.round(rr, 1), tol: 0.05, unit: 'cm', why: `\\(\\tfrac{${t}}{360} \\times \\pi r^2 = ${FD.tn(A)}\\), so \\(r^2 = \\frac{${FD.tn(A)} \\times 360}{${t}\\pi} = ${FD.tn(FD.round(rr * rr, 2))}\\) and \\(r = ${FD.tn(FD.round(rr, 1))}\\) cm.` }; },
  ],
});

FD.check({
  section: 'sectors',
  items: [
    { type: 'mcq', q: 'A sector has angle \\(60^\\circ\\). It is what fraction of the circle?', opts: ['\\(\\tfrac16\\)', '\\(\\tfrac13\\)', '\\(\\tfrac14\\)', '\\(\\tfrac{1}{60}\\)'], why: '\\(60 \\div 360\\).' },
    { type: 'num', q: 'Radius 10 cm, angle \\(90^\\circ\\). Find the arc length to 1 d.p.', a: 15.7, tol: 0.05, unit: 'cm', why: '\\(\\tfrac14 \\times 20\\pi = 15.70…\\)' },
    { type: 'num', q: 'Radius 6 cm, angle \\(120^\\circ\\). Find the area of the sector in terms of \\(\\pi\\): \\(k\\pi\\ \\text{cm}^2\\). Enter \\(k\\).', a: 12, why: '\\(\\tfrac13 \\times 36\\pi = 12\\pi\\).' },
    { type: 'tf', q: 'The perimeter of a sector is just its arc length.', a: false, why: 'Add the two radii too.' },
  ],
});
