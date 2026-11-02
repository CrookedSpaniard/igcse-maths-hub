window.LESSON = {
  id: 'volume-surface',
  description: 'Interactive maths lesson on 3D solids: names of solids, faces, edges and vertices, nets and surface area of cuboids, prisms and cylinders, volume of prisms and cylinders, volume units and capacity, and (Higher) volume and surface area of pyramids, cones and spheres. Rotatable-style 3D drawings, nets, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.10.',
  intro: 'Boxes, tins, pipes and balls are all <b>3D solids</b>. In this lesson you will name solids and count their <b>faces, edges and vertices</b>, unfold them into <b>nets</b> to find their <b>surface area</b>, and fill them up to find their <b>volume</b>. Higher students will also work with <b>pyramids, cones and spheres</b>.',
  hero: `<svg class="st-net vs-hero" viewBox="0 0 300 200" role="img" aria-label="A cuboid and a cylinder">
    <polygon points="40,170 140,170 140,90 40,90" class="vs-s"/><polygon points="40,90 140,90 175,60 75,60" class="vs-s"/><polygon points="140,170 175,140 175,60 140,90" class="vs-s"/>
    <ellipse cx="230" cy="160" rx="40" ry="13" class="vs-y"/><rect x="190" y="60" width="80" height="100" class="vs-y" stroke="none"/><line x1="190" y1="60" x2="190" y2="160" class="vs-e"/><line x1="270" y1="60" x2="270" y2="160" class="vs-e"/>
    <ellipse cx="230" cy="60" rx="40" ry="13" class="vs-t"><animate attributeName="opacity" values=".5;1;.5" dur="2.4s" repeatCount="indefinite"/></ellipse>
    <text x="90" y="132" class="vs-l">V</text>
  </svg>`,
  parts: {
    A: { name: 'Solids and surface area' },
    B: { name: 'Volume' },
    C: { name: 'Pyramids, cones and spheres', tier: 'H' },
  },
  sections: [
    { id: 'solids', part: 'A', name: 'Naming solids: faces, edges and vertices', short: '3D solids', icon: 'shapes', color: '--c2', line: 'Prisms, pyramids, cylinders, cones and spheres.', covers: ['F4.10A', 'F4.10B'] },
    { id: 'surface', part: 'A', name: 'Nets and surface area', short: 'Surface area', icon: 'shapes', color: '--c5', line: 'Unfold the solid and add the areas of all its faces.', covers: ['F4.10C', 'F4.10D'] },
    { id: 'prisms', part: 'B', name: 'Volume of prisms and cylinders', short: 'Volume', icon: 'geometry', color: '--c8', line: 'Area of the cross-section × length.', covers: ['F4.10E'] },
    { id: 'volunits', part: 'B', name: 'Volume units and capacity', short: 'Volume units', icon: 'target', color: '--c1', line: '1 cm³ = 1000 mm³; 1 litre = 1000 cm³.', covers: ['F4.10F'] },
    { id: 'conesphere', part: 'C', name: 'Pyramids, cones and spheres', short: 'Cones and spheres', icon: 'geometry', color: '--c6', line: '⅓ × base × height; 4/3 πr³ and 4πr².', covers: ['H4.10A'] },
  ],
  scenes: ['solids', 'surface', 'testA', 'prisms', 'volunits', 'testB', 'conesphere', 'testC'],
};
