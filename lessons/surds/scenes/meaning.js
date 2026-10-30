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
// n = k² × m with m as small as possible: FD.surd(72) → [6, 2].
FD.surd = (n) => { let k = 1; for (let f = 2; f * f <= n; f++) if (n % (f * f) === 0) k = f; return [k, n / (k * k)]; };
// TeX for k√m: FD.stex(6, 2) → "6\sqrt{2}", FD.stex(1, 5) → "\sqrt{5}", FD.stex(4, 1) → "4".
FD.stex = (k, m) => (m === 1 ? String(k) : `${k === 1 ? '' : k === -1 ? '-' : k}\\sqrt{${m}}`);

// A square of area n, drawn to scale, with its side √n.
FD.areaSq = (host) => {
  host.innerHTML = '<svg viewBox="0 0 600 220" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (n) => {
    const s = Math.sqrt(n) * 26, x = 300 - s / 2, y = 105 - s / 2, [k, m] = FD.surd(n);
    svg.innerHTML = `<rect class="su-box" x="${x}" y="${y}" width="${s}" height="${s}" rx="4"/><text class="su-t" x="300" y="${y + s / 2 + 6}">area ${n}</text><text class="su-t" x="300" y="${Math.min(y + s + 24, 214)}">side = √${n}${m === 1 ? ` = ${k}` : k > 1 ? ` = ${k}√${m}` : ''}</text>`;
    svg.setAttribute('aria-label', `A square of area ${n} with side root ${n}`);
  };
};

FD.add({
  id: 'meaning',
  title: 'What is a surd?',
  tab: 'Surds',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Surd', 'A root that is not a whole number or fraction, like \\(\\sqrt{2}\\) or \\(\\sqrt{15}\\). Its decimal never ends and never repeats.'],
    ['Exact value', 'Leaving \\(\\sqrt{2}\\) as it is, instead of rounding to 1.41, keeps the answer exact.'],
    ['Multiplying', '\\(\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}\\), and \\(\\sqrt{a} \\times \\sqrt{a} = a\\).'],
    ['Dividing', '\\(\\dfrac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\dfrac{a}{b}}\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'mn-s', '<div id="sq"></div>', `
      <label class="ctrl">Area <input type="range" id="rn" min="1" max="50" value="2"><output id="on">2</output></label>`, () => sync());
    a.sq = FD.areaSq(a.$('#sq'));
    const sync = () => {
      const n = +a.$('#rn').value; a.$('#on').textContent = n; a.sq(n);
      const [k, m] = FD.surd(n);
      a.big(`\\sqrt{${n}} ${m === 1 ? `= ${k}` : k > 1 ? `= ${FD.stex(k, m)}` : ''} \\approx ${Math.sqrt(n).toFixed(5)}${m === 1 ? '' : '\\dots'}`);
      a.msg(m === 1 ? `${n} is a square number, so \\(\\sqrt{${n}}\\) is <b>not</b> a surd.` : `\\(\\sqrt{${n}}\\) is a <b>surd</b>: its decimal goes on for ever without repeating.`, m === 1 ? 'good' : 'bad');
    };
    a.$('#rn').addEventListener('input', sync);
    a.sq(2);
    return a;
  },
  steps: [
    {
      title: 'Roots that are not whole',
      text: '<p>A square of area 9 has side \\(\\sqrt{9} = 3\\). A square of area 2 has side \\(\\sqrt{2} = 1.41421356\\dots\\)</p><p>The decimal for \\(\\sqrt{2}\\) never ends and never repeats. A root like this is called a <b>surd</b>.</p>',
      async on(a, ctx) {
        a.reset(); a.sq(9); a.big('\\sqrt{9} = 3 \\quad \\text{not a surd}');
        if (!(await ctx.sleep(1600))) return;
        a.sq(2); a.big('\\sqrt{2} = 1.41421356\\dots \\quad \\text{a surd}');
      },
    },
    {
      title: 'Why keep surds?',
      text: '<p>A right-angled triangle with shorter sides 1 and 1 has a long side of \\(\\sqrt{2}\\). Writing 1.41 is only <b>approximate</b>; \\(\\sqrt{2}\\) is <b>exact</b>.</p><p>Questions that say “give your answer in surd form” or “exact value” want the surd.</p>',
      async on(a, ctx) {
        a.reset(); a.sq(2);
        await a.lines([['1^2 + 1^2 = 2', ''], ['\\text{side} = \\sqrt{2}', 'exact'], ['\\approx 1.41', 'rounded: not exact']], ctx, 1300);
      },
    },
    {
      title: 'Multiplying surds',
      text: '<p>\\(\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}\\). Multiplying two surds can give a whole number.</p><p>A surd times itself gives the number inside: \\(\\sqrt{7} \\times \\sqrt{7} = 7\\).</p>',
      tip: 'Only multiply and divide surds this way. \\(\\sqrt{a} + \\sqrt{b}\\) is NOT \\(\\sqrt{a + b}\\).',
      async on(a, ctx) {
        a.reset(); a.sq(16);
        await a.lines([['\\sqrt{2} \\times \\sqrt{8} = \\sqrt{16} = 4', ''], ['\\sqrt{3} \\times \\sqrt{5} = \\sqrt{15}', ''], ['\\sqrt{7} \\times \\sqrt{7} = 7', ''], ['2\\sqrt{3} \\times 5\\sqrt{2} = 10\\sqrt{6}', 'numbers × numbers, roots × roots']], ctx, 1300);
      },
    },
    {
      title: 'Dividing surds',
      text: '<p>\\(\\dfrac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\dfrac{a}{b}}\\).</p>',
      async on(a, ctx) {
        a.reset(); a.sq(4);
        await a.lines([['\\frac{\\sqrt{20}}{\\sqrt{5}} = \\sqrt{4} = 2', ''], ['\\frac{\\sqrt{30}}{\\sqrt{6}} = \\sqrt{5}', ''], ['\\frac{6\\sqrt{10}}{3\\sqrt{2}} = 2\\sqrt{5}', '6 ÷ 3 and 10 ÷ 2']], ctx, 1300);
      },
    },
    {
      title: 'Try it: squares and their sides',
      text: '<p>Choose an area. The side of the square is the square root of the area. Is it a surd?</p>',
      tip: 'Which areas up to 50 give a whole-number side?',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'meaning',
  gens: [
    () => { let x, y; do { x = FD.rnd(2, 12); y = FD.rnd(2, 12); } while (FD.surd(x * y)[1] !== 1 || x === y || FD.surd(x)[1] === 1); return { type: 'num', q: `Work out \\(\\sqrt{${x}} \\times \\sqrt{${y}}\\)`, a: Math.sqrt(x * y), why: `\\(\\sqrt{${x} \\times ${y}} = \\sqrt{${x * y}} = ${Math.sqrt(x * y)}\\).` }; },
    () => { const m = FD.pick([2, 3, 5, 6, 7, 10, 11]), k = FD.rnd(2, 6); return { type: 'num', q: `Work out \\(${k}\\sqrt{${m}} \\times \\sqrt{${m}}\\)`, a: k * m, why: `\\(\\sqrt{${m}} \\times \\sqrt{${m}} = ${m}\\), so the answer is \\(${k} \\times ${m} = ${k * m}\\).` }; },
    () => { const q = FD.pick([4, 9, 16, 25]), b = FD.pick([2, 3, 5, 6, 7]); return { type: 'num', q: `Work out \\(\\dfrac{\\sqrt{${q * b}}}{\\sqrt{${b}}}\\)`, a: Math.sqrt(q), why: `\\(\\sqrt{\\dfrac{${q * b}}{${b}}} = \\sqrt{${q}} = ${Math.sqrt(q)}\\).` }; },
    () => { const sq = FD.pick([4, 9, 16, 25, 36, 49, 64, 81, 100]), others = FD.shuffle([2, 3, 5, 6, 7, 8, 10, 12, 15, 18, 20]).slice(0, 3); return { type: 'mcq', q: 'Which of these is <b>not</b> a surd?', opts: [`\\(\\sqrt{${sq}}\\)`, ...others.map((o) => `\\(\\sqrt{${o}}\\)`)], why: `\\(\\sqrt{${sq}} = ${Math.sqrt(sq)}\\), a whole number. The others are not square numbers.` }; },
  ],
});

FD.check({
  section: 'meaning',
  items: [
    { type: 'multi', q: 'Choose the <b>two</b> surds.', need: 2, opts: [['\\(\\sqrt{12}\\)', true], ['\\(\\sqrt{30}\\)', true], ['\\(\\sqrt{36}\\)', false], ['\\(\\sqrt{0.25}\\)', false]], why: '\\(\\sqrt{36} = 6\\) and \\(\\sqrt{0.25} = 0.5\\) are exact decimals.' },
    { type: 'num', q: 'Work out \\(\\sqrt{3} \\times \\sqrt{27}\\)', a: 9, why: '\\(\\sqrt{81} = 9\\).' },
    { type: 'num', q: 'Work out \\((\\sqrt{11})^2\\)', a: 11, why: 'A surd times itself gives the number inside.' },
    { type: 'tf', q: '\\(\\sqrt{9} + \\sqrt{16} = \\sqrt{25}\\)', a: false, why: '\\(3 + 4 = 7\\), but \\(\\sqrt{25} = 5\\). You cannot add under the root.' },
    { type: 'mcq', q: 'Simplify \\(\\dfrac{\\sqrt{42}}{\\sqrt{7}}\\)', opts: ['\\(\\sqrt{6}\\)', '6', '\\(\\sqrt{35}\\)', '\\(6\\sqrt{7}\\)'], why: '\\(\\sqrt{42 \\div 7} = \\sqrt{6}\\).' },
  ],
});
