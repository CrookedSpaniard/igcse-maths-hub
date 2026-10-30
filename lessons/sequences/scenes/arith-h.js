// Higher: the nth term a + (n − 1)d. Steps of d from the first term a.
FD.add({
  id: 'arith-h',
  title: 'First term, common difference and a + (n − 1)d',
  tab: 'a + (n − 1)d',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['First term \\(a\\)', 'The first number in an arithmetic sequence.'],
    ['Common difference \\(d\\)', 'What you add each time. It can be negative or a fraction.'],
    ['\\(a + (n - 1)d\\)', 'The nth term: start at \\(a\\) and add \\(d\\) a total of \\(n - 1\\) times.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sq-a',
      vis: '<div class="sq-host" data-k="t"></div>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-10" max="20" value="3"><output data-k="oa">3</output></label>
        <label class="ctrl">\\(d\\) <input type="range" data-k="d" min="-3" max="5" step="0.5" value="2.5"><output data-k="od">2.5</output></label>
        <label class="ctrl">\\(n\\) <input type="range" data-k="n" min="1" max="50" value="20"><output data-k="on">20</output></label>`,
    });
    const T = FD.terms(a.$('[data-k="t"]'));
    a.t = T;
    const sync = () => {
      const A = +a.$('[data-k="a"]').value, d = +a.$('[data-k="d"]').value, n = +a.$('[data-k="n"]').value;
      a.$('[data-k="oa"]').textContent = String(A).replace('-', '−'); a.$('[data-k="od"]').textContent = String(d).replace('-', '−'); a.$('[data-k="on"]').textContent = n;
      T([0, 1, 2, 3, 4].map((i) => A + i * d), { gaps: true });
      a.big(`u_{${n}} = ${A} + (${n} - 1)(${d}) = ${FD.num(FD.round(A + (n - 1) * d, 2))}`);
    };
    ['a', 'd', 'n'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Why n − 1?',
      text: '<p>To reach the 5th term you start at the 1st term and add \\(d\\) only <b>4</b> times. So the nth term is \\(a + (n - 1)d\\).</p>',
      async on(a, ctx) { a.tryMode(false); for (let k = 1; k <= 5; k++) { a.t([3, 7, 11, 15, 19], { gaps: true, upto: k }); a.big(`u_${k} = 3 + ${k - 1} \\times 4 = ${3 + (k - 1) * 4}`); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Find any term',
      text: '<p>The first term is 3 and the common difference is 4. The 50th term is \\(3 + 49 \\times 4 = 199\\).</p>',
      tip: 'Expanding \\(a + (n - 1)d\\) gives the same nth term as before: \\(3 + 4(n - 1) = 4n - 1\\).',
      on: FD.walk([['u_n = a + (n - 1)d', ''], ['u_{50} = 3 + 49 \\times 4', ''], ['u_{50} = 199', '']], (a) => { a.t([3, 7, 11, 15, 19], { gaps: true }); a.big(''); }),
    },
    {
      title: 'Find a and d from two terms',
      text: '<p>The 4th term is 17 and the 10th term is 41. Write two equations and solve them simultaneously.</p>',
      on: FD.walk([['a + 3d = 17', '4th term'], ['a + 9d = 41', '10th term'], ['6d = 24 \\Rightarrow d = 4', 'subtract'], ['a = 17 - 12 = 5', '']], (a) => { a.t([5, 9, 13, 17], { gaps: true }); a.big(''); }, 1400),
    },
    {
      title: 'Try it: a, d and n',
      text: '<p>Choose \\(a\\), \\(d\\) and the position \\(n\\). The formula gives the term without listing all the terms before it.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'arith-h',
  gens: [
    () => { const A = FD.rnd(-10, 20), d = FD.pick([-3, -2, 2, 3, 4, 5, 0.5, 1.5]), n = FD.rnd(15, 60); return { type: 'num', q: `An arithmetic sequence has first term ${A} and common difference ${d}. Find the ${n}th term.`, a: A + (n - 1) * d, why: `\\(${A} + (${n} - 1)(${d}) = ${A} + ${FD.num((n - 1) * d)} = ${FD.num(A + (n - 1) * d)}\\).` }; },
    () => { const A = FD.rnd(-5, 12), d = FD.rndNZ(-4, 6), p = FD.rnd(2, 5), q = p + FD.rnd(3, 8); return { type: 'num', q: `In an arithmetic sequence the ${p}th term is ${A + (p - 1) * d} and the ${q}th term is ${A + (q - 1) * d}. Find the first term \\(a\\) and the common difference \\(d\\).`, a: [A, d], fields: ['\\(a\\) =', '\\(d\\) ='], why: `\\(a + ${p - 1}d = ${A + (p - 1) * d}\\) and \\(a + ${q - 1}d = ${A + (q - 1) * d}\\). Subtract: \\(${q - p}d = ${(q - p) * d}\\), \\(d = ${d}\\), then \\(a = ${A}\\).` }; },
  ],
});

FD.check({
  section: 'arith-h',
  items: [
    { type: 'num', q: 'Find the 30th term of 8, 11, 14, 17, …', a: 95, why: '\\(8 + 29 \\times 3\\).' },
    { type: 'num', q: 'Find the 25th term of 40, 37.5, 35, …', a: -20, why: '\\(40 + 24 \\times (-2.5)\\).' },
    { type: 'num', q: 'The 3rd term is 11 and the 7th term is 23. Find \\(d\\).', a: 3, why: '\\(4d = 12\\).' },
    { type: 'mcq', q: 'Which is the nth term of an arithmetic sequence with \\(a = 6\\) and \\(d = -2\\)?', opts: ['\\(8 - 2n\\)', '\\(6 - 2n\\)', '\\(6n - 2\\)', '\\(4 - 2n\\)'], why: '\\(6 + (n - 1)(-2) = 8 - 2n\\).' },
  ],
});
