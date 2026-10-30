// Reasons with circle theorems: tangent, chord, centre and the alternate segment.
FD.add({
  id: 'circleproof',
  title: 'Reasons with circle theorems',
  tab: 'Circle reasons',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Radii', 'Two radii of the same circle are equal, so a triangle with two radii as sides is isosceles.'],
    ['Alternate segment theorem', 'The angle between a tangent and a chord equals the angle in the alternate segment.'],
  ],
  mount(el) {
    const G = FD.G, O = [200, 140], R = 100, P = (t) => G.polar(O, R, t), A = P(270), B = P(34), C = P(150), T = [A[0] + 160, A[1]];
    return FD.chain(el, {
      label: 'A circle with a tangent at A, a chord AB, the centre O and a point C',
      steps: [['\\angle ACB = 62^\\circ', 16], ['\\angle AOB = 2 \\times 62 = 124^\\circ', 11], ['\\angle OAB = (180 - 124) \\div 2 = 28^\\circ', 8]],
      options: [7, 8, 11, 12, 13, 15, 16, 17],
      draw: (k) => {
        let s = G.circ(O, R) + G.line([A[0] - 160, A[1]], T) + G.line(A, B) + G.line(C, A) + G.line(C, B) + G.line(O, A, 'g-hl2') + G.line(O, B, 'g-hl2');
        s += G.arc(A, T, B, 34, '62°', 'g-arc3', 54) + G.arc(C, A, B, 26, k >= 1 ? '62°' : '', 'g-arc3', 44) + G.arc(O, A, B, 20, k >= 2 ? '124°' : '', 'g-arc2', 38) + G.arc(A, O, B, 30, k >= 3 ? '28°' : 'x', 'g-arc', 48);
        return s + G.dot(O, 'g-dot k', 4) + G.t([O[0] - 14, O[1] - 8], 'O') + G.t([A[0], A[1] + 18], 'A') + G.t(G.polar(O, R + 16, 34), 'B') + G.t(G.polar(O, R + 16, 150), 'C') + G.t([T[0] - 6, T[1] + 16], 'T');
      },
    });
  },
  steps: [
    {
      title: 'A circle problem',
      text: '<p>\\(TA\\) is a tangent at \\(A\\). \\(O\\) is the centre. The angle between the tangent and chord \\(AB\\) is \\(62^\\circ\\). Find \\(x = \\angle OAB\\), giving reasons.</p>',
      on(a) { a.off(); a.show(0); },
    },
    {
      title: 'Three circle facts',
      text: '<p>Use the alternate segment theorem, then the angle at the centre, then the isosceles triangle \\(OAB\\) (\\(OA = OB\\) are radii).</p>',
      tip: 'Check another way: tangent ⟂ radius, so x = 90 − 62 = 28° ✓.',
      async on(a, ctx) { a.off(); await a.walk(ctx); },
    },
    {
      title: 'Try it: choose the reasons',
      text: '<p>Choose the circle theorem or angle fact for each step, then check.</p>',
      on(a) { a.show(0); a.tryMode(); },
    },
  ],
});

const CQ = [
  ['An angle at the centre and an angle at the circumference stand on the same arc.', 11], ['A triangle has one side as a diameter and its third corner on the circle.', 12],
  ['Two angles at the circumference stand on the same chord, on the same side.', 13], ['The four corners of a quadrilateral lie on the circle.', 14],
  ['A radius meets a tangent at the point of contact.', 15], ['You compare the angle between a tangent and a chord with an angle on the other side of the chord.', 16], ['Two tangents are drawn from the same point.', 17],
];
FD.practice({
  section: 'circleproof',
  gens: [
    () => { const [d, r] = FD.pick(CQ), wrong = FD.shuffle([11, 12, 13, 14, 15, 16, 17].filter((x) => x !== r)).slice(0, 3); return { type: 'mcq', q: `${d} Which reason do you write?`, opts: [FD.REASONS[r], ...wrong.map((w) => FD.REASONS[w])], why: `Standard reason: “${FD.REASONS[r]}”.` }; },
    () => { const t = FD.rnd(25, 75); return { type: 'num', q: `\\(TA\\) is a tangent at \\(A\\) to a circle with centre \\(O\\). The angle between \\(TA\\) and chord \\(AB\\) is \\(${t}^\\circ\\). Work out \\(\\angle AOB\\).`, a: 2 * t, unit: '°', why: `The angle in the alternate segment is \\(${t}^\\circ\\) (alternate segment theorem). \\(\\angle AOB = 2 \\times ${t} = ${2 * t}^\\circ\\) (angle at the centre is twice the angle at the circumference).` }; },
    () => { const t = FD.rnd(20, 70); return { type: 'num', q: `\\(O\\) is the centre of a circle. \\(A\\) and \\(B\\) are on the circle and \\(\\angle OAB = ${t}^\\circ\\). Work out \\(\\angle AOB\\).`, a: 180 - 2 * t, unit: '°', why: `\\(OA = OB\\) (radii), so \\(\\angle OBA = ${t}^\\circ\\) (base angles of an isosceles triangle are equal). \\(\\angle AOB = 180 - ${2 * t} = ${180 - 2 * t}^\\circ\\) (angles in a triangle).` }; },
  ],
});

FD.check({
  section: 'circleproof',
  items: [
    { type: 'mcq', q: 'Why is triangle \\(OAB\\) isosceles when \\(O\\) is the centre and \\(A\\), \\(B\\) are on the circle?', opts: ['\\(OA\\) and \\(OB\\) are both radii', 'It has a right angle', '\\(AB\\) is a diameter', 'Tangents from a point are equal'], why: 'All radii are equal.' },
    { type: 'num', q: 'A tangent at \\(A\\) makes \\(50^\\circ\\) with chord \\(AB\\). \\(O\\) is the centre. Work out \\(\\angle OAB\\).', a: 40, unit: '°', why: 'Tangent ⟂ radius: \\(90 - 50 = 40^\\circ\\).' },
    { type: 'mcq', q: 'Which reason explains \\(\\angle ACB = 90^\\circ\\) when \\(AB\\) is a diameter?', opts: ['The angle in a semicircle is 90°', 'A tangent is perpendicular to the radius', 'Angles in the same segment are equal', 'Alternate segment theorem'], why: 'Angle in a semicircle.' },
    { type: 'tf', q: '“Angle at the centre is twice the angle at the circumference” works only when both angles stand on the same arc.', a: true, why: 'They must be subtended by the same arc.' },
  ],
});
