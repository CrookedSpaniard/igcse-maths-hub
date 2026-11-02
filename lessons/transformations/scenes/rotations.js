// Rotations: a centre and an angle, anticlockwise positive, clockwise negative.
const RO_A = [[1, 1], [4, 1], [1, 3]];
const roName = (d) => (Math.abs(d) === 180 ? '180°' : `${Math.abs(d)}° ${d > 0 ? 'anticlockwise' : 'clockwise'}`);
FD.add({
  id: 'rotations',
  title: 'Rotations',
  tab: 'Rotations',
  icon: 'geometry',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Rotation', 'A turn about a fixed point, the centre of rotation.'],
    ['Centre of rotation', 'The point that does not move. Every other point turns around it.'],
    ['Angle and direction', 'Anticlockwise is positive (+90°); clockwise is negative (−90°). 180° is the same either way.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-o', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Angle <input type="range" data-k="d" min="-270" max="270" step="90" value="90"><output data-k="od">90°</output></label>
        <label class="ctrl">Centre \\(x\\) <input type="range" data-k="cx" min="-1" max="1" value="0"><output data-k="ocx">0</output></label>
        <label class="ctrl">Centre \\(y\\) <input type="range" data-k="cy" min="-1" max="1" value="0"><output data-k="ocy">0</output></label>`,
    });
    const g = FD.tfG(a, 'A triangle rotated about a centre');
    a.g = g;
    // object, image turned by deg about (cx, cy), the centre and a dashed spoke to one corner and its image
    a.turn = (deg, cx = 0, cy = 0, more = '') => {
      const img = FD.tfMap(RO_A, FD.tf.rot(deg, cx, cy)), k = 1;
      g.draw(g.line(cx, cy, RO_A[k][0], RO_A[k][1], 'g-line') + (deg ? g.line(cx, cy, img[k][0], img[k][1], 'g-line') : '') + FD.tfPoly(g, RO_A, 'tf-obj', 'A') + more + (deg ? FD.tfPoly(g, img, 'tf-img', 'B') : ''), g.pt(cx, cy, 'hot'));
    };
    a.spin = (ctx, deg, cx = 0, cy = 0, more = '') => FD.tfAnim(ctx, 1500, (t) => a.turn(deg * t, cx, cy, more));
    const sync = () => {
      const d = +a.$('[data-k="d"]').value, cx = +a.$('[data-k="cx"]').value, cy = +a.$('[data-k="cy"]').value;
      a.$('[data-k="od"]').textContent = FD.mn(d) + '°'; a.$('[data-k="ocx"]').textContent = FD.mn(cx); a.$('[data-k="ocy"]').textContent = FD.mn(cy);
      a.turn(d, cx, cy);
      a.big(d ? `\\text{rotation } ${FD.mn(d)}^\\circ \\text{ about } (${cx}, ${cy})` : '\\text{no turn}');
      a.msg(d === 0 ? 'Zero degrees: nothing moves.' : `${roName(d)}${Math.abs(d) === 270 ? ` (the same as ${roName(d > 0 ? -90 : 90)})` : ''}.`);
    };
    ['d', 'cx', 'cy'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.turn(0);
    return a;
  },
  steps: [
    {
      title: 'A centre and an angle',
      text: '<p>A <b>rotation</b> turns a shape about a fixed point, the <b>centre of rotation</b>. To describe it you need the centre, the angle and the direction.</p><p>Here: 90° anticlockwise about the origin \\((0, 0)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big('\\text{rotation } 90^\\circ \\text{ anticlockwise about } (0, 0)'); a.msg(''); a.turn(0); if (!(await ctx.sleep(500))) return; await a.spin(ctx, 90); },
    },
    {
      title: 'Anticlockwise is positive',
      text: '<p>An <b>anticlockwise</b> turn has a <b>positive</b> angle: +90°. A <b>clockwise</b> turn has a <b>negative</b> angle: −90°.</p><p>The same centre, opposite directions, give different images.</p>',
      tip: 'Anticlockwise is the way the angle is measured in maths, from the positive x-axis upwards.',
      async on(a, ctx) {
        a.tryMode(false); a.msg('');
        a.big('+90^\\circ \\text{ (anticlockwise)}'); if (!(await a.spin(ctx, 90))) return; if (!(await ctx.sleep(900))) return;
        a.big('-90^\\circ \\text{ (clockwise)}'); const keep = FD.tfPoly(a.g, FD.tfMap(RO_A, FD.tf.rot(90)), 'tf-ghost');
        await a.spin(ctx, -90, 0, 0, keep);
      },
    },
    {
      title: 'Half a turn',
      text: '<p>A rotation of 180° is the same clockwise or anticlockwise. About the origin, \\((x, y) \\to (-x, -y)\\): both signs change.</p><p>Rules about the origin: 90° anticlockwise: \\((x, y) \\to (-y, x)\\). 90° clockwise: \\((x, y) \\to (y, -x)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big('(4, 1) \\to (-4, -1)'); a.msg(''); await a.spin(ctx, 180); },
    },
    {
      title: 'A different centre',
      text: '<p>Rotate triangle A 90° clockwise about \\((-1, 2)\\). The centre stays still; each corner keeps its distance from the centre.</p>',
      tip: 'In an exam, use tracing paper: trace the shape, hold the centre with your pencil and turn the paper.',
      async on(a, ctx) { a.tryMode(false); a.big('\\text{rotation } -90^\\circ \\text{ about } (-1, 2)'); a.msg('Corner \\((4, 1) \\to (-2, -3)\\).'); a.turn(0, -1, 2); if (!(await ctx.sleep(500))) return; await a.spin(ctx, -90, -1, 2); },
    },
    {
      title: 'Try it: turn the triangle',
      text: '<p>Change the angle and the centre. Notice that the image is always congruent to A: rotations keep lengths and angles.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'rotations',
  gens: [
    () => {
      const d = FD.pick([90, -90, 180]); let p;
      do { p = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6)]; } while (p[0] === p[1]);
      const q = FD.tf.rot(d)(p), rule = d === 90 ? '\\((x, y) \\to (-y, x)\\)' : d === -90 ? '\\((x, y) \\to (y, -x)\\)' : '\\((x, y) \\to (-x, -y)\\)';
      return { type: 'num', q: `Rotate \\(${FD.tfPt(p)}\\) ${roName(d)} about the origin. Give the image.`, a: q, fields: ['\\(x\\)', '\\(y\\)'], show: `\\(${FD.tfPt(q)}\\)`, why: `For ${roName(d)} about \\((0, 0)\\): ${rule}. So \\(${FD.tfPt(q)}\\).` };
    },
    () => {
      const d = FD.pick([90, -90, 180]), c = [FD.rnd(-3, 3), FD.rnd(-3, 3)], r = [FD.rndNZ(-3, 3), FD.rndNZ(-3, 3)], p = [c[0] + r[0], c[1] + r[1]], q = FD.tf.rot(d, ...c)(p), rr = FD.tf.rot(d)(r);
      return { type: 'num', q: `Rotate \\(${FD.tfPt(p)}\\) ${roName(d)} about \\(${FD.tfPt(c)}\\). Give the image.`, a: q, fields: ['\\(x\\)', '\\(y\\)'], show: `\\(${FD.tfPt(q)}\\)`, why: `From the centre the point is \\(${FD.cv(r[0], r[1])}\\). Turned ${roName(d)} this becomes \\(${FD.cv(rr[0], rr[1])}\\). Add it to the centre: \\(${FD.tfPt(q)}\\).` };
    },
    () => {
      const k = FD.rnd(0, 2);
      return [
        { type: 'mcq', q: 'A rotation of \\(-90^\\circ\\) is…', opts: ['90° clockwise', '90° anticlockwise', '270° clockwise', 'a reflection'], why: 'Negative angles are clockwise.' },
        { type: 'mcq', q: 'A rotation of 270° anticlockwise is the same as…', opts: ['90° clockwise', '90° anticlockwise', '180°', '270° clockwise'], why: '270° one way leaves the shape where 90° the other way would.' },
        { type: 'multi', q: 'Which details do you need to describe a rotation fully?', need: 3, opts: [['the centre', true], ['the angle', true], ['the direction (unless it is 180°)', true], ['a column vector', false], ['a scale factor', false]], why: 'Centre, angle and direction.' },
      ][k];
    },
  ],
});

FD.check({
  section: 'rotations',
  items: [
    { type: 'num', q: 'Rotate \\((3, 1)\\) through 180° about the origin.', a: [-3, -1], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-3, -1)\\)', why: 'Both signs change.' },
    { type: 'num', q: 'Rotate \\((2, 5)\\) 90° anticlockwise about the origin.', a: [-5, 2], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-5, 2)\\)', why: '\\((x, y) \\to (-y, x)\\).' },
    { type: 'num', q: 'Rotate \\((4, 2)\\) 90° clockwise about \\((1, 1)\\).', a: [2, -2], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((2, -2)\\)', why: `From the centre: \\(${FD.cv(3, 1)}\\). Clockwise 90°: \\(${FD.cv(1, -3)}\\). Image \\((1 + 1, 1 - 3) = (2, -2)\\).` },
    { type: 'tf', q: 'A rotation of +90° is anticlockwise.', a: true, why: 'Positive angles are anticlockwise.' },
    { type: 'mcq', q: 'Which point does not move in a rotation?', opts: ['the centre of rotation', 'the origin, always', 'the top corner', 'none'], why: 'Only the centre stays fixed (it may not be the origin).' },
  ],
});
