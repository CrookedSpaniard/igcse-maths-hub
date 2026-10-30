FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['centre', '\\(\\angle AOB = 150^\\circ\\) at the centre. The angle at the circumference on the major arc is…', ['\\(75^\\circ\\)', '\\(150^\\circ\\)', '\\(300^\\circ\\)', '\\(105^\\circ\\)'], 'Half.', 'centre'],
    ['centre', 'The angle in a semicircle is…', ['\\(90^\\circ\\)', '\\(180^\\circ\\)', '\\(60^\\circ\\)', '\\(120^\\circ\\)'], 'Right angle.', 'centre'],
    ['centre', 'Angles in the same segment are…', ['equal', 'supplementary', 'complementary', 'double each other'], 'Equal.', 'centre'],
    ['cyclic', 'A cyclic quadrilateral has an angle of \\(115^\\circ\\). The opposite angle is…', ['\\(65^\\circ\\)', '\\(115^\\circ\\)', '\\(245^\\circ\\)', '\\(25^\\circ\\)'], '\\(180 - 115\\).', 'cyclic'],
    ['cyclic', 'The angle between a tangent and a chord equals…', ['the angle in the alternate segment', 'the angle at the centre', '\\(90^\\circ\\)', 'half the angle in the same segment'], 'Alternate segment theorem.', 'cyclic'],
    ['cyclic', 'Which statement about a cyclic quadrilateral is true?', ['All four vertices lie on a circle', 'All sides are equal', 'Its diagonals are diameters', 'All angles are 90°'], 'Definition.', 'cyclic'],
    ['intersect', 'Chords cross at \\(X\\): \\(AX = 5\\), \\(XB = 8\\), \\(CX = 10\\). \\(XD =\\)', ['4', '16', '6.25', '13'], '\\(40 \\div 10\\).', 'intersect'],
    ['intersect', 'Tangent \\(PT\\); \\(PA = 2\\), \\(PB = 18\\). \\(PT =\\)', ['6', '36', '10', '20'], '\\(\\sqrt{36}\\).', 'intersect'],
  ],
  LONG: [
    { q: '\\(A\\), \\(B\\), \\(C\\) and \\(D\\) are points on a circle with centre \\(O\\). \\(\\angle AOC = 128^\\circ\\). \\(B\\) is on the major arc and \\(D\\) on the minor arc. (a) Work out \\(\\angle ABC\\). (b) Work out \\(\\angle ADC\\). Give reasons.', m: 4, s: ['M1 \\(128 \\div 2\\).', 'A1 (a) \\(64^\\circ\\) with reason: angle at the centre is twice the angle at the circumference.', 'M1 \\(180 - 64\\).', 'A1 (b) \\(116^\\circ\\) with reason: opposite angles of a cyclic quadrilateral add up to 180°.'], link: ['centre', 'See the angle at the centre again'] },
    { q: '\\(TA\\) is a tangent to a circle at \\(A\\). \\(AB\\) and \\(AC\\) are chords, and the angle between the tangent \\(TA\\) and the chord \\(AB\\) is \\(66^\\circ\\). \\(\\angle BAC = 50^\\circ\\). Work out \\(\\angle ABC\\), giving reasons. (\\(C\\) is in the alternate segment for chord \\(AB\\).)', m: 3, s: ['B1 \\(\\angle ACB = 66^\\circ\\) (alternate segment theorem).', 'M1 \\(180 - 66 - 50\\).', 'A1 \\(\\angle ABC = 64^\\circ\\) (angles in a triangle).'], link: ['cyclic', 'See the alternate segment theorem again'] },
    { q: 'From a point \\(P\\) outside a circle, a line cuts the circle at \\(A\\) and \\(B\\), with \\(PA = 4\\) cm and \\(AB = 5\\) cm. Another line from \\(P\\) cuts it at \\(C\\) and \\(D\\), with \\(PC = 3\\) cm. Work out the length of \\(CD\\).', m: 3, s: ['M1 \\(PB = 9\\) and \\(4 \\times 9 = 3 \\times PD\\).', 'A1 \\(PD = 12\\).', 'A1 \\(CD = 9\\) cm.'], link: ['intersect', 'See chords crossing outside again'] },
  ],
});
