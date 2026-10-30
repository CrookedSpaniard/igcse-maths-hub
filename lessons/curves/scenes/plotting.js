// Tables of values and plotting: points appear one by one, then the curve through them.
const cuTable = (xs, f) => `<table class="cu-tab"><tr><th>\\(x\\)</th>${xs.map((x) => `<td>${String(x).replace('-', '−')}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${xs.map((x) => `<td>${String(FD.round(f(x), 2)).replace('-', '−')}</td>`).join('')}</tr></table>`;

FD.add({
  id: 'plotting',
  title: 'Tables of values and plotting',
  tab: 'Plotting',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Table of values', 'A table of \\(x\\) values and the \\(y\\) values that the equation gives.'],
    ['Quadratic graph', 'The graph of \\(y = ax^2 + bx + c\\): a smooth U- or ∩-shaped curve called a parabola.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'cu-p', side: true,
      vis: '<div data-k="g"></div><div class="cu-tabh" data-k="tab"></div>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-2" max="2" step="0.5" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(b\\) <input type="range" data-k="b" min="-4" max="4" value="-2"><output data-k="ob">−2</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-5" max="5" value="-3"><output data-k="oc">−3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 360, x: [-3, 4], y: [-6, 10], step: 1, ystep: 2, label: 'Plotting a graph from a table of values' });
    const xs = [-2, -1, 0, 1, 2, 3, 4];
    a.plot = (f, upto = 99, curve = true) => {
      const shown = xs.slice(0, upto);
      g.draw(curve ? g.curve(f, '', -2, 4) : '', shown.map((x) => g.pt(x, f(x), 'hot')).join(''));
      a.$('[data-k="tab"]').innerHTML = cuTable(xs, f); FD.typeset(a.$('[data-k="tab"]'));
    };
    const sync = () => {
      const [A, B, C] = ['a', 'b', 'c'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['a', 'b', 'c'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([A, B, C][i]).replace('-', '−'); });
      a.plot((x) => A * x * x + B * x + C);
      a.big(`y = ${FD.poly([A, B, C])}`);
      a.msg(A === 0 ? 'With \\(a = 0\\) there is no \\(x^2\\) term: the graph is a straight line.' : A > 0 ? 'Positive \\(x^2\\) term: a ∪ shape.' : 'Negative \\(x^2\\) term: a ∩ shape.');
    };
    ['a', 'b', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.plot((x) => x * x - 2 * x - 3, 0, false);
    return a;
  },
  steps: [
    {
      title: 'Make a table of values',
      text: '<p>For \\(y = x^2 - 2x - 3\\), substitute each \\(x\\). Take care with negatives: when \\(x = -2\\), \\(y = (-2)^2 - 2(-2) - 3 = 4 + 4 - 3 = 5\\).</p>',
      tip: 'Square negative numbers in brackets: \\((-2)^2 = 4\\).',
      async on(a, ctx) { a.tryMode(false); a.big('y = x^2 - 2x - 3'); for (let k = 0; k <= 7; k++) { a.plot((x) => x * x - 2 * x - 3, k, false); if (!(await ctx.sleep(600))) return; } },
    },
    {
      title: 'Join with a smooth curve',
      text: '<p>Plot the points and join them with a <b>smooth curve</b>, not straight lines. The bottom of the curve is rounded, even between two points.</p>',
      async on(a) { a.tryMode(false); a.plot((x) => x * x - 2 * x - 3); a.big('y = x^2 - 2x - 3'); },
    },
    {
      title: 'Straight lines too',
      text: '<p>A linear equation like \\(y = 2x - 1\\) gives points in a <b>straight line</b>. Three points are enough; use a ruler.</p>',
      async on(a) { a.tryMode(false); a.plot((x) => 2 * x - 1); a.big('y = 2x - 1'); },
    },
    {
      title: 'Try it: build a graph',
      text: '<p>Change \\(a\\), \\(b\\) and \\(c\\) in \\(y = ax^2 + bx + c\\). Watch the table and the curve change.</p>',
      tip: 'Set \\(a = 0\\): what happens?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'plotting',
  gens: [
    () => { const b = FD.rnd(-4, 4), c = FD.rnd(-6, 6), x = FD.rnd(-3, 3); return { type: 'num', q: `\\(y = ${FD.poly([1, b, c])}\\). Find the value of \\(y\\) when \\(x = ${x}\\).`, a: x * x + b * x + c, why: `\\((${x})^2 ${b ? `${FD.sg(b)}(${x})` : ''} ${c ? FD.sg(c) : ''} = ${x * x} ${b ? FD.sg(b * x) : ''} ${c ? FD.sg(c) : ''} = ${x * x + b * x + c}\\).` }; },
    () => { const m = FD.rndNZ(-3, 3), c = FD.rnd(-4, 4), x = FD.rnd(-3, 3); return { type: 'num', q: `Complete the table for \\(y = ${FD.poly([m, c])}\\): what is \\(y\\) when \\(x = ${x}\\)?`, a: m * x + c, why: `\\(${m}(${x}) ${FD.sg(c)} = ${m * x + c}\\).` }; },
  ],
});

FD.check({
  section: 'plotting',
  items: [
    { type: 'num', q: '\\(y = x^2 + 3x\\). Find \\(y\\) when \\(x = -4\\).', a: 4, why: '\\(16 - 12\\).' },
    { type: 'num', q: '\\(y = 2x^2 - 5\\). Find \\(y\\) when \\(x = -3\\).', a: 13, why: '\\(18 - 5\\).' },
    { type: 'mcq', q: 'The points of \\(y = x^2 - 4\\) should be joined with…', opts: ['a smooth curve', 'straight lines with a ruler', 'a single straight line', 'nothing'], why: 'Quadratic graphs are smooth curves.' },
    { type: 'tf', q: 'The graph of \\(y = 3x + 2\\) is a curve.', a: false, why: 'It is linear: a straight line.' },
  ],
});
