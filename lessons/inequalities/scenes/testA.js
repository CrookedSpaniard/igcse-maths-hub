FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['number-line', 'Which symbol means “less than or equal to”?', ['\\(\\le\\)', '\\(<\\)', '\\(\\ge\\)', '\\(>\\)'], 'The line under the sign means “or equal to”.', 'number-line'],
    ['number-line', 'A number line shows a closed circle at 2 and an arrow to the right. Which inequality is it?', ['\\(x \\ge 2\\)', '\\(x > 2\\)', '\\(x \\le 2\\)', '\\(x < 2\\)'], 'Closed: 2 included. Right: bigger values.', 'number-line'],
    ['number-line', 'List the integers that satisfy \\(-2 < x \\le 2\\).', ['−1, 0, 1, 2', '−2, −1, 0, 1, 2', '−2, −1, 0, 1', '−1, 0, 1'], '−2 is not included; 2 is.', 'number-line'],
    ['number-line', 'Which inequality is shown by an open circle at −3 and an arrow to the left?', ['\\(x < -3\\)', '\\(x \\le -3\\)', '\\(x > -3\\)', '\\(x \\ge -3\\)'], 'Open: not included. Left: smaller.', 'number-line'],
    ['solve-ineq', 'Solve \\(5x - 2 > 13\\).', ['\\(x > 3\\)', '\\(x < 3\\)', '\\(x > 2.2\\)', '\\(x > 15\\)'], '\\(5x > 15\\).', 'solve-ineq'],
    ['solve-ineq', 'Solve \\(7 - 2x \\ge 1\\).', ['\\(x \\le 3\\)', '\\(x \\ge 3\\)', '\\(x \\le -3\\)', '\\(x \\ge -3\\)'], '\\(-2x \\ge -6\\); ÷ (−2) reverses.', 'solve-ineq'],
    ['solve-ineq', 'Solve \\(-3 \\le 2x + 1 < 7\\).', ['\\(-2 \\le x < 3\\)', '\\(-1 \\le x < 4\\)', '\\(-2 < x \\le 3\\)', '\\(-4 \\le x < 6\\)'], 'Subtract 1, then ÷ 2.', 'solve-ineq'],
    ['solve-ineq', 'What is the smallest integer that satisfies \\(3x > 10\\)?', ['4', '3', '3.3', '10'], '\\(x > 3.33…\\)', 'solve-ineq'],
  ],
  LONG: [
    { q: '(a) Solve \\(4x + 3 < 2x + 12\\). (b) Write down the largest integer that satisfies it.', m: 3, s: ['M1 for \\(2x < 9\\).', 'A1 for \\(x < 4.5\\).', 'B1 for 4.'], link: ['solve-ineq', 'See solving inequalities again'] },
    { q: 'Show the inequality \\(-1 < x \\le 4\\) on a number line, and list the integers that satisfy it.', m: 2, s: ['B1 for an open circle at −1 and a closed circle at 4, joined.', 'B1 for 0, 1, 2, 3, 4.'], link: ['number-line', 'See number lines again'] },
    { q: 'Solve \\(-5 \\le 3x + 1 \\le 10\\). Show your working.', m: 2, s: ['M1 for subtracting 1 from all three parts: \\(-6 \\le 3x \\le 9\\).', 'A1 for \\(-2 \\le x \\le 3\\).'], link: ['solve-ineq', 'See two-sided inequalities again'] },
  ],
});
