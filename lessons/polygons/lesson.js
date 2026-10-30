window.LESSON = {
  id: 'polygons',
  description: 'Interactive maths lesson on polygons: properties of quadrilaterals, the angle sum of a quadrilateral, interior and exterior angles of polygons and regular polygons. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.2.',
  intro: 'A <b>polygon</b> is a flat shape with straight sides. In this lesson you will learn the <b>properties of quadrilaterals</b>, find the <b>sum of the interior angles</b> of any polygon, and use <b>exterior angles</b> to solve problems about <b>regular polygons</b>.',
  hero: `<svg class="st-net pg-hero" viewBox="0 0 300 200" role="img" aria-label="A regular hexagon split into four triangles from one corner">
    <polygon points="150,20 222,60 222,140 150,180 78,140 78,60" class="pg-s"/>
    ${[[222, 60, 222, 140], [222, 140, 150, 180], [150, 180, 78, 140]].map(([x1, y1, x2, y2], i) => `<polygon points="150,20 ${x1},${y1} ${x2},${y2}" class="pg-t"><animate attributeName="opacity" values=".15;.9;.15" dur="3s" begin="${i * .5}s" repeatCount="indefinite"/></polygon>`).join('')}
    <polygon points="150,20 78,140 78,60" class="pg-t"><animate attributeName="opacity" values=".15;.9;.15" dur="3s" begin="1.5s" repeatCount="indefinite"/></polygon>
    <text x="255" y="105" class="pg-l">720°</text>
  </svg>`,
  parts: {
    A: { name: 'Quadrilaterals' },
    B: { name: 'Angles in polygons' },
  },
  sections: [
    { id: 'quads', part: 'A', name: 'Properties of quadrilaterals', short: 'Quadrilaterals', icon: 'shapes', color: '--c2', line: 'Squares, rectangles, parallelograms, rhombuses, kites and trapeziums.' },
    { id: 'quadangles', part: 'A', name: 'Angles in quadrilaterals', short: 'Quad angles', icon: 'geometry', color: '--c5', line: 'The angles add up to 360°; use the properties to find more.' },
    { id: 'interior', part: 'B', name: 'Interior angles of polygons', short: 'Interior angles', icon: 'shapes', color: '--c7', line: 'Split into triangles: sum = (n − 2) × 180°.' },
    { id: 'exterior', part: 'B', name: 'Exterior angles and regular polygons', short: 'Exterior angles', icon: 'geometry', color: '--c3', line: 'Exterior angles add up to 360°.' },
  ],
  scenes: ['quads', 'quadangles', 'testA', 'interior', 'exterior', 'testB'],
};
