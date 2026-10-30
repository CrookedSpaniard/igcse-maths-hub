window.LESSON = {
  id: 'measures-bearings',
  description: 'Interactive maths lesson on measures, scales and bearings: converting metric units of length, mass, capacity, area and volume, compound measures (speed and density), scale drawings and maps, and three-figure bearings. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.4.',
  intro: 'In this lesson you will <b>convert units</b> (including units of area and volume), use <b>compound measures</b> such as speed and density, work with <b>scale drawings and maps</b>, and find <b>three-figure bearings</b>.',
  hero: `<svg class="st-net mb-hero" viewBox="0 0 300 200" role="img" aria-label="A compass with a bearing line turning clockwise from north">
    <circle cx="150" cy="112" r="74" class="mb-c"/>
    <line x1="150" y1="112" x2="150" y2="30" class="mb-n"/><text x="150" y="24" class="mb-t">N</text>
    <line x1="150" y1="112" x2="150" y2="45" class="mb-b"><animateTransform attributeName="transform" type="rotate" values="0 150 112;130 150 112;130 150 112;0 150 112" keyTimes="0;.45;.8;1" dur="4s" repeatCount="indefinite"/></line>
    <circle cx="150" cy="112" r="5" class="mb-d"/>
  </svg>`,
  parts: {
    A: { name: 'Units and compound measures' },
    B: { name: 'Scales and bearings' },
  },
  sections: [
    { id: 'units', part: 'A', name: 'Converting units', short: 'Units', icon: 'calc', color: '--c1', line: 'Length, mass, capacity; then area and volume units.' },
    { id: 'compound', part: 'A', name: 'Speed and density', short: 'Speed & density', icon: 'calc', color: '--c5', line: 'Compound measures: speed = distance ÷ time, density = mass ÷ volume.' },
    { id: 'scale', part: 'B', name: 'Scale drawings and maps', short: 'Scales', icon: 'geometry', color: '--c3', line: 'Map scales such as 1 : 50 000 and scale drawings.' },
    { id: 'bearings', part: 'B', name: 'Bearings', short: 'Bearings', icon: 'target', color: '--c7', line: 'Measured from north, clockwise, with three figures.' },
  ],
  scenes: ['units', 'compound', 'testA', 'scale', 'bearings', 'testB'],
};
