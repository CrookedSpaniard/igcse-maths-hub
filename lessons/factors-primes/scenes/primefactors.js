// Prime factors of n as { prime: power }, and as TeX in index form: 360 → 2^{3} \times 3^{2} \times 5.
FD.pfac = (n) => { const f = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } return f; };
FD.pftex = (n) => Object.entries(FD.pfac(n)).map(([p, k]) => (k > 1 ? `${p}^{${k}}` : p)).join(' \\times ');
FD.pflist = (n) => Object.entries(FD.pfac(n)).flatMap(([p, k]) => Array(k).fill(+p));

// A factor tree. Each number splits into the factor pair nearest its square root; primes are circled.
FD.ftree = (host) => {
  host.innerHTML = '<svg class="ft" viewBox="0 0 600 300" role="img"></svg>';
  const svg = host.querySelector('svg');
  const split = (n) => { for (let a = Math.floor(Math.sqrt(n)); a > 1; a--) if (n % a === 0) return [a, n / a]; return null; };
  const build = (n, d = 0, first) => { const s = first && d === 0 ? first : split(n); return { n, d, kids: s ? s.map((k) => build(k, d + 1)) : [] }; };
  return (n, show = 99, first) => {
    const t = build(n, 0, first);
    let leaves = 0, maxD = 0;
    const place = (nd) => { maxD = Math.max(maxD, nd.d); if (!nd.kids.length) nd.x = leaves++; else { nd.kids.forEach(place); nd.x = (nd.kids[0].x + nd.kids[1].x) / 2; } };
    place(t);
    const gap = Math.min(110, 520 / Math.max(1, leaves - 1)), x0 = 300 - (gap * (leaves - 1)) / 2, dy = 64, H = 56 + maxD * dy;
    svg.setAttribute('viewBox', `0 0 600 ${H}`);
    let lines = '', nodes = '';
    const draw = (nd) => {
      const X = x0 + nd.x * gap, Y = 28 + nd.d * dy;
      nd.kids.forEach((k) => { if (k.d <= show) { lines += `<line class="ft-e" x1="${X}" y1="${Y + 22}" x2="${x0 + k.x * gap}" y2="${Y + dy - 22}"/>`; draw(k); } });
      nodes += `<g class="ft-n ${nd.kids.length ? '' : 'prime'} ${nd.d === show ? 'new' : ''}"><circle cx="${X}" cy="${Y}" r="23"/><text x="${X}" y="${Y + 6}">${nd.n}</text></g>`;
    };
    draw(t);
    svg.innerHTML = lines + nodes;
    svg.setAttribute('aria-label', `Factor tree for ${n}: ${FD.pflist(n).join(' × ')}`);
    return maxD;
  };
};

FD.add({
  id: 'primefactors',
  title: 'Prime factor decomposition',
  tab: 'Prime factors',
  icon: 'number',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Prime factor', 'A factor that is also a prime number. The prime factors of 12 are 2 and 3.'],
    ['Product', 'The answer when you multiply. “A product of primes” means primes multiplied together.'],
    ['Factor tree', 'A diagram that splits a number into factor pairs until every branch ends in a prime.'],
    ['Index form', 'Repeated factors written as powers: \\(2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'pf-s', '<div id="tree"></div>', `
      <label class="ctrl">Number <input type="range" id="rn" min="4" max="400" value="360"><output id="on">360</output></label>`, () => sync());
    const tree = FD.ftree(a.$('#tree'));
    a.tree = tree;
    const sync = () => {
      const n = +a.$('#rn').value; a.$('#on').textContent = n;
      tree(n);
      if (FD.isPrime(n)) { a.big(`${n}`); a.msg(`${n} is prime, so the tree cannot split it.`, 'bad'); return; }
      a.big(`${n} = ${FD.pflist(n).join(' \\times ')} = ${FD.pftex(n)}`); a.msg('');
    };
    a.$('#rn').addEventListener('input', sync);
    tree(360);
    return a;
  },
  steps: [
    {
      title: 'Grow a factor tree',
      text: '<p>Write 360 as a <b>product of its prime factors</b>.</p><p>Split 360 into any factor pair, then keep splitting. When a branch reaches a <b>prime</b>, circle it: that branch stops.</p>',
      async on(a, ctx) {
        a.reset();
        const D = a.tree(360, 0);
        for (let s = 1; s <= D; s++) { if (!(await ctx.sleep(1200))) return; a.tree(360, s); }
      },
    },
    {
      title: 'Collect the primes',
      text: '<p>Multiply all the circled primes together. Put them in order, smallest first.</p><p>Repeated primes are written with <b>powers</b> (index form).</p>',
      tip: 'Check your answer: multiply the primes back together.',
      async on(a, ctx) {
        a.reset(); a.tree(360);
        await a.lines([['360 = 2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 5', 'product of primes'], ['360 = 2^3 \\times 3^2 \\times 5', 'index form'], ['8 \\times 9 \\times 5 = 360 \\; \\checkmark', 'check']], ctx);
      },
    },
    {
      title: 'Any first split works',
      text: '<p>Start 360 with \\(10 \\times 36\\) instead. The tree looks different, but the primes at the end are <b>exactly the same</b>.</p><p>Every whole number has only one set of prime factors.</p>',
      async on(a, ctx) {
        a.reset();
        const D = a.tree(360, 0, [10, 36]);
        for (let s = 1; s <= D; s++) { if (!(await ctx.sleep(1000))) return; a.tree(360, s, [10, 36]); }
        a.big('360 = 2^3 \\times 3^2 \\times 5');
      },
    },
    {
      title: 'Dividing by primes',
      text: '<p>Another method: keep <b>dividing by the smallest prime</b> that goes in exactly.</p><p>Here is 84.</p>',
      async on(a, ctx) {
        a.reset(); a.tree(84);
        await a.lines([['84 \\div 2 = 42', ''], ['42 \\div 2 = 21', '2 no longer works'], ['21 \\div 3 = 7', '7 is prime: stop'], ['84 = 2^2 \\times 3 \\times 7', '']], ctx, 1200);
      },
    },
    {
      title: 'Try it: any number',
      text: '<p>Move the slider to grow the factor tree of any number up to 400. The prime factors appear in index form.</p>',
      tip: 'Which numbers between 100 and 130 are prime?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'primefactors',
  gens: [
    () => { let a, b, c, n; do { a = FD.rnd(1, 4); b = FD.rnd(0, 3); c = FD.rnd(0, 2); n = 2 ** a * 3 ** b * 5 ** c; } while (n < 20 || n > 1000); return { type: 'num', q: `\\(${n} = 2^a \\times 3^b \\times 5^c\\). Find \\(a\\), \\(b\\) and \\(c\\).`, a: [a, b, c], fields: ['a =', 'b =', 'c ='], hint: 'If a prime is not there, its power is 0.', why: `\\(${n} = ${FD.pflist(n).join(' \\times ')} = ${FD.pftex(n)}\\).${b === 0 || c === 0 ? ' A prime that does not appear has power 0.' : ''}` }; },
    () => { let n; do { n = FD.rnd(24, 300); } while (FD.isPrime(n) || Object.keys(FD.pfac(n)).length < 2 || Math.max(...Object.keys(FD.pfac(n)).map(Number)) > 13); const f = FD.pfac(n), ps = Object.keys(f).map(Number); const w1 = ps.map((p) => p).join(' \\times '), w2 = FD.pftex(n * 2), w3 = FD.pflist(n).slice(1).join(' \\times '); return { type: 'mcq', q: `Which is ${n} written as a product of its prime factors?`, opts: [`\\(${FD.pftex(n)}\\)`, ...[...new Set([w1, w2, w3])].filter((w) => w !== FD.pftex(n)).slice(0, 3).map((w) => `\\(${w}\\)`)], why: `\\(${n} = ${FD.pflist(n).join(' \\times ')} = ${FD.pftex(n)}\\).` }; },
    () => { const ps = FD.shuffle([2, 2, 2, 3, 3, 5, 7]).slice(0, FD.rnd(3, 4)).sort((x, y) => x - y); const n = ps.reduce((x, y) => x * y, 1); return { type: 'num', q: `A number is \\(${FD.pftex(n)}\\). What is the number?`, a: n, why: `\\(${ps.join(' \\times ')} = ${n}\\).` }; },
  ],
});

FD.check({
  section: 'primefactors',
  items: [
    { type: 'mcq', q: 'Write 120 as a product of its prime factors.', opts: ['\\(2^3 \\times 3 \\times 5\\)', '\\(2 \\times 3 \\times 4 \\times 5\\)', '\\(2^2 \\times 3 \\times 10\\)', '\\(8 \\times 15\\)'], why: '\\(120 = 2 \\times 2 \\times 2 \\times 3 \\times 5\\). 4, 10, 8 and 15 are not prime.' },
    { type: 'num', q: '\\(2^4 \\times 3 = ?\\)', a: 48, why: '\\(2^4 = 16\\) and \\(16 \\times 3 = 48\\).' },
    { type: 'num', q: '\\(252 = 2^a \\times 3^b \\times 7\\). Find \\(a\\) and \\(b\\).', a: [2, 2], fields: ['a =', 'b ='], why: '\\(252 = 2 \\times 126 = 2 \\times 2 \\times 63 = 2 \\times 2 \\times 3 \\times 3 \\times 7\\).' },
    { type: 'tf', q: 'Two different factor trees for the same number can end with different primes.', a: false, why: 'Every number has exactly one prime factorisation, whatever the first split.' },
    { type: 'mcq', q: 'Which number is \\(2 \\times 3^2 \\times 5\\)?', opts: ['90', '60', '30', '180'], why: '\\(2 \\times 9 \\times 5 = 90\\).' },
  ],
});
