FD.add({
  id: 'subsets',
  title: 'Set-builder notation and subsets',
  tab: 'Subsets',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Set-builder notation', '\\(\\{x : x \\text{ is an integer}, 2 < x \\le 6\\}\\) means “all \\(x\\) such that…”: \\(\\{3, 4, 5, 6\\}\\).'],
    ['Subset \\(B \\subset A\\)', 'Every element of B is also in A. B is drawn inside A.'],
    ['\\(B \\not\\subset A\\)', 'B is not a subset of A: at least one element of B is not in A.'],
    ['\\(n(A)\\)', 'The number of elements in A.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sb-s', '<div id="vd"></div>', `
      <label class="ctrl">A = multiples of <input type="range" id="rp" min="2" max="5" value="2"><output id="op">2</output></label>
      <label class="ctrl">B = multiples of <input type="range" id="rq" min="2" max="10" value="4"><output id="oq">4</output></label>`, () => sync());
    a.vd = FD.venn(a.$('#vd'));
    const sync = () => {
      const p = +a.$('#rp').value, q = +a.$('#rq').value; a.$('#op').textContent = p; a.$('#oq').textContent = q;
      const A = [], B = []; for (let x = 1; x <= 20; x++) { if (x % p === 0) A.push(x); if (x % q === 0) B.push(x); }
      const sub = B.every((x) => A.includes(x)), R = FD.vsplit(20, A, B);
      if (sub) a.vd({ k: 'nested', labels: ['A', 'B'], items: { 10: R['10'].slice(0, 8), 11: R['11'] }, shade: ['11'] });
      else a.vd({ labels: ['A', 'B'], items: { 10: R['10'].slice(0, 9), 11: R['11'], '01': R['01'] }, shade: ['01'] });
      a.big(`n(A) = ${A.length}, \\quad n(B) = ${B.length}, \\quad B ${sub ? '\\subset' : '\\not\\subset'} A`);
      a.msg(sub ? `Every multiple of ${q} is a multiple of ${p}, so B is a subset of A and sits inside it.` : `Some multiples of ${q} (shaded) are not multiples of ${p}, so B is not a subset of A.`, sub ? 'good' : 'bad');
    };
    ['#rp', '#rq'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.vd({ labels: ['A', 'B'] });
    return a;
  },
  steps: [
    {
      title: 'Sets defined with algebra',
      text: '<p>\\(\\{x : x \\text{ is an integer}, -2 \\le x < 3\\}\\) reads “the set of all \\(x\\) <b>such that</b> \\(x\\) is an integer and \\(-2 \\le x < 3\\)”.</p><p>Watch the signs: \\(\\le\\) includes the end, \\(<\\) does not.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: { 10: [-2, -1, 0, 1, 2] } });
        await a.lines([['\\{x : x \\in \\mathbb{Z}, -2 \\le x < 3\\}', ''], ['= \\{-2, -1, 0, 1, 2\\}', '−2 is in, 3 is not'], ['\\{x : x^2 = 9\\} = \\{-3, 3\\}', 'another rule']], ctx, 1500);
      },
    },
    {
      title: 'Subsets',
      text: '<p>A = {even numbers up to 20} and B = {multiples of 4 up to 20}. Every multiple of 4 is even, so B is a <b>subset</b> of A: \\(B \\subset A\\).</p><p>In the Venn diagram, B sits <b>inside</b> A.</p>',
      async on(a, ctx) {
        a.reset();
        a.vd({ k: 'nested', labels: ['A', 'B'], items: { 10: [2, 6, 10, 14, 18], 11: [4, 8, 12, 16, 20] }, shade: ['11'] });
        a.big('B \\subset A');
      },
    },
    {
      title: 'Not a subset',
      text: '<p>C = {multiples of 3 up to 20}. 3 is in C but not in A, so C is <b>not</b> a subset of A: \\(C \\not\\subset A\\).</p><p>One element outside is enough.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'C'], items: { 10: [2, 4, 8, 10, 14, 16, 20], 11: [6, 12, 18], '01': [3, 9, 15] }, shade: ['01'] });
        a.big('C \\not\\subset A');
      },
    },
    {
      title: 'Counting with n(A)',
      text: '<p>\\(n(A)\\) is the <b>number</b> of elements in A, not the elements themselves.</p>',
      tip: '\\(n(\\emptyset) = 0\\).',
      async on(a, ctx) {
        a.reset(); a.vd({ k: 'nested', labels: ['A', 'B'], items: { 10: [2, 6, 10, 14, 18], 11: [4, 8, 12, 16, 20] } });
        await a.lines([['n(A) = 10', 'even numbers up to 20'], ['n(B) = 5', 'multiples of 4 up to 20'], ["n(A \\cap B') = 5", 'in A, not in B']], ctx, 1300);
      },
    },
    {
      title: 'Try it: is B a subset of A?',
      text: '<p>ℰ = {1, …, 20}. Choose the multiples for A and B. When B is a subset, it is drawn inside A.</p>',
      tip: 'When is the set of multiples of q a subset of the multiples of p?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'subsets',
  gens: [
    () => { const lo = FD.rnd(-5, 3), hi = lo + FD.rnd(2, 7), le1 = FD.rnd(0, 1), le2 = FD.rnd(0, 1), els = []; for (let x = lo; x <= hi; x++) if ((le1 || x > lo) && (le2 || x < hi)) els.push(x); return { type: 'num', q: `\\(A = \\{x : x \\text{ is an integer}, ${lo} ${le1 ? '\\le' : '<'} x ${le2 ? '\\le' : '<'} ${hi}\\}\\). Find \\(n(A)\\).`, a: els.length, why: `\\(A = ${FD.setTex(els)}\\), so \\(n(A) = ${els.length}\\). ${le1 ? `${lo} is included` : `${lo} is not included`}; ${le2 ? `${hi} is included` : `${hi} is not included`}.` }; },
    () => { const p = FD.rnd(2, 4), q = FD.rnd(2, 10), sub = q % p === 0; return { type: 'tf', q: `ℰ = {1, …, 30}, A = {multiples of ${p}}, B = {multiples of ${q}}. \\(B \\subset A\\).`, a: sub, why: sub ? `${q} is a multiple of ${p}, so every multiple of ${q} is a multiple of ${p}: \\(B \\subset A\\).` : `${q} is in B but not in A, so \\(B \\not\\subset A\\).` }; },
    () => { const k = FD.rnd(2, 6); return { type: 'mcq', q: `\\(\\{x : x^2 = ${k * k}\\} = \\)`, opts: [`\\(\\{-${k}, ${k}\\}\\)`, `\\(\\{${k}\\}\\)`, `\\(\\{${k * k}\\}\\)`, '\\(\\emptyset\\)'], why: `\\(${k}^2 = ${k * k}\\) and \\((-${k})^2 = ${k * k}\\).` }; },
  ],
});

FD.check({
  section: 'subsets',
  items: [
    { type: 'mcq', q: '\\(\\{x : x \\text{ is an integer}, 1 < x \\le 5\\}\\) is…', opts: ['{2, 3, 4, 5}', '{1, 2, 3, 4, 5}', '{2, 3, 4}', '{1, 2, 3, 4}'], why: '1 is not included (<), 5 is included (≤).' },
    { type: 'tf', q: 'A = {1, 2, 3, 4, 5} and B = {2, 4}. \\(B \\subset A\\).', a: true, why: 'Both 2 and 4 are in A.' },
    { type: 'tf', q: 'A = {1, 2, 3} and C = {3, 4}. \\(C \\subset A\\).', a: false, why: '4 is in C but not in A.' },
    { type: 'num', q: 'P = {letters in the word MATHEMATICS}. Find \\(n(P)\\).', a: 8, why: 'M, A, T, H, E, I, C, S: each letter counted once.' },
  ],
});
