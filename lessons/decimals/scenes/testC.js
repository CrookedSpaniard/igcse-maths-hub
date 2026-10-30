FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['rec2frac', 'Write \\(0.\\dot{4}\\) as a fraction.', ['\\(\\tfrac{4}{9}\\)', '\\(\\tfrac{4}{10}\\)', '\\(\\tfrac{2}{5}\\)', '\\(\\tfrac{4}{99}\\)'], '\\(9x = 4\\).', 'rec2frac'],
    ['rec2frac', 'Write \\(0.\\dot{1}\\dot{8}\\) as a fraction in its simplest form.', ['\\(\\tfrac{2}{11}\\)', '\\(\\tfrac{18}{100}\\)', '\\(\\tfrac{9}{50}\\)', '\\(\\tfrac{1}{8}\\)'], '\\(\\tfrac{18}{99} = \\tfrac{2}{11}\\).', 'rec2frac'],
    ['rec2frac', 'For \\(x = 0.\\dot{2}0\\dot{7}\\), which equation is correct?', ['\\(999x = 207\\)', '\\(99x = 207\\)', '\\(9x = 207\\)', '\\(1000x = 207\\)'], 'Three digits repeat: \\(1000x - x = 999x\\).', 'rec2frac'],
    ['rec2frac', 'Write \\(0.3\\dot{8}\\) as a fraction.', ['\\(\\tfrac{7}{18}\\)', '\\(\\tfrac{38}{99}\\)', '\\(\\tfrac{35}{99}\\)', '\\(\\tfrac{19}{50}\\)'], '\\(100x - 10x = 38.8\\dots - 3.8\\dots = 35\\); \\(\\tfrac{35}{90} = \\tfrac{7}{18}\\).', 'rec2frac'],
    ['rec2frac', 'Which of these is equal to \\(\\tfrac{1}{3}\\)?', ['\\(0.\\dot{3}\\)', '0.33', '0.333', '\\(0.\\dot{3}\\dot{0}\\)'], '\\(\\tfrac13 = 0.333\\dots\\) exactly.', 'rec2frac'],
    ['rec2frac', 'What is \\(0.\\dot{9}\\) as a fraction?', ['\\(\\tfrac{9}{9} = 1\\)', '\\(\\tfrac{9}{10}\\)', '\\(\\tfrac{99}{100}\\)', 'It is not a fraction'], '\\(10x - x = 9\\), so \\(x = 1\\). Surprising, but true!', 'rec2frac'],
    ['rec2frac', 'Why does the method subtract two equations?', ['So that the endless tails cancel', 'To make the number smaller', 'To find the remainder', 'To round the decimal'], 'Both lines have exactly the same digits after the point.', 'rec2frac'],
    ['rec2frac', 'Write \\(1.\\dot{2}\\) as a mixed number.', ['\\(1\\tfrac{2}{9}\\)', '\\(1\\tfrac{1}{5}\\)', '\\(1\\tfrac{2}{10}\\)', '\\(\\tfrac{12}{9}\\)'], '\\(0.\\dot{2} = \\tfrac29\\).', 'rec2frac'],
  ],
  LONG: [
    { q: 'Prove algebraically that \\(0.\\dot{5}\\dot{4} = \\tfrac{6}{11}\\).', m: 2, s: ['M1 for \\(100x = 54.5454\\dots\\) and \\(x = 0.5454\\dots\\) and subtracting (99x = 54).', 'A1 for \\(\\tfrac{54}{99} = \\tfrac{6}{11}\\) with full working shown.'], link: ['rec2frac', 'See two repeating digits again'] },
    { q: 'Prove algebraically that \\(0.4\\dot{3}\\) can be written as \\(\\tfrac{13}{30}\\).', m: 2, s: ['M1 for \\(100x = 43.33\\dots\\) and \\(10x = 4.33\\dots\\) and subtracting (90x = 39).', 'A1 for \\(\\tfrac{39}{90} = \\tfrac{13}{30}\\) with full working shown.'], link: ['rec2frac', 'See a start before the repeat again'] },
    { q: 'Write \\(0.\\dot{1}\\dot{5} + 0.\\dot{2}\\) as a fraction in its simplest form.', m: 3, s: ['M1 for \\(0.\\dot{1}\\dot{5} = \\tfrac{15}{99}\\) (or \\(\\tfrac{5}{33}\\)).', 'M1 for \\(0.\\dot{2} = \\tfrac{2}{9}\\) and adding with a common denominator, e.g. \\(\\tfrac{15}{99} + \\tfrac{22}{99}\\).', 'A1 for \\(\\tfrac{37}{99}\\).'], link: ['rec2frac', 'See recurring decimals to fractions again'] },
  ],
});
