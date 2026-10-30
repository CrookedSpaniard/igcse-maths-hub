// Distance–time graph of a journey; a dot moves along it. Gradient = speed.
// A journey is a list of [time (min), distance (km)] corners.
const RL_TRIP = [[0, 0], [20, 12], [35, 12], [60, 30], [90, 0]];
FD.add({
  id: 'distance-time',
  title: 'Distance–time graphs',
  tab: 'Distance–time',
  icon: 'graph',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Distance–time graph', 'Shows how far something is from its start at each time.'],
    ['Speed', 'The gradient of a distance–time graph: \\(\\text{speed} = \\dfrac{\\text{distance}}{\\text{time}}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'rl-d', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: '<label class="ctrl">Time (minutes) <input type="range" data-k="t" min="0" max="90" value="10"><output data-k="ot">10</output></label>',
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 420, h: 330, x: [0, 90], y: [0, 35], step: 10, ystep: 5, pad: 34, label: 'Distance–time graph of a bike ride' });
    const pos = (t) => { for (let i = 1; i < RL_TRIP.length; i++) { const [t0, d0] = RL_TRIP[i - 1], [t1, d1] = RL_TRIP[i]; if (t <= t1) return d0 + ((d1 - d0) * (t - t0)) / (t1 - t0); } return 0; };
    const leg = (t) => { for (let i = 1; i < RL_TRIP.length; i++) if (t <= RL_TRIP[i][0]) return i; return RL_TRIP.length - 1; };
    a.trip = (t, hl) => {
      const d = RL_TRIP.map(([x, y], i) => `${i ? 'L' : 'M'}${g.ax.X(x)} ${g.ax.Y(y)}`).join('');
      const h = hl ? `<line class="rl-hl" x1="${g.ax.X(RL_TRIP[hl - 1][0])}" y1="${g.ax.Y(RL_TRIP[hl - 1][1])}" x2="${g.ax.X(RL_TRIP[hl][0])}" y2="${g.ax.Y(RL_TRIP[hl][1])}"/>` : '';
      g.draw(`<path class="curve" d="${d}"/>${h}`, (t != null ? g.pt(t, pos(t), 'hot') : '') + `<text class="g-lbl" x="${g.ax.X(90)}" y="${g.ax.Y(0) + 26}" text-anchor="end">time (min)</text><text class="g-lbl" x="${g.ax.X(0) + 6}" y="${g.ax.Y(35) + 4}">distance (km)</text>`);
    };
    const sync = () => {
      const t = +a.$('[data-k="t"]').value; a.$('[data-k="ot"]').textContent = t;
      const i = leg(t), [t0, d0] = RL_TRIP[i - 1], [t1, d1] = RL_TRIP[i], v = ((d1 - d0) / (t1 - t0)) * 60;
      a.trip(t, i);
      a.big(`${FD.round(pos(t), 1)} \\text{ km from home}`);
      a.msg(!v ? 'Flat line: stopped.' : `${v > 0 ? 'Going away' : 'Coming back'} at \\(\\frac{${Math.abs(d1 - d0)} \\text{ km}}{${t1 - t0} \\text{ min}} = ${Math.abs(v)}\\) km/h.`);
    };
    a.$('[data-k="t"]').addEventListener('input', sync);
    a.onTry = sync;
    a.trip(null);
    return a;
  },
  steps: [
    {
      title: 'Reading the story',
      text: '<p>A bike ride. For 20 minutes the rider moves away from home, then the line is <b>flat</b> for 15 minutes (a stop), then further away, then all the way back home.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let t = 0; t <= 90; t += 5) { a.trip(t); if (!(await ctx.sleep(250))) return; } },
    },
    {
      title: 'Speed is the gradient',
      text: '<p>In the first part the rider goes 12 km in 20 minutes. 20 minutes is \\(\\frac13\\) of an hour, so the speed is \\(12 \\div \\frac13 = 36\\) km/h.</p>',
      tip: 'Change minutes to hours before working out km/h.',
      on: FD.walk([['\\text{speed} = \\frac{\\text{distance}}{\\text{time}}', ''], ['= \\frac{12 \\text{ km}}{20 \\text{ min}} = 0.6 \\text{ km/min}', ''], ['0.6 \\times 60 = 36 \\text{ km/h}', '']], (a) => { a.trip(null, 1); a.big(''); }),
    },
    {
      title: 'Steeper means faster',
      text: '<p>The steepest part of the graph is the fastest. The way home: 30 km in 30 minutes = 60 km/h, the fastest part.</p>',
      async on(a) { a.tryMode(false); a.trip(null, 4); a.big('30 \\text{ km in } 30 \\text{ min} = 60 \\text{ km/h}'); },
    },
    {
      title: 'Try it: follow the ride',
      text: '<p>Move through time. The message tells you what the rider is doing and how fast.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'distance-time',
  gens: [
    () => { let d, t, v; do { d = FD.pick([6, 9, 12, 15, 18, 24, 30]); t = FD.pick([15, 20, 30, 40, 45, 60]); v = (d / t) * 60; } while (!Number.isInteger(v)); return { type: 'num', q: `A distance–time graph shows a cyclist travelling ${d} km in ${t} minutes. Find the speed in km/h.`, a: v, why: `${t} minutes = \\(${FD.ftex(t, 60)}\\) of an hour. \\(${d} \\div ${FD.ftex(t, 60)} = ${v}\\) km/h.` }; },
    () => { const k = FD.rnd(0, 2), L = ['going away from the start at a steady speed', 'stopped', 'coming back towards the start']; return { type: 'mcq', q: `On a distance–time graph, a section of the line ${['slopes upwards', 'is horizontal', 'slopes downwards'][k]}. The person is…`, opts: [L[k], ...L.filter((x, i) => i !== k), 'speeding up'], why: `${['Distance is increasing', 'Distance is not changing', 'Distance from the start is decreasing'][k]}.` }; },
  ],
});

FD.check({
  section: 'distance-time',
  items: [
    { type: 'num', q: 'A walker covers 6 km in 1.5 hours. What is the speed in km/h?', a: 4, why: '\\(6 \\div 1.5\\).' },
    { type: 'num', q: 'A runner goes 5 km in 25 minutes. What is the speed in km/h?', a: 12, why: '\\(5 \\div \\frac{25}{60} = 12\\).' },
    { type: 'mcq', q: 'On a distance–time graph, the steeper line shows…', opts: ['a higher speed', 'a lower speed', 'a stop', 'a longer time'], why: 'Gradient = speed.' },
    { type: 'tf', q: 'A horizontal line on a distance–time graph means constant speed.', a: false, why: 'It means the object is not moving.' },
  ],
});
