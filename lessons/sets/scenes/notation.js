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

// Venn diagram layouts. A region is a code like '10' = in A, not in B ('110' for three sets).
FD.VGEO = {
  2: { h: 270, c: [[225, 140, 100], [375, 140, 100]], lab: [[145, 32], [455, 32]], at: { 10: [168, 140], 11: [300, 140], '01': [432, 140] }, out: [[45, 232], [75, 232], [105, 232], [45, 257], [75, 257], [105, 257], [495, 232], [525, 232], [555, 232], [495, 257], [525, 257], [555, 257]] },
  3: { h: 290, c: [[245, 112, 82], [355, 112, 82], [300, 198, 82]], lab: [[150, 32], [450, 32], [415, 274]], at: { 100: [200, 92], '010': [400, 92], '001': [300, 240], 110: [300, 70], 101: [250, 172], '011': [350, 172], 111: [300, 140] }, out: [[40, 210], [70, 210], [40, 240], [70, 240], [40, 268], [70, 268], [530, 210], [560, 210], [530, 240], [560, 240]] },
  nested: { h: 270, c: [[300, 140, 118], [335, 152, 58]], lab: [[200, 35], [335, 112]], at: { 10: [228, 140], 11: [335, 162] }, out: [[45, 232], [75, 232], [105, 232], [45, 257], [75, 257], [105, 257], [495, 232], [525, 232], [555, 232], [495, 257], [525, 257], [555, 257]] },
};
FD.venn = (host) => {
  const uid = 'vd' + Math.random().toString(36).slice(2, 8);
  host.innerHTML = '<svg class="vd" viewBox="0 0 600 270" role="img"></svg>';
  const svg = host.querySelector('svg');
  // o = { k: 2 | 3 | 'nested', labels, shade: [codes], items: { code: [labels] }, counts: { code: n } }
  return (o = {}) => {
    const G = FD.VGEO[o.k || 2], n = G.c.length, labels = o.labels || ['A', 'B', 'C'], shade = new Set(o.shade || []);
    const codes = []; for (let m = 0; m < 2 ** n; m++) codes.push(m.toString(2).padStart(n, '0'));
    svg.setAttribute('viewBox', `0 0 600 ${G.h}`);
    const circ = (i, cls = '', extra = '') => `<circle ${cls ? `class="${cls}"` : ''} cx="${G.c[i][0]}" cy="${G.c[i][1]}" r="${G.c[i][2]}" ${extra}/>`;
    let defs = G.c.map((_, i) => `<clipPath id="${uid}c${i}">${circ(i)}</clipPath>`).join('');
    defs += codes.map((c) => `<mask id="${uid}m${c}"><rect x="0" y="0" width="600" height="${G.h}" fill="#fff"/>${[...c].map((b, i) => (b === '0' ? circ(i, '', 'fill="#000"') : '')).join('')}</mask>`).join('');
    const region = (c) => { let r = `<rect class="vd-r ${shade.has(c) ? 'on' : ''}" x="12" y="12" width="576" height="${G.h - 24}" rx="10" mask="url(#${uid}m${c})"/>`; [...c].forEach((b, i) => { if (b === '1') r = `<g clip-path="url(#${uid}c${i})">${r}</g>`; }); return r; };
    const place = (list, [x, y], big) => { const k = list.length, cols = k <= 2 ? k : k <= 6 ? 2 : 3, rows = Math.ceil(k / cols); return list.map((t, i) => { const c = i % cols, r = Math.floor(i / cols); return `<text class="vd-e ${big ? 'n' : ''}" x="${x + (c - (cols - 1) / 2) * 30}" y="${y + 6 + (r - (rows - 1) / 2) * 25}">${t}</text>`; }).join(''); };
    let txt = '';
    Object.entries(o.items || {}).forEach(([c, list]) => { txt += c === '0'.repeat(n) ? list.map((t, i) => (G.out[i] ? `<text class="vd-e" x="${G.out[i][0]}" y="${G.out[i][1]}">${t}</text>` : '')).join('') : place(list, G.at[c]); });
    Object.entries(o.counts || {}).forEach(([c, v]) => { txt += c === '0'.repeat(n) ? `<text class="vd-e n" x="${G.out[0][0] + 10}" y="${G.out[3][1]}">${v}</text>` : place([v], G.at[c], true); });
    svg.innerHTML = `<defs>${defs}</defs><rect class="vd-u" x="12" y="12" width="576" height="${G.h - 24}" rx="10"/>${codes.map(region).join('')}${G.c.map((_, i) => circ(i, `vd-c c${i}`)).join('')}${G.lab.map(([x, y], i) => `<text class="vd-l" x="${x}" y="${y + 6}">${labels[i]}</text>`).join('')}<text class="vd-l" x="32" y="38">ℰ</text>${txt}`;
    svg.setAttribute('aria-label', `Venn diagram of the sets ${labels.slice(0, n).join(', ')}${shade.size ? ' with some regions shaded' : ''}`);
  };
};
// Regions (two sets) for each expression.
FD.VEXPR = { 'A ∩ B': ['11'], 'A ∪ B': ['10', '11', '01'], "A′": ['01', '00'], "B′": ['10', '00'], "(A ∪ B)′": ['00'], "A ∩ B′": ['10'], "A′ ∩ B": ['01'], "(A ∩ B)′": ['10', '01', '00'] };
FD.VTEX = (e) => e.replace(/∩/g, '\\cap').replace(/∪/g, '\\cup').replace(/′/g, "'");
// Splits ℰ = {1…N} into Venn regions for A and B (arrays).
FD.vsplit = (N, A, B) => { const r = { 10: [], 11: [], '01': [], '00': [] }; for (let x = 1; x <= N; x++) r[`${+A.includes(x)}${+B.includes(x)}`].push(x); return r; };
FD.setTex = (l) => (l.length ? `\\{${l.join(', ')}\\}` : '\\emptyset');

FD.add({
  id: 'notation',
  title: 'Sets and set notation',
  tab: 'Notation',
  icon: 'shapes',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Set', 'A collection of objects, called <b>elements</b>, written in curly brackets: \\(A = \\{2, 4, 6, 8\\}\\).'],
    ['\\(\\in\\) and \\(\\notin\\)', '\\(4 \\in A\\): 4 is an element of A. \\(5 \\notin A\\): 5 is not.'],
    ['Universal set ℰ', 'Everything being considered. In a Venn diagram it is the rectangle.'],
    ['Empty set \\(\\emptyset\\)', 'A set with no elements: \\(\\{\\,\\}\\).'],
    ["Complement \\(A'\\)", 'Every element of ℰ that is <b>not</b> in A.'],
  ],
  mount(el) {
    const a = FD.board(el, 'no-s', '<div id="vd"></div>', `
      <label class="ctrl">Number <input type="range" id="rx" min="1" max="12" value="6"><output id="ox">6</output></label>`, () => sync());
    a.vd = FD.venn(a.$('#vd'));
    const A = [2, 4, 6, 8, 10, 12], B = [3, 6, 9, 12], R = FD.vsplit(12, A, B);
    a.R = R;
    const sync = () => {
      const x = +a.$('#rx').value; a.$('#ox').textContent = x;
      const inA = A.includes(x), inB = B.includes(x);
      a.vd({ labels: ['A', 'B'], items: R, shade: [`${+inA}${+inB}`] });
      a.big(`${x} ${inA ? '\\in' : '\\notin'} A \\qquad ${x} ${inB ? '\\in' : '\\notin'} B \\qquad ${x} ${inA ? '\\notin' : '\\in'} A'`);
      a.msg('ℰ = {1, 2, …, 12}, A = even numbers, B = multiples of 3. The shaded region shows where the number lives.');
    };
    a.$('#rx').addEventListener('input', sync);
    a.vd({ labels: ['A', 'B'] });
    return a;
  },
  steps: [
    {
      title: 'What is a set?',
      text: '<p>A <b>set</b> is a collection of things called <b>elements</b>. Write the elements in curly brackets, separated by commas.</p><p>A = {even numbers from 1 to 10} = {2, 4, 6, 8, 10}.</p>',
      tip: 'The order does not matter, and each element is written once.',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: { 10: [2, 4, 8, 10], 11: [6] } });
        await a.lines([['A = \\{\\text{even numbers from 1 to 10}\\}', 'described in words'], ['A = \\{2, 4, 6, 8, 10\\}', 'listed']], ctx, 1400);
      },
    },
    {
      title: 'Is it an element?',
      text: '<p>\\(\\in\\) means “is an element of”. \\(\\notin\\) means “is not an element of”.</p><p>\\(6 \\in A\\) but \\(7 \\notin A\\).</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: { 10: [2, 4, 8, 10], 11: [6] }, shade: ['10', '11'] });
        await a.lines([['6 \\in A', '6 is in the set'], ['7 \\notin A', '7 is not']], ctx, 1300);
      },
    },
    {
      title: 'The universal set and the empty set',
      text: '<p>The <b>universal set</b> ℰ contains everything we are talking about. Here ℰ = {1, 2, …, 12}: the whole rectangle.</p><p>A set with nothing in it is the <b>empty set</b> ∅. For example, {even prime numbers bigger than 2} = ∅.</p>',
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: a.R });
        await a.lines([['\\mathcal{E} = \\{1, 2, 3, \\dots, 12\\}', 'every number in the rectangle'], ['\\{\\text{even primes} > 2\\} = \\emptyset', 'no elements at all']], ctx, 1500);
      },
    },
    {
      title: 'The complement',
      text: "<p>\\(A'\\) (A dash) is everything in ℰ that is <b>not</b> in A. On the diagram it is everything outside circle A.</p>",
      async on(a, ctx) {
        a.reset(); a.vd({ labels: ['A', 'B'], items: a.R });
        if (!(await ctx.sleep(900))) return;
        a.vd({ labels: ['A', 'B'], items: a.R, shade: FD.VEXPR["A′"] });
        a.big("A' = \\{1, 3, 5, 7, 9, 11\\}");
      },
    },
    {
      title: 'Try it: where does it go?',
      text: '<p>A = even numbers and B = multiples of 3, with ℰ = {1, …, 12}. Choose a number: the region it belongs to is shaded.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'notation',
  gens: [
    () => { const d = FD.pick([[12, 'factors of 12', [1, 2, 3, 4, 6, 12]], [18, 'factors of 18', [1, 2, 3, 6, 9, 18]], [20, 'prime numbers less than 20', [2, 3, 5, 7, 11, 13, 17, 19]], [30, 'square numbers less than 30', [1, 4, 9, 16, 25]], [50, 'multiples of 7 less than 50', [7, 14, 21, 28, 35, 42, 49]]]); return { type: 'num', q: `A = {${d[1]}}. How many elements are in A?`, a: d[2].length, why: `A = \\(${FD.setTex(d[2])}\\): ${d[2].length} elements.` }; },
    () => { const N = FD.rnd(10, 16), k = FD.pick([2, 3, 4, 5]), A = []; for (let x = k; x <= N; x += k) A.push(x); return { type: 'num', q: `ℰ = {1, 2, 3, …, ${N}} and A = {multiples of ${k}}. How many elements are in \\(A'\\)?`, a: N - A.length, why: `A = \\(${FD.setTex(A)}\\) has ${A.length} elements, so \\(A'\\) has \\(${N} - ${A.length} = ${N - A.length}\\).` }; },
    () => { const x = FD.rnd(1, 30), sq = Number.isInteger(Math.sqrt(x)), useIn = FD.rnd(0, 1); return { type: 'tf', q: `A = {square numbers}. \\(${x} ${useIn ? '\\in' : '\\notin'} A\\)`, a: useIn ? sq : !sq, why: `${x} ${sq ? `is a square number (\\(${Math.sqrt(x)}^2\\))` : 'is not a square number'}, so \\(${x} ${sq ? '\\in' : '\\notin'} A\\).` }; },
  ],
});

FD.check({
  section: 'notation',
  items: [
    { type: 'mcq', q: 'B = {prime numbers}. Which statement is true?', opts: ['\\(7 \\in B\\)', '\\(9 \\in B\\)', '\\(2 \\notin B\\)', '\\(11 \\notin B\\)'], why: '7 is prime. 9 is not, and 2 and 11 are prime.' },
    { type: 'num', q: 'ℰ = {1, 2, …, 10} and A = {1, 3, 5, 7, 9}. How many elements are in \\(A\'\\)?', a: 5, why: "\\(A' = \\{2, 4, 6, 8, 10\\}\\)." },
    { type: 'tf', q: '{months with 32 days} = ∅', a: true, why: 'No month has 32 days, so the set is empty.' },
    { type: 'mcq', q: 'What does ℰ stand for?', opts: ['The universal set', 'The empty set', 'An element', 'The complement'], why: 'ℰ contains everything being considered.' },
  ],
});
