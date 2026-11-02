FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['fd', 'The class \\(10 < x \\le 30\\) has frequency 16. What is its frequency density?', ['0.8', '1.25', '16', '320'], '\\(16 \\div 20\\).', 'fd'],
    ['fd', 'On a histogram, the area of each bar represents…', ['the frequency', 'the frequency density', 'the class width', 'the cumulative frequency'], 'Width × frequency density = frequency.', 'fd'],
    ['fd', 'Why do we use frequency density when the classes have different widths?', ['So that wide classes do not look bigger than they are', 'To make the numbers smaller', 'So the bars have gaps', 'To find the median'], 'Our eyes compare areas.', 'fd'],
    ['fd', 'A class \\(0 < t \\le 4\\) has frequency 10. How tall is its bar?', ['2.5', '0.4', '40', '10'], '\\(10 \\div 4\\).', 'fd'],
    ['readhist', 'A bar from 30 to 45 has frequency density 2. What is its frequency?', ['30', '15', '7.5', '90'], '\\(15 \\times 2\\).', 'readhist'],
    ['readhist', 'A bar from 0 to 10 has frequency density 3. Estimate how many values are between 6 and 10.', ['12', '30', '18', '4'], '\\(4 \\times 3\\).', 'readhist'],
    ['readhist', 'Two bars have the same height. One is twice as wide. Its frequency is…', ['twice as big', 'the same', 'half as big', 'four times as big'], 'Area doubles.', 'readhist'],
    ['readhist', 'Why is a value found from part of a bar only an estimate?', ['We assume the values are spread evenly in the class', 'Histograms are always drawn wrongly', 'The class widths are rounded', 'Frequency density is a guess'], 'We do not know where in the class each value lies.', 'readhist'],
  ],
  LONG: [
    { q: 'The table shows the heights of 60 seedlings: \\(0 < h \\le 5\\): 6, \\(5 < h \\le 10\\): 14, \\(10 < h \\le 12\\): 12, \\(12 < h \\le 15\\): 15, \\(15 < h \\le 25\\): 13 (cm). Work out the frequency densities and draw a histogram.', m: 4, s: ['M1 for at least three correct frequency densities: 1.2, 2.8, 6, 5, 1.3.', 'A1 for all five correct.', 'B1 for at least three bars correct (correct width and height).', 'B1 for a fully correct histogram with frequency density on the vertical axis.'], link: ['fd', 'See drawing a histogram again'] },
    { q: 'A histogram shows the times taken by some students to finish a puzzle. The bar for \\(20 < t \\le 30\\) has height 3.2, and the bar for \\(30 < t \\le 50\\) has height 0.9. (a) How many students took between 20 and 30 seconds? (b) Estimate how many students took between 25 and 40 seconds.', m: 4, s: ['B1 for (a) 32.', 'M1 for \\(5 \\times 3.2 = 16\\).', 'M1 for \\(10 \\times 0.9 = 9\\).', 'A1 for (b) 25.'], link: ['readhist', 'See part of a class again'] },
    { q: 'On a histogram the bar for \\(10 < x \\le 15\\) represents 18 people and is 7.2 cm tall. The bar for \\(15 < x \\le 30\\) is 2.4 cm tall. How many people does it represent?', m: 3, s: ['M1 for frequency density \\(18 \\div 5 = 3.6\\), so 1 cm = 0.5.', 'M1 for \\(2.4 \\times 0.5 = 1.2\\) and \\(15 \\times 1.2\\).', 'A1 for 18.'], link: ['readhist', 'See finding the scale again'] },
  ],
});
