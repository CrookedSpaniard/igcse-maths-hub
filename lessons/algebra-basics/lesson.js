window.LESSON = {
  id: 'algebra-basics',
  description: 'Interactive maths lesson on algebraic notation: terms, expressions, equations, formulae and identities, collecting like terms, multiplying and dividing terms, and the index laws, including negative and fractional indices for Higher tier. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.1.',
  intro: 'Algebra uses <b>letters</b> to stand for numbers. In this lesson you will learn the language of algebra (<b>terms, expressions, equations, formulae and identities</b>), <b>collect like terms</b>, multiply and divide terms and use the <b>index laws</b>. Higher tier students also meet <b>negative and fractional indices</b>.',
  hero: `<svg class="st-net ab-hero" viewBox="0 0 300 200" role="img" aria-label="Like terms sliding together: 3x plus 2y plus 4x becomes 7x plus 2y">
    <g class="ab-chip"><rect x="20" y="40" width="64" height="40" rx="10"/><text x="52" y="67">3x</text><animateTransform attributeName="transform" type="translate" values="0 0;0 0;60 70;60 70;0 0" dur="5s" repeatCount="indefinite"/></g>
    <g class="ab-chip y"><rect x="118" y="40" width="64" height="40" rx="10"/><text x="150" y="67">2y</text><animateTransform attributeName="transform" type="translate" values="0 0;0 0;60 70;60 70;0 0" dur="5s" repeatCount="indefinite"/></g>
    <g class="ab-chip"><rect x="216" y="40" width="64" height="40" rx="10"/><text x="248" y="67">4x</text><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-128 70;-128 70;0 0" dur="5s" repeatCount="indefinite"/></g>
    <text x="150" y="180" class="ab-lbl">3x + 2y + 4x = 7x + 2y</text>
  </svg>`,
  parts: {
    A: { name: 'The language of algebra' },
    B: { name: 'Index laws' },
  },
  sections: [
    { id: 'notation', part: 'A', name: 'Terms, expressions, equations and formulae', short: 'Notation', icon: 'algebra', color: '--c1', line: 'What letters mean, and the names of the things we write.' },
    { id: 'like-terms', part: 'A', name: 'Collecting like terms', short: 'Like terms', icon: 'algebra', color: '--c3', line: 'Add and subtract terms with the same letters; multiply and divide terms.' },
    { id: 'index-laws', part: 'B', name: 'Index laws', short: 'Index laws', icon: 'algebra', color: '--c6', line: 'Multiply: add the powers. Divide: subtract. Power of a power: multiply.' },
    { id: 'neg-frac', part: 'B', tier: 'H', name: 'Negative and fractional indices', short: 'Negative & fractional', icon: 'algebra', color: '--c8', line: 'A negative power is a reciprocal; a fractional power is a root.' },
  ],
  scenes: ['notation', 'like-terms', 'testA', 'index-laws', 'neg-frac', 'testB'],
};
