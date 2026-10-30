// Higher: ax² + bx + c = 0 by factorising (split the middle term), roots can be fractions.
FD.add({
  id: 'fact-harder',
  title: 'Solving ax² + bx + c = 0 by factorising',
  tab: 'ax² + bx + c',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Splitting the middle term', 'For \\(ax^2 + bx + c\\), find two numbers that multiply to \\(ac\\) and add to \\(b\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-h', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">\\((px + q)\\): p <input type="range" data-k="p" min="1" max="4" value="2"><output data-k="op">2</output></label>
        <label class="ctrl">q <input type="range" data-k="q" min="-6" max="6" value="-1"><output data-k="oq">−1</output></label>
        <label class="ctrl">\\((x + r)\\): r <input type="range" data-k="r" min="-5" max="5" value="3"><output data-k="or">3</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 360, x: [-6, 6], y: [-12, 12], step: 1, ystep: 3, label: 'Graph of a quadratic' });
    a.draw = (p, q, r) => { const x1 = -q / p, x2 = -r; g.draw(g.curve((x) => (p * x + q) * (x + r)), [x1, x2].map((x) => g.pt(x, 0, 'hot')).join('')); };
    const sync = () => {
      const [p, q, r] = ['p', 'q', 'r'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['p', 'q', 'r'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = String([p, q, r][i]).replace('-', '−'); });
      a.draw(p, q, r);
      a.big(`${FD.poly([p, p * r + q, q * r])} = 0`);
      a.msg(`\\((${FD.poly([p, q])})(${FD.poly([1, r])}) = 0\\), so \\(x = ${FD.ftex(-q, p)}\\) or \\(x = ${-r}\\).`);
    };
    ['p', 'q', 'r'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.draw(2, -1, 3);
    return a;
  },
  steps: [
    {
      title: 'Split the middle term',
      text: '<p>\\(2x^2 + 5x - 3 = 0\\). \\(ac = -6\\): the numbers 6 and \\(-1\\) multiply to \\(-6\\) and add to 5.</p>',
      on: FD.walk([['2x^2 + 6x - x - 3 = 0', 'split 5x'], ['2x(x + 3) - 1(x + 3) = 0', 'factorise in pairs'], ['(2x - 1)(x + 3) = 0', ''], ['x = \\tfrac12 \\;\\text{ or }\\; x = -3', '2x − 1 = 0 gives ½']], (a) => { a.draw(2, -1, 3); a.big(''); }, 1400),
    },
    {
      title: 'Rearrange and take out common factors',
      text: '<p>\\(3x^2 + 6x = 24\\). Rearrange to = 0, then take out the common factor 3 before factorising.</p>',
      tip: 'Dividing the whole equation by 3 is allowed: \\(0 \\div 3 = 0\\).',
      on: FD.walk([['3x^2 + 6x - 24 = 0', 'subtract 24'], ['3(x^2 + 2x - 8) = 0', 'common factor'], ['3(x + 4)(x - 2) = 0', ''], ['x = -4 \\;\\text{ or }\\; x = 2', '']], (a) => { a.draw(1, 4, -2); a.big(''); }, 1400),
    },
    {
      title: 'Try it: fraction roots',
      text: '<p>Build \\((px + q)(x + r) = 0\\). When \\(p\\) is not 1, a root can be a fraction: \\(px + q = 0\\) gives \\(x = -\\frac{q}{p}\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'fact-harder',
  gens: [
    () => { let p, q, r; do { p = FD.rnd(2, 4); q = FD.rndNZ(-6, 6); r = FD.rndNZ(-5, 5); } while (FD.gcd(p, q) !== 1 || -q / p === -r); return { type: 'num', q: `Solve \\(${FD.poly([p, p * r + q, q * r])} = 0\\)`, a: [-q / p, -r], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.001, show: `\\(x = ${FD.ftex(-q, p)}\\) or \\(x = ${-r}\\)`, hint: 'Fractions like 1/2 or -3/2 are fine.', why: `\\(ac = ${p * q * r}\\). Split and factorise: \\((${FD.poly([p, q])})(${FD.poly([1, r])}) = 0\\). So \\(x = ${FD.ftex(-q, p)}\\) or \\(x = ${-r}\\).` }; },
  ],
});

FD.check({
  section: 'fact-harder',
  items: [
    { type: 'num', q: 'Solve \\(2x^2 - 7x + 3 = 0\\)', a: [0.5, 3], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, why: '\\((2x - 1)(x - 3) = 0\\).' },
    { type: 'num', q: 'Solve \\(3x^2 + 5x - 2 = 0\\)', a: [1 / 3, -2], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.001, show: '\\(x = \\tfrac13\\) or \\(x = -2\\)', why: '\\((3x - 1)(x + 2) = 0\\).' },
    { type: 'mcq', q: 'The first step to solve \\(2x^2 = 18 - 9x\\) is…', opts: ['Rearrange to \\(2x^2 + 9x - 18 = 0\\)', 'Divide by 2', 'Square root both sides', 'Factorise \\(2x^2\\)'], why: 'Get everything on one side, = 0.' },
  ],
});
