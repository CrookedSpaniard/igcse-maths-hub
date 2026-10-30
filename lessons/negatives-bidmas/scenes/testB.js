FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['bidmas', 'Work out \\(4 + 6 \\times 2\\)', ['16', '20', '12', '48'], 'Multiply first: \\(4 + 12 = 16\\).', 'bidmas'],
    ['bidmas', 'Work out \\(30 - 10 \\div 5\\)', ['28', '4', '20', '6'], 'Divide first: \\(30 - 2 = 28\\).', 'bidmas'],
    ['bidmas', 'Work out \\(2 \\times 3^2\\)', ['18', '36', '12', '81'], 'Index first: \\(2 \\times 9 = 18\\).', 'bidmas'],
    ['bidmas', 'Work out \\(16 \\div 4 \\times 2\\)', ['8', '2', '32', '6'], 'Same level, left to right: \\(4 \\times 2 = 8\\).', 'bidmas'],
    ['bidmas', 'What does the I in BIDMAS stand for?', ['Indices (powers and roots)', 'Integers', 'Inverse', 'Inside'], 'Powers and roots come after brackets.', 'bidmas'],
    ['brackets', 'Work out \\(-4^2\\)', ['\\(-16\\)', '16', '\\(-8\\)', '8'], 'Only the 4 is squared.', 'brackets'],
    ['brackets', 'Work out \\(\\dfrac{15 + 9}{2 \\times 4}\\)', ['3', '8.5', '12', '6'], '\\(24 \\div 8 = 3\\).', 'brackets'],
    ['brackets', 'Which is equal to 20?', ['\\((1 + 4) \\times (6 - 2)\\)', '\\(1 + 4 \\times 6 - 2\\)', '\\((1 + 4) \\times 6 - 2\\)', '\\(1 + 4 \\times (6 - 2)\\)'], '\\(5 \\times 4 = 20\\). The others give 23, 28 and 17.', 'brackets'],
  ],
  LONG: [
    { q: 'Work out \\(\\dfrac{5^2 - 3^2}{2 \\times (7 - 5)}\\)', m: 2, s: ['M1 for numerator 16 or denominator 4.', 'A1 for 4.'], link: ['brackets', 'See fraction lines again'] },
    { q: 'Leo says \\(20 - 8 + 2 = 10\\). Is he correct? Explain your answer.', m: 2, s: ['B1 No (the answer is 14).', 'B1 for explaining that addition and subtraction are worked from left to right: \\(20 - 8 = 12\\), then \\(12 + 2 = 14\\). Leo added first.'], link: ['bidmas', 'See left to right again'] },
    { q: 'Use each of the numbers 2, 3 and 5 once, with any of the signs +, −, ×, and brackets, to make (a) 25 (b) \\(-13\\).', m: 2, s: ['B1 for a correct calculation for 25, e.g. \\((2 + 3) \\times 5\\).', 'B1 for a correct calculation for \\(-13\\), e.g. \\(2 - 3 \\times 5\\).'], link: ['brackets', 'See placing brackets again'] },
  ],
});
