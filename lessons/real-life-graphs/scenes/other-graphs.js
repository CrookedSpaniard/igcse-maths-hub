// Filling containers: the narrower the container, the faster the water level rises.
// Each container: a list of widths from the bottom up; the graph is depth against time at a steady flow.
const RL_POTS = [
  { name: 'cylinder', w: [6, 6, 6, 6, 6, 6, 6, 6] },
  { name: 'cone (wide at the top)', w: [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
  { name: 'vase (narrow at the top)', w: [8, 7, 6, 5, 4, 3, 2.5, 2] },
  { name: 'flask', w: [8, 8, 8, 8, 2.5, 2.5, 2.5, 2.5] },
];
// time to fill each layer ∝ width²; returns points [time, depth]
const rlFill = (w) => { let t = 0; const pts = [[0, 0]]; w.forEach((x, i) => { t += x * x; pts.push([t, i + 1]); }); return pts.map(([a, b]) => [a / t, b / w.length]); };

FD.add({
  id: 'other-graphs',
  title: 'Curved and other real-life graphs',
  tab: 'Other graphs',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Rate of change', 'How fast one quantity changes compared with another. On a graph it is the steepness.'],
    ['Curved graph', 'When the rate of change is not constant, the graph is a curve, not a straight line.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'rl-o', side: true,
      vis: '<div class="rl-pair"><svg class="rl-pot" viewBox="0 0 120 170" role="img" aria-label="A container being filled with water" data-k="pot"></svg><div data-k="g"></div></div>',
      tryHtml: `<div class="seg-row" data-k="p">${RL_POTS.map((p, i) => `<button class="btn ${i ? '' : 'primary'}" data-i="${i}">${p.name.split(' ')[0]}</button>`).join('')}</div>
        <label class="ctrl">Time <input type="range" data-k="t" min="0" max="100" value="50"><output data-k="ot">50%</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 300, h: 260, x: [0, 1], y: [0, 1], step: 0.25, labels: false, label: 'Depth of water against time' });
    const pot = a.$('[data-k="pot"]');
    a.fill = (k, frac) => {
      const P = RL_POTS[k], n = P.w.length, h = 140 / n, pts = rlFill(P.w);
      let depth = 0; for (let i = 1; i < pts.length; i++) { const [t0, d0] = pts[i - 1], [t1, d1] = pts[i]; if (frac <= t1) { depth = d0 + ((d1 - d0) * (frac - t0)) / (t1 - t0); break; } depth = d1; }
      const layer = (i, cls) => `<rect class="${cls}" x="${60 - P.w[i] * 6}" y="${155 - (i + 1) * h}" width="${P.w[i] * 12}" height="${h + 0.5}"/>`;
      const filled = depth * n;
      pot.innerHTML = P.w.map((_, i) => layer(i, 'rl-glass')).join('') + P.w.map((x, i) => (i < filled ? `<rect class="rl-water" x="${60 - x * 6}" y="${155 - Math.min(filled, i + 1) * h}" width="${x * 12}" height="${(Math.min(filled, i + 1) - i) * h + 0.5}"/>` : '')).join('');
      const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${g.ax.X(x)} ${g.ax.Y(y)}`).join('');
      g.draw(`<path class="curve" d="${d}"/>`, g.pt(frac, depth, 'hot') + `<text class="g-lbl" x="${g.ax.X(1)}" y="${g.ax.Y(0) + 22}" text-anchor="end">time</text><text class="g-lbl" x="${g.ax.X(0) + 6}" y="${g.ax.Y(1) + 4}">depth</text>`);
    };
    let k = 0;
    const sync = () => {
      const t = +a.$('[data-k="t"]').value; a.$('[data-k="ot"]').textContent = t + '%';
      a.fill(k, t / 100);
      a.big(`\\text{${RL_POTS[k].name}}`);
      a.msg(['Same width all the way: the depth rises steadily, so the graph is a straight line.', 'Wider at the top: the depth rises more and more slowly.', 'Narrower at the top: the depth rises more and more quickly.', 'Wide then narrow: slow, then suddenly fast. Two straight sections.'][k]);
    };
    a.$('[data-k="p"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; k = +b.dataset.i; a.$('[data-k="p"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="t"]').addEventListener('input', sync);
    a.onTry = sync;
    a.fill(0, 0);
    return a;
  },
  steps: [
    {
      title: 'Filling a cylinder',
      text: '<p>Water flows into a cylinder at a steady rate. The width never changes, so the depth goes up by the same amount every second: a <b>straight line</b>.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let f = 0; f <= 1.001; f += 0.1) { a.fill(0, f); if (!(await ctx.sleep(250))) return; } },
    },
    {
      title: 'Wider at the top',
      text: '<p>In a cone that is wide at the top, each centimetre of depth needs more and more water. The depth rises more <b>slowly</b> as it fills: the graph curves and gets flatter.</p>',
      async on(a, ctx) { a.tryMode(false); for (let f = 0; f <= 1.001; f += 0.1) { a.fill(1, f); if (!(await ctx.sleep(250))) return; } },
    },
    {
      title: 'Narrow at the top',
      text: '<p>In a vase that gets narrower, the depth rises <b>faster and faster</b>: the graph gets steeper.</p>',
      tip: 'Steeper graph = faster rate of change.',
      async on(a, ctx) { a.tryMode(false); for (let f = 0; f <= 1.001; f += 0.1) { a.fill(2, f); if (!(await ctx.sleep(250))) return; } },
    },
    {
      title: 'Try it: match the shape',
      text: '<p>Choose a container and move through time. Predict the shape of the graph before you look.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'other-graphs',
  gens: [
    () => { const k = FD.rnd(0, 2), d = ['a straight line', 'a curve that gets less steep', 'a curve that gets steeper'][k]; return { type: 'mcq', q: `Water is poured at a steady rate into a ${RL_POTS[k].name}. What does the graph of depth against time look like?`, opts: [d, ...['a straight line', 'a curve that gets less steep', 'a curve that gets steeper'].filter((x) => x !== d), 'a horizontal line'], why: ['The width is constant, so the depth rises steadily.', 'The container gets wider, so the depth rises more slowly.', 'The container gets narrower, so the depth rises faster.'][k] }; },
    () => { const s = FD.pick([['A phone bill is £10 a month plus 5p per minute.', 'a straight line that does not start at 0'], ['The value of a car falls by the same percentage each year.', 'a curve that falls less and less steeply'], ['A ball is thrown up and falls back down.', 'a curve that rises then falls (a ∩ shape)']]); return { type: 'mcq', q: `${s[0]} Which graph shape fits?`, opts: [s[1], ...['a straight line that does not start at 0', 'a curve that falls less and less steeply', 'a curve that rises then falls (a ∩ shape)'].filter((x) => x !== s[1]), 'a vertical line'], why: `${s[0]} gives ${s[1]}.` }; },
  ],
});

FD.check({
  section: 'other-graphs',
  items: [
    { type: 'mcq', q: 'A taxi charges £3 plus £2 per mile. The graph of cost against miles is…', opts: ['a straight line crossing the cost axis at £3', 'a straight line through the origin', 'a curve', 'a horizontal line'], why: 'Fixed charge plus a constant rate.' },
    { type: 'mcq', q: 'A graph of temperature against time gets less steep as the time goes on. The temperature is…', opts: ['rising more and more slowly', 'rising faster and faster', 'falling', 'constant'], why: 'Less steep: a slower rate of change.' },
    { type: 'tf', q: 'Water poured steadily into a cylinder gives a straight-line depth–time graph.', a: true, why: 'Same width all the way up.' },
  ],
});
