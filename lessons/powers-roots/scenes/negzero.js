// Bars for b^3 … b^-3: each step to the right divides by b. Value labels as fractions.
FD.halving = (host) => {
  host.innerHTML = '<svg class="hb" viewBox="0 0 600 236" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (b, shown = 7, top = 3) => {
    const ks = [top, top - 1, top - 2, top - 3, top - 4, top - 5, top - 6], max = b ** top, w = 62, gap = 18, x0 = 300 - (7 * w + 6 * gap) / 2;
    let s = `<line class="hb-ax" x1="20" y1="190" x2="580" y2="190"/>`;
    ks.forEach((k, i) => {
      if (i >= shown) return;
      const v = b ** k, h = Math.max(2, (v / max) * 150), x = x0 + i * (w + gap);
      s += `<rect class="hb-b ${k < 0 ? 'neg' : k === 0 ? 'zero' : ''}" x="${x}" y="${190 - h}" width="${w}" height="${h}" rx="4"/><text class="hb-t" x="${x + w / 2}" y="212">${b}${FD.supTxt(k)}</text><text class="hb-v" x="${x + w / 2}" y="${Math.min(182 - h, 176)}">${k >= 0 ? v : `1/${b ** -k}`}</text>`;
    });
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Powers of ${b} from ${b} to the ${top} down to ${b} to the ${top - 6}`);
  };
};

FD.add({
  id: 'negzero',
  title: 'Zero and negative indices',
  tab: 'Zero & negative',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Zero index', 'Any number (except 0) to the power 0 is 1: \\(a^0 = 1\\).'],
    ['Negative index', 'Means the reciprocal: \\(a^{-n} = \\frac{1}{a^n}\\). So \\(5^{-2} = \\frac{1}{25}\\).'],
    ['Reciprocal', '1 divided by the number. The reciprocal of \\(\\frac{2}{3}\\) is \\(\\frac{3}{2}\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'nz-s', '<div id="hb"></div>', `
      <label class="ctrl">Base <input type="range" id="rb" min="2" max="10" value="2"><output id="ob">2</output></label>
      <label class="ctrl">Index <input type="range" id="rk" min="-4" max="4" value="-2"><output id="ok">−2</output></label>`, () => sync());
    a.hb = FD.halving(a.$('#hb'));
    const sync = () => {
      const b = +a.$('#rb').value, k = +a.$('#rk').value; a.$('#ob').textContent = b; a.$('#ok').textContent = k < 0 ? '−' + -k : k;
      a.hb(b > 4 ? b : b, 7, 3);
      a.big(k > 0 ? `${b}^{${k}} = ${b ** k}` : k === 0 ? `${b}^0 = 1` : `${b}^{${k}} = \\frac{1}{${b}^{${-k}}} = \\frac{1}{${b ** -k}}`);
      a.msg(k < 0 ? 'A negative index means “one over”: the reciprocal.' : k === 0 ? 'Power 0 always gives 1.' : `${k} lots of ${b} multiplied together.`);
    };
    ['#rb', '#rk'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.hb(2);
    return a;
  },
  steps: [
    {
      title: 'Follow the pattern',
      text: '<p>\\(2^3 = 8\\), \\(2^2 = 4\\), \\(2^1 = 2\\). Each time the index goes down by 1, the value is <b>divided by 2</b>.</p><p>Keep going: \\(2^0 = 1\\), \\(2^{-1} = \\tfrac12\\), \\(2^{-2} = \\tfrac14\\), \\(2^{-3} = \\tfrac18\\).</p>',
      async on(a, ctx) {
        a.reset();
        for (let s = 1; s <= 7; s++) { a.hb(2, s); if (!(await ctx.sleep(750))) return; }
      },
    },
    {
      title: 'The zero index',
      text: '<p>\\(a^3 \\div a^3 = a^{3-3} = a^0\\). But anything divided by itself is 1.</p><p>So \\(a^0 = 1\\) for any \\(a\\) (except 0).</p>',
      tip: '\\(7^0 = 1\\), \\(1000^0 = 1\\), \\((\\tfrac25)^0 = 1\\).',
      async on(a, ctx) {
        a.reset(); a.hb(3, 4);
        await a.lines([['\\frac{a^3}{a^3} = a^{3-3} = a^0', 'index law'], ['\\frac{a^3}{a^3} = 1', 'divided by itself'], ['a^0 = 1', '']], ctx, 1300);
      },
    },
    {
      title: 'Negative indices',
      text: '<p>A negative index means <b>one over</b> the positive power: \\(a^{-n} = \\dfrac{1}{a^n}\\).</p>',
      tip: 'The negative sign makes a reciprocal; it does NOT make the answer negative.',
      async on(a, ctx) {
        a.reset(); a.hb(5, 7);
        await a.lines([['5^{-2} = \\frac{1}{5^2} = \\frac{1}{25}', ''], ['10^{-3} = \\frac{1}{1000} = 0.001', ''], ['\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}', 'flip the fraction, then square']], ctx, 1500);
      },
    },
    {
      title: 'The index laws still work',
      text: '<p>Add, subtract and multiply negative indices just like positive ones.</p>',
      async on(a, ctx) {
        a.reset(); a.hb(2, 7);
        await a.lines([['3^{-4} \\times 3^6 = 3^{2} = 9', '−4 + 6 = 2'], ['\\frac{x^2}{x^5} = x^{-3} = \\frac{1}{x^3}', '2 − 5 = −3'], ['(4^{-1})^2 = 4^{-2} = \\frac{1}{16}', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: below zero',
      text: '<p>Choose a base and an index from \\(-4\\) to 4. The bars show the pattern: divide by the base each step to the right.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'negzero',
  gens: [
    () => { const b = FD.rnd(2, 10), k = FD.rnd(1, b > 5 ? 2 : 3); return { type: 'num', q: `Work out \\(${b}^{-${k}}\\). Give your answer as a fraction.`, a: 1 / b ** k, form: 'fraction', show: `\\(\\tfrac{1}{${b ** k}}\\)`, hint: 'Type it like 1/8.', why: `\\(${b}^{-${k}} = \\dfrac{1}{${b}^{${k}}} = \\dfrac{1}{${b ** k}}\\).` }; },
    () => { const b = FD.rnd(2, 99); return { type: 'num', q: `Work out \\(${b}^0\\)`, a: 1, why: 'Any number (except 0) to the power 0 is 1.' }; },
    () => { let p, q; do { p = FD.rnd(1, 5); q = FD.rnd(2, 6); } while (FD.gcd(p, q) !== 1 || p === q); const k = FD.rnd(1, 2); return { type: 'num', q: `Work out \\(\\left(\\dfrac{${p}}{${q}}\\right)^{-${k}}\\). Give your answer as a fraction or a whole number.`, a: q ** k / p ** k, form: 'simplest', why: `Flip the fraction: \\(\\left(\\dfrac{${q}}{${p}}\\right)^{${k}} = ${FD.ftex(q ** k, p ** k)}\\).`, show: `\\(${FD.ftex(q ** k, p ** k)}\\)`, hint: 'Type it like 9/4.' }; },
    () => { const m = FD.rnd(-6, 6), n = FD.rnd(-6, 6), op = FD.pick(['×', '÷']); const k = op === '×' ? m + n : m - n; return { type: 'num', q: `\\(x^{${m}} ${op === '×' ? '\\times' : '\\div'} x^{${n}} = x^k\\). Find \\(k\\).`, a: k, why: `${op === '×' ? 'Add' : 'Subtract'} the indices: \\(${m} ${op === '×' ? '+' : '-'} ${n < 0 ? `(${n})` : n} = ${k}\\).` }; },
  ],
});

FD.check({
  section: 'negzero',
  items: [
    { type: 'num', q: 'Work out \\(4^{-3}\\) as a fraction.', a: 1 / 64, form: 'fraction', show: '\\(\\tfrac{1}{64}\\)', hint: 'Type it like 1/8.', why: '\\(\\frac{1}{4^3} = \\frac{1}{64}\\).' },
    { type: 'num', q: 'Work out \\(17^0 + 2^{-1}\\). Give your answer as a decimal.', a: 1.5, why: '\\(1 + \\tfrac12 = 1.5\\).' },
    { type: 'tf', q: '\\(3^{-2}\\) is a negative number.', a: false, why: '\\(3^{-2} = \\tfrac19\\), which is positive.' },
    { type: 'num', q: 'Work out \\(\\left(\\tfrac{3}{4}\\right)^{-2}\\)', a: 16 / 9, form: 'simplest', show: '\\(\\tfrac{16}{9}\\)', hint: 'Type it like 9/4.', why: '\\(\\left(\\tfrac43\\right)^2 = \\tfrac{16}{9}\\).' },
    { type: 'mcq', q: 'Simplify \\(\\dfrac{y^3}{y^7}\\)', opts: ['\\(y^{-4}\\)', '\\(y^4\\)', '\\(y^{10}\\)', '\\(y^{\\frac37}\\)'], why: '\\(3 - 7 = -4\\).' },
  ],
});
