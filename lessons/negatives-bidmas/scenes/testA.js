FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['integers', 'Which list is in order, smallest first?', ['\\(-8, -5, -1, 2\\)', '\\(-1, -5, -8, 2\\)', '\\(2, -1, -5, -8\\)', '\\(-5, -8, -1, 2\\)'], 'Left to right on the number line.', 'integers'],
    ['integers', 'What is the value of the 6 in 4 263 815?', ['60 000', '6000', '600 000', '6'], 'The 6 is in the ten thousands column.', 'integers'],
    ['integers', 'The temperature is \\(-3\\) °C. It falls by 8 degrees. What is the new temperature?', ['\\(-11\\) °C', '5 °C', '\\(-5\\) °C', '11 °C'], '\\(-3 - 8 = -11\\).', 'addsub'],
    ['addsub', 'Work out \\(-4 - (-9)\\)', ['5', '\\(-13\\)', '\\(-5\\)', '13'], '\\(-4 + 9 = 5\\).', 'addsub'],
    ['addsub', 'Work out \\(7 + (-12)\\)', ['\\(-5\\)', '19', '5', '\\(-19\\)'], '\\(7 - 12 = -5\\).', 'addsub'],
    ['addsub', 'Which is the same as \\(-6 - (-2)\\)?', ['\\(-6 + 2\\)', '\\(-6 - 2\\)', '\\(6 + 2\\)', '\\(6 - 2\\)'], 'Two minus signs together make a plus.', 'addsub'],
    ['muldiv', 'Work out \\(-8 \\times (-6)\\)', ['48', '\\(-48\\)', '\\(-14\\)', '14'], 'Same signs: positive.', 'muldiv'],
    ['muldiv', 'Work out \\(45 \\div (-9)\\)', ['\\(-5\\)', '5', '\\(-36\\)', '54'], 'Different signs: negative.', 'muldiv'],
    ['muldiv', 'Work out \\((-1) \\times (-2) \\times (-3) \\times (-4)\\)', ['24', '\\(-24\\)', '\\(-10\\)', '10'], 'Four negatives: even, so positive.', 'muldiv'],
  ],
  LONG: [
    { q: 'The table shows the lowest temperatures in four cities one night: Oslo \\(-7\\) °C, Rome 4 °C, Warsaw \\(-11\\) °C, Madrid 2 °C. (a) Which city was the coldest? (b) Work out the difference between the temperatures in Rome and Warsaw.', m: 3, s: ['B1 for Warsaw.', 'M1 for \\(4 - (-11)\\) or counting up from \\(-11\\) to 4.', 'A1 for 15 °C.'], link: ['integers', 'See temperature differences again'] },
    { q: 'Work out (a) \\(-3 \\times 5 - (-4)\\) (b) \\((-24) \\div (-3) + (-10)\\)', m: 2, s: ['B1 for (a) \\(-11\\).', 'B1 for (b) \\(-2\\).'], link: ['muldiv', 'See the sign rules again'] },
    { q: 'Two numbers multiply to give \\(-12\\) and add to give 1. Find the two numbers.', m: 2, s: ['M1 for a pair with product \\(-12\\), e.g. \\(-3\\) and 4, or 3 and \\(-4\\).', 'A1 for 4 and \\(-3\\).'], link: ['muldiv', 'See multiplying negatives again'] },
  ],
});
