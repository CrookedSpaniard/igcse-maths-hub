FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['prisms', 'A cuboid is 8 cm by 5 cm by 2 cm. Its volume is…', ['\\(80\\ \\text{cm}^3\\)', '\\(15\\ \\text{cm}^3\\)', '\\(132\\ \\text{cm}^3\\)', '\\(40\\ \\text{cm}^3\\)'], '\\(8 \\times 5 \\times 2\\).', 'prisms'],
    ['prisms', 'A prism has cross-section area \\(15\\ \\text{cm}^2\\) and length 4 cm. Its volume is…', ['\\(60\\ \\text{cm}^3\\)', '\\(19\\ \\text{cm}^3\\)', '\\(30\\ \\text{cm}^3\\)', '\\(225\\ \\text{cm}^3\\)'], '\\(15 \\times 4\\).', 'prisms'],
    ['prisms', 'A cylinder has radius 5 cm and height 2 cm. Its volume is…', ['\\(50\\pi\\ \\text{cm}^3\\)', '\\(20\\pi\\ \\text{cm}^3\\)', '\\(100\\pi\\ \\text{cm}^3\\)', '\\(10\\pi\\ \\text{cm}^3\\)'], '\\(\\pi \\times 25 \\times 2\\).', 'prisms'],
    ['prisms', 'A cube has volume \\(64\\ \\text{cm}^3\\). Each edge is…', ['4 cm', '8 cm', '16 cm', '21.3 cm'], '\\(4^3 = 64\\).', 'prisms'],
    ['prisms', 'A triangular prism has a triangle of base 6 cm, height 4 cm, and length 5 cm. Its volume is…', ['\\(60\\ \\text{cm}^3\\)', '\\(120\\ \\text{cm}^3\\)', '\\(15\\ \\text{cm}^3\\)', '\\(30\\ \\text{cm}^3\\)'], '\\(\\tfrac12 \\times 6 \\times 4 \\times 5\\).', 'prisms'],
    ['volunits', '\\(5\\ \\text{cm}^3\\) in \\(\\text{mm}^3\\) is…', ['5000', '500', '50', '0.005'], '\\(\\times 1000\\).', 'volunits'],
    ['volunits', '\\(2500\\ \\text{cm}^3\\) is…', ['2.5 litres', '25 litres', '0.25 litres', '250 litres'], '\\(\\div 1000\\).', 'volunits'],
    ['volunits', '\\(1\\ \\text{m}^3\\) holds…', ['1000 litres', '100 litres', '1 litre', '1 000 000 litres'], '\\(1\\,000\\,000\\ \\text{cm}^3 \\div 1000\\).', 'volunits'],
  ],
  LONG: [
    { q: 'A cylindrical water tank has radius \\(0.4\\) m and height \\(1.2\\) m. Work out how many litres of water it holds when full. Give your answer to the nearest litre.', m: 4, s: ['M1 for \\(\\pi \\times 0.4^2 \\times 1.2\\).', 'A1 for \\(0.6031…\\ \\text{m}^3\\).', 'M1 for \\(\\times 1000\\) (1 m³ = 1000 litres).', 'A1 for 603 litres.'], link: ['volunits', 'See capacity again'] },
    { q: 'A swimming pool is a prism. Its cross-section is a trapezium with parallel sides \\(1\\) m and \\(2.5\\) m, \\(20\\) m apart. The pool is \\(8\\) m wide. Work out the volume of the pool.', m: 3, s: ['M1 for \\(\\tfrac12(1 + 2.5) \\times 20 = 35\\ \\text{m}^2\\).', 'M1 for \\(35 \\times 8\\).', 'A1 for \\(280\\ \\text{m}^3\\).'], link: ['prisms', 'See any prism again'] },
    { q: 'A cuboid box is \\(12\\) cm by \\(10\\) cm by \\(8\\) cm. It is filled with water from a cylinder of radius \\(3\\) cm and height \\(15\\) cm, which is full. Does all the water fit in the box? Show your working.', m: 3, s: ['M1 for \\(12 \\times 10 \\times 8 = 960\\).', 'M1 for \\(\\pi \\times 3^2 \\times 15 = 424.1…\\).', 'A1 Yes, with both volumes correct.'], link: ['prisms', 'See cylinders again'] },
  ],
});
