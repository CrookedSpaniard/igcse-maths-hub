// Areas of rectangles, triangles, parallelograms and trapezia, each shown by cutting and rearranging.

// Corners (maths coordinates, cm) of each shape with base b, perpendicular height h and top t (trapezium).
// Returns the corners and the x position of the dashed height line.
FD.quadPts = (ty, b, h, t) => {
  if (ty === 0) return { pts: [[0, 0], [b, 0], [b, h], [0, h]], hx: null };
  if (ty === 1) return { pts: [[0, 0], [b, 0], [0.35 * b, h]], hx: 0.35 * b };
  if (ty === 2) { const o = 0.3 * b; return { pts: [[0, 0], [b, 0], [b + o, h], [o, h]], hx: o, o }; }
  const o = (b - t) / 2; return { pts: [[0, 0], [b, 0], [o + t, h], [o, h]], hx: Math.max(o, 0.15 * b), o };
};

FD.add({
  id: 'areas',
  title: 'Areas of triangles and quadrilaterals',
  tab: 'Area formulae',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Area', 'The amount of flat space inside a shape, measured in square units such as \\(\\text{cm}^2\\).'],
    ['Perpendicular height', 'The height measured at right angles (90°) to the base.'],
    ['Trapezium', 'A quadrilateral with one pair of parallel sides, \\(a\\) and \\(b\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A shape with its base and perpendicular height',
      ctrls: `<label class="ctrl">Shape <select id="sh"><option value="0">Rectangle</option><option value="1">Triangle</option><option value="2">Parallelogram</option><option value="3">Trapezium</option></select></label>
        <label class="ctrl">Base \\(b\\) (cm) <input type="range" id="b" min="3" max="12" value="8"><output id="ob">8</output></label>
        <label class="ctrl">Height \\(h\\) (cm) <input type="range" id="h" min="2" max="9" value="5"><output id="oh">5</output></label>
        <label class="ctrl">Top \\(a\\) (cm, trapezium) <input type="range" id="t" min="1" max="12" value="4"><output id="ot">4</output></label>`,
    });
    // st: extra picture: 'grid' unit squares, 'box' the rectangle around a triangle, 'move' parallelogram rearranged, 'copy' two trapezia
    a.fig = (ty, b, h, t, lb = {}, st = '') => {
      let { pts, hx, o } = FD.quadPts(ty, b, h, t);
      let lab = ty === 0 ? [lb.b, lb.h] : ty === 1 ? [lb.b] : ty === 2 ? [lb.b, lb.s] : [lb.b, '', lb.t];
      let fit = [], pre = () => '', post = () => '';
      // Rearranged parallelogram: the cut-off triangle leaves a gap on the left.
      if (st === 'move') { pts = [[o, 0], [b, 0], [b + o, h], [o, h]]; fit = [[0, 0]]; lab = [lb.b]; }
      if (st === 'box') pre = (P) => G.poly([[0, 0], [b, 0], [b, h], [0, h]].map(P), 'g-ghost');
      if (st === 'grid') post = (P) => { let s = ''; for (let i = 1; i < b; i++) s += G.line(P([i, 0]), P([i, h]), 'g-thin'); for (let j = 1; j < h; j++) s += G.line(P([0, j]), P([b, j]), 'g-thin'); return s; };
      if (st === 'move') post = (P) => G.poly([[0, 0], [o, 0], [o, h]].map(P), 'g-ghost') + G.poly([[b, 0], [b + o, 0], [b + o, h]].map(P), 'g-fill2');
      if (st === 'copy') { const cp = [[b, 0], [b + t, 0], [b + o + t, h], [o + t, h]]; fit = cp; post = (P) => G.poly(cp.map(P), 'g-fill2') +G.t([P([b + t / 2, 0])[0], P([0, 0])[1] + 14], lb.t2 || '', 's') + G.t([P([o + t + b / 2, h])[0], P([0, h])[1] - 12], lb.b2 || '', 's'); }
      const hl = (P) => {
        if (hx === null) return '';
        const F = P([hx, 0]), T = P([hx, h]);
        return G.line(T, F, 'g-dash') + G.right(F, P([hx + 1, 0]), T, 10) + G.t([F[0] + 8, (F[1] + T[1]) / 2], lb.h || '', 'l2 st');
      };
      const r = FD.shp(pts, { lab, fit, pre, post: (P) => post(P) + hl(P) });
      a.draw(r.s);
    };
    const names = ['Rectangle', 'Triangle', 'Parallelogram', 'Trapezium'];
    a.onSync(() => {
      const ty = a.val('sh'), b = a.val('b'), h = a.val('h'), t = a.val('t');
      a.out('b', b); a.out('h', h); a.out('t', t);
      a.fig(ty, b, h, t, { b: `b = ${b} cm`, h: `h = ${h} cm`, t: `a = ${t} cm` });
      a.big([`A = ${b} \\times ${h} = ${b * h}`, `A = \\tfrac12 \\times ${b} \\times ${h} = ${FD.num(b * h / 2)}`, `A = ${b} \\times ${h} = ${b * h}`, `A = \\tfrac12(${t} + ${b}) \\times ${h} = ${FD.num((t + b) * h / 2)}`][ty] + '\\ \\text{cm}^2');
      a.msg(`${names[ty]}: ${['length × width', '½ × base × height', 'base × perpendicular height', '½ × (sum of the parallel sides) × height'][ty]}.`);
    });
    a.fig(0, 6, 4, 0, { b: '6 cm', h: '4 cm' }, 'grid');
    return a;
  },
  steps: [
    {
      title: 'Rectangle: count the squares',
      text: '<p>A rectangle 6 cm by 4 cm is covered by 4 rows of 6 squares, each \\(1\\ \\text{cm}^2\\).</p><p class="mbig">\\(A = \\text{length} \\times \\text{width}\\)</p>',
      async on(a, ctx) { a.off(); a.fig(0, 6, 4, 0, { b: '6 cm', h: '4 cm' }, 'grid'); await a.play(ctx, [['A = 6 \\times 4 = 24\\ \\text{cm}^2', '24 squares']]); },
    },
    {
      title: 'Triangle: half a rectangle',
      text: '<p>Every triangle fits in a rectangle with the same base and height, and fills exactly <b>half</b> of it.</p><p class="mbig">\\(A = \\tfrac12 \\times b \\times h\\)</p>',
      tip: 'h must be the perpendicular height: at 90° to the base.',
      async on(a, ctx) { a.off(); a.fig(1, 8, 5, 0, { b: '8 cm', h: '5 cm' }, 'box'); await a.play(ctx, [['A = \\tfrac12 \\times 8 \\times 5', ''], ['A = 20\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Parallelogram: cut and slide',
      text: '<p>Cut the triangle off one end of a parallelogram and slide it to the other end. It becomes a <b>rectangle</b>.</p><p class="mbig">\\(A = b \\times h\\)</p>',
      tip: 'The sloping side (6 cm) is not used. Use the perpendicular height.',
      async on(a, ctx) {
        a.off(); a.fig(2, 9, 5, 0, { b: '9 cm', h: '5 cm', s: '6 cm' });
        if (!(await ctx.sleep(1200))) return;
        a.fig(2, 9, 5, 0, { b: '9 cm', h: '5 cm', s: '6 cm' }, 'move');
        await a.play(ctx, [['A = 9 \\times 5 = 45\\ \\text{cm}^2', '']]);
      },
    },
    {
      title: 'Trapezium: two make a parallelogram',
      text: '<p>Two copies of a trapezium, one turned upside down, make a parallelogram with base \\(a + b\\). The trapezium is half of it.</p><p class="mbig">\\(A = \\tfrac12(a + b)h\\)</p>',
      async on(a, ctx) {
        a.off(); a.fig(3, 11, 6, 5, { b: '11 cm', h: '6 cm', t: '5 cm' });
        if (!(await ctx.sleep(1200))) return;
        a.fig(3, 11, 6, 5, { b: '11 cm', h: '6 cm', t: '5 cm', t2: '5', b2: '11' }, 'copy');
        await a.play(ctx, [['A = \\tfrac12(5 + 11) \\times 6', 'add the parallel sides'], ['A = \\tfrac12 \\times 16 \\times 6 = 48\\ \\text{cm}^2', '']]);
      },
    },
    {
      title: 'Try it: choose a shape',
      text: '<p>Pick a shape and change its base and height. The top \\(a\\) is only used by the trapezium.</p>',
      tip: 'Make a triangle and a parallelogram with the same base and height: the triangle is always half.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'areas',
  gens: [
    () => { const b = FD.rnd(3, 16), h = FD.rnd(2, 14), A = (b * h) / 2; return { type: 'num', q: `A triangle has a base of \\(${b}\\) cm and a perpendicular height of \\(${h}\\) cm. Work out its area.`, a: A, unit: 'cm²', why: `\\(\\tfrac12 \\times ${b} \\times ${h} = ${FD.tn(A)}\\ \\text{cm}^2\\).` }; },
    () => { const b = FD.rnd(4, 15), h = FD.rnd(3, 10), s = h + FD.rnd(1, 4); return { type: 'num', q: `A parallelogram has a base of \\(${b}\\) cm, sloping sides of \\(${s}\\) cm and a perpendicular height of \\(${h}\\) cm. Work out its area.`, a: b * h, unit: 'cm²', why: `\\(A = b \\times h = ${b} \\times ${h} = ${b * h}\\ \\text{cm}^2\\). The sloping side is not needed.` }; },
    () => { const p = FD.rnd(2, 10), q = p + FD.rnd(1, 8), h = FD.rnd(2, 12), A = ((p + q) * h) / 2; return { type: 'num', q: `A trapezium has parallel sides of \\(${p}\\) cm and \\(${q}\\) cm. The distance between them is \\(${h}\\) cm. Work out its area.`, a: A, unit: 'cm²', why: `\\(\\tfrac12(${p} + ${q}) \\times ${h} = \\tfrac12 \\times ${p + q} \\times ${h} = ${FD.tn(A)}\\ \\text{cm}^2\\).` }; },
    () => { const b = FD.rnd(3, 14), h = FD.rnd(2, 12), A = (b * h) / 2; return { type: 'num', q: `A triangle has an area of \\(${FD.tn(A)}\\ \\text{cm}^2\\) and a base of \\(${b}\\) cm. Work out its perpendicular height.`, a: h, unit: 'cm', why: `\\(\\tfrac12 \\times ${b} \\times h = ${FD.tn(A)}\\), so \\(h = 2 \\times ${FD.tn(A)} \\div ${b} = ${h}\\) cm.` }; },
  ],
});

FD.check({
  section: 'areas',
  items: [
    { type: 'num', q: 'A triangle has base 10 cm and perpendicular height 7 cm. Find its area.', a: 35, unit: 'cm²', why: '\\(\\tfrac12 \\times 10 \\times 7 = 35\\).' },
    { type: 'num', q: 'A trapezium has parallel sides 4 cm and 10 cm, 5 cm apart. Find its area.', a: 35, unit: 'cm²', why: '\\(\\tfrac12 \\times 14 \\times 5 = 35\\).' },
    { type: 'mcq', q: 'A parallelogram has base 8 cm, sloping side 5 cm and perpendicular height 4 cm. Its area is…', opts: ['\\(32\\ \\text{cm}^2\\)', '\\(40\\ \\text{cm}^2\\)', '\\(16\\ \\text{cm}^2\\)', '\\(20\\ \\text{cm}^2\\)'], why: '\\(8 \\times 4\\): use the perpendicular height.' },
    { type: 'tf', q: 'A triangle has half the area of a rectangle with the same base and perpendicular height.', a: true, why: 'That is where the ½ comes from.' },
  ],
});
