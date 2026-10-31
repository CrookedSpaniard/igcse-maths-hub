window.LESSON = {
  id: 'graphical-solutions',
  description: 'Interactive Higher tier maths lesson on solving equations with graphs and transforming graphs: intersections of a line and a curve, choosing the line to draw to solve a new equation, and the transformations y = f(x) + a, y = f(x + a), y = af(x) and y = f(ax) for linear, quadratic, sine and cosine graphs. Animated graphs with sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.3.',
  intro: 'Graphs can solve equations that are hard to solve with algebra: the solutions are where two graphs <b>cross</b>. In this lesson you will read solutions from intersections, choose the right <b>line to draw</b>, and learn how changing the equation <b>moves and stretches</b> a graph.',
  hero: `<svg class="st-net gs-hero" viewBox="0 0 300 200" role="img" aria-label="A parabola sliding up and down while a line crosses it">
    <line x1="10" y1="150" x2="290" y2="150" class="gs-ax"/>
    <path d="M60 20 Q150 250 240 20" class="gs-c"><animateTransform attributeName="transform" type="translate" values="0 0;0 -40;0 0" dur="4s" repeatCount="indefinite"/></path>
    <line x1="20" y1="140" x2="280" y2="60" class="gs-l"/>
  </svg>`,
  parts: {
    A: { name: 'Solving equations with graphs' },
    B: { name: 'Transformations of graphs' },
  },
  sections: [
    { id: 'intersections', covers: ['H3.3E'], part: 'A', name: 'Intersections of a line and a curve', short: 'Intersections', icon: 'graph', color: '--c1', line: 'Where y₁ = y₂ is where y₂ − y₁ = 0.' },
    { id: 'which-line', covers: ['H3.3E'], part: 'A', name: 'Choosing the line to draw', short: 'Which line?', icon: 'graph', color: '--c3', line: 'Rearrange the new equation so one side is the curve you have.' },
    { id: 'translations', covers: ['H3.3B', 'H3.3C'], part: 'B', name: 'Translations: f(x) + a and f(x + a)', short: 'Translations', icon: 'graph', color: '--c6', line: 'Outside: move up. Inside: move left (the opposite way).' },
    { id: 'stretches', covers: ['H3.3B', 'H3.3C'], part: 'B', name: 'Stretches and reflections: af(x) and f(ax)', short: 'Stretches', icon: 'graph', color: '--c8', line: 'Outside: stretch vertically. Inside: squash horizontally.' },
  ],
  scenes: ['intersections', 'which-line', 'testA', 'translations', 'stretches', 'testB'],
};
