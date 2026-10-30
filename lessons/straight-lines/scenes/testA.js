FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['coordinates', 'Which point is 2 to the right of the origin and 5 down?', ['\\((2, -5)\\)', '\\((-5, 2)\\)', '\\((-2, 5)\\)', '\\((5, -2)\\)'], '\\(x\\) first.', 'coordinates'],
    ['coordinates', 'In which quadrant is \\((-4, 3)\\)?', ['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right'], 'Negative \\(x\\), positive \\(y\\).', 'coordinates'],
    ['coordinates', '\\((1, 2)\\), \\((5, 2)\\) and \\((5, 6)\\) are corners of a square. The fourth corner is…', ['\\((1, 6)\\)', '\\((6, 1)\\)', '\\((1, 5)\\)', '\\((2, 6)\\)'], 'Same \\(x\\) as \\((1, 2)\\), same \\(y\\) as \\((5, 6)\\).', 'coordinates'],
    ['coordinates', 'Which point lies on the \\(y\\)-axis?', ['\\((0, 4)\\)', '\\((4, 0)\\)', '\\((4, 4)\\)', '\\((-4, 4)\\)'], '\\(x = 0\\).', 'coordinates'],
    ['midpoint', 'The midpoint of \\((2, 8)\\) and \\((6, 2)\\) is…', ['\\((4, 5)\\)', '\\((8, 10)\\)', '\\((2, 3)\\)', '\\((4, 6)\\)'], '\\((8 \\div 2, 10 \\div 2)\\).', 'midpoint'],
    ['midpoint', 'The midpoint of \\((-3, 1)\\) and \\((5, -7)\\) is…', ['\\((1, -3)\\)', '\\((4, -3)\\)', '\\((1, -4)\\)', '\\((2, -6)\\)'], '\\((2 \\div 2, -6 \\div 2)\\).', 'midpoint'],
    ['midpoint', '\\(M(4, 4)\\) is the midpoint of \\(AB\\) and \\(A = (1, 2)\\). \\(B\\) is…', ['\\((7, 6)\\)', '\\((2.5, 3)\\)', '\\((5, 6)\\)', '\\((3, 2)\\)'], 'Add the step \\((3, 2)\\) again.', 'midpoint'],
    ['midpoint', 'The midpoint of \\((0, 0)\\) and \\((10, -4)\\) is…', ['\\((5, -2)\\)', '\\((10, -4)\\)', '\\((-5, 2)\\)', '\\((5, 2)\\)'], 'Halve each coordinate.', 'midpoint'],
  ],
  LONG: [
    { q: '\\(A(-2, 5)\\), \\(B(4, 5)\\) and \\(C(4, -1)\\) are three vertices of a square \\(ABCD\\). (a) Write down the coordinates of \\(D\\). (b) Find the coordinates of the centre of the square.', m: 3, s: ['B1 for \\(D(-2, -1)\\).', 'M1 for the midpoint of a diagonal, e.g. of \\(AC\\).', 'A1 for \\((1, 2)\\).'], link: ['coordinates', 'See coordinates from shapes again'] },
    { q: 'Find the midpoint of the line segment joining \\(P(-6, 3)\\) and \\(Q(2, -8)\\).', m: 2, s: ['M1 for adding and halving at least one pair of coordinates.', 'A1 for \\((-2, -2.5)\\).'], link: ['midpoint', 'See midpoints again'] },
    { q: 'The midpoint of \\(RS\\) is \\((3, -1)\\). \\(R\\) is \\((7, 2)\\). Find the coordinates of \\(S\\).', m: 2, s: ['M1 for the step from \\(R\\) to the midpoint, \\((-4, -3)\\), or \\(\\frac{7 + x}{2} = 3\\).', 'A1 for \\((-1, -4)\\).'], link: ['midpoint', 'See working backwards again'] },
  ],
});
