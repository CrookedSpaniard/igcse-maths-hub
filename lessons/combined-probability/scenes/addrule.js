// A bar split into the probabilities of each outcome. ps: [p…]; names; hi: indices to keep bright (null = all).
FD.pbar = (host) => (ps, names, hi = null) => {
  let x = 40, s = '';
  ps.forEach((p, i) => { const w = 520 * p; s += `<rect class="pbar-s k${i} ${hi && !hi.includes(i) ? 'dim' : ''}" x="${x}" y="30" width="${Math.max(w, 0)}" height="60"/>${w > 46 ? `<text class="pbar-t k${i}" x="${x + w / 2}" y="56">${names[i]}</text><text class="pbar-t k${i}" x="${x + w / 2}" y="78">${FD.round(p, 3)}</text>` : ''}`; x += w; });
  host.innerHTML = `<svg viewBox="0 0 600 110" role="img" aria-label="${names.map((n, i) => `${n} ${FD.round(ps[i], 3)}`).join(', ')}">${s}<rect x="40" y="30" width="520" height="60" fill="none" stroke="var(--ink)" stroke-width="2"/><text class="cg-t" x="40" y="106" style="font-size:13px;fill:var(--muted)">0</text><text x="560" y="106" text-anchor="end" style="font-size:13px;fill:var(--muted)">1</text></svg>`;
};
FD.ptab = (names, ps, hi = []) => `<table class="dt"><tr><th>Colour</th>${names.map((n) => `<th>${n}</th>`).join('')}</tr><tr><th>Probability</th>${ps.map((p, i) => `<td class="${hi.includes(i) ? 'hi' : ''}">${p}</td>`).join('')}</tr></table>`;
FD.PC = ['red', 'blue', 'green', 'yellow'];

FD.add({
  id: 'addrule',
  title: 'Mutually exclusive events',
  tab: 'Addition rule',
  icon: 'frac',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Mutually exclusive', 'Events that cannot happen at the same time, e.g. a dice showing 2 and showing 5.'],
    ['Addition rule', 'For mutually exclusive events, P(A or B) = P(A) + P(B).'],
    ['Exhaustive', 'Between them the events cover every outcome, so their probabilities add up to 1.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ar-s', '<div id="tb"></div><div id="br"></div>', `
      <div class="cp-sl">${FD.PC.slice(0, 3).map((c, i) => `<label class="ctrl">P(${c}) <input type="range" id="p${i}" min="0" max="100" step="5" value="${[20, 35, 30][i]}"><output id="o${i}">${[0.2, 0.35, 0.3][i]}</output></label>`).join('')}</div>
      <div class="bd-row"><label for="pa">P(</label><select id="pa">${FD.PC.map((c, i) => `<option value="${i}">${c}</option>`).join('')}</select> or <select id="pb">${FD.PC.map((c, i) => `<option value="${i}" ${i === 2 ? 'selected' : ''}>${c}</option>`).join('')}</select>)</div>`, () => sync());
    a.br = FD.pbar(a.$('#br'));
    a.show = (ps, hi = [], bar = true) => { a.$('#tb').innerHTML = FD.ptab(FD.PC, ps.map((p) => (typeof p === 'number' ? FD.round(p, 3) : p)), hi); if (bar) a.br(ps.map((p) => (typeof p === 'number' ? p : 0)), FD.PC, hi.length ? hi : null); else a.$('#br').innerHTML = ''; };
    const sync = () => {
      const p = [0, 1, 2].map((i) => +a.$('#p' + i).value / 100); [0, 1, 2].forEach((i) => { a.$('#o' + i).textContent = p[i]; });
      const y = FD.dec(1 - p[0] - p[1] - p[2]);
      if (y < 0) { a.show([...p, 0]); a.big(`${p.join(' + ')} > 1`); a.msg('Impossible: the probabilities add up to more than 1.', 'bad'); return; }
      const ps = [...p, y], i = +a.$('#pa').value, j = +a.$('#pb').value;
      a.show(ps, i === j ? [i] : [i, j]);
      a.big(i === j ? `P(\\text{${FD.PC[i]}}) = ${ps[i]}` : `P(\\text{${FD.PC[i]} or ${FD.PC[j]}}) = ${ps[i]} + ${ps[j]} = ${FD.dec(ps[i] + ps[j])}`);
      a.msg(`P(yellow) = 1 − ${FD.dec(p[0] + p[1] + p[2])} = ${y}, because the four probabilities add up to 1.`);
    };
    a.$('.cp-sl').addEventListener('input', sync); a.$('#pa').addEventListener('change', sync); a.$('#pb').addEventListener('change', sync);
    a.show([0.2, 0.35, 0.3, 0.15]);
    return a;
  },
  steps: [
    {
      title: 'Events that cannot happen together',
      text: '<p>A fair dice cannot show a 2 and a 5 at the same time. These events are <b>mutually exclusive</b>, so to find P(2 or 5) you <b>add</b>.</p>',
      async on(a, ctx) { a.reset(); a.$('#tb').innerHTML = '<div class="ol"><span>1</span><span class="hi">2</span><span>3</span><span>4</span><span class="hi">5</span><span>6</span></div>'; a.$('#br').innerHTML = ''; a.big('P(2 \\text{ or } 5) = \\tfrac16 + \\tfrac16 = \\tfrac26 = \\tfrac13'); },
    },
    {
      title: 'Probabilities add up to 1',
      text: '<p>A spinner lands on one of four colours. Exactly one colour happens each time, so the four probabilities add up to <b>1</b>. Find the missing probability \\(x\\).</p>',
      async on(a, ctx) {
        a.reset(); a.show([0.2, 0.35, '\\(x\\)', 0.15], [2], false);
        await a.lines([['0.2 + 0.35 + 0.15 = 0.7', 'the ones we know'], ['x = 1 - 0.7 = 0.3', 'P(green)']], ctx, 1400);
        a.show([0.2, 0.35, 0.3, 0.15], [2]);
      },
    },
    {
      title: 'Using the addition rule',
      text: '<p>The spinner cannot land on red and green at once, so P(red or green) = P(red) + P(green).</p>',
      tip: 'P(not red) is the same as P(blue or green or yellow): both are 0.8.',
      async on(a, ctx) { a.reset(); a.show([0.2, 0.35, 0.3, 0.15], [0, 2]); a.big('P(\\text{red or green}) = 0.2 + 0.3 = 0.5'); },
    },
    {
      title: 'Be careful: overlapping events',
      text: '<p>“Even” = {2, 4, 6} and “greater than 3” = {4, 5, 6} can happen together (4 or 6). They are <b>not</b> mutually exclusive, so you cannot just add. Count instead: {2, 4, 5, 6}.</p>',
      async on(a, ctx) { a.reset(); a.$('#tb').innerHTML = '<div class="ol"><span>1</span><span class="hi">2</span><span>3</span><span class="hi">4</span><span class="hi">5</span><span class="hi">6</span></div>'; a.$('#br').innerHTML = ''; a.big('P(\\text{even or} > 3) = \\tfrac46 \\ne \\tfrac36 + \\tfrac36'); a.msg('Adding would count 4 and 6 twice.', 'bad'); },
    },
    {
      title: 'Try it: build a spinner',
      text: '<p>Set the probabilities of red, blue and green; yellow takes whatever is left. Choose two colours to find P(A or B).</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'addrule',
  gens: [
    () => { let p; do { p = [FD.rnd(1, 9) * 5, FD.rnd(1, 9) * 5, FD.rnd(1, 9) * 5]; } while (p[0] + p[1] + p[2] >= 100); const x = 100 - p[0] - p[1] - p[2]; return { type: 'num', q: `A spinner can land on red, blue, green or yellow. P(red) = ${p[0] / 100}, P(blue) = ${p[1] / 100}, P(green) = ${p[2] / 100}. Find P(yellow).`, a: x / 100, why: `\\(1 - (${p[0] / 100} + ${p[1] / 100} + ${p[2] / 100}) = ${x / 100}\\).` }; },
    () => { let p; do { p = [FD.rnd(1, 9) * 5, FD.rnd(1, 9) * 5, FD.rnd(1, 9) * 5]; } while (p[0] + p[1] + p[2] > 100); const i = FD.rnd(0, 2), j = (i + FD.rnd(1, 2)) % 3; return { type: 'num', q: `A counter is taken from a bag. P(${FD.PC[0]}) = ${p[0] / 100}, P(${FD.PC[1]}) = ${p[1] / 100}, P(${FD.PC[2]}) = ${p[2] / 100}. Find P(${FD.PC[i]} or ${FD.PC[j]}).`, a: (p[i] + p[j]) / 100, why: `Mutually exclusive, so add: \\(${p[i] / 100} + ${p[j] / 100} = ${(p[i] + p[j]) / 100}\\).` }; },
    () => { const [t, ok] = FD.pick([['rolling a 1 and rolling a 6 (one dice)', true], ['rolling an even number and rolling a 4 (one dice)', false], ['picking a red card and picking a king (one card)', false], ['getting heads and getting tails (one coin)', true], ['picking a vowel and picking a B (one letter)', true], ['a prime number and an odd number (one dice)', false]]); return { type: 'tf', q: `Are these events mutually exclusive? ${t}`, a: ok, why: ok ? 'They cannot happen at the same time.' : 'They can happen together, so they are not mutually exclusive.' }; },
  ],
});

FD.check({
  section: 'addrule',
  items: [
    { type: 'num', q: 'P(A) = 0.25 and P(B) = 0.4. A and B are mutually exclusive. Find P(A or B).', a: 0.65, why: '\\(0.25 + 0.4\\).' },
    { type: 'num', q: 'A spinner: P(1) = 0.1, P(2) = 0.3, P(3) = 0.45, and it can also land on 4. Find P(4).', a: 0.15, why: '\\(1 - 0.85\\).' },
    { type: 'mcq', q: 'Which pair of events is mutually exclusive (one roll of a dice)?', opts: ['a 3 and an even number', 'an odd number and a 3', 'a number less than 4 and a 2', 'a factor of 6 and a 6'], why: '3 is not even, so they cannot happen together.' },
    { type: 'tf', q: 'The probabilities of all the possible outcomes add up to 1.', a: true, why: 'One of them must happen.' },
  ],
});
