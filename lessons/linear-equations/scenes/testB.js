FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['eq-fractions', 'Solve \\(\\frac{x + 4}{3} = 6\\).', ['\\(x = 14\\)', '\\(x = 22\\)', '\\(x = 2\\)', '\\(x = 6\\)'], '\\(x + 4 = 18\\).', 'eq-fractions'],
    ['eq-fractions', 'Solve \\(\\frac{2x}{5} = 8\\).', ['\\(x = 20\\)', '\\(x = 16\\)', '\\(x = 3.2\\)', '\\(x = 80\\)'], '\\(2x = 40\\).', 'eq-fractions'],
    ['eq-fractions', 'Solve \\(\\frac{x - 1}{2} = \\frac{x + 3}{4}\\).', ['\\(x = 5\\)', '\\(x = 1\\)', '\\(x = 7\\)', '\\(x = -5\\)'], '\\(4(x - 1) = 2(x + 3)\\), \\(2x = 10\\).', 'eq-fractions'],
    ['eq-fractions', 'Solve \\(\\frac{x}{3} + \\frac{x}{6} = 4\\).', ['\\(x = 8\\)', '\\(x = 12\\)', '\\(x = 24\\)', '\\(x = 2\\)'], '× 6: \\(2x + x = 24\\).', 'eq-fractions'],
    ['forming', 'I think of a number, add 5 and double it. The answer is 26. What is my number?', ['8', '10.5', '18', '13'], '\\(2(n + 5) = 26\\).', 'forming'],
    ['forming', 'Two angles on a straight line are \\(2x\\) and \\(4x\\). What is \\(x\\)?', ['30°', '60°', '45°', '90°'], '\\(6x = 180\\).', 'forming'],
    ['forming', 'A rectangle is \\(x\\) cm wide and \\(2x\\) cm long. The perimeter is 42 cm. What is \\(x\\)?', ['7', '14', '10.5', '21'], '\\(6x = 42\\).', 'forming'],
    ['forming', 'Kim is 4 years older than Lee. Their ages add up to 30. How old is Lee?', ['13', '17', '15', '26'], '\\(l + l + 4 = 30\\).', 'forming'],
  ],
  LONG: [
    { q: 'Solve \\(\\dfrac{3x - 2}{4} = \\dfrac{x + 6}{2}\\).', m: 3, s: ['M1 for cross-multiplying, e.g. \\(2(3x - 2) = 4(x + 6)\\).', 'M1 for \\(2x = 28\\) or equivalent.', 'A1 for \\(x = 14\\).'], link: ['eq-fractions', 'See fractions on both sides again'] },
    { q: 'The angles of a quadrilateral are \\(x\\), \\(2x\\), \\(3x - 20\\) and \\(x + 30\\) degrees. Work out the size of the largest angle.', m: 4, s: ['M1 for adding the four angles and setting equal to 360.', 'M1 for \\(7x + 10 = 360\\).', 'A1 for \\(x = 50\\).', 'A1 for 130°.'], link: ['forming', 'See forming equations again'] },
    { q: 'Sara has £\\(x\\). Tim has £5 more than Sara. Uma has twice as much as Tim. Together they have £75. How much does Uma have?', m: 4, s: ['M1 for expressions \\(x + 5\\) and \\(2(x + 5)\\).', 'M1 for \\(x + x + 5 + 2(x + 5) = 75\\).', 'A1 for \\(x = 15\\).', 'A1 for £40.'], link: ['forming', 'See problems in words again'] },
  ],
});
