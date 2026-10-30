FD.add({
  id: 'addsub',
  title: 'Adding and subtracting negative numbers',
  tab: 'Add & subtract',
  icon: 'number',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Directed number', 'A number with a sign, + or −, that shows its direction from zero.'],
    ['Adding a negative', 'The same as subtracting: \\(5 + (-2) = 5 - 2\\).'],
    ['Subtracting a negative', 'The same as adding: \\(5 - (-2) = 5 + 2\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'as-s', '<div id="nl"></div>', `
      <label class="ctrl">Start <input type="range" id="ra" min="-10" max="10" value="-2"><output id="oa">−2</output></label>
      <div class="bd-row"><label>Operation <select id="op"><option value="+">+ add</option><option value="-" selected>− subtract</option></select></label></div>
      <label class="ctrl">Number <input type="range" id="rb" min="-10" max="10" value="-5"><output id="ob">−5</output></label>`, () => sync());
    a.nl = FD.nline(a.$('#nl'));
    const sync = () => {
      const x = +a.$('#ra').value, y = +a.$('#rb').value, op = a.$('#op').value; a.$('#oa').textContent = nbTxt(x); a.$('#ob').textContent = nbTxt(y);
      const move = op === '+' ? y : -y, r = x + move;
      a.nl({ lo: -20, hi: 20, start: x, jumps: move ? [move] : [] });
      a.big(`${x} ${op} ${FD.sn(y, true)} ${y < 0 ? `= ${x} ${op === '+' ? '-' : '+'} ${-y}` : ''} = ${r}`);
      a.msg(y < 0 ? (op === '+' ? 'Adding a negative: move <b>left</b>, like subtracting.' : 'Subtracting a negative: move <b>right</b>, like adding.') : (op === '+' ? 'Adding a positive: move right.' : 'Subtracting a positive: move left.'));
    };
    ['#ra', '#rb', '#op'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.nl({});
    return a;
  },
  steps: [
    {
      title: 'Adding: move right',
      text: '<p>Start at \\(-3\\). Adding 5 means moving <b>5 to the right</b>.</p><p>\\(-3 + 5 = 2\\)</p>',
      async on(a, ctx) {
        a.reset();
        a.nl({ start: -3 }); if (!(await ctx.sleep(800))) return;
        a.nl({ start: -3, jumps: [5] }); a.big('-3 + 5 = 2');
      },
    },
    {
      title: 'Subtracting: move left',
      text: '<p>Start at 2. Subtracting 6 means moving <b>6 to the left</b>. You go past zero.</p><p>\\(2 - 6 = -4\\)</p>',
      async on(a, ctx) {
        a.reset();
        a.nl({ start: 2 }); if (!(await ctx.sleep(800))) return;
        a.nl({ start: 2, jumps: [-6] }); a.big('2 - 6 = -4');
      },
    },
    {
      title: 'Adding a negative',
      text: '<p>Adding a negative number is the same as <b>subtracting</b>. You move left.</p><p>\\(4 + (-7) = 4 - 7 = -3\\)</p>',
      tip: 'Two different signs next to each other, \\(+-\\), make a minus.',
      async on(a, ctx) {
        a.reset(); a.nl({ start: 4 });
        if (!(await ctx.sleep(700))) return;
        a.nl({ start: 4, jumps: [-7] });
        await a.lines([['4 + (-7)', ''], ['= 4 - 7', '+ and − together make −'], ['= -3', '']], ctx, 1100);
      },
    },
    {
      title: 'Subtracting a negative',
      text: '<p>Subtracting a negative number is the same as <b>adding</b>. You move right.</p><p>\\(-2 - (-5) = -2 + 5 = 3\\)</p>',
      tip: 'Two minus signs next to each other, \\(--\\), make a plus. Taking away a debt makes you richer!',
      async on(a, ctx) {
        a.reset(); a.nl({ start: -2 });
        if (!(await ctx.sleep(700))) return;
        a.nl({ start: -2, jumps: [5] });
        await a.lines([['-2 - (-5)', ''], ['= -2 + 5', '− and − together make +'], ['= 3', '']], ctx, 1100);
      },
    },
    {
      title: 'A longer calculation',
      text: '<p>Work from left to right, one jump at a time.</p><p>\\(-6 + 9 - 12 - (-4)\\)</p>',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k <= 3; k++) { a.nl({ start: -6, jumps: [9, -12, 4], upto: k }); if (!(await ctx.sleep(1000))) return; }
        await a.lines([['-6 + 9 = 3', ''], ['3 - 12 = -9', ''], ['-9 - (-4) = -9 + 4 = -5', '']], ctx, 1000);
      },
    },
    {
      title: 'Try it: make the jump',
      text: '<p>Choose a start, an operation and a number. Watch the jump on the number line.</p><p>Compare \\(3 - 5\\) with \\(3 - (-5)\\).</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'addsub',
  gens: [
    () => { const x = FD.rndNZ(-15, 15), y = FD.rndNZ(-15, 15), op = FD.pick(['+', '-']), r = op === '+' ? x + y : x - y; return { type: 'num', q: `Work out \\(${x} ${op} ${FD.sn(y, true)}\\)`, a: r, why: y < 0 ? `\\(${x} ${op} (${y}) = ${x} ${op === '+' ? '-' : '+'} ${-y} = ${r}\\). ${op === '+' ? 'Adding a negative is subtracting.' : 'Subtracting a negative is adding.'}` : `Start at ${x} and move ${y} to the ${op === '+' ? 'right' : 'left'}: ${r}.` }; },
    () => { const v = [FD.rndNZ(-10, 10), FD.rndNZ(-10, 10), FD.rndNZ(-10, 10)], ops = [FD.pick(['+', '-']), FD.pick(['+', '-'])]; let r = v[0], txt = String(v[0]); const steps = []; ops.forEach((o, i) => { const before = r; r = o === '+' ? r + v[i + 1] : r - v[i + 1]; txt += ` ${o} ${FD.sn(v[i + 1], true)}`; steps.push(`\\(${before} ${o} ${FD.sn(v[i + 1], true)} = ${r}\\)`); }); return { type: 'num', q: `Work out \\(${txt}\\)`, a: r, why: `Left to right: ${steps.join(', then ')}.` }; },
    () => { const top = FD.rnd(2, 40), low = -FD.rnd(1, 30), what = FD.pick([['A submarine is at', 'm below sea level. A bird flies', 'm above sea level. How far is the bird above the submarine?']]); return { type: 'num', q: `${what[0]} \\(${-low}\\) ${what[1]} ${top} ${what[2]}`, a: top - low, unit: 'm', why: `Sea level is 0. The submarine is at \\(${low}\\) m: \\(${top} - (${low}) = ${top} + ${-low} = ${top - low}\\) m.` }; },
  ],
});

FD.check({
  section: 'addsub',
  items: [
    { type: 'num', q: 'Work out \\(-7 + 3\\)', a: -4, why: 'Start at \\(-7\\), move 3 right: \\(-4\\).' },
    { type: 'num', q: 'Work out \\(5 - 9\\)', a: -4, why: 'Start at 5, move 9 left: \\(-4\\).' },
    { type: 'num', q: 'Work out \\(-3 - (-8)\\)', a: 5, why: '\\(-3 - (-8) = -3 + 8 = 5\\).' },
    { type: 'num', q: 'Work out \\(6 + (-10)\\)', a: -4, why: '\\(6 + (-10) = 6 - 10 = -4\\).' },
    { type: 'mcq', q: 'Which calculation has the same answer as \\(4 - (-2)\\)?', opts: ['\\(4 + 2\\)', '\\(4 - 2\\)', '\\(-4 - 2\\)', '\\(-4 + 2\\)'], why: 'Subtracting a negative is the same as adding: \\(4 + 2 = 6\\).' },
  ],
});
