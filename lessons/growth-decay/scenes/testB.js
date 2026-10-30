FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['repeated', 'A price goes up by 25% and then down by 20%. The overall change is…', ['no change', 'a 5% increase', 'a 5% decrease', 'a 45% increase'], '\\(1.25 \\times 0.8 = 1\\).', 'repeated'],
    ['repeated', 'Increasing by 10% three times is the same as multiplying by…', ['\\(1.1^3\\)', '1.3', '\\(0.1^3\\)', '3.3'], 'One multiplier for each increase.', 'repeated'],
    ['repeated', 'A population falls by 4% a year. After 6 years the multiplier is…', ['\\(0.96^6\\)', '\\(0.04^6\\)', '0.76', '\\(1.04^6\\)'], '0.96 each year.', 'repeated'],
    ['repeated', 'A share price rises 30% then falls 30%. Overall it…', ['falls by 9%', 'stays the same', 'rises by 9%', 'falls by 30%'], '\\(1.3 \\times 0.7 = 0.91\\).', 'repeated'],
    ['problems', 'After 2 years at 10% compound interest an account holds £605. What was invested?', ['£500', '£484', '£550', '£495'], '\\(605 \\div 1.21\\).', 'problems'],
    ['problems', '£2000 grows to £2420 in 2 years of compound interest. What is the rate?', ['10%', '21%', '10.5%', '42%'], '\\(m^2 = 1.21\\).', 'problems'],
    ['problems', 'A value halves every year. After how many years is it less than 10% of the start?', ['4', '3', '5', '10'], '\\(0.5^3 = 0.125\\), \\(0.5^4 = 0.0625\\).', 'problems'],
    ['problems', 'Which equation finds the rate \\(r\\%\\) if £P grows to £A in 3 years?', ['\\(P(1 + \\tfrac{r}{100})^3 = A\\)', '\\(P + 3r = A\\)', '\\(P \\times 3r = A\\)', '\\(P(1 - \\tfrac{r}{100})^3 = A\\)'], 'Multiplier cubed.', 'problems'],
  ],
  LONG: [
    { q: 'The value of a house increased by 6% in the first year and by 4% in the second year. At the end of the second year it was worth £275 600. Work out its value at the start.', m: 3, s: ['M1 for \\(1.06 \\times 1.04\\) (= 1.1024).', 'M1 for \\(275\\,600 \\div 1.1024\\).', 'A1 for £250 000.'], link: ['problems', 'See finding the original amount again'] },
    { q: 'Bacteria in a dish increase by 35% every hour. There are 2000 at the start. After how many whole hours will there first be more than 10 000?', m: 3, s: ['M1 for \\(2000 \\times 1.35^n\\) with at least one trial.', 'M1 for \\(1.35^5 = 4.48\\dots\\) and \\(1.35^6 = 6.05\\dots\\) (or 8968 and 12 107).', 'A1 for 6 hours.'], link: ['problems', 'See finding the number of years again'] },
    { q: 'An investment of £8000 grows to £9331.20 in 2 years of compound interest. Work out the annual rate of interest.', m: 3, s: ['M1 for \\(9331.20 \\div 8000\\) (= 1.1664).', 'M1 for \\(\\sqrt{1.1664}\\) (= 1.08).', 'A1 for 8%.'], link: ['problems', 'See finding the rate again'] },
  ],
});
