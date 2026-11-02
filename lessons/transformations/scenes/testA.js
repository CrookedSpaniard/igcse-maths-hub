FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['translations', `The point \\((4, -1)\\) is translated by \\(${FD.cv(-3, 5)}\\). Its image is…`, ['\\((1, 4)\\)', '\\((7, -6)\\)', '\\((1, -6)\\)', '\\((-12, -5)\\)'], 'Add the vector.', 'translations'],
    ['translations', 'A translation maps \\((-2, 3)\\) onto \\((1, 1)\\). The vector is…', [`\\(${FD.cv(3, -2)}\\)`, `\\(${FD.cv(-3, 2)}\\)`, `\\(${FD.cv(-1, 4)}\\)`, `\\(${FD.cv(2, -3)}\\)`], 'Image minus object.', 'translations'],
    ['translations', 'Which of these changes the size of a shape?', ['None: a translation keeps the same size', 'A translation by a long vector', 'A translation to the left', 'A translation downwards'], 'Translations give congruent images.', 'translations'],
    ['reflections', 'Reflect \\((3, 4)\\) in the \\(x\\)-axis.', ['\\((3, -4)\\)', '\\((-3, 4)\\)', '\\((4, 3)\\)', '\\((-3, -4)\\)'], 'Up and down flip: \\(y\\) changes sign.', 'reflections'],
    ['reflections', 'Reflect \\((5, 1)\\) in the line \\(x = 2\\).', ['\\((-1, 1)\\)', '\\((5, 3)\\)', '\\((-5, 1)\\)', '\\((1, 5)\\)'], '3 right of the line, so 3 left of it.', 'reflections'],
    ['reflections', 'Reflect \\((-2, 6)\\) in the line \\(y - x = 0\\).', ['\\((6, -2)\\)', '\\((2, -6)\\)', '\\((-6, 2)\\)', '\\((-2, -6)\\)'], '\\(y - x = 0\\) is \\(y = x\\): swap.', 'reflections'],
    ['rotations', 'Rotate \\((1, 4)\\) 90° clockwise about the origin.', ['\\((4, -1)\\)', '\\((-4, 1)\\)', '\\((-1, -4)\\)', '\\((1, -4)\\)'], '\\((x, y) \\to (y, -x)\\).', 'rotations'],
    ['rotations', 'A rotation of \\(+90^\\circ\\) means…', ['90° anticlockwise', '90° clockwise', 'a quarter turn either way', '90° about the \\(x\\)-axis'], 'Positive angles are anticlockwise.', 'rotations'],
    ['rotations', 'To describe a rotation fully you give…', ['the centre, the angle and the direction', 'a column vector', 'the mirror line', 'the scale factor and the centre'], 'Centre, angle, direction.', 'rotations'],
  ],
  LONG: [
    { q: 'Triangle P has vertices \\((1, 1)\\), \\((3, 1)\\) and \\((1, 4)\\). (a) Translate P by \\(\\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}\\) and write down the vertices of the image Q. (b) Explain why Q is congruent to P.', m: 3, s: ['B2 for \\((-3, 3)\\), \\((-1, 3)\\), \\((-3, 6)\\) (B1 for two correct vertices).', 'B1 for: a translation does not change lengths or angles, so the shapes are identical in shape and size.'], link: ['translations', 'See translations again'] },
    { q: 'Triangle R has vertices \\((2, 1)\\), \\((5, 1)\\) and \\((2, 3)\\). Reflect R in the line \\(y = x\\) and give the vertices of the image. Then reflect R in the line \\(x = -1\\) and give the vertices of that image.', m: 4, s: ['B2 for \\((1, 2)\\), \\((1, 5)\\), \\((3, 2)\\) (B1 for two correct).', 'B2 for \\((-4, 1)\\), \\((-7, 1)\\), \\((-4, 3)\\) (B1 for two correct).'], link: ['reflections', 'See reflections again'] },
    { q: 'Triangle T has vertices \\((1, 2)\\), \\((4, 2)\\) and \\((1, 3)\\). Rotate T through 90° anticlockwise about the point \\((1, 0)\\). Give the vertices of the image.', m: 3, s: ['M1 for using the centre \\((1, 0)\\), e.g. \\((1, 2)\\) is \\(\\begin{pmatrix} 0 \\\\ 2 \\end{pmatrix}\\) from it and becomes \\(\\begin{pmatrix} -2 \\\\ 0 \\end{pmatrix}\\).', 'A2 for \\((-1, 0)\\), \\((-1, 3)\\), \\((-2, 0)\\) (A1 for two correct).'], link: ['rotations', 'See rotations again'] },
  ],
});
