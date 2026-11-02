// The five numbers of a cumulative frequency curve: ends of the data and the readings at n/4, n/2, 3n/4.
FD.cfFive = (cls) => { const P = FD.cfPts(cls), n = P[P.length - 1][1], f = FD.mono(P); return [P[0][0], ...[n / 4, n / 2, (3 * n) / 4].map((y) => Math.round(f.inv(y))), P[P.length - 1][0]]; };

FD.add({
  id: 'boxplot',
  title: 'Comparing distributions',
  tab: 'Comparing',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Box plot', 'Shows the smallest value, \\(Q_1\\), the median, \\(Q_3\\) and the largest value. The box is the IQR.'],
    ['Comparing', 'Compare an <b>average</b> (the median) AND a <b>spread</b> (the IQR), and say what they mean in the context.'],
  ],
  mount(el) {
    const a = FD.board(el, 'bp-s', '<div id="bx"></div>', `
      <label class="ctrl">Move B <input type="range" id="rs" min="-20" max="20" value="0"><output id="os">0</output></label>
      <label class="ctrl">Spread of B <input type="range" id="rw" min="4" max="20" value="10"><output id="ow">1.0</output></label>`, () => sync());
    a.bx = FD.boxplot(a.$('#bx'));
    const A = FD.cfFive(FD.CA);
    const sync = () => {
      const sh = +a.$('#rs').value, k = +a.$('#rw').value / 10, md = 50 + sh, B = [md - 30 * k, md - 12 * k, md, md + 12 * k, md + 30 * k].map((v) => Math.round(FD.clamp(v, 0, 100)));
      a.$('#os').textContent = sh; a.$('#ow').textContent = k.toFixed(1);
      a.bx([{ name: 'A', v: A }, { name: 'B', v: B }], 0, 100, 10, 'Mark (%)');
      const iA = A[3] - A[1], iB = B[3] - B[1];
      a.big(`\\text{A: median } ${A[2]},\\ \\text{IQR } ${iA} \\qquad \\text{B: median } ${B[2]},\\ \\text{IQR } ${iB}`);
      a.msg(`${A[2] === B[2] ? 'Both classes have the same median.' : `Class ${A[2] > B[2] ? 'A' : 'B'} has the higher median, so did better on average.`} ${iA === iB ? 'The spreads are equal.' : `Class ${iA < iB ? 'A' : 'B'} has the smaller IQR, so its marks were more consistent.`}`);
    };
    a.$('#rs').addEventListener('input', sync); a.$('#rw').addEventListener('input', sync);
    a.bx([{ name: 'A', v: A }], 0, 100, 10, 'Mark (%)');
    return a;
  },
  steps: [
    {
      title: 'From the graph to a box plot',
      text: '<p>Class A’s marks went from 0 to 100. From the graph: \\(Q_1 \\approx 42\\), median \\(\\approx 55\\), \\(Q_3 \\approx 70\\). A <b>box plot</b> shows these five numbers.</p>',
      async on(a, ctx) { a.reset(); a.bx([{ name: 'A', v: FD.cfFive(FD.CA) }], 0, 100, 10, 'Mark (%)'); a.big('0,\\ 42,\\ 55,\\ 70,\\ 100'); },
    },
    {
      title: 'A second class',
      text: '<p>Class B (also 80 students) took the same test. From its graph: \\(Q_1 \\approx 30\\), median \\(\\approx 47\\), \\(Q_3 \\approx 64\\).</p>',
      async on(a, ctx) { a.reset(); a.bx([{ name: 'A', v: FD.cfFive(FD.CA) }, { name: 'B', v: FD.cfFive(FD.CB) }], 0, 100, 10, 'Mark (%)'); },
    },
    {
      title: 'Compare an average and a spread',
      text: '<p>Write <b>two</b> comparisons, in context:</p>',
      tip: 'Saying only “A’s median is bigger” is not enough: say what it means.',
      async on(a, ctx) {
        a.reset(); a.bx([{ name: 'A', v: FD.cfFive(FD.CA) }, { name: 'B', v: FD.cfFive(FD.CB) }], 0, 100, 10, 'Mark (%)');
        await a.lines([['\\text{median: } 55 > 47', 'Class A did better on average.'], ['\\text{IQR: } 28 < 34', 'Class A’s marks were more consistent.']], ctx, 1600);
      },
    },
    {
      title: 'Try it: move class B',
      text: '<p>Move class B and change its spread. Read the comparison sentences as they change.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'boxplot',
  gens: [
    () => { let mA, mB, iA, iB; do { mA = FD.rnd(30, 70); mB = FD.rnd(30, 70); iA = FD.rnd(6, 30); iB = FD.rnd(6, 30); } while (mA === mB || iA === iB); const better = mA > mB ? 'P' : 'Q', cons = iA < iB ? 'P' : 'Q'; return { type: 'multi', q: `Shop P: median wait ${mA} s, IQR ${iA} s. Shop Q: median wait ${mB} s, IQR ${iB} s. Which statements are true?`, opts: [[`On average, shop ${better} has longer waits`, true], [`Shop ${cons}’s waiting times are more consistent`, true], [`On average, shop ${better === 'P' ? 'Q' : 'P'} has longer waits`, false], [`Shop ${cons === 'P' ? 'Q' : 'P'}’s waiting times are more consistent`, false]], need: 2, why: `Compare the medians (${mA} and ${mB}) for the average, and the IQRs (${iA} and ${iB}) for the spread.` }; },
    () => { const q1 = FD.rnd(10, 40), md = q1 + FD.rnd(3, 15), q3 = md + FD.rnd(3, 15), mn = q1 - FD.rnd(3, 10), mx = q3 + FD.rnd(3, 15); return { type: 'num', q: `A box plot shows: smallest ${mn}, lower quartile ${q1}, median ${md}, upper quartile ${q3}, largest ${mx}. Find the interquartile range and the range.`, a: [q3 - q1, mx - mn], fields: ['IQR =', 'range ='], why: `IQR \\(= ${q3} - ${q1} = ${q3 - q1}\\). Range \\(= ${mx} - ${mn} = ${mx - mn}\\).` }; },
    () => { const n = FD.pick([40, 80, 120, 200]), q3 = FD.rnd(50, 80); return { type: 'num', q: `${n} students took a test. The upper quartile is ${q3}. About how many students scored more than ${q3}?`, a: n / 4, why: `A quarter of the data lies above \\(Q_3\\): \\(\\frac{${n}}{4} = ${n / 4}\\).` }; },
  ],
});

FD.check({
  section: 'boxplot',
  items: [
    { type: 'mcq', q: 'In a box plot, what does the length of the box show?', opts: ['The interquartile range', 'The range', 'The median', 'The mean'], why: 'From \\(Q_1\\) to \\(Q_3\\).' },
    { type: 'multi', q: 'Team A: median 62, IQR 10. Team B: median 70, IQR 25. Which are good comparisons?', opts: [['Team B scored higher on average', true], ['Team A’s scores were more consistent', true], ['Team A scored higher on average', false], ['Team B’s scores were more consistent', false]], need: 2, why: 'Higher median for B; smaller IQR for A.' },
    { type: 'num', q: '60 people were timed. The lower quartile is 14 minutes. About how many took 14 minutes or less?', a: 15, why: 'A quarter of 60.' },
    { type: 'tf', q: 'To compare two distributions, you should compare an average and a measure of spread.', a: true, why: 'Both, in context.' },
  ],
});
