FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['notation', 'Which of these is an expression?', ['\\(4x - 3y\\)', '\\(4x - 3 = 9\\)', '\\(P = 4x\\)', '\\(4(x - 3) \\equiv 4x - 12\\)'], 'An expression has no = or ≡ sign.', 'notation'],
    ['notation', 'Which of these is an identity?', ['\\(3(a + 2) \\equiv 3a + 6\\)', '\\(3a + 2 = 8\\)', '\\(A = 3a\\)', '\\(3a + 6\\)'], 'Both sides are equal for every value of \\(a\\).', 'notation'],
    ['notation', 'How many terms are in \\(2p^2 - p + 8q - 5\\)?', ['4', '3', '5', '2'], '\\(2p^2\\), \\(-p\\), \\(8q\\) and \\(-5\\).', 'notation'],
    ['notation', '\\(F = ma\\) is…', ['a formula', 'an expression', 'an identity', 'a term'], 'It links force, mass and acceleration.', 'notation'],
    ['like-terms', 'Simplify \\(7a - 2b - 3a + 5b\\).', ['\\(4a + 3b\\)', '\\(10a + 3b\\)', '\\(4a - 7b\\)', '\\(7ab\\)'], '\\(7a - 3a = 4a\\), \\(-2b + 5b = 3b\\).', 'like-terms'],
    ['like-terms', 'Simplify \\(5x \\times 2y\\).', ['\\(10xy\\)', '\\(7xy\\)', '\\(10x + y\\)', '\\(52xy\\)'], 'Multiply the numbers and write the letters together.', 'like-terms'],
    ['like-terms', 'Simplify \\(3x^2 + 4x - x^2 + x\\).', ['\\(2x^2 + 5x\\)', '\\(7x^3\\)', '\\(3x^2 + 5x\\)', '\\(2x^2 + 4x\\)'], '\\(3x^2 - x^2 = 2x^2\\) and \\(4x + x = 5x\\).', 'like-terms'],
    ['like-terms', 'Simplify \\(\\frac{18pq}{6q}\\).', ['\\(3p\\)', '\\(12p\\)', '\\(3pq\\)', '\\(3q\\)'], '\\(18 \\div 6 = 3\\) and the \\(q\\)s cancel.', 'like-terms'],
  ],
  LONG: [
    { q: 'The perimeter of a triangle has sides \\(3x + 2\\), \\(2x - 1\\) and \\(x + 4\\). Write an expression for the perimeter. Give your answer in its simplest form.', m: 2, s: ['M1 for adding all three sides, e.g. \\(3x + 2 + 2x - 1 + x + 4\\).', 'A1 for \\(6x + 5\\).'], link: ['like-terms', 'See collecting like terms again'] },
    { q: 'Mia says \\(5(n + 1) = 5n + 5\\) is an equation. Is she right? Explain your answer.', m: 2, s: ['B1 No, it is an identity.', 'B1 for a reason, e.g. it is true for every value of \\(n\\) (should be written with \\(\\equiv\\)).'], link: ['notation', 'See identities again'] },
    { q: 'Simplify fully \\(4a \\times 3ab - 2a^2b\\).', m: 2, s: ['M1 for \\(12a^2b\\).', 'A1 for \\(10a^2b\\).'], link: ['like-terms', 'See multiplying terms again'] },
  ],
});
