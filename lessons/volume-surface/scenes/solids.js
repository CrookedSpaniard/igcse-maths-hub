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

// Path data for an arc of a circle (centre c, radius r) from angle a1 to a2 (degrees, anticlockwise as seen when a2 > a1).
FD.arcD = (c, r, a1, a2) => { const p = FD.G.polar(c, r, a1), q = FD.G.polar(c, r, a2), big = Math.abs(a2 - a1) > 180 ? 1 : 0; return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 ${big} ${a2 > a1 ? 0 : 1} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };

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

// 3D solids: names, faces, edges and vertices. Flat-faced solids are drawn in oblique projection.

// Draws a solid from 3D vertices [x, y, z] (y goes back into the page). E: [i, j, hidden]; faces: [[indices], class]
// are filled under the edges. The drawing is scaled to fit box [x, y, w, h]. Returns the svg, the projection P and the scale k.
FD.d3 = (V, E, o = {}) => {
  const G = FD.G, box = o.box || [70, 30, 280, 240], q = ([x, y, z]) => [x + 0.383 * y, z + 0.321 * y];
  const Q = V.concat(o.fit || []).map(q), xs = Q.map((p) => p[0]), ys = Q.map((p) => p[1]);
  const mx = Math.min(...xs), Mx = Math.max(...xs), my = Math.min(...ys), My = Math.max(...ys);
  const k = Math.min(box[2] / (Mx - mx || 1), box[3] / (My - my || 1));
  const x0 = box[0] + (box[2] - (Mx - mx) * k) / 2 - mx * k, yb = box[1] + (box[3] + (My - my) * k) / 2 + my * k;
  const P = (v) => { const [a, b] = q(v); return [x0 + a * k, yb - b * k]; };
  let s = (o.faces || []).map(([f, c]) => G.poly(f.map((i) => P(V[i])), c || 'g-fill').replace('<polygon', '<polygon style="stroke:none"')).join('');
  s += E.map(([i, j, h]) => G.line(P(V[i]), P(V[j]), h ? 'g-dash' : 'g-ln')).join('');
  return { s, P, k };
};
FD.cubV = (l, w, h) => [[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0], [0, 0, h], [l, 0, h], [l, w, h], [0, w, h]];
FD.cubE = [[0, 1], [1, 2], [2, 3, 1], [3, 0, 1], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7, 1]];
FD.cubF = [[[0, 1, 5, 4], 'g-fill'], [[4, 5, 6, 7], 'g-fill2'], [[1, 2, 6, 5], 'g-arc3']];
// Triangular prism: triangle (base b, height t) at the front, length L going back.
FD.triV = (b, t, L) => [[0, 0, 0], [b, 0, 0], [b / 2, 0, t], [0, L, 0], [b, L, 0], [b / 2, L, t]];
FD.triE = [[0, 1], [1, 2], [2, 0], [3, 4, 1], [4, 5], [5, 3, 1], [0, 3, 1], [1, 4], [2, 5]];
FD.triF = [[[0, 1, 2], 'g-fill2'], [[1, 4, 5, 2], 'g-fill']];
// Upright curved solids drawn front-on: c centre of the base, r radius, h height (SVG units).
FD.cyl = (c, r, h, top = 'g-fill2') => {
  const ry = r * 0.28, [x, y] = c;
  return `<path class="g-fill" style="stroke:none" d="M${x - r} ${y} L${x - r} ${y - h} L${x + r} ${y - h} L${x + r} ${y} A${r} ${ry} 0 0 1 ${x - r} ${y} Z"/>`
    + `<path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/><path class="g-ln" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 0 ${x + r} ${y}"/>`
    + FD.G.line([x - r, y], [x - r, y - h]) + FD.G.line([x + r, y], [x + r, y - h]) + `<ellipse class="${top}" cx="${x}" cy="${y - h}" rx="${r}" ry="${ry}"/>`;
};
FD.cone = (c, r, h) => {
  const ry = r * 0.28, [x, y] = c;
  return `<path class="g-fill" d="M${x - r} ${y} L${x} ${y - h} L${x + r} ${y} A${r} ${ry} 0 0 1 ${x - r} ${y} Z"/><path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/>`;
};
FD.sph = (c, r) => {
  const [x, y] = c, ry = r * 0.28;
  return FD.G.circ(c, r, 'g-fill') + `<path class="g-dash" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 1 ${x + r} ${y}"/><path class="g-ln" style="fill:none" d="M${x - r} ${y} A${r} ${ry} 0 0 0 ${x + r} ${y}"/>`;
};

FD.SOLIDS = [
  { name: 'Cube', F: 6, E: 12, V: 8, d: () => FD.d3(FD.cubV(4, 4, 4), FD.cubE, { faces: FD.cubF }).s },
  { name: 'Cuboid', F: 6, E: 12, V: 8, d: () => FD.d3(FD.cubV(6, 3, 3.5), FD.cubE, { faces: FD.cubF }).s },
  { name: 'Triangular prism', F: 5, E: 9, V: 6, d: () => FD.d3(FD.triV(4, 3, 6), FD.triE, { faces: FD.triF }).s },
  { name: 'Square-based pyramid', F: 5, E: 8, V: 5, d: () => FD.d3([[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0], [2, 2, 4]], [[0, 1], [1, 2], [2, 3, 1], [3, 0, 1], [0, 4], [1, 4], [2, 4], [3, 4, 1]], { faces: [[[0, 1, 4], 'g-fill2'], [[1, 2, 4], 'g-fill']] }).s },
  { name: 'Triangular-based pyramid (tetrahedron)', F: 4, E: 6, V: 4, d: () => FD.d3([[0, 0, 0], [4, 0, 0], [2, 3.46, 0], [2, 1.15, 3.3]], [[0, 1], [1, 2, 1], [2, 0, 1], [0, 3], [1, 3], [2, 3, 1]], { faces: [[[0, 1, 3], 'g-fill2']] }).s },
  { name: 'Cylinder', F: 3, E: 2, V: 0, curved: true, d: () => FD.cyl([180, 235], 75, 170) },
  { name: 'Cone', F: 2, E: 1, V: 1, curved: true, d: () => FD.cone([180, 230], 85, 190) },
  { name: 'Sphere', F: 1, E: 0, V: 0, curved: true, d: () => FD.sph([180, 145], 105) },
];

FD.add({
  id: 'solids',
  title: 'Naming solids: faces, edges and vertices',
  tab: '3D solids',
  icon: 'shapes',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Face', 'A flat (or curved) surface of a solid.'],
    ['Edge', 'A line where two faces meet.'],
    ['Vertex', 'A corner, where edges meet. The plural is <b>vertices</b>.'],
    ['Prism', 'A solid with the same cross-section all the way through.'],
    ['Pyramid', 'A solid with a flat base and triangular faces that meet at one vertex (the apex).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A 3D solid drawn with its hidden edges dashed',
      ctrls: `<label class="ctrl">Solid <select id="so">${FD.SOLIDS.map((s, i) => `<option value="${i}">${s.name}</option>`).join('')}</select></label>`,
    });
    a.show = (i, extra = '') => { a.draw(FD.SOLIDS[i].d() + extra); const s = FD.SOLIDS[i]; a.big(`F = ${s.F},\\ E = ${s.E},\\ V = ${s.V}`); };
    // The cube with one face, one edge and one vertex picked out.
    a.parts = () => {
      const r = FD.d3(FD.cubV(4, 4, 4), FD.cubE, { faces: [[[0, 1, 5, 4], 'g-fill'], [[4, 5, 6, 7], 'g-fill2'], [[1, 2, 6, 5], 'g-fill']] }), P = (v) => r.P(v);
      a.draw(r.s + G.line(P([4, 0, 0]), P([4, 0, 4]), 'g-hl') + G.dot(P([4, 4, 4]), 'g-dot', 7)
        + G.t(G.mid(P([0, 0, 4]), P([4, 4, 4])), 'face', 'l') + G.t([P([4, 0, 2])[0] - 10, P([4, 0, 2])[1]], 'edge', 'l en') + G.t([P([4, 4, 4])[0] + 12, P([4, 4, 4])[1] - 6], 'vertex', 'l st'));
      a.big('F = 6,\\ E = 12,\\ V = 8');
    };
    a.onSync(() => {
      const i = a.val('so'), s = FD.SOLIDS[i];
      a.show(i);
      a.msg(s.curved ? `${s.name}: count curved surfaces as faces too.` : `Check: \\(F + V - E = ${s.F} + ${s.V} - ${s.E} = 2\\)`);
    });
    a.parts();
    return a;
  },
  steps: [
    {
      title: 'Faces, edges and vertices',
      text: '<p>A <b>cube</b> has 6 square <b>faces</b>. Two faces meet at an <b>edge</b>. Edges meet at a corner, called a <b>vertex</b>.</p><p>Hidden edges at the back are drawn <b>dashed</b>.</p>',
      on(a) { a.off(); a.parts(); },
    },
    {
      title: 'Prisms',
      text: '<p>A <b>prism</b> has the same <b>cross-section</b> all the way through. It is named after that shape.</p><p>A <b>triangular prism</b> has two triangular ends and three rectangular faces. A cuboid is a prism with a rectangle as its cross-section.</p>',
      on(a) { a.off(); a.show(2); },
    },
    {
      title: 'Pyramids',
      text: '<p>A <b>pyramid</b> has a base, and triangular faces that meet at the top vertex, the <b>apex</b>.</p><p>It is named after its base: this is a <b>square-based pyramid</b>.</p>',
      on(a) { a.off(); a.show(3); },
    },
    {
      title: 'Curved surfaces',
      text: '<p>A <b>cylinder</b> has 2 flat circular faces and 1 curved face. A <b>cone</b> has 1 flat face, 1 curved face and 1 vertex (its apex). A <b>sphere</b> has just one curved face.</p>',
      async on(a, ctx) { a.off(); for (const i of [5, 6, 7]) { a.show(i); if (!(await ctx.sleep(1600))) return; } },
    },
    {
      title: 'A useful check',
      text: '<p>For any solid with flat faces and straight edges:</p><p class="mbig">\\(F + V - E = 2\\)</p><p>Cube: \\(6 + 8 - 12 = 2\\).</p>',
      tip: 'This is Euler’s formula. Use it to check your counting.',
      on(a) { a.off(); a.show(0); a.msg('\\(6 + 8 - 12 = 2\\) ✓'); },
    },
    {
      title: 'Try it: choose a solid',
      text: '<p>Choose each solid in turn. Count its faces, edges and vertices before you look at the answer.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'solids',
  gens: [
    () => {
      const D = [['two identical triangular ends joined by three rectangles', 'Triangular prism'], ['six square faces', 'Cube'], ['a square base and four triangular faces meeting at a point', 'Square-based pyramid'], ['two circular faces and one curved face', 'Cylinder'], ['one circular face, one curved face and one vertex', 'Cone'], ['one curved face and no edges', 'Sphere'], ['four triangular faces', 'Triangular-based pyramid'], ['six rectangular faces, not all squares', 'Cuboid']];
      const [d, n] = FD.pick(D), others = D.map((x) => x[1]).filter((x) => x !== n).sort(() => Math.random() - 0.5).slice(0, 3);
      return { type: 'mcq', q: `A solid has ${d}. What is it called?`, opts: [n, ...others], why: `It is a ${n.toLowerCase()}.` };
    },
    () => {
      const n = FD.rnd(3, 8), names = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' }, pr = FD.pick([true, false]), what = FD.pick(['faces', 'edges', 'vertices']);
      const v = pr ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
      return { type: 'num', q: `How many ${what} does a ${pr ? 'prism' : 'pyramid'} have if its ${pr ? 'cross-section' : 'base'} is a ${names[n]}?`, a: v, why: pr ? `Two ${names[n]} ends and ${n} rectangles: ${n + 2} faces, ${3 * n} edges (${n} + ${n} + ${n}), ${2 * n} vertices.` : `A ${names[n]} base and ${n} triangles: ${n + 1} faces, ${2 * n} edges, ${n + 1} vertices (including the apex).` };
    },
    () => { const n = FD.rnd(3, 10), F = n + 2, V = 2 * n; return { type: 'num', q: `A solid with flat faces has \\(${F}\\) faces and \\(${V}\\) vertices. Use \\(F + V - E = 2\\) to work out how many edges it has.`, a: F + V - 2, why: `\\(E = F + V - 2 = ${F} + ${V} - 2 = ${F + V - 2}\\).` }; },
  ],
});

FD.check({
  section: 'solids',
  items: [
    { type: 'num', q: 'How many edges does a cuboid have?', a: 12, why: '4 on top, 4 on the bottom and 4 going up.' },
    { type: 'num', q: 'How many vertices does a square-based pyramid have?', a: 5, why: '4 on the base and the apex.' },
    { type: 'mcq', q: 'A solid with the same cross-section all the way through is a…', opts: ['prism', 'pyramid', 'sphere', 'cone'], why: 'That is what a prism is.' },
    { type: 'tf', q: 'A triangular prism has 6 faces.', a: false, why: '2 triangles + 3 rectangles = 5 faces.' },
  ],
});
