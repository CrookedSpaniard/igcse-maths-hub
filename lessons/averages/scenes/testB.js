FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['freqtable', 'In a frequency table the values are 1, 2, 3 and the frequencies are 4, 10, 6. What is the mode?', ['2', '10', '3', '1'], 'Value 2 has the highest frequency.', 'freqtable'],
    ['freqtable', 'Values 1, 2, 3 with frequencies 4, 10, 6. What is \\(\\sum fx\\)?', ['42', '20', '6', '60'], '\\(4 + 20 + 18\\).', 'freqtable'],
    ['freqtable', 'Values 1, 2, 3 with frequencies 4, 10, 6. What is the mean?', ['2.1', '2', '7', '14'], '\\(42 \\div 20\\).', 'freqtable'],
    ['freqtable', 'A frequency table has a total frequency of 31. Which value is the median?', ['The 16th', 'The 15.5th', 'The 31st', 'The 15th'], '\\(\\frac{31 + 1}{2} = 16\\).', 'freqtable'],
    ['grouped', 'What is the midpoint of the class \\(20 < x \\le 30\\)?', ['25', '20', '30', '10'], '\\(\\frac{20 + 30}{2}\\).', 'grouped'],
    ['grouped', 'Classes \\(0 < t \\le 5\\), \\(5 < t \\le 10\\), \\(10 < t \\le 15\\) have frequencies 7, 11, 4. What is the modal class?', ['\\(5 < t \\le 10\\)', '11', '\\(10 < t \\le 15\\)', '\\(0 < t \\le 5\\)'], 'Highest frequency.', 'grouped'],
    ['grouped', 'Why is the mean of grouped data only an estimate?', ['We use midpoints, not the exact values', 'We divide by the number of classes', 'The frequencies are rounded', 'The modal class is unknown'], 'The real values are lost when we group.', 'grouped'],
    ['grouped', 'Classes \\(0 < x \\le 10\\) and \\(10 < x \\le 20\\) have frequencies 6 and 4. Estimate the mean.', ['9', '10', '7.5', '12'], '\\((30 + 60) \\div 10\\).', 'grouped'],
  ],
  LONG: [
    { q: 'The table shows the number of goals scored in 25 hockey matches: 0 goals 6, 1 goal 8, 2 goals 5, 3 goals 4, 4 goals 2. (a) Write down the mode. (b) Find the median. (c) Work out the mean.', m: 5, s: ['B1 for (a) 1.', 'M1 for the 13th value, or running totals 6, 14.', 'A1 for (b) 1.', 'M1 for \\(\\sum fx = 0 + 8 + 10 + 12 + 8 = 38\\).', 'A1 for (c) 1.52.'], link: ['freqtable', 'See frequency tables again'] },
    { q: 'The masses of 40 parcels: \\(0 < m \\le 2\\): 9, \\(2 < m \\le 4\\): 15, \\(4 < m \\le 6\\): 11, \\(6 < m \\le 8\\): 5 (kg). (a) Write down the modal class. (b) Work out an estimate for the mean mass.', m: 4, s: ['B1 for (a) \\(2 < m \\le 4\\).', 'M1 for midpoints 1, 3, 5, 7.', 'M1 for \\(9 + 45 + 55 + 35 = 144\\) and \\(\\div 40\\).', 'A1 for (b) 3.6 kg.'], link: ['grouped', 'See estimating the mean again'] },
    { q: 'The table shows the number of pets owned by some students: 0 pets 3, 1 pet \\(x\\), 2 pets 7. The mean number of pets is 1.2. Find \\(x\\).', m: 3, s: ['M1 for \\(\\sum fx = x + 14\\) and \\(\\sum f = 10 + x\\).', 'M1 for \\(x + 14 = 1.2(10 + x)\\).', 'A1 for \\(x = 10\\).'], link: ['freqtable', 'See the mean from a table again'] },
  ],
});
