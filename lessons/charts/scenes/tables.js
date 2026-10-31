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
// Tally marks for n: groups of five are four bars crossed through.
FD.tally = (n) => '<s>||||</s> '.repeat(Math.floor(n / 5)) + '|'.repeat(n % 5);
FD.SHOE = [5, 6, 4, 5, 7, 5, 6, 3, 5, 4, 6, 5, 7, 4, 5, 6, 5, 4, 6, 8];

// Builds a tally / frequency table from a list, showing the first k values counted.
FD.tallyTable = (host) => (data, k = data.length) => {
  const vals = [...new Set(data)].sort((x, y) => x - y), seen = data.slice(0, k);
  host.innerHTML = `<div class="dl">${data.map((v, i) => `<span class="${i < k - 1 ? 'used' : i === k - 1 ? 'now' : ''}">${v}</span>`).join('')}</div>
    <table class="dt"><tr><th>Value</th><th>Tally</th><th>Frequency</th></tr>${vals.map((v) => { const f = seen.filter((x) => x === v).length; return `<tr><td>${v}</td><td class="tally">${FD.tally(f)}</td><td class="${k === data.length ? 'hi' : ''}">${k === data.length ? f : ''}</td></tr>`; }).join('')}</table>`;
};

FD.add({
  id: 'tables',
  title: 'Frequency tables and two-way tables',
  tab: 'Tables',
  icon: 'stats',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Frequency', 'How many times a value appears.'],
    ['Tally', 'A quick way of counting: groups of five marks.'],
    ['Class interval', 'A group of values, like \\(10 < t \\le 20\\), used when there are many different values.'],
    ['Two-way table', 'A table that sorts data by two things at once, e.g. year group and favourite sport.'],
  ],
  mount(el) {
    const a = FD.board(el, 'tb-s', '<div id="tt"></div>', `
      <div class="bd-btns"><button class="btn" id="bOne">Count the next value ▶</button><button class="btn ghost" id="bNew">New data ↻</button></div>`, () => start());
    a.tt = FD.tallyTable(a.$('#tt'));
    let data = FD.SHOE, k = 0;
    const start = () => { data = Array.from({ length: 16 }, () => FD.rnd(1, 6)); k = 0; a.tt(data, 0); a.msg('Dice scores: press the button to tally them one at a time.'); };
    a.$('#bNew').addEventListener('click', start);
    a.$('#bOne').addEventListener('click', () => { if (k < data.length) k++; a.tt(data, k); if (k === data.length) a.msg(`All ${data.length} values counted. The frequencies add up to ${data.length}.`); });
    a.tt(FD.SHOE, 0);
    return a;
  },
  steps: [
    {
      title: 'Tally and frequency',
      text: '<p>20 students give the number of people in their home. Go through the list <b>once</b>, making a tally mark for each value.</p><p>The frequency is the number of tally marks.</p>',
      tip: 'Check: the frequencies must add up to the number of values.',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= FD.SHOE.length; k++) { a.tt(FD.SHOE, k); if (!(await ctx.sleep(250))) return; }
        a.big('1 + 4 + 7 + 5 + 2 + 1 = 20');
      },
    },
    {
      title: 'Grouped data',
      text: '<p>When there are many different values, group them into <b>class intervals</b> of equal width.</p><p>\\(10 < t \\le 20\\) means more than 10 and up to 20: a time of exactly 20 goes in this class, 10 does not.</p>',
      async on(a, ctx) {
        a.reset();
        a.$('#tt').innerHTML = '<table class="dt"><tr><th>Time t (min)</th><th>Frequency</th></tr><tr><td>\\(0 < t \\le 10\\)</td><td>4</td></tr><tr><td>\\(10 < t \\le 20\\)</td><td>9</td></tr><tr><td>\\(20 < t \\le 30\\)</td><td>6</td></tr><tr><td>\\(30 < t \\le 40\\)</td><td>1</td></tr></table>';
        a.msg('The classes do not overlap, so every time fits in exactly one class.');
      },
    },
    {
      title: 'Two-way tables',
      text: '<p>60 students chose football, tennis or swimming. 18 of the 32 boys chose football; 10 girls chose tennis; 15 students chose swimming, 6 of them boys.</p><p>Fill in what you know, then use the totals to find the rest.</p>',
      async on(a, ctx) {
        a.reset();
        const T = (c) => `<table class="dt"><tr><th></th><th>Football</th><th>Tennis</th><th>Swimming</th><th>Total</th></tr><tr><th>Boys</th><td>18</td><td class="${c > 0 ? 'hi' : ''}">${c > 0 ? 8 : ''}</td><td>6</td><td>32</td></tr><tr><th>Girls</th><td class="${c > 2 ? 'hi' : ''}">${c > 2 ? 9 : ''}</td><td>10</td><td class="${c > 1 ? 'hi' : ''}">${c > 1 ? 9 : ''}</td><td class="${c > 1 ? 'hi' : ''}">${c > 1 ? 28 : ''}</td></tr><tr><th>Total</th><td class="${c > 3 ? 'hi' : ''}">${c > 3 ? 27 : ''}</td><td class="${c > 3 ? 'hi' : ''}">${c > 3 ? 18 : ''}</td><td>15</td><td>60</td></tr></table>`;
        for (let c = 0; c <= 4; c++) { a.$('#tt').innerHTML = T(c); if (!(await ctx.sleep(1000))) return; }
        a.msg('Boys tennis: 32 − 18 − 6 = 8. Girls swimming: 15 − 6 = 9. Girls total: 60 − 32 = 28. Girls football: 28 − 10 − 9 = 9.');
      },
    },
    {
      title: 'Try it: tally some dice',
      text: '<p>Press the button to count the dice scores one at a time. Press <b>New data</b> for a fresh set.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'tables',
  gens: [
    () => { const d = Array.from({ length: FD.rnd(12, 18) }, () => FD.rnd(1, 5)), v = FD.rnd(1, 5), f = d.filter((x) => x === v).length; return { type: 'num', q: `Here are some scores: ${d.join(', ')}. What is the frequency of ${v}?`, a: f, why: `Count the ${v}s: there ${f === 1 ? 'is 1' : `are ${f}`}.` }; },
    () => { const b = [FD.rnd(5, 15), FD.rnd(5, 15), FD.rnd(5, 15)], g = [FD.rnd(5, 15), FD.rnd(5, 15), FD.rnd(5, 15)], tb = b[0] + b[1] + b[2], tg = g[0] + g[1] + g[2]; return { type: 'num', q: `In a two-way table, ${tb} boys and ${tg} girls choose a colour. ${b[0]} boys choose red and ${b[1]} choose blue; the rest choose green. ${g[2]} girls choose green. How many students choose green altogether?`, a: b[2] + g[2], why: `Boys green: \\(${tb} - ${b[0]} - ${b[1]} = ${b[2]}\\). Total green: \\(${b[2]} + ${g[2]} = ${b[2] + g[2]}\\).` }; },
    () => { const lo = FD.pick([10, 20, 30, 40]), x = FD.pick([lo, lo + 10]); return { type: 'mcq', q: `A time of ${x} minutes goes in which class?`, opts: x === lo ? [`\\(${lo - 10} < t \\le ${lo}\\)`, `\\(${lo} < t \\le ${lo + 10}\\)`] : [`\\(${lo} < t \\le ${lo + 10}\\)`, `\\(${lo + 10} < t \\le ${lo + 20}\\)`], why: `\\(a < t \\le b\\) includes the top value b but not the bottom value a.` }; },
  ],
});

FD.check({
  section: 'tables',
  items: [
    { type: 'num', q: 'A frequency table has frequencies 3, 8, 11 and 6. How many values are there?', a: 28, why: '\\(3 + 8 + 11 + 6 = 28\\).' },
    { type: 'mcq', q: 'Which class does a mass of 50 g go in?', opts: ['\\(40 < m \\le 50\\)', '\\(50 < m \\le 60\\)', 'Both', 'Neither'], why: '≤ 50 includes 50.' },
    { type: 'num', q: 'A two-way table: 45 adults, of whom 17 are men. How many are women?', a: 28, why: '\\(45 - 17 = 28\\).' },
    { type: 'tf', q: 'Class intervals in a grouped frequency table may overlap.', a: false, why: 'Each value must fit in exactly one class.' },
  ],
});
