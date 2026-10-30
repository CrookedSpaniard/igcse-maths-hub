// y = mx + c with sliders: m turns the line, c moves it up and down.
FD.add({
  id: 'ymxc',
  title: 'y = mx + c',
  tab: 'y = mx + c',
  icon: 'graph',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['\\(m\\)', 'The gradient of the line.'],
    ['\\(c\\)', 'The \\(y\\)-intercept: the line crosses the \\(y\\)-axis at \\((0, c)\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sl-y', side: true,
      vis: '<div data-k="g"></div><div class="pr-tabh" data-k="tab"></div>',
      tryHtml: `<label class="ctrl">\\(m\\) <input type="range" data-k="m" min="-4" max="4" step="0.5" value="2"><output data-k="om">2</output></label>
        <label class="ctrl">\\(c\\) <input type="range" data-k="c" min="-5" max="5" value="-1"><output data-k="oc">−1</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 380, x: [-5, 5], y: [-8, 8], step: 1, ystep: 2, label: 'Graph of y = mx + c' });
    a.line = (m, c, pts = false) => {
      g.draw(g.curve((x) => m * x + c), g.pt(0, c, 'hot') + g.lbl(0, c, `(0, ${String(c).replace('-', '−')})`) + (pts ? [-2, -1, 1, 2].map((x) => g.pt(x, m * x + c)).join('') : ''));
      a.$('[data-k="tab"]').innerHTML = pts ? `<table class="pr-tab"><tr><th>\\(x\\)</th>${[-2, -1, 0, 1, 2].map((x) => `<td>${x}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${[-2, -1, 0, 1, 2].map((x) => `<td>${FD.num(m * x + c)}</td>`).join('')}</tr></table>` : '';
      FD.typeset(a.$('[data-k="tab"]'));
    };
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, c = +a.$('[data-k="c"]').value;
      a.$('[data-k="om"]').textContent = String(m).replace('-', '−'); a.$('[data-k="oc"]').textContent = String(c).replace('-', '−');
      a.line(m, c); a.big(`y = ${FD.poly([m, c])}`);
      a.msg(`Gradient ${m}, crosses the \\(y\\)-axis at \\((0, ${c})\\).`);
    };
    ['m', 'c'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.line(2, -1);
    return a;
  },
  steps: [
    {
      title: 'A table of values',
      text: '<p>To draw \\(y = 2x - 1\\), choose some \\(x\\) values, work out \\(y\\), plot the points and join them with a ruler.</p>',
      async on(a) { a.tryMode(false); a.line(2, -1, true); a.big('y = 2x - 1'); },
    },
    {
      title: 'Read m and c',
      text: '<p>In \\(y = mx + c\\), the number in front of \\(x\\) is the <b>gradient</b> \\(m\\) and the number on its own is the <b>\\(y\\)-intercept</b> \\(c\\).</p><p>\\(y = 2x - 1\\): gradient 2, crosses at \\((0, -1)\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.$('[data-k="tab"]').innerHTML = ''; for (const [m, c] of [[2, -1], [2, 3], [-1, 3], [0.5, 3]]) { a.line(m, c); a.big(`y = ${FD.poly([m, c])}`); if (!(await ctx.sleep(1200))) return; } },
    },
    {
      title: 'Rearrange first',
      text: '<p>\\(2y - 6x = 8\\) is not in the form \\(y = mx + c\\). Rearrange to find \\(m\\) and \\(c\\).</p>',
      tip: 'Get \\(y\\) on its own on the left.',
      on: FD.walk([['2y - 6x = 8', ''], ['2y = 6x + 8', '+ 6x'], ['y = 3x + 4', '÷ 2: m = 3, c = 4']], (a) => { a.line(3, 4); a.big(''); }),
    },
    {
      title: 'Try it: m and c',
      text: '<p>Change \\(m\\) and \\(c\\). What does each one do to the line?</p>',
      tip: 'Make \\(m = 0\\). What kind of line do you get?',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'ymxc',
  gens: [
    () => { const m = FD.rndNZ(-6, 6), c = FD.rnd(-9, 9); return { type: 'num', q: `Write down the gradient and the \\(y\\)-intercept of \\(y = ${FD.poly([m, c])}\\).`, a: [m, c], fields: ['gradient', '\\(y\\)-intercept'], why: `\\(m = ${m}\\), \\(c = ${c}\\).` }; },
    () => { const k = FD.rnd(2, 5), m = FD.rndNZ(-4, 4), c = FD.rnd(-5, 5); return { type: 'num', q: `Find the gradient and \\(y\\)-intercept of \\(${k}y ${m * k < 0 ? '+' : '-'} ${Math.abs(m * k)}x = ${c * k}\\).`, a: [m, c], fields: ['gradient', '\\(y\\)-intercept'], why: `\\(${k}y = ${FD.poly([m * k, c * k])}\\), so \\(y = ${FD.poly([m, c])}\\).` }; },
    () => { const m = FD.rndNZ(-4, 4), c = FD.rnd(-6, 6), x = FD.rnd(-4, 4), on = Math.random() < .5, y = m * x + c + (on ? 0 : FD.pick([-1, 1, 2])); return { type: 'tf', q: `True or false: the point \\(${slPt(x, y)}\\) lies on \\(y = ${FD.poly([m, c])}\\).`, a: on, why: `Substitute \\(x = ${x}\\): \\(y = ${m}(${x}) ${FD.sg(c)} = ${m * x + c}\\)${on ? ', which matches.' : `, not ${y}.`}` }; },
  ],
});

FD.check({
  section: 'ymxc',
  items: [
    { type: 'mcq', q: 'Which line has gradient 4 and \\(y\\)-intercept \\(-3\\)?', opts: ['\\(y = 4x - 3\\)', '\\(y = -3x + 4\\)', '\\(y = 4x + 3\\)', '\\(y = 3x - 4\\)'], why: '\\(m = 4\\), \\(c = -3\\).' },
    { type: 'num', q: 'Find the gradient of \\(y = 7 - 2x\\).', a: -2, why: 'The number in front of \\(x\\) is −2.' },
    { type: 'num', q: 'Find the gradient of \\(3y = 6x + 9\\).', a: 2, why: '\\(y = 2x + 3\\).' },
    { type: 'tf', q: '\\((2, 5)\\) lies on \\(y = 3x - 1\\).', a: true, why: '\\(3(2) - 1 = 5\\).' },
  ],
});
