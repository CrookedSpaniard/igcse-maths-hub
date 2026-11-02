FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['cfmedian', 'A cumulative frequency graph shows 100 values. Where do you read the median?', ['At a cumulative frequency of 50', 'At 50.5', 'At 100', 'At the steepest point'], '\\(\\frac{100}{2}\\).', 'cfmedian'],
    ['cfmedian', 'A graph shows 160 values. Where do you read the lower quartile?', ['At 40', 'At 40.25', 'At 80', 'At 120'], '\\(\\frac{160}{4}\\).', 'cfmedian'],
    ['cfmedian', 'From a graph, \\(Q_1 \\approx 23\\) and \\(Q_3 \\approx 41\\). The IQR is about…', ['18', '64', '32', '41'], '\\(41 - 23\\).', 'cfmedian'],
    ['cfmedian', 'Why is a median read from a cumulative frequency graph only an estimate?', ['The data is grouped, so the exact values are unknown', 'The curve is drawn by hand', 'We use \\(\\frac n2\\) instead of \\(n\\)', 'It is always rounded to 1 d.p.'], 'Grouped data.', 'cfmedian'],
    ['boxplot', 'A box plot has a box from 20 to 35. What is the IQR?', ['15', '35', '55', '27.5'], '\\(35 - 20\\).', 'boxplot'],
    ['boxplot', 'In a box plot, the line inside the box shows…', ['the median', 'the mean', 'the mode', 'the IQR'], 'The middle value.', 'boxplot'],
    ['boxplot', 'Group P: median 40, IQR 8. Group Q: median 40, IQR 20. Which is true?', ['Group P is more consistent', 'Group Q did better on average', 'Group Q is more consistent', 'Group P did better on average'], 'Same average; P has the smaller spread.', 'boxplot'],
    ['boxplot', '200 bulbs were tested. About how many lasted longer than the upper quartile?', ['50', '150', '100', '75'], 'A quarter of 200.', 'boxplot'],
  ],
  LONG: [
    { q: 'A cumulative frequency graph shows the masses of 120 eggs. Explain how to use it to estimate (a) the median and (b) the interquartile range.', m: 3, s: ['B1 for (a) read across from 60 to the curve and down to the mass axis.', 'M1 for reading at 30 and 90.', 'A1 for (b) IQR = reading at 90 − reading at 30.'], link: ['cfmedian', 'See reading the median and quartiles again'] },
    { q: 'The lengths of 80 fish were recorded. From the cumulative frequency graph: lower quartile 24 cm, median 31 cm, upper quartile 36 cm. The shortest fish was 12 cm and the longest was 50 cm. (a) Work out the interquartile range. (b) Draw a box plot. (c) About how many fish were longer than 36 cm?', m: 4, s: ['B1 for (a) 12 cm.', 'B1 for a box from 24 to 36 with the median at 31.', 'B1 for whiskers to 12 and 50.', 'B1 for (c) 20.'], link: ['boxplot', 'See box plots again'] },
    { q: 'The times taken by two groups of students to solve a puzzle: Group A median 48 s, IQR 15 s; Group B median 39 s, IQR 22 s. Compare the times of the two groups.', m: 2, s: ['B1 for: Group B were faster on average because their median is lower.', 'B1 for: Group A’s times were more consistent because their IQR is smaller.'], link: ['boxplot', 'See comparing in context again'] },
  ],
});
