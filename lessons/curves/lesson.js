window.LESSON = {
  id: 'curves',
  description: 'Interactive maths lesson on graphs of functions: tables of values, plotting straight lines and quadratic curves, the line of symmetry, turning point and roots of a parabola, and for Higher tier cubic graphs, reciprocal graphs and the graphs of sine, cosine and tangent for any angle. Animated plotting with sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.3.',
  intro: 'Every equation in \\(x\\) and \\(y\\) has a graph. In this lesson you will make <b>tables of values</b>, plot <b>straight lines</b> and <b>quadratic curves</b> and read their key features. Higher tier students also recognise and draw <b>cubic</b>, <b>reciprocal</b> and <b>trigonometric</b> graphs.',
  hero: `<svg class="st-net cu-hero" viewBox="0 0 300 200" role="img" aria-label="A parabola, a cubic and a sine wave">
    <line x1="10" y1="100" x2="290" y2="100" class="cu-ax"/>
    <path d="M20 20 Q80 190 140 20" class="cu-a"/>
    <path d="M150 100 C170 30 190 30 210 100 S250 170 270 100" class="cu-b"><animate attributeName="d" values="M150 100 C170 30 190 30 210 100 S250 170 270 100;M150 100 C170 170 190 170 210 100 S250 30 270 100;M150 100 C170 30 190 30 210 100 S250 170 270 100" dur="4s" repeatCount="indefinite"/></path>
  </svg>`,
  parts: {
    A: { name: 'Plotting and quadratic graphs' },
    B: { name: 'Cubic, reciprocal and trigonometric graphs', tier: 'H' },
  },
  sections: [
    { id: 'plotting', covers: ['F3.3I'], part: 'A', name: 'Tables of values and plotting', short: 'Plotting', icon: 'graph', color: '--c1', line: 'Work out y for each x, plot the points, join them smoothly.' },
    { id: 'parabolas', covers: ['F3.3I'], part: 'A', name: 'Features of quadratic graphs', short: 'Parabolas', icon: 'graph', color: '--c3', line: 'Shape, line of symmetry, turning point, roots and y-intercept.' },
    { id: 'cubic-recip', covers: ['H3.3A'], part: 'B', name: 'Cubic and reciprocal graphs', short: 'Cubic & reciprocal', icon: 'graph', color: '--c6', line: 'Recognise y = x³ and y = k/x and their shapes.' },
    { id: 'trig-graphs', covers: ['H3.3A'], part: 'B', name: 'Graphs of sin, cos and tan', short: 'Trig graphs', icon: 'graph', color: '--c8', line: 'Waves that repeat every 360° (tan every 180°).' },
  ],
  scenes: ['plotting', 'parabolas', 'testA', 'cubic-recip', 'trig-graphs', 'testB'],
};
