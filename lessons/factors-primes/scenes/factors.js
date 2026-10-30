// The board: a picture, a big formula, a message, a worked example and a "Try it" panel.
// const a = FD.board(el, 'my-s', pictureHtml, tryHtml, onTry); a.$('#id') finds inside the scene.
FD.board = (el, cls, pic, tryHtml, onTry) => {
  el.innerHTML = `<div class="sim ${cls}"><div class="bd-pic" id="pic">${pic}</div><div class="mbig" id="big"></div><p class="verdict" id="msg"></p><div class="bd-work" id="work"></div><div class="card ctrls bd-try" id="try" hidden>${tryHtml || ''}</div></div>`;
  const root = el.querySelector('.sim'), $ = (s) => root.querySelector(s);
  let w = null;
  const api = {
    root, $,
    big(t) { $('#big').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t, c = 'good') { $('#msg').className = 'verdict ' + c; $('#msg').innerHTML = t || ''; },
    work(lines) { $('#work').innerHTML = ''; w = lines ? FD.work($('#work'), lines) : null; },
    upto: (i) => w && w.upto(i),
    // Shows the lines one by one; returns false if the step was left.
    async lines(lines, ctx, ms = 1300) { api.work(lines); for (let i = 0; i < lines.length; i++) { api.upto(i); if (!(await ctx.sleep(ms))) return false; } return true; },
    tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); if (onTry) onTry(); } },
    reset() { api.tryMode(false); api.work(null); api.msg(''); api.big(''); },
  };
  return api;
};
FD.factorsOf = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
FD.isPrime = (n) => n > 1 && FD.factorsOf(n).length === 2;

// Dots in a rectangle: n dots in r rows. Every rectangle you can make is a factor pair of n.
FD.dotRect = (host) => {
  host.innerHTML = '<svg class="dr" viewBox="0 0 600 230" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (n, r, cls = '') => {
    const c = n / r, s = Math.min(560 / c, 190 / r, 44), rad = Math.max(3, s * 0.36);
    const x0 = 300 - ((c - 1) * s) / 2, y0 = 100 - ((r - 1) * s) / 2;
    let out = '';
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out += `<circle class="dr-d ${cls}" cx="${(x0 + j * s).toFixed(1)}" cy="${(y0 + i * s).toFixed(1)}" r="${rad.toFixed(1)}"/>`;
    out += `<text class="dr-l" x="300" y="222">${r} row${r > 1 ? 's' : ''} of ${c} = ${n}</text>`;
    svg.innerHTML = out;
    svg.setAttribute('aria-label', `${n} dots in ${r} rows of ${c}`);
  };
};

FD.add({
  id: 'factors',
  title: 'Factors, multiples and primes',
  tab: 'Factors',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Factor', 'A whole number that divides into another exactly. The factors of 12 are 1, 2, 3, 4, 6 and 12.'],
    ['Multiple', 'A number in the times table of another. The multiples of 5 are 5, 10, 15, 20, …'],
    ['Even and odd', 'Even numbers are the multiples of 2 (they end in 0, 2, 4, 6 or 8). Odd numbers are not: they end in 1, 3, 5, 7 or 9.'],
    ['Prime number', 'A number with exactly two factors: 1 and itself. 2, 3, 5, 7, 11, 13, …'],
    ['Square number', 'A whole number times itself: \\(1, 4, 9, 16, 25, \\dots\\) (\\(n^2\\)).'],
    ['Cube number', 'A whole number times itself times itself: \\(1, 8, 27, 64, 125, \\dots\\) (\\(n^3\\)).'],
  ],
  mount(el) {
    let n = 12, r = 1;
    const a = FD.board(el, 'fa-s', '<div id="dots"></div>', `
      <label class="ctrl">Number <input type="range" id="rn" min="2" max="40" value="12"><output id="on">12</output></label>
      <div class="bd-btns" id="pairs"></div>`, () => sync());
    const dots = FD.dotRect(a.$('#dots'));
    a.dots = (nn, rr, cls) => { n = nn; r = rr; dots(nn, rr, cls); };
    const sync = () => {
      n = +a.$('#rn').value; a.$('#on').textContent = n;
      const f = FD.factorsOf(n), pairs = f.filter((x) => x * x <= n);
      a.$('#pairs').innerHTML = pairs.map((p) => `<button class="btn small-btn" data-r="${p}">${p} × ${n / p}</button>`).join('');
      a.$('#pairs').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { dots(n, +b.dataset.r, Math.sqrt(n) === +b.dataset.r ? 'sq' : ''); }));
      dots(n, 1);
      a.big(`\\text{Factors of } ${n}: \\; ${f.join(',\\ ')}`);
      const sq = Number.isInteger(Math.sqrt(n));
      a.msg(FD.isPrime(n) ? `${n} is <b>prime</b>: only one rectangle (1 row of ${n}). It has exactly two factors.` : `${n} has ${f.length} factors, so it is <b>not prime</b>.${sq ? ` It is a <b>square number</b>: ${Math.sqrt(n)} rows of ${Math.sqrt(n)}.` : ''}`, FD.isPrime(n) ? 'good' : 'bad');
    };
    a.$('#rn').addEventListener('input', sync);
    dots(12, 1);
    return a;
  },
  steps: [
    {
      title: 'Factors are rectangles',
      text: '<p>Arrange 12 dots into a rectangle. You can make 1 row of 12, 2 rows of 6 or 3 rows of 4.</p><p>Each rectangle gives a <b>factor pair</b>: \\(1 \\times 12\\), \\(2 \\times 6\\), \\(3 \\times 4\\).</p>',
      async on(a, ctx) {
        a.reset();
        for (const r of [1, 2, 3, 4, 6]) { a.dots(12, r); a.big(`${r} \\times ${12 / r} = 12`); if (!(await ctx.sleep(1100))) return; }
        a.big('\\text{Factors of } 12: \\; 1, 2, 3, 4, 6, 12');
      },
    },
    {
      title: 'Finding all the factors',
      text: '<p>Work in <b>pairs</b>: try 1, 2, 3, … in order. Stop when the pairs start to repeat.</p><p>For 36, the pair \\(6 \\times 6\\) meets in the middle, so you can stop there.</p>',
      tip: 'Factors come in pairs, so you never miss one if you go up in order.',
      async on(a, ctx) {
        a.reset(); a.dots(36, 6, 'sq');
        await a.lines([['36 = 1 \\times 36', ''], ['36 = 2 \\times 18', ''], ['36 = 3 \\times 12', ''], ['36 = 4 \\times 9', '5 is not a factor'], ['36 = 6 \\times 6', 'the pairs meet: stop'], ['1, 2, 3, 4, 6, 9, 12, 18, 36', '9 factors']], ctx, 1000);
      },
    },
    {
      title: 'Multiples',
      text: '<p>The <b>multiples</b> of a number are its times table. They go on for ever.</p><p>Multiples of 6: 6, 12, 18, 24, 30, …</p><p>The multiples of 2 are the <b>even</b> numbers. Every other whole number is <b>odd</b>.</p>',
      tip: 'Factors fit INTO a number; multiples come OUT of it. 6 is a factor of 30, and 30 is a multiple of 6.',
      async on(a, ctx) {
        a.reset(); a.dots(30, 5);
        await a.lines([['6 \\times 1 = 6, \\quad 6 \\times 2 = 12, \\quad 6 \\times 3 = 18, \\dots', 'multiples of 6'], ['30 = 6 \\times 5', '30 is a multiple of 6'], ['\\text{so } 6 \\text{ is a factor of } 30', ''], ['2, 4, 6, 8, \\dots \\text{ even} \\qquad 1, 3, 5, 7, \\dots \\text{ odd}', 'multiples of 2 are even']], ctx);
      },
    },
    {
      title: 'Prime numbers',
      text: '<p>13 dots make only <b>one</b> rectangle: 1 row of 13. A number with exactly two factors (1 and itself) is <b>prime</b>.</p><p>Primes under 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.</p>',
      tip: '1 is NOT prime: it has only one factor. 2 is the only even prime.',
      async on(a, ctx) {
        a.reset(); a.dots(13, 1); a.big('13 = 1 \\times 13 \\text{ only}');
        if (!(await ctx.sleep(1500))) return;
        a.msg('13 is prime: its only factors are 1 and 13.');
      },
    },
    {
      title: 'Square and cube numbers',
      text: '<p>16 dots make a <b>square</b>: 4 rows of 4. So 16 is a <b>square number</b>: \\(4^2 = 16\\).</p><p>A <b>cube number</b> is \\(n \\times n \\times n\\): \\(2^3 = 8\\), \\(3^3 = 27\\), \\(4^3 = 64\\), \\(5^3 = 125\\).</p>',
      tip: 'Learn the squares up to \\(15^2 = 225\\) and the cubes \\(1, 8, 27, 64, 125\\) and \\(1000\\).',
      async on(a, ctx) {
        a.reset();
        for (const k of [2, 3, 4, 5]) { a.dots(k * k, k, 'sq'); a.big(`${k}^2 = ${k} \\times ${k} = ${k * k}`); if (!(await ctx.sleep(1000))) return; }
        a.work([['1, \\; 4, \\; 9, \\; 16, \\; 25, \\; 36, \\; 49, \\dots', 'square numbers'], ['1, \\; 8, \\; 27, \\; 64, \\; 125, \\dots', 'cube numbers']]); a.upto(0);
        if (!(await ctx.sleep(1200))) return; a.upto(1);
      },
    },
    {
      title: 'Try it: rectangles of dots',
      text: '<p>Choose a number. Its factors are listed. Press a factor pair to see its rectangle.</p><p>Which numbers have only one rectangle? Which make a perfect square?</p>',
      tip: 'Try 24, 29 and 36.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'factors',
  gens: [
    () => { const n = FD.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72, 80, 84, 90, 96, 100]), f = FD.factorsOf(n), pairs = f.filter((x) => x * x <= n); return { type: 'num', q: `How many factors does ${n} have?`, a: f.length, why: `Factor pairs: ${pairs.map((p) => `\\(${p} \\times ${n / p}\\)`).join(', ')}. The factors are ${f.join(', ')}: that is ${f.length} factors.` }; },
    () => { const p = FD.pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]); const comp = FD.shuffle([9, 15, 21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 1]).slice(0, 3); return { type: 'mcq', q: 'Which of these is a <b>prime</b> number?', opts: [String(p), ...comp.map(String)], why: `${p} has exactly two factors, 1 and ${p}. ${comp.map((c) => (c === 1 ? '1 has only one factor' : `${c} = ${FD.factorsOf(c)[1]} \\(\\times\\) ${c / FD.factorsOf(c)[1]}`)).join('; ')}.` }; },
    () => { const k = FD.rnd(3, 12), m = FD.rnd(3, 12), opts = [k * m, k * m + 1, k * m - 1, k * m + 2].filter((x, i) => i === 0 || x % k !== 0); return { type: 'mcq', q: `Which of these is a multiple of ${k}?`, opts: opts.slice(0, 3).map(String), why: `\\(${k} \\times ${m} = ${k * m}\\), so ${k * m} is in the ${k} times table.` }; },
    () => { const n = FD.rnd(11, 99), odd = n % 2; return { type: 'mcq', q: `Is ${n} odd or even?`, opts: odd ? ['Odd', 'Even'] : ['Even', 'Odd'], why: `${n} ends in ${n % 10}. ${odd ? 'It is not a multiple of 2, so it is odd.' : `It is a multiple of 2 (${n} = 2 × ${n / 2}), so it is even.`}` }; },
    () => { const k = FD.rnd(2, 15), cube = FD.rnd(0, 1) && k <= 6; return { type: 'num', q: cube ? `Work out \\(${k}^3\\).` : `Work out \\(${k}^2\\).`, a: cube ? k ** 3 : k * k, why: cube ? `\\(${k}^3 = ${k} \\times ${k} \\times ${k} = ${k ** 3}\\).` : `\\(${k}^2 = ${k} \\times ${k} = ${k * k}\\).` }; },
  ],
});

FD.check({
  section: 'factors',
  items: [
    { type: 'multi', q: 'Choose <b>all</b> the factors of 18.', need: 3, opts: [['3', true], ['6', true], ['9', true], ['4', false], ['36', false]], why: 'The factor pairs of 18 are \\(1 \\times 18\\), \\(2 \\times 9\\) and \\(3 \\times 6\\). 36 is a multiple of 18, not a factor.' },
    { type: 'mcq', q: 'Which number is <b>odd</b> and a <b>multiple of 7</b>?', opts: ['35', '28', '14', '27'], why: '35 = 7 × 5 ends in 5, so it is odd. 28 and 14 are even; 27 is not a multiple of 7.' },
    { type: 'tf', q: '1 is a prime number.', a: false, why: 'A prime has exactly two factors. 1 has only one factor, so it is not prime.' },
    { type: 'num', q: 'Write down the prime numbers between 20 and 30. How many are there?', a: 2, why: 'They are 23 and 29. 21, 25, 27 are odd but not prime.' },
    { type: 'sort', q: 'Sort each number.', bins: ['Square', 'Cube', 'Prime'], rows: [['49', 0], ['27', 1], ['31', 2], ['125', 1], ['2', 2]], why: '\\(49 = 7^2\\), \\(27 = 3^3\\), \\(125 = 5^3\\), and 31 and 2 are prime.' },
    { type: 'mcq', q: 'Which statement is true?', opts: ['8 is a factor of 40', '40 is a factor of 8', '8 is a multiple of 40', '5 is a multiple of 40'], why: '\\(40 = 8 \\times 5\\), so 8 (and 5) are factors of 40, and 40 is a multiple of 8.' },
  ],
});
