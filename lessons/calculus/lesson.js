window.LESSON = {
  id: 'calculus',
  description: 'Interactive Higher tier maths lesson on differentiation: the gradient of a curve and a tangent sliding along it, variable rates of change, differentiating integer powers of x, gradients at a point, stationary points and whether they are maxima or minima, and kinematics with displacement, velocity and acceleration. Animated tangents, sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.4.',
  intro: 'A straight line has the same gradient everywhere, but a <b>curve</b> does not: its steepness changes as you move along it. <b>Differentiation</b> gives a formula for the gradient at any point. In this lesson you will watch a <b>tangent</b> slide along a curve, differentiate powers of \\(x\\), find <b>turning points</b> and use calculus for <b>motion</b>.',
  hero: `<svg class="st-net ca-hero" viewBox="0 0 300 200" role="img" aria-label="A tangent line sliding along a curve">
    <path d="M20 170 C80 -10 140 -10 170 90 S250 210 285 40" class="ca-c"/>
    <g><animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path="M20 170 C80 -10 140 -10 170 90 S250 210 285 40"/>
      <line x1="-45" y1="0" x2="45" y2="0" class="ca-t"/><circle r="6" class="ca-p"/></g>
  </svg>`,
  parts: {
    A: { name: 'Gradients and differentiation' },
    B: { name: 'Turning points and kinematics' },
  },
  sections: [
    { id: 'gradient-curve', covers: ['H3.3D', 'H3.4A'], part: 'A', name: 'The gradient of a curve', short: 'Gradient of a curve', icon: 'graph', color: '--c1', line: 'The gradient of the tangent at a point; it changes along the curve.' },
    { id: 'differentiate', covers: ['H3.4B', 'H3.4C'], part: 'A', name: 'Differentiating powers of x', short: 'Differentiate', icon: 'calc', color: '--c3', line: 'Multiply by the power, then reduce the power by 1.' },
    { id: 'stationary', covers: ['H3.4C', 'H3.4D'], part: 'B', name: 'Stationary points', short: 'Turning points', icon: 'graph', color: '--c6', line: 'Solve dy/dx = 0; decide maximum or minimum from the shape.' },
    { id: 'kinematics', covers: ['H3.4E'], part: 'B', name: 'Kinematics and rates of change', short: 'Kinematics', icon: 'target', color: '--c8', line: 'v = ds/dt and a = dv/dt.' },
  ],
  scenes: ['gradient-curve', 'differentiate', 'testA', 'stationary', 'kinematics', 'testB'],
};
