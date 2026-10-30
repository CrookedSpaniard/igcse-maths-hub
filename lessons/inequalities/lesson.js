window.LESSON = {
  id: 'inequalities',
  description: 'Interactive maths lesson on inequalities: the symbols <, >, ≤ and ≥, open and closed circles on a number line, solving linear inequalities, integer solutions, and regions on a graph; for Higher tier quadratic inequalities and harder regions. Animated number lines and shaded graphs with sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.8.',
  intro: 'An <b>inequality</b> says that one thing is bigger or smaller than another, like \\(x > 3\\). It usually has many solutions. In this lesson you will show inequalities on a <b>number line</b>, <b>solve</b> them like equations (with one important difference) and shade <b>regions</b> on a graph. Higher tier students also solve <b>quadratic inequalities</b>.',
  hero: `<svg class="st-net in-hero" viewBox="0 0 300 200" role="img" aria-label="A number line with x greater than or equal to -1 and less than 3">
    <line x1="20" y1="110" x2="280" y2="110" class="in-ax"/>
    ${[-3, -2, -1, 0, 1, 2, 3, 4, 5].map((v, i) => `<line x1="${30 + i * 30}" y1="104" x2="${30 + i * 30}" y2="116" class="in-ax"/><text x="${30 + i * 30}" y="138" class="in-t">${String(v).replace('-', '−')}</text>`).join('')}
    <line x1="90" y1="80" x2="180" y2="80" class="in-bar"><animate attributeName="x2" values="90;180;180" dur="3s" repeatCount="indefinite"/></line>
    <circle cx="90" cy="80" r="8" class="in-closed"/><circle cx="180" cy="80" r="8" class="in-open"/>
    <text x="150" y="40" class="in-lbl">−1 ≤ x &lt; 3</text>
  </svg>`,
  parts: {
    A: { name: 'Inequalities in one variable' },
    B: { name: 'Graphs and harder inequalities' },
  },
  sections: [
    { id: 'number-line', covers: ['F2.8A', 'F2.8B'], part: 'A', name: 'Symbols and number lines', short: 'Number lines', icon: 'algebra', color: '--c1', line: 'Open circle for < and >, closed circle for ≤ and ≥.' },
    { id: 'solve-ineq', covers: ['F2.8C'], part: 'A', name: 'Solving linear inequalities', short: 'Solving', icon: 'algebra', color: '--c3', line: 'Like an equation, but multiplying or dividing by a negative flips the sign.' },
    { id: 'regions', covers: ['F2.8D', 'F2.8E'], part: 'B', name: 'Regions on a graph', short: 'Regions', icon: 'graph', color: '--c6', line: 'Draw the boundary line, then shade the side that fits.' },
    { id: 'quad-ineq', covers: ['H2.8A'], part: 'B', tier: 'H', name: 'Quadratic inequalities', short: 'Quadratic', icon: 'graph', color: '--c8', line: 'Find the roots, sketch the curve, read off where it is above or below.' },
    { id: 'regions-h', covers: ['H2.8B'], part: 'B', tier: 'H', name: 'Harder regions', short: 'Harder regions', icon: 'graph', color: '--c5', line: 'Several slanted boundaries; find the region and the points inside it.' },
  ],
  scenes: ['number-line', 'solve-ineq', 'testA', 'regions', 'quad-ineq', 'regions-h', 'testB'],
};
