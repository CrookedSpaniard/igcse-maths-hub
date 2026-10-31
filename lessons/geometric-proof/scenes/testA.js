FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['reasons', 'Which reason is written in the standard way?', ['Alternate angles are equal', 'Z angles', 'Parallel lines', 'It is the same'], 'Use the full name of the fact.', 'reasons'],
    ['reasons', 'Two angles make a straight line. The reason is…', ['Angles on a straight line add up to 180°', 'Angles around a point add up to 360°', 'Vertically opposite angles are equal', 'Co-interior angles add up to 180°'], 'Straight line: 180°.', 'reasons'],
    ['reasons', 'Two angles are equal because the lines cross like an X. The reason is…', ['Vertically opposite angles are equal', 'Corresponding angles are equal', 'Alternate angles are equal', 'Base angles are equal'], 'Vertically opposite.', 'reasons'],
    ['reasons', '\\(PQ = PR\\) and \\(\\angle PQR = 70^\\circ\\). \\(\\angle PRQ = 70^\\circ\\) because…', ['base angles of an isosceles triangle are equal', 'alternate angles are equal', 'angles in a triangle add up to 180°', 'it is an equilateral triangle'], 'Isosceles triangle.', 'reasons'],
    ['polyreasons', 'Each exterior angle of a regular octagon is \\(45^\\circ\\) because…', ['exterior angles of a polygon add up to 360°', 'angles around a point add up to 360°', 'angles in a triangle add up to 180°', 'an octagon has 8 sides of 45 cm'], '\\(360 \\div 8\\).', 'polyreasons'],
    ['polyreasons', '\\(ABCDE\\) is a regular pentagon. \\(\\angle BAC =\\)', ['\\(36^\\circ\\)', '\\(72^\\circ\\)', '\\(108^\\circ\\)', '\\(54^\\circ\\)'], '\\((180 - 108) \\div 2\\).', 'polyreasons'],
    ['polyreasons', 'In a regular hexagon, interior angle \\(= 180 - 60\\) because…', ['angles on a straight line add up to 180°', 'angles in a triangle add up to 180°', 'co-interior angles add up to 180°', 'vertically opposite angles are equal'], 'Interior and exterior angles lie on a straight line.', 'polyreasons'],
    ['polyreasons', 'A quadrilateral has angles 85°, 95° and 110°. The fourth angle is 70° because…', ['angles in a quadrilateral add up to 360°', 'angles around a point add up to 360°', 'exterior angles add up to 360°', 'angles in a triangle add up to 180°'], 'Quadrilateral: 360°.', 'polyreasons'],
  ],
  LONG: [
    { q: '\\(AB\\) is parallel to \\(CD\\). A transversal crosses \\(AB\\) at \\(P\\) and \\(CD\\) at \\(Q\\). The angle above \\(AB\\) on the right of \\(P\\) is \\(58^\\circ\\). Work out the angle below \\(CD\\) on the left of \\(Q\\). Give reasons for each stage of your working.', m: 3, s: ['B1 the angle above \\(CD\\) on the right of \\(Q\\) is \\(58^\\circ\\): corresponding angles are equal.', 'B1 the required angle is \\(58^\\circ\\).', 'B1 reason: vertically opposite angles are equal.'], link: ['reasons', 'See the standard reasons again'] },
    { q: '\\(ABCDEF\\) is a regular hexagon. Work out \\(\\angle ACD\\). Give reasons.', m: 4, s: ['M1 interior angle \\(120^\\circ\\) (e.g. exterior angles add up to 360°, \\(360 \\div 6 = 60\\), \\(180 - 60\\)).', 'M1 \\(\\angle BCA = (180 - 120) \\div 2 = 30^\\circ\\) (base angles of an isosceles triangle are equal).', 'A1 \\(\\angle ACD = 120 - 30 = 90^\\circ\\).', 'B1 all reasons given correctly.'], link: ['polyreasons', 'See reasoning with polygons again'] },
    { q: 'Triangle \\(PQR\\) has \\(PQ = PR\\). The angle between \\(PQ\\) and a line through \\(P\\) parallel to \\(QR\\) is \\(52^\\circ\\). Work out \\(\\angle QPR\\), giving a reason for each step.', m: 3, s: ['B1 \\(\\angle PQR = 52^\\circ\\) (alternate angles are equal).', 'B1 \\(\\angle PRQ = 52^\\circ\\) (base angles of an isosceles triangle are equal).', 'B1 \\(\\angle QPR = 76^\\circ\\) (angles in a triangle add up to 180°).'], link: ['reasons', 'See the worked chain again'] },
  ],
});
