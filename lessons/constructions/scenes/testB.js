FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['bisectors', 'A perpendicular bisector cuts a line…', ['in half, at right angles', 'in half, at 45°', 'into thirds', 'at any angle'], 'Perpendicular: 90°. Bisector: halves.', 'bisectors'],
    ['bisectors', 'Points on the perpendicular bisector of \\(AB\\) are…', ['the same distance from \\(A\\) and \\(B\\)', 'closer to \\(A\\)', 'on the line \\(AB\\)', 'all 1 cm from \\(AB\\)'], 'Equidistant from both ends.', 'bisectors'],
    ['bisectors', 'An angle of \\(84^\\circ\\) is bisected. Each part is…', ['\\(42^\\circ\\)', '\\(84^\\circ\\)', '\\(168^\\circ\\)', '\\(96^\\circ\\)'], 'Half of 84.', 'bisectors'],
    ['bisectors', 'When bisecting an angle, the first arc is drawn from…', ['the vertex', 'the end of one arm', 'the middle of an arm', 'anywhere'], 'Centre on the vertex, crossing both arms.', 'bisectors'],
    ['scaledraw', 'Scale 1 cm to 10 m. A measured length of 5.4 cm represents…', ['54 m', '5.4 m', '540 m', '0.54 m'], '\\(5.4 \\times 10\\).', 'scaledraw'],
    ['scaledraw', 'Scale 1 cm to 4 km. A real distance of 14 km is drawn…', ['3.5 cm', '56 cm', '10 cm', '18 cm'], '\\(14 \\div 4\\).', 'scaledraw'],
    ['scaledraw', 'On a scale drawing, a real angle of \\(38^\\circ\\) is drawn as…', ['\\(38^\\circ\\)', '\\(3.8^\\circ\\)', '\\(380^\\circ\\)', 'it depends on the scale'], 'Angles are not scaled.', 'scaledraw'],
    ['scaledraw', 'Scale 1 : 500. A 3 cm line on the drawing is a real length of…', ['15 m', '1.5 m', '150 m', '0.15 m'], '\\(3 \\times 500 = 1500\\) cm \\(= 15\\) m.', 'scaledraw'],
  ],
  LONG: [
    { q: '\\(AB\\) is a line segment 10 cm long. Describe how to construct its perpendicular bisector using only a straight edge and compasses.', m: 3, s: ['B1 for setting the compasses to more than 5 cm (more than half of \\(AB\\)).', 'B1 for arcs from \\(A\\) and from \\(B\\), with the same radius, above and below the line.', 'B1 for joining the two crossing points with a straight edge.'], link: ['bisectors', 'See the perpendicular bisector again'] },
    { q: 'A ship sails 6 km due east from a harbour, then turns and sails 4 km due north. Using a scale of 1 cm to 1 km, a student makes an accurate drawing and measures the straight-line distance back to the harbour as 7.2 cm. (a) What is the real distance? (b) Give one reason why the answer is only approximate.', m: 2, s: ['B1 (a) 7.2 km.', 'B1 (b) e.g. measuring and drawing are only accurate to about 1 mm.'], link: ['scaledraw', 'See scale drawings again'] },
    { q: 'Two trees are 48 m apart. A plan uses the scale 1 cm to 8 m. (a) How far apart are the trees on the plan? (b) A path on the plan is 7.5 cm long. How long is the real path?', m: 2, s: ['B1 (a) 6 cm.', 'B1 (b) 60 m.'], link: ['scaledraw', 'See scale drawings again'] },
  ],
});
