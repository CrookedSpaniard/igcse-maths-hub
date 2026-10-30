// Questions on the Higher-only section (fact-harder) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testA',
  part: 'A',
  Q: [
    ['solve-fact', 'Solve \\((x - 4)(x + 1) = 0\\).', ['\\(x = 4\\) or \\(x = -1\\)', '\\(x = -4\\) or \\(x = 1\\)', '\\(x = 4\\) only', '\\(x = -4\\) or \\(x = -1\\)'], 'Each bracket can be 0.', 'solve-fact'],
    ['solve-fact', 'Solve \\(x^2 + 5x + 6 = 0\\).', ['\\(x = -2\\) or \\(x = -3\\)', '\\(x = 2\\) or \\(x = 3\\)', '\\(x = -1\\) or \\(x = -6\\)', '\\(x = 6\\) or \\(x = -1\\)'], '\\((x + 2)(x + 3) = 0\\).', 'solve-fact'],
    ['solve-fact', 'Solve \\(x^2 - 2x - 15 = 0\\).', ['\\(x = 5\\) or \\(x = -3\\)', '\\(x = -5\\) or \\(x = 3\\)', '\\(x = 15\\) or \\(x = -1\\)', '\\(x = 5\\) or \\(x = 3\\)'], '\\((x - 5)(x + 3) = 0\\).', 'solve-fact'],
    ['solve-fact', 'Solve \\(x^2 = 6x\\).', ['\\(x = 0\\) or \\(x = 6\\)', '\\(x = 6\\) only', '\\(x = \\pm 6\\)', '\\(x = \\sqrt6\\)'], '\\(x(x - 6) = 0\\).', 'solve-fact'],
    ['solve-fact', 'Solve \\(x^2 - 36 = 0\\).', ['\\(x = 6\\) or \\(x = -6\\)', '\\(x = 6\\) only', '\\(x = 18\\)', '\\(x = 36\\)'], '\\((x + 6)(x - 6) = 0\\).', 'solve-fact'],
    ['solve-fact', 'The graph of \\(y = x^2 - x - 12\\) crosses the \\(x\\)-axis at…', ['\\(x = 4\\) and \\(x = -3\\)', '\\(x = -4\\) and \\(x = 3\\)', '\\(x = 12\\) and \\(x = -1\\)', '\\(x = -12\\)'], '\\((x - 4)(x + 3) = 0\\).', 'solve-fact'],
    ['fact-harder', 'Solve \\(2x^2 + x - 6 = 0\\).', ['\\(x = 1.5\\) or \\(x = -2\\)', '\\(x = -1.5\\) or \\(x = 2\\)', '\\(x = 3\\) or \\(x = -2\\)', '\\(x = 6\\) or \\(x = -1\\)'], '\\((2x - 3)(x + 2) = 0\\).', 'fact-harder'],
    ['fact-harder', 'Solve \\(3x^2 - 12 = 0\\).', ['\\(x = \\pm 2\\)', '\\(x = \\pm 4\\)', '\\(x = 2\\) only', '\\(x = \\pm 6\\)'], '\\(3(x^2 - 4) = 0\\).', 'fact-harder'],
  ],
  LONG: [
    { q: 'Solve \\(x^2 + 3x - 28 = 0\\).', m: 3, s: ['M1 for \\((x \\pm 7)(x \\pm 4)\\).', 'A1 for \\((x + 7)(x - 4)\\).', 'A1 for \\(x = -7\\) and \\(x = 4\\).'], link: ['solve-fact', 'See solving by factorising again'] },
    { q: 'Solve \\(x^2 - 9x = 0\\).', m: 2, s: ['M1 for \\(x(x - 9)\\).', 'A1 for \\(x = 0\\) and \\(x = 9\\).'], link: ['solve-fact', 'See rearranging to = 0 again'] },
    { q: 'Solve \\(6x^2 - 7x - 3 = 0\\).', m: 3, h: true, s: ['M1 for splitting the middle term, e.g. \\(6x^2 - 9x + 2x - 3\\).', 'A1 for \\((3x + 1)(2x - 3)\\).', 'A1 for \\(x = -\\frac13\\) and \\(x = \\frac32\\).'], link: ['fact-harder', 'See ax² + bx + c again'] },
  ],
});
