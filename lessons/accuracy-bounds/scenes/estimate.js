// Estimates: [expression TeX, [numbers], rounded numbers, op function, estimate TeX]
FD.EST = [
  ['\\frac{48.7 \\times 3.12}{0.51}', '\\frac{50 \\times 3}{0.5} = \\frac{150}{0.5} = 300', 48.7 * 3.12 / 0.51],
  ['\\frac{6.9^2}{0.198}', '\\frac{7^2}{0.2} = \\frac{49}{0.2} = 245', 6.9 ** 2 / 0.198],
  ['\\sqrt{97} \\times 4.08', '\\sqrt{100} \\times 4 = 40', Math.sqrt(97) * 4.08],
  ['\\frac{213 + 389}{19.6}', '\\frac{200 + 400}{20} = 30', (213 + 389) / 19.6],
  ['0.42 \\times 7180', '0.4 \\times 7000 = 2800', 0.42 * 7180],
];

FD.add({
  id: 'estimate',
  title: 'Estimating',
  tab: 'Estimating',
  icon: 'calc',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Estimate', 'An approximate answer, found by rounding every number (usually to 1 s.f.) and working it out without a calculator.'],
    ['≈', '“Is approximately equal to”.'],
    ['Overestimate / underestimate', 'If you rounded up, the estimate is probably too big; if you rounded down, too small.'],
  ],
  mount(el) {
    const a = FD.board(el, 'es-s', '<div class="mbig" id="ex"></div>', `
      <div class="bd-row"><label>Calculation <select id="pick">${FD.EST.map((e, i) => `<option value="${i}">Example ${i + 1}</option>`).join('')}</select></label></div>
      <div class="bd-btns"><button class="btn" id="bShow">Show the estimate</button></div>`, () => sync());
    const show = (i, step) => {
      const [q, e, v] = FD.EST[i];
      a.$('#ex').innerHTML = FD.tex(q, true);
      a.big(step ? `\\approx ${e}` : '');
      a.msg(step ? `Calculator answer: ${v.toFixed(2)}. The estimate is close, so the answer is sensible.` : 'Round every number to 1 significant figure first.');
    };
    const sync = () => show(+a.$('#pick').value, false);
    a.$('#pick').addEventListener('input', sync);
    a.$('#bShow').addEventListener('click', () => show(+a.$('#pick').value, true));
    a.ex = (t) => { a.$('#ex').innerHTML = FD.tex(t, true); };
    a.ex(FD.EST[0][0]);
    return a;
  },
  steps: [
    {
      title: 'Round to 1 significant figure',
      text: '<p>Estimate \\(\\dfrac{48.7 \\times 3.12}{0.51}\\). Round every number to <b>1 significant figure</b>, then work it out in your head.</p>',
      tip: 'Dividing by 0.5 is the same as multiplying by 2.',
      async on(a, ctx) {
        a.reset(); a.ex('\\frac{48.7 \\times 3.12}{0.51}');
        await a.lines([['\\approx \\frac{50 \\times 3}{0.5}', 'each number to 1 s.f.'], ['= \\frac{150}{0.5} = 300', ''], ['\\text{calculator: } 297.9\\dots', 'close: sensible']], ctx, 1400);
      },
    },
    {
      title: 'Squares and roots',
      text: '<p>For a square root, round to a nearby <b>square number</b> instead: \\(\\sqrt{97} \\approx \\sqrt{100} = 10\\).</p>',
      async on(a, ctx) {
        a.reset(); a.ex('\\sqrt{97} \\times 4.08');
        await a.lines([['\\approx \\sqrt{100} \\times 4', ''], ['= 40', '']], ctx, 1300);
      },
    },
    {
      title: 'Checking an answer',
      text: '<p>Ben works out \\(0.42 \\times 7180\\) on his calculator and gets 30 156. Is he right?</p><p>An estimate shows the answer should be about 2800, so he has made a mistake (the right answer is 3015.6).</p>',
      async on(a, ctx) {
        a.reset(); a.ex('0.42 \\times 7180');
        await a.lines([['\\approx 0.4 \\times 7000 = 2800', 'estimate'], ['30\\,156 \\text{ is about 10 times too big}', 'a mistake']], ctx, 1400);
      },
    },
    {
      title: 'Over or under?',
      text: '<p>In \\(\\dfrac{213 + 389}{19.6}\\), 213 was rounded down, 389 up and 19.6 up. It is hard to say, so look at the effect of each rounding when a question asks.</p><p>For \\(6.9^2\\): 7 is bigger than 6.9, so \\(7^2 = 49\\) is an <b>overestimate</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.ex('6.9^2 \\approx 7^2 = 49');
        a.big('6.9^2 = 47.61 < 49 \\; \\text{(overestimate)}');
      },
    },
    {
      title: 'Try it: estimate first',
      text: '<p>Choose a calculation. Estimate it in your head, then press <b>Show the estimate</b> to compare with the calculator answer.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'estimate',
  gens: [
    () => { const r1 = FD.pick([2, 3, 4, 5, 6, 7, 8, 9]), r2 = FD.pick([20, 30, 40, 50, 60, 70, 80, 90]), d = FD.pick([0.2, 0.5, 2, 4, 5, 10]); const x = FD.dec(r1 + FD.pick([-0.12, -0.08, 0.06, 0.13, 0.21])), y = FD.dec(r2 + FD.pick([-2.4, -1.3, 1.6, 3.2])), z = FD.dec(d * FD.pick([0.96, 0.98, 1.02, 1.04])); const est = FD.dec((r1 * r2) / d); return { type: 'num', q: `Estimate the value of \\(\\dfrac{${x} \\times ${y}}{${z}}\\) by rounding each number to 1 significant figure.`, a: est, why: `\\(\\dfrac{${r1} \\times ${r2}}{${d}} = \\dfrac{${r1 * r2}}{${d}} = ${est}\\).` }; },
    () => { const s = FD.pick([4, 9, 16, 25, 36, 49, 64, 81, 100]), n = s + FD.pick([-2, -1, 1, 2, 3]); return { type: 'num', q: `Estimate \\(\\sqrt{${n}}\\) to the nearest whole number.`, a: Math.sqrt(s), why: `${n} is close to the square number ${s}, and \\(\\sqrt{${s}} = ${Math.sqrt(s)}\\).` }; },
    () => { const a1 = FD.pick([3, 4, 5, 6, 7, 8]), b1 = FD.pick([200, 300, 400, 500, 600]), x = FD.dec(a1 + FD.pick([0.2, 0.3, -0.2, -0.3])), y = b1 + FD.pick([12, 28, -17, -31]); const est = a1 * b1, real = FD.dec(x * y); const wrong = FD.dec(real * 10); return { type: 'mcq', q: `Kim says \\(${x} \\times ${y} = ${FD.nt(wrong)}\\). Use an estimate to check. Which is true?`, opts: [`Kim is wrong: the answer is about ${FD.nt(est)}`, 'Kim is right', `Kim is wrong: the answer is about ${FD.nt(est * 100)}`, `Kim is wrong: the answer is about ${FD.nt(est / 100)}`], why: `\\(${x} \\times ${y} \\approx ${a1} \\times ${b1} = ${est}\\). Kim's answer is about 10 times too big (it is ${FD.nt(real)}).` }; },
  ],
});

FD.check({
  section: 'estimate',
  items: [
    { type: 'num', q: 'Estimate \\(\\dfrac{61.3 \\times 9.8}{0.47}\\) by rounding each number to 1 significant figure.', a: 1200, why: '\\(\\frac{60 \\times 10}{0.5} = \\frac{600}{0.5} = 1200\\).' },
    { type: 'num', q: 'Estimate \\(\\sqrt{63.5}\\) to the nearest whole number.', a: 8, why: '63.5 is close to 64.' },
    { type: 'mcq', q: 'Which is the best estimate for \\(3.87 \\times 21.2\\)?', opts: ['\\(4 \\times 20 = 80\\)', '\\(3 \\times 21 = 63\\)', '\\(4 \\times 21.2 = 84.8\\)', '\\(3.9 \\times 21 = 81.9\\)'], why: 'Round each number to 1 s.f.' },
    { type: 'tf', q: 'Estimating \\(5.8^2\\) as \\(6^2 = 36\\) gives an overestimate.', a: true, why: '6 is bigger than 5.8, so 36 is too big (\\(5.8^2 = 33.64\\)).' },
  ],
});
