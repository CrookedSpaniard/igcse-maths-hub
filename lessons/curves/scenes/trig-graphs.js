// Higher: y = sin x, cos x, tan x from −360° to 360°, with a point you can move along the curve.
const CU_TRIG = { sin: (d) => Math.sin((d * Math.PI) / 180), cos: (d) => Math.cos((d * Math.PI) / 180), tan: (d) => Math.tan((d * Math.PI) / 180) };
FD.add({
  id: 'trig-graphs',
  title: 'Graphs of sin, cos and tan',
  tab: 'Trig graphs',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Periodic', 'Repeating. \\(\\sin x\\) and \\(\\cos x\\) repeat every 360°; \\(\\tan x\\) every 180°.'],
    ['Amplitude', 'The height of the wave above its middle: 1 for \\(\\sin x\\) and \\(\\cos x\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'cu-t',
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="f"><button class="btn primary" data-f="sin">\\(\\sin x\\)</button><button class="btn" data-f="cos">\\(\\cos x\\)</button><button class="btn" data-f="tan">\\(\\tan x\\)</button></div>
        <label class="ctrl">\\(x\\) (°) <input type="range" data-k="x" min="-360" max="360" step="15" value="30"><output data-k="ox">30</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 640, h: 300, x: [-360, 360], y: [-3, 3], step: 90, ystep: 1, label: 'Trigonometric graphs' });
    a.wave = (fn, x) => {
      const f = CU_TRIG[fn], pieces = fn === 'tan' ? [[-360, -270], [-270, -90], [-90, 90], [90, 270], [270, 360]].map(([p, q]) => [p + 0.5, q - 0.5]) : [[-360, 360]];
      const asym = fn === 'tan' ? [-270, -90, 90, 270].map((v) => g.line(v, -3, v, 3, 'g-line')).join('') : '';
      g.draw(asym + pieces.map(([p, q]) => g.curve(f, '', p, q)).join(''), x != null && Math.abs(f(x)) <= 3 && !(fn === 'tan' && Math.abs(Math.cos((x * Math.PI) / 180)) < 1e-9) ? g.pt(x, f(x), 'hot') : '');
    };
    let fn = 'sin';
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = String(x).replace('-', '−');
      a.wave(fn, x);
      const v = CU_TRIG[fn](x);
      a.big(fn === 'tan' && Math.abs(Math.cos((x * Math.PI) / 180)) < 1e-9 ? `\\tan ${x}° \\text{ is undefined}` : `\\${fn} ${x}° = ${FD.num(FD.round(v, 3))}`);
    };
    a.$('[data-k="f"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; fn = b.dataset.f; a.$('[data-k="f"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    a.wave('sin');
    return a;
  },
  steps: [
    {
      title: 'y = sin x',
      text: '<p>The sine graph is a wave between \\(-1\\) and 1. It starts at 0, reaches 1 at 90°, is 0 again at 180°, \\(-1\\) at 270° and 0 at 360°. Then it repeats.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let x = 0; x <= 360; x += 30) { a.wave('sin', x); a.big(`\\sin ${x}° = ${FD.num(FD.round(CU_TRIG.sin(x), 3))}`); if (!(await ctx.sleep(350))) return; } },
    },
    {
      title: 'y = cos x',
      text: '<p>The cosine graph is the same wave, moved 90° to the left: it starts at 1 when \\(x = 0\\).</p>',
      tip: 'Both repeat every 360°: their period is 360°.',
      async on(a) { a.tryMode(false); a.wave('cos', 0); a.big('\\cos 0° = 1'); },
    },
    {
      title: 'y = tan x',
      text: '<p>The tangent graph repeats every 180°. At 90°, 270°, … it is undefined: the graph has vertical <b>asymptotes</b> there.</p>',
      async on(a) { a.tryMode(false); a.wave('tan', 45); a.big('\\tan 45° = 1'); },
    },
    {
      title: 'Symmetry gives more solutions',
      text: '<p>\\(\\sin 30° = 0.5\\). The graph is symmetrical about 90°, so \\(\\sin 150° = 0.5\\) too. A horizontal line \\(y = 0.5\\) meets the curve many times.</p>',
      on: FD.walk([['\\sin x = 0.5', ''], ['x = 30°', 'calculator'], ['x = 180° - 30° = 150°', 'symmetry of the sine curve']], (a) => { a.wave('sin', 150); a.big(''); }),
    },
    {
      title: 'Try it: move along the curve',
      text: '<p>Choose a graph and move \\(x\\) from −360° to 360°. Find where each graph is 0, its largest value and where it repeats.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'trig-graphs',
  gens: [
    () => { const [fn, x, v] = FD.pick([['sin', 90, 1], ['sin', 270, -1], ['sin', 180, 0], ['cos', 0, 1], ['cos', 180, -1], ['cos', 90, 0], ['tan', 45, 1], ['tan', 180, 0], ['sin', -90, -1], ['cos', 360, 1]]); return { type: 'num', q: `Use the graph to write down the value of \\(\\${fn} ${x}°\\).`, a: v, why: `From the graph of \\(y = \\${fn} x\\), at \\(x = ${x}°\\) the value is ${v}.` }; },
    () => { const x = FD.pick([20, 30, 40, 50, 60, 70]); return { type: 'num', q: `\\(\\sin ${x}° = ${FD.num(FD.round(CU_TRIG.sin(x), 3))}\\). Find another angle between 0° and 360° with the same sine.`, a: 180 - x, why: `The sine graph is symmetrical about 90°: \\(180° - ${x}° = ${180 - x}°\\).` }; },
  ],
});

FD.check({
  section: 'trig-graphs',
  items: [
    { type: 'mcq', q: 'What is the period of \\(y = \\cos x\\)?', opts: ['360°', '180°', '90°', '1'], why: 'It repeats every 360°.' },
    { type: 'mcq', q: 'Where is \\(\\tan x\\) undefined?', opts: ['\\(x = 90°\\)', '\\(x = 0°\\)', '\\(x = 180°\\)', '\\(x = 45°\\)'], why: 'Vertical asymptote at 90°.' },
    { type: 'num', q: '\\(\\cos 60° = 0.5\\). Find another angle between 0° and 360° where \\(\\cos x = 0.5\\).', a: 300, why: 'The cosine graph is symmetrical about 180°: \\(360° - 60°\\).' },
    { type: 'tf', q: 'The largest value of \\(\\sin x\\) is 1.', a: true, why: 'The wave goes between −1 and 1.' },
  ],
});
