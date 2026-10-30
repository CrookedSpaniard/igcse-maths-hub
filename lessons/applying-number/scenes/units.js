// Unit ladders: units from biggest to smallest and the factor between neighbours.
FD.LADDERS = {
  length: [['km', 'm', 'cm', 'mm'], [1000, 100, 10]],
  mass: [['t', 'kg', 'g', 'mg'], [1000, 1000, 1000]],
  capacity: [['litre', 'cl', 'ml'], [100, 10]],
  area: [['m²', 'cm²', 'mm²'], [10000, 100]],
  volume: [['m³', 'cm³', 'mm³'], [1000000, 1000]],
};
// Draws the ladder; lit = [from, to] indexes are highlighted.
FD.uladder = (host) => {
  host.innerHTML = '<svg class="ul" viewBox="0 0 600 120" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (key, lit = []) => {
    const [u, f] = FD.LADDERS[key], n = u.length, gap = 560 / n, w = Math.min(110, gap - 40);
    svg.innerHTML = u.map((t, i) => { const cx = 20 + gap * (i + 0.5); return `<rect class="ul-box ${lit.includes(i) ? 'on' : ''}" x="${cx - w / 2}" y="40" width="${w}" height="46" rx="10"/><text class="ul-t" x="${cx}" y="70">${t}</text>`; }).join('')
      + f.map((k, i) => { const x = 20 + gap * (i + 1); return `<text class="ul-a" x="${x}" y="28">× ${k.toLocaleString('en-GB')} →</text><text class="ul-a" x="${x}" y="108">← ÷ ${k.toLocaleString('en-GB')}</text>`; }).join('');
    svg.setAttribute('aria-label', `Units of ${key}: ${u.join(', ')}`);
  };
};
// Converts v from unit index i to unit index j on a ladder.
FD.uconv = (key, v, i, j) => { const f = FD.LADDERS[key][1]; let x = v; if (j > i) for (let k = i; k < j; k++) x *= f[k]; else for (let k = i; k > j; k--) x /= f[k - 1]; return +x.toPrecision(10); };

FD.add({
  id: 'units',
  title: 'Metric units',
  tab: 'Units',
  icon: 'shapes',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Length', '1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.'],
    ['Mass', '1 tonne = 1000 kg, 1 kg = 1000 g.'],
    ['Capacity', '1 litre = 100 cl = 1000 ml, and 1 ml = 1 cm³.'],
    ['Area and volume', '1 m² = 100 × 100 = 10 000 cm². 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.'],
  ],
  mount(el) {
    const keys = Object.keys(FD.LADDERS);
    const a = FD.board(el, 'un-s', '<div id="ul"></div>', `
      <div class="bd-row"><label>Measure <select id="key">${keys.map((k) => `<option>${k}</option>`).join('')}</select></label>
      <label>From <select id="from"></select></label><label>To <select id="to"></select></label></div>
      <label class="ctrl">Amount <input type="range" id="rv" min="1" max="500" value="35"><output id="ov">35</output></label>`, () => fill());
    a.ul = FD.uladder(a.$('#ul'));
    const fill = () => { const u = FD.LADDERS[a.$('#key').value][0]; a.$('#from').innerHTML = u.map((t, i) => `<option value="${i}">${t}</option>`).join(''); a.$('#to').innerHTML = a.$('#from').innerHTML; a.$('#to').value = 1; sync(); };
    const sync = () => {
      const key = a.$('#key').value, u = FD.LADDERS[key][0], i = +a.$('#from').value, j = +a.$('#to').value, v = +a.$('#rv').value; a.$('#ov').textContent = v;
      a.ul(key, [i, j]);
      const r = FD.uconv(key, v, i, j);
      a.big(`${v} \\text{ ${u[i]}} = ${r.toLocaleString('en-GB', { maximumFractionDigits: 10 }).replace(/,/g, '\\,')} \\text{ ${u[j]}}`);
      a.msg(j > i ? 'Big unit → small unit: there are more of them, so multiply.' : j < i ? 'Small unit → big unit: there are fewer of them, so divide.' : 'Same unit.');
    };
    a.$('#key').addEventListener('input', fill);
    ['#from', '#to', '#rv'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.ul('length');
    return a;
  },
  steps: [
    {
      title: 'Big to small: multiply',
      text: '<p>Change 3.5 km into metres. A metre is smaller than a kilometre, so there will be <b>more</b> of them: multiply by 1000.</p>',
      tip: 'Ask: should the number get bigger or smaller?',
      async on(a, ctx) {
        a.reset(); a.ul('length', [0, 1]);
        await a.lines([['3.5 \\text{ km} = 3.5 \\times 1000 = 3500 \\text{ m}', ''], ['3500 \\text{ m} = 3500 \\times 100 = 350\\,000 \\text{ cm}', '']], ctx, 1300);
      },
    },
    {
      title: 'Small to big: divide',
      text: '<p>Change 2750 g into kilograms, and 450 ml into litres. The units get bigger, so <b>divide</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.ul('mass', [1, 2]);
        await a.lines([['2750 \\text{ g} = 2750 \\div 1000 = 2.75 \\text{ kg}', ''], ['450 \\text{ ml} = 450 \\div 1000 = 0.45 \\text{ litres}', '']], ctx, 1300);
        a.ul('capacity', [0, 2]);
      },
    },
    {
      title: 'Area units',
      text: '<p>A square 1 m by 1 m is also 100 cm by 100 cm, so <b>1 m² = 10 000 cm²</b>, not 100 cm².</p>',
      tip: 'Square the length factor for area, cube it for volume.',
      async on(a, ctx) {
        a.reset(); a.ul('area', [0, 1]);
        await a.lines([['1 \\text{ m}^2 = 100 \\times 100 = 10\\,000 \\text{ cm}^2', ''], ['3.2 \\text{ m}^2 = 32\\,000 \\text{ cm}^2', ''], ['1 \\text{ cm}^2 = 10 \\times 10 = 100 \\text{ mm}^2', '']], ctx, 1300);
      },
    },
    {
      title: 'Volume and capacity',
      text: '<p>1 m³ = 100 × 100 × 100 = 1 000 000 cm³. Capacity links to volume: <b>1 cm³ = 1 ml</b>, so 1000 cm³ = 1 litre.</p>',
      async on(a, ctx) {
        a.reset(); a.ul('volume', [0, 1]);
        await a.lines([['1 \\text{ m}^3 = 1\\,000\\,000 \\text{ cm}^3', ''], ['\\text{a tank of } 24\\,000 \\text{ cm}^3 = 24\\,000 \\text{ ml} = 24 \\text{ litres}', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: convert',
      text: '<p>Choose a measure, the units to convert from and to, and an amount.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'units',
  gens: [
    () => { const key = FD.pick(['length', 'mass', 'capacity']), u = FD.LADDERS[key][0]; let i, j; do { i = FD.rnd(0, u.length - 1); j = FD.rnd(0, u.length - 1); } while (Math.abs(i - j) !== 1); const v = FD.pick([2.5, 0.75, 3, 45, 120, 7.2, 0.6, 350, 18]), r = FD.uconv(key, v, i, j); return { type: 'num', q: `Change ${v} ${u[i]} into ${u[j]}.`, a: r, why: `${j > i ? `Big to small: multiply by ${FD.LADDERS[key][1][i]}` : `Small to big: divide by ${FD.LADDERS[key][1][j]}`}. ${v} ${u[i]} = ${r.toLocaleString('en-GB', { maximumFractionDigits: 10 })} ${u[j]}.` }; },
    () => { const v = FD.pick([2, 3.5, 0.5, 1.2, 4, 6.25]), toCm = FD.rnd(0, 1); return toCm ? { type: 'num', q: `Change ${v} m² into cm².`, a: FD.dec(v * 10000), why: `1 m² = 100 × 100 = 10 000 cm², so \\(${v} \\times 10\\,000 = ${FD.dec(v * 10000)}\\).` } : { type: 'num', q: `Change ${FD.dec(v * 10000)} cm² into m².`, a: v, why: `Divide by 10 000: ${v} m².` }; },
    () => { const v = FD.pick([500, 1500, 2400, 750, 12000, 3000]); return { type: 'num', q: `A box holds ${v.toLocaleString('en-GB')} cm³ of water. How many litres is that?`, a: v / 1000, why: `1 cm³ = 1 ml and 1000 ml = 1 litre: \\(${v} \\div 1000 = ${v / 1000}\\).` }; },
  ],
});

FD.check({
  section: 'units',
  items: [
    { type: 'num', q: 'Change 4.2 kg into grams.', a: 4200, why: '× 1000.' },
    { type: 'num', q: 'Change 85 mm into cm.', a: 8.5, why: '÷ 10.' },
    { type: 'num', q: 'Change 2.5 m² into cm².', a: 25000, why: '× 10 000.' },
    { type: 'mcq', q: 'How many cm³ are in 1 m³?', opts: ['1 000 000', '100', '1000', '10 000'], why: '\\(100^3\\).' },
    { type: 'num', q: 'A jug holds 1.75 litres. How many ml is that?', a: 1750, why: '× 1000.' },
  ],
});
