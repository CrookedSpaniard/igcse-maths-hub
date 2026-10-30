window.LESSON = {
  id: 'quadratics',
  description: 'Interactive maths lesson on quadratic equations: solving by factorising, and for Higher tier factorising ax² + bx + c, completing the square, the quadratic formula, forming quadratics from a context and solving a linear and a quadratic equation together. Animated parabolas with sliders, an area model for completing the square, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.7.',
  intro: 'A <b>quadratic equation</b> has an \\(x^2\\) term, like \\(x^2 - 5x + 6 = 0\\). It usually has <b>two</b> solutions: the places where the parabola crosses the \\(x\\)-axis. In this lesson you will solve quadratics by <b>factorising</b>. Higher tier students also use <b>completing the square</b>, the <b>quadratic formula</b>, problems in context and a <b>line meeting a curve</b>.',
  hero: `<svg class="st-net qu-hero" viewBox="0 0 300 200" role="img" aria-label="A parabola crossing the x-axis at two points">
    <line x1="20" y1="120" x2="280" y2="120" class="qu-ax"/>
    <path d="M60 20 Q150 220 240 20" class="qu-c"><animate attributeName="d" values="M60 20 Q150 220 240 20;M80 20 Q150 200 220 20;M60 20 Q150 220 240 20" dur="5s" repeatCount="indefinite"/></path>
    <circle cx="96" cy="120" r="7" class="qu-r"/><circle cx="204" cy="120" r="7" class="qu-r"/>
  </svg>`,
  parts: {
    A: { name: 'Solving by factorising' },
    B: { name: 'Formula, completing the square and problems', tier: 'H' },
  },
  sections: [
    { id: 'solve-fact', covers: ['F2.7A'], part: 'A', name: 'Solving by factorising', short: 'Factorising', icon: 'algebra', color: '--c1', line: 'If two brackets multiply to 0, one of them is 0.' },
    { id: 'fact-harder', covers: ['H2.7A'], part: 'A', tier: 'H', name: 'Solving ax² + bx + c = 0 by factorising', short: 'ax² + bx + c', icon: 'algebra', color: '--c3', line: 'Rearrange to = 0, factorise fully, then solve.' },
    { id: 'complete-square', covers: ['H2.2D', 'H2.7B'], part: 'B', name: 'Completing the square', short: 'Complete the square', icon: 'algebra', color: '--c6', line: 'x² + bx + c = (x + b/2)² − (b/2)² + c.' },
    { id: 'formula', covers: ['H2.7B'], part: 'B', name: 'The quadratic formula', short: 'Formula', icon: 'calc', color: '--c8', line: 'x = (−b ± √(b² − 4ac)) / 2a for any quadratic.' },
    { id: 'quad-context', covers: ['H2.7C'], part: 'B', name: 'Quadratics in context', short: 'In context', icon: 'target', color: '--c5', line: 'Form a quadratic from a problem, solve, reject impossible answers.' },
    { id: 'lin-quad', covers: ['H2.7D'], part: 'B', name: 'A line and a curve', short: 'Line and curve', icon: 'graph', color: '--c2', line: 'Substitute the linear equation into the quadratic one.' },
  ],
  scenes: ['solve-fact', 'fact-harder', 'testA', 'complete-square', 'formula', 'quad-context', 'lin-quad', 'testB'],
};
