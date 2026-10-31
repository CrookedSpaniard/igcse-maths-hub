// Scatter graph on 0–100 axes. pts = [[x, y]]; line = [m, c] draws y = mx + c.
FD.scatter = (host) => (pts, line, xl = 'x', yl = 'y') => {
  const X = (v) => 50 + v * 5.2, Y = (v) => 200 - v * 1.7;
  let s = '';
  for (let v = 0; v <= 100; v += 20) s += `<line class="cg-grid" x1="${X(v)}" y1="30" x2="${X(v)}" y2="200"/><line class="cg-grid" x1="50" y1="${Y(v)}" x2="570" y2="${Y(v)}"/><text class="cg-t" x="${X(v)}" y="216">${v}</text><text class="cg-t cg-ty" x="44" y="${Y(v) + 4}">${v}</text>`;
  s += `<line class="cg-ax" x1="50" y1="200" x2="572" y2="200"/><line class="cg-ax" x1="50" y1="28" x2="50" y2="200"/><text class="cg-name" x="310" y="232">${xl}</text><text class="cg-name" x="96" y="20">${yl}</text>`;
  if (line) { const [m, c] = line, xa = Math.max(0, m ? (m > 0 ? -c / m : (100 - c) / m) : 0), xb = Math.min(100, m ? (m > 0 ? (100 - c) / m : -c / m) : 100); s += `<line class="sc-line" x1="${X(xa)}" y1="${Y(m * xa + c)}" x2="${X(xb)}" y2="${Y(m * xb + c)}"/>`; }
  pts.forEach(([x, y]) => { s += `<circle class="sc-pt" cx="${X(x)}" cy="${Y(y)}" r="5"/>`; });
  host.innerHTML = `<svg viewBox="0 0 600 240" role="img" aria-label="Scatter graph of ${yl} against ${xl}">${s}</svg>`;
};
// n points with correlation strength r (−1…1), fixed by a seed so the picture is stable.
FD.corrPts = (r, n = 18, seed = 7) => { let t = seed; const rnd = () => ((t = (t * 9301 + 49297) % 233280) / 233280); return Array.from({ length: n }, () => { const x = 8 + rnd() * 84, noise = (rnd() - 0.5) * 80 * (1 - Math.abs(r)); return [x, Math.max(3, Math.min(97, 50 + r * (x - 50) * 0.9 + noise))]; }); };
// Least-squares line through the points: [m, c].
FD.bestFit = (pts) => { const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n, sxy = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), sxx = pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0); const m = sxy / sxx; return [m, my - m * mx]; };

FD.add({
  id: 'scatter',
  title: 'Scatter graphs and correlation',
  tab: 'Scatter',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Scatter graph', 'Plots pairs of data, like hours revised and test mark, to look for a relationship.'],
    ['Positive correlation', 'As one goes up, the other tends to go up.'],
    ['Negative correlation', 'As one goes up, the other tends to go down.'],
    ['Line of best fit', 'A straight line through the middle of the points, used to estimate values. Only estimate inside the range of the data.'],
    ['Outlier', 'A point that does not fit the pattern.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sc-s', '<div id="sc"></div>', `
      <label class="ctrl">Correlation <input type="range" id="rr" min="-10" max="10" value="7"><output id="or">0.7</output></label>
      <div class="bd-btns"><button class="btn ghost" id="bLine">Show the line of best fit</button></div>`, () => sync());
    a.sc = FD.scatter(a.$('#sc'));
    let line = false;
    const sync = () => {
      const r = +a.$('#rr').value / 10, pts = FD.corrPts(r); a.$('#or').textContent = r;
      a.sc(pts, line && Math.abs(r) > 0.2 ? FD.bestFit(pts) : null);
      const k = Math.abs(r) < 0.25 ? 'no' : `${Math.abs(r) > 0.75 ? 'strong' : 'weak'} ${r > 0 ? 'positive' : 'negative'}`;
      a.big(`\\text{${k} correlation}`);
      a.msg(Math.abs(r) < 0.25 ? 'No pattern: a line of best fit would not be useful.' : r > 0 ? 'As x increases, y tends to increase.' : 'As x increases, y tends to decrease.');
    };
    a.$('#rr').addEventListener('input', sync);
    a.$('#bLine').addEventListener('click', () => { line = !line; sync(); });
    a.sc([]);
    return a;
  },
  steps: [
    {
      title: 'Plotting pairs',
      text: '<p>Each student gives two numbers: hours of revision and test mark. Each pair is <b>one point</b> on a scatter graph.</p>',
      async on(a, ctx) {
        a.reset();
        const P = FD.corrPts(0.8);
        for (let k = 1; k <= P.length; k++) { a.sc(P.slice(0, k), null, 'revision (× 0.1 h)', 'mark %'); if (!(await ctx.sleep(160))) return; }
      },
    },
    {
      title: 'Types of correlation',
      text: '<p><b>Positive</b>: both go up together. <b>Negative</b>: one goes up as the other goes down. <b>No correlation</b>: no pattern.</p><p>Strong correlation: the points are close to a straight line.</p>',
      async on(a, ctx) {
        a.reset();
        for (const [r, t] of [[0.85, 'strong positive'], [-0.8, 'strong negative'], [0, 'no correlation'], [0.4, 'weak positive']]) { a.sc(FD.corrPts(r)); a.big(`\\text{${t}}`); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Line of best fit',
      text: '<p>Draw a straight line through the <b>middle</b> of the points, with about as many above as below. Use it to <b>estimate</b>.</p>',
      tip: 'Estimating inside the data is interpolation (reliable). Going beyond the data is extrapolation (not reliable).',
      async on(a, ctx) {
        a.reset(); const P = FD.corrPts(0.8), L = FD.bestFit(P);
        a.sc(P, L, 'revision (× 0.1 h)', 'mark %');
        await a.lines([[`\\text{at } x = 60: \\; y \\approx ${Math.round(L[0] * 60 + L[1])}`, 'read up to the line, then across']], ctx, 1300);
      },
    },
    {
      title: 'Correlation is not cause',
      text: '<p>Ice-cream sales and sunburn cases show positive correlation, but ice cream does not cause sunburn: both go up in hot weather.</p><p>Look out for <b>outliers</b>, points far from the pattern.</p>',
      async on(a, ctx) { a.reset(); a.sc([...FD.corrPts(0.85), [85, 15]], null, 'ice creams', 'sunburn'); a.msg('The point at (85, 15) is an outlier.'); },
    },
    {
      title: 'Try it: change the correlation',
      text: '<p>Move the slider from −1 to 1. Show the line of best fit when the correlation is strong enough.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'scatter',
  gens: [
    () => { const c = FD.pick([['the temperature', 'the number of hot drinks sold', 'negative'], ['the height of a person', 'their arm span', 'positive'], ['the age of a car', 'its value', 'negative'], ['the hours of revision', 'the test mark', 'positive'], ['a person’s shoe size', 'their maths mark', 'no']]); const all = ['positive', 'negative', 'no']; return { type: 'mcq', q: `What type of correlation would you expect between ${c[0]} and ${c[1]}?`, opts: [c[2], ...all.filter((x) => x !== c[2])].map((x) => `${x[0].toUpperCase() + x.slice(1)} correlation`), why: c[2] === 'no' ? 'There is no reason for one to affect the other.' : `As ${c[0]} goes up, ${c[1]} tends to go ${c[2] === 'positive' ? 'up' : 'down'}.` }; },
    () => { const m = FD.pick([0.5, 0.8, 1.2, 1.5]), c = FD.rnd(5, 20), x = FD.pick([20, 30, 40, 50]); return { type: 'num', q: `A line of best fit has the equation \\(y = ${m}x + ${c}\\). Use it to estimate y when x = ${x}.`, a: FD.round(m * x + c, 2), why: `\\(${m} \\times ${x} + ${c} = ${FD.round(m * x + c, 2)}\\).` }; },
  ],
});

FD.check({
  section: 'scatter',
  items: [
    { type: 'mcq', q: 'Points go from the top left to the bottom right. The correlation is…', opts: ['negative', 'positive', 'none', 'cannot tell'], why: 'As x increases, y decreases.' },
    { type: 'tf', q: 'A line of best fit must go through the origin.', a: false, why: 'It goes through the middle of the points.' },
    { type: 'mcq', q: 'Data goes from x = 10 to x = 50. Which estimate is least reliable?', opts: ['y when x = 90', 'y when x = 30', 'y when x = 45', 'y when x = 12'], why: '90 is outside the data (extrapolation).' },
    { type: 'tf', q: 'Strong correlation proves that one variable causes the other.', a: false, why: 'Correlation is not causation.' },
  ],
});
