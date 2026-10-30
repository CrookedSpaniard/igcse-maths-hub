window.LESSON = {
  id: 'expand-factorise',
  description: 'Interactive maths lesson on expanding and factorising: single brackets, the grid method for double brackets, common factors, factorising x² + bx + c and the difference of two squares, and for Higher tier triple brackets and factorising ax² + bx + c. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.2.',
  intro: '<b>Expanding</b> means multiplying out brackets. <b>Factorising</b> is the reverse: putting brackets back in. In this lesson you will use the <b>grid method</b> to see every term, then factorise by finding <b>common factors</b> and <b>factor pairs</b>. Higher tier students also expand three brackets and factorise \\(ax^2 + bx + c\\).',
  hero: `<svg class="st-net ef-hero" viewBox="0 0 300 200" role="img" aria-label="The grid method: (x + 3)(x + 2) as a rectangle split into four parts">
    <rect x="70" y="40" width="120" height="100" class="ef-a"/><rect x="190" y="40" width="60" height="100" class="ef-b"/>
    <rect x="70" y="140" width="120" height="40" class="ef-b"/><rect x="190" y="140" width="60" height="40" class="ef-c"><animate attributeName="opacity" values="1;.4;1" dur="2.5s" repeatCount="indefinite"/></rect>
    <text x="130" y="30">x</text><text x="220" y="30">+3</text><text x="50" y="95">x</text><text x="50" y="165">+2</text>
    <text x="130" y="96" class="in">x²</text><text x="220" y="96" class="in">3x</text><text x="130" y="166" class="in">2x</text><text x="220" y="166" class="in">6</text>
  </svg>`,
  parts: {
    A: { name: 'Expanding brackets' },
    B: { name: 'Factorising' },
  },
  sections: [
    { id: 'single', covers: ['F2.2B', 'F2.2C'], part: 'A', name: 'Expanding single brackets', short: 'Single brackets', icon: 'algebra', color: '--c1', line: 'Multiply every term inside by the term outside.' },
    { id: 'double', covers: ['F2.2E'], part: 'A', name: 'Expanding double brackets', short: 'Double brackets', icon: 'algebra', color: '--c3', line: 'The grid method: four products, then collect like terms.' },
    { id: 'common', covers: ['F2.2D'], part: 'B', name: 'Factorising with common factors', short: 'Common factors', icon: 'algebra', color: '--c6', line: 'Take the highest common factor outside the bracket.' },
    { id: 'quad-fact', covers: ['F2.2F'], part: 'B', name: 'Factorising quadratics', short: 'Quadratics', icon: 'algebra', color: '--c8', line: 'Find two numbers that multiply to c and add to b.' },
    { id: 'harder', covers: ['H2.2A', 'H2.2B'], part: 'B', tier: 'H', name: 'Triple brackets and ax² + bx + c', short: 'Harder', icon: 'algebra', color: '--c5', line: 'Expand three brackets; factorise when x² has a coefficient.' },
  ],
  scenes: ['single', 'double', 'testA', 'common', 'quad-fact', 'harder', 'testB'],
};
