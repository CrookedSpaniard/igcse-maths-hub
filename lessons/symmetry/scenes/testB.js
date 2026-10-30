FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['complete', 'A shaded square is 2 squares to the right of a vertical mirror line. Its image is…', ['2 squares to the left of the line', '2 squares above it', '4 squares to the left', 'on the line'], 'Same distance, other side.', 'complete'],
    ['complete', 'The mirror line is \\(x = 5\\). The image of a point with \\(x = 2\\) has \\(x =\\)…', ['8', '7', '3', '10'], '3 to the left → 3 to the right: \\(5 + 3\\).', 'complete'],
    ['complete', 'A pattern has 4 squares in one quarter and two perpendicular mirror lines. The finished pattern has…', ['16 squares', '8 squares', '12 squares', '4 squares'], 'Each square has three images.', 'complete'],
    ['complete', 'When you reflect a square in a mirror line, it moves…', ['at right angles to the line', 'parallel to the line', 'diagonally', 'twice as far'], 'Reflections move points perpendicular to the mirror line.', 'complete'],
    ['line', 'Which letter has a horizontal line of symmetry only?', ['E', 'A', 'H', 'N'], 'E: horizontal. A: vertical. H: both. N: none.', 'line'],
    ['rotational', 'A pattern completed with two perpendicular mirror lines has rotational symmetry of order at least…', ['2', '1', '4', '0'], 'Two reflections in perpendicular lines make a half turn.', 'rotational'],
    ['line', 'A regular polygon has 10 lines of symmetry. How many sides?', ['10', '5', '20', '9'], 'Regular \\(n\\)-gon: \\(n\\) lines.', 'line'],
    ['rotational', 'An equilateral triangle fits onto itself every…', ['\\(120^\\circ\\)', '\\(60^\\circ\\)', '\\(90^\\circ\\)', '\\(180^\\circ\\)'], '\\(360 \\div 3\\).', 'rotational'],
  ],
  LONG: [
    { q: 'On a square grid, the mirror line is the vertical line \\(x = 3\\). Shaded squares have centres at \\((1, 2)\\), \\((2, 4)\\) and \\((0, 1)\\). Write down the centres of the three squares you must shade to make \\(x = 3\\) a line of symmetry.', m: 3, s: ['B1 \\((5, 2)\\).', 'B1 \\((4, 4)\\).', 'B1 \\((6, 1)\\).'], link: ['complete', 'See reflecting squares again'] },
    { q: 'A pattern is made of 6 shaded squares. It has exactly two lines of symmetry. Explain why it must also have rotational symmetry, and give its order.', m: 2, s: ['B1 for: two perpendicular mirror lines together give a half turn about the point where they cross.', 'B1 for order 2.'], link: ['complete', 'See two mirror lines again'] },
    { q: 'Draw (or describe) a quadrilateral that has exactly one line of symmetry and rotational symmetry of order 1. Name the shape.', m: 2, s: ['B1 for kite or isosceles trapezium.', 'B1 for a correct description or sketch with the line of symmetry shown.'], link: ['line', 'See the quadrilaterals again'] },
  ],
});
