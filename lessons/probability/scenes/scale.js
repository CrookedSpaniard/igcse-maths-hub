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
FD.pq = (n, d) => { const [p, q] = FD.simp(n, d); let r = q; while (r % 2 === 0) r /= 2; while (r % 5 === 0) r /= 5; return { a: n / d, show: `\\(${FD.ftex(n, d)}\\)`, hint: 'Type a fraction like 3/8.', ...(r === 1 ? {} : { form: 'fraction' }) }; };
// The probability scale with events [{ p, label }] marked above it.
FD.pscale = (host) => (events = []) => {
  const X = (p) => 50 + p * 500;
  let s = `<line class="ps-ax" x1="50" y1="120" x2="550" y2="120"/>`;
  [[0, '0', 'impossible'], [0.25, '', 'unlikely'], [0.5, '½', 'even chance'], [0.75, '', 'likely'], [1, '1', 'certain']].forEach(([p, t, w]) => { s += `<line class="ps-ax" x1="${X(p)}" y1="${t ? 110 : 115}" x2="${X(p)}" y2="${t ? 130 : 125}"/>${t ? `<text class="ps-t" x="${X(p)}" y="150">${t}</text>` : ''}<text class="ps-w" x="${X(p)}" y="172">${w}</text>`; });
  events.forEach(({ p, label }, i) => { const y = 90 - (i % 3) * 28; s += `<line class="ps-st" x1="${X(p)}" y1="${y + 4}" x2="${X(p)}" y2="113"/><circle class="ps-m" cx="${X(p)}" cy="120" r="8"/><text class="ps-l" x="${FD.clamp(X(p), 70, 530)}" y="${y}">${label}</text>`; });
  host.innerHTML = `<svg viewBox="0 0 600 185" role="img" aria-label="Probability scale from 0 to 1${events.length ? ' with ' + events.map((e) => `${e.label} at ${FD.round(e.p, 2)}`).join(', ') : ''}">${s}</svg>`;
};
FD.word = (p) => (p === 0 ? 'impossible' : p === 1 ? 'certain' : p === 0.5 ? 'an even chance' : p < 0.5 ? 'unlikely' : 'likely');
FD.EV = [{ p: 0, label: 'rolling a 7 on a dice' }, { p: 0.5, label: 'a coin lands on heads' }, { p: 1, label: 'Monday after Sunday' }, { p: 1 / 6, label: 'rolling a 6' }, { p: 5 / 6, label: 'not rolling a 6' }];

FD.add({
  id: 'scale',
  title: 'The language of probability',
  tab: 'Scale',
  icon: 'dice',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Probability', 'How likely an event is, as a number from 0 to 1.'],
    ['Event', 'Something that may happen, e.g. “the dice shows a 6”.'],
    ['Outcome', 'One possible result, e.g. 4.'],
    ['Probability scale', '0 = impossible, ½ = even chance, 1 = certain.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ps-s', '<div id="sc"></div>', `
      <label class="ctrl">Probability <input type="range" id="rp" min="0" max="20" value="7"><output id="op">0.35</output></label>`, () => sync());
    a.sc = FD.pscale(a.$('#sc'));
    const sync = () => {
      const p = +a.$('#rp').value / 20; a.$('#op').textContent = p;
      a.sc([{ p, label: `P = ${p}` }]);
      a.big(`P = ${p} = ${p * 100}\\%`);
      a.msg(`An event with probability ${p} is ${FD.word(p)}.`);
    };
    a.$('#rp').addEventListener('input', sync);
    a.sc([]);
    return a;
  },
  steps: [
    {
      title: 'Words for chance',
      text: '<p>We describe how likely an event is with words: <b>impossible</b>, <b>unlikely</b>, <b>even chance</b>, <b>likely</b> and <b>certain</b>.</p>',
      async on(a, ctx) { a.reset(); a.sc([]); },
    },
    {
      title: 'Numbers from 0 to 1',
      text: '<p>A probability is a number from <b>0</b> (impossible) to <b>1</b> (certain). It can be a fraction, a decimal or a percentage. An even chance is \\(\\frac12 = 0.5 = 50\\%\\).</p>',
      tip: 'A probability can never be less than 0 or more than 1.',
      async on(a, ctx) { a.reset(); a.sc([]); a.big('0 \\le P \\le 1'); },
    },
    {
      title: 'Placing events',
      text: '<p>Rolling a 7 on an ordinary dice is impossible. A fair coin landing on heads has an even chance. Monday following Sunday is certain.</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 3; k++) { a.sc(FD.EV.slice(0, k)); if (!(await ctx.sleep(1000))) return; }
      },
    },
    {
      title: 'Unlikely and likely',
      text: '<p>Rolling a 6 is <b>unlikely</b>: \\(\\frac16\\). Not rolling a 6 is <b>likely</b>: \\(\\frac56\\). Together they make 1, because one of them must happen.</p>',
      async on(a, ctx) { a.reset(); a.sc(FD.EV.slice(3)); a.big('\\tfrac16 + \\tfrac56 = 1'); },
    },
    {
      title: 'Try it: move along the scale',
      text: '<p>Move the slider. Read the probability as a decimal and a percentage, and the word that describes it.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'scale',
  gens: [
    () => { const [p, t] = FD.pick([[0, 'an ordinary dice showing 0'], [1, 'a dice showing a number less than 7'], [0.5, 'a fair coin landing on tails'], [0.1, 'picking a red card from a box of 1 red and 9 blue cards'], [0.9, 'picking a blue card from a box of 1 red and 9 blue cards']]); const w = FD.word(p); return { type: 'mcq', q: `Which word best describes the chance of ${t}?`, opts: [w, ...['impossible', 'unlikely', 'an even chance', 'likely', 'certain'].filter((x) => x !== w).slice(0, 3)], why: `Its probability is ${p}.` }; },
    () => { const p = FD.pick([0.3, 0.45, 0.62, 0.8, 0.15, 0.07]); return { type: 'tf', q: `A probability of ${p} means the event is likely.`, a: p > 0.5, why: `${p} is ${p > 0.5 ? 'more' : 'less'} than 0.5.` }; },
    () => { const bad = FD.pick(['1.2', '−0.3', '150%', '\\(\\tfrac54\\)']); return { type: 'mcq', q: 'Which of these can NOT be a probability?', opts: [bad, '0', '\\(\\tfrac{7}{8}\\)', '0.99'], why: 'A probability is from 0 to 1.' }; },
  ],
});

FD.check({
  section: 'scale',
  items: [
    { type: 'mcq', q: 'A probability of 0 means the event is…', opts: ['impossible', 'certain', 'unlikely', 'an even chance'], why: '0 is the left end of the scale.' },
    { type: 'mcq', q: 'Which probability means “likely”?', opts: ['0.8', '0.2', '0.5', '1.8'], why: 'More than 0.5, less than 1.' },
    { type: 'tf', q: 'A probability can be written as 75%.', a: true, why: '75% = 0.75, between 0 and 1.' },
    { type: 'sort', q: 'Sort each probability.', bins: ['Unlikely', 'Likely'], rows: [['0.3', 0], ['\\(\\tfrac{9}{10}\\)', 1], ['15%', 0], ['0.65', 1]], why: 'Less than ½ is unlikely; more than ½ is likely.' },
  ],
});
