FD.add({
  id: 'cfuse',
  title: 'Using cumulative frequency graphs',
  tab: 'Using CF',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Less than', 'Go up from the value to the curve, then across: read the cumulative frequency.'],
    ['More than', 'Read the cumulative frequency, then subtract it from the total.'],
    ['Between', 'Read at both values and subtract.'],
  ],
  mount(el) {
    const a = FD.board(el, 'cu-s', '<div id="ch"></div>', `
      <label class="ctrl">Time \\(t\\) <input type="range" id="rx" min="0" max="50" step="1" value="25"><output id="ox">25</output></label>`, () => sync());
    a.cfg = FD.cfg(a.$('#ch'));
    const sync = () => {
      const x = +a.$('#rx').value, y = Math.round(a.cfg(FD.C1, { curve: true, readX: x })(x)); a.$('#ox').textContent = x;
      a.big(`t \\le ${x}: \\ \\approx ${y} \\qquad t > ${x}: \\ \\approx 50 - ${y} = ${50 - y}`);
      a.msg(`About ${y} students spent ${x} minutes or less; about ${50 - y} spent more.`);
    };
    a.$('#rx').addEventListener('input', sync);
    a.cfg(FD.C1, { curve: true });
    return a;
  },
  steps: [
    {
      title: 'How many less than…?',
      text: '<p>Estimate how many students spent <b>25 minutes or less</b> on homework. Go up from 25 on the time axis to the curve, then across to the cumulative frequency axis.</p>',
      async on(a, ctx) {
        a.reset(); a.cfg(FD.C1, { curve: true }); if (!(await ctx.sleep(700))) return;
        a.cfg(FD.C1, { curve: true, readX: 25 }); a.big('\\approx 26 \\text{ students}');
      },
    },
    {
      title: 'How many more than…?',
      text: '<p>How many spent <b>more than 35 minutes</b>? Read the cumulative frequency at 35: about 41. These are the students with 35 minutes or less, so subtract from the total.</p>',
      tip: 'The graph always gives “less than”. For “more than”, subtract from the total.',
      async on(a, ctx) {
        a.reset(); a.cfg(FD.C1, { curve: true, readX: 35 });
        await a.lines([['\\text{at } t = 35: \\ \\approx 41', 'read up and across'], ['50 - 41 = 9 \\text{ students}', 'more than 35']], ctx, 1400);
      },
    },
    {
      title: 'How many between…?',
      text: '<p>How many spent between 15 and 35 minutes? Read at both values and subtract.</p>',
      async on(a, ctx) {
        a.reset(); a.cfg(FD.C1, { curve: true, readX: 15 }); if (!(await ctx.sleep(1100))) return;
        a.cfg(FD.C1, { curve: true, readX: 35 });
        await a.lines([['\\text{at } 15: \\approx 10, \\quad \\text{at } 35: \\approx 41', ''], ['41 - 10 = 31 \\text{ students}', 'between']], ctx, 1400);
      },
    },
    {
      title: 'Reading the other way',
      text: '<p>The teacher says 40 students finished their homework within a certain time. Find it: go <b>across</b> from 40 to the curve, then <b>down</b> to the time axis.</p>',
      async on(a, ctx) { a.reset(); a.cfg(FD.C1, { curve: true, readY: 40 }); a.big('t \\approx 34 \\text{ minutes}'); },
    },
    {
      title: 'Try it: read the graph',
      text: '<p>Move the slider to choose a time. The dashed line reads the curve for you. Check how many are below and above it.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.cfQ = (cls, head = 'Score \\(x\\)', v = 'x') => { const P = FD.cfPts(cls); return `<table class="dt"><tr><th>${head}</th><th>Cumulative frequency</th></tr>${P.slice(1).map((p) => `<tr><td>\\(${v} \\le ${p[0]}\\)</td><td>${p[1]}</td></tr>`).join('')}</table>`; };

FD.practice({
  section: 'cfuse',
  gens: [
    () => { const w = FD.pick([10, 20]), cls = Array.from({ length: 5 }, (_, i) => [w * i, w * (i + 1), FD.rnd(3, 20)]), P = FD.cfPts(cls), k = FD.rnd(1, 4), n = P[5][1]; return { type: 'num', q: `How many values are <b>more than</b> ${P[k][0]}?${FD.cfQ(cls)}`, a: n - P[k][1], why: `${P[k][1]} are ${P[k][0]} or less. Total ${n}: \\(${n} - ${P[k][1]} = ${n - P[k][1]}\\).` }; },
    () => { const w = FD.pick([10, 20]), cls = Array.from({ length: 5 }, (_, i) => [w * i, w * (i + 1), FD.rnd(3, 20)]), P = FD.cfPts(cls), i = FD.rnd(1, 3), j = FD.rnd(i + 1, 5); return { type: 'num', q: `How many values are more than ${P[i][0]} but no more than ${P[j][0]}?${FD.cfQ(cls)}`, a: P[j][1] - P[i][1], why: `\\(${P[j][1]} - ${P[i][1]} = ${P[j][1] - P[i][1]}\\).` }; },
    () => { const k = FD.rnd(55, 85), n = FD.pick([60, 80, 100, 120]); let c; do { c = FD.rnd(Math.round(n * 0.3), Math.round(n * 0.8)); } while (2 * c === n); return { type: 'mcq', q: `A cumulative frequency graph for ${n} students reads ${c} at a mark of ${k}. How many students scored more than ${k}?`, opts: [`${n - c}`, `${c}`, `${n + c}`, 'It cannot be found'], why: `${c} scored ${k} or less: \\(${n} - ${c} = ${n - c}\\).` }; },
  ],
});

FD.check({
  section: 'cfuse',
  items: [
    { type: 'num', q: 'On a cumulative frequency graph for 80 people, the curve gives 52 at an age of 40. How many people are older than 40?', a: 28, why: '\\(80 - 52\\).' },
    { type: 'num', q: 'A cumulative frequency graph reads 18 at \\(x = 20\\) and 47 at \\(x = 35\\). How many values are between 20 and 35?', a: 29, why: '\\(47 - 18\\).' },
    { type: 'mcq', q: 'To find how many are LESS than a value, you…', opts: ['go up from the value to the curve, then across', 'go across from the value, then down', 'read the frequency of that class', 'subtract from the total'], why: 'Up to the curve, across to the cumulative frequency axis.' },
    { type: 'tf', q: 'Values read from a cumulative frequency curve are estimates.', a: true, why: 'The curve guesses how values are spread inside each class.' },
  ],
});
