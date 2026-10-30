FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['elimination', 'Solve \\(x + y = 9\\) and \\(x - y = 3\\).', ['\\(x = 6, y = 3\\)', '\\(x = 3, y = 6\\)', '\\(x = 12, y = -3\\)', '\\(x = 4.5, y = 4.5\\)'], 'Add: \\(2x = 12\\).', 'elimination'],
    ['elimination', 'Solve \\(2x + y = 11\\) and \\(x + y = 7\\).', ['\\(x = 4, y = 3\\)', '\\(x = 3, y = 4\\)', '\\(x = 6, y = 1\\)', '\\(x = 18, y = -11\\)'], 'Subtract: \\(x = 4\\).', 'elimination'],
    ['elimination', 'To eliminate \\(y\\) from \\(3x + 4y = 5\\) and \\(x + 4y = 3\\), you…', ['subtract', 'add', 'multiply by 4', 'divide by 3'], 'Same signs subtract.', 'elimination'],
    ['elimination', 'Solve \\(5x - 2y = 16\\) and \\(3x + 2y = 16\\).', ['\\(x = 4, y = 2\\)', '\\(x = 2, y = 4\\)', '\\(x = 4, y = -2\\)', '\\(x = 8, y = 12\\)'], 'Add: \\(8x = 32\\).', 'elimination'],
    ['scaling', 'Solve \\(2x + 3y = 13\\) and \\(x + y = 5\\).', ['\\(x = 2, y = 3\\)', '\\(x = 3, y = 2\\)', '\\(x = 5, y = 1\\)', '\\(x = 1, y = 4\\)'], 'Second × 2, subtract: \\(y = 3\\).', 'scaling'],
    ['scaling', 'To eliminate \\(x\\) from \\(3x + 2y = 8\\) and \\(5x - y = 9\\), multiply…', ['the first by 5 and the second by 3', 'both by 2', 'the second by 2 only', 'the first by 3 only'], 'Both get \\(15x\\).', 'scaling'],
    ['scaling', 'Solve \\(3x + 2y = 4\\) and \\(4x + 3y = 5\\).', ['\\(x = 2, y = -1\\)', '\\(x = -1, y = 2\\)', '\\(x = 2, y = 1\\)', '\\(x = 0, y = 2\\)'], 'Make \\(y\\) match: ×3 and ×2, subtract.', 'scaling'],
    ['scaling', 'Multiplying \\(2x - y = 5\\) by 3 gives…', ['\\(6x - 3y = 15\\)', '\\(6x - y = 5\\)', '\\(6x - 3y = 5\\)', '\\(2x - 3y = 15\\)'], 'Every term × 3.', 'scaling'],
  ],
  LONG: [
    { q: 'Solve the simultaneous equations \\(4x + 3y = 6\\) and \\(2x - 5y = 16\\). Show clear algebraic working.', m: 3, s: ['M1 for multiplying to match coefficients, e.g. \\(4x - 10y = 32\\).', 'M1 for eliminating and solving for one letter: \\(13y = -26\\).', 'A1 for \\(x = 3\\), \\(y = -2\\).'], link: ['scaling', 'See multiplying first again'] },
    { q: 'Solve \\(3x + y = 17\\) and \\(x - y = 3\\).', m: 3, s: ['M1 for adding the equations: \\(4x = 20\\).', 'M1 for substituting \\(x = 5\\).', 'A1 for \\(x = 5\\), \\(y = 2\\).'], link: ['elimination', 'See elimination again'] },
    { q: 'Jo says the solution of \\(x + 2y = 8\\) and \\(3x - 2y = 0\\) is \\(x = 2, y = 3\\). Show whether she is right.', m: 2, s: ['M1 for substituting into both equations, e.g. \\(2 + 6 = 8\\) and \\(6 - 6 = 0\\).', 'A1 for “yes, both equations are true”.'], link: ['elimination', 'See checking solutions again'] },
  ],
});
