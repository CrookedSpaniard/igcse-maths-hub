// Changing the subject with a function machine: build the formula forwards, then undo it backwards.
// A machine is a list of operations [op, n]: op is '×', '+', '−', '÷', '²'.
const FO_INV = { '×': '÷', '÷': '×', '+': '−', '−': '+', '²': '√' };
FD.machine = (host) => (start, ops, end, dir = 1, lit = -1) => {
  const list = dir > 0 ? ops : ops.slice().reverse().map(([o, n]) => [FO_INV[o], n]);
  const cells = [`<span class="fm-io">${FD.tex(dir > 0 ? start : end)}</span>`, ...list.map(([o, n], i) => `<span class="fm-arr">→</span><span class="fm-op ${i === lit ? 'on' : ''} ${dir < 0 ? 'inv' : ''}">${o === '√' ? '√' : o === '²' ? '( )²' : `${o} ${n}`}</span>`), '<span class="fm-arr">→</span>', `<span class="fm-io">${FD.tex(dir > 0 ? end : start)}</span>`];
  host.innerHTML = `<div class="fm">${cells.join('')}</div>`;
};
// Machines used in the Try it: [formula, start letter, ops, subject letter, answer TeX]
const FO_MACH = [
  ['y = 3x + 5', 'x', [['×', 3], ['+', 5]], 'y', 'x = \\frac{y - 5}{3}'],
  ['P = 2(w + 4)', 'w', [['+', 4], ['×', 2]], 'P', 'w = \\frac{P}{2} - 4'],
  ['A = \\frac{h}{4} - 7', 'h', [['÷', 4], ['−', 7]], 'A', 'h = 4(A + 7)'],
  ['k = 5(m - 2)', 'm', [['−', 2], ['×', 5]], 'k', 'm = \\frac{k}{5} + 2'],
  ['T = \\frac{n + 9}{6}', 'n', [['+', 9], ['÷', 6]], 'T', 'n = 6T - 9'],
];

FD.add({
  id: 'subject',
  title: 'Changing the subject',
  tab: 'Change the subject',
  icon: 'algebra',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Change the subject', 'Rearrange a formula so a different letter is on its own.'],
    ['Inverse operation', 'The operation that undoes another: + and −, × and ÷, squaring and square-rooting.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'fo-m',
      vis: '<div class="fm-host" data-k="m1"></div><div class="fm-host" data-k="m2"></div>',
      tryHtml: '<div class="chk-btns"><button class="btn" data-k="new">New formula ↻</button><button class="btn primary" data-k="step">Undo the next step ▶</button></div>',
    });
    const m1 = FD.machine(a.$('[data-k="m1"]')), m2 = FD.machine(a.$('[data-k="m2"]'));
    a.m = (f, s, ops, e, back = -2, lit = -1) => { m1(s, ops, e, 1, back < -1 ? lit : -1); if (back >= -1) m2(s, ops, e, -1, back); else a.$('[data-k="m2"]').innerHTML = ''; };
    let k = 0, st = -1;
    const show = () => {
      const [f, s, ops, e, ans] = FO_MACH[k];
      a.m(f, s, ops, e, st);
      a.big(st >= ops.length - 1 ? `${f} \\;\\Rightarrow\\; ${ans}` : f);
    };
    a.$('[data-k="new"]').addEventListener('click', () => { k = (k + 1) % FO_MACH.length; st = -1; show(); });
    a.$('[data-k="step"]').addEventListener('click', () => { st = Math.min(st + 1, FO_MACH[k][2].length - 1); show(); });
    a.onTry = () => { st = -1; show(); };
    return a;
  },
  steps: [
    {
      title: 'Build the formula forwards',
      text: '<p>In \\(y = 3x + 5\\), start with \\(x\\): multiply by 3, then add 5. That gives \\(y\\).</p>',
      async on(a, ctx) { a.tryMode(false); a.big('y = 3x + 5'); for (let i = -1; i < 2; i++) { a.m('', 'x', [['×', 3], ['+', 5]], 'y', -2, i); if (!(await ctx.sleep(900))) return; } },
    },
    {
      title: 'Undo it backwards',
      text: '<p>To make \\(x\\) the subject, go backwards with <b>inverse operations</b>: start with \\(y\\), subtract 5, then divide by 3.</p><p>\\(x = \\frac{y - 5}{3}\\)</p>',
      async on(a, ctx) {
        a.tryMode(false);
        for (let i = -1; i < 2; i++) { a.m('', 'x', [['×', 3], ['+', 5]], 'y', i); if (!(await ctx.sleep(1000))) return; }
        a.big('x = \\frac{y - 5}{3}');
      },
    },
    {
      title: 'Same thing, as algebra',
      text: '<p>Each step does the same thing to <b>both sides</b>, like solving an equation.</p>',
      tip: 'Undo addition and subtraction first, then multiplication and division (unless there is a bracket).',
      on: FD.walk([['y = 3x + 5', ''], ['y - 5 = 3x', '− 5 from both sides'], ['\\frac{y - 5}{3} = x', '÷ 3 both sides'], ['x = \\frac{y - 5}{3}', 'write the subject on the left']], (a) => { a.m('', 'x', [['×', 3], ['+', 5]], 'y', 1); a.big(''); }, 1400),
    },
    {
      title: 'Brackets, powers and roots',
      text: '<p>With a bracket, undo the multiplication outside first. A square is undone by a square root.</p>',
      on: FD.walk([['P = 2(w + 4) \\Rightarrow \\frac{P}{2} = w + 4', '÷ 2'], ['w = \\frac{P}{2} - 4', '− 4'], ['A = \\pi r^2 \\Rightarrow \\frac{A}{\\pi} = r^2', '÷ π'], ['r = \\sqrt{\\frac{A}{\\pi}}', 'square root']], (a) => { a.m('', 'w', [['+', 4], ['×', 2]], 'P', 1); a.big(''); }, 1500),
    },
    {
      title: 'Try it: undo the machine',
      text: '<p>Each formula is shown as a machine. Press <b>Undo the next step</b> to run it backwards and make the starting letter the subject.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'subject',
  gens: [
    () => { const m = FD.rnd(2, 9), c = FD.rndNZ(-9, 9), [s, t] = FD.pick([['y', 'x'], ['P', 'n'], ['A', 'b'], ['T', 'k']]); return { type: 'alg', q: `Make \\(${t}\\) the subject of \\(${s} = ${m}${t}${FD.sg(c)}\\)`, a: `(${s}${FD.sg(-c).replace(/\s/g, '')})/${m}`, lhs: `${t} =`, show: `\\(${t} = \\dfrac{${s}${FD.sg(-c)}}{${m}}\\)`, hint: `Type the right-hand side, e.g. (y - 5)/3.`, why: `${c > 0 ? 'Subtract' : 'Add'} ${Math.abs(c)}: \\(${s}${FD.sg(-c)} = ${m}${t}\\). Divide by ${m}: \\(${t} = \\dfrac{${s}${FD.sg(-c)}}{${m}}\\).` }; },
    () => { const m = FD.rnd(2, 6), c = FD.rnd(1, 9), [s, t] = FD.pick([['Q', 'r'], ['y', 'x'], ['M', 'd']]); return { type: 'alg', q: `Make \\(${t}\\) the subject of \\(${s} = ${m}(${t} + ${c})\\)`, a: `${s}/${m}-${c}`, lhs: `${t} =`, show: `\\(${t} = \\dfrac{${s}}{${m}} - ${c}\\)`, hint: `Type the right-hand side, e.g. Q/4 - 3.`, why: `Divide by ${m}: \\(\\dfrac{${s}}{${m}} = ${t} + ${c}\\). Subtract ${c}: \\(${t} = \\dfrac{${s}}{${m}} - ${c}\\).` }; },
    () => { const c = FD.rnd(2, 9), [s, t] = FD.pick([['A', 'r'], ['E', 'v'], ['y', 'x']]); return { type: 'alg', q: `Make \\(${t}\\) the subject of \\(${s} = \\dfrac{${t}}{${c}} + 4\\)`, a: `${c}(${s}-4)`, lhs: `${t} =`, show: `\\(${t} = ${c}(${s} - 4)\\)`, hint: 'Type the right-hand side, e.g. 5(A - 4).', why: `Subtract 4: \\(${s} - 4 = \\dfrac{${t}}{${c}}\\). Multiply by ${c}: \\(${t} = ${c}(${s} - 4)\\).` }; },
  ],
});

FD.check({
  section: 'subject',
  items: [
    { type: 'alg', q: 'Make \\(x\\) the subject of \\(y = 4x - 7\\)', a: '(y+7)/4', lhs: 'x =', show: '\\(x = \\frac{y + 7}{4}\\)', hint: 'Type the right-hand side, e.g. (y + 7)/4.', why: 'Add 7, then divide by 4.' },
    { type: 'alg', q: 'Make \\(u\\) the subject of \\(v = u + at\\)', a: 'v-at', lhs: 'u =', show: '\\(u = v - at\\)', hint: 'Type the right-hand side.', why: 'Subtract \\(at\\) from both sides.' },
    { type: 'mcq', q: 'Make \\(r\\) the subject of \\(C = 2\\pi r\\)', opts: ['\\(r = \\frac{C}{2\\pi}\\)', '\\(r = C - 2\\pi\\)', '\\(r = 2\\pi C\\)', '\\(r = \\frac{2\\pi}{C}\\)'], why: 'Divide both sides by \\(2\\pi\\).' },
    { type: 'mcq', q: 'Make \\(h\\) the subject of \\(V = \\frac13 Ah\\)', opts: ['\\(h = \\frac{3V}{A}\\)', '\\(h = \\frac{V}{3A}\\)', '\\(h = 3VA\\)', '\\(h = \\frac{A}{3V}\\)'], why: '× 3: \\(3V = Ah\\). ÷ A: \\(h = \\frac{3V}{A}\\).' },
  ],
});
