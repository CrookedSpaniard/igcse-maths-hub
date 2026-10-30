window.LESSON = {
  id: 'linear-equations',
  description: 'Interactive maths lesson on linear equations: the balance method, one- and two-step equations, unknowns on both sides, brackets, fractions, and forming equations from words and shapes. Animated balance scales, worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.4.',
  intro: 'An <b>equation</b> is like a pair of <b>balance scales</b>: both sides weigh the same. In this lesson you will solve equations by doing the <b>same thing to both sides</b>, including equations with <b>unknowns on both sides</b>, <b>brackets</b> and <b>fractions</b>, and you will <b>form your own equations</b> to solve problems.',
  hero: `<svg class="st-net le-hero" viewBox="0 0 300 200" role="img" aria-label="Balance scales with 2x + 1 on one side and 7 on the other">
    <polygon points="150,70 135,175 165,175" class="le-st"/>
    <g><animateTransform attributeName="transform" type="rotate" values="-6 150 70;6 150 70;0 150 70;0 150 70;-6 150 70" dur="5s" repeatCount="indefinite"/>
      <line x1="40" y1="70" x2="260" y2="70" class="le-beam"/>
      <rect x="22" y="40" width="26" height="26" rx="6" class="le-x"/><rect x="52" y="40" width="26" height="26" rx="6" class="le-x"/><rect x="82" y="50" width="16" height="16" rx="3" class="le-1"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${200 + (i % 4) * 18}" y="${i < 4 ? 50 : 32}" width="16" height="16" rx="3" class="le-1"/>`).join('')}
    </g>
    <text x="150" y="196" class="le-lbl">2x + 1 = 7</text>
  </svg>`,
  parts: {
    A: { name: 'Solving equations' },
    B: { name: 'Fractions and forming equations' },
  },
  sections: [
    { id: 'balance', covers: ['F2.4A'], part: 'A', name: 'The balance method', short: 'Balance method', icon: 'algebra', color: '--c1', line: 'Do the same to both sides to keep the scales level.' },
    { id: 'both-sides', covers: ['F2.4A'], part: 'A', name: 'Unknowns on both sides and brackets', short: 'Both sides', icon: 'algebra', color: '--c3', line: 'Expand brackets, then move the smaller x term.' },
    { id: 'eq-fractions', covers: ['F2.4A'], part: 'B', name: 'Equations with fractions', short: 'Fractions', icon: 'frac', color: '--c6', line: 'Multiply both sides to clear the fraction.' },
    { id: 'forming', covers: ['F2.4B'], part: 'B', name: 'Forming and solving equations', short: 'Forming', icon: 'algebra', color: '--c8', line: 'Turn a problem into an equation, solve it, answer the question.' },
  ],
  scenes: ['balance', 'both-sides', 'testA', 'eq-fractions', 'forming', 'testB'],
};
