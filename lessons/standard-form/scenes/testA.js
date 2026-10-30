FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['writing', 'Write 4 300 000 in standard form.', ['\\(4.3 \\times 10^6\\)', '\\(43 \\times 10^5\\)', '\\(4.3 \\times 10^5\\)', '\\(4.3 \\times 10^{-6}\\)'], '6 places left.', 'writing'],
    ['writing', 'Write 0.000 81 in standard form.', ['\\(8.1 \\times 10^{-4}\\)', '\\(8.1 \\times 10^{-5}\\)', '\\(81 \\times 10^{-5}\\)', '\\(8.1 \\times 10^{4}\\)'], '4 places right.', 'writing'],
    ['writing', 'Which is in standard form?', ['\\(9.99 \\times 10^{2}\\)', '\\(10 \\times 10^{2}\\)', '\\(0.9 \\times 10^{3}\\)', '\\(99.9 \\times 10^{1}\\)'], '1 ≤ A < 10.', 'writing'],
    ['writing', 'Write 70 in standard form.', ['\\(7 \\times 10^1\\)', '\\(7 \\times 10^0\\)', '\\(70 \\times 10^0\\)', '\\(7 \\times 10^{-1}\\)'], 'One place.', 'writing'],
    ['adjust', 'Write \\(5.08 \\times 10^3\\) as an ordinary number.', ['5080', '508', '50 800', '5.080'], '3 places right.', 'adjust'],
    ['adjust', 'Write \\(2.6 \\times 10^{-3}\\) as an ordinary number.', ['0.0026', '0.026', '0.00026', '2600'], '3 places left.', 'adjust'],
    ['adjust', 'Write \\(45 \\times 10^{-6}\\) in standard form.', ['\\(4.5 \\times 10^{-5}\\)', '\\(4.5 \\times 10^{-7}\\)', '\\(45 \\times 10^{-6}\\)', '\\(4.5 \\times 10^{5}\\)'], '\\(45 = 4.5 \\times 10\\).', 'adjust'],
    ['adjust', 'Which is the largest?', ['\\(1.2 \\times 10^{5}\\)', '\\(9.9 \\times 10^{4}\\)', '\\(8 \\times 10^{4}\\)', '\\(1.9 \\times 10^{-5}\\)'], 'Biggest power: \\(10^5\\).', 'adjust'],
  ],
  LONG: [
    { q: 'The diameter of an atom is 0.000 000 000 32 m. Write this number in standard form.', m: 1, s: ['B1 for \\(3.2 \\times 10^{-10}\\).'], link: ['writing', 'See small numbers again'] },
    { q: 'Write these numbers in order of size, smallest first: \\(3.4 \\times 10^{5}\\), \\(43 \\times 10^{3}\\), \\(0.34 \\times 10^{7}\\), \\(4.3 \\times 10^{4}\\).', m: 2, s: ['M1 for converting all to standard form or ordinary numbers: 340 000, 43 000, 3 400 000, 43 000.', 'A1 for \\(43 \\times 10^3 = 4.3 \\times 10^4\\), \\(3.4 \\times 10^5\\), \\(0.34 \\times 10^7\\).'], link: ['adjust', 'See ordering again'] },
    { q: 'Kai says \\(0.5 \\times 10^{3}\\) is in standard form. Explain why he is wrong and write the number correctly in standard form.', m: 2, s: ['B1 for 0.5 is less than 1 (A must satisfy \\(1 \\le A < 10\\)).', 'B1 for \\(5 \\times 10^2\\).'], link: ['adjust', 'See fixing A again'] },
  ],
});
