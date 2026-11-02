FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['trees', 'P(A) = 0.4 and P(B) = 0.7, independent. P(A and B) =', ['0.28', '1.1', '0.3', '0.47'], '\\(0.4 \\times 0.7\\).', 'trees'],
    ['trees', 'A fair coin is thrown three times. P(three heads) =', ['\\(\\tfrac18\\)', '\\(\\tfrac16\\)', '\\(\\tfrac38\\)', '\\(\\tfrac32\\)'], '\\(\\left(\\frac12\\right)^3\\).', 'trees'],
    ['trees', 'P(pass) = 0.8 for each of two independent tests. P(pass at least one) =', ['0.96', '0.64', '1.6', '0.8'], '\\(1 - 0.2 \\times 0.2\\).', 'trees'],
    ['trees', 'The branches from one point on a tree diagram are 0.35 and \\(x\\). \\(x =\\)', ['0.65', '0.35', '0.75', '1.35'], 'They add up to 1.', 'trees'],
    ['conditional', '6 red and 4 blue counters; two taken without replacement. P(first red, second red) =', ['\\(\\tfrac{30}{90}\\)', '\\(\\tfrac{36}{100}\\)', '\\(\\tfrac{30}{100}\\)', '\\(\\tfrac{6}{10}\\)'], '\\(\\frac{6}{10} \\times \\frac59\\).', 'conditional'],
    ['conditional', '6 red and 4 blue; the first counter (not replaced) is blue. P(second is blue) =', ['\\(\\tfrac39\\)', '\\(\\tfrac4{10}\\)', '\\(\\tfrac49\\)', '\\(\\tfrac3{10}\\)'], '3 blue of 9 left.', 'conditional'],
    ['conditional', 'Which situation gives dependent events?', ['Taking two sweets from a bag and eating them', 'Rolling a dice twice', 'Throwing two coins', 'Spinning a spinner twice'], 'The first sweet is not put back.', 'conditional'],
    ['conditional', 'Two cards are taken from 5 cards numbered 1 to 5, without replacement. P(both even) =', ['\\(\\tfrac{2}{20}\\)', '\\(\\tfrac{4}{25}\\)', '\\(\\tfrac{2}{5}\\)', '\\(\\tfrac{3}{20}\\)'], '\\(\\frac25 \\times \\frac14\\).', 'conditional'],
  ],
  LONG: [
    { q: 'The probability that Jay’s bus is late on any day is 0.15. (a) Draw a tree diagram for Monday and Tuesday. (b) Find the probability that the bus is late on exactly one of the two days.', m: 4, s: ['B1 for 0.85 on the “not late” branches.', 'B1 for a fully correct tree diagram.', 'M1 for \\(0.15 \\times 0.85 + 0.85 \\times 0.15\\).', 'A1 for (b) 0.255.'], link: ['trees', 'See tree diagrams again'] },
    { q: 'A bag has 7 green and 3 yellow sweets. Lily eats two sweets at random. Work out the probability that she eats at least one yellow sweet.', m: 3, s: ['M1 for \\(\\frac{7}{10} \\times \\frac69\\) (both green) or for any correct path with denominators 10 and 9.', 'M1 for \\(1 - \\frac{42}{90}\\), or adding the three correct paths.', 'A1 for \\(\\frac{48}{90} = \\frac{8}{15}\\).'], link: ['conditional', 'See without replacement again'] },
    { q: 'A spinner lands on red with probability 0.4. Sam spins it until it lands on red, up to a maximum of three spins. Find the probability that the spinner lands on red for the first time on the third spin.', m: 2, s: ['M1 for \\(0.6 \\times 0.6\\) seen as part of a product.', 'A1 for \\(0.6 \\times 0.6 \\times 0.4 = 0.144\\).'], link: ['trees', 'See independent events again'] },
  ],
});
