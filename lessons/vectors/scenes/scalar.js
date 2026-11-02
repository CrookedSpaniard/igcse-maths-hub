// Multiplying a vector by a scalar: copies end to end, reversing, halving, and spotting parallel vectors.
FD.add({
  id: 'scalar',
  title: 'Multiplying by a scalar',
  tab: 'Scalar multiples',
  icon: 'vector',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Scalar multiple', '\\(k\\mathbf{a}\\): multiply both numbers of \\(\\mathbf{a}\\) by \\(k\\). \\(k\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} kx \\\\ ky \\end{pmatrix}\\).'],
    ['Parallel vectors', 'Vectors that are multiples of each other, so they point the same way (or exactly the opposite way).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 've-s', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<label class="ctrl">Scalar \\(k\\) <input type="range" data-k="k" min="-3" max="3" step="0.5" value="2"><output data-k="ok">2</output></label>',
    });
    const g = FD.vecG(a, 'A vector and a multiple of it');
    a.g = g;
    const sync = () => {
      const k = +a.$('[data-k="k"]').value;
      a.$('[data-k="ok"]').textContent = FD.mn(k);
      g.draw(FD.vArrow(g, 1, 1, 3, 2, 'v1', 'a') + FD.vArrow(g, 6 - k, 4 - k / 2, 6 + k, 4 + k / 2, 'v2', `${k === 1 ? '' : k === -1 ? '−' : FD.mn(k)}a`));
      a.big(`${k}\\mathbf{a} = ${k}${FD.cv(2, 1)} = ${FD.cv(2 * k, k)}`);
      a.msg(k > 0 ? (k > 1 ? 'Same direction, longer.' : k === 1 ? 'The same vector.' : 'Same direction, shorter.') : k < 0 ? 'Opposite direction: a negative scalar turns the arrow round.' : 'The zero vector: no movement.');
    };
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    g.draw(FD.vArrow(g, 1, 3, 3, 4, 'v1', 'a'));
    return a;
  },
  steps: [
    {
      title: '2a is a twice',
      text: '<p>\\(2\\mathbf{a}\\) means \\(\\mathbf{a}\\) followed by \\(\\mathbf{a}\\) again: the same direction, twice as long.</p><p>\\(2\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 2 \\end{pmatrix}\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.msg(''); a.big(`\\mathbf{a} = ${FD.cv(2, 1)}`);
        const one = FD.vArrow(a.g, 1, 3, 3, 4, 'v1', 'a');
        a.g.draw(one); if (!(await ctx.sleep(800))) return;
        a.g.draw(one + FD.vArrow(a.g, 3, 4, 5, 5, 'v1', 'a')); if (!(await ctx.sleep(900))) return;
        a.g.draw(one + FD.vArrow(a.g, 3, 4, 5, 5, 'v1', 'a') + FD.vArrow(a.g, 6, 1, 10, 3, 'v2', '2a'));
        a.big(`2\\mathbf{a} = ${FD.cv(4, 2)}`);
      },
    },
    {
      title: 'Multiply both numbers',
      text: '<p>To multiply a column vector by a number (a <b>scalar</b>), multiply the top and the bottom.</p>',
      async on(a) { a.tryMode(false); a.g.draw(FD.vArrow(a.g, 1, 3, 3, 4, 'v1', 'a') + FD.vArrow(a.g, 4, 2, 10, 5, 'v2', '3a')); a.big(`3${FD.cv(2, 1)} = ${FD.cv('3 \\times 2', '3 \\times 1')} = ${FD.cv(6, 3)}`); a.msg(''); },
    },
    {
      title: 'Negative and fractional scalars',
      text: '<p>A <b>negative</b> scalar turns the vector round. A <b>fraction</b> makes it shorter.</p><p>With \\(\\mathbf{b} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}\\): \\(-\\mathbf{b} = \\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}\\) and \\(\\tfrac12\\mathbf{b} = \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix}\\).</p>',
      async on(a) {
        a.tryMode(false); a.msg('');
        a.g.draw(FD.vArrow(a.g, 1, 6, 5, 4, 'v1', 'b') + FD.vArrow(a.g, 11, 4, 7, 6, 'v2', '−b') + FD.vArrow(a.g, 5, 2, 7, 1, 'v3', '½b'));
        a.big(`\\tfrac12 ${FD.cv(4, -2)} = ${FD.cv(2, -1)}`);
      },
    },
    {
      title: 'Parallel vectors',
      text: '<p>If one vector is a multiple of another, they are <b>parallel</b>.</p><p>\\(\\begin{pmatrix} 6 \\\\ -3 \\end{pmatrix} = 3\\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix}\\), so these two vectors are parallel, and the first is 3 times as long.</p>',
      tip: 'Check: divide top by top and bottom by bottom. If you get the same number, the vectors are parallel.',
      async on(a) { a.tryMode(false); a.g.draw(FD.vArrow(a.g, 1, 6, 3, 5, 'v1', 'a') + FD.vArrow(a.g, 4, 7, 10, 4, 'v2', '3a') + FD.vArrow(a.g, 3, 3, 5, 2, 'v1', 'a')); a.big(`${FD.cv(6, -3)} = 3${FD.cv(2, -1)}`); a.msg('Same direction, so parallel.'); },
    },
    {
      title: 'Try it: change k',
      text: '<p>Move the slider to change \\(k\\). Watch \\(k\\mathbf{a}\\) stretch, shrink and turn round, but always stay parallel to \\(\\mathbf{a}\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'scalar',
  gens: [
    () => {
      const k = FD.pick([-3, -2, 2, 3, 4, 5]), x = FD.rndNZ(-6, 6), y = FD.rndNZ(-6, 6);
      return { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(x, y)}\\). Find \\(${k}\\mathbf{a}\\).`, a: [k * x, k * y], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(k * x, k * y)}\\)`, why: `Multiply both numbers by ${FD.mn(k)}: \\(${FD.cv(`${k} \\times ${x < 0 ? `(${x})` : x}`, `${k} \\times ${y < 0 ? `(${y})` : y}`)} = ${FD.cv(k * x, k * y)}\\).` };
    },
    () => {
      const x = 2 * FD.rndNZ(-4, 4), y = 2 * FD.rndNZ(-4, 4);
      return { type: 'num', q: `\\(\\mathbf{b} = ${FD.cv(x, y)}\\). Find \\(\\tfrac12\\mathbf{b}\\).`, a: [x / 2, y / 2], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(x / 2, y / 2)}\\)`, why: `Halve both numbers: \\(${FD.cv(x / 2, y / 2)}\\).` };
    },
    () => {
      const x = FD.rndNZ(-5, 5), y = FD.rndNZ(-5, 5), k = FD.pick([-4, -3, -2, 2, 3, 4, 5]);
      return { type: 'num', q: `\\(${FD.cv(k * x, k * y)} = k${FD.cv(x, y)}\\). Find \\(k\\).`, a: k, why: `\\(${k * x} \\div ${x < 0 ? `(${x})` : x} = ${k}\\) and \\(${k * y} \\div ${y < 0 ? `(${y})` : y} = ${k}\\). So \\(k = ${k}\\).` };
    },
    () => {
      let x, y;
      do { x = FD.rndNZ(-4, 4); y = FD.rndNZ(-4, 4); } while (Math.abs(x) === Math.abs(y));
      const k = FD.pick([-3, -2, 2, 3]);
      return { type: 'mcq', q: `Which vector is parallel to \\(${FD.cv(x, y)}\\)?`, opts: [`\\(${FD.cv(k * x, k * y)}\\)`, `\\(${FD.cv(k * x, -k * y)}\\)`, `\\(${FD.cv(k * y, k * x)}\\)`, `\\(${FD.cv(x + k, y + k)}\\)`], why: `\\(${FD.cv(k * x, k * y)} = ${k}${FD.cv(x, y)}\\): a multiple, so parallel.` };
    },
  ],
});

FD.check({
  section: 'scalar',
  items: [
    { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(3, -2)}\\). Find \\(4\\mathbf{a}\\).`, a: [12, -8], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(12, -8)}\\)`, why: 'Multiply both numbers by 4.' },
    { type: 'num', q: `\\(\\mathbf{c} = ${FD.cv(-5, 1)}\\). Find \\(-3\\mathbf{c}\\).`, a: [15, -3], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(15, -3)}\\)`, why: '\\(-3 \\times -5 = 15\\) and \\(-3 \\times 1 = -3\\).' },
    { type: 'tf', q: '\\(-2\\mathbf{a}\\) is parallel to \\(\\mathbf{a}\\).', a: true, why: 'It is a multiple of \\(\\mathbf{a}\\); it just points the opposite way.' },
    { type: 'mcq', q: `Which vector is parallel to \\(${FD.cv(1, 4)}\\)?`, opts: [`\\(${FD.cv(3, 12)}\\)`, `\\(${FD.cv(4, 1)}\\)`, `\\(${FD.cv(3, 7)}\\)`, `\\(${FD.cv(-1, 4)}\\)`], why: `\\(${FD.cv(3, 12)} = 3${FD.cv(1, 4)}\\).` },
    { type: 'num', q: `\\(${FD.cv(-10, 15)} = k${FD.cv(2, -3)}\\). Find \\(k\\).`, a: -5, why: '\\(-10 \\div 2 = -5\\) and \\(15 \\div -3 = -5\\).' },
  ],
});
