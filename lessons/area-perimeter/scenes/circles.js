// Circles: circumference C = πd (just over three diameters), area A = πr², and semicircles.
FD.add({
  id: 'circles',
  title: 'Circumference and area of a circle',
  tab: 'Circles',
  icon: 'geometry',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Radius', 'The distance from the centre to the edge of a circle, \\(r\\).'],
    ['Diameter', 'A line across the circle through the centre: \\(d = 2r\\).'],
    ['Circumference', 'The perimeter of a circle: \\(C = \\pi d = 2\\pi r\\).'],
    ['Area of a circle', '\\(A = \\pi r^2\\).'],
  ],
  mount(el) {
    const G = FD.G, c = [150, 150], R = 100;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A circle with its radius and diameter',
      ctrls: `<label class="ctrl">Shape <select id="ty"><option value="0">Circle</option><option value="1">Semicircle</option></select></label>
        <label class="ctrl">Radius \\(r\\) (cm) <input type="range" id="r" min="1" max="10" step="0.5" value="5"><output id="or">5</output></label>`,
    });
    // o: semi, hl (highlight the edge), sq (show an r by r square), names (label the parts), r / d labels
    a.circ = (o = {}) => {
      const semi = `M${c[0] - R} ${c[1]} A${R} ${R} 0 0 1 ${c[0] + R} ${c[1]}`;
      let s = o.semi ? `<path class="g-fill" d="${semi} Z"/>` : G.circ(c, R, 'g-fill');
      if (o.sq) s += G.poly([c, [c[0] + R, c[1]], [c[0] + R, c[1] - R], [c[0], c[1] - R]], 'g-fill2') + G.t([c[0] + R / 2, c[1] - R / 2], 'r²', 'l');
      if (o.hl) s += o.semi ? `<path class="g-hl" d="${semi}"/>` : G.circ(c, R, 'g-hl');
      s += G.line([c[0] - R, c[1]], [c[0] + R, c[1]], o.semi ? 'g-hl2' : 'g-dash') + G.dot(c, 'g-dot', 4);
      if (o.sq) s += G.t([c[0] + R / 2, c[1] + 14], o.r || 'r', 's');
      else s += G.line(c, G.polar(c, R, 40), 'g-ln') + G.t([190, 136], o.r || 'r', 's st');
      if (o.d) s += G.t([c[0] - R / 2, c[1] + 16], o.d, 'l2');
      if (o.names) s += G.t([145, 168], 'centre', 's en') + G.t([95, 138], 'diameter', 's') + G.t([258, 62], 'circumference', 'l st');
      a.draw(s);
    };
    a.unroll = (st) => {
      const o = [80, 95], r = 45, x0 = 35, y = 215, L = Math.PI * 2 * r;
      let s = G.circ(o, r, 'g-fill') + G.circ(o, r, 'g-hl') + G.line([o[0] - r, o[1]], [o[0] + r, o[1]], 'g-hl2') + G.t([o[0], o[1] - 10], 'd', 'l2');
      if (st) {
        s += G.line([x0, y], [x0 + L, y], 'g-hl');
        for (let k = 0; k <= 3; k++) s += G.line([x0 + k * 2 * r, y - 8], [x0 + k * 2 * r, y + 8], 'g-thin');
        for (let k = 0; k < 3; k++) s += G.t([x0 + (k + 0.5) * 2 * r, y - 16], 'd', 'l2');
        s += G.t([x0 + L + 8, y], '≈ 3.14 d', 'l st') + G.t([x0 + L / 2, y + 26], 'the circumference, unrolled', 's');
      }
      a.draw(s);
    };
    a.onSync(() => {
      const semi = a.val('ty') === 1, r = a.val('r'), C = 2 * Math.PI * r, A = Math.PI * r * r;
      a.out('r', r);
      a.circ({ semi, hl: true, r: `r = ${FD.num(r)} cm`, d: semi ? `d = ${FD.num(2 * r)} cm` : '' });
      if (semi) { a.big(`P = \\tfrac12 \\pi \\times ${FD.num(2 * r)} + ${FD.num(2 * r)} = ${FD.num(FD.round(C / 2 + 2 * r, 1))}\\ \\text{cm}`); a.msg(`Area \\(= \\tfrac12 \\pi \\times ${FD.tn(r)}^2 = ${FD.tn(FD.round(A / 2, 1))}\\ \\text{cm}^2\\)`); }
      else { a.big(`C = 2\\pi \\times ${FD.num(r)} = ${FD.num(FD.round(C, 1))}\\ \\text{cm}`); a.msg(`Area \\(= \\pi \\times ${FD.tn(r)}^2 = ${FD.tn(FD.round(A, 1))}\\ \\text{cm}^2\\)`); }
    });
    a.circ({ names: true, r: 'radius' });
    return a;
  },
  steps: [
    {
      title: 'Parts of a circle',
      text: '<p>The <b>radius</b> \\(r\\) goes from the centre to the edge. The <b>diameter</b> \\(d\\) goes right across through the centre, so \\(d = 2r\\).</p><p>The perimeter of a circle has a special name: the <b>circumference</b>.</p>',
      on(a) { a.off(); a.circ({ names: true, hl: true, r: 'radius' }); },
    },
    {
      title: 'Circumference: just over 3 diameters',
      text: '<p>Unroll the edge of any circle: it is always a bit more than <b>3 diameters</b> long. The exact number is \\(\\pi = 3.14159…\\)</p><p class="mbig">\\(C = \\pi d = 2\\pi r\\)</p>',
      async on(a, ctx) { a.off(); a.unroll(false); if (!(await ctx.sleep(1000))) return; a.unroll(true); await a.play(ctx, [['d = 6\\ \\text{cm}:\\ C = \\pi \\times 6', ''], ['C = 18.8\\ \\text{cm}', '1 d.p.']]); },
    },
    {
      title: 'Area: π lots of r²',
      text: '<p>The square on the radius has area \\(r^2\\). The circle holds a bit more than <b>3</b> of these squares: exactly \\(\\pi\\) of them.</p><p class="mbig">\\(A = \\pi r^2\\)</p>',
      tip: 'Square the radius first, then multiply by π. If you are given the diameter, halve it.',
      async on(a, ctx) { a.off(); a.circ({ sq: true, r: '5 cm' }); await a.play(ctx, [['A = \\pi \\times 5^2 = \\pi \\times 25', ''], ['A = 78.5\\ \\text{cm}^2', '1 d.p.']]); },
    },
    {
      title: 'Semicircles',
      text: '<p>A semicircle is half a circle. Its <b>perimeter</b> is half the circumference <b>plus the diameter</b>.</p><p>Here the diameter is 10 cm, so \\(r = 5\\) cm.</p>',
      tip: 'Forgetting the straight edge is the most common mistake.',
      async on(a, ctx) { a.off(); a.circ({ semi: true, hl: true, r: '5 cm', d: '10 cm' }); await a.play(ctx, [['\\tfrac12 \\times \\pi \\times 10 = 15.7…\\ \\text{cm}', 'curved edge'], ['P = 15.7… + 10 = 25.7\\ \\text{cm}', 'add the diameter'], ['A = \\tfrac12 \\times \\pi \\times 5^2 = 39.3\\ \\text{cm}^2', '']]); },
    },
    {
      title: 'Answers in terms of π',
      text: '<p>Some questions say “give your answer <b>in terms of \\(\\pi\\)</b>”. Then leave \\(\\pi\\) as a letter: do not use the \\(\\pi\\) button.</p>',
      async on(a, ctx) { a.off(); a.circ({ hl: true, r: '4 cm' }); await a.play(ctx, [['C = 2 \\times \\pi \\times 4 = 8\\pi\\ \\text{cm}', ''], ['A = \\pi \\times 4^2 = 16\\pi\\ \\text{cm}^2', 'exact answers']]); },
    },
    {
      title: 'Try it: change the radius',
      text: '<p>Change the radius, and switch between a circle and a semicircle.</p>',
      tip: 'Double the radius: the circumference doubles, but the area is 4 times as big.',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'circles',
  gens: [
    () => { const r = FD.rnd(2, 20), useD = FD.pick([true, false]), C = 2 * Math.PI * r; return { type: 'num', q: `A circle has a ${useD ? 'diameter' : 'radius'} of \\(${useD ? 2 * r : r}\\) cm. Work out its circumference, to 1 decimal place.`, a: FD.round(C, 1), tol: 0.05, unit: 'cm', why: `\\(C = \\pi d = \\pi \\times ${2 * r} = ${FD.tn(FD.round(C, 1))}\\) cm.` }; },
    () => { const r = FD.rnd(2, 15), useD = FD.pick([true, false]), A = Math.PI * r * r; return { type: 'num', q: `A circle has a ${useD ? 'diameter' : 'radius'} of \\(${useD ? 2 * r : r}\\) cm. Work out its area, to 1 decimal place.`, a: FD.round(A, 1), tol: 0.05, unit: 'cm²', why: `${useD ? `\\(r = ${2 * r} \\div 2 = ${r}\\). ` : ''}\\(A = \\pi \\times ${r}^2 = ${FD.tn(FD.round(A, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const d = 2 * FD.rnd(2, 12), per = FD.pick([true, false]), v = per ? (Math.PI * d) / 2 + d : (Math.PI * (d / 2) ** 2) / 2; return { type: 'num', q: `A semicircle has a diameter of \\(${d}\\) cm. Work out its ${per ? 'perimeter' : 'area'}, to 1 decimal place.`, a: FD.round(v, 1), tol: 0.05, unit: per ? 'cm' : 'cm²', why: per ? `\\(\\tfrac12 \\times \\pi \\times ${d} + ${d} = ${FD.tn(FD.round(v, 1))}\\) cm (curved edge plus diameter).` : `\\(\\tfrac12 \\times \\pi \\times ${d / 2}^2 = ${FD.tn(FD.round(v, 1))}\\ \\text{cm}^2\\).` }; },
    () => { const r = FD.rnd(2, 12); return { type: 'num', q: `The area of a circle is \\(${r * r}\\pi\\ \\text{cm}^2\\). Work out its radius.`, a: r, unit: 'cm', why: `\\(\\pi r^2 = ${r * r}\\pi\\), so \\(r^2 = ${r * r}\\) and \\(r = ${r}\\) cm.` }; },
    () => { const r = FD.rnd(2, 12), area = FD.pick([true, false]); return { type: 'num', q: `A circle has radius \\(${r}\\) cm. Its ${area ? 'area' : 'circumference'} is \\(k\\pi\\ ${area ? '\\text{cm}^2' : '\\text{cm}'}\\). Find \\(k\\).`, a: area ? r * r : 2 * r, why: area ? `\\(\\pi \\times ${r}^2 = ${r * r}\\pi\\).` : `\\(2 \\times \\pi \\times ${r} = ${2 * r}\\pi\\).` }; },
    () => { const C = FD.rnd(20, 120), d = C / Math.PI; return { type: 'num', q: `The circumference of a circular pond is \\(${C}\\) m. Work out its diameter, to 1 decimal place.`, a: FD.round(d, 1), tol: 0.05, unit: 'm', why: `\\(C = \\pi d\\), so \\(d = ${C} \\div \\pi = ${FD.tn(FD.round(d, 1))}\\) m.` }; },
  ],
});

FD.check({
  section: 'circles',
  items: [
    { type: 'num', q: 'A circle has diameter 10 cm. Find its circumference to 1 d.p.', a: 31.4, tol: 0.05, unit: 'cm', why: '\\(\\pi \\times 10 = 31.41…\\)' },
    { type: 'num', q: 'A circle has radius 3 cm. Find its area to 1 d.p.', a: 28.3, tol: 0.05, unit: 'cm²', why: '\\(\\pi \\times 9 = 28.27…\\)' },
    { type: 'mcq', q: 'The perimeter of a semicircle with diameter \\(d\\) is…', opts: ['\\(\\tfrac12 \\pi d + d\\)', '\\(\\tfrac12 \\pi d\\)', '\\(\\pi d\\)', '\\(\\tfrac12 \\pi r^2\\)'], why: 'Half the circumference plus the straight edge.' },
    { type: 'mcq', q: 'A circle has radius 6 cm. Its area in terms of \\(\\pi\\) is…', opts: ['\\(36\\pi\\ \\text{cm}^2\\)', '\\(12\\pi\\ \\text{cm}^2\\)', '\\(6\\pi\\ \\text{cm}^2\\)', '\\(144\\pi\\ \\text{cm}^2\\)'], why: '\\(\\pi \\times 6^2\\).' },
  ],
});
