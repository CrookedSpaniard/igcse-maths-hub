// The board: a picture, a big formula, a message, a worked example and a "Try it" panel.
// const a = FD.board(el, 'my-s', pictureHtml, tryHtml, onTry); a.$('#id') finds inside the scene.
FD.board = (el, cls, pic, tryHtml, onTry) => {
  el.innerHTML = `<div class="sim ${cls}"><div class="bd-pic" id="pic">${pic}</div><div class="mbig" id="big"></div><p class="verdict" id="msg"></p><div class="bd-work" id="work"></div><div class="card ctrls bd-try" id="try" hidden>${tryHtml || ''}</div></div>`;
  const root = el.querySelector('.sim'), $ = (s) => root.querySelector(s);
  let w = null;
  const api = {
    root, $,
    big(t) { $('#big').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t, c = 'good') { $('#msg').className = 'verdict ' + c; $('#msg').innerHTML = t || ''; },
    work(lines) { $('#work').innerHTML = ''; w = lines ? FD.work($('#work'), lines) : null; },
    upto: (i) => w && w.upto(i),
    // Shows the lines one by one; returns false if the step was left.
    async lines(lines, ctx, ms = 1300) { api.work(lines); for (let i = 0; i < lines.length; i++) { api.upto(i); if (!(await ctx.sleep(ms))) return false; } return true; },
    tryMode(on) { $('#try').hidden = !on; if (on) { api.work(null); if (onTry) onTry(); } },
    reset() { api.tryMode(false); api.work(null); api.msg(''); api.big(''); },
  };
  return api;
};

// A square of side n (left) and an isometric cube of side n (right). sq / cube = side, 0 hides it.
FD.sqCube = (host) => {
  host.innerHTML = '<svg class="sc" viewBox="0 0 600 236" role="img"></svg>';
  const svg = host.querySelector('svg');
  const square = (n) => {
    const S = 190, x0 = 70, y0 = 12, s = S / n;
    let g = `<rect class="sc-f1" x="${x0}" y="${y0}" width="${S}" height="${S}"/>`;
    for (let i = 1; i < n; i++) g += `<line class="sc-g" x1="${x0 + i * s}" y1="${y0}" x2="${x0 + i * s}" y2="${y0 + S}"/><line class="sc-g" x1="${x0}" y1="${y0 + i * s}" x2="${x0 + S}" y2="${y0 + i * s}"/>`;
    return g + `<rect class="sc-e" x="${x0}" y="${y0}" width="${S}" height="${S}"/><text class="sc-l" x="${x0 + S / 2}" y="228">${n}² = ${n} × ${n} = ${n * n}</text>`;
  };
  const cube = (n) => {
    const u = 100 / n, cx = 440, cy = 110, P = (x, y, z) => `${(cx + (x - y) * u * 0.866).toFixed(1)},${(cy + (x + y) * u * 0.5 - z * u).toFixed(1)}`;
    const face = (pts, cls) => `<polygon class="${cls}" points="${pts.map((p) => P(...p)).join(' ')}"/>`;
    let g = face([[0, 0, n], [n, 0, n], [n, n, n], [0, n, n]], 'sc-f1') + face([[n, 0, 0], [n, n, 0], [n, n, n], [n, 0, n]], 'sc-f2') + face([[0, n, 0], [n, n, 0], [n, n, n], [0, n, n]], 'sc-f3');
    const L = (a, b) => `<line class="sc-g" x1="${P(...a).split(',')[0]}" y1="${P(...a).split(',')[1]}" x2="${P(...b).split(',')[0]}" y2="${P(...b).split(',')[1]}"/>`;
    for (let i = 1; i < n; i++) g += L([i, 0, n], [i, n, n]) + L([0, i, n], [n, i, n]) + L([n, i, 0], [n, i, n]) + L([n, 0, i], [n, n, i]) + L([i, n, 0], [i, n, n]) + L([0, n, i], [n, n, i]);
    g += face([[0, 0, n], [n, 0, n], [n, n, n], [0, n, n]], 'sc-e') + face([[n, 0, 0], [n, n, 0], [n, n, n], [n, 0, n]], 'sc-e') + face([[0, n, 0], [n, n, 0], [n, n, n], [0, n, n]], 'sc-e');
    return g + `<text class="sc-l" x="${cx}" y="228">${n}³ = ${n} × ${n} × ${n} = ${n ** 3}</text>`;
  };
  return (sq, cb) => {
    svg.innerHTML = (sq ? square(sq) : '') + (cb ? cube(cb) : '');
    svg.setAttribute('aria-label', `${sq ? `A ${sq} by ${sq} square. ` : ''}${cb ? `A ${cb} by ${cb} by ${cb} cube.` : ''}`);
  };
};

FD.add({
  id: 'squares',
  title: 'Squares, cubes and roots',
  tab: 'Squares & roots',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Square number', '\\(n^2 = n \\times n\\). The area of a square with side \\(n\\).'],
    ['Cube number', '\\(n^3 = n \\times n \\times n\\). The volume of a cube with side \\(n\\).'],
    ['Square root \\(\\sqrt{\\;}\\)', 'Undoes squaring: \\(\\sqrt{49} = 7\\) because \\(7^2 = 49\\). (\\(-7\\) also squares to 49.)'],
    ['Cube root \\(\\sqrt[3]{\\;}\\)', 'Undoes cubing: \\(\\sqrt[3]{64} = 4\\) because \\(4^3 = 64\\).'],
  ],
  mount(el) {
    const a = FD.board(el, 'sq-s', '<div id="sc"></div>', `
      <label class="ctrl">Side length <input type="range" id="rn" min="1" max="12" value="5"><output id="on">5</output></label>`, () => sync());
    a.sc = FD.sqCube(a.$('#sc'));
    const sync = () => {
      const n = +a.$('#rn').value; a.$('#on').textContent = n;
      a.sc(n, n);
      a.big(`\\sqrt{${n * n}} = ${n} \\qquad \\sqrt[3]{${n ** 3}} = ${n}`);
      a.msg(`The square has area ${n * n}, so its side is \\(\\sqrt{${n * n}} = ${n}\\). The cube has volume ${n ** 3}, so its side is \\(\\sqrt[3]{${n ** 3}} = ${n}\\).`);
    };
    a.$('#rn').addEventListener('input', sync);
    a.sc(3, 3);
    return a;
  },
  steps: [
    {
      title: 'Square numbers',
      text: '<p>A square with side 4 is made of \\(4 \\times 4 = 16\\) small squares. We write \\(4^2 = 16\\) and say “4 squared”.</p><p>Square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, …</p>',
      async on(a, ctx) {
        a.reset();
        for (let n = 1; n <= 5; n++) { a.sc(n, 0); a.big(`${n}^2 = ${n * n}`); if (!(await ctx.sleep(900))) return; }
      },
    },
    {
      title: 'Square roots',
      text: '<p>The <b>square root</b> goes backwards: what number squared gives 49? \\(7^2 = 49\\), so \\(\\sqrt{49} = 7\\).</p><p>\\((-7)^2 = 49\\) too, so 49 has two square roots: 7 and \\(-7\\). The sign \\(\\sqrt{\\;}\\) means the positive one.</p>',
      tip: 'Write both answers as \\(\\pm 7\\) when you solve \\(x^2 = 49\\).',
      async on(a, ctx) {
        a.reset(); a.sc(7, 0);
        await a.lines([['7^2 = 49', ''], ['\\sqrt{49} = 7', 'square root'], ['x^2 = 49 \\Rightarrow x = \\pm 7', 'both roots']], ctx, 1300);
      },
    },
    {
      title: 'Cube numbers and cube roots',
      text: '<p>A cube with side 4 holds \\(4 \\times 4 \\times 4 = 64\\) small cubes: \\(4^3 = 64\\), “4 cubed”.</p><p>The <b>cube root</b> goes back: \\(\\sqrt[3]{64} = 4\\). A negative number has a negative cube root: \\(\\sqrt[3]{-8} = -2\\).</p>',
      tip: 'Learn the cubes 1, 8, 27, 64, 125 and 1000.',
      async on(a, ctx) {
        a.reset();
        for (let n = 1; n <= 4; n++) { a.sc(0, n); a.big(`${n}^3 = ${n ** 3}`); if (!(await ctx.sleep(900))) return; }
        a.big('\\sqrt[3]{64} = 4 \\qquad \\sqrt[3]{-8} = -2');
      },
    },
    {
      title: 'Estimating a root',
      text: '<p>\\(\\sqrt{50}\\) is not a whole number. Find the square numbers either side: \\(49 < 50 < 64\\).</p><p>So \\(\\sqrt{50}\\) is between 7 and 8, and very close to 7.</p>',
      async on(a, ctx) {
        a.reset(); a.sc(7, 0);
        await a.lines([['7^2 = 49 \\quad 8^2 = 64', 'squares either side'], ['49 < 50 < 64', ''], ['7 < \\sqrt{50} < 8', 'close to 7'], ['\\sqrt{50} = 7.07\\dots', 'calculator check']], ctx, 1300);
      },
    },
    {
      title: 'Try it: build and undo',
      text: '<p>Change the side length. The square and the cube grow, and the roots take you back to the side.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'squares',
  gens: [
    () => { const n = FD.rnd(2, 15), k = FD.rnd(0, 3); return [{ type: 'num', q: `Work out \\(\\sqrt{${n * n}}\\)`, a: n, why: `\\(${n}^2 = ${n * n}\\), so \\(\\sqrt{${n * n}} = ${n}\\).` }, { type: 'num', q: `Work out \\(${n}^2\\)`, a: n * n, why: `\\(${n} \\times ${n} = ${n * n}\\).` }, { type: 'num', q: `Work out \\(\\sqrt[3]{${Math.min(n, 10) ** 3}}\\)`, a: Math.min(n, 10), why: `\\(${Math.min(n, 10)}^3 = ${Math.min(n, 10) ** 3}\\).` }, { type: 'num', q: `Work out \\(\\sqrt[3]{-${Math.min(n, 6) ** 3}}\\)`, a: -Math.min(n, 6), why: `\\((-${Math.min(n, 6)})^3 = -${Math.min(n, 6) ** 3}\\).` }][k]; },
    () => { let x; do { x = FD.rnd(5, 150); } while (Number.isInteger(Math.sqrt(x))); const lo = Math.floor(Math.sqrt(x)); return { type: 'num', q: `\\(\\sqrt{${x}}\\) lies between two consecutive whole numbers. Write down the smaller one.`, a: lo, why: `\\(${lo}^2 = ${lo * lo}\\) and \\(${lo + 1}^2 = ${(lo + 1) ** 2}\\). \\(${lo * lo} < ${x} < ${(lo + 1) ** 2}\\), so \\(${lo} < \\sqrt{${x}} < ${lo + 1}\\).` }; },
    () => { const a1 = FD.rnd(2, 6), b1 = FD.rnd(2, 4); return { type: 'num', q: `Work out \\(${a1}^2 + ${b1}^3\\)`, a: a1 * a1 + b1 ** 3, why: `\\(${a1}^2 = ${a1 * a1}\\), \\(${b1}^3 = ${b1 ** 3}\\), total ${a1 * a1 + b1 ** 3}.` }; },
  ],
});

FD.check({
  section: 'squares',
  items: [
    { type: 'num', q: 'Work out \\(13^2\\)', a: 169, why: '\\(13 \\times 13 = 169\\).' },
    { type: 'num', q: 'Work out \\(\\sqrt[3]{125}\\)', a: 5, why: '\\(5^3 = 125\\).' },
    { type: 'mcq', q: 'Between which two whole numbers is \\(\\sqrt{90}\\)?', opts: ['9 and 10', '8 and 9', '10 and 11', '45 and 46'], why: '\\(81 < 90 < 100\\).' },
    { type: 'num', q: 'Solve \\(x^2 = 36\\). Give both answers.', a: [6, -6], fields: ['x =', 'x ='], anyOrder: true, why: '\\(6^2 = 36\\) and \\((-6)^2 = 36\\).' },
    { type: 'tf', q: '\\(\\sqrt[3]{-27} = -3\\)', a: true, why: '\\((-3)^3 = -27\\).' },
  ],
});
