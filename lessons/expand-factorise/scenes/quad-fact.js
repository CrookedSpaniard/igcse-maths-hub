// x² + bx + c: list the factor pairs of c and find the pair that adds to b.
const efPairs = (c) => { const out = []; for (let p = -Math.abs(c); p <= Math.abs(c); p++) if (p && c % p === 0 && p <= c / p) out.push([p, c / p]); return out; };
const efBr = (p) => `(${FD.poly([1, p])})`;

FD.add({
  id: 'quad-fact',
  title: 'Factorising quadratics',
  tab: 'Quadratics',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Factor pair', 'Two numbers that multiply to give a number: 12 = 3 × 4 = (−2) × (−6) …'],
    ['Difference of two squares', '\\(x^2 - a^2 = (x + a)(x - a)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ef-q', side: true,
      vis: '<div class="qf-pairs" data-k="pairs"></div>',
      tryHtml: `<label class="ctrl">\\(b\\) <input type="range" data-k="b" min="-12" max="12" value="7"><output data-k="ob">7</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-24" max="24" value="12"><output data-k="oc">12</output></label>`,
    });
    const pairs = a.$('[data-k="pairs"]');
    a.pairs = (b, c, upto = 99) => {
      const list = efPairs(c);
      pairs.innerHTML = `<div class="qf-h"><span>Multiply to \\(${c}\\)</span><span>Add to</span></div>` + list.slice(0, upto).map(([p, q]) => `<div class="qf-r ${p + q === b ? 'hit' : ''}"><span>\\(${p} \\times ${q}\\)</span><span>\\(${p + q}\\)${p + q === b ? ' ✓' : ''}</span></div>`).join('');
      FD.typeset(pairs);
      return list.find(([p, q]) => p + q === b);
    };
    const sync = () => {
      let b = +a.$('[data-k="b"]').value, c = +a.$('[data-k="c"]').value;
      if (!c) { c = 1; a.$('[data-k="c"]').value = 1; }
      a.$('[data-k="ob"]').textContent = String(b).replace('-', '−'); a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      const hit = a.pairs(b, c);
      a.big(`${FD.poly([1, b, c])}${hit ? ` = ${efBr(hit[0])}${efBr(hit[1])}` : ''}`);
      a.msg(hit ? `\\(${hit[0]} \\times ${hit[1]} = ${c}\\) and \\(${hit[0]} + ${hit[1]} = ${b}\\).` : `No pair of whole numbers multiplies to ${c} and adds to ${b}, so it does not factorise this way.`, hit ? 'good' : 'bad');
    };
    ['b', 'c'].forEach((n) => a.$(`[data-k="${n}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'The pattern, backwards',
      text: '<p>When you expand \\((x + p)(x + q)\\) you get \\(x^2 + (p + q)x + pq\\).</p><p>So to factorise \\(x^2 + 7x + 12\\), find two numbers that <b>multiply to 12</b> and <b>add to 7</b>.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('x^2 + 7x + 12');
        for (let k = 1; k <= 6; k++) { a.pairs(7, 12, k); if (!(await ctx.sleep(700))) return; }
        a.big('x^2 + 7x + 12 = (x + 3)(x + 4)');
      },
    },
    {
      title: 'Negative numbers',
      text: '<p>\\(x^2 - 2x - 15\\): multiply to \\(-15\\), add to \\(-2\\). One number is negative, because the product is negative.</p>',
      tip: 'If c is positive, both numbers have the same sign as b. If c is negative, the signs are different.',
      async on(a, ctx) {
        a.tryMode(false); a.big('x^2 - 2x - 15');
        for (let k = 1; k <= 4; k++) { a.pairs(-2, -15, k); if (!(await ctx.sleep(700))) return; }
        a.big('x^2 - 2x - 15 = (x + 3)(x - 5)');
      },
    },
    {
      title: 'Difference of two squares',
      text: '<p>\\(x^2 - 49\\) has no middle term (\\(b = 0\\)). Find numbers that multiply to \\(-49\\) and add to 0: \\(7\\) and \\(-7\\).</p><p>\\(x^2 - a^2 = (x + a)(x - a)\\)</p>',
      on: FD.walk([['x^2 - 49 = (x + 7)(x - 7)', ''], ['y^2 - 100 = (y + 10)(y - 10)', ''], ['4x^2 - 9 = (2x + 3)(2x - 3)', '4x² = (2x)², 9 = 3²']], (a) => { a.pairs(0, -49); a.big(''); }),
    },
    {
      title: 'Check by expanding',
      text: '<p>Always check: expand your brackets and see if you get the quadratic back.</p>',
      on: FD.walk([['(x + 3)(x - 5)', 'check'], ['= x^2 - 5x + 3x - 15', ''], ['= x^2 - 2x - 15 \\;\\checkmark', '']], (a) => { a.pairs(-2, -15); a.big(''); }),
    },
    {
      title: 'Try it: factor pairs',
      text: '<p>Choose \\(b\\) and \\(c\\). The table lists the factor pairs of \\(c\\). Is there a pair that adds to \\(b\\)?</p>',
      tip: 'Try b = 0 with c = −16, −25 or −36.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'quad-fact',
  gens: [
    () => { const p = FD.rndNZ(-9, 9), q = FD.rndNZ(-9, 9), b = p + q, c = p * q; return { type: 'alg', q: `Factorise \\(${FD.poly([1, b, c])}\\)`, a: `(x${FD.sg(p).replace(/\s/g, '')})(x${FD.sg(q).replace(/\s/g, '')})`, form: 'factorised', show: `\\(${efBr(p)}${efBr(q)}\\)`, hint: 'Type it like (x + 3)(x - 5).', why: `Two numbers that multiply to \\(${c}\\) and add to \\(${b}\\): \\(${p}\\) and \\(${q}\\). So \\(${efBr(p)}${efBr(q)}\\).` }; },
    () => { const k = FD.rnd(1, 12), v = FD.pick(['x', 'y', 'a']); return { type: 'alg', q: `Factorise \\(${v}^2 - ${k * k}\\)`, a: `(${v}+${k})(${v}-${k})`, form: 'factorised', show: `\\((${v} + ${k})(${v} - ${k})\\)`, hint: 'Type it like (x + 3)(x - 3).', why: `Difference of two squares: \\(${k * k} = ${k}^2\\), so \\((${v} + ${k})(${v} - ${k})\\).` }; },
  ],
});

FD.check({
  section: 'quad-fact',
  items: [
    { type: 'alg', q: 'Factorise \\(x^2 + 9x + 20\\)', a: '(x+4)(x+5)', form: 'factorised', show: '\\((x + 4)(x + 5)\\)', why: '4 × 5 = 20 and 4 + 5 = 9.' },
    { type: 'alg', q: 'Factorise \\(x^2 - x - 12\\)', a: '(x+3)(x-4)', form: 'factorised', show: '\\((x + 3)(x - 4)\\)', why: '3 × (−4) = −12 and 3 + (−4) = −1.' },
    { type: 'alg', q: 'Factorise \\(x^2 - 8x + 15\\)', a: '(x-3)(x-5)', form: 'factorised', show: '\\((x - 3)(x - 5)\\)', why: '(−3) × (−5) = 15 and (−3) + (−5) = −8.' },
    { type: 'mcq', q: 'Factorise \\(x^2 - 64\\)', opts: ['\\((x + 8)(x - 8)\\)', '\\((x - 8)^2\\)', '\\((x - 32)(x + 2)\\)', '\\(x(x - 64)\\)'], why: 'Difference of two squares: \\(64 = 8^2\\).' },
  ],
});
