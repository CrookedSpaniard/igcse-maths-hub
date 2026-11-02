FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['spread', 'Which is NOT a measure of spread?', ['The median', 'The range', 'The interquartile range', 'Upper quartile − lower quartile'], 'The median is an average.', 'spread'],
    ['spread', 'Why is the IQR often better than the range?', ['It is not affected by extreme values', 'It is always bigger', 'It uses every value', 'It is easier to find'], 'It uses only the middle half.', 'spread'],
    ['spread', 'Group X has IQR 6 and group Y has IQR 15. Which is more consistent?', ['Group X', 'Group Y', 'They are the same', 'You need the medians'], 'Smaller spread.', 'spread'],
    ['spread', 'The quartiles are 34 and 52. What is the IQR?', ['18', '86', '43', '52'], '\\(52 - 34\\).', 'spread'],
    ['iqrlist', 'For 11 ordered values, which position is the lower quartile?', ['3rd', '2.75th', '6th', '4th'], '\\(\\frac{12}{4}\\).', 'iqrlist'],
    ['iqrlist', 'For 19 ordered values, which position is the upper quartile?', ['15th', '14.25th', '10th', '5th'], '\\(\\frac{3 \\times 20}{4}\\).', 'iqrlist'],
    ['iqrlist', 'Find the upper quartile of 2, 4, 5, 7, 8, 11, 13.', ['11', '8', '13', '7'], '6th value.', 'iqrlist'],
    ['iqrlist', 'Find the IQR of 10, 12, 15, 18, 21, 23, 29.', ['11', '19', '18', '8'], '\\(Q_1 = 12\\), \\(Q_3 = 23\\).', 'iqrlist'],
  ],
  LONG: [
    { q: 'Here are the heights, in cm, of 11 plants: 23, 31, 18, 27, 35, 22, 29, 40, 26, 33, 20. Work out the interquartile range.', m: 3, s: ['M1 for the values in order: 18, 20, 22, 23, 26, 27, 29, 31, 33, 35, 40.', 'M1 for \\(Q_1 = 22\\) or \\(Q_3 = 33\\) (3rd and 9th values).', 'A1 for 11.'], link: ['iqrlist', 'See finding quartiles again'] },
    { q: 'The times, in seconds, of two sprinters over seven races are: Ana 12.4, 12.6, 12.5, 12.9, 12.5, 12.7, 12.6; Bea 12.1, 13.2, 12.4, 12.9, 12.6, 13.4, 12.2. (a) Work out the IQR for each sprinter. (b) Which sprinter is more consistent? Give a reason.', m: 4, s: ['M1 for ordering either list.', 'A1 for Ana IQR \\(12.7 - 12.5 = 0.2\\).', 'A1 for Bea IQR \\(13.2 - 12.2 = 1.0\\).', 'B1 (ft) for Ana, because her IQR is smaller.'], link: ['spread', 'See comparing spread again'] },
    { q: 'Explain why the interquartile range might be a better measure of spread than the range for the data 5, 6, 6, 7, 8, 8, 9, 45.', m: 1, s: ['B1 for: 45 is an outlier, which makes the range very large, but the IQR is not affected by it (accept equivalent).'], link: ['spread', 'See the range and outliers again'] },
  ],
});
