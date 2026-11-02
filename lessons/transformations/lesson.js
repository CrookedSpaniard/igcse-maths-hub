window.LESSON = {
  id: 'transformations',
  description: 'Interactive maths lesson on transformations: translations by column vectors, reflections in lines such as x = 1, y = x and y = −x, rotations about a centre (anticlockwise positive, clockwise negative), enlargements by a scale factor, and for Higher tier fractional and negative scale factors, plus combined transformations and full descriptions. Animated grids, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 5.2.',
  intro: 'A <b>transformation</b> moves or changes a shape. In this lesson you will <b>translate</b> shapes with column vectors, <b>reflect</b> them in mirror lines, <b>rotate</b> them about a centre and <b>enlarge</b> them by a scale factor. You will also learn exactly what to write to <b>describe a transformation fully</b>. Higher tier students also use fractional and negative scale factors.',
  hero: `<svg class="st-net tf-hero" viewBox="0 0 300 200" role="img" aria-label="A triangle turning about a point">
    <line x1="20" y1="100" x2="280" y2="100" class="tf-h-ax"/><line x1="150" y1="10" x2="150" y2="190" class="tf-h-ax"/>
    <polygon points="170,80 230,80 170,40" class="tf-h-o"/>
    <polygon points="170,80 230,80 170,40" class="tf-h-i"><animateTransform attributeName="transform" type="rotate" values="0 150 100;0 150 100;-90 150 100;-90 150 100;0 150 100" keyTimes="0;.15;.5;.85;1" dur="5s" repeatCount="indefinite"/></polygon>
    <circle cx="150" cy="100" r="6" class="tf-h-c"/>
  </svg>`,
  parts: {
    A: { name: 'Moving shapes' },
    B: { name: 'Enlarging and describing' },
  },
  sections: [
    { id: 'translations', covers: ['F5.2F', 'F5.2G', 'F5.2H', 'F5.2I'], part: 'A', name: 'Translations', short: 'Translations', icon: 'geometry', color: '--c1', line: 'Slide every point by the same column vector.' },
    { id: 'reflections', covers: ['F5.2D', 'F5.2E', 'F5.2I'], part: 'A', name: 'Reflections', short: 'Reflections', icon: 'geometry', color: '--c3', line: 'Flip the shape over a mirror line.' },
    { id: 'rotations', covers: ['F5.2A', 'F5.2B', 'F5.2C', 'F5.2I'], part: 'A', name: 'Rotations', short: 'Rotations', icon: 'geometry', color: '--c6', line: 'Turn about a centre: anticlockwise is positive.' },
    { id: 'enlargement', covers: ['F5.2J', 'F5.2K', 'F5.2L'], part: 'B', name: 'Enlargements', short: 'Enlargements', icon: 'geometry', color: '--c8', line: 'A centre and a scale factor: same angles, new lengths.' },
    { id: 'enlarge-more', covers: ['F5.2J', 'F5.2L'], part: 'B', tier: 'H', name: 'Fractional and negative scale factors', short: 'Harder scale factors', icon: 'geometry', color: '--c5', line: 'Smaller with a fraction, upside down through the centre when negative.' },
    { id: 'describe', covers: ['F5.2M', 'F5.2I'], part: 'B', name: 'Describing and combining transformations', short: 'Describe fully', icon: 'target', color: '--c2', line: 'Name the transformation and give every detail it needs.' },
  ],
  scenes: ['translations', 'reflections', 'rotations', 'testA', 'enlargement', 'enlarge-more', 'describe', 'testB'],
};
