// Completing a pattern on a square grid so that one (or two) mirror lines are lines of symmetry.
FD.add({
  id: 'complete',
  title: 'Completing symmetrical patterns',
  tab: 'Patterns',
  icon: 'target',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Reflection', 'Each square moves to the other side of the mirror line, the same distance away.'],
    ['Perpendicular', 'At right angles. Squares move perpendicular to the mirror line.'],
  ],
  mount(el) {
    const G = FD.G, NX = 10, NY = 8, S = 30, X0 = 60, Y0 = 30;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A square grid with mirror lines', stack: false,
      ctrls: `<div class="row"><label>Mirror lines <select id="md"><option value="1">One (vertical)</option><option value="2">Two (vertical and horizontal)</option></select></label></div>
        <div class="chk-btns"><button class="btn" id="go">Check my pattern</button><button class="btn ghost" id="new">New pattern</button><button class="btn ghost" id="show">Show the answer</button></div>`,
    });
    let given = new Set(), mine = new Set(), two = false, live = false;
    const key = (i, j) => i + ',' + j;
    // All the images of cell (i, j) in the mirror line(s).
    const images = (i, j) => { const r = [[NX - 1 - i, j]]; if (two) r.push([i, NY - 1 - j], [NX - 1 - i, NY - 1 - j]); return r; };
    const target = () => { const t = new Set(given); given.forEach((c) => { const [i, j] = c.split(',').map(Number); images(i, j).forEach(([p, q]) => t.add(key(p, q))); }); return t; };
    a.render = (show = new Set()) => {
      let s = '';
      given.forEach((c) => { const [i, j] = c.split(',').map(Number); s += `<rect class="g-bar" x="${X0 + i * S}" y="${Y0 + j * S}" width="${S}" height="${S}"/>`; });
      mine.forEach((c) => { const [i, j] = c.split(',').map(Number); s += `<rect class="g-bar b2" x="${X0 + i * S}" y="${Y0 + j * S}" width="${S}" height="${S}"/>`; });
      show.forEach((c) => { if (given.has(c) || mine.has(c)) return; const [i, j] = c.split(',').map(Number); s += `<rect class="g-bar b2 g-in" x="${X0 + i * S}" y="${Y0 + j * S}" width="${S}" height="${S}"/>`; });
      s += G.grid(X0, Y0, NX, NY, S) + G.line([X0 + (NX / 2) * S, Y0 - 12], [X0 + (NX / 2) * S, Y0 + NY * S + 12], 'g-hl');
      if (two) s += G.line([X0 - 12, Y0 + (NY / 2) * S], [X0 + NX * S + 12, Y0 + (NY / 2) * S], 'g-hl');
      a.draw(s);
    };
    // A random pattern in the left half (or the top-left quarter with two lines).
    const fresh = () => {
      given = new Set(); mine = new Set();
      const w = NX / 2, h = two ? NY / 2 : NY, n = two ? 5 : 7;
      while (given.size < n) given.add(key(FD.rnd(0, w - 1), FD.rnd(0, h - 1)));
    };
    a.set = (cells, t) => { two = t; given = new Set(cells.map(([i, j]) => key(i, j))); mine = new Set(); a.render(); };
    a.answer = () => a.render(target());
    a.target = target;
    a.svg.addEventListener('click', (e) => {
      if (!live) return;
      const p = a.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(a.svg.getScreenCTM().inverse()), i = Math.floor((q.x - X0) / S), j = Math.floor((q.y - Y0) / S);
      if (i < 0 || j < 0 || i >= NX || j >= NY || given.has(key(i, j))) return;
      const k = key(i, j); if (mine.has(k)) mine.delete(k); else mine.add(k);
      a.msg(''); a.render();
    });
    a.q('#go').addEventListener('click', () => {
      const t = target(), want = [...t].filter((c) => !given.has(c)), miss = want.filter((c) => !mine.has(c)).length, extra = [...mine].filter((c) => !t.has(c)).length;
      a.msg(!miss && !extra ? '✓ Perfect: the pattern is symmetrical.' : `${miss ? `${miss} square${miss > 1 ? 's' : ''} still missing. ` : ''}${extra ? `${extra} square${extra > 1 ? 's are' : ' is'} in the wrong place.` : ''}`, !miss && !extra ? 'good' : 'bad');
    });
    a.q('#new').addEventListener('click', () => { fresh(); a.msg(''); a.render(); });
    a.q('#show').addEventListener('click', () => { a.answer(); a.msg('The orange squares complete the pattern.'); });
    a.onSync(() => { two = a.q('#md').value === '2'; fresh(); a.msg(''); a.render(); });
    a.live = (on) => { live = on; };
    a.set([[1, 1], [2, 1], [3, 2], [4, 3], [2, 5], [3, 6], [0, 4]], false);
    return a;
  },
  steps: [
    {
      title: 'Reflect each square',
      text: '<p>To complete a pattern, <b>reflect each shaded square</b> in the mirror line.</p><p>Count how far the square is from the line, then go the <b>same distance</b> on the other side.</p>',
      tip: 'Squares move straight across the line, at right angles to it.',
      async on(a, ctx) {
        a.off(); a.live(false); a.set([[1, 1], [2, 1], [3, 2], [4, 3], [2, 5], [3, 6], [0, 4]], false);
        const t = [...a.target()], shown = new Set();
        for (const c of t) { shown.add(c); a.render(shown); if (!(await ctx.sleep(380))) return; }
        a.msg('The pattern now has a vertical line of symmetry.');
      },
    },
    {
      title: 'Two mirror lines',
      text: '<p>With <b>two</b> mirror lines, reflect in one line first, then reflect <b>everything</b> in the other line.</p><p>The finished pattern has 2 lines of symmetry and rotational symmetry of order 2.</p>',
      async on(a, ctx) {
        a.off(); a.live(false); a.set([[1, 0], [2, 1], [4, 1], [3, 3], [0, 2]], true);
        if (!(await ctx.sleep(900))) return;
        a.answer(); a.msg('Each square has three images: one in each line, and one in both.');
      },
    },
    {
      title: 'Try it: complete the pattern',
      text: '<p>Tap squares on the grid to shade them. Make the mirror line(s) into lines of symmetry, then press <b>Check my pattern</b>.</p><p>Choose one or two mirror lines, and press <b>New pattern</b> for another one.</p>',
      tip: 'Tap a square again to clear it.',
      on(a) { a.live(true); a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'complete',
  gens: [
    () => { const d = FD.rnd(1, 6); return { type: 'num', q: `A shaded square is ${d} square${d > 1 ? 's' : ''} to the left of a vertical mirror line. How many squares to the right of the line is its reflection?`, a: d, why: `A reflection is the same distance from the mirror line on the other side: ${d}.` }; },
    () => { const x = FD.rnd(1, 9), m = FD.rnd(x + 1, 10); return { type: 'num', q: `The vertical mirror line is \\(x = ${m}\\). A point is at \\(x = ${x}\\). What is the \\(x\\)-coordinate of its reflection?`, a: 2 * m - x, why: `The point is \\(${m} - ${x} = ${m - x}\\) to the left of the line, so the image is \\(${m - x}\\) to the right: \\(${m} + ${m - x} = ${2 * m - x}\\).` }; },
    () => { const n = FD.rnd(2, 6); return { type: 'num', q: `A pattern has ${n} shaded squares in the top-left quarter and two mirror lines (one vertical, one horizontal). No square touches a mirror line. How many shaded squares are there when it is complete?`, a: 4 * n, why: `Each square has three images (one in each line and one in both), so there are \\(4 \\times ${n} = ${4 * n}\\) squares.` }; },
  ],
});

FD.check({
  section: 'complete',
  items: [
    { type: 'mcq', q: 'A square is 3 squares above a horizontal mirror line. Where is its reflection?', opts: ['3 squares below the line', '3 squares to the right', '6 squares below the line', 'On the line'], why: 'Same distance on the other side, at right angles to the line.' },
    { type: 'num', q: 'A pattern has 6 shaded squares on one side of a mirror line and none on the line. How many shaded squares does the complete pattern have?', a: 12, why: 'Each square gets one image: \\(6 \\times 2 = 12\\).' },
    { type: 'tf', q: 'A pattern completed with two perpendicular mirror lines also has rotational symmetry of order 2.', a: true, why: 'Reflecting in both lines is the same as a half turn about the point where they cross.' },
    { type: 'num', q: 'The mirror line is \\(x = 4\\). Find the \\(x\\)-coordinate of the image of a point with \\(x = 1\\).', a: 7, why: '3 to the left of the line → 3 to the right: \\(4 + 3 = 7\\).' },
  ],
});
