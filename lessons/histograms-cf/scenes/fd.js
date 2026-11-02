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

// Axes for a graph 600 × 250: x from xlo to xhi, y from 0 to a tidy value above ymax.
FD.niceStep = (m) => [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200].find((s) => m / s <= 6) || 500;
FD.axes = (xlo, xhi, ymax, xticks, xl, yl) => {
  const st = FD.niceStep(ymax || 1), top = FD.dec(Math.ceil(FD.dec((ymax || 1) / st)) * st);
  const X = (v) => 60 + ((v - xlo) / (xhi - xlo)) * 510, Y = (v) => 210 - (v / top) * 180;
  let s = '';
  for (let k = 0; FD.dec(k * st) <= top; k++) { const v = FD.dec(k * st); s += `<line class="cg-grid" x1="60" y1="${Y(v)}" x2="570" y2="${Y(v)}"/><text class="cg-t cg-ty" x="54" y="${Y(v) + 4}">${v}</text>`; }
  xticks.forEach((v) => { s += `<text class="cg-t" x="${X(v)}" y="228">${v}</text>`; });
  s += `<line class="cg-ax" x1="60" y1="210" x2="572" y2="210"/><line class="cg-ax" x1="60" y1="24" x2="60" y2="210"/><text class="cg-name" x="315" y="246" text-anchor="middle">${xl}</text><text class="cg-name" x="62" y="14">${yl}</text>`;
  return { s, X, Y, top };
};
// Histogram of classes [[a, b, f]]. o.mode 'fd' | 'f'; o.upto bars; o.labels; o.hi bar index; o.shade [x1, x2].
FD.hist = (host) => (cls, o = {}) => {
  const mode = o.mode || 'fd', h = (c) => (mode === 'fd' ? FD.dec(c[2] / (c[1] - c[0])) : c[2]), upto = o.upto === undefined ? cls.length : o.upto;
  const lo = cls[0][0], hi = cls[cls.length - 1][1], ax = FD.axes(lo, hi, Math.max(...cls.map(h)), [lo, ...cls.map((c) => c[1])], o.xl || 'Time <tspan font-style="italic">t</tspan> (seconds)', mode === 'fd' ? 'Frequency density' : 'Frequency');
  let s = ax.s;
  cls.slice(0, upto).forEach((c, i) => {
    s += `<rect class="cg-bar ${mode === 'f' ? 'wrong' : ''} ${o.hi === i ? 'hi' : ''}" x="${ax.X(c[0])}" y="${ax.Y(h(c))}" width="${ax.X(c[1]) - ax.X(c[0])}" height="${210 - ax.Y(h(c))}"/>`;
    if (o.shade) { const p = Math.max(c[0], o.shade[0]), q = Math.min(c[1], o.shade[1]); if (q > p) s += `<rect class="hs-sh" x="${ax.X(p)}" y="${ax.Y(h(c))}" width="${ax.X(q) - ax.X(p)}" height="${210 - ax.Y(h(c))}"/>`; }
    if (o.labels) s += `<text class="cg-v" x="${(ax.X(c[0]) + ax.X(c[1])) / 2}" y="${ax.Y(h(c)) - 6}">${h(c)}</text>`;
  });
  host.innerHTML = `<svg viewBox="0 0 600 252" role="img" aria-label="${mode === 'fd' ? 'Histogram' : 'Bar chart of frequency'} with classes ${cls.map((c) => `${c[0]} to ${c[1]}`).join(', ')}">${s}</svg>`;
};
// A table of classes. cols: any of 'f', 'w', 'fd', 'cf'.
FD.htab = (cls, cols, o = {}) => {
  const v = o.v || 't', cf = []; cls.reduce((a, c, i) => (cf[i] = a + c[2]), 0);
  const H = { f: 'Frequency', w: 'Class width', fd: 'Frequency density', cf: 'Cumulative frequency' };
  const V = { f: (c) => c[2], w: (c) => c[1] - c[0], fd: (c) => FD.dec(c[2] / (c[1] - c[0])), cf: (c, i) => cf[i] };
  return `<table class="dt"><tr><th>${o.head || 'Time \\(t\\) (s)'}</th>${cols.map((k) => `<th>${H[k]}</th>`).join('')}</tr>${cls.map((c, i) => `<tr><td>\\(${c[0]} < ${v} \\le ${c[1]}\\)</td>${cols.map((k) => `<td class="${o.hi === i || (o.hiCol === k && (o.upto === undefined || i < o.upto)) ? 'hi' : ''}">${o.upto !== undefined && o.hiCol === k && i >= o.upto ? '' : V[k](c, i)}</td>`).join('')}</tr>`).join('')}</table>`;
};
FD.H1 = [[0, 10, 8], [10, 15, 12], [15, 20, 15], [20, 30, 10], [30, 50, 6]];

FD.add({
  id: 'fd',
  title: 'Frequency density and drawing histograms',
  tab: 'Drawing',
  icon: 'stats',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Histogram', 'A chart for grouped continuous data where the <b>area</b> of each bar shows the frequency.'],
    ['Class width', 'Upper boundary − lower boundary, e.g. \\(30 - 20 = 10\\).'],
    ['Frequency density', 'Frequency ÷ class width. It is the height of the bar.'],
  ],
  mount(el) {
    const cls = FD.H1.map((c) => c.slice());
    const a = FD.board(el, 'fd-s', '<div class="hc-pair"><div id="tb"></div><div id="ch"></div></div>', `
      <div class="hc-sl">${cls.map((c, i) => `<label class="ctrl">\\(${c[0]} < t \\le ${c[1]}\\) <input type="range" id="f${i}" min="0" max="20" value="${c[2]}"><output id="o${i}">${c[2]}</output></label>`).join('')}</div>
      <div class="bd-btns"><button class="btn ghost" id="bMode">Plot frequency instead</button></div>`, () => sync());
    a.hist = FD.hist(a.$('#ch'));
    a.show = (c, cols, o = {}) => { a.$('#tb').innerHTML = FD.htab(c, cols, o); a.hist(c, o); };
    let mode = 'fd';
    const sync = () => {
      cls.forEach((c, i) => { c[2] = +a.$('#f' + i).value; a.$('#o' + i).textContent = c[2]; });
      a.show(cls, ['f', 'fd'], { mode, labels: true });
      a.$('#bMode').textContent = mode === 'fd' ? 'Plot frequency instead' : 'Plot frequency density';
      a.msg(mode === 'fd' ? 'Histogram: the area of each bar is its frequency.' : 'Wrong: with frequency as the height, the wide classes look far too big.', mode === 'fd' ? 'good' : 'bad');
    };
    a.$('.hc-sl').addEventListener('input', sync);
    a.$('#bMode').addEventListener('click', () => { mode = mode === 'fd' ? 'f' : 'fd'; sync(); });
    a.show(FD.H1, ['f'], { mode: 'f', upto: 0 });
    return a;
  },
  steps: [
    {
      title: 'Classes of different widths',
      text: '<p>51 runners were timed in a short race. The classes are <b>not</b> all the same width: \\(30 < t \\le 50\\) is 20 seconds wide, but \\(10 < t \\le 15\\) is only 5 seconds wide.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.H1, ['f', 'w'], { mode: 'f', upto: 0 }); },
    },
    {
      title: 'Why a bar chart misleads',
      text: '<p>If the heights are the frequencies, the wide bar for \\(30 < t \\le 50\\) looks big, although it holds only 6 runners. Our eyes judge a bar by its <b>area</b>.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.H1, ['f', 'w'], { mode: 'f', labels: true, hi: 4 }); a.msg('Wrong picture: the last bar has the biggest area, but the smallest frequency.', 'bad'); },
    },
    {
      title: 'Frequency density',
      text: '<p>Divide each frequency by its class width. This is the <b>frequency density</b>, and it gives the <b>height</b> of each bar.</p>',
      tip: 'Frequency density = frequency ÷ class width.',
      async on(a, ctx) {
        a.reset(); a.show(FD.H1, ['f', 'w', 'fd'], { mode: 'fd', upto: 0, hiCol: 'fd' });
        await a.lines([['8 \\div 10 = 0.8', '\\(0 < t \\le 10\\)'], ['12 \\div 5 = 2.4', '\\(10 < t \\le 15\\)'], ['15 \\div 5 = 3,\\ 10 \\div 10 = 1,\\ 6 \\div 20 = 0.3', 'the rest']], ctx, 1300);
        a.$('#tb').innerHTML = FD.htab(FD.H1, ['f', 'w', 'fd'], { hiCol: 'fd' });
      },
    },
    {
      title: 'Draw the histogram',
      text: '<p>Put frequency density on the vertical axis. Draw each bar from its lower to its upper class boundary, with <b>no gaps</b>.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 5; k++) { a.show(FD.H1, ['fd'], { mode: 'fd', upto: k, labels: true }); if (!(await ctx.sleep(700))) return; }
      },
    },
    {
      title: 'Area = frequency',
      text: '<p>Check a bar: the \\(10 < t \\le 15\\) bar is 5 wide and 2.4 high. Its area is \\(5 \\times 2.4 = 12\\), the frequency.</p>',
      async on(a, ctx) { a.reset(); a.show(FD.H1, ['f', 'fd'], { mode: 'fd', labels: true, hi: 1 }); a.big('\\text{area} = 5 \\times 2.4 = 12 = \\text{frequency}'); },
    },
    {
      title: 'Try it: build a histogram',
      text: '<p>Change the frequencies. The table works out the frequency densities and the histogram updates. Then press the button to see the wrong chart with frequency as the height.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'fd',
  gens: [
    () => { const w = FD.pick([2, 4, 5, 10, 20, 25]), f = FD.rnd(3, 40), lo = w * FD.rnd(0, 6); return { type: 'num', q: `The class \\(${lo} < x \\le ${lo + w}\\) has a frequency of ${f}. Work out the frequency density.`, a: FD.dec(f / w), why: `Class width \\(${w}\\). Frequency density \\(= ${f} \\div ${w} = ${FD.dec(f / w)}\\).` }; },
    () => { let cls, fds; do { const ws = [FD.pick([5, 10]), FD.pick([5, 10, 20]), FD.pick([10, 20, 30])]; let lo = 0; cls = ws.map((w) => { const c = [lo, lo + w, FD.rnd(2, 30)]; lo += w; return c; }); fds = cls.map((c) => c[2] / (c[1] - c[0])); } while (new Set(fds).size < 3); const tall = fds.indexOf(Math.max(...fds)), big = cls.map((c) => c[2]).indexOf(Math.max(...cls.map((c) => c[2]))); return { type: 'mcq', q: `Which class has the <b>tallest</b> bar on a histogram?${FD.htab(cls, ['f'], { v: 'x', head: 'Length \\(x\\) (cm)' })}`, opts: [tall, ...[0, 1, 2].filter((i) => i !== tall)].map((i) => `\\(${cls[i][0]} < x \\le ${cls[i][1]}\\)`), why: `Frequency densities: ${fds.map((d) => FD.round(d, 2)).join(', ')}. The tallest bar has the greatest frequency density${big !== tall ? ', not the greatest frequency' : ''}.` }; },
    () => { const w = FD.pick([5, 10, 20]), d = FD.pick([0.4, 0.8, 1.2, 1.5, 2, 2.5, 3.2]), f = FD.dec(w * d); return Number.isInteger(f) ? { type: 'num', q: `A bar on a histogram is ${w} units wide and has a frequency density of ${d}. What frequency does it show?`, a: f, why: `Frequency = area \\(= ${w} \\times ${d} = ${f}\\).` } : { type: 'num', q: `A bar on a histogram is 10 units wide and has a frequency density of 1.5. What frequency does it show?`, a: 15, why: 'Frequency = area \\(= 10 \\times 1.5 = 15\\).' }; },
  ],
});

FD.check({
  section: 'fd',
  items: [
    { type: 'num', q: 'The class \\(20 < t \\le 40\\) has frequency 14. Work out its frequency density.', a: 0.7, why: '\\(14 \\div 20 = 0.7\\).' },
    { type: 'mcq', q: 'What goes on the vertical axis of a histogram?', opts: ['Frequency density', 'Frequency', 'Cumulative frequency', 'Class width'], why: 'Height = frequency density, so area = frequency.' },
    { type: 'tf', q: 'In a histogram, the area of a bar is proportional to the frequency.', a: true, why: 'Width × frequency density = frequency.' },
    { type: 'num', q: 'A class \\(5 < x \\le 7\\) has frequency 9. How tall is its bar?', a: 4.5, why: '\\(9 \\div 2 = 4.5\\).' },
  ],
});
