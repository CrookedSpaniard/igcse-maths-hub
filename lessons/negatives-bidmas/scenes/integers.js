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
// A negative number written with a proper minus sign, in brackets when asked: FD.sn(-3, true) → "(-3)".
FD.sn = (v, br) => (v < 0 && br ? `(${v})` : String(v));

// Number line from lo to hi. Jumps are drawn as arcs (green up, red down) from `start`.
FD.nline = (host) => {
  host.innerHTML = '<svg class="nl" viewBox="0 0 600 170" role="img"></svg>';
  const svg = host.querySelector('svg');
  return ({ lo = -10, hi = 10, start = null, jumps = [], upto, marks = [] } = {}) => {
    const X = (v) => 30 + ((v - lo) / (hi - lo)) * 540, AY = 125, span = hi - lo, lab = span > 30 ? 5 : span > 20 ? 2 : 1;
    let s = `<line class="nl-ax" x1="14" y1="${AY}" x2="586" y2="${AY}"/>`;
    for (let v = lo; v <= hi; v++) {
      const big = v % lab === 0;
      s += `<line class="nl-tk" x1="${X(v)}" y1="${AY - (big ? 7 : 4)}" x2="${X(v)}" y2="${AY + (big ? 7 : 4)}"/>`;
      if (big) s += `<text class="nl-t ${v === 0 ? 'zero' : ''}" x="${X(v)}" y="${AY + 27}">${v < 0 ? '−' + -v : v}</text>`;
    }
    const n = upto == null ? jumps.length : upto;
    let p = start;
    jumps.slice(0, n).forEach((j, i) => {
      const q = p + j, h = Math.min(78, 22 + Math.abs(X(q) - X(p)) * 0.3), mx = (X(p) + X(q)) / 2, up = j > 0;
      s += `<path class="${up ? 'nl-up' : 'nl-dn'} ${i === n - 1 ? 'nl-arc' : ''}" d="M${X(p)} ${AY - 6}Q${mx} ${AY - 6 - 2 * h} ${X(q)} ${AY - 6}"/>`;
      if (jumps.length <= 6) s += `<text class="nl-jl ${up ? 'up' : 'dn'}" x="${mx}" y="${AY - 12 - h}">${up ? '+' : '−'}${Math.abs(j)}</text>`;
      p = q;
    });
    if (start != null) marks = [{ v: start, cls: 'b' }, ...(n ? [{ v: p }] : []), ...marks];
    marks.forEach((m) => { s += `<circle class="nl-dot ${m.cls || ''}" cx="${X(m.v)}" cy="${AY}" r="8"/>${m.label ? `<text class="nl-pl" x="${X(m.v)}" y="${AY - 16}">${m.label}</text>` : ''}`; });
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Number line from ${lo} to ${hi}`);
    return p;
  };
};
const nbTxt = (v) => (v < 0 ? '−' + -v : String(v));

FD.add({
  id: 'integers',
  title: 'Place value and ordering integers',
  tab: 'Ordering',
  icon: 'number',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Integer', 'A whole number: positive, negative or zero. \\(-4, 0, 7\\) are integers; \\(2.5\\) is not.'],
    ['Place value', 'The value of a digit depends on its column: in 3582 the 5 is worth 500.'],
    ['Negative number', 'A number less than zero, like \\(-3\\). It is to the left of 0 on the number line.'],
    ['< and >', '\\(a < b\\) means “\\(a\\) is less than \\(b\\)”. \\(a > b\\) means “\\(a\\) is greater than \\(b\\)”.'],
  ],
  mount(el) {
    const a = FD.board(el, 'in-s', '<div id="nl"></div>', `
      <label class="ctrl">First number <input type="range" id="ra" min="-10" max="10" value="-6"><output id="oa">−6</output></label>
      <label class="ctrl">Second number <input type="range" id="rb" min="-10" max="10" value="-2"><output id="ob">−2</output></label>`, () => sync());
    a.nl = FD.nline(a.$('#nl'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value; a.$('#oa').textContent = nbTxt(x); a.$('#ob').textContent = nbTxt(y);
      a.nl({ marks: [{ v: x, label: 'a' }, { v: y, cls: 'b', label: x === y ? '' : 'b' }] });
      const sym = x < y ? '<' : x > y ? '>' : '=';
      a.big(`${x} ${sym} ${y}`);
      a.msg(x === y ? 'They are equal.' : `${nbTxt(Math.min(x, y))} is further left, so it is smaller.`);
    };
    ['#ra', '#rb'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.nl({});
    return a;
  },
  steps: [
    {
      title: 'Place value',
      text: '<p>The value of a digit depends on its <b>column</b>. In 30 572, the 5 is in the hundreds column, so it is worth <b>500</b>.</p><p>The 3 is worth 30 000, and the 0 is a <b>place holder</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.nl({});
        a.big('\\begin{array}{c|c|c|c|c} \\text{TTh} & \\text{Th} & \\text{H} & \\text{T} & \\text{U} \\\\ \\hline 3 & 0 & 5 & 7 & 2 \\end{array}');
        await a.lines([['3 \\text{ is worth } 30\\,000', 'ten thousands'], ['5 \\text{ is worth } 500', 'hundreds'], ['7 \\text{ is worth } 70', 'tens']], ctx, 1200);
      },
    },
    {
      title: 'The number line',
      text: '<p>Numbers get <b>bigger</b> to the right and <b>smaller</b> to the left.</p><p>Negative numbers are to the left of zero. \\(-7\\) is smaller than \\(-2\\), even though 7 is bigger than 2.</p>',
      tip: 'Think of temperature: −7 °C is colder than −2 °C.',
      async on(a, ctx) {
        a.reset();
        const ms = [];
        for (const v of [3, -2, -7]) { ms.push({ v, label: nbTxt(v) }); a.nl({ marks: ms }); if (!(await ctx.sleep(900))) return; }
        a.big('-7 < -2 < 3');
      },
    },
    {
      title: 'Ordering integers',
      text: '<p>Put these in order, smallest first: \\(5, -3, 0, -8, 2\\).</p><p>Place them on the number line, then read from <b>left to right</b>.</p>',
      async on(a, ctx) {
        a.reset();
        const ms = [];
        for (const v of [-8, -3, 0, 2, 5]) { ms.push({ v, label: nbTxt(v) }); a.nl({ marks: ms }); a.big(ms.map((m) => m.v).join(',\\ ')); if (!(await ctx.sleep(900))) return; }
      },
    },
    {
      title: 'Temperature differences',
      text: '<p>At night it was \\(-4\\) °C. At midday it was 7 °C. How much warmer was it at midday?</p><p>Count the jumps: 4 up to zero, then 7 more.</p>',
      tip: 'Difference = higher − lower: \\(7 - (-4) = 11\\).',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k <= 2; k++) { a.nl({ start: -4, jumps: [4, 7], upto: k }); if (!(await ctx.sleep(1000))) return; }
        a.big('4 + 7 = 11 \\text{ degrees}');
      },
    },
    {
      title: 'Try it: which is bigger?',
      text: '<p>Move the two numbers along the line. The correct sign, <b>&lt;</b>, <b>&gt;</b> or <b>=</b>, appears between them.</p>',
      tip: 'The sign always points (opens) towards the bigger number.',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'integers',
  gens: [
    () => { const s = new Set(); while (s.size < 5) s.add(FD.rndNZ(-15, 12)); const v = [...s], up = [...v].sort((x, y) => x - y), abs = [...v].sort((x, y) => Math.abs(x) - Math.abs(y)), neg = [...v].sort((x, y) => (x < 0 && y < 0 ? y - x : x - y)); const opts = [up, abs, neg, [...up].reverse()].map((l) => `\\(${l.join(',\\ ')}\\)`); return { type: 'mcq', q: `Which list puts \\(${v.join(',\\ ')}\\) in order, <b>smallest first</b>?`, opts: [...new Set(opts)], why: `On the number line, from left to right: \\(${up.join(',\\ ')}\\). The more negative a number is, the smaller it is.` }; },
    () => { let x, y; do { x = FD.rnd(-12, 12); y = FD.rnd(-12, 12); } while (x === y || (x >= 0 && y >= 0)); return { type: 'mcq', q: `Which sign goes in the box? \\(\\quad ${x} \\; \\square \\; ${y}\\)`, opts: x < y ? ['<', '>', '='] : ['>', '<', '='], why: `${nbTxt(Math.min(x, y))} is further left on the number line, so \\(${x} ${x < y ? '<' : '>'} ${y}\\).` }; },
    () => { const lo = FD.rnd(-15, -1), hi = FD.rnd(1, 20), place = FD.pick(['Moscow', 'Oslo', 'Ottawa', 'Helsinki']); return { type: 'num', q: `In ${place}, the temperature was \\(${lo}\\) °C at 6 am and ${hi} °C at 2 pm. By how many degrees did the temperature rise?`, a: hi - lo, unit: '°C', why: `From \\(${lo}\\) up to 0 is ${-lo}, then up to ${hi} is ${hi} more: \\(${-lo} + ${hi} = ${hi - lo}\\). Or \\(${hi} - (${lo}) = ${hi - lo}\\).` }; },
    () => { let n; do { n = FD.rnd(10000, 99999); } while (new Set(String(n)).size < 5); const s = String(n), k = FD.rnd(0, 4), d = +s[k], val = d * 10 ** (4 - k); return { type: 'num', q: `What is the value of the digit ${d} in the number ${FD.num(n)}?`, a: val, why: `The ${d} is in the ${['ten thousands', 'thousands', 'hundreds', 'tens', 'units'][k]} column, so it is worth ${FD.num(val)}.` }; },
  ],
});

FD.check({
  section: 'integers',
  items: [
    { type: 'mcq', q: 'Which number is the smallest?', opts: ['\\(-9\\)', '\\(-4\\)', '\\(0\\)', '\\(-1\\)'], why: '\\(-9\\) is furthest to the left on the number line.' },
    { type: 'tf', q: '\\(-5 > -3\\)', a: false, why: '\\(-5\\) is to the left of \\(-3\\), so \\(-5 < -3\\).' },
    { type: 'num', q: 'The temperature in a freezer is \\(-18\\) °C. The kitchen is 21 °C. What is the difference in temperature?', a: 39, unit: '°C', why: '\\(21 - (-18) = 21 + 18 = 39\\).' },
    { type: 'num', q: 'What is the value of the 4 in 7 490 312?', a: 400000, why: 'The 4 is in the hundred thousands column: 400 000.' },
    { type: 'mcq', q: 'Which list is in order, smallest first?', opts: ['\\(-6, -2, 0, 3\\)', '\\(-2, -6, 0, 3\\)', '\\(0, -2, 3, -6\\)', '\\(3, 0, -2, -6\\)'], why: 'Left to right on the number line: \\(-6, -2, 0, 3\\).' },
  ],
});
