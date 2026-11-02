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

// Perimeter: the distance all the way round. Compound shapes need their missing sides first.

// A polygon given in maths coordinates (y up, units in cm), scaled to fit box [x, y, w, h] of the stage.
// lab[i] labels side i (point i to point i + 1) on the outside; hl lists the highlighted labels.
// pre(P) / post(P) add SVG drawn under / over the shape; fit adds points that must also fit in the box.
FD.shp = (pts, o = {}) => {
  const G = FD.G, box = o.box || [70, 45, 270, 200], all = pts.concat(o.fit || []);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), mx = Math.min(...xs), Mx = Math.max(...xs), my = Math.min(...ys), My = Math.max(...ys);
  const k = Math.min(box[2] / (Mx - mx), box[3] / (My - my));
  const x0 = box[0] + (box[2] - (Mx - mx) * k) / 2 - mx * k, yb = box[1] + (box[3] + (My - my) * k) / 2 + my * k;
  const P = ([x, y]) => [x0 + x * k, yb - y * k];
  let s = (o.pre ? o.pre(P) : '') + G.poly(pts.map(P), o.cls || 'g-fill');
  (o.lab || []).forEach((L, i) => {
    if (!L) return;
    const A = pts[i], B = pts[(i + 1) % pts.length], d = [B[0] - A[0], B[1] - A[1]], n0 = Math.hypot(d[0], d[1]), n = [d[1] / n0, -d[0] / n0], m = P([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]);
    let p, c = '';
    if (Math.abs(n[1]) < 0.01) { p = [m[0] + n[0] * 9, m[1]]; c = n[0] > 0 ? 'st' : 'en'; }
    else if (Math.abs(n[0]) < 0.01) p = [m[0], m[1] + (n[1] > 0 ? -12 : 14)];
    else { p = [m[0] + n[0] * 12, m[1] - n[1] * 12]; c = n[0] > 0.3 ? 'st' : n[0] < -0.3 ? 'en' : ''; }
    s += G.t(p, L, ((o.hl || []).includes(i) ? 'l ' : '') + c);
  });
  return { s: s + (o.post ? o.post(P) : ''), P, k };
};
// An L-shape: a W by H rectangle with a cw by ch rectangle cut from the top right corner (anticlockwise from bottom left).
FD.Lpts = (W, H, cw, ch) => (cw && ch ? [[0, 0], [W, 0], [W, H - ch], [W - cw, H - ch], [W - cw, H], [0, H]] : [[0, 0], [W, 0], [W, H], [0, H]]);
// A "house": a w by h rectangle with an isosceles triangle of height r on top.
FD.house = (w, h, r) => [[0, 0], [w, 0], [w, h], [w / 2, h + r], [0, h]];

FD.add({
  id: 'perimeter',
  title: 'Perimeter',
  tab: 'Perimeter',
  icon: 'shapes',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Perimeter', 'The total distance around the outside of a shape.'],
    ['Compound shape', 'A shape made from simpler shapes, such as rectangles and triangles.'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'An L-shaped compound shape with its side lengths',
      ctrls: `<label class="ctrl">Width (cm) <input type="range" id="w" min="6" max="14" value="10"><output id="ow">10</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="h" min="4" max="10" value="7"><output id="oh">7</output></label>
        <label class="ctrl">Cut width (cm) <input type="range" id="cw" min="1" max="5" value="4"><output id="ocw">4</output></label>
        <label class="ctrl">Cut height (cm) <input type="range" id="ch" min="1" max="5" value="3"><output id="och">3</output></label>`,
    });
    a.L = (W, H, cw, ch, lab, hl) => a.draw(FD.shp(FD.Lpts(W, H, cw, ch), { lab, hl }).s);
    a.house = (lab) => { const r = FD.shp(FD.house(8, 5, 3), { lab }); a.draw(r.s + G.line(r.P([0, 5]), r.P([8, 5]), 'g-dash')); };
    a.onSync(() => {
      const W = a.val('w'), H = a.val('h'), cw = a.val('cw'), ch = Math.min(a.val('ch'), H - 1);
      a.out('w', W); a.out('h', H); a.out('cw', cw); a.out('ch', ch);
      const sides = [W, H - ch, cw, ch, W - cw, H];
      a.L(W, H, cw, ch, sides.map((v) => v + ' cm'), [2, 3]);
      a.big(`P = ${sides.join(' + ')} = ${2 * (W + H)}\\ \\text{cm}`);
      a.msg(`The same as the rectangle around it: \\(2 \\times (${W} + ${H}) = ${2 * (W + H)}\\) cm.`);
    });
    a.L(10, 7, 4, 3, ['10 cm', '4 cm', '?', '?', '6 cm', '7 cm'], [2, 3]);
    return a;
  },
  steps: [
    {
      title: 'Perimeter: all the way round',
      text: '<p>The <b>perimeter</b> is the total length of the outside edge. Add up <b>every</b> side.</p><p>A rectangle 8 cm by 5 cm has four sides: two of each length.</p>',
      async on(a, ctx) { a.off(); a.L(8, 5, 0, 0, ['8 cm', '5 cm', '8 cm', '5 cm']); await a.play(ctx, [['P = 8 + 5 + 8 + 5', ''], ['P = 26\\ \\text{cm}', 'or \\(2 \\times (8 + 5)\\)']]); },
    },
    {
      title: 'Find the missing sides first',
      text: '<p>This L-shape has two sides with no length marked. Use the sides <b>opposite</b> them.</p><ul><li>Across: the bottom (10) = the top (6) + the step.</li><li>Up: the left side (7) = the right side (4) + the step.</li></ul>',
      tip: 'Count the sides before you add: an L-shape has six.',
      async on(a, ctx) {
        a.off();
        const lab = ['10 cm', '4 cm', '?', '?', '6 cm', '7 cm'];
        a.L(10, 7, 4, 3, lab, [2, 3]);
        await a.play(ctx, [['10 - 6 = 4\\ \\text{cm}', 'horizontal step'], ['7 - 4 = 3\\ \\text{cm}', 'vertical step'], ['P = 10 + 4 + 4 + 3 + 6 + 7 = 34\\ \\text{cm}', '']], 1400, (i) => {
          if (i === 0) lab[2] = '4 cm'; if (i === 1) lab[3] = '3 cm';
          a.L(10, 7, 4, 3, lab, [2, 3]);
        });
      },
    },
    {
      title: 'Rectangles and triangles',
      text: '<p>This shape is a rectangle with a triangle on top. The dashed line is <b>inside</b> the shape, so it is <b>not</b> part of the perimeter.</p>',
      async on(a, ctx) { a.off(); a.house(['8 cm', '5 cm', '5 cm', '5 cm', '5 cm']); await a.play(ctx, [['P = 8 + 5 + 5 + 5 + 5', 'five outside edges'], ['P = 28\\ \\text{cm}', '']]); },
    },
    {
      title: 'Try it: change the L-shape',
      text: '<p>Change the size of the shape and of the corner cut out of it. What do you notice about the perimeter?</p>',
      tip: 'Cutting a rectangle from a corner moves two sides inwards but does not change their total length.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'perimeter',
  gens: [
    () => { const l = FD.rnd(3, 30) / 2, w = FD.rnd(2, 20) / 2, P = 2 * (l + w); return { type: 'num', q: `A rectangle is \\(${FD.tn(l)}\\) cm long and \\(${FD.tn(w)}\\) cm wide. Work out its perimeter.`, a: P, unit: 'cm', why: `\\(${FD.tn(l)} + ${FD.tn(w)} + ${FD.tn(l)} + ${FD.tn(w)} = ${FD.tn(P)}\\) cm.` }; },
    () => { const W = FD.rnd(8, 16), H = FD.rnd(6, 12), cw = FD.rnd(2, W - 3), ch = FD.rnd(2, H - 3); return { type: 'num', q: `An L-shape is made by cutting a rectangle from one corner of a larger rectangle. Its six sides, in order, are \\(${W}\\) cm, \\(${H - ch}\\) cm, \\(a\\) cm, \\(b\\) cm, \\(${W - cw}\\) cm and \\(${H}\\) cm. Work out its perimeter.`, a: 2 * (W + H), unit: 'cm', why: `\\(a = ${W} - ${W - cw} = ${cw}\\) and \\(b = ${H} - ${H - ch} = ${ch}\\). \\(P = ${W} + ${H - ch} + ${cw} + ${ch} + ${W - cw} + ${H} = ${2 * (W + H)}\\) cm.` }; },
    () => { const l = FD.rnd(5, 20), w = FD.rnd(2, l - 1), P = 2 * (l + w); return { type: 'num', q: `A rectangle has a perimeter of \\(${P}\\) cm. Its length is \\(${l}\\) cm. Work out its width.`, a: w, unit: 'cm', why: `Length + width \\(= ${P} \\div 2 = ${P / 2}\\), so the width is \\(${P / 2} - ${l} = ${w}\\) cm.` }; },
    () => { const w = 2 * FD.rnd(3, 6), h = FD.rnd(3, 8), r = FD.rnd(w / 2 + 1, w), P = w + 2 * h + 2 * r; return { type: 'num', q: `A shape is a rectangle \\(${w}\\) cm wide and \\(${h}\\) cm tall with an isosceles triangle on top. The two sloping sides of the triangle are \\(${r}\\) cm each. Work out the perimeter of the shape.`, a: P, unit: 'cm', why: `Outside edges only: \\(${w} + ${h} + ${h} + ${r} + ${r} = ${P}\\) cm. The top of the rectangle is inside the shape.` }; },
  ],
});

FD.check({
  section: 'perimeter',
  items: [
    { type: 'num', q: 'A rectangle is 7 cm by 3.5 cm. Find its perimeter.', a: 21, unit: 'cm', why: '\\(2 \\times (7 + 3.5) = 21\\).' },
    { type: 'num', q: 'A square has a perimeter of 36 cm. How long is each side?', a: 9, unit: 'cm', why: '\\(36 \\div 4 = 9\\).' },
    { type: 'mcq', q: 'The perimeter of a shape is…', opts: ['the total distance around its outside', 'the space inside it', 'its longest side', 'the number of sides it has'], why: 'Perimeter is a length, measured all the way round.' },
    { type: 'tf', q: 'For a shape made from a rectangle and a triangle, the line where they join is part of the perimeter.', a: false, why: 'That line is inside the shape.' },
  ],
});
