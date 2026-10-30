window.LESSON = {
  id: 'formulae',
  description: 'Interactive maths lesson on formulae: substituting positive and negative numbers, writing formulae from words, changing the subject with inverse operations, and for Higher tier rearranging when the subject appears twice or inside a power or root. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 2.3.',
  intro: 'A <b>formula</b> is a rule that links quantities, like \\(v = u + at\\). In this lesson you will <b>substitute</b> numbers into formulae, <b>write</b> your own formulae from words and <b>change the subject</b> of a formula using inverse operations. Higher tier students also rearrange formulae where the subject appears <b>twice</b> or inside a <b>power or root</b>.',
  hero: `<svg class="st-net fo-hero" viewBox="0 0 300 200" role="img" aria-label="A function machine: x, times 3, plus 5, gives y; and backwards: y, minus 5, divide by 3, gives x">
    <g class="fo-fw"><rect x="14" y="40" width="48" height="36" rx="8"/><text x="38" y="64">x</text><rect x="92" y="40" width="60" height="36" rx="8" class="op"/><text x="122" y="64">× 3</text><rect x="182" y="40" width="60" height="36" rx="8" class="op"/><text x="212" y="64">+ 5</text><rect x="252" y="40" width="40" height="36" rx="8"/><text x="272" y="64">y</text></g>
    <g class="fo-bw"><rect x="14" y="124" width="48" height="36" rx="8"/><text x="38" y="148">x</text><rect x="92" y="124" width="60" height="36" rx="8" class="op"/><text x="122" y="148">÷ 3</text><rect x="182" y="124" width="60" height="36" rx="8" class="op"/><text x="212" y="148">− 5</text><rect x="252" y="124" width="40" height="36" rx="8"/><text x="272" y="148">y</text></g>
    <circle r="7" class="fo-dot"><animateMotion dur="4s" repeatCount="indefinite" path="M38 98 L272 98 L272 106 L38 106 Z" keyPoints="0;.45;.5;.95;1" keyTimes="0;.45;.5;.95;1" calcMode="linear"/></circle>
  </svg>`,
  parts: {
    A: { name: 'Using formulae' },
    B: { name: 'Changing the subject' },
  },
  sections: [
    { id: 'substitution', covers: ['F2.2A', 'F2.3A', 'F2.3C'], part: 'A', name: 'Substituting into formulae', short: 'Substitution', icon: 'algebra', color: '--c1', line: 'Replace each letter with its value, then use the order of operations.' },
    { id: 'writing', covers: ['F2.3B', 'F2.3D', 'F2.3E'], part: 'A', name: 'Writing formulae and expressions', short: 'Writing formulae', icon: 'algebra', color: '--c3', line: 'Turn words into algebra.' },
    { id: 'subject', covers: ['F2.3F'], part: 'B', name: 'Changing the subject', short: 'Change the subject', icon: 'algebra', color: '--c6', line: 'Undo the operations in reverse order, doing the same to both sides.' },
    { id: 'subject-h', covers: ['H2.3A'], part: 'B', tier: 'H', name: 'Harder rearranging', short: 'Harder rearranging', icon: 'algebra', color: '--c8', line: 'Subject twice: collect and factorise. Powers and roots: undo them.' },
  ],
  scenes: ['substitution', 'writing', 'testA', 'subject', 'subject-h', 'testB'],
};
