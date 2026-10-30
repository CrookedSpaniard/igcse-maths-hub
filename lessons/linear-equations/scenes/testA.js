FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['balance', 'Solve \\(x + 9 = 4\\).', ['\\(x = -5\\)', '\\(x = 13\\)', '\\(x = 5\\)', '\\(x = -13\\)'], 'Subtract 9.', 'balance'],
    ['balance', 'Solve \\(6x = 21\\).', ['\\(x = 3.5\\)', '\\(x = 15\\)', '\\(x = 126\\)', '\\(x = 27\\)'], 'Divide by 6.', 'balance'],
    ['balance', 'Solve \\(5x + 3 = 38\\).', ['\\(x = 7\\)', '\\(x = 8.2\\)', '\\(x = 6\\)', '\\(x = 35\\)'], '\\(5x = 35\\).', 'balance'],
    ['balance', 'Solve \\(\\frac{x}{4} - 1 = 5\\).', ['\\(x = 24\\)', '\\(x = 16\\)', '\\(x = 1.5\\)', '\\(x = 21\\)'], '\\(\\frac{x}{4} = 6\\).', 'balance'],
    ['both-sides', 'Solve \\(8x - 5 = 3x + 20\\).', ['\\(x = 5\\)', '\\(x = 3\\)', '\\(x = 25\\)', '\\(x = 1.36\\)'], '\\(5x = 25\\).', 'both-sides'],
    ['both-sides', 'Solve \\(2(x + 7) = 20\\).', ['\\(x = 3\\)', '\\(x = 6.5\\)', '\\(x = 13\\)', '\\(x = 17\\)'], '\\(2x + 14 = 20\\).', 'both-sides'],
    ['both-sides', 'Solve \\(x + 12 = 5x\\).', ['\\(x = 3\\)', '\\(x = 2.4\\)', '\\(x = -3\\)', '\\(x = 12\\)'], '\\(12 = 4x\\).', 'both-sides'],
    ['both-sides', 'Solve \\(3(2x - 1) = 4(x + 2)\\).', ['\\(x = 5.5\\)', '\\(x = 2.5\\)', '\\(x = 5\\)', '\\(x = 11\\)'], '\\(6x - 3 = 4x + 8\\), \\(2x = 11\\).', 'both-sides'],
  ],
  LONG: [
    { q: 'Solve \\(7x + 4 = 3x - 10\\). Show clear algebraic working.', m: 3, s: ['M1 for collecting \\(x\\) terms, e.g. \\(4x + 4 = -10\\).', 'M1 for \\(4x = -14\\).', 'A1 for \\(x = -3.5\\).'], link: ['both-sides', 'See unknowns on both sides again'] },
    { q: 'Solve \\(5(x - 3) = 2(x + 6)\\).', m: 3, s: ['M1 for expanding at least one bracket correctly.', 'M1 for \\(3x = 27\\) or equivalent.', 'A1 for \\(x = 9\\).'], link: ['both-sides', 'See brackets again'] },
    { q: 'Tom solves \\(4x - 3 = 17\\) and writes \\(4x = 14\\), \\(x = 3.5\\). Explain his mistake and give the correct answer.', m: 2, s: ['B1 for saying he subtracted 3 instead of adding 3 (should be \\(4x = 20\\)).', 'B1 for \\(x = 5\\).'], link: ['balance', 'See the balance method again'] },
  ],
});
