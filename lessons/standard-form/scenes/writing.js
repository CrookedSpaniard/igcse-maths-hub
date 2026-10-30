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
// Standard form parts of x: [A, n] with 1 ≤ A < 10. FD.sfp(34500) → [3.45, 4].
FD.sfp = (x) => { let n = Math.floor(Math.log10(Math.abs(x))), A = +(x / 10 ** n).toPrecision(12); if (Math.abs(A) >= 10) { A = +(A / 10).toPrecision(12); n++; } return [A, n]; };
FD.sfTex = (x) => { const [A, n] = FD.sfp(x); return `${A} \\times 10^{${n}}`; };
// An ordinary number with thin spacing for big and small numbers: 150000000 → "150\,000\,000".
FD.ordTex = (x) => { const s = (+x.toPrecision(12)).toLocaleString('en-GB', { maximumFractionDigits: 20 }); return s.replace(/,/g, '\\,'); };

// Digit boxes with a decimal point that hops to just after the first significant digit.
FD.shifter = (host) => {
  host.innerHTML = '<div class="sh"><div class="sh-row"></div><p class="sh-n"></p></div>';
  const row = host.querySelector('.sh-row'), note = host.querySelector('.sh-n');
  let p0 = 0, n = 0, pt = null, W = 0;
  const api = {
    set(str) {
      const ds = str.replace('.', ''), f = ds.search(/[1-9]/);
      p0 = str.includes('.') ? str.indexOf('.') : str.length;
      let last = ds.length - 1; while (last > f && ds[last] === '0') last--;
      n = p0 - (f + 1);
      row.innerHTML = [...ds].map((d, i) => `<span class="sh-d ${i >= f && i <= last ? 'sig' : ''}">${d}</span>`).join('') + '<i class="sh-pt start"></i><i class="sh-pt"></i>';
      const pts = row.querySelectorAll('.sh-pt');
      pts.forEach((p) => { p.style.left = `calc(${p0} * 100% / ${ds.length})`; });
      pt = pts[1]; W = ds.length; note.textContent = 'Start';
      return n;
    },
    go(k) {
      const step = Math.min(Math.abs(k), Math.abs(n)), pos = p0 - Math.sign(n) * step;
      pt.style.left = `calc(${pos} * 100% / ${W})`;
      note.textContent = step ? `The point moved ${step} place${step > 1 ? 's' : ''} ${n > 0 ? 'left' : 'right'}` : 'Start';
    },
    get n() { return n; },
  };
  return api;
};

FD.add({
  id: 'writing',
  title: 'Large and small numbers in standard form',
  tab: 'Writing',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Standard form', 'A number written as \\(A \\times 10^n\\), where \\(1 \\le A < 10\\) and \\(n\\) is an integer.'],
    ['Large numbers', 'Have a positive power: \\(34\\,500 = 3.45 \\times 10^4\\).'],
    ['Small numbers', 'Have a negative power: \\(0.000\\,52 = 5.2 \\times 10^{-4}\\).'],
  ],
  mount(el) {
    const list = ['150000000', '34500', '7020000', '602000000000', '0.00052', '0.0308', '0.000000071', '4.6'];
    const a = FD.board(el, 'wr-s', '<div id="sh"></div>', `
      <div class="bd-row"><label>Number <select id="pick">${list.map((s) => `<option>${s}</option>`).join('')}</select></label></div>
      <div class="bd-btns"><button class="btn" id="bGo">Move the point ▶</button></div>`, () => start());
    a.sh = FD.shifter(a.$('#sh'));
    let k = 0, x = 0;
    const start = () => { const s = a.$('#pick').value; x = +s; a.sh.set(s); k = 0; a.big(FD.ordTex(x)); a.msg('Press the button to move the point until there is one digit in front of it.'); };
    a.$('#pick').addEventListener('input', start);
    a.$('#bGo').addEventListener('click', () => {
      const N = a.sh.n; if (k < Math.abs(N)) k++; a.sh.go(k);
      if (k >= Math.abs(N)) { a.big(`${FD.ordTex(x)} = ${FD.sfTex(x)}`); a.msg(N > 0 ? `A large number: the point moved ${N} places left, so the power is +${N}.` : N < 0 ? `A small number: the point moved ${-N} places right, so the power is ${N}.` : 'Already between 1 and 10: the power is 0.'); }
    });
    a.sh.set('34500');
    return a;
  },
  steps: [
    {
      title: 'Large numbers',
      text: '<p>Write 34 500 in standard form. Move the decimal point until there is <b>one non-zero digit</b> in front of it: 3.45.</p><p>The point moved <b>4</b> places, so multiply by \\(10^4\\).</p>',
      async on(a, ctx) {
        a.reset(); const N = a.sh.set('34500'); a.big('34\\,500');
        for (let k = 1; k <= N; k++) { if (!(await ctx.sleep(700))) return; a.sh.go(k); }
        a.big('34\\,500 = 3.45 \\times 10^4');
      },
    },
    {
      title: 'Check the size',
      text: '<p>\\(3.45 \\times 10^4 = 3.45 \\times 10\\,000 = 34\\,500\\). ✓</p><p>A is <b>between 1 and 10</b>: 34.5 × 10³ is the same size, but it is <b>not</b> standard form.</p>',
      async on(a, ctx) {
        a.reset(); a.sh.set('150000000');
        await a.lines([['150\\,000\\,000 = 1.5 \\times 10^8', '8 places'], ['602\\,000\\,000\\,000 = 6.02 \\times 10^{11}', '11 places'], ['34.5 \\times 10^3', '✗ 34.5 is not between 1 and 10']], ctx, 1300);
      },
    },
    {
      title: 'Small numbers',
      text: '<p>Write 0.000 52 in standard form. Move the point to the <b>right</b> until it is after the 5: 5.2.</p><p>It moved 4 places right, so the power is <b>negative</b>: \\(10^{-4}\\).</p>',
      tip: 'Small numbers (less than 1) always have a negative power.',
      async on(a, ctx) {
        a.reset(); const N = a.sh.set('0.00052'); a.big('0.000\\,52');
        for (let k = 1; k <= -N; k++) { if (!(await ctx.sleep(700))) return; a.sh.go(k); }
        a.big('0.000\\,52 = 5.2 \\times 10^{-4}');
      },
    },
    {
      title: 'More examples',
      text: '<p>Count the jumps carefully; zeros in the middle stay in A.</p>',
      async on(a, ctx) {
        a.reset(); a.sh.set('0.0308');
        await a.lines([['0.0308 = 3.08 \\times 10^{-2}', '2 places right'], ['7\\,020\\,000 = 7.02 \\times 10^6', '6 places left'], ['4.6 = 4.6 \\times 10^0', 'no jumps']], ctx, 1300);
      },
    },
    {
      title: 'Try it: move the point',
      text: '<p>Choose a number and press the button to move the decimal point one place at a time. Count the jumps.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'writing',
  gens: [
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rnd(3, 9), x = FD.dec(A * 10 ** n); return { type: 'num', q: `Write ${FD.num(x)} in standard form, \\(A \\times 10^n\\).`, a: [A, n], fields: ['A =', 'n ='], why: `Move the point ${n} places left to get ${A}: \\(${FD.ordTex(x)} = ${A} \\times 10^{${n}}\\).` }; },
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rnd(2, 7), x = +(A * 10 ** -n).toPrecision(6); return { type: 'num', q: `Write ${FD.ordTex(x).replace(/\\,/g, ' ')} in standard form, \\(A \\times 10^n\\).`, a: [A, -n], fields: ['A =', 'n ='], why: `Move the point ${n} places right to get ${A}: the power is \\(-${n}\\). So \\(${A} \\times 10^{-${n}}\\).` }; },
    () => { const A = FD.dec(FD.rnd(11, 99) / 10), n = FD.rnd(2, 6), big = FD.rnd(0, 1); const right = `\\(${A} \\times 10^{${big ? n : -n}}\\)`; return { type: 'mcq', q: `Which is ${big ? FD.num(A * 10 ** n) : FD.ordTex(+(A * 10 ** -n).toPrecision(6)).replace(/\\,/g, ' ')} in standard form?`, opts: [right, `\\(${A} \\times 10^{${big ? -n : n}}\\)`, `\\(${FD.dec(A * 10)} \\times 10^{${big ? n - 1 : -n - 1}}\\)`, `\\(${A} \\times 10^{${big ? n + 1 : -n + 1}}\\)`], why: `The point moves ${n} places ${big ? 'left (a large number: positive power)' : 'right (a small number: negative power)'}, and A must be between 1 and 10.` }; },
  ],
});

FD.check({
  section: 'writing',
  items: [
    { type: 'num', q: 'Write 68 000 000 in standard form.', a: [6.8, 7], fields: ['A =', 'n ='], why: '7 places: \\(6.8 \\times 10^7\\).' },
    { type: 'num', q: 'Write 0.0009 in standard form.', a: [9, -4], fields: ['A =', 'n ='], why: '4 places right: \\(9 \\times 10^{-4}\\).' },
    { type: 'tf', q: '\\(12 \\times 10^5\\) is in standard form.', a: false, why: '12 is not between 1 and 10. It should be \\(1.2 \\times 10^6\\).' },
    { type: 'mcq', q: 'Which number is in standard form?', opts: ['\\(4.07 \\times 10^{-3}\\)', '\\(0.47 \\times 10^{2}\\)', '\\(47 \\times 10^{-3}\\)', '\\(4.7 \\times 100\\)'], why: '\\(1 \\le 4.07 < 10\\) and the power of 10 is written as a power.' },
  ],
});
