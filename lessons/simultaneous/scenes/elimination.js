// Elimination: line the equations up, then add or subtract them so one letter disappears.
// An equation is [a, b, c] meaning ax + by = c.
const siTerm = (k, v, first) => (k === 0 ? '' : `${k < 0 ? (first ? '-' : ' - ') : first ? '' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`);
const siEq = ([a, b, c]) => `${siTerm(a, 'x', true)}${siTerm(b, 'y', !a)} &= ${c}`;
const siSys = (e1, e2, extra) => `\\begin{aligned} ${siEq(e1)} \\\\ ${siEq(e2)}${extra ? ` \\\\ \\hline ${extra}` : ''} \\end{aligned}`;
// A random system with integer solution; same = 'x' | 'y' | null for a matching coefficient.
const siRand = (same) => {
  let x, y, a, b, d, e;
  do {
    x = FD.rndNZ(-6, 8); y = FD.rndNZ(-6, 8);
    a = FD.rnd(1, 6); b = FD.rndNZ(-5, 6); d = FD.rnd(1, 6); e = FD.rndNZ(-5, 6);
    if (same === 'y') e = FD.pick([b, -b]);
    if (same === 'x') d = a;
  } while (a * e - b * d === 0 || (same === 'x' && b === e) || (same === 'y' && a === d));
  return { e1: [a, b, a * x + b * y], e2: [d, e, d * x + e * y], x, y };
};

FD.add({
  id: 'elimination',
  title: 'Solving by elimination',
  tab: 'Elimination',
  icon: 'algebra',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Simultaneous equations', 'Two equations with the same two unknowns. The solution makes <b>both</b> true.'],
    ['Eliminate', 'Get rid of one unknown by adding or subtracting the equations.'],
    ['Coefficient', 'The number in front of a letter: in \\(3x - 2y\\), the coefficient of \\(y\\) is \\(-2\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'si-e',
      tryHtml: '<p class="ab-ask">The \\(y\\) terms have the same size. Add or subtract?</p><div class="chk-btns" data-k="ops"><button class="btn" data-o="1">Add the equations</button><button class="btn" data-o="-1">Subtract the equations</button></div><div class="chk-btns"><button class="btn ghost" data-k="new">New pair ↻</button></div>',
    });
    let s;
    const ask = () => { s = siRand('y'); a.big(siSys(s.e1, s.e2)); a.msg(''); a.work(null); };
    a.$('[data-k="ops"]').addEventListener('click', (e) => {
      const b = e.target.closest('.btn'); if (!b) return;
      const k = +b.dataset.o, [A, B, C] = s.e1, [D, E, F] = s.e2;
      const r = [A + k * D, B + k * E, C + k * F];
      if (r[1] !== 0) { a.big(siSys(s.e1, s.e2, siEq(r))); a.msg(`The \\(y\\) terms did not cancel: \\(${B} ${k > 0 ? '+' : '-'} (${E}) = ${r[1]}\\). Try the other one.`, 'bad'); return; }
      a.big(siSys(s.e1, s.e2, `${siTerm(r[0], 'x', true)} &= ${r[2]}`));
      a.msg(`✓ The \\(y\\)'s cancel (${Math.sign(B) === Math.sign(E) ? 'same signs: subtract' : 'different signs: add'}). So \\(x = ${s.x}\\), and substituting gives \\(y = ${s.y}\\).`);
    });
    a.$('[data-k="new"]').addEventListener('click', ask);
    a.onTry = ask;
    return a;
  },
  steps: [
    {
      title: 'Two equations, two unknowns',
      text: '<p>\\(x + y = 10\\) has lots of solutions: 3 and 7, 4 and 6… \\(x - y = 4\\) also has lots.</p><p>Only <b>one pair</b> fits both: \\(x = 7, y = 3\\). Finding it is solving <b>simultaneous equations</b>.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(siSys([1, 1, 10], [1, -1, 4])); for (const [x, y] of [[3, 7], [5, 5], [7, 3]]) { a.msg(`\\(x = ${x}, y = ${y}\\): first ${x + y === 10 ? '✓' : '✗'}, second ${x - y === 4 ? '✓' : '✗'}`, x - y === 4 ? 'good' : 'bad'); if (!(await ctx.sleep(1200))) return; } },
    },
    {
      title: 'Add to eliminate',
      text: '<p>The \\(y\\) terms are \\(+y\\) and \\(-y\\): <b>different signs</b>. Adding the equations makes them cancel.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(siSys([1, 1, 10], [1, -1, 4]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([1, 1, 10], [1, -1, 4], '2x &= 14'));
        a.work([['x = 7', '÷ 2'], ['7 + y = 10 \\Rightarrow y = 3', 'substitute into the first'], ['\\text{Check: } 7 - 3 = 4 \\;\\checkmark', 'use the other equation']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Subtract to eliminate',
      text: '<p>\\(3x + 2y = 16\\) and \\(x + 2y = 8\\). Both have \\(+2y\\): the <b>same sign</b>. Subtract to cancel them.</p>',
      tip: 'Same Signs Subtract. Different signs: add.',
      async on(a, ctx) {
        a.tryMode(false); a.big(siSys([3, 2, 16], [1, 2, 8]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([3, 2, 16], [1, 2, 8], '2x &= 8'));
        a.work([['x = 4', ''], ['4 + 2y = 8 \\Rightarrow y = 2', 'substitute'], ['\\text{Check: } 3(4) + 2(2) = 16 \\;\\checkmark', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: add or subtract?',
      text: '<p>Look at the signs of the matching \\(y\\) terms. Choose <b>add</b> or <b>subtract</b> to eliminate \\(y\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

const siGen = (same) => () => { const s = siRand(same); return { type: 'num', q: `Solve the simultaneous equations \\(${siEq(s.e1).replace('&', '')}\\) and \\(${siEq(s.e2).replace('&', '')}\\).`, a: [s.x, s.y], fields: ['\\(x\\) =', '\\(y\\) ='], why: `Eliminate one letter, solve for the other, then substitute back: \\(x = ${s.x}\\), \\(y = ${s.y}\\). Check in both equations.` }; };
FD.practice({ section: 'elimination', gens: [siGen('y'), siGen('x')] });

FD.check({
  section: 'elimination',
  items: [
    { type: 'num', q: 'Solve \\(x + y = 12\\) and \\(x - y = 2\\).', a: [7, 5], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'Add: \\(2x = 14\\), \\(x = 7\\), \\(y = 5\\).' },
    { type: 'num', q: 'Solve \\(4x + 3y = 22\\) and \\(x + 3y = 13\\).', a: [3, 10 / 3], fields: ['\\(x\\) =', '\\(y\\) ='], tol: 0.01, show: '\\(x = 3, y = \\tfrac{10}{3}\\)', why: 'Subtract: \\(3x = 9\\), \\(x = 3\\). \\(3 + 3y = 13\\), \\(y = \\frac{10}{3}\\).' },
    { type: 'mcq', q: 'To eliminate \\(y\\) from \\(5x - 2y = 1\\) and \\(3x + 2y = 15\\) you should…', opts: ['add the equations', 'subtract the equations', 'multiply both by 2', 'divide by \\(y\\)'], why: '\\(-2y\\) and \\(+2y\\) have different signs: add.' },
    { type: 'tf', q: '\\(x = 2, y = 1\\) is the solution of \\(x + y = 3\\) and \\(2x - y = 4\\).', a: false, why: '\\(2(2) - 1 = 3\\), not 4. The solution is \\(x = \\frac73\\), \\(y = \\frac23\\).' },
  ],
});
