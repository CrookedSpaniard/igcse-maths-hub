window.LESSON = {
  id: 'standard-form',
  description: 'Interactive maths lesson on standard form: writing very large and very small numbers as A × 10ⁿ, converting back to ordinary numbers, ordering, multiplying, dividing, adding and subtracting in standard form, using a calculator, and (Higher) solving problems with standard form. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.9.',
  intro: 'The Sun is about 150 000 000 km away; a virus is about 0.000 000 1 m long. <b>Standard form</b> writes numbers like these neatly as \\(A \\times 10^n\\), with \\(1 \\le A < 10\\). In this lesson you will <b>convert</b> numbers to and from standard form, <b>order</b> them, and <b>calculate</b> with them, with and without a calculator. Higher tier: solve real <b>problems</b> in standard form.',
  hero: `<svg class="st-net sf-hero" viewBox="0 0 300 200" role="img" aria-label="150 000 000 written as 1.5 times 10 to the 8">
    <text x="150" y="70" class="sf-n">150 000 000</text>
    <text x="150" y="140" class="sf-b">1.5 × 10⁸<animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"/></text>
    <path d="M60 85q90 30 180 0" class="sf-a"/>
  </svg>`,
  parts: {
    A: { name: 'Writing numbers in standard form' },
    B: { name: 'Calculating in standard form' },
    C: { name: 'Problems with standard form', tier: 'H' },
  },
  sections: [
    { id: 'writing', part: 'A', name: 'Large and small numbers in standard form', short: 'Writing', icon: 'number', color: '--c4', covers: ['F1.9A'], line: 'Move the point until 1 ≤ A < 10; count the jumps.' },
    { id: 'adjust', part: 'A', name: 'Converting and ordering', short: 'Ordering', icon: 'number', color: '--c1', covers: ['F1.9A'], line: 'Back to ordinary numbers, fixing A, and comparing powers.' },
    { id: 'muldiv', part: 'B', name: 'Multiplying and dividing', short: '× and ÷', icon: 'calc', color: '--c3', covers: ['F1.9A'], line: 'Deal with the numbers and the powers of 10 separately.' },
    { id: 'addsub', part: 'B', name: 'Adding, subtracting and calculators', short: '+ and −', icon: 'calc', color: '--c6', covers: ['F1.9A'], line: 'Use the same power of 10; read the calculator display.' },
    { id: 'problems', part: 'C', name: 'Problems in standard form', short: 'Problems', icon: 'target', color: '--c8', covers: ['H1.9A'], line: 'Science, space and populations: multi-step problems.', tier: 'H' },
  ],
  scenes: ['writing', 'adjust', 'testA', 'muldiv', 'addsub', 'testB', 'problems', 'testC'],
};
