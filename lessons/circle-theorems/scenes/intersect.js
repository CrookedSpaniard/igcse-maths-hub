// Intersecting chords: AX × XB = CX × XD inside the circle; PA × PB = PC × PD (and PT²) outside.
FD.add({
  id: 'intersect',
  title: 'Intersecting chords',
  tab: 'Intersecting chords',
  icon: 'geometry',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Intersecting chords (inside)', 'If chords \\(AB\\) and \\(CD\\) cross at \\(X\\), then \\(AX \\times XB = CX \\times XD\\).'],
    ['Intersecting chords (outside)', 'If lines from \\(P\\) cut the circle at \\(A, B\\) and at \\(C, D\\), then \\(PA \\times PB = PC \\times PD\\). For a tangent \\(PT\\): \\(PT^2 = PA \\times PB\\).'],
  ],
  mount(el) {
    const G = FD.G, { C, R, P } = FD.CT, U = 30;
    const a = FD.stage(el, {
      vb: '0 0 420 300', drag: true, label: 'Two chords crossing inside or outside a circle',
      ctrls: `<div class="row"><label>Where they cross <select id="md"><option value="in">Inside the circle</option><option value="out">Outside the circle</option></select></label></div><p class="small">Drag the blue points. Lengths are in cm (1 cm = 30 units).</p>`,
    });
    let q = [150, 330, 220, 30], E = [395, 150], spread = 22, live = false;
    const cross = (A, B, Cc, D) => { const d = (B[0] - A[0]) * (D[1] - Cc[1]) - (B[1] - A[1]) * (D[0] - Cc[0]); if (Math.abs(d) < 1e-6) return null; const t = ((Cc[0] - A[0]) * (D[1] - Cc[1]) - (Cc[1] - A[1]) * (D[0] - Cc[0])) / d, u = ((Cc[0] - A[0]) * (B[1] - A[1]) - (Cc[1] - A[1]) * (B[0] - A[0])) / d; return t > 0 && t < 1 && u > 0 && u < 1 ? [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])] : null; };
    const L = (p, q2) => FD.round(G.dist(p, q2) / U, 2);
    a.inside = (qq = q) => {
      q = qq.slice(); const [A, B, Cc, D] = q.map((t) => P(t)), X = cross(A, B, Cc, D);
      let s = G.circ(C, R) + G.line(A, B, 'g-hl') + G.line(Cc, D, 'g-hl2');
      s += ['A', 'B', 'C', 'D'].map((n, i) => G.t(G.polar(C, R + 16, q[i]), n) + (live ? G.handle(P(q[i]), i) : G.dot(P(q[i]), 'g-dot k', 4))).join('');
      if (X) s += G.dot(X, 'g-dot k', 5) + G.t([X[0] + 14, X[1] - 12], 'X');
      a.draw(s);
      return X ? [L(A, X), L(X, B), L(Cc, X), L(X, D)] : null;
    };
    // A line from E at angle (towards the centre ± spread) meets the circle at two points (near, far).
    const hits = (dir) => { const d = [Math.cos(dir), -Math.sin(dir)], f = [E[0] - C[0], E[1] - C[1]], b = f[0] * d[0] + f[1] * d[1], c = f[0] ** 2 + f[1] ** 2 - R * R, disc = b * b - c; if (disc <= 0) return null; const t1 = -b - Math.sqrt(disc), t2 = -b + Math.sqrt(disc); return [[E[0] + t1 * d[0], E[1] + t1 * d[1]], [E[0] + t2 * d[0], E[1] + t2 * d[1]]]; };
    a.outside = (e = E, sp = spread, tangent = false) => {
      E = e; spread = sp; const base = Math.atan2(E[1] - C[1], C[0] - E[0]), h1 = hits(base - (sp * Math.PI) / 180), h2 = hits(base + (sp * 0.45 * Math.PI) / 180);
      let s = G.circ(C, R);
      if (h1) s += G.line(E, h1[1], 'g-hl') + G.dot(h1[0], 'g-dot k', 4) + G.dot(h1[1], 'g-dot k', 4) + G.t([h1[0][0] + 4, h1[0][1] - 14], 'A') + G.t([h1[1][0] - 12, h1[1][1] - 12], 'B');
      if (h2) s += G.line(E, h2[1], 'g-hl2') + G.dot(h2[0], 'g-dot k', 4) + G.dot(h2[1], 'g-dot k', 4) + G.t([h2[0][0] + 4, h2[0][1] + 16], 'C') + G.t([h2[1][0] - 12, h2[1][1] + 14], 'D');
      let T = null;
      if (tangent) { const d = G.dist(C, E), al = Math.acos(R / d) * 180 / Math.PI, b = Math.atan2(C[1] - E[1], E[0] - C[0]) * 180 / Math.PI; T = P(b - al); s += G.line(E, T, 'g-ln') + G.dot(T, 'g-dot k', 4) + G.t([T[0] + 6, T[1] + 16], 'T'); }
      s += (live ? G.handle(E, 'E') : G.dot(E, 'g-dot k', 5)) + G.t([E[0], E[1] - 18], 'P');
      a.draw(s);
      return h1 && h2 ? { pa: L(E, h1[0]), pb: L(E, h1[1]), pc: L(E, h2[0]), pd: L(E, h2[1]), pt: T ? L(E, T) : 0 } : null;
    };
    FD.dragIn(a.svg, (n, px, py) => {
      if (n === 'E') { const p = [FD.clamp(px, 20, 405), FD.clamp(py, 30, 280)]; if (G.dist(p, C) > R + 30) E = p; }
      else { let t = Math.atan2(C[1] - py, px - C[0]) * 180 / Math.PI; if (t < 0) t += 360; q[+n] = t; }
      a.sync();
    });
    a.onSync(() => {
      if (a.q('#md').value === 'in') {
        const r = a.inside();
        if (!r) { a.msg('Move the points so that the chords cross inside the circle.', 'bad'); return; }
        a.msg(`\\(AX \\times XB = ${FD.tn(r[0])} \\times ${FD.tn(r[1])} = ${FD.tn(FD.round(r[0] * r[1], 1))}\\), \\(CX \\times XD = ${FD.tn(r[2])} \\times ${FD.tn(r[3])} = ${FD.tn(FD.round(r[2] * r[3], 1))}\\)`);
      } else {
        const r = a.outside(E, spread, true);
        if (!r) { a.msg('Move P so that both lines cut the circle.', 'bad'); return; }
        a.msg(`\\(PA \\times PB = ${FD.tn(FD.round(r.pa * r.pb, 1))}\\), \\(PC \\times PD = ${FD.tn(FD.round(r.pc * r.pd, 1))}\\), \\(PT^2 = ${FD.tn(FD.round(r.pt * r.pt, 1))}\\)`);
      }
    });
    a.live = (on) => { live = on; };
    a.inside();
    return a;
  },
  steps: [
    {
      title: 'Chords crossing inside',
      text: '<p>Two chords \\(AB\\) and \\(CD\\) cross at \\(X\\). Multiply the two parts of each chord:</p><p class="mbig">\\(AX \\times XB = CX \\times XD\\)</p>',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 40; t += 2) { const r = a.inside([150 + t, 330 - t / 2, 220, 30 + t / 2]); if (r) a.msg(`\\(${FD.tn(FD.round(r[0] * r[1], 1))} = ${FD.tn(FD.round(r[2] * r[3], 1))}\\)`); if (!(await ctx.sleep(80))) return; } },
    },
    {
      title: 'Worked example: inside',
      text: '<p>\\(AX = 4\\) cm, \\(XB = 6\\) cm and \\(CX = 3\\) cm. Find \\(XD\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); a.inside([150, 330, 220, 30]); await a.play(ctx, [['4 \\times 6 = 3 \\times XD', 'intersecting chords'], ['XD = 24 \\div 3 = 8\\ \\text{cm}', '']]); },
    },
    {
      title: 'Crossing outside the circle',
      text: '<p>If the lines meet at \\(P\\) <b>outside</b> the circle, use the distances <b>from \\(P\\)</b>:</p><p class="mbig">\\(PA \\times PB = PC \\times PD\\)</p><p>For a tangent \\(PT\\), the two points are the same: \\(PT^2 = PA \\times PB\\).</p>',
      tip: 'Outside: PB is the WHOLE length from P to the far point, not just the part inside the circle.',
      async on(a, ctx) { a.off(); a.live(false); for (let t = 0; t <= 20; t += 1) { const r = a.outside([395 - t, 150 + t], 22, true); if (r) a.msg(`\\(PA \\times PB = ${FD.tn(FD.round(r.pa * r.pb, 1))} = PC \\times PD = PT^2\\)`); if (!(await ctx.sleep(80))) return; } },
    },
    {
      title: 'Worked example: outside',
      text: '<p>\\(PA = 5\\) cm and \\(AB = 7\\) cm (so \\(PB = 12\\) cm). \\(PT\\) is a tangent. Find \\(PT\\).</p>',
      async on(a, ctx) { a.off(); a.live(false); a.outside([395, 150], 22, true); await a.play(ctx, [['PT^2 = PA \\times PB = 5 \\times 12 = 60', ''], ['PT = \\sqrt{60} = 7.75\\ \\text{cm}', '3 s.f.']]); },
    },
    {
      title: 'Try it: move the chords',
      text: '<p>Choose inside or outside, and drag the blue points. The two products always match (up to rounding).</p>',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'intersect',
  gens: [
    () => { let ax, xb, cx, xd; do { ax = FD.rnd(2, 12); xb = FD.rnd(2, 12); cx = FD.rnd(2, 12); xd = (ax * xb) / cx; } while (xd % 1 || cx === ax || cx === xb); return { type: 'num', q: `Chords \\(AB\\) and \\(CD\\) cross at \\(X\\) inside a circle. \\(AX = ${ax}\\) cm, \\(XB = ${xb}\\) cm and \\(CX = ${cx}\\) cm. Find \\(XD\\).`, a: xd, unit: 'cm', why: `\\(AX \\times XB = CX \\times XD\\): \\(${ax} \\times ${xb} = ${cx} \\times XD\\), so \\(XD = ${ax * xb} \\div ${cx} = ${xd}\\) cm.` }; },
    () => { let pa, ab, pc, pd; do { pa = FD.rnd(2, 9); ab = FD.rnd(2, 12); pc = FD.rnd(2, 10); pd = (pa * (pa + ab)) / pc; } while (pd % 1 || pd <= pc || pc === pa); return { type: 'num', q: `From a point \\(P\\) outside a circle, one line cuts the circle at \\(A\\) and \\(B\\) with \\(PA = ${pa}\\) cm and \\(AB = ${ab}\\) cm. Another line cuts it at \\(C\\) and \\(D\\) with \\(PC = ${pc}\\) cm. Find \\(PD\\).`, a: pd, unit: 'cm', why: `\\(PB = ${pa} + ${ab} = ${pa + ab}\\). \\(PA \\times PB = PC \\times PD\\): \\(${pa} \\times ${pa + ab} = ${pc} \\times PD\\), \\(PD = ${pa * (pa + ab)} \\div ${pc} = ${pd}\\) cm.` }; },
    () => { let pa, pb, pt; do { pa = FD.rnd(1, 10); pb = pa + FD.rnd(2, 20); pt = Math.sqrt(pa * pb); } while (pt % 1); return { type: 'num', q: `\\(PT\\) is a tangent from \\(P\\). A line from \\(P\\) cuts the circle at \\(A\\) and \\(B\\) with \\(PA = ${pa}\\) cm and \\(PB = ${pb}\\) cm. Find \\(PT\\).`, a: pt, unit: 'cm', why: `\\(PT^2 = PA \\times PB = ${pa} \\times ${pb} = ${pa * pb}\\), so \\(PT = \\sqrt{${pa * pb}} = ${pt}\\) cm.` }; },
  ],
});

FD.check({
  section: 'intersect',
  items: [
    { type: 'num', q: 'Chords cross inside a circle: \\(AX = 6\\), \\(XB = 4\\), \\(CX = 8\\). Find \\(XD\\).', a: 3, unit: 'cm', why: '\\(24 \\div 8 = 3\\).' },
    { type: 'num', q: 'From \\(P\\) outside: \\(PA = 3\\), \\(PB = 12\\), \\(PC = 4\\). Find \\(PD\\).', a: 9, unit: 'cm', why: '\\(3 \\times 12 = 4 \\times PD\\), \\(PD = 9\\).' },
    { type: 'num', q: '\\(PT\\) is a tangent; \\(PA = 4\\), \\(PB = 9\\). Find \\(PT\\).', a: 6, unit: 'cm', why: '\\(PT^2 = 36\\).' },
    { type: 'mcq', q: 'For two chords crossing at \\(X\\) inside a circle, which is true?', opts: ['\\(AX \\times XB = CX \\times XD\\)', '\\(AX + XB = CX + XD\\)', '\\(AX \\times CX = XB \\times XD\\) always', '\\(AB = CD\\)'], why: 'Products of the two parts of each chord are equal.' },
  ],
});
