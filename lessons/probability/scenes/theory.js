FD.COL = { r: 'red', b: 'blue', g: 'green', y: 'yellow' };
// A bag of counters: counts { r, b, g, y }; hi = colour to keep bright ('' = all bright).
FD.bag = (host) => (counts, hi = '') => {
  const list = []; Object.keys(FD.COL).forEach((k) => { for (let i = 0; i < (counts[k] || 0); i++) list.push(k); });
  const per = 10, rows = Math.max(1, Math.ceil(list.length / per)), H = 60 + rows * 34;
  let s = `<path class="bag" d="M120,30 Q100,30 100,50 L90,${H - 10} Q90,${H} 110,${H} L490,${H} Q510,${H} 510,${H - 10} L500,50 Q500,30 480,30 Z"/>`;
  list.forEach((k, i) => { const r = Math.floor(i / per), c = i % per; s += `<circle class="ct ${k} ${hi && hi !== k ? 'dim' : ''}" cx="${147 + c * 34}" cy="${68 + r * 34}" r="14"/>`; });
  host.innerHTML = `<svg viewBox="0 0 600 ${H + 6}" role="img" aria-label="A bag with ${Object.keys(FD.COL).filter((k) => counts[k]).map((k) => `${counts[k]} ${FD.COL[k]}`).join(', ')} counters">${s}</svg>`;
};
FD.B1 = { r: 3, b: 5, g: 2 };

FD.add({
  id: 'theory',
  title: 'Equally likely outcomes',
  tab: 'Calculating',
  icon: 'frac',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Equally likely', 'Every outcome has the same chance, e.g. each face of a fair dice.'],
    ['Probability of an event', '\\(P = \\dfrac{\\text{number of favourable outcomes}}{\\text{total number of outcomes}}\\)'],
    ['Fair', 'Not biased: all the outcomes are equally likely.'],
    ['Complement', 'The event not happening: \\(P(\\text{not } A) = 1 - P(A)\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'th-s', '<div id="bg"></div>', `
      <div class="hc-sl">${['r', 'b', 'g', 'y'].map((k) => `<label class="ctrl">${FD.COL[k]} <input type="range" id="n${k}" min="0" max="10" value="${FD.B1[k] || 0}"><output id="o${k}">${FD.B1[k] || 0}</output></label>`).join('')}</div>
      <div class="bd-row"><label for="pc">Colour to pick</label><select id="pc">${['r', 'b', 'g', 'y'].map((k) => `<option value="${k}">${FD.COL[k]}</option>`).join('')}</select></div>`, () => sync());
    a.bag = FD.bag(a.$('#bg'));
    const sync = () => {
      const c = {}; ['r', 'b', 'g', 'y'].forEach((k) => { c[k] = +a.$('#n' + k).value; a.$('#o' + k).textContent = c[k]; });
      const k = a.$('#pc').value, n = c.r + c.b + c.g + c.y; a.bag(c, k);
      if (!n) { a.big(''); a.msg('The bag is empty: add some counters.', 'bad'); return; }
      a.big(`P(\\text{${FD.COL[k]}}) = ${FD.ftex(c[k], n)} \\qquad P(\\text{not ${FD.COL[k]}}) = 1 - ${FD.ftex(c[k], n)} = ${FD.ftex(n - c[k], n)}`);
      a.msg(`Picking ${FD.COL[k]} is ${FD.word(c[k] / n)}.`);
    };
    a.$('.hc-sl').addEventListener('input', sync); a.$('#pc').addEventListener('change', sync);
    a.bag(FD.B1);
    return a;
  },
  steps: [
    {
      title: 'Counting outcomes',
      text: '<p>A bag has 3 red, 5 blue and 2 green counters. One counter is taken at random, so each of the <b>10</b> counters is equally likely to be picked.</p>',
      async on(a, ctx) { a.reset(); a.bag(FD.B1); a.big('3 + 5 + 2 = 10 \\text{ outcomes}'); },
    },
    {
      title: 'The probability of an event',
      text: '<p>Count the outcomes you want and divide by the total number of outcomes.</p>',
      tip: 'Give probabilities as fractions, decimals or percentages, never as “3 out of 10” or “3 : 10”.',
      async on(a, ctx) {
        a.reset(); a.bag(FD.B1, 'r');
        await a.lines([['P(\\text{red}) = \\frac{3}{10}', '3 red out of 10'], ['P(\\text{blue}) = \\frac{5}{10} = \\frac12', 'simplify']], ctx, 1400);
      },
    },
    {
      title: 'Fair dice',
      text: '<p>A fair six-sided dice has 6 equally likely outcomes: 1, 2, 3, 4, 5, 6. The prime numbers are 2, 3 and 5.</p>',
      async on(a, ctx) {
        a.reset(); a.$('#bg').innerHTML = '<div class="dice-row"><span>1</span><span class="six">2</span><span class="six">3</span><span>4</span><span class="six">5</span><span>6</span></div>';
        a.big('P(\\text{prime}) = \\frac36 = \\frac12');
      },
    },
    {
      title: 'Not happening',
      text: '<p>An event either happens or it does not, so the two probabilities add up to 1. P(not green) = 1 − P(green).</p>',
      async on(a, ctx) {
        a.reset(); a.bag(FD.B1, 'g');
        await a.lines([['P(\\text{green}) = \\frac{2}{10}', ''], ['P(\\text{not green}) = 1 - \\frac{2}{10} = \\frac{8}{10} = \\frac45', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: fill the bag',
      text: '<p>Choose how many counters of each colour are in the bag, and which colour you want to pick. Read both probabilities.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'theory',
  gens: [
    () => { const c = { r: FD.rnd(1, 9), b: FD.rnd(1, 9), g: FD.rnd(0, 6) }, k = FD.pick(['r', 'b']), n = c.r + c.b + c.g; return { type: 'num', q: `A bag has ${c.r} red, ${c.b} blue and ${c.g} green counters. One is taken at random. Find the probability that it is ${FD.COL[k]}.`, ...FD.pq(c[k], n), why: `${c[k]} ${FD.COL[k]} out of ${n}: \\(${FD.ftex(c[k], n)}\\).` }; },
    () => { const [p, q] = FD.pick([[0.3, '0.7'], [0.15, '0.85'], [0.62, '0.38'], [0.07, '0.93'], [0.45, '0.55']]); return { type: 'num', q: `The probability that it rains tomorrow is ${p}. What is the probability that it does not rain?`, a: FD.dec(1 - p), why: `\\(1 - ${p} = ${q}\\).` }; },
    () => { const [t, n] = FD.pick([['an even number', 3], ['a number greater than 4', 2], ['a multiple of 3', 2], ['a factor of 6', 4], ['a square number', 2]]); return { type: 'num', q: `A fair six-sided dice is rolled. Find the probability that it shows ${t}.`, ...FD.pq(n, 6), why: `${n} of the 6 outcomes: \\(${FD.ftex(n, 6)}\\).` }; },
    () => { const s = FD.pick([5, 8, 10]), k = FD.rnd(1, s - 1); return { type: 'num', q: `A fair spinner has ${s} equal sections numbered 1 to ${s}. What is the probability that it does NOT land on a number up to ${k}?`, ...FD.pq(s - k, s), why: `P(1 to ${k}) \\(= ${FD.ftex(k, s)}\\), so P(not) \\(= 1 - ${FD.ftex(k, s)} = ${FD.ftex(s - k, s)}\\).` }; },
  ],
});

FD.check({
  section: 'theory',
  items: [
    { type: 'num', q: 'A bag has 4 red and 6 yellow counters. Find P(yellow).', ...FD.pq(6, 10), why: '\\(\\frac{6}{10} = \\frac35\\).' },
    { type: 'num', q: 'P(win) = 0.35. Find P(not win).', a: 0.65, why: '\\(1 - 0.35\\).' },
    { type: 'mcq', q: 'A fair dice is rolled. P(less than 3) =', opts: ['\\(\\tfrac13\\)', '\\(\\tfrac12\\)', '\\(\\tfrac36\\)', '\\(\\tfrac23\\)'], why: '1 and 2: \\(\\frac26 = \\frac13\\).' },
    { type: 'tf', q: 'If P(A) = 0.4 then P(not A) = 0.4 too.', a: false, why: '\\(1 - 0.4 = 0.6\\).' },
  ],
});
