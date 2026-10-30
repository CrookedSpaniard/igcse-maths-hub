FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['substitution', '\\(P = 2l + 2w\\). Find \\(P\\) when \\(l = 7\\) and \\(w = 4\\).', ['22', '15', '30', '56'], '\\(14 + 8 = 22\\).', 'substitution'],
    ['substitution', '\\(y = x^2 - 3x\\). Find \\(y\\) when \\(x = -2\\).', ['10', '−2', '2', '−10'], '\\(4 - (-6) = 10\\).', 'substitution'],
    ['substitution', '\\(F = \\frac{9C}{5} + 32\\). Find \\(F\\) when \\(C = 25\\).', ['77', '45', '57', '82'], '\\(\\frac{225}{5} + 32 = 45 + 32\\).', 'substitution'],
    ['substitution', 'What is \\(-3a^2\\) when \\(a = -2\\)?', ['−12', '12', '36', '−36'], '\\(a^2 = 4\\), so \\(-3 \\times 4\\).', 'substitution'],
    ['writing', 'Write an expression for “\\(t\\) divided by 4, then add 9”.', ['\\(\\frac{t}{4} + 9\\)', '\\(\\frac{t + 9}{4}\\)', '\\(4t + 9\\)', '\\(\\frac{4}{t} + 9\\)'], 'Divide first, then add.', 'writing'],
    ['writing', 'Tickets cost £\\(c\\) each and there is a £2 booking fee. Which gives the total \\(T\\) for \\(n\\) tickets?', ['\\(T = cn + 2\\)', '\\(T = c + 2n\\)', '\\(T = 2cn\\)', '\\(T = n(c + 2)\\)'], '\\(n\\) tickets at \\(c\\) each, plus 2 once.', 'writing'],
    ['writing', 'Write “the product of \\(a\\) and \\(b\\), minus 6”.', ['\\(ab - 6\\)', '\\(a + b - 6\\)', '\\(6 - ab\\)', '\\(a(b - 6)\\)'], 'Product means multiply.', 'writing'],
    ['writing', 'A rectangle is \\(x\\) cm long and 3 cm shorter in width. What is its perimeter?', ['\\(4x - 6\\)', '\\(2x - 3\\)', '\\(4x - 3\\)', '\\(x(x - 3)\\)'], '\\(2x + 2(x - 3)\\).', 'writing'],
  ],
  LONG: [
    { q: 'Use \\(s = \\frac{(u + v)t}{2}\\) to find \\(s\\) when \\(u = 3.5\\), \\(v = 12.5\\) and \\(t = 6\\).', m: 2, s: ['M1 for correct substitution, e.g. \\(\\frac{(3.5 + 12.5) \\times 6}{2}\\).', 'A1 for 48.'], link: ['substitution', 'See substitution again'] },
    { q: 'A plumber charges a £35 call-out fee and £28 per hour. Write a formula for the total charge \\(C\\) pounds for a job lasting \\(h\\) hours.', m: 2, s: ['M1 for \\(28h + 35\\) seen.', 'A1 for \\(C = 28h + 35\\).'], link: ['writing', 'See writing formulae again'] },
    { q: '\\(k = 3m^2 - 4n\\). Work out the value of \\(k\\) when \\(m = -3\\) and \\(n = -2.5\\).', m: 2, s: ['M1 for \\(3 \\times 9\\) or \\(-4 \\times -2.5\\) seen.', 'A1 for 37.'], link: ['substitution', 'See negative numbers again'] },
  ],
});
