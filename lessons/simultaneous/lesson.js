window.LESSON = {
  id: 'simultaneous',
  description: 'Interactive maths lesson on simultaneous linear equations: solving by elimination, multiplying first, substitution, word problems, and for Higher tier seeing the solution as the point where two straight lines cross. Animated worked examples, a two-line graph with sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.6.',
  intro: '<b>Simultaneous equations</b> are two equations that are true at the same time. In this lesson you will find the one pair of values that fits both, by <b>elimination</b> and by <b>substitution</b>, and use them to solve <b>problems</b>. Higher tier students also see the answer as the point where <b>two lines cross</b>.',
  hero: `<svg class="st-net si-hero" viewBox="0 0 300 200" role="img" aria-label="Two straight lines crossing at one point">
    <line x1="20" y1="180" x2="280" y2="180" class="si-ax"/><line x1="40" y1="190" x2="40" y2="12" class="si-ax"/>
    <line x1="30" y1="170" x2="270" y2="30" class="si-a"/>
    <line x1="30" y1="40" x2="270" y2="160" class="si-b"><animate attributeName="y2" values="160;120;160" dur="5s" repeatCount="indefinite"/></line>
    <circle cx="150" cy="100" r="9" class="si-p"><animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite"/></circle>
  </svg>`,
  parts: {
    A: { name: 'Elimination' },
    B: { name: 'Substitution, problems and graphs' },
  },
  sections: [
    { id: 'elimination', covers: ['F2.6A'], part: 'A', name: 'Solving by elimination', short: 'Elimination', icon: 'algebra', color: '--c1', line: 'Add or subtract the equations to remove one letter.' },
    { id: 'scaling', covers: ['F2.6A'], part: 'A', name: 'Multiplying first', short: 'Multiply first', icon: 'algebra', color: '--c3', line: 'Make the coefficients match, then eliminate.' },
    { id: 'sim-problems', covers: ['F2.6A'], part: 'B', name: 'Substitution and problems', short: 'Problems', icon: 'target', color: '--c6', line: 'Substitute one equation into the other; turn words into two equations.' },
    { id: 'sim-graphs', covers: ['H2.6A', 'H2.6B'], part: 'B', tier: 'H', name: 'Simultaneous equations and graphs', short: 'Graphs', icon: 'graph', color: '--c8', line: 'The solution is where the two lines cross.' },
  ],
  scenes: ['elimination', 'scaling', 'testA', 'sim-problems', 'sim-graphs', 'testB'],
};
