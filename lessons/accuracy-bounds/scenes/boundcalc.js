FD.add({
  id: 'boundcalc',
  title: 'Bounds in calculations',
  tab: 'In calculations',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Biggest sum or product', 'Use the upper bounds: UB + UB, UB × UB.'],
    ['Biggest difference', 'UB − LB (take the smallest amount away from the biggest).'],
    ['Biggest quotient', 'UB ÷ LB (big on top, small on the bottom).'],
    ['Suitable degree of accuracy', 'Round the UB and LB of the answer; give the value they both round to.'],
  ],
  mount(el) {
    const a = FD.board(el, 'bc-s', '<div class="mbig" id="tab"></div>', `
      <label class="ctrl">Distance (m, nearest 10) <input type="range" id="rd" min="100" max="900" step="10" value="400"><output id="od">400</output></label>
      <label class="ctrl">Time (s, nearest second) <input type="range" id="rt" min="20" max="120" value="50"><output id="ot">50</output></label>`, () => sync());
    const sync = () => {
      const d = +a.$('#rd').value, t = +a.$('#rt').value; a.$('#od').textContent = d; a.$('#ot').textContent = t;
      const up = (d + 5) / (t - 0.5), lo = (d - 5) / (t + 0.5);
      a.$('#tab').innerHTML = FD.tex(`d: ${d - 5} \\le d < ${d + 5} \\qquad t: ${t - 0.5} \\le t < ${t + 0.5}`, true);
      a.big(`\\text{UB of speed} = \\frac{${d + 5}}{${t - 0.5}} = ${up.toFixed(3)} \\qquad \\text{LB} = \\frac{${d - 5}}{${t + 0.5}} = ${lo.toFixed(3)}`);
      a.msg('Biggest speed: biggest distance ÷ smallest time. Smallest speed: smallest distance ÷ biggest time.');
    };
    ['#rd', '#rt'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.tab = (t) => { a.$('#tab').innerHTML = FD.tex(t, true); };
    a.tab('');
    return a;
  },
  steps: [
    {
      title: 'Adding and multiplying',
      text: '<p>A rectangle measures 8 cm by 5 cm, both to the nearest cm. Find the upper bound of its area.</p><p>For the biggest product, use both <b>upper bounds</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.tab('8.5 \\times 5.5');
        await a.lines([['\\text{length: } 7.5 \\le l < 8.5', ''], ['\\text{width: } 4.5 \\le w < 5.5', ''], ['\\text{UB of area} = 8.5 \\times 5.5 = 46.75 \\text{ cm}^2', 'UB × UB'], ['\\text{LB of area} = 7.5 \\times 4.5 = 33.75 \\text{ cm}^2', 'LB × LB']], ctx, 1300);
      },
    },
    {
      title: 'Subtracting and dividing',
      text: '<p>For the biggest <b>difference</b> or <b>quotient</b>, make the first number as big as possible and the second as <b>small</b> as possible.</p>',
      tip: 'Ask yourself: what makes the answer bigger?',
      async on(a, ctx) {
        a.reset(); a.tab('\\text{UB}(a - b) = \\text{UB}_a - \\text{LB}_b \\qquad \\text{UB}(a \\div b) = \\text{UB}_a \\div \\text{LB}_b');
        await a.lines([['a = 20, \\; b = 6 \\text{ (nearest whole number)}', ''], ['\\text{UB}(a - b) = 20.5 - 5.5 = 15', ''], ['\\text{UB}(a \\div b) = 20.5 \\div 5.5 = 3.727\\dots', '']], ctx, 1400);
      },
    },
    {
      title: 'Speed',
      text: '<p>A runner covers 400 m (to the nearest 10 m) in 50 s (to the nearest second). Find the lower bound of her average speed.</p>',
      async on(a, ctx) {
        a.reset(); a.tab('395 \\le d < 405 \\qquad 49.5 \\le t < 50.5');
        await a.lines([['\\text{LB of speed} = \\frac{\\text{LB of } d}{\\text{UB of } t}', 'small ÷ big'], ['= \\frac{395}{50.5} = 7.82\\dots \\text{ m/s}', '']], ctx, 1400);
      },
    },
    {
      title: 'A suitable degree of accuracy',
      text: '<p>To give an answer to a sensible accuracy, round both the UB and the LB. Choose the accuracy where they <b>agree</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.tab('\\text{LB} = 7.82\\dots \\qquad \\text{UB} = \\frac{405}{49.5} = 8.18\\dots');
        await a.lines([['7.82 \\to 8 \\quad 8.18 \\to 8', 'nearest whole number: both 8'], ['7.82 \\to 7.8 \\quad 8.18 \\to 8.2', '1 d.p.: they disagree'], ['\\text{speed} = 8 \\text{ m/s (1 s.f.)}', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: the speed of a runner',
      text: '<p>Choose a distance and a time. The bounds of each are shown, and the upper and lower bounds of the speed are worked out.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'boundcalc',
  gens: [
    () => { const l = FD.rnd(4, 20), w = FD.rnd(2, 15), up = FD.rnd(0, 1); return { type: 'num', q: `A rectangle is ${l} cm by ${w} cm, both to the nearest cm. Work out the ${up ? 'upper' : 'lower'} bound of its area, in cm².`, a: up ? FD.dec((l + 0.5) * (w + 0.5)) : FD.dec((l - 0.5) * (w - 0.5)), why: up ? `UB × UB: \\(${l + 0.5} \\times ${w + 0.5} = ${FD.dec((l + 0.5) * (w + 0.5))}\\).` : `LB × LB: \\(${l - 0.5} \\times ${w - 0.5} = ${FD.dec((l - 0.5) * (w - 0.5))}\\).` }; },
    () => { const a1 = FD.rnd(30, 90), b1 = FD.rnd(5, 25), up = FD.rnd(0, 1); return { type: 'num', q: `\\(a = ${a1}\\) and \\(b = ${b1}\\), both to the nearest whole number. Work out the ${up ? 'upper' : 'lower'} bound of \\(a - b\\).`, a: up ? FD.dec(a1 + 0.5 - (b1 - 0.5)) : FD.dec(a1 - 0.5 - (b1 + 0.5)), why: up ? `UB of a − LB of b: \\(${a1 + 0.5} - ${b1 - 0.5} = ${a1 - b1 + 1}\\).` : `LB of a − UB of b: \\(${a1 - 0.5} - ${b1 + 0.5} = ${a1 - b1 - 1}\\).` }; },
    () => { const d = FD.pick([100, 120, 150, 200, 240, 300]), t = FD.pick([4, 5, 8, 10, 12]); const ub = FD.dec((d + 5) / (t - 0.5)); return { type: 'num', q: `A car travels ${d} m (to the nearest 10 m) in ${t} s (to the nearest second). Work out the upper bound of its average speed, in m/s. Give your answer to 3 significant figures.`, a: FD.sigfig(ub, 3), tol: 0.051, why: `UB of distance ÷ LB of time: \\(${d + 5} \\div ${t - 0.5} = ${ub.toFixed(4)}\\dots \\approx ${FD.sigfig(ub, 3)}\\).` }; },
  ],
});

FD.check({
  section: 'boundcalc',
  items: [
    { type: 'num', q: '\\(p = 12\\) and \\(q = 3\\), both to the nearest whole number. Work out the upper bound of \\(p \\div q\\).', a: 5, why: '\\(12.5 \\div 2.5 = 5\\).' },
    { type: 'num', q: 'A square has sides of 6.2 cm, correct to 1 d.p. Work out the lower bound of its perimeter, in cm.', a: 24.6, why: '\\(4 \\times 6.15 = 24.6\\).' },
    { type: 'mcq', q: 'To find the lower bound of \\(a - b\\), use…', opts: ['LB of a − UB of b', 'LB of a − LB of b', 'UB of a − LB of b', 'UB of a − UB of b'], why: 'Smallest a, take away the biggest b.' },
    { type: 'mcq', q: 'The LB of a value is 3.46 and the UB is 3.54. To what accuracy can you give it?', opts: ['3.5 (1 d.p.)', '3.50 (2 d.p.)', '3.46 (2 d.p.)', '4 (1 s.f.) only'], why: 'Both round to 3.5 to 1 d.p.; to 2 d.p. they differ.' },
  ],
});
