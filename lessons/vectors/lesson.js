window.LESSON = {
  id: 'vectors',
  description: 'Interactive maths lesson on vectors (Higher tier): magnitude and direction, vector notation and column vectors, multiplying by a scalar, the modulus, adding and subtracting vectors, resultants and simple geometric proofs with vectors. Animated arrows on a grid, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 5.1.',
  intro: 'A <b>vector</b> has a size <i>and</i> a direction, so we draw it as an arrow. In this lesson you will write vectors as <b>column vectors</b>, <b>multiply</b> them by numbers, find their <b>length</b> (the modulus), <b>add and subtract</b> them nose to tail, and use vector paths to <b>prove</b> that lines are parallel or that points lie on a straight line.',
  hero: `<svg class="st-net ve-hero" viewBox="0 0 300 200" role="img" aria-label="Two arrows added nose to tail with their resultant">
    <g class="ve-h-a"><line x1="40" y1="160" x2="132" y2="68"/><polygon points="140,60 124,68 132,76"/></g>
    <g class="ve-h-b"><line x1="140" y1="60" x2="246" y2="128"/><polygon points="256,134 242,133 250,122"/></g>
    <g class="ve-h-r"><line x1="40" y1="160" x2="242" y2="137"><animate attributeName="x2" values="40;242;242" keyTimes="0;.6;1" dur="3s" repeatCount="indefinite"/><animate attributeName="y2" values="160;137;137" keyTimes="0;.6;1" dur="3s" repeatCount="indefinite"/></line></g>
    <text x="74" y="100" class="ve-h-t">a</text><text x="206" y="80" class="ve-h-t">b</text><text x="150" y="176" class="ve-h-t">a + b</text>
  </svg>`,
  parts: {
    A: { name: 'Describing vectors' },
    B: { name: 'Combining vectors' },
  },
  sections: [
    { id: 'notation', covers: ['H5.1A', 'H5.1B'], part: 'A', name: 'Vectors and column vectors', short: 'Notation', icon: 'vector', color: '--c1', line: 'Size and direction: an arrow, written as a column.' },
    { id: 'scalar', covers: ['H5.1C'], part: 'A', name: 'Multiplying by a scalar', short: 'Scalar multiples', icon: 'vector', color: '--c3', line: 'Multiply both numbers: same direction, new length.' },
    { id: 'modulus', covers: ['H5.1E'], part: 'A', name: 'The modulus of a vector', short: 'Modulus', icon: 'vector', color: '--c6', line: 'The length of the arrow, by Pythagoras.' },
    { id: 'add-subtract', covers: ['H5.1D', 'H5.1F'], part: 'B', name: 'Adding, subtracting and resultants', short: 'Add & subtract', icon: 'vector', color: '--c8', line: 'Nose to tail: the resultant goes from start to finish.' },
    { id: 'proof', covers: ['H5.1G'], part: 'B', name: 'Vector geometry and proof', short: 'Proof', icon: 'target', color: '--c2', line: 'Paths round a shape prove lines parallel or points in a line.' },
  ],
  scenes: ['notation', 'scalar', 'modulus', 'testA', 'add-subtract', 'proof', 'testB'],
};
