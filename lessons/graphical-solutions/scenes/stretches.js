// Stretches and reflections: y = af(x) stretches vertically by a; y = f(ax) by 1/a horizontally.
// a = −1 gives reflections: −f(x) in the x-axis, f(−x) in the y-axis.
FD.add({
  id: 'stretches',
  title: 'Stretches and reflections: af(x) and f(ax)',
  tab: 'Stretches',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['\\(y = af(x)\\)', 'Stretch parallel to the \\(y\\)-axis, scale factor \\(a\\). \\(a = -1\\): reflection in the \\(x\\)-axis.'],
    ['\\(y = f(ax)\\)', 'Stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac{1}{a}\\). \\(a = -1\\): reflection in the \\(y\\)-axis.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'gs-s', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="f"><button class="btn primary" data-f="sin">\\(\\sin x\\)</button><button class="btn" data-f="cos">\\(\\cos x\\)</button><button class="btn" data-f="quad">\\(x^2\\)</button></div>
        <div class="seg-row" data-k="w"><button class="btn primary" data-w="out">\\(af(x)\\)</button><button class="btn" data-w="in">\\(f(ax)\\)</button></div>
        <label class="ctrl">\\(a\\) <input type="range" data-k="a" min="-3" max="3" step="0.5" value="2"><output data-k="oa">2</output></label>`,
    });
    const S = FD.gsStage(a.$('[data-k="g"]'));
    a.st = (key, where, k) => {
      const F = GS_F[key];
      S(key, [where === 'out' ? (x) => k * F.f(x) : (x) => F.f(k * x)]);
      const arg = key === 'quad' ? `(${k}x)^2` : `\\${key}(${k}x)`;
      a.big(where === 'out' ? `y = ${k}${F.t}` : `y = ${arg}`);
      a.msg(k === -1 ? (where === 'out' ? 'Reflection in the \\(x\\)-axis.' : 'Reflection in the \\(y\\)-axis.') : where === 'out' ? `Stretch parallel to the \\(y\\)-axis, scale factor ${k}.` : `Stretch parallel to the \\(x\\)-axis, scale factor \\(${FD.ftex(2, 2 * k)}\\).`);
    };
    let key = 'sin', where = 'out';
    const sync = () => { let k = +a.$('[data-k="a"]').value; if (!k) { k = 1; a.$('[data-k="a"]').value = 1; } a.$('[data-k="oa"]').textContent = String(k).replace('-', '−'); a.st(key, where, k); };
    const seg = (sel, attr, set) => a.$(sel).addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; set(b.dataset[attr]); a.$(sel).querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    seg('[data-k="f"]', 'f', (v) => { key = v; });
    seg('[data-k="w"]', 'w', (v) => { where = v; });
    a.$('[data-k="a"]').addEventListener('input', sync);
    a.onTry = sync;
    a.st('sin', 'out', 1);
    return a;
  },
  steps: [
    {
      title: 'af(x): stretch up and down',
      text: '<p>\\(y = 2\\sin x\\) doubles every \\(y\\) value. The wave is twice as tall: a stretch parallel to the \\(y\\)-axis, scale factor 2. The points on the \\(x\\)-axis do not move.</p>',
      async on(a, ctx) { a.tryMode(false); for (const k of [1, 2, 3]) { a.st('sin', 'out', k); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'f(ax): squash sideways',
      text: '<p>\\(y = \\sin 2x\\) reaches each value twice as fast. The wave is squashed: a stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac12\\). It now repeats every 180°.</p>',
      tip: 'Inside the function: do the opposite. Multiply by 2 inside → scale factor ½.',
      async on(a, ctx) { a.tryMode(false); for (const k of [1, 2]) { a.st('sin', 'in', k); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Reflections',
      text: '<p>\\(y = -f(x)\\) flips the graph in the \\(x\\)-axis. \\(y = f(-x)\\) flips it in the \\(y\\)-axis.</p>',
      async on(a, ctx) { a.tryMode(false); a.st('quad', 'out', -1); if (!(await ctx.sleep(1500))) return; a.st('sin', 'in', -1); },
    },
    {
      title: 'Try it: stretch a graph',
      text: '<p>Choose a function, inside or outside, and \\(a\\). Use \\(a = -1\\) for reflections and \\(a = 0.5\\) to see a stretch the other way.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'stretches',
  gens: [
    () => { const k = FD.pick([2, 3, 4]), out = Math.random() < .5, fn = FD.pick(['\\sin x', '\\cos x', 'f(x)']); const eq = out ? `${k}${fn}` : fn.replace('x', `${k}x`); return { type: 'mcq', q: `Describe the transformation that maps \\(y = ${fn}\\) onto \\(y = ${eq}\\).`, opts: out ? [`stretch parallel to the \\(y\\)-axis, scale factor ${k}`, `stretch parallel to the \\(x\\)-axis, scale factor ${k}`, `stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac{1}{${k}}\\)`, `translation up ${k}`] : [`stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac{1}{${k}}\\)`, `stretch parallel to the \\(x\\)-axis, scale factor ${k}`, `stretch parallel to the \\(y\\)-axis, scale factor ${k}`, `translation left ${k}`], why: out ? `Multiplying outside stretches the \\(y\\) values by ${k}.` : `Multiplying \\(x\\) by ${k} inside squashes the graph: scale factor \\(\\frac{1}{${k}}\\).` }; },
    () => { const k = FD.pick([2, 3, 4]); return { type: 'num', q: `\\(y = \\sin x\\) has a maximum at \\((90°, 1)\\). Where is the first maximum (for \\(x > 0\\)) of \\(y = ${k}\\sin x\\)? Give the \\(y\\)-coordinate.`, a: k, why: `Every \\(y\\) value is multiplied by ${k}, so the maximum is \\((90°, ${k})\\).` }; },
  ],
});

FD.check({
  section: 'stretches',
  items: [
    { type: 'mcq', q: 'The graph of \\(y = \\cos 3x\\) repeats every…', opts: ['120°', '360°', '1080°', '3°'], why: 'Squashed by scale factor \\(\\frac13\\): \\(360° \\div 3\\).' },
    { type: 'mcq', q: '\\(y = -x^2\\) is \\(y = x^2\\)…', opts: ['reflected in the \\(x\\)-axis', 'reflected in the \\(y\\)-axis', 'moved down 1', 'stretched by 2'], why: 'Every \\(y\\) value changes sign.' },
    { type: 'num', q: 'The point \\((2, 5)\\) is on \\(y = f(x)\\). What is the \\(y\\)-coordinate of the matching point on \\(y = 3f(x)\\)?', a: 15, why: '\\(y\\) values are multiplied by 3; \\(x\\) stays 2.' },
    { type: 'num', q: 'The point \\((6, 4)\\) is on \\(y = f(x)\\). What is the \\(x\\)-coordinate of the matching point on \\(y = f(2x)\\)?', a: 3, why: 'Horizontal stretch, scale factor \\(\\frac12\\).' },
  ],
});
