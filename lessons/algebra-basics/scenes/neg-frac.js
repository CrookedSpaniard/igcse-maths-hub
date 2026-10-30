// The powers ladder: each step down divides by the base, so x^0 = 1 and x^-n = 1/x^n.
FD.add({
  id: 'neg-frac',
  title: 'Negative and fractional indices',
  tab: 'Negative & fractional',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Negative index', 'Means “one over”: \\(x^{-n} = \\frac{1}{x^n}\\).'],
    ['Fractional index', 'Means a root: \\(x^{\\frac{1}{n}} = \\sqrt[n]{x}\\).'],
    ['Reciprocal', 'One divided by the number: the reciprocal of \\(x^3\\) is \\(\\frac{1}{x^3}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'nf-s',
      side: true,
      vis: '<div class="nf-ladder" data-k="lad"></div>',
      tryHtml: `<label class="ctrl">Base \\(b\\) <input type="range" data-k="b" min="2" max="5" value="2"><output data-k="ob">2</output></label>
        <label class="ctrl">Power \\(n\\) <input type="range" data-k="n" min="-3" max="3" value="-2"><output data-k="on">−2</output></label>`,
    });
    const lad = a.$('[data-k="lad"]');
    a.ladder = (b, upto, hot) => {
      lad.innerHTML = [3, 2, 1, 0, -1, -2, -3].map((p) => `<div class="nf-r ${p >= upto ? 'on' : ''} ${p === hot ? 'hot' : ''}"><span>\\(${b}^{${p}}\\)</span><b>\\(${p >= 0 ? b ** p : `\\frac{1}{${b ** -p}}`}\\)</b>${p < 3 ? `<i>÷ ${b}</i>` : '<i></i>'}</div>`).join('');
      FD.typeset(lad);
    };
    const sync = () => {
      const b = +a.$('[data-k="b"]').value, n = +a.$('[data-k="n"]').value;
      a.$('[data-k="ob"]').textContent = b; a.$('[data-k="on"]').textContent = String(n).replace('-', '−');
      a.ladder(b, -3, n);
      a.big(n < 0 ? `${b}^{${n}} = \\frac{1}{${b}^{${-n}}} = \\frac{1}{${b ** -n}}` : `${b}^{${n}} = ${b ** n}`);
    };
    a.$('[data-k="b"]').addEventListener('input', sync);
    a.$('[data-k="n"]').addEventListener('input', sync);
    a.onTry = sync;
    a.ladder(2, 3);
    return a;
  },
  steps: [
    {
      title: 'Going down the ladder',
      text: '<p>Each time the power goes down by 1, you <b>divide by the base</b>: \\(2^3 = 8\\), \\(2^2 = 4\\), \\(2^1 = 2\\)…</p><p>Keep going: \\(2^0 = 1\\), \\(2^{-1} = \\frac{1}{2}\\), \\(2^{-2} = \\frac{1}{4}\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let p = 3; p >= -3; p--) { a.ladder(2, p, p); if (!(await ctx.sleep(800))) return; } a.big('x^{-n} = \\frac{1}{x^n}'); },
    },
    {
      title: 'Negative powers in algebra',
      text: '<p>A negative power means the <b>reciprocal</b>. The index laws still work.</p>',
      tip: 'A negative power does <b>not</b> make the answer negative: \\(2^{-3} = \\frac18\\), not \\(-8\\).',
      on: FD.walk([['x^{-3} = \\frac{1}{x^3}', 'reciprocal'], ['5y^{-2} = \\frac{5}{y^2}', 'only y is raised to −2'], ['x^4 \\times x^{-6} = x^{-2}', 'add: 4 + (−6)'], ['\\frac{a^2}{a^5} = a^{-3} = \\frac{1}{a^3}', 'subtract: 2 − 5']], (a) => { a.ladder(2, -3); a.big(''); }),
    },
    {
      title: 'Fractional powers are roots',
      text: '<p>\\(x^{\\frac12} \\times x^{\\frac12} = x^1\\), so \\(x^{\\frac12}\\) is the number that squared gives \\(x\\): the <b>square root</b>.</p><p>In the same way \\(x^{\\frac13} = \\sqrt[3]{x}\\).</p>',
      on: FD.walk([['x^{\\frac12} = \\sqrt{x}', ''], ['27^{\\frac13} = \\sqrt[3]{27} = 3', ''], ['x^{\\frac{m}{n}} = (\\sqrt[n]{x})^m', 'root first, then power'], ['8^{\\frac23} = (\\sqrt[3]{8})^2 = 2^2 = 4', '']], (a) => { a.ladder(2, 4); a.big(''); }),
    },
    {
      title: 'Putting it all together',
      text: '<p>For a bracket like \\((16x^8)^{\\frac34}\\), apply the power to the number and to the letter.</p>',
      tip: 'For a negative fractional power, do three things: reciprocal, root, power.',
      on: FD.walk([['(16x^8)^{\\frac34}', ''], ['= 16^{\\frac34} \\times x^{8 \\times \\frac34}', 'power each part'], ['= (\\sqrt[4]{16})^3 x^6 = 8x^6', ''], ['\\left(\\frac{x^6}{25}\\right)^{-\\frac12} = \\frac{5}{x^3}', 'flip, then square root']], (a) => { a.ladder(2, 4); a.big(''); }),
    },
    {
      title: 'Try it: the ladder',
      text: '<p>Change the base and the power. Watch where the power sits on the ladder and what its value is.</p>',
      tip: 'Every row is the row above divided by the base.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'neg-frac',
  gens: [
    () => { const b = FD.rnd(2, 5), n = FD.rnd(1, 3); return { type: 'num', q: `Work out \\(${b}^{-${n}}\\). Give your answer as a fraction.`, a: 1 / b ** n, show: `\\(\\tfrac{1}{${b ** n}}\\)`, hint: 'Type it like 1/8.', why: `\\(${b}^{-${n}} = \\dfrac{1}{${b}^{${n}}} = \\dfrac{1}{${b ** n}}\\)` }; },
    () => { const [r, n] = FD.pick([[2, 2], [3, 2], [4, 2], [5, 2], [2, 3], [3, 3], [4, 3], [2, 4], [3, 4], [2, 5]]), m = FD.rnd(1, 3), base = r ** n; return { type: 'num', q: `Work out \\(${base}^{\\frac{${m}}{${n}}}\\)`, a: r ** m, why: `Root first: \\(\\sqrt[${n}]{${base}} = ${r}\\). Then the power: \\(${r}^{${m}} = ${r ** m}\\).` }; },
    () => { const m = FD.rnd(1, 6), n = FD.rnd(m + 1, 9), x = FD.pick(['x', 'y', 'a']); return { type: 'alg', q: `Simplify \\(${x}^{${m}} \\div ${x}^{${n}}\\). Give your answer with a negative index.`, a: `${x}^(${m - n})`, show: `\\(${x}^{${m - n}}\\)`, hint: 'Type a negative power with brackets, e.g. x^(-3).', why: `\\(${m} - ${n} = ${m - n}\\), so \\(${x}^{${m - n}}\\). This is the same as \\(\\dfrac{1}{${x}^{${n - m}}}\\).` }; },
  ],
});

FD.check({
  section: 'neg-frac',
  items: [
    { type: 'num', q: 'Work out \\(4^{-2}\\).', a: 1 / 16, show: '\\(\\tfrac{1}{16}\\)', hint: 'Type a fraction like 1/9.', why: '\\(4^{-2} = \\frac{1}{4^2} = \\frac{1}{16}\\).' },
    { type: 'num', q: 'Work out \\(125^{\\frac23}\\).', a: 25, why: '\\(\\sqrt[3]{125} = 5\\), then \\(5^2 = 25\\).' },
    { type: 'mcq', q: 'Which is equal to \\(x^{-\\frac12}\\)?', opts: ['\\(\\frac{1}{\\sqrt{x}}\\)', '\\(-\\sqrt{x}\\)', '\\(\\frac{x}{2}\\)', '\\(-\\frac{x}{2}\\)'], why: 'Negative: reciprocal. Half: square root.' },
    { type: 'mcq', q: 'Simplify \\((9x^4)^{\\frac12}\\)', opts: ['\\(3x^2\\)', '\\(9x^2\\)', '\\(3x^4\\)', '\\(4.5x^2\\)'], why: '\\(\\sqrt9 = 3\\) and \\(x^{4 \\times \\frac12} = x^2\\).' },
    { type: 'num', q: 'Work out \\(\\left(\\frac{1}{8}\\right)^{-\\frac13}\\).', a: 2, why: 'Flip: \\(8^{\\frac13} = 2\\).' },
  ],
});
