// Arithmetic series: two copies of the staircase fit together into a rectangle n by (first + last).
FD.add({
  id: 'series',
  title: 'Arithmetic series',
  tab: 'Series',
  icon: 'calc',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Series', 'The sum of the terms of a sequence.'],
    ['\\(S_n\\)', 'The sum of the first \\(n\\) terms: \\(S_n = \\frac{n}{2}(2a + (n - 1)d)\\), or \\(\\frac{n}{2}(a + l)\\) with \\(l\\) the last term.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'sq-r', side: true,
      vis: '<svg class="sr-stair" viewBox="0 0 330 260" role="img" aria-label="Two staircases of blocks fitting together into a rectangle" data-k="st"></svg>',
      tryHtml: `<label class="ctrl">\\(a\\) <input type="range" data-k="a" min="1" max="5" value="1"><output data-k="oa">1</output></label>
        <label class="ctrl">\\(d\\) <input type="range" data-k="d" min="1" max="3" value="2"><output data-k="od">2</output></label>
        <label class="ctrl">\\(n\\) <input type="range" data-k="n" min="2" max="8" value="5"><output data-k="on">5</output></label>`,
    });
    const st = a.$('[data-k="st"]');
    a.stair = (A, d, n, both) => {
      const last = A + (n - 1) * d, u = Math.min(300 / (A + last), 230 / n), h = u;
      let s = '';
      for (let i = 0; i < n; i++) {
        const t = A + i * d, y = 15 + i * h;
        s += `<rect class="sr-a" x="15" y="${y}" width="${t * u}" height="${h - 2}"/>`;
        if (both) s += `<rect class="sr-b" x="${15 + t * u}" y="${y}" width="${(A + last - t) * u}" height="${h - 2}"/>`;
      }
      st.innerHTML = s + (both ? `<text class="g-lbl" x="${15 + ((A + last) * u) / 2}" y="${Math.min(252, 15 + n * h + 14)}" text-anchor="middle">a + l = ${A + last}</text>` : '');
    };
    const sync = () => {
      const A = +a.$('[data-k="a"]').value, d = +a.$('[data-k="d"]').value, n = +a.$('[data-k="n"]').value;
      ['a', 'd', 'n'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = [A, d, n][i]; });
      a.stair(A, d, n, true);
      const l = A + (n - 1) * d;
      a.big(`S_{${n}} = \\frac{${n}}{2}(${A} + ${l}) = ${(n * (A + l)) / 2}`);
      a.msg(`Two copies make a ${n} by ${A + l} rectangle: \\(${n} \\times ${A + l} = ${n * (A + l)}\\). Half of it is the sum.`);
    };
    ['a', 'd', 'n'].forEach((s) => a.$(`[data-k="${s}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.stair(1, 1, 6, false);
    return a;
  },
  steps: [
    {
      title: 'Adding up a staircase',
      text: '<p>\\(1 + 2 + 3 + 4 + 5 + 6\\). Draw it as a staircase of blocks. Now add a second, upside-down copy.</p>',
      async on(a, ctx) { a.tryMode(false); a.big('1 + 2 + 3 + 4 + 5 + 6'); a.stair(1, 1, 6, false); if (!(await ctx.sleep(1500))) return; a.stair(1, 1, 6, true); a.msg('Two copies make a 6 by 7 rectangle: 42 blocks. So the sum is 21.'); },
    },
    {
      title: 'The formula',
      text: '<p>The rectangle is \\(n\\) rows long and (first + last) wide. Half of it is the sum:</p><p>\\(S_n = \\frac{n}{2}(a + l) = \\frac{n}{2}\\big(2a + (n - 1)d\\big)\\)</p>',
      tip: 'Use \\(\\frac{n}{2}(a + l)\\) when you know the last term \\(l\\).',
      on: FD.walk([['S_n = \\frac{n}{2}(a + l)', ''], ['l = a + (n - 1)d', ''], ['S_n = \\frac{n}{2}\\big(2a + (n - 1)d\\big)', '']], (a) => { a.stair(1, 1, 6, true); a.big(''); a.msg(''); }),
    },
    {
      title: 'Using the formula',
      text: '<p>Find the sum of the first 40 terms of 5, 8, 11, … Here \\(a = 5\\), \\(d = 3\\), \\(n = 40\\).</p>',
      on: FD.walk([['S_{40} = \\frac{40}{2}(2 \\times 5 + 39 \\times 3)', ''], ['= 20 \\times 127', ''], ['= 2540', '']], (a) => { a.stair(5, 3, 4, true); a.big(''); a.msg(''); }),
    },
    {
      title: 'Try it: build the rectangle',
      text: '<p>Change \\(a\\), \\(d\\) and \\(n\\). Two copies of the staircase always make a rectangle, so the sum is half of it.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'series',
  gens: [
    () => { const A = FD.rnd(-5, 15), d = FD.rndNZ(-3, 6), n = FD.rnd(10, 50); const S = (n / 2) * (2 * A + (n - 1) * d); return { type: 'num', q: `Find the sum of the first ${n} terms of the arithmetic sequence with first term ${A} and common difference ${d}.`, a: S, why: `\\(S_{${n}} = \\dfrac{${n}}{2}\\big(2(${A}) + ${n - 1}(${d})\\big) = ${n / 2} \\times ${2 * A + (n - 1) * d} = ${FD.num(S)}\\).` }; },
    () => { const N = FD.pick([50, 100, 60, 80, 200]); return { type: 'num', q: `Work out \\(1 + 2 + 3 + \\dots + ${N}\\).`, a: (N * (N + 1)) / 2, why: `\\(\\dfrac{${N}}{2}(1 + ${N}) = ${FD.num((N * (N + 1)) / 2)}\\).` }; },
  ],
});

FD.check({
  section: 'series',
  items: [
    { type: 'num', q: 'Find the sum of the first 20 terms of 3, 7, 11, …', a: 820, why: '\\(10(6 + 19 \\times 4) = 10 \\times 82\\).' },
    { type: 'num', q: 'Find \\(2 + 4 + 6 + \\dots + 100\\).', a: 2550, why: '50 terms: \\(\\frac{50}{2}(2 + 100)\\).' },
    { type: 'mcq', q: 'Which formula gives the sum of the first \\(n\\) terms of an arithmetic series?', opts: ['\\(\\frac{n}{2}(2a + (n - 1)d)\\)', '\\(a + (n - 1)d\\)', '\\(n(a + d)\\)', '\\(\\frac{n}{2}(a + d)\\)'], why: '\\(a + (n - 1)d\\) is one term, not the sum.' },
  ],
});
