FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['boundcalc', '\\(a = 9\\) and \\(b = 4\\) to the nearest whole number. What is the upper bound of \\(a + b\\)?', ['14', '13', '13.5', '12'], '\\(9.5 + 4.5\\).', 'boundcalc'],
    ['boundcalc', '\\(a = 9\\) and \\(b = 4\\) to the nearest whole number. What is the upper bound of \\(a - b\\)?', ['6', '5', '4', '5.5'], '\\(9.5 - 3.5\\).', 'boundcalc'],
    ['boundcalc', 'To find the upper bound of \\(\\dfrac{x}{y}\\), use…', ['UB of x ÷ LB of y', 'UB of x ÷ UB of y', 'LB of x ÷ UB of y', 'LB of x ÷ LB of y'], 'Big on top, small on the bottom.', 'boundcalc'],
    ['boundcalc', 'A square has side 10 cm to the nearest cm. What is the lower bound of its area?', ['90.25 cm²', '81 cm²', '100 cm²', '95 cm²'], '\\(9.5^2\\).', 'boundcalc'],
    ['boundcalc', 'Speed = distance ÷ time. For the lower bound of the speed, use…', ['LB of distance ÷ UB of time', 'UB of distance ÷ LB of time', 'LB of distance ÷ LB of time', 'UB of distance ÷ UB of time'], 'Small ÷ big.', 'boundcalc'],
    ['boundcalc', '\\(p = 2.4\\) (1 d.p.). What is the upper bound of \\(3p\\)?', ['7.35', '7.2', '7.5', '7.25'], '\\(3 \\times 2.45\\).', 'boundcalc'],
    ['boundcalc', 'LB = 12.43 and UB = 12.49. Which accuracy do they agree to?', ['12.4 (1 d.p.)', '12.45 (2 d.p.)', '12.5 (1 d.p.)', 'They do not agree to any'], 'Both round to 12.4.', 'boundcalc'],
    ['boundcalc', 'A bag holds 20 kg to the nearest kg. Items weigh 2.5 kg to 1 d.p. What is the greatest number of items that will certainly fit?', ['7', '8', '9', '6'], 'Smallest bag 19.5 ÷ biggest item 2.55 = 7.6…', 'boundcalc'],
  ],
  LONG: [
    { q: 'A car travels 250 km, correct to the nearest 10 km, in 3.2 hours, correct to 1 decimal place. Work out the upper bound of the average speed. Show your working.', m: 3, s: ['B1 for 255 or 3.15 seen.', 'M1 for \\(255 \\div 3.15\\).', 'A1 for 80.95… km/h.'], link: ['boundcalc', 'See speed with bounds again'] },
    { q: '\\(a = 6.3\\) and \\(b = 2.1\\), both correct to 1 decimal place. Work out the lower bound of \\(\\dfrac{a}{b}\\). Give your answer to 3 significant figures.', m: 3, s: ['B1 for 6.25 or 2.15 seen.', 'M1 for \\(6.25 \\div 2.15\\).', 'A1 for 2.91.'], link: ['boundcalc', 'See dividing with bounds again'] },
    { q: 'The area of a rectangle is 50 cm², correct to the nearest 5 cm². Its length is 8 cm, to the nearest cm. Work out the upper bound of its width. Give your answer to 3 significant figures.', m: 3, s: ['B1 for 52.5 and 7.5 seen.', 'M1 for \\(52.5 \\div 7.5\\).', 'A1 for 7.00.'], link: ['boundcalc', 'See bounds in calculations again'] },
  ],
});
