// Translations: y = f(x) + a moves up a; y = f(x + a) moves left a. f can be x², sin x or cos x.
const GS_F = {
  quad: { t: 'x^2', f: (x) => x * x, x: [-6, 6], y: [-6, 10], step: 1, ystep: 2 },
  sin: { t: '\\sin x', f: (d) => Math.sin((d * Math.PI) / 180), x: [-360, 360], y: [-3, 3], step: 90, ystep: 1 },
  cos: { t: '\\cos x', f: (d) => Math.cos((d * Math.PI) / 180), x: [-360, 360], y: [-3, 3], step: 90, ystep: 1 },
};
// A graph stage that can switch between the three base functions.
FD.gsStage = (host) => {
  let cur = null, g = null;
  return (key, fns) => {
    const F = GS_F[key];
    if (cur !== key) { g = FD.graph(host, { w: 420, h: 340, x: F.x, y: F.y, step: F.step, ystep: F.ystep, label: `Graph of y = ${key} and a transformed copy` }); cur = key; }
    g.draw(`<path class="curve gs-base" d="${g.ax.path(F.f)}"/>` + fns.map((h) => g.curve(h, 'c2')).join(''));
    return g;
  };
};

FD.add({
  id: 'translations',
  title: 'Translations: f(x) + a and f(x + a)',
  tab: 'Translations',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Translation', 'Sliding a graph without changing its shape. Written as a vector \\(\\begin{pmatrix} x \\\\ y \\end{pmatrix}\\).'],
    ['\\(y = f(x) + a\\)', 'Translation by \\(\\begin{pmatrix} 0 \\\\ a \\end{pmatrix}\\): up \\(a\\).'],
    ['\\(y = f(x + a)\\)', 'Translation by \\(\\begin{pmatrix} -a \\\\ 0 \\end{pmatrix}\\): left \\(a\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'gs-t', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="f"><button class="btn primary" data-f="quad">\\(x^2\\)</button><button class="btn" data-f="sin">\\(\\sin x\\)</button><button class="btn" data-f="cos">\\(\\cos x\\)</button></div>
        <div class="seg-row" data-k="w"><button class="btn primary" data-w="out">\\(f(x) + a\\)</button><button class="btn" data-w="in">\\(f(x + a)\\)</button></div>
        <label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-4" max="4" value="2"><output data-k="oa">2</output></label>`,
    });
    const S = FD.gsStage(a.$('[data-k="g"]'));
    a.tr = (key, where, k) => {
      const F = GS_F[key], s = key === 'quad' ? 1 : 45, sh = k * s;
      S(key, [where === 'out' ? (x) => F.f(x) + k : (x) => F.f(x + sh)]);
      const v = where === 'out' ? `\\begin{pmatrix} 0 \\\\ ${k} \\end{pmatrix}` : `\\begin{pmatrix} ${-sh} \\\\ 0 \\end{pmatrix}`;
      const eq = where === 'out' ? `y = ${F.t} ${FD.sg(k)}` : key === 'quad' ? `y = (x ${FD.sg(sh)})^2` : `y = \\${key}(x ${FD.sg(sh)}°)`;
      a.big(`${eq}`);
      a.msg(`Translation by \\(${v}\\): ${where === 'out' ? (k >= 0 ? `up ${k}` : `down ${-k}`) : sh >= 0 ? `left ${sh}` : `right ${-sh}`}.`);
    };
    let key = 'quad', where = 'out';
    const sync = () => { const k = +a.$('[data-k="a"]').value; a.$('[data-k="oa"]').textContent = String(key === 'quad' || where === 'out' ? k : k * 45).replace('-', '−') + (key !== 'quad' && where === 'in' ? '°' : ''); a.tr(key, where, k); };
    const seg = (sel, attr, set) => a.$(sel).addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; set(b.dataset[attr]); a.$(sel).querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    seg('[data-k="f"]', 'f', (v) => { key = v; });
    seg('[data-k="w"]', 'w', (v) => { where = v; });
    a.$('[data-k="a"]').addEventListener('input', sync);
    a.onTry = sync;
    a.tr('quad', 'out', 0);
    return a;
  },
  steps: [
    {
      title: 'f(x) + a: move up',
      text: '<p>Adding \\(a\\) <b>outside</b> the function adds \\(a\\) to every \\(y\\) value. The graph moves <b>up</b> by \\(a\\): \\(y = x^2 + 3\\) is \\(y = x^2\\) moved up 3.</p>',
      async on(a, ctx) { a.tryMode(false); for (const k of [0, 1, 2, 3]) { a.tr('quad', 'out', k); if (!(await ctx.sleep(700))) return; } },
    },
    {
      title: 'f(x + a): move left',
      text: '<p>Adding \\(a\\) <b>inside</b> the bracket moves the graph <b>left</b> by \\(a\\) (the opposite way to what you might expect). \\(y = (x + 2)^2\\) has its minimum at \\(x = -2\\).</p>',
      tip: 'Inside the bracket: do the opposite. Outside: do what it says.',
      async on(a, ctx) { a.tryMode(false); for (const k of [0, 1, 2]) { a.tr('quad', 'in', k); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'Trig graphs too',
      text: '<p>\\(y = \\sin(x + 90°)\\) is \\(y = \\sin x\\) moved 90° left, which is exactly \\(y = \\cos x\\). \\(y = \\cos x - 1\\) is \\(y = \\cos x\\) moved down 1.</p>',
      async on(a, ctx) { a.tryMode(false); a.tr('sin', 'in', 2); if (!(await ctx.sleep(1800))) return; a.tr('cos', 'out', -1); },
    },
    {
      title: 'Writing the function',
      text: '<p>Working backwards: the graph of \\(y = x^2\\) is moved 3 right and 1 down. The new equation is \\(y = (x - 3)^2 - 1\\).</p>',
      on: FD.walk([['\\text{3 right: } f(x - 3) = (x - 3)^2', 'inside, opposite sign'], ['\\text{1 down: } (x - 3)^2 - 1', 'outside'], ['\\text{translation } \\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}', '']], (a) => a.tr('quad', 'in', -3), 1500),
    },
    {
      title: 'Try it: translate a graph',
      text: '<p>Choose a function, inside or outside, and the value of \\(a\\). The grey curve is \\(y = f(x)\\); the coloured one is the new graph.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'translations',
  gens: [
    () => { const k = FD.rndNZ(-5, 5), out = Math.random() < .5; return { type: 'mcq', q: `Describe the transformation that maps \\(y = f(x)\\) onto \\(y = f(x${out ? ')' : ''} ${FD.sg(k).trim()}${out ? '' : ')'}\\).`, opts: (out ? [`translation \\(\\begin{pmatrix} 0 \\\\ ${k} \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} ${-k} \\\\ 0 \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} 0 \\\\ ${-k} \\end{pmatrix}\\)`] : [`translation \\(\\begin{pmatrix} ${-k} \\\\ 0 \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} 0 \\\\ ${k} \\end{pmatrix}\\)`, `translation \\(\\begin{pmatrix} 0 \\\\ ${-k} \\end{pmatrix}\\)`]), why: out ? `Outside the function: up/down by ${k}.` : `Inside the bracket: the opposite way, ${-k} along \\(x\\).` }; },
    () => { const p = FD.rndNZ(-4, 4), q = FD.rndNZ(-5, 5); return { type: 'num', q: `The graph of \\(y = (x ${FD.sg(-p).trim()})^2 ${FD.sg(q)}\\) is a translation of \\(y = x^2\\). Find the coordinates of its turning point.`, a: [p, q], fields: ['\\(x\\) =', '\\(y\\) ='], why: `\\(y = x^2\\) has its minimum at \\((0, 0)\\). It moves ${p > 0 ? 'right' : 'left'} ${Math.abs(p)} and ${q > 0 ? 'up' : 'down'} ${Math.abs(q)}: \\((${p}, ${q})\\).` }; },
  ],
});

FD.check({
  section: 'translations',
  items: [
    { type: 'mcq', q: 'How is \\(y = x^2 - 4\\) related to \\(y = x^2\\)?', opts: ['moved down 4', 'moved up 4', 'moved left 4', 'moved right 4'], why: 'Outside: \\(f(x) - 4\\).' },
    { type: 'mcq', q: 'How is \\(y = (x - 5)^2\\) related to \\(y = x^2\\)?', opts: ['moved right 5', 'moved left 5', 'moved down 5', 'moved up 5'], why: 'Inside: the opposite way.' },
    { type: 'num', q: 'Write down the turning point of \\(y = (x + 1)^2 + 3\\).', a: [-1, 3], fields: ['\\(x\\) =', '\\(y\\) ='], why: '\\((0, 0)\\) moved left 1 and up 3.' },
    { type: 'tf', q: '\\(y = \\sin(x - 90°)\\) is the graph of \\(y = \\sin x\\) moved 90° to the right.', a: true, why: 'Inside the bracket, − moves right.' },
  ],
});
