// Quadratics in context: a rectangle of area A with sides x and x + d.
FD.add({
  id: 'quad-context',
  title: 'Quadratics in context',
  tab: 'In context',
  icon: 'target',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Reject a solution', 'A length, an age or a number of people cannot be negative, so throw away an impossible root.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'qu-x', side: true,
      vis: '<svg class="qc-rect" viewBox="0 0 320 220" role="img" aria-label="A rectangle with sides x and x + 3" data-k="r"></svg>',
      tryHtml: '<label class="ctrl">\\(x\\) (cm) <input type="range" data-k="x" min="1" max="10" step="0.5" value="3"><output data-k="ox">3</output></label>',
    });
    const R = a.$('[data-k="r"]');
    a.rect = (x, d = 3) => {
      const s = 14, w = Math.min(290, (x + d) * s), h = Math.min(190, x * s);
      R.innerHTML = `<rect class="qc-r" x="15" y="15" width="${w}" height="${h}"/><text class="g-lbl" x="${15 + w / 2}" y="${Math.min(212, 15 + h + 16)}" text-anchor="middle">x + ${d}</text><text class="g-lbl" x="${Math.min(300, 15 + w + 6)}" y="${15 + h / 2}" text-anchor="${w > 250 ? 'end' : 'start'}">x</text>`;
    };
    const sync = () => {
      const x = +a.$('[data-k="x"]').value; a.$('[data-k="ox"]').textContent = x;
      a.rect(x); const A = x * (x + 3);
      a.big(`x(x + 3) = ${A}`);
      a.msg(A === 40 ? '✓ Area 40 cm²: \\(x = 5\\).' : `Area ${A} cm². We want 40 cm².`, A === 40 ? 'good' : 'bad');
    };
    a.$('[data-k="x"]').addEventListener('input', sync);
    a.onTry = sync;
    a.rect(5);
    return a;
  },
  steps: [
    {
      title: 'Form the equation',
      text: '<p>A rectangle is 3 cm longer than it is wide. Its area is 40 cm². Let the width be \\(x\\): the length is \\(x + 3\\).</p>',
      on: FD.walk([['x(x + 3) = 40', 'area = width × length'], ['x^2 + 3x - 40 = 0', 'expand and rearrange']], (a) => { a.rect(5); a.big(''); }, 1400),
    },
    {
      title: 'Solve, then think',
      text: '<p>The equation has two solutions, but a width cannot be negative. <b>Reject</b> \\(x = -8\\).</p>',
      tip: 'Always say which answer you rejected and why.',
      on: FD.walk([['(x + 8)(x - 5) = 0', ''], ['x = -8 \\;\\text{ or }\\; x = 5', ''], ['x = 5 \\text{ (a width cannot be negative)}', 'reject −8'], ['\\text{The rectangle is 5 cm by 8 cm.}', 'answer the question']], (a) => { a.rect(5); a.big(''); }, 1400),
    },
    {
      title: 'Try it: find the width',
      text: '<p>Change the width \\(x\\). Which value gives an area of exactly 40 cm²?</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'quad-context',
  gens: [
    () => { const x = FD.rnd(3, 12), d = FD.rnd(1, 6), A = x * (x + d); return { type: 'num', q: `A rectangle is \\(${d}\\) cm longer than it is wide. Its area is ${A} cm². Find its width.`, a: x, unit: 'cm', why: `\\(x(x + ${d}) = ${A}\\), so \\(x^2 + ${d}x - ${A} = 0\\) and \\((x - ${x})(x + ${x + d}) = 0\\). Reject \\(x = -${x + d}\\): the width is ${x} cm.` }; },
    () => { const n = FD.rnd(4, 15), p = n * (n + 1); return { type: 'num', q: `The product of two consecutive positive integers is ${p}. Find the smaller integer.`, a: n, why: `\\(n(n + 1) = ${p}\\), \\(n^2 + n - ${p} = 0\\), \\((n - ${n})(n + ${n + 1}) = 0\\). Positive, so \\(n = ${n}\\).` }; },
  ],
});

FD.check({
  section: 'quad-context',
  items: [
    { type: 'num', q: 'A square has side \\(x\\) cm. Its area is 5 cm² more than its perimeter. Find \\(x\\).', a: 5, unit: 'cm', why: '\\(x^2 = 4x + 5\\), \\((x - 5)(x + 1) = 0\\), reject \\(-1\\).' },
    { type: 'mcq', q: 'Solving a problem about ages gives \\(x = 7\\) or \\(x = -3\\). What should you do?', opts: ['Use 7 and reject −3, because an age cannot be negative', 'Use both answers', 'Use −3', 'Start again'], why: 'Only the positive value makes sense.' },
    { type: 'num', q: 'A ball\'s height after \\(t\\) seconds is \\(h = 20t - 5t^2\\). When does it land (\\(h = 0\\), \\(t > 0\\))?', a: 4, unit: 's', why: '\\(5t(4 - t) = 0\\), so \\(t = 0\\) (thrown) or \\(t = 4\\).' },
  ],
});
