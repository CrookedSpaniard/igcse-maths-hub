window.LESSON = {
  id: 'constructions',
  description: 'Interactive maths lesson on ruler-and-compasses constructions and loci: constructing triangles from three sides, the perpendicular bisector of a line segment, the bisector of an angle, loci of points and shading regions. Animated constructions, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.5.',
  intro: 'With only a <b>ruler</b> and a pair of <b>compasses</b> you can draw accurate triangles, cut a line exactly in half at right angles, and split an angle into two equal parts. Then you will use these constructions to draw <b>loci</b> and shade <b>regions</b>.',
  hero: `<svg class="st-net cn-hero" viewBox="0 0 300 200" role="img" aria-label="Compass arcs from two points crossing on the perpendicular bisector">
    <line x1="70" y1="100" x2="230" y2="100" class="cn-l"/>
    <circle cx="70" cy="100" r="5" class="cn-d"/><circle cx="230" cy="100" r="5" class="cn-d"/>
    <path d="M134.3 23.4 A100 100 0 0 1 134.3 176.6" class="cn-a" pathLength="1"><animate attributeName="stroke-dashoffset" values="1;0;0" dur="3s" repeatCount="indefinite"/></path>
    <path d="M165.7 23.4 A100 100 0 0 0 165.7 176.6" class="cn-a" pathLength="1"><animate attributeName="stroke-dashoffset" values="1;0;0" dur="3s" repeatCount="indefinite"/></path>
    <line x1="150" y1="15" x2="150" y2="185" class="cn-b"/>
  </svg>`,
  parts: {
    A: { name: 'Constructions' },
    B: { name: 'Loci and regions' },
  },
  sections: [
    { id: 'triangles', part: 'A', name: 'Constructing triangles', short: 'Triangles', icon: 'geometry', color: '--c4', line: 'Three sides: use compasses for the two arcs.' },
    { id: 'bisectors', part: 'A', name: 'Perpendicular and angle bisectors', short: 'Bisectors', icon: 'geometry', color: '--c2', line: 'Cut a line in half at 90°; cut an angle in half.' },
    { id: 'loci', part: 'B', name: 'Loci', short: 'Loci', icon: 'target', color: '--c6', line: 'All the points that follow a rule.' },
    { id: 'regions', part: 'B', name: 'Regions', short: 'Regions', icon: 'shapes', color: '--c8', line: 'Shade the points that satisfy several rules.' },
  ],
  scenes: ['triangles', 'bisectors', 'testA', 'loci', 'regions', 'testB'],
};
