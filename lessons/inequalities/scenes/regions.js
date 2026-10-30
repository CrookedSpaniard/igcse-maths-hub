// Regions on a graph: each inequality has a boundary line (solid for ≤/≥, dashed for </>),
// and the region that satisfies all of them is shaded.
// A condition is [a, b, c, op]: a·x + b·y op c, op one of '<', '<=', '>', '>='.
const inOk = ([a, b, c, op], x, y) => { const v = a * x + b * y; return op === '<' ? v < c - 1e-9 : op === '<=' ? v <= c + 1e-9 : op === '>' ? v > c + 1e-9 : v >= c - 1e-9; };
const inCondTex = ([a, b, c, op]) => { const s = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' }[op]; if (!a) return `y ${b > 0 ? s : IN_FLIP_G[s]} ${c / b}`; if (!b) return `x ${a > 0 ? s : IN_FLIP_G[s]} ${c / a}`; if (b === 1) return `y ${s} ${FD.poly([-a, c])}`; return `${FD.poly([a, 0]).replace(/^1x/, 'x')} ${b > 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y ${s} ${c}`; };
const IN_FLIP_G = { '>': '<', '<': '>', '\\ge': '\\le', '\\le': '\\ge' };
// Draw the region on an FD.graph: shade the cells that satisfy every condition, draw each boundary.
FD.region = (g, conds, pts = []) => {
  const { ax } = g, [x0, x1] = [-6, 6], [y0, y1] = [-6, 6], step = 0.25;
  let cells = '';
  for (let x = x0; x < x1; x += step) for (let y = y0; y < y1; y += step) if (conds.every((c) => inOk(c, x + step / 2, y + step / 2))) cells += `M${ax.X(x).toFixed(1)} ${ax.Y(y + step).toFixed(1)}h${(ax.X(x + step) - ax.X(x)).toFixed(2)}v${(ax.Y(y) - ax.Y(y + step)).toFixed(2)}h${-(ax.X(x + step) - ax.X(x)).toFixed(2)}z`;
  const lines = conds.map(([a, b, c, op]) => {
    const cls = op.length > 1 ? 'curve' : 'curve dash';
    if (!b) return `<line class="${cls}" x1="${ax.X(c / a)}" y1="${ax.Y(y0)}" x2="${ax.X(c / a)}" y2="${ax.Y(y1)}"/>`;
    return `<path class="${cls}" d="${ax.path((x) => (c - a * x) / b)}"/>`;
  }).join('');
  g.draw(`<path class="g-fill" d="${cells}"/>${lines}`, pts.map(([x, y]) => g.pt(x, y, conds.every((c) => inOk(c, x, y)) ? 'hot' : '')).join(''));
};

FD.add({
  id: 'regions',
  title: 'Regions on a graph',
  tab: 'Regions',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Boundary line', 'The line where the two sides are equal, e.g. \\(x = 2\\) for \\(x > 2\\).'],
    ['Solid or dashed', 'Solid line for \\(\\le\\) and \\(\\ge\\) (points on it count); dashed line for \\(<\\) and \\(>\\).'],
    ['Region', 'The part of the graph where every point fits the inequalities.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'in-r', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\(x \\ge\\) <input type="range" data-k="a" min="-5" max="3" value="-1"><output data-k="oa">−1</output></label>
        <label class="ctrl">\\(y <\\) <input type="range" data-k="b" min="-2" max="6" value="4"><output data-k="ob">4</output></label>
        <label class="ctrl">\\(y \\ge x +\\) <input type="range" data-k="c" min="-4" max="3" value="-2"><output data-k="oc">−2</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label: 'A region on a graph' });
    a.region = (conds, pts) => FD.region(g, conds, pts);
    const sync = () => {
      const [p, q, r] = ['a', 'b', 'c'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['a', 'b', 'c'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([p, q, r][i]).replace('-', '−'); });
      const conds = [[1, 0, p, '>='], [0, 1, q, '<'], [-1, 1, r, '>=']];
      a.region(conds);
      a.big(conds.map(inCondTex).join(', \\; '));
      a.msg('Solid lines are included in the region; dashed lines are not.');
    };
    ['a', 'b', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.region([[1, 0, 2, '>']]);
    return a;
  },
  steps: [
    {
      title: 'Vertical and horizontal boundaries',
      text: '<p>\\(x > 2\\) is every point to the <b>right</b> of the line \\(x = 2\\). The line is dashed because \\(x = 2\\) itself is not included.</p><p>\\(y \\le 3\\) is every point <b>on or below</b> the solid line \\(y = 3\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.region([[1, 0, 2, '>']]); a.big('x > 2'); if (!(await ctx.sleep(1700))) return; a.region([[0, 1, 3, '<=']]); a.big('y \\le 3'); },
    },
    {
      title: 'A sloping boundary',
      text: '<p>\\(y < x + 1\\): draw the dashed line \\(y = x + 1\\). Test a point not on the line, such as \\((0, 0)\\): \\(0 < 1\\) is true, so shade the side that contains \\((0, 0)\\).</p>',
      tip: 'The origin is the easiest test point, unless the line goes through it.',
      async on(a) { a.tryMode(false); a.region([[-1, 1, 1, '<']], [[0, 0]]); a.big('y < x + 1'); },
    },
    {
      title: 'Several inequalities together',
      text: '<p>The region for \\(x \\ge -1\\), \\(y < 4\\) and \\(y \\ge x - 2\\) is where all three overlap: a triangle.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('');
        const all = [[1, 0, -1, '>='], [0, 1, 4, '<'], [-1, 1, -2, '>=']];
        for (let k = 1; k <= 3; k++) { a.region(all.slice(0, k)); a.big(all.slice(0, k).map(inCondTex).join(', \\; ')); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: move the boundaries',
      text: '<p>Move the three boundary lines and watch the region change. Which boundary is dashed?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'regions',
  gens: [
    () => { const p = FD.rnd(-3, 1), q = FD.rnd(p + 2, 5), x = FD.rnd(-5, 5), y = FD.rnd(-5, 5), cond = [[1, 0, p, '>'], [0, 1, q, '<=']], ok = cond.every((c) => inOk(c, x, y)); return { type: 'tf', q: `Is the point \\((${x}, ${y})\\) in the region \\(x > ${p}\\) and \\(y \\le ${q}\\)?`, a: ok, why: `\\(x = ${x}\\) ${x > p ? 'is' : 'is not'} greater than ${p}; \\(y = ${y}\\) ${y <= q ? 'is' : 'is not'} at most ${q}. So it is ${ok ? '' : 'not '}in the region.` }; },
    () => { const op = FD.pick(['<', '\\le', '>', '\\ge']); return { type: 'mcq', q: `For the region \\(y ${op} 2x + 1\\), the boundary line \\(y = 2x + 1\\) should be…`, opts: op.length > 1 ? ['solid', 'dashed', 'not drawn', 'vertical'] : ['dashed', 'solid', 'not drawn', 'vertical'], why: op.length > 1 ? '\\(\\le\\) and \\(\\ge\\) include the line: solid.' : '\\(<\\) and \\(>\\) do not include the line: dashed.' }; },
  ],
});

FD.check({
  section: 'regions',
  items: [
    { type: 'mcq', q: 'Which region is described by \\(x \\le -2\\)?', opts: ['On or to the left of the line \\(x = -2\\)', 'To the right of \\(x = -2\\)', 'Below \\(y = -2\\)', 'Above \\(y = -2\\)'], why: 'Smaller \\(x\\) values are to the left.' },
    { type: 'tf', q: '\\((1, 1)\\) satisfies \\(y < x + 2\\).', a: true, why: '\\(1 < 3\\).' },
    { type: 'mcq', q: 'The boundary for \\(y > 3\\) is…', opts: ['a dashed horizontal line', 'a solid horizontal line', 'a dashed vertical line', 'a solid vertical line'], why: '\\(y = 3\\) is horizontal; \\(>\\) gives dashed.' },
    { type: 'num', q: 'How many points with integer coordinates satisfy \\(x > 0\\), \\(y > 0\\) and \\(x + y < 4\\)?', a: 3, why: '\\((1, 1), (1, 2), (2, 1)\\).' },
  ],
});
