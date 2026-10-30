// Rotational symmetry: a tracing of the shape turns about its centre; count how often it fits.
FD.add({
  id: 'rotational',
  title: 'Rotational symmetry',
  tab: 'Rotational',
  icon: 'shapes',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Rotational symmetry', 'The shape fits onto itself more than once during a full turn.'],
    ['Order of rotational symmetry', 'The number of times the shape fits onto itself in one full turn (\\(360^\\circ\\)). A shape that only fits once has order 1: no rotational symmetry.'],
    ['Centre of rotation', 'The fixed point the shape turns about.'],
  ],
  mount(el) {
    const G = FD.G, Y = FD.SYM;
    const a = FD.stage(el, {
      vb: '0 0 420 300', label: 'A shape and a turning tracing of it',
      ctrls: `<div class="row"><label>Shape <select id="sh">${Object.entries(Y.S).map(([k, s]) => `<option value="${k}" ${k === 'parallelogram' ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label></div>
        <label class="ctrl">Turn <input type="range" id="phi" min="0" max="360" step="1" value="0"><output id="ophi">0°</output></label>`,
    });
    // Draw the shape, its tracing turned by phi, a marker corner so you can count turns, and the centre.
    a.turn = (k, phi, fits = 0) => {
      const P = Y.S[k].pts, R = P.map((p) => Y.rotate(p, phi));
      a.draw(G.poly(P, 'g-fill') + `<polygon class="g-ghost" points="${R.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>` + G.dot(R[0], 'g-dot', 7) + G.dot(Y.C, 'g-dot k', 4) + (fits ? G.t([380, 30], '×' + fits, 'l') : ''));
      return Y.same(R, P);
    };
    a.spin = async (k, ctx) => {
      let fits = 0;
      for (let phi = 0; phi <= 360; phi += 3) {
        const ok = a.turn(k, phi, fits);
        if (ok && phi > 0) { fits++; a.turn(k, phi, fits); a.msg(`Fits after \\(${phi}^\\circ\\)`); if (!(await ctx.sleep(650))) return false; }
        if (!(await ctx.sleep(18))) return false;
      }
      return fits;
    };
    a.onSync(() => {
      const k = a.q('#sh').value, phi = a.val('phi'), ok = a.turn(k, phi), o = Y.S[k].order;
      a.out('phi', phi + '°');
      a.msg(phi > 0 && phi < 360 && ok ? `✓ It fits after \\(${phi}^\\circ\\)! Order ${o}: it fits every \\(360 \\div ${o} = ${360 / o}^\\circ\\).` : phi === 360 || phi === 0 ? 'Turn the tracing with the slider. Watch the dot.' : 'Not yet: the tracing does not fit on the shape.', ok && phi > 0 && phi < 360 ? 'good' : '');
    });
    a.turn('parallelogram', 0);
    return a;
  },
  steps: [
    {
      title: 'Turn a tracing',
      text: '<p>Trace the shape, put a pin in its centre and <b>turn</b> the tracing.</p><p>Count how many times it <b>fits exactly</b> onto the shape in one full turn. That number is the <b>order of rotational symmetry</b>.</p>',
      async on(a, ctx) { a.off(); const f = await a.spin('rectangle', ctx); if (f) a.msg(`The rectangle fits <b>${f}</b> times: order 2.`); },
    },
    {
      title: 'Square and parallelogram',
      text: '<p>A square fits <b>4</b> times: order 4. A parallelogram has <b>no</b> lines of symmetry, but it fits twice: <b>rotational symmetry of order 2</b>.</p>',
      async on(a, ctx) {
        a.off(); let f = await a.spin('square', ctx); if (!f) return; a.msg(`Square: order <b>${f}</b>.`);
        if (!(await ctx.sleep(900))) return; f = await a.spin('parallelogram', ctx); if (f) a.msg(`Parallelogram: order <b>${f}</b>.`);
      },
    },
    {
      title: 'Order 1',
      text: '<p>A kite only fits back in its starting place after a full turn. It has <b>order 1</b>, which means <b>no rotational symmetry</b>.</p>',
      tip: 'Every shape fits after 360°, so the order is never 0.',
      async on(a, ctx) { a.off(); const f = await a.spin('kite', ctx); if (f) a.msg('Kite: order <b>1</b> (no rotational symmetry).'); },
    },
    {
      title: 'Regular polygons',
      text: '<p>A regular polygon with \\(n\\) sides has rotational symmetry of <b>order \\(n\\)</b>. It fits every \\(360^\\circ \\div n\\).</p><p>Regular pentagon: order 5, every \\(72^\\circ\\).</p>',
      async on(a, ctx) { a.off(); const f = await a.spin('pentagon', ctx); if (f) a.msg('Regular pentagon: order <b>5</b>.'); },
    },
    {
      title: 'Try it: turn the tracing',
      text: '<p>Choose a shape and turn the tracing with the slider. Stop each time it fits.</p><p>What is the smallest angle that works?</p>',
      on(a) { a.q('#phi').value = 0; a.tryMode(); },
    },
  ],
});

FD.practice({
  section: 'rotational',
  gens: [
    () => { const [n, , o] = FD.pick(FD.SYM.facts); return { type: 'num', q: `What is the order of rotational symmetry of a <b>${n}</b>?`, a: o, why: `A ${n} fits onto itself ${o} time${o === 1 ? '' : 's'} in a full turn${o === 1 ? ' (no rotational symmetry)' : ''}.` }; },
    () => { const n = FD.pick([5, 6, 8, 9, 10, 12]); return { type: 'num', q: `A regular polygon with ${n} sides is turned about its centre. What is the smallest angle that makes it fit onto itself again?`, a: 360 / n, unit: '°', why: `Order ${n}: \\(360 \\div ${n} = ${360 / n}^\\circ\\).` }; },
    () => { const [n, l, o] = FD.pick(FD.SYM.facts.filter((f) => f[1] !== f[2])); return { type: 'mcq', q: `A <b>${n}</b> has…`, opts: [`${l} line${l === 1 ? '' : 's'} of symmetry and rotational symmetry of order ${o}`, `${o + 1} lines of symmetry and order ${o}`, `${l} lines of symmetry and order ${o + 2}`, `${o} line${o === 1 ? '' : 's'} of symmetry and order ${l + 1}`], why: `${n[0].toUpperCase() + n.slice(1)}: ${l} line${l === 1 ? '' : 's'}, order ${o}.` }; },
  ],
});

FD.check({
  section: 'rotational',
  items: [
    { type: 'num', q: 'What is the order of rotational symmetry of a rhombus?', a: 2, why: 'It fits after 180° and 360°.' },
    { type: 'num', q: 'What is the order of rotational symmetry of an equilateral triangle?', a: 3, why: 'It fits every 120°.' },
    { type: 'tf', q: 'A shape with rotational symmetry of order 1 has no rotational symmetry.', a: true, why: 'Order 1 means it only fits after a full turn.' },
    { type: 'mcq', q: 'Which letter has rotational symmetry of order 2 but no lines of symmetry?', opts: ['S', 'H', 'T', 'O'], why: 'S fits after half a turn and has no mirror lines. H has order 2 and two lines.' },
  ],
});
