// Composite functions with two machines in a row: fg(x) means g first, then f.
FD.add({
  id: 'composite',
  title: 'Composite functions',
  tab: 'Composite',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Composite function', '\\(fg(x)\\) means \\(f(g(x))\\): apply \\(g\\) first, then \\(f\\) to the answer.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fn-c',
      vis: '<div class="fc-row" data-k="row"></div>',
      tryHtml: `<p class="ab-ask">\\(f(x) = 2x + 1\\) and \\(g(x) = x^2\\)</p>
        <div class="seg-row" data-k="ord"><button class="btn primary" data-o="fg">\\(fg(x)\\)</button><button class="btn" data-o="gf">\\(gf(x)\\)</button></div>
        <label class="ctrl">\\(x\\) <input type="range" data-k="x" min="-4" max="4" value="3"><output data-k="ox">3</output></label>`,
    });
    const row = a.$('[data-k="row"]');
    // stages: [label, value] boxes; lit = how many shown
    a.row = (items, lit = 99) => { row.innerHTML = items.map(([t, v], i) => (i % 2 ? `<span class="fc-m ${i < lit ? 'on' : ''}">${t}</span>` : `<span class="fc-v ${i < lit ? 'on' : ''}">${i < lit ? FD.tex(String(v)) : '?'}</span>`)).join('<span class="fm-arr">→</span>'); };
    const F = { f: (x) => 2 * x + 1, g: (x) => x * x }, T = { f: '2x + 1', g: 'x^2' };
    let ord = 'fg';
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = String(x).replace('-', '−');
      const [first, second] = ord === 'fg' ? ['g', 'f'] : ['f', 'g'];
      const y1 = F[first](x), y2 = F[second](y1);
      a.row([['', x], [first, 0], ['', y1], [second, 0], ['', y2]]);
      a.big(`${ord}(x) = ${ord === 'fg' ? '2x^2 + 1' : '(2x + 1)^2'}`);
      a.msg(`${ord}(${x}) = ${second}(${first}(${x})) = ${second}(${y1}) = ${y2}. ${ord === 'fg' ? 'Swap the order and the answer changes.' : ''}`);
    };
    a.$('[data-k="ord"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; ord = b.dataset.o; a.$('[data-k="ord"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    a.row([['', 3], ['g', 0], ['', 9], ['f', 0], ['', 19]], 0);
    return a;
  },
  steps: [
    {
      title: 'One machine after another',
      text: '<p>\\(f(x) = 2x + 1\\) and \\(g(x) = x^2\\). \\(fg(3)\\) means: put 3 into \\(g\\), then put the answer into \\(f\\).</p><p>\\(g(3) = 9\\), then \\(f(9) = 19\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big('fg(3)'); for (let k = 1; k <= 5; k++) { a.row([['', 3], ['g', 0], ['', 9], ['f', 0], ['', 19]], k); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'The order matters',
      text: '<p>\\(gf(3)\\) means \\(f\\) first: \\(f(3) = 7\\), then \\(g(7) = 49\\). So \\(fg(3) \\ne gf(3)\\).</p>',
      tip: 'Read \\(fg(x)\\) from the inside out: the function next to \\(x\\) goes first.',
      async on(a, ctx) { a.tryMode(false); a.big('gf(3)'); for (let k = 1; k <= 5; k++) { a.row([['', 3], ['f', 0], ['', 7], ['g', 0], ['', 49]], k); if (!(await ctx.sleep(800))) return; } },
    },
    {
      title: 'The expression for fg(x)',
      text: '<p>Put the whole of \\(g(x)\\) in place of \\(x\\) in \\(f\\).</p>',
      on: FD.walk([['fg(x) = f(x^2) = 2x^2 + 1', 'replace x by x² in f'], ['gf(x) = g(2x + 1) = (2x + 1)^2', 'replace x by 2x + 1 in g'], ['= 4x^2 + 4x + 1', 'expand if asked']], (a) => { a.row([]); a.big(''); }, 1500),
    },
    {
      title: 'Try it: fg or gf?',
      text: '<p>Choose \\(fg\\) or \\(gf\\) and an input. Follow the value through the two machines.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'composite',
  gens: [
    () => { const m = FD.rnd(2, 5), c = FD.rndNZ(-5, 5), k = FD.rnd(1, 4), x = FD.rnd(-3, 4), fg = Math.random() < .5; const f = (t) => m * t + c, g = (t) => t * t + k; return { type: 'num', q: `\\(f(x) = ${FD.poly([m, c])}\\) and \\(g(x) = x^2 + ${k}\\). Find \\(${fg ? 'fg' : 'gf'}(${x})\\).`, a: fg ? f(g(x)) : g(f(x)), why: fg ? `\\(g(${x}) = ${g(x)}\\), then \\(f(${g(x)}) = ${f(g(x))}\\).` : `\\(f(${x}) = ${f(x)}\\), then \\(g(${f(x)}) = ${g(f(x))}\\).` }; },
    () => { const m = FD.rnd(2, 5), c = FD.rndNZ(-6, 6), p = FD.rnd(2, 4), q = FD.rndNZ(-5, 5); return { type: 'alg', q: `\\(f(x) = ${FD.poly([m, c])}\\) and \\(g(x) = ${FD.poly([p, q])}\\). Find \\(fg(x)\\) in its simplest form.`, a: FD.poly([m * p, m * q + c], 'x', true), form: 'expanded', show: `\\(${FD.poly([m * p, m * q + c])}\\)`, hint: 'Type it like 6x + 5.', why: `\\(fg(x) = f(${FD.poly([p, q])}) = ${m}(${FD.poly([p, q])}) ${FD.sg(c)} = ${FD.poly([m * p, m * q + c])}\\).` }; },
  ],
});

FD.check({
  section: 'composite',
  items: [
    { type: 'num', q: '\\(f(x) = x + 5\\) and \\(g(x) = 3x\\). Find \\(fg(2)\\).', a: 11, why: '\\(g(2) = 6\\), \\(f(6) = 11\\).' },
    { type: 'num', q: '\\(f(x) = x + 5\\) and \\(g(x) = 3x\\). Find \\(gf(2)\\).', a: 21, why: '\\(f(2) = 7\\), \\(g(7) = 21\\).' },
    { type: 'alg', q: '\\(f(x) = 4x - 1\\) and \\(g(x) = x + 3\\). Find \\(fg(x)\\).', a: '4x+11', form: 'expanded', show: '\\(4x + 11\\)', why: '\\(4(x + 3) - 1\\).' },
    { type: 'mcq', q: '\\(f(x) = x^2\\) and \\(g(x) = x - 1\\). Which is \\(fg(x)\\)?', opts: ['\\((x - 1)^2\\)', '\\(x^2 - 1\\)', '\\(x^2(x - 1)\\)', '\\(x - 1^2\\)'], why: 'Put \\(x - 1\\) into \\(f\\).' },
  ],
});
