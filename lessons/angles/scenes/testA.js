FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['facts', 'Which of these is an obtuse angle?', ['\\(128^\\circ\\)', '\\(88^\\circ\\)', '\\(190^\\circ\\)', '\\(90^\\circ\\)'], 'Obtuse: between 90° and 180°.', 'facts'],
    ['facts', 'Angles on a straight line are \\(74^\\circ\\) and \\(x\\). What is \\(x\\)?', ['\\(106^\\circ\\)', '\\(16^\\circ\\)', '\\(286^\\circ\\)', '\\(74^\\circ\\)'], '\\(180 - 74 = 106\\).', 'facts'],
    ['facts', 'Angles around a point are \\(150^\\circ\\), \\(85^\\circ\\) and \\(y\\). What is \\(y\\)?', ['\\(125^\\circ\\)', '\\(55^\\circ\\)', '\\(235^\\circ\\)', '\\(145^\\circ\\)'], '\\(360 - 150 - 85 = 125\\).', 'facts'],
    ['facts', 'Two straight lines cross. One angle is \\(57^\\circ\\). The angle vertically opposite to it is…', ['\\(57^\\circ\\)', '\\(123^\\circ\\)', '\\(33^\\circ\\)', '\\(303^\\circ\\)'], 'Vertically opposite angles are equal.', 'facts'],
    ['parallel', 'Alternate angles make which shape?', ['Z', 'F', 'C', 'X'], 'Alternate: Z. Corresponding: F. Co-interior: C.', 'parallel'],
    ['parallel', 'Co-interior angles in parallel lines…', ['add up to 180°', 'are equal', 'add up to 90°', 'add up to 360°'], 'Co-interior (allied) angles add up to 180°.', 'parallel'],
    ['parallel', 'One angle at a crossing is \\(105^\\circ\\). Its corresponding angle is…', ['\\(105^\\circ\\)', '\\(75^\\circ\\)', '\\(255^\\circ\\)', '\\(15^\\circ\\)'], 'Corresponding angles are equal.', 'parallel'],
    ['parallel', 'Co-interior angles are \\(3x\\) and \\(x + 40\\). What is \\(x\\)?', ['35', '45', '20', '70'], '\\(4x + 40 = 180\\), so \\(x = 35\\).', 'parallel'],
  ],
  LONG: [
    { q: 'Three angles meet at a point. They are \\(2x\\), \\(3x + 20\\) and \\(140^\\circ\\). Work out the value of \\(x\\).', m: 3, s: ['M1 for \\(2x + 3x + 20 + 140 = 360\\).', 'M1 for \\(5x = 200\\).', 'A1 for \\(x = 40\\).'], link: ['facts', 'See angles around a point again'] },
    { q: 'Two parallel lines are crossed by a transversal. One angle is \\(67^\\circ\\). Find the angle co-interior to it, and the angle alternate to it. Give a reason for each answer.', m: 4, s: ['B1 for \\(113^\\circ\\).', 'B1 for “co-interior angles add up to 180°” (or “allied angles”).', 'B1 for \\(67^\\circ\\).', 'B1 for “alternate angles are equal”.'], link: ['parallel', 'See angles in parallel lines again'] },
    { q: 'Two straight lines cross. One pair of vertically opposite angles are \\((4x - 15)^\\circ\\) and \\((2x + 35)^\\circ\\). Work out the size of the other two angles.', m: 3, s: ['M1 for \\(4x - 15 = 2x + 35\\), giving \\(x = 25\\).', 'M1 for the angle \\(4 \\times 25 - 15 = 85^\\circ\\), then \\(180 - 85\\).', 'A1 for \\(95^\\circ\\) (both other angles).'], link: ['facts', 'See vertically opposite angles again'] },
  ],
});
