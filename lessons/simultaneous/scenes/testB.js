// Questions on the Higher-only section (sim-graphs) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['sim-problems', 'Solve \\(y = 3x\\) and \\(x + y = 12\\).', ['\\(x = 3, y = 9\\)', '\\(x = 4, y = 12\\)', '\\(x = 9, y = 3\\)', '\\(x = 6, y = 6\\)'], '\\(x + 3x = 12\\).', 'sim-problems'],
    ['sim-problems', 'Solve \\(y = x - 2\\) and \\(2x + y = 10\\).', ['\\(x = 4, y = 2\\)', '\\(x = 2, y = 0\\)', '\\(x = 6, y = 4\\)', '\\(x = 3, y = 4\\)'], '\\(3x - 2 = 10\\).', 'sim-problems'],
    ['sim-problems', 'Two numbers add up to 20 and differ by 6. The larger is…', ['13', '14', '7', '10'], '\\(2x = 26\\).', 'sim-problems'],
    ['sim-problems', '4 pens and 1 ruler cost £3.30; 2 pens and 1 ruler cost £1.90. A pen costs…', ['70p', '50p', '£1.40', '80p'], 'Subtract: 2 pens cost £1.40.', 'sim-problems'],
    ['sim-problems', 'Which pair of equations describes: “a sofa and 2 chairs cost £700; 2 sofas and a chair cost £1100”?', ['\\(s + 2c = 700\\), \\(2s + c = 1100\\)', '\\(2s + c = 700\\), \\(s + 2c = 1100\\)', '\\(s + c = 700\\), \\(s + c = 1100\\)', '\\(3sc = 1800\\)'], 'One equation for each fact.', 'sim-problems'],
    ['sim-graphs', 'The lines \\(y = x + 4\\) and \\(y = 3x\\) cross at…', ['\\((2, 6)\\)', '\\((6, 2)\\)', '\\((1, 5)\\)', '\\((4, 12)\\)'], '\\(3x = x + 4\\).', 'sim-graphs'],
    ['sim-graphs', 'How many solutions do \\(y = 5x + 1\\) and \\(y = 5x - 4\\) have?', ['none', 'one', 'two', 'infinitely many'], 'Parallel lines.', 'sim-graphs'],
    ['sim-graphs', 'The solution of a pair of simultaneous equations is shown on their graphs by…', ['the point where the lines cross', 'the \\(y\\)-intercepts', 'the gradients', 'where the lines cross the \\(x\\)-axis'], 'It lies on both lines.', 'sim-graphs'],
  ],
  LONG: [
    { q: 'At a café, 3 teas and 2 coffees cost £8.40. 2 teas and 3 coffees cost £8.60. Work out the cost of one tea and one coffee.', m: 4, s: ['M1 for two correct equations, e.g. \\(3t + 2c = 840\\), \\(2t + 3c = 860\\).', 'M1 for a correct method to eliminate one letter.', 'A1 for tea £1.60.', 'A1 for coffee £1.80.'], link: ['sim-problems', 'See problems again'] },
    { q: 'Solve \\(y = 2x + 3\\) and \\(5x - 2y = 1\\) by substitution.', m: 3, s: ['M1 for \\(5x - 2(2x + 3) = 1\\).', 'M1 for \\(x = 7\\).', 'A1 for \\(x = 7\\), \\(y = 17\\).'], link: ['sim-problems', 'See substitution again'] },
    { q: 'Find the coordinates of the point where \\(y = 4 - x\\) meets \\(2y = x + 5\\). Explain how this relates to the graphs.', m: 3, h: true, s: ['M1 for \\(2(4 - x) = x + 5\\).', 'A1 for \\((1, 3)\\).', 'B1 for saying it is where the two straight lines intersect.'], link: ['sim-graphs', 'See graphs again'] },
  ],
});
