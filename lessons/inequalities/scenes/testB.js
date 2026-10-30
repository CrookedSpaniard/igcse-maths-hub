// Questions on the Higher-only sections (quad-ineq, regions-h) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['regions', 'Which region shows \\(y > 2\\)?', ['Above the dashed line \\(y = 2\\)', 'Above the solid line \\(y = 2\\)', 'Below the dashed line \\(y = 2\\)', 'Right of the line \\(x = 2\\)'], 'Bigger \\(y\\) is above; \\(>\\) is dashed.', 'regions'],
    ['regions', 'Does \\((3, 1)\\) satisfy \\(x \\le 3\\) and \\(y < 1\\)?', ['No', 'Yes', 'Only the first', 'It cannot be decided'], '\\(y = 1\\) is not less than 1.', 'regions'],
    ['regions', 'The boundary line for \\(y \\le x - 1\\) is…', ['solid, through \\((0, -1)\\) with gradient 1', 'dashed, through \\((0, -1)\\)', 'solid, through \\((0, 1)\\)', 'vertical'], '\\(\\le\\): solid line \\(y = x - 1\\).', 'regions'],
    ['regions', 'Which point is in the region \\(x > 1\\), \\(y > 1\\), \\(x + y < 5\\)?', ['\\((2, 2)\\)', '\\((1, 2)\\)', '\\((3, 2)\\)', '\\((2, 3)\\)'], '\\(2 + 2 = 4 < 5\\).', 'regions'],
    ['quad-ineq', 'Solve \\(x^2 < 25\\).', ['\\(-5 < x < 5\\)', '\\(x < 5\\)', '\\(x < -5\\) or \\(x > 5\\)', '\\(x < 25\\)'], 'Between the roots.', 'quad-ineq'],
    ['quad-ineq', 'Solve \\((x - 1)(x - 6) \\ge 0\\).', ['\\(x \\le 1\\) or \\(x \\ge 6\\)', '\\(1 \\le x \\le 6\\)', '\\(x \\ge 6\\)', '\\(x \\ge 1\\)'], 'Outside the roots.', 'quad-ineq'],
    ['regions-h', 'Which inequality describes the region above the solid line through \\((0, 2)\\) and \\((4, 0)\\)?', ['\\(x + 2y \\ge 4\\)', '\\(x + 2y \\le 4\\)', '\\(2x + y \\ge 4\\)', '\\(x + 2y > 4\\)'], 'The line is \\(x + 2y = 4\\).', 'regions-h'],
    ['regions-h', 'How many integer points satisfy \\(x \\ge 1\\), \\(y \\ge 1\\), \\(x + y \\le 4\\)?', ['6', '3', '10', '4'], '(1,1), (1,2), (1,3), (2,1), (2,2), (3,1).', 'regions-h'],
  ],
  LONG: [
    { q: 'On a grid, show the region that satisfies \\(x \\ge -1\\), \\(y < 3\\) and \\(y \\ge x\\). Label it R.', m: 3, s: ['B1 for the solid line \\(x = -1\\) and the dashed line \\(y = 3\\).', 'B1 for the solid line \\(y = x\\).', 'B1 for the correct region R.'], link: ['regions', 'See regions again'] },
    { q: 'Solve \\(x^2 - 2x - 8 < 0\\).', m: 3, h: true, s: ['M1 for the critical values from \\((x - 4)(x + 2) = 0\\).', 'A1 for −2 and 4.', 'A1 for \\(-2 < x < 4\\).'], link: ['quad-ineq', 'See quadratic inequalities again'] },
    { q: 'The region R is bounded by the lines \\(y = 1\\), \\(x + y = 6\\) and \\(y = 2x\\). R includes all three lines. Write down the three inequalities that define R.', m: 3, h: true, s: ['B1 for \\(y \\ge 1\\).', 'B1 for \\(x + y \\le 6\\).', 'B1 for \\(y \\le 2x\\).'], link: ['regions-h', 'See harder regions again'] },
  ],
});
