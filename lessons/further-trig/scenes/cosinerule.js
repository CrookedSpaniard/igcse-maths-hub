// The cosine rule: Pythagoras with a correction term for angles that are not 90°.
FD.add({
  id: 'cosinerule',
  title: 'The cosine rule',
  tab: 'Cosine rule',
  icon: 'geometry',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Cosine rule', '\\(a^2 = b^2 + c^2 - 2bc\\cos A\\). Rearranged for an angle: \\(\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}\\).'],
    ['Included angle', 'The angle between two given sides.'],
  ],
  mount(el) {
    const a = FD.stage(el, { vb: '0 0 420 280', drag: true, label: 'A triangle ABC with draggable corners', ctrls: '<p class="small">Drag the corners. Watch the correction term \\(2bc\\cos A\\): it is 0 when \\(A = 90^\\circ\\).</p>' });
    let P = [[80, 240], [360, 240], [200, 70]], live = false;
    a.tri = (p = P, o = {}) => { P = p; FD.TRI(a, P, { live, ...o }); };
    FD.dragIn(a.svg, (n, x, y) => { P['ABC'.indexOf(n)] = [FD.clamp(x, 30, 390), FD.clamp(y, 30, 255)]; a.sync(); });
    a.onSync(() => {
      const m = FD.measure(P), f = (v) => FD.num(FD.round(v, 1)), corr = 2 * m.b * m.c * Math.cos((m.A * Math.PI) / 180);
      a.tri(P, { sides: { a: f(m.a), b: f(m.b), c: f(m.c) }, angs: { A: Math.round(m.A) + '°' }, hl: ['a'], hlAng: 'A' });
      a.big(`a^2 = ${f(m.b * m.b)} + ${f(m.c * m.c)} - ${f(corr)} = ${f(m.a * m.a)}`);
      a.msg(Math.abs(m.A - 90) < 1 ? 'A right angle: \\(\\cos 90^\\circ = 0\\), so this is just Pythagoras.' : m.A > 90 ? 'Obtuse \\(A\\): \\(\\cos A\\) is negative, so you ADD, and \\(a\\) is longer.' : 'Acute \\(A\\): you subtract, so \\(a\\) is shorter than Pythagoras would give.');
    });
    a.live = (on) => { live = on; };
    a.tri(P, { sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A' }, hl: ['a'], hlAng: 'A' });
    return a;
  },
  steps: [
    {
      title: 'Two sides and the angle between',
      text: '<p>When you know <b>two sides and the included angle</b>, there is no opposite pair, so the sine rule cannot start. Use the <b>cosine rule</b>:</p><p class="mbig">\\(a^2 = b^2 + c^2 - 2bc\\cos A\\)</p>',
      on(a) { a.off(); a.live(false); a.tri([[80, 240], [360, 240], [200, 70]], { sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A' }, hl: ['a'], hlAng: 'A' }); },
    },
    {
      title: 'Finding a side',
      text: '<p>\\(b = 7\\) cm, \\(c = 9\\) cm and \\(A = 50^\\circ\\). Find \\(a\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.tri([[60, 240], [330, 240], [195, 79.1]], { sides: { a: 'a', b: '7 cm', c: '9 cm' }, angs: { A: '50°' }, hl: ['a'], hlAng: 'A' });
        await a.play(ctx, [['a^2 = 7^2 + 9^2 - 2 \\times 7 \\times 9 \\cos 50^\\circ', ''], ['a^2 = 130 - 80.99… = 49.01…', ''], ['a = 7.00\\ \\text{cm}', '3 s.f.']]);
      },
    },
    {
      title: 'Finding an angle',
      text: '<p>Three sides \\(a = 8\\), \\(b = 5\\), \\(c = 6\\) cm. Find angle \\(A\\) (opposite the 8 cm side).</p>',
      tip: 'A negative cosine means an obtuse angle. The calculator handles it for you.',
      async on(a, ctx) {
        a.off(); a.live(false); a.tri([[80, 240], [290, 240], [71.1, 65.2]], { sides: { a: '8 cm', b: '5 cm', c: '6 cm' }, angs: { A: 'A' }, hl: ['a'], hlAng: 'A' });
        await a.play(ctx, [['\\cos A = \\frac{5^2 + 6^2 - 8^2}{2 \\times 5 \\times 6} = \\frac{-3}{60}', ''], ['A = \\cos^{-1}(-0.05) = 92.9^\\circ', '1 d.p.']]);
      },
    },
    {
      title: 'Which rule?',
      text: '<ul><li>An angle and its <b>opposite side</b> known → <b>sine rule</b>.</li><li><b>Two sides and the included angle</b>, or <b>all three sides</b> → <b>cosine rule</b>.</li></ul>',
      on(a) { a.off(); a.live(false); a.sync(); },
    },
    {
      title: 'Try it: drag the corners',
      text: '<p>Drag the corners and watch the three parts of the cosine rule. Make \\(A\\) a right angle: the rule becomes Pythagoras.</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'cosinerule',
  gens: [
    () => { const b = FD.rnd(4, 15), c = FD.rnd(4, 15), A = FD.rnd(25, 140), s = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos((A * Math.PI) / 180)); return { type: 'num', q: `In triangle \\(ABC\\), \\(b = ${b}\\) cm, \\(c = ${c}\\) cm and \\(A = ${A}^\\circ\\). Work out \\(a\\) to 3 s.f.`, a: FD.sigfig(s, 3), tol: s >= 10 ? 0.05 : 0.005, unit: 'cm', why: `\\(a^2 = ${b}^2 + ${c}^2 - 2 \\times ${b} \\times ${c} \\cos ${A}^\\circ = ${FD.tn(FD.round(s * s, 2))}\\), \\(a = ${FD.tn(FD.sigfig(s, 3))}\\) cm.` }; },
    () => { let a, b, c; do { a = FD.rnd(4, 15); b = FD.rnd(4, 15); c = FD.rnd(4, 15); } while (a >= b + c || b >= a + c || c >= a + b); const A = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI; return { type: 'num', q: `A triangle has sides \\(a = ${a}\\) cm, \\(b = ${b}\\) cm and \\(c = ${c}\\) cm. Work out angle \\(A\\) to 1 d.p.`, a: FD.round(A, 1), tol: 0.05, unit: '°', why: `\\(\\cos A = \\frac{${b}^2 + ${c}^2 - ${a}^2}{2 \\times ${b} \\times ${c}} = \\frac{${b * b + c * c - a * a}}{${2 * b * c}}\\), \\(A = ${FD.tn(FD.round(A, 1))}^\\circ\\).` }; },
    () => FD.pick([
      { type: 'mcq', q: 'You know all three sides and want an angle. Use…', opts: ['the cosine rule', 'the sine rule', 'SOHCAHTOA', '\\(\\frac12 ab \\sin C\\)'], why: 'Three sides: cosine rule.' },
      { type: 'mcq', q: 'You know \\(A\\), \\(a\\) and \\(B\\). To find \\(b\\) use…', opts: ['the sine rule', 'the cosine rule', 'Pythagoras', '\\(\\frac12 ab \\sin C\\)'], why: 'An opposite pair: sine rule.' },
    ]),
  ],
});

FD.check({
  section: 'cosinerule',
  items: [
    { type: 'num', q: '\\(b = 5\\), \\(c = 8\\), \\(A = 60^\\circ\\). Find \\(a\\).', a: 7, unit: 'cm', why: '\\(a^2 = 25 + 64 - 80 \\times 0.5 = 49\\).' },
    { type: 'num', q: 'Sides 7, 8, 13 cm. Find the angle opposite the 13 cm side.', a: 120, unit: '°', why: '\\(\\cos = \\frac{49 + 64 - 169}{112} = -0.5\\).' },
    { type: 'tf', q: 'When \\(A = 90^\\circ\\) the cosine rule becomes Pythagoras’ theorem.', a: true, why: '\\(\\cos 90^\\circ = 0\\).' },
    { type: 'mcq', q: 'Two sides and the included angle are known. Use…', opts: ['the cosine rule', 'the sine rule', 'tan', 'nothing: it cannot be solved'], why: 'No opposite pair: cosine rule.' },
  ],
});
