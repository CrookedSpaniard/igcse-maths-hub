FD.add({
  id: 'problems',
  title: 'Problems in standard form',
  tab: 'Problems',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Read carefully', 'Decide whether to multiply or divide, and keep track of the units.'],
    ['How many times bigger', 'Divide the bigger number by the smaller one.'],
    ['Answer form', 'Give the answer in standard form if the question asks, usually to 3 significant figures.'],
  ],
  mount(el) {
    const planets = [['Mercury', 5.79e7], ['Venus', 1.08e8], ['Earth', 1.5e8], ['Mars', 2.28e8], ['Jupiter', 7.78e8], ['Saturn', 1.43e9]];
    const a = FD.board(el, 'pr-s', '<div class="mbig" id="eq"></div>', `
      <div class="bd-row"><label>Planet <select id="pl">${planets.map(([n], i) => `<option value="${i}">${n}</option>`).join('')}</select></label></div>`, () => sync());
    a.eq = (t) => { a.$('#eq').innerHTML = FD.tex(t, true); };
    const sync = () => {
      const [name, d] = planets[+a.$('#pl').value], t = d / 3e5;
      a.eq(`\\text{${name}: } ${FD.sfTex(d)} \\text{ km from the Sun}`);
      a.big(`t = \\frac{${FD.sfTex(d)}}{3 \\times 10^5} = ${FD.sfTex(+t.toPrecision(3))} \\text{ s} \\approx ${(t / 60).toFixed(1)} \\text{ minutes}`);
      a.msg('Light travels at about \\(3 \\times 10^5\\) km per second. Time = distance ÷ speed.');
    };
    a.$('#pl').addEventListener('input', sync);
    a.eq('');
    return a;
  },
  steps: [
    {
      title: 'How long does sunlight take?',
      text: '<p>The Earth is \\(1.5 \\times 10^8\\) km from the Sun. Light travels \\(3 \\times 10^5\\) km every second. How long does sunlight take to reach the Earth?</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\text{time} = \\frac{\\text{distance}}{\\text{speed}}');
        await a.lines([['\\frac{1.5 \\times 10^8}{3 \\times 10^5} = 0.5 \\times 10^3', ''], ['= 5 \\times 10^2 \\text{ s} = 500 \\text{ s}', ''], ['500 \\div 60 \\approx 8.3 \\text{ minutes}', '']], ctx, 1400);
      },
    },
    {
      title: 'How many times bigger?',
      text: '<p>The mass of the Earth is \\(5.97 \\times 10^{24}\\) kg and the mass of the Moon is \\(7.35 \\times 10^{22}\\) kg. How many times heavier is the Earth?</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{5.97 \\times 10^{24}}{7.35 \\times 10^{22}}');
        await a.lines([['= 0.8122\\dots \\times 10^{2}', ''], ['= 81.2 \\text{ times}', '3 s.f.']], ctx, 1400);
      },
    },
    {
      title: 'Per person',
      text: '<p>A country has a population of \\(6.7 \\times 10^7\\). It produces \\(3.2 \\times 10^{10}\\) kg of waste a year. How much waste is that per person?</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{3.2 \\times 10^{10}}{6.7 \\times 10^7}');
        await a.lines([['= 0.4776\\dots \\times 10^{3}', ''], ['\\approx 478 \\text{ kg per person}', '3 s.f.']], ctx, 1400);
      },
    },
    {
      title: 'Very small numbers',
      text: '<p>A cell is \\(8 \\times 10^{-6}\\) m wide. How many cells, side by side, would make a line 2 cm long?</p><p>Change to the <b>same units</b> first: 2 cm = \\(2 \\times 10^{-2}\\) m.</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{2 \\times 10^{-2}}{8 \\times 10^{-6}}');
        await a.lines([['= 0.25 \\times 10^{4}', ''], ['= 2.5 \\times 10^3 = 2500 \\text{ cells}', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: light from the Sun',
      text: '<p>Choose a planet. The time light takes to reach it from the Sun is worked out in standard form.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'problems',
  gens: [
    () => { const a1 = FD.pick([2, 3, 4, 5, 6, 8]), n1 = FD.rnd(7, 12), a2 = FD.pick([1.5, 2, 2.5, 4, 5]), n2 = FD.rnd(3, 6), r = (a1 * 10 ** n1) / (a2 * 10 ** n2), [A, n] = FD.sfp(+r.toPrecision(6)); return { type: 'num', q: `A country spends £\\(${a1} \\times 10^{${n1}}\\) on a project. There are \\(${a2} \\times 10^{${n2}}\\) people. How much is that per person? Give your answer in standard form.`, a: [A, n], fields: ['A =', 'n ='], tol: 0.005, why: `\\(\\dfrac{${a1} \\times 10^{${n1}}}{${a2} \\times 10^{${n2}}} = ${FD.round(a1 / a2, 4)} \\times 10^{${n1 - n2}} = ${A} \\times 10^{${n}}\\).` }; },
    () => { const m = FD.pick([[2, 'grain of sand', -5], [6, 'raindrop', -5], [3, 'dust particle', -9]]), k = FD.rnd(2, 9), n = FD.rnd(3, 7), tot = m[0] * k * 10 ** (m[2] + n), [A, e] = FD.sfp(+tot.toPrecision(6)); return { type: 'num', q: `One ${m[1]} has a mass of \\(${m[0]} \\times 10^{${m[2]}}\\) kg. Find the total mass of \\(${k} \\times 10^{${n}}\\) of them, in kg, in standard form.`, a: [A, e], fields: ['A =', 'n ='], why: `\\(${m[0]} \\times ${k} = ${m[0] * k}\\) and \\(${m[2]} + ${n} = ${m[2] + n}\\): \\(${m[0] * k} \\times 10^{${m[2] + n}} = ${A} \\times 10^{${e}}\\).` }; },
    () => { const a1 = FD.rnd(2, 9), n1 = FD.rnd(8, 15), a2 = FD.rnd(1, a1 - 1) || 1, d = FD.rnd(1, 3), ratio = +((a1 * 10 ** d) / a2).toPrecision(3); return { type: 'num', q: `Star A is \\(${a1} \\times 10^{${n1}}\\) km away. Star B is \\(${a2} \\times 10^{${n1 - d}}\\) km away. How many times further away is star A? Give your answer to 3 significant figures.`, a: ratio, tol: ratio * 0.006, why: `\\(\\dfrac{${a1} \\times 10^{${n1}}}{${a2} \\times 10^{${n1 - d}}} = ${FD.round(a1 / a2, 4)} \\times 10^{${d}} \\approx ${ratio}\\).` }; },
  ],
});

FD.check({
  section: 'problems',
  items: [
    { type: 'num', q: 'A virus is \\(1.2 \\times 10^{-7}\\) m long. How many, end to end, make 3 mm? (3 mm = \\(3 \\times 10^{-3}\\) m)', a: 25000, why: '\\(3 \\times 10^{-3} \\div 1.2 \\times 10^{-7} = 2.5 \\times 10^4\\).' },
    { type: 'num', q: 'Light travels \\(3 \\times 10^5\\) km/s. How far does it travel in \\(6 \\times 10^{1}\\) seconds? Give your answer in standard form.', a: [1.8, 7], fields: ['A =', 'n ='], why: '\\(18 \\times 10^6 = 1.8 \\times 10^7\\) km.' },
    { type: 'mcq', q: 'Jupiter is \\(7.78 \\times 10^8\\) km from the Sun and Earth is \\(1.5 \\times 10^8\\) km. About how many times further is Jupiter?', opts: ['5.19', '51.9', '0.193', '6.28'], why: '\\(7.78 \\div 1.5 = 5.19\\) (the powers cancel).' },
    { type: 'num', q: 'A computer does \\(4 \\times 10^9\\) calculations per second. How many does it do in one hour? Give your answer in standard form.', a: [1.44, 13], fields: ['A =', 'n ='], why: '\\(4 \\times 10^9 \\times 3600 = 14\\,400 \\times 10^9 = 1.44 \\times 10^{13}\\).' },
  ],
});
