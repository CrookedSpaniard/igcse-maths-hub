// Round to sf significant figures, as text that keeps needed zeros: FD.sfText(0.0004, 2) → "0.00040".
FD.sfText = (x, sf) => { const r = FD.sigfig(x, sf), mag = Math.floor(Math.log10(Math.abs(r))), dp = Math.max(0, sf - 1 - mag); return r.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp }); };

FD.add({
  id: 'sigfig',
  title: 'Significant figures',
  tab: 'Sig. figs',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Significant figure', 'A digit that tells you about the size of a number. The first significant figure is the first digit that is not 0.'],
    ['Leading zeros', 'Zeros at the start, as in 0.0037, are not significant: they only hold the place.'],
    ['Place holders', 'When rounding big numbers, fill with zeros so the size stays right: 48 270 ≈ 48 000 (2 s.f.).'],
  ],
  mount(el) {
    const a = FD.board(el, 'sf-s', '<div id="rl"></div>', `
      <div class="bd-row"><label>Number <select id="nx">${['48 271', '3.0596', '0.004 718', '907 450', '0.6085'].map((t) => `<option>${t}</option>`).join('')}</select></label></div>
      <label class="ctrl">Significant figures <input type="range" id="rs" min="1" max="4" value="2"><output id="os">2</output></label>`, () => sync());
    a.rl = FD.rline(a.$('#rl'));
    const sync = () => {
      const x = +a.$('#nx').value.replace(/\s/g, ''), sf = +a.$('#rs').value; a.$('#os').textContent = sf;
      const mag = Math.floor(Math.log10(x)), u = 10 ** (mag - sf + 1), lo = FD.dec(Math.floor(x / u) * u), r = FD.sigfig(x, sf);
      a.rl(lo, FD.dec(lo + u), { x, mid: true, to: r });
      a.big(`${FD.nt(x)} \\approx ${FD.sfText(x, sf)} \\; (${sf} \\text{ s.f.})`);
      a.msg(`The first significant figure is the ${String(x).replace(/^0\.0*/, '')[0]}. Count ${sf} digit${sf > 1 ? 's' : ''} from there and look at the next one.`);
    };
    ['#nx', '#rs'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.rl(48000, 49000, { mid: true });
    return a;
  },
  steps: [
    {
      title: 'Start at the first non-zero digit',
      text: '<p>In 48 271 the first significant figure is the 4 (worth 40 000). In 0.004 718 it is the 4 (worth 4 thousandths): the zeros before it do not count.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(48000, 49000, { mid: true, x: 48271 });
        await a.lines([['\\underline{4}8\\,271', '1st s.f. is the 4'], ['0.00\\underline{4}718', 'leading zeros do not count']], ctx, 1400);
      },
    },
    {
      title: 'Rounding big numbers',
      text: '<p>Round 48 271 to 2 significant figures. Keep 48, look at the next digit (2): round down. Fill the rest with <b>zeros</b> so the number keeps its size.</p>',
      tip: '48 271 to 2 s.f. is 48 000, not 48!',
      async on(a, ctx) {
        a.reset(); a.rl(48000, 49000, { mid: true, x: 48271, to: 48000 });
        await a.lines([['48\\,271 \\approx 48\\,000', '2 s.f.'], ['48\\,271 \\approx 50\\,000', '1 s.f.'], ['48\\,271 \\approx 48\\,300', '3 s.f.']], ctx, 1300);
      },
    },
    {
      title: 'Rounding small numbers',
      text: '<p>Round 0.004 718 to 2 significant figures. Skip the leading zeros, keep 47, and the next digit is 1: round down.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(0.0047, 0.0048, { mid: true, x: 0.004718, to: 0.0047 });
        await a.lines([['0.004\\,718 \\approx 0.0047', '2 s.f.'], ['0.004\\,718 \\approx 0.005', '1 s.f.']], ctx, 1300);
      },
    },
    {
      title: 'Zeros in the middle',
      text: '<p>A zero <b>between</b> other digits is significant. 3.0596 to 3 s.f. is 3.06 (the digits 3, 0, 5, then round up).</p><p>Sometimes a zero at the end is needed: 0.6085 to 2 s.f. is 0.61, and 2.998 to 3 s.f. is 3.00.</p>',
      async on(a, ctx) {
        a.reset(); a.rl(3.05, 3.06, { mid: true, x: 3.0596, to: 3.06 });
        a.big('3.0596 \\approx 3.06 \\; (3 \\text{ s.f.})');
      },
    },
    {
      title: 'Try it: significant figures',
      text: '<p>Choose a number and how many significant figures. The number line zooms in to show the two possible answers.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'sigfig',
  gens: [
    () => { const x = FD.rnd(1000, 999999), sf = FD.rnd(1, 3), r = FD.sigfig(x, sf); return { type: 'num', q: `Round ${FD.nt(x)} to ${sf} significant figure${sf > 1 ? 's' : ''}.`, a: r, why: `Keep the first ${sf} digit${sf > 1 ? 's' : ''}, look at the next one, and fill with zeros: ${FD.nt(r)}.` }; },
    () => { const x = FD.dec(FD.rnd(1001, 9999) / 10 ** FD.rnd(4, 6)), sf = FD.rnd(1, 3), r = FD.sigfig(x, sf); return { type: 'num', q: `Round ${x} to ${sf} significant figure${sf > 1 ? 's' : ''}.`, a: r, why: `Leading zeros are not significant. Start at the first non-zero digit: ${x} ≈ ${FD.sfText(x, sf)}.` }; },
    () => { const x = FD.dec(FD.rnd(10001, 99999) / 1000); return { type: 'num', q: `Round ${x} to 3 significant figures.`, a: FD.sigfig(x, 3), why: `${x} ≈ ${FD.sfText(x, 3)} (3 s.f.).` }; },
  ],
});

FD.check({
  section: 'sigfig',
  items: [
    { type: 'num', q: 'Round 72 649 to 2 significant figures.', a: 73000, why: '72|649: decider 6, so 73 000.' },
    { type: 'num', q: 'Round 0.008 362 to 1 significant figure.', a: 0.008, why: 'First s.f. is the 8; the next digit is 3.' },
    { type: 'num', q: 'Round 5.0472 to 3 significant figures.', a: 5.05, why: '5.04|72: decider 7.' },
    { type: 'mcq', q: 'How many significant figures does 0.0306 have?', opts: ['3', '4', '5', '2'], why: '3, 0, 6: the zero between 3 and 6 counts; the leading zeros do not.' },
  ],
});
