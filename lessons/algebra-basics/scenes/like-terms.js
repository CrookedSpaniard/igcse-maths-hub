// Like terms as coloured chips: [coefficient, letters]. Chips with the same letters share a colour.
const LT_LET = ['x', 'y', 'x^2', 'xy'];
const ltTerm = (c, l, first) => `${c < 0 ? '-' : first ? '' : '+'}${Math.abs(c) === 1 && l ? '' : Math.abs(c)}${l}`;
const ltExpr = (list) => { const s = list.filter(([c]) => c).map(([c, l], i) => ltTerm(c, l, i === 0)).join(' '); return s || '0'; };
const ltSimp = (list) => LT_LET.map((l) => [list.filter((t) => t[1] === l).reduce((s, t) => s + t[0], 0), l]).filter(([c, l]) => c && list.some((t) => t[1] === l));
const ltRand = () => {
  const lets = FD.shuffle(LT_LET.slice()).slice(0, FD.pick([2, 2, 3]));
  let list;
  do { list = FD.shuffle(lets.flatMap((l) => Array.from({ length: FD.rnd(1, 2) }, () => [FD.rndNZ(-6, 9), l]))); } while (list.length < 4 || ltSimp(list).length < lets.length);
  return list;
};

FD.add({
  id: 'like-terms',
  title: 'Collecting like terms',
  tab: 'Like terms',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Like terms', 'Terms with exactly the same letters and powers, like \\(3x\\) and \\(-5x\\), or \\(2ab\\) and \\(ab\\).'],
    ['Simplify', 'Write an expression with as few terms as possible by collecting like terms.'],
    ['Coefficient', 'The number in front of the letters in a term. In \\(-4y\\) the coefficient is \\(-4\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'lt-s',
      vis: '<div class="lt-chips" data-k="chips"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">New expression ↻</button><button class="btn" data-k="grp">Group like terms</button><button class="btn primary" data-k="simp">Simplify</button></div>',
    });
    const chips = a.$('[data-k="chips"]');
    let list = [];
    a.chips = (l, grouped) => {
      list = l;
      const show = grouped ? LT_LET.flatMap((k) => l.filter((t) => t[1] === k)) : l;
      chips.innerHTML = show.map(([c, k], i) => `<span class="lt-c k${LT_LET.indexOf(k)}">${FD.tex(ltTerm(c, k, i === 0))}</span>`).join('');
      a.big(ltExpr(show));
    };
    a.simp = () => { const was = ltExpr(list), s = ltSimp(list); a.chips(s); a.msg(`\\(${was} = ${ltExpr(s)}\\)`); };
    a.$('[data-k="new"]').addEventListener('click', () => { a.chips(ltRand()); a.msg(''); });
    a.$('[data-k="grp"]').addEventListener('click', () => a.chips(list, true));
    a.$('[data-k="simp"]').addEventListener('click', () => a.simp());
    a.onTry = () => a.chips(ltRand());
    a.chips([[3, 'x'], [2, 'y'], [4, 'x'], [-1, 'y']]);
    return a;
  },
  steps: [
    {
      title: 'Spot the like terms',
      text: '<p><b>Like terms</b> have exactly the same letters and powers. Here they share a colour.</p><p>\\(3x\\) and \\(4x\\) are like terms. \\(2y\\) and \\(-y\\) are like terms.</p>',
      async on(a, ctx) { a.tryMode(false); a.chips([[3, 'x'], [2, 'y'], [4, 'x'], [-1, 'y']]); if (!(await ctx.sleep(1500))) return; a.chips([[3, 'x'], [2, 'y'], [4, 'x'], [-1, 'y']], true); },
    },
    {
      title: 'Collect them',
      text: '<p>Add the coefficients of like terms. Keep the sign in front of each term with it.</p><p>\\(3x + 4x = 7x\\) and \\(2y - y = y\\).</p>',
      tip: '\\(x\\) and \\(x^2\\) are <b>not</b> like terms: the powers are different.',
      async on(a, ctx) { a.tryMode(false); a.chips([[3, 'x'], [2, 'y'], [4, 'x'], [-1, 'y']], true); if (!(await ctx.sleep(1400))) return; a.simp(); },
    },
    {
      title: 'Watch the signs',
      text: '<p>\\(5a^2 - 3a + 2a^2 + 7a\\): the \\(a^2\\) terms and the \\(a\\) terms are collected separately.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.chips([]); a.big('');
        a.work([['5a^2 - 3a + 2a^2 + 7a', ''], ['= 5a^2 + 2a^2 - 3a + 7a', 'move like terms together, signs too'], ['= 7a^2 + 4a', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Multiplying and dividing terms',
      text: '<p>To multiply terms, multiply the numbers, then the letters. To divide, write it as a fraction and cancel.</p>',
      tip: 'For multiplying you do not need like terms: \\(3a \\times 4b = 12ab\\).',
      async on(a, ctx) {
        a.tryMode(false); a.chips([]); a.big('');
        a.work([['3a \\times 4b = 12ab', '3 × 4 = 12'], ['2x \\times 5x = 10x^2', 'x × x = x²'], ['\\frac{12xy}{3x} = 4y', '12 ÷ 3 = 4, x ÷ x = 1']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Try it: collect like terms',
      text: '<p>Press <b>New expression</b>. Group the like terms, then simplify.</p><p>Try to say the answer before you press <b>Simplify</b>.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'like-terms',
  gens: [
    () => { const l = ltRand(); return { type: 'alg', q: `Simplify \\(${ltExpr(l)}\\)`, a: ltExpr(ltSimp(l)).replace(/\s/g, ''), form: 'simplified', show: `\\(${ltExpr(ltSimp(l))}\\)`, hint: 'Type powers with ^, e.g. 3x^2 + 2xy.', why: `Collect each kind of term: ${LT_LET.filter((k) => l.some((t) => t[1] === k)).map((k) => `\\(${ltExpr(l.filter((t) => t[1] === k))} = ${ltExpr(ltSimp(l.filter((t) => t[1] === k)))}\\)`).join(', ')}. So the answer is \\(${ltExpr(ltSimp(l))}\\).` }; },
    () => { const p = FD.rnd(2, 7), q = FD.rnd(2, 7), [u, v] = FD.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]); return { type: 'alg', q: `Simplify \\(${p}${u} \\times ${q}${v}\\)`, a: `${p * q}${u}${v}`, show: `\\(${p * q}${u}${v}\\)`, hint: 'Type it like 12ab.', why: `Multiply the numbers: \\(${p} \\times ${q} = ${p * q}\\). Then the letters: \\(${u} \\times ${v} = ${u}${v}\\).` }; },
    () => { const q = FD.rnd(2, 6), r = FD.rnd(2, 6), x = FD.pick(['x', 'y', 'p']); return { type: 'alg', q: `Simplify \\(\\dfrac{${q * r}${x}^2}{${q}${x}}\\)`, a: `${r}${x}`, show: `\\(${r}${x}\\)`, hint: 'Type it like 5x.', why: `\\(${q * r} \\div ${q} = ${r}\\) and \\(${x}^2 \\div ${x} = ${x}\\), so the answer is \\(${r}${x}\\).` }; },
  ],
});

FD.check({
  section: 'like-terms',
  items: [
    { type: 'alg', q: 'Simplify \\(6x + 3y - 2x + 5y\\)', a: '4x+8y', form: 'simplified', show: '\\(4x + 8y\\)', why: '\\(6x - 2x = 4x\\) and \\(3y + 5y = 8y\\).' },
    { type: 'mcq', q: 'Which pair are like terms?', opts: ['\\(3ab\\) and \\(-ba\\)', '\\(2x\\) and \\(2x^2\\)', '\\(4p\\) and \\(4q\\)', '\\(y\\) and \\(5\\)'], why: '\\(ab\\) and \\(ba\\) are the same letters, so they are like terms.' },
    { type: 'alg', q: 'Simplify \\(4m \\times 3m\\)', a: '12m^2', show: '\\(12m^2\\)', why: '\\(4 \\times 3 = 12\\) and \\(m \\times m = m^2\\).' },
    { type: 'tf', q: '\\(5x^2 + 2x\\) simplifies to \\(7x^3\\).', a: false, why: '\\(x^2\\) and \\(x\\) are not like terms, so it cannot be simplified.' },
    { type: 'alg', q: 'Simplify \\(\\frac{20ab}{4b}\\)', a: '5a', show: '\\(5a\\)', why: '\\(20 \\div 4 = 5\\) and \\(b \\div b = 1\\).' },
  ],
});
