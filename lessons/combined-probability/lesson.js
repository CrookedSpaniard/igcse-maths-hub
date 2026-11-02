window.LESSON = {
  id: 'combined-probability',
  description: 'Interactive maths lesson on combined events: listing outcomes systematically, sample space diagrams for two dice, the addition rule for mutually exclusive events, probabilities from Venn diagrams, and (Higher tier) tree diagrams for independent events and conditional probability without replacement. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.3.',
  intro: 'When two things happen, there are more outcomes to keep track of. In this lesson you will <b>list outcomes</b> systematically and draw <b>sample space diagrams</b>, use the <b>addition rule</b> for events that cannot happen together, and read probabilities from <b>Venn diagrams</b>. Higher tier: draw <b>tree diagrams</b> for independent events, and for events that depend on each other (<b>conditional probability</b>).',
  hero: `<svg class="st-net cp-hero" viewBox="0 0 300 200" role="img" aria-label="A tree diagram with branches growing">
    <circle cx="40" cy="100" r="6" class="cp-n"/>
    ${[[150, 55], [150, 145]].map(([x, y], i) => `<line x1="40" y1="100" x2="${x}" y2="${y}" class="cp-b"><animate attributeName="stroke-dasharray" values="0 200;200 0;200 0" dur="4s" begin="${i * 0.2}s" repeatCount="indefinite"/></line>${[-22, 22].map((d) => `<line x1="${x}" y1="${y}" x2="260" y2="${y + d}" class="cp-b cp-b2"><animate attributeName="stroke-dasharray" values="0 200;0 200;200 0" dur="4s" repeatCount="indefinite"/></line>`).join('')}`).join('')}
    <circle cx="150" cy="55" r="6" class="cp-n"/><circle cx="150" cy="145" r="6" class="cp-n"/>
  </svg>`,
  parts: {
    A: { name: 'Sample spaces, the addition rule and Venn diagrams' },
    B: { name: 'Tree diagrams', tier: 'H' },
  },
  sections: [
    { id: 'samplespace', part: 'A', name: 'Listing outcomes and sample spaces', short: 'Sample spaces', icon: 'dice', color: '--c4', covers: ['F6.3E', 'F6.3F'], line: 'List outcomes in order; a grid for two dice.' },
    { id: 'addrule', part: 'A', name: 'Mutually exclusive events', short: 'Addition rule', icon: 'frac', color: '--c1', covers: ['F6.3I'], line: 'P(A or B) = P(A) + P(B) when A and B cannot both happen.' },
    { id: 'vennprob', part: 'A', name: 'Probability from Venn diagrams', short: 'Venn', icon: 'shapes', color: '--c3', covers: ['F6.3D'], line: 'Count the region, divide by the total.' },
    { id: 'trees', part: 'B', name: 'Tree diagrams and independent events', short: 'Trees', icon: 'graph', color: '--c6', covers: ['H6.3A', 'H6.3B', 'H6.3D'], line: 'Multiply along the branches, add the outcomes you want.', tier: 'H' },
    { id: 'conditional', part: 'B', name: 'Conditional probability', short: 'Conditional', icon: 'target', color: '--c8', covers: ['H6.3A', 'H6.3C', 'H6.3D'], line: 'Without replacement, the second probabilities change.', tier: 'H' },
  ],
  scenes: ['samplespace', 'addrule', 'vennprob', 'testA', 'trees', 'conditional', 'testB'],
};
