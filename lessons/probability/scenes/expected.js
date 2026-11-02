// A bar of n trials with the expected part shaded.
FD.expBar = (host) => (n, p, label) => {
  const e = FD.dec(n * p), w = 500 * p;
  host.innerHTML = `<svg viewBox="0 0 600 120" role="img" aria-label="${n} trials; expected ${e} ${label}">
    <rect class="cg-grid" x="50" y="40" width="500" height="44" rx="6" fill="none"/>
    <rect class="cg-bar" x="50" y="40" width="${w}" height="44" rx="6"/>
    <text class="cg-v" x="${50 + Math.max(w / 2, 30)}" y="68">${e}</text>
    <text class="cg-name" x="50" y="28">${label}: expected ${e} out of ${n}</text>
    <text class="cg-t" x="50" y="104">0</text><text class="cg-t" x="550" y="104">${n} trials</text>
  </svg>`;
};
FD.EVT = [['a six on a fair dice', 1, 6], ['heads on a fair coin', 1, 2], ['red from 3 red and 7 blue counters', 3, 10], ['a 1 on a fair 5-section spinner', 1, 5]];

FD.add({
  id: 'expected',
  title: 'Expected frequency',
  tab: 'Expected',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Expected frequency', 'How many times you expect an event to happen: probability × number of trials.'],
    ['Fair or biased?', 'Compare what happened with the expected frequency. A big difference after many trials suggests bias.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ex-s', '<div id="eb"></div>', `
      <div class="bd-row"><label for="ev">Event</label><select id="ev">${FD.EVT.map((e, i) => `<option value="${i}">${e[0]}</option>`).join('')}</select></div>
      <label class="ctrl">Trials <input type="range" id="rn" min="10" max="600" step="10" value="300"><output id="on">300</output></label>`, () => sync());
    a.bar = FD.expBar(a.$('#eb'));
    const sync = () => {
      const [t, k, d] = FD.EVT[+a.$('#ev').value], n = +a.$('#rn').value; a.$('#on').textContent = n;
      a.bar(n, k / d, t);
      a.big(`${FD.ftex(k, d)} \\times ${n} = ${FD.round(n * k / d, 1)}`);
      a.msg(Number.isInteger(n * k / d) ? 'This is what we expect on average: the real result will usually be close, not exact.' : 'The expected frequency does not have to be a whole number.');
    };
    a.$('#ev').addEventListener('change', sync); a.$('#rn').addEventListener('input', sync);
    a.bar(300, 1 / 6, 'a six on a fair dice');
    return a;
  },
  steps: [
    {
      title: 'How many sixes?',
      text: '<p>A fair dice is rolled 300 times. About how many sixes should we expect? Each roll has a \\(\\frac16\\) chance, so we expect \\(\\frac16\\) of the 300 rolls to be sixes.</p>',
      async on(a, ctx) { a.reset(); a.bar(300, 1 / 6, 'a six on a fair dice'); a.big('\\text{expected frequency} = \\frac16 \\times 300 = 50'); },
    },
    {
      title: 'Probability × trials',
      text: '<p>The probability that a spinner lands on red is 0.35. It is spun 200 times.</p>',
      tip: 'Expected frequency = probability × number of trials.',
      async on(a, ctx) { a.reset(); a.bar(200, 0.35, 'red on the spinner'); await a.lines([['0.35 \\times 200 = 70', 'expected number of reds']], ctx, 1200); },
    },
    {
      title: 'Using results from an experiment',
      text: '<p>In a trial, 18 out of 60 seeds grew into plants. A gardener plants 500 of the same seeds. Use the relative frequency as the probability.</p>',
      async on(a, ctx) { a.reset(); a.bar(500, 0.3, 'seeds that grow'); await a.lines([['\\frac{18}{60} = 0.3', 'relative frequency'], ['0.3 \\times 500 = 150 \\text{ plants}', 'estimate']], ctx, 1400); },
    },
    {
      title: 'Fair or biased?',
      text: '<p>Leo rolls a dice 300 times and gets 92 sixes. For a fair dice we expect about 50. 92 is far more than 50 after many rolls, so the dice is probably <b>biased</b>.</p>',
      async on(a, ctx) { a.reset(); a.bar(300, 92 / 300, 'sixes Leo got'); a.big('\\text{expected } 50 \\quad \\text{but got } 92'); a.msg('A big difference after many trials suggests the dice is biased.', 'bad'); },
    },
    {
      title: 'Try it: how many to expect?',
      text: '<p>Choose an event and a number of trials. The bar shows the expected frequency.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'expected',
  gens: [
    () => { const [t, k, d] = FD.pick(FD.EVT), n = d * FD.rnd(4, 40); return { type: 'num', q: `The probability of getting ${t} is \\(${FD.ftex(k, d)}\\). It is tried ${n} times. How many times would you expect to get ${t}?`, a: (n * k) / d, why: `\\(${FD.ftex(k, d)} \\times ${n} = ${(n * k) / d}\\).` }; },
    () => { const p = FD.pick([0.05, 0.12, 0.2, 0.35, 0.4, 0.65]), n = FD.pick([100, 200, 300, 400, 500, 1000]); return { type: 'num', q: `The probability that a light bulb is faulty is ${p}. A shop sells ${n} bulbs. Estimate how many are faulty.`, a: FD.dec(p * n), why: `\\(${p} \\times ${n} = ${FD.dec(p * n)}\\).` }; },
    () => { const t = FD.pick([20, 40, 50]), s = FD.rnd(Math.round(t * 0.2), Math.round(t * 0.7)), n = FD.pick([200, 400, 1000]); return { type: 'num', q: `In a survey of ${t} people, ${s} said they walk to work. Estimate how many of ${n} people walk to work.`, a: FD.dec((s / t) * n), why: `Relative frequency \\(\\frac{${s}}{${t}}\\). \\(\\frac{${s}}{${t}} \\times ${n} = ${FD.dec((s / t) * n)}\\).` }; },
  ],
});

FD.check({
  section: 'expected',
  items: [
    { type: 'num', q: 'A fair coin is thrown 90 times. How many heads would you expect?', a: 45, why: '\\(\\frac12 \\times 90\\).' },
    { type: 'num', q: 'P(win) = 0.15. Ana plays 60 times. How many wins should she expect?', a: 9, why: '\\(0.15 \\times 60\\).' },
    { type: 'mcq', q: 'A dice is rolled 600 times and lands on 4 a total of 240 times. What does this suggest?', opts: ['The dice is probably biased', 'The dice is fair', 'Nothing: 600 rolls is too few', 'It should have landed on 4 exactly 240 times'], why: 'Expected about 100; 240 is far more.' },
    { type: 'tf', q: 'The expected frequency is always exactly what happens.', a: false, why: 'It is what happens on average.' },
  ],
});
