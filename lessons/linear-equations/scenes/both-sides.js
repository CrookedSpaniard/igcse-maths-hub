// Unknowns on both sides: take the smaller x term away from both sides (shown on the balance).
FD.add({
  id: 'both-sides',
  title: 'Unknowns on both sides and brackets',
  tab: 'Both sides',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Unknowns on both sides', 'An equation like \\(5x + 2 = 2x + 14\\) with \\(x\\) on the left and the right.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'le-bs',
      vis: '<div class="bal-host" data-k="bal"></div>',
      tryHtml: `<p class="ab-ask">\\(5x + 2 = 2x + 14\\) · test a value of \\(x\\)</p>
        <label class="ctrl">\\(x\\) = <input type="range" data-k="x" min="0" max="8" value="1"><output data-k="ox">1</output></label>`,
    });
    const bal = FD.balance(a.$('[data-k="bal"]'));
    a.bal = bal;
    const st = { lx: 5, ln: 2, rx: 2, rn: 14 };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = x;
      bal(st, 4, x);
      const L = 5 * x + 2, R = 2 * x + 14;
      a.big(`5(${x}) + 2 = ${L}, \\quad 2(${x}) + 14 = ${R}`);
      a.msg(L === R ? `✓ Level! \\(x = ${x}\\) is the solution.` : L > R ? 'The left side is heavier: try a smaller value.' : 'The right side is heavier: try a bigger value.', L === R ? 'good' : 'bad');
    };
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'x on both pans',
      text: '<p>\\(5x + 2 = 2x + 14\\). There are bags of \\(x\\) on both sides.</p><p>Take <b>2 bags</b> off both pans (the smaller number of \\(x\\)\'s). The scales stay level.</p>',
      async on(a, ctx) {
        a.tryMode(false);
        const seq = [[{ lx: 5, ln: 2, rx: 2, rn: 14 }, '5x + 2 = 2x + 14'], [{ lx: 3, ln: 2, rx: 0, rn: 12 }, '3x + 2 = 12'], [{ lx: 3, ln: 0, rx: 0, rn: 12 }, '3x = 12'], [{ lx: 1, ln: 0, rx: 0, rn: 4 }, 'x = 4']];
        for (const [s, t] of seq) { a.bal(s, 4); a.big(t); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Move the smaller x term',
      text: '<p>Subtract the <b>smaller</b> \\(x\\) term from both sides. That keeps the \\(x\\) term positive.</p>',
      tip: 'With \\(2x + 9 = 7x - 1\\), take \\(2x\\) from both sides: \\(9 = 5x - 1\\).',
      on: FD.walk([['5x + 2 = 2x + 14', ''], ['3x + 2 = 14', '− 2x both sides'], ['3x = 12', '− 2 both sides'], ['x = 4', '÷ 3']], (a) => { a.bal({ lx: 1, ln: 0, rx: 0, rn: 4 }, 4); a.big(''); }),
    },
    {
      title: 'Brackets first',
      text: '<p>If there are brackets, <b>expand</b> them first. Then solve as before.</p>',
      on: FD.walk([['3(2x - 1) = 2(x + 5)', ''], ['6x - 3 = 2x + 10', 'expand'], ['4x - 3 = 10', '− 2x'], ['4x = 13', '+ 3'], ['x = \\frac{13}{4} = 3.25', '÷ 4']], (a) => { a.bal({ lx: 1, ln: 0, rx: 0, rn: 3 }, 3); a.big(''); }, 1300),
    },
    {
      title: 'Try it: find the level point',
      text: '<p>Move the slider to test values of \\(x\\). The scales show which side is heavier. Find the value that makes them level.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'both-sides',
  gens: [
    () => { let a, c, x, b, d; do { a = FD.rnd(2, 9); c = FD.rnd(1, 8); x = FD.rndNZ(-8, 10); b = FD.rndNZ(-12, 12); d = (a - c) * x + b; } while (a === c || Math.abs(d) > 40); return { type: 'num', q: `Solve \\(${a}x${FD.sg(b)} = ${c === 1 ? '' : c}x${FD.sg(d)}\\)`, a: x, why: `${a > c ? `Subtract \\(${c === 1 ? '' : c}x\\)` : `Subtract \\(${a}x\\)`} from both sides, then solve: \\(${a - c}x = ${d - b}\\), so \\(x = ${x}\\).` }; },
    () => { let p, q, r, s; do { p = FD.rnd(2, 5); q = FD.rndNZ(-6, 6); r = FD.rnd(2, 5); s = FD.rndNZ(-6, 6); } while (p === r); const xs = (r * s - p * q) / (p - r); return { type: 'num', q: `Solve \\(${p}(x${FD.sg(q)}) = ${r}(x${FD.sg(s)})\\)`, a: xs, tol: 0.01, show: `\\(${FD.ftex(r * s - p * q, p - r)}\\)`, hint: 'A fraction or decimal is fine.', why: `Expand: \\(${p}x${FD.sg(p * q)} = ${r}x${FD.sg(r * s)}\\). Collect: \\(${p - r}x = ${r * s - p * q}\\). So \\(x = ${FD.ftex(r * s - p * q, p - r)}\\).` }; },
  ],
});

FD.check({
  section: 'both-sides',
  items: [
    { type: 'num', q: 'Solve \\(7x - 3 = 4x + 12\\)', a: 5, why: '\\(3x - 3 = 12\\), \\(3x = 15\\).' },
    { type: 'num', q: 'Solve \\(2x + 11 = 6x - 1\\)', a: 3, why: '\\(11 = 4x - 1\\), \\(12 = 4x\\).' },
    { type: 'num', q: 'Solve \\(4(x + 3) = 2(x - 1)\\)', a: -7, why: '\\(4x + 12 = 2x - 2\\), \\(2x = -14\\).' },
    { type: 'mcq', q: 'In \\(3x + 8 = 9x - 4\\), which is the best first step?', opts: ['Subtract \\(3x\\) from both sides', 'Subtract \\(9x\\) from both sides', 'Divide by 3', 'Add \\(3x\\) to both sides'], why: 'Taking away the smaller \\(x\\) term keeps the \\(x\\) term positive.' },
  ],
});
