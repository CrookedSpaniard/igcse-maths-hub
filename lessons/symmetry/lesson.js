window.LESSON = {
  id: 'symmetry',
  description: 'Interactive maths lesson on symmetry: lines of symmetry, rotational symmetry and its order, the symmetry of triangles, quadrilaterals and regular polygons, and completing symmetrical patterns. Animated folds and turns, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.3.',
  intro: 'A shape has <b>symmetry</b> when part of it is copied exactly. In this lesson you will <b>fold</b> shapes along mirror lines to find <b>lines of symmetry</b>, <b>turn</b> them to find the <b>order of rotational symmetry</b>, and <b>complete patterns</b> so that they are symmetrical.',
  hero: `<svg class="st-net sy-hero" viewBox="0 0 300 200" role="img" aria-label="A regular hexagon turning about its centre">
    <line x1="150" y1="12" x2="150" y2="188" class="sy-m"/>
    <g><polygon points="150,30 210,65 210,135 150,170 90,135 90,65" class="sy-s"/><polygon points="150,30 210,65 150,100" class="sy-y"/>
    <animateTransform attributeName="transform" type="rotate" values="0 150 100;0 150 100;60 150 100;60 150 100" keyTimes="0;.4;.7;1" dur="2.4s" repeatCount="indefinite"/></g>
  </svg>`,
  parts: {
    A: { name: 'Symmetry of shapes' },
    B: { name: 'Using symmetry' },
  },
  sections: [
    { id: 'line', part: 'A', name: 'Line symmetry', short: 'Line symmetry', icon: 'shapes', color: '--c2', line: 'Fold along a mirror line: the halves match exactly.' },
    { id: 'rotational', part: 'A', name: 'Rotational symmetry', short: 'Rotational', icon: 'shapes', color: '--c6', line: 'Turn the shape: how many times does it fit in one full turn?' },
    { id: 'complete', part: 'B', name: 'Completing symmetrical patterns', short: 'Patterns', icon: 'target', color: '--c9', line: 'Reflect squares in one or two mirror lines.' },
  ],
  scenes: ['line', 'rotational', 'testA', 'complete', 'testB'],
};
