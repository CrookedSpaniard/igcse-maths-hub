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

// Conversion graph: pounds to euros (an example rate), with a reading line across and down.
FD.add({
  id: 'conversion',
  title: 'Conversion graphs',
  tab: 'Conversion',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Conversion graph', 'A straight-line graph that changes one unit into another, like miles into kilometres.'],
    ['Exchange rate', 'How much of one currency you get for one unit of another, e.g. £1 = €1.15 (an example rate).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'rl-c', side: true,
      vis: '<div data-k="g"></div>',
      tryHtml: `<div class="seg-row" data-k="u"><button class="btn primary" data-u="0">Miles → km</button><button class="btn" data-u="1">£ → € (example rate)</button></div>
        <label class="ctrl">Value <input type="range" data-k="v" min="0" max="50" value="20"><output data-k="ov">20</output></label>`,
    });
    const U = [{ k: 1.6, xl: 'miles', yl: 'km', y: [0, 80] }, { k: 1.15, xl: '£', yl: '€', y: [0, 60] }];
    const host = a.$('[data-k="g"]');
    let gr = null, ui = -1;
    a.read = (u, v, show = true) => {
      if (u !== ui) { gr = FD.graph(host, { w: 420, h: 340, x: [0, 50], y: U[u].y, step: 10, ystep: 10, pad: 34, label: `Conversion graph: ${U[u].xl} to ${U[u].yl}` }); ui = u; }
      const { k, xl, yl } = U[u], y = k * v;
      gr.draw(gr.curve((x) => k * x) + (show ? gr.line(v, 0, v, y, 'rl-read') + gr.line(v, y, 0, y, 'rl-read') : ''), (show ? gr.pt(v, y, 'hot') + gr.lbl(v, y, `${v} ${xl} ≈ ${FD.round(y, 1)} ${yl}`) : '') + `<text class="g-lbl" x="${gr.ax.X(50)}" y="${gr.ax.Y(0) + 26}" text-anchor="end">${xl}</text><text class="g-lbl" x="${gr.ax.X(0) + 6}" y="${gr.ax.Y(U[u].y[1]) + 4}">${yl}</text>`);
      return y;
    };
    let u = 0;
    const sync = () => {
      const v = +a.$('[data-k="v"]').value; a.$('[data-k="ov"]').textContent = v;
      const y = a.read(u, v);
      a.big(`${v} \\text{ ${U[u].xl === '£' ? 'pounds' : 'miles'}} \\approx ${FD.round(y, 1)} \\text{ ${U[u].yl === '€' ? 'euros' : 'km'}}`);
    };
    a.$('[data-k="u"]').addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (!b) return; u = +b.dataset.u; a.$('[data-k="u"]').querySelectorAll('.btn').forEach((x) => x.classList.toggle('primary', x === b)); sync(); });
    a.$('[data-k="v"]').addEventListener('input', sync);
    a.onTry = sync;
    a.read(0, 25, false);
    return a;
  },
  steps: [
    {
      title: 'Drawing a conversion graph',
      text: '<p>5 miles is about 8 km. Plot \\((0, 0)\\) and \\((5, 8)\\), and a few more points such as \\((50, 80)\\). Join them with a straight line.</p>',
      tip: 'A conversion graph goes through \\((0, 0)\\): 0 miles is 0 km.',
      async on(a) { a.tryMode(false); a.read(0, 25, false); a.big('5 \\text{ miles} \\approx 8 \\text{ km}'); },
    },
    {
      title: 'Reading across and down',
      text: '<p>To change 25 miles into km, go <b>up</b> from 25 on the miles axis to the line, then <b>across</b> to the km axis: about 40 km.</p>',
      async on(a, ctx) { a.tryMode(false); a.read(0, 25, false); a.big(''); if (!(await ctx.sleep(900))) return; a.read(0, 25); a.big('25 \\text{ miles} \\approx 40 \\text{ km}'); },
    },
    {
      title: 'Beyond the graph',
      text: '<p>The graph stops at 50 miles. To change 200 miles, use a value you can read and multiply: 50 miles ≈ 80 km, so 200 miles ≈ \\(4 \\times 80 = 320\\) km.</p>',
      async on(a) { a.tryMode(false); a.read(0, 50); a.big('200 = 4 \\times 50 \\Rightarrow 4 \\times 80 = 320 \\text{ km}'); },
    },
    {
      title: 'Try it: read the graph',
      text: '<p>Choose a graph and move the slider. Read the value across, then check with the label.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'conversion',
  gens: [
    () => { const m = FD.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]); return { type: 'num', q: `5 miles = 8 km. Use this to change ${m} miles into kilometres.`, a: (m / 5) * 8, why: `${m} miles is \\(${m / 5} \\times 5\\) miles, so \\(${m / 5} \\times 8 = ${(m / 5) * 8}\\) km.` }; },
    () => { const r = FD.pick([1.2, 1.25, 1.1, 1.5]), p = FD.pick([20, 40, 60, 80, 120]); return { type: 'num', q: `A conversion graph shows that £${p} = €${FD.round(p * r, 2)}. How many euros would you get for £${p * 3}?`, a: FD.round(p * r * 3, 2), tol: 0.01, why: `£${p * 3} is 3 times £${p}: \\(3 \\times ${FD.round(p * r, 2)} = ${FD.round(p * r * 3, 2)}\\) euros.` }; },
  ],
});

FD.check({
  section: 'conversion',
  items: [
    { type: 'num', q: '1 inch = 2.5 cm. Change 12 inches into centimetres.', a: 30, why: '\\(12 \\times 2.5\\).' },
    { type: 'num', q: '8 km = 5 miles. Change 64 km into miles.', a: 40, why: '\\(64 \\div 8 = 8\\), \\(8 \\times 5\\).' },
    { type: 'mcq', q: 'Why does a conversion graph between miles and kilometres pass through \\((0, 0)\\)?', opts: ['0 miles is 0 km', 'All graphs pass through the origin', 'Because the line is steep', 'It does not have to'], why: 'No distance in one unit is no distance in the other.' },
    { type: 'tf', q: 'A conversion graph between two units is a straight line.', a: true, why: 'One unit is always a fixed multiple of the other.' },
  ],
});
