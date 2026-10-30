// Congruence: slide, turn and flip a copy back onto the original. Only same shape AND same size fits.
FD.add({
  id: 'congruence',
  title: 'Congruent shapes',
  tab: 'Congruence',
  icon: 'shapes',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Congruent', 'Exactly the same shape and size. One fits exactly on top of the other.'],
    ['Corresponding', 'In the same position in each shape: matching sides and matching angles.'],
  ],
  mount(el) {
    const G = FD.G;
    const P = [[40, 210], [150, 210], [70, 120]], c0 = [87, 180];
    // Each copy = the original turned (rot°), flipped (flip), resized (k) and moved (d). k ≠ 1 is not congruent.
    const PAIRS = {
      turned: { name: 'Turned and moved', rot: 140, flip: false, k: 1, d: [230, -20] },
      flipped: { name: 'Flipped and moved', rot: 0, flip: true, k: 1, d: [240, 10] },
      bigger: { name: 'Same shape, bigger', rot: 30, flip: false, k: 1.3, d: [220, -30] },
      other: { name: 'A different triangle', rot: 0, flip: false, k: 1, d: [240, 0], alt: [[40, 210], [150, 210], [110, 120]] },
    };
    const a = FD.stage(el, {
      vb: '0 0 420 260', label: 'Two shapes: is one an exact copy of the other?',
      ctrls: `<div class="row"><label>Copy <select id="pr">${Object.entries(PAIRS).map(([k, p]) => `<option value="${k}">${p.name}</option>`).join('')}</select></label></div>
        <div class="chk-btns"><button class="btn" id="fit">Move the copy onto the original</button></div>`,
    });
    // Position of the copy's vertices when a fraction t of the moving is still to do (t = 1: where it starts, t = 0: back on the original).
    const place = (p, t) => {
      const base = p.alt || P;
      return base.map((v) => {
        let x = v[0] - c0[0], y = v[1] - c0[1];
        x *= p.k; y *= p.k;
        if (p.flip) x *= 1 - 2 * t;
        const r = (p.rot * t * Math.PI) / 180, X = x * Math.cos(r) + y * Math.sin(r), Y = -x * Math.sin(r) + y * Math.cos(r);
        return [c0[0] + X + p.d[0] * t, c0[1] + Y + p.d[1] * t];
      });
    };
    a.pair = (key, t = 1) => {
      const p = PAIRS[key], Q = place(p, t);
      a.draw(G.poly(P, 'g-fill') + G.poly(Q, 'g-fill2" opacity=".8') + G.t([95, 235], 'original', 's') + (t === 1 ? G.t([Q.reduce((s, q) => s + q[0], 0) / 3, 245], 'copy', 's') : ''));
    };
    a.fit = async (key, ctx) => {
      for (let i = 30; i >= 0; i--) { a.pair(key, i / 30); if (ctx) { if (!(await ctx.sleep(40))) return null; } else await FD.wait(40); }
      const p = PAIRS[key], ok = p.k === 1 && !p.alt;
      a.msg(ok ? '✓ It fits exactly: the shapes are <b>congruent</b>.' : '✗ It does not fit: the shapes are <b>not congruent</b>.', ok ? 'good' : 'bad');
      return ok;
    };
    a.q('#fit').addEventListener('click', () => a.fit(a.q('#pr').value));
    a.onSync(() => { a.msg(''); a.pair(a.q('#pr').value); });
    a.pair('turned');
    return a;
  },
  steps: [
    {
      title: 'Same shape, same size',
      text: '<p>Two shapes are <b>congruent</b> if they are exactly the <b>same shape and size</b>.</p><p>The copy can be turned or moved. Slide and turn it back and it fits exactly on the original.</p>',
      async on(a, ctx) { a.off(); a.pair('turned'); if (!(await ctx.sleep(900))) return; await a.fit('turned', ctx); },
    },
    {
      title: 'Flipped shapes are congruent too',
      text: '<p>A mirror image is also congruent: flip it over and it fits.</p><p>Congruent shapes have <b>corresponding sides equal</b> and <b>corresponding angles equal</b>.</p>',
      async on(a, ctx) { a.off(); a.pair('flipped'); if (!(await ctx.sleep(900))) return; await a.fit('flipped', ctx); },
    },
    {
      title: 'Bigger is not congruent',
      text: '<p>This copy has the same shape but is <b>bigger</b>. However you move it, it will not fit.</p><p>Same shape but different size is called <b>similar</b>, not congruent.</p>',
      tip: 'Two or more polygons with the same shape and size are congruent to each other.',
      async on(a, ctx) { a.off(); a.pair('bigger'); if (!(await ctx.sleep(900))) return; await a.fit('bigger', ctx); },
    },
    {
      title: 'Try it: does the copy fit?',
      text: '<p>Choose a copy and decide first: congruent or not? Then press the button to move it onto the original.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'congruence',
  gens: [
    () => FD.pick([
      { type: 'tf', q: 'A triangle and its reflection in a mirror line are congruent.', a: true, why: 'Reflections keep every length and angle, so the shapes are the same shape and size.' },
      { type: 'tf', q: 'Two squares are always congruent.', a: false, why: 'They are the same shape, but they are only congruent if their sides are the same length.' },
      { type: 'tf', q: 'Congruent shapes have equal corresponding angles.', a: true, why: 'Same shape and size means every side and every angle matches.' },
      { type: 'tf', q: 'A shape and an enlargement of it with scale factor 2 are congruent.', a: false, why: 'The enlargement is bigger, so it is similar, not congruent.' },
    ]),
    () => { const s = [FD.rnd(3, 9), FD.rnd(4, 11), FD.rnd(5, 12)]; const k = FD.rnd(0, 2); return { type: 'num', q: `Triangles \\(ABC\\) and \\(PQR\\) are congruent, with \\(A\\) matching \\(P\\), \\(B\\) matching \\(Q\\) and \\(C\\) matching \\(R\\). \\(AB = ${s[0]}\\) cm, \\(BC = ${s[1]}\\) cm and \\(CA = ${s[2]}\\) cm. Find \\(${['PQ', 'QR', 'RP'][k]}\\).`, a: s[k], unit: 'cm', why: `\\(${['PQ', 'QR', 'RP'][k]}\\) corresponds to \\(${['AB', 'BC', 'CA'][k]}\\), and congruent shapes have equal corresponding sides: ${s[k]} cm.` }; },
    () => { const n = FD.pick([5, 6, 7, 8, 9, 10]); return { type: 'mcq', q: `What is the name of a polygon with ${n} sides?`, opts: [FD.PNAME[n], ...[5, 6, 7, 8, 9, 10].filter((m) => m !== n).slice(0, 3).map((m) => FD.PNAME[m])], why: 'Pentagon 5, hexagon 6, heptagon 7, octagon 8, nonagon 9, decagon 10.' }; },
  ],
});

FD.check({
  section: 'congruence',
  items: [
    { type: 'mcq', q: 'Congruent shapes are…', opts: ['the same shape and the same size', 'the same shape but a different size', 'the same area', 'the same colour'], why: 'Congruent: identical shape and size.' },
    { type: 'num', q: 'Two congruent quadrilaterals: one has an angle of \\(73^\\circ\\). What is the corresponding angle in the other?', a: 73, unit: '°', why: 'Corresponding angles of congruent shapes are equal.' },
    { type: 'mcq', q: 'A polygon with 7 sides is a…', opts: ['heptagon', 'hexagon', 'octagon', 'nonagon'], why: 'Hepta = 7.' },
    { type: 'tf', q: 'If one triangle is the mirror image of another, the triangles are congruent.', a: true, why: 'Reflection keeps shape and size.' },
  ],
});
