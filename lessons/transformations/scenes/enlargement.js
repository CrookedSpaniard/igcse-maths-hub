// Enlargements: a centre and a scale factor, rays from the centre, angles kept and lengths multiplied.
const EN_C = [-5, -5], EN_A = [[-4, -3], [-2, -3], [-4, -2]];
FD.add({
  id: 'enlargement',
  title: 'Enlargements',
  tab: 'Enlargements',
  icon: 'geometry',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Enlargement', 'A transformation that changes the size of a shape, but keeps its shape (the angles).'],
    ['Centre of enlargement', 'The point the enlargement is measured from. Rays from it pass through each corner and its image.'],
    ['Scale factor', 'How many times longer each length becomes, and how many times further each point is from the centre.'],
    ['Similar', 'Same shape, different size: equal angles, lengths in the same ratio.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-e', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<label class="ctrl">Scale factor <input type="range" data-k="k" min="1" max="3" step="0.5" value="2"><output data-k="ok">2</output></label>',
    });
    const g = FD.tfG(a, 'A triangle enlarged from a centre');
    a.g = g;
    // object, image with scale factor k from c, and rays from c through the image corners
    a.grow = (k, c = EN_C, obj = EN_A, rays = true) => {
      const img = FD.tfMap(obj, FD.tf.enl(k, ...c));
      g.draw((rays ? img.map((p) => g.line(c[0], c[1], p[0], p[1], 'g-line')).join('') : '') + (k !== 1 ? FD.tfPoly(g, img, 'tf-img', 'B') : '') + FD.tfPoly(g, obj, 'tf-obj', 'A'), g.pt(c[0], c[1], 'hot'));
    };
    a.anim = (ctx, k, c, obj) => FD.tfAnim(ctx, 1400, (t) => a.grow(1 + (k - 1) * t, c, obj));
    const sync = () => {
      const k = +a.$('[data-k="k"]').value;
      a.$('[data-k="ok"]').textContent = k;
      a.grow(k);
      a.big(`\\text{base } 2 \\to ${FD.num(2 * k)}`);
      a.msg(k === 1 ? 'Scale factor 1: the image is the same as the object.' : `Scale factor ${k}. Every length is ${k} times as long; every angle is unchanged.`);
    };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    a.grow(1, EN_C, EN_A, false);
    return a;
  },
  steps: [
    {
      title: 'A centre and a scale factor',
      text: '<p>An <b>enlargement</b> changes the size of a shape. You need a <b>centre of enlargement</b> and a <b>scale factor</b>.</p><p>Here: scale factor 3, centre \\((-5, -5)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big('\\text{scale factor } 3'); a.msg('Centre of enlargement \\((-5, -5)\\).'); a.grow(1, EN_C, EN_A, false); if (!(await ctx.sleep(500))) return; await a.anim(ctx, 3); },
    },
    {
      title: 'Rays from the centre',
      text: '<p>Draw a ray from the centre through each corner. The image corner is 3 times as far from the centre along the ray.</p>',
      on: FD.walk([
        ['(-5, -5) \\to (-4, -3): \\; \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}', 'From the centre to a corner of A.'],
        ['3 \\times \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 6 \\end{pmatrix}', 'Multiply by the scale factor.'],
        ['(-5 + 3, \\; -5 + 6) = (-2, 1)', 'Add it to the centre: the image corner.'],
      ], (a) => { a.grow(3); a.big(''); }),
    },
    {
      title: 'Angles stay, lengths change',
      text: '<p>The base of A is 2 and the base of B is 6: every length is multiplied by the scale factor. The angles do <b>not</b> change.</p><p>So B is <b>similar</b> to A, not congruent.</p>',
      tip: 'Translations, reflections and rotations keep lengths. Enlargement is the only one that changes them.',
      async on(a) { a.tryMode(false); a.grow(3, EN_C, EN_A, false); a.big('\\text{lengths} \\times 3'); a.msg('Every angle stays the same.'); },
    },
    {
      title: 'Finding the scale factor and centre',
      text: '<p>Given A and its image B, divide a length of B by the matching length of A. To find the centre, draw lines through matching corners: they all meet at the centre.</p>',
      on: FD.walk([
        ['\\text{scale factor} = \\frac{\\text{image length}}{\\text{object length}}', ''],
        ['= \\frac{6}{2} = 3', 'The bases.'],
        ['\\text{the lines meet at } (-5, -5)', 'The centre.'],
      ], (a) => { a.grow(3); a.big(''); }),
    },
    {
      title: 'Try it: change the scale factor',
      text: '<p>Move the slider. Watch each image corner slide along its ray from the centre.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'enlargement',
  gens: [
    () => {
      const k = FD.pick([2, 3]), c = [FD.rnd(-3, 3), FD.rnd(-3, 3)], r = [FD.rndNZ(-3, 3), FD.rnd(-3, 3)], p = [c[0] + r[0], c[1] + r[1]], q = [c[0] + k * r[0], c[1] + k * r[1]];
      return { type: 'num', q: `Enlarge the point \\(${FD.tfPt(p)}\\) by scale factor ${k}, centre \\(${FD.tfPt(c)}\\). Give its image.`, a: q, fields: ['\\(x\\)', '\\(y\\)'], show: `\\(${FD.tfPt(q)}\\)`, why: `From the centre: \\(${FD.cv(...r)}\\). Times ${k}: \\(${FD.cv(k * r[0], k * r[1])}\\). Add to the centre: \\(${FD.tfPt(q)}\\).` };
    },
    () => {
      const k = FD.pick([2, 3, 4, 5]), L = FD.rnd(2, 9), shape = FD.pick(['triangle', 'rectangle', 'trapezium']);
      return { type: 'num', q: `A ${shape} has a side of length ${L} cm. It is enlarged by scale factor ${k}. How long is that side in the image?`, a: k * L, unit: 'cm', why: `Lengths are multiplied by the scale factor: \\(${L} \\times ${k} = ${k * L}\\) cm.` };
    },
    () => {
      const k = FD.pick([2, 3, 4]), L = FD.rnd(2, 8);
      return { type: 'num', q: `A side of length ${L} cm becomes ${k * L} cm after an enlargement. What is the scale factor?`, a: k, why: `\\(\\dfrac{\\text{image}}{\\text{object}} = \\dfrac{${k * L}}{${L}} = ${k}\\).` };
    },
    () => ({ type: 'mcq', q: 'A shape is enlarged by scale factor 3. Which is true?', opts: ['The angles stay the same', 'The angles are 3 times as big', 'The lengths stay the same', 'The image is congruent to the object'], why: 'Enlargements keep angles and multiply lengths, so the image is similar, not congruent.' }),
  ],
});

FD.check({
  section: 'enlargement',
  items: [
    { type: 'num', q: 'Enlarge \\((2, 1)\\) by scale factor 3, centre the origin.', a: [6, 3], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((6, 3)\\)', why: 'From the origin, multiply both coordinates by 3.' },
    { type: 'num', q: 'Enlarge \\((3, 2)\\) by scale factor 2, centre \\((1, 1)\\).', a: [5, 3], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((5, 3)\\)', why: `From the centre: \\(${FD.cv(2, 1)}\\), doubled \\(${FD.cv(4, 2)}\\). Image \\((5, 3)\\).` },
    { type: 'num', q: 'A side of 5 cm becomes 20 cm after an enlargement. Find the scale factor.', a: 4, why: '\\(20 \\div 5\\).' },
    { type: 'tf', q: 'An enlargement keeps all the angles the same.', a: true, why: 'Only the lengths change.' },
    { type: 'mcq', q: 'To describe an enlargement fully you give…', opts: ['the scale factor and the centre', 'the scale factor only', 'a column vector', 'the angle and the centre'], why: 'Scale factor and centre of enlargement.' },
  ],
});
