// Adding p/(x+a) + q/(x+b): common denominator (x+a)(x+b). The Try it checks the answer with a number.
const afAdd = (p, a, q, b, sub) => { const s = sub ? -1 : 1; return [p + s * q, p * b + s * q * a]; }; // numerator coefficients

FD.add({
  id: 'af-addsub',
  title: 'Adding and subtracting algebraic fractions',
  tab: 'Add & subtract',
  icon: 'frac',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Common denominator', 'A denominator that both fractions can be written with. For \\(\\frac{1}{x + 1}\\) and \\(\\frac{1}{x + 2}\\) use \\((x + 1)(x + 2)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'af-a',
      tryHtml: `<div class="seg-row" data-k="op"><button class="btn primary" data-s="0">Add</button><button class="btn" data-s="1">Subtract</button></div>
        <label class="ctrl">\\(\\frac{3}{x + a}\\): a <input type="range" data-k="a" min="-5" max="5" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(\\frac{2}{x + b}\\): b <input type="range" data-k="b" min="-5" max="5" value="4"><output data-k="ob">4</output></label>
        <label class="ctrl">Test with \\(x\\) = <input type="range" data-k="x" min="-9" max="9" value="2"><output data-k="ox">2</output></label>`,
    });
    let sub = 0;
    const sync = () => {
      const A = +a.$('[data-k="a"]').value, B = +a.$('[data-k="b"]').value, x = +a.$('[data-k="x"]').value;
      ['a', 'b', 'x'].forEach((n) => { a.$(`[data-k="o${n}"]`).textContent = String({ a: A, b: B, x }[n]).replace('-', '−'); });
      const n = afAdd(3, A, 2, B, sub), op = sub ? '-' : '+';
      const den = A === B ? `x${FD.sg(A)}` : `(${FD.poly([1, A])})(${FD.poly([1, B])})`;
      const num = A === B ? String(sub ? 1 : 5) : FD.poly(n);
      a.big(`\\frac{3}{${FD.poly([1, A])}} ${op} \\frac{2}{${FD.poly([1, B])}} = \\frac{${num}}{${den}}`);
      if (x + A === 0 || x + B === 0) { a.msg(`With \\(x = ${x}\\) a denominator is 0, so the fraction has no value. Choose another \\(x\\).`, 'bad'); return; }
      const lhs = 3 / (x + A) + (sub ? -2 : 2) / (x + B), rhs = A === B ? (sub ? 1 : 5) / (x + A) : (n[0] * x + n[1]) / ((x + A) * (x + B));
      a.msg(`Check with \\(x = ${x}\\): left side \\(= ${FD.round(lhs, 4)}\\), right side \\(= ${FD.round(rhs, 4)}\\). ${Math.abs(lhs - rhs) < 1e-9 ? 'They match ✓' : ''}`);
    };
    a.$('[data-k="op"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; sub = +b.dataset.s; a.$('[data-k="op"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    ['a', 'b', 'x'].forEach((n) => a.$(`[data-k="${n}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Same idea as number fractions',
      text: '<p>\\(\\frac{1}{3} + \\frac{1}{4} = \\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}\\). We used a <b>common denominator</b>.</p><p>With letters: \\(\\frac{x}{3} + \\frac{x}{4} = \\frac{4x + 3x}{12} = \\frac{7x}{12}\\).</p>',
      on: FD.walk([['\\frac{x}{3} + \\frac{x}{4}', ''], ['= \\frac{4x}{12} + \\frac{3x}{12}', 'common denominator 12'], ['= \\frac{7x}{12}', 'add the numerators']], (a) => a.big('')),
    },
    {
      title: 'Letters in the denominator',
      text: '<p>\\(\\frac{3}{x + 1} + \\frac{2}{x + 4}\\): the common denominator is \\((x + 1)(x + 4)\\). Multiply each top by the bracket it is missing.</p>',
      on: FD.walk([['\\frac{3}{x + 1} + \\frac{2}{x + 4}', ''], ['= \\frac{3(x + 4)}{(x + 1)(x + 4)} + \\frac{2(x + 1)}{(x + 1)(x + 4)}', 'make the denominators the same'], ['= \\frac{3x + 12 + 2x + 2}{(x + 1)(x + 4)}', 'expand the tops'], ['= \\frac{5x + 14}{(x + 1)(x + 4)}', 'collect']], (a) => a.big(''), 1500),
    },
    {
      title: 'Subtracting: brackets matter',
      text: '<p>When you subtract, put the second numerator in a <b>bracket</b>. The minus sign changes every term inside.</p>',
      tip: 'A common mistake: \\(-(2x - 3)\\) is \\(-2x + 3\\), not \\(-2x - 3\\).',
      on: FD.walk([['\\frac{4}{x - 2} - \\frac{1}{x + 3}', ''], ['= \\frac{4(x + 3) - (x - 2)}{(x - 2)(x + 3)}', ''], ['= \\frac{4x + 12 - x + 2}{(x - 2)(x + 3)}', 'the minus changes −2 to +2'], ['= \\frac{3x + 14}{(x - 2)(x + 3)}', '']], (a) => a.big(''), 1500),
    },
    {
      title: 'Try it: check with a number',
      text: '<p>Choose \\(a\\), \\(b\\) and add or subtract. Then test the answer: put a value of \\(x\\) into both sides. If they match, the algebra is right.</p>',
      tip: 'This is a great way to check your own answers in an exam.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'af-addsub',
  gens: [
    () => { let A, B, p, q, sub, n; do { A = FD.rndNZ(-6, 6); B = FD.rndNZ(-6, 6); p = FD.rnd(1, 5); q = FD.rnd(1, 5); sub = Math.random() < .5; n = afAdd(p, A, q, B, sub); } while (A === B || (!n[0] && !n[1])); return { type: 'alg', q: `Write as a single fraction: \\(\\dfrac{${p}}{${FD.poly([1, A])}} ${sub ? '-' : '+'} \\dfrac{${q}}{${FD.poly([1, B])}}\\)`, a: `(${FD.poly(n, 'x', true)})/((x${FD.sg(A).replace(/\s/g, '')})(x${FD.sg(B).replace(/\s/g, '')}))`, show: `\\(\\dfrac{${FD.poly(n)}}{(${FD.poly([1, A])})(${FD.poly([1, B])})}\\)`, hint: 'Type it like (5x + 14)/((x + 1)(x + 4)).', why: `Common denominator \\((${FD.poly([1, A])})(${FD.poly([1, B])})\\). Numerator: \\(${p}(${FD.poly([1, B])}) ${sub ? '-' : '+'} ${q}(${FD.poly([1, A])}) = ${FD.poly(n)}\\).` }; },
    () => { const m = FD.rnd(2, 5); let n; do { n = FD.rnd(2, 6); } while (n === m); const p = FD.rnd(1, 4), q = FD.rnd(1, 4), L = FD.lcm(m, n); const c = (L / m) * p + (L / n) * q; return { type: 'alg', q: `Simplify \\(\\dfrac{${p === 1 ? '' : p}x}{${m}} + \\dfrac{${q === 1 ? '' : q}x}{${n}}\\)`, a: `${c}x/${L}`, show: `\\(\\dfrac{${c}x}{${L}}\\)`, hint: 'Type it like 7x/12.', why: `Common denominator ${L}: \\(\\dfrac{${(L / m) * p}x}{${L}} + \\dfrac{${(L / n) * q}x}{${L}} = \\dfrac{${c}x}{${L}}\\).` }; },
  ],
});

FD.check({
  section: 'af-addsub',
  items: [
    { type: 'alg', q: 'Simplify \\(\\frac{x}{2} + \\frac{x}{5}\\)', a: '7x/10', show: '\\(\\frac{7x}{10}\\)', hint: 'Type it like 7x/12.', why: '\\(\\frac{5x + 2x}{10}\\).' },
    { type: 'alg', q: 'Write as a single fraction \\(\\frac{2}{x + 3} + \\frac{5}{x - 1}\\)', a: '(7x+13)/((x+3)(x-1))', show: '\\(\\frac{7x + 13}{(x + 3)(x - 1)}\\)', hint: 'Type it like (5x + 14)/((x + 1)(x + 4)).', why: '\\(2(x - 1) + 5(x + 3) = 7x + 13\\).' },
    { type: 'mcq', q: 'Simplify \\(\\frac{3}{x} - \\frac{2}{x + 1}\\)', opts: ['\\(\\frac{x + 3}{x(x + 1)}\\)', '\\(\\frac{1}{x(x + 1)}\\)', '\\(\\frac{1}{-1}\\)', '\\(\\frac{5x + 3}{x(x + 1)}\\)'], why: '\\(3(x + 1) - 2x = x + 3\\).' },
    { type: 'tf', q: '\\(\\frac{1}{x} + \\frac{1}{y} = \\frac{2}{x + y}\\)', a: false, why: 'Try \\(x = y = 1\\): \\(1 + 1 = 2\\), but \\(\\frac{2}{2} = 1\\). The correct answer is \\(\\frac{x + y}{xy}\\).' },
  ],
});
