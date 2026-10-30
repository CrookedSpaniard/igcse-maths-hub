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
// A number as text with commas for thousands: 34567.8 → "34,567.8".
FD.nt = (x) => FD.dec(x).toLocaleString('en-GB', { maximumFractionDigits: 8 });

// Zoomed number line from lo to hi with `sub` small steps. o = { x, mid, to, interval: [a, b] }.
FD.rline = (host) => {
  host.innerHTML = '<svg class="rl" viewBox="0 0 600 150" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (lo, hi, o = {}) => {
    const X = (v) => 50 + ((v - lo) / (hi - lo)) * 500, sub = o.sub || 10, AY = 95;
    let s = '';
    if (o.interval) { const [p, q] = o.interval; s += `<rect class="rl-in" x="${X(p)}" y="${AY - 14}" width="${X(q) - X(p)}" height="28" rx="4"/>`; }
    s += `<line class="rl-ax" x1="30" y1="${AY}" x2="570" y2="${AY}"/>`;
    for (let i = 0; i <= sub; i++) { const v = lo + ((hi - lo) * i) / sub, big = i === 0 || i === sub; s += `<line class="rl-tk ${big ? 'big' : ''}" x1="${X(v)}" y1="${AY - (big ? 12 : 6)}" x2="${X(v)}" y2="${AY + (big ? 12 : 6)}"/>`; if (big || (o.subLabels && i % (o.subLabels) === 0)) s += `<text class="rl-t ${big ? '' : 'sm'}" x="${X(v)}" y="${AY + 32}">${FD.nt(v)}</text>`; }
    if (o.mid) { const m = (lo + hi) / 2; s += `<line class="rl-mid" x1="${X(m)}" y1="${AY - 26}" x2="${X(m)}" y2="${AY + 22}"/><text class="rl-t sm" x="${X(m)}" y="${AY + 32}">${FD.nt(m)}</text>`; }
    if (o.interval) { const [p, q] = o.interval; s += `<circle class="rl-cc" cx="${X(p)}" cy="${AY}" r="7"/><circle class="rl-oc" cx="${X(q)}" cy="${AY}" r="7"/>`; }
    if (o.x != null) {
      s += `<path class="rl-x" d="M${X(o.x)} ${AY - 4}l-8 -14h16z"/><text class="rl-xl" x="${Math.min(Math.max(X(o.x), 60), 540)}" y="${AY - 26}">${o.xl || FD.nt(o.x)}</text>`;
      if (o.to != null) s += `<path class="rl-arr" d="M${X(o.x)} ${AY - 44}Q${(X(o.x) + X(o.to)) / 2} ${AY - 70} ${X(o.to)} ${AY - 18}"/>`;
    }
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Number line from ${lo} to ${hi}${o.x != null ? ` with ${o.x} marked` : ''}`);
  };
};

FD.add({
  id: 'rounding',
  title: 'Rounding to powers of 10 and decimal places',
  tab: 'Rounding',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Rounding', 'Replacing a number by a simpler one that is close to it.'],
    ['The decider', 'The digit just after the place you round to. 5 or more: round up. 4 or less: round down.'],
    ['Decimal places (d.p.)', 'The number of digits after the decimal point.'],
  ],
  mount(el) {
    const opts = [[10, 'nearest 10'], [100, 'nearest 100'], [1000, 'nearest 1000'], [0.1, '1 d.p.'], [0.01, '2 d.p.']];
    const a = FD.board(el, 'ro-s', '<div id="rl"></div>', `
      <label class="ctrl">Number ×100 <input type="range" id="rx" min="100" max="999999" value="347862"><output id="ox">3478.62</output></label>
      <div class="bd-row"><label>Round to <select id="to">${opts.map(([v, t], i) => `<option value="${i}">${t}</option>`).join('')}</select></label></div>`, () => sync());
    a.rl = FD.rline(a.$('#rl'));
    const sync = () => {
      const x = +a.$('#rx').value / 100, [u, t] = opts[+a.$('#to').value], lo = FD.dec(Math.floor(x / u) * u), hi = FD.dec(lo + u), r = FD.dec(Math.round(x / u) * u);
      a.$('#ox').textContent = FD.nt(x);
      a.rl(lo, hi, { x, mid: true, to: r });
      a.big(`${FD.nt(x)} \\approx ${FD.nt(r)} \\; (\\text{${t}})`);
      a.msg(`${FD.nt(x)} is between ${FD.nt(lo)} and ${FD.nt(hi)}. It is ${x >= (lo + hi) / 2 ? 'past' : 'before'} the halfway mark, so it rounds to ${FD.nt(r)}.`);
    };
    ['#rx', '#to'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.rl(3400, 3500, { mid: true });
    return a;
  },
  steps: [
    {
      title: 'Which is it closer to?',
      text: '<p>Round 3478 to the nearest 100. It lies between 3400 and 3500.</p><p>The halfway mark is 3450. 3478 is past it, so it rounds <b>up</b> to 3500.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(3400, 3500, { mid: true, x: 3478 });
        if (!(await ctx.sleep(1300))) return;
        a.rl(3400, 3500, { mid: true, x: 3478, to: 3500 }); a.big('3478 \\approx 3500 \\; (\\text{nearest } 100)');
      },
    },
    {
      title: 'The decider digit',
      text: '<p>Look at the digit <b>after</b> the place you are rounding to. 5, 6, 7, 8 or 9: round up. 0–4: round down.</p>',
      tip: 'Keep place holder zeros: 3478 to the nearest 1000 is 3000, not 3.',
      async on(a, ctx) {
        a.reset(); a.rl(3000, 4000, { mid: true, x: 3478, to: 3000 });
        await a.lines([['3\\underline{4}78 \\to 3480', 'nearest 10: decider 8, up'], ['3\\underline{4}78 \\to 3500', 'nearest 100: decider 7, up'], ['3478 \\to 3000', 'nearest 1000: decider 4, down']], ctx, 1300);
      },
    },
    {
      title: 'Decimal places',
      text: '<p>Round 6.2849 to 2 decimal places. Keep 2 digits after the point; the decider is the 3rd digit, 4, so round <b>down</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(6.28, 6.29, { mid: true, x: 6.2849, to: 6.28 });
        await a.lines([['6.28|49 \\to 6.28', '2 d.p.: decider 4'], ['6.2|849 \\to 6.3', '1 d.p.: decider 8'], ['6.284|9 \\to 6.285', '3 d.p.: decider 9']], ctx, 1300);
      },
    },
    {
      title: 'Rounding 9s',
      text: '<p>Round 2.97 to 1 decimal place. The 9 rounds up to 10, which carries: the answer is <b>3.0</b>.</p><p>Write 3.0, not 3: the 0 shows it is correct to 1 d.p.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(2.9, 3, { mid: true, x: 2.97, to: 3 });
        a.big('2.97 \\approx 3.0 \\; (1 \\text{ d.p.})');
      },
    },
    {
      title: 'Try it: round any number',
      text: '<p>Choose a number and what to round to. The number line zooms in between the two possible answers, with the halfway mark dashed.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'rounding',
  gens: [
    () => { const x = FD.rnd(1000, 99999), u = FD.pick([10, 100, 1000]), r = Math.round(x / u) * u; return { type: 'num', q: `Round ${FD.nt(x)} to the nearest ${u}.`, a: r, why: `${FD.nt(x)} is between ${FD.nt(Math.floor(x / u) * u)} and ${FD.nt(Math.floor(x / u) * u + u)}. The decider digit is ${String(x)[String(x).length - String(u).length + 1]}, so it rounds to ${FD.nt(r)}.` }; },
    () => { const dp = FD.rnd(1, 3), x = FD.dec(FD.rnd(1, 999) + FD.rnd(1, 99999) / 100000), r = FD.round(x, dp); return { type: 'num', q: `Round ${x} to ${dp} decimal place${dp > 1 ? 's' : ''}.`, a: r, why: `Keep ${dp} digit${dp > 1 ? 's' : ''} after the point. The next digit is ${String(x).split('.')[1][dp] || 0}, so ${x} ≈ ${r.toFixed(dp)}.` }; },
    () => { const n = FD.rnd(1, 50), x = FD.dec(n + FD.pick([0.95, 0.96, 0.97, 0.98, 0.99])); return { type: 'mcq', q: `Round ${x} to 1 decimal place.`, opts: [(n + 1).toFixed(1), `${n}.9`, String(n + 1), `${n}.10`], why: `The decider is ${String(x).split('.')[1][1]}, so the 9 tenths round up and carry into the units: ${(n + 1).toFixed(1)}. Keep the 0 to show 1 decimal place.` }; },
  ],
});

FD.check({
  section: 'rounding',
  items: [
    { type: 'num', q: 'Round 45 671 to the nearest 1000.', a: 46000, why: 'Decider 6: round up to 46 000.' },
    { type: 'num', q: 'Round 8.4637 to 2 decimal places.', a: 8.46, why: 'Decider 3: round down.' },
    { type: 'num', q: 'Round 249 to the nearest 10.', a: 250, why: 'Decider 9: 249 → 250.' },
    { type: 'mcq', q: 'Round 5.96 to 1 decimal place.', opts: ['6.0', '5.9', '6', '5.10'], why: '5.96 → 6.0 (the 0 shows 1 d.p.).' },
  ],
});
