FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['quads', 'Which quadrilateral has 4 equal sides and 4 right angles?', ['Square', 'Rhombus', 'Rectangle', 'Kite'], 'A square has both.', 'quads'],
    ['quads', 'A parallelogram has…', ['opposite angles equal', 'four right angles', 'one pair of parallel sides', 'diagonals that cross at 90°'], 'Opposite angles of a parallelogram are equal.', 'quads'],
    ['quads', 'How many lines of symmetry does a kite have?', ['1', '0', '2', '4'], 'One, along the diagonal through the unequal angles.', 'quads'],
    ['quads', 'Which shape has exactly one pair of parallel sides?', ['Trapezium', 'Rhombus', 'Rectangle', 'Kite'], 'That is the definition of a trapezium.', 'quads'],
    ['quadangles', 'Three angles of a quadrilateral are \\(80^\\circ\\), \\(95^\\circ\\) and \\(105^\\circ\\). The fourth is…', ['\\(80^\\circ\\)', '\\(100^\\circ\\)', '\\(180^\\circ\\)', '\\(260^\\circ\\)'], '\\(360 - 280 = 80\\).', 'quadangles'],
    ['quadangles', 'One angle of a parallelogram is \\(48^\\circ\\). An angle next to it is…', ['\\(132^\\circ\\)', '\\(48^\\circ\\)', '\\(42^\\circ\\)', '\\(312^\\circ\\)'], 'Adjacent angles add up to 180°.', 'quadangles'],
    ['quadangles', 'The angles of a quadrilateral are \\(x, 2x, 3x\\) and \\(4x\\). What is \\(x\\)?', ['\\(36^\\circ\\)', '\\(18^\\circ\\)', '\\(40^\\circ\\)', '\\(90^\\circ\\)'], '\\(10x = 360\\).', 'quadangles'],
    ['congruence', 'Two shapes are congruent when they are…', ['the same shape and the same size', 'the same shape only', 'the same area only', 'both quadrilaterals'], 'Congruent: same shape and size.', 'congruence'],
    ['congruence', 'A polygon with 9 sides is called a…', ['nonagon', 'decagon', 'heptagon', 'octagon'], 'Nonagon: 9 sides.', 'congruence'],
    ['quadangles', 'The angles of a quadrilateral add up to…', ['\\(360^\\circ\\)', '\\(180^\\circ\\)', '\\(540^\\circ\\)', '\\(720^\\circ\\)'], 'Two triangles: \\(2 \\times 180\\).', 'quadangles'],
  ],
  LONG: [
    { q: 'A kite has angles \\(x\\), \\(x\\), \\(48^\\circ\\) and \\(3x - 18^\\circ\\). The two angles marked \\(x\\) are the equal pair. Work out the value of \\(x\\).', m: 3, s: ['M1 for \\(x + x + 48 + 3x - 18 = 360\\).', 'M1 for \\(5x = 330\\).', 'A1 for \\(x = 66\\).'], link: ['quadangles', 'See algebra in a kite again'] },
    { q: '\\(ABCD\\) is a parallelogram with \\(\\angle DAB = 112^\\circ\\). Work out \\(\\angle ABC\\) and \\(\\angle BCD\\). Give reasons.', m: 4, s: ['B1 for \\(\\angle ABC = 68^\\circ\\).', 'B1 for a reason: co-interior angles add up to 180° (or adjacent angles of a parallelogram).', 'B1 for \\(\\angle BCD = 112^\\circ\\).', 'B1 for a reason: opposite angles of a parallelogram are equal.'], link: ['quadangles', 'See parallelogram angles again'] },
    { q: 'Hana says: “Every rhombus is a square.” Is she correct? Explain your answer.', m: 2, s: ['B1 No.', 'B1 for a correct explanation, e.g. a rhombus has 4 equal sides but its angles do not have to be 90°.'], link: ['quads', 'See the rhombus again'] },
    { q: 'Triangles \\(ABC\\) and \\(DEF\\) are congruent, with \\(A\\) matching \\(D\\), \\(B\\) matching \\(E\\) and \\(C\\) matching \\(F\\). \\(\\angle A = 48^\\circ\\), \\(\\angle B = 71^\\circ\\) and \\(EF = 9\\) cm. Write down (a) the length of \\(BC\\), (b) the size of \\(\\angle F\\).', m: 3, s: ['B1 (a) \\(BC = 9\\) cm (corresponding sides of congruent triangles are equal).', 'M1 (b) \\(\\angle C = 180 - 48 - 71\\).', 'A1 \\(\\angle F = 61^\\circ\\).'], link: ['congruence', 'See congruent shapes again'] },
  ],
});
