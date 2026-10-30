FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['placevalue', 'What is the value of the 8 in 2.483?', ['8 hundredths', '8 tenths', '8 thousandths', '8 units'], 'Second column after the point.', 'placevalue'],
    ['placevalue', 'Which list is in order, smallest first?', ['0.07, 0.7, 0.707, 0.71', '0.7, 0.07, 0.707, 0.71', '0.07, 0.7, 0.71, 0.707', '0.71, 0.707, 0.7, 0.07'], 'Compare as thousandths: 070, 700, 707, 710.', 'placevalue'],
    ['placevalue', 'Work out \\(0.065 \\times 1000\\)', ['65', '6.5', '650', '0.65'], 'Digits move 3 places left.', 'placevalue'],
    ['placevalue', 'Work out \\(43 \\div 100\\)', ['0.43', '4.3', '0.043', '4300'], 'Digits move 2 places right.', 'placevalue'],
    ['calc', 'Work out \\(8 - 2.65\\)', ['5.35', '6.45', '5.45', '6.35'], '\\(8.00 - 2.65 = 5.35\\).', 'calc'],
    ['calc', 'Work out \\(0.4 \\times 0.3\\)', ['0.12', '1.2', '0.012', '0.7'], '\\(4 \\times 3 = 12\\), 2 decimal places.', 'calc'],
    ['calc', 'Work out \\(1.5 \\times 0.06\\)', ['0.09', '0.9', '0.009', '9'], '\\(15 \\times 6 = 90\\); 3 decimal places: 0.090.', 'calc'],
    ['calc', 'Work out \\(4.2 \\div 0.7\\)', ['6', '0.6', '60', '2.94'], '\\(42 \\div 7 = 6\\).', 'calc'],
  ],
  LONG: [
    { q: 'Given that \\(36 \\times 125 = 4500\\), work out (a) \\(3.6 \\times 12.5\\) (b) \\(0.36 \\times 0.125\\) (c) \\(4500 \\div 1.25\\)', m: 3, s: ['B1 for (a) 45.', 'B1 for (b) 0.045.', 'B1 for (c) 3600.'], link: ['calc', 'See counting decimal places again'] },
    { q: 'Pens cost £0.85 each. Lena buys 6 pens and pays with a £10 note. How much change should she get?', m: 3, s: ['M1 for \\(6 \\times 0.85\\) (= 5.10).', 'M1 for \\(10 - 5.10\\).', 'A1 for £4.90.'], link: ['calc', 'See calculating with decimals again'] },
    { q: 'Write these numbers in order of size, smallest first: 3.08, 3.8, 3.008, 3.088, 3.80', m: 2, s: ['M1 for comparing digit by digit or writing all with 3 decimal places.', 'A1 for 3.008, 3.08, 3.088, 3.8 = 3.80 (3.8 and 3.80 may be in either order).'], link: ['placevalue', 'See ordering decimals again'] },
  ],
});
