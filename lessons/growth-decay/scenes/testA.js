FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['simple', '£500 at 6% simple interest for 3 years. How much interest?', ['£90', '£30', '£95.51', '£590'], '\\(500 \\times 0.06 \\times 3\\).', 'simple'],
    ['simple', '£200 at 10% compound interest. How much after 2 years?', ['£242', '£240', '£220', '£400'], '\\(200 \\times 1.1^2\\).', 'simple'],
    ['simple', 'Which statement about compound interest is true?', ['Interest is added to the amount each year and earns interest too', 'The interest is the same every year', 'It is always less than simple interest', 'It only works for 1 year'], 'Interest on the interest.', 'simple'],
    ['compound', 'Which calculation gives £7000 after 4 years at 3% compound interest?', ['\\(7000 \\times 1.03^4\\)', '\\(7000 \\times 0.03^4\\)', '\\(7000 \\times 1.12\\)', '\\(7000 \\times 1.03 \\times 4\\)'], 'Multiplier 1.03, four times.', 'compound'],
    ['compound', 'A boat depreciates by 10% a year. What is the multiplier for one year?', ['0.9', '1.1', '0.1', '0.09'], '100% − 10%.', 'compound'],
    ['compound', 'A phone worth £600 depreciates by 20% a year. What is it worth after 2 years?', ['£384', '£360', '£480', '£240'], '\\(600 \\times 0.8^2\\).', 'compound'],
    ['compound', '£1000 at 5% compound interest for 3 years gives…', ['£1157.63', '£1150.00', '£1050.00', '£1157.00'], '\\(1000 \\times 1.05^3 = 1157.625\\).', 'compound'],
    ['compound', 'Money doubles when it has grown by…', ['100%', '200%', '50%', '2%'], 'Double = 200% of the original, an increase of 100%.', 'compound'],
  ],
  LONG: [
    { q: 'Amir invests £4500 for 3 years at 2.5% per year compound interest. Work out the value of his investment at the end of 3 years. Give your answer to the nearest penny.', m: 3, s: ['M1 for 1.025 seen as the multiplier.', 'M1 for \\(4500 \\times 1.025^3\\).', 'A1 for £4846.01.'], link: ['compound', 'See the compound interest formula again'] },
    { q: 'A car was bought for £18 000. Its value depreciates by 12% each year. Work out its value after 4 years.', m: 3, s: ['M1 for 0.88 as the multiplier.', 'M1 for \\(18\\,000 \\times 0.88^4\\).', 'A1 for £10 794.52 (accept £10 795).'], link: ['compound', 'See depreciation again'] },
    { q: 'Lucy invests £2000 at 4% simple interest for 3 years. Ben invests £2000 at 4% compound interest for 3 years. How much more interest does Ben get?', m: 3, s: ['M1 for simple interest £240.', 'M1 for \\(2000 \\times 1.04^3\\) (= 2249.728).', 'A1 for £9.73.'], link: ['simple', 'See simple and compound interest again'] },
  ],
});
