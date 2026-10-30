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
// A decimal without floating-point noise: FD.dec(3.47 * 100) → 347.
FD.dec = (x) => +x.toFixed(8);

// Place value chart Th H T U . t h th. set('3.47') places the digits; shift(k) slides them k places left (× 10^k).
FD.pvChart = (host) => {
  const cols = ['Th', 'H', 'T', 'U', 't', 'h', 'th'];
  host.innerHTML = `<div class="pv"><div class="pv-head">${cols.map((c, i) => `<span class="${i > 3 ? 'dec' : ''}">${c}</span>`).join('')}</div><div class="pv-row"><i class="pv-pt"></i></div></div>`;
  const row = host.querySelector('.pv-row');
  let ds = [];
  const place = (k) => {
    row.querySelectorAll('.ph').forEach((e) => e.remove());
    const used = new Set();
    ds.forEach((d) => { const c = d.c - k; d.el.style.left = `calc(${c} * 100% / 7)`; d.el.style.opacity = c < 0 || c > 6 ? 0 : 1; used.add(c); });
    const cs = ds.map((d) => d.c - k), lo = Math.min(...cs, 3), hi = Math.max(...cs, 3);
    for (let c = Math.max(lo, 0); c <= Math.min(hi, 6); c++) if (!used.has(c)) row.insertAdjacentHTML('beforeend', `<span class="pv-d ph" style="left: calc(${c} * 100% / 7)">0</span>`);
  };
  return {
    set(str) {
      let [ip, dp = ''] = str.split('.');
      if (/^0+$/.test(ip)) ip = '';
      row.querySelectorAll('.pv-d').forEach((e) => e.remove());
      ds = [...ip].map((d, i) => ({ d, c: 3 - (ip.length - 1 - i) })).concat([...dp].map((d, j) => ({ d, c: 4 + j })));
      ds.forEach((o) => { o.el = FD.h(`<span class="pv-d" style="left: calc(${o.c} * 100% / 7)">${o.d}</span>`); row.appendChild(o.el); });
      place(0);
    },
    shift: place,
  };
};

FD.add({
  id: 'placevalue',
  title: 'Decimal place value and powers of 10',
  tab: 'Place value',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Decimal point', 'Separates the whole number part from the parts smaller than 1.'],
    ['Tenths, hundredths, thousandths', 'The first three columns after the point: \\(\\tfrac{1}{10}\\), \\(\\tfrac{1}{100}\\), \\(\\tfrac{1}{1000}\\).'],
    ['Decimal places (d.p.)', 'The number of digits after the point. 3.472 has 3 decimal places.'],
    ['Place holder', 'A zero that keeps the other digits in the right columns, as in 3400 or 0.052.'],
  ],
  mount(el) {
    const starts = ['3.47', '52', '0.6', '8.105', '0.04'];
    const a = FD.board(el, 'pv-s', '<div id="pv"></div>', `
      <div class="bd-row"><label>Number <select id="num">${starts.map((s) => `<option>${s}</option>`).join('')}</select></label></div>
      <div class="bd-btns">${[1, 2, 3].map((k) => `<button class="btn small-btn" data-k="${k}">× ${10 ** k}</button>`).join('')}${[1, 2, 3].map((k) => `<button class="btn small-btn" data-k="${-k}">÷ ${10 ** k}</button>`).join('')}</div>`, () => start());
    a.pv = FD.pvChart(a.$('#pv'));
    let k = 0, s = '3.47';
    const start = () => { s = a.$('#num').value; k = 0; a.pv.set(s); a.big(s); a.msg(''); };
    a.$('#num').addEventListener('input', start);
    a.$('#try').querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
      const kk = +b.dataset.k, nk = k + kk, v = FD.dec(+s * 10 ** nk);
      const dp = (s.split('.')[1] || '').length, ip = s.split('.')[0].replace(/^0+/, '').length;
      if (dp - nk > 3 || ip + nk > 4) { a.msg('That would go off the chart. Try another button.', 'bad'); return; }
      const before = FD.dec(+s * 10 ** k);
      k = nk; a.pv.shift(k);
      a.big(`${before} ${kk > 0 ? '\\times' : '\\div'} ${10 ** Math.abs(kk)} = ${v}`);
      a.msg(`The digits move ${Math.abs(kk)} place${Math.abs(kk) > 1 ? 's' : ''} to the <b>${kk > 0 ? 'left' : 'right'}</b>. The point stays still.`);
    }));
    a.pv.set('3.472');
    return a;
  },
  steps: [
    {
      title: 'Columns after the point',
      text: '<p>After the decimal point come <b>tenths</b>, <b>hundredths</b> and <b>thousandths</b>.</p><p>In 3.472 the 4 is worth 4 tenths, the 7 is worth 7 hundredths and the 2 is worth 2 thousandths.</p>',
      async on(a, ctx) {
        a.reset(); a.pv.set('3.472'); a.big('3.472');
        await a.lines([['3 = 3 \\text{ units}', ''], ['0.4 = \\frac{4}{10}', 'tenths'], ['0.07 = \\frac{7}{100}', 'hundredths'], ['0.002 = \\frac{2}{1000}', 'thousandths']], ctx, 1100);
      },
    },
    {
      title: 'Ordering decimals',
      text: '<p>Order 0.5, 0.45, 0.405 and 0.54, smallest first.</p><p>Give them all the <b>same number of decimal places</b> by adding zeros at the end. Then compare.</p>',
      tip: 'A longer decimal is not always bigger: 0.405 < 0.5.',
      async on(a, ctx) {
        a.reset(); a.pv.set('0.405');
        await a.lines([['0.5 = 0.500, \\; 0.45 = 0.450, \\; 0.405, \\; 0.54 = 0.540', 'same number of d.p.'], ['405 < 450 < 500 < 540', 'compare as thousandths'], ['0.405, \\; 0.45, \\; 0.5, \\; 0.54', 'smallest first']], ctx, 1500);
      },
    },
    {
      title: 'Multiplying by 10, 100, 1000',
      text: '<p>Multiplying by 10 makes every digit worth 10 times more: each digit moves <b>one place left</b>. × 100 moves two places, × 1000 moves three.</p><p>\\(3.47 \\times 100 = 347\\)</p>',
      tip: 'The decimal point never moves: the digits do.',
      async on(a, ctx) {
        a.reset(); a.pv.set('3.47'); a.big('3.47');
        if (!(await ctx.sleep(1000))) return;
        a.pv.shift(2); a.big('3.47 \\times 100 = 347');
      },
    },
    {
      title: 'Dividing by 10, 100, 1000',
      text: '<p>Dividing moves the digits to the <b>right</b>. Fill empty columns before the point with <b>place holder</b> zeros.</p><p>\\(52 \\div 1000 = 0.052\\)</p>',
      async on(a, ctx) {
        a.reset(); a.pv.set('52'); a.big('52');
        if (!(await ctx.sleep(1000))) return;
        a.pv.shift(-3); a.big('52 \\div 1000 = 0.052');
        if (!(await ctx.sleep(1600))) return;
        a.msg('The orange zeros are place holders.');
      },
    },
    {
      title: 'Try it: slide the digits',
      text: '<p>Choose a number, then multiply or divide by 10, 100 or 1000. Watch the digits slide past the decimal point.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'placevalue',
  gens: [
    () => { const x = FD.dec(FD.rnd(1, 9999) / FD.pick([10, 100, 1000])), k = FD.pick([1, 2, 3]), mul = FD.rnd(0, 1), r = FD.dec(mul ? x * 10 ** k : x / 10 ** k); return { type: 'num', q: `Work out \\(${x} ${mul ? '\\times' : '\\div'} ${10 ** k}\\)`, a: r, why: `${mul ? 'Multiplying' : 'Dividing'} by ${10 ** k} moves every digit ${k} place${k > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}: ${FD.num(r)}.` }; },
    () => { const base = FD.rnd(1, 9) / 10, v = [...new Set([base, FD.dec(base + FD.rnd(1, 9) / 100), FD.dec(base - 0.1 + FD.rnd(1, 9) / 100 + FD.rnd(1, 9) / 1000), FD.dec(base + FD.rnd(1, 9) / 1000)])].filter((x) => x > 0); if (v.length < 3) v.push(FD.dec(base + 0.05)); const big = Math.max(...v); return { type: 'mcq', q: 'Which number is the largest?', opts: [String(big), ...v.filter((x) => x !== big).map(String)], why: `Write them with 3 decimal places: ${v.map((x) => x.toFixed(3)).join(', ')}. The largest is ${big}.` }; },
    () => { let s; do { s = (FD.rnd(1, 99) + FD.rnd(101, 999) / 1000).toFixed(3); } while (new Set(s.replace('.', '')).size < s.length - 1 || s.endsWith('0')); const pos = FD.rnd(1, 3), d = +s.split('.')[1][pos - 1]; if (d === 0) return { type: 'num', q: `How many decimal places does ${s} have?`, a: 3, why: 'Three digits after the point: 3 decimal places.' }; const val = FD.dec(d / 10 ** pos); return { type: 'num', q: `What is the value of the digit ${d} in ${s}? Give your answer as a decimal.`, a: val, why: `The ${d} is in the ${['tenths', 'hundredths', 'thousandths'][pos - 1]} column, so it is worth ${val}.` }; },
  ],
});

FD.check({
  section: 'placevalue',
  items: [
    { type: 'num', q: 'Work out \\(0.38 \\times 100\\)', a: 38, why: 'The digits move 2 places left: 38.' },
    { type: 'num', q: 'Work out \\(7.2 \\div 1000\\)', a: 0.0072, why: 'The digits move 3 places right: 0.0072.' },
    { type: 'mcq', q: 'Which is the smallest?', opts: ['0.09', '0.1', '0.099', '0.19'], why: 'As thousandths: 090, 100, 099, 190. The smallest is 0.09.' },
    { type: 'mcq', q: 'In 15.836, what is the value of the 3?', opts: ['3 hundredths', '3 tenths', '3 thousandths', '3 tens'], why: 'The second column after the point is hundredths.' },
    { type: 'tf', q: '0.7 is bigger than 0.65.', a: true, why: '0.70 > 0.65.' },
  ],
});
