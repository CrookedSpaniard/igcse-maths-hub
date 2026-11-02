FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['relfreq', 'A coin lands heads 31 times in 50 throws. The relative frequency of heads is…', ['0.62', '0.31', '0.5', '31'], '\\(31 \\div 50\\).', 'relfreq'],
    ['relfreq', 'Why might the relative frequency of a six be 0.3 after 10 rolls of a fair dice?', ['There have been too few trials', 'The dice must be biased', 'The calculation is wrong', 'Relative frequency is always 0.3'], 'Small samples vary a lot.', 'relfreq'],
    ['relfreq', 'A spinner lands on blue 45 times in 150 spins. Estimate P(blue).', ['0.3', '0.45', '0.15', '0.5'], '\\(45 \\div 150\\).', 'relfreq'],
    ['relfreq', 'Which gives the most reliable estimate of a probability?', ['1000 trials', '100 trials', '10 trials', '1 trial'], 'More trials.', 'relfreq'],
    ['expected', 'A fair dice is rolled 120 times. How many times would you expect a 5?', ['20', '24', '5', '600'], '\\(\\frac16 \\times 120\\).', 'expected'],
    ['expected', 'P(rain) = 0.2. On how many of 30 days would you expect rain?', ['6', '20', '15', '0.6'], '\\(0.2 \\times 30\\).', 'expected'],
    ['expected', 'A coin is thrown 200 times and lands heads 103 times. This suggests…', ['the coin is probably fair', 'the coin is biased', 'it should be exactly 100', 'tails is more likely'], '103 is close to the expected 100.', 'expected'],
    ['expected', '12 out of 80 apples in a sample are bruised. Estimate how many of 2000 apples are bruised.', ['300', '240', '150', '120'], '\\(\\frac{12}{80} \\times 2000\\).', 'expected'],
  ],
  LONG: [
    { q: 'A four-sided spinner is spun 200 times. The results are: 1: 38 times, 2: 52 times, 3: 64 times, 4: 46 times. (a) Find the relative frequency of a 3. (b) Is the spinner fair? Give a reason.', m: 3, s: ['B1 for (a) \\(\\frac{64}{200} = 0.32\\).', 'M1 for an expected frequency of 50 for each number.', 'A1 for (b) probably not: 64 (or 38) is a long way from 50 after 200 spins (accept a reasoned answer either way).'], link: ['expected', 'See fair or biased again'] },
    { q: 'The probability that a biased dice lands on 2 is 0.28. The dice is rolled 450 times. Work out an estimate for the number of times it lands on 2.', m: 2, s: ['M1 for \\(0.28 \\times 450\\).', 'A1 for 126.'], link: ['expected', 'See expected frequency again'] },
    { q: 'In a survey, 45 out of 120 students said they cycle to school. The school has 960 students. Estimate how many cycle to school.', m: 2, s: ['M1 for \\(\\frac{45}{120}\\) (= 0.375) or \\(960 \\div 120 = 8\\).', 'A1 for 360.'], link: ['expected', 'See estimating from a sample again'] },
  ],
});
