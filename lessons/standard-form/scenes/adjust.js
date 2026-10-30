FD.add({
  id: 'adjust',
  title: 'Converting and ordering',
  tab: 'Ordering',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Back to an ordinary number', 'Move the point \\(n\\) places: right if \\(n\\) is positive, left if \\(n\\) is negative.'],
    ['Fixing A', 'If A is not between 1 and 10, move its point and change the power to balance: \\(34 \\times 10^5 = 3.4 \\times 10^6\\).'],
    ['Ordering', 'Compare the powers first; if they are equal, compare the values of A.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ad-s', '<div id="sh"></div>', `
      <label class="ctrl">A × 10 <input type="range" id="ra" min="10" max="99" value="42"><output id="oa">4.2</output></label>
      <label class="ctrl">Power n <input type="range" id="rn" min="-6" max="8" value="5"><output id="on">5</output></label>`, () => sync());
    a.sh = FD.shifter(a.$('#sh'));
    const sync = () => {
      const A = +a.$('#ra').value / 10, n = +a.$('#rn').value, x = +(A * 10 ** n).toPrecision(8); a.$('#oa').textContent = A; a.$('#on').textContent = n;
      const s = n >= 0 ? String(Math.round(x)) : x.toFixed(-n + 1);
      a.sh.set(s); a.sh.go(99);
      a.big(`${A} \\times 10^{${n}} = ${FD.ordTex(x)}`);
      a.msg(n > 0 ? `Move the point ${n} places right: a large number.` : n < 0 ? `Move the point ${-n} places left: a small number.` : 'Power 0: the number is just A.');
    };
    ['#ra', '#rn'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.sh.set('420000');
    return a;
  },
  steps: [
    {
      title: 'Back to ordinary numbers',
      text: '<p>\\(4.2 \\times 10^5\\): move the point <b>5 places right</b>, filling gaps with zeros: 420 000.</p><p>\\(7.3 \\times 10^{-3}\\): move the point <b>3 places left</b>: 0.0073.</p>',
      async on(a, ctx) {
        a.reset(); a.sh.set('420000');
        await a.lines([['4.2 \\times 10^5 = 420\\,000', '5 places right'], ['7.3 \\times 10^{-3} = 0.0073', '3 places left']], ctx, 1400);
      },
    },
    {
      title: 'When A is not between 1 and 10',
      text: '<p>\\(34 \\times 10^5\\) is not in standard form. Write 34 as \\(3.4 \\times 10\\), then add the powers.</p>',
      tip: 'If A gets smaller, the power gets bigger (and the other way round), so the value stays the same.',
      async on(a, ctx) {
        a.reset(); a.sh.set('3400000');
        await a.lines([['34 \\times 10^5 = 3.4 \\times 10^1 \\times 10^5', ''], ['= 3.4 \\times 10^6', ''], ['0.62 \\times 10^{-3} = 6.2 \\times 10^{-4}', 'A bigger, power smaller']], ctx, 1400);
      },
    },
    {
      title: 'Ordering',
      text: '<p>Order \\(5.1 \\times 10^{4}\\), \\(9.8 \\times 10^{3}\\), \\(2.3 \\times 10^{4}\\) and \\(7 \\times 10^{-2}\\), smallest first.</p><p>Look at the <b>powers</b> first. For equal powers, compare A.</p>',
      async on(a, ctx) {
        a.reset(); a.sh.set('51000');
        await a.lines([['10^{-2} < 10^{3} < 10^{4}', 'powers first'], ['2.3 \\times 10^4 < 5.1 \\times 10^4', 'same power: compare A'], ['7 \\times 10^{-2}, \\; 9.8 \\times 10^{3}, \\; 2.3 \\times 10^{4}, \\; 5.1 \\times 10^{4}', 'smallest first']], ctx, 1400);
      },
    },
    {
      title: 'Try it: build the number',
      text: '<p>Choose A and the power \\(n\\). The ordinary number appears, with the point moved \\(n\\) places.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'adjust',
  gens: [
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rnd(2, 7); return { type: 'num', q: `Write \\(${A} \\times 10^{${n}}\\) as an ordinary number.`, a: Math.round(A * 10 ** n), why: `Move the point ${n} places right: ${FD.num(Math.round(A * 10 ** n))}.` }; },
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rnd(1, 5), x = +(A * 10 ** -n).toPrecision(6); return { type: 'num', q: `Write \\(${A} \\times 10^{-${n}}\\) as an ordinary number.`, a: x, why: `Move the point ${n} places left: ${x.toFixed(n + 1)}.` }; },
    () => { const B = FD.rnd(11, 99), n = FD.rnd(-5, 6); return { type: 'num', q: `Write \\(${B} \\times 10^{${n}}\\) in standard form, \\(A \\times 10^m\\).`, a: [B / 10, n + 1], fields: ['A =', 'm ='], why: `\\(${B} = ${B / 10} \\times 10\\), so \\(${B} \\times 10^{${n}} = ${B / 10} \\times 10^{${n + 1}}\\).` }; },
    () => { const vals = []; while (vals.length < 3) { const v = [FD.dec(FD.rnd(11, 99) / 10), FD.rnd(-3, 6)]; if (!vals.some((u) => u[1] === v[1] && u[0] === v[0])) vals.push(v); } const val = (v) => v[0] * 10 ** v[1], big = vals.reduce((m, v) => (val(v) > val(m) ? v : m)); return { type: 'mcq', q: 'Which number is the largest?', opts: [big, ...vals.filter((v) => v !== big)].map((v) => `\\(${v[0]} \\times 10^{${v[1]}}\\)`), why: 'Compare the powers of 10 first; if they are equal, compare A.' }; },
  ],
});

FD.check({
  section: 'adjust',
  items: [
    { type: 'num', q: 'Write \\(6.05 \\times 10^4\\) as an ordinary number.', a: 60500, why: '4 places right.' },
    { type: 'num', q: 'Write \\(3 \\times 10^{-5}\\) as an ordinary number.', a: 0.00003, why: '5 places left.' },
    { type: 'num', q: 'Write \\(250 \\times 10^{3}\\) in standard form.', a: [2.5, 5], fields: ['A =', 'n ='], why: '\\(250 = 2.5 \\times 10^2\\), so \\(2.5 \\times 10^5\\).' },
    { type: 'mcq', q: 'Which is the smallest?', opts: ['\\(8 \\times 10^{-4}\\)', '\\(2 \\times 10^{-3}\\)', '\\(9 \\times 10^{-3}\\)', '\\(1 \\times 10^{2}\\)'], why: '\\(10^{-4}\\) is the smallest power.' },
  ],
});
