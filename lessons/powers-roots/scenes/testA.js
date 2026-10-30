FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['squares', 'Work out \\(15^2\\)', ['225', '30', '150', '125'], '\\(15 \\times 15 = 225\\).', 'squares'],
    ['squares', 'Work out \\(\\sqrt{144}\\)', ['12', '72', '14', '12.5'], '\\(12^2 = 144\\).', 'squares'],
    ['squares', 'Work out \\(\\sqrt[3]{1000}\\)', ['10', '100', '333.3', '31.6'], '\\(10^3 = 1000\\).', 'squares'],
    ['squares', 'Which whole number is closest to \\(\\sqrt{80}\\)?', ['9', '8', '40', '10'], '\\(81\\) is very close to 80, and \\(9^2 = 81\\).', 'squares'],
    ['notation', 'Work out \\(3^5\\)', ['243', '15', '81', '125'], '\\(3, 9, 27, 81, 243\\).', 'notation'],
    ['notation', 'Work out \\((-2)^5\\)', ['\\(-32\\)', '32', '\\(-10\\)', '10'], 'Odd index: negative.', 'notation'],
    ['notation', 'Write \\(2 \\times 2 \\times 2 \\times 3 \\times 3\\) in index form.', ['\\(2^3 \\times 3^2\\)', '\\(2^2 \\times 3^3\\)', '\\(6^5\\)', '\\(5^6\\)'], 'Three 2s and two 3s.', 'notation'],
    ['notation', 'Which is the largest?', ['\\(3^4\\)', '\\(4^3\\)', '\\(2^6\\)', '\\(8^2\\)'], '81, 64, 64, 64.', 'notation'],
  ],
  LONG: [
    { q: 'Work out \\(\\sqrt{3^2 + 4^2} + 2^3\\)', m: 2, s: ['M1 for \\(\\sqrt{25}\\) or 5 seen.', 'A1 for 13.'], link: ['squares', 'See roots again'] },
    { q: '(a) Write down the square number between 40 and 60. (b) Write down the cube number between 100 and 150.', m: 2, s: ['B1 for 49.', 'B1 for 125.'], link: ['squares', 'See squares and cubes again'] },
    { q: 'Without a calculator, show that \\(\\sqrt{60}\\) is between 7 and 8. Then say which it is closer to, giving a reason.', m: 3, s: ['M1 for \\(7^2 = 49\\) and \\(8^2 = 64\\).', 'A1 for \\(49 < 60 < 64\\), so \\(7 < \\sqrt{60} < 8\\).', 'B1 for closer to 8, because 60 is closer to 64 than to 49.'], link: ['squares', 'See estimating roots again'] },
  ],
});
