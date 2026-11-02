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
// A probability answer n/d for a num item: accepts a fraction (or a decimal when it ends).
FD.pq = (n, d) => { const [, q] = FD.simp(n, d); let r = q; while (r % 2 === 0) r /= 2; while (r % 5 === 0) r /= 5; return { a: n / d, show: `\\(${FD.ftex(n, d)}\\)`, hint: 'Type a fraction like 3/8.', ...(r === 1 ? {} : { form: 'fraction' }) }; };
// A list of outcomes as chips; hi(o) marks the ones in the event.
FD.olist = (host) => (list, hi = () => false) => { host.innerHTML = `<div class="ol">${list.map((o) => `<span class="${hi(o) ? 'hi' : ''}">${o}</span>`).join('')}</div>`; };
// Sample space grid for two dice. cell(x, y) gives the entry; hi(x, y) marks the event.
FD.ssGrid = (host) => (cell = (x, y) => x + y, hi = () => false, cap = 'Sum of the two dice') => {
  host.innerHTML = `<table class="ss"><caption>${cap}</caption><tr><th></th>${[1, 2, 3, 4, 5, 6].map((y) => `<th>${y}</th>`).join('')}</tr>${[1, 2, 3, 4, 5, 6].map((x) => `<tr><th>${x}</th>${[1, 2, 3, 4, 5, 6].map((y) => `<td class="${hi(x, y) ? 'hi' : ''}">${cell(x, y)}</td>`).join('')}</tr>`).join('')}</table>`;
};
FD.SSE = [
  ['the sum is 7', (x, y) => x + y === 7],
  ['the sum is 10 or more', (x, y) => x + y >= 10],
  ['a double', (x, y) => x === y],
  ['at least one 6', (x, y) => x === 6 || y === 6],
  ['the product is even', (x, y) => (x * y) % 2 === 0],
  ['the difference is 2', (x, y) => Math.abs(x - y) === 2],
];

FD.add({
  id: 'samplespace',
  title: 'Listing outcomes and sample spaces',
  tab: 'Sample spaces',
  icon: 'dice',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Outcome', 'One possible result, e.g. (H, 4).'],
    ['Sample space', 'The list (or grid) of all the possible outcomes.'],
    ['Event', 'A set of outcomes, e.g. “the sum is 7”.'],
    ['Systematic', 'In a fixed order, so nothing is missed or listed twice.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ss-s', '<div id="ol"></div><div id="gr"></div>', `
      <div class="bd-row"><label for="se">Event</label><select id="se">${FD.SSE.map((e, i) => `<option value="${i}">${e[0]}</option>`).join('')}</select></div>`, () => sync());
    a.ol = FD.olist(a.$('#ol')); a.gr = FD.ssGrid(a.$('#gr'));
    const sync = () => {
      const [t, f] = FD.SSE[+a.$('#se').value]; let k = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (f(x, y)) k++;
      a.$('#ol').innerHTML = ''; a.gr((x, y) => x + y, f);
      a.big(`P(\\text{${t}}) = \\frac{${k}}{36}${FD.gcd(k, 36) > 1 ? ` = ${FD.ftex(k, 36)}` : ''}`);
      a.msg(`${k} of the 36 equally likely outcomes are shaded.`);
    };
    a.$('#se').addEventListener('change', sync);
    a.ol(['H', 'T']);
    return a;
  },
  steps: [
    {
      title: 'Listing outcomes',
      text: '<p>A coin has 2 outcomes: H, T. Throw <b>two</b> coins and list the outcomes <b>systematically</b>: first coin H with each second coin, then first coin T with each.</p>',
      tip: 'HT and TH are different outcomes.',
      async on(a, ctx) { a.reset(); a.$('#gr').innerHTML = ''; a.ol(['H', 'T']); if (!(await ctx.sleep(1000))) return; a.ol(['HH', 'HT', 'TH', 'TT']); a.big('2 \\times 2 = 4 \\text{ outcomes}'); },
    },
    {
      title: 'A coin and a dice',
      text: '<p>Throw a coin and roll a dice. Pair every coin result with every dice result: \\(2 \\times 6 = 12\\) outcomes.</p>',
      async on(a, ctx) {
        a.reset(); a.$('#gr').innerHTML = ''; const L = ['H', 'T'].flatMap((c) => [1, 2, 3, 4, 5, 6].map((d) => `${c}${d}`));
        for (let k = 1; k <= 12; k++) { a.ol(L.slice(0, k)); if (!(await ctx.sleep(180))) return; }
        a.ol(L, (o) => o[0] === 'H' && +o[1] % 2 === 0); a.big('P(\\text{head and an even number}) = \\frac{3}{12} = \\frac14');
      },
    },
    {
      title: 'Two dice: a sample space grid',
      text: '<p>Two dice give \\(6 \\times 6 = 36\\) outcomes. A grid is the clearest way to show them. Here each cell shows the <b>sum</b> of the two scores.</p>',
      async on(a, ctx) { a.reset(); a.$('#ol').innerHTML = ''; a.gr(); },
    },
    {
      title: 'Probability from the grid',
      text: '<p>All 36 outcomes are equally likely. Count the cells in the event and divide by 36. The sum is 7 in 6 cells.</p>',
      async on(a, ctx) { a.reset(); a.$('#ol').innerHTML = ''; a.gr(undefined, (x, y) => x + y === 7); a.big('P(\\text{sum} = 7) = \\frac{6}{36} = \\frac16'); },
    },
    {
      title: 'Try it: choose an event',
      text: '<p>Choose an event. The grid shades its outcomes and works out the probability.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'samplespace',
  gens: [
    () => { const s = FD.rnd(2, 12); let k = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (x + y === s) k++; return { type: 'num', q: `Two fair dice are rolled and the scores are added. Find P(sum = ${s}).`, ...FD.pq(k, 36), why: `${k} of the 36 cells in the grid have sum ${s}: \\(${FD.ftex(k, 36)}\\).` }; },
    () => { const [n1, c1] = FD.pick([['a coin', 2], ['a dice', 6], ['a 4-sided spinner', 4], ['a 5-sided spinner', 5]]), [n2, c2] = FD.pick([['a coin', 2], ['a dice', 6], ['a 3-sided spinner', 3]]); return { type: 'num', q: `How many outcomes are there when you use ${n1} and ${n2}?`, a: c1 * c2, why: `\\(${c1} \\times ${c2} = ${c1 * c2}\\).` }; },
    () => { const [t, f] = FD.pick(FD.SSE); let k = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (f(x, y)) k++; return { type: 'num', q: `Two fair dice are rolled. Find the probability that ${t}.`, ...FD.pq(k, 36), why: `Count the outcomes in the grid: ${k} out of 36, \\(${FD.ftex(k, 36)}\\).` }; },
  ],
});

FD.check({
  section: 'samplespace',
  items: [
    { type: 'mcq', q: 'Two coins are thrown. Which list of outcomes is complete?', opts: ['HH, HT, TH, TT', 'HH, HT, TT', 'H, T', 'HH, TT'], why: 'HT and TH are different.' },
    { type: 'num', q: 'A coin is thrown and a dice is rolled. How many outcomes are there?', a: 12, why: '\\(2 \\times 6\\).' },
    { type: 'num', q: 'Two dice are rolled. Find P(a double).', ...FD.pq(6, 36), why: '6 doubles out of 36.' },
    { type: 'tf', q: 'When two dice are rolled, a sum of 7 is more likely than a sum of 12.', a: true, why: '6 ways against 1 way.' },
  ],
});
