// Compound areas: split into rectangles or subtract the missing piece. Then area units: 1 cm² = 100 mm².
FD.add({
  id: 'compound',
  title: 'Compound areas and area units',
  tab: 'Compound areas',
  icon: 'target',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Compound area', 'The area of a shape made from simpler shapes: add the parts, or subtract a missing part.'],
    ['Area units', '\\(1\\ \\text{cm}^2 = 100\\ \\text{mm}^2\\), \\(1\\ \\text{m}^2 = 10\\,000\\ \\text{cm}^2\\), \\(1\\ \\text{km}^2 = 1\\,000\\,000\\ \\text{m}^2\\).'],
  ],
  mount(el) {
    const G = FD.G;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'An L-shape split into rectangles',
      ctrls: `<label class="ctrl">Method <select id="m"><option value="0">Split into two rectangles</option><option value="1">Big rectangle minus the cut-out</option></select></label>
        <label class="ctrl">Width (cm) <input type="range" id="w" min="6" max="14" value="10"><output id="ow">10</output></label>
        <label class="ctrl">Height (cm) <input type="range" id="h" min="4" max="10" value="7"><output id="oh">7</output></label>
        <label class="ctrl">Cut width (cm) <input type="range" id="cw" min="1" max="5" value="4"><output id="ocw">4</output></label>
        <label class="ctrl">Cut height (cm) <input type="range" id="ch" min="1" max="5" value="3"><output id="och">3</output></label>`,
    });
    // m: 0 split (two shaded rectangles), 1 subtract (ghost of the full rectangle), -1 plain
    a.L = (W, H, cw, ch, m = -1) => {
      const lab = [W, H - ch, cw, ch, W - cw, H].map((v) => v + ' cm'), lo = H - ch;
      let pre = () => '', post = () => '';
      if (m === 0) post = (P) => G.poly([[0, 0], [W, 0], [W, lo], [0, lo]].map(P), 'g-fill') + G.poly([[0, lo], [W - cw, lo], [W - cw, H], [0, H]].map(P), 'g-fill2') + G.t(P([W / 2, lo / 2]), `${W} × ${lo}`, 's') + G.t(P([(W - cw) / 2, lo + ch / 2]), `${W - cw} × ${ch}`, 's');
      if (m === 1) post = (P) => G.poly([[W - cw, lo], [W, lo], [W, H], [W - cw, H]].map(P), 'g-ghost') + G.t(P([W - cw / 2, lo + ch / 2]), `${cw} × ${ch}`, 's');
      a.draw(FD.shp(FD.Lpts(W, H, cw, ch), { lab: m === 1 ? [lab[0], '', '', '', '', lab[5]] : lab, pre, post, fit: [[W, H]] }).s);
    };
    a.house = () => {
      const r = FD.shp(FD.house(8, 5, 3), { lab: ['8 cm', '5 cm'], post: (P) => G.poly([[0, 5], [8, 5], [4, 8]].map(P), 'g-fill2') + G.line(P([4, 5]), P([4, 8]), 'g-dash') + G.t([P([4, 6.5])[0] + 7, P([4, 6.5])[1]], '3 cm', 'l2 st') });
      a.draw(r.s);
    };
    a.mm = () => {
      let s = G.poly([[110, 40], [310, 40], [310, 240], [110, 240]], 'g-fill') + G.grid(110, 40, 10, 10, 20, 'g-thin');
      s += G.poly([[110, 40], [130, 40], [130, 60], [110, 60]], 'g-fill2') + G.t([210, 262], '1 cm = 10 mm', 's') + G.t([100, 140], '10 mm', 's en') + G.t([320, 50], '1 mm²', 'l st');
      a.draw(s);
    };
    a.onSync(() => {
      const m = a.val('m'), W = a.val('w'), H = a.val('h'), cw = a.val('cw'), ch = Math.min(a.val('ch'), H - 1), lo = H - ch;
      a.out('w', W); a.out('h', H); a.out('cw', cw); a.out('ch', ch);
      a.L(W, H, cw, ch, m);
      a.big(m === 0 ? `${W} \\times ${lo} + ${W - cw} \\times ${ch} = ${W * lo} + ${(W - cw) * ch} = ${W * H - cw * ch}\\ \\text{cm}^2` : `${W} \\times ${H} - ${cw} \\times ${ch} = ${W * H} - ${cw * ch} = ${W * H - cw * ch}\\ \\text{cm}^2`);
      a.msg('Both methods always give the same area.');
    });
    a.L(10, 7, 4, 3);
    return a;
  },
  steps: [
    {
      title: 'Method 1: split it up',
      text: '<p>Split the L-shape into two rectangles. Find the area of each, then <b>add</b>.</p>',
      async on(a, ctx) { a.off(); a.L(10, 7, 4, 3, 0); await a.play(ctx, [['10 \\times 4 = 40\\ \\text{cm}^2', 'bottom rectangle'], ['6 \\times 3 = 18\\ \\text{cm}^2', 'top rectangle'], ['A = 40 + 18 = 58\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Method 2: subtract the missing piece',
      text: '<p>Imagine the whole rectangle around the shape, then <b>subtract</b> the corner that has been cut out.</p>',
      tip: 'Choose the method with fewer missing lengths to find.',
      async on(a, ctx) { a.off(); a.L(10, 7, 4, 3, 1); await a.play(ctx, [['10 \\times 7 = 70\\ \\text{cm}^2', 'whole rectangle'], ['4 \\times 3 = 12\\ \\text{cm}^2', 'cut-out'], ['A = 70 - 12 = 58\\ \\text{cm}^2', 'the same answer']]); },
    },
    {
      title: 'Rectangles and triangles',
      text: '<p>A rectangle 8 cm by 5 cm with a triangle on top. The triangle has base 8 cm and height 3 cm.</p>',
      async on(a, ctx) { a.off(); a.house(); await a.play(ctx, [['8 \\times 5 = 40\\ \\text{cm}^2', 'rectangle'], ['\\tfrac12 \\times 8 \\times 3 = 12\\ \\text{cm}^2', 'triangle'], ['A = 40 + 12 = 52\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Area units',
      text: '<p>A 1 cm square is 10 mm by 10 mm, so it holds \\(10 \\times 10 = 100\\) little squares.</p><ul><li>\\(1\\ \\text{cm}^2 = 100\\ \\text{mm}^2\\)</li><li>\\(1\\ \\text{m}^2 = 100 \\times 100 = 10\\,000\\ \\text{cm}^2\\)</li><li>\\(1\\ \\text{km}^2 = 1000 \\times 1000 = 1\\,000\\,000\\ \\text{m}^2\\)</li></ul>',
      tip: 'Square the length conversion: 1 m = 100 cm, so 1 m² = 100² cm².',
      async on(a, ctx) { a.off(); a.mm(); await a.play(ctx, [['3.5\\ \\text{m}^2 = 3.5 \\times 10\\,000 = 35\\,000\\ \\text{cm}^2', 'big unit to small: multiply'], ['450\\ \\text{mm}^2 = 450 \\div 100 = 4.5\\ \\text{cm}^2', 'small unit to big: divide']]); },
    },
    {
      title: 'Try it: two methods',
      text: '<p>Change the L-shape and switch between the two methods. Check that they agree.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'compound',
  gens: [
    () => { const W = FD.rnd(8, 16), H = FD.rnd(6, 12), cw = FD.rnd(2, W - 3), ch = FD.rnd(2, H - 3), A = W * H - cw * ch; return { type: 'num', q: `An L-shaped room is a \\(${W}\\) m by \\(${H}\\) m rectangle with a \\(${cw}\\) m by \\(${ch}\\) m rectangle removed from one corner. Work out the area of the room.`, a: A, unit: 'm²', why: `\\(${W} \\times ${H} - ${cw} \\times ${ch} = ${W * H} - ${cw * ch} = ${A}\\ \\text{m}^2\\).` }; },
    () => {
      const [from, to, f] = FD.pick([['cm', 'mm', 100], ['m', 'cm', 10000], ['mm', 'cm', 0.01], ['cm', 'm', 0.0001], ['km', 'm', 1000000], ['m', 'km', 0.000001]]);
      const v = f > 1 ? FD.pick([FD.rnd(2, 95) / 10, FD.rnd(2, 40)]) : FD.pick([FD.rnd(1, 99) * (f === 0.01 ? 10 : f === 0.0001 ? 1000 : 100000), FD.rnd(1, 9) * (f === 0.01 ? 100 : f === 0.0001 ? 10000 : 1000000)]);
      const ans = FD.round(v * f, 6);
      return { type: 'num', q: `Change \\(${FD.tn(v)}\\ \\text{${from}}^2\\) into \\(\\text{${to}}^2\\).`, a: ans, unit: to + '²', why: `\\(1\\ \\text{${f > 1 ? from : to}}^2 = ${FD.tn(f > 1 ? f : FD.round(1 / f, 0))}\\ \\text{${f > 1 ? to : from}}^2\\), so ${f > 1 ? 'multiply' : 'divide'}: \\(${FD.tn(v)} ${f > 1 ? '\\times' : '\\div'} ${FD.tn(f > 1 ? f : FD.round(1 / f, 0))} = ${FD.tn(ans)}\\).` };
    },
    () => { const w = 2 * FD.rnd(3, 7), h = FD.rnd(3, 9), r = FD.rnd(2, 6), A = w * h + (w * r) / 2; return { type: 'num', q: `A shape is a rectangle \\(${w}\\) cm wide and \\(${h}\\) cm tall with a triangle on top. The triangle has base \\(${w}\\) cm and perpendicular height \\(${r}\\) cm. Work out the area of the shape.`, a: A, unit: 'cm²', why: `\\(${w} \\times ${h} + \\tfrac12 \\times ${w} \\times ${r} = ${w * h} + ${(w * r) / 2} = ${A}\\ \\text{cm}^2\\).` }; },
    () => { const L = FD.rnd(6, 20), W = FD.rnd(4, L - 1), p = FD.pick([1, 2]), A = (L + 2 * p) * (W + 2 * p) - L * W; return { type: 'num', q: `A rectangular lawn is \\(${L}\\) m by \\(${W}\\) m. A path \\(${p}\\) m wide goes all the way round the outside of the lawn. Work out the area of the path.`, a: A, unit: 'm²', why: `Outer rectangle: \\(${L + 2 * p} \\times ${W + 2 * p} = ${(L + 2 * p) * (W + 2 * p)}\\). Subtract the lawn: \\(${(L + 2 * p) * (W + 2 * p)} - ${L * W} = ${A}\\ \\text{m}^2\\).` }; },
  ],
});

FD.check({
  section: 'compound',
  items: [
    { type: 'num', q: 'A 12 cm by 9 cm rectangle has a 5 cm by 4 cm rectangle cut from one corner. Find the area left.', a: 88, unit: 'cm²', why: '\\(108 - 20 = 88\\).' },
    { type: 'mcq', q: '\\(1\\ \\text{m}^2 =\\)', opts: ['\\(10\\,000\\ \\text{cm}^2\\)', '\\(100\\ \\text{cm}^2\\)', '\\(1000\\ \\text{cm}^2\\)', '\\(1\\,000\\,000\\ \\text{cm}^2\\)'], why: '\\(100 \\times 100\\).' },
    { type: 'num', q: 'Change \\(6.2\\ \\text{cm}^2\\) into \\(\\text{mm}^2\\).', a: 620, unit: 'mm²', why: '\\(6.2 \\times 100\\).' },
    { type: 'tf', q: 'Splitting a compound shape and subtracting from a bigger rectangle always give the same area.', a: true, why: 'They measure the same space.' },
  ],
});
