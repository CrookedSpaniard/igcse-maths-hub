// Multiplying first: scale one or both equations so a pair of coefficients match, then eliminate.
FD.add({
  id: 'scaling',
  title: 'Multiplying first',
  tab: 'Multiply first',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Scale an equation', 'Multiply <b>every</b> term (both sides) by the same number. The equation is still true.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'si-s',
      tryHtml: `<p class="ab-ask">\\(3x + 2y = 12\\) and \\(5x - 3y = 1\\). Make the \\(y\\) terms match.</p>
        <label class="ctrl">× first equation <input type="range" data-k="m" min="1" max="5" value="1"><output data-k="om">1</output></label>
        <label class="ctrl">× second equation <input type="range" data-k="n" min="1" max="5" value="1"><output data-k="on">1</output></label>`,
    });
    const sync = () => {
      const m = +a.$('[data-k="m"]').value, n = +a.$('[data-k="n"]').value;
      a.$('[data-k="om"]').textContent = m; a.$('[data-k="on"]').textContent = n;
      const e1 = [3 * m, 2 * m, 12 * m], e2 = [5 * n, -3 * n, 1 * n];
      const ok = e1[1] === -e2[1];
      a.big(siSys(e1, e2, ok ? `${e1[0] + e2[0]}x &= ${e1[2] + e2[2]}` : ''));
      a.msg(ok ? `✓ \\(+${e1[1]}y\\) and \\(${e2[1]}y\\) cancel when you add. \\(x = ${(e1[2] + e2[2]) / (e1[0] + e2[0])}\\), then \\(y = ${(12 - 3 * 2) / 2}\\).` : `The \\(y\\) coefficients are ${e1[1]} and ${e2[1]}. Make them the same size.`, ok ? 'good' : 'bad');
    };
    ['m', 'n'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'No matching coefficients',
      text: '<p>\\(2x + y = 7\\) and \\(3x - 2y = 7\\). Neither letter has matching coefficients, so adding or subtracting will not eliminate anything yet.</p>',
      async on(a) { a.tryMode(false); a.big(siSys([2, 1, 7], [3, -2, 7])); a.msg(''); },
    },
    {
      title: 'Multiply one equation',
      text: '<p>Multiply the first equation by 2. Now it has \\(+2y\\), and the second has \\(-2y\\). Add to eliminate \\(y\\).</p>',
      tip: 'Multiply <b>every</b> term, including the number on the right.',
      async on(a, ctx) {
        a.tryMode(false); a.big(siSys([2, 1, 7], [3, -2, 7]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([4, 2, 14], [3, -2, 7]));
        if (!(await ctx.sleep(1200))) return; a.big(siSys([4, 2, 14], [3, -2, 7], '7x &= 21'));
        a.work([['x = 3', ''], ['2(3) + y = 7 \\Rightarrow y = 1', 'substitute']]);
        for (let i = 0; i < 2; i++) { a.upto(i); if (!(await ctx.sleep(1300))) return; }
      },
    },
    {
      title: 'Multiply both equations',
      text: '<p>\\(3x + 4y = 10\\) and \\(2x + 3y = 7\\). Make the \\(x\\) terms both \\(6x\\): multiply the first by 2 and the second by 3.</p>',
      on: FD.walk([['6x + 8y = 20', '× 2'], ['6x + 9y = 21', '× 3'], ['y = 1', 'subtract'], ['3x + 4 = 10 \\Rightarrow x = 2', 'substitute']], (a) => { a.big(siSys([3, 4, 10], [2, 3, 7])); }, 1400),
    },
    {
      title: 'Try it: find the multipliers',
      text: '<p>Choose what to multiply each equation by so that the \\(y\\) terms cancel.</p>',
      tip: 'The lowest common multiple of 2 and 3 is 6.',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({ section: 'scaling', gens: [siGen(null), siGen(null)] });

FD.check({
  section: 'scaling',
  items: [
    { type: 'num', q: 'Solve \\(3x + y = 11\\) and \\(2x + 3y = 12\\).', a: [3, 2], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'First × 3: \\(9x + 3y = 33\\). Subtract: \\(7x = 21\\), \\(x = 3\\), \\(y = 2\\).' },
    { type: 'num', q: 'Solve \\(5x + 2y = 4\\) and \\(3x - 4y = 18\\).', a: [2, -3], fields: ['\\(x\\) =', '\\(y\\) ='], why: 'First × 2: \\(10x + 4y = 8\\). Add: \\(13x = 26\\), \\(x = 2\\), \\(y = -3\\).' },
    { type: 'mcq', q: 'To eliminate \\(x\\) from \\(4x + 5y = 3\\) and \\(6x - 2y = 14\\), multiply…', opts: ['the first by 3 and the second by 2', 'both by 4', 'the first by 6 and the second by 5', 'the second by 2 only'], why: 'That gives \\(12x\\) in both.' },
    { type: 'tf', q: 'When you multiply an equation by 3, you multiply only the \\(x\\) and \\(y\\) terms.', a: false, why: 'Every term, including the number on the right.' },
  ],
});
