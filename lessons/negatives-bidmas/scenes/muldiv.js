FD.add({
  id: 'muldiv',
  title: 'Multiplying and dividing negative numbers',
  tab: 'Multiply & divide',
  icon: 'number',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Same signs', 'Two positives or two negatives multiplied or divided give a <b>positive</b> answer.'],
    ['Different signs', 'One positive and one negative multiplied or divided give a <b>negative</b> answer.'],
    ['Square of a negative', 'Always positive: \\((-4)^2 = (-4) \\times (-4) = 16\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'md-s', '<div id="nl"></div>', `
      <label class="ctrl">First number <input type="range" id="ra" min="-6" max="6" value="3"><output id="oa">3</output></label>
      <label class="ctrl">Second number <input type="range" id="rb" min="-6" max="6" value="-4"><output id="ob">−4</output></label>`, () => sync());
    a.nl = FD.nline(a.$('#nl'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value; a.$('#oa').textContent = nbTxt(x); a.$('#ob').textContent = nbTxt(y);
      const r = x * y, jumps = Array(Math.abs(x)).fill(x < 0 ? -y : y).filter((j) => j !== 0);
      a.nl({ lo: -36, hi: 36, start: 0, jumps });
      a.big(`${FD.sn(x, true)} \\times ${FD.sn(y, true)} = ${r}`);
      a.msg(x === 0 || y === 0 ? 'Anything multiplied by 0 is 0.' : x < 0 ? `A negative number of jumps: do ${Math.abs(x)} jumps of ${nbTxt(y)}, then turn round (the opposite): ${Math.abs(x)} jumps of ${nbTxt(-y)}.` : `${x} jumps of ${nbTxt(y)}.`, (x < 0) === (y < 0) || r === 0 ? 'good' : 'bad');
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.nl({});
    return a;
  },
  steps: [
    {
      title: 'Positive × negative',
      text: '<p>\\(3 \\times (-4)\\) means <b>3 jumps of \\(-4\\)</b>, starting at zero.</p><p>You land on \\(-12\\). A positive times a negative is <b>negative</b>.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k <= 3; k++) { a.nl({ lo: -15, hi: 15, start: 0, jumps: [-4, -4, -4], upto: k }); if (!(await ctx.sleep(800))) return; }
        a.big('3 \\times (-4) = -12');
      },
    },
    {
      title: 'Negative × negative: a pattern',
      text: '<p>Look at the pattern. Each time the first number goes down by 1, the answer goes <b>up by 3</b>.</p><p>So \\((-1) \\times (-3) = 3\\) and \\((-2) \\times (-3) = 6\\).</p>',
      tip: 'A negative times a negative is positive.',
      async on(a, ctx) {
        a.reset();
        const L = [[2, -6], [1, -3], [0, 0], [-1, 3], [-2, 6]];
        a.work(L.map(([x, r]) => [`${FD.sn(x, true)} \\times (-3) = ${r}`, r > 0 ? 'positive!' : '']));
        for (let i = 0; i < L.length; i++) { a.upto(i); a.nl({ marks: L.slice(0, i + 1).map(([, r], k) => ({ v: r, cls: k === i ? '' : 'b', label: k === i ? nbTxt(r) : '' })) }); if (!(await ctx.sleep(1100))) return; }
      },
    },
    {
      title: 'The sign rules',
      text: '<p>The same rules work for <b>multiplying and dividing</b>.</p><p>Same signs → positive. Different signs → negative.</p>',
      async on(a, ctx) {
        a.reset(); a.nl({});
        a.big('\\begin{array}{c|cc} \\times \\; \\div & + & - \\\\ \\hline + & + & - \\\\ - & - & + \\end{array}');
        await a.lines([['(-20) \\div 4 = -5', 'different signs'], ['(-18) \\div (-3) = 6', 'same signs'], ['35 \\div (-7) = -5', 'different signs']], ctx, 1200);
      },
    },
    {
      title: 'More than two numbers',
      text: '<p>Multiply the numbers, then count the <b>negative signs</b>. An even number of negatives gives a positive; an odd number gives a negative.</p>',
      tip: 'Squaring a negative always gives a positive answer.',
      async on(a, ctx) {
        a.reset(); a.nl({});
        await a.lines([['(-2) \\times (-3) \\times (-1) = -6', '3 negatives: odd → negative'], ['(-2) \\times 5 \\times (-4) = 40', '2 negatives: even → positive'], ['(-4)^2 = (-4) \\times (-4) = 16', 'square: positive']], ctx, 1400);
      },
    },
    {
      title: 'Try it: jumps that multiply',
      text: '<p>Choose two numbers. The first number tells you how many jumps; the second tells you the size of each jump.</p><p>If the first number is negative, the jumps turn round and go the <b>opposite</b> way.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'muldiv',
  gens: [
    () => { const x = FD.rndNZ(-12, 12), y = FD.rndNZ(-12, 12); if (x > 0 && y > 0) return { type: 'num', q: `Work out \\(${-x} \\times ${y}\\)`, a: -x * y, why: `Different signs give a negative: \\(${x} \\times ${y} = ${x * y}\\), so the answer is \\(${-x * y}\\).` }; return { type: 'num', q: `Work out \\(${FD.sn(x, true)} \\times ${FD.sn(y, true)}\\)`, a: x * y, why: `\\(${Math.abs(x)} \\times ${Math.abs(y)} = ${Math.abs(x * y)}\\). ${(x < 0) === (y < 0) ? 'Same signs: positive.' : 'Different signs: negative.'}` }; },
    () => { const q = FD.rndNZ(-12, 12), d = FD.rndNZ(-9, 9), n = q * d; return { type: 'num', q: `Work out \\(${FD.sn(n, true)} \\div ${FD.sn(d, true)}\\)`, a: q, why: `\\(${Math.abs(n)} \\div ${Math.abs(d)} = ${Math.abs(q)}\\). ${(n < 0) === (d < 0) ? 'Same signs: positive.' : 'Different signs: negative.'}` }; },
    () => { const v = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6), FD.rndNZ(-5, 5)], r = v[0] * v[1] * v[2], negs = v.filter((x) => x < 0).length; return { type: 'num', q: `Work out \\(${v.map((x) => FD.sn(x, true)).join(' \\times ')}\\)`, a: r, why: `\\(${v.map(Math.abs).join(' \\times ')} = ${Math.abs(r)}\\). There ${negs === 1 ? 'is 1 negative' : `are ${negs} negatives`}: ${negs % 2 ? 'odd, so negative' : 'even, so positive'}.` }; },
    () => { const k = FD.rnd(2, 9), sq = FD.rnd(0, 1); return sq ? { type: 'num', q: `Work out \\((-${k})^2\\)`, a: k * k, why: `\\((-${k}) \\times (-${k}) = ${k * k}\\). Same signs give a positive.` } : { type: 'num', q: `Work out \\((-${k})^3\\)`, a: -(k ** 3), why: `\\((-${k}) \\times (-${k}) \\times (-${k}) = ${-(k ** 3)}\\). Three negatives: odd, so negative.` }; },
  ],
});

FD.check({
  section: 'muldiv',
  items: [
    { type: 'num', q: 'Work out \\(-6 \\times 7\\)', a: -42, why: 'Different signs: negative. \\(6 \\times 7 = 42\\).' },
    { type: 'num', q: 'Work out \\((-36) \\div (-4)\\)', a: 9, why: 'Same signs: positive. \\(36 \\div 4 = 9\\).' },
    { type: 'num', q: 'Work out \\((-2)^3\\)', a: -8, why: '\\((-2) \\times (-2) \\times (-2) = 4 \\times (-2) = -8\\).' },
    { type: 'tf', q: 'A negative number divided by a negative number is always negative.', a: false, why: 'Same signs give a positive answer.' },
    { type: 'mcq', q: 'Which calculation gives a <b>positive</b> answer?', opts: ['\\((-3) \\times (-5) \\times 2\\)', '\\((-3) \\times 5 \\times 2\\)', '\\((-3) \\times (-5) \\times (-2)\\)', '\\(3 \\times (-5) \\div 1\\)'], why: 'Two negatives (even) give a positive.' },
  ],
});
