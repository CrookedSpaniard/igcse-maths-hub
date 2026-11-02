FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['samplespace', 'A coin is thrown and a 4-sided spinner is spun. How many outcomes are there?', ['8', '6', '4', '16'], '\\(2 \\times 4\\).', 'samplespace'],
    ['samplespace', 'Two fair dice are rolled. P(sum = 11) =', ['\\(\\tfrac{2}{36}\\)', '\\(\\tfrac{1}{36}\\)', '\\(\\tfrac{1}{11}\\)', '\\(\\tfrac{11}{36}\\)'], '(5, 6) and (6, 5).', 'samplespace'],
    ['samplespace', 'Three coins are thrown. How many outcomes are there?', ['8', '6', '3', '9'], '\\(2 \\times 2 \\times 2\\).', 'samplespace'],
    ['addrule', 'P(red) = 0.3, P(blue) = 0.45 for one counter. P(red or blue) =', ['0.75', '0.135', '0.15', '0.25'], 'Mutually exclusive: add.', 'addrule'],
    ['addrule', 'A spinner: P(A) = 0.2, P(B) = 0.5, and it can only land on A, B or C. P(C) =', ['0.3', '0.7', '0.1', '0.5'], '\\(1 - 0.7\\).', 'addrule'],
    ['addrule', 'Which events are mutually exclusive (one dice)?', ['Rolling a 1 and rolling an even number', 'Rolling a 2 and rolling an even number', 'Rolling a 3 and rolling an odd number', 'Rolling a 6 and rolling a factor of 12'], '1 is odd.', 'addrule'],
    ['vennprob', 'A only 12, both 3, B only 10, neither 5. P(B) =', ['\\(\\tfrac{13}{30}\\)', '\\(\\tfrac{10}{30}\\)', '\\(\\tfrac{13}{25}\\)', '\\(\\tfrac{3}{30}\\)'], '\\(\\frac{3 + 10}{30}\\).', 'vennprob'],
    ['vennprob', 'A only 12, both 3, B only 10, neither 5. P(neither) =', ['\\(\\tfrac16\\)', '\\(\\tfrac{5}{25}\\)', '\\(\\tfrac{5}{6}\\)', '5'], '\\(\\frac{5}{30}\\).', 'vennprob'],
  ],
  LONG: [
    { q: 'Ella spins a fair spinner numbered 1, 2, 3 and throws a fair coin. (a) List all the possible outcomes. (b) Find the probability of getting an odd number and a tail.', m: 3, s: ['B1 for (a) all 6 outcomes: 1H, 1T, 2H, 2T, 3H, 3T, with no extras.', 'M1 for 2 favourable outcomes (1T, 3T) out of 6.', 'A1 for (b) \\(\\frac26 = \\frac13\\).'], link: ['samplespace', 'See listing outcomes again'] },
    { q: 'A biased dice: P(1) = 0.1, P(2) = 0.15, P(3) = 0.2, P(4) = \\(x\\), P(5) = 0.15, P(6) = \\(2x\\). (a) Find \\(x\\). (b) Find P(rolling a 4 or a 6).', m: 4, s: ['M1 for \\(0.6 + 3x = 1\\).', 'A1 for (a) \\(x = \\frac{0.4}{3} = \\frac{2}{15}\\) (≈ 0.133).', 'M1 for \\(x + 2x\\).', 'A1 for (b) 0.4.'], link: ['addrule', 'See probabilities adding to 1 again'] },
    { q: 'In a club of 50 members, 28 swim, 19 cycle and 7 do both. (a) Draw a Venn diagram. (b) A member is chosen at random. Find the probability that they do neither.', m: 4, s: ['M1 for 7 in the overlap.', 'A1 for 21 swim only and 12 cycle only.', 'B1 for 10 outside.', 'B1 (ft) for (b) \\(\\frac{10}{50} = \\frac15\\).'], link: ['vennprob', 'See Venn diagram probabilities again'] },
  ],
});
