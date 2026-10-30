// Speed–time graph: gradient = acceleration, area under the graph = distance travelled.
FD.add({
  id: 'speed-time',
  title: 'Speed–time graphs',
  tab: 'Speed–time',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Acceleration', 'How quickly the speed changes: the gradient of a speed–time graph, in m/s².'],
    ['Deceleration', 'Slowing down: a negative gradient.'],
    ['Distance travelled', 'The area under a speed–time graph.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'rl-s', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Top speed (m/s) <input type="range" data-k="v" min="4" max="20" step="2" value="12"><output data-k="ov">12</output></label>
        <label class="ctrl">Speeding up (s) <input type="range" data-k="t1" min="2" max="10" value="4"><output data-k="ot1">4</output></label>
        <label class="ctrl">Steady (s) <input type="range" data-k="t2" min="0" max="10" value="6"><output data-k="ot2">6</output></label>
        <label class="ctrl">Slowing down (s) <input type="range" data-k="t3" min="2" max="10" value="4"><output data-k="ot3">4</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 420, h: 320, x: [0, 30], y: [0, 22], step: 5, ystep: 2, pad: 34, label: 'Speed–time graph' });
    a.trap = (v, t1, t2, t3, shade = false) => {
      const P = [[0, 0], [t1, v], [t1 + t2, v], [t1 + t2 + t3, 0]].map(([x, y]) => `${g.ax.X(x)} ${g.ax.Y(y)}`);
      g.draw(`${shade ? `<path class="g-fill" d="M${P.join('L')}Z"/>` : ''}<path class="curve" d="M${P.join('L')}"/>`, `<text class="g-lbl" x="${g.ax.X(30)}" y="${g.ax.Y(0) + 26}" text-anchor="end">time (s)</text><text class="g-lbl" x="${g.ax.X(0) + 6}" y="${g.ax.Y(22) + 4}">speed (m/s)</text>`);
    };
    const sync = () => {
      const [v, t1, t2, t3] = ['v', 't1', 't2', 't3'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['v', 't1', 't2', 't3'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = [v, t1, t2, t3][i]; });
      a.trap(v, t1, t2, t3, true);
      const D = (v * t1) / 2 + v * t2 + (v * t3) / 2;
      a.big(`\\text{distance} = ${FD.num(D)} \\text{ m}`);
      a.msg(`Acceleration \\(${v} \\div ${t1} = ${FD.num(FD.round(v / t1, 2))}\\) m/s². Area = two triangles + a rectangle.`);
    };
    ['v', 't1', 't2', 't3'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.trap(12, 4, 6, 4);
    return a;
  },
  steps: [
    {
      title: 'Reading a speed–time graph',
      text: '<p>A car speeds up from 0 to 12 m/s in 4 seconds, travels at a steady 12 m/s for 6 seconds, then slows to a stop in 4 seconds.</p><p>A flat line here means <b>constant speed</b>, not stopped.</p>',
      tip: 'Check the label on the vertical axis: speed or distance?',
      async on(a) { a.tryMode(false); a.trap(12, 4, 6, 4); a.big(''); },
    },
    {
      title: 'Acceleration is the gradient',
      text: '<p>In the first 4 seconds the speed goes up by 12 m/s. Acceleration \\(= \\frac{12}{4} = 3\\) m/s². When slowing down the gradient is \\(-3\\): a deceleration of 3 m/s².</p>',
      on: FD.walk([['\\text{acceleration} = \\frac{\\text{change in speed}}{\\text{time}}', ''], ['= \\frac{12}{4} = 3 \\text{ m/s}^2', 'speeding up'], ['\\frac{-12}{4} = -3 \\text{ m/s}^2', 'slowing down']], (a) => { a.trap(12, 4, 6, 4); a.big(''); }),
    },
    {
      title: 'Distance is the area',
      text: '<p>The area under the graph is the distance travelled. Split it into simple shapes.</p>',
      on: FD.walk([['\\tfrac12 \\times 4 \\times 12 = 24', 'triangle'], ['6 \\times 12 = 72', 'rectangle'], ['\\tfrac12 \\times 4 \\times 12 = 24', 'triangle'], ['24 + 72 + 24 = 120 \\text{ m}', 'total distance']], (a) => { a.trap(12, 4, 6, 4, true); a.big(''); }, 1300),
    },
    {
      title: 'Try it: design a journey',
      text: '<p>Change the top speed and the three times. The shaded area is the distance travelled.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'speed-time',
  gens: [
    () => { const t = FD.rnd(2, 10), acc = FD.pick([1, 1.5, 2, 2.5, 3, 4]); return { type: 'num', q: `A speed–time graph goes in a straight line from 0 m/s to ${FD.num(acc * t)} m/s in ${t} seconds. Find the acceleration.`, a: acc, why: `\\(${FD.num(acc * t)} \\div ${t} = ${acc}\\) m/s².` }; },
    () => { const v = FD.pick([6, 8, 10, 12, 15, 20]), t1 = FD.rnd(2, 8), t2 = FD.rnd(2, 10), t3 = FD.rnd(2, 8), D = (v * t1) / 2 + v * t2 + (v * t3) / 2; return { type: 'num', q: `A train speeds up from rest to ${v} m/s in ${t1} s, travels at ${v} m/s for ${t2} s, then slows to rest in ${t3} s. How far does it travel?`, a: D, unit: 'm', why: `Area: \\(\\tfrac12(${t1})(${v}) + ${t2}(${v}) + \\tfrac12(${t3})(${v}) = ${FD.num((v * t1) / 2)} + ${v * t2} + ${FD.num((v * t3) / 2)} = ${FD.num(D)}\\) m.` }; },
  ],
});

FD.check({
  section: 'speed-time',
  items: [
    { type: 'num', q: 'A bike speeds up from 2 m/s to 10 m/s in 4 seconds. Find the acceleration.', a: 2, why: '\\((10 - 2) \\div 4\\).' },
    { type: 'num', q: 'A car travels at a constant 15 m/s for 20 seconds. How far does it go?', a: 300, unit: 'm', why: 'Rectangle: \\(15 \\times 20\\).' },
    { type: 'mcq', q: 'On a speed–time graph, a horizontal line means…', opts: ['constant speed', 'stopped', 'speeding up', 'going backwards'], why: 'The speed is not changing.' },
    { type: 'mcq', q: 'The distance travelled is found from a speed–time graph by…', opts: ['the area under the graph', 'the gradient', 'the highest point', 'the time axis'], why: 'Distance = speed × time = area.' },
  ],
});
