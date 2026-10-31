// Using Pythagoras: the distance between two points on a grid, and everyday problems.
FD.add({
  id: 'pythapps',
  title: 'Using Pythagoras in problems',
  tab: 'Problems',
  icon: 'target',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Distance between two points', 'Draw a right-angled triangle with a horizontal and a vertical side, then use Pythagoras.'],
    ['Diagonal', 'In a rectangle the diagonal is the hypotenuse of a right-angled triangle.'],
  ],
  mount(el) {
    const G = FD.G, S = 30, O = [45, 280], X = (v) => O[0] + v * S, Y = (v) => O[1] - v * S;
    const a = FD.stage(el, { vb: '0 0 420 300', drag: true, label: 'Two points on a grid joined by a line', ctrls: '<p class="small">Drag the two points. They snap to whole-number coordinates.</p>' });
    let P = [1, 2], Q = [7, 6], live = false;
    a.grid = (p = P, q = Q, st = 2) => {
      P = p; Q = q; const A = [X(P[0]), Y(P[1])], B = [X(Q[0]), Y(Q[1])], Cc = [B[0], A[1]];
      let s = G.grid(O[0], O[1] - 9 * S, 12, 9, S) + G.line([O[0], O[1]], [O[0] + 12 * S, O[1]], 'g-thin') + G.line([O[0], O[1]], [O[0], O[1] - 9 * S], 'g-thin');
      for (let i = 0; i <= 12; i += 2) s += G.t([X(i), O[1] + 12], i, 's');
      for (let j = 2; j <= 8; j += 2) s += G.t([O[0] - 12, Y(j)], j, 's');
      if (st >= 1 && P[0] !== Q[0] && P[1] !== Q[1]) s += G.line(A, Cc, 'g-dash') + G.line(Cc, B, 'g-dash') + G.right(Cc, A, B, 10) + G.t([(A[0] + Cc[0]) / 2, A[1] + (Q[1] > P[1] ? 14 : -10)], Math.abs(Q[0] - P[0]), 'l2') + G.t([Cc[0] + (Q[0] > P[0] ? 14 : -14), (Cc[1] + B[1]) / 2], Math.abs(Q[1] - P[1]), 'l2');
      if (st >= 2) s += G.line(A, B, 'g-hl');
      s += live ? G.handle(A, 'P') + G.handle(B, 'Q') : G.dot(A, 'g-dot k', 5) + G.dot(B, 'g-dot k', 5);
      s += G.t([A[0] - 4, A[1] - 16], `(${P[0]}, ${P[1]})`, 's en') + G.t([B[0] + 4, B[1] - 16], `(${Q[0]}, ${Q[1]})`, 's st');
      a.draw(s);
    };
    FD.dragIn(a.svg, (n, x, y) => { const p = [FD.clamp(Math.round((x - O[0]) / S), 0, 10), FD.clamp(Math.round((O[1] - y) / S), 0, 8)]; if (n === 'P') P = p; else Q = p; a.sync(); });
    a.onSync(() => {
      a.grid();
      const dx = Math.abs(Q[0] - P[0]), dy = Math.abs(Q[1] - P[1]), d = Math.hypot(dx, dy);
      a.big(`d = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}}`);
      a.msg(`\\(= ${FD.tn(FD.round(d, 2))}\\)${Number.isInteger(d) ? '' : ' (2 d.p.)'}`);
    });
    a.live = (on) => { live = on; };
    a.grid([1, 2], [7, 6], 0);
    return a;
  },
  steps: [
    {
      title: 'Distance between two points',
      text: '<p>How far is it from \\((1, 2)\\) to \\((9, 8)\\)? Make a right-angled triangle: across \\(9 - 1 = 8\\), up \\(8 - 2 = 6\\).</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.grid([1, 2], [9, 8], 0); if (!(await ctx.sleep(800))) return; a.grid([1, 2], [9, 8], 1);
        if (!(await ctx.sleep(900))) return; a.grid([1, 2], [9, 8], 2);
        await a.play(ctx, [['d^2 = 8^2 + 6^2 = 64 + 36 = 100', ''], ['d = 10', '']]);
      },
    },
    {
      title: 'A ladder against a wall',
      text: '<p>A 5 m ladder leans against a wall with its foot 1.4 m from the wall. How high up the wall does it reach?</p><p>The ladder is the <b>hypotenuse</b>, so subtract.</p>',
      tip: 'Always sketch the triangle and mark the hypotenuse first.',
      async on(a, ctx) { a.off(); a.live(false); a.draw(FD.G.line([60, 280], [380, 280]) + FD.G.line([300, 280], [300, 20], 'g-ln') + FD.G.line([255, 280], [300, 30], 'g-hl') + FD.G.right([300, 280], [255, 280], [300, 30], 12) + FD.G.t([250, 150], '5 m', 'l') + FD.G.t([277, 296], '1.4 m', 's') + FD.G.t([325, 160], 'h', 'l2')); await a.play(ctx, [['h^2 = 5^2 - 1.4^2 = 25 - 1.96 = 23.04', ''], ['h = \\sqrt{23.04} = 4.8\\ \\text{m}', '']]); },
    },
    {
      title: 'Isosceles triangles and rectangles',
      text: '<p>The height of an isosceles triangle splits it into <b>two right-angled triangles</b>. Sides 10 cm, 10 cm, base 12 cm: half the base is 6 cm.</p>',
      async on(a, ctx) { a.off(); a.live(false); a.draw(FD.G.poly([[110, 260], [310, 260], [210, 100]]) + FD.G.line([210, 100], [210, 260], 'g-dash') + FD.G.right([210, 260], [310, 260], [210, 100], 12) + FD.G.t([140, 170], '10 cm', 's') + FD.G.t([280, 170], '10 cm', 's') + FD.G.t([260, 278], '6 cm', 's') + FD.G.t([222, 190], 'h', 'l st')); await a.play(ctx, [['h^2 = 10^2 - 6^2 = 64', ''], ['h = 8\\ \\text{cm}', 'area = ½ × 12 × 8 = 48 cm²']]); },
    },
    {
      title: 'Try it: drag the points',
      text: '<p>Drag \\(P\\) and \\(Q\\). Read the horizontal and vertical distances and work out the length \\(PQ\\) before you look.</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'pythapps',
  gens: [
    () => { const [p, q, r] = FD.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15]]), x1 = FD.rnd(-4, 4), y1 = FD.rnd(-4, 4), sx = FD.pick([1, -1]), sy = FD.pick([1, -1]); return { type: 'num', q: `Work out the distance between \\((${x1}, ${y1})\\) and \\((${x1 + sx * p}, ${y1 + sy * q})\\).`, a: r, why: `Across: \\(${p}\\), up/down: \\(${q}\\). \\(d = \\sqrt{${p}^2 + ${q}^2} = \\sqrt{${p * p + q * q}} = ${r}\\).` }; },
    () => { const L = FD.rnd(5, 12), f = FD.rnd(10, 30) / 10, h = Math.sqrt(L * L - f * f); return { type: 'num', q: `A ${L} m ladder leans against a vertical wall. Its foot is ${FD.num(f)} m from the wall on level ground. How high up the wall does it reach? Give your answer to 2 decimal places.`, a: FD.round(h, 2), tol: 0.005, unit: 'm', why: `The ladder is the hypotenuse: \\(h^2 = ${L}^2 - ${FD.tn(f)}^2 = ${FD.tn(FD.round(L * L - f * f, 2))}\\), \\(h = ${FD.tn(FD.round(h, 2))}\\) m.` }; },
    () => { const w = FD.rnd(3, 15), l = FD.rnd(w + 1, 20), d = Math.hypot(w, l); return { type: 'num', q: `A rectangle is ${l} cm long and ${w} cm wide. Work out the length of its diagonal, to 1 decimal place.`, a: FD.round(d, 1), tol: 0.05, unit: 'cm', why: `\\(d = \\sqrt{${l}^2 + ${w}^2} = \\sqrt{${l * l + w * w}} = ${FD.tn(FD.round(d, 1))}\\) cm.` }; },
  ],
});

FD.check({
  section: 'pythapps',
  items: [
    { type: 'num', q: 'Find the distance between \\((2, 1)\\) and \\((7, 13)\\).', a: 13, why: 'Across 5, up 12: \\(\\sqrt{25 + 144} = 13\\).' },
    { type: 'num', q: 'A rectangle is 24 cm by 7 cm. How long is its diagonal?', a: 25, unit: 'cm', why: '\\(\\sqrt{576 + 49} = \\sqrt{625} = 25\\).' },
    { type: 'num', q: 'An isosceles triangle has equal sides 13 cm and base 10 cm. Find its height.', a: 12, unit: 'cm', why: 'Half base 5: \\(\\sqrt{169 - 25} = 12\\).' },
    { type: 'tf', q: 'A triangle with sides 7 cm, 8 cm and 11 cm is right-angled.', a: false, why: '\\(49 + 64 = 113 \\ne 121\\).' },
  ],
});
