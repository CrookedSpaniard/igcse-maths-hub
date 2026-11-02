FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['scale', 'Which word describes a probability of 0?', ['Impossible', 'Unlikely', 'Certain', 'Even chance'], 'The bottom of the scale.', 'scale'],
    ['scale', 'Which of these could be a probability?', ['0.07', '1.07', '−0.7', '107%'], 'Between 0 and 1.', 'scale'],
    ['scale', 'An event with probability 0.85 is…', ['likely', 'unlikely', 'impossible', 'an even chance'], 'More than 0.5.', 'scale'],
    ['theory', 'A bag has 2 red and 7 white beads. P(red) =', ['\\(\\tfrac29\\)', '\\(\\tfrac27\\)', '\\(\\tfrac79\\)', '\\(\\tfrac12\\)'], '2 out of 9.', 'theory'],
    ['theory', 'A fair dice is rolled. P(odd) =', ['\\(\\tfrac12\\)', '\\(\\tfrac13\\)', '\\(\\tfrac16\\)', '\\(\\tfrac23\\)'], '1, 3, 5.', 'theory'],
    ['theory', 'P(late) = 0.12. P(not late) =', ['0.88', '0.12', '0.98', '1.12'], '\\(1 - 0.12\\).', 'theory'],
    ['theory', 'A letter is chosen at random from the word PROBABILITY. P(B) =', ['\\(\\tfrac{2}{11}\\)', '\\(\\tfrac{1}{11}\\)', '\\(\\tfrac{2}{9}\\)', '\\(\\tfrac{1}{26}\\)'], '2 Bs among 11 letters.', 'theory'],
    ['theory', 'Which spinner is fair?', ['One with equal sections', 'One with a red section twice as big as the others', 'One that lands on 3 most often', 'Any spinner with numbers'], 'Equally likely outcomes.', 'theory'],
  ],
  LONG: [
    { q: 'A box contains only red, blue and green pens. P(red) = 0.35 and P(blue) = 0.4. (a) Find P(green). (b) There are 20 pens in the box. How many are blue?', m: 3, s: ['M1 for \\(1 - 0.35 - 0.4\\).', 'A1 for (a) 0.25.', 'B1 for (b) 8.'], link: ['theory', 'See probabilities adding to 1 again'] },
    { q: 'A fair spinner has 8 equal sections: 3 are yellow, 4 are blue and 1 is white. (a) Find the probability it lands on blue. (b) Find the probability it does not land on yellow. (c) Mark P(white) on a probability scale.', m: 3, s: ['B1 for (a) \\(\\frac48 = \\frac12\\).', 'B1 for (b) \\(\\frac58\\).', 'B1 for (c) \\(\\frac18\\) marked near 0 (at about 0.125).'], link: ['theory', 'See equally likely outcomes again'] },
    { q: 'Tom says: “The probability of rolling a 6 on a dice is \\(\\frac16\\), so if I roll it 6 times I will definitely get a 6.” Is Tom right? Explain.', m: 1, s: ['B1 for no, with a reason, e.g. each roll is random so he may get no sixes (or more than one).'], link: ['scale', 'See the meaning of probability again'] },
  ],
});
