window.LESSON = {
  id: 'functions',
  description: 'Interactive Higher tier maths lesson on functions: mappings between two sets, function notation f(x) and f : x ↦ …, domain and range and the values that must be excluded, composite functions fg(x) and inverse functions f⁻¹(x). Mapping diagrams, function machines and graphs reflected in y = x, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.2.',
  intro: 'A <b>function</b> is a rule that takes an input and gives exactly one output, like “double it and add 3”. In this lesson you will use <b>function notation</b>, find the <b>domain</b> and <b>range</b>, put two functions together to make a <b>composite function</b> and undo a function with its <b>inverse</b>.',
  hero: `<svg class="st-net fn-hero" viewBox="0 0 300 200" role="img" aria-label="A mapping diagram: arrows from inputs 1, 2, 3 to outputs 5, 7, 9">
    <ellipse cx="70" cy="100" rx="40" ry="75" class="fn-set"/><ellipse cx="230" cy="100" rx="40" ry="75" class="fn-set"/>
    ${[1, 2, 3].map((v, i) => `<text x="70" y="${66 + i * 38}" class="fn-t">${v}</text><text x="230" y="${66 + i * 38}" class="fn-t">${2 * v + 3}</text><line x1="86" y1="${61 + i * 38}" x2="212" y2="${61 + i * 38}" class="fn-a"><animate attributeName="x2" values="86;212;212" dur="3s" begin="${i * .4}s" repeatCount="indefinite"/></line>`).join('')}
    <text x="150" y="190" class="fn-t">f(x) = 2x + 3</text>
  </svg>`,
  parts: {
    A: { name: 'Function notation, domain and range' },
    B: { name: 'Composite and inverse functions' },
  },
  sections: [
    { id: 'mapping', covers: ['H3.2A', 'H3.2B'], part: 'A', name: 'Functions and function notation', short: 'Notation', icon: 'algebra', color: '--c1', line: 'f(x) = … and f : x ↦ …: each input has exactly one output.' },
    { id: 'domain-range', covers: ['H3.2C'], part: 'A', name: 'Domain and range', short: 'Domain & range', icon: 'graph', color: '--c3', line: 'The inputs allowed and the outputs you get; exclude values you cannot use.' },
    { id: 'composite', covers: ['H3.2D'], part: 'B', name: 'Composite functions', short: 'Composite', icon: 'algebra', color: '--c6', line: 'fg(x) means do g first, then f.' },
    { id: 'inverse-fn', covers: ['H3.2D'], part: 'B', name: 'Inverse functions', short: 'Inverse', icon: 'graph', color: '--c8', line: 'f⁻¹ undoes f; its graph is the reflection in y = x.' },
  ],
  scenes: ['mapping', 'domain-range', 'testA', 'composite', 'inverse-fn', 'testB'],
};
