// Area model: a unit square cut into b columns and d rows. a/b × c/d is the overlap.
FD.add({
  id: 'muldiv',
  title: 'Multiplying and dividing fractions',
  tab: 'Multiply & divide',
  icon: 'frac',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Reciprocal', 'The fraction turned upside down. The reciprocal of \\(\\tfrac{3}{5}\\) is \\(\\tfrac{5}{3}\\); the reciprocal of 4 is \\(\\tfrac{1}{4}\\).'],
    ['Cancelling', 'Dividing a numerator and a denominator by a common factor before multiplying, to keep numbers small.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim md-s">
        <div class="md-grid">
          <svg class="md-sq" viewBox="0 0 300 300" role="img" aria-label="Area model for multiplying fractions"><g id="cells"></g><rect class="fb-frame" x="10" y="10" width="280" height="280" rx="6"/></svg>
          <div class="md-side"><div class="mbig" id="big"></div><p class="verdict" id="msg"></p></div>
        </div>
        <div class="eq-work" id="work"></div>
        <div class="card ctrls" id="try" hidden>
          <label class="ctrl">\\(\\frac{a}{b}\\): a <input type="range" id="ra" min="1" max="7" value="2"><output id="oa">2</output></label>
          <label class="ctrl">b <input type="range" id="rb" min="2" max="8" value="3"><output id="ob">3</output></label>
          <label class="ctrl">\\(\\frac{c}{d}\\): c <input type="range" id="rc" min="1" max="7" value="3"><output id="oc">3</output></label>
          <label class="ctrl">d <input type="range" id="rd" min="2" max="8" value="4"><output id="od">4</output></label>
        </div>
      </div>`;
    const root = el.querySelector('.md-s'), $ = (s) => root.querySelector(s);
    let work = null;
    // stage: 0 = only a/b (columns), 1 = also c/d (rows), 2 = overlap highlighted
    const draw = (a, b, c, d, stage) => {
      const w = 280 / b, h = 280 / d;
      let s = '';
      for (let i = 0; i < b; i++) for (let j = 0; j < d; j++) {
        const col = i < a, row = (d - 1 - j) < c && stage >= 1;
        s += `<rect class="md-c ${col ? 'col' : ''} ${row ? 'row' : ''} ${col && row && stage >= 2 ? 'both' : ''}" x="${10 + i * w}" y="${10 + j * h}" width="${w}" height="${h}"/>`;
      }
      $('#cells').innerHTML = s;
      $('#big').innerHTML = FD.tex(stage < 1 ? `\\frac{${a}}{${b}}` : stage < 2 ? `\\frac{${c}}{${d}} \\text{ of } \\frac{${a}}{${b}}` : `\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} = \\frac{${a * c}}{${b * d}}`, true);
    };
    const api = {
      draw,
      work(lines) { $('#work').innerHTML = ''; work = lines ? FD.work($('#work'), lines) : null; },
      upto: (i) => work && work.upto(i),
      msg: (t) => { $('#msg').className = 'verdict good'; $('#msg').innerHTML = t; },
      tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); sync(); } else $('#msg').textContent = ''; },
    };
    const sync = () => {
      $('#ra').max = +$('#rb').value - 1; $('#rc').max = +$('#rd').value - 1;
      const [a, b, c, d] = ['#ra', '#rb', '#rc', '#rd'].map((s) => +$(s).value);
      ['a', 'b', 'c', 'd'].forEach((k, i) => { $('#o' + k).textContent = [a, b, c, d][i]; });
      draw(a, b, c, d, 2);
      api.msg(`${a * c} of the ${b * d} small rectangles are in both: \\(${FD.ftex(a * c, b * d)}\\)${FD.gcd(a * c, b * d) > 1 ? ` (simplified from \\(\\tfrac{${a * c}}{${b * d}}\\))` : ''}.`);
    };
    ['#ra', '#rb', '#rc', '#rd'].forEach((s) => $(s).addEventListener('input', sync));
    draw(2, 3, 3, 4, 0);
    return api;
  },
  steps: [
    {
      title: '“Of” means multiply',
      text: '<p>\\(\\frac{3}{4}\\) of \\(\\frac{2}{3}\\) is the same as \\(\\frac{2}{3} \\times \\frac{3}{4}\\).</p><p>Start with \\(\\frac{2}{3}\\) of a square: 2 of 3 columns.</p>',
      async on(a, ctx) { a.tryMode(false); a.work(null); a.draw(2, 3, 3, 4, 0); if (!(await ctx.sleep(1400))) return; a.draw(2, 3, 3, 4, 1); },
    },
    {
      title: 'Count the overlap',
      text: '<p>Now take \\(\\frac{3}{4}\\) of it: 3 of 4 rows. The square has \\(3 \\times 4 = 12\\) small rectangles and \\(2 \\times 3 = 6\\) are in both.</p><p>So \\(\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).</p>',
      async on(a, ctx) {
        a.tryMode(false); a.draw(2, 3, 3, 4, 2);
        a.work([['\\frac{2}{3} \\times \\frac{3}{4} = \\frac{2 \\times 3}{3 \\times 4}', 'top × top, bottom × bottom'], ['= \\frac{6}{12} = \\frac{1}{2}', 'simplify']]);
        a.upto(0); if (!(await ctx.sleep(1400))) return; a.upto(1);
      },
    },
    {
      title: 'Cancel first to save work',
      text: '<p>Before multiplying, you can divide <b>any</b> numerator and <b>any</b> denominator by a common factor. This is called <b>cancelling</b>.</p>',
      tip: 'Whole numbers: write 6 as \\(\\frac{6}{1}\\). Mixed numbers: change to improper fractions first.',
      async on(a, ctx) {
        a.tryMode(false); a.draw(2, 3, 3, 4, 2);
        a.work([['\\frac{4}{9} \\times \\frac{3}{8}', ''], ['= \\frac{\\cancel{4}^{\\,1}}{\\cancel{9}_{\\,3}} \\times \\frac{\\cancel{3}^{\\,1}}{\\cancel{8}_{\\,2}}', '4 and 8 ÷ 4; 3 and 9 ÷ 3'], ['= \\frac{1}{6}', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Dividing: keep, change, flip',
      text: '<p>To divide by a fraction, <b>multiply by its reciprocal</b>:</p><p><b>Keep</b> the first fraction, <b>change</b> ÷ to ×, <b>flip</b> the second fraction.</p><p>It works for whole numbers too: dividing by 5 is the same as multiplying by the <b>unit fraction</b> \\(\\frac{1}{5}\\), so \\(3 \\div 5 = 3 \\times \\frac{1}{5} = \\frac{3}{5}\\).</p>',
      tip: 'Check it makes sense: \\(\\frac{3}{4} \\div \\frac{1}{8}\\) asks “how many eighths fit in three quarters?” The answer is 6.',
      async on(a, ctx) {
        a.tryMode(false); a.draw(3, 4, 1, 2, 0);
        a.work([['\\frac{3}{4} \\div \\frac{2}{5}', ''], ['= \\frac{3}{4} \\times \\frac{5}{2}', 'keep, change, flip'], ['= \\frac{15}{8} = 1\\tfrac{7}{8}', '']]);
        for (let i = 0; i < 3; i++) { a.upto(i); if (!(await ctx.sleep(1400))) return; }
      },
    },
    {
      title: 'Try it: the area model',
      text: '<p>Change the two fractions. The overlap shows the answer to \\(\\frac{a}{b} \\times \\frac{c}{d}\\).</p>',
      tip: 'Is the answer bigger or smaller than both fractions? Why?',
      on(a) { a.tryMode(true); },
    },
  ],
});

const mulGen = () => {
  const b = FD.rnd(2, 9), d = FD.rnd(2, 9), a = FD.rnd(1, b - 1), c = FD.rnd(1, d - 1);
  return { type: 'num', q: `Work out \\(\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}}\\). Give your answer in its simplest form.`, a: (a * c) / (b * d), form: 'simplest', show: `\\(${FD.ftex(a * c, b * d)}\\)`, hint: 'Type a fraction like 3/10.', why: `\\(\\dfrac{${a} \\times ${c}}{${b} \\times ${d}} = \\dfrac{${a * c}}{${b * d}}${FD.gcd(a * c, b * d) > 1 ? ` = ${FD.ftex(a * c, b * d)}` : ''}\\)` };
};
const divGen = () => {
  const b = FD.rnd(2, 9), d = FD.rnd(2, 9), a = FD.rnd(1, b - 1), c = FD.rnd(1, d - 1);
  return { type: 'num', q: `Work out \\(\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}}\\). Give your answer in its simplest form.`, a: (a * d) / (b * c), form: 'simplest', show: `\\(${FD.ftex(a * d, b * c)}\\)`, hint: 'Type a fraction like 15/8, or a mixed number like 1 7/8.', why: `Keep, change, flip: \\(\\dfrac{${a}}{${b}} \\times \\dfrac{${d}}{${c}} = \\dfrac{${a * d}}{${b * c}}${FD.gcd(a * d, b * c) > 1 ? ` = ${FD.ftex(a * d, b * c)}` : ''}\\)` };
};
FD.practice({ section: 'muldiv', gens: [mulGen, divGen] });

FD.check({
  section: 'muldiv',
  items: [
    { type: 'num', q: 'Work out \\(\\frac{2}{5} \\times \\frac{3}{7}\\).', a: 6 / 35, form: 'simplest', show: '\\(\\tfrac{6}{35}\\)', why: '\\(\\frac{2 \\times 3}{5 \\times 7} = \\frac{6}{35}\\).' },
    { type: 'num', q: 'Work out \\(\\frac{5}{6} \\div \\frac{10}{9}\\).', a: 3 / 4, form: 'simplest', show: '\\(\\tfrac{3}{4}\\)', why: '\\(\\frac{5}{6} \\times \\frac{9}{10} = \\frac{45}{60} = \\frac{3}{4}\\).' },
    { type: 'mcq', q: 'What is the reciprocal of \\(\\frac{4}{7}\\)?', opts: ['\\(\\frac{7}{4}\\)', '\\(\\frac{4}{7}\\)', '\\(-\\frac{4}{7}\\)', '\\(\\frac{3}{7}\\)'], why: 'Turn the fraction upside down.' },
    { type: 'mcq', q: 'Which calculation gives the same answer as \\(7 \\div 4\\)?', opts: ['\\(7 \\times \\frac{1}{4}\\)', '\\(4 \\times \\frac{1}{7}\\)', '\\(7 \\times 4\\)', '\\(\\frac{1}{7} \\times \\frac{1}{4}\\)'], why: 'Dividing by 4 is the same as multiplying by its reciprocal, the unit fraction \\(\\frac{1}{4}\\).' },
    { type: 'num', q: 'Work out \\(1\\tfrac{1}{2} \\times 2\\tfrac{2}{3}\\).', a: 4, why: '\\(\\frac{3}{2} \\times \\frac{8}{3} = \\frac{24}{6} = 4\\).' },
  ],
});
