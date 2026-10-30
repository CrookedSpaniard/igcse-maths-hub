window.LESSON = {
  id: 'surds',
  description: 'Interactive maths lesson on surds (Higher tier): what a surd is, multiplying and dividing surds, simplifying surds using square factors, adding and subtracting surds, expanding brackets with surds and rationalising the denominator. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.4.',
  intro: '\\(\\sqrt{2}\\) can never be written exactly as a decimal or a fraction. A root like this is a <b>surd</b>, and leaving it as a surd keeps your answer <b>exact</b>. In this lesson you will <b>simplify</b> surds, <b>add, multiply and expand</b> them, and <b>rationalise</b> a denominator so there is no surd on the bottom of a fraction.',
  hero: `<svg class="st-net su-hero" viewBox="0 0 300 200" role="img" aria-label="A square of area 2 has side root 2">
    <rect x="70" y="40" width="110" height="110" class="su-sq"><animate attributeName="opacity" values=".6;1;.6" dur="3s" repeatCount="indefinite"/></rect>
    <text x="125" y="102" class="su-a">area 2</text>
    <text x="125" y="176" class="su-l">side = √2</text>
    <text x="236" y="80" class="su-b">√2 =</text>
    <text x="236" y="108" class="su-c">1.41421…</text>
  </svg>`,
  parts: {
    A: { name: 'Simplifying surds' },
    B: { name: 'Expanding and rationalising' },
  },
  sections: [
    { id: 'meaning', part: 'A', name: 'What is a surd?', short: 'Surds', icon: 'shapes', color: '--c4', covers: ['H1.4A', 'H1.4B'], line: 'Exact roots, and the rules \\(\\sqrt{a}\\sqrt{b} = \\sqrt{ab}\\) and \\(\\frac{\\sqrt a}{\\sqrt b} = \\sqrt{\\frac ab}\\).' },
    { id: 'simplify', part: 'A', name: 'Simplifying, adding and subtracting surds', short: 'Simplifying', icon: 'number', color: '--c1', covers: ['H1.4B'], line: 'Find the largest square factor; collect like surds.' },
    { id: 'expand', part: 'B', name: 'Expanding brackets with surds', short: 'Expanding', icon: 'algebra', color: '--c3', covers: ['H1.4B'], line: 'Multiply every term; \\(\\sqrt a \\times \\sqrt a = a\\).' },
    { id: 'rationalise', part: 'B', name: 'Rationalising the denominator', short: 'Rationalising', icon: 'frac', color: '--c6', covers: ['H1.4B'], line: 'Multiply top and bottom by \\(\\sqrt a\\), or by \\(a - \\sqrt b\\).' },
  ],
  scenes: ['meaning', 'simplify', 'testA', 'expand', 'rationalise', 'testB'],
};
