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

// Circle geometry shared by the scenes: centre, radius and points on the circle by angle.
FD.CT = { C: [200, 150], R: 105 };
FD.CT.P = (deg, r = FD.CT.R) => FD.G.polar(FD.CT.C, r, deg);
// The (smaller) angle at V in whole degrees.
FD.CT.ang = (V, A, B) => Math.round(FD.G.deg(V, A, B));

FD.add({
  id: 'parts',
  title: 'Parts of a circle',
  tab: 'Parts',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Radius', 'A line from the centre to the circle. Plural: radii.'],
    ['Chord', 'A straight line joining two points on the circle. The longest chord is a diameter.'],
    ['Arc', 'Part of the circumference.'],
    ['Sector', 'A “pizza slice”: the region between two radii and an arc.'],
    ['Segment', 'The region between a chord and an arc.'],
    ['Tangent', 'A straight line that touches the circle at exactly one point.'],
  ],
  mount(el) {
    const G = FD.G, { C, R, P } = FD.CT;
    const PARTS = {
      centre: ['Centre', 'The point in the middle, the same distance from every point on the circle.', () => G.dot(C, 'g-dot', 8)],
      radius: ['Radius', 'From the centre to the circle. Every radius of a circle has the same length.', () => G.line(C, P(40), 'g-hl')],
      diameter: ['Diameter', 'A chord through the centre. Diameter = 2 × radius.', () => G.line(P(160), P(340), 'g-hl')],
      circumference: ['Circumference', 'The distance all the way round the circle (its perimeter).', () => G.circ(C, R, 'g-hl')],
      chord: ['Chord', 'A straight line joining two points on the circle.', () => G.line(P(200), P(310), 'g-hl')],
      arc: ['Arc', 'Part of the circumference. The shorter one is the minor arc, the longer one the major arc.', () => `<path class="g-hl" d="${FD.arcD(C, R, 20, 100)}"/>`],
      sector: ['Sector', 'The region between two radii and an arc.', () => G.sector(C, R, 20, 100, 'g-arc') ],
      segment: ['Segment', 'The region between a chord and an arc.', () => { const a = P(200), b = P(310); return `<path class="g-arc" d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}A${R} ${R} 0 0 0 ${b[0].toFixed(1)} ${b[1].toFixed(1)}Z"/>` + G.line(a, b, 'g-hl'); }],
      tangent: ['Tangent', 'A straight line that touches the circle at one point only.', () => { const t = P(135), d = [Math.cos(45 * Math.PI / 180), Math.sin(45 * Math.PI / 180)]; return G.line([t[0] - d[0] * 100, t[1] - d[1] * 100], [t[0] + d[0] * 100, t[1] + d[1] * 100], 'g-hl') + G.dot(t, 'g-dot', 5); }],
    };
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A circle with one part highlighted',
      ctrls: `<div class="row"><label>Show <select id="pt">${Object.entries(PARTS).map(([k, p]) => `<option value="${k}">${p[0]}</option>`).join('')}</select></label></div>`,
    });
    a.show = (k) => {
      const p = PARTS[k];
      a.draw((k === 'sector' || k === 'segment' ? p[2]() : '') + G.circ(C, R) + (k === 'sector' || k === 'segment' ? '' : p[2]()) + (k === 'sector' ? G.line(C, P(20), 'g-hl') + G.line(C, P(100), 'g-hl') + `<path class="g-hl" d="${FD.arcD(C, R, 20, 100)}"/>` : '') + G.dot(C, 'g-dot k', 3.5));
      a.q('.mbig').innerHTML = `<b>${p[0]}</b>`; a.msg(p[1]);
    };
    a.PARTS = PARTS;
    a.onSync(() => a.show(a.q('#pt').value));
    a.show('centre');
    return a;
  },
  steps: [
    {
      title: 'Centre, radius, diameter',
      text: '<p>Every point on a circle is the same distance from the <b>centre</b>. That distance is the <b>radius</b>.</p><p>A <b>diameter</b> goes right across through the centre: it is twice the radius.</p>',
      async on(a, ctx) { a.off(); for (const k of ['centre', 'radius', 'diameter', 'circumference']) { a.show(k); if (!(await ctx.sleep(1400))) return; } },
    },
    {
      title: 'Chords and arcs',
      text: '<p>A <b>chord</b> joins two points on the circle. A diameter is the longest chord.</p><p>An <b>arc</b> is part of the circumference.</p>',
      async on(a, ctx) { a.off(); for (const k of ['chord', 'arc']) { a.show(k); if (!(await ctx.sleep(1600))) return; } },
    },
    {
      title: 'Sectors and segments',
      text: '<p>A <b>sector</b> is cut off by <b>two radii</b> (like a slice of pizza).</p><p>A <b>segment</b> is cut off by a <b>chord</b>.</p>',
      tip: 'Sector: two straight sides from the centre. Segment: one straight side (a chord).',
      async on(a, ctx) { a.off(); for (const k of ['sector', 'segment']) { a.show(k); if (!(await ctx.sleep(1800))) return; } },
    },
    {
      title: 'Tangent',
      text: '<p>A <b>tangent</b> is a straight line that touches the circle at exactly <b>one point</b>, without crossing it.</p>',
      on(a) { a.off(); a.show('tangent'); },
    },
    {
      title: 'Try it: name the part',
      text: '<p>Choose a part from the list and see it highlighted. Cover the name and test yourself.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'parts',
  gens: [
    () => { const [n, d] = FD.pick([['radius', 'a line from the centre to the circle'], ['diameter', 'a chord that passes through the centre'], ['chord', 'a straight line joining two points on the circle'], ['tangent', 'a straight line that touches the circle at one point'], ['arc', 'part of the circumference'], ['sector', 'the region between two radii and an arc'], ['segment', 'the region between a chord and an arc']]); const all = ['radius', 'diameter', 'chord', 'tangent', 'arc', 'sector', 'segment', 'circumference']; return { type: 'mcq', q: `Which word means <b>${d}</b>?`, opts: [n, ...FD.shuffle(all.filter((x) => x !== n)).slice(0, 3)], why: `A ${n} is ${d}.` }; },
    () => { const r = FD.rnd(2, 40) / 2; return FD.pick([{ type: 'num', q: `A circle has radius \\(${FD.tn(r)}\\) cm. What is its diameter?`, a: 2 * r, unit: 'cm', why: `Diameter \\(= 2 \\times\\) radius \\(= ${FD.tn(2 * r)}\\) cm.` }, { type: 'num', q: `A circle has diameter \\(${FD.tn(2 * r)}\\) cm. What is its radius?`, a: r, unit: 'cm', why: `Radius \\(=\\) diameter \\(\\div 2 = ${FD.tn(r)}\\) cm.` }]); },
  ],
});

FD.check({
  section: 'parts',
  items: [
    { type: 'mcq', q: 'The region between a chord and an arc is a…', opts: ['segment', 'sector', 'tangent', 'radius'], why: 'Segment: chord + arc. Sector: two radii + arc.' },
    { type: 'mcq', q: 'The longest chord of a circle is…', opts: ['a diameter', 'a radius', 'a tangent', 'an arc'], why: 'A diameter passes through the centre.' },
    { type: 'num', q: 'A circle has diameter 17 cm. What is its radius?', a: 8.5, unit: 'cm', why: '\\(17 \\div 2 = 8.5\\).' },
    { type: 'tf', q: 'A tangent crosses the circle at two points.', a: false, why: 'A tangent touches the circle at exactly one point.' },
    { type: 'mcq', q: 'The distance all the way round a circle is the…', opts: ['circumference', 'diameter', 'arc', 'area'], why: 'The circumference is the perimeter of the circle.' },
  ],
});
