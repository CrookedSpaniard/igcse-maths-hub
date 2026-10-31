// Ordered stem-and-leaf diagram of 2-digit data. hi = index (in sorted order) to highlight.
FD.stemLeaf = (host) => (data, ordered = true, hi = -1) => {
  const d = ordered ? [...data].sort((x, y) => x - y) : data, stems = [...new Set(d.map((x) => Math.floor(x / 10)))].sort((x, y) => x - y);
  const lo = stems[0], up = stems[stems.length - 1];
  let rows = '', idx = 0;
  for (let s = lo; s <= up; s++) { const leaves = d.filter((x) => Math.floor(x / 10) === s); rows += `<tr><td class="st">${s}</td><td>${leaves.map((x) => `<i class="${ordered && d.indexOf(x) <= hi && d.indexOf(x) >= hi ? 'hi' : ''}">${x % 10}</i>`).join(' ')}</td></tr>`; idx += leaves.length; }
  host.innerHTML = `<table class="sl">${rows}</table><p class="sl-key">Key: ${lo} | ${d[0] % 10} means ${lo}${d[0] % 10}</p>`;
};
// Frequency polygon for grouped data: classes [[lo, hi, f]], plotted at midpoints.
FD.freqPoly = (host) => (classes, upto = classes.length, bars = false) => {
  const lo = classes[0][0], hi = classes[classes.length - 1][1], fmax = Math.ceil(Math.max(...classes.map((c) => c[2])) / 5) * 5;
  const X = (v) => 50 + ((v - lo) / (hi - lo)) * 520, Y = (f) => 200 - (f / fmax) * 170;
  let s = '';
  for (let f = 0; f <= fmax; f += fmax / 5) s += `<line class="cg-grid" x1="50" y1="${Y(f)}" x2="570" y2="${Y(f)}"/><text class="cg-t cg-ty" x="44" y="${Y(f) + 4}">${f}</text>`;
  classes.forEach(([a, b]) => { s += `<text class="cg-t" x="${X(a)}" y="218">${a}</text>`; });
  s += `<text class="cg-t" x="${X(hi)}" y="218">${hi}</text><line class="cg-ax" x1="50" y1="200" x2="570" y2="200"/><line class="cg-ax" x1="50" y1="20" x2="50" y2="200"/>`;
  if (bars) classes.forEach(([a, b, f]) => { s += `<rect class="cg-bar" x="${X(a)}" y="${Y(f)}" width="${X(b) - X(a)}" height="${200 - Y(f)}" opacity=".35"/>`; });
  const pts = classes.slice(0, upto).map(([a, b, f]) => [X((a + b) / 2), Y(f)]);
  if (pts.length > 1) s += `<polyline class="fp-line" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
  pts.forEach(([x, y]) => { s += `<circle class="sc-pt" cx="${x}" cy="${y}" r="5"/>`; });
  host.innerHTML = `<svg viewBox="0 0 600 230" role="img" aria-label="Frequency polygon">${s}</svg>`;
};
FD.SL = [23, 31, 45, 28, 36, 52, 41, 33, 29, 47, 38, 24, 35, 50, 31];

FD.add({
  id: 'stemleaf',
  title: 'Stem-and-leaf and frequency polygons',
  tab: 'Stem & leaf',
  icon: 'stats',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Stem-and-leaf diagram', 'Splits each value into a stem (the tens) and a leaf (the units). Keeps every value.'],
    ['Ordered', 'The leaves in each row are written smallest first.'],
    ['Key', 'Says how to read it, e.g. 3 | 5 means 35.'],
    ['Frequency polygon', 'Points plotted at the <b>midpoint</b> of each class, joined with straight lines.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sl-s', '<div id="sl"></div>', `
      <div class="bd-btns"><button class="btn" id="bNew">New data ↻</button><button class="btn ghost" id="bOrd">Order the leaves</button></div>`, () => start());
    a.sl = FD.stemLeaf(a.$('#sl'));
    a.fp = FD.freqPoly(a.$('#sl'));
    let data = FD.SL;
    const start = () => { data = Array.from({ length: 14 }, () => FD.rnd(12, 58)); a.sl(data, false); a.msg('Unordered: leaves in the order the data came.'); a.big(''); };
    a.$('#bNew').addEventListener('click', start);
    a.$('#bOrd').addEventListener('click', () => { const d = [...data].sort((x, y) => x - y), m = d.length % 2 ? d[(d.length - 1) / 2] : (d[d.length / 2 - 1] + d[d.length / 2]) / 2; a.sl(data, true); a.big(`\\text{smallest } ${d[0]}, \\; \\text{largest } ${d[d.length - 1]}, \\; \\text{range } ${d[d.length - 1] - d[0]}, \\; \\text{median } ${m}`); a.msg('Ordered: now the diagram is easy to read.'); });
    a.sl(FD.SL, false);
    return a;
  },
  steps: [
    {
      title: 'Building a stem-and-leaf diagram',
      text: '<p>Ages of 15 people: 23, 31, 45, 28, 36, 52, 41, 33, 29, 47, 38, 24, 35, 50, 31.</p><p>The <b>stem</b> is the tens digit and the <b>leaf</b> is the units digit. First write the leaves in the order they come.</p>',
      async on(a, ctx) { a.reset(); a.sl(FD.SL, false); },
    },
    {
      title: 'Order it and add a key',
      text: '<p>Rewrite each row with the leaves in order. Add a <b>key</b>: 2 | 3 means 23.</p><p>The diagram now shows the shape of the data, and you can read the smallest, largest and middle values.</p>',
      tip: 'Count the leaves: there must be one for every value.',
      async on(a, ctx) {
        a.reset(); a.sl(FD.SL, true);
        await a.lines([['\\text{smallest} = 23, \\; \\text{largest} = 52', ''], ['\\text{range} = 52 - 23 = 29', ''], ['\\text{median: 8th value} = 35', '15 values']], ctx, 1300);
      },
    },
    {
      title: 'Frequency polygons',
      text: '<p>For grouped data, plot each frequency at the <b>midpoint</b> of its class and join the points with straight lines.</p><p>Classes 0–10, 10–20, 20–30, 30–40 with frequencies 4, 9, 6, 1: midpoints 5, 15, 25, 35.</p>',
      async on(a, ctx) {
        a.reset();
        const C = [[0, 10, 4], [10, 20, 9], [20, 30, 6], [30, 40, 1]];
        for (let k = 0; k <= 4; k++) { a.fp(C, k, true); if (!(await ctx.sleep(700))) return; }
        a.big('(5, 4), \\; (15, 9), \\; (25, 6), \\; (35, 1)');
      },
    },
    {
      title: 'Try it: order the leaves',
      text: '<p>Press <b>New data</b> for a random set, then <b>Order the leaves</b>. Read off the range and the median.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'stemleaf',
  gens: [
    () => { const d = Array.from({ length: FD.rnd(9, 13) }, () => FD.rnd(11, 69)).sort((x, y) => x - y), ask = FD.pick(['range', 'largest', 'smallest']); const ans = ask === 'range' ? d[d.length - 1] - d[0] : ask === 'largest' ? d[d.length - 1] : d[0]; const stems = [...new Set(d.map((x) => Math.floor(x / 10)))]; return { type: 'num', q: `An ordered stem-and-leaf diagram (key 1 | 4 means 14) has these rows: ${stems.map((s) => `${s} | ${d.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(' ')}`).join(' ; ')}. What is the ${ask}?`, a: ans, why: `Smallest ${d[0]}, largest ${d[d.length - 1]}${ask === 'range' ? `, range \\(${d[d.length - 1]} - ${d[0]} = ${ans}\\)` : ''}.` }; },
    () => { const lo = FD.pick([0, 10, 20, 40]), w = FD.pick([10, 20, 5]); return { type: 'num', q: `On a frequency polygon, where is the frequency for the class \\(${lo} < x \\le ${lo + w}\\) plotted? Give the x-coordinate.`, a: lo + w / 2, why: `At the midpoint: \\((${lo} + ${lo + w}) \\div 2 = ${lo + w / 2}\\).` }; },
  ],
});

FD.check({
  section: 'stemleaf',
  items: [
    { type: 'num', q: 'In a stem-and-leaf diagram with key 4 | 7 means 47, what value is 6 | 2?', a: 62, why: 'Stem 6 (tens), leaf 2 (units).' },
    { type: 'mcq', q: 'Why does a stem-and-leaf diagram need a key?', opts: ['To show what the stem and leaf stand for', 'To make it look neat', 'To order the leaves', 'To show the mean'], why: '3 | 5 could mean 35, 3.5 or 350.' },
    { type: 'num', q: 'A frequency polygon point for \\(20 < x \\le 30\\) has x-coordinate…', a: 25, why: 'The midpoint of the class.' },
    { type: 'tf', q: 'A stem-and-leaf diagram keeps every original value.', a: true, why: 'Each leaf is one value.' },
  ],
});
