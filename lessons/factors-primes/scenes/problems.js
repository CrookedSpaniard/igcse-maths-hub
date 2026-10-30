// Two events that repeat every x and every y minutes: they first happen together after LCM(x, y).
FD.timeline = (host) => {
  host.innerHTML = '<svg class="tl" viewBox="0 0 600 190" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (x, y, upto = Infinity, unit = 'min') => {
    const L = FD.lcm(x, y), T = Math.ceil((L * 1.15) / 10) * 10, X = (t) => 70 + (t / T) * 510;
    const dots = (k, cy, cls) => { let s = ''; const r = Math.max(2.5, Math.min(7, ((510 / T) * k) / 3)); for (let t = k; t <= T && t <= upto; t += k) s += `<circle class="${cls}" cx="${X(t).toFixed(1)}" cy="${cy}" r="${r.toFixed(1)}"/>`; return s; };
    const step = [5, 10, 20, 30, 50, 60, 100, 120, 200][[5, 10, 20, 30, 50, 60, 100, 120, 200].findIndex((s) => T / s <= 8)] || 300;
    let ticks = '';
    for (let t = 0; t <= T; t += step) ticks += `<line class="tl-ax" x1="${X(t)}" y1="146" x2="${X(t)}" y2="152"/><text class="tl-tk" x="${X(t)}" y="168">${t}</text>`;
    svg.innerHTML = `
      <text class="tl-row tl-a" x="4" y="55">every ${x}</text><text class="tl-row tl-b" x="4" y="105">every ${y}</text>
      <line class="tl-ax" x1="70" y1="146" x2="584" y2="146"/>${ticks}<text class="tl-tk" x="580" y="186">${unit}</text>
      ${dots(x, 50, 'tl-a')}${dots(y, 100, 'tl-b')}
      ${upto >= L ? `<line class="tl-hit" x1="${X(L)}" y1="28" x2="${X(L)}" y2="146"/><text class="tl-hl" x="${Math.min(X(L), 540)}" y="20">together at ${L}</text>` : ''}`;
    svg.setAttribute('aria-label', `Events every ${x} and every ${y}: first together at ${L}`);
  };
};

FD.add({
  id: 'problems',
  title: 'HCF and LCM problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['HCF problems', 'Splitting things into the <b>largest</b> equal groups or pieces, with nothing left over.'],
    ['LCM problems', 'Things that <b>repeat</b> (buses, lights, packs) and the first time they happen together.'],
  ],
  mount(el) {
    const a = FD.board(el, 'pr-s', '<div id="tl"></div>', `
      <label class="ctrl">Bus A every <input type="range" id="ra" min="2" max="20" value="6"><output id="oa">6</output></label>
      <label class="ctrl">Bus B every <input type="range" id="rb" min="2" max="20" value="8"><output id="ob">8</output></label>`, () => sync());
    a.tl = FD.timeline(a.$('#tl'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value; a.$('#oa').textContent = x; a.$('#ob').textContent = y;
      a.tl(x, y); a.big(`\\text{LCM}(${x}, ${y}) = ${FD.lcm(x, y)} \\text{ minutes}`);
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.tl(6, 8);
    return a;
  },
  steps: [
    {
      title: 'Things that repeat: LCM',
      text: '<p>Bus A leaves the station every 6 minutes. Bus B leaves every 8 minutes. They both leave at 9:00.</p><p>When do they next leave <b>together</b>?</p>',
      async on(a, ctx) {
        a.reset();
        for (let t = 0; t <= 24; t += 2) { a.tl(6, 8, t); if (!(await ctx.sleep(260))) return; }
        a.big('\\text{LCM}(6, 8) = 24');
        a.msg('They leave together again after 24 minutes, at 9:24.');
      },
    },
    {
      title: 'Writing it out',
      text: '<p>The times for each bus are <b>multiples</b>. The first shared time is the <b>lowest common multiple</b>.</p>',
      tip: 'Repeating events, “next time together”, “smallest number of packs” → LCM.',
      async on(a, ctx) {
        a.reset(); a.tl(6, 8);
        await a.lines([['6, 12, 18, \\mathbf{24}, 30, \\dots', 'bus A'], ['8, 16, \\mathbf{24}, 32, \\dots', 'bus B'], ['\\text{LCM} = 24 \\Rightarrow 9{:}24', 'add 24 minutes to 9:00']], ctx);
      },
    },
    {
      title: 'Largest equal pieces: HCF',
      text: '<p>Two ribbons are 84 cm and 126 cm long. They are cut into pieces, all the <b>same length</b>, as long as possible, with nothing left over.</p><p>How long is each piece?</p>',
      tip: '“Largest”, “greatest”, “share equally”, “nothing left over” → HCF.',
      async on(a, ctx) {
        a.reset(); a.tl(6, 8);
        await a.lines([['84 = 2^2 \\times 3 \\times 7', ''], ['126 = 2 \\times 3^2 \\times 7', ''], ['\\text{HCF} = 2 \\times 3 \\times 7 = 42', 'shared primes'], ['84 \\div 42 = 2, \\quad 126 \\div 42 = 3', '5 pieces of 42 cm']], ctx, 1400);
      },
    },
    {
      title: 'Packs: LCM again',
      text: '<p>Bread rolls come in packs of 12. Burgers come in packs of 8. Jo wants <b>exactly the same number</b> of rolls and burgers.</p><p>What is the smallest number of packs of rolls she can buy?</p>',
      async on(a, ctx) {
        a.reset(); a.tl(12, 8);
        await a.lines([['\\text{LCM}(12, 8) = 24', 'the smallest number in both'], ['24 \\div 12 = 2', '2 packs of rolls'], ['24 \\div 8 = 3', '3 packs of burgers']], ctx, 1400);
      },
    },
    {
      title: 'Try it: two buses',
      text: '<p>Choose how often each bus leaves. The timeline shows when they leave together.</p>',
      tip: 'When is the LCM just the two numbers multiplied together?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'problems',
  gens: [
    () => { let x, y; do { x = FD.rnd(4, 20); y = FD.rnd(4, 20); } while (x === y || FD.lcm(x, y) > 120 || FD.gcd(x, y) === 1 && FD.lcm(x, y) > 90); const what = FD.pick([['Two lighthouses flash together. One flashes every', 'seconds', 'the other every', 'After how many seconds do they next flash together?'], ['Two runners start together at the same point. One laps the track every', 'seconds', 'the other every', 'After how many seconds are they next at the start together?']]); return { type: 'num', q: `${what[0]} ${x} ${what[1]}, ${what[2]} ${y} ${what[1]}. ${what[3]}`, a: FD.lcm(x, y), why: `Repeating events: find the LCM. Multiples of ${x}: ${[1, 2, 3, 4].map((k) => k * x).join(', ')}, … Multiples of ${y}: ${[1, 2, 3, 4].map((k) => k * y).join(', ')}, … LCM = ${FD.lcm(x, y)}.` }; },
    () => { let x, y, g; do { g = FD.rnd(3, 15); x = g * FD.rnd(2, 7); y = g * FD.rnd(2, 7); } while (x === y || FD.gcd(x, y) !== g); return { type: 'num', q: `A teacher has ${x} pencils and ${y} rubbers. She puts them into identical packs with nothing left over. What is the <b>largest</b> number of packs she can make?`, a: g, why: `Largest equal groups: find the HCF of ${x} and ${y}. \\(${x} = ${FD.pftex(x)}\\), \\(${y} = ${FD.pftex(y)}\\), HCF = ${g}. Each pack has ${x / g} pencils and ${y / g} rubbers.` }; },
    () => { const pr = FD.pick([[6, 4], [10, 4], [12, 9], [6, 10], [8, 6], [15, 6], [12, 10]]); const L = FD.lcm(pr[0], pr[1]); return { type: 'num', q: `Cups come in packs of ${pr[0]}. Lids come in packs of ${pr[1]}. Sam wants the same number of cups and lids. What is the smallest number of packs of cups he must buy?`, a: L / pr[0], why: `LCM of ${pr[0]} and ${pr[1]} is ${L}. \\(${L} \\div ${pr[0]} = ${L / pr[0]}\\) packs of cups (and ${L / pr[1]} packs of lids).` }; },
  ],
});

FD.check({
  section: 'problems',
  items: [
    { type: 'mcq', q: 'Two alarms beep every 15 and every 20 minutes. Which do you need to find when they next beep together?', opts: ['The LCM of 15 and 20', 'The HCF of 15 and 20', '15 + 20', '20 − 15'], why: 'Repeating events meet at a common multiple: the LCM, 60 minutes.' },
    { type: 'num', q: 'Two lights flash every 12 and every 18 seconds. They flash together now. After how many seconds will they next flash together?', a: 36, why: 'LCM of 12 and 18: \\(12 = 2^2 \\times 3\\), \\(18 = 2 \\times 3^2\\), LCM \\(= 2^2 \\times 3^2 = 36\\).' },
    { type: 'num', q: 'A floor is 360 cm by 480 cm. It is covered with square tiles, as large as possible, with no cutting. What is the side length of a tile, in cm?', a: 120, why: 'The HCF of 360 and 480 is 120.' },
    { type: 'num', q: 'The HCF of two numbers is 6 and their LCM is 72. One of the numbers is 18. What is the other?', a: 24, why: 'HCF × LCM = the product of the numbers: \\(6 \\times 72 = 432\\), and \\(432 \\div 18 = 24\\).' },
  ],
});
