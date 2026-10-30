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
FD.gbp = (x) => '£' + FD.round(x, 2).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// A receipt: lines = [[label, amount]], the first `shown` lines lit, then the total.
FD.receipt = (host) => (lines, shown = lines.length, total = true) => {
  const sum = lines.reduce((s, l) => s + l[1], 0);
  host.innerHTML = `<div class="rc">${lines.map(([t, v], i) => `<div class="rc-l ${i < shown ? 'on' : ''}"><span>${t}</span><span>${FD.gbp(v)}</span></div>`).join('')}${total ? `<div class="rc-l tot ${shown >= lines.length ? 'on' : ''}"><span>Total</span><span>${FD.gbp(sum)}</span></div>` : ''}</div>`;
};

FD.add({
  id: 'money',
  title: 'Money: bills, wages and currencies',
  tab: 'Money',
  icon: 'calc',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Pence and pounds', '100p = £1. Work in one unit, and write money with 2 decimal places: £4.50, not £4.5.'],
    ['Overtime', 'Extra hours paid at a higher rate, e.g. “time and a half” = 1.5 × the normal rate.'],
    ['Standing charge', 'A fixed amount you pay every day for a service, however much you use.'],
    ['Exchange rate', 'How much one currency is worth in another, e.g. £1 = €1.16.'],
  ],
  mount(el) {
    const a = FD.board(el, 'mo-s', '<div id="rc"></div>', `
      <label class="ctrl">Pay per hour (£) <input type="range" id="rr" min="900" max="1800" step="10" value="1140"><output id="or">11.40</output></label>
      <label class="ctrl">Normal hours <input type="range" id="rh" min="10" max="40" value="35"><output id="oh">35</output></label>
      <label class="ctrl">Overtime hours (× 1.5) <input type="range" id="ro" min="0" max="10" value="4"><output id="oo">4</output></label>`, () => sync());
    a.rc = FD.receipt(a.$('#rc'));
    const sync = () => {
      const r = +a.$('#rr').value / 100, h = +a.$('#rh').value, o = +a.$('#ro').value; a.$('#or').textContent = r.toFixed(2); a.$('#oh').textContent = h; a.$('#oo').textContent = o;
      a.rc([[`${h} h × ${FD.gbp(r)}`, h * r], [`${o} h × ${FD.gbp(r * 1.5)} (overtime)`, o * r * 1.5]]);
      a.big(`${h} \\times ${r.toFixed(2)} + ${o} \\times ${FD.round(r * 1.5, 3)} = ${FD.round(h * r + o * r * 1.5, 2).toFixed(2)}`);
      a.msg(`Overtime pay is 1.5 × £${r.toFixed(2)} = ${FD.gbp(r * 1.5)} an hour.`);
    };
    ['#rr', '#rh', '#ro'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.rc([['3 notebooks × £1.45', 4.35], ['2 pens × 89p', 1.78], ['1 calculator', 8.99]], 0);
    return a;
  },
  steps: [
    {
      title: 'A shopping bill',
      text: '<p>3 notebooks at £1.45, 2 pens at 89p and a calculator at £8.99. Work out the total and the change from £20.</p>',
      tip: 'Change pence into pounds before adding: 89p = £0.89.',
      async on(a, ctx) {
        a.reset();
        const L = [['3 notebooks × £1.45', 4.35], ['2 pens × 89p', 1.78], ['1 calculator', 8.99]];
        for (let k = 0; k <= 3; k++) { a.rc(L, k); if (!(await ctx.sleep(800))) return; }
        a.big('20 - 15.12 = \\pounds 4.88 \\text{ change}');
      },
    },
    {
      title: 'An electricity bill',
      text: '<p>A bill has a <b>standing charge</b> of 45p per day for 28 days, plus 320 units at 24.5p per unit.</p>',
      async on(a, ctx) {
        a.reset(); a.rc([['Standing charge 28 × 45p', 12.6], ['320 units × 24.5p', 78.4]]);
        await a.lines([['28 \\times 0.45 = \\pounds 12.60', ''], ['320 \\times 0.245 = \\pounds 78.40', ''], ['\\text{total} = \\pounds 91.00', '']], ctx, 1300);
      },
    },
    {
      title: 'Wages and overtime',
      text: '<p>Ana is paid £11.40 an hour for 35 hours, plus overtime at <b>time and a half</b> for 4 more hours.</p>',
      async on(a, ctx) {
        a.reset(); a.rc([['35 h × £11.40', 399], ['4 h × £17.10 (overtime)', 68.4]]);
        await a.lines([['35 \\times 11.40 = \\pounds 399', ''], ['1.5 \\times 11.40 = \\pounds 17.10', 'overtime rate'], ['4 \\times 17.10 = \\pounds 68.40', ''], ['\\text{total} = \\pounds 467.40', '']], ctx, 1200);
      },
    },
    {
      title: 'Changing currencies',
      text: '<p>The exchange rate is £1 = €1.16. Pounds to euros: <b>multiply</b>. Euros to pounds: <b>divide</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.rc([['£250 in euros', 250]], 1, false);
        await a.lines([['250 \\times 1.16 = €290', '£ → €'], ['87 \\div 1.16 = \\pounds 75', '€ → £']], ctx, 1300);
      },
    },
    {
      title: 'Try it: a weekly wage',
      text: '<p>Choose the hourly rate, the normal hours and the overtime hours. The payslip adds them up.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'money',
  gens: [
    () => { const n1 = FD.rnd(2, 5), p1 = FD.rnd(45, 299), n2 = FD.rnd(1, 4), p2 = FD.rnd(20, 99), tot = n1 * p1 + n2 * p2, pay = Math.ceil(tot / 1000 + 0.001) * 10; return { type: 'num', q: `Sam buys ${n1} sandwiches at ${FD.gbp(p1 / 100)} each and ${n2} drinks at ${p2}p each. He pays with a £${pay} note. How much change does he get, in pounds?`, a: FD.dec((pay * 100 - tot) / 100), why: `\\(${n1} \\times ${(p1 / 100).toFixed(2)} = ${(n1 * p1 / 100).toFixed(2)}\\), \\(${n2} \\times ${(p2 / 100).toFixed(2)} = ${(n2 * p2 / 100).toFixed(2)}\\). Total ${FD.gbp(tot / 100)}; change \\(${pay} - ${(tot / 100).toFixed(2)} = ${((pay * 100 - tot) / 100).toFixed(2)}\\).` }; },
    () => { const r = FD.rnd(950, 1600) / 100, h = FD.rnd(20, 40), o = FD.rnd(2, 8), tot = FD.round(h * r + o * r * 1.5, 2); return { type: 'num', q: `Leo earns ${FD.gbp(r)} an hour. One week he works ${h} hours at the normal rate and ${o} hours of overtime at time and a half. How much does he earn, in pounds?`, a: tot, tol: 0.006, why: `Normal: \\(${h} \\times ${r.toFixed(2)} = ${(h * r).toFixed(2)}\\). Overtime rate \\(1.5 \\times ${r.toFixed(2)} = ${(1.5 * r).toFixed(3)}\\), so \\(${o} \\times ${(1.5 * r).toFixed(3)} = ${(o * r * 1.5).toFixed(2)}\\). Total ${FD.gbp(tot)}.` }; },
    () => { const days = FD.pick([28, 30, 31, 90, 91]), sc = FD.pick([25, 30, 40, 45, 50]), units = FD.rnd(150, 900), rate = FD.pick([20, 22.5, 24, 25, 28]), tot = FD.round((days * sc + units * rate) / 100, 2); return { type: 'num', q: `A gas bill has a standing charge of ${sc}p per day for ${days} days, and ${units} units at ${rate}p per unit. Work out the total bill, in pounds.`, a: tot, tol: 0.006, why: `\\(${days} \\times ${sc} = ${days * sc}\\)p and \\(${units} \\times ${rate} = ${FD.dec(units * rate)}\\)p. Total ${FD.dec(days * sc + units * rate)}p = ${FD.gbp(tot)}.` }; },
    () => { const r = FD.pick([1.12, 1.15, 1.16, 1.2, 1.25]), p = FD.pick([40, 60, 80, 120, 150, 200, 250, 300]), toE = FD.rnd(0, 1); return toE ? { type: 'num', q: `£1 = €${r}. Change £${p} into euros.`, a: FD.round(p * r, 2), why: `Multiply: \\(${p} \\times ${r} = ${FD.round(p * r, 2)}\\).` } : { type: 'num', q: `£1 = €${r}. Change €${FD.round(p * r, 2)} into pounds.`, a: p, why: `Divide: \\(${FD.round(p * r, 2)} \\div ${r} = ${p}\\).` }; },
  ],
});

FD.check({
  section: 'money',
  items: [
    { type: 'num', q: '4 coffees at £2.35 and 3 cakes at £1.80. What is the change from £20, in pounds?', a: 5.2, why: '\\(9.40 + 5.40 = 14.80\\); \\(20 - 14.80 = 5.20\\).' },
    { type: 'num', q: 'Mia earns £12 an hour. She works 38 hours plus 5 hours of overtime at time and a half. What does she earn, in pounds?', a: 546, why: '\\(38 \\times 12 = 456\\), \\(5 \\times 18 = 90\\).' },
    { type: 'num', q: '£1 = $1.30. Change $91 into pounds.', a: 70, why: '\\(91 \\div 1.3 = 70\\).' },
    { type: 'mcq', q: 'How should £7.5 be written?', opts: ['£7.50', '£7.5', '750p', '£07.5'], why: 'Money in pounds is written with 2 decimal places.' },
  ],
});
