FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['translations', '\\(y = f(x) + 3\\) is \\(y = f(x)\\)…', ['moved up 3', 'moved down 3', 'moved left 3', 'moved right 3'], 'Outside: as it says.', 'translations'],
    ['translations', '\\(y = f(x - 2)\\) is \\(y = f(x)\\)…', ['moved right 2', 'moved left 2', 'moved up 2', 'moved down 2'], 'Inside: the opposite way.', 'translations'],
    ['translations', 'The turning point of \\(y = (x - 4)^2 + 1\\) is…', ['\\((4, 1)\\)', '\\((-4, 1)\\)', '\\((4, -1)\\)', '\\((1, 4)\\)'], '\\((0, 0)\\) moved right 4 and up 1.', 'translations'],
    ['translations', 'Which equation is \\(y = \\cos x\\) moved 90° to the right?', ['\\(y = \\cos(x - 90°)\\)', '\\(y = \\cos(x + 90°)\\)', '\\(y = \\cos x + 90\\)', '\\(y = \\cos x - 90\\)'], 'Inside, minus moves right.', 'translations'],
    ['stretches', '\\(y = 3f(x)\\) is…', ['a stretch parallel to the \\(y\\)-axis, scale factor 3', 'a stretch parallel to the \\(x\\)-axis, scale factor 3', 'a translation up 3', 'a stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac13\\)'], 'Outside multiplies the \\(y\\) values.', 'stretches'],
    ['stretches', '\\(y = f(2x)\\) is…', ['a stretch parallel to the \\(x\\)-axis, scale factor \\(\\frac12\\)', 'a stretch parallel to the \\(x\\)-axis, scale factor 2', 'a stretch parallel to the \\(y\\)-axis, scale factor 2', 'a translation left 2'], 'Inside: the opposite.', 'stretches'],
    ['stretches', '\\(y = f(-x)\\) is \\(y = f(x)\\) reflected in…', ['the \\(y\\)-axis', 'the \\(x\\)-axis', 'the line \\(y = x\\)', 'the origin'], '\\(x\\) values change sign.', 'stretches'],
    ['stretches', 'What is the largest value of \\(y = 4\\sin x\\)?', ['4', '1', '90', '360'], 'The wave is stretched by 4.', 'stretches'],
  ],
  LONG: [
    { q: 'The graph of \\(y = f(x)\\) has a maximum point at \\((3, 2)\\). Write down the coordinates of the maximum point of (a) \\(y = f(x) - 5\\), (b) \\(y = f(x + 1)\\), (c) \\(y = 2f(x)\\).', m: 3, s: ['B1 for \\((3, -3)\\).', 'B1 for \\((2, 2)\\).', 'B1 for \\((3, 4)\\).'], link: ['translations', 'See transformations of points again'] },
    { q: 'The graph of \\(y = x^2\\) is translated by \\(\\begin{pmatrix} -2 \\\\ 5 \\end{pmatrix}\\). Write down the equation of the new graph.', m: 2, s: ['M1 for \\((x + 2)^2\\) or \\(+ 5\\) seen.', 'A1 for \\(y = (x + 2)^2 + 5\\).'], link: ['translations', 'See writing the function again'] },
    { q: 'Describe fully the single transformation that maps \\(y = \\sin x\\) onto \\(y = \\sin 3x\\), and write down the period of \\(y = \\sin 3x\\).', m: 3, s: ['B1 for stretch parallel to the \\(x\\)-axis.', 'B1 for scale factor \\(\\frac13\\).', 'B1 for period 120°.'], link: ['stretches', 'See stretches again'] },
  ],
});
