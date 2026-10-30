// Venn diagram of prime factors: shared primes in the overlap.
// Returns { left, mid, right } lists of primes for a and b.
FD.primeVenn = (a, b) => {
  const A = FD.pfac(a), B = FD.pfac(b), ps = [...new Set([...Object.keys(A), ...Object.keys(B)])].map(Number).sort((x, y) => x - y);
  const left = [], mid = [], right = [];
  ps.forEach((p) => { const x = A[p] || 0, y = B[p] || 0, m = Math.min(x, y); for (let i = 0; i < m; i++) mid.push(p); for (let i = m; i < x; i++) left.push(p); for (let i = m; i < y; i++) right.push(p); });
  return { left, mid, right };
};
FD.vennDraw = (host) => {
  host.innerHTML = '<svg class="vn" viewBox="0 0 600 270" role="img"></svg>';
  const svg = host.querySelector('svg');
  const col = (list, cx, cls) => {
    const per = 4, cols = Math.ceil(list.length / per);
    return list.map((p, i) => { const c = Math.floor(i / per), r = i % per, rows = Math.min(per, list.length - c * per); return `<text class="vn-p ${cls}" x="${cx + (c - (cols - 1) / 2) * 34}" y="${142 + (r - (rows - 1) / 2) * 36}">${p}</text>`; }).join('');
  };
  return (a, b, show = 3, hi = '') => {
    const v = FD.primeVenn(a, b);
    svg.innerHTML = `
      <circle class="vn-c vn-a" cx="235" cy="137" r="118"/><circle class="vn-c vn-b" cx="365" cy="137" r="118"/>
      <path class="vn-mid ${hi === 'hcf' ? 'on' : ''}" d="M300 38.6A118 118 0 0 1 300 235.4A118 118 0 0 1 300 38.6Z"/>
      <text class="vn-lbl" x="120" y="24">${a}</text><text class="vn-lbl" x="480" y="24">${b}</text>
      ${show >= 1 ? col(v.mid, 300, hi ? 'hi' : '') : ''}${show >= 2 ? col(v.left, 168, hi === 'lcm' ? 'hi' : '') + col(v.right, 432, hi === 'lcm' ? 'hi' : '') : ''}`;
    svg.setAttribute('aria-label', `Venn diagram of the prime factors of ${a} and ${b}`);
    return v;
  };
};

FD.add({
  id: 'hcflcm',
  title: 'Finding the HCF and LCM',
  tab: 'HCF & LCM',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['HCF', 'Highest common factor: the biggest number that is a factor of both numbers.'],
    ['LCM', 'Lowest common multiple: the smallest number that is a multiple of both numbers.'],
    ['Common', 'Shared by both numbers.'],
  ],
  mount(el) {
    const a = FD.board(el, 'hl-s', '<div id="venn"></div>', `
      <label class="ctrl">First number <input type="range" id="ra" min="4" max="120" value="60"><output id="oa">60</output></label>
      <label class="ctrl">Second number <input type="range" id="rb" min="4" max="120" value="72"><output id="ob">72</output></label>`, () => sync());
    a.venn = FD.vennDraw(a.$('#venn'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value; a.$('#oa').textContent = x; a.$('#ob').textContent = y;
      const v = a.venn(x, y, 3, 'hcf');
      a.big(`\\text{HCF} = ${v.mid.length ? v.mid.join(' \\times ') + ' = ' : ''}${FD.gcd(x, y)} \\qquad \\text{LCM} = ${FD.lcm(x, y)}`);
      a.msg(v.mid.length ? 'HCF: multiply the primes in the overlap. LCM: multiply every prime in the diagram.' : 'No primes are shared, so the HCF is 1 and the LCM is the two numbers multiplied.', 'good');
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.venn(60, 72, 0);
    return a;
  },
  steps: [
    {
      title: 'Listing: the HCF',
      text: '<p>For small numbers, list the factors. The <b>highest common factor</b> is the biggest number in both lists.</p><p>HCF of 12 and 18:</p>',
      async on(a, ctx) {
        a.reset(); a.venn(12, 18, 0);
        await a.lines([['12: \\; 1, 2, 3, 4, \\mathbf{6}, 12', 'factors of 12'], ['18: \\; 1, 2, 3, \\mathbf{6}, 9, 18', 'factors of 18'], ['\\text{HCF} = 6', 'the biggest in both lists']], ctx);
      },
    },
    {
      title: 'Listing: the LCM',
      text: '<p>The <b>lowest common multiple</b> is the first number in both times tables.</p><p>LCM of 12 and 18:</p>',
      tip: 'The LCM is never smaller than the bigger number. The HCF is never bigger than the smaller number.',
      async on(a, ctx) {
        a.reset(); a.venn(12, 18, 0);
        await a.lines([['12: \\; 12, 24, \\mathbf{36}, 48, \\dots', 'multiples of 12'], ['18: \\; 18, \\mathbf{36}, 54, \\dots', 'multiples of 18'], ['\\text{LCM} = 36', 'the first in both lists']], ctx);
      },
    },
    {
      title: 'Big numbers: a Venn diagram',
      text: '<p>For 60 and 72, write each as a product of primes first:</p><p>\\(60 = 2 \\times 2 \\times 3 \\times 5\\) and \\(72 = 2 \\times 2 \\times 2 \\times 3 \\times 3\\).</p><p>Primes they <b>share</b> go in the overlap. The rest go in their own circle.</p>',
      async on(a, ctx) {
        a.reset(); a.venn(60, 72, 0);
        if (!(await ctx.sleep(1000))) return; a.venn(60, 72, 1); a.msg('Shared: 2, 2 and 3.');
        if (!(await ctx.sleep(1400))) return; a.venn(60, 72, 2); a.msg('Left over: 5 (from 60) and 2, 3 (from 72).');
      },
    },
    {
      title: 'Read off the HCF',
      text: '<p>The <b>HCF</b> is the product of the primes in the <b>overlap</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.venn(60, 72, 3, 'hcf');
        await a.lines([['\\text{HCF} = 2 \\times 2 \\times 3', 'the overlap'], ['= 12', '']], ctx);
      },
    },
    {
      title: 'Read off the LCM',
      text: '<p>The <b>LCM</b> is the product of <b>every</b> prime in the diagram (each one once).</p>',
      tip: 'Check: HCF × LCM = the two numbers multiplied. \\(12 \\times 360 = 60 \\times 72\\).',
      async on(a, ctx) {
        a.reset(); a.venn(60, 72, 3, 'lcm');
        await a.lines([['\\text{LCM} = 5 \\times 2 \\times 2 \\times 3 \\times 2 \\times 3', 'everything'], ['= 360', '']], ctx);
      },
    },
    {
      title: 'Try it: any two numbers',
      text: '<p>Choose two numbers. Their prime factors drop into the Venn diagram, and the HCF and LCM are worked out.</p>',
      tip: 'What happens when one number is a factor of the other, like 12 and 36?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'hcflcm',
  gens: [
    () => { let x, y; do { const g = FD.rnd(2, 12); x = g * FD.rnd(2, 9); y = g * FD.rnd(2, 9); } while (x === y || x > 100 || y > 100); const v = FD.primeVenn(x, y); return { type: 'num', q: `Find the highest common factor (HCF) of ${x} and ${y}.`, a: FD.gcd(x, y), why: `\\(${x} = ${FD.pftex(x)}\\), \\(${y} = ${FD.pftex(y)}\\). Shared primes: ${v.mid.join(' × ')}, so HCF = ${FD.gcd(x, y)}.` }; },
    () => { let x, y; do { x = FD.rnd(4, 30); y = FD.rnd(4, 30); } while (x === y || FD.lcm(x, y) > 200 || x % y === 0 || y % x === 0); return { type: 'num', q: `Find the lowest common multiple (LCM) of ${x} and ${y}.`, a: FD.lcm(x, y), why: `\\(${x} = ${FD.pftex(x)}\\), \\(${y} = ${FD.pftex(y)}\\). Multiply every prime in the Venn diagram once: LCM = ${FD.lcm(x, y)}.` }; },
    () => { const p = [[2, 3], [2, 5], [3, 5], [2, 7]][FD.rnd(0, 3)]; const a1 = FD.rnd(1, 4), b1 = FD.rnd(1, 3), a2 = FD.rnd(1, 4), b2 = FD.rnd(1, 3); const A = `${p[0]}^{${a1}} \\times ${p[1]}^{${b1}}`, B = `${p[0]}^{${a2}} \\times ${p[1]}^{${b2}}`; const h = p[0] ** Math.min(a1, a2) * p[1] ** Math.min(b1, b2), l = p[0] ** Math.max(a1, a2) * p[1] ** Math.max(b1, b2), wantH = FD.rnd(0, 1); return { type: 'num', q: `\\(A = ${A}\\) and \\(B = ${B}\\). Find the ${wantH ? 'HCF' : 'LCM'} of \\(A\\) and \\(B\\). Give your answer as an ordinary number.`, a: wantH ? h : l, why: wantH ? `HCF: the <b>lower</b> power of each prime: \\(${p[0]}^{${Math.min(a1, a2)}} \\times ${p[1]}^{${Math.min(b1, b2)}} = ${h}\\).` : `LCM: the <b>higher</b> power of each prime: \\(${p[0]}^{${Math.max(a1, a2)}} \\times ${p[1]}^{${Math.max(b1, b2)}} = ${l}\\).` }; },
  ],
});

FD.check({
  section: 'hcflcm',
  items: [
    { type: 'num', q: 'Find the HCF of 24 and 36.', a: 12, why: '\\(24 = 2^3 \\times 3\\), \\(36 = 2^2 \\times 3^2\\). Shared: \\(2^2 \\times 3 = 12\\).' },
    { type: 'num', q: 'Find the LCM of 8 and 12.', a: 24, why: 'Multiples of 12: 12, 24. 24 is also a multiple of 8.' },
    { type: 'num', q: '\\(P = 2^3 \\times 5\\) and \\(Q = 2 \\times 3 \\times 5^2\\). Find the LCM of \\(P\\) and \\(Q\\).', a: 600, why: 'Highest power of each prime: \\(2^3 \\times 3 \\times 5^2 = 8 \\times 3 \\times 25 = 600\\).' },
    { type: 'mcq', q: 'The HCF of two numbers is the product of…', opts: ['the primes in the overlap of the Venn diagram', 'every prime in the Venn diagram', 'the primes outside the overlap', 'the two numbers'], why: 'Only the shared primes divide into both numbers.' },
    { type: 'tf', q: 'The HCF of 7 and 9 is 1.', a: true, why: '7 and 9 share no prime factors, so their only common factor is 1.' },
  ],
});
