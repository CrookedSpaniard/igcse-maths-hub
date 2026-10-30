FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['addsub', '\\(\\frac{1}{4} + \\frac{2}{3} =\\)', ['\\(\\frac{11}{12}\\)', '\\(\\frac{3}{7}\\)', '\\(\\frac{3}{12}\\)', '\\(\\frac{2}{12}\\)'], '\\(\\frac{3}{12} + \\frac{8}{12}\\).', 'addsub'],
    ['addsub', '\\(\\frac{5}{6} - \\frac{3}{8} =\\)', ['\\(\\frac{11}{24}\\)', '\\(\\frac{2}{2}\\)', '\\(\\frac{1}{12}\\)', '\\(\\frac{2}{14}\\)'], '\\(\\frac{20}{24} - \\frac{9}{24}\\).', 'addsub'],
    ['addsub', '\\(2\\tfrac{1}{2} + 1\\tfrac{3}{5} =\\)', ['\\(4\\tfrac{1}{10}\\)', '\\(3\\tfrac{4}{7}\\)', '\\(3\\tfrac{1}{10}\\)', '\\(4\\tfrac{4}{10}\\)'], '\\(\\frac{25}{10} + \\frac{16}{10} = \\frac{41}{10}\\).', 'addsub'],
    ['muldiv', '\\(\\frac{3}{5} \\times \\frac{10}{21} =\\)', ['\\(\\frac{2}{7}\\)', '\\(\\frac{13}{26}\\)', '\\(\\frac{30}{26}\\)', '\\(\\frac{7}{2}\\)'], '\\(\\frac{30}{105} = \\frac{2}{7}\\).', 'muldiv'],
    ['muldiv', '\\(\\frac{2}{3} \\div \\frac{4}{9} =\\)', ['\\(1\\tfrac{1}{2}\\)', '\\(\\frac{8}{27}\\)', '\\(\\frac{2}{3}\\)', '\\(\\frac{6}{12}\\)'], '\\(\\frac{2}{3} \\times \\frac{9}{4} = \\frac{18}{12}\\).', 'muldiv'],
    ['muldiv', 'What is the reciprocal of 5?', ['\\(\\frac{1}{5}\\)', '\\(-5\\)', '\\(\\frac{5}{1}\\)', '0.5'], '\\(5 = \\frac{5}{1}\\), flipped is \\(\\frac{1}{5}\\).', 'muldiv'],
    ['amounts', 'Find \\(\\frac{4}{9}\\) of 63.', ['28', '36', '7', '14'], '\\(63 \\div 9 = 7\\), \\(7 \\times 4 = 28\\).', 'amounts'],
    ['amounts', '24 out of 40 students are girls. What fraction are boys?', ['\\(\\frac{2}{5}\\)', '\\(\\frac{3}{5}\\)', '\\(\\frac{16}{24}\\)', '\\(\\frac{1}{4}\\)'], '16 boys: \\(\\frac{16}{40} = \\frac{2}{5}\\).', 'amounts'],
  ],
  LONG: [
    { q: 'Show that \\(1\\tfrac{2}{3} + 2\\tfrac{3}{4} = 4\\tfrac{5}{12}\\).', m: 3, s: ['M1 for improper fractions \\(\\frac{5}{3}\\) and \\(\\frac{11}{4}\\), or adding the whole numbers separately (3).', 'M1 for both fractions with a common denominator, e.g. \\(\\frac{20}{12} + \\frac{33}{12}\\) or \\(\\frac{8}{12} + \\frac{9}{12}\\).', 'A1 for a fully correct method ending in \\(4\\tfrac{5}{12}\\) (\\(\\frac{53}{12}\\)).'], link: ['addsub', 'See adding fractions again'] },
    { q: 'Show that \\(2\\tfrac{1}{4} \\div 1\\tfrac{4}{5} = 1\\tfrac{1}{4}\\).', m: 3, s: ['M1 for \\(\\frac{9}{4}\\) and \\(\\frac{9}{5}\\).', 'M1 for \\(\\frac{9}{4} \\times \\frac{5}{9}\\) (keep, change, flip).', 'A1 for \\(\\frac{45}{36} = \\frac{5}{4} = 1\\tfrac{1}{4}\\) with all working shown.'], link: ['muldiv', 'See dividing fractions again'] },
    { q: 'Maria earns £1 800 a month. She spends \\(\\frac{1}{3}\\) of it on rent and \\(\\frac{2}{5}\\) of what is left on food. How much money does she have left for everything else?', m: 4, s: ['M1 for \\(\\frac{1}{3} \\times 1800 = 600\\) (rent).', 'M1 for \\(1800 - 600 = 1200\\).', 'M1 for \\(\\frac{2}{5} \\times 1200 = 480\\) (food).', 'A1 for £720.'], link: ['amounts', 'See fractions of amounts again'] },
  ],
});
