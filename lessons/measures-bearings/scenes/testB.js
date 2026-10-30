FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['scale', 'On a \\(1 : 25\\,000\\) map, \\(4\\) cm represents…', ['1 km', '100 m', '10 km', '4 km'], '\\(4 \\times 25\\,000 = 100\\,000\\) cm.', 'scale'],
    ['scale', 'A scale of \\(1 : 100\\,000\\) means 1 cm represents…', ['1 km', '100 m', '10 km', '100 km'], '\\(100\\,000\\) cm \\(= 1\\) km.', 'scale'],
    ['scale', 'On a plan, 1 cm represents 3 m. A 7.5 m wall is drawn…', ['2.5 cm long', '22.5 cm long', '4.5 cm long', '10.5 cm long'], '\\(7.5 \\div 3\\).', 'scale'],
    ['scale', '\\(9\\) km on a \\(1 : 50\\,000\\) map is…', ['18 cm', '4.5 cm', '45 cm', '1.8 cm'], '\\(900\\,000 \\div 50\\,000\\).', 'scale'],
    ['bearings', 'Due west is the bearing…', ['270°', '090°', '180°', '360°'], 'Clockwise from north: N 000°, E 090°, S 180°, W 270°.', 'bearings'],
    ['bearings', 'The bearing of B from A is \\(035^\\circ\\). The bearing of A from B is…', ['215°', '145°', '325°', '035°'], '\\(35 + 180\\).', 'bearings'],
    ['bearings', 'The bearing of D from C is \\(300^\\circ\\). The bearing of C from D is…', ['120°', '060°', '480°', '240°'], '\\(300 - 180\\).', 'bearings'],
    ['bearings', 'Which bearing is written correctly?', ['045°', '45°', '4.5°', 'N45°'], 'Three figures.', 'bearings'],
  ],
  LONG: [
    { q: 'A ship sails from port P on a bearing of \\(070^\\circ\\) to a buoy B. It then turns and sails due south to a lighthouse L. (a) Write down the bearing of P from B. (b) Write down the bearing of L from B.', m: 2, s: ['B1 (a) \\(250^\\circ\\).', 'B1 (b) \\(180^\\circ\\).'], link: ['bearings', 'See back bearings again'] },
    { q: 'A map has a scale of \\(1 : 40\\,000\\). On the map a lake is \\(7.5\\) cm long. Work out the real length of the lake in kilometres.', m: 2, s: ['M1 for \\(7.5 \\times 40\\,000 = 300\\,000\\) cm.', 'A1 for \\(3\\) km.'], link: ['scale', 'See map scales again'] },
    { q: 'Town B is \\(12\\) km due east of town A. Town C is \\(12\\) km due north of town B. Work out the bearing of C from A, and the bearing of A from C.', m: 3, s: ['M1 for recognising a right-angled isosceles triangle, so the angle at A is \\(45^\\circ\\).', 'A1 for the bearing of C from A \\(= 045^\\circ\\).', 'B1 for the bearing of A from C \\(= 225^\\circ\\).'], link: ['bearings', 'See bearings again'] },
  ],
});
