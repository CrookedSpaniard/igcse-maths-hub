// The standard reasons, and a reusable "reasoning chain" scene: a diagram, steps revealed one by one,
// and a Try it where the student chooses the reason for each step.
FD.REASONS = [
  'Choose a reason…',
  'Angles on a straight line add up to 180°',
  'Angles around a point add up to 360°',
  'Vertically opposite angles are equal',
  'Alternate angles are equal',
  'Corresponding angles are equal',
  'Co-interior angles add up to 180°',
  'Angles in a triangle add up to 180°',
  'Base angles of an isosceles triangle are equal',
  'Angles in a quadrilateral add up to 360°',
  'Exterior angles of a polygon add up to 360°',
  'The angle at the centre is twice the angle at the circumference',
  'The angle in a semicircle is 90°',
  'Angles in the same segment are equal',
  'Opposite angles of a cyclic quadrilateral add up to 180°',
  'A tangent is perpendicular to the radius',
  'Alternate segment theorem',
  'Tangents from a point are equal in length',
  'The exterior angle of a triangle equals the sum of the two opposite interior angles',
];
// cfg: { draw(k) → svg for the first k steps found, steps: [[tex, reason index], …], options: [reason indices for the Try it] }
FD.chain = (el, cfg) => {
  const sel = (i) => `<select id="r${i}">${[0, ...cfg.options].map((r) => `<option value="${r}">${FD.REASONS[r]}</option>`).join('')}</select>`;
  const a = FD.stage(el, {
    vb: cfg.vb || '0 0 420 300', label: cfg.label || 'Geometry diagram',
    ctrls: cfg.steps.map(([t], i) => `<div class="row"><span>\\(${t}\\)</span>${sel(i)}</div>`).join('') + '<div class="chk-btns"><button class="btn" id="go">Check my reasons</button></div>',
  });
  a.show = (k) => a.draw(cfg.draw(k));
  a.walk = async (ctx, ms = 1700) => { a.show(0); a.work(cfg.steps.map(([t, r]) => [t, FD.REASONS[r].toLowerCase()])); for (let i = 0; i < cfg.steps.length; i++) { a.upto(i); a.show(i + 1); if (!(await ctx.sleep(ms))) return false; } return true; };
  a.q('#go').addEventListener('click', () => {
    const ok = cfg.steps.map(([, r], i) => +a.q('#r' + i).value === r), n = ok.filter(Boolean).length;
    a.show(ok.indexOf(false) === -1 ? cfg.steps.length : ok.indexOf(false));
    a.msg(n === ok.length ? '✓ Every reason is correct.' : `${n} of ${ok.length} reasons correct. ${ok.map((o, i) => (o ? '' : `Step ${i + 1}: think again.`)).join(' ')}`, n === ok.length ? 'good' : 'bad');
  });
  a.onSync(() => a.msg(''));
  a.show(0);
  return a;
};

FD.add({
  id: 'reasons',
  title: 'Standard reasons for angles',
  tab: 'Reasons',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Reason', 'The angle fact you used, written in words. “Give reasons” means one reason for every angle you work out.'],
    ['Standard wording', 'The usual name of the fact, e.g. “alternate angles are equal”, not “Z angles”.'],
  ],
  mount(el) {
    const G = FD.G, P = [210, 70], Q = [130.7, 240], R = [289.3, 240];
    return FD.chain(el, {
      label: 'An isosceles triangle between two parallel lines',
      steps: [['\\angle PQR = 65^\\circ', 4], ['\\angle PRQ = 65^\\circ', 8], ['\\angle QPR = 180 - 65 - 65 = 50^\\circ', 7]],
      options: [1, 3, 4, 5, 6, 7, 8],
      draw: (k) => G.line([30, 70], [390, 70]) + G.line([30, 240], [390, 240]) + G.arrows([60, 70], [110, 70], 1, 'g-ln') + G.arrows([60, 240], [110, 240], 1, 'g-ln') + G.poly([P, Q, R]) + G.ticks(P, Q) + G.ticks(P, R)
        + G.arc(P, [30, 70], Q, 28, '65°', 'g-arc2', 46)
        + G.arc(Q, R, P, 26, k >= 1 ? '65°' : '', 'g-arc2', 44) + G.arc(R, P, Q, 26, k >= 2 ? '65°' : '', 'g-arc', 44) + G.arc(P, Q, R, 22, k >= 3 ? '50°' : 'x', 'g-arc3', 40)
        + G.t([P[0], P[1] - 16], 'P') + G.t([Q[0] - 10, Q[1] + 18], 'Q') + G.t([R[0] + 10, R[1] + 18], 'R'),
    });
  },
  steps: [
    {
      title: 'Why reasons matter',
      text: '<p>Questions often say <b>“Give reasons for your answer.”</b> Then every angle you find needs the <b>angle fact</b> you used, written in words.</p><p>Here the lines are parallel and \\(PQ = PR\\). Find \\(x\\).</p>',
      on(a) { a.off(); a.show(0); },
    },
    {
      title: 'One fact per step',
      text: '<p>Find one angle at a time and write its reason next to it.</p>',
      tip: 'Write the reason in full. “Z angles”, “F angles” or “because it is parallel” do not get the mark.',
      async on(a, ctx) { a.off(); await a.walk(ctx); },
    },
    {
      title: 'The standard reasons',
      text: '<p>Learn this wording:</p><ul><li>Angles on a straight line add up to 180°.</li><li>Angles around a point add up to 360°.</li><li>Vertically opposite angles are equal.</li><li>Alternate / corresponding angles are equal; co-interior angles add up to 180°.</li><li>Angles in a triangle add up to 180°; base angles of an isosceles triangle are equal.</li></ul>',
      on(a) { a.off(); a.show(3); },
    },
    {
      title: 'Try it: choose the reasons',
      text: '<p>Choose the reason for each step, then press <b>Check my reasons</b>.</p>',
      on(a) { a.show(0); a.tryMode(); },
    },
  ],
});

const RQ = [
  ['Two angles together make a straight line.', 1], ['Three angles meet at a point and fill the space around it.', 2], ['Two straight lines cross, and you use the angle opposite.', 3],
  ['Between parallel lines, the angles make a Z shape.', 4], ['Between parallel lines, the angles make an F shape.', 5], ['Between parallel lines, the angles make a C shape.', 6],
  ['You use the three angles inside a triangle.', 7], ['A triangle has two equal sides and you use the angles at the ends of the third side.', 8], ['You use the four angles inside a quadrilateral.', 9],
];
FD.practice({
  section: 'reasons',
  gens: [
    () => { const [d, r] = FD.pick(RQ), wrong = FD.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== r)).slice(0, 3); return { type: 'mcq', q: `${d} Which reason do you write?`, opts: [FD.REASONS[r], ...wrong.map((w) => FD.REASONS[w])], why: `The standard reason is: “${FD.REASONS[r]}”.` }; },
    () => { const t = FD.rnd(40, 80); return { type: 'num', q: `\\(PQ = PR\\) in triangle \\(PQR\\), and \\(QR\\) lies on a line parallel to a line through \\(P\\). The angle between that line and \\(PQ\\) is \\(${t}^\\circ\\). Work out \\(\\angle QPR\\).`, a: 180 - 2 * t, unit: '°', why: `\\(\\angle PQR = ${t}^\\circ\\) (alternate angles are equal). \\(\\angle PRQ = ${t}^\\circ\\) (base angles of an isosceles triangle are equal). \\(\\angle QPR = 180 - ${2 * t} = ${180 - 2 * t}^\\circ\\) (angles in a triangle add up to 180°).` }; },
  ],
});

FD.check({
  section: 'reasons',
  items: [
    { type: 'mcq', q: 'Which reason would get the mark?', opts: ['Co-interior angles add up to 180°', 'C angles', 'They make 180', 'Parallel'], why: 'Use the full standard wording.' },
    { type: 'multi', q: 'Choose the <b>two</b> reasons that are about parallel lines.', need: 2, opts: [['Alternate angles are equal', true], ['Corresponding angles are equal', true], ['Vertically opposite angles are equal', false], ['Angles in a triangle add up to 180°', false]], why: 'Alternate and corresponding angles need parallel lines.' },
    { type: 'tf', q: '“Vertically opposite angles are equal” needs parallel lines.', a: false, why: 'It works whenever two straight lines cross.' },
    { type: 'num', q: 'Isosceles triangle with base angles \\(72^\\circ\\). Find the third angle.', a: 36, unit: '°', why: '\\(180 - 72 - 72 = 36^\\circ\\) (angles in a triangle add up to 180°).' },
  ],
});
