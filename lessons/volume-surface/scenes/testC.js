FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['conesphere', 'The volume of a cone is…', ['\\(\\tfrac13 \\pi r^2 h\\)', '\\(\\pi r^2 h\\)', '\\(\\pi r l\\)', '\\(\\tfrac43 \\pi r^3\\)'], 'One third of the cylinder.', 'conesphere'],
    ['conesphere', 'A sphere has radius 3 cm. Its volume is…', ['\\(36\\pi\\ \\text{cm}^3\\)', '\\(12\\pi\\ \\text{cm}^3\\)', '\\(108\\pi\\ \\text{cm}^3\\)', '\\(27\\pi\\ \\text{cm}^3\\)'], '\\(\\tfrac43 \\times 27\\).', 'conesphere'],
    ['conesphere', 'A cone has radius 6 cm and vertical height 8 cm. Its slant height is…', ['10 cm', '14 cm', '5.3 cm', '100 cm'], '\\(\\sqrt{36 + 64}\\).', 'conesphere'],
    ['conesphere', 'A cone has \\(r = 5\\) cm and \\(l = 13\\) cm. Its curved surface area is…', ['\\(65\\pi\\ \\text{cm}^2\\)', '\\(25\\pi\\ \\text{cm}^2\\)', '\\(90\\pi\\ \\text{cm}^2\\)', '\\(130\\pi\\ \\text{cm}^2\\)'], '\\(\\pi \\times 5 \\times 13\\).', 'conesphere'],
    ['conesphere', 'A sphere has radius 5 cm. Its surface area is…', ['\\(100\\pi\\ \\text{cm}^2\\)', '\\(25\\pi\\ \\text{cm}^2\\)', '\\(20\\pi\\ \\text{cm}^2\\)', '\\(\\tfrac{500}{3}\\pi\\ \\text{cm}^2\\)'], '\\(4 \\times 25\\).', 'conesphere'],
    ['conesphere', 'A pyramid has base area \\(24\\ \\text{cm}^2\\) and height 5 cm. Its volume is…', ['\\(40\\ \\text{cm}^3\\)', '\\(120\\ \\text{cm}^3\\)', '\\(60\\ \\text{cm}^3\\)', '\\(29\\ \\text{cm}^3\\)'], '\\(\\tfrac13 \\times 24 \\times 5\\).', 'conesphere'],
    ['conesphere', 'Doubling the radius of a sphere multiplies its volume by…', ['8', '2', '4', '6'], '\\(2^3\\).', 'conesphere'],
  ],
  LONG: [
    { q: 'A solid metal sphere has radius \\(6\\) cm. It is melted down and recast as a cone with base radius \\(6\\) cm. Work out the vertical height of the cone.', m: 3, s: ['M1 for \\(\\tfrac43 \\pi \\times 6^3 = 288\\pi\\).', 'M1 for \\(\\tfrac13 \\pi \\times 6^2 \\times h = 288\\pi\\).', 'A1 for \\(h = 24\\) cm.'], link: ['conesphere', 'See cones and spheres again'] },
    { q: 'A solid is made from a hemisphere of radius \\(4\\) cm on top of a cylinder of radius \\(4\\) cm and height \\(10\\) cm. Work out the volume of the solid. Give your answer to 3 significant figures.', m: 4, s: ['M1 for \\(\\pi \\times 4^2 \\times 10 = 160\\pi\\).', 'M1 for \\(\\tfrac12 \\times \\tfrac43 \\pi \\times 4^3 = \\tfrac{128}{3}\\pi\\).', 'M1 for adding.', 'A1 for \\(637\\ \\text{cm}^3\\).'], link: ['conesphere', 'See hemispheres again'] },
    { q: 'A solid cone has base radius \\(5\\) cm and vertical height \\(12\\) cm. Work out its total surface area. Give your answer in terms of \\(\\pi\\).', m: 3, s: ['M1 for \\(l = \\sqrt{5^2 + 12^2} = 13\\).', 'M1 for \\(\\pi \\times 5 \\times 13 + \\pi \\times 5^2\\).', 'A1 for \\(90\\pi\\ \\text{cm}^2\\).'], link: ['conesphere', 'See the surface area of a cone again'] },
  ],
});
