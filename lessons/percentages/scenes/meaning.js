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
// Money: 12.5 → "£12.50", 40 → "£40".
FD.gbp = (x) => '£' + (Number.isInteger(FD.dec(x)) ? FD.num(FD.dec(x)) : FD.dec(x).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

// Percentage bar: 0% to max% (100 or 150). p is shaded; beyond 100% in orange. marks = [{ p, top }].
FD.pbar = (host) => {
  host.innerHTML = '<svg class="pb" viewBox="0 0 600 150" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (p, { max = 100, marks = [] } = {}) => {
    const X = (v) => 30 + (v / max) * 540, step = max > 100 ? 20 : 10;
    let s = '';
    for (let v = 0; v < max; v += 10) s += `<rect class="pb-cell" x="${X(v)}" y="50" width="${X(10) - X(0)}" height="48"/>`;
    s += `<rect class="pb-on" x="${X(0)}" y="50" width="${X(Math.min(p, 100)) - X(0)}" height="48"/>`;
    if (p > 100) s += `<rect class="pb-over" x="${X(100)}" y="50" width="${X(Math.min(p, max)) - X(100)}" height="48"/>`;
    s += `<rect class="pb-base" x="${X(0)}" y="50" width="${X(100) - X(0)}" height="48"/>`;
    for (let v = 0; v <= max; v += step) s += `<text class="pb-t" x="${X(v)}" y="120">${v}%</text>`;
    marks.forEach((m) => { s += `<line class="pb-mk" x1="${X(m.p)}" y1="34" x2="${X(m.p)}" y2="104"/><text class="pb-v" x="${Math.min(Math.max(X(m.p), 50), 550)}" y="26">${m.top}</text>`; });
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `A bar with ${p}% shaded`);
  };
};

FD.add({
  id: 'meaning',
  title: 'Percentages, fractions and decimals',
  tab: 'Meaning',
  icon: 'frac',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Per cent (%)', 'Out of 100. 37% means 37 out of every 100.'],
    ['Percentage → decimal', 'Divide by 100: \\(37\\% = 0.37\\).'],
    ['Percentage → fraction', 'Write it over 100 and simplify: \\(35\\% = \\tfrac{35}{100} = \\tfrac{7}{20}\\).'],
    ['Decimal or fraction → percentage', 'Multiply by 100: \\(0.08 = 8\\%\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'mn-s', '<div id="pb"></div>', `
      <label class="ctrl">Percentage <input type="range" id="rp" min="0" max="100" value="35"><output id="op">35%</output></label>`, () => sync());
    a.pb = FD.pbar(a.$('#pb'));
    const sync = () => {
      const p = +a.$('#rp').value; a.$('#op').textContent = p + '%'; a.pb(p);
      a.big(`${p}\\% = \\frac{${p}}{100}${FD.gcd(p, 100) > 1 && p ? ` = ${FD.ftex(p, 100)}` : ''} = ${FD.dec(p / 100)}`);
      a.msg(`${p} out of every 100.`);
    };
    a.$('#rp').addEventListener('input', sync);
    a.pb(0);
    return a;
  },
  steps: [
    {
      title: 'Out of 100',
      text: '<p><b>Per cent</b> means “out of 100”. The bar is split into 100 equal parts; 37% means 37 of them.</p><p>100% is the <b>whole</b> amount.</p>',
      async on(a, ctx) {
        a.reset();
        for (const p of [10, 25, 37]) { a.pb(p); a.big(`${p}\\% = \\frac{${p}}{100}`); if (!(await ctx.sleep(1000))) return; }
      },
    },
    {
      title: 'Percentage → fraction and decimal',
      text: '<p>To get a <b>fraction</b>, write the percentage over 100 and simplify. To get a <b>decimal</b>, divide by 100.</p>',
      async on(a, ctx) {
        a.reset(); a.pb(35);
        await a.lines([['35\\% = \\frac{35}{100} = \\frac{7}{20}', 'simplify by 5'], ['35\\% = 35 \\div 100 = 0.35', ''], ['12.5\\% = 0.125 = \\frac{1}{8}', ''], ['4\\% = 0.04', 'not 0.4!']], ctx, 1300);
      },
    },
    {
      title: 'Fraction and decimal → percentage',
      text: '<p>Multiply by 100. For a fraction, change it into a decimal first (or make the denominator 100).</p>',
      tip: 'Learn: \\(\\tfrac12 = 50\\%\\), \\(\\tfrac14 = 25\\%\\), \\(\\tfrac34 = 75\\%\\), \\(\\tfrac15 = 20\\%\\), \\(\\tfrac{1}{10} = 10\\%\\), \\(\\tfrac13 \\approx 33.3\\%\\).',
      async on(a, ctx) {
        a.reset(); a.pb(60);
        await a.lines([['0.08 \\times 100 = 8\\%', ''], ['\\frac{3}{5} = \\frac{60}{100} = 60\\%', ''], ['\\frac{3}{8} = 0.375 = 37.5\\%', ''], ['1.4 = 140\\%', 'more than the whole']], ctx, 1300);
      },
    },
    {
      title: 'Comparing',
      text: '<p>Which is biggest: 0.3, 27% or \\(\\tfrac{2}{7}\\)? Change them all to percentages (or all to decimals).</p>',
      async on(a, ctx) {
        a.reset();
        await a.lines([['0.3 = 30\\%', ''], ['27\\%', ''], ['\\frac{2}{7} = 0.2857\\dots \\approx 28.6\\%', ''], ['\\text{biggest: } 0.3', '']], ctx, 1200);
        a.pb(30);
      },
    },
    {
      title: 'Try it: per cent bar',
      text: '<p>Move the slider. The percentage is written as a fraction (simplified) and as a decimal.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'meaning',
  gens: [
    () => { const p = FD.pick([5, 15, 24, 35, 45, 55, 64, 72, 85, 2, 8, 40, 75]); const [n, d] = FD.simp(p, 100); return { type: 'num', q: `Write ${p}% as a fraction in its simplest form.`, a: p / 100, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 7/20.', why: `\\(${p}\\% = \\dfrac{${p}}{100} = \\dfrac{${n}}{${d}}\\).` }; },
    () => { const p = FD.pick([3, 7, 12, 45, 60, 99, 4.5, 17.5, 120, 0.5]); return { type: 'num', q: `Write ${p}% as a decimal.`, a: FD.dec(p / 100), why: `Divide by 100: \\(${p} \\div 100 = ${FD.dec(p / 100)}\\).` }; },
    () => { const [n, d] = FD.pick([[1, 4], [3, 4], [2, 5], [7, 10], [9, 20], [3, 25], [1, 8], [5, 8], [11, 50], [7, 40]]); return { type: 'num', q: `Write \\(\\dfrac{${n}}{${d}}\\) as a percentage.`, a: FD.dec((n / d) * 100), unit: '%', why: `\\(\\dfrac{${n}}{${d}} = ${FD.dec(n / d)}\\) and \\(${FD.dec(n / d)} \\times 100 = ${FD.dec((n / d) * 100)}\\%\\).` }; },
  ],
});

FD.check({
  section: 'meaning',
  items: [
    { type: 'num', q: 'Write 0.6 as a percentage.', a: 60, unit: '%', why: '\\(0.6 \\times 100 = 60\\%\\).' },
    { type: 'num', q: 'Write 6% as a decimal.', a: 0.06, why: '\\(6 \\div 100 = 0.06\\).' },
    { type: 'num', q: 'Write 85% as a fraction in its simplest form.', a: 0.85, form: 'simplest', show: '\\(\\tfrac{17}{20}\\)', hint: 'Type it like 7/20.', why: '\\(\\tfrac{85}{100} = \\tfrac{17}{20}\\).' },
    { type: 'mcq', q: 'Which is the largest?', opts: ['\\(\\tfrac{9}{25}\\)', '35%', '0.349', '\\(\\tfrac{1}{3}\\)'], why: '\\(\\tfrac{9}{25} = 36\\%\\), \\(\\tfrac13 \\approx 33.3\\%\\).' },
    { type: 'tf', q: '1.25 is the same as 125%.', a: true, why: '\\(1.25 \\times 100 = 125\\).' },
  ],
});
