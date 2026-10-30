// Hundred square. rect(c, r): c tenths across × r tenths down (area model). count(n): n hundredths shaded.
FD.hsq = (host) => {
  host.innerHTML = '<svg class="hs" viewBox="0 0 600 236" role="img"></svg>';
  const svg = host.querySelector('svg'), S = 21, X0 = 195, Y0 = 8;
  const draw = (cls, label, aria) => {
    let s = '';
    for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) s += `<rect class="hs-c ${cls(i, j)}" x="${X0 + i * S}" y="${Y0 + j * S}" width="${S}" height="${S}"/>`;
    svg.innerHTML = s + `<rect class="hs-frame" x="${X0}" y="${Y0}" width="${10 * S}" height="${10 * S}"/>${label}`;
    svg.setAttribute('aria-label', aria);
  };
  return {
    rect(c, r) { draw((i, j) => (i < c && j < r ? 'on' : i < c ? 'col' : j < r ? 'row' : ''), `<text class="hs-l" x="${X0 + 10 * S + 14}" y="${Y0 + 26}">across: 0.${c}</text><text class="hs-l" x="${X0 + 10 * S + 14}" y="${Y0 + 52}">down: 0.${r}</text><text class="hs-l" x="${X0 + 10 * S + 14}" y="${Y0 + 90}">overlap: ${c * r}/100</text>`, `${c} tenths by ${r} tenths: ${c * r} hundredths`); },
    count(n) { draw((i, j) => (i * 10 + j < n ? 'on' : ''), `<text class="hs-l" x="${X0 + 10 * S + 14}" y="${Y0 + 26}">${n} hundredths</text>`, `${n} hundredths shaded`); },
  };
};

FD.add({
  id: 'calc',
  title: 'Calculating with decimals',
  tab: 'Calculating',
  icon: 'calc',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Line up the points', 'To add or subtract decimals, write them in columns with the decimal points in a line.'],
    ['Count the decimal places', 'To multiply, multiply without the points, then put back as many decimal places as the question had in total.'],
    ['Dividing by a decimal', 'Multiply both numbers by 10 (or 100) until you divide by a whole number. The answer does not change.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ca-s', '<div id="sq"></div>', `
      <label class="ctrl">First number 0.<input type="range" id="ra" min="1" max="9" value="3"><output id="oa">0.3</output></label>
      <label class="ctrl">Second number 0.<input type="range" id="rb" min="1" max="9" value="4"><output id="ob">0.4</output></label>`, () => sync());
    a.sq = FD.hsq(a.$('#sq'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value; a.$('#oa').textContent = '0.' + x; a.$('#ob').textContent = '0.' + y;
      a.sq.rect(x, y); a.big(`0.${x} \\times 0.${y} = ${FD.dec((x * y) / 100)}`);
      a.msg(`${x} tenths of ${y} tenths is ${x * y} hundredths. The answer is <b>smaller</b> than both numbers.`);
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.sq.rect(3, 4);
    return a;
  },
  steps: [
    {
      title: 'Adding and subtracting',
      text: '<p>Write the numbers in columns with the <b>decimal points lined up</b>. Fill gaps with zeros.</p><p>\\(12.6 + 3.85\\) and \\(9 - 2.37\\)</p>',
      tip: 'A whole number like 9 has its point at the end: 9 = 9.00.',
      async on(a, ctx) {
        a.reset(); a.sq.count(85);
        await a.lines([['\\begin{array}{r} 12.60 \\\\ +\\; 3.85 \\\\ \\hline 16.45 \\end{array}', 'points in a line'], ['\\begin{array}{r} 9.00 \\\\ -\\; 2.37 \\\\ \\hline 6.63 \\end{array}', '9 = 9.00']], ctx, 1600);
      },
    },
    {
      title: 'Multiplying: an area',
      text: '<p>\\(0.3 \\times 0.4\\): take 3 tenths across and 4 tenths down. The overlap is \\(3 \\times 4 = 12\\) small squares, each one a <b>hundredth</b>.</p><p>So \\(0.3 \\times 0.4 = 0.12\\).</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 4; k++) { a.sq.rect(3, k); if (!(await ctx.sleep(500))) return; }
        a.big('0.3 \\times 0.4 = 0.12');
      },
    },
    {
      title: 'Multiplying: count the decimal places',
      text: '<p>\\(2.4 \\times 0.13\\): ignore the points and work out \\(24 \\times 13\\).</p><p>The question has \\(1 + 2 = 3\\) decimal places, so the answer has 3 too.</p>',
      tip: 'Check with an estimate: \\(2 \\times 0.1 = 0.2\\), so 0.312 is sensible.',
      async on(a, ctx) {
        a.reset(); a.sq.rect(3, 4);
        await a.lines([['24 \\times 13 = 312', 'no decimal points'], ['2.4 \\times 0.13', '1 d.p. + 2 d.p. = 3 d.p.'], ['= 0.312', '3 decimal places']], ctx, 1400);
      },
    },
    {
      title: 'Dividing by a decimal',
      text: '<p>\\(7.2 \\div 0.3\\): multiply <b>both</b> numbers by 10 so you divide by a whole number.</p><p>\\(72 \\div 3 = 24\\). The answer is the same because both numbers changed in the same way.</p>',
      async on(a, ctx) {
        a.reset(); a.sq.count(72);
        await a.lines([['7.2 \\div 0.3 = \\frac{7.2}{0.3}', ''], ['= \\frac{72}{3}', '× 10 top and bottom'], ['= 24', 'bus stop: 72 ÷ 3']], ctx, 1400);
      },
    },
    {
      title: 'Try it: tenths times tenths',
      text: '<p>Choose two decimals. The overlap shows their product in hundredths.</p>',
      tip: 'Why is the answer always smaller than both numbers?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'calc',
  gens: [
    () => { const x = FD.rnd(100, 9999) / 100, y = FD.rnd(10, 999) / 10, add = FD.rnd(0, 1), big = Math.max(x, y), sm = Math.min(x, y); return add ? { type: 'num', q: `Work out \\(${x} + ${y}\\)`, a: FD.dec(x + y), why: `Line up the points: \\(${x.toFixed(2)} + ${y.toFixed(2)} = ${FD.dec(x + y)}\\).` } : { type: 'num', q: `Work out \\(${big} - ${sm}\\)`, a: FD.dec(big - sm), why: `Line up the points: \\(${big.toFixed(2)} - ${sm.toFixed(2)} = ${FD.dec(big - sm)}\\).` }; },
    () => { let p, q; do { p = FD.rnd(2, 99); q = FD.rnd(2, 19); } while (p % 10 === 0 || q % 10 === 0); const dp1 = FD.rnd(1, 2), dp2 = FD.rnd(0, 2) || 1, x = FD.dec(p / 10 ** dp1), y = FD.dec(q / 10 ** dp2), r = FD.dec((p * q) / 10 ** (dp1 + dp2)); return { type: 'num', q: `Work out \\(${x} \\times ${y}\\)`, a: r, why: `\\(${p} \\times ${q} = ${p * q}\\). The question has \\(${String(x).split('.')[1] ? String(x).split('.')[1].length : 0} + ${String(y).split('.')[1] ? String(y).split('.')[1].length : 0}\\) decimal places, so the answer is ${r}.` }; },
    () => { const d = FD.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.02, 0.05, 0.04]), q = FD.rnd(2, 40), n = FD.dec(d * q), k = d < 0.1 ? 100 : 10; return { type: 'num', q: `Work out \\(${n} \\div ${d}\\)`, a: q, why: `Multiply both by ${k}: \\(${FD.dec(n * k)} \\div ${FD.dec(d * k)} = ${q}\\).` }; },
  ],
});

FD.check({
  section: 'calc',
  items: [
    { type: 'num', q: 'Work out \\(4.7 + 12.85\\)', a: 17.55, why: '\\(4.70 + 12.85 = 17.55\\).' },
    { type: 'num', q: 'Work out \\(10 - 3.46\\)', a: 6.54, why: '\\(10.00 - 3.46 = 6.54\\).' },
    { type: 'num', q: 'Work out \\(0.6 \\times 0.07\\)', a: 0.042, why: '\\(6 \\times 7 = 42\\); 1 + 2 = 3 decimal places: 0.042.' },
    { type: 'num', q: 'Work out \\(3.6 \\div 0.04\\)', a: 90, why: 'Multiply both by 100: \\(360 \\div 4 = 90\\).' },
    { type: 'mcq', q: '\\(23 \\times 47 = 1081\\). What is \\(2.3 \\times 0.47\\)?', opts: ['1.081', '10.81', '0.1081', '108.1'], why: '1 + 2 = 3 decimal places: 1.081.' },
  ],
});
