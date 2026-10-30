// Chip pictures for the three index laws (base a).
FD.lawPic = {
  mul: (m, n, merged) => (merged ? FD.chips(m, 'a') + '<span class="ch-op">×</span>' + FD.chips(n, 'a', 'g2') : `<span class="ch-br">(</span>${FD.chips(m, 'a')}<span class="ch-br">)</span><span class="ch-op">×</span><span class="ch-br">(</span>${FD.chips(n, 'a', 'g2')}<span class="ch-br">)</span>`),
  div: (m, n, cancel) => `<div class="ch-frac"><div>${Array.from({ length: m }, (_, i) => `<span class="ch ${cancel && i < n ? 'out' : ''}">a</span>`).join('')}</div><div>${Array.from({ length: n }, () => `<span class="ch g2 ${cancel ? 'out' : ''}">a</span>`).join('')}</div></div>`,
  pow: (m, n) => Array.from({ length: n }, (_, g) => `<span class="ch-br">(</span>${FD.chips(m, 'a', ['', 'g2', 'g3'][g % 3])}<span class="ch-br">)</span>`).join(''),
};

FD.add({
  id: 'laws',
  title: 'The laws of indices',
  tab: 'Index laws',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Multiplying', '\\(a^m \\times a^n = a^{m+n}\\): add the indices.'],
    ['Dividing', '\\(a^m \\div a^n = a^{m-n}\\): subtract the indices.'],
    ['Power of a power', '\\((a^m)^n = a^{mn}\\): multiply the indices.'],
    ['Same base', 'The laws only work when the bases are the same: \\(2^3 \\times 5^2\\) cannot be simplified this way.'],
  ],
  mount(el) {
    const a = FD.board(el, 'lw-s', '<div class="ch-box" id="ch"></div>', `
      <div class="bd-row"><label>Law <select id="op"><option value="mul">a^m × a^n</option><option value="div">a^m ÷ a^n</option><option value="pow">(a^m)^n</option></select></label></div>
      <label class="ctrl">m <input type="range" id="rm" min="1" max="7" value="4"><output id="om">4</output></label>
      <label class="ctrl">n <input type="range" id="rn" min="1" max="5" value="2"><output id="on">2</output></label>`, () => sync());
    a.ch = (html) => { a.$('#ch').innerHTML = html; };
    const sync = () => {
      const op = a.$('#op').value; let m = +a.$('#rm').value; const n = +a.$('#rn').value;
      if (op === 'div' && m < n) { m = n; a.$('#rm').value = m; }
      if (op === 'pow') { a.$('#rm').max = 4; if (m > 4) { m = 4; a.$('#rm').value = 4; } } else a.$('#rm').max = 7;
      a.$('#om').textContent = m; a.$('#on').textContent = n;
      a.ch(FD.lawPic[op](m, n, op === 'div'));
      a.big(op === 'mul' ? `a^{${m}} \\times a^{${n}} = a^{${m} + ${n}} = a^{${m + n}}` : op === 'div' ? `a^{${m}} \\div a^{${n}} = a^{${m} - ${n}} = a^{${m - n}}` : `(a^{${m}})^{${n}} = a^{${m} \\times ${n}} = a^{${m * n}}`);
      a.msg(op === 'mul' ? `${m} a's and ${n} more a's: ${m + n} altogether.` : op === 'div' ? `${n} pairs cancel, leaving ${m - n} a's on top.${m === n ? ' Everything cancels: the answer is 1.' : ''}` : `${n} groups of ${m}: ${m * n} a's.`);
    };
    ['#op', '#rm', '#rn'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.ch(FD.lawPic.mul(3, 4));
    return a;
  },
  steps: [
    {
      title: 'Multiplying: add the indices',
      text: '<p>\\(a^3 \\times a^4\\) is three a\'s times four more a\'s: <b>seven</b> a\'s.</p><p>\\(a^3 \\times a^4 = a^{3+4} = a^7\\)</p>',
      async on(a, ctx) {
        a.reset(); a.ch(FD.lawPic.mul(3, 4));
        if (!(await ctx.sleep(1400))) return;
        a.ch(FD.lawPic.mul(3, 4, true)); a.big('a^3 \\times a^4 = a^{3+4} = a^7');
      },
    },
    {
      title: 'Dividing: subtract the indices',
      text: '<p>\\(a^6 \\div a^2\\): write it as a fraction. Each \\(a\\) on the bottom cancels one \\(a\\) on the top.</p><p>\\(a^6 \\div a^2 = a^{6-2} = a^4\\)</p>',
      async on(a, ctx) {
        a.reset(); a.ch(FD.lawPic.div(6, 2, false));
        if (!(await ctx.sleep(1400))) return;
        a.ch(FD.lawPic.div(6, 2, true)); a.big('a^6 \\div a^2 = a^{6-2} = a^4');
      },
    },
    {
      title: 'Power of a power: multiply',
      text: '<p>\\((a^2)^3\\) means \\(a^2 \\times a^2 \\times a^2\\): three groups of two a\'s.</p><p>\\((a^2)^3 = a^{2 \\times 3} = a^6\\)</p>',
      async on(a, ctx) {
        a.reset(); a.ch(FD.lawPic.pow(2, 3));
        if (!(await ctx.sleep(1200))) return; a.big('(a^2)^3 = a^{2 \\times 3} = a^6');
      },
    },
    {
      title: 'Using the laws with numbers',
      text: '<p>Work in index form, then evaluate at the end.</p><p>With terms like \\(2x^3 \\times 5x^2\\), multiply the numbers and add the indices.</p>',
      tip: 'Only use the laws when the bases are the same.',
      async on(a, ctx) {
        a.reset(); a.ch('');
        await a.lines([['3^5 \\times 3^2 \\div 3^4 = 3^{5+2-4} = 3^3 = 27', ''], ['\\frac{7^8}{7^3 \\times 7^4} = \\frac{7^8}{7^7} = 7^1 = 7', ''], ['2x^3 \\times 5x^2 = 10x^5', '2 × 5 = 10, 3 + 2 = 5'], ['(2y^4)^3 = 8y^{12}', '\\(2^3 = 8\\), 4 × 3 = 12']], ctx, 1400);
      },
    },
    {
      title: 'Try it: see the law',
      text: '<p>Choose a law and the indices m and n. The chips show why the law works.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'laws',
  gens: [
    () => { const b = FD.rnd(2, 9), m = FD.rnd(2, 9), n = FD.rnd(2, 9), op = FD.pick(['mul', 'div', 'pow']); if (op === 'div' && m <= n) return { type: 'num', q: `\\(${b}^{${m + n}} \\div ${b}^{${n}} = ${b}^k\\). Find \\(k\\).`, a: m, why: `Subtract the indices: \\(${m + n} - ${n} = ${m}\\).` }; return op === 'mul' ? { type: 'num', q: `\\(${b}^{${m}} \\times ${b}^{${n}} = ${b}^k\\). Find \\(k\\).`, a: m + n, why: `Add the indices: \\(${m} + ${n} = ${m + n}\\).` } : op === 'div' ? { type: 'num', q: `\\(${b}^{${m}} \\div ${b}^{${n}} = ${b}^k\\). Find \\(k\\).`, a: m - n, why: `Subtract the indices: \\(${m} - ${n} = ${m - n}\\).` } : { type: 'num', q: `\\((${b}^{${m}})^{${n}} = ${b}^k\\). Find \\(k\\).`, a: m * n, why: `Multiply the indices: \\(${m} \\times ${n} = ${m * n}\\).` }; },
    () => { const b = FD.pick([2, 3, 5]), p = FD.rnd(3, 7), q = FD.rnd(2, 5), r = FD.rnd(2, p + q - 1), k = p + q - r; if (b ** k > 10000) return { type: 'num', q: `Work out \\(\\dfrac{2^{${p}} \\times 2^{${q}}}{2^{${p + q - 3}}}\\)`, a: 8, why: `\\(2^{${p} + ${q} - ${p + q - 3}} = 2^3 = 8\\).` }; return { type: 'num', q: `Work out \\(\\dfrac{${b}^{${p}} \\times ${b}^{${q}}}{${b}^{${r}}}\\)`, a: b ** k, why: `\\(${b}^{${p} + ${q} - ${r}} = ${b}^{${k}} = ${b ** k}\\).` }; },
    () => { const c1 = FD.rnd(3, 7), c2 = FD.rnd(2, 6), m = FD.rnd(3, 6), n = FD.rnd(2, 6); return { type: 'mcq', q: `Simplify \\(${c1}x^{${m}} \\times ${c2}x^{${n}}\\)`, opts: [`\\(${c1 * c2}x^{${m + n}}\\)`, `\\(${c1 + c2}x^{${m + n}}\\)`, `\\(${c1 * c2}x^{${m * n}}\\)`, `\\(${c1 + c2}x^{${m * n}}\\)`], why: `Multiply the numbers: \\(${c1} \\times ${c2} = ${c1 * c2}\\). Add the indices: \\(${m} + ${n} = ${m + n}\\).` }; },
    () => { const c = FD.rnd(3, 4), m = FD.rnd(3, 5), n = FD.rnd(2, 3); return { type: 'mcq', q: `Simplify \\((${c}y^{${m}})^{${n}}\\)`, opts: [`\\(${c ** n}y^{${m * n}}\\)`, `\\(${c * n}y^{${m * n}}\\)`, `\\(${c ** n}y^{${m + n}}\\)`, `\\(${c}y^{${m * n}}\\)`], why: `Everything in the bracket is raised to the power ${n}: \\(${c}^{${n}} = ${c ** n}\\) and \\(${m} \\times ${n} = ${m * n}\\).` }; },
  ],
});

FD.check({
  section: 'laws',
  items: [
    { type: 'mcq', q: 'Simplify \\(5^4 \\times 5^3\\)', opts: ['\\(5^7\\)', '\\(5^{12}\\)', '\\(25^7\\)', '\\(10^7\\)'], why: 'Add the indices: \\(4 + 3 = 7\\).' },
    { type: 'num', q: '\\(\\dfrac{2^9}{2^4} = 2^k\\). Find \\(k\\).', a: 5, why: '\\(9 - 4 = 5\\).' },
    { type: 'num', q: '\\((3^2)^4 = 3^k\\). Find \\(k\\).', a: 8, why: '\\(2 \\times 4 = 8\\).' },
    { type: 'mcq', q: 'Simplify \\(4a^5 \\times 3a^2\\)', opts: ['\\(12a^7\\)', '\\(7a^7\\)', '\\(12a^{10}\\)', '\\(7a^{10}\\)'], why: '\\(4 \\times 3 = 12\\), \\(5 + 2 = 7\\).' },
    { type: 'num', q: 'Work out \\(\\dfrac{10^5 \\times 10^2}{10^6}\\)', a: 10, why: '\\(10^{5 + 2 - 6} = 10^1 = 10\\).' },
  ],
});
