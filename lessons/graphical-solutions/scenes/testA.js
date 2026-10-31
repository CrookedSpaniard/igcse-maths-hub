FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['intersections', 'Where do \\(y = x^2\\) and \\(y = 4\\) cross?', ['\\(x = 2\\) and \\(x = -2\\)', '\\(x = 4\\)', '\\(x = 16\\)', '\\(x = 2\\) only'], '\\(x^2 = 4\\).', 'intersections'],
    ['intersections', 'The crossing points of \\(y = x^2 - 1\\) and \\(y = x + 1\\) solve…', ['\\(x^2 - x - 2 = 0\\)', '\\(x^2 + x = 0\\)', '\\(x^2 - 1 = 0\\)', '\\(x^2 + x - 2 = 0\\)'], '\\(x^2 - 1 - (x + 1) = 0\\).', 'intersections'],
    ['intersections', 'A line meets a curve at exactly one point. The line is…', ['a tangent to the curve', 'parallel to the curve', 'an asymptote', 'the line of symmetry'], 'It just touches.', 'intersections'],
    ['intersections', 'The \\(x\\)-coordinates where \\(y = x^2\\) meets \\(y = x + 6\\) are…', ['3 and −2', '−3 and 2', '6 and 1', '2 and 3'], '\\((x - 3)(x + 2) = 0\\).', 'intersections'],
    ['which-line', 'The graph of \\(y = x^2\\) is drawn. Which line solves \\(x^2 - 3x - 1 = 0\\)?', ['\\(y = 3x + 1\\)', '\\(y = 3x - 1\\)', '\\(y = -3x + 1\\)', '\\(y = 1\\)'], '\\(x^2 = 3x + 1\\).', 'which-line'],
    ['which-line', 'The graph of \\(y = x^2 - 4x\\) is drawn. Which line solves \\(x^2 - 4x - 2 = 0\\)?', ['\\(y = 2\\)', '\\(y = -2\\)', '\\(y = 4x + 2\\)', '\\(y = x - 2\\)'], '\\(x^2 - 4x = 2\\).', 'which-line'],
    ['which-line', 'The graph of \\(y = x^2 + 2x\\) is drawn. Which line solves \\(x^2 = 5\\)?', ['\\(y = 2x + 5\\)', '\\(y = 5\\)', '\\(y = -2x + 5\\)', '\\(y = 2x - 5\\)'], 'Add \\(2x\\) to both sides: \\(x^2 + 2x = 2x + 5\\).', 'which-line'],
    ['which-line', 'To solve \\(\\cos x = -0.3\\) using the graph of \\(y = \\cos x\\), draw…', ['\\(y = -0.3\\)', '\\(x = -0.3\\)', '\\(y = 0.3\\)', '\\(y = x - 0.3\\)'], 'A horizontal line.', 'which-line'],
  ],
  LONG: [
    { q: 'The graph of \\(y = x^2 - 2x - 3\\) is drawn. (a) By drawing a suitable line, explain how to solve \\(x^2 - 3x - 1 = 0\\). (b) The solutions are about \\(-0.3\\) and \\(3.3\\). Show that these come from your line.', m: 3, s: ['M1 for rearranging: \\(x^2 - 2x - 3 = x - 2\\).', 'A1 for the line \\(y = x - 2\\).', 'B1 for explaining that the solutions are the \\(x\\)-coordinates of the crossing points.'], link: ['which-line', 'See choosing the line again'] },
    { q: 'Find the coordinates of the points where \\(y = x^2 - 3\\) meets \\(y = 2x\\).', m: 3, s: ['M1 for \\(x^2 - 2x - 3 = 0\\).', 'A1 for \\(x = 3\\) and \\(x = -1\\).', 'A1 for \\((3, 6)\\) and \\((-1, -2)\\).'], link: ['intersections', 'See intersections again'] },
    { q: 'Explain why the line \\(y = -5\\) does not meet the curve \\(y = x^2 - 2x - 1\\).', m: 2, s: ['M1 for finding the minimum value \\(-2\\) at \\(x = 1\\) (or showing \\(x^2 - 2x + 4 = 0\\) has a negative discriminant).', 'A1 for a correct conclusion.'], link: ['intersections', 'See when there is no solution'] },
  ],
});
