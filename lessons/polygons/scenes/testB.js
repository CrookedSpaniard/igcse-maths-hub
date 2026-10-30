FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['interior', 'The sum of the interior angles of a hexagon is…', ['\\(720^\\circ\\)', '\\(540^\\circ\\)', '\\(1080^\\circ\\)', '\\(360^\\circ\\)'], '\\((6 - 2) \\times 180 = 720\\).', 'interior'],
    ['interior', 'Each interior angle of a regular pentagon is…', ['\\(108^\\circ\\)', '\\(72^\\circ\\)', '\\(540^\\circ\\)', '\\(120^\\circ\\)'], '\\(540 \\div 5 = 108\\).', 'interior'],
    ['interior', 'A polygon has interior angles adding up to \\(1260^\\circ\\). It has…', ['9 sides', '7 sides', '8 sides', '10 sides'], '\\(1260 \\div 180 = 7\\) triangles, so 9 sides.', 'interior'],
    ['interior', 'Which formula gives the sum of the interior angles of an \\(n\\)-sided polygon?', ['\\((n - 2) \\times 180^\\circ\\)', '\\(n \\times 180^\\circ\\)', '\\(360^\\circ \\div n\\)', '\\((n + 2) \\times 180^\\circ\\)'], 'Diagonals from one vertex make \\(n - 2\\) triangles.', 'interior'],
    ['exterior', 'Each exterior angle of a regular hexagon is…', ['\\(60^\\circ\\)', '\\(120^\\circ\\)', '\\(36^\\circ\\)', '\\(720^\\circ\\)'], '\\(360 \\div 6\\).', 'exterior'],
    ['exterior', 'Each exterior angle of a regular polygon is \\(18^\\circ\\). How many sides?', ['20', '18', '10', '162'], '\\(360 \\div 18 = 20\\).', 'exterior'],
    ['exterior', 'Each interior angle of a regular polygon is \\(140^\\circ\\). How many sides?', ['9', '7', '14', '40'], 'Exterior \\(= 40^\\circ\\); \\(360 \\div 40 = 9\\).', 'exterior'],
    ['exterior', 'For any polygon, the exterior angles add up to…', ['\\(360^\\circ\\)', '\\(180^\\circ\\)', '\\((n - 2) \\times 180^\\circ\\)', '\\(540^\\circ\\)'], 'One full turn.', 'exterior'],
  ],
  LONG: [
    { q: 'A regular octagon and a square are joined along one side, without overlapping. At a corner where they meet, work out the angle outside both shapes, between a side of the square and a side of the octagon. Show your working.', m: 3, s: ['M1 for the interior angle of the octagon: \\((8 - 2) \\times 180 \\div 8 = 135^\\circ\\) (or exterior \\(45^\\circ\\)).', 'M1 for \\(360 - 135 - 90\\).', 'A1 for \\(135^\\circ\\).'], link: ['interior', 'See interior angles of regular polygons again'] },
    { q: 'Show that a regular polygon cannot have an interior angle of \\(125^\\circ\\).', m: 2, s: ['M1 for exterior angle \\(= 180 - 125 = 55^\\circ\\) and \\(360 \\div 55\\).', 'A1 for \\(6.54…\\) with the conclusion that this is not a whole number, so it is impossible.'], link: ['exterior', 'See how many sides again'] },
    { q: 'A hexagon has interior angles \\(2x\\), \\(2x\\), \\(x + 40\\), \\(x + 40\\), \\(130^\\circ\\) and \\(150^\\circ\\). Work out the value of \\(x\\).', m: 4, s: ['M1 for the angle sum \\((6 - 2) \\times 180 = 720^\\circ\\).', 'M1 for \\(2x + 2x + x + 40 + x + 40 + 130 + 150 = 720\\).', 'M1 for \\(6x = 360\\).', 'A1 for \\(x = 60\\).'], link: ['interior', 'See finding a missing angle again'] },
  ],
});
