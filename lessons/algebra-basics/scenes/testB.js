// Questions on the Higher-only section (neg-frac) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['index-laws', 'Simplify \\(x^5 \\times x^4\\).', ['\\(x^9\\)', '\\(x^{20}\\)', '\\(2x^9\\)', '\\(x^1\\)'], 'Add the powers.', 'index-laws'],
    ['index-laws', 'Simplify \\(y^{12} \\div y^3\\).', ['\\(y^9\\)', '\\(y^4\\)', '\\(y^{15}\\)', '\\(y^{36}\\)'], 'Subtract the powers.', 'index-laws'],
    ['index-laws', 'Simplify \\((a^3)^5\\).', ['\\(a^{15}\\)', '\\(a^8\\)', '\\(a^{35}\\)', '\\(5a^3\\)'], 'Multiply the powers.', 'index-laws'],
    ['index-laws', 'Simplify \\((2x^2)^3\\).', ['\\(8x^6\\)', '\\(2x^6\\)', '\\(6x^6\\)', '\\(8x^5\\)'], '\\(2^3 = 8\\), \\((x^2)^3 = x^6\\).', 'index-laws'],
    ['index-laws', 'Which is equal to \\(x^{-2}\\)?', ['\\(\\frac{1}{x^2}\\)', '\\(-x^2\\)', '\\(-2x\\)', '\\(\\frac{x}{2}\\)'], 'A negative power is a reciprocal.', 'index-laws'],
    ['index-laws', 'What is \\(w^0\\)?', ['1', '0', '\\(w\\)', 'It cannot be worked out'], 'Any non-zero number to the power 0 is 1.', 'index-laws'],
    ['index-laws', 'Simplify \\(\\frac{15m^8}{5m^2}\\).', ['\\(3m^6\\)', '\\(10m^6\\)', '\\(3m^4\\)', '\\(3m^{10}\\)'], '\\(15 \\div 5 = 3\\), \\(8 - 2 = 6\\).', 'index-laws'],
    ['neg-frac', 'Work out \\(3^{-2}\\).', ['\\(\\frac19\\)', '\\(-9\\)', '\\(-6\\)', '\\(\\frac16\\)'], '\\(\\frac{1}{3^2}\\).', 'neg-frac'],
    ['neg-frac', 'Work out \\(16^{\\frac34}\\).', ['8', '12', '64', '4'], '\\(\\sqrt[4]{16} = 2\\), \\(2^3 = 8\\).', 'neg-frac'],
    ['neg-frac', 'Simplify \\((64x^9)^{\\frac13}\\).', ['\\(4x^3\\)', '\\(4x^6\\)', '\\(21x^3\\)', '\\(8x^3\\)'], '\\(\\sqrt[3]{64} = 4\\), \\(9 \\times \\frac13 = 3\\).', 'neg-frac'],
    ['proof', 'Which expression is always even when \\(n\\) is an integer?', ['\\(2n + 4\\)', '\\(2n + 1\\)', '\\(n + 4\\)', '\\(3n\\)'], '\\(2n + 4 = 2(n + 2)\\).', 'proof'],
  ],
  LONG: [
    { q: 'Simplify fully \\(\\dfrac{6a^5b^2 \\times 2ab^3}{4a^2b}\\).', m: 3, s: ['M1 for the numerator \\(12a^6b^5\\).', 'M1 for dividing correctly, at least two of 3, \\(a^4\\), \\(b^4\\).', 'A1 for \\(3a^4b^4\\).'], link: ['index-laws', 'See index laws again'] },
    { q: '\\(2^n \\times 2^5 = 2^{11}\\). Find the value of \\(n\\).', m: 1, s: ['B1 for \\(n = 6\\).'], link: ['index-laws', 'See multiplying powers again'] },
    { q: 'Simplify fully \\(\\left(\\dfrac{25x^4}{y^6}\\right)^{-\\frac12}\\).', m: 2, h: true, s: ['M1 for a correct first step, e.g. \\(\\left(\\frac{y^6}{25x^4}\\right)^{\\frac12}\\) or \\(\\frac{5x^2}{y^3}\\) seen.', 'A1 for \\(\\dfrac{y^3}{5x^2}\\).'], link: ['neg-frac', 'See negative and fractional indices again'] },
    { q: 'Prove that the sum of any three consecutive integers is a multiple of 3.', m: 3, h: true, s: ['M1 for \\(n + (n + 1) + (n + 2)\\) or equivalent.', 'M1 for \\(3n + 3\\).', 'A1 for \\(3(n + 1)\\) with a conclusion, e.g. “so it is always a multiple of 3”.'], link: ['proof', 'See algebraic proof again'] },
  ],
});
