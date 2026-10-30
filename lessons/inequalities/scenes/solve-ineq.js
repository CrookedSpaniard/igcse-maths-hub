// Solving linear inequalities: the same steps as equations; × or ÷ by a negative reverses the sign.
FD.add({
  id: 'solve-ineq',
  title: 'Solving linear inequalities',
  tab: 'Solving',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Solution set', 'All the values that make the inequality true, e.g. \\(x > 4\\).'],
    ['Reverse the sign', 'Multiplying or dividing both sides by a negative number turns \\(<\\) into \\(>\\) (and \\(\\le\\) into \\(\\ge\\)).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'in-s',
      vis: '<div class="nl-host" data-k="nl"></div>',
      tryHtml: `<p class="ab-ask">Start with \\(2 < 5\\), which is true. Multiply both sides by:</p>
        <label class="ctrl">\\(k\\) <input type="range" data-k="k" min="-3" max="3" value="2"><output data-k="ok">2</output></label>`,
    });
    const nl = FD.numLine(a.$('[data-k="nl"]'));
    a.nl = nl;
    const sync = () => {
      let k = +a.$('[data-k="k"]').value; if (!k) { k = 1; a.$('[data-k="k"]').value = 1; }
      a.$('[data-k="ok"]').textContent = String(k).replace('-', '−');
      const l = 2 * k, r = 5 * k;
      nl({ ints: [Math.max(-6, Math.min(6, l)), Math.max(-6, Math.min(6, r))] });
      a.big(`${l} ${l < r ? '<' : '>'} ${r}`);
      a.msg(k > 0 ? 'Multiplying by a positive number keeps the sign the same.' : 'Multiplying by a negative number reverses the order: the sign flips!', k > 0 ? 'good' : 'bad');
    };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    nl({ lo: 4 });
    return a;
  },
  steps: [
    {
      title: 'Solve it like an equation',
      text: '<p>\\(3x - 5 > 7\\). Do the same to both sides, just like an equation. The answer is a <b>range</b> of values.</p>',
      on: FD.walk([['3x - 5 > 7', ''], ['3x > 12', '+ 5'], ['x > 4', '÷ 3']], (a) => { a.nl({ lo: 4 }); a.big(''); }),
    },
    {
      title: 'Dividing by a negative',
      text: '<p>\\(-2x \\le 6\\). Dividing by \\(-2\\) gives \\(x \\ge -3\\): the sign <b>reverses</b>.</p><p>Check with \\(x = 0\\): \\(-2(0) = 0 \\le 6\\) ✓, and 0 is in \\(x \\ge -3\\).</p>',
      tip: 'Or avoid it: add \\(2x\\) to both sides so the \\(x\\) term stays positive.',
      on: FD.walk([['-2x \\le 6', ''], ['x \\ge -3', '÷ (−2): reverse the sign']], (a) => { a.nl({ lo: -3, loIn: true }); a.big(''); }, 1500),
    },
    {
      title: 'Two-sided inequalities',
      text: '<p>\\(-1 < 2x + 3 \\le 9\\): do the same to all <b>three</b> parts.</p>',
      on: FD.walk([['-1 < 2x + 3 \\le 9', ''], ['-4 < 2x \\le 6', '− 3 from every part'], ['-2 < x \\le 3', '÷ 2'], ['\\text{Integers: } -1, 0, 1, 2, 3', '']], (a) => { a.nl({ lo: -2, hi: 3, hiIn: true, ints: [-1, 0, 1, 2, 3] }); a.big(''); }, 1400),
    },
    {
      title: 'Try it: why the sign flips',
      text: '<p>\\(2 < 5\\) is true. Multiply both sides by \\(k\\). When \\(k\\) is negative, the numbers swap places on the number line, so the sign must flip.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

// The correct option first, then distinct wrong ones (a spare list makes sure there are always four).
const inOpts = (right, wrong) => [right, ...wrong].filter((o, i, arr) => arr.indexOf(o) === i).slice(0, 4).map((o) => `\\(${o}\\)`);
const IN_FLIP = { '>': '<', '<': '>', '\\ge': '\\le', '\\le': '\\ge' };
FD.practice({
  section: 'solve-ineq',
  gens: [
    () => { const a = FD.rnd(2, 6), b = FD.rndNZ(-9, 9), x = FD.rnd(-5, 6), s = FD.pick(['>', '<', '\\ge', '\\le']); return { type: 'mcq', q: `Solve \\(${a}x${FD.sg(b)} ${s} ${a * x + b}\\)`, opts: inOpts(`x ${s} ${x}`, [`x ${IN_FLIP[s]} ${x}`, `x ${s} ${a * x}`, `x ${s} ${x + 2 * b}`, `x ${s} ${x + 1}`, `x ${s} ${x - 1}`]), why: `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: \\(${a}x ${s} ${a * x}\\). Divide by ${a}: \\(x ${s} ${x}\\).` }; },
    () => { const a = FD.rnd(2, 5), x = FD.rnd(-4, 5), c = FD.rnd(1, 9), r = c - a * x; return { type: 'mcq', q: `Solve \\(${c} - ${a}x > ${r}\\)`, opts: inOpts(`x < ${x}`, [`x > ${x}`, `x < ${-x}`, `x > ${-x}`, `x < ${x + 2}`, `x > ${x + 2}`]), why: `\\(-${a}x > ${r - c}\\). Divide by \\(-${a}\\) and reverse the sign: \\(x < ${x}\\).` }; },
    () => { const lo = FD.rnd(-4, 1), hi = lo + FD.rnd(2, 5), m = FD.rnd(2, 4), k = FD.rndNZ(-5, 5); const ints = []; for (let v = lo + 1; v <= hi; v++) ints.push(v); return { type: 'num', q: `How many integers satisfy \\(${m * lo + k} < ${m}x${FD.sg(k)} \\le ${m * hi + k}\\)?`, a: ints.length, why: `${k > 0 ? 'Subtract' : 'Add'} ${Math.abs(k)}, then divide by ${m}: \\(${lo} < x \\le ${hi}\\). Integers: ${ints.join(', ').replace(/-/g, '−')}.` }; },
  ],
});

FD.check({
  section: 'solve-ineq',
  items: [
    { type: 'mcq', q: 'Solve \\(4x + 1 \\ge 13\\)', opts: ['\\(x \\ge 3\\)', '\\(x \\le 3\\)', '\\(x \\ge 3.5\\)', '\\(x > 3\\)'], why: '\\(4x \\ge 12\\).' },
    { type: 'mcq', q: 'Solve \\(5 - 3x < 11\\)', opts: ['\\(x > -2\\)', '\\(x < -2\\)', '\\(x > 2\\)', '\\(x < 2\\)'], why: '\\(-3x < 6\\); ÷ (−3) reverses: \\(x > -2\\).' },
    { type: 'num', q: 'What is the largest integer that satisfies \\(2x - 3 < 8\\)?', a: 5, why: '\\(x < 5.5\\), so 5.' },
    { type: 'tf', q: 'When you add or subtract a negative number on both sides, you must reverse the sign.', a: false, why: 'Only multiplying or dividing by a negative reverses it.' },
  ],
});
