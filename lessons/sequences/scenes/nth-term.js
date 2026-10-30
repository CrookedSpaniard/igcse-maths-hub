// The nth term of an arithmetic sequence: compare with the times table of the difference.
FD.add({
  id: 'nth-term',
  title: 'The nth term',
  tab: 'nth term',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Arithmetic sequence', 'A sequence that goes up or down by the same amount each time (the common difference).'],
    ['nth term', 'A formula in \\(n\\) that gives every term, like \\(4n + 1\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sq-n', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Difference \\(d\\) <input type="range" data-k="d" min="-4" max="6" value="4"><output data-k="od">4</output></label>
        <label class="ctrl">First term <input type="range" data-k="f" min="-8" max="12" value="5"><output data-k="of">5</output></label>`,
    });
    const g = FD.graph(a.$('[data-k="g"]'), { w: 400, h: 340, x: [0, 7], y: [-20, 40], step: 1, ystep: 5, label: 'Terms of a sequence plotted against n' });
    a.plot = (d, f, showTable) => {
      const c = f - d, pts = [1, 2, 3, 4, 5, 6].map((n) => [n, d * n + c]);
      g.draw((showTable ? pts.map(([n]) => `<line class="sq-tt" x1="${g.ax.X(n)}" y1="${g.ax.Y(0)}" x2="${g.ax.X(n)}" y2="${g.ax.Y(d * n)}"/>`).join('') : '') + `<path class="curve" d="${g.ax.path((x) => d * x + c, 1, 6)}"/>`, pts.map(([n, t]) => g.pt(n, t, 'hot')).join(''));
    };
    const sync = () => {
      const d = +a.$('[data-k="d"]').value, f = +a.$('[data-k="f"]').value;
      a.$('[data-k="od"]').textContent = String(d).replace('-', '−'); a.$('[data-k="of"]').textContent = String(f).replace('-', '−');
      a.plot(d, f);
      a.big(`${[1, 2, 3, 4].map((n) => d * n + f - d).join(', ')}, \\dots \\;\\to\\; ${FD.poly([d, f - d], 'n')}`);
      a.msg(`Difference ${d} gives \\(${d}n\\); then adjust: \\(${f} - ${d < 0 ? `(${d})` : d} = ${f - d}\\).`);
    };
    ['d', 'f'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.plot(4, 5);
    return a;
  },
  steps: [
    {
      title: 'Compare with a times table',
      text: '<p>5, 9, 13, 17, … goes up by 4, so compare it with the 4 times table: 4, 8, 12, 16.</p><p>Every term is <b>1 more</b> than the 4 times table, so the nth term is \\(4n + 1\\).</p>',
      on: FD.walk([['\\text{Sequence: } 5, 9, 13, 17', 'difference 4'], ['4n: \\; 4, 8, 12, 16', 'the 4 times table'], ['\\text{nth term} = 4n + 1', 'each term is 1 more']], (a) => { a.plot(4, 5, true); a.big(''); }),
    },
    {
      title: 'Decreasing sequences',
      text: '<p>20, 17, 14, 11, … goes down by 3. Compare with \\(-3n\\): −3, −6, −9, −12. Each term is 23 more.</p><p>nth term: \\(-3n + 23\\), or \\(23 - 3n\\).</p>',
      tip: 'Quick check: put \\(n = 1\\) into your formula. You should get the first term.',
      on: FD.walk([['-3n: \\; -3, -6, -9, -12', ''], ['\\text{nth term} = 23 - 3n', 'add 23'], ['n = 1: \\; 23 - 3 = 20 \\;\\checkmark', '']], (a) => { a.plot(-3, 20, true); a.big(''); }),
    },
    {
      title: 'Is a number in the sequence?',
      text: '<p>Is 100 in the sequence \\(4n + 1\\)? Solve \\(4n + 1 = 100\\): \\(n = 24.75\\). That is not a whole number, so 100 is <b>not</b> a term.</p>',
      on: FD.walk([['4n + 1 = 100', ''], ['4n = 99 \\Rightarrow n = 24.75', ''], ['\\text{not a whole number: 100 is not a term}', '']], (a) => { a.plot(4, 5); a.big(''); }),
    },
    {
      title: 'Try it: d and the first term',
      text: '<p>Change the difference and the first term. The points always lie on a straight line: that is why these are called <b>linear</b> sequences.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'nth-term',
  gens: [
    () => { const d = FD.rndNZ(-6, 9), c = FD.rnd(-9, 12), t = [1, 2, 3, 4].map((n) => d * n + c); return { type: 'alg', q: `Find the nth term of \\(${t.join(', ')}, \\dots\\)`, a: `${d}n${FD.sg(c).replace(/\s/g, '')}`, show: `\\(${FD.poly([d, c], 'n')}\\)`, hint: 'Type it like 4n + 1.', why: `The difference is ${d}, so compare with \\(${d}n\\): ${[1, 2, 3, 4].map((n) => d * n).join(', ')}. Each term is ${Math.abs(c)} ${c >= 0 ? 'more' : 'less'}, so the nth term is \\(${FD.poly([d, c], 'n')}\\).` }; },
    () => { const d = FD.rnd(2, 7), c = FD.rnd(-5, 6), N = FD.rnd(40, 150), ok = (N - c) % d === 0; return { type: 'tf', q: `Is ${N} a term of the sequence with nth term \\(${FD.poly([d, c], 'n')}\\)?`, a: ok, why: `\\(${FD.poly([d, c], 'n')} = ${N}\\) gives \\(n = ${FD.round((N - c) / d, 3)}\\), ${ok ? 'a whole number, so yes' : 'not a whole number, so no'}.` }; },
  ],
});

FD.check({
  section: 'nth-term',
  items: [
    { type: 'alg', q: 'Find the nth term of 7, 10, 13, 16, …', a: '3n+4', show: '\\(3n + 4\\)', hint: 'Type it like 4n + 1.', why: 'Difference 3; \\(3n\\) is 3, 6, 9…; add 4.' },
    { type: 'alg', q: 'Find the nth term of 15, 13, 11, 9, …', a: '17-2n', show: '\\(17 - 2n\\)', hint: 'Type it like 17 - 2n.', why: 'Difference −2; \\(-2n\\) is −2, −4…; add 17.' },
    { type: 'tf', q: '50 is a term of the sequence \\(3n + 2\\).', a: true, why: '\\(3n + 2 = 50\\) gives \\(n = 16\\).' },
    { type: 'mcq', q: 'Which sequence has nth term \\(6n - 5\\)?', opts: ['1, 7, 13, 19', '6, 12, 18, 24', '−5, 1, 7, 13', '1, 6, 11, 16'], why: '\\(n = 1\\): 1; \\(n = 2\\): 7.' },
  ],
});
