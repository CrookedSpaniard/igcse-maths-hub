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

// Converting units: a ladder of metric units, and squares that show why 1 cm² = 100 mm².
FD.UNITS = {
  length: { u: ['km', 'm', 'cm', 'mm'], f: [1000, 100, 10] },
  mass: { u: ['t', 'kg', 'g', 'mg'], f: [1000, 1000, 1000] },
  capacity: { u: ['l', 'cl', 'ml'], f: [100, 10] },
  area: { u: ['km²', 'm²', 'cm²', 'mm²'], f: [1000000, 10000, 100] },
  volume: { u: ['m³', 'cm³', 'mm³'], f: [1000000, 1000] },
};
FD.add({
  id: 'units',
  title: 'Converting units',
  tab: 'Units',
  icon: 'calc',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Metric units', 'Units based on 10, 100 and 1000: millimetres, centimetres, metres, kilometres; grams, kilograms; millilitres, litres.'],
    ['Capacity', 'How much a container holds. \\(1\\ \\text{litre} = 1000\\ \\text{ml} = 1000\\ \\text{cm}^3\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A ladder of units with the conversion factors',
      ctrls: `<div class="row"><label>Measure <select id="ty">${Object.keys(FD.UNITS).map((k) => `<option>${k}</option>`).join('')}</select></label>
        <label>From <select id="fr"></select></label><label>To <select id="to"></select></label></div>
        <label class="ctrl">Amount <input type="range" id="v" min="1" max="60" value="12"><output id="ov">12</output></label>`,
    });
    // Ladder: one step per unit; big units at the top. hi = [from, to] indices to highlight.
    a.ladder = (type, hi = null) => {
      const U = FD.UNITS[type], n = U.u.length, h = 220 / (n - 1);
      let s = '';
      U.u.forEach((u, i) => {
        const y = 35 + i * h, on = hi && i >= Math.min(...hi) && i <= Math.max(...hi);
        s += `<rect class="${on ? 'g-fill' : 'g-fill2'}" x="60" y="${y - 18}" width="110" height="36" rx="10"/>` + G.t([115, y], u);
        if (i < n - 1) {
          const m = y + h / 2, step = on && i < Math.max(...hi);
          s += G.vec([185, y + 6], [185, y + h - 6], step ? 'g-vec' : 'g-vec2') + G.t([195, m], '× ' + FD.num(U.f[i]), 'st ' + (step ? 'l' : 's'));
          s += G.vec([300, y + h - 6], [300, y + 6], step ? 'g-vec' : 'g-vec2') + G.t([310, m], '÷ ' + FD.num(U.f[i]), 'st ' + (step ? 'l' : 's'));
        }
      });
      s += G.t([60, 290], 'bigger unit → smaller unit: multiply', 's st');
      a.draw(s);
    };
    // Squares: 1 cm by 1 cm drawn as 10 by 10 mm.
    a.square = (k = 10) => {
      let s = `<rect class="g-fill" x="110" y="40" width="200" height="200"/>`;
      for (let i = 1; i < k; i++) s += G.line([110 + i * 20, 40], [110 + i * 20, 240], 'g-thin') + G.line([110, 40 + i * 20], [310, 40 + i * 20], 'g-thin');
      s += G.t([210, 262], '1 cm = 10 mm') + G.t([350, 140], '1 cm', 's') + G.t([210, 22], '1 cm² = 10 × 10 = 100 mm²', 'l');
      a.draw(s);
    };
    const fill = () => {
      const U = FD.UNITS[a.q('#ty').value];
      a.q('#fr').innerHTML = U.u.map((u, i) => `<option value="${i}">${u}</option>`).join('');
      a.q('#to').innerHTML = U.u.map((u, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${u}</option>`).join('');
    };
    a.q('#ty').addEventListener('change', () => { fill(); a.sync(); });
    a.onSync(() => {
      const t = a.q('#ty').value, U = FD.UNITS[t], f = +a.q('#fr').value, to = +a.q('#to').value, v = a.val('v');
      a.out('v', v); a.ladder(t, [f, to]);
      let k = 1; for (let i = Math.min(f, to); i < Math.max(f, to); i++) k *= U.f[i];
      const r = f < to ? v * k : v / k;
      a.big(`${v}\\ \\text{${U.u[f]}} = ${FD.tn(r)}\\ \\text{${U.u[to]}}`);
      a.msg(f === to ? 'Choose two different units.' : `${f < to ? 'Bigger to smaller unit: <b>multiply</b>' : 'Smaller to bigger unit: <b>divide</b>'} by ${FD.num(k)}.`);
    });
    fill();
    a.ladder('length');
    return a;
  },
  steps: [
    {
      title: 'The metric ladder',
      text: '<p>Metric units go up and down in steps of <b>10, 100 or 1000</b>.</p><p>\\(1\\ \\text{km} = 1000\\ \\text{m}\\), \\(1\\ \\text{m} = 100\\ \\text{cm}\\), \\(1\\ \\text{cm} = 10\\ \\text{mm}\\).</p>',
      tip: 'Going down to a smaller unit you need MORE of them, so multiply.',
      async on(a, ctx) { a.off(); for (const t of ['length', 'mass', 'capacity']) { a.ladder(t); if (!(await ctx.sleep(1400))) return; } },
    },
    {
      title: 'Worked example: two steps',
      text: '<p>Convert \\(3.4\\ \\text{km}\\) to centimetres. Go down two steps of the ladder.</p>',
      async on(a, ctx) {
        a.off(); a.ladder('length', [0, 2]);
        await a.play(ctx, [['3.4\\ \\text{km} = 3.4 \\times 1000 = 3400\\ \\text{m}', '× 1000'], ['3400\\ \\text{m} = 3400 \\times 100 = 340\\,000\\ \\text{cm}', '× 100']]);
      },
    },
    {
      title: 'Area units: square the factor',
      text: '<p>A square of side 1 cm is <b>10 mm by 10 mm</b>, so it holds \\(10 \\times 10 = 100\\) small squares.</p><p>\\(1\\ \\text{cm}^2 = 100\\ \\text{mm}^2\\) and \\(1\\ \\text{m}^2 = 100^2 = 10\\,000\\ \\text{cm}^2\\).</p>',
      tip: 'Common mistake: 1 m² is NOT 100 cm².',
      async on(a, ctx) { a.off(); for (let k = 1; k <= 10; k++) { a.square(k); if (!(await ctx.sleep(220))) return; } },
    },
    {
      title: 'Volume units: cube the factor',
      text: '<p>A cube of side 1 cm is \\(10 \\times 10 \\times 10\\) mm, so \\(1\\ \\text{cm}^3 = 1000\\ \\text{mm}^3\\).</p><p>\\(1\\ \\text{m}^3 = 100^3 = 1\\,000\\,000\\ \\text{cm}^3\\). Also \\(1\\ \\text{cm}^3 = 1\\ \\text{ml}\\).</p>',
      async on(a, ctx) {
        a.off(); a.ladder('volume', [0, 1]);
        await a.play(ctx, [['2.5\\ \\text{m}^3 = 2.5 \\times 100^3', 'cube the length factor'], ['= 2.5 \\times 1\\,000\\,000 = 2\\,500\\,000\\ \\text{cm}^3', '']]);
      },
    },
    {
      title: 'Try it: convert',
      text: '<p>Choose a measure and two units, then change the amount. The ladder shows which steps you use.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'units',
  gens: [
    () => { const [v, f, t, k, fu, tu] = FD.pick([[FD.rnd(2, 95) / 10, 'km', 'm', 1000], [FD.rnd(12, 480), 'cm', 'm', 0.01], [FD.rnd(5, 99) / 10, 'kg', 'g', 1000], [FD.rnd(150, 4500), 'ml', 'l', 0.001], [FD.rnd(25, 950), 'mm', 'cm', 0.1], [FD.rnd(2, 75) / 10, 'm', 'cm', 100]]).concat([]); return { type: 'num', q: `Convert \\(${FD.tn(v)}\\ \\text{${f}}\\) to ${t === 'l' ? 'litres' : t}.`, a: FD.round(v * k, 6), unit: t, why: `${k > 1 ? `Bigger to smaller unit: multiply by ${FD.num(k)}` : `Smaller to bigger unit: divide by ${FD.num(1 / k)}`}. \\(${FD.tn(v)} ${k > 1 ? '\\times ' + FD.tn(k) : '\\div ' + FD.tn(1 / k)} = ${FD.tn(FD.round(v * k, 6))}\\).` }; },
    () => { const v = FD.rnd(2, 40) / 2; return { type: 'num', q: `Convert \\(${FD.tn(v)}\\ \\text{m}^2\\) to \\(\\text{cm}^2\\).`, a: v * 10000, unit: 'cm²', why: `\\(1\\ \\text{m}^2 = 100 \\times 100 = 10\\,000\\ \\text{cm}^2\\), so \\(${FD.tn(v)} \\times 10\\,000 = ${FD.tn(v * 10000)}\\ \\text{cm}^2\\).` }; },
    () => { const v = FD.rnd(2, 90) * 1000; return { type: 'num', q: `Convert \\(${FD.tn(v)}\\ \\text{mm}^3\\) to \\(\\text{cm}^3\\).`, a: v / 1000, unit: 'cm³', why: `\\(1\\ \\text{cm}^3 = 10^3 = 1000\\ \\text{mm}^3\\), so divide by 1000: \\(${FD.tn(v / 1000)}\\ \\text{cm}^3\\).` }; },
    () => { const v = FD.rnd(3, 60) / 2; return { type: 'num', q: `How many millilitres are in \\(${FD.tn(v)}\\) litres?`, a: v * 1000, unit: 'ml', why: `\\(1\\ \\text{l} = 1000\\ \\text{ml}\\): \\(${FD.tn(v)} \\times 1000 = ${FD.tn(v * 1000)}\\ \\text{ml}\\).` }; },
  ],
});

FD.check({
  section: 'units',
  items: [
    { type: 'num', q: 'Convert \\(4.7\\ \\text{km}\\) to metres.', a: 4700, unit: 'm', why: '\\(4.7 \\times 1000 = 4700\\).' },
    { type: 'num', q: 'Convert \\(2350\\ \\text{g}\\) to kilograms.', a: 2.35, unit: 'kg', why: '\\(2350 \\div 1000 = 2.35\\).' },
    { type: 'mcq', q: '\\(1\\ \\text{m}^2 =\\)', opts: ['\\(10\\,000\\ \\text{cm}^2\\)', '\\(100\\ \\text{cm}^2\\)', '\\(1000\\ \\text{cm}^2\\)', '\\(1\\,000\\,000\\ \\text{cm}^2\\)'], why: '\\(100 \\times 100 = 10\\,000\\).' },
    { type: 'num', q: 'Convert \\(0.6\\ \\text{m}^3\\) to \\(\\text{cm}^3\\).', a: 600000, unit: 'cm³', why: '\\(0.6 \\times 1\\,000\\,000 = 600\\,000\\).' },
    { type: 'tf', q: '\\(1\\ \\text{cm}^3\\) of water is the same as \\(1\\ \\text{ml}\\).', a: true, why: '\\(1\\ \\text{cm}^3 = 1\\ \\text{ml}\\), so \\(1000\\ \\text{cm}^3 = 1\\) litre.' },
  ],
});
