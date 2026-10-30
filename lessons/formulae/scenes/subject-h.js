// Harder rearranging, step by step. Each item: [formula, subject, [[line, note], …]]
const FO_HARD = [
  ['ax + b = cx + d', 'x', [['ax - cx = d - b', 'x terms on one side'], ['x(a - c) = d - b', 'factorise out x'], ['x = \\frac{d - b}{a - c}', 'divide by (a − c)']]],
  ['y = \\frac{x + 2}{x - 3}', 'x', [['y(x - 3) = x + 2', '× (x − 3)'], ['xy - 3y = x + 2', 'expand'], ['xy - x = 3y + 2', 'collect x terms'], ['x(y - 1) = 3y + 2', 'factorise'], ['x = \\frac{3y + 2}{y - 1}', '÷ (y − 1)']]],
  ['T = 2\\pi\\sqrt{\\frac{l}{g}}', 'l', [['\\frac{T}{2\\pi} = \\sqrt{\\frac{l}{g}}', '÷ 2π'], ['\\frac{T^2}{4\\pi^2} = \\frac{l}{g}', 'square both sides'], ['l = \\frac{gT^2}{4\\pi^2}', '× g']]],
  ['E = \\frac12 mv^2', 'v', [['2E = mv^2', '× 2'], ['\\frac{2E}{m} = v^2', '÷ m'], ['v = \\sqrt{\\frac{2E}{m}}', 'square root']]],
  ['\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}', 'u', [['\\frac{1}{u} = \\frac{1}{f} - \\frac{1}{v}', '− 1/v'], ['\\frac{1}{u} = \\frac{v - f}{fv}', 'single fraction'], ['u = \\frac{fv}{v - f}', 'flip both sides']]],
];

FD.add({
  id: 'subject-h',
  title: 'Harder rearranging',
  tab: 'Harder rearranging',
  icon: 'algebra',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Subject appears twice', 'Collect every term with the subject on one side, then <b>factorise</b> it out.'],
  ],
  mount(el) {
    const a = FD.mk(el, { cls: 'fo-h', tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">New formula ↻</button><button class="btn primary" data-k="step">Next step ▶</button></div>' });
    let k = 0, st = 0;
    const show = () => { const [f, s, lines] = FO_HARD[k]; a.big(`\\text{Make } ${s} \\text{ the subject of } ${f}`); a.work(lines); a.upto(st - 1); };
    a.$('[data-k="new"]').addEventListener('click', () => { k = (k + 1) % FO_HARD.length; st = 0; show(); });
    a.$('[data-k="step"]').addEventListener('click', () => { st = Math.min(st + 1, FO_HARD[k][2].length); a.upto(st - 1); });
    a.onTry = () => { st = 0; show(); };
    return a;
  },
  steps: [
    {
      title: 'The subject appears twice',
      text: '<p>In \\(ax + b = cx + d\\) the letter \\(x\\) is in two places. Get both \\(x\\) terms on one side, then <b>factorise</b> to get a single \\(x\\).</p>',
      on: FD.walk(FO_HARD[0][2], (a) => a.big('ax + b = cx + d'), 1500),
    },
    {
      title: 'Subject in a fraction',
      text: '<p>Multiply out the fraction first, then collect and factorise.</p>',
      tip: 'This is a common last question on the exam paper. Follow the same four steps every time: clear fractions, expand, collect, factorise.',
      on: FD.walk(FO_HARD[1][2], (a) => a.big('y = \\frac{x + 2}{x - 3}'), 1400),
    },
    {
      title: 'Powers and roots',
      text: '<p>Undo a square root by <b>squaring</b>, and undo a square by taking the <b>square root</b>. Isolate the root or power first.</p>',
      on: FD.walk(FO_HARD[2][2], (a) => a.big('T = 2\\pi\\sqrt{\\frac{l}{g}}'), 1500),
    },
    {
      title: 'Try it: step by step',
      text: '<p>Press <b>New formula</b> to choose a formula, then <b>Next step</b> to reveal each line. Try to write the next line yourself first.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'subject-h',
  gens: [
    () => { const p = FD.rnd(2, 7), q = FD.rnd(1, 9), [t, s] = FD.pick([['x', 'y'], ['a', 'b'], ['p', 'k']]); return { type: 'alg', q: `Make \\(${t}\\) the subject of \\(${p}${t} + ${q} = ${s}${t} + ${s}\\)`, a: `(${s}-${q})/(${p}-${s})`, lhs: `${t} =`, show: `\\(${t} = \\dfrac{${s} - ${q}}{${p} - ${s}}\\)`, hint: 'Type the right-hand side, e.g. (y - 3)/(5 - y).', why: `Collect \\(${t}\\) terms: \\(${p}${t} - ${s}${t} = ${s} - ${q}\\). Factorise: \\(${t}(${p} - ${s}) = ${s} - ${q}\\). Divide: \\(${t} = \\dfrac{${s} - ${q}}{${p} - ${s}}\\).` }; },
    () => { const k = FD.rnd(2, 6), [t, s] = FD.pick([['r', 'A'], ['x', 'y'], ['v', 'E']]); return { type: 'alg', q: `Make \\(${t}\\) the subject of \\(${s} = ${k}${t}^2\\), where \\(${t} > 0\\)`, a: `(${s}/${k})^(1/2)`, lhs: `${t} =`, show: `\\(${t} = \\sqrt{\\dfrac{${s}}{${k}}}\\)`, hint: `Type a square root as a power ½, e.g. (A/3)^(1/2).`, why: `Divide by ${k}: \\(${t}^2 = \\dfrac{${s}}{${k}}\\). Square root: \\(${t} = \\sqrt{\\dfrac{${s}}{${k}}}\\).` }; },
    () => { const k = FD.rnd(2, 5); return { type: 'alg', q: `Make \\(x\\) the subject of \\(y = \\dfrac{x + ${k}}{x}\\)`, a: `${k}/(y-1)`, lhs: 'x =', show: `\\(x = \\dfrac{${k}}{y - 1}\\)`, hint: 'Type the right-hand side, e.g. 3/(y - 1).', why: `× x: \\(xy = x + ${k}\\). Collect: \\(xy - x = ${k}\\). Factorise: \\(x(y - 1) = ${k}\\). So \\(x = \\dfrac{${k}}{y - 1}\\).` }; },
  ],
});

FD.check({
  section: 'subject-h',
  items: [
    { type: 'mcq', q: 'Make \\(x\\) the subject of \\(3x + a = bx + 5\\).', opts: ['\\(x = \\frac{5 - a}{3 - b}\\)', '\\(x = \\frac{5 + a}{3 + b}\\)', '\\(x = \\frac{5 - a}{3}\\)', '\\(x = \\frac{a - 5}{3 - b}\\)'], why: '\\(3x - bx = 5 - a\\), \\(x(3 - b) = 5 - a\\).' },
    { type: 'mcq', q: 'Make \\(r\\) the subject of \\(V = \\frac43 \\pi r^3\\).', opts: ['\\(r = \\sqrt[3]{\\frac{3V}{4\\pi}}\\)', '\\(r = \\frac{3V}{4\\pi}\\)', '\\(r = \\sqrt{\\frac{3V}{4\\pi}}\\)', '\\(r = \\sqrt[3]{\\frac{4V}{3\\pi}}\\)'], why: '\\(r^3 = \\frac{3V}{4\\pi}\\), then cube root.' },
    { type: 'alg', q: 'Make \\(a\\) the subject of \\(p = \\frac{a + 1}{a - 1}\\)', a: '(p+1)/(p-1)', lhs: 'a =', show: '\\(a = \\frac{p + 1}{p - 1}\\)', hint: 'Type the right-hand side.', why: '\\(pa - p = a + 1\\), \\(pa - a = p + 1\\), \\(a(p - 1) = p + 1\\).' },
    { type: 'tf', q: 'To make \\(x\\) the subject of \\(y = \\sqrt{x + 4}\\) the first step is to square both sides.', a: true, why: '\\(y^2 = x + 4\\), so \\(x = y^2 - 4\\).' },
  ],
});
