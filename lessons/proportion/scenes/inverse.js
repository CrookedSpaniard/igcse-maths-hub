// y = k/x and y = k/x²: the curve and the rectangle x × y that always has area k.
FD.add({
  id: 'inverse',
  title: 'Inverse proportion',
  tab: 'Inverse',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Inversely proportional', '\\(y \\propto \\frac{1}{x}\\): when \\(x\\) is multiplied by a number, \\(y\\) is divided by it.'],
    ['\\(y = \\frac{k}{x}\\)', 'The formula for inverse proportion. The product \\(xy = k\\) never changes.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'pr-i', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="pw"><button class="btn primary" data-i="1">\\(y = \\frac{k}{x}\\)</button><button class="btn" data-i="2">\\(y = \\frac{k}{x^2}\\)</button></div>
        <label class="ctrl">\\(k\\) <input type="range" data-k="k" min="4" max="24" step="2" value="12"><output data-k="ok">12</output></label>
        <label class="ctrl">\\(x\\) <input type="range" data-k="x" min="1" max="8" step="0.5" value="3"><output data-k="ox">3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 420, h: 320, x: [0, 8], y: [0, 16], step: 1, ystep: 2, label: 'Graph of y = k over x' });
    a.show = (k, n, x) => {
      const f = (t) => k / t ** n, y = f(x);
      const rect = n === 1 ? `<rect class="g-fill" x="${g.ax.X(0)}" y="${g.ax.Y(Math.min(y, 16))}" width="${g.ax.X(x) - g.ax.X(0)}" height="${g.ax.Y(0) - g.ax.Y(Math.min(y, 16))}"/>` : '';
      g.draw(rect + g.curve(f, '', 0.05, 8), g.pt(x, Math.min(y, 16), 'hot') + g.lbl(x, Math.min(y, 15), `(${x}, ${FD.round(y, 2)})`));
      return y;
    };
    let n = 1;
    const sync = () => {
      const k = +a.$('[data-k="k"]').value, x = +a.$('[data-k="x"]').value;
      a.$('[data-k="ok"]').textContent = k; a.$('[data-k="ox"]').textContent = x;
      const y = a.show(k, n, x);
      a.big(n === 1 ? `y = \\frac{${k}}{${x}} = ${FD.round(y, 2)}` : `y = \\frac{${k}}{${x}^2} = ${FD.round(y, 2)}`);
      a.msg(n === 1 ? `The shaded rectangle is \\(${x} \\times ${FD.round(y, 2)} = ${FD.round(x * y, 2)}\\). It always equals \\(k\\).` : `Here \\(x^2 y = ${FD.round(x * x * y, 2)}\\) always equals \\(k\\).`);
    };
    a.$('[data-k="pw"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; n = +b.dataset.i; a.$('[data-k="pw"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    ['k', 'x'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(12, 1, 3);
    return a;
  },
  steps: [
    {
      title: 'More workers, less time',
      text: '<p>A job takes 12 hours for 1 painter. 2 painters take 6 hours, 3 take 4 hours. Double the painters, halve the time.</p><p>Time is <b>inversely proportional</b> to the number of painters: \\(t = \\frac{12}{n}\\).</p>',
      async on(a, ctx) { a.tryMode(false); for (const x of [1, 2, 3, 4, 6]) { a.show(12, 1, x); a.big(`t = \\frac{12}{${x}} = ${12 / x}`); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'The formula and the graph',
      text: '<p>\\(y \\propto \\frac{1}{x}\\) becomes \\(y = \\frac{k}{x}\\), so \\(xy = k\\).</p><p>The graph is a curve that gets close to the axes but never touches them.</p>',
      async on(a) { a.tryMode(false); a.show(12, 1, 3); a.big('y = \\frac{k}{x} \\quad\\Leftrightarrow\\quad xy = k'); },
    },
    {
      title: 'Find k, then use it',
      text: '<p>\\(y\\) is inversely proportional to \\(x^2\\). When \\(x = 2\\), \\(y = 9\\). Find \\(y\\) when \\(x = 3\\).</p>',
      on: FD.walk([['y = \\frac{k}{x^2}', ''], ['9 = \\frac{k}{4} \\Rightarrow k = 36', ''], ['y = \\frac{36}{x^2}', ''], ['x = 3: \\; y = \\frac{36}{9} = 4', '']], (a) => { a.show(36, 2, 3); a.big(''); }, 1500),
    },
    {
      title: 'Try it: the k rectangle',
      text: '<p>Move the point along the curve. For \\(y = \\frac{k}{x}\\) the shaded rectangle has width \\(x\\) and height \\(y\\). Its area never changes.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'inverse',
  gens: [
    () => { const x1 = FD.rnd(2, 6), y1 = FD.rnd(2, 12), k = x1 * y1, x2 = FD.pick([1, 2, 3, 4, 6, 8, 12].filter((d) => k % d === 0 && d !== x1)); return { type: 'num', q: `\\(y\\) is inversely proportional to \\(x\\). When \\(x = ${x1}\\), \\(y = ${y1}\\). Find \\(y\\) when \\(x = ${x2}\\).`, a: k / x2, why: `\\(y = \\dfrac{k}{x}\\): \\(k = ${x1} \\times ${y1} = ${k}\\). \\(y = \\dfrac{${k}}{${x2}} = ${k / x2}\\).` }; },
    () => { const x1 = FD.rnd(2, 4), y1 = FD.rnd(1, 9), k = x1 * x1 * y1, x2 = FD.pick([1, 2, 3, 4, 6].filter((d) => k % (d * d) === 0 && d !== x1)); return { type: 'num', q: `\\(y \\propto \\dfrac{1}{x^2}\\). When \\(x = ${x1}\\), \\(y = ${y1}\\). Find \\(y\\) when \\(x = ${x2}\\).`, a: k / (x2 * x2), why: `\\(y = \\dfrac{k}{x^2}\\): \\(k = ${x1 * x1} \\times ${y1} = ${k}\\). \\(y = \\dfrac{${k}}{${x2 * x2}} = ${k / (x2 * x2)}\\).` }; },
  ],
});

FD.check({
  section: 'inverse',
  items: [
    { type: 'num', q: '\\(y = \\frac{k}{x}\\) and \\(y = 8\\) when \\(x = 5\\). Find \\(k\\).', a: 40, why: '\\(k = xy = 40\\).' },
    { type: 'num', q: '\\(y \\propto \\frac{1}{x}\\) and \\(y = 6\\) when \\(x = 4\\). Find \\(y\\) when \\(x = 8\\).', a: 3, why: '\\(k = 24\\), \\(y = 24 \\div 8\\).' },
    { type: 'mcq', q: '\\(y \\propto \\frac{1}{x^2}\\). If \\(x\\) is doubled, \\(y\\) is…', opts: ['divided by 4', 'halved', 'multiplied by 4', 'doubled'], why: '\\(\\frac{k}{(2x)^2} = \\frac14 \\cdot \\frac{k}{x^2}\\).' },
    { type: 'tf', q: 'The graph of \\(y = \\frac{k}{x}\\) (for \\(x > 0\\)) crosses the \\(x\\)-axis.', a: false, why: '\\(y\\) gets close to 0 but never reaches it.' },
  ],
});
