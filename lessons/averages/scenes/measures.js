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
// Mean, median, modes and range of a list.
FD.stats = (l) => {
  const s = [...l].sort((x, y) => x - y), n = s.length, sum = s.reduce((a, b) => a + b, 0), cnt = {};
  s.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; });
  const top = Math.max(...Object.values(cnt)), modes = top > 1 ? Object.keys(cnt).filter((k) => cnt[k] === top).map(Number) : [];
  return { s, n, sum, mean: FD.dec(sum / n), median: n % 2 ? s[(n - 1) / 2] : FD.dec((s[n / 2 - 1] + s[n / 2]) / 2), modes, range: s[n - 1] - s[0] };
};

// Sorted chips. mark: 'median' | 'mode' | 'range' | ''.
FD.chipRow = (host) => (list, sorted = true, mark = '') => {
  const st = FD.stats(list), l = sorted ? st.s : list, n = l.length;
  host.innerHTML = `<div class="chips">${l.map((x, i) => { let c = ''; if (sorted && mark === 'median' && (i === (n - 1) / 2 || (n % 2 === 0 && (i === n / 2 - 1 || i === n / 2)))) c = 'mid'; if (mark === 'mode' && st.modes.includes(x)) c = 'mode'; if (sorted && mark === 'range' && (i === 0 || i === n - 1)) c = 'end'; return `<span class="${c}">${x}</span>`; }).join('')}</div>`;
};
// Stacks of blocks for each value; level = true shows them all at the mean height.
FD.stacks = (host) => (list, level = false) => {
  const n = list.length, mean = list.reduce((a, b) => a + b, 0) / n, max = Math.max(...list, Math.ceil(mean)), u = Math.min(22, 170 / max), w = Math.min(60, 520 / n);
  let s = '';
  list.forEach((v, i) => { const h = level ? mean : v, x = 40 + (520 / n) * (i + 0.5) - w / 2; s += `<rect class="bk ${level ? 'moved' : ''}" x="${x}" y="${195 - h * u}" width="${w - 6}" height="${h * u}" rx="4"/><text class="bk-v" x="${x + (w - 6) / 2}" y="${190 - h * u}">${level ? '' : v}</text>`; });
  s += `<line class="bk-m" x1="30" y1="${195 - mean * u}" x2="570" y2="${195 - mean * u}"/>`;
  host.innerHTML = `<svg viewBox="0 0 600 210" role="img" aria-label="Stacks of blocks for ${list.join(', ')}; mean ${FD.dec(mean)}">${s}</svg>`;
};
FD.L1 = [7, 3, 9, 4, 3, 10, 6];

FD.add({
  id: 'measures',
  title: 'Mean, median, mode and range',
  tab: 'MMMR',
  icon: 'stats',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Mean', 'Add all the values and divide by how many there are.'],
    ['Median', 'The middle value when the data is in order.'],
    ['Mode', 'The most common value. There can be more than one, or none.'],
    ['Range', 'Largest − smallest. It measures how spread out the data is.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ms-s', '<div id="st"></div><div id="ch"></div>', `
      <div class="bd-btns"><button class="btn" id="bNew">New data ↻</button><button class="btn ghost" id="bAdd">Add a value</button><button class="btn ghost" id="bBig">Add an outlier (50)</button></div>`, () => { data = Array.from({ length: 7 }, () => FD.rnd(1, 12)); sync(); });
    a.stk = FD.stacks(a.$('#st')); a.chips = FD.chipRow(a.$('#ch'));
    let data = FD.L1.slice();
    const sync = () => {
      const st = FD.stats(data); a.stk(data.map((x) => Math.min(x, 50))); a.chips(data, true, 'median');
      a.big(`\\text{mean} = ${FD.round(st.mean, 2)} \\quad \\text{median} = ${st.median} \\quad \\text{mode} = ${st.modes.length ? st.modes.join(', ') : '\\text{none}'} \\quad \\text{range} = ${st.range}`);
      a.msg(data.includes(50) ? 'The outlier pulls the mean up a lot, but the median hardly changes.' : 'The dashed line is the mean: the level if every stack were the same height.');
    };
    a.$('#bNew').addEventListener('click', () => { data = Array.from({ length: 7 }, () => FD.rnd(1, 12)); sync(); });
    a.$('#bAdd').addEventListener('click', () => { if (data.length < 14) data.push(FD.rnd(1, 12)); sync(); });
    a.$('#bBig').addEventListener('click', () => { if (!data.includes(50)) data.push(50); sync(); });
    a.stk(FD.L1); a.chips(FD.L1, false);
    return a;
  },
  steps: [
    {
      title: 'The mean: share it out',
      text: '<p>Data: 7, 3, 9, 4, 3, 10, 6. Add them: 42. There are 7 values, so the mean is \\(42 \\div 7 = 6\\).</p><p>It is the height every stack would be if the blocks were shared out <b>equally</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.stk(FD.L1); a.chips(FD.L1, false);
        if (!(await ctx.sleep(1400))) return; a.stk(FD.L1, true);
        a.big('\\frac{7 + 3 + 9 + 4 + 3 + 10 + 6}{7} = \\frac{42}{7} = 6');
      },
    },
    {
      title: 'The median: the middle',
      text: '<p>Put the values <b>in order</b>: 3, 3, 4, 6, 7, 9, 10. The middle one is the 4th: <b>6</b>.</p><p>With an even number of values, the median is halfway between the middle two.</p>',
      tip: 'The middle position is \\(\\frac{n + 1}{2}\\): for 7 values, the 4th.',
      async on(a, ctx) {
        a.reset(); a.stk(FD.L1); a.chips(FD.L1, false);
        if (!(await ctx.sleep(1000))) return; a.chips(FD.L1, true);
        if (!(await ctx.sleep(900))) return; a.chips(FD.L1, true, 'median'); a.big('\\text{median} = 6');
      },
    },
    {
      title: 'Mode and range',
      text: '<p>The <b>mode</b> is the most common value: 3 appears twice. The <b>range</b> is \\(10 - 3 = 7\\).</p><p>The range is not an average: it shows how <b>spread out</b> the data is.</p>',
      async on(a, ctx) {
        a.reset(); a.stk(FD.L1);
        a.chips(FD.L1, true, 'mode'); if (!(await ctx.sleep(1400))) return;
        a.chips(FD.L1, true, 'range'); a.big('\\text{mode} = 3 \\qquad \\text{range} = 10 - 3 = 7');
      },
    },
    {
      title: 'Which average?',
      text: '<p>The <b>mean</b> uses every value, but one very big or small value (an outlier) can pull it a long way. The <b>median</b> is not affected by outliers. The <b>mode</b> works for data that is not numbers, such as favourite colours.</p>',
      async on(a, ctx) {
        a.reset(); const L = [...FD.L1, 50]; a.stk(L.map((x) => x)); a.chips(L, true, 'median');
        await a.lines([['\\text{mean} = 92 \\div 8 = 11.5', 'pulled up by 50'], ['\\text{median} = 6.5', 'hardly changes']], ctx, 1400);
      },
    },
    {
      title: 'Try it: change the data',
      text: '<p>Make new data, add values, or add an outlier. Watch how each average changes.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'measures',
  gens: [
    () => { let d; do { d = Array.from({ length: FD.rnd(5, 8) }, () => FD.rnd(1, 20)); } while (!Number.isInteger(FD.stats(d).mean * 10)); const st = FD.stats(d); return { type: 'num', q: `Find the mean of ${d.join(', ')}.`, a: st.mean, why: `Total ${st.sum}, ${st.n} values: \\(${st.sum} \\div ${st.n} = ${st.mean}\\).` }; },
    () => { const d = Array.from({ length: FD.rnd(6, 9) }, () => FD.rnd(1, 30)), st = FD.stats(d); return { type: 'num', q: `Find the median of ${d.join(', ')}.`, a: st.median, why: `In order: ${st.s.join(', ')}. ${st.n % 2 ? `The middle (${(st.n + 1) / 2}th) value is ${st.median}.` : `Halfway between ${st.s[st.n / 2 - 1]} and ${st.s[st.n / 2]}: ${st.median}.`}` }; },
    () => { let d, st; do { d = Array.from({ length: FD.rnd(6, 9) }, () => FD.rnd(1, 12)); st = FD.stats(d); } while (st.modes.length !== 1); return { type: 'num', q: `Find the mode and the range of ${d.join(', ')}.`, a: [st.modes[0], st.range], fields: ['mode =', 'range ='], why: `${st.modes[0]} appears most often. Range \\(${st.s[st.n - 1]} - ${st.s[0]} = ${st.range}\\).` }; },
  ],
});

FD.check({
  section: 'measures',
  items: [
    { type: 'num', q: 'Find the mean of 4, 8, 6, 10, 2.', a: 6, why: '\\(30 \\div 5 = 6\\).' },
    { type: 'num', q: 'Find the median of 12, 5, 9, 3, 7, 10.', a: 8, why: '3, 5, 7, 9, 10, 12: halfway between 7 and 9.' },
    { type: 'num', q: 'Find the range of 15, 22, 8, 31, 19.', a: 23, why: '\\(31 - 8 = 23\\).' },
    { type: 'mcq', q: 'Salaries: £20k, £22k, £23k, £25k, £200k. Which average best represents a typical salary?', opts: ['The median', 'The mean', 'The range', 'The largest value'], why: 'The £200k outlier pulls the mean up; the median is not affected.' },
  ],
});
