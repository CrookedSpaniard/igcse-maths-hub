// Digit tape: the decimal of n/d written out to about 14 places, with each repeat of the block shaded.
FD.tape = (host) => {
  host.innerHTML = '<div class="tp"></div>';
  const box = host.querySelector('.tp');
  // row(label, e, shift): e = FD.decExp result; shift k shows 10^k × the number. Returns the row HTML.
  const row = (label, e, k = 0, opts = {}) => {
    const n = 14 + k, digits = (e.pre + e.cyc.repeat(40)).slice(0, n).padEnd(n, '0');
    const intPart = String(e.int * 10 ** k + (k ? +digits.slice(0, k) : 0)), dec = digits.slice(k, k + 13);
    const cls = (i) => { const p = i + k - e.pre.length; if (!e.cyc || p < 0) return ''; return Math.floor(p / e.cyc.length) % 2 ? 'c2' : 'cy'; };
    return `<div class="tp-row"><span class="lb">${label}</span><span style="min-width:${opts.w || 3}ch;text-align:right">${intPart}</span>.${[...dec].map((d, i) => `<i class="${opts.gone ? 'gone' : cls(i)}">${d}</i>`).join('')}${e.cyc ? '…' : ''}</div>`;
  };
  return { show: (rows) => { box.innerHTML = rows.join(''); }, row };
};

FD.add({
  id: 'recurring',
  title: 'Terminating and recurring decimals',
  tab: 'Recurring',
  icon: 'frac',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Recurring decimal', 'A decimal where a digit or a block of digits repeats for ever, like 0.272727…'],
    ['Dot notation', 'Dots over the first and last digits of the repeating block: \\(0.\\dot{2}\\dot{7} = 0.272727\\dots\\)'],
    ['Exact', 'A recurring decimal is still an exact number: it is exactly equal to a fraction.'],
  ],
  mount(el) {
    const a = FD.board(el, 'rc-s', '<div id="tp"></div>', `
      <label class="ctrl">Numerator <input type="range" id="rn" min="1" max="19" value="5"><output id="on">5</output></label>
      <label class="ctrl">Denominator <input type="range" id="rd" min="2" max="20" value="12"><output id="od">12</output></label>`, () => sync());
    a.tp = FD.tape(a.$('#tp'));
    a.show = (n, d) => { const e = FD.decExp(n, d); a.tp.show([a.tp.row(`${n}/${d} =`, e)]); return e; };
    const sync = () => {
      const d = +a.$('#rd').value; a.$('#rn').max = d - 1;
      const n = Math.min(+a.$('#rn').value, d - 1); a.$('#on').textContent = n; a.$('#od').textContent = d;
      const e = a.show(n, d), [, sd] = FD.simp(n, d);
      a.big(`\\frac{${n}}{${d}} = ${FD.decTex(e)}`);
      const pf = Object.keys(FD.pfacD(sd)).join(', ');
      a.msg(e.cyc ? `Recurring: the block of ${e.cyc.length} digit${e.cyc.length > 1 ? 's' : ''} repeats. In simplest form the denominator ${sd} has the prime factor${pf.includes(',') ? 's' : ''} ${pf}, not just 2 and 5.` : `Terminating. ${sd === 1 ? '' : `In simplest form the denominator ${sd} has only the prime factors 2 and 5.`}`, e.cyc ? 'bad' : 'good');
    };
    ['#rn', '#rd'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.show(1, 3);
    return a;
  },
  steps: [
    {
      title: 'A decimal that never ends',
      text: '<p>\\(1 \\div 3\\): every step leaves a <b>remainder of 1</b>, so the next digit is always 3. It never stops.</p><p>\\(\\tfrac13 = 0.333\\dots\\) is written \\(0.\\dot{3}\\).</p>',
      async on(a, ctx) {
        a.reset(); a.show(1, 3);
        await a.lines([['10 \\div 3 = 3 \\text{ r } 1', ''], ['10 \\div 3 = 3 \\text{ r } 1', 'the same remainder again…'], ['\\frac{1}{3} = 0.\\dot{3}', 'so the 3 repeats for ever']], ctx, 1300);
      },
    },
    {
      title: 'Blocks of digits',
      text: '<p>Sometimes a <b>block</b> of digits repeats. Put a dot over the <b>first and last</b> digit of the block.</p>',
      tip: 'The block for \\(\\tfrac17\\) has 6 digits: the dots go over the 1 and the 7.',
      async on(a, ctx) {
        a.reset();
        a.show(2, 11); a.big('\\frac{2}{11} = 0.181818\\dots = 0.\\dot{1}\\dot{8}');
        if (!(await ctx.sleep(2200))) return;
        a.show(1, 7); a.big('\\frac{1}{7} = 0.142857142857\\dots = 0.\\dot{1}4285\\dot{7}');
      },
    },
    {
      title: 'Repeating after a start',
      text: '<p>The repeating part does not always start straight after the point.</p><p>\\(\\tfrac56 = 0.8333\\dots = 0.8\\dot{3}\\): only the 3 repeats.</p>',
      async on(a, ctx) {
        a.reset(); a.show(5, 6); a.big('\\frac{5}{6} = 0.8\\dot{3}');
        if (!(await ctx.sleep(2000))) return;
        a.show(7, 12); a.big('\\frac{7}{12} = 0.58\\dot{3}');
      },
    },
    {
      title: 'Which fractions terminate?',
      text: '<p>Write the fraction in its <b>simplest form</b>. If the denominator has <b>only 2s and 5s</b> as prime factors, the decimal terminates. Any other prime factor makes it recur.</p>',
      tip: '10 = 2 × 5, so only 2s and 5s can be turned into 10, 100, 1000…',
      async on(a, ctx) {
        a.reset(); a.show(3, 40);
        await a.lines([['\\frac{3}{40}: \\; 40 = 2^3 \\times 5', 'only 2s and 5s → terminates (0.075)'], ['\\frac{5}{12}: \\; 12 = 2^2 \\times 3', 'a 3 → recurs (0.41\\dot{6})'], ['\\frac{9}{15} = \\frac{3}{5}', 'simplify first → terminates (0.6)']], ctx, 1600);
      },
    },
    {
      title: 'Try it: watch the digits repeat',
      text: '<p>Choose a fraction. Its decimal is written out, with each repeat of the block shaded.</p>',
      tip: 'Try every numerator with denominator 7. What do you notice about the digits?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});
// Prime factors of n as { prime: power } (also used for denominators).
FD.pfacD = (n) => { const f = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } return f; };

FD.practice({
  section: 'recurring',
  gens: [
    () => { const pairs = [[1, 3], [2, 3], [1, 9], [4, 9], [7, 9], [1, 6], [5, 6], [2, 11], [5, 11], [1, 12], [5, 12], [7, 15], [1, 15]], [n, d] = FD.pick(pairs), e = FD.decExp(n, d), right = FD.decTex(e); const wrong = [`0.\\dot{${e.pre + e.cyc}}`, `${e.int}.\\dot{${(e.pre + e.cyc)[0]}}${e.cyc.length > 1 || e.pre ? `\\dot{${(e.pre + e.cyc).slice(-1)}}` : '0'}`, `${e.int}.${e.pre}${e.cyc}`].filter((w) => w !== right); return { type: 'mcq', q: `Write \\(\\dfrac{${n}}{${d}}\\) as a recurring decimal.`, opts: [...new Set([`\\(${right}\\)`, ...wrong.map((w) => `\\(${w}\\)`)])], why: `\\(${n} \\div ${d} = ${e.int}.${(e.pre + e.cyc.repeat(4)).slice(0, 8)}\\dots = ${right}\\).` }; },
    () => { const term = FD.pick([[3, 8], [7, 20], [9, 40], [3, 16], [11, 25], [7, 50], [9, 15], [21, 28]]), rec = FD.shuffle([[1, 6], [4, 7], [5, 9], [7, 12], [2, 15], [3, 11], [5, 18]]).slice(0, 3), [sn, sd] = FD.simp(...term); return { type: 'mcq', q: 'Which fraction gives a <b>terminating</b> decimal?', opts: [`\\(\\tfrac{${term[0]}}{${term[1]}}\\)`, ...rec.map(([n, d]) => `\\(\\tfrac{${n}}{${d}}\\)`)], why: `${sn !== term[0] ? `\\(\\tfrac{${term[0]}}{${term[1]}} = \\tfrac{${sn}}{${sd}}\\). ` : ''}The denominator ${sd} has only 2s and 5s as prime factors. The others have a 3, 7 or 11 in the denominator.` }; },
    () => { const [n, d] = FD.pick([[1, 7], [2, 7], [3, 7], [1, 13], [1, 11], [4, 11], [1, 27], [1, 37], [5, 27]]), e = FD.decExp(n, d), k = FD.rnd(5, 12); return { type: 'num', q: `\\(\\dfrac{${n}}{${d}} = ${FD.decTex(e)}\\). What is the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} digit after the decimal point?`, a: +e.cyc[(k - 1) % e.cyc.length], why: `The block ${e.cyc} has ${e.cyc.length} digits. \\(${k} = ${Math.floor((k - 1) / e.cyc.length)} \\times ${e.cyc.length} + ${((k - 1) % e.cyc.length) + 1}\\), so it is digit ${((k - 1) % e.cyc.length) + 1} of the block: ${e.cyc[(k - 1) % e.cyc.length]}.` }; },
  ],
});

FD.check({
  section: 'recurring',
  items: [
    { type: 'mcq', q: 'How do you write 0.454545… with dot notation?', opts: ['\\(0.\\dot{4}\\dot{5}\\)', '\\(0.\\dot{4}5\\)', '\\(0.4\\dot{5}\\)', '\\(0.\\dot{4}\\dot{5}\\dot{4}\\)'], why: 'The block 45 repeats: dots over the 4 and the 5.' },
    { type: 'mcq', q: 'What is \\(0.1\\dot{6}\\) written out?', opts: ['0.16666…', '0.161616…', '0.1666', '0.116116…'], why: 'Only the 6 repeats.' },
    { type: 'tf', q: '\\(\\tfrac{7}{25}\\) gives a terminating decimal.', a: true, why: '\\(25 = 5^2\\): only 5s, so it terminates: 0.28.' },
    { type: 'tf', q: '\\(\\tfrac{1}{6}\\) gives a terminating decimal.', a: false, why: '\\(6 = 2 \\times 3\\). The 3 makes it recur: \\(0.1\\dot{6}\\).' },
    { type: 'sort', q: 'Terminating or recurring?', bins: ['Terminating', 'Recurring'], rows: [['\\(\\tfrac{3}{8}\\)', 0], ['\\(\\tfrac{2}{9}\\)', 1], ['\\(\\tfrac{6}{24}\\)', 0], ['\\(\\tfrac{5}{14}\\)', 1]], why: '\\(\\tfrac{6}{24} = \\tfrac14\\) terminates. 9 and 14 contain the primes 3 and 7.' },
  ],
});
