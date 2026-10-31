FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['plotting', '\\(y = x^2 - 5\\). What is \\(y\\) when \\(x = -3\\)?', ['4', '−14', '1', '−4'], '\\(9 - 5\\).', 'plotting'],
    ['plotting', '\\(y = 2x^2 + x\\). What is \\(y\\) when \\(x = -2\\)?', ['6', '−10', '10', '14'], '\\(8 - 2\\).', 'plotting'],
    ['plotting', 'Which equation gives a straight-line graph?', ['\\(y = 4 - 3x\\)', '\\(y = x^2\\)', '\\(y = x^2 - 3x\\)', '\\(y = \\frac{3}{x}\\)'], 'No powers of \\(x\\) higher than 1.', 'plotting'],
    ['plotting', 'The graph of \\(y = -x^2 + 2\\) is…', ['∩-shaped', '∪-shaped', 'a straight line', 'S-shaped'], 'Negative \\(x^2\\) term.', 'plotting'],
    ['parabolas', 'A parabola has roots at \\(x = -3\\) and \\(x = 5\\). Its line of symmetry is…', ['\\(x = 1\\)', '\\(x = 2\\)', '\\(x = 4\\)', '\\(x = -1\\)'], '\\((-3 + 5) \\div 2\\).', 'parabolas'],
    ['parabolas', 'Where does \\(y = x^2 - 6x + 8\\) cross the \\(y\\)-axis?', ['\\((0, 8)\\)', '\\((8, 0)\\)', '\\((0, -6)\\)', '\\((2, 0)\\)'], 'Put \\(x = 0\\).', 'parabolas'],
    ['parabolas', 'The turning point of \\(y = (x - 1)(x - 5)\\) is…', ['\\((3, -4)\\)', '\\((3, 4)\\)', '\\((1, 5)\\)', '\\((-3, -4)\\)'], 'Symmetry at \\(x = 3\\): \\((2)(-2) = -4\\).', 'parabolas'],
    ['parabolas', 'The roots of \\(y = x^2 - 9\\) are…', ['\\(x = 3\\) and \\(x = -3\\)', '\\(x = 9\\)', '\\(x = 0\\) and \\(x = 9\\)', '\\(x = -9\\)'], '\\((x + 3)(x - 3)\\).', 'parabolas'],
  ],
  LONG: [
    { q: '(a) Complete a table of values for \\(y = x^2 - 2x - 3\\) for \\(x = -2, -1, 0, 1, 2, 3, 4\\). (b) Draw the graph. (c) Use your graph to solve \\(x^2 - 2x - 3 = 0\\).', m: 5, s: ['B2 for all values 5, 0, −3, −4, −3, 0, 5 (B1 for at least four).', 'M1 for plotting the points correctly.', 'A1 for a smooth curve.', 'B1 for \\(x = -1\\) and \\(x = 3\\).'], link: ['plotting', 'See plotting again'] },
    { q: 'Write down the coordinates of the turning point of \\(y = x^2 + 4x\\).', m: 2, s: ['M1 for roots 0 and −4, or symmetry line \\(x = -2\\).', 'A1 for \\((-2, -4)\\).'], link: ['parabolas', 'See turning points again'] },
    { q: 'A ∪-shaped parabola has its minimum point at \\((2, -9)\\) and crosses the \\(x\\)-axis at \\(x = -1\\). Where else does it cross the \\(x\\)-axis?', m: 2, s: ['M1 for using the symmetry line \\(x = 2\\).', 'A1 for \\(x = 5\\).'], link: ['parabolas', 'See symmetry again'] },
  ],
});
