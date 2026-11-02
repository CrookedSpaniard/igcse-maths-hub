FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['cftable', 'Frequencies 6, 11, 15, 8. What is the third cumulative frequency?', ['32', '15', '26', '40'], '\\(6 + 11 + 15\\).', 'cftable'],
    ['cftable', 'Where is the point for the class \\(40 < m \\le 60\\) plotted?', ['At \\(m = 60\\)', 'At \\(m = 50\\)', 'At \\(m = 40\\)', 'At the frequency'], 'Upper class boundary.', 'cftable'],
    ['cftable', 'The cumulative frequencies are 7, 19, 34, 40. How many values are in the third class?', ['15', '34', '19', '12'], '\\(34 - 19\\).', 'cftable'],
    ['cftable', 'A cumulative frequency curve usually starts at…', ['the lowest class boundary with cumulative frequency 0', 'the first midpoint', 'the origin, always', 'the highest frequency'], 'Nothing is below the first class.', 'cftable'],
    ['cfuse', 'A graph for 120 people reads 85 at a height of 170 cm. How many are taller than 170 cm?', ['35', '85', '50', '205'], '\\(120 - 85\\).', 'cfuse'],
    ['cfuse', 'A graph reads 22 at \\(t = 10\\) and 58 at \\(t = 25\\). How many values are between 10 and 25?', ['36', '80', '58', '22'], '\\(58 - 22\\).', 'cfuse'],
    ['cfuse', 'To find the time that 30 people were within, you…', ['go across from 30, then down', 'go up from 30, then across', 'read the frequency of 30', 'divide 30 by the total'], 'Start on the cumulative frequency axis.', 'cfuse'],
    ['cfuse', 'Where is a cumulative frequency curve steepest?', ['Where the data is most crowded', 'At the start', 'At the end', 'It has the same steepness everywhere'], 'Lots of values in a short interval.', 'cfuse'],
  ],
  LONG: [
    { q: 'The masses of 80 apples: \\(100 < m \\le 120\\): 6, \\(120 < m \\le 140\\): 15, \\(140 < m \\le 160\\): 28, \\(160 < m \\le 180\\): 21, \\(180 < m \\le 200\\): 10 (grams). (a) Complete a cumulative frequency table. (b) Draw the cumulative frequency graph.', m: 4, s: ['B1 for (a) 6, 21, 49, 70, 80.', 'M1 for at least 4 points plotted at the upper class boundaries.', 'A1 for all points correct, including (100, 0).', 'A1 for a smooth curve or line segments through the points.'], link: ['cftable', 'See drawing a cumulative frequency graph again'] },
    { q: 'A cumulative frequency graph shows the times 60 runners took to finish a race. At 25 minutes it reads 14, and at 40 minutes it reads 51. (a) How many runners took more than 40 minutes? (b) How many took between 25 and 40 minutes?', m: 3, s: ['M1 for \\(60 - 51\\).', 'A1 for (a) 9.', 'B1 for (b) 37.'], link: ['cfuse', 'See reading the graph again'] },
    { q: 'A cumulative frequency graph for 200 phone batteries reads 150 at a life of 30 hours. The manufacturer says “at least 30% of the batteries last more than 30 hours”. Is this true? Show your working.', m: 3, s: ['M1 for \\(200 - 150 = 50\\).', 'M1 for \\(\\frac{50}{200} = 25\\%\\) or 30% of 200 = 60.', 'A1 for no, with a correct comparison (25% < 30%, or 50 < 60).'], link: ['cfuse', 'See “more than” questions again'] },
  ],
});
