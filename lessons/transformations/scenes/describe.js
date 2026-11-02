// Describing transformations fully, and combining two transformations into one.
const DS_A = [[1, 1], [3, 1], [1, 2]];
const dsKey = (pts) => pts.map(FD.tfPt).sort().join(' ');
const DS_TYPES = ['tr', 'refl', 'rot', 'enl'];
// a random transformation of one type: { f, text } (text is the full description)
const dsRand = (type) => {
  if (type === 'tr') { const x = FD.rndNZ(-4, 4), y = FD.rndNZ(-4, 4); return { f: FD.tf.tr(x, y), text: `Translation by \\(${FD.cv(x, y)}\\)` }; }
  if (type === 'refl') { const L = FD.pick(RF_POOL); return { f: FD.tf.refl(L), text: `Reflection in the line \\(${FD.tfLineTex(L)}\\)` }; }
  if (type === 'rot') { const d = FD.pick([90, -90, 180]), c = FD.pick([[0, 0], [0, 0], [1, 0], [0, -1], [-1, 1]]); return { f: FD.tf.rot(d, ...c), text: `Rotation ${roName(d)} about \\(${FD.tfPt(c)}\\)` }; }
  const k = FD.pick([2, 3]), c = FD.pick([[0, 0], [0, 0], [1, 1], [-1, 0]]);
  return { f: FD.tf.enl(k, ...c), text: `Enlargement, scale factor ${k}, centre \\(${FD.tfPt(c)}\\)` };
};
// a transformation of DS_A, its image and four different descriptions (correct first)
const dsQuestion = (inGrid = false) => {
  let t, c, img;
  do { t = FD.pick(DS_TYPES); c = dsRand(t); img = FD.tfMap(DS_A, c.f); } while (dsKey(img) === dsKey(DS_A) || (inGrid && img.some(([x, y]) => Math.abs(x) > 6 || Math.abs(y) > 6)));
  const opts = [c.text], seen = new Set([dsKey(img), dsKey(DS_A)]);
  for (let n = 0; opts.length < 4 && n < 300; n++) {
    const d = dsRand(n < 60 ? t : FD.pick(DS_TYPES)), k = dsKey(FD.tfMap(DS_A, d.f));
    if (seen.has(k) || opts.includes(d.text)) continue;
    seen.add(k); opts.push(d.text);
  }
  return { c, img, opts };
};
const DS_PTS = (pts) => pts.map((p) => `\\(${FD.tfPt(p)}\\)`).join(', ');

FD.add({
  id: 'describe',
  title: 'Describing and combining transformations',
  tab: 'Describe fully',
  icon: 'target',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Describe fully', 'Name the type of transformation and give every detail it needs.'],
    ['Single transformation', 'One transformation that has the same effect as two or more done one after another.'],
    ['Congruent / similar', 'Translations, reflections and rotations give congruent images. Enlargements give similar images.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-d', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<span class="seg-row"><button class="btn" data-k="new">New pair</button><button class="btn primary" data-k="ans">Show the answer</button></span>',
    });
    const g = FD.tfG(a, 'A shape and its image after a transformation');
    a.g = g;
    a.show = (list, extra = '') => g.draw(extra + list.map(([pts, cls, n]) => FD.tfPoly(g, pts, cls, n)).join(''));
    let cur = null;
    const fresh = () => {
      cur = dsQuestion(true);
      a.show([[DS_A, 'tf-obj', 'A'], [cur.img, 'tf-img', 'B']]);
      a.big('A \\to B: \\; ?'); a.msg('Which transformation maps A onto B? Decide, then show the answer.');
    };
    a.$('[data-k="new"]').addEventListener('click', fresh);
    a.$('[data-k="ans"]').addEventListener('click', () => { if (cur) a.msg(cur.c.text + '.'); });
    a.onTry = fresh;
    a.show([[DS_A, 'tf-obj', 'A']]);
    return a;
  },
  steps: [
    {
      title: 'What a full description needs',
      text: '<p>To <b>describe fully</b>, name the transformation and give all its details. Missing one detail loses marks.</p>',
      on: FD.walk([
        ['\\text{Translation: a column vector}', ''],
        ['\\text{Reflection: the mirror line}', 'Its equation.'],
        ['\\text{Rotation: centre, angle, direction}', 'No direction needed for 180°.'],
        ['\\text{Enlargement: centre, scale factor}', ''],
      ], (a) => { a.show([[DS_A, 'tf-obj', 'A']]); a.big(''); }),
    },
    {
      title: 'Identifying a transformation',
      text: '<p>Look at the size first, then which way round the image is.</p>',
      on: FD.walk([
        ['\\text{Same size: not an enlargement.}', ''],
        ['\\text{Turned round, not flipped: a rotation.}', 'A reflection would be a mirror image.'],
        ['\\text{Centre } (0, 0), \\; 90^\\circ \\text{ clockwise}', 'Check with tracing paper.'],
        ['\\text{Rotation } 90^\\circ \\text{ clockwise about } (0, 0)', 'The full description.'],
      ], (a) => { a.show([[DS_A, 'tf-obj', 'A'], [FD.tfMap(DS_A, FD.tf.rot(-90)), 'tf-img', 'B']], a.g.pt(0, 0, 'hot')); a.big(''); }, 1500),
    },
    {
      title: 'Combining two transformations',
      text: '<p>Reflect A in the \\(y\\)-axis to get B. Then reflect B in the \\(x\\)-axis to get C.</p><p>One <b>single transformation</b> maps A straight onto C: a rotation of 180° about \\((0, 0)\\).</p>',
      tip: 'Check a corner: \\((3, 1) \\to (-3, 1) \\to (-3, -1)\\), and 180° about the origin also gives \\((-3, -1)\\).',
      async on(a, ctx) {
        a.tryMode(false); a.msg('');
        const B = FD.tfMap(DS_A, FD.tf.refl(['x', 0])), C = FD.tfMap(B, FD.tf.refl(['y', 0]));
        a.big('\\text{reflect in the } y\\text{-axis}');
        if (!(await FD.tfAnim(ctx, 1100, (t) => a.show([[DS_A, 'tf-obj', 'A'], [FD.tfLerp(DS_A, B, t), 'tf-img', 'B']], FD.tfMirror(a.g, ['x', 0]))))) return;
        if (!(await ctx.sleep(600))) return;
        a.big('\\text{then in the } x\\text{-axis}');
        if (!(await FD.tfAnim(ctx, 1100, (t) => a.show([[DS_A, 'tf-obj', 'A'], [B, 'tf-ghost', 'B'], [FD.tfLerp(B, C, t), 'tf-img', 'C']], FD.tfMirror(a.g, ['y', 0]))))) return;
        if (!(await ctx.sleep(600))) return;
        a.show([[DS_A, 'tf-obj', 'A'], [B, 'tf-ghost', 'B'], [C, 'tf-img', 'C']], a.g.pt(0, 0, 'hot'));
        a.big('A \\to C'); a.msg('One single transformation: rotation 180° about \\((0, 0)\\).');
      },
    },
    {
      title: 'Try it: name the transformation',
      text: '<p>Press <b>New pair</b> for a random transformation of A. Describe it fully in your head (or on paper), then check.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

const DS_COMBOS = [
  ['Reflect in the \\(x\\)-axis, then reflect the image in the \\(y\\)-axis.', 'Rotation 180° about \\((0, 0)\\)'],
  ['Reflect in the line \\(y = x\\), then reflect the image in the line \\(y = -x\\).', 'Rotation 180° about \\((0, 0)\\)'],
  [`Translate by \\(${FD.cv(2, 1)}\\), then translate the image by \\(${FD.cv(-5, 3)}\\).`, `Translation by \\(${FD.cv(-3, 4)}\\)`],
  ['Rotate 90° anticlockwise about \\((0, 0)\\), then rotate the image 90° anticlockwise about \\((0, 0)\\) again.', 'Rotation 180° about \\((0, 0)\\)'],
  ['Reflect in the line \\(x = 1\\), then reflect the image in the line \\(x = 3\\).', `Translation by \\(${FD.cv(4, 0)}\\)`],
  ['Rotate 90° clockwise about \\((0, 0)\\), then rotate the image 180° about \\((0, 0)\\).', 'Rotation 90° anticlockwise about \\((0, 0)\\)'],
];
const DS_WRONG = ['Reflection in the line \\(y = x\\)', 'Rotation 90° clockwise about \\((0, 0)\\)', `Translation by \\(${FD.cv(3, -4)}\\)`, 'Reflection in the \\(y\\)-axis', 'Enlargement, scale factor 2, centre \\((0, 0)\\)', `Translation by \\(${FD.cv(2, 0)}\\)`, 'Rotation 90° anticlockwise about \\((0, 0)\\)', 'Rotation 180° about \\((0, 0)\\)'];
FD.practice({
  section: 'describe',
  gens: [
    () => {
      const { c, img, opts } = dsQuestion();
      return { type: 'mcq', q: `Triangle P has vertices ${DS_PTS(DS_A)}. Triangle Q has vertices ${DS_PTS(img)}. Describe fully the single transformation that maps P onto Q.`, opts, why: `${c.text}. Check each vertex of P: it lands on the matching vertex of Q.` };
    },
    () => {
      const [q, ans] = FD.pick(DS_COMBOS);
      return { type: 'mcq', q: `${q} Which single transformation has the same effect?`, opts: [ans, ...FD.shuffle(DS_WRONG.filter((w) => w !== ans)).slice(0, 3)], why: `Follow one point through both steps and compare. The result is: ${ans}.` };
    },
    () => {
      const k = FD.rnd(0, 2);
      return [
        { type: 'mcq', q: 'Which description of a rotation is complete?', opts: ['Rotation 90° clockwise about \\((2, 1)\\)', 'Rotation 90° about \\((2, 1)\\)', 'Rotation clockwise about \\((2, 1)\\)', 'Rotation 90° clockwise'], why: 'A rotation needs a centre, an angle and a direction.' },
        { type: 'mcq', q: 'Which transformation can give an image that is <b>not</b> congruent to the object?', opts: ['Enlargement', 'Translation', 'Reflection', 'Rotation'], why: 'Only an enlargement changes lengths.' },
        { type: 'mcq', q: 'Which description of an enlargement is complete?', opts: ['Enlargement, scale factor 3, centre \\((0, 2)\\)', 'Enlargement, scale factor 3', 'Enlargement, centre \\((0, 2)\\)', 'Enlargement by \\(\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}\\)'], why: 'An enlargement needs a scale factor and a centre.' },
      ][k];
    },
  ],
});

FD.check({
  section: 'describe',
  items: [
    { type: 'mcq', q: 'Triangle P has vertices \\((1, 1)\\), \\((3, 1)\\), \\((1, 2)\\). Triangle Q has vertices \\((-1, 1)\\), \\((-3, 1)\\), \\((-1, 2)\\). The transformation is…', opts: ['a reflection in the \\(y\\)-axis', 'a reflection in the \\(x\\)-axis', 'a rotation 180° about \\((0, 0)\\)', 'a translation'], why: 'Only the sign of \\(x\\) changes.' },
    { type: 'mcq', q: 'Triangle P has vertices \\((1, 1)\\), \\((3, 1)\\), \\((1, 2)\\). Triangle Q has vertices \\((2, 2)\\), \\((6, 2)\\), \\((2, 4)\\). The transformation is…', opts: ['an enlargement, scale factor 2, centre \\((0, 0)\\)', 'a translation by \\(\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}\\)', 'an enlargement, scale factor 2, centre \\((1, 1)\\)', 'a rotation 90° about \\((0, 0)\\)'], why: 'Every coordinate is doubled, so the centre is the origin.' },
    { type: 'multi', q: 'Which transformations always give a congruent image?', need: 3, opts: [['Translation', true], ['Reflection', true], ['Rotation', true], ['Enlargement, scale factor 2', false]], why: 'They keep every length and angle; an enlargement changes lengths.' },
    { type: 'mcq', q: 'Reflect in the \\(y\\)-axis, then in the \\(x\\)-axis. The single transformation is…', opts: ['a rotation 180° about \\((0, 0)\\)', 'a reflection in \\(y = x\\)', 'a translation', 'a rotation 90° clockwise about \\((0, 0)\\)'], why: '\\((x, y) \\to (-x, y) \\to (-x, -y)\\).' },
  ],
});
