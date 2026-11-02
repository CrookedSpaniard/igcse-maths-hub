window.LESSON = {
  id: 'similarity',
  description: 'Interactive maths lesson on similar shapes: what similarity means, scale factors, missing lengths in similar triangles (including one triangle inside another), and (Higher) how areas and volumes of similar shapes scale with k² and k³. Adjustable enlargements, nested triangles, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.11.',
  intro: 'A photo and its enlargement, a model car and the real one: these are <b>similar</b> shapes. In this lesson you will use the <b>scale factor</b> to find missing lengths in similar shapes and triangles. Higher students will see what happens to <b>areas</b> and <b>volumes</b> when a shape is enlarged.',
  hero: `<svg class="st-net sm-hero" viewBox="0 0 300 200" role="img" aria-label="A small triangle and a similar larger triangle">
    <polygon points="30,170 90,170 50,125" class="sm-s"/>
    <polygon points="120,170 270,170 170,57.5" class="sm-y"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" repeatCount="indefinite"/></polygon>
    <text x="60" y="110" class="sm-l">×1</text><text x="210" y="80" class="sm-l">×2.5</text>
  </svg>`,
  parts: {
    A: { name: 'Similar shapes' },
    B: { name: 'Area and volume', tier: 'H' },
  },
  sections: [
    { id: 'similar', part: 'A', name: 'Similar shapes and scale factors', short: 'Similar shapes', icon: 'shapes', color: '--c4', line: 'Lengths all multiply by k; angles stay the same.', covers: ['F4.11A'] },
    { id: 'simtri', part: 'A', name: 'Missing lengths in similar triangles', short: 'Similar triangles', icon: 'geometry', color: '--c7', line: 'Match corresponding sides, find k, then multiply or divide.', covers: ['F4.11A'] },
    { id: 'areavol', part: 'B', name: 'Areas and volumes of similar shapes', short: 'k² and k³', icon: 'graph', color: '--c3', line: 'Area factor k², volume factor k³.', covers: ['H4.11A', 'H4.11B'] },
    { id: 'simprob', part: 'B', name: 'Problems with similar solids', short: 'Problems', icon: 'target', color: '--c9', line: 'Go back to the length factor k first.', covers: ['H4.11C', 'H4.11A', 'H4.11B'] },
  ],
  scenes: ['similar', 'simtri', 'testA', 'areavol', 'simprob', 'testB'],
};
