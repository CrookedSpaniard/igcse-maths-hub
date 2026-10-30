FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['rounding', 'Round 6385 to the nearest 100.', ['6400', '6300', '6390', '64'], 'Decider 8: up.', 'rounding'],
    ['rounding', 'Round 12.0452 to 2 decimal places.', ['12.05', '12.04', '12.045', '12.1'], 'Decider 5: up.', 'rounding'],
    ['rounding', 'Round 0.396 to 2 decimal places.', ['0.40', '0.39', '0.4', '0.396'], 'Decider 6: 0.39 → 0.40.', 'rounding'],
    ['sigfig', 'Round 0.06072 to 2 significant figures.', ['0.061', '0.06', '0.0607', '0.060'], 'Skip leading zeros: 6, 0, then decider 7.', 'sigfig'],
    ['sigfig', 'Round 385 210 to 1 significant figure.', ['400 000', '4', '390 000', '300 000'], 'Decider 8: up, fill with zeros.', 'sigfig'],
    ['sigfig', 'How many significant figures has 40.08?', ['4', '2', '3', '5'], 'Zeros between digits count.', 'sigfig'],
    ['estimate', 'Estimate \\(\\dfrac{31.6 \\times 4.9}{0.21}\\)', ['750', '75', '7500', '150'], '\\(\\frac{30 \\times 5}{0.2} = 750\\).', 'estimate'],
    ['estimate', 'Estimate \\(\\sqrt{50} + 2.9^2\\)', ['16', '10', '13', '58'], '\\(\\sqrt{49} + 3^2 = 7 + 9\\).', 'estimate'],
  ],
  LONG: [
    { q: 'Work out \\(\\dfrac{18.7 \\times 3.25}{4.3 + 1.82}\\). (a) Write down all the figures on your calculator display. (b) Give your answer to 3 significant figures.', m: 2, s: ['B1 for (a) 9.930555… (accept 9.93055…).', 'B1 (ft) for (b) 9.93.'], link: ['sigfig', 'See significant figures again'] },
    { q: 'By rounding each number to 1 significant figure, estimate the value of \\(\\dfrac{612 \\times 0.48}{19.7}\\). Show your working.', m: 2, s: ['M1 for \\(\\frac{600 \\times 0.5}{20}\\).', 'A1 for 15.'], link: ['estimate', 'See estimating again'] },
    { q: 'Lena estimates \\(4.7^2\\) as \\(5^2 = 25\\). (a) Is her estimate an overestimate or an underestimate? Give a reason. (b) Round 4.7² to 1 decimal place.', m: 3, s: ['B1 for overestimate.', 'B1 for a reason: 5 is bigger than 4.7.', 'B1 for (b) 22.1 (\\(4.7^2 = 22.09\\)).'], link: ['estimate', 'See over or under again'] },
  ],
});
