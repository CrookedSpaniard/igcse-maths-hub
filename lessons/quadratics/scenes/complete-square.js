// Completing the square with an area model: x² + bx is a square x by x plus two strips b/2 wide;
// the missing corner (b/2)² is what we add and subtract.
FD.add({
  id: 'complete-square',
  title: 'Completing the square',
  tab: 'Complete the square',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Completing the square', 'Writing \\(x^2 + bx + c\\) as \\((x + p)^2 + q\\).'],
    ['Turning point', 'The lowest (or highest) point of a parabola. For \\((x + p)^2 + q\\) it is \\((-p, q)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-c', side: true,
      vis: '<svg class="cs-sq" viewBox="0 0 320 320" role="img" aria-label="Area model for completing the square" data-k="sq"></svg>',
      tryHtml: `<label class="ctrl">\\(b\\) <input type="range" data-k="b" min="2" max="12" step="2" value="6"><output data-k="ob">6</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-10" max="12" value="2"><output data-k="oc">2</output></label>`,
    });
    const sq = a.$('[data-k="sq"]');
    // stage 0: x² and one strip bx; 1: strip cut in two halves around the square; 2: corner filled in
    a.area = (b, stage) => {
      const X = 170, h = Math.min(120, b * 10), off = 20;
      const strip1 = stage ? `<rect class="cs-b" x="${off + X}" y="${off}" width="${h}" height="${X}"/><text class="g-lbl" x="${off + X + h / 2}" y="${off + X / 2}" text-anchor="middle">${b / 2}x</text>` : `<rect class="cs-b" x="${off + X}" y="${off}" width="${2 * h > 280 - X ? 280 - X : 2 * h}" height="${X}"/><text class="g-lbl" x="${off + X + 40}" y="${off + X / 2}" text-anchor="middle">${b}x</text>`;
      const strip2 = stage ? `<rect class="cs-b" x="${off}" y="${off + X}" width="${X}" height="${h}"/><text class="g-lbl" x="${off + X / 2}" y="${off + X + h / 2 + 5}" text-anchor="middle">${b / 2}x</text>` : '';
      const corner = stage ? `<rect class="cs-c ${stage > 1 ? 'on' : ''}" x="${off + X}" y="${off + X}" width="${h}" height="${h}"/><text class="g-lbl" x="${off + X + h / 2}" y="${off + X + h / 2 + 5}" text-anchor="middle">${stage > 1 ? (b / 2) ** 2 : '?'}</text>` : '';
      sq.innerHTML = `<rect class="cs-x" x="${off}" y="${off}" width="${X}" height="${X}"/><text class="g-lbl" x="${off + X / 2}" y="${off + X / 2 + 5}" text-anchor="middle">x²</text>${strip1}${strip2}${corner}`;
    };
    const sync = () => {
      const b = +a.$('[data-k="b"]').value, c = +a.$('[data-k="c"]').value, h = b / 2;
      a.$('[data-k="ob"]').textContent = b; a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      a.area(b, 2);
      a.big(`${FD.poly([1, b, c])} = (x + ${h})^2 ${FD.sg(c - h * h)}`);
      a.msg(`Add and subtract the corner \\(${h}^2 = ${h * h}\\). Turning point \\((${-h}, ${c - h * h})\\).`);
    };
    ['b', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.area(6, 0);
    return a;
  },
  steps: [
    {
      title: 'Picture x² + 6x',
      text: '<p>\\(x^2\\) is a square of side \\(x\\). \\(6x\\) is a strip. Cut the strip into two halves, \\(3x\\) each, and put one on each side of the square.</p>',
      async on(a, ctx) { a.tryMode(false); a.big('x^2 + 6x'); a.area(6, 0); if (!(await ctx.sleep(1500))) return; a.area(6, 1); },
    },
    {
      title: 'Fill the missing corner',
      text: '<p>The shape is almost a square of side \\(x + 3\\). The missing corner is \\(3^2 = 9\\). So \\(x^2 + 6x = (x + 3)^2 - 9\\).</p>',
      tip: 'Halve \\(b\\), then subtract that number squared.',
      async on(a, ctx) { a.tryMode(false); a.area(6, 1); if (!(await ctx.sleep(1200))) return; a.area(6, 2); a.big('x^2 + 6x = (x + 3)^2 - 9'); },
    },
    {
      title: 'Complete the square',
      text: '<p>\\(x^2 + 6x + 2\\): halve 6 to get 3, write \\((x + 3)^2\\), subtract \\(3^2\\), then add the 2.</p>',
      on: FD.walk([['x^2 + 6x + 2', ''], ['= (x + 3)^2 - 9 + 2', 'half of 6 is 3; take away 3²'], ['= (x + 3)^2 - 7', 'turning point (−3, −7)']], (a) => { a.area(6, 2); a.big(''); }, 1400),
    },
    {
      title: 'Solve by completing the square',
      text: '<p>\\(x^2 + 6x + 2 = 0\\) becomes \\((x + 3)^2 = 7\\). Square root both sides: remember \\(\\pm\\).</p>',
      on: FD.walk([['(x + 3)^2 - 7 = 0', ''], ['(x + 3)^2 = 7', ''], ['x + 3 = \\pm\\sqrt{7}', 'two square roots'], ['x = -3 \\pm \\sqrt{7}', 'exact (surd) form']], (a) => { a.area(6, 2); a.big(''); }, 1400),
    },
    {
      title: 'Try it: the area model',
      text: '<p>Change \\(b\\) and \\(c\\). The corner is always \\(\\left(\\frac{b}{2}\\right)^2\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'complete-square',
  gens: [
    () => { const h = FD.rndNZ(-6, 6), c = FD.rnd(-10, 12); return { type: 'alg', q: `Write \\(${FD.poly([1, 2 * h, c])}\\) in the form \\((x + p)^2 + q\\).`, a: `(x${FD.sg(h).replace(/\s/g, '')})^2${FD.sg(c - h * h).replace(/\s/g, '')}`, show: `\\((x ${FD.sg(h).trim()})^2 ${FD.sg(c - h * h)}\\)`, hint: 'Type it like (x + 3)^2 - 7.', why: `Half of ${2 * h} is ${h}: \\((x ${FD.sg(h).trim()})^2 - ${h * h} ${FD.sg(c)} = (x ${FD.sg(h).trim()})^2 ${FD.sg(c - h * h)}\\).` }; },
    () => { const h = FD.rndNZ(-5, 5), k = FD.pick([2, 3, 5, 6, 7, 10]); return { type: 'num', q: `Solve \\(${FD.poly([1, 2 * h, h * h - k])} = 0\\) by completing the square. Give your answers to 2 decimal places.`, a: [-h + Math.sqrt(k), -h - Math.sqrt(k)], fields: ['\\(x\\) =', '\\(x\\) ='], anyOrder: true, tol: 0.006, show: `\\(x = ${-h} \\pm \\sqrt{${k}}\\)`, why: `\\((x ${FD.sg(h).trim()})^2 - ${k} = 0\\), so \\(x = ${-h} \\pm \\sqrt{${k}}\\): \\(${FD.round(-h + Math.sqrt(k), 2)}\\) or \\(${FD.round(-h - Math.sqrt(k), 2)}\\).` }; },
  ],
});

FD.check({
  section: 'complete-square',
  items: [
    { type: 'alg', q: 'Write \\(x^2 + 8x + 5\\) in the form \\((x + p)^2 + q\\).', a: '(x+4)^2-11', show: '\\((x + 4)^2 - 11\\)', hint: 'Type it like (x + 3)^2 - 7.', why: '\\((x + 4)^2 - 16 + 5\\).' },
    { type: 'mcq', q: 'What is the turning point of \\(y = (x - 2)^2 + 5\\)?', opts: ['\\((2, 5)\\)', '\\((-2, 5)\\)', '\\((2, -5)\\)', '\\((5, 2)\\)'], why: 'Minimum when \\(x - 2 = 0\\).' },
    { type: 'mcq', q: 'Solve \\((x - 1)^2 = 3\\).', opts: ['\\(x = 1 \\pm \\sqrt3\\)', '\\(x = 4\\)', '\\(x = -1 \\pm \\sqrt3\\)', '\\(x = 1 \\pm 3\\)'], why: '\\(x - 1 = \\pm\\sqrt3\\).' },
  ],
});
