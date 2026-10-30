FD.add({
  id: 'rationalise',
  title: 'Rationalising the denominator',
  tab: 'Rationalising',
  icon: 'frac',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Rationalise', 'Rewrite a fraction so that there is no surd in the denominator.'],
    ['Multiply by 1', '\\(\\dfrac{\\sqrt{a}}{\\sqrt{a}} = 1\\), so multiplying by it does not change the value.'],
    ['Conjugate', 'For \\(a + \\sqrt{b}\\) it is \\(a - \\sqrt{b}\\). Their product has no surd: \\(a^2 - b\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'ra-s', '<div class="mbig" id="eq"></div>', `
      <label class="ctrl">Top <input type="range" id="rt" min="1" max="12" value="6"><output id="ot">6</output></label>
      <label class="ctrl">Bottom \\(\\sqrt{m}\\) <input type="range" id="rm" min="2" max="11" value="3"><output id="om">3</output></label>
      <div class="bd-row"><label>Form <select id="form"><option value="1">top / √m</option><option value="2">top / (k + √m)</option></select></label>
      <label class="ctrl">k <input type="range" id="rk" min="1" max="5" value="2"><output id="ok">2</output></label></div>`, () => sync());
    a.eq = (t) => { a.$('#eq').innerHTML = FD.tex(t, true); };
    const sync = () => {
      const t = +a.$('#rt').value, k = +a.$('#rk').value, form = a.$('#form').value; let m = +a.$('#rm').value;
      if (Number.isInteger(Math.sqrt(m))) { m += 1; a.$('#rm').value = m; }
      if (form === '2' && k * k === m) { m += 1; a.$('#rm').value = m; }
      a.$('#ot').textContent = t; a.$('#om').textContent = m; a.$('#ok').textContent = k;
      if (form === '1') {
        const g = FD.gcd(t, m), [s1, s2] = FD.simp(t, m);
        a.eq(`\\frac{${t}}{\\sqrt{${m}}} \\times \\frac{\\sqrt{${m}}}{\\sqrt{${m}}} = \\frac{${t}\\sqrt{${m}}}{${m}}${g > 1 ? ` = ${s2 === 1 ? FD.stex(s1, m) : `\\frac{${FD.stex(s1, m)}}{${s2}}`}` : ''}`);
        a.msg(`Multiply top and bottom by \\(\\sqrt{${m}}\\): the bottom becomes ${m}.`);
      } else {
        const d = k * k - m;
        a.eq(`\\frac{${t}}{${k} + \\sqrt{${m}}} \\times \\frac{${k} - \\sqrt{${m}}}{${k} - \\sqrt{${m}}} = \\frac{${t}(${k} - \\sqrt{${m}})}{${d}}`);
        a.msg(`The bottom is \\(${k}^2 - ${m} = ${d}\\): no surd left.`);
      }
    };
    ['#rt', '#rm', '#rk', '#form'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.eq('\\frac{6}{\\sqrt{3}}');
    return a;
  },
  steps: [
    {
      title: 'A surd on the bottom',
      text: '<p>\\(\\dfrac{6}{\\sqrt{3}}\\) is correct, but it is usual to give answers with <b>no surd in the denominator</b>.</p><p>Multiply by \\(\\dfrac{\\sqrt{3}}{\\sqrt{3}}\\), which is just 1, so the value does not change.</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{6}{\\sqrt{3}}');
        if (!(await ctx.sleep(1200))) return;
        a.eq('\\frac{6}{\\sqrt{3}} \\times \\frac{\\sqrt{3}}{\\sqrt{3}}');
        await a.lines([['= \\frac{6\\sqrt{3}}{3}', '\\(\\sqrt3 \\times \\sqrt3 = 3\\)'], ['= 2\\sqrt{3}', 'cancel 6 ÷ 3']], ctx, 1300);
      },
    },
    {
      title: 'Another example',
      text: '<p>Rationalise \\(\\dfrac{5}{2\\sqrt{10}}\\). Multiply top and bottom by \\(\\sqrt{10}\\) only.</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{5}{2\\sqrt{10}} \\times \\frac{\\sqrt{10}}{\\sqrt{10}}');
        await a.lines([['= \\frac{5\\sqrt{10}}{2 \\times 10}', ''], ['= \\frac{5\\sqrt{10}}{20} = \\frac{\\sqrt{10}}{4}', 'cancel 5']], ctx, 1300);
      },
    },
    {
      title: 'A bracket on the bottom',
      text: '<p>For \\(\\dfrac{4}{3 + \\sqrt{5}}\\), multiplying by \\(\\sqrt{5}\\) does not work. Use the <b>conjugate</b>: change the sign in the middle.</p><p>\\((3 + \\sqrt{5})(3 - \\sqrt{5}) = 9 - 5 = 4\\), so the surd disappears.</p>',
      tip: 'This uses the difference of two squares from the last section.',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{4}{3 + \\sqrt{5}} \\times \\frac{3 - \\sqrt{5}}{3 - \\sqrt{5}}');
        await a.lines([['= \\frac{4(3 - \\sqrt{5})}{9 - 5}', 'bottom: difference of two squares'], ['= \\frac{4(3 - \\sqrt{5})}{4} = 3 - \\sqrt{5}', '']], ctx, 1400);
      },
    },
    {
      title: 'Exam style: “in the form a + b√c”',
      text: '<p>Show that \\(\\dfrac{2 + \\sqrt{3}}{2 - \\sqrt{3}}\\) can be written as \\(7 + 4\\sqrt{3}\\).</p>',
      async on(a, ctx) {
        a.reset(); a.eq('\\frac{2 + \\sqrt{3}}{2 - \\sqrt{3}} \\times \\frac{2 + \\sqrt{3}}{2 + \\sqrt{3}}');
        await a.lines([['\\text{top: } (2 + \\sqrt{3})^2 = 4 + 4\\sqrt{3} + 3 = 7 + 4\\sqrt{3}', ''], ['\\text{bottom: } 4 - 3 = 1', ''], ['= 7 + 4\\sqrt{3}', '']], ctx, 1500);
      },
    },
    {
      title: 'Try it: rationalise',
      text: '<p>Choose the top, the surd and the form of the denominator. The fraction is multiplied by the right “1”.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'rationalise',
  gens: [
    () => { const m = FD.pick([2, 3, 5, 6, 7, 10]), k = FD.rnd(1, 4), t = m * k; return { type: 'num', q: `Rationalise \\(\\dfrac{${t}}{\\sqrt{${m}}}\\). Write it as \\(k\\sqrt{${m}}\\): what is \\(k\\)?`, a: k, why: `\\(\\dfrac{${t}}{\\sqrt{${m}}} \\times \\dfrac{\\sqrt{${m}}}{\\sqrt{${m}}} = \\dfrac{${t}\\sqrt{${m}}}{${m}} = ${FD.stex(k, m)}\\).` }; },
    () => { const m = FD.pick([2, 3, 5, 7]), t = FD.rnd(1, 9); const [s1, s2] = FD.simp(t, m); return { type: 'mcq', q: `Rationalise \\(\\dfrac{${t}}{\\sqrt{${m}}}\\)`, opts: [`\\(${s2 === 1 ? FD.stex(s1, m) : `\\dfrac{${FD.stex(s1, m)}}{${s2}}`}\\)`, `\\(\\dfrac{${t}}{${m}}\\)`, `\\(${FD.stex(t, m)}\\)`, `\\(\\dfrac{\\sqrt{${m}}}{${t}}\\)`].filter((v, i, s) => s.indexOf(v) === i), why: `Multiply top and bottom by \\(\\sqrt{${m}}\\): \\(\\dfrac{${t}\\sqrt{${m}}}{${m}}\\)${s2 !== m ? ', then simplify' : ''}.` }; },
    () => { let k, m, t, d; do { k = FD.rnd(2, 5); m = FD.pick([2, 3, 5, 6, 7, 10, 11]); d = k * k - m; t = d * FD.rnd(1, 3); } while (d <= 0); const c = t / d; return { type: 'num', q: `Rationalise \\(\\dfrac{${t}}{${k} + \\sqrt{${m}}}\\). Write it as \\(p + q\\sqrt{${m}}\\).`, a: [c * k, -c], fields: ['p =', 'q ='], why: `Multiply by \\(\\dfrac{${k} - \\sqrt{${m}}}{${k} - \\sqrt{${m}}}\\). Bottom: \\(${k * k} - ${m} = ${d}\\). So \\(\\dfrac{${t}(${k} - \\sqrt{${m}})}{${d}} = ${FD.spq(c * k, -c, m)}\\).` }; },
  ],
});

FD.check({
  section: 'rationalise',
  items: [
    { type: 'mcq', q: 'Rationalise \\(\\dfrac{10}{\\sqrt{5}}\\)', opts: ['\\(2\\sqrt{5}\\)', '\\(\\sqrt{2}\\)', '\\(5\\sqrt{2}\\)', '\\(\\dfrac{10}{5}\\)'], why: '\\(\\frac{10\\sqrt5}{5} = 2\\sqrt5\\).' },
    { type: 'mcq', q: 'Rationalise \\(\\dfrac{1}{\\sqrt{2}}\\)', opts: ['\\(\\dfrac{\\sqrt{2}}{2}\\)', '\\(\\sqrt{2}\\)', '\\(\\dfrac{1}{2}\\)', '\\(2\\sqrt{2}\\)'], why: '\\(\\frac{1 \\times \\sqrt2}{\\sqrt2 \\times \\sqrt2} = \\frac{\\sqrt2}{2}\\).' },
    { type: 'mcq', q: 'To rationalise \\(\\dfrac{3}{4 - \\sqrt{7}}\\), multiply top and bottom by…', opts: ['\\(4 + \\sqrt{7}\\)', '\\(\\sqrt{7}\\)', '\\(4 - \\sqrt{7}\\)', '\\(4\\)'], why: 'The conjugate: change the sign in the middle.' },
    { type: 'num', q: '\\(\\dfrac{6}{3 - \\sqrt{3}} = p + q\\sqrt{3}\\). Find \\(p\\) and \\(q\\).', a: [3, 1], fields: ['p =', 'q ='], why: '\\(\\frac{6(3 + \\sqrt3)}{9 - 3} = 3 + \\sqrt3\\).' },
  ],
});
