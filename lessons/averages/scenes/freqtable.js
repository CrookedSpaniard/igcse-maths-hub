// A frequency table drawn as columns. cols: [{ h, v: [...], tot }]; hi: row index to highlight; show: how many columns to show.
FD.ftab = (host) => (cols, hi = -1, show = cols.length) => {
  const c = cols.slice(0, show), n = c[0].v.length, tot = c.some((k) => k.tot !== undefined);
  host.innerHTML = `<table class="dt"><thead><tr>${c.map((k) => `<th>${k.h}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: n }, (_, i) => `<tr>${c.map((k) => `<td class="${i === hi ? 'hi' : ''}">${k.v[i]}</td>`).join('')}</tr>`).join('')}${tot ? `<tr class="tot">${c.map((k) => `<td>${k.tot !== undefined ? k.tot : ''}</td>`).join('')}</tr>` : ''}</tbody></table>`;
};
// Averages of a discrete frequency table.
FD.fstats = (xs, fs) => {
  const n = fs.reduce((a, b) => a + b, 0), fx = xs.map((x, i) => x * fs[i]), sfx = fx.reduce((a, b) => a + b, 0), cum = [];
  fs.reduce((a, b, i) => (cum[i] = a + b), 0);
  const at = (k) => xs[cum.findIndex((c) => c >= k)];
  const median = n % 2 ? at((n + 1) / 2) : FD.dec((at(n / 2) + at(n / 2 + 1)) / 2), top = Math.max(...fs);
  const used = xs.filter((x, i) => fs[i] > 0);
  return { n, fx, sfx, cum, mean: FD.dec(sfx / n), median, modes: xs.filter((x, i) => fs[i] === top), range: used[used.length - 1] - used[0] };
};
FD.G = { xs: [0, 1, 2, 3, 4], fs: [4, 7, 5, 3, 1] };

FD.add({
  id: 'freqtable',
  title: 'Averages from a frequency table',
  tab: 'Frequency tables',
  icon: 'stats',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Frequency', 'How many times a value occurs.'],
    ['fx column', 'Each value × its frequency: the total of that row.'],
    ['Mean from a table', '\\(\\dfrac{\\sum fx}{\\sum f}\\): total of the fx column ÷ total frequency.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ft-s', '<div id="tb"></div>', `
      <div class="ft-sl">${FD.G.xs.map((x, i) => `<label class="ctrl">${x} goals <input type="range" id="f${i}" min="0" max="12" value="${FD.G.fs[i]}"><output id="o${i}">${FD.G.fs[i]}</output></label>`).join('')}</div>`, () => sync());
    a.tab = FD.ftab(a.$('#tb'));
    a.show = (xs, fs, show = 3, hi = -1) => { const st = FD.fstats(xs, fs); a.tab([{ h: 'Goals \\(x\\)', v: xs, tot: 'Total' }, { h: 'Frequency \\(f\\)', v: fs, tot: st.n }, { h: '\\(fx\\)', v: st.fx, tot: st.sfx }], hi, show); FD.typeset && FD.typeset(a.$('#tb')); return st; };
    const sync = () => {
      const fs = FD.G.xs.map((x, i) => +a.$('#f' + i).value); FD.G.xs.forEach((x, i) => { a.$('#o' + i).textContent = fs[i]; });
      if (fs.every((f) => f === 0)) { a.show(FD.G.xs, fs); a.big(''); a.msg('Give at least one value a frequency.', 'bad'); return; }
      const st = a.show(FD.G.xs, fs, 3, FD.G.xs.indexOf(st0(fs)));
      a.big(`\\text{mean} = \\frac{${st.sfx}}{${st.n}} = ${FD.round(st.mean, 2)} \\quad \\text{median} = ${st.median} \\quad \\text{mode} = ${st.modes.join(', ')}`);
      a.msg('The highlighted row has the highest frequency: the mode.');
    };
    const st0 = (fs) => FD.fstats(FD.G.xs, fs).modes[0];
    a.$('.ft-sl').addEventListener('input', sync);
    a.show(FD.G.xs, FD.G.fs, 2);
    return a;
  },
  steps: [
    {
      title: 'Reading the table',
      text: '<p>A football team recorded the goals scored in 20 matches. The table says they scored 0 goals in 4 matches, 1 goal in 7 matches, and so on.</p><p>The total frequency is the number of matches: \\(4 + 7 + 5 + 3 + 1 = 20\\).</p>',
      async on(a, ctx) { a.reset(); a.show(FD.G.xs, FD.G.fs, 2); a.big('\\sum f = 20'); },
    },
    {
      title: 'The mean: add an fx column',
      text: '<p>Multiply each number of goals by its frequency. That gives the goals scored in each row. Add the column for the total number of goals.</p>',
      tip: 'Divide by the total frequency (20), NOT by the number of rows (5).',
      async on(a, ctx) {
        a.reset(); a.show(FD.G.xs, FD.G.fs, 3);
        await a.lines([['0 \\times 4 + 1 \\times 7 + 2 \\times 5 + 3 \\times 3 + 4 \\times 1 = 30', '\\(\\sum fx\\)'], ['\\text{mean} = \\frac{30}{20} = 1.5 \\text{ goals}', '\\(\\sum fx \\div \\sum f\\)']], ctx, 1500);
      },
    },
    {
      title: 'The median: find the middle position',
      text: '<p>There are 20 values, so the median is halfway between the 10th and 11th. Count down the frequencies: the first 4 are 0s, the next 7 (5th to 11th) are 1s.</p>',
      async on(a, ctx) {
        a.reset(); a.show(FD.G.xs, FD.G.fs, 2, 1);
        await a.lines([['\\frac{20 + 1}{2} = 10.5\\text{th value}', 'middle position'], ['4 + 7 = 11 \\ge 10.5', 'running total'], ['\\text{median} = 1 \\text{ goal}', '']], ctx, 1400);
      },
    },
    {
      title: 'Mode and range',
      text: '<p>The <b>mode</b> is the value with the highest <b>frequency</b>: 1 goal (7 matches). Not 7!</p><p>The <b>range</b> uses the values, not the frequencies: \\(4 - 0 = 4\\).</p>',
      async on(a, ctx) { a.reset(); a.show(FD.G.xs, FD.G.fs, 2, 1); a.big('\\text{mode} = 1 \\qquad \\text{range} = 4 - 0 = 4'); },
    },
    {
      title: 'Try it: change the frequencies',
      text: '<p>Move the sliders to change how many matches had each score. Watch the fx column, the mean, the median and the mode.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.ftQ = (xs, fs, x = 'Value') => `<table class="dt"><tr><th>${x}</th>${xs.map((v) => `<td>${v}</td>`).join('')}</tr><tr><th>Frequency</th>${fs.map((v) => `<td>${v}</td>`).join('')}</tr></table>`;

FD.practice({
  section: 'freqtable',
  gens: [
    () => { let xs, fs, st; do { const s = FD.rnd(0, 3); xs = [s, s + 1, s + 2, s + 3, s + 4]; fs = xs.map(() => FD.rnd(1, 9)); st = FD.fstats(xs, fs); } while (!Number.isInteger(FD.dec(st.mean * 10))); return { type: 'num', q: `Work out the mean of the data in this table.${FD.ftQ(xs, fs, 'Number of pets')}`, a: st.mean, why: `\\(\\sum fx = ${xs.map((x, i) => `${x} \\times ${fs[i]}`).join(' + ')} = ${st.sfx}\\), \\(\\sum f = ${st.n}\\). Mean \\(= ${st.sfx} \\div ${st.n} = ${st.mean}\\).` }; },
    () => { const s = FD.rnd(1, 5), xs = [s, s + 1, s + 2, s + 3, s + 4], fs = xs.map(() => FD.rnd(1, 9)), st = FD.fstats(xs, fs); return { type: 'num', q: `Find the median of the data in this table.${FD.ftQ(xs, fs, 'Shoe size')}`, a: st.median, why: `${st.n} values: the median is the ${st.n % 2 ? `${(st.n + 1) / 2}th` : `mean of the ${st.n / 2}th and ${st.n / 2 + 1}th`}. Running totals: ${st.cum.join(', ')}. Median = ${st.median}.` }; },
    () => { let xs, fs, st; do { const s = FD.rnd(0, 4); xs = [s, s + 1, s + 2, s + 3, s + 4]; fs = xs.map(() => FD.rnd(0, 12)); st = FD.fstats(xs, fs); } while (st.modes.length !== 1 || fs[0] === 0 || fs[4] === 0 || st.n === 0); return { type: 'num', q: `Write down the mode and the range of the data in this table.${FD.ftQ(xs, fs, 'Children')}`, a: [st.modes[0], st.range], fields: ['mode =', 'range ='], why: `The highest frequency is ${Math.max(...fs)}, for ${st.modes[0]}. Range \\(${xs[4]} - ${xs[0]} = ${st.range}\\).` }; },
  ],
});

FD.check({
  section: 'freqtable',
  items: [
    { type: 'num', q: `Find the mean.${FD.ftQ([1, 2, 3, 4], [3, 5, 8, 4])}`, a: 2.65, why: '\\(\\sum fx = 3 + 10 + 24 + 16 = 53\\), \\(53 \\div 20 = 2.65\\).' },
    { type: 'num', q: `Find the median.${FD.ftQ([1, 2, 3, 4], [3, 5, 8, 4])}`, a: 3, why: '20 values: 10th and 11th. Running totals 3, 8, 16: both are 3.' },
    { type: 'mcq', q: `What is the mode?${FD.ftQ([1, 2, 3, 4], [3, 5, 8, 4])}`, opts: ['3', '8', '4', '2.5'], why: 'Value 3 has the highest frequency (8).' },
    { type: 'tf', q: 'To find the mean from a frequency table you divide \\(\\sum fx\\) by the number of rows.', a: false, why: 'Divide by the total frequency \\(\\sum f\\).' },
  ],
});
