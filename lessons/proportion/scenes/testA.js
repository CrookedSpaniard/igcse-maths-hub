FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['direct', '\\(y \\propto x\\) and \\(y = 18\\) when \\(x = 3\\). Find \\(y\\) when \\(x = 7\\).', ['42', '21', '126', '22'], '\\(k = 6\\).', 'direct'],
    ['direct', '\\(y = kx\\) and \\(y = 10\\) when \\(x = 4\\). What is \\(k\\)?', ['2.5', '40', '0.4', '6'], '\\(10 \\div 4\\).', 'direct'],
    ['direct', 'Which of these shows \\(y\\) directly proportional to \\(x\\)?', ['\\(y = 7x\\)', '\\(y = x + 7\\)', '\\(y = \\frac{7}{x}\\)', '\\(y = 7\\)'], 'Only \\(y = kx\\) is direct proportion.', 'direct'],
    ['direct', '\\(C \\propto n\\). 5 tickets cost £42. How much do 8 tickets cost?', ['£67.20', '£45', '£52.50', '£64'], '\\(k = 8.4\\).', 'direct'],
    ['direct-powers', '\\(y \\propto x^2\\) and \\(y = 12\\) when \\(x = 2\\). Find \\(y\\) when \\(x = 5\\).', ['75', '30', '60', '150'], '\\(k = 3\\), \\(3 \\times 25\\).', 'direct-powers'],
    ['direct-powers', '\\(y \\propto \\sqrt{x}\\) and \\(y = 6\\) when \\(x = 9\\). Find \\(y\\) when \\(x = 25\\).', ['10', '16.7', '30', '50'], '\\(k = 2\\), \\(2 \\times 5\\).', 'direct-powers'],
    ['direct-powers', '\\(y \\propto x^3\\). When \\(x\\) is halved, \\(y\\) is…', ['divided by 8', 'halved', 'divided by 6', 'divided by 3'], '\\((\\frac12)^3 = \\frac18\\).', 'direct-powers'],
    ['direct-powers', '\\(y \\propto x^2\\). Which pair could be values of \\((x, y)\\) if \\((2, 8)\\) is one pair?', ['\\((4, 32)\\)', '\\((4, 16)\\)', '\\((4, 64)\\)', '\\((4, 12)\\)'], '\\(k = 2\\), \\(2 \\times 16 = 32\\).', 'direct-powers'],
  ],
  LONG: [
    { q: '\\(d\\) is directly proportional to the square of \\(t\\). When \\(t = 4\\), \\(d = 40\\). (a) Find a formula for \\(d\\) in terms of \\(t\\). (b) Find \\(t\\) when \\(d = 62.5\\), given \\(t > 0\\).', m: 4, s: ['M1 for \\(d = kt^2\\).', 'A1 for \\(d = 2.5t^2\\).', 'M1 for \\(62.5 = 2.5t^2\\), so \\(t^2 = 25\\).', 'A1 for \\(t = 5\\).'], link: ['direct-powers', 'See proportion to powers again'] },
    { q: '\\(P\\) is directly proportional to \\(\\sqrt{Q}\\). When \\(Q = 36\\), \\(P = 24\\). Find \\(P\\) when \\(Q = 81\\).', m: 3, s: ['M1 for \\(P = k\\sqrt{Q}\\).', 'M1 for \\(k = 4\\).', 'A1 for 36.'], link: ['direct-powers', 'See square roots again'] },
    { q: 'The cost \\(£C\\) of a carpet is directly proportional to its area. A 12 m² carpet costs £270. How much does a 20 m² carpet cost?', m: 2, s: ['M1 for \\(k = 270 \\div 12 = 22.5\\) or equivalent unitary method.', 'A1 for £450.'], link: ['direct', 'See direct proportion again'] },
  ],
});
