FD.add({
  id: 'addsub',
  title: 'Adding and subtracting fractions',
  tab: 'Add & subtract',
  icon: 'frac',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Lowest common denominator', 'The lowest common multiple (LCM) of the denominators. It keeps the numbers small.'],
    ['Mixed number', 'A whole number and a fraction, like \\(2\\tfrac14\\). Change it to an improper fraction before calculating.'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim as-s">
        <div class="as-bars">
          <div class="as-row"><span class="as-l" id="l1"></span><div class="fb-host" id="b1"></div></div>
          <div class="as-row"><span class="as-l" id="l2"></span><div class="fb-host" id="b2"></div></div>
          <div class="as-row as-sum" id="r3" hidden><span class="as-l" id="l3"></span><div class="fb-host" id="b3"></div></div>
          <p class="small muted as-over" id="over" hidden></p>
        </div>
        <div class="eq-work" id="work"></div>
        <div class="card ctrls" id="try" hidden>
          <div class="as-pick">
            <label>\\(\\frac{a}{b}\\) <select id="f1"></select></label>
            <span class="seg" id="op"><button data-v="+">+</button><button data-v="−">−</button></span>
            <label>\\(\\frac{c}{d}\\) <select id="f2"></select></label>
            <button class="btn primary" id="go">Show the method ▶</button>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.as-s'), $ = (s) => root.querySelector(s);
    const bars = [FD.fracBar($('#b1')), FD.fracBar($('#b2')), FD.fracBar($('#b3'))];
    let work = null, run = 0;
    const lbl = (id, t) => { $(id).innerHTML = FD.tex(t); };
    const FR = []; for (let d = 2; d <= 10; d++) for (let n = 1; n < d; n++) if (FD.gcd(n, d) === 1) FR.push([n, d]);
    ['#f1', '#f2'].forEach((s, k) => { $(s).innerHTML = FR.map(([n, d]) => `<option value="${n}/${d}">${n}/${d}</option>`).join(''); $(s).value = k ? '1/4' : '2/3'; });
    let op = '+';
    FD.segSet($('#op'), op);
    $('#op').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; op = b.dataset.v; FD.segSet($('#op'), op); });

    // Animate a + or − of a/b and c/d: show both, rewrite with the LCM, then combine.
    const api = {
      async demo(a, b, c, d, sign, ctx) {
        const my = ++run, alive = () => my === run && (!ctx || ctx.alive());
        const L = FD.lcm(b, d), A = (a * L) / b, C = (c * L) / d, R = sign === '+' ? A + C : A - C;
        $('#r3').hidden = true;
        bars[0](a, b); bars[1](c, d); lbl('#l1', `\\frac{${a}}{${b}}`); lbl('#l2', `${sign === '+' ? '+' : '-'}\\;\\frac{${c}}{${d}}`);
        api.work([
          [`\\frac{${a}}{${b}} ${sign === '+' ? '+' : '-'} \\frac{${c}}{${d}}`, `the LCM of ${b} and ${d} is ${L}`],
          [`= \\frac{${A}}{${L}} ${sign === '+' ? '+' : '-'} \\frac{${C}}{${L}}`, 'equivalent fractions'],
          [`= \\frac{${R}}{${L}}`, `${sign === '+' ? 'add' : 'subtract'} the numerators only`],
          ...(FD.gcd(R, L) > 1 ? [[`= ${FD.ftex(R, L)}`, 'simplify']] : []),
          ...(R > L && FD.simp(R, L)[1] !== 1 ? [[`= ${FD.ftex(R, L, true)}`, 'as a mixed number']] : []),
        ]);
        api.upto(0);
        await FD.wait(1300); if (!alive()) return;
        bars[0](a, b, L / b); bars[1](c, d, L / d); lbl('#l1', `\\frac{${A}}{${L}}`); lbl('#l2', `${sign === '+' ? '+' : '-'}\\;\\frac{${C}}{${L}}`); api.upto(1);
        await FD.wait(1500); if (!alive()) return;
        $('#r3').hidden = false;
        // One bar shows at most 1 whole; beyond that the label says how much is left over.
        bars[2](Math.min(R, L), L); lbl('#l3', `=\\;\\frac{${R}}{${L}}`);
        $('#over').hidden = R <= L; $('#over').innerHTML = `The bar shows 1 whole: \\(\\tfrac{${R}}{${L}}\\) is 1 whole and \\(\\tfrac{${R - L}}{${L}}\\) more.`; api.upto(2);
        for (let i = 3; i < work.el.children.length; i++) { await FD.wait(1200); if (!alive()) return; api.upto(i); }
      },
      work(lines) { $('#work').innerHTML = ''; work = lines ? FD.work($('#work'), lines) : null; },
      upto: (i) => work && work.upto(i),
      tryMode(on) { $('#try').hidden = !on; },
      stop() { run++; },
    };
    $('#go').addEventListener('click', () => {
      const [a, b] = $('#f1').value.split('/').map(Number), [c, d] = $('#f2').value.split('/').map(Number);
      if (op === '−' && a * d < c * b) { FD.toast(root, 'Choose a smaller second fraction: this lesson keeps answers positive.'); return; }
      api.demo(a, b, c, d, op === '+' ? '+' : '−');
    });
    return api;
  },
  steps: [
    {
      title: 'You can only add parts of the same size',
      text: '<p>\\(\\frac{2}{3} + \\frac{1}{4}\\): thirds and quarters are different sizes, so you cannot just add the numbers.</p><p>First make the denominators <b>the same</b>. Use the <b>lowest common multiple</b> of 3 and 4, which is 12.</p>',
      tip: 'Common mistake: \\(\\frac{2}{3} + \\frac{1}{4} \\ne \\frac{3}{7}\\). Never add the denominators.',
      on(a, ctx) { a.tryMode(false); return a.demo(2, 3, 1, 4, '+', ctx); },
    },
    {
      title: 'Subtracting works the same way',
      text: '<p>\\(\\frac{5}{6} - \\frac{1}{4}\\): the LCM of 6 and 4 is 12.</p><p>Rewrite both fractions as twelfths, then <b>subtract the numerators</b>. The denominator stays 12.</p>',
      on(a, ctx) { a.tryMode(false); return a.demo(5, 6, 1, 4, '−', ctx); },
    },
    {
      title: 'When the answer is more than 1',
      text: '<p>\\(\\frac{3}{4} + \\frac{5}{6} = \\frac{9}{12} + \\frac{10}{12} = \\frac{19}{12}\\).</p><p>Write the answer as a <b>mixed number</b>: \\(1\\tfrac{7}{12}\\).</p>',
      on(a, ctx) { a.tryMode(false); return a.demo(3, 4, 5, 6, '+', ctx); },
    },
    {
      title: 'Mixed numbers',
      text: '<p>With mixed numbers, change them to <b>improper fractions</b> first. Then use a common denominator as before.</p>',
      tip: 'Exam tip: show every line of working. A correct method earns marks even if you slip at the end.',
      async on(a, ctx) {
        a.tryMode(false); a.stop();
        a.work([['2\\tfrac{1}{3} + 1\\tfrac{3}{4}', ''], ['= \\frac{7}{3} + \\frac{7}{4}', 'improper fractions'], ['= \\frac{28}{12} + \\frac{21}{12}', 'LCM of 3 and 4 is 12'], ['= \\frac{49}{12} = 4\\tfrac{1}{12}', 'add, then a mixed number']]);
        for (let i = 0; i < 4; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Try it: build your own sum',
      text: '<p>Choose two fractions and + or −, then press <b>Show the method</b>.</p>',
      tip: 'Try two fractions with the same denominator, and two whose denominators share no factors.',
      on(a) { a.stop(); a.tryMode(true); },
    },
  ],
});

const addGen = (sign) => () => {
  let a, b, c, d;
  do { b = FD.rnd(2, 10); d = FD.rnd(2, 10); a = FD.rnd(1, b - 1); c = FD.rnd(1, d - 1); } while (b === d || FD.gcd(a, b) > 1 || FD.gcd(c, d) > 1 || (sign < 0 && a * d <= c * b));
  const L = FD.lcm(b, d), A = (a * L) / b, C = (c * L) / d, R = A + sign * C;
  return {
    type: 'num', q: `Work out \\(\\dfrac{${a}}{${b}} ${sign > 0 ? '+' : '-'} \\dfrac{${c}}{${d}}\\). Give your answer in its simplest form.`,
    a: R / L, form: 'simplest', show: `\\(${FD.ftex(R, L)}\\)`, hint: 'Type a fraction like 5/12 (a mixed number like 1 1/4 is fine too).',
    why: `\\(\\dfrac{${a}}{${b}} ${sign > 0 ? '+' : '-'} \\dfrac{${c}}{${d}} = \\dfrac{${A}}{${L}} ${sign > 0 ? '+' : '-'} \\dfrac{${C}}{${L}} = \\dfrac{${R}}{${L}}${FD.gcd(R, L) > 1 ? ` = ${FD.ftex(R, L)}` : ''}\\)`,
  };
};
FD.practice({ section: 'addsub', gens: [addGen(1), addGen(-1)] });

FD.check({
  section: 'addsub',
  items: [
    { type: 'num', q: 'Work out \\(\\frac{1}{3} + \\frac{2}{5}\\).', a: 11 / 15, form: 'simplest', show: '\\(\\tfrac{11}{15}\\)', why: '\\(\\frac{5}{15} + \\frac{6}{15} = \\frac{11}{15}\\).' },
    { type: 'num', q: 'Work out \\(\\frac{7}{8} - \\frac{1}{6}\\).', a: 17 / 24, form: 'simplest', show: '\\(\\tfrac{17}{24}\\)', why: 'LCM of 8 and 6 is 24: \\(\\frac{21}{24} - \\frac{4}{24} = \\frac{17}{24}\\).' },
    { type: 'mcq', q: 'A student writes \\(\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}\\). What is the mistake?', opts: ['They added the denominators', 'They used the wrong common denominator', 'They forgot to simplify', 'There is no mistake'], why: 'Change to sixths: \\(\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}\\).' },
    { type: 'num', q: 'Work out \\(1\\tfrac{1}{2} + 2\\tfrac{2}{3}\\). Give your answer as a mixed number.', a: 25 / 6, form: 'mixed', show: '\\(4\\tfrac{1}{6}\\)', hint: 'Type it like 2 3/4.', why: '\\(\\frac{3}{2} + \\frac{8}{3} = \\frac{9}{6} + \\frac{16}{6} = \\frac{25}{6} = 4\\tfrac{1}{6}\\).' },
  ],
});
