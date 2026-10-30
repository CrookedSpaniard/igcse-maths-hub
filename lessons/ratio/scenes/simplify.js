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
FD.gbp = (x) => '£' + FD.round(x, 2).toLocaleString('en-GB', { minimumFractionDigits: Number.isInteger(FD.round(x, 2)) ? 0 : 2, maximumFractionDigits: 2 });

// Bar model: rows = [{ name, parts, total? }]; each part is an equal box showing `per` (if given).
FD.barModel = (host) => {
  host.innerHTML = '<svg class="bm" viewBox="0 0 600 180" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (rows, per) => {
    const maxP = Math.max(...rows.map((r) => r.parts)), w = Math.min(64, 360 / maxP), H = 30 + rows.length * 56;
    svg.setAttribute('viewBox', `0 0 600 ${H}`);
    svg.innerHTML = rows.map((r, i) => {
      const y = 18 + i * 56;
      return `<text class="bm-name" x="112" y="${y + 26}">${r.name}</text>` + Array.from({ length: r.parts }, (_, k) => `<rect class="bm-box r${i % 3}" x="${120 + k * w}" y="${y}" width="${w}" height="40" rx="6"/>${per != null ? `<text class="bm-v" x="${120 + k * w + w / 2}" y="${y + 26}">${per}</text>` : ''}`).join('') + (r.total != null ? `<text class="bm-tot" x="${130 + r.parts * w}" y="${y + 26}">= ${r.total}</text>` : '');
    }).join('');
    svg.setAttribute('aria-label', `Bar model: ${rows.map((r) => `${r.name} ${r.parts} parts`).join(', ')}`);
  };
};

FD.add({
  id: 'simplify',
  title: 'Ratio notation and simplifying',
  tab: 'Simplifying',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Ratio', 'Compares two or more amounts: 2 : 3 is read “2 to 3”. The order matters.'],
    ['Simplest form', 'Divide every part by the HCF until only whole numbers with no common factor are left.'],
    ['Ratio and fractions', 'In the ratio 2 : 3 there are 5 parts, so the first amount is \\(\\tfrac25\\) of the total.'],
    ['The form 1 : n', 'Divide both parts by the first part: 4 : 10 = 1 : 2.5.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sp-s', '<div id="bm"></div>', `
      <label class="ctrl">Red <input type="range" id="ra" min="1" max="24" value="12"><output id="oa">12</output></label>
      <label class="ctrl">Blue <input type="range" id="rb" min="1" max="24" value="18"><output id="ob">18</output></label>`, () => sync());
    a.bm = FD.barModel(a.$('#bm'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value, g = FD.gcd(x, y); a.$('#oa').textContent = x; a.$('#ob').textContent = y;
      a.bm([{ name: 'red', parts: x / g, total: x }, { name: 'blue', parts: y / g, total: y }], g);
      a.big(`${x} : ${y} ${g > 1 ? `= ${x / g} : ${y / g}` : ''} \\qquad \\text{red} = \\frac{${x / g}}{${(x + y) / g}} \\text{ of the total}`);
      a.msg(g > 1 ? `Divide both by the HCF, ${g}: each box holds ${g}.` : `${x} and ${y} have no common factor: already in its simplest form.`);
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.bm([{ name: 'red', parts: 2 }, { name: 'blue', parts: 3 }]);
    return a;
  },
  steps: [
    {
      title: 'What a ratio means',
      text: '<p>A bag has 12 red sweets and 18 blue sweets. The ratio of red to blue is <b>12 : 18</b>.</p><p>The order matters: blue to red is 18 : 12.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'red', parts: 12 }, { name: 'blue', parts: 18 }]);
        a.big('\\text{red} : \\text{blue} = 12 : 18');
      },
    },
    {
      title: 'Simplifying',
      text: '<p>Group the sweets into boxes of 6 (the HCF of 12 and 18). Red fills 2 boxes and blue fills 3: <b>12 : 18 = 2 : 3</b>.</p>',
      tip: 'Dividing by any common factor works; keep going until there is none left.',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'red', parts: 12 }, { name: 'blue', parts: 18 }]);
        if (!(await ctx.sleep(1100))) return;
        a.bm([{ name: 'red', parts: 2, total: 12 }, { name: 'blue', parts: 3, total: 18 }], 6);
        await a.lines([['12 : 18', ''], ['= 2 : 3', '÷ 6 (the HCF)']], ctx, 1200);
      },
    },
    {
      title: 'Units, decimals and fractions',
      text: '<p>Make the units the <b>same</b> first. Clear decimals or fractions by multiplying every part by the same number.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: '40 cm', parts: 2 }, { name: '1.2 m', parts: 6 }], 20);
        await a.lines([['40\\text{ cm} : 1.2\\text{ m} = 40 : 120 = 1 : 3', 'both in cm'], ['2.5 : 4 = 25 : 40 = 5 : 8', '× 10, then ÷ 5'], ['\\tfrac12 : \\tfrac34 = 2 : 3', '× 4']], ctx, 1400);
      },
    },
    {
      title: 'Ratios, fractions and 1 : n',
      text: '<p>In 2 : 3 there are \\(2 + 3 = 5\\) parts, so red is \\(\\tfrac{2}{5}\\) of the sweets and blue is \\(\\tfrac35\\).</p><p>To write a ratio in the form \\(1 : n\\), divide both parts by the first part.</p>',
      async on(a, ctx) {
        a.reset(); a.bm([{ name: 'red', parts: 2 }, { name: 'blue', parts: 3 }]);
        await a.lines([['\\text{red} = \\tfrac{2}{5}, \\quad \\text{blue} = \\tfrac{3}{5}', '5 parts in total'], ['4 : 10 = 1 : 2.5', '÷ 4'], ['\\text{scale } 2\\text{ cm} : 5\\text{ km} = 1 : 250\\,000', '5 km = 500 000 cm']], ctx, 1400);
      },
    },
    {
      title: 'Try it: simplify the sweets',
      text: '<p>Choose how many red and blue sweets. The bar model groups them into equal boxes using the HCF.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'simplify',
  gens: [
    () => { let p, q, k; do { p = FD.rnd(1, 9); q = FD.rnd(1, 9); k = FD.rnd(2, 12); } while (p === q || FD.gcd(p, q) !== 1); return { type: 'num', q: `Write \\(${p * k} : ${q * k}\\) in its simplest form.`, a: [p, q], fields: ['', ':'], why: `The HCF of ${p * k} and ${q * k} is ${k}. Divide both: \\(${p} : ${q}\\).` }; },
    () => { let p, q; do { p = FD.rnd(1, 8); q = FD.rnd(1, 8); } while (FD.gcd(p, q) !== 1 || p === q); const [n, d] = FD.simp(p, p + q); return { type: 'num', q: `Boys and girls are in the ratio ${p} : ${q}. What fraction of the class are boys?`, a: p / (p + q), form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 2/5.', why: `There are \\(${p} + ${q} = ${p + q}\\) parts, and ${p} of them are boys: \\(\\tfrac{${p}}{${p + q}}\\).` }; },
    () => { const p = FD.pick([2, 4, 5, 8]), n = FD.pick([1.5, 2.5, 3, 4.5, 6, 0.5, 1.25]), q = FD.dec(p * n); return { type: 'num', q: `Write \\(${p} : ${q}\\) in the form \\(1 : n\\). What is \\(n\\)?`, a: n, why: `Divide both by ${p}: \\(1 : ${q} \\div ${p} = 1 : ${n}\\).` }; },
    () => { const pairs = [['cm', 'm', 100], ['g', 'kg', 1000], ['minutes', 'hours', 60], ['p', '£', 100]], [u1, u2, f] = FD.pick(pairs); let x, y; do { x = FD.rnd(1, 9) * (f === 60 ? 5 : 10); y = FD.rnd(1, 5); } while (FD.gcd(x, y * f) === x && false); const g = FD.gcd(x, y * f); return { type: 'num', q: `Write ${x} ${u1} : ${y} ${u2} in its simplest form.`, a: [x / g, (y * f) / g], fields: ['', ':'], why: `Same units: ${y} ${u2} = ${y * f} ${u1}. \\(${x} : ${y * f} = ${x / g} : ${(y * f) / g}\\) (÷ ${g}).` }; },
  ],
});

FD.check({
  section: 'simplify',
  items: [
    { type: 'num', q: 'Write 24 : 36 in its simplest form.', a: [2, 3], fields: ['', ':'], why: 'HCF 12: 2 : 3.' },
    { type: 'num', q: 'Write 15 : 25 : 40 in its simplest form.', a: [3, 5, 8], fields: ['', ':', ':'], why: 'Divide all three by 5.' },
    { type: 'num', q: 'Write 80 cm : 2 m in its simplest form.', a: [2, 5], fields: ['', ':'], why: '80 : 200 = 2 : 5.' },
    { type: 'mcq', q: 'Cats and dogs are in the ratio 3 : 4. What fraction are dogs?', opts: ['\\(\\tfrac47\\)', '\\(\\tfrac43\\)', '\\(\\tfrac34\\)', '\\(\\tfrac37\\)'], why: '7 parts, 4 are dogs.' },
    { type: 'num', q: 'Write 5 : 12 in the form 1 : n. What is n?', a: 2.4, why: '\\(12 \\div 5 = 2.4\\).' },
  ],
});
