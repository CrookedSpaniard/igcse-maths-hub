FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['composite', '\\(f(x) = x - 4\\), \\(g(x) = 2x\\). What is \\(fg(5)\\)?', ['6', '2', '10', '−2'], '\\(g(5) = 10\\), \\(f(10) = 6\\).', 'composite'],
    ['composite', '\\(f(x) = x - 4\\), \\(g(x) = 2x\\). What is \\(gf(5)\\)?', ['2', '6', '1', '10'], '\\(f(5) = 1\\), \\(g(1) = 2\\).', 'composite'],
    ['composite', '\\(f(x) = 3x\\), \\(g(x) = x + 2\\). \\(fg(x) =\\)', ['\\(3x + 6\\)', '\\(3x + 2\\)', '\\(3x^2 + 6x\\)', '\\(x + 6\\)'], '\\(3(x + 2)\\).', 'composite'],
    ['composite', 'In \\(fg(x)\\), which function is applied first?', ['\\(g\\)', '\\(f\\)', 'either', 'both at once'], 'The one next to \\(x\\).', 'composite'],
    ['inverse-fn', '\\(f(x) = x + 9\\). \\(f^{-1}(x) =\\)', ['\\(x - 9\\)', '\\(\\frac{x}{9}\\)', '\\(9 - x\\)', '\\(\\frac{1}{x + 9}\\)'], 'Undo + 9.', 'inverse-fn'],
    ['inverse-fn', '\\(f(x) = 4x - 3\\). \\(f^{-1}(x) =\\)', ['\\(\\frac{x + 3}{4}\\)', '\\(\\frac{x}{4} + 3\\)', '\\(4x + 3\\)', '\\(\\frac{x - 3}{4}\\)'], 'Add 3, then ÷ 4.', 'inverse-fn'],
    ['inverse-fn', '\\(f(2) = 11\\). What is \\(f^{-1}(11)\\)?', ['2', '11', '\\(\\frac{1}{11}\\)', '22'], 'The inverse takes the output back to the input.', 'inverse-fn'],
    ['inverse-fn', 'Which line is the mirror line between \\(y = f(x)\\) and \\(y = f^{-1}(x)\\)?', ['\\(y = x\\)', '\\(y = 0\\)', '\\(x = 0\\)', '\\(y = -x\\)'], 'Swapping \\(x\\) and \\(y\\).', 'inverse-fn'],
  ],
  LONG: [
    { q: '\\(f(x) = 2x - 5\\) and \\(g(x) = x^2\\). (a) Find \\(gf(4)\\). (b) Find \\(fg(x)\\). (c) Solve \\(fg(x) = 13\\).', m: 5, s: ['B1 for \\(gf(4) = 9\\).', 'B1 for \\(fg(x) = 2x^2 - 5\\).', 'M1 for \\(2x^2 - 5 = 13\\).', 'M1 for \\(x^2 = 9\\).', 'A1 for \\(x = 3\\) and \\(x = -3\\).'], link: ['composite', 'See composite functions again'] },
    { q: '\\(f(x) = \\dfrac{3x + 1}{2}\\). Find \\(f^{-1}(x)\\).', m: 2, s: ['M1 for \\(2y = 3x + 1\\) or a correct first step to make \\(x\\) the subject.', 'A1 for \\(f^{-1}(x) = \\dfrac{2x - 1}{3}\\).'], link: ['inverse-fn', 'See inverse functions again'] },
    { q: '\\(f(x) = \\dfrac{x}{x + 2}\\). Find \\(f^{-1}(x)\\).', m: 3, s: ['M1 for \\(y(x + 2) = x\\).', 'M1 for collecting and factorising: \\(x(y - 1) = -2y\\).', 'A1 for \\(f^{-1}(x) = \\dfrac{2x}{1 - x}\\) or equivalent.'], link: ['inverse-fn', 'See the algebra method again'] },
  ],
});
