// Vector geometry: paths round a triangle, midpoints, proving lines parallel and points collinear.
// The diagram is in pixels, so FD.vArrow gets a "graph" whose X and Y leave the numbers unchanged.
const VP = { ax: { X: (x) => x, Y: (y) => y } };
const VPT = { O: [40, 280], A: [120, 60], B: [260, 150], M: [190, 105], P: [80, 170], Q: [150, 215], C: [400, 240] };
const VOFF = { O: [-14, 18], A: [-14, -10], B: [12, -8], M: [8, -12], P: [-22, 4], Q: [4, 24], C: [12, 20] };
const vArr = (p, q, cls, label) => FD.vArrow(VP, ...VPT[p], ...VPT[q], cls, label);

FD.add({
  id: 'proof',
  title: 'Vector geometry and proof',
  tab: 'Proof',
  icon: 'target',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['Path', 'A route along known vectors: \\(\\overrightarrow{AB} = \\overrightarrow{AO} + \\overrightarrow{OB}\\).'],
    ['Parallel', 'If \\(\\overrightarrow{PQ} = k\\,\\overrightarrow{AB}\\), then \\(PQ\\) is parallel to \\(AB\\) and \\(k\\) times as long.'],
    ['Collinear', 'Points on one straight line. If \\(\\overrightarrow{AC} = k\\,\\overrightarrow{AB}\\) (with \\(A\\) in both), then \\(A\\), \\(B\\) and \\(C\\) are collinear.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 've-p', side: true,
      vis: '<svg class="ve-fig" viewBox="0 0 440 310" role="img" aria-label="Triangle OAB with vectors a and b"><g data-k="fig"></g></svg>',
      tryHtml: '<label class="ctrl">\\(t\\) <input type="range" data-k="t" min="0" max="2" step="0.25" value="0.5"><output data-k="ot">0.5</output></label>',
    });
    // draw the triangle, extra arrows (SVG) and extra named points
    a.fig = (extra = '', pts = [], free = []) => {
      const dot = ([x, y], n, off) => `<circle class="pt" cx="${x}" cy="${y}" r="5"/><text class="g-lbl" x="${x + off[0]}" y="${y + off[1]}">${n}</text>`;
      a.$('[data-k="fig"]').innerHTML = `<polygon class="ve-tri" points="${[VPT.O, VPT.A, VPT.B].map((p) => p.join(',')).join(' ')}"/>` +
        vArr('O', 'A', 'v1', 'a') + vArr('O', 'B', 'v2', 'b') + extra +
        ['O', 'A', 'B', ...pts].map((n) => dot(VPT[n], n, VOFF[n])).join('') + free.join('');
    };
    const sync = () => {
      const t = +a.$('[data-k="t"]').value, [ax, ay] = VPT.A, [bx, by] = VPT.B, X = [ax + t * (bx - ax), ay + t * (by - ay)];
      a.$('[data-k="ot"]').textContent = t;
      a.fig(`<line class="g-line" x1="${ax}" y1="${ay}" x2="${VPT.C[0]}" y2="${VPT.C[1]}"/>` + FD.vArrow(VP, ...VPT.O, ...X, 'vr'), [], [`<circle class="pt hot" cx="${X[0]}" cy="${X[1]}" r="6"/><text class="g-lbl" x="${X[0] + 10}" y="${X[1] - 10}">X</text>`]);
      const u = FD.num(FD.round(1 - t, 2)), v = FD.num(t);
      a.big(`\\overrightarrow{OX} = ${u}\\mathbf{a} + ${v}\\mathbf{b}`);
      a.msg(`\\(\\mathbf{a} + ${t}(\\mathbf{b} - \\mathbf{a})\\). ` + (t === 0 ? 'X is at A.' : t === 0.5 ? 'X is the midpoint of AB.' : t === 1 ? 'X is at B.' : t > 1 ? 'X is on AB extended beyond B: still on the same straight line.' : `X is ${t < 0.5 ? 'nearer A' : 'nearer B'} on AB.`));
    };
    a.$('[data-k="t"]').addEventListener('input', sync);
    a.onTry = sync;
    a.fig();
    return a;
  },
  steps: [
    {
      title: 'Paths round a triangle',
      text: '<p>\\(\\overrightarrow{OA} = \\mathbf{a}\\) and \\(\\overrightarrow{OB} = \\mathbf{b}\\). To find \\(\\overrightarrow{AB}\\), go round a path you know: from \\(A\\) back to \\(O\\), then out to \\(B\\).</p>',
      on: FD.walk([
        ['\\overrightarrow{AB} = \\overrightarrow{AO} + \\overrightarrow{OB}', 'A path from A to B.'],
        ['= -\\mathbf{a} + \\mathbf{b}', 'AO goes backwards along a.'],
        ['= \\mathbf{b} - \\mathbf{a}', ''],
      ], (a) => { a.fig(vArr('A', 'B', 'vr', 'b − a')); a.big(''); }),
    },
    {
      title: 'The midpoint',
      text: '<p>\\(M\\) is the midpoint of \\(AB\\). Go to \\(A\\), then halfway along \\(\\overrightarrow{AB}\\).</p>',
      on: FD.walk([
        ['\\overrightarrow{OM} = \\overrightarrow{OA} + \\tfrac12\\overrightarrow{AB}', ''],
        ['= \\mathbf{a} + \\tfrac12(\\mathbf{b} - \\mathbf{a})', ''],
        ['= \\tfrac12\\mathbf{a} + \\tfrac12\\mathbf{b} = \\tfrac12(\\mathbf{a} + \\mathbf{b})', 'Expand and collect.'],
      ], (a) => { a.fig(vArr('O', 'M', 'vr'), ['M']); a.big(''); }),
    },
    {
      title: 'Proving lines are parallel',
      text: '<p>\\(P\\) and \\(Q\\) are the midpoints of \\(OA\\) and \\(OB\\). Show that \\(PQ\\) is parallel to \\(AB\\).</p>',
      tip: 'Finish with a sentence: “… is a multiple of …, so the lines are parallel.”',
      on: FD.walk([
        ['\\overrightarrow{PQ} = \\overrightarrow{PO} + \\overrightarrow{OQ} = -\\tfrac12\\mathbf{a} + \\tfrac12\\mathbf{b}', ''],
        ['= \\tfrac12(\\mathbf{b} - \\mathbf{a}) = \\tfrac12\\overrightarrow{AB}', 'A multiple of AB.'],
        ['\\text{So } PQ \\parallel AB, \\text{ half as long.}', ''],
      ], (a) => { a.fig(vArr('P', 'Q', 'vr') + `<line class="g-line" x1="${VPT.A[0]}" y1="${VPT.A[1]}" x2="${VPT.B[0]}" y2="${VPT.B[1]}"/>`, ['P', 'Q']); a.big(''); }),
    },
    {
      title: 'Proving points are collinear',
      text: '<p>\\(\\overrightarrow{OC} = 2\\mathbf{b} - \\mathbf{a}\\). Show that \\(A\\), \\(B\\) and \\(C\\) lie on a straight line.</p>',
      tip: 'Parallel vectors that share a point lie on the same line.',
      on: FD.walk([
        ['\\overrightarrow{AC} = \\overrightarrow{AO} + \\overrightarrow{OC} = -\\mathbf{a} + 2\\mathbf{b} - \\mathbf{a}', ''],
        ['= 2\\mathbf{b} - 2\\mathbf{a} = 2(\\mathbf{b} - \\mathbf{a}) = 2\\overrightarrow{AB}', ''],
        ['\\text{Parallel, and both pass through } A.', 'So A, B and C are collinear.'],
      ], (a) => { a.fig(vArr('A', 'C', 'vr') + vArr('A', 'B', 'v3'), ['C']); a.big(''); }),
    },
    {
      title: 'Try it: a point on the line AB',
      text: '<p>\\(X\\) is on the line through \\(A\\) and \\(B\\) with \\(\\overrightarrow{AX} = t\\,\\overrightarrow{AB}\\). Move \\(t\\) and watch \\(\\overrightarrow{OX}\\).</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

// p a + q b in TeX, without writing 1a or -1a
const VLIN = (p, q) => `${p === 1 ? '' : p === -1 ? '-' : p}\\mathbf{a} ${q < 0 ? '-' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}\\mathbf{b}`;
const VHINT = 'Type a and b as letters, for example b - a or 1/2a + 1/2b.';
FD.practice({
  section: 'proof',
  gens: [
    () => {
      const k = FD.rnd(0, 3), q = ['\\overrightarrow{AB}', '\\overrightarrow{BA}', '\\overrightarrow{OM}', '\\overrightarrow{AM}'][k];
      const ans = ['b-a', 'a-b', '1/2a+1/2b', '1/2b-1/2a'][k], tex = ['\\mathbf{b} - \\mathbf{a}', '\\mathbf{a} - \\mathbf{b}', '\\tfrac12\\mathbf{a} + \\tfrac12\\mathbf{b}', '\\tfrac12\\mathbf{b} - \\tfrac12\\mathbf{a}'][k];
      const why = ['\\(\\overrightarrow{AO} + \\overrightarrow{OB} = -\\mathbf{a} + \\mathbf{b}\\).', '\\(\\overrightarrow{BO} + \\overrightarrow{OA} = -\\mathbf{b} + \\mathbf{a}\\).', '\\(\\mathbf{a} + \\tfrac12(\\mathbf{b} - \\mathbf{a}) = \\tfrac12\\mathbf{a} + \\tfrac12\\mathbf{b}\\).', '\\(\\overrightarrow{AM} = \\tfrac12\\overrightarrow{AB} = \\tfrac12(\\mathbf{b} - \\mathbf{a})\\).'][k];
      return { type: 'alg', q: `In triangle \\(OAB\\), \\(\\overrightarrow{OA} = \\mathbf{a}\\) and \\(\\overrightarrow{OB} = \\mathbf{b}\\). \\(M\\) is the midpoint of \\(AB\\). Find \\(${q}\\) in terms of \\(\\mathbf{a}\\) and \\(\\mathbf{b}\\).`, a: ans, form: 'simplified', hint: VHINT, show: `\\(${tex}\\)`, why };
    },
    () => {
      const [m, n] = FD.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), s = m + n;
      const tex = `${FD.ftex(n, s)}\\mathbf{a} + ${FD.ftex(m, s)}\\mathbf{b}`;
      return { type: 'alg', q: `\\(\\overrightarrow{OA} = \\mathbf{a}\\), \\(\\overrightarrow{OB} = \\mathbf{b}\\). \\(P\\) is on \\(AB\\) with \\(AP : PB = ${m} : ${n}\\). Find \\(\\overrightarrow{OP}\\), simplified.`, a: `${n}/${s}a+${m}/${s}b`, form: 'simplified', hint: VHINT, show: `\\(${tex}\\)`, why: `\\(\\overrightarrow{AP} = ${FD.ftex(m, s)}\\overrightarrow{AB} = ${FD.ftex(m, s)}(\\mathbf{b} - \\mathbf{a})\\). So \\(\\overrightarrow{OP} = \\mathbf{a} + ${FD.ftex(m, s)}(\\mathbf{b} - \\mathbf{a}) = ${tex}\\).` };
    },
    () => {
      const x = FD.rndNZ(-3, 4), y = FD.rndNZ(-3, 4), k = FD.pick([2, 3, 4, 5]);
      const v = (c) => VLIN(c * x, c * y);
      return { type: 'mcq', q: `\\(\\overrightarrow{PQ} = ${v(k)}\\) and \\(\\overrightarrow{RS} = ${v(1)}\\). What can you say about \\(PQ\\) and \\(RS\\)?`, opts: [`Parallel, and \\(PQ\\) is ${k} times as long as \\(RS\\)`, `Parallel, and \\(RS\\) is ${k} times as long as \\(PQ\\)`, 'Perpendicular', 'They meet at a point'], why: `\\(\\overrightarrow{PQ} = ${k}(${v(1)}) = ${k}\\overrightarrow{RS}\\): a multiple, so parallel and ${k} times as long.` };
    },
    () => {
      const x = FD.rndNZ(-3, 3), y = FD.rndNZ(-3, 3), k = FD.pick([2, 3]);
      const v = (c) => VLIN(c * x, c * y);
      return { type: 'mcq', q: `\\(\\overrightarrow{AB} = ${v(1)}\\) and \\(\\overrightarrow{BC} = ${v(k)}\\). Which statement is true?`, opts: ['\\(A\\), \\(B\\) and \\(C\\) lie on a straight line', '\\(AB\\) is perpendicular to \\(BC\\)', '\\(AB\\) is longer than \\(BC\\)', '\\(A\\) and \\(C\\) are the same point'], why: `\\(\\overrightarrow{BC} = ${k}\\overrightarrow{AB}\\): parallel, and they share point \\(B\\), so \\(A\\), \\(B\\), \\(C\\) are collinear.` };
    },
  ],
});

FD.check({
  section: 'proof',
  items: [
    { type: 'alg', q: '\\(\\overrightarrow{OA} = \\mathbf{a}\\) and \\(\\overrightarrow{OB} = \\mathbf{b}\\). Find \\(\\overrightarrow{AB}\\).', a: 'b-a', form: 'simplified', hint: VHINT, show: '\\(\\mathbf{b} - \\mathbf{a}\\)', why: '\\(\\overrightarrow{AO} + \\overrightarrow{OB} = -\\mathbf{a} + \\mathbf{b}\\).' },
    { type: 'alg', q: '\\(\\overrightarrow{OA} = \\mathbf{a}\\), \\(\\overrightarrow{OB} = \\mathbf{b}\\). \\(N\\) is the midpoint of \\(AB\\). Find \\(\\overrightarrow{ON}\\).', a: '1/2a+1/2b', form: 'simplified', hint: VHINT, show: '\\(\\tfrac12\\mathbf{a} + \\tfrac12\\mathbf{b}\\)', why: '\\(\\mathbf{a} + \\tfrac12(\\mathbf{b} - \\mathbf{a})\\).' },
    { type: 'tf', q: 'If \\(\\overrightarrow{XY} = 3\\overrightarrow{ZW}\\), then \\(XY\\) is parallel to \\(ZW\\).', a: true, why: 'One is a multiple of the other.' },
    { type: 'mcq', q: 'To prove \\(A\\), \\(B\\), \\(C\\) are collinear you show that…', opts: ['\\(\\overrightarrow{AC}\\) is a multiple of \\(\\overrightarrow{AB}\\)', '\\(|\\overrightarrow{AB}| = |\\overrightarrow{BC}|\\)', '\\(\\overrightarrow{AB} = \\overrightarrow{CB}\\)', '\\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\)'], why: 'Parallel vectors with a shared point lie on one line. The last option is true for any three points.' },
  ],
});
