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
// Cumulative frequency points: [[lo, 0], [b1, cf1], …].
FD.cfPts = (cls) => { const P = [[cls[0][0], 0]]; let c = 0; cls.forEach(([, b, f]) => { c += f; P.push([b, c]); }); return P; };
// Cumulative frequency graph. o.upto points; o.curve; o.readX x-value to read up; o.readY y-value to read across.
FD.cfg = (host) => (cls, o = {}) => {
  const P = FD.cfPts(cls), n = P[P.length - 1][1], ax = FD.axes(P[0][0], P[P.length - 1][0], n, P.map((p) => p[0]), o.xl || 'Time <tspan font-style="italic">t</tspan> (minutes)', 'Cumulative frequency'), f = FD.mono(P);
  const upto = o.upto === undefined ? P.length : o.upto;
  let s = ax.s;
  if (o.curve && n > 0) { let d = ''; const x0 = P[0][0], x1 = P[P.length - 1][0]; for (let k = 0; k <= 120; k++) { const x = x0 + ((x1 - x0) * k) / 120; d += `${k ? 'L' : 'M'}${ax.X(x).toFixed(1)},${ax.Y(f(x)).toFixed(1)}`; } s += `<path class="cf-curve" d="${d}"/>`; }
  if (o.readX !== undefined) { const y = f(o.readX); s += `<path class="cf-read" d="M${ax.X(o.readX)},210 V${ax.Y(y)} H60"/>`; }
  if (o.readY !== undefined) { const x = f.inv(o.readY); s += `<path class="cf-read" d="M60,${ax.Y(o.readY)} H${ax.X(x)} V210"/>`; }
  P.slice(0, upto).forEach(([x, y]) => { s += `<circle class="cf-pt" cx="${ax.X(x)}" cy="${ax.Y(y)}" r="5"/>`; });
  host.innerHTML = `<svg viewBox="0 0 600 252" role="img" aria-label="Cumulative frequency graph through ${P.map((p) => `(${p[0]}, ${p[1]})`).join(', ')}">${s}</svg>`;
  return f;
};
FD.C1 = [[0, 10, 5], [10, 20, 12], [20, 30, 18], [30, 40, 10], [40, 50, 5]];

FD.add({
  id: 'cftable',
  title: 'Cumulative frequency graphs',
  tab: 'CF graphs',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Cumulative frequency', 'A running total of the frequencies.'],
    ['Upper class boundary', 'The top of a class: for \\(10 < t \\le 20\\) it is 20.'],
    ['Cumulative frequency graph', 'Points plotted at (upper class boundary, cumulative frequency), joined with a smooth curve.'],
  ],
  mount(el) {
    const cls = FD.C1.map((c) => c.slice());
    const a = FD.board(el, 'cf-s', '<div class="hc-pair"><div id="tb"></div><div id="ch"></div></div>', `
      <div class="hc-sl">${cls.map((c, i) => `<label class="ctrl">\\(${c[0]} < t \\le ${c[1]}\\) <input type="range" id="f${i}" min="0" max="20" value="${c[2]}"><output id="o${i}">${c[2]}</output></label>`).join('')}</div>`, () => sync());
    a.cfg = FD.cfg(a.$('#ch'));
    a.show = (c, cols, o = {}) => { a.$('#tb').innerHTML = FD.htab(c, cols, { head: 'Time \\(t\\) (min)', ...o }); return a.cfg(c, o); };
    const sync = () => {
      cls.forEach((c, i) => { c[2] = +a.$('#f' + i).value; a.$('#o' + i).textContent = c[2]; });
      const P = FD.cfPts(cls);
      a.show(cls, ['f', 'cf'], { curve: true });
      a.big(`\\text{points: } ${P.map((p) => `(${p[0]}, ${p[1]})`).join(',\\ ')}`);
      a.msg(P[P.length - 1][1] ? `The last cumulative frequency, ${P[P.length - 1][1]}, is the total.` : 'Give at least one class a frequency.', P[P.length - 1][1] ? 'good' : 'bad');
    };
    a.$('.hc-sl').addEventListener('input', sync);
    a.show(FD.C1, ['f'], { upto: 0 });
    return a;
  },
  steps: [
    {
      title: 'Running totals',
      text: '<p>50 students recorded the time they spent on homework one evening. The <b>cumulative frequency</b> is a running total: add each frequency to the total so far.</p>',
      async on(a, ctx) {
        a.reset(); a.show(FD.C1, ['f', 'cf'], { upto: 0, hiCol: 'cf' });
        for (let k = 1; k <= 5; k++) { if (!(await ctx.sleep(800))) return; a.$('#tb').innerHTML = FD.htab(FD.C1, ['f', 'cf'], { head: 'Time \\(t\\) (min)', upto: k, hiCol: 'cf' }); }
        a.big('5,\\ 5 + 12 = 17,\\ 17 + 18 = 35,\\ 35 + 10 = 45,\\ 45 + 5 = 50');
      },
    },
    {
      title: 'What does it mean?',
      text: '<p>The cumulative frequency 35 means that 35 students spent <b>30 minutes or less</b>. That is why we plot it at the <b>upper class boundary</b>, 30.</p>',
      tip: 'Plot at the END of each class, not the midpoint.',
      async on(a, ctx) { a.reset(); a.show(FD.C1, ['f', 'cf'], { upto: 4, hi: 2 }); a.big('(30,\\ 35): \\ 35 \\text{ students took } t \\le 30'); },
    },
    {
      title: 'Plot the points',
      text: '<p>Plot (10, 5), (20, 17), (30, 35), (40, 45) and (50, 50). Also plot (0, 0): nobody took 0 minutes or less.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 6; k++) { a.show(FD.C1, ['cf'], { upto: k }); if (!(await ctx.sleep(650))) return; }
      },
    },
    {
      title: 'Join with a smooth curve',
      text: '<p>Join the points with a smooth curve (or with straight lines). The curve has an S shape: it is steepest where the data is most crowded.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.C1, ['cf'], { curve: true }); },
    },
    {
      title: 'Try it: change the frequencies',
      text: '<p>Change the frequencies. Watch the running totals, the points and the curve change.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'cftable',
  gens: [
    () => { const fs = Array.from({ length: 5 }, () => FD.rnd(2, 20)), k = FD.rnd(1, 4), cf = fs.slice(0, k + 1).reduce((x, y) => x + y, 0), w = FD.pick([5, 10, 20]); const cls = fs.map((f, i) => [w * i, w * (i + 1), f]); return { type: 'num', q: `Work out the cumulative frequency for the class \\(${w * k} < x \\le ${w * (k + 1)}\\).${FD.htab(cls, ['f'], { v: 'x', head: 'Mass \\(x\\) (kg)' })}`, a: cf, why: `Add the frequencies up to that class: \\(${fs.slice(0, k + 1).join(' + ')} = ${cf}\\).` }; },
    () => { const w = FD.pick([5, 10, 20]), k = FD.rnd(1, 4); let c; do { c = FD.rnd(10, 60); } while (c === w * (k + 1)); return { type: 'mcq', q: `The class \\(${w * k} < t \\le ${w * (k + 1)}\\) has a cumulative frequency of ${c}. Which point do you plot?`, opts: [`(${w * (k + 1)}, ${c})`, `(${w * k + w / 2}, ${c})`, `(${w * k}, ${c})`, `(${c}, ${w * (k + 1)})`], why: 'Plot at the upper class boundary, with cumulative frequency up the side.' }; },
    () => { const fs = Array.from({ length: 5 }, () => FD.rnd(2, 20)), cfs = []; fs.reduce((x, y, i) => (cfs[i] = x + y), 0); const k = FD.rnd(1, 4), w = 10; const cls = fs.map((f, i) => [w * i, w * (i + 1), f]); return { type: 'num', q: `The table shows cumulative frequencies. What is the frequency of the class \\(${w * k} < x \\le ${w * (k + 1)}\\)?<table class="dt"><tr><th>Length \\(x\\) (cm)</th><th>Cumulative frequency</th></tr>${cls.map((c, i) => `<tr><td>\\(0 < x \\le ${c[1]}\\)</td><td>${cfs[i]}</td></tr>`).join('')}</table>`, a: fs[k], why: `Subtract the running totals: \\(${cfs[k]} - ${cfs[k - 1]} = ${fs[k]}\\).` }; },
  ],
});

FD.check({
  section: 'cftable',
  items: [
    { type: 'num', q: 'Frequencies 4, 9, 13, 6. What are the cumulative frequencies?', a: [4, 13, 26, 32], fields: ['1st', '2nd', '3rd', '4th'], why: 'Running totals: 4, 4 + 9, 13 + 13, 26 + 6.' },
    { type: 'mcq', q: 'For the class \\(20 < t \\le 30\\) with cumulative frequency 41, which point is plotted?', opts: ['(30, 41)', '(25, 41)', '(20, 41)', '(41, 30)'], why: 'Upper class boundary.' },
    { type: 'tf', q: 'The last cumulative frequency is the total number of values.', a: true, why: 'It is the running total of everything.' },
    { type: 'mcq', q: 'A cumulative frequency of 35 at \\(t = 30\\) means…', opts: ['35 values are 30 or less', '35 values are exactly 30', '35 values are more than 30', 'the mean is 35'], why: 'Running total up to 30.' },
  ],
});
