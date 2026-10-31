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

// Triangle ABC with sides a = BC, b = CA, c = AB. o.sides / o.angs: labels (strings, '' = none); o.hl: sides to highlight; o.live: drag handles.
FD.TRI = (a, P, o = {}) => {
  const G = FD.G, [A, B, C] = P, M = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const out = (p, q, d = 18) => { const m = G.mid(p, q), v = [m[0] - M[0], m[1] - M[1]], n = Math.hypot(v[0], v[1]) || 1; return [m[0] + (v[0] / n) * d, m[1] + (v[1] / n) * d]; };
  const sd = o.sides || {}, an = o.angs || {}, hl = o.hl || [];
  let s = G.poly(P, 'g-fill');
  [['a', B, C], ['b', C, A], ['c', A, B]].forEach(([k, p, q]) => { if (hl.includes(k)) s += G.line(p, q, k === hl[0] ? 'g-hl' : 'g-hl2'); if (sd[k]) s += G.t(out(p, q), sd[k], hl.includes(k) ? (k === hl[0] ? 'l' : 'l2') : 's'); });
  [['A', A, B, C], ['B', B, C, A], ['C', C, A, B]].forEach(([k, V, p, q]) => { if (an[k]) s += G.arc(V, p, q, 24, an[k], k === o.hlAng ? 'g-arc' : 'g-arc3', 42); });
  [['A', A], ['B', B], ['C', C]].forEach(([k, V]) => { const v = [V[0] - M[0], V[1] - M[1]], n = Math.hypot(v[0], v[1]); s += G.t([V[0] + (v[0] / n) * 16, V[1] + (v[1] / n) * 16], k) + (o.live ? G.handle(V, k) : ''); });
  a.draw(s + (o.extra || ''));
};
// Measured triangle (sides in cm at 30 units per cm, angles in degrees).
FD.measure = (P) => { const G = FD.G, [A, B, C] = P, U = 30; return { a: G.dist(B, C) / U, b: G.dist(C, A) / U, c: G.dist(A, B) / U, A: G.deg(A, B, C), B: G.deg(B, C, A), C: G.deg(C, A, B) }; };

FD.add({
  id: 'obtuse',
  title: 'Trigonometry of obtuse angles',
  tab: 'Obtuse angles',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Unit circle', 'A circle of radius 1. A point at angle \\(\\theta\\) on it has coordinates \\((\\cos\\theta, \\sin\\theta)\\).'],
    ['Obtuse angle', 'An angle between \\(90^\\circ\\) and \\(180^\\circ\\).'],
  ],
  mount(el) {
    const G = FD.G, O = [210, 200], R = 150, X = (v) => O[0] + v * R, Y = (v) => O[1] - v * R;
    const a = FD.stage(el, {
      vb: '0 0 420 260', drag: true, label: 'A unit circle with a point at angle θ',
      ctrls: '<label class="ctrl">\\(\\theta\\) <input type="range" id="t" min="0" max="180" value="140"><output id="ot">140°</output></label>',
    });
    let live = false;
    a.show = (t, mirror = true) => {
      const r = (t * Math.PI) / 180, P = [X(Math.cos(r)), Y(Math.sin(r))], Q = [X(-Math.cos(r)), Y(Math.sin(r))];
      let s = `<path class="g-thin" d="M${X(-1)} ${O[1]}A${R} ${R} 0 0 1 ${X(1)} ${O[1]}"/>` + G.line([X(-1.15), O[1]], [X(1.15), O[1]], 'g-thin') + G.line([O[0], O[1] + 10], [O[0], Y(1.12)], 'g-thin');
      s += G.t([X(1), O[1] + 14], '1', 's') + G.t([X(-1), O[1] + 14], '−1', 's') + G.t([O[0] - 12, Y(1)], '1', 's');
      if (mirror && t !== 90) s += G.line(O, Q, 'g-dash') + G.line(Q, [Q[0], O[1]], 'g-hl2') + G.sector(O, 26, 0, 180 - t, 'g-arc3', (180 - t) + '°', 44);
      s += G.sector(O, 34, 0, t, 'g-arc', t + '°', 52) + G.line(O, P, 'g-ln') + G.line(P, [P[0], O[1]], 'g-hl2') + G.line([O[0], O[1] + 3], [P[0], O[1] + 3], 'g-hl');
      s += live ? G.handle(P, 'P') : G.dot(P, 'g-dot', 6);
      a.draw(s);
      const sn = FD.round(Math.sin(r), 4), cs = FD.round(Math.cos(r), 4);
      a.big(`\\sin ${t}^\\circ = ${FD.num(sn)},\\quad \\cos ${t}^\\circ = ${FD.num(cs)}`);
      a.msg(t > 90 && t < 180 ? `\\(\\sin ${t}^\\circ = \\sin ${180 - t}^\\circ\\) and \\(\\cos ${t}^\\circ = -\\cos ${180 - t}^\\circ\\). Obtuse: cos (and tan) are negative.` : t === 90 ? '\\(\\cos 90^\\circ = 0\\) and \\(\\tan 90^\\circ\\) is undefined.' : 'Acute: sin, cos and tan are all positive.');
    };
    FD.dragIn(a.svg, (n, x, y) => { a.q('#t').value = FD.clamp(Math.round(Math.atan2(O[1] - y, x - O[0]) * 180 / Math.PI), 0, 180); a.sync(); });
    a.onSync(() => { const t = a.val('t'); a.out('t', t + '°'); a.show(t); });
    a.live = (on) => { live = on; };
    a.show(40, false);
    return a;
  },
  steps: [
    {
      title: 'Sine and cosine on a circle',
      text: '<p>Turn a radius of length 1 through \\(\\theta\\). The point reached has <b>height \\(\\sin\\theta\\)</b> and <b>across \\(\\cos\\theta\\)</b>.</p><p>For acute angles this is just SOHCAHTOA with hypotenuse 1.</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 10; t <= 70; t += 2) { a.show(t, false); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Keep turning past 90°',
      text: '<p>Past \\(90^\\circ\\) the point moves to the left: its <b>height is still positive</b> but its <b>across value is negative</b>.</p><p>So for an obtuse angle, \\(\\sin\\theta > 0\\) but \\(\\cos\\theta < 0\\) and \\(\\tan\\theta < 0\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 70; t <= 150; t += 2) { a.show(t, false); if (!(await ctx.sleep(40))) return; } },
    },
    {
      title: 'Two angles, the same sine',
      text: '<p>The points at \\(\\theta\\) and \\(180^\\circ - \\theta\\) are at the <b>same height</b>:</p><p class="mbig">\\(\\sin(180^\\circ - \\theta) = \\sin\\theta\\)</p><p class="mbig">\\(\\cos(180^\\circ - \\theta) = -\\cos\\theta\\)</p>',
      tip: 'sin⁻¹ on a calculator only gives the acute angle. The obtuse answer is 180° minus it.',
      on(a) { a.off(); a.live(false); a.show(140); },
    },
    {
      title: 'Worked example',
      text: '<p>Find both angles between \\(0^\\circ\\) and \\(180^\\circ\\) with \\(\\sin\\theta = 0.6\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); a.show(143); await a.play(ctx, [['\\theta = \\sin^{-1}(0.6) = 36.9^\\circ', 'calculator'], ['\\text{or } \\theta = 180 - 36.9 = 143.1^\\circ', 'same sine']]); },
    },
    {
      title: 'Try it: turn the radius',
      text: '<p>Drag the point round the semicircle. Compare \\(\\sin\\theta\\) and \\(\\cos\\theta\\) with those of \\(180^\\circ - \\theta\\).</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'obtuse',
  gens: [
    () => { let t; do { t = FD.rnd(95, 170); } while (t === 135); return { type: 'mcq', q: `Which angle has the same sine as \\(${t}^\\circ\\)?`, opts: [`\\(${180 - t}^\\circ\\)`, `\\(${t - 90}^\\circ\\)`, `\\(${360 - t}^\\circ\\)`, `\\(${t + 10}^\\circ\\)`], why: `\\(\\sin(180^\\circ - \\theta) = \\sin\\theta\\): \\(180 - ${t} = ${180 - t}\\).` }; },
    () => { const s = FD.rnd(10, 95) / 100, t = (Math.asin(s) * 180) / Math.PI; return { type: 'num', q: `\\(\\sin\\theta = ${s}\\) and \\(\\theta\\) is <b>obtuse</b>. Find \\(\\theta\\) to 1 d.p.`, a: FD.round(180 - t, 1), tol: 0.05, unit: '°', why: `\\(\\sin^{-1}(${s}) = ${FD.tn(FD.round(t, 1))}^\\circ\\) (acute). Obtuse: \\(180 - ${FD.tn(FD.round(t, 1))} = ${FD.tn(FD.round(180 - t, 1))}^\\circ\\).` }; },
    () => { const t = FD.rnd(95, 175); return { type: 'mcq', q: `Which statement is true for \\(\\theta = ${t}^\\circ\\)?`, opts: ['\\(\\sin\\theta > 0\\) and \\(\\cos\\theta < 0\\)', '\\(\\sin\\theta < 0\\) and \\(\\cos\\theta > 0\\)', 'both are negative', 'both are positive'], why: 'For obtuse angles the point is to the left of the axis but above it.' }; },
  ],
});

FD.check({
  section: 'obtuse',
  items: [
    { type: 'mcq', q: '\\(\\cos 120^\\circ =\\)', opts: ['\\(-0.5\\)', '\\(0.5\\)', '\\(0.866\\)', '\\(-0.866\\)'], why: '\\(-\\cos 60^\\circ = -0.5\\).' },
    { type: 'num', q: 'Find the obtuse angle with \\(\\sin\\theta = \\sin 35^\\circ\\).', a: 145, unit: '°', why: '\\(180 - 35\\).' },
    { type: 'tf', q: 'The tangent of an obtuse angle is negative.', a: true, why: '\\(\\tan = \\sin \\div \\cos\\): positive ÷ negative.' },
    { type: 'num', q: '\\(\\cos\\theta = -0.4\\). Find \\(\\theta\\) between \\(0^\\circ\\) and \\(180^\\circ\\), to 1 d.p.', a: 113.6, tol: 0.05, unit: '°', why: '\\(\\cos^{-1}(-0.4) = 113.58…^\\circ\\). The calculator gives the obtuse angle directly.' },
  ],
});
