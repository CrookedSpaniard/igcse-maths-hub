FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['perimeter', 'A rectangle is 12 cm by 4.5 cm. Its perimeter is…', ['33 cm', '54 cm', '16.5 cm', '28.5 cm'], '\\(2 \\times (12 + 4.5)\\).', 'perimeter'],
    ['perimeter', 'A square has a perimeter of 28 cm. Each side is…', ['7 cm', '14 cm', '4 cm', '5.3 cm'], '\\(28 \\div 4\\).', 'perimeter'],
    ['perimeter', 'An L-shape fits exactly inside a 9 cm by 6 cm rectangle, touching all four sides. Its perimeter is…', ['30 cm', '54 cm', '15 cm', 'impossible to tell'], 'Same as the rectangle: \\(2 \\times (9 + 6)\\).', 'perimeter'],
    ['areas', 'A triangle has base 12 cm and perpendicular height 5 cm. Its area is…', ['\\(30\\ \\text{cm}^2\\)', '\\(60\\ \\text{cm}^2\\)', '\\(17\\ \\text{cm}^2\\)', '\\(34\\ \\text{cm}^2\\)'], '\\(\\tfrac12 \\times 12 \\times 5\\).', 'areas'],
    ['areas', 'A parallelogram has base 7 cm and perpendicular height 6 cm. Its area is…', ['\\(42\\ \\text{cm}^2\\)', '\\(21\\ \\text{cm}^2\\)', '\\(26\\ \\text{cm}^2\\)', '\\(13\\ \\text{cm}^2\\)'], '\\(b \\times h\\).', 'areas'],
    ['areas', 'A trapezium has parallel sides 6 cm and 9 cm, 4 cm apart. Its area is…', ['\\(30\\ \\text{cm}^2\\)', '\\(60\\ \\text{cm}^2\\)', '\\(216\\ \\text{cm}^2\\)', '\\(19\\ \\text{cm}^2\\)'], '\\(\\tfrac12 \\times 15 \\times 4\\).', 'areas'],
    ['areas', 'In \\(A = \\tfrac12 bh\\) for a triangle, \\(h\\) is…', ['the height at right angles to the base', 'the longest side', 'any sloping side', 'half the base'], 'Perpendicular height.', 'areas'],
    ['compound', 'A 10 m by 8 m rectangle has a 3 m by 2 m corner removed. The area left is…', ['\\(74\\ \\text{m}^2\\)', '\\(86\\ \\text{m}^2\\)', '\\(75\\ \\text{m}^2\\)', '\\(36\\ \\text{m}^2\\)'], '\\(80 - 6\\).', 'compound'],
    ['compound', '\\(5\\ \\text{cm}^2\\) in \\(\\text{mm}^2\\) is…', ['500', '50', '5000', '0.05'], '\\(\\times 100\\).', 'compound'],
    ['compound', '\\(25\\,000\\ \\text{cm}^2\\) in \\(\\text{m}^2\\) is…', ['2.5', '250', '25', '0.25'], '\\(\\div 10\\,000\\).', 'compound'],
  ],
  LONG: [
    { q: 'A garden is a rectangle 14 m by 9 m. A rectangular pond 4 m by 2.5 m is dug in the garden, and the rest is grass. Grass seed costs £3.50 per square metre. Work out the cost of seed for the grass.', m: 4, s: ['M1 for \\(14 \\times 9 = 126\\).', 'M1 for \\(126 - 4 \\times 2.5\\).', 'A1 for \\(116\\ \\text{m}^2\\).', 'B1ft for \\(116 \\times 3.50 = £406\\).'], link: ['compound', 'See subtracting areas again'] },
    { q: 'A trapezium has parallel sides of \\(x\\) cm and \\(12\\) cm. The perpendicular distance between them is \\(8\\) cm. Its area is \\(76\\ \\text{cm}^2\\). Work out the value of \\(x\\).', m: 3, s: ['M1 for \\(\\tfrac12(x + 12) \\times 8 = 76\\).', 'M1 for \\(x + 12 = 19\\).', 'A1 for \\(x = 7\\).'], link: ['areas', 'See the trapezium again'] },
    { q: 'A shape is made from a square of side \\(6\\) cm and an isosceles triangle with base \\(6\\) cm and sloping sides of \\(5\\) cm, joined along one side of the square. (a) Work out the perimeter of the shape. (b) The triangle has perpendicular height \\(4\\) cm. Work out the area of the shape.', m: 4, s: ['M1 (a) for adding only the outside edges: \\(6 + 6 + 6 + 5 + 5\\).', 'A1 (a) \\(28\\) cm.', 'M1 (b) for \\(36 + \\tfrac12 \\times 6 \\times 4\\).', 'A1 (b) \\(48\\ \\text{cm}^2\\).'], link: ['perimeter', 'See shapes made from rectangles and triangles again'] },
  ],
});
