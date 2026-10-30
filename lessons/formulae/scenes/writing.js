// Words into algebra: phrases become expressions; a situation becomes a formula.
const WR_BANK = [
  ['5 more than \\(n\\)', 'n + 5'], ['\\(n\\) less than 5', '5 - n'], ['3 lots of \\(x\\), take away 4', '3x - 4'],
  ['\\(y\\) shared equally between 6', 'y/6'], ['the square of \\(t\\), plus 1', 't^2 + 1'], ['double the sum of \\(a\\) and \\(b\\)', '2(a + b)'],
  ['\\(p\\) times \\(q\\), divided by 2', 'pq/2'], ['7 less than twice \\(m\\)', '2m - 7'],
];
FD.add({
  id: 'writing',
  title: 'Writing formulae and expressions',
  tab: 'Writing formulae',
  icon: 'algebra',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Variable', 'A letter that can stand for different numbers.'],
    ['Formula', 'A rule with a subject and an = sign, like \\(C = 4n + 30\\).'],
  ],
  mount(el) {
    const a = FD.mk(el, {
      cls: 'wr-s',
      vis: '<div class="wr-taxi" data-k="taxi"></div>',
      tryHtml: `<label class="ctrl">Cost per pizza (£) \\(p\\) <input type="range" data-k="p" min="5" max="15" value="8"><output data-k="op">8</output></label>
        <label class="ctrl">Number of pizzas \\(n\\) <input type="range" data-k="n" min="0" max="10" value="3"><output data-k="on">3</output></label>
        <label class="ctrl">Delivery charge (£) \\(d\\) <input type="range" data-k="d" min="0" max="6" value="3"><output data-k="od">3</output></label>`,
    });
    const taxi = a.$('[data-k="taxi"]');
    a.boxes = (n, extra) => { taxi.innerHTML = `${Array.from({ length: n }, () => '<span class="wr-b">🍕</span>').join('')}${extra ? `<span class="wr-d">${extra}</span>` : ''}`; };
    const sync = () => {
      const [p, n, d] = ['p', 'n', 'd'].map((k) => +a.$(`[data-k="${k}"]`).value);
      ['p', 'n', 'd'].forEach((k, i) => { a.$(`[data-k="o${k}"]`).textContent = [p, n, d][i]; });
      a.boxes(n, d ? `+ £${d} delivery` : '');
      a.big(`C = pn + d = ${p} \\times ${n} + ${d} = ${p * n + d}`);
      a.msg(`The order costs £${p * n + d}.`);
    };
    ['p', 'n', 'd'].forEach((k) => a.$(`[data-k="${k}"]`).addEventListener('input', sync));
    a.onTry = sync;
    return a;
  },
  steps: [
    {
      title: 'Words into algebra',
      text: '<p>Read carefully. “5 less than \\(n\\)” is \\(n - 5\\), but “\\(n\\) less than 5” is \\(5 - n\\).</p>',
      on: FD.walk([['5 \\text{ more than } n \\;\\to\\; n + 5', ''], ['n \\text{ less than } 5 \\;\\to\\; 5 - n', 'order matters'], ['\\text{double the sum of } a, b \\;\\to\\; 2(a + b)', 'add first: bracket'], ['y \\text{ shared between 6} \\;\\to\\; \\frac{y}{6}', '']], (a) => { a.boxes(0); a.big(''); }, 1300),
    },
    {
      title: 'Building a formula',
      text: '<p>Pizzas cost £8 each and delivery is £3. The cost of \\(n\\) pizzas is \\(8\\) lots of \\(n\\), plus 3.</p><p>\\(C = 8n + 3\\)</p>',
      async on(a, ctx) { a.tryMode(false); a.big(''); for (let n = 1; n <= 4; n++) { a.boxes(n, '+ £3 delivery'); a.msg(`${n} pizza${n > 1 ? 's' : ''}: \\(8 \\times ${n} + 3 = ${8 * n + 3}\\)`); if (!(await ctx.sleep(1000))) return; } a.big('C = 8n + 3'); },
    },
    {
      title: 'Using letters for every quantity',
      text: '<p>If the price is \\(p\\) and delivery is \\(d\\), the formula is \\(C = pn + d\\). It works for any shop.</p>',
      tip: 'Say what each letter stands for, with its units.',
      async on(a) { a.tryMode(false); a.boxes(3, '+ £d delivery'); a.big('C = pn + d'); },
    },
    {
      title: 'Try it: the pizza formula',
      text: '<p>Change the price, the number of pizzas and the delivery charge. The formula \\(C = pn + d\\) gives the total cost.</p>',
      on(a) { a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'writing',
  gens: [
    () => { const w = FD.pick(WR_BANK), others = FD.shuffle(WR_BANK.filter((x) => x !== w)).slice(0, 3); return { type: 'mcq', q: `Write as an expression: ${w[0]}`, opts: [`\\(${w[1]}\\)`, ...others.map((o) => `\\(${o[1]}\\)`)], why: `${w[0]} is \\(${w[1]}\\).` }; },
    () => { const p = FD.rnd(2, 9), f = FD.rnd(1, 9), n = FD.rnd(3, 12); return { type: 'num', q: `A gym charges a joining fee of £${f} and then £${p} per visit. Write a formula for the cost \\(C\\) of \\(v\\) visits, then use it to find the cost of ${n} visits.`, a: p * n + f, why: `\\(C = ${p}v + ${f}\\). For ${n} visits: \\(${p} \\times ${n} + ${f} = ${p * n + f}\\).` }; },
    () => { const s = FD.rnd(3, 9); return { type: 'alg', q: `A square has side \\(x + ${s}\\) cm. Write an expression for its perimeter, as simply as possible.`, a: `4x+${4 * s}`, form: 'expanded', show: `\\(4x + ${4 * s}\\)`, hint: 'Type it like 4x + 12.', why: `Four sides: \\(4(x + ${s}) = 4x + ${4 * s}\\).` }; },
  ],
});

FD.check({
  section: 'writing',
  items: [
    { type: 'mcq', q: 'Write an expression for “4 less than three times \\(k\\)”.', opts: ['\\(3k - 4\\)', '\\(4 - 3k\\)', '\\(3(k - 4)\\)', '\\(3 - 4k\\)'], why: 'Three times \\(k\\) is \\(3k\\); 4 less is \\(3k - 4\\).' },
    { type: 'alg', q: 'Pens cost \\(p\\) pence each. Write an expression for the cost of 6 pens and a 50p ruler.', a: '6p+50', show: '\\(6p + 50\\)', hint: 'Type it like 6p + 50.', why: '6 lots of \\(p\\), plus 50.' },
    { type: 'num', q: 'A taxi charges £3 plus £2 per mile: \\(C = 2m + 3\\). How much is a 12-mile journey?', a: 27, why: '\\(2 \\times 12 + 3 = 27\\).' },
    { type: 'tf', q: '“The sum of \\(x\\) and \\(y\\), squared” is \\(x + y^2\\).', a: false, why: 'Sum first, then square: \\((x + y)^2\\).' },
  ],
});
