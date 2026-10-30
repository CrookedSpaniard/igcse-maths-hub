FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['line', 'How many lines of symmetry does a square have?', ['4', '2', '1', '8'], 'Two through the middles of the sides and two diagonals.', 'line'],
    ['line', 'Which shape has no lines of symmetry?', ['Parallelogram (not a rectangle or rhombus)', 'Kite', 'Isosceles triangle', 'Rectangle'], 'A general parallelogram has none.', 'line'],
    ['line', 'How many lines of symmetry does a regular hexagon have?', ['6', '3', '12', '2'], 'Regular \\(n\\)-gon: \\(n\\) lines.', 'line'],
    ['line', 'Are the diagonals of a rectangle (not a square) lines of symmetry?', ['No', 'Yes, both', 'Only one of them', 'Only if it is long'], 'Folding along a diagonal does not match the halves.', 'line'],
    ['rotational', 'The order of rotational symmetry of a square is…', ['4', '2', '1', '8'], 'It fits every 90°.', 'rotational'],
    ['rotational', 'A parallelogram has rotational symmetry of order…', ['2', '1', '0', '4'], 'It fits after 180° and 360°.', 'rotational'],
    ['rotational', 'A shape fits onto itself every \\(45^\\circ\\). Its order of rotational symmetry is…', ['8', '4', '45', '6'], '\\(360 \\div 45 = 8\\).', 'rotational'],
    ['rotational', 'Which shape has rotational symmetry of order 1?', ['Kite', 'Rhombus', 'Rectangle', 'Equilateral triangle'], 'A kite only fits after a full turn.', 'rotational'],
  ],
  LONG: [
    { q: 'For a <b>rhombus</b> (not a square), write down (a) the number of lines of symmetry, (b) the order of rotational symmetry.', m: 2, s: ['B1 (a) 2.', 'B1 (b) 2.'], link: ['line', 'See the rhombus again'] },
    { q: 'A regular polygon has rotational symmetry of order 9. (a) How many lines of symmetry does it have? (b) Work out the size of each of its exterior angles.', m: 3, s: ['B1 (a) 9.', 'M1 (b) \\(360 \\div 9\\).', 'A1 \\(40^\\circ\\).'], link: ['rotational', 'See regular polygons again'] },
    { q: 'Leo says: “A shape with no lines of symmetry has no rotational symmetry.” Give an example to show that Leo is wrong.', m: 2, s: ['B1 for a correct example, e.g. a parallelogram, or the letter S or Z.', 'B1 for stating its order of rotational symmetry (2) and that it has no lines of symmetry.'], link: ['rotational', 'See the parallelogram again'] },
  ],
});
