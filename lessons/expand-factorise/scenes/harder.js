// Higher: triple brackets (two at a time) and ax² + bx + c by splitting the middle term.
FD.add({
  id: 'harder',
  title: 'Triple brackets and ax² + bx + c',
  tab: 'Harder',
  icon: 'algebra',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Cubic expression', 'An expression whose highest power is \\(x^3\\).'],
    ['Splitting the middle term', 'Write \\(bx\\) as two terms using numbers that multiply to \\(ac\\) and add to \\(b\\), then factorise in pairs.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ef-h',
      vis: '<div class="gm-host" data-k="grid"></div>',
      tryHtml: `<label class="ctrl">\\((px + q)\\): p <input type="range" data-k="p" min="1" max="5" value="2"><output data-k="op">2</output></label>
        <label class="ctrl">q <input type="range" data-k="q" min="-7" max="7" value="3"><output data-k="oq">3</output></label>
        <label class="ctrl">\\((x + r)\\): r <input type="range" data-k="r" min="-7" max="7" value="-1"><output data-k="or">−1</output></label>`,
    });
    const grid = FD.gridM(a.$('[data-k="grid"]'));
    a.grid = grid;
    const sync = () => {
      const [p, q, r] = ['p', 'q', 'r'].map((n) => +a.$(`[data-k="${n}"]`).value);
      ['p', 'q', 'r'].forEach((n, i) => { a.$(`[data-k="o${n}"]`).textContent = String([p, q, r][i]).replace('-', '−'); });
      const A = p, B = p * r + q, C = q * r;
      grid(['x', r ? String(r) : '0'], [efTerm(p, 'x'), String(q)], [[efTerm(p, 'x^2'), efTerm(p * r, 'x')], [efTerm(q, 'x'), String(q * r)]]);
      a.big(`${FD.poly([A, B, C])}${q && r ? ` = (${FD.poly([p, q])})(${FD.poly([1, r])})` : ''}`);
      a.msg(q && r ? `To factorise backwards: \\(ac = ${A} \\times ${C} = ${A * C}\\); the numbers \\(${p * r}\\) and \\(${q}\\) multiply to ${A * C} and add to ${B}.` : 'Make q and r non-zero to see the factorising check.');
    };
    ['p', 'q', 'r'].forEach((n) => a.$(`[data-k="${n}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Three brackets: two at a time',
      text: '<p>To expand \\((x + 1)(x + 2)(x + 3)\\), first expand two of the brackets, then multiply the answer by the third.</p>',
      on: FD.walk([['(x + 1)(x + 2) = x^2 + 3x + 2', 'first pair'], ['(x^2 + 3x + 2)(x + 3)', 'now multiply by the third'], ['= x^3 + 3x^2 + 3x^2 + 9x + 2x + 6', 'six products'], ['= x^3 + 6x^2 + 11x + 6', 'collect']], (a) => { a.grid(['x', '+3'], ['x^2', '+3x', '+2'], [['x^3', '3x^2'], ['3x^2', '9x'], ['2x', '6']]); a.big(''); }, 1400),
    },
    {
      title: 'Factorising ax² + bx + c',
      text: '<p>\\(2x^2 + 7x + 3\\): multiply \\(a \\times c = 2 \\times 3 = 6\\). Find numbers that multiply to 6 and add to 7: 6 and 1.</p><p>Split \\(7x\\) into \\(6x + x\\) and factorise in pairs.</p>',
      on: FD.walk([['2x^2 + 7x + 3', 'ac = 6: use 6 and 1'], ['= 2x^2 + 6x + x + 3', 'split the middle term'], ['= 2x(x + 3) + 1(x + 3)', 'factorise each pair'], ['= (2x + 1)(x + 3)', '(x + 3) is common']], (a) => { a.grid(['x', '+3'], ['2x', '+1'], [['2x^2', '6x'], ['x', '3']]); a.big(''); }, 1500),
    },
    {
      title: 'With negatives',
      text: '<p>\\(3x^2 - 10x - 8\\): \\(ac = -24\\). Numbers that multiply to \\(-24\\) and add to \\(-10\\): \\(-12\\) and \\(2\\).</p>',
      tip: 'Check the two brackets match before you take them out. If they do not, check your signs.',
      on: FD.walk([['3x^2 - 12x + 2x - 8', 'split: −12x + 2x'], ['= 3x(x - 4) + 2(x - 4)', ''], ['= (3x + 2)(x - 4)', '']], (a) => { a.grid(['x', '-4'], ['3x', '+2'], [['3x^2', '-12x'], ['2x', '-8']]); a.big(''); }, 1500),
    },
    {
      title: 'Take out a common factor first',
      text: '<p>\\(6x^2 - 24\\): take out 6 first, then use the difference of two squares.</p>',
      on: FD.walk([['6x^2 - 24 = 6(x^2 - 4)', 'common factor'], ['= 6(x + 2)(x - 2)', 'difference of two squares']], (a) => { a.grid([], [], []); a.big(''); }, 1500),
    },
    {
      title: 'Try it: build ax² + bx + c',
      text: '<p>Choose \\((px + q)(x + r)\\). The grid gives the quadratic, and the message shows the numbers you would use to split the middle term.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'harder',
  gens: [
    () => { let p, q, r; do { p = FD.rnd(2, 5); q = FD.rndNZ(-7, 7); r = FD.rndNZ(-7, 7); } while (FD.gcd(p, q) !== 1); const A = p, B = p * r + q, C = q * r; return { type: 'alg', q: `Factorise \\(${FD.poly([A, B, C])}\\)`, a: `(${FD.poly([p, q], 'x', true)})(${FD.poly([1, r], 'x', true)})`, form: 'factorised', show: `\\((${FD.poly([p, q])})(${FD.poly([1, r])})\\)`, hint: 'Type it like (2x + 1)(x - 3).', why: `\\(ac = ${A * C}\\). Numbers that multiply to ${A * C} and add to ${B}: \\(${p * r}\\) and \\(${q}\\). Split, factorise in pairs: \\((${FD.poly([p, q])})(${FD.poly([1, r])})\\).` }; },
    () => { const [p, q, r] = [FD.rndNZ(-4, 4), FD.rndNZ(-4, 4), FD.rndNZ(-4, 4)]; const s = p + q + r, t = p * q + q * r + p * r, u = p * q * r; return { type: 'alg', q: `Expand and simplify \\((${FD.poly([1, p])})(${FD.poly([1, q])})(${FD.poly([1, r])})\\)`, a: FD.poly([1, s, t, u], 'x', true), form: 'expanded', show: `\\(${FD.poly([1, s, t, u])}\\)`, why: `First pair: \\((${FD.poly([1, p])})(${FD.poly([1, q])}) = ${FD.poly([1, p + q, p * q])}\\). Multiply by \\((${FD.poly([1, r])})\\) and collect: \\(${FD.poly([1, s, t, u])}\\).` }; },
  ],
});

FD.check({
  section: 'harder',
  items: [
    { type: 'alg', q: 'Factorise \\(3x^2 + 11x + 6\\)', a: '(3x+2)(x+3)', form: 'factorised', show: '\\((3x + 2)(x + 3)\\)', why: '\\(ac = 18\\): 9 and 2. \\(3x^2 + 9x + 2x + 6 = 3x(x + 3) + 2(x + 3)\\).' },
    { type: 'alg', q: 'Factorise \\(2x^2 - x - 10\\)', a: '(2x-5)(x+2)', form: 'factorised', show: '\\((2x - 5)(x + 2)\\)', why: '\\(ac = -20\\): −5 and 4. \\(2x^2 - 5x + 4x - 10 = x(2x - 5) + 2(2x - 5)\\).' },
    { type: 'alg', q: 'Expand and simplify \\((x + 2)(x - 1)(x + 4)\\)', a: 'x^3+5x^2+2x-8', form: 'expanded', show: '\\(x^3 + 5x^2 + 2x - 8\\)', why: '\\((x^2 + x - 2)(x + 4) = x^3 + 4x^2 + x^2 + 4x - 2x - 8\\).' },
    { type: 'mcq', q: 'Factorise fully \\(3x^2 - 75\\)', opts: ['\\(3(x + 5)(x - 5)\\)', '\\(3(x^2 - 25)\\)', '\\((3x + 5)(x - 15)\\)', '\\(3(x - 5)^2\\)'], why: 'Take out 3, then \\(x^2 - 25 = (x + 5)(x - 5)\\).' },
  ],
});
