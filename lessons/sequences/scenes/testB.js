FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['arith-h', 'An arithmetic sequence has \\(a = 7\\) and \\(d = 4\\). What is the 20th term?', ['83', '87', '80', '147'], '\\(7 + 19 \\times 4\\).', 'arith-h'],
    ['arith-h', 'What is the common difference of 12, 9.5, 7, …?', ['−2.5', '2.5', '−3', '0.8'], '\\(9.5 - 12\\).', 'arith-h'],
    ['arith-h', 'The 2nd term is 10 and the 5th term is 22. What is \\(a\\)?', ['6', '4', '10', '2'], '\\(3d = 12\\), \\(d = 4\\), \\(a = 10 - 4\\).', 'arith-h'],
    ['arith-h', 'Which term of 5, 9, 13, … is 81?', ['20th', '19th', '21st', '76th'], '\\(5 + (n - 1)4 = 81\\).', 'arith-h'],
    ['series', 'Find the sum of the first 10 terms of 2, 5, 8, …', ['155', '145', '29', '310'], '\\(5(4 + 27)\\).', 'series'],
    ['series', 'Find \\(1 + 2 + 3 + \\dots + 40\\).', ['820', '800', '1600', '840'], '\\(20 \\times 41\\).', 'series'],
    ['series', 'An arithmetic series has \\(n = 12\\), \\(a = 3\\) and last term 47. What is \\(S_{12}\\)?', ['300', '600', '282', '50'], '\\(6 \\times 50\\).', 'series'],
    ['series', '\\(S_n\\) for an arithmetic series means…', ['the sum of the first \\(n\\) terms', 'the nth term', 'the common difference', 'the last term'], 'S for sum.', 'series'],
  ],
  LONG: [
    { q: 'The 5th term of an arithmetic sequence is 19 and the 12th term is 47. Find the first term and the common difference.', m: 3, s: ['M1 for \\(a + 4d = 19\\) and \\(a + 11d = 47\\).', 'M1 for \\(7d = 28\\).', 'A1 for \\(d = 4\\), \\(a = 3\\).'], link: ['arith-h', 'See finding a and d again'] },
    { q: 'Find the sum of all the odd numbers from 1 to 199.', m: 3, s: ['M1 for \\(n = 100\\).', 'M1 for \\(\\frac{100}{2}(1 + 199)\\).', 'A1 for 10 000.'], link: ['series', 'See arithmetic series again'] },
    { q: 'An arithmetic series has first term 4 and common difference 3. The sum of the first \\(n\\) terms is 650. Show that \\(3n^2 + 5n - 1300 = 0\\) and find \\(n\\).', m: 4, s: ['M1 for \\(\\frac{n}{2}(8 + 3(n - 1)) = 650\\).', 'A1 for rearranging to \\(3n^2 + 5n - 1300 = 0\\).', 'M1 for solving, e.g. \\((3n + 65)(n - 20) = 0\\).', 'A1 for \\(n = 20\\).'], link: ['series', 'See using the formula again'] },
  ],
});
