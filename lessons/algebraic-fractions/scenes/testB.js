FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['af-addsub', 'Simplify \\(\\frac{x}{4} + \\frac{x}{6}\\).', ['\\(\\frac{5x}{12}\\)', '\\(\\frac{2x}{10}\\)', '\\(\\frac{x}{5}\\)', '\\(\\frac{x^2}{24}\\)'], '\\(\\frac{3x + 2x}{12}\\).', 'af-addsub'],
    ['af-addsub', 'What is the common denominator of \\(\\frac{1}{x + 2}\\) and \\(\\frac{1}{x - 5}\\)?', ['\\((x + 2)(x - 5)\\)', '\\(2x - 3\\)', '\\(x - 3\\)', '\\(x^2 - 10\\)'], 'Multiply the two denominators.', 'af-addsub'],
    ['af-addsub', 'Simplify \\(\\frac{2}{x} + \\frac{3}{x + 1}\\).', ['\\(\\frac{5x + 2}{x(x + 1)}\\)', '\\(\\frac{5}{2x + 1}\\)', '\\(\\frac{5x + 3}{x(x + 1)}\\)', '\\(\\frac{6}{x(x + 1)}\\)'], '\\(2(x + 1) + 3x = 5x + 2\\).', 'af-addsub'],
    ['af-addsub', 'Simplify \\(\\frac{5}{x - 1} - \\frac{2}{x + 1}\\).', ['\\(\\frac{3x + 7}{(x - 1)(x + 1)}\\)', '\\(\\frac{3x + 3}{(x - 1)(x + 1)}\\)', '\\(\\frac{3}{2}\\)', '\\(\\frac{3x - 7}{(x - 1)(x + 1)}\\)'], '\\(5(x + 1) - 2(x - 1) = 3x + 7\\).', 'af-addsub'],
    ['af-equations', 'Solve \\(\\frac{x}{3} + \\frac{x}{6} = 5\\).', ['\\(x = 10\\)', '\\(x = 30\\)', '\\(x = 5\\)', '\\(x = 2.5\\)'], '× 6: \\(2x + x = 30\\).', 'af-equations'],
    ['af-equations', 'Solve \\(\\frac{x + 3}{2} = \\frac{x - 1}{3}\\).', ['\\(x = -11\\)', '\\(x = 11\\)', '\\(x = -7\\)', '\\(x = 1\\)'], '\\(3(x + 3) = 2(x - 1)\\), \\(3x + 9 = 2x - 2\\).', 'af-equations'],
    ['af-equations', 'Solve \\(\\frac{12}{x} = 4\\).', ['\\(x = 3\\)', '\\(x = 48\\)', '\\(x = 8\\)', '\\(x = \\frac13\\)'], '\\(12 = 4x\\).', 'af-equations'],
    ['af-equations', 'Which value can never be a solution of \\(\\frac{1}{x - 2} + \\frac{1}{x} = 1\\)?', ['\\(x = 2\\)', '\\(x = 1\\)', '\\(x = -2\\)', '\\(x = 3\\)'], 'It makes a denominator zero.', 'af-equations'],
  ],
  LONG: [
    { q: 'Write \\(\\dfrac{3}{x + 4} - \\dfrac{1}{x - 2}\\) as a single fraction in its simplest form.', m: 3, s: ['M1 for a common denominator \\((x + 4)(x - 2)\\).', 'M1 for the numerator \\(3(x - 2) - (x + 4)\\).', 'A1 for \\(\\dfrac{2x - 10}{(x + 4)(x - 2)}\\) or equivalent, e.g. \\(\\dfrac{2(x - 5)}{(x + 4)(x - 2)}\\).'], link: ['af-addsub', 'See subtracting again'] },
    { q: 'Solve \\(\\dfrac{2x + 1}{3} - \\dfrac{x - 2}{4} = 2\\).', m: 3, s: ['M1 for multiplying every term by 12, e.g. \\(4(2x + 1) - 3(x - 2) = 24\\).', 'M1 for expanding correctly: \\(8x + 4 - 3x + 6 = 24\\).', 'A1 for \\(x = \\frac{14}{5}\\) (2.8).'], link: ['af-equations', 'See clearing fractions again'] },
    { q: 'Solve \\(\\dfrac{5}{x} + \\dfrac{4}{x + 2} = 3\\).', m: 4, s: ['M1 for multiplying through by \\(x(x + 2)\\): \\(5(x + 2) + 4x = 3x(x + 2)\\).', 'M1 for a correct three-term quadratic: \\(3x^2 - 3x - 10 = 0\\).', 'M1 for using the quadratic formula correctly.', 'A1 for \\(x = 2.39\\) and \\(x = -1.39\\) (to 2 d.p.).'], link: ['af-equations', 'See equations with fractions again'] },
  ],
});
