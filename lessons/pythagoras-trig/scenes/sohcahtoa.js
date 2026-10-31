// A right-angled triangle that can turn and flip; its sides are labelled hyp, opp and adj relative to the angle θ.
FD.trigTri = (a, o = {}) => {
  const G = FD.G, th = o.th || 35, H = o.hyp || 10, rot = o.rot || 0, flip = o.flip ? -1 : 1, k = o.k || 18;
  const r = (th * Math.PI) / 180, adj = H * Math.cos(r) * k, opp = H * Math.sin(r) * k;
  // local frame: A (angle θ) at the origin, C (right angle) along the x-axis, B above C
  const loc = [[0, 0], [adj, -opp], [adj, 0]], cx = (adj * 2) / 3, cy = -opp / 3;
  const tr = ([x, y]) => { const X = (x - cx) * flip, Y = y - cy, c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180); return [210 + X * c + Y * s, 150 - X * s + Y * c]; };
  const [A, B, C] = loc.map(tr), M = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const out = (P, Q, d = 20) => { const m = G.mid(P, Q), v = [m[0] - M[0], m[1] - M[1]], n = Math.hypot(v[0], v[1]) || 1; return [m[0] + (v[0] / n) * d, m[1] + (v[1] / n) * d]; };
  const L = o.labels || { hyp: 'hyp', opp: 'opp', adj: 'adj' }, hl = o.hl || [];
  let s = G.poly([A, B, C], 'g-fill') + G.right(C, A, B, 11) + G.arc(A, C, B, 30, o.thLabel || 'θ', 'g-arc3', 48);
  s += (hl.includes('hyp') ? G.line(A, B, 'g-hl') : '') + (hl.includes('opp') ? G.line(B, C, 'g-hl2') : '') + (hl.includes('adj') ? G.line(A, C, 'g-hl') : '');
  if (L.hyp) s += G.t(out(A, B), L.hyp, hl.includes('hyp') ? 'l' : 's');
  if (L.opp) s += G.t(out(B, C), L.opp, hl.includes('opp') ? 'l2' : 's');
  if (L.adj) s += G.t(out(A, C), L.adj, hl.includes('adj') ? 'l' : 's');
  a.draw(s);
};
FD.add({
  id: 'sohcahtoa',
  title: 'Finding lengths with SOHCAHTOA',
  tab: 'Trig: lengths',
  icon: 'geometry',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Opposite (opp)', 'The side opposite the angle θ.'],
    ['Adjacent (adj)', 'The side next to θ that is not the hypotenuse.'],
    ['SOHCAHTOA', '\\(\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}}\\), \\(\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}}\\), \\(\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}}\\).'],
  ],
  mount(el) {
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A right-angled triangle with its sides labelled from the angle θ',
      ctrls: `<label class="ctrl">Angle \\(\\theta\\) <input type="range" id="th" min="10" max="80" value="35"><output id="oth">35°</output></label>
        <label class="ctrl">Hypotenuse (cm) <input type="range" id="h" min="4" max="12" step="0.5" value="10"><output id="oh">10</output></label>
        <label class="ctrl">Turn the triangle <input type="range" id="rot" min="0" max="355" step="5" value="0"><output id="orot">0°</output></label>
        <div class="row"><label><input type="checkbox" id="fl"> Flip it over</label></div>`,
    });
    a.tri = (o) => FD.trigTri(a, o);
    a.onSync(() => {
      const th = a.val('th'), h = a.val('h'), rot = a.val('rot'), r = (th * Math.PI) / 180;
      a.out('th', th + '°'); a.out('h', h); a.out('rot', rot + '°');
      const opp = FD.round(h * Math.sin(r), 2), adj = FD.round(h * Math.cos(r), 2);
      a.tri({ th, hyp: h, rot, flip: a.q('#fl').checked, k: Math.min(18, 190 / h), thLabel: th + '°', labels: { hyp: `hyp = ${h}`, opp: `opp = ${FD.num(opp)}`, adj: `adj = ${FD.num(adj)}` }, hl: ['hyp', 'opp'] });
      a.msg(`\\(\\text{opp} = ${h} \\sin ${th}^\\circ = ${FD.tn(opp)}\\), \\(\\text{adj} = ${h} \\cos ${th}^\\circ = ${FD.tn(adj)}\\)`);
    });
    a.tri({});
    return a;
  },
  steps: [
    {
      title: 'Label the sides from the angle',
      text: '<p>Mark the angle \\(\\theta\\) you are using. Then: the <b>hypotenuse</b> is opposite the right angle; the <b>opposite</b> is opposite \\(\\theta\\); the <b>adjacent</b> is next to \\(\\theta\\).</p>',
      async on(a, ctx) { a.off(); for (const h of [['hyp'], ['opp'], ['adj']]) { a.tri({ hl: h }); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Turn it round',
      text: '<p>However the triangle is turned or flipped, the labels follow the <b>angle</b>, not the page.</p>',
      tip: 'The labels change if you use the OTHER acute angle: opp and adj swap.',
      async on(a, ctx) { a.off(); for (let r = 0; r <= 360; r += 6) { a.tri({ rot: r, flip: r > 180, hl: ['opp'] }); if (!(await ctx.sleep(45))) return; } },
    },
    {
      title: 'SOH CAH TOA',
      text: '<p class="mbig">\\(\\sin\\theta = \\frac{O}{H}\\quad \\cos\\theta = \\frac{A}{H}\\quad \\tan\\theta = \\frac{O}{A}\\)</p><p>Pick the ratio that uses the side you know and the side you want.</p>',
      on(a) { a.off(); a.tri({ hl: ['hyp', 'opp', 'adj'] }); },
    },
    {
      title: 'Finding a side on top',
      text: '<p>Hypotenuse \\(12\\) cm, \\(\\theta = 35^\\circ\\). Find the opposite side \\(x\\). We know H and want O: use <b>sin</b>.</p>',
      async on(a, ctx) { a.off(); a.tri({ hyp: 12, k: 19, labels: { hyp: '12 cm', opp: 'x', adj: '' }, thLabel: '35°', hl: ['hyp', 'opp'] }); await a.play(ctx, [['\\sin 35^\\circ = \\frac{x}{12}', 'SOH'], ['x = 12 \\sin 35^\\circ = 6.88\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Finding a side underneath',
      text: '<p>Adjacent \\(8\\) cm, \\(\\theta = 40^\\circ\\). Find the hypotenuse \\(h\\). We know A and want H: use <b>cos</b>. This time \\(h\\) is on the bottom, so we <b>divide</b>.</p>',
      tip: 'Make sure your calculator is in degrees (D on the screen).',
      async on(a, ctx) { a.off(); a.tri({ th: 40, hyp: 10.44, k: 21, labels: { hyp: 'h', opp: '', adj: '8 cm' }, thLabel: '40°', hl: ['hyp', 'adj'] }); await a.play(ctx, [['\\cos 40^\\circ = \\frac{8}{h}', 'CAH'], ['h = \\frac{8}{\\cos 40^\\circ} = 10.4\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Try it: turn and resize',
      text: '<p>Change the angle and the hypotenuse, then turn and flip the triangle. The opposite and adjacent sides are worked out with sin and cos.</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'sohcahtoa',
  gens: [
    () => { const th = FD.rnd(15, 75), h = FD.rnd(4, 20), [f, nm, wh] = FD.pick([['sin', 'opposite', 'O'], ['cos', 'adjacent', 'A']]), v = h * Math[f]((th * Math.PI) / 180); return { type: 'num', q: `In a right-angled triangle the hypotenuse is \\(${h}\\) cm and one angle is \\(${th}^\\circ\\). Work out the side ${nm} to this angle. Give your answer to 3 significant figures.`, a: FD.sigfig(v, 3), tol: FD.sigfig(v, 3) >= 10 ? 0.05 : 0.005, unit: 'cm', why: `${f === 'sin' ? 'SOH' : 'CAH'}: \\(${f}\\ ${th}^\\circ = \\frac{x}{${h}}\\), so \\(x = ${h} ${f}\\ ${th}^\\circ = ${FD.tn(FD.sigfig(v, 3))}\\) cm.` }; },
    () => { const th = FD.rnd(15, 75), ad = FD.rnd(3, 15), v = ad * Math.tan((th * Math.PI) / 180); return { type: 'num', q: `In a right-angled triangle the side adjacent to an angle of \\(${th}^\\circ\\) is \\(${ad}\\) cm. Work out the opposite side, to 3 significant figures.`, a: FD.sigfig(v, 3), tol: FD.sigfig(v, 3) >= 10 ? 0.05 : 0.005, unit: 'cm', why: `TOA: \\(\\tan ${th}^\\circ = \\frac{x}{${ad}}\\), so \\(x = ${ad} \\tan ${th}^\\circ = ${FD.tn(FD.sigfig(v, 3))}\\) cm.` }; },
    () => { const th = FD.rnd(20, 70), op = FD.rnd(3, 15), v = op / Math.sin((th * Math.PI) / 180); return { type: 'num', q: `The side opposite an angle of \\(${th}^\\circ\\) in a right-angled triangle is \\(${op}\\) cm. Work out the hypotenuse, to 3 significant figures.`, a: FD.sigfig(v, 3), tol: FD.sigfig(v, 3) >= 10 ? 0.05 : 0.005, unit: 'cm', why: `SOH: \\(\\sin ${th}^\\circ = \\frac{${op}}{h}\\), so \\(h = \\frac{${op}}{\\sin ${th}^\\circ} = ${FD.tn(FD.sigfig(v, 3))}\\) cm.` }; },
  ],
});

FD.check({
  section: 'sohcahtoa',
  items: [
    { type: 'mcq', q: 'You know the hypotenuse and want the side adjacent to \\(\\theta\\). Which ratio?', opts: ['cos', 'sin', 'tan', 'Pythagoras only'], why: 'CAH: adjacent and hypotenuse.' },
    { type: 'num', q: 'Hypotenuse 15 cm, angle \\(30^\\circ\\). Find the opposite side.', a: 7.5, unit: 'cm', why: '\\(15 \\sin 30^\\circ = 7.5\\).' },
    { type: 'num', q: 'Adjacent 10 cm, angle \\(45^\\circ\\). Find the opposite side.', a: 10, unit: 'cm', why: '\\(10 \\tan 45^\\circ = 10\\).' },
    { type: 'num', q: 'Opposite 6 cm, angle \\(25^\\circ\\). Find the hypotenuse to 3 s.f.', a: 14.2, tol: 0.05, unit: 'cm', why: '\\(6 \\div \\sin 25^\\circ = 14.197…\\)' },
  ],
});
