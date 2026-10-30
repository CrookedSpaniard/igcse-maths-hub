// Questions on the Higher-only section (harder) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['common', 'Factorise \\(10x - 15\\).', ['\\(5(2x - 3)\\)', '\\(5(2x - 15)\\)', '\\(10(x - 5)\\)', '\\(5x(2 - 3)\\)'], 'The HCF of 10 and 15 is 5.', 'common'],
    ['common', 'Factorise fully \\(8a^2 + 12a\\).', ['\\(4a(2a + 3)\\)', '\\(4(2a^2 + 3a)\\)', '\\(a(8a + 12)\\)', '\\(2a(4a + 6)\\)'], 'The HCF is \\(4a\\).', 'common'],
    ['common', 'Factorise fully \\(6xy - 9y\\).', ['\\(3y(2x - 3)\\)', '\\(3(2xy - 3y)\\)', '\\(y(6x - 9)\\)', '\\(3x(2y - 3)\\)'], 'The HCF is \\(3y\\).', 'common'],
    ['quad-fact', 'Factorise \\(x^2 + 8x + 12\\).', ['\\((x + 2)(x + 6)\\)', '\\((x + 3)(x + 4)\\)', '\\((x + 1)(x + 12)\\)', '\\((x - 2)(x - 6)\\)'], '2 × 6 = 12, 2 + 6 = 8.', 'quad-fact'],
    ['quad-fact', 'Factorise \\(x^2 - 3x - 10\\).', ['\\((x - 5)(x + 2)\\)', '\\((x + 5)(x - 2)\\)', '\\((x - 5)(x - 2)\\)', '\\((x - 10)(x + 1)\\)'], '−5 × 2 = −10, −5 + 2 = −3.', 'quad-fact'],
    ['quad-fact', 'Factorise \\(x^2 - 81\\).', ['\\((x + 9)(x - 9)\\)', '\\((x - 9)^2\\)', '\\((x + 9)^2\\)', '\\((x - 81)(x + 1)\\)'], 'Difference of two squares.', 'quad-fact'],
    ['quad-fact', 'Factorise \\(x^2 - 10x + 21\\).', ['\\((x - 3)(x - 7)\\)', '\\((x + 3)(x + 7)\\)', '\\((x - 3)(x + 7)\\)', '\\((x - 1)(x - 21)\\)'], '(−3)(−7) = 21, −3 − 7 = −10.', 'quad-fact'],
    ['harder', 'Factorise \\(2x^2 + 5x + 2\\).', ['\\((2x + 1)(x + 2)\\)', '\\((2x + 2)(x + 1)\\)', '\\((x + 1)(x + 2)\\)', '\\((2x - 1)(x - 2)\\)'], '\\(ac = 4\\): 4 and 1.', 'harder'],
    ['harder', 'Expand \\((x + 1)^3\\).', ['\\(x^3 + 3x^2 + 3x + 1\\)', '\\(x^3 + 1\\)', '\\(x^3 + 3x + 1\\)', '\\(x^3 + x^2 + x + 1\\)'], '\\((x^2 + 2x + 1)(x + 1)\\).', 'harder'],
  ],
  LONG: [
    { q: 'Factorise fully \\(15a^2b - 10ab^2\\).', m: 2, s: ['M1 for a correct partial factorisation, e.g. \\(5(3a^2b - 2ab^2)\\) or \\(ab(15a - 10b)\\).', 'A1 for \\(5ab(3a - 2b)\\).'], link: ['common', 'See common factors again'] },
    { q: 'Factorise \\(x^2 + 2x - 24\\).', m: 2, s: ['M1 for \\((x \\pm 6)(x \\pm 4)\\).', 'A1 for \\((x + 6)(x - 4)\\).'], link: ['quad-fact', 'See factorising quadratics again'] },
    { q: 'Factorise \\(6x^2 + x - 2\\).', m: 2, h: true, s: ['M1 for splitting the middle term, e.g. \\(6x^2 + 4x - 3x - 2\\), or brackets that give two of the three terms.', 'A1 for \\((3x + 2)(2x - 1)\\).'], link: ['harder', 'See factorising ax² + bx + c again'] },
  ],
});
