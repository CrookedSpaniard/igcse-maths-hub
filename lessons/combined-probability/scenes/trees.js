// Probabilities for trees: a fraction n/d or a decimal x, each with a value and a label.
FD.pf = (n, d) => ({ v: n / d, n, d, t: `${n}/${d}` });
FD.pd = (x) => ({ v: x, t: String(FD.dec(x)) });
// The product of two branch probabilities, as text and as TeX.
FD.pmul = (p, q) => (p.d ? { v: p.v * q.v, n: p.n * q.n, d: p.d * q.d, t: `${p.n * q.n}/${p.d * q.d}`, x: `\\frac{${p.n}}{${p.d}} \\times \\frac{${q.n}}{${q.d}} = \\frac{${p.n * q.n}}{${p.d * q.d}}` } : { v: FD.dec(p.v * q.v), t: String(FD.dec(p.v * q.v)), x: `${p.t} \\times ${q.t} = ${FD.dec(p.v * q.v)}` });
// The sum of the outcome probabilities in pairs [[i, j], …] of tree T, as TeX.
FD.tsum = (T, pairs) => {
  const ps = pairs.map(([i, j]) => FD.pmul(T.p1[i], T.p2[i][j])), v = ps.reduce((s, p) => s + p.v, 0);
  if (ps[0].d) { const D = ps[0].d, N = ps.reduce((s, p) => s + p.n, 0); return { v, n: N, d: D, x: `${ps.length > 1 ? ps.map((p) => `\\frac{${p.n}}{${D}}`).join(' + ') + ' = ' : ''}\\frac{${N}}{${D}}${FD.gcd(N, D) > 1 ? ` = ${FD.ftex(N, D)}` : ''}` }; }
  return { v: FD.dec(v), x: `${ps.length > 1 ? ps.map((p) => p.t).join(' + ') + ' = ' : ''}${FD.dec(v)}` };
};
// Two-stage tree diagram. T = { n: [name, name], p1: [p, q], p2: [[p, q], [p, q]], h: [heading 1, heading 2] }.
// upto: 1 first branches, 2 second branches, 3 outcomes. hi: outcome pairs [i, j] to highlight.
FD.tree = (host) => (T, upto = 3, hi = []) => {
  const Y1 = [80, 220], Y2 = [[42, 118], [182, 258]], isHi = (i, j) => hi.some(([a, b]) => a === i && (j === undefined || b === j));
  let s = `<text class="tr-h" x="205" y="16">${T.h[0]}</text>${upto >= 2 ? `<text class="tr-h" x="368" y="16">${T.h[1]}</text>` : ''}<circle cx="40" cy="150" r="5" fill="var(--ink)"/>`;
  [0, 1].forEach((i) => {
    const y = Y1[i];
    s += `<line class="tr-b ${isHi(i) ? 'hi' : ''}" x1="40" y1="150" x2="190" y2="${y}"/><text class="tr-p" x="${112 + (i ? 6 : -6)}" y="${(150 + y) / 2 + (i ? 22 : -10)}">${T.p1[i].t}</text><text class="tr-n" x="205" y="${y + 5}">${T.n[i]}</text>`;
    if (upto >= 2) [0, 1].forEach((j) => {
      const y2 = Y2[i][j], o = FD.pmul(T.p1[i], T.p2[i][j]);
      s += `<line class="tr-b ${isHi(i, j) ? 'hi' : ''}" x1="220" y1="${y}" x2="352" y2="${y2}"/><text class="tr-p" x="286" y="${(y + y2) / 2 + (j ? 18 : -8)}">${T.p2[i][j].t}</text><text class="tr-n" x="368" y="${y2 + 5}">${T.n[j]}</text>`;
      if (upto >= 3) s += `<text class="tr-o ${isHi(i, j) ? 'hi' : ''}" x="390" y="${y2 + 5}">${T.n[i]}${T.n[j]}:  ${T.p1[i].t} × ${T.p2[i][j].t} = ${o.t}</text>`;
    });
  });
  host.innerHTML = `<svg viewBox="0 0 600 275" role="img" aria-label="Tree diagram: first ${T.n[0]} ${T.p1[0].t}, ${T.n[1]} ${T.p1[1].t}">${s}</svg>`;
};
FD.rainT = (p) => ({ n: ['R', 'N'], h: ['Monday', 'Tuesday'], p1: [FD.pd(p), FD.pd(1 - p)], p2: [[FD.pd(p), FD.pd(1 - p)], [FD.pd(p), FD.pd(1 - p)]] });
FD.TEV = [['both days rain', [[0, 0]]], ['exactly one day of rain', [[0, 1], [1, 0]]], ['no rain on either day', [[1, 1]]], ['rain on at least one day', [[0, 0], [0, 1], [1, 0]]]];

FD.add({
  id: 'trees',
  title: 'Tree diagrams and independent events',
  tab: 'Trees',
  icon: 'graph',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Independent events', 'The outcome of one does not change the probabilities of the other.'],
    ['Tree diagram', 'Branches for each stage, with the probability on each branch. Branches from one point add up to 1.'],
    ['AND rule', 'Multiply along the branches: P(A and B) = P(A) × P(B) for independent events.'],
    ['OR rule', 'Add the probabilities of the separate outcomes you want.'],
  ],
  mount(el) {
    const a = FD.board(el, 'tr-s', '<div id="tr"></div>', `
      <label class="ctrl">P(rain) <input type="range" id="rp" min="1" max="19" value="6"><output id="op">0.3</output></label>
      <div class="bd-row"><label for="te">Event</label><select id="te">${FD.TEV.map((e, i) => `<option value="${i}">${e[0]}</option>`).join('')}</select></div>`, () => sync());
    a.tr = FD.tree(a.$('#tr'));
    const sync = () => {
      const p = +a.$('#rp').value / 20, T = FD.rainT(p), [t, pairs] = FD.TEV[+a.$('#te').value]; a.$('#op').textContent = p;
      a.tr(T, 3, pairs); a.big(`P(\\text{${t}}) = ${FD.tsum(T, pairs).x}`);
      a.msg(pairs.length === 3 ? `Quicker: 1 − P(NN) = 1 − ${FD.dec((1 - p) ** 2)} = ${FD.dec(1 - (1 - p) ** 2)}.` : 'Multiply along each path, then add the paths you want.');
    };
    a.$('#rp').addEventListener('input', sync); a.$('#te').addEventListener('change', sync);
    a.tr(FD.rainT(0.3), 1);
    return a;
  },
  steps: [
    {
      title: 'The first stage',
      text: '<p>The probability that it rains (R) on any day is 0.3. Draw a branch for each outcome on Monday. The branches add up to 1, so P(no rain, N) = 0.7.</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.rainT(0.3), 1); },
    },
    {
      title: 'The second stage',
      text: '<p>We assume Tuesday’s weather is <b>independent</b> of Monday’s, so each Monday branch splits into the same two branches for Tuesday.</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.rainT(0.3), 2); },
    },
    {
      title: 'Multiply along the branches',
      text: '<p>To find the probability of a path, such as rain on Monday AND rain on Tuesday, <b>multiply</b> along it. The four outcomes add up to 1.</p>',
      tip: 'Check: 0.09 + 0.21 + 0.21 + 0.49 = 1.',
      async on(a, ctx) { a.reset(); a.tr(FD.rainT(0.3), 3, [[0, 0]]); a.big('P(RR) = 0.3 \\times 0.3 = 0.09'); },
    },
    {
      title: 'Add the outcomes you want',
      text: '<p>Rain on exactly one day can happen two ways: RN or NR. Find each path, then <b>add</b>.</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.rainT(0.3), 3, [[0, 1], [1, 0]]); await a.lines([['P(RN) + P(NR) = 0.21 + 0.21 = 0.42', '']], ctx, 1000); },
    },
    {
      title: 'At least one',
      text: '<p>“Rain on at least one day” is every outcome except NN. It is quicker to use 1 − P(NN).</p>',
      async on(a, ctx) { a.reset(); a.tr(FD.rainT(0.3), 3, [[0, 0], [0, 1], [1, 0]]); a.big('1 - 0.7 \\times 0.7 = 1 - 0.49 = 0.51'); },
    },
    {
      title: 'Try it: change the weather',
      text: '<p>Change the probability of rain and choose an event. Watch the paths that make up the event.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'trees',
  gens: [
    () => { const p = FD.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), q = FD.pick([0.1, 0.25, 0.5, 0.6, 0.9]); return { type: 'num', q: `The probability that Ali is late is ${p}. The probability that Bo is late is ${q}. The events are independent. Find the probability that both are late.`, a: FD.dec(p * q), why: `\\(${p} \\times ${q} = ${FD.dec(p * q)}\\).` }; },
    () => { const p = FD.pick([0.1, 0.2, 0.3, 0.4, 0.6]), v = FD.dec(2 * p * (1 - p)); return { type: 'num', q: `A biased coin lands on heads with probability ${p}. It is thrown twice. Find the probability of exactly one head.`, a: v, why: `HT + TH: \\(${p} \\times ${FD.dec(1 - p)} + ${FD.dec(1 - p)} \\times ${p} = ${v}\\).` }; },
    () => { const s = FD.pick([4, 5, 6, 8]); return { type: 'num', q: `A fair ${s}-sided spinner numbered 1 to ${s} is spun twice. Find the probability of getting at least one ${s}.`, ...{ a: (2 * s - 1) / (s * s), show: `\\(${FD.ftex(2 * s - 1, s * s)}\\)`, hint: 'Type a fraction like 3/8.', form: 'fraction' }, why: `\\(1 - P(\\text{no } ${s} \\text{ twice}) = 1 - \\frac{${s - 1}}{${s}} \\times \\frac{${s - 1}}{${s}} = 1 - \\frac{${(s - 1) ** 2}}{${s * s}} = \\frac{${2 * s - 1}}{${s * s}}\\).` }; },
  ],
});

FD.check({
  section: 'trees',
  items: [
    { type: 'num', q: 'P(A) = 0.6 and P(B) = 0.5, independent. Find P(A and B).', a: 0.3, why: '\\(0.6 \\times 0.5\\).' },
    { type: 'mcq', q: 'On a tree diagram, how do you find the probability of one path?', opts: ['Multiply along the branches', 'Add along the branches', 'Add all the branches', 'Take the largest branch'], why: 'AND = multiply.' },
    { type: 'num', q: 'A fair coin is thrown twice. Find P(at least one head).', a: 0.75, show: '\\(\\tfrac34\\)', why: '\\(1 - \\frac14\\).' },
    { type: 'tf', q: 'The two branches leaving one point of a tree diagram must add up to 1.', a: true, why: 'One of them must happen.' },
  ],
});
