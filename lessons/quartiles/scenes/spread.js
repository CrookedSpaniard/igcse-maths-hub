// The board: a picture, a big formula, a message, a worked example and a "Try it" panel.
// const a = FD.board(el, 'my-s', pictureHtml, tryHtml, onTry); a.$('#id') finds inside the scene.
FD.board = (el, cls, pic, tryHtml, onTry) => {
  el.innerHTML = `<div class="sim ${cls}"><div class="bd-pic" id="pic">${pic}</div><div class="mbig" id="big"></div><p class="verdict" id="msg"></p><div class="bd-work" id="work"></div><div class="card ctrls bd-try" id="try" hidden>${tryHtml || ''}</div></div>`;
  const root = el.querySelector('.sim'), $ = (s) => root.querySelector(s);
  let w = null;
  const api = {
    root, $,
    big(t) { $('#big').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t, c = 'good') { $('#msg').className = 'verdict ' + c; $('#msg').innerHTML = t || ''; },
    work(lines) { $('#work').innerHTML = ''; w = lines ? FD.work($('#work'), lines) : null; },
    upto: (i) => w && w.upto(i),
    // Shows the lines one by one; returns false if the step was left.
    async lines(lines, ctx, ms = 1300) { api.work(lines); for (let i = 0; i < lines.length; i++) { api.upto(i); if (!(await ctx.sleep(ms))) return false; } return true; },
    tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); if (onTry) onTry(); } },
    reset() { api.tryMode(false); api.work(null); api.msg(''); api.big(''); },
  };
  return api;
};
FD.dec = (x) => +x.toFixed(10);
// Quartiles of a list by position: Q1 at (n + 1)/4, median at (n + 1)/2, Q3 at 3(n + 1)/4.
FD.quart = (l) => {
  const s = [...l].sort((x, y) => x - y), n = s.length;
  const at = (p) => { const i = Math.floor(p), f = p - i; return f === 0 ? s[i - 1] : FD.dec(s[i - 1] + f * (s[i] - s[i - 1])); };
  const q1 = at((n + 1) / 4), med = at((n + 1) / 2), q3 = at((3 * (n + 1)) / 4);
  return { s, n, q1, med, q3, iqr: FD.dec(q3 - q1), range: s[n - 1] - s[0], min: s[0], max: s[n - 1] };
};
// Sorted chips with the quartiles marked. label: text in front.
FD.qChips = (host) => (list, mark = true, label = '') => {
  const q = FD.quart(list), n = q.n, near = (p) => (Number.isInteger(p) ? [p - 1] : [Math.floor(p) - 1, Math.floor(p)]);
  const Q = mark ? [...near((n + 1) / 4), ...near((3 * (n + 1)) / 4)] : [], M = mark ? near((n + 1) / 2) : [];
  host.innerHTML = `<div class="chips">${label ? `<b>${label}</b>` : ''}${q.s.map((x, i) => `<span class="${M.includes(i) ? 'mid' : Q.includes(i) ? 'q' : mark && (i === 0 || i === n - 1) ? 'end' : ''}">${x}</span>`).join('')}</div>`;
};
// Box plots. rows: [{ name, v: [min, q1, med, q3, max] }] on a scale lo…hi with ticks every step.
FD.boxplot = (host) => (rows, lo, hi, step, xl = '') => {
  const X = (v) => 70 + ((v - lo) / (hi - lo)) * 500, H = 30 + rows.length * 66;
  let s = '';
  rows.forEach(({ name, v: [mn, q1, md, q3, mx] }, i) => {
    const y = 34 + i * 66;
    s += `<text class="bx-n" x="4" y="${y + 5}">${name}</text><line class="bx-l" x1="${X(mn)}" y1="${y}" x2="${X(q1)}" y2="${y}"/><line class="bx-l" x1="${X(q3)}" y1="${y}" x2="${X(mx)}" y2="${y}"/><line class="bx-l" x1="${X(mn)}" y1="${y - 12}" x2="${X(mn)}" y2="${y + 12}"/><line class="bx-l" x1="${X(mx)}" y1="${y - 12}" x2="${X(mx)}" y2="${y + 12}"/><rect class="bx-box" x="${X(q1)}" y="${y - 22}" width="${Math.max(0, X(q3) - X(q1))}" height="44"/><line class="bx-m" x1="${X(md)}" y1="${y - 22}" x2="${X(md)}" y2="${y + 22}"/>`;
  });
  for (let v = lo; v <= hi + 1e-9; v = FD.dec(v + step)) s += `<line class="cg-grid" x1="${X(v)}" y1="${H - 12}" x2="${X(v)}" y2="${H - 6}"/><text class="cg-t" x="${X(v)}" y="${H + 8}">${v}</text>`;
  s += `<line class="cg-ax" x1="70" y1="${H - 12}" x2="570" y2="${H - 12}"/><text class="cg-name" x="320" y="${H + 26}" text-anchor="middle">${xl}</text>`;
  host.innerHTML = `<svg viewBox="0 0 600 ${H + 32}" role="img" aria-label="Box plots: ${rows.map((r) => `${r.name} ${r.v.join(', ')}`).join('; ')}">${s}</svg>`;
};
FD.five = (l) => { const q = FD.quart(l); return [q.min, q.q1, q.med, q.q3, q.max]; };
FD.SA = [48, 50, 51, 52, 53, 54, 56];
FD.SB = [20, 35, 45, 52, 60, 72, 80];

FD.add({
  id: 'spread',
  title: 'Measures of spread',
  tab: 'Spread',
  icon: 'stats',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Measure of spread', 'A number that shows how spread out (or how consistent) the data is.'],
    ['Range', 'Largest − smallest. One extreme value can change it a lot.'],
    ['Interquartile range (IQR)', 'Upper quartile − lower quartile: the spread of the middle half of the data.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sp-s', '<div id="c1"></div><div id="c2"></div><div id="bx"></div>', `
      <label class="ctrl">Spread <input type="range" id="rk" min="0" max="12" value="3"><output id="ok">3</output></label>
      <div class="bd-btns"><button class="btn ghost" id="bOut">Add an outlier</button></div>`, () => sync());
    a.c1 = FD.qChips(a.$('#c1')); a.c2 = FD.qChips(a.$('#c2')); a.bx = FD.boxplot(a.$('#bx'));
    let out = false;
    const sync = () => {
      const k = +a.$('#rk').value, l = [-4, -3, -1, 0, 1, 2, 4].map((d) => 52 + d * k); if (out) l[6] += 40; a.$('#ok').textContent = k;
      const q = FD.quart(l); a.c1(l, true, 'Data'); a.c2([]); a.$('#c2').innerHTML = '';
      a.bx([{ name: 'Data', v: FD.five(l) }], 0, 140, 20);
      a.$('#bOut').textContent = out ? 'Remove the outlier' : 'Add an outlier';
      a.big(`\\text{range} = ${q.range} \\qquad \\text{IQR} = ${q.q3} - ${q.q1} = ${q.iqr}`);
      a.msg(out ? 'The outlier makes the range much bigger, but the IQR does not change.' : 'Bigger spread: the data is less consistent.');
    };
    a.$('#rk').addEventListener('input', sync);
    a.$('#bOut').addEventListener('click', () => { out = !out; sync(); });
    a.c1(FD.SA, false, 'A'); a.c2(FD.SB, false, 'B');
    return a;
  },
  steps: [
    {
      title: 'Same average, different spread',
      text: '<p>Two archers each score 7 shots. Both have a median of 52. But archer A’s scores are close together, while archer B’s are spread out. An average alone does not show this.</p>',
      async on(a, ctx) { a.reset(); a.c1(FD.SA, false, 'A'); a.c2(FD.SB, false, 'B'); a.$('#bx').innerHTML = ''; a.big('\\text{median A} = 52 \\qquad \\text{median B} = 52'); },
    },
    {
      title: 'The range',
      text: '<p>The <b>range</b> is the simplest measure of spread: largest − smallest. A: \\(56 - 48 = 8\\). B: \\(80 - 20 = 60\\). Archer A is far more <b>consistent</b>.</p>',
      async on(a, ctx) { a.reset(); a.c1(FD.SA, false, 'A'); a.c2(FD.SB, false, 'B'); a.$('#bx').innerHTML = ''; a.big('\\text{range A} = 8 \\qquad \\text{range B} = 60'); },
    },
    {
      title: 'The interquartile range',
      text: '<p>The <b>quartiles</b> split the ordered data into four quarters. The <b>interquartile range</b> is the upper quartile minus the lower quartile: the spread of the <b>middle half</b>.</p>',
      tip: 'Quartiles are orange; the median is solid.',
      async on(a, ctx) {
        a.reset(); a.c1(FD.SA, true, 'A'); a.c2(FD.SB, true, 'B'); a.bx([{ name: 'A', v: FD.five(FD.SA) }, { name: 'B', v: FD.five(FD.SB) }], 0, 100, 10);
        await a.lines([['\\text{IQR A} = 54 - 50 = 4', ''], ['\\text{IQR B} = 72 - 35 = 37', '']], ctx, 1400);
      },
    },
    {
      title: 'Why use the IQR?',
      text: '<p>Suppose archer A’s best shot was 99 instead of 56. The range jumps from 8 to 51, but the IQR stays at 4. The IQR ignores the extreme values, so it is <b>not affected by outliers</b>.</p>',
      async on(a, ctx) { a.reset(); const L = [48, 50, 51, 52, 53, 54, 99]; a.c1(L, true, 'A'); a.$('#c2').innerHTML = ''; a.bx([{ name: 'A', v: FD.five(L) }], 0, 100, 10); a.big('\\text{range} = 99 - 48 = 51 \\qquad \\text{IQR} = 54 - 50 = 4'); },
    },
    {
      title: 'Try it: stretch the data',
      text: '<p>Use the slider to spread the data out, and add an outlier. Compare what happens to the range and the IQR.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'spread',
  gens: [
    () => { const l = Array.from({ length: FD.rnd(6, 9) }, () => FD.rnd(5, 60)), q = FD.quart(l); return { type: 'num', q: `Find the range of ${l.join(', ')}.`, a: q.range, why: `\\(${q.max} - ${q.min} = ${q.range}\\).` }; },
    () => { const q1 = FD.rnd(10, 40), q3 = q1 + FD.rnd(5, 30); return { type: 'num', q: `The lower quartile of some data is ${q1} and the upper quartile is ${q3}. Work out the interquartile range.`, a: q3 - q1, why: `\\(${q3} - ${q1} = ${q3 - q1}\\).` }; },
    () => { const m = FD.rnd(20, 60), i1 = FD.rnd(3, 10), i2 = i1 + FD.rnd(4, 15); return { type: 'mcq', q: `Team P: median ${m}, IQR ${i1}. Team Q: median ${m}, IQR ${i2}. Which statement is correct?`, opts: ['Team P is more consistent', 'Team Q is more consistent', 'Team Q scored more on average', 'Both teams are equally consistent'], why: `A smaller IQR (${i1} < ${i2}) means the scores are less spread out.` }; },
  ],
});

FD.check({
  section: 'spread',
  items: [
    { type: 'mcq', q: 'Which of these is a measure of spread?', opts: ['The interquartile range', 'The median', 'The mode', 'The mean'], why: 'Range and IQR measure spread; the others are averages.' },
    { type: 'num', q: 'The lower quartile is 23 and the upper quartile is 41. What is the IQR?', a: 18, why: '\\(41 - 23\\).' },
    { type: 'tf', q: 'One very large value can change the range a lot but hardly changes the IQR.', a: true, why: 'The IQR uses only the middle half.' },
    { type: 'mcq', q: 'A smaller interquartile range means the data is…', opts: ['more consistent', 'bigger on average', 'less reliable', 'more spread out'], why: 'Less spread out.' },
  ],
});
