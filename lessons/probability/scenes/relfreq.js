// A repeatable random number generator (so the worked example always looks the same).
FD.seeded = (seed) => { let t = seed; return () => ((t = (t * 9301 + 49297) % 233280) / 233280); };
FD.roll = (rnd) => 1 + Math.floor(rnd() * 6);
// Bar chart of the relative frequency of each face, with the theoretical 1/6 dashed.
FD.rfBars = (host) => (counts) => {
  const n = counts.reduce((a, b) => a + b, 0), Y = (p) => 200 - p * 400;
  let s = '';
  [0, 0.1, 0.2, 0.3, 0.4].forEach((p) => { s += `<line class="cg-grid" x1="50" y1="${Y(p)}" x2="290" y2="${Y(p)}"/><text class="cg-t cg-ty" x="44" y="${Y(p) + 4}">${p}</text>`; });
  counts.forEach((c, i) => { const p = n ? Math.min(c / n, 0.42) : 0, x = 58 + i * 38; s += `<rect class="cg-bar" x="${x}" y="${Y(p)}" width="28" height="${200 - Y(p)}"/><text class="cg-t" x="${x + 14}" y="218">${i + 1}</text>`; });
  s += `<line class="rf-p" x1="50" y1="${Y(1 / 6)}" x2="290" y2="${Y(1 / 6)}"/><line class="cg-ax" x1="50" y1="200" x2="292" y2="200"/><line class="cg-ax" x1="50" y1="24" x2="50" y2="200"/><text class="cg-name" x="52" y="14">Relative frequency</text><text class="cg-name" x="170" y="238" text-anchor="middle">Score on the dice</text>`;
  host.innerHTML = `<svg viewBox="0 0 300 245" role="img" aria-label="Relative frequency of each score after ${n} rolls">${s}</svg>`;
};
// Graph of the relative frequency of a six against the number of rolls so far.
FD.rfLine = (host) => (hist) => {
  const N = Math.max(50, hist.length), X = (i) => 50 + (i / N) * 240, Y = (p) => 200 - p * 400;
  let s = '', six = 0, d = '';
  [0, 0.1, 0.2, 0.3, 0.4].forEach((p) => { s += `<line class="cg-grid" x1="50" y1="${Y(p)}" x2="290" y2="${Y(p)}"/><text class="cg-t cg-ty" x="44" y="${Y(p) + 4}">${p}</text>`; });
  hist.forEach((r, i) => { if (r === 6) six++; d += `${i ? 'L' : 'M'}${X(i + 1).toFixed(1)},${Y(Math.min(six / (i + 1), 0.45)).toFixed(1)}`; });
  if (d) s += `<path class="rf-line" d="${d}"/>`;
  s += `<line class="rf-p" x1="50" y1="${Y(1 / 6)}" x2="290" y2="${Y(1 / 6)}"/><line class="cg-ax" x1="50" y1="200" x2="292" y2="200"/><line class="cg-ax" x1="50" y1="24" x2="50" y2="200"/><text class="cg-t" x="50" y="218">0</text><text class="cg-t" x="290" y="218">${N}</text><text class="cg-name" x="52" y="14">Relative frequency of a 6</text><text class="cg-name" x="170" y="238" text-anchor="middle">Number of rolls</text>`;
  host.innerHTML = `<svg viewBox="0 0 300 245" role="img" aria-label="Relative frequency of a six after ${hist.length} rolls">${s}</svg>`;
};
FD.R20 = (() => { const r = FD.seeded(11); return Array.from({ length: 20 }, () => FD.roll(r)); })();
FD.R500 = (() => { const r = FD.seeded(5); return Array.from({ length: 500 }, () => FD.roll(r)); })();

FD.add({
  id: 'relfreq',
  title: 'Relative frequency',
  tab: 'Experiments',
  icon: 'stats',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Trial', 'One go of an experiment, e.g. one roll of a dice.'],
    ['Relative frequency', '\\(\\dfrac{\\text{number of times the event happened}}{\\text{number of trials}}\\): an estimate of the probability.'],
    ['Biased', 'Not fair: some outcomes are more likely than others.'],
  ],
  mount(el) {
    const a = FD.board(el, 'rf-s', '<div class="dice-row" id="dr"></div><div class="rf-pair"><div id="rb"></div><div id="rl"></div></div>', `
      <div class="bd-btns"><button class="btn" id="b1">Roll once</button><button class="btn" id="b10">Roll 10</button><button class="btn" id="b100">Roll 100</button><button class="btn ghost" id="b0">Start again</button></div>`, () => { hist = []; sync(); });
    a.bars = FD.rfBars(a.$('#rb')); a.line = FD.rfLine(a.$('#rl'));
    a.show = (h, last = 20) => {
      const counts = [0, 0, 0, 0, 0, 0]; h.forEach((r) => counts[r - 1]++);
      a.$('#dr').innerHTML = h.slice(-last).map((r) => `<span class="${r === 6 ? 'six' : ''}">${r}</span>`).join('');
      a.bars(counts); a.line(h); return counts;
    };
    let hist = [];
    const sync = () => {
      const c = a.show(hist); const n = hist.length;
      a.big(n ? `\\text{sixes: } ${c[5]} \\text{ out of } ${n} \\qquad \\text{relative frequency} = \\frac{${c[5]}}{${n}} = ${FD.round(c[5] / n, 3)}` : '');
      a.msg(n ? (n < 100 ? 'Keep rolling: with only a few trials the estimate jumps around.' : `After ${n} rolls the relative frequency is close to \\(\\tfrac16 \\approx 0.167\\).`) : 'Roll the dice to start the experiment.');
    };
    const go = (k) => { for (let i = 0; i < k && hist.length < 2000; i++) hist.push(FD.roll(Math.random)); sync(); };
    a.$('#b1').addEventListener('click', () => go(1)); a.$('#b10').addEventListener('click', () => go(10)); a.$('#b100').addEventListener('click', () => go(100));
    a.$('#b0').addEventListener('click', () => { hist = []; sync(); });
    a.show(FD.R20);
    return a;
  },
  steps: [
    {
      title: 'An experiment',
      text: '<p>Mia rolls a dice 20 times. Each roll is a <b>trial</b>. She counts how many sixes she gets.</p>',
      async on(a, ctx) { a.reset(); for (let k = 1; k <= 20; k += 1) { a.show(FD.R20.slice(0, k)); if (!(await ctx.sleep(120))) return; } },
    },
    {
      title: 'Relative frequency',
      text: `<p>She got ${FD.R20.filter((r) => r === 6).length} sixes in 20 rolls. The <b>relative frequency</b> is the number of sixes divided by the number of trials. It is an <b>estimate</b> of the probability.</p>`,
      async on(a, ctx) { a.reset(); a.show(FD.R20); const s = FD.R20.filter((r) => r === 6).length; a.big(`\\frac{${s}}{20} = ${s / 20}`); },
    },
    {
      title: 'More trials, better estimate',
      text: '<p>With only 20 rolls the estimate can be a long way from \\(\\frac16\\). As the number of trials grows, the relative frequency settles down close to the true probability.</p>',
      tip: 'More trials give a more reliable estimate.',
      async on(a, ctx) { a.reset(); for (const k of [20, 50, 100, 200, 350, 500]) { a.show(FD.R500.slice(0, k)); if (!(await ctx.sleep(700))) return; } a.big(`\\frac{${FD.R500.filter((r) => r === 6).length}}{500} \\approx ${FD.round(FD.R500.filter((r) => r === 6).length / 500, 3)}`); },
    },
    {
      title: 'When there is no formula',
      text: '<p>A drawing pin can land point up or point down, but the two are <b>not</b> equally likely. The only way to find the probability is an experiment. Kai drops a pin 200 times and it lands point up 124 times.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.R20); await a.lines([['P(\\text{point up}) \\approx \\frac{124}{200} = 0.62', 'relative frequency']], ctx, 1200); },
    },
    {
      title: 'Try it: roll the dice',
      text: '<p>Roll the dice once, 10 times or 100 times. Watch the relative frequency of a six get closer to the dashed line at \\(\\frac16\\).</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'relfreq',
  gens: [
    () => { const n = FD.pick([20, 40, 50, 80, 100, 200]), k = FD.rnd(1, n - 1); return { type: 'num', q: `A coin is thrown ${n} times and lands on heads ${k} times. Find the relative frequency of heads.`, a: k / n, show: `\\(${FD.ftex(k, n)}\\) or ${FD.dec(k / n)}`, hint: 'A fraction or a decimal.', why: `\\(\\frac{${k}}{${n}} = ${FD.dec(k / n)}\\).` }; },
    () => { const fs = [FD.rnd(5, 30), FD.rnd(5, 30), FD.rnd(5, 30)], n = fs[0] + fs[1] + fs[2], i = FD.rnd(0, 2), c = ['red', 'blue', 'green'][i]; return { type: 'num', q: `A spinner is spun ${n} times. It lands on red ${fs[0]} times, blue ${fs[1]} times and green ${fs[2]} times. Estimate the probability that it lands on ${c}.`, ...FD.pq(fs[i], n), why: `Relative frequency \\(${FD.ftex(fs[i], n)}\\).` }; },
    () => { const a1 = FD.pick([10, 20, 25]), a2 = FD.pick([200, 400, 500]); return { type: 'mcq', q: `Sam rolls a dice ${a1} times. Jo rolls the same dice ${a2} times. Whose relative frequencies give the better estimate of the probabilities?`, opts: ['Jo’s, because there are more trials', 'Sam’s, because there are fewer trials', 'Both are equally good', 'Neither, because it is a dice'], why: 'More trials make the estimate more reliable.' }; },
  ],
});

FD.check({
  section: 'relfreq',
  items: [
    { type: 'num', q: 'A pin lands point up 36 times in 60 drops. Find the relative frequency of point up.', a: 0.6, show: '0.6', why: '\\(\\frac{36}{60} = 0.6\\).' },
    { type: 'mcq', q: 'How can you make an estimate of a probability more reliable?', opts: ['Do more trials', 'Do fewer trials', 'Round the answer', 'Use a different dice each time'], why: 'More trials, better estimate.' },
    { type: 'tf', q: 'If a fair coin is thrown 10 times, it must land on heads exactly 5 times.', a: false, why: '5 is what we expect on average, but results vary.' },
    { type: 'num', q: 'A dice is rolled 300 times and shows 3 a total of 96 times. What is the relative frequency of a 3? Give a decimal.', a: 0.32, why: '\\(96 \\div 300\\).' },
  ],
});
