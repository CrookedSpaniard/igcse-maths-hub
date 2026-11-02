FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['solids', 'How many faces does a cube have?', ['6', '8', '12', '4'], 'Six squares.', 'solids'],
    ['solids', 'How many vertices does a triangular prism have?', ['6', '5', '9', '3'], '3 at each end.', 'solids'],
    ['solids', 'How many edges does a square-based pyramid have?', ['8', '5', '4', '12'], '4 round the base and 4 up to the apex.', 'solids'],
    ['solids', 'A solid with one circular face, one curved face and an apex is a…', ['cone', 'cylinder', 'sphere', 'pyramid'], 'That is a cone.', 'solids'],
    ['solids', 'A solid has 7 faces and 10 vertices. Using \\(F + V - E = 2\\), it has…', ['15 edges', '17 edges', '5 edges', '19 edges'], '\\(7 + 10 - 2\\).', 'solids'],
    ['surface', 'The surface area of a 6 cm by 2 cm by 1 cm cuboid is…', ['\\(40\\ \\text{cm}^2\\)', '\\(12\\ \\text{cm}^2\\)', '\\(20\\ \\text{cm}^2\\)', '\\(24\\ \\text{cm}^2\\)'], '\\(2(12 + 6 + 2)\\).', 'surface'],
    ['surface', 'A cube has surface area \\(96\\ \\text{cm}^2\\). Each edge is…', ['4 cm', '16 cm', '8 cm', '6 cm'], '\\(96 \\div 6 = 16 = 4^2\\).', 'surface'],
    ['surface', 'The curved surface area of a cylinder is…', ['\\(2\\pi rh\\)', '\\(\\pi r^2 h\\)', '\\(2\\pi r^2\\)', '\\(\\pi rh\\)'], 'Circumference × height.', 'surface'],
  ],
  LONG: [
    { q: 'A closed box is a cuboid \\(30\\) cm long, \\(20\\) cm wide and \\(15\\) cm high. Card costs \\(0.2\\)p per square centimetre. Work out the cost of the card needed to make the box. Give your answer in pounds.', m: 4, s: ['M1 for one correct face area, e.g. \\(30 \\times 20 = 600\\).', 'M1 for \\(2(600 + 450 + 300)\\).', 'A1 for \\(2700\\ \\text{cm}^2\\).', 'B1ft for \\(2700 \\times 0.2 = 540\\)p \\(= £5.40\\).'], link: ['surface', 'See the surface area of a cuboid again'] },
    { q: 'A closed cylinder has radius \\(4\\) cm and height \\(9\\) cm. Work out its total surface area. Give your answer in terms of \\(\\pi\\).', m: 3, s: ['M1 for \\(2 \\times \\pi \\times 4^2 = 32\\pi\\).', 'M1 for \\(2 \\times \\pi \\times 4 \\times 9 = 72\\pi\\).', 'A1 for \\(104\\pi\\ \\text{cm}^2\\).'], link: ['surface', 'See the cylinder net again'] },
    { q: 'A solid has 6 vertices and 9 edges. All its faces are flat. (a) How many faces does it have? (b) Name a solid that fits this description.', m: 2, s: ['B1 (a) \\(F = 2 + 9 - 6 = 5\\).', 'B1 (b) a triangular prism.'], link: ['solids', 'See faces, edges and vertices again'] },
  ],
});
