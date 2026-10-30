// Factor pairs of n as chips; pairs with a square factor are orange, the largest square factor is green.
FD.sqPairs = (host) => (n, lit = 2) => {
  const pairs = []; for (let f = 1; f * f <= n; f++) if (n % f === 0) pairs.push([n / f, f]);
  const isSq = (x) => x > 1 && Number.isInteger(Math.sqrt(x)), [k] = FD.surd(n);
  host.innerHTML = `<div class="fp-list">${pairs.map(([p, q]) => { const s = isSq(p) || isSq(q), best = k > 1 && (p === k * k || q === k * k); return `<span class="fp-pair ${lit >= 1 && s ? 'sq' : ''} ${lit >= 2 && best ? 'best' : ''}">${Math.min(p, q)} × ${Math.max(p, q)}</span>`; }).join('')}</div>`;
};

FD.add({
  id: 'simplify',
  title: 'Simplifying, adding and subtracting surds',
  tab: 'Simplifying',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Square factor', 'A factor that is a square number: 4, 9, 16, 25, 36, …'],
    ['Simplest form', 'The number under the root is as small as possible: \\(\\sqrt{72} = 6\\sqrt{2}\\).'],
    ['Like surds', 'Surds with the same number under the root, like \\(2\\sqrt{3}\\) and \\(5\\sqrt{3}\\). Only like surds can be added or subtracted.'],
  ],
  mount(el) {
    const a = FD.board(el, 'sp-s', '<div id="fp"></div>', `
      <label class="ctrl">Number <input type="range" id="rn" min="8" max="200" value="72"><output id="on">72</output></label>`, () => sync());
    a.fp = FD.sqPairs(a.$('#fp'));
    const sync = () => {
      const n = +a.$('#rn').value; a.$('#on').textContent = n; a.fp(n);
      const [k, m] = FD.surd(n);
      a.big(k === 1 ? `\\sqrt{${n}}` : `\\sqrt{${n}} = \\sqrt{${k * k}} \\times \\sqrt{${m}} = ${FD.stex(k, m)}`);
      a.msg(m === 1 ? `${n} is a square number: \\(\\sqrt{${n}} = ${k}\\).` : k === 1 ? `${n} has no square factor (except 1), so \\(\\sqrt{${n}}\\) is already in its simplest form.` : `The largest square factor of ${n} is ${k * k}.`, k === 1 && m !== 1 ? 'bad' : 'good');
    };
    a.$('#rn').addEventListener('input', sync);
    a.fp(72, 0);
    return a;
  },
  steps: [
    {
      title: 'Look for a square factor',
      text: '<p>Simplify \\(\\sqrt{72}\\). List the factor pairs of 72 and look for a <b>square number</b>.</p><p>4, 9 and 36 are square factors. Use the <b>largest</b>: 36.</p>',
      async on(a, ctx) {
        a.reset(); a.fp(72, 0);
        if (!(await ctx.sleep(1200))) return; a.fp(72, 1);
        if (!(await ctx.sleep(1200))) return; a.fp(72, 2);
        a.big('\\sqrt{72} = \\sqrt{36 \\times 2} = \\sqrt{36} \\times \\sqrt{2} = 6\\sqrt{2}');
      },
    },
    {
      title: 'A smaller square factor works too, but slowly',
      text: '<p>If you use 4 instead: \\(\\sqrt{72} = 2\\sqrt{18}\\). But 18 still has a square factor, 9, so keep going.</p>',
      tip: 'Check your answer: the number left under the root must have no square factor.',
      async on(a, ctx) {
        a.reset(); a.fp(72, 1);
        await a.lines([['\\sqrt{72} = \\sqrt{4} \\times \\sqrt{18} = 2\\sqrt{18}', 'not finished'], ['2\\sqrt{18} = 2 \\times \\sqrt{9} \\times \\sqrt{2} = 2 \\times 3\\sqrt{2}', ''], ['= 6\\sqrt{2}', 'same answer']], ctx, 1400);
      },
    },
    {
      title: 'Adding and subtracting like surds',
      text: '<p>\\(2\\sqrt{3} + 5\\sqrt{3}\\) is like \\(2x + 5x\\): the answer is \\(7\\sqrt{3}\\).</p><p>Unlike surds, such as \\(\\sqrt{2} + \\sqrt{3}\\), cannot be collected.</p>',
      async on(a, ctx) {
        a.reset(); a.fp(12, 2);
        await a.lines([['2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}', 'like surds'], ['6\\sqrt{5} - \\sqrt{5} = 5\\sqrt{5}', ''], ['\\sqrt{2} + \\sqrt{3}', 'cannot be simplified']], ctx, 1300);
      },
    },
    {
      title: 'Simplify first, then collect',
      text: '<p>\\(\\sqrt{12} + \\sqrt{27}\\) look different, but both simplify to multiples of \\(\\sqrt{3}\\).</p>',
      async on(a, ctx) {
        a.reset(); a.fp(27, 2);
        await a.lines([['\\sqrt{12} = \\sqrt{4}\\sqrt{3} = 2\\sqrt{3}', ''], ['\\sqrt{27} = \\sqrt{9}\\sqrt{3} = 3\\sqrt{3}', ''], ['\\sqrt{12} + \\sqrt{27} = 5\\sqrt{3}', '']], ctx, 1300);
      },
    },
    {
      title: 'Try it: find the square factor',
      text: '<p>Choose a number. Its factor pairs appear; pairs with a square number are orange and the largest square factor is green.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'simplify',
  gens: [
    () => { const k = FD.rnd(2, 7), m = FD.pick([2, 3, 5, 6, 7, 10, 11]), n = k * k * m; return { type: 'num', q: `Simplify \\(\\sqrt{${n}}\\). Write it as \\(k\\sqrt{m}\\): what is \\(k\\)?`, a: k, why: `The largest square factor of ${n} is ${k * k}: \\(\\sqrt{${n}} = \\sqrt{${k * k}} \\times \\sqrt{${m}} = ${FD.stex(k, m)}\\), so \\(k = ${k}\\).` }; },
    () => { const m = FD.pick([2, 3, 5]), p = FD.rnd(2, 5), q = FD.rnd(2, 5); const A = p * p * m, B = q * q * m; return { type: 'mcq', q: `Simplify \\(\\sqrt{${A}} + \\sqrt{${B}}\\)`, opts: [`\\(${FD.stex(p + q, m)}\\)`, `\\(\\sqrt{${A + B}}\\)`, `\\(${FD.stex(p * q, m)}\\)`, `\\(${FD.stex(p + q, 2 * m)}\\)`].filter((v, i, s) => s.indexOf(v) === i), why: `\\(\\sqrt{${A}} = ${FD.stex(p, m)}\\) and \\(\\sqrt{${B}} = ${FD.stex(q, m)}\\). Like surds: \\(${p} + ${q} = ${p + q}\\), so \\(${FD.stex(p + q, m)}\\).` }; },
    () => { const m = FD.pick([2, 3, 5, 7]), p = FD.rnd(4, 9), q = FD.rnd(1, p - 1); return { type: 'num', q: `\\(${p}\\sqrt{${m}} - ${FD.stex(q, m)} = k\\sqrt{${m}}\\). Find \\(k\\).`, a: p - q, why: `Like surds: \\(${p} - ${q} = ${p - q}\\).` }; },
  ],
});

FD.check({
  section: 'simplify',
  items: [
    { type: 'mcq', q: 'Simplify \\(\\sqrt{50}\\)', opts: ['\\(5\\sqrt{2}\\)', '\\(2\\sqrt{5}\\)', '\\(25\\sqrt{2}\\)', '\\(10\\sqrt{5}\\)'], why: '\\(\\sqrt{25 \\times 2} = 5\\sqrt{2}\\).' },
    { type: 'mcq', q: 'Simplify \\(\\sqrt{48}\\)', opts: ['\\(4\\sqrt{3}\\)', '\\(2\\sqrt{12}\\)', '\\(3\\sqrt{4}\\)', '\\(16\\sqrt{3}\\)'], why: 'Largest square factor 16: \\(4\\sqrt{3}\\). (\\(2\\sqrt{12}\\) is not fully simplified.)' },
    { type: 'num', q: '\\(\\sqrt{8} + \\sqrt{18} = k\\sqrt{2}\\). Find \\(k\\).', a: 5, why: '\\(2\\sqrt{2} + 3\\sqrt{2} = 5\\sqrt{2}\\).' },
    { type: 'tf', q: '\\(\\sqrt{5} + \\sqrt{5} = \\sqrt{10}\\)', a: false, why: '\\(\\sqrt{5} + \\sqrt{5} = 2\\sqrt{5}\\).' },
    { type: 'num', q: '\\(\\sqrt{75} - \\sqrt{12} = k\\sqrt{3}\\). Find \\(k\\).', a: 3, why: '\\(5\\sqrt{3} - 2\\sqrt{3} = 3\\sqrt{3}\\).' },
  ],
});
