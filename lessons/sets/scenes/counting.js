FD.add({
  id: 'counting',
  title: 'Solving problems with Venn diagrams',
  tab: 'Problems',
  icon: 'target',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Numbers in regions', 'Instead of elements, write <b>how many</b> elements are in each region.'],
    ['Work from the middle', 'Fill the overlap first, then the rest of each circle, then the outside.'],
    ['\\(n(A \\cup B)\\)', '\\(= n(A) + n(B) - n(A \\cap B)\\): the overlap would otherwise be counted twice.'],
  ],
  mount(el) {
    const a = FD.board(el, 'co-s', '<div id="vd"></div>', `
      <label class="ctrl">Students in the class <input type="range" id="rt" min="20" max="40" value="30"><output id="ot">30</output></label>
      <label class="ctrl">Play football (F) <input type="range" id="ra" min="0" max="40" value="18"><output id="oa">18</output></label>
      <label class="ctrl">Play tennis (T) <input type="range" id="rb" min="0" max="40" value="15"><output id="ob">15</output></label>
      <label class="ctrl">Play both <input type="range" id="rc" min="0" max="20" value="7"><output id="oc">7</output></label>`, () => sync());
    a.vd = FD.venn(a.$('#vd'));
    const sync = () => {
      const [t, f, s, b] = ['t', 'a', 'b', 'c'].map((k) => { const v = +a.$('#r' + k).value; a.$('#o' + k).textContent = v; return v; });
      const fo = f - b, so = s - b, ne = t - fo - so - b;
      if (fo < 0 || so < 0 || ne < 0) { a.vd({ labels: ['F', 'T'] }); a.big(''); a.msg(fo < 0 || so < 0 ? 'More students play both than play one of the sports: impossible!' : `The circles hold ${fo + so + b} students, more than the ${t} in the class: impossible!`, 'bad'); return; }
      a.vd({ labels: ['F', 'T'], counts: { 10: fo, 11: b, '01': so, '00': ne } });
      a.big(`n(F \\cup T) = ${f} + ${s} - ${b} = ${fo + so + b}`);
      a.msg(`Football only: ${f} − ${b} = ${fo}. Tennis only: ${s} − ${b} = ${so}. Neither: ${t} − ${fo + so + b} = ${ne}.`);
    };
    ['#rt', '#ra', '#rb', '#rc'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.vd({ labels: ['F', 'T'] });
    return a;
  },
  steps: [
    {
      title: 'Start in the middle',
      text: '<p>In a class of 30, 18 play football (F), 15 play tennis (T) and 7 play both.</p><p>Put the 7 in the <b>overlap</b> first. Then football only is \\(18 - 7 = 11\\) and tennis only is \\(15 - 7 = 8\\).</p>',
      tip: 'The 18 footballers include the 7 who play both: subtract them.',
      async on(a, ctx) {
        a.reset();
        const C = [{ 11: 7 }, { 11: 7, 10: 11 }, { 11: 7, 10: 11, '01': 8 }, { 11: 7, 10: 11, '01': 8, '00': 4 }];
        for (const c of C) { a.vd({ labels: ['F', 'T'], counts: c }); if (!(await ctx.sleep(1100))) return; }
        a.big('30 - 11 - 7 - 8 = 4 \\text{ play neither}');
      },
    },
    {
      title: 'Answering questions',
      text: '<p>Read each question carefully: “football <b>only</b>”, “at least one”, “neither”.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['F', 'T'], counts: { 11: 7, 10: 11, '01': 8, '00': 4 }, shade: ['10', '11', '01'] });
        await a.lines([["n(F \\cap T') = 11", 'football only'], ['n(F \\cup T) = 11 + 7 + 8 = 26', 'at least one sport'], ["n((F \\cup T)') = 4", 'neither']], ctx, 1400);
      },
    },
    {
      title: 'An unknown in the overlap',
      text: '<p>40 people were asked. 25 drink tea (T), 22 drink coffee (C) and 3 drink neither. How many drink both?</p><p>Call the overlap \\(x\\) and add up all four regions.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['T', 'C'], counts: { 11: 'x', 10: '25 − x', '01': '22 − x', '00': 3 } });
        await a.lines([['(25 - x) + x + (22 - x) + 3 = 40', 'all regions add to 40'], ['50 - x = 40', ''], ['x = 10', 'so 10 drink both']], ctx, 1400);
        a.vd({ labels: ['T', 'C'], counts: { 11: 10, 10: 15, '01': 12, '00': 3 } });
      },
    },
    {
      title: 'Three sets',
      text: '<p>With three circles there are 8 regions. Always start in the <b>centre</b> (all three), then the overlaps of two, then each circle on its own, then the outside.</p>',
      tip: 'Subtract what is already in a circle before writing its “only” region.',
      async on(a, ctx) {
        a.reset();
        const C = [{ 111: 2 }, { 111: 2, 110: 3, 101: 1, '011': 4 }, { 111: 2, 110: 3, 101: 1, '011': 4, 100: 6, '010': 5, '001': 7 }, { 111: 2, 110: 3, 101: 1, '011': 4, 100: 6, '010': 5, '001': 7, '000': 2 }];
        for (const c of C) { a.vd({ k: 3, labels: ['A', 'B', 'C'], counts: c }); if (!(await ctx.sleep(1200))) return; }
        a.big('n(\\mathcal{E}) = 2 + 3 + 1 + 4 + 6 + 5 + 7 + 2 = 30');
      },
    },
    {
      title: 'Try it: football and tennis',
      text: '<p>Change the numbers. The Venn diagram is filled in from the middle. Some choices are impossible: can you find one?</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'counting',
  gens: [
    () => { let t, f, s, b; do { t = FD.rnd(25, 40); b = FD.rnd(2, 10); f = b + FD.rnd(3, 15); s = b + FD.rnd(3, 15); } while (f + s - b > t); const ask = FD.pick(['neither', 'only', 'one']); const ans = ask === 'neither' ? t - (f + s - b) : ask === 'only' ? f - b : f + s - 2 * b; return { type: 'num', q: `There are ${t} students. ${f} study French, ${s} study Spanish and ${b} study both. How many study ${ask === 'neither' ? 'neither language' : ask === 'only' ? 'French only' : 'exactly one language'}?`, a: ans, why: `Overlap ${b}. French only: \\(${f} - ${b} = ${f - b}\\). Spanish only: \\(${s} - ${b} = ${s - b}\\). Neither: \\(${t} - ${f - b} - ${b} - ${s - b} = ${t - (f + s - b)}\\). So the answer is ${ans}.` }; },
    () => { let t, x, a1, b1, ne; do { t = FD.rnd(30, 60); x = FD.rnd(3, 12); a1 = x + FD.rnd(4, 15); b1 = x + FD.rnd(4, 15); ne = t - (a1 + b1 - x); } while (ne < 1); return { type: 'num', q: `${t} people were asked. ${a1} have a cat, ${b1} have a dog and ${ne} have neither. How many have both a cat and a dog?`, a: x, why: `Let the overlap be \\(x\\): \\((${a1} - x) + x + (${b1} - x) + ${ne} = ${t}\\), so \\(${a1 + b1 + ne} - x = ${t}\\) and \\(x = ${x}\\).` }; },
    () => { const n = { 111: FD.rnd(1, 4), 110: FD.rnd(1, 5), 101: FD.rnd(1, 5), '011': FD.rnd(1, 5), 100: FD.rnd(2, 8), '010': FD.rnd(2, 8), '001': FD.rnd(2, 8), '000': FD.rnd(0, 5) }; const nA = n[111] + n[110] + n[101] + n[100]; return { type: 'num', q: `In a three-set Venn diagram: all three ${n[111]}, A and B only ${n[110]}, A and C only ${n[101]}, B and C only ${n['011']}, A only ${n[100]}. Find \\(n(A)\\).`, a: nA, why: `\\(n(A)\\) is every region inside circle A: \\(${n[111]} + ${n[110]} + ${n[101]} + ${n[100]} = ${nA}\\).` }; },
  ],
});

FD.check({
  section: 'counting',
  items: [
    { type: 'num', q: '\\(n(A) = 12\\), \\(n(B) = 9\\) and \\(n(A \\cap B) = 4\\). Find \\(n(A \\cup B)\\).', a: 17, why: '\\(12 + 9 - 4 = 17\\).' },
    { type: 'num', q: '50 students: 30 like maths, 26 like art, 4 like neither. How many like both?', a: 10, why: '\\((30 - x) + x + (26 - x) + 4 = 50 \\Rightarrow 60 - x = 50 \\Rightarrow x = 10\\).' },
    { type: 'mcq', q: 'In a Venn diagram problem, which region should you fill in first?', opts: ['The overlap of all the sets', 'The outside', 'The biggest set', 'Any region'], why: 'The overlap is part of every circle, so the other regions depend on it.' },
    { type: 'num', q: '20 cars: 12 are red, 5 are vans, 3 are red vans. How many cars are neither red nor vans?', a: 6, why: 'Red only 9, vans only 2, both 3: \\(20 - 14 = 6\\).' },
  ],
});
