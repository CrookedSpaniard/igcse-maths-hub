// Tree for taking two counters from r red and b blue, with or without replacement.
FD.bagT = (r, b, back = false) => { const n = r + b, m = back ? n : n - 1; return { n: ['R', 'B'], h: ['1st counter', '2nd counter'], p1: [FD.pf(r, n), FD.pf(b, n)], p2: [[FD.pf(back ? r : r - 1, m), FD.pf(b, m)], [FD.pf(r, m), FD.pf(back ? b : b - 1, m)]] }; };
FD.CEV = [['both red', [[0, 0]]], ['both blue', [[1, 1]]], ['one of each colour', [[0, 1], [1, 0]]], ['the same colour', [[0, 0], [1, 1]]]];

FD.add({
  id: 'conditional',
  title: 'Conditional probability',
  tab: 'Conditional',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Without replacement', 'The first item is not put back, so there is one fewer for the second pick.'],
    ['Dependent events', 'The first outcome changes the probabilities for the second.'],
    ['Conditional probability', 'A probability given that something has already happened, e.g. P(second is red, given the first was red).'],
  ],
  mount(el) {
    const a = FD.board(el, 'cd-s', '<div id="tr"></div>', `
      <div class="cp-sl"><label class="ctrl">Red <input type="range" id="nr" min="1" max="9" value="5"><output id="or">5</output></label><label class="ctrl">Blue <input type="range" id="nb" min="1" max="9" value="3"><output id="ob">3</output></label></div>
      <div class="bd-row"><label for="ce">Event</label><select id="ce">${FD.CEV.map((e, i) => `<option value="${i}">${e[0]}</option>`).join('')}</select><button class="btn ghost" id="bBack">Put the first one back</button></div>`, () => sync());
    a.tr = FD.tree(a.$('#tr'));
    let back = false;
    const sync = () => {
      const r = +a.$('#nr').value, b = +a.$('#nb').value, T = FD.bagT(r, b, back), [t, pairs] = FD.CEV[+a.$('#ce').value];
      a.$('#or').textContent = r; a.$('#ob').textContent = b; a.$('#bBack').textContent = back ? 'Do not put it back' : 'Put the first one back';
      a.tr(T, 3, pairs); a.big(`P(\\text{${t}}) = ${FD.tsum(T, pairs).x}`);
      a.msg(back ? 'With replacement: the second-stage probabilities are the same as the first.' : 'Without replacement: there is one counter fewer for the second pick.');
    };
    a.$('.cp-sl').addEventListener('input', sync); a.$('#ce').addEventListener('change', sync);
    a.$('#bBack').addEventListener('click', () => { back = !back; sync(); });
    a.tr(FD.bagT(5, 3), 1);
    return a;
  },
  steps: [
    {
      title: 'Taking counters out',
      text: '<p>A bag has 5 red and 3 blue counters. Zara takes one at random and does <b>not</b> put it back. Then she takes another. For the first counter, P(red) = \\(\\frac58\\).</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.bagT(5, 3), 1); },
    },
    {
      title: 'The second pick depends on the first',
      text: '<p>If the first counter was red, the bag now has 4 red and 3 blue: 7 counters. So P(red second, given red first) = \\(\\frac47\\). If the first was blue, there are 5 red and 2 blue left.</p>',
      tip: 'Without replacement, the denominators go down by 1 on the second branches.',
      async on(a, ctx) { a.reset(); a.tr(FD.bagT(5, 3), 2, [[0]]); a.big('P(\\text{R second} \\mid \\text{R first}) = \\frac47'); },
    },
    {
      title: 'Both red',
      text: '<p>Multiply along the path R then R.</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.bagT(5, 3), 3, [[0, 0]]); a.big('P(RR) = \\frac58 \\times \\frac47 = \\frac{20}{56} = \\frac{5}{14}'); },
    },
    {
      title: 'One of each colour',
      text: '<p>Red then blue, or blue then red: find both paths and add.</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.bagT(5, 3), 3, [[0, 1], [1, 0]]); await a.lines([['\\frac{15}{56} + \\frac{15}{56} = \\frac{30}{56} = \\frac{15}{28}', 'RB + BR']], ctx, 1000); },
    },
    {
      title: 'Try it: change the bag',
      text: '<p>Change the counters in the bag, choose an event, and compare picking with and without replacement.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.fq = (n, d) => ({ a: n / d, show: `\\(${FD.ftex(n, d)}\\)`, hint: 'Type a fraction like 3/8.', form: 'fraction' });

FD.practice({
  section: 'conditional',
  gens: [
    () => { const r = FD.rnd(2, 8), b = FD.rnd(2, 8), n = r + b, k = FD.pick(['red', 'blue']), x = k === 'red' ? r : b; return { type: 'num', q: `A bag has ${r} red and ${b} blue counters. Two are taken at random without replacement. Find the probability that both are ${k}.`, ...FD.fq(x * (x - 1), n * (n - 1)), why: `\\(\\frac{${x}}{${n}} \\times \\frac{${x - 1}}{${n - 1}} = \\frac{${x * (x - 1)}}{${n * (n - 1)}}${FD.gcd(x * (x - 1), n * (n - 1)) > 1 ? ` = ${FD.ftex(x * (x - 1), n * (n - 1))}` : ''}\\).` }; },
    () => { const r = FD.rnd(2, 9), b = FD.rnd(2, 9), n = r + b, k = FD.pick(['red', 'blue']), x = k === 'red' ? r : b; return { type: 'num', q: `A box has ${r} red and ${b} blue pens. One pen is taken and not replaced. Given that it was ${k}, find the probability that the next pen is also ${k}.`, ...FD.fq(x - 1, n - 1), why: `${x - 1} ${k} pens are left out of ${n - 1}: \\(${FD.ftex(x - 1, n - 1)}\\).` }; },
    () => { const r = FD.rnd(2, 7), b = FD.rnd(2, 7), n = r + b, N = 2 * r * b, D = n * (n - 1); return { type: 'num', q: `A bag has ${r} red and ${b} blue sweets. Two are eaten, one after the other. Find the probability that they are different colours.`, ...FD.fq(N, D), why: `RB + BR: \\(\\frac{${r}}{${n}} \\times \\frac{${b}}{${n - 1}} + \\frac{${b}}{${n}} \\times \\frac{${r}}{${n - 1}} = \\frac{${N}}{${D}}${FD.gcd(N, D) > 1 ? ` = ${FD.ftex(N, D)}` : ''}\\).` }; },
  ],
});

FD.check({
  section: 'conditional',
  items: [
    { type: 'num', q: 'A bag has 4 red and 6 green balls. Two are taken without replacement. Find P(both green).', ...FD.fq(30, 90), why: '\\(\\frac{6}{10} \\times \\frac59 = \\frac{30}{90} = \\frac13\\).' },
    { type: 'num', q: '7 white and 3 black socks. One is taken and not replaced; it is black. Find P(the next one is black).', ...FD.fq(2, 9), why: '2 black left out of 9.' },
    { type: 'mcq', q: 'Without replacement, how do the second branches change?', opts: ['There is one fewer item, so the denominators go down by 1', 'They are the same as the first branches', 'The numerators double', 'They always add up to more than 1'], why: 'One item has been removed.' },
    { type: 'tf', q: 'Taking two cards from a pack without replacement gives independent events.', a: false, why: 'The first card changes what is left.' },
  ],
});
