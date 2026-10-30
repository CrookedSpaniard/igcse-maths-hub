// The algebra for a recurring decimal n/d: lines of working that end in the fraction.
FD.recMethod = (n, d) => {
  const e = FD.decExp(n, d), p = e.pre.length, c = e.cyc.length, big = 10 ** (p + c), small = 10 ** p;
  const show = (k) => { const ds = (e.pre + e.cyc.repeat(8)).slice(0, k + 6); return `${e.int * 10 ** k + (k ? +ds.slice(0, k) : 0)}.${ds.slice(k)}\\dots`; };
  const top = FD.dec((n / d) * big - (n / d) * small), [sn, sd] = FD.simp(Math.round(top), big - small), x = FD.decTex(e);
  const L = [[`x = ${x} = ${show(0)}`, 'call it x']];
  if (p) L.push([`${small}x = ${show(p)}`, `× ${small}: the repeating part starts at the point`]);
  L.push([`${big}x = ${show(p + c)}`, `× ${big}: the same tail`]);
  L.push([`${big - small}x = ${Math.round(top)}`, `subtract: ${big}x − ${p ? small + 'x' : 'x'}, the tails cancel`]);
  L.push([`x = \\frac{${Math.round(top)}}{${big - small}}${sd !== big - small ? ` = \\frac{${sn}}{${sd}}` : ''}`, 'divide, then simplify']);
  return { e, p, c, big, small, L, frac: [sn, sd] };
};

FD.add({
  id: 'rec2frac',
  title: 'Recurring decimals to fractions',
  tab: 'To fractions',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Let x = …', 'Call the recurring decimal \\(x\\) so you can use algebra.'],
    ['Multiply by a power of 10', 'Use 10 if 1 digit repeats, 100 if 2 digits repeat, 1000 if 3 digits repeat.'],
    ['Subtract', 'Take the two equations away: the endless tails cancel exactly.'],
  ],
  mount(el) {
    const list = [[7, 9], [3, 11], [1, 6], [5, 37], [7, 12], [8, 33], [2, 7], [13, 45]];
    const a = FD.board(el, 'r2-s', '<div id="tp"></div>', `
      <div class="bd-row"><label>Recurring decimal <select id="pick">${list.map(([n, d], i) => `<option value="${i}">${(FD.decExp(n, d).int + '.' + (FD.decExp(n, d).pre + FD.decExp(n, d).cyc.repeat(4)).slice(0, 7))}…</option>`).join('')}</select></label></div>`, () => sync());
    a.tp = FD.tape(a.$('#tp'));
    // Shows x and 10^k x lined up at the decimal point.
    a.pair = (n, d, gone) => {
      const m = FD.recMethod(n, d), w = String(m.big).length + 1;
      a.tp.show([a.tp.row(`${m.big}x =`, m.e, m.p + m.c, { w, gone }), ...(m.p ? [a.tp.row(`${m.small}x =`, m.e, m.p, { w, gone })] : [a.tp.row('x =', m.e, 0, { w, gone })])]);
      return m;
    };
    const sync = () => {
      const [n, d] = list[+a.$('#pick').value], m = a.pair(n, d);
      a.work(m.L); a.upto(m.L.length - 1);
      a.msg(`${m.c} digit${m.c > 1 ? 's' : ''} repeat${m.c > 1 ? '' : 's'}, so use \\(${m.big}x\\)${m.p ? ` and \\(${m.small}x\\)` : ' and \\(x\\)'}. Check: \\(${m.frac[0]} \\div ${m.frac[1]} = ${FD.decTex(m.e)}\\).`);
    };
    a.$('#pick').addEventListener('input', sync);
    a.pair(7, 9);
    return a;
  },
  steps: [
    {
      title: 'One repeating digit',
      text: '<p>Write \\(0.\\dot{7}\\) as a fraction.</p><p>Let \\(x = 0.777\\dots\\) Then \\(10x = 7.777\\dots\\) has <b>the same tail</b>. Subtract, and the tails cancel.</p>',
      async on(a, ctx) {
        a.reset(); a.pair(7, 9);
        if (!(await a.lines(FD.recMethod(7, 9).L, ctx, 1300))) return;
        a.pair(7, 9, true);
      },
    },
    {
      title: 'Two repeating digits',
      text: '<p>Write \\(0.\\dot{2}\\dot{7}\\) as a fraction.</p><p>Two digits repeat, so multiply by <b>100</b> to line the tails up.</p>',
      tip: 'Count the digits in the block: that is the number of zeros in the multiplier.',
      async on(a, ctx) {
        a.reset(); a.pair(3, 11);
        if (!(await a.lines(FD.recMethod(3, 11).L, ctx, 1300))) return;
        a.pair(3, 11, true);
      },
    },
    {
      title: 'A start before the repeat',
      text: '<p>Write \\(0.1\\dot{6}\\) as a fraction.</p><p>The 1 does not repeat. Use \\(10x\\) (repeat starts at the point) and \\(100x\\) (one block later), then subtract.</p>',
      async on(a, ctx) {
        a.reset(); a.pair(1, 6);
        if (!(await a.lines(FD.recMethod(1, 6).L, ctx, 1300))) return;
        a.pair(1, 6, true);
      },
    },
    {
      title: '“Show that” questions',
      text: '<p>An exam may ask: <i>Show that \\(0.\\dot{4}\\dot{5} = \\tfrac{5}{11}\\)</i>.</p><p>Write every line of the method. Writing \\(5 \\div 11\\) on a calculator is <b>not</b> a proof.</p>',
      tip: 'Your last line must show the fraction you were given.',
      async on(a, ctx) {
        a.reset(); a.pair(5, 11);
        await a.lines([['x = 0.454545\\dots', ''], ['100x = 45.454545\\dots', ''], ['99x = 45', '100x − x'], ['x = \\frac{45}{99} = \\frac{5}{11}', 'divide top and bottom by 9']], ctx, 1300);
      },
    },
    {
      title: 'Try it: any recurring decimal',
      text: '<p>Choose a recurring decimal. The two lines that cancel are lined up, and the full method is written out.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'rec2frac',
  gens: [
    () => { const k = FD.rnd(1, 8), [n, d] = FD.simp(k, 9); return { type: 'num', q: `Write \\(0.\\dot{${k}}\\) as a fraction in its simplest form.`, a: k / 9, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 4/9.', why: `\\(x = 0.${String(k).repeat(3)}\\dots\\), \\(10x = ${k}.${String(k).repeat(3)}\\dots\\). Subtract: \\(9x = ${k}\\), so \\(x = \\tfrac{${k}}{9}${d !== 9 ? ` = \\tfrac{${n}}{${d}}` : ''}\\).` }; },
    () => { let ab; do { ab = FD.rnd(1, 98); } while (ab % 11 === 0); const s = String(ab).padStart(2, '0'), [n, d] = FD.simp(ab, 99); return { type: 'num', q: `Write \\(0.\\dot{${s[0]}}\\dot{${s[1]}}\\) as a fraction in its simplest form.`, a: ab / 99, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 4/11.', why: `\\(x = 0.${s.repeat(3)}\\dots\\), \\(100x = ${ab}.${s.repeat(3)}\\dots\\). Subtract: \\(99x = ${ab}\\), so \\(x = \\tfrac{${ab}}{99}${d !== 99 ? ` = \\tfrac{${n}}{${d}}` : ''}\\).` }; },
    () => { const [n, d] = FD.pick([[1, 6], [5, 6], [1, 12], [7, 12], [2, 15], [7, 15], [11, 30], [7, 18], [13, 90], [41, 90], [1, 45], [17, 45]]), m = FD.recMethod(n, d); return { type: 'num', q: `Write \\(${FD.decTex(m.e)}\\) as a fraction in its simplest form.`, a: n / d, form: 'simplest', show: `\\(\\tfrac{${m.frac[0]}}{${m.frac[1]}}\\)`, hint: 'Type it like 7/12.', why: m.L.map(([t]) => `\\(${t}\\)`).join('<br>') }; },
  ],
});

FD.check({
  section: 'rec2frac',
  items: [
    { type: 'num', q: 'Write \\(0.\\dot{5}\\) as a fraction.', a: 5 / 9, form: 'simplest', show: '\\(\\tfrac{5}{9}\\)', hint: 'Type it like 4/9.', why: '\\(10x - x = 5\\), so \\(9x = 5\\) and \\(x = \\tfrac59\\).' },
    { type: 'num', q: 'Write \\(0.\\dot{3}\\dot{6}\\) as a fraction in its simplest form.', a: 4 / 11, form: 'simplest', show: '\\(\\tfrac{4}{11}\\)', hint: 'Type it like 4/9.', why: '\\(99x = 36\\), \\(x = \\tfrac{36}{99} = \\tfrac{4}{11}\\).' },
    { type: 'mcq', q: 'To write \\(0.\\dot{1}2\\dot{3}\\) as a fraction, which do you subtract?', opts: ['\\(1000x - x\\)', '\\(100x - x\\)', '\\(10x - x\\)', '\\(1000x - 10x\\)'], why: 'Three digits repeat, so \\(1000x\\) has the same tail as \\(x\\).' },
    { type: 'num', q: 'Write \\(0.2\\dot{7}\\) as a fraction in its simplest form.', a: 5 / 18, form: 'simplest', show: '\\(\\tfrac{5}{18}\\)', hint: 'Type it like 4/9.', why: '\\(100x = 27.77\\dots\\), \\(10x = 2.77\\dots\\), so \\(90x = 25\\) and \\(x = \\tfrac{25}{90} = \\tfrac{5}{18}\\).' },
  ],
});
