// Decimal expansion of n/d by long division: { int, pre, cyc } (cyc = the repeating block, '' if it ends).
FD.decExp = (n, d) => {
  const int = Math.floor(n / d), seen = {};
  let r = n % d, s = '';
  while (r && !(r in seen) && s.length < 60) { seen[r] = s.length; r *= 10; s += Math.floor(r / d); r %= d; }
  return r ? { int, pre: s.slice(0, seen[r]), cyc: s.slice(seen[r]) } : { int, pre: s, cyc: '' };
};
// TeX with dot notation: 1/7 → 0.\dot{1}4285\dot{7}
FD.decTex = (e) => {
  const c = e.cyc;
  if (!c) return e.pre ? `${e.int}.${e.pre}` : String(e.int);
  return `${e.int}.${e.pre}${c.length === 1 ? `\\dot{${c}}` : `\\dot{${c[0]}}${c.slice(1, -1)}\\dot{${c[c.length - 1]}}`}`;
};

// Number line from 0 to 1 with one marked point: fraction above, decimal below.
FD.zline = (host) => {
  host.innerHTML = '<svg class="zl" viewBox="0 0 600 130" role="img"></svg>';
  const svg = host.querySelector('svg'), X = (v) => 40 + v * 520;
  return (v, top, bottom) => {
    let s = '<line class="zl-ax" x1="40" y1="70" x2="560" y2="70"/>';
    for (let i = 0; i <= 10; i++) s += `<line class="zl-ax" x1="${X(i / 10)}" y1="${i % 5 ? 64 : 58}" x2="${X(i / 10)}" y2="${i % 5 ? 76 : 82}"/>${i % 5 === 0 ? `<text class="zl-t" x="${X(i / 10)}" y="${i ? 122 : 122}">${i / 10}</text>` : ''}`;
    if (v != null) s += `<path class="zl-m" d="M${X(v)} 70l-8 -14h16z"/><circle class="zl-m" cx="${X(v)}" cy="70" r="6"/><text class="zl-up" x="${FD.clamp(X(v), 40, 560)}" y="36">${top || ''}</text><text class="zl-dn" x="${FD.clamp(X(v), 40, 560)}" y="102">${bottom || ''}</text>`;
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Number line from 0 to 1${v != null ? ` with ${top} = ${bottom} marked` : ''}`);
  };
};

FD.add({
  id: 'convert',
  title: 'Converting fractions and decimals',
  tab: 'Converting',
  icon: 'frac',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Decimal → fraction', 'Use place value: 0.35 is 35 hundredths, \\(\\tfrac{35}{100} = \\tfrac{7}{20}\\).'],
    ['Fraction → decimal', 'Divide the numerator by the denominator: \\(\\tfrac{3}{8} = 3 \\div 8 = 0.375\\).'],
    ['Terminating decimal', 'A decimal that ends, like 0.375.'],
  ],
  mount(el) {
    const a = FD.board(el, 'cv-s', '<div id="zl"></div>', `
      <label class="ctrl">Numerator <input type="range" id="rn" min="1" max="19" value="3"><output id="on">3</output></label>
      <label class="ctrl">Denominator <input type="range" id="rd" min="2" max="20" value="8"><output id="od">8</output></label>`, () => sync());
    a.zl = FD.zline(a.$('#zl'));
    const sync = () => {
      const d = +a.$('#rd').value; a.$('#rn').max = d - 1;
      const n = Math.min(+a.$('#rn').value, d - 1); a.$('#on').textContent = n; a.$('#od').textContent = d;
      const e = FD.decExp(n, d), txt = e.cyc ? (n / d).toFixed(4) + '…' : String(FD.dec(n / d));
      a.zl(n / d, `${n}/${d}`, txt);
      a.big(`\\frac{${n}}{${d}} = ${n} \\div ${d} = ${FD.decTex(e)}`);
      a.msg(e.cyc ? 'This decimal never ends: it <b>recurs</b>. See the next section.' : 'This decimal <b>terminates</b> (ends).', e.cyc ? 'bad' : 'good');
    };
    ['#rn', '#rd'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.zl(null);
    return a;
  },
  steps: [
    {
      title: 'Decimal → fraction',
      text: '<p>Read the decimal using <b>place value</b>, write it as a fraction, then simplify.</p><p>0.75 is 75 hundredths. 0.125 is 125 thousandths.</p>',
      async on(a, ctx) {
        a.reset(); a.zl(0.75, '3/4', '0.75');
        await a.lines([['0.75 = \\frac{75}{100} = \\frac{3}{4}', 'divide by 25'], ['0.125 = \\frac{125}{1000} = \\frac{1}{8}', 'divide by 125'], ['2.6 = 2\\tfrac{6}{10} = 2\\tfrac{3}{5}', 'the whole number stays']], ctx, 1500);
      },
    },
    {
      title: 'Fraction → decimal: make 10 or 100',
      text: '<p>If you can make the denominator 10, 100 or 1000, read off the decimal.</p>',
      tip: 'Learn these: \\(\\tfrac12 = 0.5\\), \\(\\tfrac14 = 0.25\\), \\(\\tfrac34 = 0.75\\), \\(\\tfrac15 = 0.2\\), \\(\\tfrac18 = 0.125\\), \\(\\tfrac{1}{10} = 0.1\\).',
      async on(a, ctx) {
        a.reset(); a.zl(0.6, '3/5', '0.6');
        if (!(await a.lines([['\\frac{3}{5} = \\frac{6}{10} = 0.6', '× 2'], ['\\frac{7}{20} = \\frac{35}{100} = 0.35', '× 5']], ctx, 1500))) return;
        a.zl(0.35, '7/20', '0.35');
      },
    },
    {
      title: 'Fraction → decimal: divide',
      text: '<p>A fraction is a division: \\(\\tfrac{3}{8} = 3 \\div 8\\). Use short division, adding zeros after the point.</p>',
      async on(a, ctx) {
        a.reset(); a.zl(0.375, '3/8', '0.375');
        await a.lines([['3 \\div 8 = 0 \\text{ r } 3', 'write 3.000'], ['30 \\div 8 = 3 \\text{ r } 6', 'first digit after the point'], ['60 \\div 8 = 7 \\text{ r } 4', ''], ['40 \\div 8 = 5 \\text{ r } 0', 'remainder 0: stop'], ['\\frac{3}{8} = 0.375', '']], ctx, 1200);
      },
    },
    {
      title: 'Ordering fractions and decimals',
      text: '<p>Order \\(\\tfrac{2}{5}\\), 0.42 and \\(\\tfrac{3}{8}\\). Change them <b>all to decimals</b> first.</p>',
      async on(a, ctx) {
        a.reset();
        await a.lines([['\\frac{2}{5} = 0.4, \\quad 0.42, \\quad \\frac{3}{8} = 0.375', 'all decimals'], ['0.375 < 0.400 < 0.420', 'compare'], ['\\frac{3}{8}, \\; \\frac{2}{5}, \\; 0.42', 'smallest first']], ctx, 1500);
        a.zl(0.375, '3/8', '0.375');
      },
    },
    {
      title: 'Try it: fractions on the line',
      text: '<p>Choose a fraction. It is placed on the number line from 0 to 1 and changed into a decimal.</p>',
      tip: 'Which denominators give decimals that end? Try 8, 16, 20, then 3, 6, 7.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'convert',
  gens: [
    () => { const d = FD.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]); let n; do { n = FD.rnd(1, d - 1); } while (FD.gcd(n, d) !== 1); const v = FD.dec(n / d), k = [10, 100, 1000].find((t) => t % d === 0); return { type: 'num', q: `Write \\(\\dfrac{${n}}{${d}}\\) as a decimal.`, a: v, why: `\\(\\dfrac{${n}}{${d}} = \\dfrac{${(n * k) / d}}{${k}} = ${v}\\) (multiply top and bottom by ${k / d}).` }; },
    () => { const d = FD.pick([4, 5, 8, 20, 25, 50, 40]); let n; do { n = FD.rnd(1, d - 1); } while (FD.gcd(n, d) !== 1); const v = FD.dec(n / d), dp = String(v).split('.')[1].length, k = 10 ** dp; return { type: 'num', q: `Write ${v} as a fraction in its simplest form.`, a: n / d, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 3/8.', why: `\\(${v} = \\dfrac{${FD.dec(v * k)}}{${k}} = \\dfrac{${n}}{${d}}\\) (divide by ${FD.gcd(FD.dec(v * k), k)}).` }; },
    () => { const fr = FD.shuffle([[1, 4], [2, 5], [3, 8], [3, 5], [7, 20], [9, 25], [1, 8], [3, 4]]).slice(0, 2), dec = FD.dec(FD.rnd(11, 89) / 100); const items = [...fr.map(([n, d]) => ({ t: `\\tfrac{${n}}{${d}}`, v: n / d })), { t: String(dec), v: dec }]; if (new Set(items.map((i) => i.v)).size < 3) items[2].v += 0.001; const up = [...items].sort((x, y) => x.v - y.v); const ord = (l) => `\\(${l.map((i) => i.t).join(',\\ ')}\\)`; return { type: 'mcq', q: `Which list is in order, smallest first?`, opts: [...new Set([ord(up), ord([...up].reverse()), ord([up[1], up[0], up[2]]), ord([up[0], up[2], up[1]])])], why: `As decimals: ${up.map((i) => `${i.t.startsWith('\\') ? `\\(${i.t}\\) = ` : ''}${FD.dec(i.v)}`).join(', ')}.` }; },
  ],
});

FD.check({
  section: 'convert',
  items: [
    { type: 'num', q: 'Write \\(\\tfrac{9}{20}\\) as a decimal.', a: 0.45, why: '\\(\\tfrac{9}{20} = \\tfrac{45}{100} = 0.45\\).' },
    { type: 'num', q: 'Write 0.64 as a fraction in its simplest form.', a: 16 / 25, form: 'simplest', show: '\\(\\tfrac{16}{25}\\)', hint: 'Type it like 3/8.', why: '\\(\\tfrac{64}{100} = \\tfrac{16}{25}\\).' },
    { type: 'num', q: 'Write \\(\\tfrac{5}{8}\\) as a decimal.', a: 0.625, why: '\\(5 \\div 8 = 0.625\\).' },
    { type: 'mcq', q: 'Which is the largest?', opts: ['\\(\\tfrac{3}{5}\\)', '0.58', '\\(\\tfrac{4}{7}\\)', '0.507'], why: '\\(\\tfrac35 = 0.6\\), \\(\\tfrac47 \\approx 0.571\\).' },
  ],
});
