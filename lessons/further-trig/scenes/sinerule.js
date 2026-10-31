// The sine rule in a draggable triangle: a / sin A is the same for every side.
FD.add({
  id: 'sinerule',
  title: 'The sine rule',
  tab: 'Sine rule',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Labelling', 'Side \\(a\\) is opposite angle \\(A\\), side \\(b\\) opposite \\(B\\), side \\(c\\) opposite \\(C\\).'],
    ['Sine rule', '\\(\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}\\), or upside down to find an angle: \\(\\dfrac{\\sin A}{a} = \\dfrac{\\sin B}{b}\\).'],
  ],
  mount(el) {
    const a = FD.stage(el, { vb: '0 0 420 280', drag: true, label: 'A triangle ABC with draggable corners', ctrls: '<p class="small">Drag the corners. The three ratios stay equal.</p>' });
    let P = [[60, 240], [370, 240], [250, 60]], live = false;
    a.tri = (p = P, o = {}) => { P = p; FD.TRI(a, P, { live, ...o }); };
    FD.dragIn(a.svg, (n, x, y) => { P['ABC'.indexOf(n)] = [FD.clamp(x, 30, 390), FD.clamp(y, 30, 255)]; a.sync(); });
    a.onSync(() => {
      const m = FD.measure(P), f = (v) => FD.num(FD.round(v, 1)), r = (s, ang) => FD.num(FD.round(s / Math.sin((ang * Math.PI) / 180), 2));
      a.tri(P, { sides: { a: f(m.a), b: f(m.b), c: f(m.c) }, angs: { A: Math.round(m.A) + '°', B: Math.round(m.B) + '°', C: Math.round(m.C) + '°' } });
      a.big(`\\frac{a}{\\sin A} = ${r(m.a, m.A)},\\ \\frac{b}{\\sin B} = ${r(m.b, m.B)},\\ \\frac{c}{\\sin C} = ${r(m.c, m.C)}`);
    });
    a.live = (on) => { live = on; };
    a.tri(P, { sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A', B: 'B', C: 'C' } });
    return a;
  },
  steps: [
    {
      title: 'Labelling any triangle',
      text: '<p>Name the corners \\(A\\), \\(B\\), \\(C\\) and the sides with the <b>small</b> letters: each side is named after the <b>opposite</b> angle.</p>',
      on(a) { a.off(); a.live(false); a.tri([[60, 240], [370, 240], [250, 60]], { sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A', B: 'B', C: 'C' }, hl: ['a'], hlAng: 'A' }); },
    },
    {
      title: 'The sine rule',
      text: '<p class="mbig">\\(\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}\\)</p><p>Use it when you know <b>a side and its opposite angle</b>, plus one more side or angle.</p>',
      on(a) { a.off(); a.live(false); a.sync(); },
    },
    {
      title: 'Finding a side',
      text: '<p>\\(A = 40^\\circ\\), \\(B = 65^\\circ\\) and \\(a = 8\\) cm. Find \\(b\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false);
        a.tri([[60, 240], [370, 240], [282.8, 53]], { sides: { a: '8 cm', b: 'b', c: '' }, angs: { A: '40°', B: '65°' }, hl: ['b', 'a'] });
        await a.play(ctx, [['\\frac{b}{\\sin 65^\\circ} = \\frac{8}{\\sin 40^\\circ}', 'pair each side with its opposite angle'], ['b = \\frac{8 \\sin 65^\\circ}{\\sin 40^\\circ} = 11.3\\ \\text{cm}', '3 s.f.']]);
      },
    },
    {
      title: 'Finding an angle',
      text: '<p>\\(a = 9\\) cm, \\(b = 7\\) cm and \\(A = 72^\\circ\\). Find \\(B\\). Put the <b>sines on top</b>.</p>',
      tip: 'If the angle could be obtuse, check whether 180° minus your answer also fits (the ambiguous case).',
      async on(a, ctx) {
        a.off(); a.live(false);
        a.tri([[60, 240], [310, 240], [125.8, 37.5]], { sides: { a: '9 cm', b: '7 cm', c: '' }, angs: { A: '72°', B: 'B' }, hl: ['b', 'a'] });
        await a.play(ctx, [['\\frac{\\sin B}{7} = \\frac{\\sin 72^\\circ}{9}', ''], ['\\sin B = \\frac{7 \\sin 72^\\circ}{9} = 0.7397…', ''], ['B = \\sin^{-1}(0.7397…) = 47.7^\\circ', '1 d.p.']]);
      },
    },
    {
      title: 'Try it: drag the corners',
      text: '<p>Drag any corner. Side lengths are in cm. All three ratios \\(\\frac{a}{\\sin A}\\), \\(\\frac{b}{\\sin B}\\), \\(\\frac{c}{\\sin C}\\) stay equal (up to rounding).</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'sinerule',
  gens: [
    () => { let A, B; do { A = FD.rnd(25, 80); B = FD.rnd(25, 80); } while (A + B > 160); const s = FD.rnd(5, 15), b = (s * Math.sin((B * Math.PI) / 180)) / Math.sin((A * Math.PI) / 180); return { type: 'num', q: `In triangle \\(ABC\\), \\(A = ${A}^\\circ\\), \\(B = ${B}^\\circ\\) and \\(a = ${s}\\) cm. Work out \\(b\\) to 3 s.f.`, a: FD.sigfig(b, 3), tol: b >= 10 ? 0.05 : 0.005, unit: 'cm', why: `\\(\\frac{b}{\\sin ${B}^\\circ} = \\frac{${s}}{\\sin ${A}^\\circ}\\), so \\(b = \\frac{${s} \\sin ${B}^\\circ}{\\sin ${A}^\\circ} = ${FD.tn(FD.sigfig(b, 3))}\\) cm.` }; },
    () => { let A, s, b, sB; do { A = FD.rnd(50, 110); s = FD.rnd(8, 15); b = FD.rnd(4, s - 1); sB = (b * Math.sin((A * Math.PI) / 180)) / s; } while (sB >= 1); const B = (Math.asin(sB) * 180) / Math.PI; return { type: 'num', q: `In triangle \\(ABC\\), \\(a = ${s}\\) cm, \\(b = ${b}\\) cm and \\(A = ${A}^\\circ\\). Work out angle \\(B\\) to 1 d.p.`, a: FD.round(B, 1), tol: 0.05, unit: '°', why: `\\(\\sin B = \\frac{${b} \\sin ${A}^\\circ}{${s}} = ${FD.tn(FD.round(sB, 4))}\\), \\(B = ${FD.tn(FD.round(B, 1))}^\\circ\\) (acute, because \\(b < a\\)).` }; },
  ],
});

FD.check({
  section: 'sinerule',
  items: [
    { type: 'mcq', q: 'Side \\(b\\) is…', opts: ['opposite angle \\(B\\)', 'next to angle \\(B\\)', 'the longest side', 'between \\(A\\) and \\(B\\)'], why: 'Small letter opposite the capital letter.' },
    { type: 'num', q: '\\(A = 30^\\circ\\), \\(a = 5\\) cm, \\(B = 90^\\circ\\). Find \\(b\\).', a: 10, unit: 'cm', why: '\\(b = 5 \\sin 90^\\circ \\div \\sin 30^\\circ = 10\\).' },
    { type: 'num', q: '\\(A = 50^\\circ\\), \\(C = 70^\\circ\\), \\(c = 12\\) cm. Find \\(a\\) to 3 s.f.', a: 9.78, tol: 0.005, unit: 'cm', why: '\\(12 \\sin 50^\\circ \\div \\sin 70^\\circ = 9.782…\\)' },
    { type: 'mcq', q: 'When do you use the sine rule?', opts: ['When you know a side and its opposite angle', 'When you know three sides only', 'Only in right-angled triangles', 'When you know two sides and the angle between them'], why: 'You need an opposite pair.' },
  ],
});
