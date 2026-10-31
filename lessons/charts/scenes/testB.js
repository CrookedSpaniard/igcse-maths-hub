FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['stemleaf', 'Key 3 | 4 means 34. What value is 5 | 0?', ['50', '5', '0.5', '500'], 'Stem 5, leaf 0.', 'stemleaf'],
    ['stemleaf', 'An ordered stem-and-leaf diagram has rows 1 | 2 5 and 2 | 0 3 8. What is the range?', ['16', '26', '8', '5'], '\\(28 - 12\\).', 'stemleaf'],
    ['stemleaf', 'Where is the point for the class \\(40 < x \\le 60\\) plotted on a frequency polygon?', ['At x = 50', 'At x = 40', 'At x = 60', 'At x = 20'], 'At the midpoint.', 'stemleaf'],
    ['stemleaf', 'What must an ordered stem-and-leaf diagram have?', ['Leaves in order and a key', 'A pie chart', 'Equal stems', 'Midpoints'], 'Ordered leaves and a key.', 'stemleaf'],
    ['scatter', 'As the age of a phone increases, its value decreases. This is…', ['negative correlation', 'positive correlation', 'no correlation', 'an outlier'], 'One up, the other down.', 'scatter'],
    ['scatter', 'A line of best fit should…', ['pass through the middle of the points', 'join the first and last points', 'go through the origin', 'touch every point'], 'About as many points above as below.', 'scatter'],
    ['scatter', 'Using a line of best fit outside the range of the data is…', ['unreliable', 'more accurate', 'always correct', 'interpolation'], 'Extrapolation.', 'scatter'],
    ['scatter', 'A point far away from the pattern is called…', ['an outlier', 'the mode', 'the median', 'a correlation'], 'It does not fit.', 'scatter'],
  ],
  LONG: [
    { q: 'The times, in seconds, of 12 runners are: 52, 47, 61, 55, 49, 58, 63, 50, 47, 56, 60, 53. Draw an ordered stem-and-leaf diagram and find the median.', m: 4, s: ['B1 for stems 4, 5, 6.', 'B1 for all leaves correct and ordered: 4 | 7 7 9, 5 | 0 2 3 5 6 8, 6 | 0 1 3.', 'B1 for a key, e.g. 4 | 7 means 47.', 'B1 for median 54.'], link: ['stemleaf', 'See ordering a stem-and-leaf diagram again'] },
    { q: 'A scatter graph shows the engine size and fuel economy of cars. As engine size increases, fuel economy decreases. (a) Describe the correlation. (b) Explain why a line of best fit may not give a good estimate for an engine size much bigger than any in the data.', m: 2, s: ['B1 for negative correlation.', 'B1 for it is outside the range of the data (extrapolation), so the pattern may not continue.'], link: ['scatter', 'See lines of best fit again'] },
    { q: 'Times (minutes): 0–10: 5, 10–20: 12, 20–30: 8, 30–40: 3. Write down the four points you would plot for a frequency polygon.', m: 2, s: ['M1 for using midpoints 5, 15, 25, 35.', 'A1 for (5, 5), (15, 12), (25, 8), (35, 3).'], link: ['stemleaf', 'See frequency polygons again'] },
  ],
});
