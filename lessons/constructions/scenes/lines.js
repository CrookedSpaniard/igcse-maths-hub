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

// Path data for an arc of a circle (centre c, radius r) from angle a1 to a2 (degrees, anticlockwise as seen when a2 > a1).
FD.arcD = (c, r, a1, a2) => { const p = FD.G.polar(c, r, a1), q = FD.G.polar(c, r, a2), big = Math.abs(a2 - a1) > 180 ? 1 : 0; return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 ${big} ${a2 > a1 ? 0 : 1} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
// A ruler drawn under a line: x0 = where 0 cm is, cm = pixels per centimetre, n = number of cm shown.
FD.ruler = (x0, y, cm, n) => {
  const G = FD.G;
  let s = `<rect class="g-fill2" x="${x0 - 10}" y="${y}" width="${n * cm + 20}" height="44" rx="4"/>`;
  for (let i = 0; i <= n * 10; i++) { const x = x0 + (i * cm) / 10, big = i % 10 === 0, mid = i % 5 === 0; s += G.line([x, y], [x, y + (big ? 16 : mid ? 11 : 6)], big ? 'g-ln' : 'g-thin'); if (big) s += G.t([x, y + 30], i / 10, 's'); }
  return s;
};

FD.add({
  id: 'lines',
  title: 'Measuring and drawing lines',
  tab: 'Lines',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Millimetre (mm)', 'The smallest marks on a ruler. \\(10\\ \\text{mm} = 1\\ \\text{cm}\\).'],
    ['To the nearest millimetre', 'Read the length to the closest small mark, e.g. 6.4 cm = 64 mm.'],
  ],
  mount(el) {
    const G = FD.G, X0 = 30, CM = 36;
    const a = FD.stage(el, {
      vb: '0 0 420 200', label: 'A line and a ruler marked in centimetres and millimetres',
      ctrls: `<label class="ctrl">Start (cm) <input type="range" id="st" min="0" max="3" step="0.1" value="0"><output id="ost">0</output></label>
        <label class="ctrl">Length (mm) <input type="range" id="ln" min="10" max="70" step="1" value="47"><output id="oln">47</output></label>`,
    });
    // Line from s cm to e cm along the ruler; k = fraction drawn.
    a.line = (s, e, k = 1, lbl = true) => {
      const A = [X0 + s * CM, 70], B = [X0 + (s + (e - s) * k) * CM, 70];
      let h = FD.ruler(X0, 92, CM, 10) + G.line(A, B, 'g-hl') + G.dot(A, 'g-dot k', 4) + (k === 1 ? G.dot(B, 'g-dot k', 4) : '');
      h += G.line([A[0], 70], [A[0], 92], 'g-dash') + G.line([B[0], 70], [B[0], 92], 'g-dash');
      if (lbl && k === 1) h += G.t([(A[0] + B[0]) / 2, 48], `${FD.num(FD.round(e - s, 1))} cm = ${Math.round((e - s) * 10)} mm`, 'l');
      a.draw(h);
    };
    a.onSync(() => {
      const s = a.val('st'), L = a.val('ln') / 10;
      a.out('st', s); a.out('ln', a.val('ln'));
      a.line(s, FD.round(Math.min(s + L, 10), 1));
      a.msg(s > 0 ? `The line starts at ${s} cm, so subtract: \\(${FD.round(s + L, 1)} - ${s} = ${L}\\) cm.` : 'Start at 0 on the ruler, not at the end of the ruler.');
    });
    a.line(0, 0, 0, false);
    return a;
  },
  steps: [
    {
      title: 'Centimetres and millimetres',
      text: '<p>Each centimetre on a ruler is split into <b>10 millimetres</b>. The long marks are centimetres; the small marks are millimetres.</p><p>This line is <b>6 cm and 4 mm</b> long: 6.4 cm, or 64 mm.</p>',
      async on(a, ctx) { a.off(); for (let k = 0; k <= 1.0001; k += 0.05) { a.line(0, 6.4, Math.min(k, 1), false); if (!(await ctx.sleep(40))) return; } a.line(0, 6.4); },
    },
    {
      title: 'Line up the zero',
      text: '<p>Put the <b>0 mark</b> exactly on one end of the line. Many rulers have a gap before 0, so do not start at the edge of the ruler.</p><p>If you start somewhere else, subtract: from 2.3 cm to 7.8 cm is \\(7.8 - 2.3 = 5.5\\) cm.</p>',
      async on(a, ctx) { a.off(); a.line(2.3, 7.8); await a.play(ctx, [['7.8 - 2.3 = 5.5\\ \\text{cm} = 55\\ \\text{mm}', 'end reading − start reading']]); },
    },
    {
      title: 'Drawing a line accurately',
      text: '<p>To draw a line of <b>8.3 cm</b>: mark a point, put 0 on it, count 8 cm and 3 more small marks, and mark the end. Join the points with a sharp pencil.</p>',
      tip: 'Examiners usually accept answers within 2 mm of the exact length.',
      async on(a, ctx) { a.off(); for (let k = 0; k <= 1.0001; k += 0.04) { a.line(0, 8.3, Math.min(k, 1), false); if (!(await ctx.sleep(40))) return; } a.line(0, 8.3); },
    },
    {
      title: 'Try it: measure the line',
      text: '<p>Move the start of the line and change its length. Read the length from the ruler <b>to the nearest millimetre</b> before you look at the label.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'lines',
  gens: [
    () => { const s = FD.rnd(0, 30) / 10, L = FD.rnd(15, 65) / 10; return { type: 'num', q: `A line starts at the ${FD.num(s)} cm mark of a ruler and ends at the ${FD.num(FD.round(s + L, 1))} cm mark. How long is the line in millimetres?`, a: Math.round(L * 10), unit: 'mm', why: `\\(${FD.round(s + L, 1)} - ${s} = ${L}\\) cm \\(= ${Math.round(L * 10)}\\) mm.` }; },
    () => { const mm = FD.rnd(12, 140); return { type: 'num', q: `Write \\(${mm}\\) mm in centimetres.`, a: mm / 10, unit: 'cm', why: `\\(10\\) mm \\(= 1\\) cm, so divide by 10: \\(${FD.tn(mm / 10)}\\) cm.` }; },
    () => { const c = FD.rnd(5, 120) / 10; return { type: 'num', q: `Write \\(${FD.tn(c)}\\) cm in millimetres.`, a: Math.round(c * 10), unit: 'mm', why: `Multiply by 10: \\(${Math.round(c * 10)}\\) mm.` }; },
  ],
});

FD.check({
  section: 'lines',
  items: [
    { type: 'num', q: 'A line measures 7 cm and 6 small marks on a ruler. How long is it in mm?', a: 76, unit: 'mm', why: '\\(7 \\times 10 + 6 = 76\\) mm.' },
    { type: 'num', q: 'A line goes from the 1.5 cm mark to the 9.2 cm mark. How long is it in cm?', a: 7.7, unit: 'cm', why: '\\(9.2 - 1.5 = 7.7\\) cm.' },
    { type: 'mcq', q: 'To measure a line you should put this on one end of the line:', opts: ['the 0 mark', 'the end of the ruler', 'the 1 cm mark', 'any mark'], why: 'Line up the zero; the end of the ruler is often not 0.' },
    { type: 'tf', q: '45 mm is the same as 4.5 cm.', a: true, why: '\\(45 \\div 10 = 4.5\\).' },
  ],
});
