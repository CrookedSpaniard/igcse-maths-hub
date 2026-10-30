FD.add({
  id: 'venn',
  title: 'Venn diagrams, unions and intersections',
  tab: 'Venn diagrams',
  icon: 'shapes',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Intersection \\(A \\cap B\\)', 'The elements in A <b>and</b> in B: the overlap.'],
    ['Union \\(A \\cup B\\)', 'The elements in A <b>or</b> B (or both): everything inside the circles.'],
    ['Venn diagram', 'A rectangle (ℰ) with a circle for each set. Every element goes in exactly one region.'],
  ],
  mount(el) {
    const keys = Object.keys(FD.VEXPR);
    const a = FD.board(el, 've-s', '<div id="vd"></div>', `<div class="bd-btns" id="ex">${keys.map((k) => `<button class="btn small-btn" data-k="${k}">\\(${FD.VTEX(k)}\\)</button>`).join('')}</div>`, () => show(keys[0]));
    a.vd = FD.venn(a.$('#vd'));
    const A = [1, 2, 3, 4, 6, 12], B = [2, 3, 5, 7, 11], R = FD.vsplit(12, A, B);
    a.R = R;
    const show = (k) => {
      const regs = FD.VEXPR[k], els = regs.flatMap((r) => R[r]).sort((x, y) => x - y);
      a.vd({ labels: ['A', 'B'], items: R, shade: regs });
      a.$('#ex').querySelectorAll('button').forEach((b) => b.classList.toggle('sel', b.dataset.k === k));
      a.big(`${FD.VTEX(k)} = ${FD.setTex(els)}`);
      a.msg('ℰ = {1, …, 12}, A = factors of 12, B = prime numbers.');
    };
    a.$('#ex').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => show(b.dataset.k)));
    a.vd({ labels: ['A', 'B'] });
    return a;
  },
  steps: [
    {
      title: 'Filling in a Venn diagram',
      text: '<p>ℰ = {1, 2, …, 12}, A = {factors of 12}, B = {prime numbers}.</p><p>Start with the <b>overlap</b>: 2 and 3 are in both sets. Then fill the rest of each circle, then the outside.</p>',
      tip: 'Check: every number in ℰ appears exactly once.',
      async on(a, ctx) {
        a.reset();
        const R = a.R, steps = [{ 11: R['11'] }, { 11: R['11'], 10: R['10'] }, { 11: R['11'], 10: R['10'], '01': R['01'] }, R];
        for (const it of steps) { a.vd({ labels: ['A', 'B'], items: it }); if (!(await ctx.sleep(1100))) return; }
      },
    },
    {
      title: 'Intersection: A ∩ B',
      text: '<p>\\(A \\cap B\\) (“A intersection B”) is the elements in <b>both</b> A and B: the overlap.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: a.R, shade: FD.VEXPR['A ∩ B'] });
        await a.lines([['A \\cap B = \\{2, 3\\}', 'in A and in B']], ctx, 1200);
      },
    },
    {
      title: 'Union: A ∪ B',
      text: '<p>\\(A \\cup B\\) (“A union B”) is every element in A <b>or</b> B or both. Shade both circles completely.</p>',
      tip: 'Think: ∪ looks like a cup that collects everything.',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: a.R, shade: FD.VEXPR['A ∪ B'] });
        await a.lines([['A \\cup B = \\{1, 2, 3, 4, 5, 6, 7, 11, 12\\}', 'each element once']], ctx, 1200);
      },
    },
    {
      title: 'Complements together',
      text: "<p>Combine the symbols. \\((A \\cup B)'\\) is everything <b>outside both</b> circles. \\(A \\cap B'\\) is in A but <b>not</b> in B.</p>",
      async on(a, ctx) {
        a.reset();
        a.vd({ labels: ['A', 'B'], items: a.R, shade: FD.VEXPR["(A ∪ B)′"] }); a.big("(A \\cup B)' = \\{8, 9, 10\\}");
        if (!(await ctx.sleep(1800))) return;
        a.vd({ labels: ['A', 'B'], items: a.R, shade: FD.VEXPR["A ∩ B′"] }); a.big("A \\cap B' = \\{1, 4, 6, 12\\}");
      },
    },
    {
      title: 'Try it: shade the region',
      text: '<p>Choose an expression. Its region is shaded and its elements are listed.</p>',
      tip: "Before you press, predict which regions \\((A \\cap B)'\\) will shade.",
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'venn',
  gens: [
    () => { const N = 12, p = FD.rnd(2, 3), q = FD.pick([3, 4, 5].filter((x) => x !== p)), A = [], B = []; for (let x = 1; x <= N; x++) { if (x % p === 0) A.push(x); if (x % q === 0) B.push(x); } const R = FD.vsplit(N, A, B), k = FD.pick(Object.keys(FD.VEXPR)), els = FD.VEXPR[k].flatMap((r) => R[r]); return { type: 'num', q: `ℰ = {1, 2, …, 12}, A = {multiples of ${p}}, B = {multiples of ${q}}. How many elements are in \\(${FD.VTEX(k)}\\)?`, a: els.length, why: `A = \\(${FD.setTex(A)}\\), B = \\(${FD.setTex(B)}\\). \\(${FD.VTEX(k)} = ${FD.setTex(els.sort((x, y) => x - y))}\\): ${els.length} element${els.length === 1 ? '' : 's'}.` }; },
    () => { const keys = Object.keys(FD.VEXPR), k = FD.pick(keys), names = { 11: 'the overlap only', 10: 'A without the overlap', '01': 'B without the overlap', '00': 'outside both circles' }; const desc = (ks) => FD.VEXPR[ks].map((r) => names[r]).join(' + '); const wrong = FD.shuffle(keys.filter((x) => x !== k)).slice(0, 3); return { type: 'mcq', q: `Which regions are shaded for \\(${FD.VTEX(k)}\\)?`, opts: [desc(k), ...wrong.map(desc)].filter((v, i, s) => s.indexOf(v) === i), why: `\\(${FD.VTEX(k)}\\): ${desc(k)}.` }; },
    () => { const s = FD.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), A = s.slice(0, 5).sort((x, y) => x - y), B = s.slice(3, 7).sort((x, y) => x - y), I = A.filter((x) => B.includes(x)), U = [...new Set([...A, ...B])]; const ask = FD.rnd(0, 1); return { type: 'num', q: `A = \\(${FD.setTex(A)}\\) and B = \\(${FD.setTex(B)}\\). How many elements are in \\(A ${ask ? '\\cup' : '\\cap'} B\\)?`, a: ask ? U.length : I.length, why: ask ? `\\(A \\cup B = ${FD.setTex(U.sort((x, y) => x - y))}\\): ${U.length} elements (count the shared ones once).` : `\\(A \\cap B = ${FD.setTex(I)}\\): ${I.length} elements.` }; },
  ],
});

FD.check({
  section: 'venn',
  items: [
    { type: 'mcq', q: 'A = {1, 2, 3, 4} and B = {3, 4, 5}. What is \\(A \\cap B\\)?', opts: ['{3, 4}', '{1, 2, 3, 4, 5}', '{1, 2, 5}', '{5}'], why: '3 and 4 are in both.' },
    { type: 'mcq', q: 'A = {1, 2, 3, 4} and B = {3, 4, 5}. What is \\(A \\cup B\\)?', opts: ['{1, 2, 3, 4, 5}', '{3, 4}', '{1, 2, 3, 3, 4, 4, 5}', '{1, 2}'], why: 'Everything in either set, each written once.' },
    { type: 'mcq', q: "Which region is \\(A' \\cap B\\)?", opts: ['In B but not in A', 'In A but not in B', 'Outside both', 'The overlap'], why: "\\(A'\\) = not in A, and \\(\\cap B\\) = also in B." },
    { type: 'num', q: "ℰ = {1, …, 10}, A = {even numbers}, B = {1, 2, 3}. How many elements are in \\((A \\cup B)'\\)?", a: 3, why: '\\(A \\cup B = \\{1, 2, 3, 4, 6, 8, 10\\}\\), so the rest is {5, 7, 9}.' },
    { type: 'tf', q: '\\(A \\cap B\\) is always part of \\(A \\cup B\\).', a: true, why: 'The overlap is inside both circles, so it is part of the union.' },
  ],
});
