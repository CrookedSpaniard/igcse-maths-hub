window.LESSON = {
  id: 'area-perimeter',
  description: 'Interactive maths lesson on perimeter and area: perimeters of compound shapes, areas of rectangles, triangles, parallelograms and trapezia, compound areas, area units, circumference and area of circles and semicircles, and (Higher) arc lengths and areas of sectors. Animated rearrangements, adjustable shapes, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.9.',
  intro: 'How far is it <b>around</b> a shape, and how much <b>space</b> is inside it? In this lesson you will find <b>perimeters</b> and <b>areas</b> of shapes made from rectangles and triangles, see <i>why</i> the area formulae work, and use \\(\\pi\\) for <b>circles</b>. Higher students will also find <b>arc lengths</b> and <b>areas of sectors</b>.',
  hero: `<svg class="st-net ap-hero" viewBox="0 0 300 200" role="img" aria-label="A trapezium and a circle with a shaded sector">
    <polygon points="30,160 150,160 120,70 60,70" class="ap-s"/>
    <circle cx="215" cy="110" r="58" class="ap-s"/>
    <path d="M215 110 L273 110 A58 58 0 0 0 186 59.8 Z" class="ap-y"><animate attributeName="opacity" values=".4;1;.4" dur="2.6s" repeatCount="indefinite"/></path>
    <text x="90" y="125" class="ap-l">A</text><text x="236" y="94" class="ap-l2">θ</text>
  </svg>`,
  parts: {
    A: { name: 'Perimeter and area of polygons' },
    B: { name: 'Circles' },
    C: { name: 'Arcs and sectors', tier: 'H' },
  },
  sections: [
    { id: 'perimeter', part: 'A', name: 'Perimeter', short: 'Perimeter', icon: 'shapes', color: '--c1', line: 'Add every side; find missing sides of compound shapes first.', covers: ['F4.9B'] },
    { id: 'areas', part: 'A', name: 'Areas of triangles and quadrilaterals', short: 'Area formulae', icon: 'shapes', color: '--c4', line: 'Rectangles, triangles, parallelograms and trapezia.', covers: ['F4.9C', 'F4.9D'] },
    { id: 'compound', part: 'A', name: 'Compound areas and area units', short: 'Compound areas', icon: 'target', color: '--c7', line: 'Split up or subtract; 1 cm² = 100 mm².', covers: ['F4.9A', 'F4.9B', 'F4.9C'] },
    { id: 'circles', part: 'B', name: 'Circumference and area of a circle', short: 'Circles', icon: 'geometry', color: '--c6', line: 'C = πd and A = πr²; semicircles too.', covers: ['F4.9E'] },
    { id: 'sectors', part: 'C', name: 'Arc length and area of a sector', short: 'Sectors', icon: 'geometry', color: '--c3', line: 'A fraction θ/360 of the whole circle.', covers: ['H4.9A'] },
  ],
  scenes: ['perimeter', 'areas', 'compound', 'testA', 'circles', 'testB', 'sectors', 'testC'],
};
