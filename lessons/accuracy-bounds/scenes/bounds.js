FD.add({
  id: 'bounds',
  title: 'Upper and lower bounds',
  tab: 'Bounds',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Lower bound (LB)', 'The smallest value that rounds to the given value.'],
    ['Upper bound (UB)', 'The value where rounding starts to give the next answer. It is not included.'],
    ['Error interval', 'LB \\(\\le x <\\) UB, e.g. \\(4.5 \\le x < 5.5\\) for 5 to the nearest whole number.'],
    ['Half a unit', 'The bounds are half of the rounding unit below and above the rounded value.'],
  ],
  mount(el) {
    const units = [[1, 'nearest whole number'], [10, 'nearest 10'], [0.1, '1 d.p.'], [0.01, '2 d.p.'], [5, 'nearest 5']];
    const a = FD.board(el, 'bo-s', '<div id="rl"></div>', `
      <label class="ctrl">Rounded value ×100 <input type="range" id="rv" min="10" max="9000" step="10" value="500"><output id="ov">5</output></label>
      <div class="bd-row"><label>Correct to the <select id="u">${units.map(([v, t], i) => `<option value="${i}">${t}</option>`).join('')}</select></label></div>`, () => sync());
    a.rl = FD.rline(a.$('#rl'));
    const sync = () => {
      const [u, t] = units[+a.$('#u').value]; let v = +a.$('#rv').value / 100; v = FD.dec(Math.round(v / u) * u) || u; a.$('#ov').textContent = FD.nt(v);
      const lb = FD.dec(v - u / 2), ub = FD.dec(v + u / 2);
      a.rl(FD.dec(v - u), FD.dec(v + u), { sub: 4, subLabels: 1, interval: [lb, ub] });
      a.big(`${FD.nt(lb)} \\le x < ${FD.nt(ub)}`);
      a.msg(`Correct to the ${t}: half a unit is ${FD.nt(u / 2)}. LB = ${FD.nt(v)} − ${FD.nt(u / 2)}, UB = ${FD.nt(v)} + ${FD.nt(u / 2)}.`);
    };
    ['#rv', '#u'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.rl(4, 6, { sub: 4, subLabels: 1 });
    return a;
  },
  steps: [
    {
      title: 'What could the value be?',
      text: '<p>A pencil is 15 cm long, to the nearest cm. The real length could be anything from <b>14.5 cm</b> up to (but not including) <b>15.5 cm</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(14, 16, { sub: 4, subLabels: 1 });
        if (!(await ctx.sleep(1000))) return;
        a.rl(14, 16, { sub: 4, subLabels: 1, interval: [14.5, 15.5] });
        a.big('14.5 \\le l < 15.5');
      },
    },
    {
      title: 'Half a unit each way',
      text: '<p>The bounds are <b>half the rounding unit</b> below and above the value.</p>',
      tip: '15.5 itself would round up to 16, so it is not included: use < at the top.',
      async on(a, ctx) {
        a.reset(); a.rl(14, 16, { sub: 4, subLabels: 1, interval: [14.5, 15.5] });
        await a.lines([['\\text{unit} = 1 \\text{ cm}, \\; \\text{half} = 0.5', ''], ['\\text{LB} = 15 - 0.5 = 14.5', ''], ['\\text{UB} = 15 + 0.5 = 15.5', '']], ctx, 1300);
      },
    },
    {
      title: 'Other degrees of accuracy',
      text: '<p>Find the unit first, then halve it.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(3.6, 3.8, { sub: 4, subLabels: 1, interval: [3.65, 3.75] });
        await a.lines([['3.7 \\text{ (1 d.p.)}: \\; 3.65 \\le x < 3.75', 'unit 0.1, half 0.05'], ['400 \\text{ (nearest 100)}: \\; 350 \\le x < 450', 'unit 100, half 50'], ['60 \\text{ (nearest 5)}: \\; 57.5 \\le x < 62.5', 'unit 5, half 2.5']], ctx, 1400);
      },
    },
    {
      title: 'Truncation',
      text: '<p>A number is <b>truncated</b> when the extra digits are simply chopped off. If \\(x\\) truncated to 1 d.p. is 2.6, then \\(2.6 \\le x < 2.7\\).</p>',
      async on(a, ctx) {
        a.reset(); a.rl(2.5, 2.8, { sub: 3, subLabels: 1, interval: [2.6, 2.7] });
        a.big('2.6 \\le x < 2.7 \\; \\text{(truncated)}');
      },
    },
    {
      title: 'Try it: find the bounds',
      text: '<p>Choose a rounded value and how accurate it is. The shaded interval shows every value that rounds to it.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'bounds',
  gens: [
    () => { const u = FD.pick([1, 10, 100, 0.1, 0.01, 5]), v = FD.dec(FD.rnd(2, 90) * u), lb = FD.dec(v - u / 2), ub = FD.dec(v + u / 2), name = { 1: 'the nearest whole number', 10: 'the nearest 10', 100: 'the nearest 100', 0.1: '1 decimal place', 0.01: '2 decimal places', 5: 'the nearest 5' }[u]; return { type: 'num', q: `A length is ${FD.nt(v)} m, correct to ${name}. Write down the lower bound and the upper bound.`, a: [lb, ub], fields: ['LB =', 'UB ='], why: `Half the unit is ${FD.nt(u / 2)}. LB = ${FD.nt(v)} − ${FD.nt(u / 2)} = ${FD.nt(lb)}; UB = ${FD.nt(v)} + ${FD.nt(u / 2)} = ${FD.nt(ub)}.` }; },
    () => { const u = FD.pick([1, 0.1, 10]), v = FD.dec(FD.rnd(3, 60) * u), lb = FD.dec(v - u / 2), ub = FD.dec(v + u / 2); return { type: 'mcq', q: `\\(x = ${v}\\) correct to ${u === 1 ? 'the nearest whole number' : u === 10 ? 'the nearest 10' : '1 decimal place'}. Which is the error interval?`, opts: [`\\(${lb} \\le x < ${ub}\\)`, `\\(${lb} < x \\le ${ub}\\)`, `\\(${FD.dec(v - u)} \\le x < ${FD.dec(v + u)}\\)`, `\\(${lb} \\le x \\le ${ub}\\)`], why: `Half a unit either side; the lower bound is included (≤) and the upper bound is not (<).` }; },
  ],
});

FD.check({
  section: 'bounds',
  items: [
    { type: 'num', q: 'A mass is 70 kg to the nearest 10 kg. Write down the lower and upper bounds.', a: [65, 75], fields: ['LB =', 'UB ='], why: 'Half of 10 is 5.' },
    { type: 'num', q: 'A time is 8.4 s correct to 1 d.p. Write down the lower and upper bounds.', a: [8.35, 8.45], fields: ['LB =', 'UB ='], why: 'Half of 0.1 is 0.05.' },
    { type: 'mcq', q: '\\(y = 250\\) to 2 significant figures. Which is the error interval?', opts: ['\\(245 \\le y < 255\\)', '\\(249.5 \\le y < 250.5\\)', '\\(200 \\le y < 300\\)', '\\(240 \\le y < 260\\)'], why: '2 s.f. here means the nearest 10.' },
    { type: 'tf', q: 'If \\(x = 6\\) to the nearest whole number, \\(x\\) could be 6.5.', a: false, why: '6.5 rounds to 7; the upper bound 6.5 is not included.' },
  ],
});
