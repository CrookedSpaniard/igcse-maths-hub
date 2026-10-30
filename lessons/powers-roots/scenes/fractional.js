// Pipeline for a^(±m/n): base → nth root → power m → (reciprocal) → answer. stage = how many boxes are lit.
FD.pipe = (host) => (b, m, n, neg, stage = 9) => {
  const r = Math.round(b ** (1 / n)), p = r ** m;
  const boxes = [[String(b), ''], [n === 2 ? '√' : `${n}th root`.replace('3th', 'cube').replace('4th', '4th'), 'op'], [String(r), ''], [`power ${m}`, 'op'], [String(p), '']];
  if (neg) boxes.push(['one over', 'op'], [`1/${p}`, '']);
  host.innerHTML = `<div class="pp">${boxes.map(([t, c], i) => `${i ? '<span class="pp-ar">→</span>' : ''}<span class="pp-box ${c} ${i < stage ? 'on' : ''}">${t}</span>`).join('')}</div>`;
};
// Bases with whole roots: [base, n].
FD.ROOTS = [[4, 2], [9, 2], [16, 2], [25, 2], [36, 2], [49, 2], [64, 2], [81, 2], [100, 2], [8, 3], [27, 3], [64, 3], [125, 3], [1000, 3], [16, 4], [81, 4], [32, 5]];

FD.add({
  id: 'fractional',
  title: 'Fractional indices',
  tab: 'Fractional',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['\\(a^{\\frac12}\\)', 'The square root: \\(a^{\\frac12} = \\sqrt{a}\\).'],
    ['\\(a^{\\frac1n}\\)', 'The \\(n\\)th root: \\(a^{\\frac13} = \\sqrt[3]{a}\\).'],
    ['\\(a^{\\frac mn}\\)', 'The \\(n\\)th root, then the power \\(m\\): \\(a^{\\frac mn} = (\\sqrt[n]{a})^m\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'fi-s', '<div id="pp"></div>', `
      <div class="bd-row"><label>Base and root <select id="pick">${FD.ROOTS.map(([b, n], i) => `<option value="${i}">${b}^(1/${n})</option>`).join('')}</select></label></div>
      <label class="ctrl">Power m <input type="range" id="rm" min="1" max="3" value="2"><output id="om">2</output></label>
      <label class="ctrl">Negative? <input type="range" id="rs" min="0" max="1" value="0"><output id="os">no</output></label>`, () => sync());
    a.pp = FD.pipe(a.$('#pp'));
    const sync = () => {
      const [b, n] = FD.ROOTS[+a.$('#pick').value], m = +a.$('#rm').value, neg = +a.$('#rs').value === 1;
      a.$('#om').textContent = m; a.$('#os').textContent = neg ? 'yes' : 'no';
      const r = Math.round(b ** (1 / n)), p = r ** m;
      a.pp(b, m, n, neg);
      a.big(`${b}^{${neg ? '-' : ''}\\frac{${m}}{${n}}} = ${neg ? '\\frac{1}{' : ''}(${n === 2 ? `\\sqrt{${b}}` : `\\sqrt[${n}]{${b}}`})^{${m}}${neg ? '}' : ''} = ${neg ? `\\frac{1}{${r}^{${m}}} = \\frac{1}{${p}}` : `${r}^{${m}} = ${p}`}`);
      a.msg('The bottom of the fraction is the root, the top is the power, and a minus sign means one over.');
    };
    ['#pick', '#rm', '#rs'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.pp(8, 2, 3, false, 0);
    return a;
  },
  steps: [
    {
      title: 'A half power is a square root',
      text: '<p>\\(9^{\\frac12} \\times 9^{\\frac12} = 9^{\\frac12 + \\frac12} = 9^1 = 9\\).</p><p>The number that multiplies by itself to make 9 is 3. So \\(9^{\\frac12} = \\sqrt{9} = 3\\).</p>',
      async on(a, ctx) {
        a.reset(); a.pp(9, 1, 2, false, 0);
        for (let s = 1; s <= 3; s++) { if (!(await ctx.sleep(800))) return; a.pp(9, 1, 2, false, s); }
        a.big('9^{\\frac12} = \\sqrt{9} = 3');
      },
    },
    {
      title: 'Other roots',
      text: '<p>In the same way, \\(a^{\\frac13}\\) is the cube root and \\(a^{\\frac14}\\) is the fourth root.</p>',
      async on(a, ctx) {
        a.reset(); a.pp(27, 1, 3, false, 3);
        await a.lines([['27^{\\frac13} = \\sqrt[3]{27} = 3', ''], ['16^{\\frac14} = \\sqrt[4]{16} = 2', '2 × 2 × 2 × 2 = 16'], ['32^{\\frac15} = 2', '']], ctx, 1300);
      },
    },
    {
      title: 'Root first, then power',
      text: '<p>\\(8^{\\frac23}\\): the <b>bottom</b> (3) is the root and the <b>top</b> (2) is the power.</p><p>Take the root first, so the numbers stay small: \\(\\sqrt[3]{8} = 2\\), then \\(2^2 = 4\\).</p>',
      tip: 'Root first: \\(\\sqrt[3]{8}^{\\,2} = 2^2\\) is easier than \\(\\sqrt[3]{64}\\).',
      async on(a, ctx) {
        a.reset(); a.pp(8, 2, 3, false, 0);
        for (let s = 1; s <= 5; s++) { if (!(await ctx.sleep(700))) return; a.pp(8, 2, 3, false, s); }
        a.big('8^{\\frac23} = (\\sqrt[3]{8})^2 = 2^2 = 4');
      },
    },
    {
      title: 'Negative fractional indices',
      text: '<p>Do the three jobs: <b>root</b> (bottom), <b>power</b> (top), <b>one over</b> (minus sign).</p>',
      async on(a, ctx) {
        a.reset(); a.pp(32, 3, 5, true, 7);
        await a.lines([['32^{-\\frac35} = \\frac{1}{(\\sqrt[5]{32})^3} = \\frac{1}{2^3} = \\frac{1}{8}', ''], ['\\left(\\frac{9}{4}\\right)^{-\\frac12} = \\left(\\frac{4}{9}\\right)^{\\frac12} = \\frac{2}{3}', 'flip, then square root']], ctx, 1600);
      },
    },
    {
      title: 'Try it: root, power, one over',
      text: '<p>Choose a base, a power and a sign. Follow the boxes from left to right.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'fractional',
  gens: [
    () => { const [b, n] = FD.pick(FD.ROOTS), r = Math.round(b ** (1 / n)); return { type: 'num', q: `Work out \\(${b}^{\\frac{1}{${n}}}\\)`, a: r, why: `\\(${b}^{\\frac{1}{${n}}} = ${n === 2 ? `\\sqrt{${b}}` : `\\sqrt[${n}]{${b}}`} = ${r}\\) because \\(${r}^{${n}} = ${b}\\).` }; },
    () => { const [b, n] = FD.pick(FD.ROOTS.filter(([x]) => x <= 125)), r = Math.round(b ** (1 / n)), m = FD.rnd(2, 3); if (r ** m > 1000) return { type: 'num', q: '\\(27^{\\frac23}\\)', a: 9, why: '\\((\\sqrt[3]{27})^2 = 3^2 = 9\\).' }; return { type: 'num', q: `Work out \\(${b}^{\\frac{${m}}{${n}}}\\)`, a: r ** m, why: `Root first: \\(${n === 2 ? `\\sqrt{${b}}` : `\\sqrt[${n}]{${b}}`} = ${r}\\). Then the power: \\(${r}^{${m}} = ${r ** m}\\).` }; },
    () => { const [b, n] = FD.pick(FD.ROOTS.filter(([x]) => x <= 81)), r = Math.round(b ** (1 / n)), m = FD.rnd(1, 2); return { type: 'num', q: `Work out \\(${b}^{-\\frac{${m}}{${n}}}\\). Give your answer as a fraction.`, a: 1 / r ** m, form: 'fraction', show: `\\(\\tfrac{1}{${r ** m}}\\)`, hint: 'Type it like 1/4.', why: `Root: ${r}. Power: \\(${r}^{${m}} = ${r ** m}\\). Minus sign: one over, \\(\\tfrac{1}{${r ** m}}\\).` }; },
    () => { const [b, n] = FD.pick([[8, 3], [27, 3], [4, 2], [9, 2], [16, 4]]), k = FD.rnd(2, 3); return { type: 'num', q: `\\(${b} = ${Math.round(b ** (1 / n))}^{${n}}\\). Write \\(${b}^{${k}}\\) as a power of ${Math.round(b ** (1 / n))}. What is the index?`, a: n * k, why: `\\(${b}^{${k}} = (${Math.round(b ** (1 / n))}^{${n}})^{${k}} = ${Math.round(b ** (1 / n))}^{${n * k}}\\).` }; },
  ],
});

FD.check({
  section: 'fractional',
  items: [
    { type: 'num', q: 'Work out \\(64^{\\frac12}\\)', a: 8, why: '\\(\\sqrt{64} = 8\\).' },
    { type: 'num', q: 'Work out \\(125^{\\frac23}\\)', a: 25, why: '\\((\\sqrt[3]{125})^2 = 5^2 = 25\\).' },
    { type: 'num', q: 'Work out \\(16^{-\\frac34}\\) as a fraction.', a: 1 / 8, form: 'fraction', show: '\\(\\tfrac18\\)', hint: 'Type it like 1/4.', why: '\\(\\sqrt[4]{16} = 2\\), \\(2^3 = 8\\), one over: \\(\\tfrac18\\).' },
    { type: 'mcq', q: 'What does \\(x^{\\frac{3}{2}}\\) mean?', opts: ['\\((\\sqrt{x})^3\\)', '\\((\\sqrt[3]{x})^2\\)', '\\(\\frac{3}{2}x\\)', '\\(x^3 \\div 2\\)'], why: 'Bottom = root, top = power.' },
    { type: 'num', q: 'Work out \\(\\left(\\tfrac{8}{27}\\right)^{-\\frac13}\\)', a: 3 / 2, show: '\\(\\tfrac32\\)', hint: 'Type it like 3/2 or 1.5.', why: 'Flip: \\(\\left(\\tfrac{27}{8}\\right)^{\\frac13} = \\tfrac{3}{2}\\).' },
  ],
});
