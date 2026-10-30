// Equations with fractions: multiply every term by the common denominator to clear the fractions.
FD.add({
  id: 'af-equations',
  title: 'Equations with algebraic fractions',
  tab: 'Equations',
  icon: 'frac',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Clear the fractions', 'Multiply <b>every term</b> on both sides by the common denominator so no fractions are left.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'af-e',
      tryHtml: `<p class="ab-ask">\\(\\dfrac{6}{x} + \\dfrac{6}{x + 3} = 3\\) · try values of \\(x\\)</p>
        <label class="ctrl">\\(x\\) = <input type="range" data-k="x" min="-8" max="8" value="1"><output data-k="ox">1</output></label>`,
    });
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = String(x).replace('-', '−');
      if (x === 0 || x === -3) { a.big(`x = ${x}`); a.msg('A denominator is 0 here, so this value is not allowed.', 'bad'); return; }
      const L = 6 / x + 6 / (x + 3);
      a.big(`\\frac{6}{${x}} + \\frac{6}{${x + 3}} = ${FD.round(L, 3)}`);
      a.msg(Math.abs(L - 3) < 1e-9 ? `✓ \\(x = ${x}\\) is a solution.` : `Not 3, so \\(x = ${x}\\) is not a solution.`, Math.abs(L - 3) < 1e-9 ? 'good' : 'bad');
    };
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Clear the fractions',
      text: '<p>\\(\\frac{x + 1}{3} + \\frac{x - 2}{4} = 5\\). The common denominator is 12. Multiply <b>every</b> term by 12, including the 5.</p>',
      on: FD.walk([['\\frac{x + 1}{3} + \\frac{x - 2}{4} = 5', ''], ['4(x + 1) + 3(x - 2) = 60', '× 12: every term'], ['4x + 4 + 3x - 6 = 60', 'expand'], ['7x - 2 = 60 \\Rightarrow x = \\frac{62}{7}', '']], (a) => a.big(''), 1500),
    },
    {
      title: 'Letters in the denominator',
      text: '<p>\\(\\frac{6}{x} + \\frac{6}{x + 3} = 3\\). Multiply every term by \\(x(x + 3)\\). This often gives a <b>quadratic</b>.</p>',
      tip: 'Check that your answers do not make a denominator zero.',
      on: FD.walk([['6(x + 3) + 6x = 3x(x + 3)', '× x(x + 3)'], ['12x + 18 = 3x^2 + 9x', ''], ['0 = 3x^2 - 3x - 18', ''], ['0 = 3(x - 3)(x + 2)', ''], ['x = 3 \\text{ or } x = -2', '']], (a) => a.big('\\frac{6}{x} + \\frac{6}{x + 3} = 3'), 1400),
    },
    {
      title: 'Try it: test the solutions',
      text: '<p>Move the slider to try values of \\(x\\) in \\(\\frac{6}{x} + \\frac{6}{x + 3} = 3\\).</p><p>Which two values make it true? Which values are not allowed?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'af-equations',
  gens: [
    () => { let m, n, x, p, q; do { m = FD.rnd(2, 5); n = FD.rnd(2, 6); x = FD.rnd(-6, 12); p = FD.rndNZ(-5, 5); q = FD.rndNZ(-5, 5); } while ((x + p) % m || (x + q) % n || m === n); const r = (x + p) / m + (x + q) / n; return { type: 'num', q: `Solve \\(\\dfrac{${FD.poly([1, p])}}{${m}} + \\dfrac{${FD.poly([1, q])}}{${n}} = ${r}\\)`, a: x, why: `Multiply every term by ${m * n}: \\(${n}(${FD.poly([1, p])}) + ${m}(${FD.poly([1, q])}) = ${r * m * n}\\). So \\(${FD.poly([m + n, n * p + m * q])} = ${r * m * n}\\), giving \\(x = ${x}\\).` }; },
    () => { const x = FD.rnd(2, 9), k = FD.pick([1, 2, 3]); const r = k * x + 1; return { type: 'num', q: `Solve \\(\\dfrac{${r}}{x} = ${k} + \\dfrac{1}{x}\\)`, a: x, why: `Multiply every term by \\(x\\): \\(${r} = ${k}x + 1\\), so \\(${k}x = ${r - 1}\\) and \\(x = ${x}\\).` }; },
  ],
});

FD.check({
  section: 'af-equations',
  items: [
    { type: 'num', q: 'Solve \\(\\frac{x}{2} + \\frac{x}{3} = 10\\)', a: 12, why: '× 6: \\(3x + 2x = 60\\), so \\(x = 12\\).' },
    { type: 'num', q: 'Solve \\(\\frac{2x - 1}{5} = \\frac{x + 4}{3}\\)', a: 23, why: '× 15: \\(3(2x - 1) = 5(x + 4)\\), \\(6x - 3 = 5x + 20\\), \\(x = 23\\).' },
    { type: 'num', q: 'Solve \\(\\frac{4}{x} + \\frac{2}{x} = 3\\)', a: 2, why: '\\(\\frac{6}{x} = 3\\), so \\(x = 2\\).' },
    { type: 'mcq', q: 'To clear the fractions in \\(\\frac{3}{x - 1} + \\frac{2}{x} = 1\\) you multiply every term by…', opts: ['\\(x(x - 1)\\)', '\\(x - 1\\)', '\\(5\\)', '\\(x\\)'], why: 'The common denominator of \\(x - 1\\) and \\(x\\).' },
  ],
});
