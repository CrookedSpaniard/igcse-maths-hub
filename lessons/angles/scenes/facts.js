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

// Angle facts: one ray turning about a vertex, a straight line, a point, crossing lines.
FD.add({
  id: 'facts',
  title: 'Angle facts',
  tab: 'Angle facts',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Acute', 'Less than \\(90^\\circ\\).'],
    ['Obtuse', 'Between \\(90^\\circ\\) and \\(180^\\circ\\).'],
    ['Reflex', 'Between \\(180^\\circ\\) and \\(360^\\circ\\).'],
    ['Vertically opposite', 'The angles opposite each other where two straight lines cross. They are equal.'],
  ],
  mount(el) {
    const G = FD.G, V = [210, 160];
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'Angles at a point',
      ctrls: `<div class="row"><label>Show <select id="md"><option value="type">Type of angle</option><option value="line">Angles on a straight line</option><option value="vo">Vertically opposite angles</option></select></label></div>
        <label class="ctrl">Angle <input type="range" id="th" min="1" max="359" value="50"><output id="oth">50°</output></label>`,
    });
    const type = (t) => (t < 90 ? 'acute' : t === 90 ? 'a right angle' : t < 180 ? 'obtuse' : t === 180 ? 'a straight angle' : 'reflex');
    let mode = 'type', th = 50;
    a.show = (m, t, extra = '') => {
      mode = m; th = t;
      const ray = G.polar(V, 135, t);
      let s = '';
      if (m === 'type') {
        s = G.sector(V, 44, 0, t, 'g-arc', t + '°') + G.line(V, [V[0] + 150, V[1]]) + G.line(V, ray) + (t === 90 ? G.right(V, [400, V[1]], ray, 16) : '');
      } else if (m === 'line') {
        s = G.sector(V, 44, 0, t, 'g-arc', t + '°') + G.sector(V, 36, t, 180, 'g-arc2', (180 - t) + '°') + G.line([V[0] - 150, V[1]], [V[0] + 150, V[1]]) + G.line(V, ray);
      } else if (m === 'vo') {
        const back = G.polar(V, 135, t + 180);
        s = G.sector(V, 40, 0, t, 'g-arc', t + '°') + G.sector(V, 40, 180, 180 + t, 'g-arc', t + '°')
          + G.sector(V, 32, t, 180, 'g-arc2', (180 - t) + '°') + G.sector(V, 32, 180 + t, 360, 'g-arc2', (180 - t) + '°')
          + G.line([V[0] - 150, V[1]], [V[0] + 150, V[1]]) + G.line(back, ray);
      } else if (m === 'point') {
        const [p, q] = extra;
        s = G.sector(V, 44, 0, p, 'g-arc', p + '°') + G.sector(V, 36, p, q, 'g-arc2', (q - p) + '°') + G.sector(V, 28, q, 360, 'g-arc3', (360 - q) + '°', 50)
          + G.line(V, [V[0] + 135, V[1]]) + G.line(V, G.polar(V, 135, p)) + G.line(V, G.polar(V, 135, q));
      }
      s += G.dot(V, 'g-dot k', 4);
      if (a.q('.try') && !a.q('.try').hidden) s += G.handle(ray, 'r');
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, x, y) => {
      let t = Math.round(Math.atan2(V[1] - y, x - V[0]) * 180 / Math.PI);
      if (t <= 0) t += 360;
      if (mode !== 'type') t = FD.clamp(t > 270 ? 1 : t, 1, 179);
      a.q('#th').value = t; a.sync();
    });
    a.onSync(() => {
      const m = a.q('#md').value;
      let t = a.val('th');
      if (m !== 'type' && t > 179) { t = 179; a.q('#th').value = t; }
      a.out('th', t + '°');
      a.show(m, t);
      if (m === 'type') a.msg(`\\(${t}^\\circ\\) is ${type(t)}.${t < 360 && t > 180 ? ` The angle on the other side is \\(360^\\circ - ${t}^\\circ = ${360 - t}^\\circ\\).` : ''}`);
      else if (m === 'line') a.msg(`\\(${t}^\\circ + ${180 - t}^\\circ = 180^\\circ\\). Angles on a straight line add up to \\(180^\\circ\\).`);
      else a.msg(`Vertically opposite angles are equal: two of \\(${t}^\\circ\\) and two of \\(${180 - t}^\\circ\\). All four add up to \\(360^\\circ\\).`);
    });
    a.show('type', 50);
    return a;
  },
  steps: [
    {
      title: 'Types of angle',
      text: '<p>An angle measures an amount of <b>turn</b>. A full turn is \\(360^\\circ\\).</p><p>Watch the line turn: <b>acute</b> (less than \\(90^\\circ\\)), <b>right angle</b> (\\(90^\\circ\\)), <b>obtuse</b>, <b>straight</b> (\\(180^\\circ\\)) and <b>reflex</b> (more than \\(180^\\circ\\)).</p>',
      async on(a, ctx) {
        a.off();
        for (const [t, w] of [[40, 'Acute'], [90, 'Right angle'], [135, 'Obtuse'], [180, 'Straight angle'], [250, 'Reflex']]) {
          a.show('type', t); a.msg(`<b>${w}</b>: \\(${t}^\\circ\\)`);
          if (!(await ctx.sleep(1300))) return;
        }
      },
    },
    {
      title: 'Angles on a straight line',
      text: '<p>Angles on a straight line <b>add up to \\(180^\\circ\\)</b>.</p><p>If one angle is \\(125^\\circ\\), the other must be \\(180^\\circ - 125^\\circ\\).</p>',
      tip: 'Write the reason in words: “angles on a straight line add up to 180°”.',
      async on(a, ctx) {
        a.off(); a.show('line', 125);
        await a.play(ctx, [['x + 125 = 180', ''], ['x = 180 - 125 = 55^\\circ', 'angles on a straight line add up to 180°']]);
      },
    },
    {
      title: 'Angles around a point',
      text: '<p>Angles around a point <b>add up to \\(360^\\circ\\)</b>: one full turn.</p><p>Here two angles are \\(110^\\circ\\) and \\(140^\\circ\\). Find the third.</p>',
      async on(a, ctx) {
        a.off(); a.show('point', 0, [110, 250]);
        await a.play(ctx, [['110 + 140 + y = 360', ''], ['y = 360 - 250 = 110^\\circ', 'angles around a point add up to 360°']]);
      },
    },
    {
      title: 'Vertically opposite angles',
      text: '<p>When two straight lines cross they make four angles. Opposite angles are <b>equal</b>: they are <b>vertically opposite</b>.</p><p>Next to each other they make a straight line, so they add up to \\(180^\\circ\\).</p>',
      tip: '“Vertically” means “at the vertex” here: they do not need to be one above the other.',
      async on(a, ctx) {
        a.off(); a.show('vo', 40);
        if (!(await ctx.sleep(900))) return;
        a.show('vo', 65);
        await a.play(ctx, [['a = 65^\\circ', 'vertically opposite angles are equal'], ['b = 180 - 65 = 115^\\circ', 'angles on a straight line']]);
      },
    },
    {
      title: 'Try it: turn the line',
      text: '<p>Drag the blue dot, or use the slider. Choose what to show: the <b>type</b> of angle, angles on a <b>straight line</b>, or <b>vertically opposite</b> angles.</p>',
      tip: 'Try to make exactly 90°, then 180°.',
      on(a) { a.big(''); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'facts',
  gens: [
    () => { const x = FD.rnd(21, 159); return { type: 'num', q: `Two angles lie on a straight line. One is \\(${x}^\\circ\\). Work out the other angle.`, a: 180 - x, unit: '°', why: `Angles on a straight line add up to \\(180^\\circ\\): \\(180 - ${x} = ${180 - x}^\\circ\\).` }; },
    () => { let p, q, r; do { p = FD.rnd(60, 150); q = FD.rnd(50, 140); r = 360 - p - q; } while (r < 20); return { type: 'num', q: `Three angles meet at a point. Two of them are \\(${p}^\\circ\\) and \\(${q}^\\circ\\). Work out the third angle.`, a: r, unit: '°', why: `Angles around a point add up to \\(360^\\circ\\): \\(360 - ${p} - ${q} = ${r}^\\circ\\).` }; },
    () => { let a, b, c, d, x; do { a = FD.rnd(3, 7); c = FD.rnd(2, 5); x = FD.rnd(8, 30); b = FD.rnd(-20, 40); d = (a - c) * x + b; } while (a <= c || b === 0 || d <= 0 || a * x + b < 15 || a * x + b > 165); return { type: 'num', q: `Two straight lines cross. A pair of vertically opposite angles are \\((${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)})^\\circ\\) and \\((${c}x + ${d})^\\circ\\). Find \\(x\\).`, a: x, why: `Vertically opposite angles are equal: \\(${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${c}x + ${d}\\), so \\(${a - c}x = ${d - b}\\) and \\(x = ${x}\\).` }; },
    () => { const t = FD.pick([FD.rnd(5, 85), FD.rnd(95, 175), FD.rnd(185, 355), 90]); const name = t < 90 ? 'Acute' : t === 90 ? 'Right angle' : t < 180 ? 'Obtuse' : 'Reflex'; return { type: 'mcq', q: `What type of angle is \\(${t}^\\circ\\)?`, opts: [name, ...['Acute', 'Right angle', 'Obtuse', 'Reflex'].filter((n) => n !== name)], why: 'Acute < 90°, right angle = 90°, obtuse between 90° and 180°, reflex between 180° and 360°.' }; },
  ],
});

FD.check({
  section: 'facts',
  items: [
    { type: 'mcq', q: 'Which angle is reflex?', opts: ['\\(205^\\circ\\)', '\\(95^\\circ\\)', '\\(175^\\circ\\)', '\\(180^\\circ\\)'], why: 'Reflex angles are between 180° and 360°.' },
    { type: 'num', q: 'Angles on a straight line are \\(3x\\) and \\(x\\). Find \\(x\\).', a: 45, why: '\\(4x = 180\\), so \\(x = 45\\).' },
    { type: 'num', q: 'Four angles around a point are \\(90^\\circ, 75^\\circ, 110^\\circ\\) and \\(y\\). Find \\(y\\).', a: 85, unit: '°', why: '\\(360 - 90 - 75 - 110 = 85^\\circ\\).' },
    { type: 'tf', q: 'Vertically opposite angles always add up to \\(180^\\circ\\).', a: false, why: 'Vertically opposite angles are <b>equal</b>. Angles <b>next to</b> each other on a straight line add up to 180°.' },
    { type: 'mcq', q: 'Two lines cross. One angle is \\(72^\\circ\\). What are the other three?', opts: ['\\(108^\\circ, 72^\\circ, 108^\\circ\\)', '\\(72^\\circ, 72^\\circ, 72^\\circ\\)', '\\(18^\\circ, 72^\\circ, 18^\\circ\\)', '\\(108^\\circ, 108^\\circ, 108^\\circ\\)'], why: 'The opposite angle is 72°; the two neighbours are \\(180 - 72 = 108^\\circ\\).' },
  ],
});
