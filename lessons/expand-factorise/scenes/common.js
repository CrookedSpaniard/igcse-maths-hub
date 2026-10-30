// Factorising: the grid run backwards. The cells are known; find the header outside.
FD.add({
  id: 'common',
  title: 'Factorising with common factors',
  tab: 'Common factors',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Factorise', 'Write an expression as a product, using brackets: \\(6x + 9 = 3(2x + 3)\\).'],
    ['Highest common factor (HCF)', 'The biggest number and letters that divide every term.'],
    ['Fully factorised', 'Nothing more can be taken out of the bracket.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ef-c',
      vis: '<div class="gm-host" data-k="grid"></div>',
      tryHtml: '<p class="ab-ask">Take out the HCF of the two terms.</p><div class="mbig" data-k="q"></div><div class="chk-btns" data-k="opts"></div><div class="chk-btns"><button class="btn ghost" data-k="new">New expression ↻</button></div>',
    });
    const grid = FD.gridM(a.$('[data-k="grid"]'));
    a.grid = grid;
    let cur;
    const ask = () => {
      const h = FD.rnd(2, 6), p = FD.rnd(1, 5), q = FD.rnd(1, 7), useX = Math.random() < .5;
      if (FD.gcd(p, q) !== 1) return ask();
      const out = useX ? `${h}x` : String(h), inP = useX ? `${efTerm(p, 'x')} + ${q}` : `${efTerm(p, 'x')} + ${q}`;
      const t1 = useX ? `${h * p}x^2` : `${h * p}x`, t2 = useX ? `${h * q}x` : String(h * q);
      cur = { out, inP, t1, t2 };
      a.$('[data-k="q"]').innerHTML = FD.tex(`${t1} + ${t2}`, true);
      const wrong = [useX ? String(h) : `${h}x`, String(h === 2 ? 4 : 2) + (useX ? 'x' : '')].filter((w) => w !== out);
      a.$('[data-k="opts"]').innerHTML = FD.shuffle([out, ...wrong.slice(0, 2), useX ? `${h}x^2` : '1']).map((o) => `<button class="btn" data-o="${o}">${FD.tex(o)}</button>`).join('');
      grid([t1 === `${h * p}x^2` ? efTerm(p, 'x') : efTerm(p, 'x'), String(q)], ['?'], [[t1, t2]], { hideHead: 'cols' });
      a.msg('');
    };
    a.$('[data-k="opts"]').addEventListener('click', (e) => {
      const b = e.target.closest('.btn'); if (!b) return;
      if (b.dataset.o === cur.out) { grid([cur.inP.split(' + ')[0], cur.inP.split(' + ')[1]], [cur.out], [[cur.t1, cur.t2]]); a.msg(`✓ \\(${cur.t1} + ${cur.t2} = ${cur.out}(${cur.inP})\\)`); }
      else a.msg(`✗ \\(${b.dataset.o}\\) is a common factor or not a factor at all. Look for the <b>highest</b> one.`, 'bad');
    });
    a.$('[data-k="new"]').addEventListener('click', ask);
    a.onTry = ask;
    return a;
  },
  steps: [
    {
      title: 'Expanding backwards',
      text: '<p>\\(3(2x + 5) = 6x + 15\\). <b>Factorising</b> goes the other way: from \\(6x + 15\\) back to \\(3(2x + 5)\\).</p><p>In the grid we know the cells. We need the term outside.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('6x + 15');
        a.grid(['?', '?'], ['?'], [['6x', '15']]);
        if (!(await ctx.sleep(1500))) return;
        a.grid(['2x', '5'], ['3'], [['6x', '15']], { hl: -1 }); a.big('6x + 15 = 3(2x + 5)');
      },
    },
    {
      title: 'Find the HCF',
      text: '<p>Find the HCF of the numbers and of the letters. Write it outside, then divide each term by it.</p>',
      tip: 'Check by expanding your answer. You should get back to the start.',
      on: FD.walk([['12x^2 + 8x', ''], ['\\text{HCF} = 4x', 'HCF of 12 and 8 is 4; both have x'], ['= 4x(3x + 2)', '12x² ÷ 4x = 3x, 8x ÷ 4x = 2']], (a) => { a.grid(['3x', '2'], ['4x'], [['12x^2', '8x']]); a.big(''); }),
    },
    {
      title: 'Factorise fully',
      text: '<p>\\(10ab - 15a\\) could be written \\(5(2ab - 3a)\\), but the bracket still has a common factor \\(a\\). <b>Fully</b> factorised: \\(5a(2b - 3)\\).</p>',
      on: FD.walk([['10ab - 15a', ''], ['5(2ab - 3a)', 'not finished: a is common'], ['= 5a(2b - 3)', 'fully factorised']], (a) => { a.grid(['2b', '-3'], ['5a'], [['10ab', '-15a']]); a.big(''); }),
    },
    {
      title: 'Try it: pick the HCF',
      text: '<p>Choose the highest common factor to take outside the bracket.</p>',
      on(a) { a.big(''); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'common',
  gens: [
    () => { let h, p, q; do { h = FD.rnd(2, 9); p = FD.rnd(1, 6); q = FD.rndNZ(-9, 9); } while (FD.gcd(p, q) !== 1); const ans = `${h}(${FD.poly([p, q], 'x', true)})`; return { type: 'alg', q: `Factorise \\(${FD.poly([h * p, h * q])}\\)`, a: ans, form: 'factorised', show: `\\(${h}(${FD.poly([p, q])})\\)`, hint: 'Type it like 3(2x + 5).', why: `The HCF of ${h * p} and ${Math.abs(h * q)} is ${h}. Divide each term by ${h}: \\(${h}(${FD.poly([p, q])})\\).` }; },
    () => { let h, p, q; do { h = FD.rnd(1, 6); p = FD.rnd(1, 5); q = FD.rndNZ(-9, 9); } while (FD.gcd(p, q) !== 1); const out = (h === 1 ? '' : h) + 'x'; return { type: 'alg', q: `Factorise fully \\(${FD.poly([h * p, h * q, 0])}\\)`, a: `${out}(${FD.poly([p, q], 'x', true)})`, form: 'factorised', show: `\\(${out}(${FD.poly([p, q])})\\)`, hint: 'Type it like 4x(3x - 2).', why: `Both terms contain ${h > 1 ? `${h} and ` : ''}\\(x\\), so take out \\(${out}\\): \\(${out}(${FD.poly([p, q])})\\).` }; },
  ],
});

FD.check({
  section: 'common',
  items: [
    { type: 'alg', q: 'Factorise \\(8x + 20\\)', a: '4(2x+5)', form: 'factorised', show: '\\(4(2x + 5)\\)', why: 'The HCF of 8 and 20 is 4.' },
    { type: 'alg', q: 'Factorise fully \\(9y^2 - 6y\\)', a: '3y(3y-2)', form: 'factorised', show: '\\(3y(3y - 2)\\)', why: 'HCF is \\(3y\\): \\(9y^2 \\div 3y = 3y\\), \\(6y \\div 3y = 2\\).' },
    { type: 'mcq', q: 'Which is \\(14ab + 21b\\) fully factorised?', opts: ['\\(7b(2a + 3)\\)', '\\(7(2ab + 3b)\\)', '\\(b(14a + 21)\\)', '\\(7ab(2 + 3)\\)'], why: 'The HCF is \\(7b\\).' },
    { type: 'tf', q: '\\(2(6x + 4)\\) is \\(12x + 8\\) fully factorised.', a: false, why: '6 and 4 still share a factor of 2. Fully: \\(4(3x + 2)\\).' },
  ],
});
