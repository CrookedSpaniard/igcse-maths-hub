// Estimated number of values between x1 and x2 (area of the histogram between them).
FD.between = (cls, x1, x2) => FD.dec(cls.reduce((s, [a, b, f]) => s + Math.max(0, Math.min(b, x2) - Math.max(a, x1)) * (f / (b - a)), 0));
FD.H2 = [[0, 20, 10], [20, 30, 22], [30, 35, 28], [35, 50, 18], [50, 80, 12]];
FD.mXL = 'Mass <tspan font-style="italic">m</tspan> (grams)';

FD.add({
  id: 'readhist',
  title: 'Reading histograms',
  tab: 'Reading',
  icon: 'target',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Frequency from a bar', 'Frequency = frequency density × class width (the area of the bar).'],
    ['Part of a class', 'Assume the values are spread evenly across the class, and take the matching fraction of the bar.'],
  ],
  mount(el) {
    const a = FD.board(el, 'rh-s', '<div class="hc-pair"><div id="tb"></div><div id="ch"></div></div>', `
      <label class="ctrl">From <input type="range" id="x1" min="0" max="80" value="40"><output id="o1">40</output></label>
      <label class="ctrl">To <input type="range" id="x2" min="0" max="80" value="80"><output id="o2">80</output></label>`, () => sync());
    a.hist = FD.hist(a.$('#ch'));
    a.show = (o = {}, cols = ['fd']) => { a.$('#tb').innerHTML = FD.htab(FD.H2, cols, { v: 'm', head: 'Mass \\(m\\) (g)', ...o }); a.hist(FD.H2, { xl: FD.mXL, labels: true, ...o }); };
    const sync = () => {
      let x1 = +a.$('#x1').value, x2 = +a.$('#x2').value; if (x1 > x2) [x1, x2] = [x2, x1];
      a.$('#o1').textContent = a.$('#x1').value; a.$('#o2').textContent = a.$('#x2').value;
      a.show({ shade: [x1, x2] });
      const parts = FD.H2.map(([p, q, f]) => [Math.max(0, Math.min(q, x2) - Math.max(p, x1)), FD.dec(f / (q - p))]).filter((t) => t[0] > 0);
      a.big(`${parts.length ? parts.map(([w, d]) => `${w} \\times ${d}`).join(' + ') : '0'} = ${FD.round(FD.between(FD.H2, x1, x2), 1)}`);
      a.msg(`About ${Math.round(FD.between(FD.H2, x1, x2))} parcels have a mass between ${x1} g and ${x2} g.`);
    };
    a.$('#x1').addEventListener('input', sync); a.$('#x2').addEventListener('input', sync);
    a.show();
    return a;
  },
  steps: [
    {
      title: 'From a histogram back to frequencies',
      text: '<p>This histogram shows the masses of some parcels. To find a frequency, work out the <b>area</b> of the bar: class width × frequency density.</p>',
      async on(a, ctx) {
        a.reset(); a.show({ hi: 1 });
        await a.lines([['20 < m \\le 30: \\quad 10 \\times 2.2 = 22', 'width × height']], ctx, 1300);
      },
    },
    {
      title: 'All the frequencies',
      text: '<p>Do the same for every bar, then add them to find how many parcels there are altogether.</p>',
      async on(a, ctx) {
        a.reset(); a.show({}, ['fd', 'f']);
        await a.lines([['20 \\times 0.5 = 10,\\ 10 \\times 2.2 = 22,\\ 5 \\times 5.6 = 28', ''], ['15 \\times 1.2 = 18,\\ 30 \\times 0.4 = 12', ''], ['10 + 22 + 28 + 18 + 12 = 90 \\text{ parcels}', 'total']], ctx, 1400);
      },
    },
    {
      title: 'Part of a class',
      text: '<p>Estimate how many parcels weigh <b>more than 40 g</b>. 40 is inside the class \\(35 < m \\le 50\\), so take only the part of that bar from 40 to 50, plus the whole of the next bar.</p>',
      tip: 'We assume the values are spread evenly within each class, so this is an estimate.',
      async on(a, ctx) {
        a.reset(); a.show({ shade: [40, 80] });
        await a.lines([['(50 - 40) \\times 1.2 = 12', 'part of a bar'], ['30 \\times 0.4 = 12', 'whole bar'], ['12 + 12 = 24 \\text{ parcels}', 'estimate']], ctx, 1400);
      },
    },
    {
      title: 'Try it: shade an interval',
      text: '<p>Move the sliders to choose an interval. The shaded area is the estimated number of parcels in it.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'readhist',
  gens: [
    () => { const w = FD.pick([5, 10, 20, 25]), d = FD.pick([0.2, 0.4, 0.6, 0.8, 1.2, 1.6, 2.4, 3, 3.6]), lo = w * FD.rnd(0, 4), f = FD.dec(w * d); return { type: 'num', q: `On a histogram, the bar for \\(${lo} < x \\le ${lo + w}\\) has a frequency density of ${d}. What is the frequency of this class?`, a: f, why: `\\(${w} \\times ${d} = ${f}\\).` }; },
    () => { const ws = [10, 5, 5, 10, 20], ds = ws.map(() => FD.pick([0.4, 0.8, 1.2, 1.6, 2, 2.4, 3])); let lo = 0; const cls = ws.map((w, i) => { const c = [lo, lo + w, FD.dec(w * ds[i])]; lo += w; return c; }); const n = cls.reduce((s, c) => s + c[2], 0); return { type: 'num', q: `A histogram has these bars. How many values are there altogether?${FD.htab(cls, ['fd'], { v: 'x', head: 'Length \\(x\\) (mm)' })}`, a: n, why: `Frequencies: ${cls.map((c) => c[2]).join(', ')}. Total ${n}.` }; },
    () => { const cls = [[0, 10, FD.pick([4, 6, 8])], [10, 20, FD.pick([10, 12, 16])], [20, 40, FD.pick([10, 14, 20, 24])], [40, 60, FD.pick([6, 8, 10])]], x = FD.pick([25, 30, 35, 45, 50]), est = FD.between(cls, x, 60); return { type: 'num', q: `Use the table to estimate how many values are greater than ${x}.${FD.htab(cls, ['f'], { v: 'x', head: 'Value \\(x\\)' })}`, a: est, tol: 0.5, why: `Assume values are spread evenly in each class. ${cls.filter((c) => c[1] > x).map(([p, q, f]) => (p >= x ? `whole class ${f}` : `\\(\\frac{${q - x}}{${q - p}} \\times ${f} = ${FD.dec(((q - x) / (q - p)) * f)}\\)`)).join(', ')}. Total ${est}.` }; },
  ],
});

FD.check({
  section: 'readhist',
  items: [
    { type: 'num', q: 'A histogram bar is drawn from 10 to 25 with a height (frequency density) of 1.6. What frequency does it represent?', a: 24, why: '\\(15 \\times 1.6 = 24\\).' },
    { type: 'num', q: 'The class \\(20 < x \\le 40\\) has frequency 30. Estimate how many values are between 20 and 25.', a: 7.5, tol: 0.5, why: '\\(\\frac{5}{20} \\times 30 = 7.5\\).' },
    { type: 'mcq', q: 'A bar 5 wide represents 20 people. A bar 10 wide has the same height. How many people does it represent?', opts: ['40', '20', '10', '200'], why: 'Twice the width, same height: twice the area.' },
    { type: 'tf', q: 'The tallest bar of a histogram always has the greatest frequency.', a: false, why: 'A wide, shorter bar can have a bigger area.' },
  ],
});
