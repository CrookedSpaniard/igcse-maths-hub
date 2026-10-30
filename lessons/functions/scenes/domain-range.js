// Domain and range: the x-values allowed (shown along the x-axis) and the outputs (along the y-axis).
const FN_DR = [
  { f: (x) => 2 * x + 1, t: 'f(x) = 2x + 1', dom: [-2, 3], tex: '-2 \\le x \\le 3', rng: '-3 \\le f(x) \\le 7', lo: -3, hi: 7 },
  { f: (x) => x * x, t: 'f(x) = x^2', dom: [-3, 2], tex: '-3 \\le x \\le 2', rng: '0 \\le f(x) \\le 9', lo: 0, hi: 9 },
  { f: (x) => 6 - x, t: 'f(x) = 6 - x', dom: [0, 5], tex: '0 \\le x \\le 5', rng: '1 \\le f(x) \\le 6', lo: 1, hi: 6 },
];

FD.add({
  id: 'domain-range',
  title: 'Domain and range',
  tab: 'Domain & range',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Domain', 'The set of inputs (\\(x\\) values) the function is used for.'],
    ['Range', 'The set of outputs the function gives for that domain.'],
    ['Excluded value', 'An input that cannot be used, e.g. \\(x = 2\\) in \\(\\frac{1}{x - 2}\\) (dividing by 0) or \\(x < 0\\) in \\(\\sqrt{x}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fn-d', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn primary" data-k="next">Next function ↻</button></div>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-5, 6], y: [-4, 10], step: 1, label: 'A function with its domain and range' });
    a.show = (k, bars = true) => {
      const D = FN_DR[k];
      const dom = bars ? `<line class="fn-dom" x1="${g.ax.X(D.dom[0])}" y1="${g.ax.Y(0)}" x2="${g.ax.X(D.dom[1])}" y2="${g.ax.Y(0)}"/>` : '';
      const rng = bars ? `<line class="fn-rng" x1="${g.ax.X(0)}" y1="${g.ax.Y(D.lo)}" x2="${g.ax.X(0)}" y2="${g.ax.Y(D.hi)}"/>` : '';
      g.draw(`<path class="curve c3" d="${g.ax.path(D.f)}"/><path class="curve" d="${g.ax.path(D.f, D.dom[0], D.dom[1])}"/>${dom}${rng}`, g.pt(D.dom[0], D.f(D.dom[0])) + g.pt(D.dom[1], D.f(D.dom[1])));
      a.big(D.t);
      if (bars) a.msg(`Domain \\(${D.tex}\\) (on the \\(x\\)-axis) gives range \\(${D.rng}\\) (on the \\(y\\)-axis).`);
    };
    let k = 0;
    a.$('[data-k="next"]').addEventListener('click', () => { k = (k + 1) % FN_DR.length; a.show(k); });
    a.onTry = () => a.show(k);
    a.show(0, false);
    return a;
  },
  steps: [
    {
      title: 'Inputs and outputs',
      text: '<p>\\(f(x) = 2x + 1\\) with domain \\(-2 \\le x \\le 3\\). Only the bold part of the line is used.</p><p>The outputs go from \\(f(-2) = -3\\) to \\(f(3) = 7\\): the <b>range</b> is \\(-3 \\le f(x) \\le 7\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.show(0, false); a.msg(''); if (!(await ctx.sleep(1300))) return; a.show(0); },
    },
    {
      title: 'Careful with curves',
      text: '<p>\\(f(x) = x^2\\) with domain \\(-3 \\le x \\le 2\\). The ends give 9 and 4, but the lowest output is \\(f(0) = 0\\).</p><p>Range: \\(0 \\le f(x) \\le 9\\).</p>',
      tip: 'Sketch the graph. Look for the highest and lowest points, not just the ends.',
      async on(a) { a.tryMode(false); a.show(1); },
    },
    {
      title: 'Values to exclude',
      text: '<p>Some inputs are not allowed. You cannot divide by 0 or take the square root of a negative number.</p>',
      on: FD.walk([['f(x) = \\frac{3}{x - 2}', 'exclude x = 2'], ['g(x) = \\sqrt{x + 4}', 'domain x ≥ −4'], ['h(x) = \\frac{1}{x^2 - 9}', 'exclude x = 3 and x = −3']], (a) => { a.show(2, false); a.big(''); a.msg(''); }),
    },
    {
      title: 'Try it: read the range',
      text: '<p>For each function, look at the bold part of the graph. Work out the range from the domain, then compare with the message.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'domain-range',
  gens: [
    () => { const k = FD.rndNZ(-6, 6); return { type: 'num', q: `\\(f(x) = \\dfrac{5}{x ${k < 0 ? '+' : '-'} ${Math.abs(k)}}\\). Which value of \\(x\\) must be excluded from the domain?`, a: k, why: `\\(x ${k < 0 ? '+' : '-'} ${Math.abs(k)} = 0\\) when \\(x = ${k}\\), and you cannot divide by 0.` }; },
    () => { const m = FD.rnd(2, 5), c = FD.rnd(-5, 5), lo = FD.rnd(-3, 0), hi = lo + FD.rnd(2, 5); return { type: 'num', q: `\\(f(x) = ${FD.poly([m, c])}\\) with domain \\(${lo} \\le x \\le ${hi}\\). Find the smallest and largest values in the range.`, a: [m * lo + c, m * hi + c], fields: ['smallest', 'largest'], why: `\\(f(${lo}) = ${m * lo + c}\\) and \\(f(${hi}) = ${m * hi + c}\\). The line goes up, so the range is \\(${m * lo + c} \\le f(x) \\le ${m * hi + c}\\).` }; },
  ],
});

FD.check({
  section: 'domain-range',
  items: [
    { type: 'num', q: 'Which value must be excluded from the domain of \\(f(x) = \\frac{1}{x + 7}\\)?', a: -7, why: 'It makes the denominator 0.' },
    { type: 'mcq', q: 'What is the domain of \\(g(x) = \\sqrt{x - 3}\\)?', opts: ['\\(x \\ge 3\\)', '\\(x > 0\\)', '\\(x \\ge -3\\)', 'all \\(x\\)'], why: '\\(x - 3\\) cannot be negative.' },
    { type: 'mcq', q: '\\(f(x) = x^2 + 1\\) for all \\(x\\). What is its range?', opts: ['\\(f(x) \\ge 1\\)', '\\(f(x) \\ge 0\\)', 'all numbers', '\\(f(x) > 1\\)'], why: '\\(x^2 \\ge 0\\), so \\(x^2 + 1 \\ge 1\\).' },
    { type: 'num', q: '\\(f(x) = 10 - 2x\\) with domain \\(0 \\le x \\le 4\\). What is the largest value in the range?', a: 10, why: 'The line goes down, so the largest output is \\(f(0) = 10\\).' },
  ],
});
