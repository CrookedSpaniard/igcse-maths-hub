window.LESSON = {
  id: 'histograms-cf',
  description: 'Interactive maths lesson on histograms and cumulative frequency (Higher tier): frequency density, drawing and reading histograms with unequal class widths, cumulative frequency tables and graphs, and using a cumulative frequency graph to estimate how many values lie above, below or between given values. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.1.',
  intro: 'When classes have <b>different widths</b>, a bar chart can mislead. In this lesson you will draw <b>histograms</b>, where the <b>area</b> of each bar shows the frequency, and read frequencies back from them. Then you will build <b>cumulative frequency</b> tables and graphs, and use them to estimate how many values are above, below or between two values.',
  hero: `<svg class="st-net hc-hero" viewBox="0 0 300 200" role="img" aria-label="A histogram with bars of different widths">
    <line x1="30" y1="170" x2="280" y2="170" class="hc-ax"/><line x1="30" y1="20" x2="30" y2="170" class="hc-ax"/>
    ${[[30, 70, 40], [70, 100, 110], [100, 130, 130], [130, 200, 60], [200, 270, 25]].map(([a, b, h], i) => `<rect x="${a}" y="${170 - h}" width="${b - a}" height="${h}" class="hc-b" stroke-width="2"><animate attributeName="height" values="0;${h};${h}" dur="3s" begin="${i * 0.2}s" repeatCount="indefinite"/><animate attributeName="y" values="170;${170 - h};${170 - h}" dur="3s" begin="${i * 0.2}s" repeatCount="indefinite"/></rect>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Histograms' },
    B: { name: 'Cumulative frequency' },
  },
  sections: [
    { id: 'fd', part: 'A', name: 'Frequency density and drawing histograms', short: 'Drawing', icon: 'stats', color: '--c4', covers: ['H6.1A'], line: 'Frequency density = frequency ÷ class width.' },
    { id: 'readhist', part: 'A', name: 'Reading histograms', short: 'Reading', icon: 'target', color: '--c1', covers: ['H6.1A'], line: 'Frequency = area = frequency density × class width.' },
    { id: 'cftable', part: 'B', name: 'Cumulative frequency graphs', short: 'CF graphs', icon: 'graph', color: '--c3', covers: ['H6.1B'], line: 'Running totals, plotted at the upper class boundaries.' },
    { id: 'cfuse', part: 'B', name: 'Using cumulative frequency graphs', short: 'Using CF', icon: 'target', color: '--c6', covers: ['H6.1C'], line: 'How many are below, above or between two values?' },
  ],
  scenes: ['fd', 'readhist', 'testA', 'cftable', 'cfuse', 'testB'],
};
