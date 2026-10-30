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
FD.dec = (x) => +x.toFixed(8);
FD.r2 = (x) => FD.round(x, 2);
FD.gbp = (x) => '£' + FD.r2(x).toLocaleString('en-GB', { minimumFractionDigits: Number.isInteger(FD.r2(x)) ? 0 : 2, maximumFractionDigits: 2 });

// Bars for years 0…n. A = main values; B = optional second set (orange) to compare. shown = years drawn.
FD.ybars = (host) => {
  host.innerHTML = '<svg class="yb" viewBox="0 0 600 230" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (A, { B, shown = A.length, keys } = {}) => {
    const n = A.length, max = Math.max(...A, ...(B || [])), gw = 540 / n, bw = B ? gw * 0.36 : gw * 0.6, H = (v) => (v / max) * 140;
    let s = `<line class="yb-ax" x1="30" y1="190" x2="580" y2="190"/>`;
    A.forEach((v, i) => {
      const x0 = 35 + i * gw;
      if (i < shown) {
        s += `<rect class="yb-a" x="${x0 + (gw - (B ? 2 * bw + 4 : bw)) / 2}" y="${190 - H(v)}" width="${bw}" height="${H(v)}"/>`;
        if (B) s += `<rect class="yb-b" x="${x0 + (gw - (2 * bw + 4)) / 2 + bw + 4}" y="${190 - H(B[i])}" width="${bw}" height="${H(B[i])}"/>`;
        if (n <= 7 && !B) s += `<text class="yb-v" x="${x0 + gw / 2}" y="${184 - H(v)}">${Math.round(v)}</text>`;
      }
      s += `<text class="yb-t" x="${x0 + gw / 2}" y="210">${i === 0 ? 'start' : 'yr ' + i}</text>`;
    });
    if (B && keys) s += `<rect class="yb-a" x="40" y="14" width="14" height="14"/><text class="yb-key" x="60" y="26">${keys[0]}</text><rect class="yb-b" x="200" y="14" width="14" height="14"/><text class="yb-key" x="220" y="26">${keys[1]}</text>`;
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Bar chart of the value each year for ${n - 1} years`);
  };
};
FD.series = (P, m, n) => Array.from({ length: n + 1 }, (_, i) => P * m ** i);

FD.add({
  id: 'simple',
  title: 'Simple and compound interest',
  tab: 'Interest',
  icon: 'stats',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Interest', 'Money a bank pays you for keeping your money, as a percentage per year (per annum).'],
    ['Simple interest', 'The same interest every year, worked out on the <b>original</b> amount only.'],
    ['Compound interest', 'Interest worked out on the amount at the start of <b>each year</b>, so you also earn interest on the interest.'],
  ],
  mount(el) {
    const a = FD.board(el, 'si-s', '<div id="yb"></div>', `
      <label class="ctrl">Amount (£) <input type="range" id="rp" min="100" max="2000" step="100" value="1000"><output id="op">1000</output></label>
      <label class="ctrl">Rate (% per year) <input type="range" id="rr" min="1" max="20" value="10"><output id="or">10</output></label>
      <label class="ctrl">Years <input type="range" id="rn" min="1" max="10" value="6"><output id="on">6</output></label>`, () => sync());
    a.yb = FD.ybars(a.$('#yb'));
    const sync = () => {
      const P = +a.$('#rp').value, r = +a.$('#rr').value, n = +a.$('#rn').value; a.$('#op').textContent = P; a.$('#or').textContent = r; a.$('#on').textContent = n;
      const S = Array.from({ length: n + 1 }, (_, i) => P * (1 + (r / 100) * i)), C = FD.series(P, 1 + r / 100, n);
      a.yb(S, { B: C, keys: ['simple', 'compound'] });
      a.big(`\\text{simple: } ${FD.r2(S[n])} \\qquad \\text{compound: } ${FD.r2(C[n])}`);
      a.msg(`After ${n} years compound interest gives ${FD.gbp(C[n] - S[n])} more.`);
    };
    ['#rp', '#rr', '#rn'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.yb(FD.series(1000, 1.1, 0));
    return a;
  },
  steps: [
    {
      title: 'Simple interest',
      text: '<p>£1000 is invested at 10% <b>simple</b> interest. Each year it earns 10% of £1000 = <b>£100</b>, the same every year.</p>',
      async on(a, ctx) {
        a.reset();
        const S = [1000, 1100, 1200, 1300];
        for (let k = 1; k <= 4; k++) { a.yb(S, { shown: k }); if (!(await ctx.sleep(800))) return; }
        a.work([['\\text{interest} = 1000 \\times 0.1 \\times 3 = 300', '3 years'], ['\\text{total} = 1000 + 300 = 1300', '']]); a.upto(1);
      },
    },
    {
      title: 'Compound interest: year by year',
      text: '<p>With <b>compound</b> interest, each year’s 10% is worked out on the <b>new</b> amount, so the interest grows.</p>',
      tip: 'Banks and savings accounts normally use compound interest.',
      async on(a, ctx) {
        a.reset();
        const C = [1000, 1100, 1210, 1331];
        for (let k = 1; k <= 4; k++) { a.yb(C, { shown: k }); if (!(await ctx.sleep(700))) return; }
        await a.lines([['\\text{year 1: } 1000 \\times 1.1 = 1100', 'interest £100'], ['\\text{year 2: } 1100 \\times 1.1 = 1210', 'interest £110'], ['\\text{year 3: } 1210 \\times 1.1 = 1331', 'interest £121']], ctx, 1200);
      },
    },
    {
      title: 'Side by side',
      text: '<p>Over 10 years the difference grows. Simple interest goes up in a straight line; compound interest curves upwards.</p>',
      async on(a, ctx) {
        a.reset();
        const S = Array.from({ length: 11 }, (_, i) => 1000 + 100 * i), C = FD.series(1000, 1.1, 10);
        a.yb(S, { B: C, keys: ['simple', 'compound'] });
        await a.lines([['\\text{simple: } \\pounds 2000', 'after 10 years'], ['\\text{compound: } 1000 \\times 1.1^{10} = \\pounds 2593.74', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: compare the two',
      text: '<p>Choose the amount, the rate and the number of years. Blue is simple interest, orange is compound.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'simple',
  gens: [
    () => { const P = FD.pick([200, 500, 800, 1000, 1500, 2000, 2500]), r = FD.pick([2, 3, 4, 5, 6, 8]), n = FD.rnd(2, 6), I = FD.dec((P * r * n) / 100); return { type: 'num', q: `£${P} is invested at ${r}% per year <b>simple</b> interest. How much interest is earned in ${n} years, in pounds?`, a: I, why: `Each year: ${r}% of ${P} = ${FD.dec((P * r) / 100)}. For ${n} years: \\(${FD.dec((P * r) / 100)} \\times ${n} = ${I}\\).` }; },
    () => { const P = FD.pick([100, 200, 500, 1000, 2000]), r = FD.pick([5, 10, 20]), n = 2, v = FD.r2(P * (1 + r / 100) ** n); return { type: 'num', q: `£${P} is invested at ${r}% per year <b>compound</b> interest. How much is in the account after ${n} years, in pounds?`, a: v, why: `Year 1: \\(${P} \\times ${FD.dec(1 + r / 100)} = ${FD.r2(P * (1 + r / 100))}\\). Year 2: \\(${FD.r2(P * (1 + r / 100))} \\times ${FD.dec(1 + r / 100)} = ${v}\\).` }; },
    () => { const P = FD.pick([1000, 2000, 5000]), r = FD.pick([4, 5, 10]); const s = P * (1 + (r * 3) / 100), c = FD.r2(P * (1 + r / 100) ** 3); return { type: 'num', q: `£${P} is invested for 3 years at ${r}% per year. How much <b>more</b> is there with compound interest than with simple interest, in pounds?`, a: FD.r2(c - s), why: `Simple: \\(${P} + 3 \\times ${FD.dec((P * r) / 100)} = ${s}\\). Compound: \\(${P} \\times ${FD.dec(1 + r / 100)}^3 = ${c}\\). Difference: ${FD.r2(c - s)}.` }; },
  ],
});

FD.check({
  section: 'simple',
  items: [
    { type: 'num', q: '£600 at 4% simple interest for 5 years. How much interest, in pounds?', a: 120, why: '\\(600 \\times 0.04 \\times 5 = 120\\).' },
    { type: 'num', q: '£400 at 5% compound interest. How much after 2 years, in pounds?', a: 441, why: '\\(400 \\times 1.05 = 420\\), \\(420 \\times 1.05 = 441\\).' },
    { type: 'tf', q: 'With compound interest, the interest earned is the same every year.', a: false, why: 'It grows, because each year’s interest is on a bigger amount.' },
    { type: 'mcq', q: 'Which grows faster over many years?', opts: ['Compound interest', 'Simple interest', 'They are always equal', 'It depends only on the amount'], why: 'Compound interest earns interest on the interest.' },
  ],
});
