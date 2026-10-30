window.LESSON = {
  id: 'constructions',
  description: 'Interactive maths lesson on accurate drawing and constructions: measuring and drawing lines to the nearest millimetre, constructing triangles with a ruler, protractor and compasses, the perpendicular bisector of a line segment, the bisector of an angle, and solving problems with scale drawings. Animated constructions, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.5.',
  intro: 'With a <b>ruler</b>, a <b>protractor</b> and a pair of <b>compasses</b> you can draw accurately. In this lesson you will measure lines to the nearest millimetre, <b>construct triangles</b>, cut a line exactly in half at right angles, split an angle into two equal parts, and solve problems with <b>scale drawings</b>.',
  hero: `<svg class="st-net cn-hero" viewBox="0 0 300 200" role="img" aria-label="Compass arcs from two points crossing on the perpendicular bisector">
    <line x1="70" y1="100" x2="230" y2="100" class="cn-l"/>
    <circle cx="70" cy="100" r="5" class="cn-d"/><circle cx="230" cy="100" r="5" class="cn-d"/>
    <path d="M134.3 23.4 A100 100 0 0 1 134.3 176.6" class="cn-a" pathLength="1"><animate attributeName="stroke-dashoffset" values="1;0;0" dur="3s" repeatCount="indefinite"/></path>
    <path d="M165.7 23.4 A100 100 0 0 0 165.7 176.6" class="cn-a" pathLength="1"><animate attributeName="stroke-dashoffset" values="1;0;0" dur="3s" repeatCount="indefinite"/></path>
    <line x1="150" y1="15" x2="150" y2="185" class="cn-b"/>
  </svg>`,
  parts: {
    A: { name: 'Accurate drawing' },
    B: { name: 'Ruler-and-compasses constructions' },
  },
  sections: [
    { id: 'lines', part: 'A', name: 'Measuring and drawing lines', short: 'Lines', icon: 'geometry', color: '--c1', line: 'Measure and draw to the nearest millimetre.', covers: ['F4.5A'] },
    { id: 'triangles', part: 'A', name: 'Constructing triangles', short: 'Triangles', icon: 'shapes', color: '--c4', line: 'Three sides, two sides and an angle, or two angles and a side.', covers: ['F4.5B'] },
    { id: 'bisectors', part: 'B', name: 'Perpendicular and angle bisectors', short: 'Bisectors', icon: 'geometry', color: '--c2', line: 'Cut a line in half at 90°; cut an angle in half.', covers: ['F4.5D'] },
    { id: 'scaledraw', part: 'B', name: 'Problems with scale drawings', short: 'Scale drawings', icon: 'target', color: '--c8', line: 'Draw it to scale, then measure to find the answer.', covers: ['F4.5C'] },
  ],
  scenes: ['lines', 'triangles', 'testA', 'bisectors', 'scaledraw', 'testB'],
};
