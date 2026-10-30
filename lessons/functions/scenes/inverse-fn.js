// Inverse functions: undo the machine; the graph of f⁻¹ is f reflected in y = x.
FD.add({
  id: 'inverse-fn',
  title: 'Inverse functions',
  tab: 'Inverse',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Inverse function \\(f^{-1}\\)', 'The function that undoes \\(f\\): if \\(f(3) = 7\\) then \\(f^{-1}(7) = 3\\).'],
    ['Reflection in \\(y = x\\)', 'Swapping \\(x\\) and \\(y\\). The graph of \\(f^{-1}\\) is the graph of \\(f\\) reflected in the line \\(y = x\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fn-i', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(f(x) = mx + c\\): m <input type="range" data-k="m" min="0.5" max="4" step="0.5" value="2"><output data-k="om">2</output></label>
        <label class="ctrl">c <input type="range" data-k="c" min="-4" max="4" value="1"><output data-k="oc">1</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A function, its inverse and the line y = x' });
    a.show = (m, c, inv = true) => {
      g.draw(`<path class="g-line" d="${g.ax.path((x) => x)}"/>${g.curve((x) => m * x + c)}${inv ? g.curve((x) => (x - c) / m, 'c2') : ''}`, g.lbl(4.5, 4.2, 'y = x'));
    };
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, c = +a.$('[data-k="c"]').value;
      a.$('[data-k="om"]').textContent = m; a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      a.show(m, c);
      a.big(`f(x) = ${FD.poly([m, c])}, \\quad f^{-1}(x) = \\frac{x ${FD.sg(-c)}}{${m}}`.replace(' + 0', '').replace(' - 0', ''));
      a.msg('The two lines are mirror images in the dashed line \\(y = x\\).');
    };
    ['m', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(2, 1, false);
    return a;
  },
  steps: [
    {
      title: 'Undo the function',
      text: '<p>\\(f(x) = 2x + 1\\): multiply by 2, then add 1. To undo it, go backwards: subtract 1, then divide by 2.</p><p>\\(f^{-1}(x) = \\frac{x - 1}{2}\\)</p>',
      async on(a) { a.tryMode(false); a.show(2, 1, false); a.big('f(3) = 7 \\quad\\Leftrightarrow\\quad f^{-1}(7) = 3'); },
    },
    {
      title: 'The algebra method',
      text: '<p>Write \\(y = f(x)\\), then make \\(x\\) the subject. Finally swap the letters back to write \\(f^{-1}(x)\\).</p>',
      tip: 'Check: \\(f^{-1}(f(x))\\) should give back \\(x\\).',
      on: FD.walk([['y = \\frac{3x - 4}{5}', 'write y = f(x)'], ['5y = 3x - 4', ''], ['x = \\frac{5y + 4}{3}', 'make x the subject'], ['f^{-1}(x) = \\frac{5x + 4}{3}', 'rename y as x']], (a) => { a.show(0.6, -0.8); a.big(''); }, 1400),
    },
    {
      title: 'Reflection in y = x',
      text: '<p>Every point \\((a, b)\\) on \\(f\\) becomes \\((b, a)\\) on \\(f^{-1}\\). So the graph of \\(f^{-1}\\) is the graph of \\(f\\) reflected in the line \\(y = x\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); a.show(2, 1, false); if (!(await ctx.sleep(1200))) return; a.show(2, 1, true); a.msg('\\((1, 3)\\) on \\(f\\) ↔ \\((3, 1)\\) on \\(f^{-1}\\).'); },
    },
    {
      title: 'Try it: mirror images',
      text: '<p>Change \\(m\\) and \\(c\\). The inverse always mirrors \\(f\\) in the line \\(y = x\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'inverse-fn',
  gens: [
    () => { const m = FD.rnd(2, 7), c = FD.rndNZ(-9, 9); return { type: 'alg', q: `\\(f(x) = ${FD.poly([m, c])}\\). Find \\(f^{-1}(x)\\).`, a: `(x${FD.sg(-c).replace(/\s/g, '')})/${m}`, lhs: 'f^{-1}(x) =', show: `\\(f^{-1}(x) = \\dfrac{x ${FD.sg(-c)}}{${m}}\\)`, hint: 'Type it like (x - 1)/2.', why: `\\(y = ${FD.poly([m, c])}\\), so \\(x = \\dfrac{y ${FD.sg(-c)}}{${m}}\\). Then \\(f^{-1}(x) = \\dfrac{x ${FD.sg(-c)}}{${m}}\\).` }; },
    () => { const m = FD.rnd(2, 6), c = FD.rndNZ(-8, 8), x = FD.rnd(-5, 6), y = m * x + c; return { type: 'num', q: `\\(f(x) = ${FD.poly([m, c])}\\). Find \\(f^{-1}(${y})\\).`, a: x, why: `\\(f^{-1}(${y})\\) is the input that gives ${y}: \\(${FD.poly([m, c])} = ${y}\\), so \\(x = ${x}\\).` }; },
  ],
});

FD.check({
  section: 'inverse-fn',
  items: [
    { type: 'alg', q: '\\(f(x) = 3x + 6\\). Find \\(f^{-1}(x)\\).', a: '(x-6)/3', lhs: 'f^{-1}(x) =', show: '\\(\\frac{x - 6}{3}\\)', hint: 'Type it like (x - 1)/2.', why: 'Subtract 6, then divide by 3.' },
    { type: 'num', q: '\\(f(x) = 5x - 2\\). Find \\(f^{-1}(13)\\).', a: 3, why: '\\(5x - 2 = 13\\).' },
    { type: 'mcq', q: 'The graph of \\(y = f^{-1}(x)\\) is the graph of \\(y = f(x)\\)…', opts: ['reflected in the line \\(y = x\\)', 'reflected in the \\(x\\)-axis', 'moved up by 1', 'rotated 90°'], why: 'Inputs and outputs swap.' },
    { type: 'alg', q: '\\(g(x) = \\frac{x + 4}{2}\\). Find \\(g^{-1}(x)\\).', a: '2x-4', lhs: 'g^{-1}(x) =', show: '\\(2x - 4\\)', why: 'Multiply by 2, then subtract 4.' },
  ],
});
