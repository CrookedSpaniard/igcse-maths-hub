window.LESSON = {
  id: 'sets',
  description: 'Interactive maths lesson on sets and Venn diagrams: set notation, elements, the universal set and the empty set, complements, unions and intersections, shading Venn diagrams, and (Higher) sets defined algebraically, subsets, n(A) and solving problems with Venn diagrams, including three sets. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.5.',
  intro: 'A <b>set</b> is a collection of things, like the even numbers or the students who play tennis. In this lesson you will write sets with the right <b>notation</b>, and use <b>Venn diagrams</b> to show which elements belong to which sets: their <b>union</b>, <b>intersection</b> and <b>complement</b>. Higher tier: <b>subsets</b>, \\(n(A)\\) and solving real problems with Venn diagrams.',
  hero: `<svg class="st-net se-hero" viewBox="0 0 300 200" role="img" aria-label="A Venn diagram with two overlapping circles A and B; the overlap is lit">
    <rect x="20" y="20" width="260" height="160" rx="10" class="se-u"/>
    <circle cx="120" cy="100" r="58" class="se-c"/><circle cx="180" cy="100" r="58" class="se-c"/>
    <path d="M150 50.4A58 58 0 0 1 150 149.6A58 58 0 0 1 150 50.4Z" class="se-i"><animate attributeName="opacity" values=".4;1;.4" dur="3s" repeatCount="indefinite"/></path>
    <text x="80" y="58" class="se-l">A</text><text x="220" y="58" class="se-l">B</text><text x="150" y="106" class="se-n">A ∩ B</text><text x="36" y="44" class="se-l">ℰ</text>
  </svg>`,
  parts: {
    A: { name: 'Sets and Venn diagrams' },
    B: { name: 'Subsets and problems with sets', tier: 'H' },
  },
  sections: [
    { id: 'notation', part: 'A', name: 'Sets and set notation', short: 'Notation', icon: 'shapes', color: '--c4', covers: ['F1.5A', 'F1.5B', 'F1.5C', 'F1.5D'], line: 'Elements, ∈ and ∉, the universal set ℰ, the empty set ∅ and the complement A′.' },
    { id: 'venn', part: 'A', name: 'Venn diagrams, unions and intersections', short: 'Venn diagrams', icon: 'shapes', color: '--c1', covers: ['F1.5B', 'F1.5D', 'F1.5E'], line: '\\(A \\cup B\\), \\(A \\cap B\\) and shading regions.' },
    { id: 'subsets', part: 'B', name: 'Set-builder notation and subsets', short: 'Subsets', icon: 'algebra', color: '--c3', covers: ['H1.5A', 'H1.5C'], line: '\\(\\{x : \\dots\\}\\), \\(B \\subset A\\) and \\(n(A)\\).' },
    { id: 'counting', part: 'B', name: 'Solving problems with Venn diagrams', short: 'Problems', icon: 'target', color: '--c6', covers: ['H1.5B', 'H1.5C', 'H1.5D'], line: 'Numbers in the regions, unknowns and three sets.' },
  ],
  scenes: ['notation', 'venn', 'testA', 'subsets', 'counting', 'testB'],
};
