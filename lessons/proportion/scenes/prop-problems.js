// What happens to y when x is multiplied by m, for each type of proportion.
const PR_KIND = [['y \\propto x', 1], ['y \\propto x^2', 2], ['y \\propto x^3', 3], ['y \\propto \\sqrt{x}', 0.5], ['y \\propto \\frac{1}{x}', -1], ['y \\propto \\frac{1}{x^2}', -2]];
FD.add({
  id: 'prop-problems',
  title: 'Proportion problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Scale factor for y', 'If \\(y \\propto x^n\\) and \\(x\\) is multiplied by \\(m\\), then \\(y\\) is multiplied by \\(m^n\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'pr-q',
      tryHtml: `<div class="seg-row" data-k="kind">${PR_KIND.map(([t], i) => `<button class="btn ${i ? '' : 'primary'}" data-i="${i}">\\(${t}\\)</button>`).join('')}</div>
        <label class="ctrl">Multiply \\(x\\) by <input type="range" data-k="m" min="2" max="5" value="2"><output data-k="om">2</output></label>`,
    });
    let ki = 0;
    const sync = () => {
      const m = +a.$('[data-k="m"]').value; a.$('[data-k="om"]').textContent = m;
      const [t, n] = PR_KIND[ki], f = m ** n;
      const ntex = n === 0.5 ? '\\frac12' : n;
      a.big(`${t}: \\quad x \\times ${m} \\;\\Rightarrow\\; y \\times ${m}^{${ntex}} = ${n > 0 && n % 1 === 0 ? f : n === 0.5 ? `\\sqrt{${m}}` : `\\frac{1}{${m ** -n}}`}`);
      a.msg(n > 0 ? `\\(y\\) gets bigger: multiplied by ${FD.round(f, 3)}.` : `\\(y\\) gets smaller: divided by ${m ** -n}.`, 'good');
    };
    a.$('[data-k="kind"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; ki = +b.dataset.i; a.$('[data-k="kind"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="m"]').addEventListener('input', sync);
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'From words to a formula',
      text: '<p>“The time \\(t\\) for a kettle to boil is inversely proportional to its power \\(P\\).” So \\(t = \\frac{k}{P}\\).</p><p>Use the words to choose the formula, then follow the same steps: find \\(k\\), write the formula, use it.</p>',
      on: FD.walk([['t = \\frac{k}{P}', 'inversely proportional'], ['P = 2000, t = 150: \\; k = 300\\,000', 'k = tP'], ['P = 2500: \\; t = \\frac{300\\,000}{2500} = 120', 'seconds']], (a) => a.big(''), 1500),
    },
    {
      title: 'What happens when x doubles?',
      text: '<p>You don\'t always need \\(k\\). If \\(y \\propto x^2\\) and \\(x\\) is <b>doubled</b>, \\(y\\) is multiplied by \\(2^2 = 4\\).</p><p>If \\(y \\propto \\frac{1}{x}\\) and \\(x\\) is doubled, \\(y\\) is <b>halved</b>.</p>',
      tip: 'A percentage change in \\(x\\) works the same way: \\(x\\) up 10% means \\(x \\times 1.1\\), so \\(y \\propto x^2\\) gives \\(y \\times 1.21\\): up 21%.',
      on: FD.walk([['y \\propto x^2: \\; x \\times 2 \\Rightarrow y \\times 4', ''], ['y \\propto \\frac{1}{x}: \\; x \\times 2 \\Rightarrow y \\div 2', ''], ['y \\propto x^2: \\; x \\times 1.1 \\Rightarrow y \\times 1.21', '+21%']], (a) => a.big(''), 1500),
    },
    {
      title: 'Try it: the multiplier',
      text: '<p>Choose a type of proportion and how much \\(x\\) is multiplied by. See what happens to \\(y\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'prop-problems',
  gens: [
    () => { const [t, n] = FD.pick(PR_KIND.filter(([, n]) => n % 1 === 0)), m = FD.rnd(2, 4), f = m ** n; return { type: 'num', q: `\\(${t}\\). \\(x\\) is multiplied by ${m}. What is \\(y\\) multiplied by?`, a: f, hint: 'A fraction like 1/4 is fine.', show: `\\(${n > 0 ? f : `\\tfrac{1}{${m ** -n}}`}\\)`, why: `\\(y\\) is multiplied by \\(${m}^{${n}} = ${n > 0 ? f : `\\tfrac{1}{${m ** -n}}`}\\).` }; },
    () => { const P1 = FD.pick([1500, 2000, 2400, 3000]), t1 = FD.pick([120, 150, 180, 200]), k = P1 * t1, P2 = FD.pick([1000, 1200, 1500, 2000, 2400, 2500, 3000, 4000].filter((p) => p !== P1 && k % p === 0)); return { type: 'num', q: `The time \\(t\\) seconds to boil some water is inversely proportional to the power \\(P\\) watts. When \\(P = ${P1}\\), \\(t = ${t1}\\). Find \\(t\\) when \\(P = ${P2}\\).`, a: k / P2, why: `\\(t = \\dfrac{k}{P}\\), \\(k = ${P1} \\times ${t1} = ${k}\\). \\(t = \\dfrac{${k}}{${P2}} = ${k / P2}\\).` }; },
  ],
});

FD.check({
  section: 'prop-problems',
  items: [
    { type: 'num', q: '\\(y \\propto x^2\\). \\(x\\) is multiplied by 3. What is \\(y\\) multiplied by?', a: 9, why: '\\(3^2 = 9\\).' },
    { type: 'num', q: '\\(y \\propto \\frac{1}{x}\\). \\(x\\) is multiplied by 5. What is \\(y\\) multiplied by?', a: 1 / 5, show: '\\(\\tfrac15\\)', hint: 'A fraction like 1/4.', why: 'It is divided by 5.' },
    { type: 'mcq', q: 'The force \\(F\\) between two magnets is inversely proportional to the square of the distance \\(d\\). Which formula is correct?', opts: ['\\(F = \\frac{k}{d^2}\\)', '\\(F = kd^2\\)', '\\(F = \\frac{k}{d}\\)', '\\(F = k\\sqrt{d}\\)'], why: 'Inversely: divide; square: \\(d^2\\).' },
    { type: 'num', q: '\\(A \\propto r^2\\). \\(r\\) increases by 20%. By what percentage does \\(A\\) increase?', a: 44, unit: '%', why: '\\(1.2^2 = 1.44\\): an increase of 44%.' },
  ],
});
