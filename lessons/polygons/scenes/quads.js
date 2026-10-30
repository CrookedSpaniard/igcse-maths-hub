/* ---- lesson kit: stage layout, SVG geometry and dragging, shared by this lesson's scenes ---- */
// FD.stage(el, { vb, label, ctrls, side, stack, cls }) builds: SVG diagram + side panel (big formula, verdict),
// a worked-example area and a hidden "Try it" control card. Returns an api for the steps.
FD.stage = (el, o = {}) => {
  el.innerHTML = `
    <div class="sim${o.cls ? ' ' + o.cls : ''}">
      <div class="dg${o.stack ? ' stack' : ''}">
        <svg class="dg-svg${o.drag ? ' drag' : ''}" viewBox="${o.vb || '0 0 400 300'}" role="img" aria-label="${o.label || 'Diagram'}"><g class="g"></g></svg>
        <div class="side"><div class="mbig"></div><p class="verdict"></p>${o.side || ''}</div>
      </div>
      <div class="wk"></div>
      ${o.ctrls ? `<div class="card ctrls try" hidden>${o.ctrls}</div>` : ''}
    </div>`;
  const root = el.firstElementChild, q = (s) => root.querySelector(s);
  let work = null, sync = null;
  const api = {
    root, q, svg: q('svg'),
    draw(html) { q('.g').innerHTML = html; },
    big(t) { q('.mbig').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t, cls = 'good') { const m = q('.verdict'); m.className = 'verdict ' + cls; m.innerHTML = t || ''; },
    work(lines) { q('.wk').innerHTML = ''; work = lines ? FD.work(q('.wk'), lines) : null; },
    upto(i) { if (work) work.upto(i); },
    // Shows a worked example line by line; returns false if the student moved on.
    async play(ctx, lines, ms = 1300, each) {
      api.work(lines);
      for (let i = 0; i < lines.length; i++) { api.upto(i); if (each) each(i); if (!(await ctx.sleep(ms))) return false; }
      return true;
    },
    onSync(f) { sync = f; root.querySelectorAll('.try input, .try select').forEach((i) => i.addEventListener('input', () => sync())); },
    sync() { if (sync) sync(); },
    val: (id) => +q('#' + id).value,
    out(id, v) { q('#o' + id).textContent = v; },
    off() { api.work(null); api.msg(''); api.big(''); if (q('.try')) q('.try').hidden = true; },
    tryMode() { api.work(null); api.msg(''); q('.try').hidden = false; if (sync) sync(); },
  };
  return api;
};

// A number for use inside TeX: thousands commas without the extra space KaTeX puts after a comma.
FD.tn = (x, dp) => FD.num(x, dp).replace(/,/g, '{,}');

// SVG helpers. Coordinates are SVG user units (y goes down).
FD.G = (() => {
  const f = (v) => +(+v).toFixed(1);
  const G = {
    line: (a, b, c = 'g-ln') => `<line class="${c}" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`,
    poly: (pts, c = 'g-fill') => `<polygon class="${c}" points="${pts.map((p) => f(p[0]) + ',' + f(p[1])).join(' ')}"/>`,
    path: (pts, c = 'g-ln') => `<polyline class="${c}" points="${pts.map((p) => f(p[0]) + ',' + f(p[1])).join(' ')}"/>`,
    t: (p, s, c = '') => `<text class="g-t ${c}" x="${f(p[0])}" y="${f(p[1])}">${s}</text>`,
    dot: (p, c = 'g-dot', r = 5) => `<circle class="${c}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}"/>`,
    circ: (p, r, c = 'g-ln') => `<circle class="${c}" cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}"/>`,
    handle: (p, name) => `<circle class="g-drag" data-drag="${name}" cx="${f(p[0])}" cy="${f(p[1])}" r="12"/>`,
    dist: (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]),
    mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
    polar: (c, r, deg) => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] - r * Math.sin((deg * Math.PI) / 180)],
    // The (smaller) angle AVB in degrees.
    deg(V, A, B) { const a = Math.atan2(A[1] - V[1], A[0] - V[0]), b = Math.atan2(B[1] - V[1], B[0] - V[0]); let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d; },
    // Shaded arc for the angle AVB at vertex V, with an optional label on the bisector.
    arc(V, A, B, r = 26, lbl = '', c = 'g-arc', lr) {
      const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]); let d = Math.atan2(B[1] - V[1], B[0] - V[0]) - a1;
      while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
      const p1 = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)], p2 = [V[0] + r * Math.cos(a1 + d), V[1] + r * Math.sin(a1 + d)];
      const m = a1 + d / 2, R = lr || r + 15, lp = [V[0] + R * Math.cos(m), V[1] + R * Math.sin(m)];
      return `<path class="${c}" d="M${f(V[0])} ${f(V[1])}L${f(p1[0])} ${f(p1[1])}A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${f(p2[0])} ${f(p2[1])}Z"/>` + (lbl ? G.t(lp, lbl, 'a ' + c.replace('g-arc', 'l')) : '');
    },
    // Shaded sector at V going anticlockwise (as seen) from direction `from` to `to` (degrees, maths convention).
    sector(V, r, from, to, c = 'g-arc', lbl = '', lr) {
      while (to < from) to += 360;
      const p1 = G.polar(V, r, from), p2 = G.polar(V, r, to), big = to - from > 180 ? 1 : 0;
      const s = to - from >= 359.9 ? `<circle class="${c}" cx="${f(V[0])}" cy="${f(V[1])}" r="${r}"/>` : `<path class="${c}" d="M${f(V[0])} ${f(V[1])}L${f(p1[0])} ${f(p1[1])}A${r} ${r} 0 ${big} 0 ${f(p2[0])} ${f(p2[1])}Z"/>`;
      return s + (lbl ? G.t(G.polar(V, lr || r + 16, (from + to) / 2), lbl, c.replace('g-arc', 'l')) : '');
    },
    // Right-angle box at V between rays to A and B.
    right(V, A, B, s = 14) {
      const u = (P) => { const d = G.dist(V, P); return [(P[0] - V[0]) / d, (P[1] - V[1]) / d]; }, a = u(A), b = u(B);
      return `<path class="g-thin" d="M${f(V[0] + a[0] * s)} ${f(V[1] + a[1] * s)}L${f(V[0] + (a[0] + b[0]) * s)} ${f(V[1] + (a[1] + b[1]) * s)}L${f(V[0] + b[0] * s)} ${f(V[1] + b[1] * s)}"/>`;
    },
    // Little arrow on a line (for parallel lines) at the middle of AB; n arrows.
    arrows(A, B, n = 1, c = 'g-thin') {
      const d = G.dist(A, B), u = [(B[0] - A[0]) / d, (B[1] - A[1]) / d], v = [-u[1], u[0]];
      let s = '';
      for (let k = 0; k < n; k++) { const m = G.lerp(A, B, 0.5); const p = [m[0] + u[0] * (k * 9 - (n - 1) * 4.5), m[1] + u[1] * (k * 9 - (n - 1) * 4.5)]; s += `<path class="${c}" d="M${f(p[0] - u[0] * 7 + v[0] * 6)} ${f(p[1] - u[1] * 7 + v[1] * 6)}L${f(p[0])} ${f(p[1])}L${f(p[0] - u[0] * 7 - v[0] * 6)} ${f(p[1] - u[1] * 7 - v[1] * 6)}"/>`; }
      return s;
    },
    // Equal-length tick marks on AB.
    ticks(A, B, n = 1) {
      const d = G.dist(A, B), u = [(B[0] - A[0]) / d, (B[1] - A[1]) / d], v = [-u[1], u[0]], m = G.mid(A, B);
      let s = '';
      for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 6, p = [m[0] + u[0] * o, m[1] + u[1] * o]; s += G.line([p[0] + v[0] * 7, p[1] + v[1] * 7], [p[0] - v[0] * 7, p[1] - v[1] * 7], 'g-thin'); }
      return s;
    },
    // Arrowed line from A to B (vectors, bearings).
    vec(A, B, c = 'g-vec') {
      const d = G.dist(A, B) || 1, u = [(B[0] - A[0]) / d, (B[1] - A[1]) / d], v = [-u[1], u[0]], h = 11;
      return `<line class="${c}" x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0] - u[0] * h * .6)}" y2="${f(B[1] - u[1] * h * .6)}"/><path class="${c} head" d="M${f(B[0])} ${f(B[1])}L${f(B[0] - u[0] * h + v[0] * 5.5)} ${f(B[1] - u[1] * h + v[1] * 5.5)}L${f(B[0] - u[0] * h - v[0] * 5.5)} ${f(B[1] - u[1] * h - v[1] * 5.5)}Z"/>`;
    },
    // Square grid for transformations and vectors: cells of size s from x0,y0 with nx × ny cells.
    grid(x0, y0, nx, ny, s, c = 'g-grid') {
      let d = '';
      for (let i = 0; i <= nx; i++) d += `M${x0 + i * s} ${y0}V${y0 + ny * s}`;
      for (let j = 0; j <= ny; j++) d += `M${x0} ${y0 + j * s}H${x0 + nx * s}`;
      return `<path class="${c}" d="${d}"/>`;
    },
  };
  return G;
})();

// Dragging: any element with data-drag="name" inside svg; fn(name, x, y) gets SVG coordinates.
FD.dragIn = (svg, fn) => {
  let cur = null;
  const pt = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  svg.addEventListener('pointerdown', (e) => { const t = e.target.closest('[data-drag]'); if (!t) return; cur = t.dataset.drag; svg.setPointerCapture(e.pointerId); e.preventDefault(); });
  svg.addEventListener('pointermove', (e) => { if (!cur) return; const p = pt(e); fn(cur, p.x, p.y); });
  const end = () => { cur = null; };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
};
/* ---- end of lesson kit ---- */

// The special quadrilaterals, drawn with their equal-side ticks, parallel arrows and right angles.
FD.QUADS = {
  square: { name: 'Square', pts: [[125, 55], [295, 55], [295, 225], [125, 225]], ticks: [1, 1, 1, 1], arrows: [1, 2, 1, 2], right: true, diag: 'perp',
    facts: ['4 equal sides', '4 right angles', '2 pairs of parallel sides', 'Diagonals equal, bisect each other at 90°', '4 lines of symmetry, rotational symmetry order 4'] },
  rectangle: { name: 'Rectangle', pts: [[75, 75], [345, 75], [345, 215], [75, 215]], ticks: [1, 2, 1, 2], arrows: [1, 2, 1, 2], right: true, diag: 'eq',
    facts: ['Opposite sides equal', '4 right angles', '2 pairs of parallel sides', 'Diagonals equal and bisect each other', '2 lines of symmetry, rotational symmetry order 2'] },
  parallelogram: { name: 'Parallelogram', pts: [[120, 75], [360, 75], [300, 215], [60, 215]], ticks: [1, 2, 1, 2], arrows: [1, 2, 1, 2], opp: true,
    facts: ['Opposite sides equal and parallel', 'Opposite angles equal', 'Angles next to each other add up to 180°', 'Diagonals bisect each other', 'No lines of symmetry, rotational symmetry order 2'] },
  rhombus: { name: 'Rhombus', pts: [[210, 60], [345, 145], [210, 230], [75, 145]], ticks: [1, 1, 1, 1], arrows: [1, 2, 1, 2], opp: true, diag: 'perp',
    facts: ['4 equal sides', 'Opposite sides parallel', 'Opposite angles equal', 'Diagonals bisect each other at 90°', '2 lines of symmetry, rotational symmetry order 2'] },
  kite: { name: 'Kite', pts: [[210, 45], [295, 115], [210, 255], [125, 115]], ticks: [1, 2, 2, 1], arrows: [0, 0, 0, 0], kite: true, diag: 'perp',
    facts: ['2 pairs of equal sides next to each other', '1 pair of equal opposite angles', 'Diagonals cross at 90°', '1 line of symmetry', 'No rotational symmetry (order 1)'] },
  trapezium: { name: 'Trapezium', pts: [[150, 80], [300, 80], [365, 215], [55, 215]], ticks: [0, 0, 0, 0], arrows: [1, 0, 1, 0],
    facts: ['Exactly 1 pair of parallel sides', 'Angles between the parallel sides add up to 180° (co-interior)', 'An isosceles trapezium has 1 line of symmetry'] },
};
FD.drawQuad = (k, extra = '') => {
  const G = FD.G, q = FD.QUADS[k], P = q.pts;
  let s = G.poly(P);
  if (q.diag) s += G.line(P[0], P[2], 'g-dash') + G.line(P[1], P[3], 'g-dash');
  P.forEach((p, i) => {
    const n = P[(i + 1) % 4], pv = P[(i + 3) % 4];
    if (q.ticks[i]) s += G.ticks(p, n, q.ticks[i]);
    // sides 2 and 3 run backwards round the shape, so flip them to make parallel arrows point the same way
    if (q.arrows[i]) s += i < 2 ? G.arrows(G.lerp(p, n, 0.15), G.lerp(p, n, 0.55), q.arrows[i]) : G.arrows(G.lerp(n, p, 0.15), G.lerp(n, p, 0.55), q.arrows[i]);
    if (q.right) s += G.right(p, n, pv, 14);
    else if (q.opp) s += G.arc(p, n, pv, 22, '', i % 2 ? 'g-arc2' : 'g-arc');
    else if (q.kite && i % 2) s += G.arc(p, n, pv, 22, '', 'g-arc');
  });
  return s + extra;
};

FD.add({
  id: 'quads',
  title: 'Properties of quadrilaterals',
  tab: 'Quadrilaterals',
  icon: 'shapes',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Quadrilateral', 'A polygon with 4 straight sides.'],
    ['Parallel', 'Always the same distance apart; marked with matching arrows.'],
    ['Diagonal', 'A line joining two corners that are not next to each other.'],
    ['Bisect', 'Cut into two equal parts.'],
  ],
  mount(el) {
    const a = FD.stage(el, {
      vb: '0 0 420 280', label: 'A special quadrilateral with its properties marked',
      side: '<ul class="facts" id="facts"></ul>',
      ctrls: `<div class="row"><label>Shape <select id="sh">${Object.entries(FD.QUADS).map(([k, q]) => `<option value="${k}">${q.name}</option>`).join('')}</select></label></div>`,
    });
    a.show = (k, upto = 9) => {
      const q = FD.QUADS[k];
      a.draw(FD.drawQuad(k));
      a.q('.mbig').innerHTML = `<b>${q.name}</b>`;
      a.q('#facts').innerHTML = q.facts.map((f, i) => `<li class="${i < upto ? 'on' : ''}">${f}</li>`).join('');
    };
    a.onSync(() => a.show(a.q('#sh').value));
    a.show('square');
    return a;
  },
  steps: [
    {
      title: 'How properties are marked',
      text: '<p>Diagrams use symbols: <b>dashes</b> mark equal sides, <b>arrows</b> mark parallel sides and a <b>small square</b> marks a right angle.</p><p>A <b>square</b> has all of them: 4 equal sides, 2 pairs of parallel sides and 4 right angles.</p>',
      async on(a, ctx) { a.off(); for (let i = 1; i <= 5; i++) { a.show('square', i); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Rectangle and parallelogram',
      text: '<p>A <b>rectangle</b> keeps the right angles, but only <b>opposite</b> sides are equal.</p><p>Push it over and you get a <b>parallelogram</b>: opposite sides are still equal and parallel, and <b>opposite angles</b> are equal.</p>',
      async on(a, ctx) { a.off(); for (const k of ['rectangle', 'parallelogram']) { for (let i = 1; i <= 5; i++) { a.show(k, i); if (!(await ctx.sleep(700))) return; } } },
    },
    {
      title: 'Rhombus and kite',
      text: '<p>A <b>rhombus</b> is a parallelogram with <b>4 equal sides</b> (a pushed-over square). Its diagonals cross at right angles.</p><p>A <b>kite</b> has two pairs of equal sides <b>next to each other</b> and one line of symmetry.</p>',
      async on(a, ctx) { a.off(); for (const k of ['rhombus', 'kite']) { for (let i = 1; i <= 5; i++) { a.show(k, i); if (!(await ctx.sleep(700))) return; } } },
    },
    {
      title: 'Trapezium',
      text: '<p>A <b>trapezium</b> has exactly <b>one pair of parallel sides</b>.</p><p>The two angles between the parallel sides on each slanted side are co-interior, so they add up to \\(180^\\circ\\).</p>',
      tip: 'A square is a special rectangle AND a special rhombus. Every square is a parallelogram too.',
      async on(a, ctx) { a.off(); for (let i = 1; i <= 3; i++) { a.show('trapezium', i); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Try it: compare the shapes',
      text: '<p>Choose a shape from the list. Read its properties and look at how each one is marked on the diagram.</p>',
      tip: 'Which shapes have diagonals that cross at 90°?',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'quads',
  gens: [
    () => FD.pick([
      { type: 'mcq', q: 'Which quadrilateral has exactly one pair of parallel sides?', opts: ['Trapezium', 'Parallelogram', 'Rhombus', 'Kite'], why: 'A trapezium has exactly one pair of parallel sides.' },
      { type: 'mcq', q: 'Which quadrilateral has 4 equal sides but no right angles?', opts: ['Rhombus', 'Square', 'Rectangle', 'Kite'], why: 'A rhombus has 4 equal sides; its angles are not right angles (unless it is a square).' },
      { type: 'mcq', q: 'Which quadrilateral has two pairs of equal sides next to each other?', opts: ['Kite', 'Parallelogram', 'Rectangle', 'Trapezium'], why: 'In a kite the equal sides are next to each other (adjacent).' },
      { type: 'mcq', q: 'Which quadrilateral has 4 right angles but sides that are not all equal?', opts: ['Rectangle', 'Square', 'Rhombus', 'Parallelogram'], why: 'A rectangle has 4 right angles and opposite sides equal.' },
      { type: 'mcq', q: 'Which of these has diagonals that are equal in length but do NOT cross at 90°?', opts: ['Rectangle (not a square)', 'Rhombus', 'Kite', 'Square'], why: 'A rectangle’s diagonals are equal and bisect each other, but only a square’s cross at 90°.' },
    ]),
    () => FD.pick([
      { type: 'tf', q: 'Every square is a rhombus.', a: true, why: 'A square has 4 equal sides and opposite sides parallel, so it is a special rhombus.' },
      { type: 'tf', q: 'Every rectangle is a square.', a: false, why: 'A rectangle only needs opposite sides equal. A square is a special rectangle, not the other way round.' },
      { type: 'tf', q: 'A parallelogram has rotational symmetry of order 2.', a: true, why: 'Turn it half a turn (180°) and it fits onto itself.' },
      { type: 'tf', q: 'A kite has two pairs of parallel sides.', a: false, why: 'A kite usually has no parallel sides.' },
      { type: 'tf', q: 'The diagonals of a rhombus cross at right angles.', a: true, why: 'Rhombus diagonals bisect each other at 90°.' },
    ]),
    () => { const p = FD.rnd(3, 15) * 2, s = FD.rnd(2, 12); return { type: 'num', q: `A rhombus has a perimeter of \\(${4 * s}\\) cm. How long is one side?`, a: s, unit: 'cm', why: `All 4 sides of a rhombus are equal: \\(${4 * s} \\div 4 = ${s}\\) cm.` }; },
  ],
});

FD.check({
  section: 'quads',
  items: [
    { type: 'mcq', q: 'Arrows on two sides of a shape show that the sides are…', opts: ['parallel', 'equal', 'perpendicular', 'diagonals'], why: 'Matching arrows mark parallel lines; dashes mark equal lengths.' },
    { type: 'multi', q: 'Choose the <b>two</b> shapes whose diagonals always cross at right angles.', need: 2, opts: [['Rhombus', true], ['Kite', true], ['Rectangle', false], ['Parallelogram', false]], why: 'Rhombus and kite (and square). A rectangle’s or parallelogram’s diagonals do not cross at 90° in general.' },
    { type: 'mcq', q: 'A quadrilateral has opposite sides equal and parallel, and no right angles. Its sides are not all equal. It is a…', opts: ['parallelogram', 'rhombus', 'rectangle', 'kite'], why: 'Parallelogram. A rhombus would need 4 equal sides.' },
    { type: 'tf', q: 'A trapezium can have two right angles.', a: true, why: 'A right-angled trapezium has two right angles next to each other.' },
  ],
});
