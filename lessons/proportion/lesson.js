window.LESSON = {
  id: 'proportion',
  description: 'Interactive Higher tier maths lesson on direct and inverse proportion: setting up y = kx, y = kx², y = kx³ and y = k√x, inverse proportion y = k/x and y = k/x², finding the constant k, sketching proportion graphs and solving problems. Animated graphs with sliders, worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.5.',
  intro: 'Two quantities are <b>in proportion</b> when one is always a fixed multiple of the other, like the cost of petrol and the number of litres. In this lesson you will write proportion as a formula with a constant \\(k\\), meet <b>direct proportion</b> with \\(x\\), \\(x^2\\), \\(x^3\\) and \\(\\sqrt{x}\\), and <b>inverse proportion</b>, where one quantity goes up as the other goes down.',
  hero: `<svg class="st-net pr-hero" viewBox="0 0 300 200" role="img" aria-label="A straight line through the origin and a curve that falls as x increases">
    <line x1="30" y1="180" x2="290" y2="180" class="pr-ax"/><line x1="30" y1="180" x2="30" y2="14" class="pr-ax"/>
    <path d="M30 180 L260 30" class="pr-d"><animate attributeName="d" values="M30 180 L260 30;M30 180 L260 90;M30 180 L260 30" dur="5s" repeatCount="indefinite"/></path>
    <path d="M48 20 Q70 130 120 150 T280 170" class="pr-i"/>
    <text x="250" y="26" class="pr-t">y ∝ x</text><text x="200" y="150" class="pr-t">y ∝ 1/x</text>
  </svg>`,
  parts: {
    A: { name: 'Direct proportion' },
    B: { name: 'Inverse proportion and problems' },
  },
  sections: [
    { id: 'direct', covers: ['H2.5A'], part: 'A', name: 'Direct proportion: y = kx', short: 'y ∝ x', icon: 'graph', color: '--c1', line: 'Find k from one pair of values, then use the formula.' },
    { id: 'direct-powers', covers: ['H2.5A'], part: 'A', name: 'Proportion to powers and roots', short: 'Powers & roots', icon: 'graph', color: '--c3', line: 'y ∝ x², y ∝ x³ and y ∝ √x.' },
    { id: 'inverse', covers: ['H2.5A'], part: 'B', name: 'Inverse proportion', short: 'Inverse', icon: 'graph', color: '--c6', line: 'y = k/x and y = k/x²: as one goes up, the other goes down.' },
    { id: 'prop-problems', covers: ['H2.5A'], part: 'B', name: 'Proportion problems', short: 'Problems', icon: 'target', color: '--c8', line: 'From words to formula; what happens when x is doubled?' },
  ],
  scenes: ['direct', 'direct-powers', 'testA', 'inverse', 'prop-problems', 'testB'],
};
