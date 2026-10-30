window.LESSON = {
  id: 'straight-lines',
  description: 'Interactive maths lesson on coordinates and straight-line graphs: plotting points in four quadrants, coordinates from geometry, midpoints, gradients, y = mx + c with sliders, and for Higher tier the gradient from two points and parallel and perpendicular lines. Animated graphs, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.3.',
  intro: '<b>Coordinates</b> give the position of a point on a grid. In this lesson you will plot points in all <b>four quadrants</b>, find <b>midpoints</b>, measure the <b>gradient</b> (steepness) of a line and use \\(y = mx + c\\) to draw and describe straight lines. Higher tier students also find gradients from two points and the equations of <b>parallel</b> and <b>perpendicular</b> lines.',
  hero: `<svg class="st-net sl-hero" viewBox="0 0 300 200" role="img" aria-label="A straight line turning around its y-intercept">
    <line x1="20" y1="100" x2="280" y2="100" class="sl-ax"/><line x1="150" y1="10" x2="150" y2="190" class="sl-ax"/>
    <line x1="40" y1="170" x2="260" y2="10" class="sl-l"><animateTransform attributeName="transform" type="rotate" values="-20 150 90;20 150 90;-20 150 90" dur="6s" repeatCount="indefinite"/></line>
    <circle cx="150" cy="90" r="7" class="sl-p"/>
    <text x="270" y="190" class="sl-t">y = mx + c</text>
  </svg>`,
  parts: {
    A: { name: 'Coordinates' },
    B: { name: 'Straight-line graphs' },
  },
  sections: [
    { id: 'coordinates', covers: ['F3.3B', 'F3.3C', 'F3.3D'], part: 'A', name: 'Coordinates in four quadrants', short: 'Coordinates', icon: 'graph', color: '--c1', line: 'Along the corridor, then up the stairs: (x, y).' },
    { id: 'midpoint', covers: ['F3.3E'], part: 'A', name: 'The midpoint of a line segment', short: 'Midpoint', icon: 'graph', color: '--c3', line: 'Add the x’s and halve, add the y’s and halve.' },
    { id: 'gradient', covers: ['F3.3G'], part: 'B', name: 'Gradient', short: 'Gradient', icon: 'graph', color: '--c6', line: 'Gradient = change in y ÷ change in x.' },
    { id: 'ymxc', covers: ['F3.3H'], part: 'B', name: 'y = mx + c', short: 'y = mx + c', icon: 'graph', color: '--c8', line: 'm is the gradient, c is where the line crosses the y-axis.' },
    { id: 'two-points', covers: ['H3.3F'], part: 'B', tier: 'H', name: 'The line through two points', short: 'Two points', icon: 'graph', color: '--c5', line: 'Gradient from two points, then substitute to find c.' },
    { id: 'parallel-perp', covers: ['H3.3G'], part: 'B', tier: 'H', name: 'Parallel and perpendicular lines', short: 'Parallel & perpendicular', icon: 'graph', color: '--c2', line: 'Parallel: same m. Perpendicular: m₁ × m₂ = −1.' },
  ],
  scenes: ['coordinates', 'midpoint', 'testA', 'gradient', 'ymxc', 'two-points', 'parallel-perp', 'testB'],
};
