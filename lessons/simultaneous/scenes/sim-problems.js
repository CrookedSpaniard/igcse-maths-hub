// Substitution and word problems: two unknown prices from two shopping baskets.
FD.add({
  id: 'sim-problems',
  title: 'Substitution and problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Substitution method', 'When one equation says \\(y = \\dots\\), replace \\(y\\) in the other equation with that expression.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'si-p', side: true,
      vis: '<div class="si-bask" data-k="b"></div>',
      tryHtml: `<p class="ab-ask">Guess the prices: try to match both baskets.</p>
        <label class="ctrl">🍎 apple (p) <input type="range" data-k="x" min="10" max="80" step="5" value="30"><output data-k="ox">30</output></label>
        <label class="ctrl">🍌 banana (p) <input type="range" data-k="y" min="10" max="80" step="5" value="30"><output data-k="oy">30</output></label>`,
    });
    const B = a.$('[data-k="b"]');
    a.baskets = (x, y) => {
      const row = (n, m, tot) => `<div class="si-row"><span>${'🍎'.repeat(n)}${'🍌'.repeat(m)}</span><b>${tot}p</b>${x != null ? `<em class="${n * x + m * y === tot ? 'ok' : 'no'}">${n * x + m * y}p</em>` : ''}</div>`;
      B.innerHTML = row(3, 2, 190) + row(1, 4, 180);
    };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value;
      a.$('[data-k="ox"]').textContent = x; a.$('[data-k="oy"]').textContent = y;
      a.baskets(x, y);
      const ok = 3 * x + 2 * y === 190 && x + 4 * y === 180;
      a.msg(ok ? '✓ Both baskets match: apples 40p, bananas 35p.' : 'Each guess is checked against both baskets. Algebra finds it straight away!', ok ? 'good' : 'bad');
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.baskets();
    return a;
  },
  steps: [
    {
      title: 'Substitution',
      text: '<p>If one equation is already “\\(y = \\dots\\)”, put that expression into the other equation.</p><p>\\(y = 2x - 1\\) and \\(3x + y = 14\\).</p>',
      on: FD.walk([['3x + (2x - 1) = 14', 'replace y'], ['5x - 1 = 14 \\Rightarrow x = 3', ''], ['y = 2(3) - 1 = 5', 'substitute back']], (a) => { a.baskets(); a.big('y = 2x - 1, \\quad 3x + y = 14'); }, 1400),
    },
    {
      title: 'Problems: two unknowns, two facts',
      text: '<p>3 apples and 2 bananas cost 190p. 1 apple and 4 bananas cost 180p. Let an apple cost \\(a\\) and a banana \\(b\\).</p>',
      on: FD.walk([['3a + 2b = 190', 'first basket'], ['a + 4b = 180', 'second basket'], ['6a + 4b = 380', 'first × 2'], ['5a = 200 \\Rightarrow a = 40', 'subtract'], ['40 + 4b = 180 \\Rightarrow b = 35', '']], (a) => { a.baskets(); a.big(''); }, 1300),
    },
    {
      title: 'Answer the question',
      text: '<p>Write the answer in words, with units: an apple costs 40p and a banana costs 35p. Check with the first basket: \\(3(40) + 2(35) = 190\\) ✓.</p>',
      async on(a) { a.tryMode(false); a.baskets(40, 35); a.big(''); a.work(null); },
    },
    {
      title: 'Try it: guess and check',
      text: '<p>Move the sliders to guess the two prices. Both baskets must match. Notice how hard guessing is, and how quickly the algebra found the answer.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'sim-problems',
  gens: [
    () => { let x, m, c, p, q; do { x = FD.rndNZ(-5, 7); m = FD.rndNZ(-4, 4); c = FD.rndNZ(-6, 6); p = FD.rnd(1, 5); q = FD.rndNZ(-4, 4); } while (p + q * m === 0); const y = m * x + c, r = p * x + q * y; return { type: 'num', q: `Solve \\(y = ${FD.poly([m, c])}\\) and \\(${p === 1 ? '' : p}x${q < 0 ? ' - ' : ' + '}${Math.abs(q) === 1 ? '' : Math.abs(q)}y = ${r}\\).`, a: [x, y], fields: ['\\(x\\) =', '\\(y\\) ='], why: `Substitute: \\(${p}x ${q < 0 ? '-' : '+'} ${Math.abs(q)}(${FD.poly([m, c])}) = ${r}\\), so \\(${p + q * m}x = ${r - q * c}\\), \\(x = ${x}\\). Then \\(y = ${y}\\).` }; },
    () => { const [i1, i2] = FD.pick([['adult ticket', 'child ticket'], ['pen', 'pencil'], ['coffee', 'cake']]), x = FD.rnd(3, 12), y = FD.rnd(1, x - 1), a1 = FD.rnd(1, 4), b1 = FD.rnd(1, 4); let a2, b2; do { a2 = FD.rnd(1, 4); b2 = FD.rnd(1, 4); } while (a1 * b2 === a2 * b1); return { type: 'num', q: `${a1} ${i1}${a1 > 1 ? 's' : ''} and ${b1} ${i2}${b1 > 1 ? 's' : ''} cost £${a1 * x + b1 * y}. ${a2} ${i1}${a2 > 1 ? 's' : ''} and ${b2} ${i2}${b2 > 1 ? 's' : ''} cost £${a2 * x + b2 * y}. Find the price of each.`, a: [x, y], fields: [`${i1} £`, `${i2} £`], why: `\\(${a1}a + ${b1}b = ${a1 * x + b1 * y}\\) and \\(${a2}a + ${b2}b = ${a2 * x + b2 * y}\\). Eliminate one letter: \\(a = ${x}\\), \\(b = ${y}\\).` }; },
  ],
});

FD.check({
  section: 'sim-problems',
  items: [
    { type: 'num', q: 'Solve \\(y = x + 3\\) and \\(2x + y = 12\\).', a: [3, 6], fields: ['\\(x\\) =', '\\(y\\) ='], why: '\\(2x + x + 3 = 12\\), \\(x = 3\\), \\(y = 6\\).' },
    { type: 'num', q: '2 burgers and 1 drink cost £11. 1 burger and 2 drinks cost £8.50. How much is a burger?', a: 4.5, unit: '', why: '\\(2b + d = 11\\), \\(b + 2d = 8.5\\). Double the second and subtract: \\(3d = 6\\), \\(d = 2\\), \\(b = 4.5\\).' },
    { type: 'mcq', q: 'The sum of two numbers is 30 and their difference is 8. What are they?', opts: ['19 and 11', '20 and 10', '22 and 8', '15 and 15'], why: '\\(x + y = 30\\), \\(x - y = 8\\): \\(2x = 38\\).' },
    { type: 'tf', q: 'In a problem, you only need to find \\(x\\); there is no need to find \\(y\\).', a: false, why: 'Usually the question asks for both, so find both and check.' },
  ],
});
