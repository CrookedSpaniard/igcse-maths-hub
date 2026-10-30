// Counters shared into equal groups: c/d of N = (N ÷ d) × c.
FD.add({
  id: 'amounts',
  title: 'Fractions of amounts',
  tab: 'Of amounts',
  icon: 'frac',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Fraction of an amount', 'To find \\(\\tfrac{c}{d}\\) of an amount: divide by the denominator, then multiply by the numerator.'],
    ['Write as a fraction', 'To write 15 out of 40 as a fraction: \\(\\tfrac{15}{40} = \\tfrac{3}{8}\\). The total goes on the bottom.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim am-s">
        <div class="am-groups" id="groups"></div>
        <div class="mbig" id="big"></div>
        <div class="eq-work" id="work"></div>
        <div class="card ctrls" id="try" hidden>
          <label class="ctrl">Amount <input type="range" id="rN" min="6" max="48" value="24"><output id="oN">24</output></label>
          <label class="ctrl">Numerator <input type="range" id="rc" min="1" max="11" value="3"><output id="oc">3</output></label>
          <label class="ctrl">Denominator <input type="range" id="rd" min="2" max="12" value="4"><output id="od">4</output></label>
          <p class="small muted" id="note"></p>
        </div>
      </div>`;
    const root = el.querySelector('.am-s'), $ = (s) => root.querySelector(s);
    let work = null;
    // stage 0: N counters in one pile; 1: split into d groups; 2: c groups lit
    const draw = (N, c, d, stage) => {
      const per = N / d;
      $('#groups').classList.toggle('split', stage >= 1);
      $('#groups').innerHTML = stage === 0
        ? `<div class="am-g"><span class="am-dots">${'<i></i>'.repeat(N)}</span></div>`
        : Array.from({ length: d }, (_, g) => `<div class="am-g ${stage >= 2 && g < c ? 'on' : ''}"><span class="am-dots">${'<i></i>'.repeat(per)}</span><b>${per}</b></div>`).join('');
      $('#big').innerHTML = FD.tex(stage === 0 ? `\\frac{${c}}{${d}} \\text{ of } ${N}` : stage === 1 ? `${N} \\div ${d} = ${per}` : `\\frac{${c}}{${d}} \\text{ of } ${N} = ${per} \\times ${c} = ${per * c}`, true);
    };
    const api = {
      draw,
      work(lines) { $('#work').innerHTML = ''; work = lines ? FD.work($('#work'), lines) : null; },
      upto: (i) => work && work.upto(i),
      tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); sync(); } },
    };
    const sync = () => {
      const d = +$('#rd').value; $('#rc').max = d - 1;
      const c = Math.min(+$('#rc').value, d - 1);
      let N = +$('#rN').value; N = Math.max(d, Math.round(N / d) * d);
      $('#oN').textContent = N; $('#oc').textContent = c; $('#od').textContent = d;
      $('#note').textContent = N !== +$('#rN').value ? `The amount was rounded to ${N} so it shares equally into ${d} groups.` : '';
      draw(N, c, d, 2);
    };
    ['#rN', '#rc', '#rd'].forEach((s) => $(s).addEventListener('input', sync));
    draw(24, 3, 4, 0);
    return api;
  },
  steps: [
    {
      title: 'Share into equal groups',
      text: '<p>Find \\(\\frac{3}{4}\\) of 24 sweets.</p><p>The denominator is 4, so <b>divide by 4</b>: share the 24 sweets into 4 equal groups of 6.</p>',
      async on(a, ctx) { a.tryMode(false); a.work(null); a.draw(24, 3, 4, 0); if (!(await ctx.sleep(1300))) return; a.draw(24, 3, 4, 1); },
    },
    {
      title: 'Take the groups you need',
      text: '<p>The numerator is 3, so take <b>3 of the groups</b>: \\(6 \\times 3 = 18\\).</p><p>\\(\\frac{3}{4}\\) of 24 = 18.</p>',
      tip: 'Divide by the bottom, times by the top.',
      async on(a, ctx) {
        a.tryMode(false); a.draw(24, 3, 4, 2);
        a.work([['24 \\div 4 = 6', 'one quarter'], ['6 \\times 3 = 18', 'three quarters']]);
        a.upto(0); if (!(await ctx.sleep(1300))) return; a.upto(1);
      },
    },
    {
      title: 'Word problems',
      text: '<p>A school has 840 students. \\(\\frac{2}{5}\\) of them walk to school. How many students <b>do not</b> walk?</p>',
      tip: 'Read the question twice: it asks for the students who do NOT walk.',
      async on(a, ctx) {
        a.tryMode(false); a.draw(20, 2, 5, 2);
        a.work([['840 \\div 5 = 168', 'one fifth'], ['168 \\times 2 = 336', 'walk'], ['840 - 336 = 504', 'do not walk'], ['\\text{or: } \\tfrac{3}{5} \\text{ of } 840 = 504', 'a quicker way']]);
        for (let i = 0; i < 4; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'One amount as a fraction of another',
      text: '<p>Ali scored 18 out of 30 in a test. As a fraction: put the <b>part</b> over the <b>total</b>, then simplify.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.draw(30, 3, 5, 2);
        a.work([['\\frac{18}{30}', 'part over total'], ['= \\frac{3}{5}', 'HCF is 6']]);
        a.upto(0); if (!(await ctx.sleep(1300))) return; a.upto(1);
      },
    },
    {
      title: 'Try it: share the counters',
      text: '<p>Choose an amount and a fraction. The counters are shared into equal groups, and the lit groups show the answer.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'amounts',
  gens: [
    () => { const d = FD.rnd(2, 12), c = FD.rnd(1, d - 1), per = FD.rnd(2, 25), N = per * d; return { type: 'num', q: `Find \\(\\dfrac{${c}}{${d}}\\) of ${N}.`, a: per * c, why: `\\(${N} \\div ${d} = ${per}\\), then \\(${per} \\times ${c} = ${per * c}\\).` }; },
    () => { const d = FD.pick([4, 5, 8, 10]), c = FD.rnd(1, d - 1), per = FD.rnd(5, 40), N = per * d, item = FD.pick([['A bakery made', 'cakes', 'were sold'], ['A farmer has', 'sheep', 'are white'], ['A library has', 'books', 'are fiction']]); return { type: 'num', q: `${item[0]} ${N} ${item[1]}. \\(\\tfrac{${c}}{${d}}\\) of them ${item[2]}. How many ${item[1]} <b>are not</b> in that group?`, a: N - per * c, why: `\\(\\tfrac{${c}}{${d}}\\) of ${N} = \\(${per} \\times ${c} = ${per * c}\\). Then \\(${N} - ${per * c} = ${N - per * c}\\).` }; },
    () => { let p, t; do { t = FD.rnd(10, 60); p = FD.rnd(2, t - 1); } while (FD.gcd(p, t) === 1); const [n, d] = FD.simp(p, t); return { type: 'num', q: `Write ${p} out of ${t} as a fraction in its simplest form.`, a: p / t, form: 'simplest', show: `\\(\\tfrac{${n}}{${d}}\\)`, hint: 'Type it like 3/5.', why: `\\(\\dfrac{${p}}{${t}} = \\dfrac{${n}}{${d}}\\) (divide by ${FD.gcd(p, t)}).` }; },
  ],
});

FD.check({
  section: 'amounts',
  items: [
    { type: 'num', q: 'Find \\(\\frac{5}{8}\\) of 72.', a: 45, why: '\\(72 \\div 8 = 9\\), \\(9 \\times 5 = 45\\).' },
    { type: 'num', q: 'A coat costs £120. In a sale it costs \\(\\frac{1}{3}\\) less. What is the sale price, in pounds?', a: 80, why: '\\(\\frac{1}{3}\\) of 120 = 40, and \\(120 - 40 = 80\\).' },
    { type: 'num', q: 'Write 35 minutes as a fraction of an hour, in its simplest form.', a: 7 / 12, form: 'simplest', show: '\\(\\tfrac{7}{12}\\)', why: 'An hour is 60 minutes: \\(\\frac{35}{60} = \\frac{7}{12}\\).' },
    { type: 'mcq', q: 'Which is the correct method for \\(\\frac{3}{5}\\) of 40?', opts: ['\\(40 \\div 5 \\times 3\\)', '\\(40 \\div 3 \\times 5\\)', '\\(40 \\times 5 \\div 3\\)', '\\(40 - 3 - 5\\)'], why: 'Divide by the denominator, multiply by the numerator.' },
  ],
});
