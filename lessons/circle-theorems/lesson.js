window.LESSON = {
  id: 'circle-theorems',
  description: 'Interactive maths lesson on circle properties and circle theorems: the parts of a circle, chord and tangent properties, the angle at the centre, the angle in a semicircle, angles in the same segment, cyclic quadrilaterals, the alternate segment theorem and intersecting chords. Draggable diagrams, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.6.',
  intro: 'Circles have their own vocabulary and their own angle facts. First learn the <b>parts of a circle</b> and the <b>chord and tangent properties</b>. Higher students then drag points round the circle to discover the <b>circle theorems</b>: angles at the centre, in a semicircle, in the same segment, in <b>cyclic quadrilaterals</b>, the <b>alternate segment theorem</b> and <b>intersecting chords</b>.',
  hero: `<svg class="st-net ct-hero" viewBox="0 0 300 200" role="img" aria-label="An angle at the centre of a circle, twice the angle at the circumference">
    <circle cx="150" cy="105" r="80" class="ct-c"/>
    <g><path d="M150 105 L80.7 145 M150 105 L219.3 145" class="ct-l"/><path d="M150 105 L130 116.5 A23 23 0 0 0 170 116.5 Z" class="ct-y"/></g>
    <g><path d="M80.7 145 L150 25 L219.3 145" class="ct-l"/><circle cx="150" cy="25" r="5" class="ct-d"><animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/></circle></g>
  </svg>`,
  parts: {
    A: { name: 'Circle facts' },
    B: { name: 'Circle theorems', tier: 'H' },
  },
  sections: [
    { id: 'parts', part: 'A', name: 'Parts of a circle', short: 'Parts', icon: 'geometry', color: '--c1', line: 'Radius, diameter, chord, arc, sector, segment, tangent.', covers: ['F4.6A'] },
    { id: 'tangents', part: 'A', name: 'Chord and tangent properties', short: 'Chords & tangents', icon: 'geometry', color: '--c4', line: 'Tangent ⟂ radius, equal tangents, perpendicular bisector of a chord.', covers: ['F4.6B'] },
    { id: 'centre', part: 'B', name: 'Angles at the centre and circumference', short: 'Centre & segment', icon: 'target', color: '--c6', line: 'Twice the angle, angle in a semicircle, same segment.', covers: ['H4.6C'] },
    { id: 'cyclic', part: 'B', name: 'Cyclic quadrilaterals and the alternate segment', short: 'Cyclic & alternate', icon: 'shapes', color: '--c2', line: 'Opposite angles add to 180°; tangent–chord angle.', covers: ['H4.6B', 'H4.6C'] },
    { id: 'intersect', part: 'B', name: 'Intersecting chords', short: 'Intersecting chords', icon: 'geometry', color: '--c8', line: 'AP × PB = CP × PD, inside or outside the circle.', covers: ['H4.6A'] },
  ],
  scenes: ['parts', 'tangents', 'testA', 'centre', 'cyclic', 'intersect', 'testB'],
};
