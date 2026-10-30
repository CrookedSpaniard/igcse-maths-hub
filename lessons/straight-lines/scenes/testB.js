// Questions on the Higher-only sections (two-points, parallel-perp) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['gradient', 'A line rises 6 for every 3 across. Its gradient is…', ['2', '\\(\\frac12\\)', '3', '18'], '\\(6 \\div 3\\).', 'gradient'],
    ['gradient', 'A line falls 2 for every 5 across. Its gradient is…', ['\\(-\\frac25\\)', '\\(\\frac25\\)', '\\(-\\frac52\\)', '−3'], 'Down: negative.', 'gradient'],
    ['ymxc', 'What is the gradient of \\(y = 5x - 2\\)?', ['5', '−2', '\\(\\frac15\\)', '3'], 'The number in front of \\(x\\).', 'ymxc'],
    ['ymxc', 'Where does \\(y = 4 - 3x\\) cross the \\(y\\)-axis?', ['\\((0, 4)\\)', '\\((0, -3)\\)', '\\((4, 0)\\)', '\\((-3, 0)\\)'], '\\(c = 4\\).', 'ymxc'],
    ['ymxc', 'Which line has gradient \\(-1\\) and \\(y\\)-intercept 6?', ['\\(y = 6 - x\\)', '\\(y = x - 6\\)', '\\(y = 6x - 1\\)', '\\(y = -6x + 1\\)'], '\\(y = -x + 6\\).', 'ymxc'],
    ['ymxc', 'Rearranged, \\(2y = 8x - 6\\) is…', ['\\(y = 4x - 3\\)', '\\(y = 8x - 3\\)', '\\(y = 4x - 6\\)', '\\(y = 16x - 12\\)'], 'Divide every term by 2.', 'ymxc'],
    ['two-points', 'The gradient of the line through \\((1, 3)\\) and \\((4, 12)\\) is…', ['3', '\\(\\frac13\\)', '9', '4'], '\\(\\frac{9}{3}\\).', 'two-points'],
    ['parallel-perp', 'Which line is perpendicular to \\(y = 3x + 1\\)?', ['\\(y = -\\frac13 x + 2\\)', '\\(y = 3x - 1\\)', '\\(y = -3x\\)', '\\(y = \\frac13 x\\)'], '\\(3 \\times -\\frac13 = -1\\).', 'parallel-perp'],
  ],
  LONG: [
    { q: '(a) Complete a table of values for \\(y = 3x - 2\\) for \\(x = -1, 0, 1, 2, 3\\). (b) Write down the gradient and the \\(y\\)-intercept of the line.', m: 3, s: ['B2 for all five values −5, −2, 1, 4, 7 (B1 for at least three).', 'B1 for gradient 3 and \\(y\\)-intercept −2.'], link: ['ymxc', 'See y = mx + c again'] },
    { q: 'Find the equation of the line that passes through \\((2, -1)\\) and \\((6, 7)\\).', m: 3, h: true, s: ['M1 for the gradient \\(\\frac{7 - (-1)}{6 - 2} = 2\\).', 'M1 for substituting a point into \\(y = 2x + c\\).', 'A1 for \\(y = 2x - 5\\).'], link: ['two-points', 'See the line through two points again'] },
    { q: 'Line \\(L\\) has equation \\(y = 2x + 3\\). Find the equation of the line perpendicular to \\(L\\) that passes through \\((4, 1)\\).', m: 3, h: true, s: ['B1 for gradient \\(-\\frac12\\).', 'M1 for \\(1 = -\\frac12(4) + c\\).', 'A1 for \\(y = -\\frac12 x + 3\\).'], link: ['parallel-perp', 'See perpendicular lines again'] },
  ],
});
