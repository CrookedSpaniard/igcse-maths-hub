// Index laws shown with x-chips: x^m × x^n, x^m ÷ x^n (cancelling) and (x^m)^n (groups).
FD.add({
  id: 'index-laws',
  title: 'Index laws',
  tab: 'Index laws',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Index (power)', 'The small number that says how many times to multiply: in \\(x^5\\) the index is 5. Plural: indices.'],
    ['Base', 'The number or letter being multiplied: in \\(x^5\\) the base is \\(x\\).'],
    ['Zero index', 'Anything (except 0) to the power 0 is 1: \\(x^0 = 1\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'il-s',
      vis: '<div class="il-chips" data-k="chips"></div>',
      tryHtml: `<div class="seg-row" data-k="law"><button class="btn primary" data-l="0">Multiply</button><button class="btn" data-l="1">Divide</button><button class="btn" data-l="2">Power of a power</button></div>
        <label class="ctrl">m <input type="range" data-k="m" min="1" max="6" value="3"><output data-k="om">3</output></label>
        <label class="ctrl">n <input type="range" data-k="n" min="1" max="4" value="2"><output data-k="on">2</output></label>`,
    });
    const chips = a.$('[data-k="chips"]');
    const xs = (k, cls = '') => Array.from({ length: k }, () => `<span class="il-x ${cls}">\\(x\\)</span>`).join('');
    // law 0: multiply, 1: divide, 2: power of a power; stage 0: question, 1: expanded, 2: answer
    a.show = (law, m, n, stage) => {
      const q = [`x^{${m}} \\times x^{${n}}`, `x^{${m}} \\div x^{${n}}`, `(x^{${m}})^{${n}}`][law];
      const r = [m + n, m - n, m * n][law];
      if (law === 0) chips.innerHTML = stage ? `<span class="il-g">${xs(m)}</span><b>×</b><span class="il-g">${xs(n)}</span>` : '';
      else if (law === 1) chips.innerHTML = stage ? `<span class="il-frac"><span class="il-g">${xs(Math.min(n, m), stage > 1 ? 'gone' : '')}${xs(m - Math.min(n, m))}</span><span class="il-g">${xs(n, stage > 1 ? 'gone' : '')}</span></span>` : '';
      else chips.innerHTML = stage ? Array.from({ length: n }, () => `<span class="il-g">${xs(m)}</span>`).join('') : '';
      FD.typeset(chips);
      a.big(stage > 1 ? `${q} = x^{${[`${m} + ${n}`, `${m} - ${n}`, `${m} \\times ${n}`][law]}} = x^{${r}}` : q);
    };
    let law = 0;
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, n = Math.min(+a.$('[data-k="n"]').value, law === 1 ? m : 9);
      a.$('[data-k="n"]').value = n;
      a.$('[data-k="om"]').textContent = m; a.$('[data-k="on"]').textContent = n;
      a.show(law, m, n, 2);
      a.msg(law === 1 ? `${n} pairs cancel, leaving ${m - n} \\(x\\)'s${m === n ? ': \\(x^0 = 1\\)' : ''}.` : law === 0 ? `${m} + ${n} = ${m + n} \\(x\\)'s multiplied together.` : `${n} groups of ${m}: \\(${m * n}\\) \\(x\\)'s.`);
    };
    a.$('[data-k="law"]').addEventListener('click', (e) => {
      const b = e.target.closest('.btn'); if (!b) return;
      law = +b.dataset.l;
      a.$('[data-k="law"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b));
      sync();
    });
    a.$('[data-k="m"]').addEventListener('input', sync);
    a.$('[data-k="n"]').addEventListener('input', sync);
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Multiplying: add the powers',
      text: '<p>\\(x^3 \\times x^2\\) means three \\(x\\)\'s times two \\(x\\)\'s: five \\(x\\)\'s altogether.</p><p>\\(x^m \\times x^n = x^{m + n}\\)</p>',
      async on(a, ctx) { a.tryMode(false); a.show(0, 3, 2, 0); for (const s of [1, 2]) { if (!(await ctx.sleep(1300))) return; a.show(0, 3, 2, s); } },
    },
    {
      title: 'Dividing: subtract the powers',
      text: '<p>\\(x^5 \\div x^2\\): write it as a fraction. Two \\(x\\)\'s on top cancel with the two below.</p><p>\\(x^m \\div x^n = x^{m - n}\\)</p>',
      tip: '\\(x^3 \\div x^3 = x^0\\), but anything divided by itself is 1. So \\(x^0 = 1\\).',
      async on(a, ctx) { a.tryMode(false); a.show(1, 5, 2, 0); for (const s of [1, 2]) { if (!(await ctx.sleep(1300))) return; a.show(1, 5, 2, s); } },
    },
    {
      title: 'Power of a power: multiply',
      text: '<p>\\((x^4)^3\\) means three groups of \\(x^4\\): \\(4 \\times 3 = 12\\) \\(x\\)\'s.</p><p>\\((x^m)^n = x^{mn}\\)</p>',
      async on(a, ctx) { a.tryMode(false); a.show(2, 4, 3, 0); for (const s of [1, 2]) { if (!(await ctx.sleep(1300))) return; a.show(2, 4, 3, s); } },
    },
    {
      title: 'With numbers in front',
      text: '<p>Deal with the numbers and the letters separately. In a bracket raised to a power, the number is raised to the power too.</p>',
      tip: 'A common mistake: \\((2x^3)^4\\) is <b>not</b> \\(2x^{12}\\). The 2 is raised to the power 4 as well.',
      on: FD.walk([['3x^4 \\times 5x^2 = 15x^6', '3 × 5, then add powers'], ['\\frac{12y^7}{4y^3} = 3y^4', '12 ÷ 4, then subtract powers'], ['(2x^3)^4 = 2^4 x^{12} = 16x^{12}', 'both parts to the power 4'], ['a^2b^3 \\times a^4b = a^6b^4', 'each letter on its own']], (a) => { a.show(0, 1, 1, 0); a.big(''); }),
    },
    {
      title: 'Zero and negative powers',
      text: '<p>Keep dividing: \\(x^2 \\div x^3 = x^{-1}\\), but it is also \\(\\frac{x \\times x}{x \\times x \\times x} = \\frac{1}{x}\\).</p><p>So \\(x^0 = 1\\), \\(x^{-1} = \\frac{1}{x}\\) and \\(x^{-2} = \\frac{1}{x^2}\\).</p>',
      tip: 'The index laws work for negative powers too: \\(x^5 \\times x^{-2} = x^3\\).',
      on: FD.walk([['x^3 \\div x^3 = x^0 = 1', 'anything ÷ itself'], ['x^2 \\div x^3 = x^{-1} = \\frac{1}{x}', 'one x left on the bottom'], ['5^{-2} = \\frac{1}{5^2} = \\frac{1}{25}', ''], ['x^5 \\times x^{-2} = x^{3}', 'add: 5 + (−2)']], (a) => { a.show(1, 2, 2, 2); a.big(''); }),
    },
    {
      title: 'Try it: see why the laws work',
      text: '<p>Choose a law and move the sliders. Count the \\(x\\)\'s to check the power.</p>',
      tip: 'For divide, set m = n. What is left?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'index-laws',
  gens: [
    () => { const m = FD.rnd(2, 9), n = FD.rnd(2, 9), p = FD.rnd(2, 6), q = FD.rnd(2, 6), x = FD.pick(['x', 'y', 'a', 'p']); return { type: 'alg', q: `Simplify \\(${p}${x}^{${m}} \\times ${q}${x}^{${n}}\\)`, a: `${p * q}${x}^${m + n}`, show: `\\(${p * q}${x}^{${m + n}}\\)`, hint: 'Type powers with ^, e.g. 12x^7.', why: `\\(${p} \\times ${q} = ${p * q}\\) and \\(${x}^{${m}} \\times ${x}^{${n}} = ${x}^{${m} + ${n}} = ${x}^{${m + n}}\\).` }; },
    () => { const n = FD.rnd(2, 6), m = n + FD.rnd(1, 6), q = FD.rnd(2, 5), r = FD.rnd(2, 6), x = FD.pick(['x', 'y', 'm', 't']); return { type: 'alg', q: `Simplify \\(\\dfrac{${q * r}${x}^{${m}}}{${q}${x}^{${n}}}\\)`, a: `${r}${x}^${m - n}`, show: `\\(${r}${x}^{${m - n}}\\)`, hint: 'Type powers with ^.', why: `\\(${q * r} \\div ${q} = ${r}\\) and \\(${x}^{${m}} \\div ${x}^{${n}} = ${x}^{${m} - ${n}} = ${x}^{${m - n}}\\).` }; },
    () => { const m = FD.rnd(2, 5), n = FD.rnd(2, 4), c = FD.rnd(2, 3), x = FD.pick(['x', 'y', 'a']); return { type: 'alg', q: `Simplify \\((${c}${x}^{${m}})^{${n}}\\)`, a: `${c ** n}${x}^${m * n}`, show: `\\(${c ** n}${x}^{${m * n}}\\)`, hint: 'Type powers with ^.', why: `\\(${c}^{${n}} = ${c ** n}\\) and \\((${x}^{${m}})^{${n}} = ${x}^{${m} \\times ${n}} = ${x}^{${m * n}}\\).` }; },
  ],
});

FD.check({
  section: 'index-laws',
  items: [
    { type: 'alg', q: 'Simplify \\(y^6 \\times y^3\\)', a: 'y^9', show: '\\(y^9\\)', why: 'Add the powers: \\(6 + 3 = 9\\).' },
    { type: 'alg', q: 'Simplify \\(\\frac{a^{10}}{a^4}\\)', a: 'a^6', show: '\\(a^6\\)', why: 'Subtract the powers: \\(10 - 4 = 6\\).' },
    { type: 'mcq', q: 'Simplify \\((3p^2)^3\\)', opts: ['\\(27p^6\\)', '\\(3p^6\\)', '\\(9p^5\\)', '\\(27p^5\\)'], why: '\\(3^3 = 27\\) and \\((p^2)^3 = p^6\\).' },
    { type: 'num', q: 'Work out the value of \\(m^0\\) when \\(m = 7\\).', a: 1, why: 'Any non-zero number to the power 0 is 1.' },
    { type: 'num', q: 'Work out \\(2^{-3}\\).', a: 1 / 8, show: '\\(\\tfrac18\\)', hint: 'Type a fraction like 1/9.', why: '\\(2^{-3} = \\frac{1}{2^3} = \\frac18\\).' },
    { type: 'alg', q: 'Simplify \\(2a^3b \\times 4ab^2\\)', a: '8a^4b^3', show: '\\(8a^4b^3\\)', why: '\\(2 \\times 4 = 8\\), \\(a^3 \\times a = a^4\\), \\(b \\times b^2 = b^3\\).' },
  ],
});
