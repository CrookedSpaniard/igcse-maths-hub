// The modulus (length) of a vector, from a right-angled triangle and Pythagoras.
FD.add({
  id: 'modulus',
  title: 'The modulus of a vector',
  tab: 'Modulus',
  icon: 'vector',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Modulus', 'The size (length) of a vector, written \\(|\\mathbf{a}|\\) or \\(|\\overrightarrow{AB}|\\).'],
    ['Formula', '\\(\\left|\\begin{pmatrix} x \\\\ y \\end{pmatrix}\\right| = \\sqrt{x^2 + y^2}\\): Pythagoras on the across and up parts.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 've-m', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Across \\(x\\) <input type="range" data-k="x" min="-8" max="8" value="4"><output data-k="ox">4</output></label>
        <label class="ctrl">Up \\(y\\) <input type="range" data-k="y" min="-8" max="8" value="3"><output data-k="oy">3</output></label>`,
    });
    const g = FD.vecG(a, 'A vector with its right-angled triangle');
    a.g = g;
    a.tri = (x, y, label = '') => {
      const x0 = 6 - x / 2, y0 = 4 - y / 2;
      g.draw(g.line(x0, y0, x0 + x, y0, 'g-line') + g.line(x0 + x, y0, x0 + x, y0 + y, 'g-line') + FD.vArrow(g, x0, y0, x0 + x, y0 + y, 'v1', label),
        (x ? g.lbl(x0 + x / 2 - 0.3, y0 - (y > 0 ? 0.35 : -0.75), FD.mn(Math.abs(x))) : '') + (y ? g.lbl(x0 + x + (x >= 0 ? 0.1 : -0.1), y0 + y / 2 - 0.2, FD.mn(Math.abs(y))) : ''));
    };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value;
      a.$('[data-k="ox"]').textContent = FD.mn(x); a.$('[data-k="oy"]').textContent = FD.mn(y);
      a.tri(x, y);
      const s = x * x + y * y, r = Math.sqrt(s);
      a.big(`\\left|${FD.cv(x, y)}\\right| = \\sqrt{${x < 0 ? `(${x})` : x}^2 + ${y < 0 ? `(${y})` : y}^2} = \\sqrt{${s}}${Number.isInteger(r) ? ` = ${r}` : ` = ${FD.num(FD.round(r, 2))}`}`);
      a.msg(Number.isInteger(r) ? 'An exact whole number.' : 'Not a whole number: give it to 3 significant figures, or leave it as a square root.');
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.tri(4, 3, 'a');
    return a;
  },
  steps: [
    {
      title: 'The length of the arrow',
      text: '<p>The <b>modulus</b> of a vector is its size: the length of the arrow. We write it with straight lines: \\(|\\mathbf{a}|\\).</p>',
      async on(a) { a.tryMode(false); a.tri(4, 3, 'a'); a.big(`\\mathbf{a} = ${FD.cv(4, 3)}, \\quad |\\mathbf{a}| = \\; ?`); a.msg(''); },
    },
    {
      title: 'Pythagoras',
      text: '<p>The across and up parts make a right-angled triangle. The vector is the hypotenuse, so use <b>Pythagoras</b>.</p>',
      on: FD.walk([
      ['\\text{across } 4, \\; \\text{up } 3', 'The arrow is the hypotenuse.'],
      ['|\\mathbf{a}|^2 = 4^2 + 3^2', 'Pythagoras.'],
      ['|\\mathbf{a}|^2 = 16 + 9 = 25', ''],
      ['|\\mathbf{a}| = \\sqrt{25} = 5', 'The length of \\(\\mathbf{a}\\) is 5 units.'],
    ], (a) => { a.tri(4, 3, 'a'); a.big(''); }),
    },
    {
      title: 'Negative numbers',
      text: '<p>Squaring makes every number positive, so the signs do not matter for the length.</p><p>\\(\\left|\\begin{pmatrix} -6 \\\\ 8 \\end{pmatrix}\\right| = \\sqrt{36 + 64} = \\sqrt{100} = 10\\).</p>',
      tip: 'On a calculator, type (−6)² with brackets, or just use 6².',
      async on(a) { a.tryMode(false); a.tri(-6, 8); a.big('\\sqrt{(-6)^2 + 8^2} = \\sqrt{100} = 10'); a.msg(''); },
    },
    {
      title: 'Answers that are not whole numbers',
      text: '<p>\\(\\overrightarrow{AB} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}\\), so \\(|\\overrightarrow{AB}| = \\sqrt{9 + 4} = \\sqrt{13} = 3.61\\) (3 s.f.).</p><p>Leave it as \\(\\sqrt{13}\\) if the question asks for an exact answer.</p>',
      async on(a) { a.tryMode(false); a.tri(3, -2); a.big('\\sqrt{3^2 + (-2)^2} = \\sqrt{13} \\approx 3.61'); a.msg(''); },
    },
    {
      title: 'Try it: find the length',
      text: '<p>Change the vector. Can you find vectors with whole-number lengths, like \\(\\begin{pmatrix} 6 \\\\ 8 \\end{pmatrix}\\)?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

const VE_TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [8, 15, 17], [9, 12, 15]];
FD.practice({
  section: 'modulus',
  gens: [
    () => {
      const [p, q, r] = FD.pick(VE_TRIPLES), x = p * FD.pick([-1, 1]), y = q * FD.pick([-1, 1]);
      return { type: 'num', q: `Find the modulus of \\(${FD.cv(x, y)}\\).`, a: r, why: `\\(\\sqrt{${x < 0 ? `(${x})` : x}^2 + ${y < 0 ? `(${y})` : y}^2} = \\sqrt{${p * p} + ${q * q}} = \\sqrt{${r * r}} = ${r}\\).` };
    },
    () => {
      let x, y, s;
      do { x = FD.rndNZ(-7, 7); y = FD.rndNZ(-7, 7); s = x * x + y * y; } while (Number.isInteger(Math.sqrt(s)));
      const r = FD.sigfig(Math.sqrt(s), 3);
      return { type: 'num', q: `\\(\\mathbf{v} = ${FD.cv(x, y)}\\). Find \\(|\\mathbf{v}|\\). Give your answer to 3 significant figures.`, a: r, tol: 0.006, why: `\\(\\sqrt{${x * x} + ${y * y}} = \\sqrt{${s}} = ${FD.num(r)}\\) (3 s.f.).` };
    },
    () => {
      const [p, q, r] = FD.pick(VE_TRIPLES), x1 = FD.rnd(-4, 4), y1 = FD.rnd(-4, 4), x2 = x1 + p * FD.pick([-1, 1]), y2 = y1 + q * FD.pick([-1, 1]);
      return { type: 'num', q: `\\(A\\) is \\((${x1}, ${y1})\\) and \\(B\\) is \\((${x2}, ${y2})\\). Find \\(|\\overrightarrow{AB}|\\).`, a: r, why: `\\(\\overrightarrow{AB} = ${FD.cv(x2 - x1, y2 - y1)}\\), so \\(|\\overrightarrow{AB}| = \\sqrt{${p * p} + ${q * q}} = ${r}\\).` };
    },
    () => {
      const [p, q, r] = FD.pick(VE_TRIPLES.slice(0, 5)), k = FD.pick([2, 3, -2, -3]);
      return { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(p, -q)}\\). Find \\(|${k}\\mathbf{a}|\\).`, a: Math.abs(k) * r, why: `\\(|\\mathbf{a}| = ${r}\\). Multiplying by ${FD.mn(k)} makes it ${Math.abs(k)} times as long (the sign only changes the direction): \\(${Math.abs(k)} \\times ${r} = ${Math.abs(k) * r}\\).` };
    },
  ],
});

FD.check({
  section: 'modulus',
  items: [
    { type: 'num', q: `Find \\(\\left|${FD.cv(6, 8)}\\right|\\).`, a: 10, why: '\\(\\sqrt{36 + 64} = \\sqrt{100} = 10\\).' },
    { type: 'num', q: `Find \\(\\left|${FD.cv(-12, 5)}\\right|\\).`, a: 13, why: '\\(\\sqrt{144 + 25} = 13\\).' },
    { type: 'num', q: `\\(\\mathbf{p} = ${FD.cv(2, -5)}\\). Find \\(|\\mathbf{p}|\\) to 3 significant figures.`, a: 5.39, tol: 0.006, why: '\\(\\sqrt{4 + 25} = \\sqrt{29} = 5.39\\).' },
    { type: 'mcq', q: 'The modulus of a vector tells you its…', opts: ['length', 'direction', 'gradient', 'starting point'], why: 'The modulus is the size of the vector.' },
    { type: 'tf', q: '\\(|-\\mathbf{a}| = |\\mathbf{a}|\\)', a: true, why: '\\(-\\mathbf{a}\\) points the other way but has the same length.' },
  ],
});
