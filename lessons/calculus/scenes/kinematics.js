// Kinematics: a particle moves along a line with s = t³ − 6t² + 9t. v = ds/dt, a = dv/dt.
const CA_S = (t) => t ** 3 - 6 * t * t + 9 * t, CA_V = (t) => 3 * t * t - 12 * t + 9, CA_A = (t) => 6 * t - 12;
FD.add({
  id: 'kinematics',
  title: 'Kinematics and rates of change',
  tab: 'Kinematics',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Displacement \\(s\\)', 'The distance from a fixed point, in a direction.'],
    ['Velocity \\(v\\)', '\\(v = \\dfrac{ds}{dt}\\): the rate of change of displacement.'],
    ['Acceleration \\(a\\)', '\\(a = \\dfrac{dv}{dt}\\): the rate of change of velocity.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'ca-k',
      vis: '<svg class="ca-track" viewBox="0 0 520 60" role="img" aria-label="A particle moving along a line" data-k="tr"></svg><div data-k="g"></div>',
      tryHtml: '<label class="ctrl">Time \\(t\\) (s) <input type="range" data-k="t" min="0" max="4.5" step="0.25" value="0.5"><output data-k="ot">0.5</output></label>',
    });
    const tr = a.$('[data-k="tr"]');
    const g = FD.graph(a.$('[data-k="g"]'), { w: 560, h: 300, x: [0, 4.5], y: [-6, 12], step: 0.5, ystep: 3, label: 'Graphs of displacement and velocity against time' });
    a.at = (t) => {
      const X = (s) => 20 + s * 110;
      tr.innerHTML = `<line class="ca-line" x1="20" y1="30" x2="500" y2="30"/>${[0, 1, 2, 3, 4].map((s) => `<line class="ca-line" x1="${X(s)}" y1="24" x2="${X(s)}" y2="36"/><text class="g-lbl" x="${X(s)}" y="54" text-anchor="middle">${s} m</text>`).join('')}${t != null ? `<circle class="pt hot" cx="${X(Math.min(4.2, CA_S(t)))}" cy="30" r="9"/>` : ''}`;
      g.draw(g.curve(CA_S) + g.curve(CA_V, 'ca-dash'), t != null ? g.pt(t, CA_S(t), 'hot') + g.pt(t, CA_V(t), 'c2') : '');
    };
    const sync = () => {
      const t = +a.$('[data-k="t"]').value; a.$('[data-k="ot"]').textContent = t;
      a.at(t);
      a.big(`s = ${FD.num(FD.round(CA_S(t), 2))}, \\; v = ${FD.num(FD.round(CA_V(t), 2))}, \\; a = ${FD.num(CA_A(t))}`);
      a.msg(Math.abs(CA_V(t)) < 1e-9 ? 'Velocity 0: the particle is momentarily at rest.' : CA_V(t) > 0 ? 'Velocity positive: moving forwards.' : 'Velocity negative: moving backwards.');
    };
    a.$('[data-k="t"]').addEventListener('input', sync);
    a.onTry = sync;
    a.at(null);
    return a;
  },
  steps: [
    {
      title: 'Displacement over time',
      text: '<p>A particle moves along a straight line. Its displacement after \\(t\\) seconds is \\(s = t^3 - 6t^2 + 9t\\) metres. It moves forwards, stops, comes back, stops again, then goes forwards.</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let t = 0; t <= 4.5; t += 0.25) { a.at(t); if (!(await ctx.sleep(300))) return; } },
    },
    {
      title: 'Velocity = ds/dt',
      text: '<p>Velocity is the rate of change of displacement, so differentiate \\(s\\). The dashed curve is \\(v\\).</p>',
      on: FD.walk([['v = \\frac{ds}{dt} = 3t^2 - 12t + 9', ''], ['v = 0: \\; 3(t - 1)(t - 3) = 0', 'at rest'], ['t = 1 \\text{ s and } t = 3 \\text{ s}', '']], (a) => { a.at(1); a.big(''); }, 1400),
    },
    {
      title: 'Acceleration = dv/dt',
      text: '<p>Differentiate again: \\(a = \\frac{dv}{dt} = 6t - 12\\). At \\(t = 3\\), \\(a = 6\\) m/s².</p>',
      tip: 'Units: s in m, v in m/s, a in m/s².',
      on: FD.walk([['a = \\frac{dv}{dt} = 6t - 12', ''], ['t = 3: \\; a = 6 \\text{ m/s}^2', '']], (a) => { a.at(3); a.big(''); }),
    },
    {
      title: 'Try it: follow the particle',
      text: '<p>Move the time. Watch the particle on the line and its displacement and velocity on the graph. When is it at rest?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'kinematics',
  gens: [
    () => { const p = FD.rnd(1, 4), q = FD.rnd(1, 9), r = FD.rnd(0, 9), t = FD.rnd(1, 5); return { type: 'num', q: `A particle has displacement \\(s = ${FD.poly([p, 0, q, r], 't')}\\) metres after \\(t\\) seconds. Find its velocity when \\(t = ${t}\\).`, a: 3 * p * t * t + q, why: `\\(v = \\dfrac{ds}{dt} = ${FD.poly([3 * p, 0, q], 't')}\\). At \\(t = ${t}\\): \\(${3 * p * t * t + q}\\) m/s.` }; },
    () => { const p = FD.rnd(1, 4), q = FD.rndNZ(-8, 8), t = FD.rnd(1, 5); return { type: 'num', q: `The velocity of a particle is \\(v = ${FD.poly([p, q, 5], 't')}\\) m/s. Find its acceleration when \\(t = ${t}\\).`, a: 2 * p * t + q, why: `\\(a = \\dfrac{dv}{dt} = ${FD.poly([2 * p, q], 't')}\\). At \\(t = ${t}\\): \\(${2 * p * t + q}\\) m/s².` }; },
  ],
});

FD.check({
  section: 'kinematics',
  items: [
    { type: 'num', q: '\\(s = 5t^2 + 2t\\). Find \\(v\\) when \\(t = 3\\).', a: 32, why: '\\(v = 10t + 2\\).' },
    { type: 'num', q: '\\(v = t^2 - 4t + 7\\). Find the acceleration when \\(t = 5\\).', a: 6, why: '\\(a = 2t - 4\\).' },
    { type: 'num', q: '\\(v = 12 - 3t\\). When is the particle at rest?', a: 4, unit: 's', why: '\\(12 - 3t = 0\\).' },
    { type: 'mcq', q: 'Velocity is found from displacement by…', opts: ['differentiating', 'multiplying by \\(t\\)', 'dividing by \\(t\\)', 'squaring'], why: '\\(v = \\frac{ds}{dt}\\).' },
  ],
});
