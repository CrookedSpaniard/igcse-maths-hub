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

// Shape library with their symmetry, plus reflect/rotate helpers. Centre of every shape: C = (210, 150).
FD.SYM = (() => {
  const C = [210, 150], G = FD.G, ng = (n, r = 105, off = 90) => Array.from({ length: n }, (_, i) => G.polar(C, r, off + (360 * i) / n));
  const S = {
    eqtri: { name: 'Equilateral triangle', pts: ng(3, 115), lines: [90, 30, 150], order: 3 },
    isotri: { name: 'Isosceles triangle', pts: [[210, 40], [280, 250], [140, 250]], lines: [90], order: 1 },
    scalene: { name: 'Scalene triangle', pts: [[150, 50], [320, 230], [90, 210]], lines: [], order: 1 },
    square: { name: 'Square', pts: ng(4, 115, 45), lines: [0, 45, 90, 135], order: 4 },
    rectangle: { name: 'Rectangle', pts: [[80, 90], [340, 90], [340, 210], [80, 210]], lines: [0, 90], order: 2 },
    parallelogram: { name: 'Parallelogram', pts: [[125, 90], [355, 90], [295, 210], [65, 210]], lines: [], order: 2 },
    rhombus: { name: 'Rhombus', pts: [[210, 45], [330, 150], [210, 255], [90, 150]], lines: [0, 90], order: 2 },
    kite: { name: 'Kite', pts: [[210, 45], [290, 115], [210, 255], [130, 115]], lines: [90], order: 1 },
    trapezium: { name: 'Isosceles trapezium', pts: [[150, 90], [270, 90], [330, 210], [90, 210]], lines: [90], order: 1 },
    pentagon: { name: 'Regular pentagon', pts: ng(5, 112), lines: [90, 126, 162, 18, 54], order: 5 },
    hexagon: { name: 'Regular hexagon', pts: ng(6, 112), lines: [0, 30, 60, 90, 120, 150], order: 6 },
  };
  // Reflect p in the line through C at angle th (degrees, measured anticlockwise from the x-axis as seen).
  const reflect = (p, th) => { const u = [Math.cos((th * Math.PI) / 180), -Math.sin((th * Math.PI) / 180)], d = [p[0] - C[0], p[1] - C[1]], k = 2 * (d[0] * u[0] + d[1] * u[1]); return [C[0] + k * u[0] - d[0], C[1] + k * u[1] - d[1]]; };
  // Rotate p about C by phi degrees anticlockwise (as seen).
  const rotate = (p, phi) => { const c = Math.cos((phi * Math.PI) / 180), s = Math.sin((phi * Math.PI) / 180), dx = p[0] - C[0], dy = p[1] - C[1]; return [C[0] + dx * c + dy * s, C[1] - dx * s + dy * c]; };
  const same = (A, B) => A.every((p) => B.some((q) => G.dist(p, q) < 1.5));
  const mirror = (th, c = 'g-hl2', len = 150) => G.line(G.polar(C, len, th), G.polar(C, len, th + 180), c) ;
  return { C, S, reflect, rotate, same, mirror };
})();

FD.add({
  id: 'line',
  title: 'Line symmetry',
  tab: 'Line symmetry',
  icon: 'shapes',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Line of symmetry', 'A mirror line: fold the shape along it and the two halves match exactly.'],
    ['Mirror line', 'Another name for a line of symmetry.'],
  ],
  mount(el) {
    const G = FD.G, Y = FD.SYM;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A shape being folded along a mirror line',
      ctrls: `<div class="row"><label>Shape <select id="sh">${Object.entries(Y.S).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('')}</select></label></div>
        <label class="ctrl">Mirror line angle <input type="range" id="th" min="0" max="175" step="1" value="90"><output id="oth">90°</output></label>
        <div class="chk-btns"><button class="btn" id="fold">Fold along this line</button><button class="btn ghost" id="all">Show every line of symmetry</button></div>`,
    });
    let key = 'rectangle';
    a.base = (k, extra = '') => { key = k; a.draw(G.poly(Y.S[k].pts) + extra); };
    // Animate the fold: the shape's mirror image travels across the line onto (or not onto) the shape.
    a.fold = async (k, th, ctx) => {
      const P = Y.S[k].pts, R = P.map((p) => Y.reflect(p, th)), ok = Y.same(R, P);
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps, Q = P.map((p, j) => G.lerp(p, R[j], t));
        a.draw(G.poly(P) + `<polygon class="g-ghost" points="${Q.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>` + Y.mirror(th));
        if (ctx) { if (!(await ctx.sleep(35))) return null; } else await FD.wait(35);
      }
      a.draw(G.poly(P) + `<polygon class="g-ghost" points="${R.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>` + Y.mirror(th, ok ? 'g-hl' : 'g-hl2'));
      return ok;
    };
    a.all = (k) => { const s = Y.S[k]; a.base(k, s.lines.map((t) => Y.mirror(t, 'g-hl')).join('')); return s.lines.length; };
    a.onSync(() => { const th = a.val('th'); a.out('th', th + '°'); a.base(a.q('#sh').value, Y.mirror(th, 'g-dash')); a.msg(''); });
    a.q('#fold').addEventListener('click', async () => { const ok = await a.fold(a.q('#sh').value, a.val('th')); a.msg(ok ? '✓ The halves match: this is a line of symmetry.' : '✗ The folded half does not fit: not a line of symmetry.', ok ? 'good' : 'bad'); });
    a.q('#all').addEventListener('click', () => { const n = a.all(a.q('#sh').value); a.msg(`${Y.S[a.q('#sh').value].name}: <b>${n}</b> line${n === 1 ? '' : 's'} of symmetry.`); });
    a.base('rectangle');
    return a;
  },
  steps: [
    {
      title: 'Fold it in half',
      text: '<p>A <b>line of symmetry</b> splits a shape into two halves that are <b>mirror images</b>.</p><p>If you fold the shape along the line, one half fits exactly on top of the other.</p>',
      async on(a, ctx) { a.off(); a.base('rectangle'); if (!(await ctx.sleep(600))) return; if ((await a.fold('rectangle', 90, ctx)) === null) return; a.msg('✓ The halves match.'); },
    },
    {
      title: 'Not every line works',
      text: '<p>A rectangle has <b>2</b> lines of symmetry. The <b>diagonal is not</b> a line of symmetry: fold along it and the corners do not meet.</p>',
      tip: 'This is a very common exam mistake: a rectangle’s diagonals are NOT lines of symmetry.',
      async on(a, ctx) {
        a.off();
        if ((await a.fold('rectangle', 0, ctx)) === null) return; a.msg('✓ Horizontal line: the halves match.');
        if (!(await ctx.sleep(900))) return;
        const d = Math.atan2(60, 130) * 180 / Math.PI;
        if ((await a.fold('rectangle', d, ctx)) === null) return; a.msg('✗ Diagonal: the folded half does not fit.', 'bad');
      },
    },
    {
      title: 'Triangles and quadrilaterals',
      text: '<p>Equilateral triangle: <b>3</b>. Isosceles triangle: <b>1</b>. Square: <b>4</b>. Rhombus: <b>2</b>. Kite and isosceles trapezium: <b>1</b>. Parallelogram: <b>0</b>.</p>',
      async on(a, ctx) {
        a.off();
        for (const k of ['eqtri', 'isotri', 'square', 'rhombus', 'kite', 'parallelogram']) { const n = a.all(k); a.msg(`${FD.SYM.S[k].name}: <b>${n}</b> line${n === 1 ? '' : 's'}`); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Regular polygons',
      text: '<p>A <b>regular</b> polygon with \\(n\\) sides has <b>\\(n\\) lines of symmetry</b>.</p><p>When \\(n\\) is odd, each line goes from a corner to the middle of the opposite side. When \\(n\\) is even, they go corner to corner and side to side.</p>',
      async on(a, ctx) { a.off(); for (const k of ['pentagon', 'hexagon']) { const n = a.all(k); a.msg(`${FD.SYM.S[k].name}: <b>${n}</b> lines`); if (!(await ctx.sleep(1500))) return; } },
    },
    {
      title: 'Try it: test a mirror line',
      text: '<p>Choose a shape and turn the dashed line with the slider. Press <b>Fold</b> to test it.</p><p>When you think you have found them all, press <b>Show every line of symmetry</b>.</p>',
      tip: 'For a square, try 45°.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.SYM.facts = [['equilateral triangle', 3, 3], ['isosceles triangle', 1, 1], ['scalene triangle', 0, 1], ['square', 4, 4], ['rectangle', 2, 2], ['parallelogram', 0, 2], ['rhombus', 2, 2], ['kite', 1, 1], ['isosceles trapezium', 1, 1], ['regular pentagon', 5, 5], ['regular hexagon', 6, 6], ['regular octagon', 8, 8]];

FD.practice({
  section: 'line',
  gens: [
    () => { const [n, l] = FD.pick(FD.SYM.facts); return { type: 'num', q: `How many lines of symmetry does a <b>${n}</b> have?`, a: l, why: `A ${n} has ${l} line${l === 1 ? '' : 's'} of symmetry.` }; },
    () => { const n = FD.rnd(5, 12); return { type: 'num', q: `How many lines of symmetry does a <b>regular polygon with ${n} sides</b> have?`, a: n, why: `A regular polygon with \\(n\\) sides has \\(n\\) lines of symmetry: ${n}.` }; },
    () => FD.pick([
      { type: 'mcq', q: 'Which capital letter has exactly <b>two</b> lines of symmetry?', opts: ['H', 'A', 'S', 'E'], why: 'H has a vertical and a horizontal line. A has one (vertical), E has one (horizontal), S has none.' },
      { type: 'mcq', q: 'Which capital letter has <b>no</b> lines of symmetry?', opts: ['Z', 'T', 'M', 'B'], why: 'Z has no mirror lines (it has rotational symmetry of order 2).' },
      { type: 'mcq', q: 'Which shape has exactly one line of symmetry?', opts: ['Kite', 'Rectangle', 'Parallelogram', 'Square'], why: 'A kite has one line of symmetry through the corners between the pairs of equal sides.' },
    ]),
  ],
});

FD.check({
  section: 'line',
  items: [
    { type: 'num', q: 'How many lines of symmetry does a rectangle (not a square) have?', a: 2, why: 'One vertical and one horizontal. The diagonals are not lines of symmetry.' },
    { type: 'tf', q: 'A parallelogram (not a rectangle or rhombus) has no lines of symmetry.', a: true, why: 'Folding along any line leaves the halves mismatched.' },
    { type: 'num', q: 'How many lines of symmetry does a regular octagon have?', a: 8, why: 'Regular \\(n\\)-gon: \\(n\\) lines.' },
    { type: 'mcq', q: 'Which triangle has exactly one line of symmetry?', opts: ['Isosceles', 'Equilateral', 'Scalene', 'Every triangle'], why: 'Isosceles: 1. Equilateral: 3. Scalene: 0.' },
  ],
});
