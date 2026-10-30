window.LESSON = {
  id: 'angles',
  description: 'Interactive maths lesson on angles, lines and triangles: types of angle, angles on a straight line and around a point, vertically opposite angles, angles in parallel lines, the angle sum of a triangle, exterior angles and isosceles triangles. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.1.',
  intro: 'Angles are measured in <b>degrees</b>. In this lesson you will learn the <b>angle facts</b> for straight lines, points and crossing lines, find angles in <b>parallel lines</b>, and use the <b>angle sum of a triangle</b>. Every answer needs a <b>reason</b>, so you will learn the correct words too.',
  hero: `<svg class="st-net an-hero" viewBox="0 0 300 200" role="img" aria-label="Two parallel lines cut by a transversal, with equal alternate angles">
    <line x1="20" y1="70" x2="280" y2="70" class="an-l"/><line x1="20" y1="140" x2="280" y2="140" class="an-l"/>
    <line x1="95" y1="190" x2="205" y2="15" class="an-t"/>
    <path d="M151 70 L181 70 A30 30 0 0 0 167 44 Z" class="an-y"><animate attributeName="opacity" values="1;.35;1" dur="2.6s" repeatCount="indefinite"/></path>
    <path d="M107 140 L77 140 A30 30 0 0 0 91 166 Z" class="an-y"><animate attributeName="opacity" values="1;.35;1" dur="2.6s" repeatCount="indefinite"/></path>
    <path d="M151 70 L121 70 A30 30 0 0 0 135 96 Z" class="an-w"><animate attributeName="opacity" values=".35;1;.35" dur="2.6s" repeatCount="indefinite"/></path>
    <path d="M107 140 L137 140 A30 30 0 0 0 123 114 Z" class="an-w"><animate attributeName="opacity" values=".35;1;.35" dur="2.6s" repeatCount="indefinite"/></path>
  </svg>`,
  parts: {
    A: { name: 'Angle facts and parallel lines' },
    B: { name: 'Angles in triangles' },
  },
  sections: [
    { id: 'facts', part: 'A', name: 'Angle facts', short: 'Angle facts', icon: 'geometry', color: '--c1', line: 'Types of angle; straight lines, points and vertically opposite angles.', covers: ['F4.1A', 'F4.1B'] },
    { id: 'parallel', part: 'A', name: 'Angles in parallel lines', short: 'Parallel lines', icon: 'geometry', color: '--c4', line: 'Corresponding, alternate and co-interior angles.', covers: ['F4.1B'] },
    { id: 'triangles', part: 'B', name: 'Angles in triangles', short: 'Triangles', icon: 'shapes', color: '--c6', line: 'Angle sum 180°, exterior angles, isosceles and equilateral triangles.', covers: ['F4.1C', 'F4.1D'] },
    { id: 'problems', part: 'B', name: 'Multi-step angle problems', short: 'Problems', icon: 'target', color: '--c8', line: 'Chains of angle facts with a reason for every step.', covers: ['F4.1B', 'F4.1C', 'F4.1D'] },
  ],
  scenes: ['facts', 'parallel', 'testA', 'triangles', 'problems', 'testB'],
};
