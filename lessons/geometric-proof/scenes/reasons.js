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

// The standard reasons, and a reusable "reasoning chain" scene: a diagram, steps revealed one by one,
// and a Try it where the student chooses the reason for each step.
FD.REASONS = [
  'Choose a reason…',
  'Angles on a straight line add up to 180°',
  'Angles around a point add up to 360°',
  'Vertically opposite angles are equal',
  'Alternate angles are equal',
  'Corresponding angles are equal',
  'Co-interior angles add up to 180°',
  'Angles in a triangle add up to 180°',
  'Base angles of an isosceles triangle are equal',
  'Angles in a quadrilateral add up to 360°',
  'Exterior angles of a polygon add up to 360°',
  'The angle at the centre is twice the angle at the circumference',
  'The angle in a semicircle is 90°',
  'Angles in the same segment are equal',
  'Opposite angles of a cyclic quadrilateral add up to 180°',
  'A tangent is perpendicular to the radius',
  'Alternate segment theorem',
  'Tangents from a point are equal in length',
  'The exterior angle of a triangle equals the sum of the two opposite interior angles',
];
// cfg: { draw(k) → svg for the first k steps found, steps: [[tex, reason index], …], options: [reason indices for the Try it] }
FD.chain = (el, cfg) => {
  const sel = (i) => `<select id="r${i}">${[0, ...cfg.options].map((r) => `<option value="${r}">${FD.REASONS[r]}</option>`).join('')}</select>`;
  const a = FD.stage(el, {
    vb: cfg.vb || '0 0 420 300', label: cfg.label || 'Geometry diagram',
    ctrls: cfg.steps.map(([t], i) => `<div class="row"><span>\\(${t}\\)</span>${sel(i)}</div>`).join('') + '<div class="chk-btns"><button class="btn" id="go">Check my reasons</button></div>',
  });
  a.show = (k) => a.draw(cfg.draw(k));
  a.walk = async (ctx, ms = 1700) => { a.show(0); a.work(cfg.steps.map(([t, r]) => [t, FD.REASONS[r].toLowerCase()])); for (let i = 0; i < cfg.steps.length; i++) { a.upto(i); a.show(i + 1); if (!(await ctx.sleep(ms))) return false; } return true; };
  a.q('#go').addEventListener('click', () => {
    const ok = cfg.steps.map(([, r], i) => +a.q('#r' + i).value === r), n = ok.filter(Boolean).length;
    a.show(ok.indexOf(false) === -1 ? cfg.steps.length : ok.indexOf(false));
    a.msg(n === ok.length ? '✓ Every reason is correct.' : `${n} of ${ok.length} reasons correct. ${ok.map((o, i) => (o ? '' : `Step ${i + 1}: think again.`)).join(' ')}`, n === ok.length ? 'good' : 'bad');
  });
  a.onSync(() => a.msg(''));
  a.show(0);
  return a;
};

FD.add({
  id: 'reasons',
  title: 'Standard reasons for angles',
  tab: 'Reasons',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Reason', 'The angle fact you used, written in words. “Give reasons” means one reason for every angle you work out.'],
    ['Standard wording', 'The usual name of the fact, e.g. “alternate angles are equal”, not “Z angles”.'],
  ],
  mount(el) {
    const G = FD.G, P = [210, 70], Q = [130.7, 240], R = [289.3, 240];
    return FD.chain(el, {
      label: 'An isosceles triangle between two parallel lines',
      steps: [['\\angle PQR = 65^\\circ', 4], ['\\angle PRQ = 65^\\circ', 8], ['\\angle QPR = 180 - 65 - 65 = 50^\\circ', 7]],
      options: [1, 3, 4, 5, 6, 7, 8],
      draw: (k) => G.line([30, 70], [390, 70]) + G.line([30, 240], [390, 240]) + G.arrows([60, 70], [110, 70], 1, 'g-ln') + G.arrows([60, 240], [110, 240], 1, 'g-ln') + G.poly([P, Q, R]) + G.ticks(P, Q) + G.ticks(P, R)
        + G.arc(P, [30, 70], Q, 28, '65°', 'g-arc2', 46)
        + G.arc(Q, R, P, 26, k >= 1 ? '65°' : '', 'g-arc2', 44) + G.arc(R, P, Q, 26, k >= 2 ? '65°' : '', 'g-arc', 44) + G.arc(P, Q, R, 22, k >= 3 ? '50°' : 'x', 'g-arc3', 40)
        + G.t([P[0], P[1] - 16], 'P') + G.t([Q[0] - 10, Q[1] + 18], 'Q') + G.t([R[0] + 10, R[1] + 18], 'R'),
    });
  },
  steps: [
    {
      title: 'Why reasons matter',
      text: '<p>Questions often say <b>“Give reasons for your answer.”</b> Then every angle you find needs the <b>angle fact</b> you used, written in words.</p><p>Here the lines are parallel and \\(PQ = PR\\). Find \\(x\\).</p>',
      on(a) { a.off(); a.show(0); },
    },
    {
      title: 'One fact per step',
      text: '<p>Find one angle at a time and write its reason next to it.</p>',
      tip: 'Write the reason in full. “Z angles”, “F angles” or “because it is parallel” do not get the mark.',
      async on(a, ctx) { a.off(); await a.walk(ctx); },
    },
    {
      title: 'The standard reasons',
      text: '<p>Learn this wording:</p><ul><li>Angles on a straight line add up to 180°.</li><li>Angles around a point add up to 360°.</li><li>Vertically opposite angles are equal.</li><li>Alternate / corresponding angles are equal; co-interior angles add up to 180°.</li><li>Angles in a triangle add up to 180°; base angles of an isosceles triangle are equal.</li></ul>',
      on(a) { a.off(); a.show(3); },
    },
    {
      title: 'Try it: choose the reasons',
      text: '<p>Choose the reason for each step, then press <b>Check my reasons</b>.</p>',
      on(a) { a.show(0); a.tryMode(); },
    },
  ],
});

const RQ = [
  ['Two angles together make a straight line.', 1], ['Three angles meet at a point and fill the space around it.', 2], ['Two straight lines cross, and you use the angle opposite.', 3],
  ['Between parallel lines, the angles make a Z shape.', 4], ['Between parallel lines, the angles make an F shape.', 5], ['Between parallel lines, the angles make a C shape.', 6],
  ['You use the three angles inside a triangle.', 7], ['A triangle has two equal sides and you use the angles at the ends of the third side.', 8], ['You use the four angles inside a quadrilateral.', 9],
];
FD.practice({
  section: 'reasons',
  gens: [
    () => { const [d, r] = FD.pick(RQ), wrong = FD.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== r)).slice(0, 3); return { type: 'mcq', q: `${d} Which reason do you write?`, opts: [FD.REASONS[r], ...wrong.map((w) => FD.REASONS[w])], why: `The standard reason is: “${FD.REASONS[r]}”.` }; },
    () => { const t = FD.rnd(40, 80); return { type: 'num', q: `\\(PQ = PR\\) in triangle \\(PQR\\), and \\(QR\\) lies on a line parallel to a line through \\(P\\). The angle between that line and \\(PQ\\) is \\(${t}^\\circ\\). Work out \\(\\angle QPR\\).`, a: 180 - 2 * t, unit: '°', why: `\\(\\angle PQR = ${t}^\\circ\\) (alternate angles are equal). \\(\\angle PRQ = ${t}^\\circ\\) (base angles of an isosceles triangle are equal). \\(\\angle QPR = 180 - ${2 * t} = ${180 - 2 * t}^\\circ\\) (angles in a triangle add up to 180°).` }; },
  ],
});

FD.check({
  section: 'reasons',
  items: [
    { type: 'mcq', q: 'Which reason would get the mark?', opts: ['Co-interior angles add up to 180°', 'C angles', 'They make 180', 'Parallel'], why: 'Use the full standard wording.' },
    { type: 'multi', q: 'Choose the <b>two</b> reasons that are about parallel lines.', need: 2, opts: [['Alternate angles are equal', true], ['Corresponding angles are equal', true], ['Vertically opposite angles are equal', false], ['Angles in a triangle add up to 180°', false]], why: 'Alternate and corresponding angles need parallel lines.' },
    { type: 'tf', q: '“Vertically opposite angles are equal” needs parallel lines.', a: false, why: 'It works whenever two straight lines cross.' },
    { type: 'num', q: 'Isosceles triangle with base angles \\(72^\\circ\\). Find the third angle.', a: 36, unit: '°', why: '\\(180 - 72 - 72 = 36^\\circ\\) (angles in a triangle add up to 180°).' },
  ],
});
