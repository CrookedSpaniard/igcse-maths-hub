FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['change', 'What is the multiplier for a 35% increase?', ['1.35', '0.35', '0.65', '3.5'], '100% + 35% = 135%.', 'change'],
    ['change', 'Decrease 640 by 15%.', ['544', '625', '96', '736'], '\\(640 \\times 0.85\\).', 'change'],
    ['change', 'A price rises from £40 to £46. What is the percentage increase?', ['15%', '6%', '13%', '46%'], '\\(\\tfrac{6}{40} \\times 100\\).', 'change'],
    ['change', 'A shop buys a vase for £25 and sells it for £20. What is the percentage loss?', ['20%', '25%', '5%', '80%'], '\\(\\tfrac{5}{25} \\times 100\\).', 'change'],
    ['reverse', 'After a 10% decrease a value is 540. What was it before?', ['600', '594', '486', '550'], '\\(540 \\div 0.9\\).', 'reverse'],
    ['reverse', 'A price including a 20% tax is £96. What is the price without the tax?', ['£80', '£76.80', '£115.20', '£86'], '\\(96 \\div 1.2\\).', 'reverse'],
    ['reverse', 'Which calculation finds the original amount if £63 is the price after a 30% reduction?', ['\\(63 \\div 0.7\\)', '\\(63 \\times 1.3\\)', '\\(63 \\div 1.3\\)', '\\(63 \\times 0.7\\)'], '£63 is 70% of the original.', 'reverse'],
    ['reverse', 'A population grew by 5% to 8400. What was it before?', ['8000', '7980', '8820', '8395'], '\\(8400 \\div 1.05\\).', 'reverse'],
  ],
  LONG: [
    { q: 'In a sale, all prices are reduced by 18%. A sofa cost £650 before the sale. A rug costs £82 in the sale. (a) Work out the sale price of the sofa. (b) Work out the price of the rug before the sale.', m: 4, s: ['M1 for \\(650 \\times 0.82\\).', 'A1 for £533.', 'M1 for \\(82 \\div 0.82\\).', 'A1 for £100.'], link: ['reverse', 'See reverse percentages again'] },
    { q: 'Tom bought a car for £12 500. He sold it two years later for £9 750. Work out his percentage loss.', m: 3, s: ['M1 for 12 500 − 9 750 (= 2750).', 'M1 for \\(\\tfrac{2750}{12\\,500} \\times 100\\).', 'A1 for 22%.'], link: ['change', 'See percentage change again'] },
    { q: 'Sara says, “If a price goes up by 10% and then down by 10%, it goes back to the original price.” Is she right? Use an example to explain.', m: 2, s: ['M1 for an example, e.g. £100 × 1.1 = £110, then £110 × 0.9 = £99.', 'A1 for No, with the reason that the 10% decrease is of a bigger amount (overall × 0.99).'], link: ['change', 'See multipliers again'] },
  ],
});
