window.LESSON = {
  id: 'percentages',
  description: 'Interactive maths lesson on percentages: what per cent means, converting between percentages, fractions and decimals, finding a percentage of an amount, writing one number as a percentage of another, percentage increase and decrease with multipliers, percentage change, profit and loss, and reverse percentages. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.6.',
  intro: '<b>Per cent</b> means “out of 100”. Percentages are everywhere: sales, test scores, pay rises and interest. In this lesson you will switch between <b>percentages, fractions and decimals</b>, find a <b>percentage of an amount</b>, use <b>multipliers</b> to increase and decrease, work out a <b>percentage change</b>, and go backwards with <b>reverse percentages</b> to find the original amount.',
  hero: `<svg class="st-net pc-hero" viewBox="0 0 300 200" role="img" aria-label="A bar showing 100 percent growing to 120 percent">
    <rect x="30" y="70" width="200" height="40" rx="6" class="pc-base"/>
    <rect x="30" y="70" width="200" height="40" rx="6" class="pc-up"><animate attributeName="width" values="200;240;240;200" dur="4s" repeatCount="indefinite"/></rect>
    <text x="130" y="96" class="pc-t">100%</text>
    <text x="150" y="150" class="pc-l">× 1.2 → 120%</text>
    <text x="150" y="48" class="pc-big">%</text>
  </svg>`,
  parts: {
    A: { name: 'Percentages, fractions and amounts' },
    B: { name: 'Percentage change' },
  },
  sections: [
    { id: 'meaning', part: 'A', name: 'Percentages, fractions and decimals', short: 'Meaning', icon: 'frac', color: '--c4', covers: ['F1.6A', 'F1.6C'], line: 'Out of 100; converting all three ways.' },
    { id: 'ofamount', part: 'A', name: 'Percentages of amounts', short: 'Of amounts', icon: 'calc', color: '--c1', covers: ['F1.6B', 'F1.6D'], line: 'Build from 10% and 1%, or multiply by a decimal; one number as a percentage of another.' },
    { id: 'change', part: 'B', name: 'Percentage increase, decrease and change', short: 'Change', icon: 'graph', color: '--c3', covers: ['F1.6D', 'F1.6E'], line: 'Multipliers, percentage change, profit and loss.' },
    { id: 'reverse', part: 'B', name: 'Reverse percentages', short: 'Reverse', icon: 'target', color: '--c6', covers: ['F1.6F', 'F1.6D'], line: 'Find the original amount: divide by the multiplier.' },
  ],
  scenes: ['meaning', 'ofamount', 'testA', 'change', 'reverse', 'testB'],
};
