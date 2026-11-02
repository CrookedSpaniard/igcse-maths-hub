// Axes for a graph 600 × 250: x from xlo to xhi, y from 0 to a tidy value above ymax.
FD.niceStep = (m) => [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200].find((s) => m / s <= 6) || 500;
FD.axes = (xlo, xhi, ymax, xticks, xl, yl) => {
  const st = FD.niceStep(ymax || 1), top = FD.dec(Math.ceil(FD.dec((ymax || 1) / st)) * st);
  const X = (v) => 60 + ((v - xlo) / (xhi - xlo)) * 510, Y = (v) => 210 - (v / top) * 180;
  let s = '';
  for (let k = 0; FD.dec(k * st) <= top; k++) { const v = FD.dec(k * st); s += `<line class="cg-grid" x1="60" y1="${Y(v)}" x2="570" y2="${Y(v)}"/><text class="cg-t cg-ty" x="54" y="${Y(v) + 4}">${v}</text>`; }
  xticks.forEach((v) => { s += `<text class="cg-t" x="${X(v)}" y="228">${v}</text>`; });
  s += `<line class="cg-ax" x1="60" y1="210" x2="572" y2="210"/><line class="cg-ax" x1="60" y1="24" x2="60" y2="210"/><text class="cg-name" x="315" y="246" text-anchor="middle">${xl}</text><text class="cg-name" x="62" y="14">${yl}</text>`;
  return { s, X, Y, top };
};
// A smooth increasing curve through the points P = [[x, y], …] (monotone cubic). Returns f(x), with f.inv(y).
FD.mono = (P) => {
  const n = P.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d[i] = (P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const p = m[i] / d[i], q = m[i + 1] / d[i], t = p * p + q * q;
    if (t > 9) { const k = 3 / Math.sqrt(t); m[i] = k * p * d[i]; m[i + 1] = k * q * d[i]; }
  }
  const f = (x) => {
    x = FD.clamp(x, P[0][0], P[n - 1][0]);
    let i = 0; while (i < n - 2 && x > P[i + 1][0]) i++;
    const h = P[i + 1][0] - P[i][0], t = (x - P[i][0]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * P[i][1] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * P[i + 1][1] + (t3 - t2) * h * m[i + 1];
  };
  f.inv = (y) => { let lo = P[0][0], hi = P[n - 1][0]; for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (f(mid) < y) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  return f;
};
FD.cfPts = (cls) => { const P = [[cls[0][0], 0]]; let c = 0; cls.forEach(([, b, f]) => { c += f; P.push([b, c]); }); return P; };
// Cumulative frequency curve. o.readY: a value or a list of values to read across then down.
FD.cfg = (host) => (cls, o = {}) => {
  const P = FD.cfPts(cls), n = P[P.length - 1][1], ax = FD.axes(P[0][0], P[P.length - 1][0], n, P.map((p) => p[0]), o.xl || 'Mark (%)', 'Cumulative frequency'), f = FD.mono(P);
  let d = ''; const x0 = P[0][0], x1 = P[P.length - 1][0];
  for (let k = 0; k <= 120; k++) { const x = x0 + ((x1 - x0) * k) / 120; d += `${k ? 'L' : 'M'}${ax.X(x).toFixed(1)},${ax.Y(f(x)).toFixed(1)}`; }
  let s = ax.s + `<path class="cf-curve" d="${d}"/>`;
  [].concat(o.readY === undefined ? [] : o.readY).forEach((y) => { const x = f.inv(y); s += `<path class="cf-read" d="M60,${ax.Y(y)} H${ax.X(x)} V210"/>`; });
  P.forEach(([x, y]) => { s += `<circle class="cf-pt" cx="${ax.X(x)}" cy="${ax.Y(y)}" r="4.5"/>`; });
  host.innerHTML = `<svg viewBox="0 0 600 252" role="img" aria-label="Cumulative frequency graph through ${P.map((p) => `(${p[0]}, ${p[1]})`).join(', ')}">${s}</svg>`;
  return f;
};
FD.CA = [[0, 20, 4], [20, 40, 14], [40, 60, 30], [60, 80, 22], [80, 100, 10]];
FD.CB = [[0, 20, 10], [20, 40, 22], [40, 60, 24], [60, 80, 16], [80, 100, 8]];

FD.add({
  id: 'cfmedian',
  title: 'Median and quartiles from a graph',
  tab: 'From a graph',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Median from a graph', 'Go across from \\(\\frac{n}{2}\\) to the curve, then down.'],
    ['Quartiles from a graph', 'Lower quartile at \\(\\frac{n}{4}\\), upper quartile at \\(\\frac{3n}{4}\\).'],
    ['Estimate', 'Values read from a cumulative frequency graph are estimates, because the data is grouped.'],
  ],
  mount(el) {
    const a = FD.board(el, 'cm-s', '<div id="ch"></div>', `
      <label class="ctrl">Percentage of students <input type="range" id="rp" min="5" max="95" step="5" value="50"><output id="op">50%</output></label>`, () => sync());
    a.cfg = FD.cfg(a.$('#ch'));
    const sync = () => {
      const p = +a.$('#rp').value, y = (p / 100) * 80, x = a.cfg(FD.CA, { readY: y }).inv(y); a.$('#op').textContent = p + '%';
      a.big(`${p}\\% \\text{ of } 80 = ${FD.dec(y)} \\ \\Rightarrow \\ \\text{mark} \\approx ${Math.round(x)}`);
      a.msg(p === 25 ? 'This is the lower quartile.' : p === 50 ? 'This is the median.' : p === 75 ? 'This is the upper quartile.' : `About ${p}% of the students scored ${Math.round(x)} or less.`);
    };
    a.$('#rp').addEventListener('input', sync);
    a.cfg(FD.CA);
    return a;
  },
  steps: [
    {
      title: 'The graph',
      text: '<p>This cumulative frequency graph shows the test marks of 80 students. The last point shows the total, \\(n = 80\\).</p>',
      async on(a, ctx) { a.reset(); a.cfg(FD.CA); },
    },
    {
      title: 'Estimate the median',
      text: '<p>The median is halfway through the data: \\(\\frac{80}{2} = 40\\). Go across from 40 on the cumulative frequency axis to the curve, then down to read the mark.</p>',
      tip: 'For a graph use \\(\\frac n2\\), not \\(\\frac{n + 1}{2}\\).',
      async on(a, ctx) { a.reset(); a.cfg(FD.CA); if (!(await ctx.sleep(800))) return; a.cfg(FD.CA, { readY: 40 }); a.big('\\text{median} \\approx 55 \\text{ marks}'); },
    },
    {
      title: 'The quartiles',
      text: '<p>Lower quartile: across from \\(\\frac{80}{4} = 20\\). Upper quartile: across from \\(\\frac{3 \\times 80}{4} = 60\\).</p>',
      async on(a, ctx) {
        a.reset(); a.cfg(FD.CA, { readY: [20, 60] });
        await a.lines([['Q_1 \\approx 42', 'at 20'], ['Q_3 \\approx 70', 'at 60']], ctx, 1300);
      },
    },
    {
      title: 'The interquartile range',
      text: '<p>The IQR is \\(70 - 42 = 28\\) marks. The middle half of the students scored between about 42 and 70.</p>',
      async on(a, ctx) { a.reset(); a.cfg(FD.CA, { readY: [20, 40, 60] }); a.big('\\text{IQR} \\approx 70 - 42 = 28 \\text{ marks}'); },
    },
    {
      title: 'Try it: read any percentage',
      text: '<p>Choose a percentage of the students. The dashed line finds the mark that this percentage scored at or below. Try 25%, 50% and 75%.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'cfmedian',
  gens: [
    () => { const n = FD.pick([40, 60, 80, 100, 120, 160, 200]); return { type: 'num', q: `A cumulative frequency graph shows ${n} values. At what cumulative frequencies do you read the lower quartile, the median and the upper quartile?`, a: [n / 4, n / 2, (3 * n) / 4], fields: ['\\(Q_1\\) at', 'median at', '\\(Q_3\\) at'], why: `\\(\\frac{${n}}{4} = ${n / 4}\\), \\(\\frac{${n}}{2} = ${n / 2}\\), \\(\\frac{3 \\times ${n}}{4} = ${(3 * n) / 4}\\).` }; },
    () => { const q1 = FD.rnd(15, 40), q3 = q1 + FD.rnd(8, 35); return { type: 'num', q: `From a cumulative frequency graph, the lower quartile is ${q1} kg and the upper quartile is ${q3} kg. Estimate the interquartile range.`, a: q3 - q1, why: `\\(${q3} - ${q1} = ${q3 - q1}\\) kg.` }; },
    () => { const n = FD.pick([60, 80, 100, 120]); return { type: 'mcq', q: `A cumulative frequency graph for ${n} people: to estimate the median, you…`, opts: [`go across from ${n / 2} to the curve, then down`, `go up from ${n / 2} to the curve, then across`, `go across from ${n / 2 + 0.5} to the curve, then down`, `read the highest point of the curve`], why: `The median is at \\(\\frac{n}{2} = ${n / 2}\\) on the cumulative frequency axis.` }; },
  ],
});

FD.check({
  section: 'cfmedian',
  items: [
    { type: 'num', q: 'A cumulative frequency graph shows 120 values. At what cumulative frequency do you read the upper quartile?', a: 90, why: '\\(\\frac{3 \\times 120}{4}\\).' },
    { type: 'num', q: 'From a graph, \\(Q_1 \\approx 18\\) and \\(Q_3 \\approx 31\\). Estimate the IQR.', a: 13, why: '\\(31 - 18\\).' },
    { type: 'tf', q: 'A median read from a cumulative frequency graph is only an estimate.', a: true, why: 'The data is grouped.' },
    { type: 'mcq', q: 'For a graph of 60 values, the median is read at a cumulative frequency of…', opts: ['30', '30.5', '60', '15'], why: '\\(\\frac{60}{2}\\).' },
  ],
});
