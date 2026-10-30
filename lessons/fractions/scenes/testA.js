FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['equivalent', 'Which fraction is equivalent to \\(\\frac{4}{6}\\)?', ['\\(\\frac{10}{15}\\)', '\\(\\frac{5}{7}\\)', '\\(\\frac{6}{8}\\)', '\\(\\frac{8}{10}\\)'], 'Divide by 2 to get \\(\\frac{2}{3}\\), then multiply by 5.', 'equivalent'],
    ['equivalent', 'What is \\(\\frac{45}{60}\\) in its simplest form?', ['\\(\\frac{3}{4}\\)', '\\(\\frac{9}{12}\\)', '\\(\\frac{15}{20}\\)', '\\(\\frac{5}{6}\\)'], 'The HCF of 45 and 60 is 15.', 'equivalent'],
    ['equivalent', '\\(\\frac{7}{8} = \\frac{?}{56}\\)', ['49', '55', '7', '63'], '\\(8 \\times 7 = 56\\) so \\(7 \\times 7 = 49\\).', 'equivalent'],
    ['equivalent', 'To simplify a fraction in one step you divide the top and the bottom by…', ['their highest common factor', 'their lowest common multiple', '2', 'the numerator'], 'The HCF leaves only 1 as a common factor.', 'equivalent'],
    ['mixed', 'Write \\(\\frac{23}{6}\\) as a mixed number.', ['\\(3\\tfrac{5}{6}\\)', '\\(4\\tfrac{1}{6}\\)', '\\(3\\tfrac{1}{6}\\)', '\\(2\\tfrac{3}{6}\\)'], '\\(23 \\div 6 = 3\\) remainder 5.', 'mixed'],
    ['mixed', 'Write \\(5\\tfrac{2}{3}\\) as an improper fraction.', ['\\(\\frac{17}{3}\\)', '\\(\\frac{10}{3}\\)', '\\(\\frac{15}{3}\\)', '\\(\\frac{7}{3}\\)'], '\\(5 \\times 3 + 2 = 17\\).', 'mixed'],
    ['mixed', 'Which is the largest?', ['\\(\\frac{4}{5}\\)', '\\(\\frac{3}{4}\\)', '\\(\\frac{7}{10}\\)', '\\(\\frac{2}{3}\\)'], 'In sixtieths: 48, 45, 42, 40.', 'mixed'],
    ['mixed', 'Which of these is <b>not</b> equal to 2?', ['\\(\\frac{2}{4}\\)', '\\(\\frac{8}{4}\\)', '\\(\\frac{10}{5}\\)', '\\(1\\tfrac{3}{3}\\)'], '\\(\\frac{2}{4} = \\frac{1}{2}\\).', 'mixed'],
  ],
  LONG: [
    { q: 'Write these fractions in order of size. Start with the smallest. \\(\\quad \\frac{5}{8}, \\; \\frac{2}{3}, \\; \\frac{7}{12}, \\; \\frac{3}{4}\\)', m: 2, s: ['M1 for writing all four with a common denominator, e.g. \\(\\frac{15}{24}, \\frac{16}{24}, \\frac{14}{24}, \\frac{18}{24}\\), or converting all to decimals.', 'A1 for \\(\\frac{7}{12}, \\frac{5}{8}, \\frac{2}{3}, \\frac{3}{4}\\).'], link: ['mixed', 'See ordering fractions again'] },
    { q: 'Show that \\(\\frac{36}{84}\\) can be written as \\(\\frac{3}{7}\\).', m: 2, s: ['M1 for dividing top and bottom by a common factor (e.g. 12, or 2 then 2 then 3), or finding HCF = 12.', 'A1 for a complete, clear method that ends in \\(\\frac{3}{7}\\).'], link: ['equivalent', 'See simplifying again'] },
    { q: 'Sami says \\(\\frac{13}{4} = 3\\tfrac{4}{13}\\). Is he right? Explain your answer.', m: 2, s: ['B1 No (with a reason).', 'B1 for a correct explanation, e.g. \\(13 \\div 4 = 3\\) remainder 1, so \\(\\frac{13}{4} = 3\\tfrac{1}{4}\\); the denominator stays 4.'], link: ['mixed', 'See mixed numbers again'] },
  ],
});
