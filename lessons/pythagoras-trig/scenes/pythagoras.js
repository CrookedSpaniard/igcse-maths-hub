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

// A right-angled triangle drawn to fit the stage. Lengths a (horizontal), b (vertical); right angle at C.
// Returns the corners in SVG units and the scale k (units per cm).
FD.rt = (a, b, box = [60, 40, 300, 220]) => {
  const k = Math.min(box[2] / a, box[3] / b), C = [box[0], box[1] + box[3]];
  return { k, C, A: [C[0] + a * k, C[1]], B: [C[0], C[1] - b * k] };
};
// Square drawn outwards on side P→Q (outward = to the right of the direction P→Q as seen).
FD.sqOn = (P, Q, cls = 'g-fill2') => { const v = [Q[0] - P[0], Q[1] - P[1]], n = [-v[1], v[0]]; return FD.G.poly([P, Q, [Q[0] + n[0], Q[1] + n[1]], [P[0] + n[0], P[1] + n[1]]], cls); };

FD.add({
  id: 'pythagoras',
  title: "Pythagoras' theorem",
  tab: 'Pythagoras',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Hypotenuse', 'The longest side of a right-angled triangle, opposite the right angle.'],
    ["Pythagoras' theorem", 'In a right-angled triangle, \\(a^2 + b^2 = c^2\\), where \\(c\\) is the hypotenuse.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 320', label: 'A right-angled triangle with squares on its sides',
      ctrls: `<label class="ctrl">\\(a\\) (cm) <input type="range" id="a" min="1" max="12" step="0.5" value="6"><output id="oa">6</output></label>
        <label class="ctrl">\\(b\\) (cm) <input type="range" id="b" min="1" max="12" step="0.5" value="8"><output id="ob">8</output></label>`,
    });
    // st: 0 triangle, 1 squares on the short sides, 2 square on the hypotenuse; lbl overrides the side labels
    a.tri = (x, y, st = 2, lbl) => {
      // With squares the drawing is x + 2y wide and 2x + y tall (in cm), so scale it to fit.
      const kk = Math.min(400 / (x + 2 * y), 300 / (2 * x + y)), x0 = (420 - (x + 2 * y) * kk) / 2 + y * kk, y0 = 10 + (x + y) * kk;
      const { A, B, C, k } = st ? { k: kk, C: [x0, y0], A: [x0 + x * kk, y0], B: [x0, y0 - y * kk] } : FD.rt(x, y, [80, 40, 280, 240]);
      const c = Math.hypot(x, y), L = lbl || [x, y, FD.round(c, 2)].map((v) => FD.num(v) + ' cm');
      let s = '';
      if (st >= 1) s += FD.sqOn(C, A, 'g-fill2') + FD.sqOn(B, C, 'g-fill2') + G.t([ (A[0] + C[0]) / 2, C[1] + (x * k) / 2], FD.num(x * x), 's') + G.t([C[0] - (y * k) / 2, (B[1] + C[1]) / 2], FD.num(y * y), 's');
      if (st >= 2) { s += FD.sqOn(A, B, 'g-fill'); const m = G.mid(A, B), n = [(A[1] - B[1]) / 2, (B[0] - A[0]) / 2]; s += G.t([m[0] + n[0], m[1] + n[1]], FD.num(FD.round(c * c, 2)), 'l'); }
      s += G.poly([A, B, C], 'g-fill') + G.right(C, A, B, 12);
      s += G.t([(A[0] + C[0]) / 2, C[1] + (st ? -10 : 18)], L[0], st ? 's' : '') + G.t([C[0] + (st ? 22 : -26), (B[1] + C[1]) / 2], L[1], st ? 's' : '') + G.t([G.mid(A, B)[0] + 22, G.mid(A, B)[1] - 10], L[2], 'l');
      a.draw(s);
    };
    a.onSync(() => {
      const x = a.val('a'), y = a.val('b'), c = Math.hypot(x, y);
      a.out('a', x); a.out('b', y); a.tri(x, y, 2);
      a.big(`${FD.num(x * x)} + ${FD.num(y * y)} = ${FD.num(x * x + y * y)}`);
      a.msg(`\\(c = \\sqrt{${FD.tn(x * x + y * y)}} = ${FD.tn(FD.round(c, 2))}\\) cm${Number.isInteger(c) ? '' : ' (2 d.p.)'}`);
    });
    a.tri(3, 4, 0, ['a', 'b', 'c']);
    return a;
  },
  steps: [
    {
      title: 'The hypotenuse',
      text: '<p>In a right-angled triangle the longest side is the <b>hypotenuse</b>, \\(c\\). It is always <b>opposite the right angle</b>.</p>',
      on(a) { a.off(); a.tri(3, 4, 0, ['a', 'b', 'c (hypotenuse)']); },
    },
    {
      title: 'Squares on the sides',
      text: '<p>Draw a square on each side. For a 3, 4, 5 triangle the areas are \\(9\\), \\(16\\) and \\(25\\).</p><p>The two small squares together exactly match the big one: \\(9 + 16 = 25\\).</p>',
      async on(a, ctx) { a.off(); a.tri(3, 4, 1); if (!(await ctx.sleep(1500))) return; a.tri(3, 4, 2); a.big('9 + 16 = 25'); },
    },
    {
      title: "Pythagoras' theorem",
      text: '<p class="mbig">\\(a^2 + b^2 = c^2\\)</p><p><b>Finding the hypotenuse:</b> square the two shorter sides, <b>add</b>, then square root.</p>',
      async on(a, ctx) { a.off(); a.tri(6, 8, 0, ['6 cm', '8 cm', 'c']); await a.play(ctx, [['c^2 = 6^2 + 8^2 = 36 + 64 = 100', ''], ['c = \\sqrt{100} = 10\\ \\text{cm}', '']]); },
    },
    {
      title: 'Finding a shorter side',
      text: '<p>If you know the hypotenuse, <b>subtract</b>: \\(a^2 = c^2 - b^2\\).</p><p>The hypotenuse is 13 cm and one side is 5 cm.</p>',
      tip: 'Check: the hypotenuse must be the longest side. Adding when you should subtract is the most common mistake.',
      async on(a, ctx) { a.off(); a.tri(12, 5, 0, ['a', '5 cm', '13 cm']); await a.play(ctx, [['a^2 = 13^2 - 5^2 = 169 - 25 = 144', 'subtract'], ['a = \\sqrt{144} = 12\\ \\text{cm}', '']]); },
    },
    {
      title: 'Try it: change the sides',
      text: '<p>Change the two shorter sides. The two smaller squares always add up to the square on the hypotenuse.</p>',
      tip: 'Find other whole-number triangles: 5, 12, 13 and 8, 15, 17.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'pythagoras',
  gens: [
    () => { const x = FD.rnd(3, 15), y = FD.rnd(3, 15), c = Math.hypot(x, y); return { type: 'num', q: `A right-angled triangle has shorter sides \\(${x}\\) cm and \\(${y}\\) cm. Work out the length of the hypotenuse. Give your answer to 1 decimal place if needed.`, a: FD.round(c, 1), tol: 0.05, unit: 'cm', why: `\\(c^2 = ${x}^2 + ${y}^2 = ${x * x} + ${y * y} = ${x * x + y * y}\\). \\(c = \\sqrt{${x * x + y * y}} = ${FD.tn(FD.round(c, 1))}\\) cm.` }; },
    () => { let c, y; do { c = FD.rnd(8, 25); y = FD.rnd(3, c - 2); } while (c * c - y * y < 4); const x = Math.sqrt(c * c - y * y); return { type: 'num', q: `The hypotenuse of a right-angled triangle is \\(${c}\\) cm and one of the other sides is \\(${y}\\) cm. Work out the third side. Give your answer to 1 decimal place if needed.`, a: FD.round(x, 1), tol: 0.05, unit: 'cm', why: `\\(a^2 = ${c}^2 - ${y}^2 = ${c * c} - ${y * y} = ${c * c - y * y}\\). \\(a = \\sqrt{${c * c - y * y}} = ${FD.tn(FD.round(x, 1))}\\) cm.` }; },
    () => { const [p, q, r] = FD.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]]); return { type: 'num', q: `Two sides of a right-angled triangle are \\(${p}\\) cm and \\(${q}\\) cm; these are the two shorter sides. Find the hypotenuse.`, a: r, unit: 'cm', why: `\\(${p}^2 + ${q}^2 = ${p * p + q * q} = ${r}^2\\), so \\(c = ${r}\\) cm.` }; },
  ],
});

FD.check({
  section: 'pythagoras',
  items: [
    { type: 'num', q: 'Shorter sides 9 cm and 12 cm. Find the hypotenuse.', a: 15, unit: 'cm', why: '\\(81 + 144 = 225\\), \\(\\sqrt{225} = 15\\).' },
    { type: 'num', q: 'Hypotenuse 17 cm, one side 8 cm. Find the other side.', a: 15, unit: 'cm', why: '\\(289 - 64 = 225\\), \\(\\sqrt{225} = 15\\).' },
    { type: 'mcq', q: 'Which side is the hypotenuse?', opts: ['The side opposite the right angle', 'The shortest side', 'The side next to the right angle', 'The base'], why: 'It is opposite the right angle and is the longest side.' },
    { type: 'num', q: 'Shorter sides 4 cm and 7 cm. Find the hypotenuse to 1 d.p.', a: 8.1, tol: 0.05, unit: 'cm', why: '\\(\\sqrt{16 + 49} = \\sqrt{65} = 8.06…\\)' },
  ],
});
