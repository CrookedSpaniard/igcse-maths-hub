// Pies: n pieces of size 1/d fill whole circles one by one.
FD.pies = (host) => {
  host.innerHTML = '<svg class="pies" viewBox="0 0 600 150" role="img"></svg>';
  const svg = host.querySelector('svg');
  const sector = (cx, cy, r, a0, a1) => {
    const p = (a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`;
  };
  return (n, d, lit = n) => {
    const wholes = Math.max(1, Math.ceil(n / d)), count = Math.min(5, Math.max(wholes, 2)), r = 52, gap = 600 / count;
    let s = '';
    for (let c = 0; c < count; c++) {
      const cx = gap * c + gap / 2, cy = 72;
      for (let i = 0; i < d; i++) {
        const k = c * d + i, on = k < n;
        s += `<path class="pie-p ${on ? 'on' : ''} ${on && k >= lit ? 'dim' : ''}" d="${d === 1 ? `M${cx} ${cy - r}a${r} ${r} 0 1 1 -.01 0Z` : sector(cx, cy, r, (2 * Math.PI * i) / d, (2 * Math.PI * (i + 1)) / d)}"/>`;
      }
      s += `<circle class="pie-rim" cx="${cx}" cy="${cy}" r="${r}"/>`;
      if (c < wholes) s += `<text class="pie-lbl" x="${cx}" y="${cy + r + 18}">${Math.min(d, n - c * d) === d ? '1 whole' : `${n - c * d}/${d}`}</text>`;
    }
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `${n} pieces, each one ${d}th of a whole`);
  };
};

FD.add({
  id: 'mixed',
  title: 'Mixed numbers and improper fractions',
  tab: 'Mixed numbers',
  icon: 'frac',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Improper fraction', 'A fraction where the numerator is bigger than the denominator, like \\(\\tfrac{11}{4}\\). It is more than 1 whole.'],
    ['Mixed number', 'A whole number and a fraction together, like \\(2\\tfrac34\\).'],
    ['Common denominator', 'A denominator that two or more fractions share. Used to compare, add and subtract fractions.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim mx-s">
        <div class="fb-host" id="pies"></div>
        <div class="mbig" id="big"></div>
        <div class="eq-work" id="work"></div>
        <div class="card ctrls" id="try" hidden>
          <label class="ctrl">Pieces (numerator) <input type="range" id="rn" min="1" max="20" value="11"><output id="on">11</output></label>
          <label class="ctrl">Pieces in a whole <input type="range" id="rd" min="2" max="8" value="4"><output id="od">4</output></label>
        </div>
      </div>`;
    const root = el.querySelector('.mx-s'), $ = (s) => root.querySelector(s);
    const pies = FD.pies($('#pies'));
    let work = null;
    const label = (n, d) => {
      const w = Math.floor(n / d), r = n % d;
      return `\\frac{${n}}{${d}} = ${w ? w : ''}${r ? (w ? `\\tfrac{${r}}{${d}}` : `\\frac{${r}}{${d}}`) : ''}${!w && !r ? '0' : ''}`;
    };
    const api = {
      set(n, d, lit) { pies(n, d, lit); $('#big').innerHTML = FD.tex(label(n, d), true); },
      work(lines) { $('#work').innerHTML = ''; work = lines ? FD.work($('#work'), lines) : null; },
      upto: (i) => work && work.upto(i),
      tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); sync(); } },
    };
    const sync = () => { const n = +$('#rn').value, d = +$('#rd').value; $('#on').textContent = n; $('#od').textContent = d; api.set(n, d); };
    ['#rn', '#rd'].forEach((s) => $(s).addEventListener('input', sync));
    api.set(11, 4);
    return api;
  },
  steps: [
    {
      title: 'More than one whole',
      text: '<p>Take <b>11 quarters</b>. Four quarters make one whole pie, so 11 quarters fill 2 whole pies with 3 quarters left over.</p><p>\\(\\frac{11}{4}\\) is an <b>improper fraction</b>: the top is bigger than the bottom.</p>',
      async on(a, ctx) { a.tryMode(false); a.work(null); for (let k = 1; k <= 11; k++) { a.set(11, 4, k); if (!(await ctx.sleep(260))) return; } },
    },
    {
      title: 'Improper fraction → mixed number',
      text: '<p><b>Divide</b> the numerator by the denominator. The answer is the number of wholes; the <b>remainder</b> is the new numerator.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.set(11, 4);
        a.work([['11 \\div 4 = 2 \\text{ remainder } 3', '2 wholes, 3 quarters left'], ['\\frac{11}{4} = 2\\tfrac{3}{4}', 'the denominator stays 4']]);
        a.upto(0); if (!(await ctx.sleep(1500))) return; a.upto(1);
      },
    },
    {
      title: 'Mixed number → improper fraction',
      text: '<p>Go the other way: <b>multiply</b> the whole number by the denominator, then <b>add</b> the numerator.</p><p>\\(3\\tfrac{2}{5}\\): each whole is 5 fifths.</p>',
      tip: 'Remember: “multiply, then add”, and keep the same denominator.',
      async on(a, ctx) {
        a.tryMode(false); a.set(17, 5);
        a.work([['3 \\times 5 = 15', '3 wholes = 15 fifths'], ['15 + 2 = 17', 'add the 2 fifths'], ['3\\tfrac{2}{5} = \\frac{17}{5}', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Ordering fractions',
      text: '<p>To compare fractions, write them with a <b>common denominator</b>. Then compare the numerators.</p><p>Which is bigger, \\(\\frac{2}{3}\\) or \\(\\frac{3}{4}\\)? The lowest common multiple of 3 and 4 is 12.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.set(3, 4);
        a.work([['\\frac{2}{3} = \\frac{8}{12} \\qquad \\frac{3}{4} = \\frac{9}{12}', 'common denominator 12'], ['\\frac{8}{12} < \\frac{9}{12}', 'compare the numerators'], ['\\text{so } \\frac{2}{3} < \\frac{3}{4}', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: fill the pies',
      text: '<p>Change the number of pieces and the size of each piece. Watch the improper fraction turn into a mixed number.</p>',
      tip: 'What happens when the numerator is a multiple of the denominator?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'mixed',
  gens: [
    () => { const d = FD.rnd(2, 9), w = FD.rnd(1, 6), r = FD.rnd(1, d - 1), n = w * d + r; return { type: 'num', q: `Write \\(\\dfrac{${n}}{${d}}\\) as a mixed number.`, a: n / d, form: 'mixed', show: `\\(${w}\\tfrac{${r}}{${d}}\\)`, hint: 'Type it like 2 3/4 (a space between the whole number and the fraction).', why: `\\(${n} \\div ${d} = ${w}\\) remainder \\(${r}\\), so \\(\\dfrac{${n}}{${d}} = ${w}\\tfrac{${r}}{${d}}\\).` }; },
    () => { const d = FD.rnd(2, 9), w = FD.rnd(1, 7), r = FD.rnd(1, d - 1); return { type: 'num', q: `Write \\(${w}\\tfrac{${r}}{${d}}\\) as an improper fraction.`, a: (w * d + r) / d, form: 'fraction', show: `\\(\\tfrac{${w * d + r}}{${d}}\\)`, hint: 'Type it like 11/4.', why: `\\(${w} \\times ${d} + ${r} = ${w * d + r}\\), so \\(${w}\\tfrac{${r}}{${d}} = \\dfrac{${w * d + r}}{${d}}\\).` }; },
    () => {
      let a, b, c, d; do { b = FD.rnd(3, 9); d = FD.rnd(3, 9); a = FD.rnd(1, b - 1); c = FD.rnd(1, d - 1); } while (b === d || a * d === c * b);
      const big = a * d > c * b, l = FD.lcm(b, d);
      return { type: 'mcq', q: `Which is bigger: \\(\\dfrac{${a}}{${b}}\\) or \\(\\dfrac{${c}}{${d}}\\)?`, opts: big ? [`\\(\\dfrac{${a}}{${b}}\\)`, `\\(\\dfrac{${c}}{${d}}\\)`] : [`\\(\\dfrac{${c}}{${d}}\\)`, `\\(\\dfrac{${a}}{${b}}\\)`], why: `With denominator ${l}: \\(\\dfrac{${a}}{${b}} = \\dfrac{${(a * l) / b}}{${l}}\\) and \\(\\dfrac{${c}}{${d}} = \\dfrac{${(c * l) / d}}{${l}}\\).` };
    },
  ],
});

FD.check({
  section: 'mixed',
  items: [
    { type: 'num', q: 'Write \\(\\frac{17}{5}\\) as a mixed number.', a: 17 / 5, form: 'mixed', show: '\\(3\\tfrac{2}{5}\\)', hint: 'Type it like 2 3/4.', why: '\\(17 \\div 5 = 3\\) remainder 2, so \\(3\\tfrac{2}{5}\\).' },
    { type: 'num', q: 'Write \\(4\\tfrac{1}{3}\\) as an improper fraction.', a: 13 / 3, form: 'fraction', show: '\\(\\tfrac{13}{3}\\)', hint: 'Type it like 11/4.', why: '\\(4 \\times 3 + 1 = 13\\), so \\(\\frac{13}{3}\\).' },
    { type: 'mcq', q: 'Which of these is an improper fraction?', opts: ['\\(\\frac{9}{7}\\)', '\\(\\frac{7}{9}\\)', '\\(1\\tfrac{2}{7}\\)', '\\(\\frac{1}{2}\\)'], why: 'The numerator (9) is bigger than the denominator (7).' },
    { type: 'mcq', q: 'Put in order, smallest first: \\(\\frac{3}{5}, \\frac{1}{2}, \\frac{7}{10}\\)', opts: ['\\(\\frac{1}{2}, \\frac{3}{5}, \\frac{7}{10}\\)', '\\(\\frac{3}{5}, \\frac{1}{2}, \\frac{7}{10}\\)', '\\(\\frac{7}{10}, \\frac{3}{5}, \\frac{1}{2}\\)', '\\(\\frac{1}{2}, \\frac{7}{10}, \\frac{3}{5}\\)'], why: 'In tenths: \\(\\frac{5}{10}, \\frac{6}{10}, \\frac{7}{10}\\).' },
  ],
});
