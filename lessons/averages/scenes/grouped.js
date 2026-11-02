// Grouped data: classes [lo, hi], frequencies, midpoints.
FD.gstats = (lo, w, fs) => {
  const mids = fs.map((f, i) => FD.dec(lo + w * i + w / 2)), fm = mids.map((m, i) => FD.dec(m * fs[i])), n = fs.reduce((a, b) => a + b, 0), sfm = FD.dec(fm.reduce((a, b) => a + b, 0)), top = Math.max(...fs);
  return { mids, fm, n, sfm, mean: FD.dec(sfm / n), modal: fs.indexOf(top), ties: fs.filter((f) => f === top).length };
};
FD.cls = (lo, w, i, v = 't') => `${lo + w * i} < ${v} \\le ${lo + w * (i + 1)}`;
FD.GR = { lo: 0, w: 10, fs: [3, 8, 12, 5, 2] };

FD.add({
  id: 'grouped',
  title: 'Grouped data',
  tab: 'Grouped',
  icon: 'stats',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Class', 'A group of values, such as \\(10 < t \\le 20\\).'],
    ['Midpoint', 'The value halfway through a class: \\(\\frac{10 + 20}{2} = 15\\).'],
    ['Modal class', 'The class with the highest frequency.'],
    ['Estimate of the mean', '\\(\\dfrac{\\sum fm}{\\sum f}\\) using midpoints \\(m\\). It is an estimate because we do not know the exact values.'],
  ],
  mount(el) {
    const G = FD.GR;
    const a = FD.board(el, 'gr-s', '<div id="tb"></div>', `
      <div class="ft-sl">${G.fs.map((f, i) => `<label class="ctrl">\\(${FD.cls(G.lo, G.w, i)}\\) <input type="range" id="f${i}" min="0" max="15" value="${f}"><output id="o${i}">${f}</output></label>`).join('')}</div>`, () => sync());
    a.tab = FD.ftab(a.$('#tb'));
    a.show = (fs, show = 4, hi = -1) => { const st = FD.gstats(G.lo, G.w, fs); a.tab([{ h: 'Time \\(t\\) (min)', v: fs.map((f, i) => `\\(${FD.cls(G.lo, G.w, i)}\\)`), tot: 'Total' }, { h: 'Frequency \\(f\\)', v: fs, tot: st.n }, { h: 'Midpoint \\(m\\)', v: st.mids }, { h: '\\(fm\\)', v: st.fm, tot: st.sfm }], hi, show); return st; };
    const sync = () => {
      const fs = G.fs.map((f, i) => +a.$('#f' + i).value); fs.forEach((f, i) => { a.$('#o' + i).textContent = f; });
      if (fs.every((f) => f === 0)) { a.show(fs); a.big(''); a.msg('Give at least one class a frequency.', 'bad'); return; }
      const st = a.show(fs, 4, st0(fs));
      a.big(`\\text{estimated mean} = \\frac{${st.sfm}}{${st.n}} = ${FD.round(st.mean, 2)}`);
      a.msg(st.ties > 1 ? 'Two classes share the highest frequency: there is no single modal class.' : `Modal class: \\(${FD.cls(G.lo, G.w, st.modal)}\\) (highlighted).`);
    };
    const st0 = (fs) => { const st = FD.gstats(G.lo, G.w, fs); return st.ties > 1 ? -1 : st.modal; };
    a.$('.ft-sl').addEventListener('input', sync);
    a.show(G.fs, 2);
    return a;
  },
  steps: [
    {
      title: 'Grouped data',
      text: '<p>30 students timed how long their journey to school took. The times were put into <b>classes</b>. We no longer know the exact times, only how many are in each class.</p><p>\\(10 < t \\le 20\\) means more than 10 minutes, up to and including 20.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.GR.fs, 2); },
    },
    {
      title: 'The modal class',
      text: '<p>The <b>modal class</b> is the class with the highest frequency: \\(20 < t \\le 30\\), with 12 students.</p>',
      tip: 'Write the class, not the frequency 12.',
      async on(a, ctx) { a.reset(); a.show(FD.GR.fs, 2, 2); a.big('\\text{modal class: } 20 < t \\le 30'); },
    },
    {
      title: 'Midpoints',
      text: '<p>We pretend every value in a class is at its <b>midpoint</b>: halfway between the class limits. For \\(0 < t \\le 10\\) the midpoint is 5.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.GR.fs, 3); a.big('m = \\frac{0 + 10}{2} = 5, \\quad \\frac{10 + 20}{2} = 15, \\ \\dots'); },
    },
    {
      title: 'Estimate the mean',
      text: '<p>Multiply each frequency by its midpoint, add the \\(fm\\) column, and divide by the total frequency.</p><p>It is only an <b>estimate</b> because we used midpoints, not the real times.</p>',
      async on(a, ctx) {
        a.reset(); a.show(FD.GR.fs, 4);
        await a.lines([['15 + 120 + 300 + 175 + 90 = 700', '\\(\\sum fm\\)'], ['\\frac{700}{30} = 23.3 \\text{ min (1 d.p.)}', 'estimated mean']], ctx, 1500);
      },
    },
    {
      title: 'Try it: change the frequencies',
      text: '<p>Change the frequency of each class. Watch the \\(fm\\) column, the estimated mean and the modal class.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.gtQ = (lo, w, fs, v = 'x', h = 'Mass \\(x\\) (kg)') => `<table class="dt"><tr><th>${h}</th><th>Frequency</th></tr>${fs.map((f, i) => `<tr><td>\\(${FD.cls(lo, w, i, v)}\\)</td><td>${f}</td></tr>`).join('')}</table>`;

FD.practice({
  section: 'grouped',
  gens: [
    () => { let lo, w, fs, st; do { w = FD.pick([4, 10, 20]); lo = w * FD.rnd(0, 3); fs = Array.from({ length: 4 }, () => FD.rnd(1, 12)); st = FD.gstats(lo, w, fs); } while (!Number.isInteger(FD.dec(st.mean * 10))); return { type: 'num', q: `Work out an estimate for the mean.${FD.gtQ(lo, w, fs)}`, a: st.mean, why: `Midpoints ${st.mids.join(', ')}. \\(\\sum fm = ${st.fm.join(' + ')} = ${st.sfm}\\), \\(\\sum f = ${st.n}\\). Estimate \\(= ${st.sfm} \\div ${st.n} = ${st.mean}\\).` }; },
    () => { let lo, w, fs, st; do { w = FD.pick([5, 10, 20]); lo = w * FD.rnd(0, 4); fs = Array.from({ length: 4 }, () => FD.rnd(1, 15)); st = FD.gstats(lo, w, fs); } while (st.ties > 1); return { type: 'mcq', q: `Which is the modal class?${FD.gtQ(lo, w, fs, 'h', 'Height \\(h\\) (cm)')}`, opts: [st.modal, ...[0, 1, 2, 3].filter((i) => i !== st.modal)].map((i) => `\\(${FD.cls(lo, w, i, 'h')}\\)`), why: `It has the highest frequency, ${fs[st.modal]}.` }; },
    () => { const w = FD.pick([10, 20]), lo = w * FD.rnd(0, 3), k = FD.rnd(0, 3); return { type: 'num', q: `What is the midpoint of the class \\(${FD.cls(lo, w, k)}\\)?`, a: lo + w * k + w / 2, why: `\\(\\frac{${lo + w * k} + ${lo + w * (k + 1)}}{2} = ${lo + w * k + w / 2}\\).` }; },
  ],
});

FD.check({
  section: 'grouped',
  items: [
    { type: 'num', q: `Work out an estimate for the mean.${FD.gtQ(0, 10, [2, 5, 3])}`, a: 16, why: 'Midpoints 5, 15, 25: \\(10 + 75 + 75 = 160\\), \\(160 \\div 10 = 16\\).' },
    { type: 'mcq', q: `Which is the modal class?${FD.gtQ(0, 10, [2, 5, 3])}`, opts: ['\\(10 < x \\le 20\\)', '\\(0 < x \\le 10\\)', '\\(20 < x \\le 30\\)', '5'], why: 'Highest frequency, 5.' },
    { type: 'tf', q: 'The mean from grouped data is only an estimate.', a: true, why: 'We use midpoints instead of the real values.' },
    { type: 'mcq', q: 'Why do we use the midpoint of each class?', opts: ['It is the best single guess for every value in the class', 'It is always the exact mean of the class', 'It is the largest value in the class', 'It makes the frequencies bigger'], why: 'Some values are below it and some above, so it is a fair guess.' },
  ],
});
