window.LESSON = {
  id: 'pythagoras-trig',
  description: "Interactive maths lesson on right-angled triangles: Pythagoras' theorem, distances between points, sine, cosine and tangent (SOHCAHTOA) to find lengths and angles, problems in two dimensions, and angles of elevation and depression. Animated proofs, a rotating triangle, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.8.",
  intro: "Every right-angled triangle hides two powerful tools. <b>Pythagoras' theorem</b> links the three sides. <b>Trigonometry</b> (sine, cosine and tangent) links the sides with the angles. You will use both to solve problems, and Higher students will meet <b>angles of elevation and depression</b>.",
  hero: `<svg class="st-net pt-hero" viewBox="0 0 300 200" role="img" aria-label="Squares on the three sides of a right-angled triangle">
    <polygon points="110,140 170,140 110,60" class="pt-t"/>
    <rect x="110" y="140" width="60" height="60" class="pt-s"/><rect x="30" y="60" width="80" height="80" class="pt-s"/>
    <polygon points="110,60 170,140 250,80 190,0" class="pt-y"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" repeatCount="indefinite"/></polygon>
    <text x="180" y="62" class="pt-l">c²</text>
  </svg>`,
  parts: {
    A: { name: "Pythagoras' theorem" },
    B: { name: 'Trigonometry' },
    C: { name: 'Elevation and depression', tier: 'H' },
  },
  sections: [
    { id: 'pythagoras', part: 'A', name: "Pythagoras' theorem", short: 'Pythagoras', icon: 'geometry', color: '--c1', line: 'a² + b² = c²: find the hypotenuse or a shorter side.', covers: ['F4.8A'] },
    { id: 'pythapps', part: 'A', name: 'Using Pythagoras in problems', short: 'Problems', icon: 'target', color: '--c3', line: 'Distances between points, ladders, rectangles and isosceles triangles.', covers: ['F4.8A', 'F4.8C'] },
    { id: 'sohcahtoa', part: 'B', name: 'Finding lengths with SOHCAHTOA', short: 'Trig: lengths', icon: 'geometry', color: '--c6', line: 'Label opp, adj, hyp; choose sin, cos or tan.', covers: ['F4.8B', 'F4.8C'] },
    { id: 'trigangles', part: 'B', name: 'Finding angles with inverse trig', short: 'Trig: angles', icon: 'geometry', color: '--c2', line: 'Use sin⁻¹, cos⁻¹ and tan⁻¹ on your calculator.', covers: ['F4.8B', 'F4.8C'] },
    { id: 'elevation', part: 'C', name: 'Angles of elevation and depression', short: 'Elevation', icon: 'target', color: '--c8', line: 'Up from the horizontal, or down from it.', covers: ['H4.8B'] },
  ],
  scenes: ['pythagoras', 'pythapps', 'testA', 'sohcahtoa', 'trigangles', 'testB', 'elevation', 'testC'],
};
