// Algebraic proof: even numbers are 2n, odd numbers 2n + 1. Dots in pairs show why n + (n + 1) is always odd.
FD.add({
  id: 'proof',
  title: 'Algebraic proof',
  tab: 'Proof',
  icon: 'algebra',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Proof', 'An argument that shows something is true for <b>every</b> value, not just the ones you tried.'],
    ['Even and odd in algebra', 'If \\(n\\) is an integer, \\(2n\\) is always even and \\(2n + 1\\) is always odd.'],
    ['Consecutive integers', 'Whole numbers next to each other: \\(n\\), \\(n + 1\\), \\(n + 2\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'pf-s',
      vis: '<div class="pf-dots" data-k="dots"></div>',
      tryHtml: '<label class="ctrl">\\(n\\) <input type="range" data-k="n" min="1" max="12" value="5"><output data-k="on">5</output></label>',
    });
    const dots = a.$('[data-k="dots"]');
    // n dots in the first colour, n + 1 in the second, drawn in pairs (columns of two)
    a.dots = (n) => {
      const all = [...Array(n).fill('a'), ...Array(n + 1).fill('b')];
      const cols = Math.ceil(all.length / 2);
      dots.innerHTML = Array.from({ length: cols }, (_, c) => `<span class="pf-col ${c === cols - 1 && all.length % 2 ? 'odd' : ''}">${all.slice(2 * c, 2 * c + 2).map((t) => `<i class="${t}"></i>`).join('')}</span>`).join('');
    };
    const sync = () => {
      const n = +a.$('[data-k="n"]').value; a.$('[data-k="on"]').textContent = n;
      a.dots(n);
      a.big(`${n} + ${n + 1} = ${2 * n + 1} = 2 \\times ${n} + 1`);
      a.msg(`${n} pairs and one left over: odd. The same happens for every \\(n\\).`);
    };
    a.$('[data-k="n"]').addEventListener('input', sync);
    a.onTry = sync;
    a.dots(3);
    return a;
  },
  steps: [
    {
      title: 'Examples are not a proof',
      text: '<p>\\(3 + 4 = 7\\), \\(10 + 11 = 21\\), \\(25 + 26 = 51\\). The sum of two consecutive integers seems to be odd.</p><p>Trying examples cannot check <b>every</b> number. Algebra can.</p>',
      async on(a, ctx) { a.tryMode(false); for (const n of [3, 4, 6]) { a.dots(n); a.big(`${n} + ${n + 1} = ${2 * n + 1}`); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Prove it with algebra',
      text: '<p>Call the first integer \\(n\\). The next one is \\(n + 1\\). Add them and write the answer in the form \\(2 \\times \\text{something} + 1\\).</p>',
      tip: 'End with a sentence that says what you have proved.',
      on: FD.walk([['n + (n + 1) = 2n + 1', ''], ['2n \\text{ is even, so } 2n + 1 \\text{ is odd}', ''], ['\\text{So the sum is always odd.}', 'conclusion']], (a) => { a.dots(4); a.big(''); }, 1500),
    },
    {
      title: 'Show that… an identity',
      text: '<p>Prove that \\((n + 3)^2 - (n + 1)^2\\) is always a multiple of 4. Expand, simplify, then factorise to show the 4.</p>',
      on: FD.walk([['(n + 3)^2 - (n + 1)^2', ''], ['= n^2 + 6n + 9 - (n^2 + 2n + 1)', 'expand both'], ['= 4n + 8', 'simplify'], ['= 4(n + 2)', 'a multiple of 4 ✓']], (a) => { a.dots(2); a.big(''); }, 1500),
    },
    {
      title: 'Try it: see the pairs',
      text: '<p>Move the slider. \\(n\\) dots (one colour) and \\(n + 1\\) dots (the other) are put in pairs. There is always exactly one left over.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'proof',
  gens: [
    () => { const k = FD.rnd(1, 4), m = k + FD.rnd(1, 3); const d = m * m - k * k, c = 2 * (m - k); return { type: 'alg', q: `Show that \\((n + ${m})^2 - (n + ${k})^2\\) is always a multiple of ${c}: first simplify it.`, a: `${c}n+${d}`, form: 'expanded', show: `\\(${c}n + ${d}\\)`, hint: 'Type it like 4n + 8.', why: `\\(n^2 + ${2 * m}n + ${m * m} - n^2 - ${2 * k}n - ${k * k} = ${c}n + ${d} = ${c}(n + ${d / c})\\), a multiple of ${c}.` }; },
    () => { const p = FD.pick([['the sum of three consecutive integers', 'n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)', 'a multiple of 3'], ['the sum of two consecutive even numbers', '2n + (2n + 2) = 4n + 2 = 2(2n + 1)', 'even but never a multiple of 4'], ['the product of two odd numbers', '(2a + 1)(2b + 1) = 4ab + 2a + 2b + 1 = 2(2ab + a + b) + 1', 'odd']]); return { type: 'tf', q: `True or false: ${p[0]} is always ${p[2]}.`, a: true, why: `\\(${p[1]}\\), so it is always ${p[2]}.` }; },
  ],
});

FD.check({
  section: 'proof',
  items: [
    { type: 'mcq', q: 'If \\(n\\) is an integer, which expression is always odd?', opts: ['\\(2n + 1\\)', '\\(n + 1\\)', '\\(2n\\)', '\\(3n\\)'], why: '\\(2n\\) is even, so \\(2n + 1\\) is odd.' },
    { type: 'mcq', q: 'Which line best proves that the sum of three consecutive integers is a multiple of 3?', opts: ['\\(n + (n + 1) + (n + 2) = 3(n + 1)\\)', '\\(1 + 2 + 3 = 6\\), which is a multiple of 3', '\\(n + n + n = 3n\\)', '\\(3 + 4 + 5 = 12\\) and \\(7 + 8 + 9 = 24\\)'], why: 'Examples are not a proof. The algebra works for every \\(n\\).' },
    { type: 'tf', q: 'Checking ten examples proves a statement is always true.', a: false, why: 'A proof must work for every value, so you need algebra.' },
    { type: 'alg', q: 'Simplify \\((n + 5)^2 - (n - 5)^2\\)', a: '20n', show: '\\(20n\\)', why: '\\(n^2 + 10n + 25 - (n^2 - 10n + 25) = 20n\\).' },
  ],
});
