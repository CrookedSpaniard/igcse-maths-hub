// Equations with fractions: multiply both sides (every term) to clear the denominators.
FD.add({
  id: 'eq-fractions',
  title: 'Equations with fractions',
  tab: 'Fractions',
  icon: 'frac',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Clear the fraction', 'Multiply both sides by the denominator so the fraction disappears.'],
    ['Cross-multiply', 'For \\(\\frac{a}{b} = \\frac{c}{d}\\): \\(ad = bc\\). It is the same as multiplying both sides by \\(b\\) and \\(d\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'le-f',
      tryHtml: `<label class="ctrl">\\(\\frac{x + p}{d} = r\\): p <input type="range" data-k="p" min="-9" max="9" value="3"><output data-k="op">3</output></label>
        <label class="ctrl">d <input type="range" data-k="d" min="2" max="9" value="4"><output data-k="od">4</output></label>
        <label class="ctrl">r <input type="range" data-k="r" min="-6" max="9" value="5"><output data-k="or">5</output></label>`,
    });
    const sync = () => {
      const [p, d, r] = ['p', 'd', 'r'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['p', 'd', 'r'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([p, d, r][i]).replace('-', '−'); });
      a.big(`\\frac{${FD.poly([1, p])}}{${d}} = ${r}`);
      a.work([[`${FD.poly([1, p])} = ${r * d}`, `× ${d} both sides`], [`x = ${r * d - p}`, `${p >= 0 ? '−' : '+'} ${Math.abs(p)}`]]);
      a.upto(1);
    };
    ['p', 'd', 'r'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'One fraction',
      text: '<p>\\(\\frac{x + 3}{4} = 5\\). The whole of \\(x + 3\\) is divided by 4. Undo it first: <b>multiply both sides by 4</b>.</p>',
      on: FD.walk([['\\frac{x + 3}{4} = 5', ''], ['x + 3 = 20', '× 4 both sides'], ['x = 17', '− 3']], (a) => a.big('')),
    },
    {
      title: 'A fraction on each side',
      text: '<p>\\(\\frac{2x - 1}{3} = \\frac{x + 4}{2}\\). Multiply both sides by 3 <b>and</b> by 2 (that is, by 6). This is <b>cross-multiplying</b>.</p>',
      tip: 'Keep the brackets when you cross-multiply: \\(2(2x - 1)\\), not \\(4x - 1\\).',
      on: FD.walk([['\\frac{2x - 1}{3} = \\frac{x + 4}{2}', ''], ['2(2x - 1) = 3(x + 4)', 'cross-multiply'], ['4x - 2 = 3x + 12', 'expand'], ['x = 14', '− 3x, + 2']], (a) => a.big(''), 1400),
    },
    {
      title: 'Two fractions on one side',
      text: '<p>\\(\\frac{x}{2} + \\frac{x}{5} = 7\\). Multiply <b>every term</b> by 10, the lowest common multiple of 2 and 5.</p>',
      on: FD.walk([['\\frac{x}{2} + \\frac{x}{5} = 7', ''], ['5x + 2x = 70', '× 10, every term'], ['7x = 70', ''], ['x = 10', '']], (a) => a.big(''), 1300),
    },
    {
      title: 'Try it: one fraction',
      text: '<p>Change \\(p\\), \\(d\\) and \\(r\\) in \\(\\frac{x + p}{d} = r\\). The two steps are always: multiply by \\(d\\), then undo the \\(p\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'eq-fractions',
  gens: [
    () => { const d = FD.rnd(2, 9), r = FD.rndNZ(-6, 9), p = FD.rndNZ(-9, 9), x = r * d - p; return { type: 'num', q: `Solve \\(\\dfrac{${FD.poly([1, p])}}{${d}} = ${r}\\)`, a: x, why: `× ${d}: \\(${FD.poly([1, p])} = ${r * d}\\). Then \\(x = ${x}\\).` }; },
    () => { let k, d, p, q; do { k = FD.rnd(2, 5); d = FD.rnd(2, 5); p = FD.rndNZ(-6, 6); q = FD.rndNZ(-6, 6); } while (k === d || k * k === d || d * q === k * p); return { type: 'num', q: `Solve \\(\\dfrac{${FD.poly([k, p])}}{${d}} = \\dfrac{${FD.poly([1, q])}}{${k}}\\)`, a: (d * q - k * p) / (k * k - d), tol: 0.01, show: `\\(${FD.ftex(d * q - k * p, k * k - d)}\\)`, hint: 'A fraction or decimal is fine.', why: `Cross-multiply: \\(${k}(${FD.poly([k, p])}) = ${d}(${FD.poly([1, q])})\\). Expand: \\(${FD.poly([k * k, k * p])} = ${FD.poly([d, d * q])}\\). So \\(${k * k - d}x = ${d * q - k * p}\\) and \\(x = ${FD.ftex(d * q - k * p, k * k - d)}\\).` }; },
    () => { let m, n, x; do { m = FD.rnd(2, 6); n = FD.rnd(2, 6); x = FD.rnd(1, 6) * FD.lcm(m, n); } while (m === n); const s = x / m + x / n; return { type: 'num', q: `Solve \\(\\dfrac{x}{${m}} + \\dfrac{x}{${n}} = ${s}\\)`, a: x, why: `Multiply every term by ${FD.lcm(m, n)}: \\(${FD.lcm(m, n) / m}x + ${FD.lcm(m, n) / n}x = ${s * FD.lcm(m, n)}\\), so \\(${FD.lcm(m, n) / m + FD.lcm(m, n) / n}x = ${s * FD.lcm(m, n)}\\) and \\(x = ${x}\\).` }; },
  ],
});

FD.check({
  section: 'eq-fractions',
  items: [
    { type: 'num', q: 'Solve \\(\\frac{x - 2}{5} = 3\\)', a: 17, why: '\\(x - 2 = 15\\).' },
    { type: 'num', q: 'Solve \\(\\frac{3x + 1}{4} = 7\\)', a: 9, why: '\\(3x + 1 = 28\\), \\(3x = 27\\).' },
    { type: 'num', q: 'Solve \\(\\frac{x + 1}{2} = \\frac{x + 5}{3}\\)', a: 7, why: '\\(3(x + 1) = 2(x + 5)\\), \\(3x + 3 = 2x + 10\\).' },
    { type: 'mcq', q: 'To solve \\(\\frac{x}{4} - \\frac{x}{6} = 2\\), multiply every term by…', opts: ['12', '24', '10', '2'], why: 'The LCM of 4 and 6 is 12.' },
  ],
});
