FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['proportion', '4 pens cost £3.20. How much do 7 pens cost?', ['£5.60', '£6.40', '£4.80', '£22.40'], 'One pen 80p.', 'proportion'],
    ['proportion', 'A recipe for 6 uses 450 g of pasta. How much for 4 people?', ['300 g', '600 g', '225 g', '400 g'], '75 g per person.', 'proportion'],
    ['proportion', 'A car uses 6 litres of fuel for 80 km. How much fuel for 200 km?', ['15 litres', '12 litres', '20 litres', '2.4 litres'], '\\(6 \\times 2.5\\).', 'proportion'],
    ['proportion', 'Which pair of values is in direct proportion?', ['2 kg £5 and 6 kg £15', '2 kg £5 and 6 kg £12', '2 kg £5 and 4 kg £9', '1 kg £3 and 3 kg £10'], 'Both £2.50 per kg.', 'proportion'],
    ['bestbuy', 'Which is the best buy?', ['1 litre for £1.20', '500 ml for 65p', '250 ml for 35p', '2 litres for £2.50'], '£1.20, £1.30, £1.40, £1.25 per litre.', 'bestbuy'],
    ['bestbuy', '£1 = €1.16. How many euros for £50?', ['€58', '€43.10', '€51.16', '€5.80'], '\\(50 \\times 1.16\\).', 'bestbuy'],
    ['bestbuy', '£1 = $1.30. How many pounds for $260?', ['£200', '£338', '£130', '£261.30'], '\\(260 \\div 1.3\\).', 'bestbuy'],
    ['bestbuy', 'To find the better value pack you should compare…', ['the price per unit of each pack', 'the total prices only', 'the sizes only', 'the number of packs'], 'Price per gram, per litre…', 'bestbuy'],
  ],
  LONG: [
    { q: 'Cereal comes in two boxes: 500 g for £2.15 and 750 g for £3.30. Which box is better value? You must show your working.', m: 3, s: ['M1 for one comparable figure, e.g. 43p per 100 g.', 'M1 for both, e.g. 43p and 44p per 100 g.', 'A1 for the 500 g box, with correct figures.'], link: ['bestbuy', 'See best buys again'] },
    { q: 'A watch costs $240 in New York and £180 in London. The exchange rate is £1 = $1.28. In which city is the watch cheaper, and by how much in pounds?', m: 3, s: ['M1 for \\(240 \\div 1.28\\) (= 187.50), or \\(180 \\times 1.28\\) (= 230.40).', 'M1 for comparing in the same currency.', 'A1 for London, by £7.50.'], link: ['bestbuy', 'See exchange rates again'] },
    { q: 'It takes 3 people 8 hours to paint a hall. The painters all work at the same rate. (a) How many hours of work is that in total? (b) How long would 4 people take?', m: 3, s: ['B1 for (a) 24 hours.', 'M1 for \\(24 \\div 4\\).', 'A1 for (b) 6 hours.'], link: ['proportion', 'See the unitary method again'] },
  ],
});
