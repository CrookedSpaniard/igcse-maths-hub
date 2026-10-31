window.LESSON = {
  id: 'charts',
  description: 'Interactive maths lesson on presenting data: tally charts, frequency tables, grouped data and two-way tables, bar charts, pictograms and pie charts, stem-and-leaf diagrams, frequency polygons, and scatter graphs with correlation and lines of best fit. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.1.',
  intro: 'Data is much easier to understand in a <b>table</b> or a <b>chart</b>. In this lesson you will organise data in <b>frequency tables</b> and <b>two-way tables</b>, draw and read <b>bar charts, pictograms and pie charts</b>, and use <b>stem-and-leaf diagrams</b>, <b>frequency polygons</b> and <b>scatter graphs</b> to spot patterns.',
  hero: `<svg class="st-net ch-hero" viewBox="0 0 300 200" role="img" aria-label="A bar chart whose bars grow">
    <line x1="30" y1="170" x2="280" y2="170" class="ch-ax"/><line x1="30" y1="20" x2="30" y2="170" class="ch-ax"/>
    ${[90, 130, 60, 110, 40].map((h, i) => `<rect x="${48 + i * 46}" y="${170 - h}" width="32" height="${h}" rx="3" class="ch-b"><animate attributeName="height" values="0;${h};${h}" dur="3s" begin="${i * 0.2}s" repeatCount="indefinite"/><animate attributeName="y" values="170;${170 - h};${170 - h}" dur="3s" begin="${i * 0.2}s" repeatCount="indefinite"/></rect>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Tables, bar charts and pie charts' },
    B: { name: 'Stem-and-leaf, frequency polygons and scatter graphs' },
  },
  sections: [
    { id: 'tables', part: 'A', name: 'Frequency tables and two-way tables', short: 'Tables', icon: 'stats', color: '--c4', covers: ['F6.1B', 'F6.1C'], line: 'Tallies, grouped data with class intervals, and two-way tables.' },
    { id: 'barpie', part: 'A', name: 'Bar charts, pictograms and pie charts', short: 'Bar & pie', icon: 'stats', color: '--c1', covers: ['F6.1A', 'F6.1C'], line: 'Draw and read them; pie chart angles from 360°.' },
    { id: 'stemleaf', part: 'B', name: 'Stem-and-leaf and frequency polygons', short: 'Stem & leaf', icon: 'stats', color: '--c3', covers: ['F6.1A', 'F6.1B', 'F6.1C'], line: 'Ordered stem-and-leaf with a key; plotting at class midpoints.' },
    { id: 'scatter', part: 'B', name: 'Scatter graphs and correlation', short: 'Scatter', icon: 'graph', color: '--c6', covers: ['F6.1A', 'F6.1C'], line: 'Positive, negative or no correlation; lines of best fit.' },
  ],
  scenes: ['tables', 'barpie', 'testA', 'stemleaf', 'scatter', 'testB'],
};
