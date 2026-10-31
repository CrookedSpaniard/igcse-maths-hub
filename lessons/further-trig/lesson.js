window.LESSON = {
  id: 'further-trig',
  description: 'Interactive maths lesson (Higher) on further trigonometry: sine, cosine and tangent of obtuse angles, the sine rule, the cosine rule, the area of a triangle ½ab sin C, Pythagoras and trigonometry in three dimensions, and the angle between a line and a plane. Draggable triangles, a 3D cuboid, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.8.',
  intro: 'SOHCAHTOA only works in right-angled triangles. In this Higher lesson you will extend trigonometry to <b>obtuse angles</b>, use the <b>sine rule</b> and the <b>cosine rule</b> in any triangle, find areas with <b>½ab sin C</b>, and solve problems in <b>three dimensions</b>.',
  hero: `<svg class="st-net ft-hero" viewBox="0 0 300 200" role="img" aria-label="A triangle with sides a, b and c and the cosine rule">
    <polygon points="40,160 260,160 190,40" class="ft-t"/>
    <path d="M190 40 L168.1 57.5 A28 28 0 0 0 204.1 64.2 Z" class="ft-y"><animate attributeName="opacity" values=".4;1;.4" dur="2.4s" repeatCount="indefinite"/></path>
    <text x="150" y="182" class="ft-l">c</text><text x="238" y="98" class="ft-l">a</text><text x="100" y="92" class="ft-l">b</text>
  </svg>`,
  parts: {
    A: { name: 'Any triangle' },
    B: { name: 'Area and three dimensions' },
  },
  sections: [
    { id: 'obtuse', part: 'A', name: 'Trigonometry of obtuse angles', short: 'Obtuse angles', icon: 'graph', color: '--c3', line: 'sin(180° − θ) = sin θ, cos(180° − θ) = −cos θ.', covers: ['H4.8A'] },
    { id: 'sinerule', part: 'A', name: 'The sine rule', short: 'Sine rule', icon: 'geometry', color: '--c1', line: 'a/sin A = b/sin B = c/sin C.', covers: ['H4.8C'] },
    { id: 'cosinerule', part: 'A', name: 'The cosine rule', short: 'Cosine rule', icon: 'geometry', color: '--c6', line: 'a² = b² + c² − 2bc cos A.', covers: ['H4.8C'] },
    { id: 'triarea', part: 'B', name: 'Area of a triangle: ½ab sin C', short: '½ab sin C', icon: 'shapes', color: '--c4', line: 'Two sides and the angle between them.', covers: ['H4.8E'] },
    { id: 'threed', part: 'B', name: 'Problems in three dimensions', short: '3D', icon: 'shapes', color: '--c8', line: 'Pythagoras in 3D and the angle between a line and a plane.', covers: ['H4.8D', 'H4.8F'] },
  ],
  scenes: ['obtuse', 'sinerule', 'cosinerule', 'testA', 'triarea', 'threed', 'testB'],
};
