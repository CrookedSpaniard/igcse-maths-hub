// ---- Algebra kit (shared by the Area 2 and 3 lessons) ----
// FD.mk(el, { cls, vis, side, tryHtml }): a stage with an optional picture, a big formula, a verdict line,
//   worked lines and a "Try it" panel. Returns { root, $, big, msg, work, upto, tryMode, onTry }.
// FD.walk(lines, pre?, gap?): a step that resets the stage and reveals worked lines one by one.
// TYPES.alg: typed algebra answers, marked by value at random points, e.g. { type: 'alg', q, a: '(x+3)(x-2)', form: 'factorised', show, why }.
FD.mk = (el, { cls = '', vis = '', side = false, tryHtml = '' } = {}) => {
  el.innerHTML = `<div class="sim kit ${cls}${side ? ' duo' : ''}"><div class="kit-main">${vis ? `<div class="kit-vis">${vis}</div>` : ''}<div class="kit-side"><div class="mbig" data-k="big"></div><p class="verdict" data-k="msg"></p><div class="eq-work" data-k="work"></div></div></div>${tryHtml ? `<div class="card ctrls kit-try" data-k="try" hidden>${tryHtml}</div>` : ''}</div>`;
  const root = el.firstElementChild, $ = (s) => root.querySelector(s), k = (n) => root.querySelector(`[data-k="${n}"]`);
  let w = null;
  const api = {
    root, $, onTry: null,
    big(t) { k('big').innerHTML = t ? FD.tex(t, true) : ''; },
    msg(t = '', c = 'good') { k('msg').className = 'verdict ' + c; k('msg').innerHTML = t; },
    work(lines, c) { k('work').innerHTML = ''; w = lines ? FD.work(k('work'), lines, c) : null; },
    upto(i) { if (w) w.upto(i); },
    tryMode(on) { const t = k('try'); if (t) t.hidden = !on; api.work(null); api.msg(''); if (on && api.onTry) api.onTry(); },
  };
  return api;
};
FD.walk = (lines, pre, gap = 1300) => async (a, ctx) => {
  a.tryMode(false); if (pre) pre(a);
  a.work(lines);
  for (let i = 0; i < lines.length; i++) { a.upto(i); if (!(await ctx.sleep(gap))) return; }
};
// Reads an algebraic expression ("3x^2 - 2(x+1)", "y = (x-c)/m") into a function of its letters, or null.
FD.algFn = (raw) => {
  const s = String(raw || '').replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3').replace(/^[a-zA-Z]=/, '');
  const raw2 = s.match(/\d+\.?\d*|\.\d+|[a-zA-Z]|[()+\-*/^]/g) || [];
  if (!s || raw2.join('') !== s) return null;
  const t = [];
  raw2.forEach((x) => { const p = t[t.length - 1]; if (p != null && /[\w.)]$/.test(p) && /^[\w.(]/.test(x)) t.push('*'); t.push(x); });
  let i = 0;
  const atom = () => {
    const x = t[i++];
    if (x === '(') { const v = sum(); if (t[i++] !== ')') throw 0; return v; }
    if (x != null && /^[\d.]/.test(x)) return () => +x;
    if (x != null && /^[a-zA-Z]$/.test(x)) return (e) => e[x];
    throw 0;
  };
  const pow = () => { const b = atom(); if (t[i] === '^') { i++; const p = un(); return (e) => b(e) ** p(e); } return b; };
  const un = () => { if (t[i] === '-') { i++; const v = un(); return (e) => -v(e); } if (t[i] === '+') { i++; return un(); } return pow(); };
  const prod = () => { let v = un(); while (t[i] === '*' || t[i] === '/') { const o = t[i++], r = un(), l = v; v = o === '*' ? (e) => l(e) * r(e) : (e) => l(e) / r(e); } return v; };
  const sum = () => { let v = prod(); while (t[i] === '+' || t[i] === '-') { const o = t[i++], r = prod(), l = v; v = o === '+' ? (e) => l(e) + r(e) : (e) => l(e) - r(e); } return v; };
  try { const f = sum(); return i === t.length ? f : null; } catch (e) { return null; }
};
// Number of terms at the top level ("3x + 2y - 1" → 3) and whether it is a product of brackets.
FD.algShape = (raw) => {
  const s = String(raw || '').replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/^[a-zA-Z]=/, '');
  let d = 0, terms = 1;
  [...s].forEach((c, j) => { if (c === '(') d++; else if (c === ')') d--; else if (!d && j > 0 && (c === '+' || c === '-') && !/[\^*/(]/.test(s[j - 1])) terms++; });
  return { terms, brackets: s.includes('(') };
};
FD.algSame = (u, v) => {
  const f = FD.algFn(u), g = FD.algFn(v);
  if (!f || !g) return false;
  const vars = [...new Set((String(u) + String(v)).replace(/^[a-zA-Z]=|=/g, '').match(/[a-zA-Z]/g) || [])];
  let n = 0;
  for (let k = 0; k < 12 && n < 6; k++) {
    const e = {}; vars.forEach((x) => { e[x] = +(Math.random() * 6 - 2.5).toFixed(3) || 1.3; });
    const a = f(e), b = g(e);
    if (!isFinite(b)) continue;
    if (!isFinite(a) || Math.abs(a - b) > 1e-6 * (1 + Math.abs(b))) return false;
    n++;
  }
  return n >= 3;
};
const algTex = (s) => String(s).replace(/\*/g, ' \\times ').replace(/\^\(?(-?\w+)\)?/g, '^{$1}');
TYPES.alg = (it, body, finish) => {
  body.innerHTML = `
    <div class="num-row"><label class="num-f">${it.lhs ? `<span>\\(${it.lhs}\\)</span>` : ''}<input class="num-in alg-in" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Your answer"></label>
      <button class="btn small-btn chk-go" disabled>Check answer</button></div>
    <p class="alg-prev" aria-hidden="true"></p>
    <p class="chk-hint">${it.hint || 'Type powers with ^, for example 3x^2 - 5x + 2.'}</p>`;
  const inp = body.querySelector('.alg-in'), go = body.querySelector('.chk-go'), prev = body.querySelector('.alg-prev');
  inp.addEventListener('input', () => { go.disabled = !inp.value.trim(); prev.innerHTML = inp.value.trim() ? FD.tex(algTex(inp.value.trim().replace(/^[a-zA-Z]=/, ''))) : ''; });
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !go.disabled) go.click(); });
  go.addEventListener('click', () => {
    if (body.dataset.done) return;
    body.dataset.done = 1; go.hidden = true; inp.readOnly = true;
    const sh = FD.algShape(inp.value), want = FD.algShape(it.a);
    let ok = FD.algSame(inp.value, it.a);
    if (ok && it.form === 'factorised') ok = sh.terms === 1 && sh.brackets;
    if (ok && it.form === 'expanded') ok = !sh.brackets && sh.terms <= want.terms;
    if (ok && it.form === 'simplified') ok = sh.terms <= want.terms && (want.brackets || !sh.brackets);
    inp.classList.add(ok ? 'right' : 'wrong');
    if (!ok) body.insertAdjacentHTML('beforeend', `<p class="num-want">Answer: ${it.show || `\\(${algTex(it.a)}\\)`}</p>`);
    finish(ok ? 1 : 0);
  });
  return 1;
};
// A graph: FD.graph(host, axesOptions) draws the grid once and returns helpers that write SVG for a layer
// clipped to the plot area: curve(f, cls, a, b), pt(x, y, cls), lbl(x, y, text, cls), line(x1, y1, x2, y2, cls).
let kitClip = 0;
FD.graph = (host, o) => {
  const ax = FD.axes(o), id = 'kclip' + ++kitClip, p = o.pad || 28;
  host.innerHTML = `<svg class="graph" viewBox="0 0 ${ax.w} ${ax.h}" role="img" aria-label="${o.label || 'Graph'}">${ax.grid()}
    <clipPath id="${id}"><rect x="${p}" y="${p}" width="${ax.w - 2 * p}" height="${ax.h - 2 * p}"/></clipPath><g clip-path="url(#${id})" class="g-clip"></g><g class="g-top"></g></svg>`;
  const clip = host.querySelector('.g-clip'), top = host.querySelector('.g-top');
  const inX = (x) => Math.max(p + 2, Math.min(ax.w - p - 2, x)), inY = (y) => Math.max(p + 12, Math.min(ax.h - p - 4, y));
  return {
    ax, svg: host.querySelector('svg'),
    draw(under, over = '') { clip.innerHTML = under; top.innerHTML = over; },
    curve: (f, cls = '', a, b) => `<path class="curve ${cls}" d="${ax.path(f, a, b)}"/>`,
    line: (x1, y1, x2, y2, cls = 'g-line') => `<line class="${cls}" x1="${ax.X(x1)}" y1="${ax.Y(y1)}" x2="${ax.X(x2)}" y2="${ax.Y(y2)}"/>`,
    pt: (x, y, cls = '') => `<circle class="pt ${cls}" cx="${ax.X(x)}" cy="${ax.Y(y)}" r="6"/>`,
    // a label next to (x, y): it flips to the left near the right edge and stays inside the plot
    lbl: (x, y, t, cls = '') => { const X = ax.X(x), right = X > ax.w * .62; return `<text class="g-lbl ${cls}" x="${inX(X + (right ? -10 : 10))}" y="${inY(ax.Y(y) - 10)}" text-anchor="${right ? 'end' : 'start'}">${t}</text>`; },
  };
};
// A polynomial from its coefficients, highest power first: FD.poly([1, -3, 2]) → "x^{2} - 3x + 2".
// plain = true writes "x^2" so it can be used as a typed-answer key.
FD.poly = (cs, v = 'x', plain = false) => {
  const n = cs.length - 1;
  let s = '';
  cs.forEach((c, i) => {
    const p = n - i, a = Math.abs(c);
    if (!c) return;
    const body = (a === 1 && p ? '' : String(+a.toFixed(6))) + (p ? v + (p > 1 ? (plain ? `^${p}` : `^{${p}}`) : '') : '');
    s += s ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body;
  });
  return s || '0';
};
// " + 3" / " - 3": a signed number to put after another term.
FD.sg = (n) => (n < 0 ? ` - ${-n}` : ` + ${n}`);
// Tests in a part that mixes tiers: Q items on Higher-only sections and LONG items with h: true are left out
// for Foundation students. Keep them at the end of their lists so saved answers still line up.
FD.tierTest = (cfg) => FD.test({ ...cfg, Q: cfg.Q.filter((q) => FD.inTier(FD.section(q[4]))), LONG: cfg.LONG.filter((l) => FD.tier === 'H' || !l.h) });
// ---- end of kit ----

// ---- Transformation helpers (shared by the transformations scenes) ----
// FD.tfG(api, label): a −6…6 coordinate grid. FD.tfPoly(g, pts, cls, name): SVG for a shape with its name inside.
// FD.tf.*: maps of a point [x, y] (translation, rotation, reflection, enlargement). FD.tfAnim(ctx, ms, fn): fn(t) for t → 1.
FD.cv = (x, y) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;
FD.mn = (n) => String(n).replace('-', '−');
FD.tfG = (a, label) => FD.graph(a.$('[data-k="g"]'), { w: 400, h: 400, x: [-6, 6], y: [-6, 6], step: 1, label });
const tfClean = (v) => +(+v).toFixed(6) || 0;
FD.tfPoly = (g, pts, cls = 'tf-obj', name = '') => {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return `<polygon class="${cls}" points="${pts.map(([x, y]) => `${g.ax.X(x)},${g.ax.Y(y)}`).join(' ')}"/>` + (name ? `<text class="tf-name" x="${g.ax.X(cx)}" y="${g.ax.Y(cy) + 5}">${name}</text>` : '');
};
FD.tf = {
  tr: (dx, dy) => ([x, y]) => [x + dx, y + dy],
  rot: (deg, cx = 0, cy = 0) => ([x, y]) => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [tfClean(cx + c * (x - cx) - s * (y - cy)), tfClean(cy + s * (x - cx) + c * (y - cy))]; },
  // line: ['x', k] is x = k, ['y', k] is y = k, ['yx'] is y = x, ['y-x'] is y = −x
  refl: (L) => ([x, y]) => (L[0] === 'x' ? [2 * L[1] - x, y] : L[0] === 'y' ? [x, 2 * L[1] - y] : L[0] === 'yx' ? [y, x] : [-y, -x]),
  enl: (k, cx = 0, cy = 0) => ([x, y]) => [tfClean(cx + k * (x - cx)), tfClean(cy + k * (y - cy))],
};
FD.tfMap = (pts, f) => pts.map((p) => f(p));
FD.tfLerp = (P, Q, t) => P.map(([x, y], i) => [x + (Q[i][0] - x) * t, y + (Q[i][1] - y) * t]);
FD.tfAnim = async (ctx, ms, fn) => { const n = Math.max(1, Math.round(ms / 40)); for (let i = 1; i <= n; i++) { fn(i / n); if (!(await ctx.sleep(40))) return false; } return true; };
FD.tfPt = ([x, y]) => `(${tfClean(x)}, ${tfClean(y)})`;
FD.tfLineName = (L) => (L[0] === 'x' ? (L[1] ? `x = ${L[1]}` : 'x = 0 (the y-axis)') : L[0] === 'y' ? (L[1] ? `y = ${L[1]}` : 'y = 0 (the x-axis)') : L[0] === 'yx' ? 'y = x' : 'y = −x');
// the same name in TeX
FD.tfLineTex = (L) => (L[0] === 'x' ? (L[1] ? `x = ${L[1]}` : 'x = 0 \\text{ (the } y\\text{-axis)}') : L[0] === 'y' ? (L[1] ? `y = ${L[1]}` : 'y = 0 \\text{ (the } x\\text{-axis)}') : L[0] === 'yx' ? 'y = x' : 'y = -x');
// a mirror line drawn across the whole grid
FD.tfMirror = (g, L) => {
  const [a, b] = L[0] === 'x' ? [[L[1], -7], [L[1], 7]] : L[0] === 'y' ? [[-7, L[1]], [7, L[1]]] : L[0] === 'yx' ? [[-7, -7], [7, 7]] : [[-7, 7], [7, -7]];
  return g.line(a[0], a[1], b[0], b[1], 'tf-mirror');
};
// ---- end of transformation helpers ----

const TR_A = [[-5, 1], [-2, 1], [-5, 3]];
FD.add({
  id: 'translations',
  title: 'Translations',
  tab: 'Translations',
  icon: 'geometry',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Translation', 'A slide. Every point moves the same distance in the same direction.'],
    ['Column vector', '\\(\\begin{pmatrix} x \\\\ y \\end{pmatrix}\\): \\(x\\) across (positive = right), \\(y\\) up (positive = up).'],
    ['Object, image', 'The shape before the transformation is the object; the shape after it is the image.'],
    ['Congruent', 'Exactly the same shape and size. Translations, reflections and rotations give congruent images.'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'tf-t', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<label class="ctrl">Across <input type="range" data-k="x" min="-4" max="4" value="3"><output data-k="ox">3</output></label>
        <label class="ctrl">Up <input type="range" data-k="y" min="-4" max="4" value="-2"><output data-k="oy">−2</output></label>`,
    });
    const g = FD.tfG(a, 'A triangle and its image after a translation');
    a.g = g;
    a.show = (obj, img, dx, dy, arrow = true) => g.draw(FD.tfPoly(g, obj, 'tf-obj', 'A') + (img ? FD.tfPoly(g, img, 'tf-img', 'B') : '') + (img && arrow ? g.line(obj[0][0], obj[0][1], obj[0][0] + dx, obj[0][1] + dy, 'tf-arrow') : ''));
    const sync = () => {
      const x = +a.$('[data-k="x"]').value, y = +a.$('[data-k="y"]').value, obj = [[-2, -1], [1, -1], [-2, 1]];
      a.$('[data-k="ox"]').textContent = FD.mn(x); a.$('[data-k="oy"]').textContent = FD.mn(y);
      a.show(obj, FD.tfMap(obj, FD.tf.tr(x, y)), x, y);
      a.big(`\\text{translation by } ${FD.cv(x, y)}`);
      a.msg(`${x ? `${Math.abs(x)} ${x > 0 ? 'right' : 'left'}` : 'no move across'}, ${y ? `${Math.abs(y)} ${y > 0 ? 'up' : 'down'}` : 'no move up or down'}. Same shape, same size, same way round.`);
    };
    ['x', 'y'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    a.show(TR_A);
    return a;
  },
  steps: [
    {
      title: 'A slide',
      text: '<p>A <b>translation</b> slides a shape. It does not turn or flip, and it stays the same size.</p><p>Every corner moves the same distance in the same direction: here 6 right and 4 down.</p>',
      async on(a, ctx) {
        a.tryMode(false); a.big(''); a.msg('');
        const B = FD.tfMap(TR_A, FD.tf.tr(6, -4));
        a.show(TR_A); if (!(await ctx.sleep(500))) return;
        if (!(await FD.tfAnim(ctx, 1400, (t) => a.g.draw(FD.tfPoly(a.g, TR_A, 'tf-obj', 'A') + FD.tfPoly(a.g, FD.tfLerp(TR_A, B, t), 'tf-img', 'B'))))) return;
        a.show(TR_A, B, 6, -4);
      },
    },
    {
      title: 'Column vectors',
      text: '<p>We describe the movement with a <b>column vector</b>. The top number is across (right +, left −); the bottom number is up (up +, down −).</p><p>6 right and 4 down is \\(\\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}\\).</p>',
      async on(a) { a.tryMode(false); a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4); a.big(`\\text{translation by } ${FD.cv(6, -4)}`); a.msg(''); },
    },
    {
      title: 'Same shape, same size',
      text: '<p>After a translation, every length and every angle is unchanged. The image is <b>congruent</b> to the object; only its position has changed.</p>',
      tip: 'Check one corner first, then count the other corners from it.',
      async on(a) { a.tryMode(false); a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4, false); a.big(''); a.msg('Base 3, height 2, right angle: the same in A and B.'); },
    },
    {
      title: 'Finding the vector',
      text: '<p>To find the translation from A to B, pick a corner of A and count to the same corner of B.</p>',
      on: FD.walk([
        ['(-5, 1) \\to (1, -3)', 'The bottom-left corner of A and of B.'],
        ['\\text{across: } 1 - (-5) = 6', 'Image minus object.'],
        ['\\text{up: } -3 - 1 = -4', ''],
        [`\\text{translation by } ${FD.cv(6, -4)}`, ''],
      ], (a) => { a.show(TR_A, FD.tfMap(TR_A, FD.tf.tr(6, -4)), 6, -4); a.big(''); }),
    },
    {
      title: 'Try it: translate the triangle',
      text: '<p>Change the column vector. Watch the image slide while it stays the same shape and the same way round.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'translations',
  gens: [
    () => {
      const x = FD.rnd(-6, 6), y = FD.rnd(-6, 6), dx = FD.rndNZ(-6, 6), dy = FD.rndNZ(-6, 6);
      return { type: 'num', q: `The point \\((${x}, ${y})\\) is translated by \\(${FD.cv(dx, dy)}\\). Find the coordinates of its image.`, a: [x + dx, y + dy], fields: ['\\(x\\)', '\\(y\\)'], show: `\\((${x + dx}, ${y + dy})\\)`, why: `Add the vector: \\((${x} + ${dx < 0 ? `(${dx})` : dx}, ${y} + ${dy < 0 ? `(${dy})` : dy}) = (${x + dx}, ${y + dy})\\).` };
    },
    () => {
      const x = FD.rnd(-5, 5), y = FD.rnd(-5, 5), dx = FD.rndNZ(-6, 6), dy = FD.rndNZ(-6, 6);
      return { type: 'num', q: `A translation maps \\((${x}, ${y})\\) onto \\((${x + dx}, ${y + dy})\\). Write the translation as a column vector.`, a: [dx, dy], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(dx, dy)}\\)`, why: `Image minus object: \\(${FD.cv(`${x + dx} - ${x < 0 ? `(${x})` : x}`, `${y + dy} - ${y < 0 ? `(${y})` : y}`)} = ${FD.cv(dx, dy)}\\).` };
    },
    () => {
      const dx = FD.rndNZ(-7, 7), dy = FD.rndNZ(-7, 7), s = (n, p, m) => `${Math.abs(n)} ${n > 0 ? p : m}`;
      return { type: 'mcq', q: `A translation by \\(${FD.cv(dx, dy)}\\) moves a shape…`, opts: [`${s(dx, 'right', 'left')} and ${s(dy, 'up', 'down')}`, `${s(-dx, 'right', 'left')} and ${s(dy, 'up', 'down')}`, `${s(dy, 'right', 'left')} and ${s(dx, 'up', 'down')}`, `${s(dx, 'right', 'left')} and ${s(-dy, 'up', 'down')}`].filter((o, i, arr) => arr.indexOf(o) === i), why: 'Top number: across (+ right). Bottom number: up (+ up).' };
    },
    () => {
      const dx = FD.rndNZ(-5, 5), dy = FD.rndNZ(-5, 5);
      return { type: 'num', q: `Shape P is translated by \\(${FD.cv(dx, dy)}\\) to give shape Q. Which translation maps Q back onto P?`, a: [-dx, -dy], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(-dx, -dy)}\\)`, why: `Go back the other way: change both signs, \\(${FD.cv(-dx, -dy)}\\).` };
    },
  ],
});

FD.check({
  section: 'translations',
  items: [
    { type: 'num', q: `Translate \\((2, -3)\\) by \\(${FD.cv(-5, 4)}\\).`, a: [-3, 1], fields: ['\\(x\\)', '\\(y\\)'], show: '\\((-3, 1)\\)', why: '\\(2 - 5 = -3\\), \\(-3 + 4 = 1\\).' },
    { type: 'num', q: 'A translation maps \\((1, 4)\\) onto \\((6, 1)\\). Write it as a column vector.', a: [5, -3], fields: ['Top', 'Bottom'], show: `\\(${FD.cv(5, -3)}\\)`, why: '5 right, 3 down.' },
    { type: 'tf', q: 'After a translation, the image is congruent to the object.', a: true, why: 'Lengths and angles do not change.' },
    { type: 'mcq', q: 'A translation is described by…', opts: ['a column vector', 'a mirror line', 'a centre and an angle', 'a scale factor'], why: 'The vector gives the distance and direction of the slide.' },
  ],
});
