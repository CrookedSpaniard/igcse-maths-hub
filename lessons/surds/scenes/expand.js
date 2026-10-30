// (a1 + b1√m)(a2 + b2√m) = (a1a2 + b1b2m) + (a1b2 + a2b1)√m
FD.sxMul = (a1, b1, a2, b2, m) => [a1 * a2 + b1 * b2 * m, a1 * b2 + a2 * b1];
// TeX for p + q√m (either part may be 0 or negative).
FD.spq = (p, q, m) => { if (!q) return String(p); const s = FD.stex(Math.abs(q), m); return p ? `${p} ${q < 0 ? '-' : '+'} ${s}` : `${q < 0 ? '-' : ''}${s}`; };
// The grid method for (a1 + b1√m)(a2 + b2√m). lit = how many cells are filled.
FD.sxGrid = (host) => (a1, b1, a2, b2, m, lit = 4) => {
  const t = (k, sq) => FD.tex(sq ? FD.stex(k, m) : String(k)), cell = (v, i) => `<td class="${i < lit ? 'on' : ''}">${i < lit ? v : ''}</td>`;
  const prod = (x, y, xs, ys) => (xs && ys ? FD.tex(`${x * y * m}`) : xs || ys ? FD.tex(FD.stex(x * y, m)) : FD.tex(String(x * y)));
  host.innerHTML = `<table class="gm"><tr><th>×</th><th>${t(a2)}</th><th>${t(b2, true)}</th></tr>
    <tr><th>${t(a1)}</th>${cell(prod(a1, a2, 0, 0), 0)}${cell(prod(a1, b2, 0, 1), 1)}</tr>
    <tr><th>${t(b1, true)}</th>${cell(prod(b1, a2, 1, 0), 2)}${cell(prod(b1, b2, 1, 1), 3)}</tr></table>`;
};

FD.add({
  id: 'expand',
  title: 'Expanding brackets with surds',
  tab: 'Expanding',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Expand', 'Multiply out the brackets: every term in one bracket times every term in the other.'],
    ['Grid method', 'A table that makes sure you multiply every pair of terms.'],
    ['Difference of two squares', '\\((a + \\sqrt{b})(a - \\sqrt{b}) = a^2 - b\\): the surds cancel.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ex-s', '<div id="gm"></div>', `
      <label class="ctrl">First bracket: number <input type="range" id="a1" min="-5" max="5" value="2"><output id="o1">2</output></label>
      <label class="ctrl">First bracket: × √m <input type="range" id="b1" min="-3" max="3" value="1"><output id="o2">1</output></label>
      <label class="ctrl">Second bracket: number <input type="range" id="a2" min="-5" max="5" value="4"><output id="o3">4</output></label>
      <label class="ctrl">Second bracket: × √m <input type="range" id="b2" min="-3" max="3" value="-1"><output id="o4">−1</output></label>
      <div class="bd-row"><label>m <select id="m"><option>2</option><option selected>3</option><option>5</option><option>7</option></select></label></div>`, () => sync());
    a.gm = FD.sxGrid(a.$('#gm'));
    const sync = () => {
      const v = ['a1', 'b1', 'a2', 'b2'].map((id, i) => { const x = +a.$('#' + id).value; a.$('#o' + (i + 1)).textContent = x < 0 ? '−' + -x : x; return x; }), m = +a.$('#m').value;
      a.gm(...v, m);
      const [p, q] = FD.sxMul(...v, m);
      a.big(`(${FD.spq(v[0], v[1], m)})(${FD.spq(v[2], v[3], m)}) = ${FD.spq(p, q, m)}`);
      a.msg(q === 0 && v[1] && v[3] ? 'The surds cancelled: the answer is a whole number.' : 'Add the two whole numbers, and add the two surd terms.');
    };
    ['#a1', '#b1', '#a2', '#b2', '#m'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.gm(2, 1, 4, -1, 3, 0);
    return a;
  },
  steps: [
    {
      title: 'A single bracket',
      text: '<p>Multiply the term outside by <b>each</b> term inside.</p><p>\\(\\sqrt{3}(4 + \\sqrt{3})\\)</p>',
      async on(a, ctx) {
        a.reset(); a.gm(2, 1, 4, -1, 3, 0);
        await a.lines([['\\sqrt{3} \\times 4 = 4\\sqrt{3}', ''], ['\\sqrt{3} \\times \\sqrt{3} = 3', ''], ['\\sqrt{3}(4 + \\sqrt{3}) = 3 + 4\\sqrt{3}', '']], ctx, 1300);
      },
    },
    {
      title: 'Two brackets: the grid',
      text: '<p>Expand \\((2 + \\sqrt{3})(4 - \\sqrt{3})\\). Put one bracket along the top and one down the side, then fill every cell.</p>',
      tip: 'Collect the whole numbers together and the surds together.',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k <= 4; k++) { a.gm(2, 1, 4, -1, 3, k); if (!(await ctx.sleep(900))) return; }
        await a.lines([['8 - 2\\sqrt{3} + 4\\sqrt{3} - 3', 'the four cells'], ['= 5 + 2\\sqrt{3}', 'collect']], ctx, 1300);
      },
    },
    {
      title: 'Squaring a bracket',
      text: '<p>\\((1 + \\sqrt{2})^2\\) means \\((1 + \\sqrt{2})(1 + \\sqrt{2})\\). Do not just square each term!</p>',
      tip: '\\((1 + \\sqrt{2})^2 \\neq 1 + 2\\).',
      async on(a, ctx) {
        a.reset(); a.gm(1, 1, 1, 1, 2, 4);
        await a.lines([['(1 + \\sqrt{2})(1 + \\sqrt{2})', ''], ['= 1 + \\sqrt{2} + \\sqrt{2} + 2', ''], ['= 3 + 2\\sqrt{2}', '']], ctx, 1300);
      },
    },
    {
      title: 'When the surds cancel',
      text: '<p>\\((\\sqrt{5} + 2)(\\sqrt{5} - 2)\\): the two middle terms cancel, leaving a whole number.</p><p>This is the <b>difference of two squares</b>, and it is the key to rationalising.</p>',
      async on(a, ctx) {
        a.reset(); a.gm(2, 1, -2, 1, 5, 4);
        await a.lines([['5 - 2\\sqrt{5} + 2\\sqrt{5} - 4', ''], ['= 1', 'the surds cancel']], ctx, 1300);
      },
    },
    {
      title: 'Try it: build the brackets',
      text: '<p>Choose the numbers in each bracket. The grid fills in and the answer is collected.</p>',
      tip: 'Make the second bracket the same as the first with the sign of the surd changed. What happens?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'expand',
  gens: [
    () => { const m = FD.pick([2, 3, 5, 7]), a1 = FD.rndNZ(-5, 6), b1 = FD.rndNZ(-2, 3), a2 = FD.rndNZ(-5, 6), b2 = FD.rndNZ(-2, 3), [p, q] = FD.sxMul(a1, b1, a2, b2, m); return { type: 'num', q: `Expand and simplify \\((${FD.spq(a1, b1, m)})(${FD.spq(a2, b2, m)})\\). Write it as \\(p + q\\sqrt{${m}}\\).`, a: [p, q], fields: ['p =', 'q ='], why: `The four products are \\(${a1 * a2}\\), \\(${FD.stex(a1 * b2, m)}\\), \\(${FD.stex(a2 * b1, m)}\\) and \\((${FD.stex(b1, m)}) \\times (${FD.stex(b2, m)}) = ${b1 * b2 * m}\\). Collect: \\(${FD.spq(p, q, m)}\\).` }; },
    () => { const m = FD.pick([2, 3, 5, 6, 7]), k = FD.rnd(1, 5), [p, q] = FD.sxMul(k, 1, k, 1, m); return { type: 'num', q: `Expand \\((${k} + \\sqrt{${m}})^2\\). Write it as \\(p + q\\sqrt{${m}}\\).`, a: [p, q], fields: ['p =', 'q ='], why: `\\((${k} + \\sqrt{${m}})(${k} + \\sqrt{${m}}) = ${k * k} + ${k}\\sqrt{${m}} + ${k}\\sqrt{${m}} + ${m} = ${FD.spq(p, q, m)}\\).` }; },
    () => { const m = FD.pick([2, 3, 5, 6, 7, 10, 11]), k = FD.rnd(1, 6); return { type: 'num', q: `Work out \\((${k} + \\sqrt{${m}})(${k} - \\sqrt{${m}})\\)`, a: k * k - m, why: `The surd terms cancel: \\(${k}^2 - (\\sqrt{${m}})^2 = ${k * k} - ${m} = ${k * k - m}\\).` }; },
  ],
});

FD.check({
  section: 'expand',
  items: [
    { type: 'mcq', q: 'Expand \\(\\sqrt{2}(5 - \\sqrt{2})\\)', opts: ['\\(5\\sqrt{2} - 2\\)', '\\(5\\sqrt{2} - 4\\)', '\\(3\\sqrt{2}\\)', '\\(5 - 2\\)'], why: '\\(\\sqrt2 \\times 5 = 5\\sqrt2\\), \\(\\sqrt2 \\times \\sqrt2 = 2\\).' },
    { type: 'num', q: '\\((3 + \\sqrt{5})(1 + \\sqrt{5}) = p + q\\sqrt{5}\\). Find \\(p\\) and \\(q\\).', a: [8, 4], fields: ['p =', 'q ='], why: '\\(3 + 3\\sqrt5 + \\sqrt5 + 5 = 8 + 4\\sqrt5\\).' },
    { type: 'num', q: 'Work out \\((\\sqrt{7} - 1)(\\sqrt{7} + 1)\\)', a: 6, why: '\\(7 - 1 = 6\\).' },
    { type: 'mcq', q: 'Expand \\((2 - \\sqrt{3})^2\\)', opts: ['\\(7 - 4\\sqrt{3}\\)', '\\(4 - 3\\)', '\\(7 - 2\\sqrt{3}\\)', '\\(1\\)'], why: '\\(4 - 2\\sqrt3 - 2\\sqrt3 + 3 = 7 - 4\\sqrt3\\).' },
  ],
});
