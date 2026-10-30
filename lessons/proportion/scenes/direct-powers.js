// y = k x^n for n = 2, 3, ½: choose the power, see the curve and how y changes when x doubles.
const PR_POW = [['x^2', (x) => x * x, 2, 4], ['x^3', (x) => x ** 3, 3, 8], ['\\sqrt{x}', Math.sqrt, 0.5, '\\sqrt2']];
FD.add({
  id: 'direct-powers',
  title: 'Proportion to powers and roots',
  tab: 'Powers & roots',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['\\(y \\propto x^2\\)', '\\(y = kx^2\\): when \\(x\\) doubles, \\(y\\) is multiplied by \\(2^2 = 4\\).'],
    ['\\(y \\propto \\sqrt{x}\\)', '\\(y = k\\sqrt{x}\\): when \\(x\\) is multiplied by 4, \\(y\\) doubles.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'pr-p', side: true,
      vis: '<div data-k="g"></div><div class="pr-tabh" data-k="tab"></div>',
      tryHtml: `<div class="seg-row" data-k="pw">${PR_POW.map(([t], i) => `<button class="btn ${i ? '' : 'primary'}" data-i="${i}">\\(y = k${t}\\)</button>`).join('')}</div>
        <label class="ctrl">\\(k\\) <input type="range" data-k="k" min="0.5" max="4" step="0.5" value="1"><output data-k="ok">1</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 420, h: 320, x: [0, 6], y: [0, 36], step: 1, ystep: 4, label: 'Graph of y = k x to a power' });
    let pi = 0;
    a.show = (i, k) => {
      const [t, f] = PR_POW[i];
      g.draw(g.curve((x) => k * f(x)), g.pt(2, k * f(2), 'hot') + g.pt(4, k * f(4), 'hot'));
      a.$('[data-k="tab"]').innerHTML = prTable([1, 2, 4], (x) => k * f(x)); FD.typeset(a.$('[data-k="tab"]'));
      a.big(`y = ${k === 1 ? '' : k}${t}`);
    };
    const sync = () => {
      const k = +a.$('[data-k="k"]').value; a.$('[data-k="ok"]').textContent = k; a.show(pi, k);
      const [, , n, m] = PR_POW[pi];
      a.msg(`From \\(x = 2\\) to \\(x = 4\\), \\(x\\) doubles, so \\(y\\) is multiplied by \\(2^{${n === 0.5 ? '\\frac12' : n}} = ${m}\\).`);
    };
    a.$('[data-k="pw"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; pi = +b.dataset.i; a.$('[data-k="pw"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="k"]').addEventListener('input', sync);
    a.onTry = sync;
    a.show(0, 1);
    return a;
  },
  steps: [
    {
      title: 'Proportional to the square',
      text: '<p>The area of a circle is proportional to the <b>square</b> of its radius: \\(A \\propto r^2\\), so \\(A = kr^2\\).</p><p>The graph is a curve through the origin, getting steeper.</p>',
      async on(a) { a.tryMode(false); a.show(0, 1); },
    },
    {
      title: 'Find k with the square',
      text: '<p>\\(y \\propto x^2\\). When \\(x = 3\\), \\(y = 36\\). Find \\(y\\) when \\(x = 5\\).</p>',
      tip: 'Square \\(x\\) before you divide to find \\(k\\).',
      on: FD.walk([['y = kx^2', ''], ['36 = k \\times 3^2 = 9k \\Rightarrow k = 4', ''], ['y = 4x^2', ''], ['x = 5: \\; y = 4 \\times 25 = 100', '']], (a) => a.show(0, 1), 1500),
    },
    {
      title: 'Cubes and square roots',
      text: '<p>The same method works for \\(y \\propto x^3\\) and \\(y \\propto \\sqrt{x}\\). Write the formula, find \\(k\\), then use it.</p>',
      on: FD.walk([['y \\propto \\sqrt{x}: \\; y = k\\sqrt{x}', ''], ['\\text{When } x = 16, y = 12: \\; 12 = 4k \\Rightarrow k = 3', ''], ['x = 49: \\; y = 3\\sqrt{49} = 21', '']], (a) => a.show(2, 1), 1500),
    },
    {
      title: 'Try it: powers and roots',
      text: '<p>Choose the power and \\(k\\). Compare the table values for \\(x = 2\\) and \\(x = 4\\). What is \\(y\\) multiplied by when \\(x\\) doubles?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'direct-powers',
  gens: [
    () => { const k = FD.rnd(2, 6), x1 = FD.rnd(2, 5), x2 = FD.rnd(2, 9); return { type: 'num', q: `\\(y\\) is directly proportional to \\(x^2\\). When \\(x = ${x1}\\), \\(y = ${k * x1 * x1}\\). Find \\(y\\) when \\(x = ${x2}\\).`, a: k * x2 * x2, why: `\\(y = kx^2\\): \\(${k * x1 * x1} = ${x1 * x1}k\\), \\(k = ${k}\\). \\(y = ${k} \\times ${x2}^2 = ${k * x2 * x2}\\).` }; },
    () => { const k = FD.rnd(2, 8), r1 = FD.rnd(2, 6), r2 = FD.rnd(2, 10); return { type: 'num', q: `\\(d \\propto \\sqrt{h}\\). When \\(h = ${r1 * r1}\\), \\(d = ${k * r1}\\). Find \\(d\\) when \\(h = ${r2 * r2}\\).`, a: k * r2, why: `\\(d = k\\sqrt{h}\\): \\(${k * r1} = ${r1}k\\), \\(k = ${k}\\). \\(d = ${k}\\sqrt{${r2 * r2}} = ${k * r2}\\).` }; },
    () => { const k = FD.pick([0.5, 2, 3]), x1 = FD.rnd(2, 4), x2 = FD.rnd(1, 5); return { type: 'num', q: `\\(V\\) is directly proportional to the cube of \\(r\\). When \\(r = ${x1}\\), \\(V = ${FD.num(k * x1 ** 3)}\\). Find \\(V\\) when \\(r = ${x2}\\).`, a: k * x2 ** 3, why: `\\(V = kr^3\\): \\(k = ${FD.num(k * x1 ** 3)} \\div ${x1 ** 3} = ${k}\\). \\(V = ${k} \\times ${x2 ** 3} = ${FD.num(k * x2 ** 3)}\\).` }; },
  ],
});

FD.check({
  section: 'direct-powers',
  items: [
    { type: 'num', q: '\\(y \\propto x^2\\) and \\(y = 50\\) when \\(x = 5\\). Find \\(y\\) when \\(x = 3\\).', a: 18, why: '\\(k = 2\\), \\(y = 2 \\times 9\\).' },
    { type: 'mcq', q: '\\(y \\propto x^2\\). If \\(x\\) is doubled, \\(y\\) is…', opts: ['multiplied by 4', 'doubled', 'multiplied by 8', 'halved'], why: '\\(k(2x)^2 = 4kx^2\\).' },
    { type: 'num', q: '\\(y \\propto \\sqrt{x}\\) and \\(y = 10\\) when \\(x = 4\\). Find \\(y\\) when \\(x = 36\\).', a: 30, why: '\\(k = 5\\), \\(y = 5 \\times 6\\).' },
    { type: 'mcq', q: '\\(y \\propto x^3\\). If \\(x\\) is doubled, \\(y\\) is…', opts: ['multiplied by 8', 'multiplied by 6', 'multiplied by 3', 'doubled'], why: '\\(2^3 = 8\\).' },
  ],
});
