FD.add({
  id: 'reverse',
  title: 'Reverse percentages',
  tab: 'Reverse',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Reverse percentage', 'You know the amount <b>after</b> a percentage change and want the <b>original</b> amount.'],
    ['Divide by the multiplier', 'Original = new amount ÷ multiplier. After +20%: ÷ 1.2.'],
  ],
  mount(el) {
    const a = FD.board(el, 're-s', '<div id="pb"></div>', `
      <label class="ctrl">Price now (£) <input type="range" id="rn" min="12" max="300" step="6" value="72"><output id="on">72</output></label>
      <label class="ctrl">After a change of (%) <input type="range" id="rp" min="-40" max="50" step="5" value="20"><output id="op">+20%</output></label>`, () => sync());
    a.pb = FD.pbar(a.$('#pb'));
    const sync = () => {
      const N = +a.$('#rn').value, p = +a.$('#rp').value, m = FD.dec(1 + p / 100), o = N / m;
      a.$('#on').textContent = N; a.$('#op').textContent = (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + '%';
      a.pb(100 + p, { max: 150, marks: [{ p: 100 + p, top: `${100 + p}% = £${N}` }, { p: 100, top: '100% = ?' }].filter((mk, i) => i === 0 || p !== 0) });
      a.big(`\\text{original} = ${N} \\div ${m} = ${Number.isInteger(o * 100) ? FD.dec(o) : o.toFixed(2)}`);
      a.msg(`£${N} is ${100 + p}% of the original price, so divide by ${m}.`);
    };
    ['#rn', '#rp'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.pb(120, { max: 150 });
    return a;
  },
  steps: [
    {
      title: 'Going backwards',
      text: '<p>After a 20% price rise, a game costs £72. What did it cost <b>before</b>?</p><p>£72 is <b>120%</b> of the original price, not 100%.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(120, { max: 150, marks: [{ p: 120, top: '120% = £72' }] });
        await a.lines([['120\\% = 72', ''], ['1\\% = 72 \\div 120 = 0.6', ''], ['100\\% = 0.6 \\times 100 = £60', 'the original price']], ctx, 1400);
        a.pb(120, { max: 150, marks: [{ p: 120, top: '120% = £72' }, { p: 100, top: '£60' }] });
      },
    },
    {
      title: 'Divide by the multiplier',
      text: '<p>Going forwards you multiply by 1.2, so going backwards you <b>divide</b> by 1.2.</p>',
      tip: 'Check: \\(60 \\times 1.2 = 72\\). ✓',
      async on(a, ctx) {
        a.reset(); a.pb(120, { max: 150, marks: [{ p: 120, top: '£72' }, { p: 100, top: '£60' }] });
        await a.lines([['\\text{original} \\times 1.2 = 72', 'forwards'], ['\\text{original} = 72 \\div 1.2 = 60', 'backwards']], ctx, 1400);
      },
    },
    {
      title: 'After a decrease',
      text: '<p>A coat costs £68 in a sale with 15% off. What was the price before the sale?</p><p>£68 is <b>85%</b> of the original.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(85, { max: 150, marks: [{ p: 85, top: '85% = £68' }, { p: 100, top: '?' }] });
        await a.lines([['\\text{multiplier} = 1 - 0.15 = 0.85', ''], ['68 \\div 0.85 = 80', 'original £80']], ctx, 1400);
      },
    },
    {
      title: 'The common mistake',
      text: '<p>Do <b>not</b> take 20% of the new price away: 20% of £72 is £14.40, and \\(72 - 14.40 = 57.60\\), which is wrong.</p><p>The 20% was of the <b>original</b> price, which you do not know yet.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(120, { max: 150, marks: [{ p: 120, top: '£72' }] });
        await a.lines([['\\textcolor{#B84545}{72 \\times 0.8 = 57.60}', '✗ wrong'], ['72 \\div 1.2 = 60', '✓ right']], ctx, 1400);
      },
    },
    {
      title: 'Try it: find the original',
      text: '<p>Choose the price now and the percentage change that happened. The original price is found by dividing by the multiplier.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'reverse',
  gens: [
    () => { const o = FD.pick([20, 40, 50, 60, 80, 120, 150, 200, 240, 300, 400]), p = FD.pick([10, 20, 25, 5, 15, 30, 40]), n = FD.dec(o * (1 + p / 100)); return { type: 'num', q: `After a ${p}% increase, a price is ${FD.gbp(n)}. What was the original price, in pounds?`, a: o, hint: 'Give your answer in pounds.', why: `${FD.gbp(n)} is ${100 + p}% of the original. \\(${n} \\div ${FD.dec(1 + p / 100)} = ${o}\\).` }; },
    () => { const o = FD.pick([20, 40, 50, 60, 80, 120, 150, 200, 240, 300, 400]), p = FD.pick([10, 20, 25, 5, 15, 30, 40, 35]), n = FD.dec(o * (1 - p / 100)); return { type: 'num', q: `In a sale everything has ${p}% off. A watch costs ${FD.gbp(n)} in the sale. What was the price before the sale, in pounds?`, a: o, hint: 'Give your answer in pounds.', why: `${FD.gbp(n)} is ${100 - p}% of the original. \\(${n} \\div ${FD.dec(1 - p / 100)} = ${o}\\).` }; },
    () => { const o = FD.pick([1000, 2000, 2500, 4000, 5000]), p = FD.pick([4, 5, 8, 10, 12]), n = FD.dec(o * (1 + p / 100)); return { type: 'mcq', q: `A salary of ${FD.gbp(n)} includes a ${p}% pay rise. Which calculation gives the salary before the rise?`, opts: [`\\(${n} \\div ${FD.dec(1 + p / 100)}\\)`, `\\(${n} \\times ${FD.dec(1 - p / 100)}\\)`, `\\(${n} - ${p}\\)`, `\\(${n} \\div ${FD.dec(1 - p / 100)}\\)`], why: `The salary now is ${100 + p}% of the old one, so divide by ${FD.dec(1 + p / 100)}: the old salary was ${FD.gbp(o)}.` }; },
  ],
});

FD.check({
  section: 'reverse',
  items: [
    { type: 'num', q: 'After a 10% increase, a ticket costs £44. What did it cost before, in pounds?', a: 40, hint: 'Give your answer in pounds.', why: '\\(44 \\div 1.1 = 40\\).' },
    { type: 'num', q: 'A phone costs £255 after a 15% discount. What was the original price, in pounds?', a: 300, hint: 'Give your answer in pounds.', why: '\\(255 \\div 0.85 = 300\\).' },
    { type: 'mcq', q: 'A price after a 25% increase is £150. Which is the original price?', opts: ['£120', '£112.50', '£125', '£187.50'], why: '\\(150 \\div 1.25 = 120\\).' },
    { type: 'tf', q: 'To undo a 20% increase you decrease by 20%.', a: false, why: 'You divide by 1.2. Decreasing by 20% (× 0.8) gives the wrong answer.' },
  ],
});
