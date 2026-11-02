// Questions on the Higher-only section (enlarge-more) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['enlargement', 'Enlarge \\((3, -1)\\) by scale factor 2, centre the origin.', ['\\((6, -2)\\)', '\\((5, 1)\\)', '\\((6, -1)\\)', '\\((1.5, -0.5)\\)'], 'Multiply both coordinates by 2.', 'enlargement'],
    ['enlargement', 'A side of 4 cm is enlarged by scale factor 3. The image side is…', ['12 cm', '7 cm', '4 cm', '36 cm'], '\\(4 \\times 3\\).', 'enlargement'],
    ['enlargement', 'After an enlargement, which of these stays the same?', ['The angles', 'The lengths', 'The perimeter', 'The position'], 'Enlargements keep angles.', 'enlargement'],
    ['describe', 'To describe a translation fully you give…', ['a column vector', 'a centre and an angle', 'a mirror line', 'a scale factor'], 'The vector gives the distance and direction.', 'describe'],
    ['describe', 'Which description is complete?', ['Reflection in the line \\(y = -2\\)', 'Reflection', 'Reflection in a horizontal line', 'Reflection, scale factor −1'], 'A reflection needs its mirror line.', 'describe'],
    ['describe', 'P has vertices \\((1, 1)\\), \\((3, 1)\\), \\((1, 2)\\); Q has vertices \\((1, -1)\\), \\((3, -1)\\), \\((1, -2)\\). P → Q is…', ['a reflection in the \\(x\\)-axis', 'a reflection in the \\(y\\)-axis', 'a rotation 90° clockwise about \\((0, 0)\\)', `a translation by \\(${FD.cv(0, -2)}\\)`], 'Only the sign of \\(y\\) changes.', 'describe'],
    ['describe', 'Rotate 90° clockwise about \\((0, 0)\\), then 90° clockwise again. The single transformation is…', ['a rotation 180° about \\((0, 0)\\)', 'a rotation 90° anticlockwise about \\((0, 0)\\)', 'a reflection in \\(y = x\\)', 'no change'], 'Two quarter turns make a half turn.', 'describe'],
    ['enlarge-more', 'Enlarge \\((8, 2)\\) by scale factor \\(\\tfrac12\\), centre the origin.', ['\\((4, 1)\\)', '\\((16, 4)\\)', '\\((7.5, 1.5)\\)', '\\((-4, -1)\\)'], 'Halve both coordinates.', 'enlarge-more'],
    ['enlarge-more', 'Enlarge \\((1, 3)\\) by scale factor \\(-2\\), centre the origin.', ['\\((-2, -6)\\)', '\\((2, 6)\\)', '\\((-1, -3)\\)', '\\((2, -6)\\)'], 'Multiply both coordinates by −2.', 'enlarge-more'],
  ],
  LONG: [
    { q: 'Triangle A has vertices \\((1, 1)\\), \\((2, 1)\\) and \\((1, 3)\\). Enlarge triangle A by scale factor 3, centre \\((0, 0)\\). (a) Give the vertices of the image B. (b) Explain why B is similar but not congruent to A.', m: 3, s: ['B2 for \\((3, 3)\\), \\((6, 3)\\), \\((3, 9)\\) (B1 for two correct).', 'B1 for: the angles are the same but every length is 3 times as long.'], link: ['enlargement', 'See enlargements again'] },
    { q: 'Shape P is reflected in the line \\(x = 2\\) to give shape Q. Shape Q is then reflected in the line \\(x = 5\\) to give shape R. Describe fully the single transformation that maps P onto R.', m: 3, s: ['M1 for following a point through, e.g. \\((0, 0) \\to (4, 0) \\to (6, 0)\\).', 'A1 for translation.', `A1 for the vector \\(${FD.cv(6, 0)}\\).`], link: ['describe', 'See combined transformations again'] },
    { q: 'Triangle T has vertices \\((2, 2)\\), \\((6, 2)\\) and \\((2, 4)\\). Enlarge T by scale factor \\(-\\tfrac12\\), centre \\((0, 0)\\). Give the vertices of the image.', m: 3, h: true, s: ['M1 for multiplying coordinates by \\(-\\tfrac12\\) (or for an image on the opposite side of the origin, half the size).', 'A2 for \\((-1, -1)\\), \\((-3, -1)\\), \\((-1, -2)\\) (A1 for two correct).'], link: ['enlarge-more', 'See negative scale factors again'] },
  ],
});
