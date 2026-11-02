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

// Similar shapes: every length is multiplied by the same scale factor k; the angles do not change.

// Draws triangle pts (maths coordinates, cm, anticlockwise) at origin o with u px per cm, enlarged by k.
// sides: labels for sides 0-1, 1-2, 2-0; angs: labels at corners 0, 1, 2 ('' for none).
FD.simTri = (pts, o, u, k, sides = [], angs = [], cls = 'g-fill') => {
  const G = FD.G, P = pts.map(([x, y]) => [o[0] + x * u * k, o[1] - y * u * k]);
  let s = G.poly(P, cls);
  P.forEach((A, i) => {
    const B = P[(i + 1) % 3], C = P[(i + 2) % 3];
    if (sides[i]) { const d = G.dist(A, B), n = [(B[1] - A[1]) / d, -(B[0] - A[0]) / d], m = G.mid(A, B); s += G.t([m[0] - n[0] * 13, m[1] - n[1] * 13], sides[i], 's'); }
    if (angs[i]) s += G.arc(A, B, C, 13, angs[i], 'g-arc', 27);
  });
  return s;
};
// The triangle used in this lesson: sides 6, 5 and 4 cm (angles 41°, 83°, 56°).
FD.T456 = [[0, 0], [6, 0], [2.25, 3.307]];

FD.add({
  id: 'similar',
  title: 'Similar shapes and scale factors',
  tab: 'Similar shapes',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Similar', 'Two shapes are similar if one is an enlargement of the other: all corresponding lengths are in the same ratio, and corresponding angles are equal.'],
    ['Scale factor', '\\(k = \\dfrac{\\text{new length}}{\\text{original length}}\\), the number every length is multiplied by.'],
    ['Corresponding', 'In the same position on both shapes.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A triangle and an enlargement of it',
      ctrls: `<label class="ctrl">Scale factor \\(k\\) <input type="range" id="k" min="1" max="2.5" step="0.5" value="2"><output id="ok">2</output></label>`,
    });
    const ang = ['56°', '41°', '83°'];
    a.pair = (k, sidesB, angsB = ang) => {
      a.draw(FD.simTri(FD.T456, [15, 270], 18, 1, ['6', '5', '4'], ['', '', ''], 'g-fill') + G.t([64.5, 250], 'A', 'l')
        + FD.simTri(FD.T456, [140, 270], 18, k, sidesB, angsB, 'g-fill2') + G.t([140 + 49.5 * k, 270 - 19.8 * k], 'B', 'l'));
    };
    a.rects = () => {
      const r = (x, y, w, h, c) => G.poly([[x, y], [x + w, y], [x + w, y - h], [x, y - h]], c);
      a.draw(r(40, 250, 80, 40, 'g-fill') + G.t([80, 266], '4 cm', 's') + G.t([30, 230], '2 cm', 's en') + r(190, 250, 200, 120, 'g-fill2') + G.t([290, 266], '10 cm', 's') + G.t([180, 190], '6 cm', 's en'));
    };
    a.onSync(() => {
      const k = a.val('k');
      a.out('k', FD.num(k));
      a.pair(k, [6 * k, 5 * k, 4 * k].map((v) => FD.num(v)));
      a.big(`k = \\frac{${FD.num(6 * k)}}{6} = \\frac{${FD.num(5 * k)}}{5} = \\frac{${FD.num(4 * k)}}{4} = ${FD.num(k)}`);
      a.msg('The angles never change.');
    });
    a.pair(2, ['12', '10', '8']);
    return a;
  },
  steps: [
    {
      title: 'What similar means',
      text: '<p>Triangle B is an <b>enlargement</b> of triangle A. Every side has been doubled, but the <b>angles are the same</b>.</p><p>A and B are <b>similar</b>.</p>',
      on(a) { a.off(); a.pair(2, ['12', '10', '8']); a.big('6 \\to 12,\\ 5 \\to 10,\\ 4 \\to 8'); },
    },
    {
      title: 'The scale factor',
      text: '<p>Divide a length on the new shape by the <b>corresponding</b> length on the original.</p><p class="mbig">\\(k = \\dfrac{\\text{new}}{\\text{original}}\\)</p>',
      async on(a, ctx) { a.off(); a.pair(2, ['12', '10', '8']); await a.play(ctx, [['k = \\frac{12}{6} = 2', ''], ['\\frac{10}{5} = 2,\\ \\frac{8}{4} = 2', 'the same for every pair']]); },
    },
    {
      title: 'Finding a missing length',
      text: '<p>B is similar to A. Its longest side is 9 cm. How long is the side that matches the 4 cm side?</p>',
      tip: 'Match sides by their position: longest with longest, shortest with shortest.',
      async on(a, ctx) { a.off(); a.pair(1.5, ['9', '', '?']); await a.play(ctx, [['k = \\frac{9}{6} = 1.5', 'longest sides'], ['4 \\times 1.5 = 6\\ \\text{cm}', 'multiply to get the bigger shape']]); },
    },
    {
      title: 'Are they similar?',
      text: '<p>A 4 cm by 2 cm rectangle and a 10 cm by 6 cm rectangle. All the angles are 90°, but is every length multiplied by the same number?</p>',
      async on(a, ctx) { a.off(); a.rects(); await a.play(ctx, [['\\frac{10}{4} = 2.5', 'lengths'], ['\\frac{6}{2} = 3', 'widths'], ['2.5 \\ne 3:\\ \\text{not similar}', '']]); },
    },
    {
      title: 'Try it: change the scale factor',
      text: '<p>Change \\(k\\). Every side is multiplied by \\(k\\), and the angles stay the same.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'similar',
  gens: [
    () => { const k = FD.pick([1.5, 2, 2.5, 3, 4]), p = FD.rnd(2, 10), q = FD.rnd(2, 12); return { type: 'num', q: `Shapes A and B are similar. A side of \\(${p}\\) cm on A matches a side of \\(${FD.tn(p * k)}\\) cm on B. Another side of A is \\(${q}\\) cm. Work out the length of the corresponding side on B.`, a: q * k, unit: 'cm', why: `\\(k = ${FD.tn(p * k)} \\div ${p} = ${FD.tn(k)}\\). \\(${q} \\times ${FD.tn(k)} = ${FD.tn(q * k)}\\) cm.` }; },
    () => { const k = FD.pick([2, 2.5, 3, 4, 5]), p = FD.rnd(2, 10), q = FD.rnd(2, 12); return { type: 'num', q: `Shape B is an enlargement of shape A. A side of \\(${p}\\) cm on A becomes \\(${FD.tn(p * k)}\\) cm on B. A side on B is \\(${FD.tn(q * k)}\\) cm. Work out the corresponding side on A.`, a: q, unit: 'cm', why: `\\(k = ${FD.tn(k)}\\). Going back to A, divide: \\(${FD.tn(q * k)} \\div ${FD.tn(k)} = ${q}\\) cm.` }; },
    () => { const x = FD.rnd(25, 130), k = FD.pick([2, 3, 0.5, 1.5]); return { type: 'num', q: `Shape B is similar to shape A, with scale factor \\(${FD.tn(k)}\\). An angle in A is \\(${x}^\\circ\\). What is the corresponding angle in B?`, a: x, unit: '°', why: 'Angles do not change in similar shapes.' }; },
    () => { const w = FD.rnd(2, 6), l = w + FD.rnd(1, 5), k = FD.pick([1.5, 2, 3]), sim = FD.pick([true, false]), L = l * k, W = sim ? w * k : w * k + 1; return { type: 'mcq', q: `A rectangle is \\(${l}\\) cm by \\(${w}\\) cm. Another is \\(${FD.tn(L)}\\) cm by \\(${FD.tn(W)}\\) cm. Are they similar?`, opts: sim ? ['Yes: both sides are multiplied by the same number', 'No: the sides are multiplied by different numbers'] : ['No: the sides are multiplied by different numbers', 'Yes: both sides are multiplied by the same number'], why: `\\(${FD.tn(L)} \\div ${l} = ${FD.tn(k)}\\) and \\(${FD.tn(W)} \\div ${w} = ${FD.tn(FD.round(W / w, 3))}\\).` }; },
  ],
});

FD.check({
  section: 'similar',
  items: [
    { type: 'num', q: 'A 3 cm side becomes 12 cm in a similar shape. What is the scale factor?', a: 4, why: '\\(12 \\div 3\\).' },
    { type: 'num', q: 'Two shapes are similar with scale factor 2.5. A side of 6 cm on the small shape matches a side of… on the large shape.', a: 15, unit: 'cm', why: '\\(6 \\times 2.5\\).' },
    { type: 'mcq', q: 'In similar shapes, corresponding angles are…', opts: ['equal', 'multiplied by \\(k\\)', 'multiplied by \\(k^2\\)', 'halved'], why: 'Enlargement keeps the angles.' },
    { type: 'tf', q: 'All squares are similar to each other.', a: true, why: 'Every side has the same scale factor and all angles are 90°.' },
  ],
});
