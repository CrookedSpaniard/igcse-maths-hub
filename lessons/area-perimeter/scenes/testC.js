FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['sectors', 'A sector has angle \\(45^\\circ\\). It is what fraction of the circle?', ['\\(\\tfrac18\\)', '\\(\\tfrac14\\)', '\\(\\tfrac{1}{45}\\)', '\\(\\tfrac16\\)'], '\\(45 \\div 360\\).', 'sectors'],
    ['sectors', 'Radius 12 cm, angle \\(30^\\circ\\). The arc length is…', ['6.28 cm', '37.7 cm', '3.14 cm', '12.6 cm'], '\\(\\tfrac{1}{12} \\times 24\\pi\\).', 'sectors'],
    ['sectors', 'Radius 4 cm, angle \\(90^\\circ\\). The area of the sector is…', ['\\(4\\pi\\ \\text{cm}^2\\)', '\\(16\\pi\\ \\text{cm}^2\\)', '\\(2\\pi\\ \\text{cm}^2\\)', '\\(8\\pi\\ \\text{cm}^2\\)'], '\\(\\tfrac14 \\times 16\\pi\\).', 'sectors'],
    ['sectors', 'Radius 5 cm, arc length 7 cm. The perimeter of the sector is…', ['17 cm', '12 cm', '7 cm', '22 cm'], '\\(7 + 5 + 5\\).', 'sectors'],
    ['sectors', 'The formula for the area of a sector is…', ['\\(\\frac{\\theta}{360} \\times \\pi r^2\\)', '\\(\\frac{\\theta}{360} \\times 2\\pi r\\)', '\\(\\frac{360}{\\theta} \\times \\pi r^2\\)', '\\(\\theta \\times \\pi r^2\\)'], 'A fraction of \\(\\pi r^2\\).', 'sectors'],
    ['sectors', 'Radius 9 cm, angle \\(200^\\circ\\). The area of the sector is…', ['\\(141.4\\ \\text{cm}^2\\)', '\\(31.4\\ \\text{cm}^2\\)', '\\(254.5\\ \\text{cm}^2\\)', '\\(70.7\\ \\text{cm}^2\\)'], '\\(\\tfrac{200}{360} \\times 81\\pi\\).', 'sectors'],
    ['sectors', 'A sector of radius 10 cm has area \\(25\\pi\\ \\text{cm}^2\\). Its angle is…', ['\\(90^\\circ\\)', '\\(25^\\circ\\)', '\\(45^\\circ\\)', '\\(180^\\circ\\)'], '\\(\\frac{25\\pi}{100\\pi} = \\tfrac14\\).', 'sectors'],
  ],
  LONG: [
    { q: 'A sector of a circle has radius \\(9\\) cm and angle \\(80^\\circ\\). Work out the perimeter of the sector. Give your answer to 3 significant figures.', m: 3, s: ['M1 for \\(\\tfrac{80}{360} \\times 2 \\times \\pi \\times 9\\) (\\(= 12.56…\\)).', 'M1 for adding \\(9 + 9\\).', 'A1 for \\(30.6\\) cm.'], link: ['sectors', 'See the perimeter of a sector again'] },
    { q: 'A sector has radius \\(r\\) cm and angle \\(72^\\circ\\). Its area is \\(20\\pi\\ \\text{cm}^2\\). Work out the value of \\(r\\).', m: 3, s: ['M1 for \\(\\tfrac{72}{360} \\times \\pi r^2 = 20\\pi\\).', 'M1 for \\(r^2 = 100\\).', 'A1 for \\(r = 10\\).'], link: ['sectors', 'See working backwards again'] },
    { q: 'A fan is the shape of a sector of a circle of radius \\(25\\) cm with angle \\(150^\\circ\\). A smaller sector of radius \\(10\\) cm with the same centre and angle is cut out. Work out the area of the fan that is left, to 3 significant figures.', m: 4, s: ['M1 for \\(\\tfrac{150}{360} \\times \\pi \\times 25^2\\) (\\(= 818.1…\\)).', 'M1 for \\(\\tfrac{150}{360} \\times \\pi \\times 10^2\\) (\\(= 130.8…\\)).', 'M1 for subtracting.', 'A1 for \\(687\\ \\text{cm}^2\\).'], link: ['sectors', 'See the area of a sector again'] },
  ],
});
