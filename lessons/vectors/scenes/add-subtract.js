// Adding vectors nose to tail, subtracting by adding the negative, resultants of several vectors.
FD.add({
  id: 'add-subtract',
  title: 'Adding, subtracting and resultants',
  tab: 'Add & subtract',
  icon: 'vector',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Resultant', 'The single vector that has the same effect as two or more vectors one after another.'],
    ['Nose to tail', 'Start the second arrow where the first one ends. The resultant goes from the very start to the very end.'],
    ['Subtracting', '\\(\\mathbf{a} - \\mathbf{b} = \\mathbf{a} + (-\\mathbf{b})\\): add the negative of \\(\\mathbf{b}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 've-a', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<span class="seg" data-k="op"><button data-v="+">a + b</button><button data-v="-">a − b</button></span>
        <label class="ctrl">\\(\\mathbf{b}\\) across <input type="range" data-k="x" min="-4" max="4" value="2"><output data-k="ox">2</output></label>
        <label class="ctrl">\\(\\mathbf{b}\\) up <input type="range" data-k="y" min="-3" max="3" value="-3"><output data-k="oy">−3</output></label>`,
    });
    const g = FD.vecG(a, 'Vectors added nose to tail');
    a.g = g;
    // a chain of vectors from (x0, y0): list of [x, y, cls, label]; the resultant is drawn last
    a.chain = (x0, y0, list, rLabel = '', upto = list.length) => {
      let x = x0, y = y0, s = '';
      list.slice(0, upto).forEach(([dx, dy, c, l]) => { s += FD.vArrow(g, x, y, x + dx, y + dy, c, l); x += dx; y += dy; });
      if (rLabel) s += FD.vArrow(g, x0, y0, x, y, 'vr', rLabel);
      g.draw(s);
    };
    let op = '+';
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value, s = op === '+' ? 1 : -1;
      a.$('[data-k="ox"]').textContent = FD.mn(x); a.$('[data-k="oy"]').textContent = FD.mn(y);
      FD.segSet(a.$('[data-k="op"]'), op);
      a.chain(3, 3, [[3, 1, 'v1', 'a'], [s * x, s * y, 'v2', s > 0 ? 'b' : '−b']], s > 0 ? 'a + b' : 'a − b');
      a.big(`${FD.cv(3, 1)} ${op === '+' ? '+' : '-'} ${FD.cv(x, y)} = ${FD.cv(3 + s * x, 1 + s * y)}`);
      a.msg(s > 0 ? 'Add the tops, add the bottoms.' : 'Subtract the tops, subtract the bottoms: the same as adding −b.');
    };
    a.$('[data-k="op"]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; op = b.dataset.v; sync(); });
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.chain(2, 3, [[3, 2, 'v1', 'a'], [2, -3, 'v2', 'b']], 'a + b');
    return a;
  },
  steps: [
    {
      title: 'Nose to tail',
      text: '<p>To add \\(\\mathbf{a}\\) and \\(\\mathbf{b}\\), follow \\(\\mathbf{a}\\), then start \\(\\mathbf{b}\\) where \\(\\mathbf{a}\\) ends.</p><p>The <b>resultant</b> \\(\\mathbf{a} + \\mathbf{b}\\) goes straight from the start to the finish.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(''); a.msg('');
        const L = [[3, 2, 'v1', 'a'], [2, -3, 'v2', 'b']];
        a.chain(2, 3, L, '', 1); if (!(await ctx.sleep(900))) return;
        a.chain(2, 3, L, '', 2); if (!(await ctx.sleep(900))) return;
        a.chain(2, 3, L, 'a + b');
      },
    },
    {
      title: 'Add the columns',
      text: '<p>With column vectors, add the tops and add the bottoms.</p><p>The resultant goes 5 right and 1 down, which matches the drawing.</p>',
      async on(a) { a.tryMode(false); a.chain(2, 3, [[3, 2, 'v1', 'a'], [2, -3, 'v2', 'b']], 'a + b'); a.big(`${FD.cv(3, 2)} + ${FD.cv(2, -3)} = ${FD.cv(5, -1)}`); a.msg(''); },
    },
    {
      title: 'Subtracting',
      text: '<p>\\(\\mathbf{a} - \\mathbf{b}\\) means \\(\\mathbf{a} + (-\\mathbf{b})\\): follow \\(\\mathbf{a}\\), then go <b>backwards</b> along \\(\\mathbf{b}\\).</p><p>Or just subtract the tops and the bottoms.</p>',
      async on(a) { a.tryMode(false); a.chain(2, 1, [[3, 2, 'v1', 'a'], [-2, 3, 'v2', '−b']], 'a − b'); a.big(`${FD.cv(3, 2)} - ${FD.cv(2, -3)} = ${FD.cv(1, 5)}`); a.msg(''); },
    },
    {
      title: 'The resultant of several vectors',
      text: '<p>A journey \\(A \\to B \\to C \\to D\\) has the same effect as going straight from \\(A\\) to \\(D\\):</p><p>\\(\\overrightarrow{AB} + \\overrightarrow{BC} + \\overrightarrow{CD} = \\overrightarrow{AD}\\).</p>',
      tip: 'The letters chain together: the end of one vector is the start of the next.',
      async on(a, ctx) {
        a.tryMode(false); a.msg(''); a.big('');
        const L = [[3, 2, 'v1'], [2, -3, 'v2'], [3, 3, 'v3']];
        for (let n = 1; n <= 3; n++) { a.chain(1, 3, L, '', n); if (!(await ctx.sleep(700))) return; }
        a.chain(1, 3, L, 'AD');
        a.g.draw(a.g.svg.querySelector('.g-clip').innerHTML, a.g.lbl(1, 3, 'A') + a.g.lbl(4, 5, 'B') + a.g.lbl(6, 2, 'C') + a.g.lbl(9, 5, 'D'));
        a.big(`${FD.cv(3, 2)} + ${FD.cv(2, -3)} + ${FD.cv(3, 3)} = ${FD.cv(8, 2)}`);
      },
    },
    {
      title: 'Combinations like 2a − 3b',
      text: '<p>Multiply first, then add or subtract. With \\(\\mathbf{a} = \\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}\\) and \\(\\mathbf{b} = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}\\):</p>',
      on: FD.walk([
        [`2\\mathbf{a} = ${FD.cv(6, 4)}`, 'Double both numbers.'],
        [`3\\mathbf{b} = ${FD.cv(6, -9)}`, 'Treble both numbers.'],
        [`2\\mathbf{a} - 3\\mathbf{b} = ${FD.cv('6 - 6', '4 - (-9)')} = ${FD.cv(0, 13)}`, 'Take care with the double negative.'],
      ], (a) => { a.chain(2, 3, [[3, 2, 'v1', 'a'], [2, -3, 'v2', 'b']]); a.big(''); }),
    },
    {
      title: 'Try it: a ± b',
      text: '<p>Change \\(\\mathbf{b}\\) and switch between adding and subtracting. Check that the resultant matches the column sum.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'add-subtract',
  gens: [
    () => {
      const p = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6)], q = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6)], s = FD.pick([1, -1]);
      const r = [p[0] + s * q[0], p[1] + s * q[1]], o = s > 0 ? '+' : '-';
      return { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(...p)}\\) and \\(\\mathbf{b} = ${FD.cv(...q)}\\). Find \\(\\mathbf{a} ${o} \\mathbf{b}\\).`, a: r, fields: ['Top', 'Bottom'], show: `\\(${FD.cv(...r)}\\)`, why: `\\(${FD.cv(`${p[0]} ${o} ${q[0] < 0 ? `(${q[0]})` : q[0]}`, `${p[1]} ${o} ${q[1] < 0 ? `(${q[1]})` : q[1]}`)} = ${FD.cv(...r)}\\).` };
    },
    () => {
      const p = [FD.rndNZ(-5, 5), FD.rndNZ(-5, 5)], q = [FD.rndNZ(-5, 5), FD.rndNZ(-5, 5)], m = FD.pick([2, 3]), n = FD.pick([2, 3, 4]), s = FD.pick([1, -1]);
      const r = [m * p[0] + s * n * q[0], m * p[1] + s * n * q[1]], o = s > 0 ? '+' : '-';
      return { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(...p)}\\) and \\(\\mathbf{b} = ${FD.cv(...q)}\\). Find \\(${m}\\mathbf{a} ${o} ${n}\\mathbf{b}\\).`, a: r, fields: ['Top', 'Bottom'], show: `\\(${FD.cv(...r)}\\)`, why: `\\(${m}\\mathbf{a} = ${FD.cv(m * p[0], m * p[1])}\\), \\(${n}\\mathbf{b} = ${FD.cv(n * q[0], n * q[1])}\\). Then \\(${FD.cv(m * p[0], m * p[1])} ${o} ${FD.cv(n * q[0], n * q[1])} = ${FD.cv(...r)}\\).` };
    },
    () => {
      const L = FD.pick([['P', 'Q', 'R', 'S'], ['A', 'B', 'C', 'D'], ['K', 'L', 'M', 'N']]), three = Math.random() < 0.5;
      const pts = three ? L : L.slice(0, 3), sum = pts.slice(1).map((x, i) => `\\overrightarrow{${pts[i]}${x}}`).join(' + '), ans = `${pts[0]}${pts[pts.length - 1]}`;
      return { type: 'mcq', q: `Simplify \\(${sum}\\).`, opts: [`\\(\\overrightarrow{${ans}}\\)`, `\\(\\overrightarrow{${pts[pts.length - 1]}${pts[0]}}\\)`, `\\(\\overrightarrow{${pts[0]}${pts[1]}}\\)`, `\\(\\overrightarrow{${pts[1]}${pts[pts.length - 1]}}\\)`], why: `The journey goes from ${pts[0]} to ${pts[pts.length - 1]}, so the resultant is \\(\\overrightarrow{${ans}}\\).` };
    },
    () => {
      const p = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6)], r = [FD.rndNZ(-6, 6), FD.rndNZ(-6, 6)], x = [r[0] - p[0], r[1] - p[1]];
      return { type: 'num', q: `\\(${FD.cv(...p)} + \\mathbf{x} = ${FD.cv(...r)}\\). Find the vector \\(\\mathbf{x}\\).`, a: x, fields: ['Top', 'Bottom'], show: `\\(${FD.cv(...x)}\\)`, why: `\\(\\mathbf{x} = ${FD.cv(...r)} - ${FD.cv(...p)} = ${FD.cv(...x)}\\).` };
    },
  ],
});

FD.check({
  section: 'add-subtract',
  items: [
    { type: 'num', q: `Find \\(${FD.cv(4, -1)} + ${FD.cv(-6, 3)}\\).`, a: [-2, 2], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(-2, 2)}\\)`, why: '\\(4 + (-6) = -2\\), \\(-1 + 3 = 2\\).' },
    { type: 'num', q: `\\(\\mathbf{a} = ${FD.cv(5, 2)}\\), \\(\\mathbf{b} = ${FD.cv(1, -4)}\\). Find \\(\\mathbf{a} - 2\\mathbf{b}\\).`, a: [3, 10], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(3, 10)}\\)`, why: `\\(2\\mathbf{b} = ${FD.cv(2, -8)}\\); \\(${FD.cv('5 - 2', '2 - (-8)')} = ${FD.cv(3, 10)}\\).` },
    { type: 'mcq', q: 'Simplify \\(\\overrightarrow{PQ} + \\overrightarrow{QR}\\).', opts: ['\\(\\overrightarrow{PR}\\)', '\\(\\overrightarrow{RP}\\)', '\\(\\overrightarrow{QP}\\)', '\\(\\overrightarrow{PQR}\\)'], why: 'From P to Q, then Q to R: from P to R.' },
    { type: 'mcq', q: '\\(\\overrightarrow{AB} - \\overrightarrow{CB}\\) is the same as…', opts: ['\\(\\overrightarrow{AC}\\)', '\\(\\overrightarrow{CA}\\)', '\\(\\overrightarrow{AB}\\)', '\\(\\overrightarrow{BC}\\)'], why: '\\(-\\overrightarrow{CB} = \\overrightarrow{BC}\\), so it is \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\).' },
    { type: 'tf', q: '\\(\\mathbf{a} + \\mathbf{b} = \\mathbf{b} + \\mathbf{a}\\)', a: true, why: 'Adding the columns gives the same answer in either order.' },
  ],
});
