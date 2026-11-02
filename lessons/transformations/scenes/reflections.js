// Reflections: folding over a mirror line, lines x = k, y = k, y = x, y = −x, and finding the mirror line.
const RF_A = [[1, 2], [4, 2], [1, 4]];
const RF_LINES = { xa: ['y', 0], ya: ['x', 0], x1: ['x', 1], ym1: ['y', -1], yx: ['yx'], ynx: ['y-x'] };
FD.add({
  id: 'reflections',
  title: 'Reflections',
  tab: 'Reflections',
  icon: 'geometry',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Reflection', 'A flip in a mirror line. Each point ends up the same distance from the line on the other side.'],
    ['Mirror line', 'The line of reflection, given by its equation, such as \\(x = 1\\), \\(y = -2\\) or \\(y = x\\).'],
    ['Perpendicular', 'At right angles. A point and its image are joined by a line perpendicular to the mirror line.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-r', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<span class="seg" data-k="ln"><span class="seg-l">Mirror line</span><button data-v="xa">x-axis</button><button data-v="ya">y-axis</button><button data-v="x1">x = 1</button><button data-v="ym1">y = −1</button><button data-v="yx">y = x</button><button data-v="ynx">y = −x</button></span>`,
    });
    const g = FD.tfG(a, 'A triangle reflected in a mirror line');
    a.g = g;
    a.show = (L, obj, img, extra = '') => g.draw((L ? FD.tfMirror(g, L) : '') + extra + FD.tfPoly(g, obj, 'tf-obj', 'A') + (img ? FD.tfPoly(g, img, 'tf-img', 'B') : ''));
    a.fold = (ctx, L, obj = RF_A) => {
      const img = FD.tfMap(obj, FD.tf.refl(L));
      return FD.tfAnim(ctx, 1300, (t) => a.show(L, obj, FD.tfLerp(obj, img, t)));
    };
    let ln = 'yx';
    const sync = () => {
      const L = RF_LINES[ln];
      FD.segSet(a.$('[data-k="ln"]'), ln);
      a.show(L, RF_A, FD.tfMap(RF_A, FD.tf.refl(L)));
      a.big(`\\text{reflection in } ${FD.tfLineTex(L)}`);
      a.msg(`A corner \\(${FD.tfPt(RF_A[1])}\\) goes to \\(${FD.tfPt(FD.tf.refl(L)(RF_A[1]))}\\).`);
    };
    a.$('[data-k="ln"]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; ln = b.dataset.v; sync(); });
    a.onTry = sync;
    a.show(['x', 0], RF_A);
    return a;
  },
  steps: [
    {
      title: 'Flip in a mirror line',
      text: '<p>A <b>reflection</b> flips a shape over a <b>mirror line</b>. Here the mirror line is the \\(y\\)-axis.</p><p>Each corner ends up the same distance from the line, on the other side. The image is the same size and shape, but the other way round.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('\\text{reflection in the } y\\text{-axis}'); a.msg('');
        a.show(['x', 0], RF_A); if (!(await ctx.sleep(500))) return;
        await a.fold(ctx, ['x', 0]);
      },
    },
    {
      title: 'Lines x = k and y = k',
      text: '<p>\\(x = 1\\) is a <b>vertical</b> line through 1 on the \\(x\\)-axis. \\(y = -1\\) is a <b>horizontal</b> line through −1 on the \\(y\\)-axis.</p><p>Count the squares from each corner to the line, then the same number of squares beyond it.</p>',
      tip: '“x = …” lines are vertical; “y = …” lines are horizontal.',
      async on(a, ctx) {
        a.tryMode(false); a.msg('');
        a.big('\\text{reflection in } x = 1'); if (!(await a.fold(ctx, ['x', 1]))) return; if (!(await ctx.sleep(1200))) return;
        a.big('\\text{reflection in } y = -1'); await a.fold(ctx, ['y', -1]);
      },
    },
    {
      title: 'The lines y = x and y = −x',
      text: '<p>\\(y = x\\) is the diagonal line through \\((1, 1)\\), \\((2, 2)\\), … Reflecting in it <b>swaps</b> the coordinates: \\((4, 2) \\to (2, 4)\\).</p><p>\\(y - x = 0\\) is the same line, rearranged. In \\(y = -x\\), swap and change both signs: \\((4, 2) \\to (-2, -4)\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.msg('');
        a.big('\\text{reflection in } y = x'); if (!(await a.fold(ctx, ['yx']))) return; if (!(await ctx.sleep(1200))) return;
        a.big('\\text{reflection in } y = -x'); await a.fold(ctx, ['y-x']);
      },
    },
    {
      title: 'Finding the mirror line',
      text: '<p>Given a shape and its reflection, join each corner to its image. The mirror line goes through the <b>midpoints</b> of these lines, at right angles to them.</p>',
      on: FD.walk([
        ['(1, 2) \\to (-3, 2)', 'Join a corner to its image.'],
        ['\\text{midpoint } (-1, 2)', 'Halfway between.'],
        ['(1, 4) \\to (-3, 4): \\text{ midpoint } (-1, 4)', 'Another corner.'],
        ['\\text{mirror line } x = -1', 'The vertical line through both midpoints.'],
      ], (a) => {
        const img = FD.tfMap(RF_A, FD.tf.refl(['x', -1]));
        a.show(null, RF_A, img, RF_A.map((p, i) => a.g.line(p[0], p[1], img[i][0], img[i][1], 'g-line')).join('') + FD.tfMirror(a.g, ['x', -1]) + a.g.pt(-1, 2, 'hot') + a.g.pt(-1, 4, 'hot'));
        a.big('');
      }),
    },
    {
      title: 'Try it: choose the mirror line',
      text: '<p>Pick a mirror line and watch where triangle A lands. Check one corner with the rule for that line.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

const RF_POOL = [['x', 0], ['y', 0], ['x', 1], ['x', -2], ['x', 2], ['y', 1], ['y', -1], ['y', 3], ['yx'], ['y-x']];
FD.practice({
  section: 'reflections',
  gens: [
    () => {
      const L = FD.pick(RF_POOL); let p;
      do { p = [FD.rnd(-5, 5), FD.rnd(-5, 5)]; } while (FD.tfPt(FD.tf.refl(L)(p)) === FD.tfPt(p));
      const q = FD.tf.refl(L)(p);
      const how = L[0] === 'x' ? `The line is vertical. \\(x = ${p[0]}\\) is ${Math.abs(p[0] - L[1])} from \\(x = ${L[1]}\\), so the image is ${Math.abs(p[0] - L[1])} on the other side: \\(x = ${q[0]}\\). \\(y\\) stays the same.` : L[0] === 'y' ? `The line is horizontal. \\(y = ${p[1]}\\) is ${Math.abs(p[1] - L[1])} from \\(y = ${L[1]}\\), so the image has \\(y = ${q[1]}\\). \\(x\\) stays the same.` : L[0] === 'yx' ? 'In \\(y = x\\), swap the coordinates.' : 'In \\(y = -x\\), swap the coordinates and change both signs.';
      return { type: 'num', q: `Reflect the point \\(${FD.tfPt(p)}\\) in the line \\(${FD.tfLineTex(L)}\\). Give the image.`, a: q, fields: ['\\(x\\)', '\\(y\\)'], show: `\\(${FD.tfPt(q)}\\)`, why: `${how} Image \\(${FD.tfPt(q)}\\).` };
    },
    () => {
      const vert = Math.random() < 0.5, k = FD.rnd(-3, 3), d = FD.rnd(1, 4), o = FD.rnd(-4, 4);
      const p = vert ? [k - d, o] : [o, k - d], q = vert ? [k + d, o] : [o, k + d], ans = vert ? `x = ${k}` : `y = ${k}`;
      const opts = [ans, vert ? `y = ${k}` : `x = ${k}`, vert ? `x = ${k + 1}` : `y = ${k + 1}`, vert ? `y = ${o}` : `x = ${o}`].filter((s, i, arr) => arr.indexOf(s) === i).map((s) => `\\(${s}\\)`);
      return { type: 'mcq', q: `A reflection maps \\(${FD.tfPt(p)}\\) onto \\(${FD.tfPt(q)}\\). What is the mirror line?`, opts, why: `The midpoint is \\(${FD.tfPt([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])}\\), and the line is ${vert ? 'vertical' : 'horizontal'} (only \\(${vert ? 'x' : 'y'}\\) changes). So \\(${ans}\\).` };
    },
    () => {
      const k = FD.rnd(0, 2);
      return [
        { type: 'mcq', q: 'Which line is the same as \\(y - x = 0\\)?', opts: ['\\(y = x\\)', '\\(y = -x\\)', '\\(x = 0\\)', '\\(y = 0\\)'], why: 'Add \\(x\\) to both sides: \\(y = x\\).' },
        { type: 'mcq', q: 'The line \\(x = 3\\) is…', opts: ['vertical, through 3 on the \\(x\\)-axis', 'horizontal, through 3 on the \\(y\\)-axis', 'diagonal, through \\((3, 3)\\)', 'the \\(x\\)-axis'], why: 'Every point on it has \\(x = 3\\), so it goes straight up.' },
        { type: 'mcq', q: 'Reflecting in the \\(x\\)-axis…', opts: ['changes the sign of \\(y\\)', 'changes the sign of \\(x\\)', 'swaps \\(x\\) and \\(y\\)', 'changes both signs'], why: 'The \\(x\\)-axis is \\(y = 0\\): points flip up and down, so \\(y\\) changes sign.' },
      ][k];
    },
  ],
});

FD.check({
  section: 'reflections',
  items: [
    { type: 'num', q: 'Reflect \\((5, -2)\\) in the \\(y\\)-axis.', a: [-5, -2], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-5, -2)\\)', why: 'Across the vertical axis: change the sign of \\(x\\).' },
    { type: 'num', q: 'Reflect \\((4, 3)\\) in the line \\(x = 1\\).', a: [-2, 3], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-2, 3)\\)', why: '3 to the right of the line, so 3 to the left: \\(x = -2\\).' },
    { type: 'num', q: 'Reflect \\((2, -6)\\) in the line \\(y = x\\).', a: [-6, 2], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-6, 2)\\)', why: 'Swap the coordinates.' },
    { type: 'mcq', q: 'A reflection maps \\((-1, 4)\\) onto \\((-1, -2)\\). The mirror line is…', opts: ['\\(y = 1\\)', '\\(x = -1\\)', '\\(y = 2\\)', '\\(y = x\\)'], why: 'Midpoint \\((-1, 1)\\); the line is horizontal.' },
    { type: 'tf', q: 'A reflected shape is congruent to the original.', a: true, why: 'Only its position and the way round change.' },
  ],
});
