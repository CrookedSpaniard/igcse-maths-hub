window.LESSON = {
  id: 'growth-decay',
  description: 'Interactive maths lesson on compound interest and depreciation: simple interest compared with compound interest, using the multiplier to the power n, depreciation, and (Higher) repeated percentage changes, overall percentage change, finding the original amount, the rate or the number of years. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.6.',
  intro: 'Put money in a bank and it earns <b>interest</b>; buy a car and it loses value: <b>depreciation</b>. In this lesson you will see why <b>compound interest</b> grows faster than simple interest and use the multiplier to the power \\(n\\) to jump straight to any year. Higher tier: <b>repeated percentage changes</b> and problems where you work out the original amount, the rate or the number of years.',
  hero: `<svg class="st-net gd-hero" viewBox="0 0 300 200" role="img" aria-label="Bars growing year by year">
    ${[40, 46, 53, 61, 70, 80, 92].map((h, i) => `<rect x="${30 + i * 36}" y="${170 - h * 1.6}" width="26" height="${h * 1.6}" rx="3" class="gd-b"><animate attributeName="height" values="0;${h * 1.6};${h * 1.6}" dur="3s" begin="${i * 0.15}s" repeatCount="indefinite"/><animate attributeName="y" values="170;${170 - h * 1.6};${170 - h * 1.6}" dur="3s" begin="${i * 0.15}s" repeatCount="indefinite"/></rect>`).join('')}
    <text x="80" y="40" class="gd-l">× 1.15ⁿ</text>
  </svg>`,
  parts: {
    A: { name: 'Interest and depreciation' },
    B: { name: 'Repeated percentage change', tier: 'H' },
  },
  sections: [
    { id: 'simple', part: 'A', name: 'Simple and compound interest', short: 'Interest', icon: 'stats', color: '--c4', covers: ['F1.6G'], line: 'Interest on the start amount, or interest on the interest.' },
    { id: 'compound', part: 'A', name: 'Compound interest and depreciation', short: 'Compound', icon: 'graph', color: '--c1', covers: ['F1.6G'], line: 'Amount = original × multiplierⁿ.' },
    { id: 'repeated', part: 'B', name: 'Repeated percentage change', short: 'Repeated', icon: 'calc', color: '--c3', covers: ['H1.6A'], line: 'Different changes one after another; the overall percentage change.' },
    { id: 'problems', part: 'B', name: 'Compound interest problems', short: 'Problems', icon: 'target', color: '--c6', covers: ['H1.6B', 'H1.6A'], line: 'Find the original amount, the rate or the number of years.' },
  ],
  scenes: ['simple', 'compound', 'testA', 'repeated', 'problems', 'testB'],
};
