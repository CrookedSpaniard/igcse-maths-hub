// Higher tier: fractional scale factors (smaller) and negative scale factors (through the centre, upside down).
const EM_BIG = [[-1, -1], [3, -1], [-1, 5]], EM_T = [[1, 1], [3, 1], [1, 2]];
FD.add({
  id: 'enlarge-more',
  title: 'Fractional and negative scale factors',
  tab: 'Harder scale factors',
  icon: 'geometry',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Fractional scale factor', 'Between 0 and 1: the image is <b>smaller</b> and closer to the centre. It is still called an enlargement.'],
    ['Negative scale factor', 'The image is on the <b>other side</b> of the centre and upside down. Measure from the centre in the opposite direction.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-m', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<label class="ctrl">Scale factor <input type="range" data-k="k" min="-3" max="3" step="0.5" value="-2"><output data-k="ok">−2</output></label>',
    });
    const g = FD.tfG(a, 'A triangle enlarged by a fractional or negative scale factor');
    a.g = g;
    a.grow = (k, c, obj) => {
      const img = FD.tfMap(obj, FD.tf.enl(k, ...c));
      g.draw(obj.map((p, i) => g.line(p[0], p[1], img[i][0], img[i][1], 'g-line')).join('') + FD.tfPoly(g, obj, 'tf-obj', 'A') + (k ? FD.tfPoly(g, img, 'tf-img', 'B') : ''), g.pt(c[0], c[1], 'hot'));
    };
    a.anim = (ctx, k, c, obj) => FD.tfAnim(ctx, 1500, (t) => a.grow(1 + (k - 1) * t, c, obj));
    const sync = () => {
      const k = +a.$('[data-k="k"]').value;
      a.$('[data-k="ok"]').textContent = FD.mn(k);
      a.grow(k, [0, 0], EM_T);
      a.big(`\\text{scale factor } ${k}`);
      a.msg('Centre \\((0, 0)\\). ' + k === 0 ? 'Scale factor 0 squashes everything onto the centre: it is not used.' : k < 0 ? `Through the centre and upside down, ${Math.abs(k)} times as long.` : k < 1 ? 'Smaller: each length is multiplied by a number less than 1.' : `Same side of the centre, ${k} times as long.`);
    };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    a.grow(1, [-5, -5], EM_BIG);
    return a;
  },
  steps: [
    {
      title: 'Scale factor ½',
      text: '<p>A scale factor between 0 and 1 makes the shape <b>smaller</b>. With scale factor \\(\\tfrac12\\), every point moves halfway towards the centre and every length halves.</p>',
      async on(a, ctx) { a.tryMode(false); a.big('\\text{scale factor } \\tfrac12'); a.msg('Centre \\((-5, -5)\\).'); a.grow(1, [-5, -5], EM_BIG); if (!(await ctx.sleep(500))) return; await a.anim(ctx, 0.5, [-5, -5], EM_BIG); },
    },
    {
      title: 'Working out a fractional enlargement',
      text: '<p>The method is the same as before: from the centre, multiply, then add back.</p>',
      on: FD.walk([
        ['(-5, -5) \\to (3, -1): \\; \\begin{pmatrix} 8 \\\\ 4 \\end{pmatrix}', 'From the centre to a corner.'],
        ['\\tfrac12 \\begin{pmatrix} 8 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 2 \\end{pmatrix}', ''],
        ['(-5 + 4, \\; -5 + 2) = (-1, -3)', 'The image corner.'],
      ], (a) => { a.grow(0.5, [-5, -5], EM_BIG); a.big(''); }),
    },
    {
      title: 'Negative scale factors',
      text: '<p>With scale factor −2, go from each corner <b>through</b> the centre and out twice as far on the other side. The image is upside down.</p>',
      on: FD.walk([
        ['(0, 0) \\to (3, 1): \\; \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}', ''],
        ['-2 \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -6 \\\\ -2 \\end{pmatrix}', 'The minus sign reverses the direction.'],
        ['\\text{image corner } (-6, -2)', ''],
      ], (a) => { a.grow(-2, [0, 0], EM_T); a.big(''); }, 1500),
    },
    {
      title: 'Scale factor −1',
      text: '<p>An enlargement with scale factor −1 gives an image of the same size, upside down on the other side of the centre. It is the same as a rotation of 180° about the centre.</p>',
      async on(a, ctx) { a.tryMode(false); a.big('-1 \\;\\equiv\\; \\text{rotation } 180^\\circ'); a.msg(''); await a.anim(ctx, -1, [0, 0], EM_T); },
    },
    {
      title: 'Try it: any scale factor',
      text: '<p>Move the slider from 3 down to −3. Watch the image shrink into the centre and come out upside down on the other side.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'enlarge-more',
  gens: [
    () => {
      const k = FD.pick([-1, -2, -3, 0.5, -0.5]), step = Math.abs(k) === 0.5 ? 2 : 1, c = [FD.rnd(-2, 2), FD.rnd(-2, 2)];
      const r = [step * FD.rndNZ(-3, 3), step * FD.rnd(-3, 3)], p = [c[0] + r[0], c[1] + r[1]], q = [c[0] + k * r[0], c[1] + k * r[1]];
      return { type: 'num', q: `Enlarge \\(${FD.tfPt(p)}\\) by scale factor \\(${k === 0.5 ? '\\tfrac12' : k === -0.5 ? '-\\tfrac12' : k}\\), centre \\(${FD.tfPt(c)}\\). Give its image.`, a: q, fields: ['\\(x\\)', '\\(y\\)'], show: `\\(${FD.tfPt(q)}\\)`, why: `From the centre: \\(${FD.cv(...r)}\\). Multiply by ${FD.mn(k)}: \\(${FD.cv(k * r[0] || 0, k * r[1] || 0)}\\). Add to the centre: \\(${FD.tfPt(q)}\\).` };
    },
    () => {
      const d = FD.pick([2, 3, 4]), L = d * FD.rnd(2, 6);
      return { type: 'num', q: `A side of ${L} cm is enlarged by scale factor \\(\\tfrac{1}{${d}}\\). How long is the image side?`, a: L / d, unit: 'cm', why: `\\(${L} \\times \\tfrac{1}{${d}} = ${L / d}\\) cm. A fractional scale factor makes the shape smaller.` };
    },
    () => {
      const k = FD.pick([-2, -3, -0.5]), kt = k === -0.5 ? '-\\tfrac12' : k;
      return { type: 'mcq', q: `A shape is enlarged by scale factor \\(${kt}\\). The image is…`, opts: [`on the other side of the centre, upside down, with lengths × ${Math.abs(k) === 0.5 ? '½' : Math.abs(k)}`, `on the same side of the centre, with lengths × ${Math.abs(k) === 0.5 ? '½' : Math.abs(k)}`, 'a reflection of the shape in the centre line', 'congruent to the object'], why: 'A negative scale factor puts the image on the opposite side of the centre and turns it upside down; the size uses the number without its sign.' };
    },
  ],
});

FD.check({
  section: 'enlarge-more',
  items: [
    { type: 'num', q: 'Enlarge \\((6, -4)\\) by scale factor \\(\\tfrac12\\), centre the origin.', a: [3, -2], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((3, -2)\\)', why: 'Halve both coordinates.' },
    { type: 'num', q: 'Enlarge \\((2, 1)\\) by scale factor \\(-3\\), centre the origin.', a: [-6, -3], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-6, -3)\\)', why: 'Multiply both coordinates by −3.' },
    { type: 'num', q: 'Enlarge \\((4, 3)\\) by scale factor \\(-1\\), centre \\((1, 1)\\).', a: [-2, -1], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-2, -1)\\)', why: `From the centre: \\(${FD.cv(3, 2)}\\); times −1: \\(${FD.cv(-3, -2)}\\); image \\((-2, -1)\\).` },
    { type: 'tf', q: 'An enlargement with scale factor \\(\\tfrac13\\) makes the shape smaller.', a: true, why: 'Every length is divided by 3.' },
    { type: 'mcq', q: 'Enlargement by scale factor −1 is the same as…', opts: ['a rotation of 180° about the centre', 'a reflection in the \\(x\\)-axis', 'a translation', 'no change'], why: 'Same size, turned upside down through the centre.' },
  ],
});
