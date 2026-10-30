// Writing a proof: why the angle at the centre is twice the angle at the circumference.
FD.add({
  id: 'proofs',
  title: 'Writing a geometric proof',
  tab: 'Proofs',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Proof', 'A chain of statements, each with a reason, that shows a result is true for every case, not just one diagram.'],
    ['Show that / Prove that', 'You know the answer already: you must give every step and every reason.'],
  ],
  mount(el) {
    const G = FD.G, O = [200, 150], R = 105, P = (t) => G.polar(O, R, t), C = P(100), A = P(215), B = P(325), D = P(280);
    const a = FD.chain(el, {
      label: 'A circle with centre O; C joined to A, B and through O to D',
      steps: [['\\angle OAC = x', 8], ['\\angle AOD = x + x = 2x', 18], ['\\angle BOD = y + y = 2y', 18]],
      options: [7, 8, 11, 13, 18],
      draw: (k) => {
        let s = G.circ(O, R) + G.line(C, A) + G.line(C, B) + G.line(C, D, 'g-dash') + G.line(O, A, 'g-hl2') + G.line(O, B, 'g-hl2') + G.ticks(O, A) + G.ticks(O, B) + G.ticks(O, C);
        s += G.arc(C, A, O, 34, 'x', 'g-arc', 54) + G.arc(C, O, B, 40, 'y', 'g-arc3', 60);
        if (k >= 1) s += G.arc(A, O, C, 30, 'x', 'g-arc', 48);
        if (k >= 2) s += G.arc(O, A, D, 20, '2x', 'g-arc', 36);
        if (k >= 3) s += G.arc(B, C, O, 30, 'y', 'g-arc3', 48) + G.arc(O, D, B, 24, '2y', 'g-arc3', 42);
        return s + G.dot(O, 'g-dot k', 4) + G.t([O[0] + 14, O[1] - 6], 'O') + G.t(G.polar(O, R + 16, 100), 'C') + G.t(G.polar(O, R + 16, 215), 'A') + G.t(G.polar(O, R + 16, 325), 'B') + G.t(G.polar(O, R + 16, 280), 'D');
      },
    });
    return a;
  },
  steps: [
    {
      title: 'What we want to prove',
      text: '<p><b>Prove</b> that the angle at the centre, \\(\\angle AOB\\), is twice the angle at the circumference, \\(\\angle ACB\\).</p><p>Join \\(C\\) through \\(O\\) to \\(D\\). Call the two parts of \\(\\angle ACB\\) \\(x\\) and \\(y\\). Then \\(\\angle ACB = x + y\\).</p>',
      on(a) { a.off(); a.show(0); },
    },
    {
      title: 'Isosceles triangles and exterior angles',
      text: '<p>\\(OA = OC\\) (radii), so triangle \\(OAC\\) is isosceles. The exterior angle \\(\\angle AOD\\) equals the sum of the two opposite interior angles: \\(2x\\). In the same way \\(\\angle BOD = 2y\\).</p>',
      async on(a, ctx) { a.off(); if (!(await a.walk(ctx, 1800))) return; a.msg('So \\(\\angle AOB = 2x + 2y = 2(x + y) = 2 \\times \\angle ACB\\). ∎'); },
    },
    {
      title: 'How to write a proof',
      text: '<ul><li>Label unknown angles with letters (\\(x\\), \\(y\\)).</li><li>Write one statement per line, each with its <b>reason</b>.</li><li>Finish with the result you were asked to prove.</li></ul>',
      tip: 'Do not measure the diagram: a proof must work for every possible diagram.',
      on(a) { a.off(); a.show(3); a.msg('\\(\\angle AOB = 2(x + y) = 2\\angle ACB\\) ∎'); },
    },
    {
      title: 'Try it: give the reasons',
      text: '<p>Choose the reason for each line of the proof, then check.</p>',
      on(a) { a.show(0); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'proofs',
  gens: [
    () => { const x = FD.rnd(15, 40), y = FD.rnd(15, 40); return { type: 'num', q: `In the proof diagram, \\(\\angle OCA = ${x}^\\circ\\) and \\(\\angle OCB = ${y}^\\circ\\). Work out \\(\\angle AOB\\).`, a: 2 * (x + y), unit: '°', why: `\\(\\angle AOD = 2 \\times ${x} = ${2 * x}^\\circ\\) and \\(\\angle BOD = 2 \\times ${y} = ${2 * y}^\\circ\\) (exterior angles of isosceles triangles). \\(\\angle AOB = ${2 * (x + y)}^\\circ\\).` }; },
    () => FD.pick([
      { type: 'mcq', q: 'In a proof, why is triangle \\(OAC\\) isosceles?', opts: ['\\(OA\\) and \\(OC\\) are radii of the same circle', 'It contains a right angle', '\\(AC\\) is a diameter', 'It looks isosceles'], why: 'Radii are equal.' },
      { type: 'mcq', q: 'Which of these is NOT acceptable in a geometric proof?', opts: ['Measuring the angles on the diagram with a protractor', 'Using letters for unknown angles', 'Giving a reason for each step', 'Using angle facts already proved'], why: 'A proof must hold for every diagram, so you cannot rely on measurement.' },
      { type: 'tf', q: 'The exterior angle of a triangle equals the sum of the two opposite interior angles.', a: true, why: 'Both equal 180° minus the third angle.' },
    ]),
  ],
});

FD.check({
  section: 'proofs',
  items: [
    { type: 'mcq', q: 'A question says “Prove that \\(x = 2y\\)”. What must your answer include?', opts: ['Each step with a reason, ending with \\(x = 2y\\)', 'Only the final answer', 'A measurement of the angles', 'An example with numbers'], why: 'A proof is a reasoned chain to the result.' },
    { type: 'num', q: 'In triangle \\(OAC\\), \\(OA = OC\\) and \\(\\angle OAC = 25^\\circ\\). Work out the exterior angle at \\(O\\) next to \\(\\angle AOC\\).', a: 50, unit: '°', why: '\\(\\angle OCA = 25^\\circ\\); exterior angle \\(= 25 + 25 = 50^\\circ\\).' },
    { type: 'tf', q: 'Checking a result with one numerical example proves it.', a: false, why: 'One example is not a proof: it must work for all cases.' },
  ],
});
