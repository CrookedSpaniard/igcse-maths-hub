// (x + a)(x + b) with the grid method.
FD.add({
  id: 'double',
  title: 'Expanding double brackets',
  tab: 'Double brackets',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Binomial', 'An expression with two terms, like \\(x + 5\\).'],
    ['Quadratic expression', 'An expression whose highest power is \\(x^2\\), like \\(x^2 + 7x + 10\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ef-d',
      vis: '<div class="gm-host" data-k="grid"></div>',
      tryHtml: `<label class="ctrl">\\((x + a)\\): a <input type="range" data-k="a" min="-8" max="8" value="3"><output data-k="oa">3</output></label>
        <label class="ctrl">\\((x + b)\\): b <input type="range" data-k="b" min="-8" max="8" value="2"><output data-k="ob">2</output></label>`,
    });
    const grid = FD.gridM(a.$('[data-k="grid"]'));
    a.dbl = (p, q, show, hl) => grid(['x', String(q).replace(/^(\d)/, '+$1')], ['x', String(p).replace(/^(\d)/, '+$1')], [['x^2', efTerm(q, 'x')], [efTerm(p, 'x'), String(p * q)]], { show, hl });
    a.grid = grid;
    const sync = () => {
      const p = +a.$('[data-k="a"]').value, q = +a.$('[data-k="b"]').value;
      a.$('[data-k="oa"]').textContent = String(p).replace('-', '−'); a.$('[data-k="ob"]').textContent = String(q).replace('-', '−');
      a.dbl(p, q);
      a.big(`(${FD.poly([1, p])})(${FD.poly([1, q])}) = ${FD.poly([1, p + q, p * q])}`);
      a.msg(`Middle term: \\(${p} + ${q} = ${p + q}\\). Last term: \\(${p} \\times ${q} = ${p * q}\\).`);
    };
    ['a', 'b'].forEach((n) => a.$(`[data-k="${n}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Four products',
      text: '<p>In \\((x + 3)(x + 2)\\) every term in the first bracket multiplies every term in the second. That makes <b>four</b> products.</p><p>Put one bracket along the top of a grid and one down the side.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('(x + 3)(x + 2)');
        for (let s = 0; s <= 4; s++) { a.dbl(3, 2, s, s - 1); if (!(await ctx.sleep(1000))) return; }
      },
    },
    {
      title: 'Collect the middle terms',
      text: '<p>Add up the four cells: \\(x^2 + 2x + 3x + 6\\). The two \\(x\\) terms are like terms.</p><p>\\((x + 3)(x + 2) = x^2 + 5x + 6\\)</p>',
      tip: 'Notice: 5 is 3 + 2 and 6 is 3 × 2.',
      on: FD.walk([['(x + 3)(x + 2)', ''], ['= x^2 + 2x + 3x + 6', 'the four cells'], ['= x^2 + 5x + 6', 'collect like terms']], (a) => a.dbl(3, 2)),
    },
    {
      title: 'With negatives',
      text: '<p>Keep each sign with its number. \\((x - 4)(x + 1)\\): the cells are \\(x^2\\), \\(x\\), \\(-4x\\) and \\(-4\\).</p>',
      on: FD.walk([['(x - 4)(x + 1)', ''], ['= x^2 + x - 4x - 4', ''], ['= x^2 - 3x - 4', '']], (a) => a.dbl(-4, 1)),
    },
    {
      title: 'Squaring a bracket',
      text: '<p>\\((x + 5)^2\\) means \\((x + 5)(x + 5)\\). Write it out twice, then expand.</p>',
      tip: '\\((x + 5)^2\\) is <b>not</b> \\(x^2 + 25\\). Do not forget the middle term \\(10x\\).',
      on: FD.walk([['(x + 5)^2 = (x + 5)(x + 5)', ''], ['= x^2 + 5x + 5x + 25', ''], ['= x^2 + 10x + 25', '']], (a) => a.dbl(5, 5)),
    },
    {
      title: 'Numbers in front of x',
      text: '<p>The grid works for any two brackets: \\((2x + 1)(3x - 4)\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('');
        a.grid(['3x', '-4'], ['2x', '+1'], [['6x^2', '-8x'], ['3x', '-4']]);
        a.work([['(2x + 1)(3x - 4)', ''], ['= 6x^2 - 8x + 3x - 4', ''], ['= 6x^2 - 5x - 4', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: spot the pattern',
      text: '<p>Change \\(a\\) and \\(b\\). The middle number is always \\(a + b\\) and the last number is always \\(a \\times b\\).</p><p>You will use this pattern backwards to factorise.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'double',
  gens: [
    () => { const p = FD.rndNZ(-9, 9), q = FD.rndNZ(-9, 9), r = [1, p + q, p * q]; return { type: 'alg', q: `Expand and simplify \\((${FD.poly([1, p])})(${FD.poly([1, q])})\\)`, a: FD.poly(r, 'x', true), form: 'expanded', show: `\\(${FD.poly(r)}\\)`, why: `Grid: \\(x^2\\), \\(${efTerm(q, 'x')}\\), \\(${efTerm(p, 'x')}\\), \\(${p * q}\\). Collect: \\(${FD.poly(r)}\\).` }; },
    () => { const p = FD.rndNZ(-8, 8), r = [1, 2 * p, p * p]; return { type: 'alg', q: `Expand and simplify \\((${FD.poly([1, p])})^2\\)`, a: FD.poly(r, 'x', true), form: 'expanded', show: `\\(${FD.poly(r)}\\)`, why: `\\((${FD.poly([1, p])})(${FD.poly([1, p])}) = x^2 ${FD.sg(p)}x ${FD.sg(p)}x ${FD.sg(p * p)} = ${FD.poly(r)}\\).` }; },
    () => { const m = FD.rnd(2, 4), p = FD.rndNZ(-6, 6), q = FD.rndNZ(-6, 6), r = [m, m * q + p, p * q]; return { type: 'alg', q: `Expand and simplify \\((${FD.poly([m, p])})(${FD.poly([1, q])})\\)`, a: FD.poly(r, 'x', true), form: 'expanded', show: `\\(${FD.poly(r)}\\)`, why: `Grid: \\(${m}x^2\\), \\(${efTerm(m * q, 'x')}\\), \\(${efTerm(p, 'x')}\\), \\(${p * q}\\). Collect: \\(${FD.poly(r)}\\).` }; },
  ],
});

FD.check({
  section: 'double',
  items: [
    { type: 'alg', q: 'Expand and simplify \\((x + 4)(x + 6)\\)', a: 'x^2+10x+24', form: 'expanded', show: '\\(x^2 + 10x + 24\\)', why: '\\(x^2 + 6x + 4x + 24\\).' },
    { type: 'alg', q: 'Expand and simplify \\((x - 3)(x + 7)\\)', a: 'x^2+4x-21', form: 'expanded', show: '\\(x^2 + 4x - 21\\)', why: '\\(x^2 + 7x - 3x - 21\\).' },
    { type: 'mcq', q: 'Expand \\((x - 6)^2\\)', opts: ['\\(x^2 - 12x + 36\\)', '\\(x^2 + 36\\)', '\\(x^2 - 36\\)', '\\(x^2 - 12x - 36\\)'], why: '\\((x - 6)(x - 6) = x^2 - 6x - 6x + 36\\).' },
    { type: 'alg', q: 'Expand and simplify \\((3x + 2)(x - 5)\\)', a: '3x^2-13x-10', form: 'expanded', show: '\\(3x^2 - 13x - 10\\)', why: '\\(3x^2 - 15x + 2x - 10\\).' },
    { type: 'num', q: '\\((x + 8)(x + k) = x^2 + 11x + 24\\). Find \\(k\\).', a: 3, why: '\\(8 \\times k = 24\\) (and \\(8 + k = 11\\)), so \\(k = 3\\).' },
  ],
});
