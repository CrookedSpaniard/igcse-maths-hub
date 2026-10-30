// Factor chips: FD.chips(n, label, cls) → n chips joined by × signs.
FD.chips = (n, label, cls = '', anim) => Array.from({ length: n }, (_, i) => `<span class="ch ${cls} ${anim ? 'in' : ''}" style="animation-delay:${anim ? i * 0.12 : 0}s">${label}</span>`).join('<span class="ch-op">×</span>');
FD.supTxt = (k) => String(k).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c] || (c === '-' ? '⁻' : c)).join('');

FD.add({
  id: 'notation',
  title: 'Index notation',
  tab: 'Index notation',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Base', 'The number being multiplied: in \\(2^5\\) the base is 2.'],
    ['Index (power)', 'How many times the base is multiplied: in \\(2^5\\) the index is 5. The plural is indices.'],
    ['Index form', 'A product written with powers: \\(3 \\times 3 \\times 3 \\times 3 = 3^4\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'nt-s', '<div class="ch-box" id="ch"></div>', `
      <label class="ctrl">Base <input type="range" id="rb" min="-5" max="10" value="2"><output id="ob">2</output></label>
      <label class="ctrl">Index <input type="range" id="rk" min="1" max="8" value="5"><output id="ok">5</output></label>`, () => sync());
    a.ch = (html) => { a.$('#ch').innerHTML = html; };
    const sync = () => {
      const b = +a.$('#rb').value, k = +a.$('#rk').value; a.$('#ob').textContent = b; a.$('#ok').textContent = k;
      const B = b < 0 ? `(${b})` : String(b);
      a.ch(FD.chips(k, B));
      a.big(`${B}^{${k}} = ${(b ** k).toLocaleString('en-GB')}`);
      a.msg(b < 0 ? `A negative base: the answer is ${k % 2 ? '<b>negative</b> (odd index)' : '<b>positive</b> (even index)'}.` : b === 0 || b === 1 ? `${b} to any power is ${b}.` : `${k} lots of ${b} multiplied together.`);
    };
    ['#rb', '#rk'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.ch(FD.chips(5, '2'));
    return a;
  },
  steps: [
    {
      title: 'Base and index',
      text: '<p>\\(2 \\times 2 \\times 2 \\times 2 \\times 2\\) is five 2s multiplied together. Write it as \\(2^5\\).</p><p>2 is the <b>base</b>, 5 is the <b>index</b> (or power). Say “2 to the power 5”.</p>',
      tip: '\\(2^5\\) is NOT \\(2 \\times 5\\).',
      async on(a, ctx) {
        a.reset(); a.ch(FD.chips(5, '2', '', true));
        if (!(await ctx.sleep(1500))) return;
        a.big('2 \\times 2 \\times 2 \\times 2 \\times 2 = 2^5 = 32');
      },
    },
    {
      title: 'Working out powers',
      text: '<p>Multiply step by step. Keep the brackets on a negative base.</p>',
      async on(a, ctx) {
        a.reset(); a.ch(FD.chips(4, '3', '', true));
        await a.lines([['3^4 = 3 \\times 3 \\times 3 \\times 3 = 81', '9, 27, 81'], ['(-2)^3 = (-2) \\times (-2) \\times (-2) = -8', 'odd index: negative'], ['10^6 = 1\\,000\\,000', 'a 1 with 6 zeros'], ['5^1 = 5', 'power 1: just the base']], ctx, 1300);
      },
    },
    {
      title: 'Writing products in index form',
      text: '<p>Group the same bases together and count them.</p><p>\\(5 \\times 5 \\times 5 \\times 7 \\times 7\\) has three 5s and two 7s.</p>',
      async on(a, ctx) {
        a.reset(); a.ch(FD.chips(3, '5', '', true) + '<span class="ch-op">×</span>' + FD.chips(2, '7', 'g2', true));
        await a.lines([['5 \\times 5 \\times 5 \\times 7 \\times 7 = 5^3 \\times 7^2', ''], ['a \\times a \\times a \\times b = a^3 b', 'it works with letters too']], ctx, 1500);
      },
    },
    {
      title: 'Powers on a calculator',
      text: '<p>Use the power key, often \\(x^{\\square}\\) or \\(x^y\\). Type the base, the power key, then the index.</p><p>\\(2^{10}\\): <b>2</b>, \\(x^{\\square}\\), <b>10</b>, <b>=</b> gives 1024.</p>',
      tip: 'For a negative base, type the brackets: ( − 3 ) x□ 4 gives 81.',
      async on(a, ctx) {
        a.reset(); a.ch(FD.chips(10, '2', '', true));
        if (!(await ctx.sleep(1500))) return; a.big('2^{10} = 1024');
      },
    },
    {
      title: 'Try it: base and index',
      text: '<p>Change the base and the index. The chips show the repeated multiplication.</p>',
      tip: 'Try a negative base with an even index, then an odd index.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'notation',
  gens: [
    () => { const b = FD.rnd(2, 6), k = FD.rnd(2, b > 4 ? 4 : 6); return { type: 'num', q: `Work out \\(${b}^{${k}}\\)`, a: b ** k, why: `\\(${Array(k).fill(b).join(' \\times ')} = ${b ** k}\\).` }; },
    () => { const b = FD.rnd(2, 5), k = FD.rnd(2, 5); return { type: 'num', q: `Work out \\((-${b})^{${k}}\\)`, a: (-b) ** k, why: `\\(${b}^{${k}} = ${b ** k}\\). The index is ${k % 2 ? 'odd, so the answer is negative' : 'even, so the answer is positive'}.` }; },
    () => { const p = FD.pick([[2, 3], [3, 5], [2, 7], [5, 3], [3, 7]]), m = FD.rnd(2, 4), n = FD.rnd(1, 3); const prod = Array(m).fill(p[0]).concat(Array(n).fill(p[1])).join(' \\times '); return { type: 'num', q: `\\(${prod} = ${p[0]}^a \\times ${p[1]}^b\\). Find \\(a\\) and \\(b\\).`, a: [m, n], fields: ['a =', 'b ='], why: `There are ${m} lots of ${p[0]} and ${n} lot${n > 1 ? 's' : ''} of ${p[1]}: \\(${p[0]}^{${m}} \\times ${p[1]}^{${n}}\\).` }; },
    () => { const k = FD.rnd(3, 9); return { type: 'mcq', q: `Which is equal to \\(10^{${k}}\\)?`, opts: [`1${'0'.repeat(k)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','), `${10 * k}`, `1${'0'.repeat(k - 1)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','), `1${'0'.repeat(k + 1)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')], why: `\\(10^{${k}}\\) is 1 followed by ${k} zeros.` }; },
  ],
});

FD.check({
  section: 'notation',
  items: [
    { type: 'num', q: 'Work out \\(2^6\\)', a: 64, why: '\\(2, 4, 8, 16, 32, 64\\).' },
    { type: 'num', q: 'Work out \\((-3)^4\\)', a: 81, why: 'Even index: positive. \\(3^4 = 81\\).' },
    { type: 'mcq', q: 'Write \\(7 \\times 7 \\times 7 \\times 7\\) in index form.', opts: ['\\(7^4\\)', '\\(4^7\\)', '\\(7 \\times 4\\)', '\\(28\\)'], why: 'Four 7s multiplied: \\(7^4\\).' },
    { type: 'tf', q: '\\(3^2 = 6\\)', a: false, why: '\\(3^2 = 3 \\times 3 = 9\\), not \\(3 \\times 2\\).' },
    { type: 'num', q: 'Work out \\(2^3 \\times 5^2\\)', a: 200, why: '\\(8 \\times 25 = 200\\).' },
  ],
});
