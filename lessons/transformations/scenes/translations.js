// ---- Transformation helpers (shared by the transformations scenes) ----
// FD.tfG(api, label): a −6…6 coordinate grid. FD.tfPoly(g, pts, cls, name): SVG for a shape with its name inside.
// FD.tf.*: maps of a point [x, y] (translation, rotation, reflection, enlargement). FD.tfAnim(ctx, ms, fn): fn(t) for t → 1.
FD.cv = (x, y) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;
FD.mn = (n) => String(n).replace('-', '−');
FD.tfG = (a, label) => FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label });
const tfClean = (v) => +(+v).toFixed(6) || 0;
FD.tfPoly = (g, pts, cls = 'tf-obj', name = '') => {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return `<polygon class="${cls}" points="${pts.map(([x, y]) => `${g.ax.X(x)},${g.ax.Y(y)}`).join(' ')}"/>` + (name ? `<text class="tf-name" x="${g.ax.X(cx)}" y="${g.ax.Y(cy) + 5}">${name}</text>` : '');
};
FD.tf = {
  tr: (dx, dy) => ([x, y]) => [x + dx, y + dy],
  rot: (deg, cx = 0, cy = 0) => ([x, y]) => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [tfClean(cx + c * (x - cx) - s * (y - cy)), tfClean(cy + s * (x - cx) + c * (y - cy))]; },
  // line: ['x', k] is x = k, ['y', k] is y = k, ['yx'] is y = x, ['y-x'] is y = −x
  refl: (L) => ([x, y]) => (L[0] === 'x' ? [2 * L[1] - x, y] : L[0] === 'y' ? [x, 2 * L[1] - y] : L[0] === 'yx' ? [y, x] : [-y, -x]),
  enl: (k, cx = 0, cy = 0) => ([x, y]) => [tfClean(cx + k * (x - cx)), tfClean(cy + k * (y - cy))],
};
FD.tfMap = (pts, f) => pts.map((p) => f(p));
FD.tfLerp = (P, Q, t) => P.map(([x, y], i) => [x + (Q[i][0] - x) * t, y + (Q[i][1] - y) * t]);
FD.tfAnim = async (ctx, ms, fn) => { const n = Math.max(1, Math.round(ms / 40)); for (let i = 1; i <= n; i++) { fn(i / n); if (!(await ctx.sleep(40))) return false; } return true; };
FD.tfPt = ([x, y]) => `(${tfClean(x)}, ${tfClean(y)})`;
FD.tfLineName = (L) => (L[0] === 'x' ? (L[1] ? `x = ${L[1]}` : 'x = 0 (the y-axis)') : L[0] === 'y' ? (L[1] ? `y = ${L[1]}` : 'y = 0 (the x-axis)') : L[0] === 'yx' ? 'y = x' : 'y = −x');
// the same name in TeX
FD.tfLineTex = (L) => (L[0] === 'x' ? (L[1] ? `x = ${L[1]}` : 'x = 0 \\text{ (the } y\\text{-axis)}') : L[0] === 'y' ? (L[1] ? `y = ${L[1]}` : 'y = 0 \\text{ (the } x\\text{-axis)}') : L[0] === 'yx' ? 'y = x' : 'y = -x');
// a mirror line drawn across the whole grid
FD.tfMirror = (g, L) => {
  const [a, b] = L[0] === 'x' ? [[L[1], -7], [L[1], 7]] : L[0] === 'y' ? [[-7, L[1]], [7, L[1]]] : L[0] === 'yx' ? [[-7, -7], [7, 7]] : [[-7, 7], [7, -7]];
  return g.line(a[0], a[1], b[0], b[1], 'tf-mirror');
};
// ---- end of transformation helpers ----

const TR_A = [[-5, 1], [-2, 1], [-5, 3]];
FD.add({
  id: 'translations',
  title: 'Translations',
  tab: 'Translations',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Translation', 'A slide. Every point moves the same distance in the same direction.'],
    ['Column vector', '\\(\\begin{pmatrix} x \\\\ y \\end{pmatrix}\\): \\(x\\) across (positive = right), \\(y\\) up (positive = up).'],
    ['Object, image', 'The shape before the transformation is the object; the shape after it is the image.'],
    ['Congruent', 'Exactly the same shape and size. Translations, reflections and rotations give congruent images.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-t', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Across <input type="range" data-k="x" min="-4" max="4" value="3"><output data-k="ox">3</output></label>
        <label class="ctrl">Up <input type="range" data-k="y" min="-4" max="4" value="-2"><output data-k="oy">−2</output></label>`,
    });
    const g = FD.tfG(a, 'A triangle and its image after a translation');
    a.g = g;
    a.show = (obj, img, dx, dy, arrow = true) => g.draw(FD.tfPoly(g, obj, 'tf-obj', 'A') + (img ? FD.tfPoly(g, img, 'tf-img', 'B') : '') + (img && arrow ? g.line(obj[0][0], obj[0][1], obj[0][0] + dx, obj[0][1] + dy, 'tf-arrow') : ''));
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value, obj = [[-2, -1], [1, -1], [-2, 1]];
      a.$('[data-k="ox"]').textContent = FD.mn(x); a.$('[data-k="oy"]').textContent = FD.mn(y);
      a.show(obj, FD.tfMap(obj, FD.tf.tr(x, y)), x, y);
      a.big(`\\text{translation by } ${FD.cv(x, y)}`);
      a.msg(`${x ? `${Math.abs(x)} ${x > 0 ? 'right' : 'left'}` : 'no move across'}, ${y ? `${Math.abs(y)} ${y > 0 ? 'up' : 'down'}` : 'no move up or down'}. Same shape, same size, same way round.`);
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(TR_A);
    return a;
  },
  steps: [
    {
      title: 'A slide',
      text: '<p>A <b>translation</b> slides a shape. It does not turn or flip, and it stays the same size.</p><p>Every corner moves the same distance in the same direction: here 6 right and 4 down.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(''); a.msg('');
        const B = FD.tfMap(TR_A, FD.tf.tr(6, -4));
        a.show(TR_A); if (!(await ctx.sleep(500))) return;
        if (!(await FD.tfAnim(ctx, 1400, (t) => a.g.draw(FD.tfPoly(a.g, TR_A, 'tf-obj', 'A') + FD.tfPoly(a.g, FD.tfLerp(TR_A, B, t), 'tf-img', 'B'))))) return;
        a.show(TR_A, B, 6, -4);
      },
    },
    {
      title: 'Column vectors',
      text: '<p>We describe the movement with a <b>column vector</b>. The top number is across (right +, left −); the bottom number is up (up +, down −).</p><p>6 right and 4 down is \\(\\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}\\).</p>',
      async on(a) { a.tryMode(false); a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4); a.big(`\\text{translation by } ${FD.cv(6, -4)}`); a.msg(''); },
    },
    {
      title: 'Same shape, same size',
      text: '<p>After a translation, every length and every angle is unchanged. The image is <b>congruent</b> to the object; only its position has changed.</p>',
      tip: 'Check one corner first, then count the other corners from it.',
      async on(a) { a.tryMode(false); a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4, false); a.big(''); a.msg('Base 3, height 2, right angle: the same in A and B.'); },
    },
    {
      title: 'Finding the vector',
      text: '<p>To find the translation from A to B, pick a corner of A and count to the same corner of B.</p>',
      on: FD.walk([
        ['(-5, 1) \\to (1, -3)', 'The bottom-left corner of A and of B.'],
        ['\\text{across: } 1 - (-5) = 6', 'Image minus object.'],
        ['\\text{up: } -3 - 1 = -4', ''],
        [`\\text{translation by } ${FD.cv(6, -4)}`, ''],
      ], (a) => { a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4); a.big(''); }),
    },
    {
      title: 'Try it: translate the triangle',
      text: '<p>Change the column vector. Watch the image slide while it stays the same shape and the same way round.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'translations',
  gens: [
    () => {
      const x = FD.rnd(-6, 6), y = FD.rnd(-6, 6), dx = FD.rndNZ(-6, 6), dy = FD.rndNZ(-6, 6);
      return { type: 'num', q: `The point \\((${x}, ${y})\\) is translated by \\(${FD.cv(dx, dy)}\\). Find the coordinates of its image.`, a: [x + dx, y + dy], fields: ['\\(x\\)', '\\(y\\)'], show: `\\((${x + dx}, ${y + dy})\\)`, why: `Add the vector: \\((${x} + ${dx < 0 ? `(${dx})` : dx}, ${y} + ${dy < 0 ? `(${dy})` : dy}) = (${x + dx}, ${y + dy})\\).` };
    },
    () => {
      const x = FD.rnd(-5, 5), y = FD.rnd(-5, 5), dx = FD.rndNZ(-6, 6), dy = FD.rndNZ(-6, 6);
      return { type: 'num', q: `A translation maps \\((${x}, ${y})\\) onto \\((${x + dx}, ${y + dy})\\). Write the translation as a column vector.`, a: [dx, dy], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(dx, dy)}\\)`, why: `Image minus object: \\(${FD.cv(`${x + dx} - ${x < 0 ? `(${x})` : x}`, `${y + dy} - ${y < 0 ? `(${y})` : y}`)} = ${FD.cv(dx, dy)}\\).` };
    },
    () => {
      const dx = FD.rndNZ(-7, 7), dy = FD.rndNZ(-7, 7), s = (n, p, m) => `${Math.abs(n)} ${n > 0 ? p : m}`;
      return { type: 'mcq', q: `A translation by \\(${FD.cv(dx, dy)}\\) moves a shape…`, opts: [`${s(dx, 'right', 'left')} and ${s(dy, 'up', 'down')}`, `${s(-dx, 'right', 'left')} and ${s(dy, 'up', 'down')}`, `${s(dy, 'right', 'left')} and ${s(dx, 'up', 'down')}`, `${s(dx, 'right', 'left')} and ${s(-dy, 'up', 'down')}`].filter((o, i, arr) => arr.indexOf(o) === i), why: 'Top number: across (+ right). Bottom number: up (+ up).' };
    },
    () => {
      const dx = FD.rndNZ(-5, 5), dy = FD.rndNZ(-5, 5);
      return { type: 'num', q: `Shape P is translated by \\(${FD.cv(dx, dy)}\\) to give shape Q. Which translation maps Q back onto P?`, a: [-dx, -dy], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(-dx, -dy)}\\)`, why: `Go back the other way: change both signs, \\(${FD.cv(-dx, -dy)}\\).` };
    },
  ],
});

FD.check({
  section: 'translations',
  items: [
    { type: 'num', q: `Translate \\((2, -3)\\) by \\(${FD.cv(-5, 4)}\\).`, a: [-3, 1], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-3, 1)\\)', why: '\\(2 - 5 = -3\\), \\(-3 + 4 = 1\\).' },
    { type: 'num', q: 'A translation maps \\((1, 4)\\) onto \\((6, 1)\\). Write it as a column vector.', a: [5, -3], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(5, -3)}\\)`, why: '5 right, 3 down.' },
    { type: 'tf', q: 'After a translation, the image is congruent to the object.', a: true, why: 'Lengths and angles do not change.' },
    { type: 'mcq', q: 'A translation is described by…', opts: ['a column vector', 'a mirror line', 'a centre and an angle', 'a scale factor'], why: 'The vector gives the distance and direction of the slide.' },
  ],
});
