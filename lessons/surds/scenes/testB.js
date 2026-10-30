FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['expand', 'Expand \\(\\sqrt{5}(\\sqrt{5} + 3)\\)', ['\\(5 + 3\\sqrt{5}\\)', '\\(5 + 3\\)', '\\(\\sqrt{10} + 3\\sqrt{5}\\)', '\\(8\\sqrt{5}\\)'], '\\(\\sqrt5 \\times \\sqrt5 = 5\\).', 'expand'],
    ['expand', 'Expand \\((1 + \\sqrt{3})(2 + \\sqrt{3})\\)', ['\\(5 + 3\\sqrt{3}\\)', '\\(2 + 3\\)', '\\(5 + 2\\sqrt{3}\\)', '\\(2 + 3\\sqrt{3}\\)'], '\\(2 + \\sqrt3 + 2\\sqrt3 + 3\\).', 'expand'],
    ['expand', 'Work out \\((\\sqrt{11} + 3)(\\sqrt{11} - 3)\\)', ['2', '20', '\\(11 - 3\\)', '\\(2\\sqrt{11}\\)'], '\\(11 - 9 = 2\\).', 'expand'],
    ['expand', 'Expand \\((\\sqrt{2} + 1)^2\\)', ['\\(3 + 2\\sqrt{2}\\)', '\\(3\\)', '\\(2 + 1\\)', '\\(3 + \\sqrt{2}\\)'], '\\(2 + \\sqrt2 + \\sqrt2 + 1\\).', 'expand'],
    ['rationalise', 'Rationalise \\(\\dfrac{12}{\\sqrt{3}}\\)', ['\\(4\\sqrt{3}\\)', '\\(4\\)', '\\(3\\sqrt{4}\\)', '\\(\\dfrac{\\sqrt3}{12}\\)'], '\\(\\frac{12\\sqrt3}{3}\\).', 'rationalise'],
    ['rationalise', 'Rationalise \\(\\dfrac{3}{\\sqrt{6}}\\)', ['\\(\\dfrac{\\sqrt{6}}{2}\\)', '\\(\\sqrt{2}\\)', '\\(\\dfrac{1}{2}\\)', '\\(3\\sqrt{6}\\)'], '\\(\\frac{3\\sqrt6}{6}\\).', 'rationalise'],
    ['rationalise', 'What do you multiply by to rationalise \\(\\dfrac{2}{5 + \\sqrt{2}}\\)?', ['\\(\\dfrac{5 - \\sqrt{2}}{5 - \\sqrt{2}}\\)', '\\(\\dfrac{\\sqrt{2}}{\\sqrt{2}}\\)', '\\(\\dfrac{5 + \\sqrt{2}}{5 + \\sqrt{2}}\\)', '\\(\\dfrac{5}{5}\\)'], 'The conjugate.', 'rationalise'],
    ['rationalise', 'Rationalise \\(\\dfrac{4}{\\sqrt{5} - 1}\\)', ['\\(\\sqrt{5} + 1\\)', '\\(\\sqrt{5} - 1\\)', '\\(4\\sqrt{5}\\)', '\\(\\dfrac{4}{5}\\)'], '\\(\\frac{4(\\sqrt5 + 1)}{5 - 1}\\).', 'rationalise'],
  ],
  LONG: [
    { q: 'Expand and simplify \\((4 - \\sqrt{3})(2 + 3\\sqrt{3})\\). Give your answer in the form \\(a + b\\sqrt{3}\\).', m: 2, s: ['M1 for 4 correct terms, e.g. \\(8 + 12\\sqrt3 - 2\\sqrt3 - 9\\).', 'A1 for \\(-1 + 10\\sqrt3\\).'], link: ['expand', 'See expanding brackets again'] },
    { q: 'Show that \\(\\dfrac{18}{\\sqrt{3}} - \\sqrt{12}\\) can be written as \\(4\\sqrt{3}\\).', m: 3, s: ['M1 for rationalising: \\(\\frac{18\\sqrt3}{3} = 6\\sqrt3\\).', 'M1 for \\(\\sqrt{12} = 2\\sqrt3\\).', 'A1 for \\(6\\sqrt3 - 2\\sqrt3 = 4\\sqrt3\\) with all working shown.'], link: ['rationalise', 'See rationalising again'] },
    { q: 'Rationalise the denominator and simplify \\(\\dfrac{1 + \\sqrt{2}}{3 - \\sqrt{2}}\\). Give your answer in the form \\(\\dfrac{a + b\\sqrt{2}}{c}\\).', m: 3, s: ['M1 for multiplying top and bottom by \\(3 + \\sqrt2\\).', 'M1 for denominator 7, or numerator \\(3 + \\sqrt2 + 3\\sqrt2 + 2\\).', 'A1 for \\(\\frac{5 + 4\\sqrt2}{7}\\).'], link: ['rationalise', 'See the conjugate again'] },
  ],
});
