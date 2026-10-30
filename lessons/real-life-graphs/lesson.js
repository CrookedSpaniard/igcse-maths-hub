window.LESSON = {
  id: 'real-life-graphs',
  description: 'Interactive maths lesson on real-life graphs: drawing and reading conversion graphs, distance–time graphs and speed, speed–time graphs with acceleration and distance travelled, and interpreting other linear and curved graphs such as filling containers. Animated journeys, sliders, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 3.3.',
  intro: 'Graphs tell stories. In this lesson you will use <b>conversion graphs</b> to change between units and currencies, read <b>distance–time</b> and <b>speed–time</b> graphs of journeys and work out speeds, accelerations and distances, and match <b>curved graphs</b> to real situations like filling a vase with water.',
  hero: `<svg class="st-net rl-hero" viewBox="0 0 300 200" role="img" aria-label="A distance–time graph of a journey with a stop">
    <line x1="30" y1="175" x2="285" y2="175" class="rl-ax"/><line x1="30" y1="175" x2="30" y2="15" class="rl-ax"/>
    <path d="M30 175 L110 80 L170 80 L260 25" class="rl-l"/>
    <circle r="8" class="rl-p"><animateMotion dur="5s" repeatCount="indefinite" path="M30 175 L110 80 L170 80 L260 25"/></circle>
    <text x="140" y="70" class="rl-t">stop</text>
  </svg>`,
  parts: {
    A: { name: 'Conversion and travel graphs' },
    B: { name: 'Speed–time and other graphs' },
  },
  sections: [
    { id: 'conversion', covers: ['F3.3F'], part: 'A', name: 'Conversion graphs', short: 'Conversion', icon: 'graph', color: '--c1', line: 'Read across and down to change units or currencies.' },
    { id: 'distance-time', covers: ['F3.3A'], part: 'A', name: 'Distance–time graphs', short: 'Distance–time', icon: 'graph', color: '--c3', line: 'The gradient is the speed; flat means stopped.' },
    { id: 'speed-time', covers: ['F3.3A'], part: 'B', name: 'Speed–time graphs', short: 'Speed–time', icon: 'graph', color: '--c6', line: 'The gradient is the acceleration; the area is the distance.' },
    { id: 'other-graphs', covers: ['F3.3A'], part: 'B', name: 'Curved and other real-life graphs', short: 'Other graphs', icon: 'graph', color: '--c8', line: 'Match the shape of a graph to what is happening.' },
  ],
  scenes: ['conversion', 'distance-time', 'testA', 'speed-time', 'other-graphs', 'testB'],
};
