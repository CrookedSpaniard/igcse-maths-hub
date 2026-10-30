// A fraction bar: n/d with every part cut into k pieces. Shaded length never changes.
FD.fracBar = (host) => {
  host.innerHTML = `<svg class="fbar" viewBox="0 0 600 96" role="img"><g class="fb-pieces"></g><rect class="fb-frame" x="10" y="14" width="580" height="64" rx="8"/></svg>`;
  const g = host.querySelector('.fb-pieces'), svg = host.querySelector('svg');
  let prev = { d: 0, k: 0 };
  return (n, d, k = 1) => {
    const N = d * k, w = 580 / N;
    g.innerHTML = Array.from({ length: N }, (_, i) => `<rect class="fb-p ${i < n * k ? 'on' : ''}" x="${10 + i * w}" y="14" width="${w}" height="64"/>`).join('')
      + Array.from({ length: N - 1 }, (_, i) => { const x = 10 + (i + 1) * w, major = (i + 1) % k === 0; return `<line class="fb-cut ${major ? 'major' : 'minor'} ${prev.d === d && prev.k !== k && !major ? 'new' : ''}" x1="${x}" y1="14" x2="${x}" y2="78"/>`; }).join('');
    svg.setAttribute('aria-label', `${n * k} of ${N} equal parts shaded`);
    prev = { d, k };
  };
};

FD.add({
  id: 'equivalent',
  title: 'Equivalent fractions and simplifying',
  tab: 'Equivalent',
  icon: 'frac',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Numerator', 'The top number: how many parts you have.'],
    ['Denominator', 'The bottom number: how many equal parts the whole is split into.'],
    ['Equivalent fractions', 'Fractions that are the same amount, like \\(\\tfrac34\\) and \\(\\tfrac68\\).'],
    ['Simplest form', 'A fraction that cannot be simplified any more: the only common factor of top and bottom is 1.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim eq-s">
        <div class="eq-top"><div class="mbig" id="big"></div><p class="verdict" id="msg"></p></div>
        <div class="fb-host" id="bar"></div>
        <div class="eq-work" id="work"></div>
        <div class="card ctrls eq-try" id="try" hidden>
          <label class="ctrl">Numerator <input type="range" id="rn" min="1" max="11" value="3"><output id="on">3</output></label>
          <label class="ctrl">Denominator <input type="range" id="rd" min="2" max="12" value="4"><output id="od">4</output></label>
          <label class="ctrl">Cut each part into <input type="range" id="rk" min="1" max="5" value="1"><output id="ok">1</output></label>
          <div class="chk-btns"><button class="btn" id="bSimp">Simplify fully</button></div>
        </div>
      </div>`;
    const root = el.querySelector('.eq-s'), $ = (s) => root.querySelector(s);
    const bar = FD.fracBar($('#bar'));
    let n = 3, d = 4, k = 1, work = null;
    const show = () => {
      bar(n, d, k);
      $('#big').innerHTML = FD.tex(k === 1 ? `\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}} = \\frac{${n} \\times ${k}}{${d} \\times ${k}} = \\frac{${n * k}}{${d * k}}`, true);
    };
    const setWork = (lines) => { $('#work').innerHTML = ''; work = lines ? FD.work($('#work'), lines) : null; };
    const api = {
      set(nn, dd, kk = 1) { n = nn; d = dd; k = kk; $('#msg').textContent = ''; show(); },
      work: setWork,
      upto: (i) => work && work.upto(i),
      msg: (t, cls = 'good') => { $('#msg').className = 'verdict ' + cls; $('#msg').innerHTML = t; },
      tryMode(on) {
        $('#try').hidden = !on;
        if (on) { setWork(null); sync(); }
      },
    };
    const sync = () => {
      d = +$('#rd').value; $('#rn').max = d - 1;
      n = Math.min(+$('#rn').value, d - 1); k = +$('#rk').value;
      $('#on').textContent = n; $('#od').textContent = d; $('#ok').textContent = k;
      show();
      const g = FD.gcd(n, d);
      api.msg(g > 1 ? `\\(\\frac{${n}}{${d}}\\) can be simplified: ${n} and ${d} have a common factor of ${g}.` : `\\(\\frac{${n}}{${d}}\\) is already in its simplest form.`, g > 1 ? 'bad' : 'good');
    };
    ['#rn', '#rd', '#rk'].forEach((s) => $(s).addEventListener('input', sync));
    $('#bSimp').addEventListener('click', () => {
      const t = n * k, b = d * k, g = FD.gcd(t, b);
      $('#rn').value = t / g; $('#rd').value = b / g; $('#rk').value = 1;
      sync();
      api.msg(`\\(\\frac{${t}}{${b}} = \\frac{${t} \\div ${g}}{${b} \\div ${g}} = \\frac{${t / g}}{${b / g}}\\) · divided top and bottom by the HCF, ${g}.`);
    });
    show();
    return api;
  },
  steps: [
    {
      title: 'What a fraction means',
      text: `<p>The <b>denominator</b> (bottom) tells you how many <b>equal parts</b> the whole is cut into. The <b>numerator</b> (top) tells you how many parts you have.</p>
             <p>\\(\\frac{3}{4}\\): the bar is cut into 4 equal parts and 3 are shaded.</p>`,
      async on(a, ctx) { a.tryMode(false); a.work(null); a.set(1, 4); for (const t of [2, 3]) { if (!(await ctx.sleep(700))) return; a.set(t, 4); } },
    },
    {
      title: 'Cut every part in two',
      text: `<p>Now cut each quarter into 2 pieces. There are <b>8</b> pieces and <b>6</b> are shaded.</p>
             <p>The shaded length has not changed, so \\(\\frac{3}{4} = \\frac{6}{8}\\). These are <b>equivalent fractions</b>.</p>`,
      async on(a, ctx) { a.tryMode(false); a.work(null); a.set(3, 4, 1); if (!(await ctx.sleep(900))) return; a.set(3, 4, 2); },
    },
    {
      title: 'Cut every part in three',
      text: '<p>Cut each quarter into 3 pieces instead: \\(\\frac{3}{4} = \\frac{9}{12}\\). Same amount again.</p><p>Look at the numbers: both the top and the bottom were <b>multiplied by 3</b>.</p>',
      async on(a, ctx) { a.tryMode(false); a.work(null); a.set(3, 4, 1); if (!(await ctx.sleep(900))) return; a.set(3, 4, 3); },
    },
    {
      title: 'The rule',
      text: '<p>To make an equivalent fraction, <b>multiply or divide the top and the bottom by the same number</b>.</p><p>Doing the same to both keeps the fraction the same size.</p>',
      tip: 'Never add the same number to top and bottom: \\(\\frac{1}{2}\\) and \\(\\frac{2}{3}\\) are not equal!',
      async on(a, ctx) {
        a.tryMode(false); a.set(3, 4, 2);
        a.work([['\\frac{3}{4} = \\frac{3 \\times 2}{4 \\times 2} = \\frac{6}{8}', 'multiply both by 2'], ['\\frac{3}{4} = \\frac{3 \\times 5}{4 \\times 5} = \\frac{15}{20}', 'multiply both by 5']]);
        a.upto(0); if (!(await ctx.sleep(1400))) return; a.upto(1);
      },
    },
    {
      title: 'Simplifying a fraction',
      text: '<p>To <b>simplify</b>, divide the top and bottom by a common factor. Use the <b>highest common factor (HCF)</b> to do it in one step.</p><p>\\(\\frac{18}{24}\\): the HCF of 18 and 24 is 6.</p>',
      tip: 'Simplest form means the only common factor left is 1.',
      async on(a, ctx) {
        a.tryMode(false); a.set(3, 4, 6);
        a.work([['\\frac{18}{24}', 'HCF of 18 and 24 is 6'], ['= \\frac{18 \\div 6}{24 \\div 6}', 'divide top and bottom by 6'], ['= \\frac{3}{4}', 'simplest form']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (i === 2) a.set(3, 4, 1); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: make your own',
      text: '<p>Choose a fraction with the sliders, then cut each part into more pieces. The shaded amount stays the same.</p><p>Press <b>Simplify fully</b> to divide by the HCF.</p>',
      tip: 'Try 6/8 with 1 cut, then press Simplify fully.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'equivalent',
  gens: [
    () => { const d = FD.pick([3, 4, 5, 6, 7, 8, 9]), n = FD.rnd(1, d - 1), k = FD.rnd(2, 6), nd = d * k; return { type: 'num', q: `Complete: \\(\\dfrac{${n}}{${d}} = \\dfrac{?}{${nd}}\\)`, a: n * k, why: `\\(${d} \\times ${k} = ${nd}\\), so multiply the top by ${k} too: \\(${n} \\times ${k} = ${n * k}\\).` }; },
    () => { let n, d; do { d = FD.rnd(3, 12); n = FD.rnd(1, d - 1); } while (FD.gcd(n, d) !== 1); const k = FD.rnd(2, 8); return { type: 'num', q: `Write \\(\\dfrac{${n * k}}{${d * k}}\\) in its simplest form.`, a: n / d, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 3/4.', why: `The HCF of ${n * k} and ${d * k} is ${k}. \\(\\dfrac{${n * k} \\div ${k}}{${d * k} \\div ${k}} = \\dfrac{${n}}{${d}}\\)` }; },
    () => { const d = FD.pick([4, 5, 6, 8, 10]), n = FD.rnd(1, d - 1), k = FD.rnd(2, 5), wrongN = n + k, wrongD = d + k; return { type: 'mcq', q: `Which fraction is equivalent to \\(\\dfrac{${n}}{${d}}\\)?`, opts: [`\\(\\dfrac{${n * k}}{${d * k}}\\)`, `\\(\\dfrac{${wrongN}}{${wrongD}}\\)`, `\\(\\dfrac{${n * k}}{${d}}\\)`, `\\(\\dfrac{${d}}{${n}}\\)`], why: `Multiply the top and the bottom by ${k}. Adding the same number (\\(\\tfrac{${wrongN}}{${wrongD}}\\)) does not give an equivalent fraction.` }; },
  ],
});

FD.check({
  section: 'equivalent',
  items: [
    { type: 'mcq', q: 'In \\(\\frac{5}{8}\\), what does the 8 tell you?', opts: ['The whole is split into 8 equal parts', 'You have 8 parts', 'The answer is 8', 'There are 8 wholes'], why: 'The denominator is the number of equal parts in the whole.' },
    { type: 'num', q: 'Complete: \\(\\frac{2}{3} = \\frac{?}{15}\\)', a: 10, why: '\\(3 \\times 5 = 15\\), so \\(2 \\times 5 = 10\\).' },
    { type: 'num', q: 'Write \\(\\frac{24}{36}\\) in its simplest form.', a: 2 / 3, form: 'simplest', show: '\\(\\tfrac{2}{3}\\)', hint: 'Type it like 3/4.', why: 'HCF of 24 and 36 is 12: \\(\\frac{24 \\div 12}{36 \\div 12} = \\frac{2}{3}\\).' },
    { type: 'tf', q: '\\(\\frac{1}{2}\\) and \\(\\frac{2}{3}\\) are equivalent, because 1 was added to the top and the bottom.', a: false, why: 'Adding changes the size. Only multiplying or dividing both by the same number keeps it equal.' },
    { type: 'multi', q: 'Choose the <b>two</b> fractions equal to \\(\\frac{3}{5}\\).', need: 2, opts: [['\\(\\frac{9}{15}\\)', true], ['\\(\\frac{12}{20}\\)', true], ['\\(\\frac{5}{7}\\)', false], ['\\(\\frac{6}{15}\\)', false]], why: '\\(\\frac{9}{15}\\) (×3) and \\(\\frac{12}{20}\\) (×4).' },
  ],
});
