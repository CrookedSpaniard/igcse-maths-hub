window.LESSON = {
  id: 'sequences',
  description: 'Interactive maths lesson on sequences: term-to-term and position-to-term rules, continuing patterns, the nth term of arithmetic sequences, and for Higher tier the first term a, common difference d, the formula a + (n − 1)d and the sum of an arithmetic series. Growing patterns, bar charts with sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.1.',
  intro: 'A <b>sequence</b> is a list of numbers that follows a rule, like 5, 8, 11, 14, … In this lesson you will continue sequences, use <b>term-to-term</b> and <b>position-to-term</b> rules and find the <b>nth term</b> of an arithmetic sequence. Higher tier students also use \\(a + (n - 1)d\\) and add up the terms of an <b>arithmetic series</b>.',
  hero: `<svg class="st-net sq-hero" viewBox="0 0 300 200" role="img" aria-label="Bars growing by the same amount each time">
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${30 + i * 52}" y="${170 - (30 + i * 30)}" width="36" height="${30 + i * 30}" rx="5" class="sq-b"><animate attributeName="opacity" values="0;1;1" keyTimes="0;.${2 + i};1" dur="4s" repeatCount="indefinite"/></rect><text x="${48 + i * 52}" y="190" class="sq-t">${5 + 3 * i}</text>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Rules and the nth term' },
    B: { name: 'Arithmetic sequences and series', tier: 'H' },
  },
  sections: [
    { id: 'term-rules', covers: ['F3.1A', 'F3.1B'], part: 'A', name: 'Term-to-term and position-to-term rules', short: 'Rules', icon: 'number', color: '--c1', line: 'Continue a pattern and describe the rule that makes it.' },
    { id: 'nth-term', covers: ['F3.1C'], part: 'A', name: 'The nth term', short: 'nth term', icon: 'algebra', color: '--c3', line: 'For an arithmetic sequence the nth term is dn + (first term − d).' },
    { id: 'arith-h', covers: ['H3.1A', 'H3.1B'], part: 'B', name: 'First term, common difference and a + (n − 1)d', short: 'a + (n − 1)d', icon: 'algebra', color: '--c6', line: 'Use a and d to find any term, or to find a and d from two terms.' },
    { id: 'series', covers: ['H3.1C'], part: 'B', name: 'Arithmetic series', short: 'Series', icon: 'calc', color: '--c8', line: 'Add the first n terms: Sₙ = n/2 (2a + (n − 1)d).' },
  ],
  scenes: ['term-rules', 'nth-term', 'testA', 'arith-h', 'series', 'testB'],
};
