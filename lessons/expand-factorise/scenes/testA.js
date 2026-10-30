FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['single', 'Expand \\(6(x - 4)\\).', ['\\(6x - 24\\)', '\\(6x - 4\\)', '\\(6x + 24\\)', '\\(x - 24\\)'], 'Multiply both terms by 6.', 'single'],
    ['single', 'Expand \\(-3(2y + 5)\\).', ['\\(-6y - 15\\)', '\\(-6y + 15\\)', '\\(6y - 15\\)', '\\(-6y + 5\\)'], '\\(-3 \\times 5 = -15\\).', 'single'],
    ['single', 'Expand \\(p(p - 9)\\).', ['\\(p^2 - 9p\\)', '\\(2p - 9\\)', '\\(p^2 - 9\\)', '\\(p - 9p\\)'], '\\(p \\times p = p^2\\).', 'single'],
    ['single', 'Expand and simplify \\(5(x + 2) - 2(x + 3)\\).', ['\\(3x + 4\\)', '\\(3x + 16\\)', '\\(3x - 1\\)', '\\(7x + 16\\)'], '\\(5x + 10 - 2x - 6\\).', 'single'],
    ['double', 'Expand and simplify \\((x + 5)(x + 3)\\).', ['\\(x^2 + 8x + 15\\)', '\\(x^2 + 15x + 8\\)', '\\(x^2 + 15\\)', '\\(2x + 8\\)'], '5 + 3 = 8, 5 × 3 = 15.', 'double'],
    ['double', 'Expand and simplify \\((x - 2)(x + 9)\\).', ['\\(x^2 + 7x - 18\\)', '\\(x^2 - 7x - 18\\)', '\\(x^2 + 7x + 18\\)', '\\(x^2 - 18\\)'], '−2 + 9 = 7, −2 × 9 = −18.', 'double'],
    ['double', 'Expand \\((x + 4)^2\\).', ['\\(x^2 + 8x + 16\\)', '\\(x^2 + 16\\)', '\\(x^2 + 4x + 16\\)', '\\(2x + 8\\)'], '\\((x + 4)(x + 4)\\).', 'double'],
    ['double', 'Expand and simplify \\((2x - 1)(x + 3)\\).', ['\\(2x^2 + 5x - 3\\)', '\\(2x^2 + 6x - 3\\)', '\\(2x^2 - 5x - 3\\)', '\\(3x^2 + 5x - 3\\)'], '\\(2x^2 + 6x - x - 3\\).', 'double'],
  ],
  LONG: [
    { q: 'A rectangle is \\((x + 6)\\) cm long and \\((x - 2)\\) cm wide. Show that its area, in cm², is \\(x^2 + 4x - 12\\).', m: 2, s: ['M1 for at least three of the four terms \\(x^2, -2x, 6x, -12\\) correct.', 'A1 for a complete method ending in \\(x^2 + 4x - 12\\).'], link: ['double', 'See double brackets again'] },
    { q: 'Expand and simplify \\(3(2x - 1) - 4(x - 5)\\).', m: 2, s: ['M1 for \\(6x - 3\\) or \\(-4x + 20\\) correct.', 'A1 for \\(2x + 17\\).'], link: ['single', 'See single brackets again'] },
    { q: 'Expand and simplify \\((x - 7)^2\\).', m: 2, s: ['M1 for \\((x - 7)(x - 7)\\) with at least three terms correct.', 'A1 for \\(x^2 - 14x + 49\\).'], link: ['double', 'See squaring a bracket again'] },
  ],
});
