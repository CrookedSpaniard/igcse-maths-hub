// Bar chart (left) and pie chart (right) of the same data. show: 'bar' | 'pie' | 'both'.
FD.barPie = (host) => {
  host.innerHTML = '<svg viewBox="0 0 600 240" role="img"></svg>';
  const svg = host.querySelector('svg');
  const sector = (cx, cy, r, a0, a1) => { const p = (a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)], [x0, y0] = p(a0), [x1, y1] = p(a1); return a1 - a0 >= 2 * Math.PI - 1e-6 ? `M${cx} ${cy - r}a${r} ${r} 0 1 1 -.01 0Z` : `M${cx} ${cy}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
  return (labels, freqs, show = 'both', upto = labels.length) => {
    const max = Math.max(...freqs, 1), top = Math.ceil(max / 5) * 5 || 5, n = labels.length, bx = show === 'pie' ? 0 : 1, total = freqs.reduce((s, f) => s + f, 0);
    let s = '';
    if (show !== 'pie') {
      const W = show === 'bar' ? 520 : 290, X0 = 46, Y = (v) => 200 - (v / top) * 170, bw = (W / n) * 0.6;
      for (let v = 0; v <= top; v += top / 5) s += `<line class="cg-grid" x1="${X0}" y1="${Y(v)}" x2="${X0 + W}" y2="${Y(v)}"/><text class="cg-t cg-ty" x="${X0 - 6}" y="${Y(v) + 4}">${v}</text>`;
      s += `<line class="cg-ax" x1="${X0}" y1="200" x2="${X0 + W}" y2="200"/><line class="cg-ax" x1="${X0}" y1="20" x2="${X0}" y2="200"/>`;
      labels.forEach((l, i) => { const x = X0 + (W / n) * (i + 0.5); if (i < upto) s += `<rect class="cg-bar" x="${x - bw / 2}" y="${Y(freqs[i])}" width="${bw}" height="${200 - Y(freqs[i])}"/>`; s += `<text class="cg-t" x="${x}" y="218">${l}</text>`; });
    }
    if (show !== 'bar' && total) {
      const cx = show === 'pie' ? 300 : 470, cy = 118, r = 92;
      let a = 0;
      labels.forEach((l, i) => { if (i >= upto || !freqs[i]) return; const da = (freqs[i] / total) * 2 * Math.PI, mid = a + da / 2; s += `<path class="pie-s k${i % 5}" d="${sector(cx, cy, r, a, a + da)}"/>`; if (da > 0.35) s += `<text class="pie-l" x="${(cx + 0.62 * r * Math.sin(mid)).toFixed(1)}" y="${(cy - 0.62 * r * Math.cos(mid) + 5).toFixed(1)}" text-anchor="middle">${l}</text>`; a += da; });
    }
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Chart of ${labels.map((l, i) => `${l}: ${freqs[i]}`).join(', ')}`);
    return bx;
  };
};

FD.add({
  id: 'barpie',
  title: 'Bar charts, pictograms and pie charts',
  tab: 'Bar & pie',
  icon: 'stats',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Bar chart', 'Bars of equal width with gaps; the height shows the frequency. Label both axes.'],
    ['Pictogram', 'Uses a symbol for a number of items. Always give a key, e.g. ● = 4 people.'],
    ['Pie chart', 'A circle split into sectors. The whole circle (360°) is the total frequency.'],
    ['Angle for one item', '\\(360° \\div \\text{total frequency}\\).'],
  ],
  mount(el) {
    const L = ['Bus', 'Car', 'Walk', 'Bike'];
    const a = FD.board(el, 'bp-s', '<div id="bp"></div>', L.map((l, i) => `<label class="ctrl">${l} <input type="range" id="r${i}" min="0" max="20" value="${[9, 6, 12, 3][i]}"><output id="o${i}">${[9, 6, 12, 3][i]}</output></label>`).join(''), () => sync());
    a.bp = FD.barPie(a.$('#bp'));
    a.L = L;
    const sync = () => {
      const f = L.map((_, i) => { const v = +a.$('#r' + i).value; a.$('#o' + i).textContent = v; return v; }), t = f.reduce((s, x) => s + x, 0);
      a.bp(L, f);
      a.big(t ? `\\text{one person} = \\frac{360°}{${t}} = ${FD.round(360 / t, 2)}°` : '\\text{no data}');
      a.msg(t ? L.map((l, i) => `${l} ${FD.round((f[i] / t) * 360, 1)}°`).join(' · ') : 'Move a slider.');
    };
    L.forEach((_, i) => a.$('#r' + i).addEventListener('input', sync));
    a.bp(L, [9, 6, 12, 3], 'bar', 0);
    return a;
  },
  steps: [
    {
      title: 'Bar charts',
      text: '<p>30 students said how they travel to school: bus 9, car 6, walk 12, bike 3.</p><p>Draw one bar per category, all the <b>same width</b> with <b>gaps</b>. The height is the frequency.</p>',
      tip: 'Label both axes and use an even scale on the frequency axis.',
      async on(a, ctx) {
        a.reset();
        for (let k = 0; k <= 4; k++) { a.bp(a.L, [9, 6, 12, 3], 'bar', k); if (!(await ctx.sleep(700))) return; }
      },
    },
    {
      title: 'Pictograms',
      text: '<p>A pictogram uses a symbol for a number of items. With ● = 4 students, 12 is ●●● and 6 is ●◐ (half a symbol is 2).</p>',
      async on(a, ctx) {
        a.reset(); a.bp(a.L, [9, 6, 12, 3], 'bar');
        a.$('#bp').insertAdjacentHTML('beforeend', '<table class="dt"><tr><th>Bus</th><td>●●◔</td></tr><tr><th>Car</th><td>●◐</td></tr><tr><th>Walk</th><td>●●●</td></tr><tr><th>Bike</th><td>◕</td></tr></table><p class="sl-key">Key: ● = 4 students</p>');
      },
    },
    {
      title: 'Pie chart angles',
      text: '<p>The whole circle, 360°, stands for all 30 students. So each student gets \\(360 \\div 30 = 12°\\).</p>',
      async on(a, ctx) {
        a.reset(); a.bp(a.L, [9, 6, 12, 3], 'pie', 0);
        if (!(await a.lines([['360 \\div 30 = 12°', 'one student'], ['\\text{Bus } 9 \\times 12 = 108°', ''], ['\\text{Car } 72°, \\; \\text{Walk } 144°, \\; \\text{Bike } 36°', 'total 360°']], ctx, 1200))) return;
        for (let k = 1; k <= 4; k++) { a.bp(a.L, [9, 6, 12, 3], 'pie', k); if (!(await ctx.sleep(500))) return; }
      },
    },
    {
      title: 'Reading a pie chart',
      text: '<p>A pie chart shows 240 people. The sector for “walk” has an angle of 54°. How many people walk?</p><p>Find what <b>fraction</b> of 360° the angle is.</p>',
      async on(a, ctx) {
        a.reset(); a.bp(a.L, [9, 6, 12, 3], 'both');
        await a.lines([['\\frac{54}{360} \\times 240', ''], ['= 36 \\text{ people}', '']], ctx, 1300);
      },
    },
    {
      title: 'Try it: build the charts',
      text: '<p>Change the frequencies. The bar chart and the pie chart update, and the angles are worked out.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'barpie',
  gens: [
    () => { const t = FD.pick([20, 24, 30, 36, 40, 45, 60, 72, 90, 120]), f = FD.rnd(1, t / 3); return { type: 'num', q: `A pie chart shows ${t} people. ${f} of them chose tea. What is the angle of the tea sector?`, a: FD.round((f / t) * 360, 2), unit: '°', why: `Each person is \\(360 \\div ${t} = ${360 / t}°\\). \\(${f} \\times ${360 / t} = ${FD.round((f / t) * 360, 2)}°\\).` }; },
    () => { const t = FD.pick([36, 60, 72, 90, 120, 180, 240, 360]), ang = FD.pick([30, 36, 45, 60, 72, 90, 120, 150]); if (!Number.isInteger((ang / 360) * t)) return { type: 'num', q: 'A pie chart shows 60 people. A sector has an angle of 72°. How many people does it show?', a: 12, why: '\\(\\tfrac{72}{360} \\times 60 = 12\\).' }; return { type: 'num', q: `A pie chart shows ${t} people. A sector has an angle of ${ang}°. How many people does it show?`, a: (ang / 360) * t, why: `\\(\\dfrac{${ang}}{360} \\times ${t} = ${(ang / 360) * t}\\).` }; },
    () => { const k = FD.pick([2, 4, 6, 8, 10]), n = FD.rnd(2, 5), half = FD.rnd(0, 1); return { type: 'num', q: `In a pictogram, one symbol stands for ${k} cars. A row shows ${n}${half ? ' and a half' : ''} symbols. How many cars is that?`, a: n * k + (half ? k / 2 : 0), why: `\\(${n} \\times ${k}${half ? ` + ${k / 2}` : ''} = ${n * k + (half ? k / 2 : 0)}\\).` }; },
  ],
});

FD.check({
  section: 'barpie',
  items: [
    { type: 'num', q: 'A pie chart represents 45 students. What angle stands for one student?', a: 8, unit: '°', why: '\\(360 \\div 45 = 8\\).' },
    { type: 'num', q: 'In a pie chart of 180 votes, a sector has an angle of 100°. How many votes is that?', a: 50, why: '\\(\\tfrac{100}{360} \\times 180 = 50\\).' },
    { type: 'tf', q: 'The bars of a bar chart for categories should have gaps between them.', a: true, why: 'Gaps show that the categories are separate.' },
    { type: 'mcq', q: 'What must every pictogram have?', opts: ['A key', 'A pie chart', 'Equal symbols on every row', 'Gaps'], why: 'The key says how many items one symbol stands for.' },
  ],
});
