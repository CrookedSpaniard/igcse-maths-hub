FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['elevation', 'An angle of elevation is measured…', ['up from the horizontal', 'down from the horizontal', 'from the vertical', 'clockwise from north'], 'Up from the horizontal.', 'elevation'],
    ['elevation', 'The angle of depression from \\(A\\) to \\(B\\) is \\(25^\\circ\\). The angle of elevation from \\(B\\) to \\(A\\) is…', ['\\(25^\\circ\\)', '\\(65^\\circ\\)', '\\(155^\\circ\\)', '\\(50^\\circ\\)'], 'Alternate angles.', 'elevation'],
    ['elevation', 'You are 20 m from a tower; elevation \\(40^\\circ\\). The height is…', ['16.8 m', '23.8 m', '12.9 m', '31.1 m'], '\\(20 \\tan 40\\).', 'elevation'],
    ['elevation', 'A 60 m cliff; angle of depression to a boat \\(30^\\circ\\). The boat is…', ['104 m away', '34.6 m away', '30 m away', '120 m away'], '\\(60 \\div \\tan 30\\).', 'elevation'],
    ['elevation', 'A kite string is 50 m long at \\(55^\\circ\\) to the ground. The kite is…', ['41.0 m high', '28.7 m high', '71.4 m high', '35.0 m high'], '\\(50 \\sin 55\\).', 'elevation'],
    ['elevation', 'A 12 m pole is 30 m away. The angle of elevation of the top is…', ['\\(21.8^\\circ\\)', '\\(68.2^\\circ\\)', '\\(23.6^\\circ\\)', '\\(0.4^\\circ\\)'], '\\(\\tan^{-1}(12/30)\\).', 'elevation'],
    ['elevation', 'Angles of depression are equal to angles of elevation because…', ['the horizontals are parallel (alternate angles)', 'they are vertically opposite', 'they are in the same segment', 'they add up to 90°'], 'Alternate angles.', 'elevation'],
    ['elevation', 'From a window 15 m up, the angle of depression of a car is \\(20^\\circ\\). The car is about…', ['41.2 m from the building', '5.5 m', '16.0 m', '43.9 m'], '\\(15 \\div \\tan 20\\).', 'elevation'],
  ],
  LONG: [
    { q: 'From a point \\(A\\) on level ground, the angle of elevation of the top of a mast is \\(34^\\circ\\). \\(A\\) is 65 m from the foot of the mast. Work out the height of the mast, to 3 s.f.', m: 3, s: ['M1 for using tan.', 'M1 for \\(65 \\tan 34^\\circ\\).', 'A1 for 43.8 m.'], link: ['elevation', 'See angles of elevation again'] },
    { q: 'From the top of a lighthouse 52 m high, the angles of depression of two boats in line with it are \\(22^\\circ\\) and \\(35^\\circ\\). Work out the distance between the boats, to 3 s.f.', m: 4, s: ['M1 for \\(52 \\div \\tan 22^\\circ\\) (= 128.7…).', 'M1 for \\(52 \\div \\tan 35^\\circ\\) (= 74.26…).', 'M1 for subtracting.', 'A1 for 54.4 m.'], link: ['elevation', 'See angles of depression again'] },
    { q: 'A drone is 80 m above the ground. A person sees it at an angle of elevation of \\(28^\\circ\\). Work out the straight-line distance from the person to the drone, to 3 s.f.', m: 3, s: ['M1 for using sin with opposite 80.', 'M1 for \\(80 \\div \\sin 28^\\circ\\).', 'A1 for 170 m.'], link: ['elevation', 'See elevation again'] },
  ],
});
