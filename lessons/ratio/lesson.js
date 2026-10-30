window.LESSON = {
  id: 'ratio',
  description: 'Interactive maths lesson on ratio and proportion: ratio notation, simplifying ratios, ratios and fractions, the form 1 : n, sharing an amount in a given ratio, problems with a known difference, direct proportion with the unitary method, recipes, best buys and exchange rates. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.7.',
  intro: 'A <b>ratio</b> compares amounts: 2 cups of flour to every 3 cups of sugar. In this lesson you will <b>simplify</b> ratios, link them to <b>fractions</b>, <b>share</b> amounts in a ratio using a bar model, and use <b>direct proportion</b> to scale recipes, compare <b>best buys</b> and convert money with <b>exchange rates</b>.',
  hero: `<svg class="st-net ra-hero" viewBox="0 0 300 200" role="img" aria-label="Bar model: 2 parts and 3 parts">
    ${[0, 1].map((i) => `<rect x="${40 + i * 46}" y="60" width="42" height="34" rx="5" class="ra-a"/>`).join('')}
    ${[0, 1, 2].map((i) => `<rect x="${40 + i * 46}" y="110" width="42" height="34" rx="5" class="ra-b"><animate attributeName="opacity" values=".4;1;.4" dur="3s" begin="${i * 0.3}s" repeatCount="indefinite"/></rect>`).join('')}
    <text x="230" y="112" class="ra-l">2 : 3</text>
  </svg>`,
  parts: {
    A: { name: 'Ratio' },
    B: { name: 'Proportion' },
  },
  sections: [
    { id: 'simplify', part: 'A', name: 'Ratio notation and simplifying', short: 'Simplifying', icon: 'number', color: '--c4', covers: ['F1.7A'], line: 'Divide by the HCF; ratios and fractions; the form 1 : n.' },
    { id: 'share', part: 'A', name: 'Sharing in a ratio', short: 'Sharing', icon: 'shapes', color: '--c1', covers: ['F1.7B', 'F1.7E'], line: 'Total parts, one part, then each share.' },
    { id: 'proportion', part: 'B', name: 'Direct proportion', short: 'Proportion', icon: 'graph', color: '--c3', covers: ['F1.7C', 'F1.7D', 'F1.7E'], line: 'Find the value of one, then multiply. Recipes and scaling.' },
    { id: 'bestbuy', part: 'B', name: 'Best buys and exchange rates', short: 'Best buys', icon: 'calc', color: '--c6', covers: ['F1.7C', 'F1.7E'], line: 'Price per unit, and converting between currencies.' },
  ],
  scenes: ['simplify', 'share', 'testA', 'proportion', 'bestbuy', 'testB'],
};
