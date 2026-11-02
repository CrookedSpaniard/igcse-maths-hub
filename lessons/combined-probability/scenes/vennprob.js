// Venn diagram with numbers in each region: n = { a, ab, b, o } (A only, both, B only, outside).
// sh: regions to shade, any of 'a', 'ab', 'b', 'o'.
FD.vid = 0;
FD.vennN = (host) => (n, sh = [], names = ['A', 'B']) => {
  const id = 'vp' + ++FD.vid, A = 'cx="235" cy="125" r="85"', B = 'cx="365" cy="125" r="85"';
  const defs = `<defs><clipPath id="${id}ca"><circle ${A}/></clipPath><mask id="${id}nb"><rect x="0" y="0" width="600" height="250" fill="#fff"/><circle ${B} fill="#000"/></mask><mask id="${id}na"><rect x="0" y="0" width="600" height="250" fill="#fff"/><circle ${A} fill="#000"/></mask><mask id="${id}no"><rect x="0" y="0" width="600" height="250" fill="#fff"/><circle ${A} fill="#000"/><circle ${B} fill="#000"/></mask></defs>`;
  const R = { a: `<circle class="vn-sh" ${A} mask="url(#${id}nb)"/>`, b: `<circle class="vn-sh" ${B} mask="url(#${id}na)"/>`, ab: `<circle class="vn-sh" ${B} clip-path="url(#${id}ca)"/>`, o: `<rect class="vn-sh" x="40" y="20" width="520" height="210" mask="url(#${id}no)"/>` };
  const v = (x) => (x === undefined || x === null ? '' : x);
  host.innerHTML = `<svg viewBox="0 0 600 250" role="img" aria-label="Venn diagram: ${names[0]} only ${v(n.a)}, both ${v(n.ab)}, ${names[1]} only ${v(n.b)}, outside ${v(n.o)}">${defs}${sh.map((r) => R[r]).join('')}
    <rect class="vn-u" x="40" y="20" width="520" height="210" rx="6"/><circle class="vn-c" ${A}/><circle class="vn-c" ${B}/>
    <text class="vn-l" x="52" y="42">ℰ</text><text class="vn-l" x="160" y="52">${names[0]}</text><text class="vn-l" x="428" y="52">${names[1]}</text>
    <text class="vn-n" x="195" y="133">${v(n.a)}</text><text class="vn-n" x="300" y="133">${v(n.ab)}</text><text class="vn-n" x="405" y="133">${v(n.b)}</text><text class="vn-n" x="520" y="215">${v(n.o)}</text>
  </svg>`;
};
FD.VN = { a: 8, ab: 5, b: 7, o: 10 };
FD.VEV = [['F', ['a', 'ab'], 'plays football'], ['T', ['ab', 'b'], 'plays tennis'], ['F ∩ T', ['ab'], 'plays both'], ['F ∪ T', ['a', 'ab', 'b'], 'plays football or tennis or both'], ["F'", ['b', 'o'], 'does not play football'], ['neither', ['o'], 'plays neither']];

FD.add({
  id: 'vennprob',
  title: 'Probability from Venn diagrams',
  tab: 'Venn',
  icon: 'shapes',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['ℰ', 'The universal set: everything (everyone) in the question.'],
    ['\\(A \\cap B\\)', 'In A and in B: the overlap.'],
    ['\\(A \\cup B\\)', 'In A or B or both.'],
    ["\\(A'\\)", 'Not in A.'],
  ],
  mount(el) {
    const a = FD.board(el, 'vp-s', '<div id="vn"></div>', `
      <div class="cp-sl">${[['a', 'Football only'], ['ab', 'Both'], ['b', 'Tennis only'], ['o', 'Neither']].map(([k, t]) => `<label class="ctrl">${t} <input type="range" id="n${k}" min="0" max="20" value="${FD.VN[k]}"><output id="o${k}">${FD.VN[k]}</output></label>`).join('')}</div>
      <div class="bd-row"><label for="ve">Event</label><select id="ve">${FD.VEV.map((e, i) => `<option value="${i}">${e[2]}</option>`).join('')}</select></div>`, () => sync());
    a.vn = FD.vennN(a.$('#vn'));
    const sync = () => {
      const n = {}; ['a', 'ab', 'b', 'o'].forEach((k) => { n[k] = +a.$('#n' + k).value; a.$('#o' + k).textContent = n[k]; });
      const [, regs, t] = FD.VEV[+a.$('#ve').value], tot = n.a + n.ab + n.b + n.o, k = regs.reduce((s, r) => s + n[r], 0);
      a.vn(n, regs, ['F', 'T']);
      if (!tot) { a.big(''); a.msg('Put some students in the diagram.', 'bad'); return; }
      a.big(`P(\\text{${t}}) = \\frac{${regs.map((r) => n[r]).join(' + ')}}{${tot}} = ${FD.ftex(k, tot)}`);
      a.msg('Add the numbers in the shaded regions, then divide by the total.');
    };
    a.$('.cp-sl').addEventListener('input', sync); a.$('#ve').addEventListener('change', sync);
    a.vn(FD.VN, [], ['F', 'T']);
    return a;
  },
  steps: [
    {
      title: 'Reading the diagram',
      text: '<p>A class was asked which sports they play. F = football, T = tennis. 8 play only football, 5 play both, 7 play only tennis and 10 play neither.</p>',
      async on(a, ctx) { a.reset(); a.vn(FD.VN, [], ['F', 'T']); await a.lines([['8 + 5 + 7 + 10 = 30', 'total in ℰ']], ctx, 1000); },
    },
    {
      title: 'Probability of one set',
      text: '<p>A student is chosen at random. P(plays football): everyone inside circle F, including the overlap.</p>',
      tip: 'Do not forget the overlap: it is inside both circles.',
      async on(a, ctx) { a.reset(); a.vn(FD.VN, ['a', 'ab'], ['F', 'T']); a.big('P(F) = \\frac{8 + 5}{30} = \\frac{13}{30}'); },
    },
    {
      title: 'Both, and neither',
      text: '<p>P(both) uses the overlap only. P(neither) uses the region outside both circles.</p>',
      async on(a, ctx) {
        a.reset(); a.vn(FD.VN, ['ab'], ['F', 'T']); a.big('P(F \\cap T) = \\frac{5}{30} = \\frac16'); if (!(await ctx.sleep(1700))) return;
        a.vn(FD.VN, ['o'], ['F', 'T']); a.big('P(\\text{neither}) = \\frac{10}{30} = \\frac13');
      },
    },
    {
      title: 'Union and complement',
      text: '<p>P(F ∪ T) counts everyone in either circle: \\(8 + 5 + 7 = 20\\). P(F′) counts everyone outside F: \\(7 + 10 = 17\\).</p>',
      async on(a, ctx) {
        a.reset(); a.vn(FD.VN, ['a', 'ab', 'b'], ['F', 'T']); a.big('P(F \\cup T) = \\frac{20}{30} = \\frac23'); if (!(await ctx.sleep(1700))) return;
        a.vn(FD.VN, ['b', 'o'], ['F', 'T']); a.big("P(F') = \\frac{17}{30}");
      },
    },
    {
      title: 'Try it: your own class',
      text: '<p>Change the numbers in each region and choose an event. The diagram shades the event and finds its probability.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.VQ = (n) => `<p class="vq">${n.a} in A only, ${n.ab} in both A and B, ${n.b} in B only, ${n.o} in neither.</p>`;

FD.practice({
  section: 'vennprob',
  gens: [
    () => { const n = { a: FD.rnd(2, 15), ab: FD.rnd(1, 10), b: FD.rnd(2, 15), o: FD.rnd(1, 12) }, tot = n.a + n.ab + n.b + n.o, [lab, regs] = FD.pick([['A', ['a', 'ab']], ['B', ['ab', 'b']], ['A \\cap B', ['ab']], ['A \\cup B', ['a', 'ab', 'b']], ["A'", ['b', 'o']], ["(A \\cup B)'", ['o']]]), k = regs.reduce((s, r) => s + n[r], 0); return { type: 'num', q: `A Venn diagram shows ${n.a} people in A only, ${n.ab} in both A and B, ${n.b} in B only and ${n.o} in neither. One person is chosen at random. Find \\(P(${lab})\\).`, ...FD.pq(k, tot), why: `Total ${tot}. The region \\(${lab}\\) holds ${regs.map((r) => n[r]).join(' + ')} = ${k}: \\(${FD.ftex(k, tot)}\\).` }; },
    () => { const tot = FD.pick([30, 40, 50]), A = FD.rnd(10, 20), B = FD.rnd(8, 18), ab = FD.rnd(2, Math.min(A, B) - 2), o = tot - (A + B - ab); if (o < 0) return { type: 'num', q: 'In a group of 30, 14 like apples, 12 like bananas and 5 like both. How many like neither?', a: 9, why: '\\(30 - (14 + 12 - 5) = 9\\).' }; return { type: 'num', q: `In a group of ${tot}, ${A} like apples, ${B} like bananas and ${ab} like both. How many like neither?`, a: o, why: `Apples only \\(${A} - ${ab} = ${A - ab}\\), bananas only \\(${B} - ${ab} = ${B - ab}\\). Neither: \\(${tot} - (${A - ab} + ${ab} + ${B - ab}) = ${o}\\).` }; },
  ],
});

FD.check({
  section: 'vennprob',
  items: [
    { type: 'num', q: 'A only 6, both 4, B only 9, neither 1. Find P(A).', ...FD.pq(10, 20), why: '\\(\\frac{6 + 4}{20} = \\frac12\\).' },
    { type: 'num', q: 'A only 6, both 4, B only 9, neither 1. Find P(A ∩ B).', ...FD.pq(4, 20), why: '\\(\\frac{4}{20} = \\frac15\\).' },
    { type: 'mcq', q: "Which region is \\(A'\\)?", opts: ['Everything outside circle A', 'The overlap', 'Circle A', 'Outside both circles only'], why: 'Not in A: B only and outside.' },
    { type: 'tf', q: 'To find P(B) you include the overlap of A and B.', a: true, why: 'The overlap is inside B.' },
  ],
});
