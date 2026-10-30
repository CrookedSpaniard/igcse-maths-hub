window.LESSON = {
  id: 'algebraic-fractions',
  description: 'Interactive Higher tier maths lesson on algebraic fractions: simplifying by factorising and cancelling, multiplying and dividing, adding and subtracting with a common denominator, and solving equations with algebraic fractions. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.2.',
  intro: 'An <b>algebraic fraction</b> is a fraction with letters in it, like \\(\\frac{x + 3}{x^2 - 9}\\). The rules are the same as for number fractions. In this lesson you will <b>simplify</b> by factorising and cancelling, <b>multiply, divide, add and subtract</b> algebraic fractions and <b>solve equations</b> that contain them.',
  hero: `<svg class="st-net af-hero" viewBox="0 0 300 200" role="img" aria-label="A fraction with the factor x + 3 on top and bottom being cancelled">
    <line x1="40" y1="100" x2="260" y2="100" class="af-bar"/>
    <g><rect x="60" y="50" width="80" height="36" rx="8" class="af-f"/><text x="100" y="74">x + 3</text></g>
    <g><rect x="60" y="114" width="80" height="36" rx="8" class="af-f"/><text x="100" y="138">x + 3</text></g>
    <g><rect x="160" y="114" width="80" height="36" rx="8" class="af-g"/><text x="200" y="138">x − 3</text></g>
    <line x1="56" y1="88" x2="144" y2="48" class="af-x"><animate attributeName="opacity" values="0;0;1;1;0" dur="4s" repeatCount="indefinite"/></line>
    <line x1="56" y1="152" x2="144" y2="112" class="af-x"><animate attributeName="opacity" values="0;0;1;1;0" dur="4s" repeatCount="indefinite"/></line>
    <text x="200" y="74" class="af-one">1</text>
  </svg>`,
  parts: {
    A: { name: 'Simplifying, multiplying and dividing' },
    B: { name: 'Adding, subtracting and solving' },
  },
  sections: [
    { id: 'af-simplify', part: 'A', name: 'Simplifying algebraic fractions', short: 'Simplifying', icon: 'frac', color: '--c1', line: 'Factorise top and bottom, then cancel common factors.' },
    { id: 'af-muldiv', part: 'A', name: 'Multiplying and dividing', short: 'Multiply & divide', icon: 'frac', color: '--c3', line: 'Factorise, cancel, multiply; to divide, flip the second fraction.' },
    { id: 'af-addsub', part: 'B', name: 'Adding and subtracting', short: 'Add & subtract', icon: 'frac', color: '--c6', line: 'Use a common denominator, then combine the numerators.' },
    { id: 'af-equations', part: 'B', name: 'Equations with algebraic fractions', short: 'Equations', icon: 'frac', color: '--c8', line: 'Multiply every term by the common denominator.' },
  ],
  scenes: ['af-simplify', 'af-muldiv', 'testA', 'af-addsub', 'af-equations', 'testB'],
};
