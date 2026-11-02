// Similar triangles: a small triangle inside a big one (DE parallel to BC). Match the sides, find k, then use it.
FD.add({
  id: 'simtri',
  title: 'Missing lengths in similar triangles',
  tab: 'Similar triangles',
  icon: 'geometry',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Similar triangles', 'Triangles with the same three angles. Their corresponding sides are in the same ratio.'],
    ['Corresponding sides', 'Sides opposite equal angles.'],
  ],
  mount(el) {
    const G = FD.G, u = 20, o = [60, 250], T = [[0, 0], [14, 0], [5.4286, 8.398]];
    const P = ([x, y]) => [o[0] + x * u, o[1] - y * u];
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'Triangle ABC with a line DE parallel to BC',
      ctrls: `<label class="ctrl">Position of DE (\\(AD \\div AB\\)) <input type="range" id="t" min="0.2" max="0.8" step="0.05" value="0.4"><output id="ot">0.4</output></label>`,
    });
    // L: labels ad, db, ae, ec, de, bc; angles: mark the equal angles
    a.nest = (t, L = {}, angles = false) => {
      const A = P(T[2]), B = P(T[0]), C = P(T[1]), D = G.lerp(A, B, t), E = G.lerp(A, C, t);
      let s = G.poly([A, B, C], 'g-fill') + G.poly([A, D, E], 'g-fill2') + G.arrows(D, E) + G.arrows(B, C);
      if (angles) s += G.arc(A, B, C, 18, '', 'g-arc') + G.arc(D, E, A, 16, '', 'g-arc2') + G.arc(B, C, A, 16, '', 'g-arc2') + G.arc(E, A, D, 16, '', 'g-arc3') + G.arc(C, A, B, 16, '', 'g-arc3');
      s += G.t([A[0], A[1] - 12], 'A', '') + G.t([B[0] - 12, B[1] + 4], 'B', '') + G.t([C[0] + 12, C[1] + 4], 'C', '') + G.t([D[0] - 14, D[1]], 'D', '') + G.t([E[0] + 14, E[1]], 'E', '');
      const at = (p, q, dx, dy, txt, c) => (txt ? G.t([G.mid(p, q)[0] + dx, G.mid(p, q)[1] + dy], txt, c) : '');
      s += at(A, D, -16, 0, L.ad, 's en') + at(D, B, -16, 0, L.db, 's en') + at(A, E, 16, 0, L.ae, 's st') + at(E, C, 16, 0, L.ec, 's st') + at(D, E, 0, -10, L.de, 'l') + at(B, C, 0, 18, L.bc, 'l');
      a.draw(s);
    };
    // The two triangles pulled apart: big ABC on the left, small ADE on the right.
    a.split = (t, big, small) => {
      const lab = (pts, o2, k, names) => pts.map(([x, y], i) => G.t([o2[0] + x * 15 * k + [-10, 10, 0][i], o2[1] - y * 15 * k + [12, 12, -12][i]], names[i], '')).join('');
      a.draw(FD.simTri(T, [20, 250], 15, 1, big, [], 'g-fill') + lab(T, [20, 250], 1, ['B', 'C', 'A'])
        + FD.simTri(T, [290, 250], 15, t, small, [], 'g-fill2') + lab(T, [290, 250], t, ['D', 'E', 'A']));
    };
    a.onSync(() => {
      const t = a.val('t'), f = (v) => FD.num(FD.round(v, 2));
      a.out('t', FD.num(t));
      a.nest(t, { ad: f(10 * t), db: f(10 - 10 * t), ae: f(12 * t), ec: f(12 - 12 * t), de: f(14 * t), bc: '14' });
      a.big(`k = \\frac{AB}{AD} = \\frac{10}{${f(10 * t)}} = ${f(1 / t)}`);
      a.msg(`\\(\\frac{AC}{AE} = \\frac{12}{${FD.tn(FD.round(12 * t, 2))}}\\) and \\(\\frac{BC}{DE} = \\frac{14}{${FD.tn(FD.round(14 * t, 2))}}\\) give the same \\(k\\).`);
    });
    a.nest(0.4, {}, true);
    return a;
  },
  steps: [
    {
      title: 'Why are they similar?',
      text: '<p>\\(DE\\) is parallel to \\(BC\\). Triangles \\(ADE\\) and \\(ABC\\) have the <b>same three angles</b>:</p><ul><li>angle \\(A\\) is shared;</li><li>\\(\\angle ADE = \\angle ABC\\) and \\(\\angle AED = \\angle ACB\\) (corresponding angles).</li></ul><p>So they are similar.</p>',
      on(a) { a.off(); a.nest(0.4, {}, true); },
    },
    {
      title: 'Pull them apart',
      text: '<p>Draw the two triangles separately, the same way round. Now it is easy to see which sides <b>correspond</b>: \\(AD\\) with \\(AB\\), \\(DE\\) with \\(BC\\), \\(AE\\) with \\(AC\\).</p>',
      tip: 'AB is the whole side, AD + DB. A common mistake is to use DB.',
      on(a) { a.off(); a.split(0.4, ['BC', 'CA', 'AB'], ['DE', 'EA', 'AD']); },
    },
    {
      title: 'Finding a side of the big triangle',
      text: '<p>\\(AD = 4\\) cm, \\(DB = 6\\) cm and \\(DE = 5.6\\) cm. Find \\(BC\\).</p>',
      async on(a, ctx) { a.off(); a.nest(0.4, { ad: '4', db: '6', de: '5.6', bc: '?' }); await a.play(ctx, [['AB = 4 + 6 = 10', 'the whole side'], ['k = \\frac{10}{4} = 2.5', ''], ['BC = 5.6 \\times 2.5 = 14\\ \\text{cm}', '']]); },
    },
    {
      title: 'Finding part of a side',
      text: '<p>Same triangles: \\(AE = 4.8\\) cm. Find \\(EC\\).</p>',
      tip: 'Find the whole side AC first, then subtract.',
      async on(a, ctx) { a.off(); a.nest(0.4, { ad: '4', db: '6', ae: '4.8', ec: '?' }); await a.play(ctx, [['AC = 4.8 \\times 2.5 = 12', 'the whole side'], ['EC = 12 - 4.8 = 7.2\\ \\text{cm}', '']]); },
    },
    {
      title: 'Try it: move DE',
      text: '<p>Move the line \\(DE\\). It stays parallel to \\(BC\\), so the triangles stay similar. \\(AB = 10\\), \\(AC = 12\\), \\(BC = 14\\).</p>',
      on(a) { a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'simtri',
  gens: [
    () => { const ad = FD.rnd(2, 8), m = FD.pick([0.5, 1, 1.5, 2, 3]), db = ad * m, de = FD.rnd(2, 10), k = 1 + m; return { type: 'num', q: `In triangle \\(ABC\\), \\(D\\) is on \\(AB\\) and \\(E\\) is on \\(AC\\), with \\(DE\\) parallel to \\(BC\\). \\(AD = ${ad}\\) cm, \\(DB = ${FD.tn(db)}\\) cm and \\(DE = ${de}\\) cm. Work out \\(BC\\).`, a: FD.round(de * k, 4), unit: 'cm', why: `\\(AB = ${ad} + ${FD.tn(db)} = ${FD.tn(ad + db)}\\), so \\(k = \\frac{${FD.tn(ad + db)}}{${ad}} = ${FD.tn(k)}\\). \\(BC = ${de} \\times ${FD.tn(k)} = ${FD.tn(FD.round(de * k, 4))}\\) cm.` }; },
    () => { const ad = FD.rnd(2, 8), k = FD.pick([2, 2.5, 3, 4]), bc = FD.rnd(3, 12) * k; return { type: 'num', q: `In triangle \\(ABC\\), \\(DE\\) is parallel to \\(BC\\), with \\(D\\) on \\(AB\\) and \\(E\\) on \\(AC\\). \\(AD = ${ad}\\) cm, \\(AB = ${FD.tn(ad * k)}\\) cm and \\(BC = ${FD.tn(bc)}\\) cm. Work out \\(DE\\).`, a: FD.round(bc / k, 4), unit: 'cm', why: `\\(k = \\frac{${FD.tn(ad * k)}}{${ad}} = ${FD.tn(k)}\\). Going to the small triangle, divide: \\(DE = ${FD.tn(bc)} \\div ${FD.tn(k)} = ${FD.tn(FD.round(bc / k, 4))}\\) cm.` }; },
    () => { const ad = FD.rnd(2, 8), m = FD.pick([0.5, 1, 1.5, 2]), ae = FD.rnd(2, 9); return { type: 'num', q: `In triangle \\(ABC\\), \\(DE\\) is parallel to \\(BC\\), with \\(D\\) on \\(AB\\) and \\(E\\) on \\(AC\\). \\(AD = ${ad}\\) cm, \\(DB = ${FD.tn(ad * m)}\\) cm and \\(AE = ${ae}\\) cm. Work out \\(EC\\).`, a: FD.round(ae * m, 4), unit: 'cm', why: `\\(k = \\frac{${FD.tn(ad + ad * m)}}{${ad}} = ${FD.tn(1 + m)}\\), so \\(AC = ${ae} \\times ${FD.tn(1 + m)} = ${FD.tn(ae * (1 + m))}\\) and \\(EC = ${FD.tn(ae * (1 + m))} - ${ae} = ${FD.tn(FD.round(ae * m, 4))}\\) cm.` }; },
    () => { const pq = FD.rnd(3, 10), k = FD.pick([1.5, 2, 2.5, 3]), qr = FD.rnd(3, 12); return { type: 'num', q: `Triangles \\(PQR\\) and \\(XYZ\\) are similar, with \\(P\\) matching \\(X\\), \\(Q\\) matching \\(Y\\) and \\(R\\) matching \\(Z\\). \\(PQ = ${pq}\\) cm, \\(XY = ${FD.tn(pq * k)}\\) cm and \\(QR = ${qr}\\) cm. Work out \\(YZ\\).`, a: qr * k, unit: 'cm', why: `\\(k = ${FD.tn(pq * k)} \\div ${pq} = ${FD.tn(k)}\\). \\(YZ = ${qr} \\times ${FD.tn(k)} = ${FD.tn(qr * k)}\\) cm.` }; },
  ],
});

FD.check({
  section: 'simtri',
  items: [
    { type: 'num', q: '\\(DE \\parallel BC\\). \\(AD = 3\\), \\(AB = 9\\), \\(DE = 4\\). Find \\(BC\\).', a: 12, unit: 'cm', why: '\\(k = 3\\); \\(4 \\times 3\\).' },
    { type: 'num', q: '\\(DE \\parallel BC\\). \\(AD = 5\\), \\(DB = 5\\), \\(BC = 16\\). Find \\(DE\\).', a: 8, unit: 'cm', why: '\\(k = 10 \\div 5 = 2\\); \\(16 \\div 2\\).' },
    { type: 'mcq', q: 'Why is triangle \\(ADE\\) similar to triangle \\(ABC\\) when \\(DE \\parallel BC\\)?', opts: ['They have the same three angles', 'They have the same area', 'They share side \\(AD\\)', 'They are both isosceles'], why: 'Shared angle and corresponding angles.' },
    { type: 'tf', q: 'If \\(AD = 4\\) and \\(DB = 6\\), the scale factor from \\(ADE\\) to \\(ABC\\) is \\(1.5\\).', a: false, why: 'Use \\(AB = 10\\): \\(k = 2.5\\).' },
  ],
});
