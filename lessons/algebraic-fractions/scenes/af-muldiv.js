// Multiply: put all the factors over one line, then cancel. Divide: flip the second fraction first.
// A random problem as a list of stages for the factor-chip picture.
const afMulProblem = () => {
  const [p, q, r] = afTriple(), k = FD.rnd(2, 5), div = Math.random() < .5;
  // (x+p)(x+q)/(k(x+r)) × or ÷ ...
  const f1 = [FD.poly([1, p + q, p * q]), `${k}x${FD.sg(k * r)}`], f2 = [`${k}`, `x${FD.sg(p)}`];
  const A = div ? `\\dfrac{${f1[0]}}{${f1[1]}} \\div \\dfrac{x${FD.sg(p)}}{${k}}` : `\\dfrac{${f1[0]}}{${f1[1]}} \\times \\dfrac{${f2[0]}}{${f2[1]}}`;
  const top = [afBr(p), afBr(q), String(k)], bot = [String(k), afBr(r), afBr(p)];
  return {
    q: A, ans: `(x${FD.sg(q).replace(/\s/g, '')})/(x${FD.sg(r).replace(/\s/g, '')})`, show: `\\dfrac{${FD.poly([1, q])}}{${FD.poly([1, r])}}`,
    stages: [
      { top: [f1[0], f2[0]], bot: [f1[1], f2[1]], msg: div ? 'Keep, change, flip: \\(\\div \\dfrac{x' + FD.sg(p) + '}{' + k + '}\\) becomes \\(\\times \\dfrac{' + k + '}{x' + FD.sg(p) + '}\\).' : 'Write everything over one fraction line.' },
      { top, bot, msg: 'Factorise every part.' },
      { top, bot, gone: [afBr(p), String(k)], msg: `Cancel \\(${afBr(p)}\\) and ${k}. Answer: \\(${'\\dfrac{' + FD.poly([1, q]) + '}{' + FD.poly([1, r]) + '}'}\\)` },
    ],
  };
};

FD.add({
  id: 'af-muldiv',
  title: 'Multiplying and dividing algebraic fractions',
  tab: 'Multiply & divide',
  icon: 'frac',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Reciprocal', 'The fraction turned upside down: the reciprocal of \\(\\frac{x}{x + 2}\\) is \\(\\frac{x + 2}{x}\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'af-m',
      vis: '<div class="ff-host" data-k="ff"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">New question ↻</button><button class="btn primary" data-k="step">Next step ▶</button></div>',
    });
    const ff = FD.facFrac(a.$('[data-k="ff"]'));
    a.ff = ff;
    let pr, st = 0;
    const show = () => { const s = pr.stages[st]; ff(s.top, s.bot, s.gone); a.msg(s.msg); };
    a.$('[data-k="new"]').addEventListener('click', () => { pr = afMulProblem(); st = 0; a.big(pr.q); show(); });
    a.$('[data-k="step"]').addEventListener('click', () => { st = Math.min(st + 1, pr.stages.length - 1); show(); });
    a.onTry = () => { pr = afMulProblem(); st = 0; a.big(pr.q); show(); };
    return a;
  },
  steps: [
    {
      title: 'Multiplying: factorise, cancel, multiply',
      text: '<p>\\(\\frac{x^2 - 9}{4x} \\times \\frac{2x^2}{x + 3}\\). Factorise everything, put it over one line and cancel the common factors.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big('\\frac{x^2 - 9}{4x} \\times \\frac{2x^2}{x + 3}');
        a.ff(['(x + 3)', '(x - 3)', '2x^2'], ['4x', '(x + 3)']);
        if (!(await ctx.sleep(1500))) return;
        a.ff(['(x + 3)', '(x - 3)', '2x', 'x'], ['2', '2x', '(x + 3)'], ['(x + 3)', '2x']);
        a.msg('\\(= \\dfrac{x(x - 3)}{2}\\)');
      },
    },
    {
      title: 'Dividing: keep, change, flip',
      text: '<p>To divide, multiply by the <b>reciprocal</b> of the second fraction. Then carry on as for multiplying.</p>',
      tip: 'Only flip the fraction <b>after</b> the ÷ sign.',
      on: FD.walk([['\\frac{x + 1}{x - 4} \\div \\frac{3x + 3}{x^2 - 16}', ''], ['= \\frac{x + 1}{x - 4} \\times \\frac{x^2 - 16}{3x + 3}', 'keep, change, flip'], ['= \\frac{(x + 1)(x + 4)(x - 4)}{3(x - 4)(x + 1)}', 'factorise'], ['= \\frac{x + 4}{3}', 'cancel']], (a) => { a.ff([], []); a.big(''); }, 1500),
    },
    {
      title: 'Try it: step by step',
      text: '<p>Press <b>New question</b>, then <b>Next step</b> to see each stage: one fraction line, factorise, cancel.</p><p>Say what the next stage will look like before you press.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'af-muldiv',
  gens: [
    () => { const pr = afMulProblem(); return { type: 'alg', q: `Simplify fully \\(${pr.q}\\)`, a: pr.ans, show: `\\(${pr.show}\\)`, hint: 'Type a fraction with brackets, e.g. (x + 3)/(x - 2).', why: pr.stages.map((s) => s.msg).join(' ') }; },
    () => { const m = FD.rnd(2, 4), n = FD.rnd(2, 5), p = FD.rnd(2, 4); return { type: 'alg', q: `Simplify \\(\\dfrac{${m}x^${p}}{${n}} \\times \\dfrac{${n * 2}}{x}\\)`, a: `${2 * m}x^${p - 1}`, show: `\\(${2 * m}${p - 1 > 1 ? `x^{${p - 1}}` : 'x'}\\)`, why: `\\(\\dfrac{${m}x^{${p}} \\times ${2 * n}}{${n}x} = \\dfrac{${2 * m * n}x^{${p}}}{${n}x} = ${2 * m}${p - 1 > 1 ? `x^{${p - 1}}` : 'x'}\\)` }; },
  ],
});

FD.check({
  section: 'af-muldiv',
  items: [
    { type: 'alg', q: 'Simplify \\(\\frac{3x}{5} \\times \\frac{10}{x^2}\\)', a: '6/x', show: '\\(\\frac{6}{x}\\)', hint: 'Type it like 6/x.', why: '\\(\\frac{30x}{5x^2} = \\frac{6}{x}\\).' },
    { type: 'alg', q: 'Simplify \\(\\frac{x + 2}{x} \\div \\frac{x + 2}{4}\\)', a: '4/x', show: '\\(\\frac{4}{x}\\)', hint: 'Type it like 4/x.', why: '\\(\\frac{x + 2}{x} \\times \\frac{4}{x + 2} = \\frac{4}{x}\\).' },
    { type: 'mcq', q: 'Simplify \\(\\frac{x^2 - 1}{x} \\times \\frac{x^2}{x + 1}\\)', opts: ['\\(x(x - 1)\\)', '\\(x - 1\\)', '\\(\\frac{x - 1}{x}\\)', '\\(x^2 - 1\\)'], why: '\\(\\frac{(x + 1)(x - 1) x^2}{x(x + 1)} = x(x - 1)\\).' },
    { type: 'tf', q: 'To work out \\(\\frac{a}{b} \\div \\frac{c}{d}\\) you flip the first fraction.', a: false, why: 'Keep the first, flip the second: \\(\\frac{a}{b} \\times \\frac{d}{c}\\).' },
  ],
});
