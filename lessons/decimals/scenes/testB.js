FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['convert', 'Write 0.35 as a fraction in its simplest form.', ['\\(\\tfrac{7}{20}\\)', '\\(\\tfrac{35}{10}\\)', '\\(\\tfrac{3}{5}\\)', '\\(\\tfrac{7}{2}\\)'], '\\(\\tfrac{35}{100} = \\tfrac{7}{20}\\).', 'convert'],
    ['convert', 'Write \\(\\tfrac{3}{25}\\) as a decimal.', ['0.12', '0.325', '0.3', '1.2'], '\\(\\tfrac{3}{25} = \\tfrac{12}{100}\\).', 'convert'],
    ['convert', 'Write \\(\\tfrac{7}{8}\\) as a decimal.', ['0.875', '0.78', '0.87', '1.14'], '\\(7 \\div 8 = 0.875\\).', 'convert'],
    ['convert', 'Write 0.085 as a percentage.', ['8.5%', '85%', '0.85%', '0.085%'], '\\(0.085 \\times 100 = 8.5\\).', 'convert'],
    ['convert', 'Write \\(\\tfrac{9}{25}\\) as a percentage.', ['36%', '9.25%', '25%', '0.36%'], '\\(\\tfrac{9}{25} = \\tfrac{36}{100}\\).', 'convert'],
    ['convert', 'Which is the smallest?', ['\\(\\tfrac{2}{7}\\)', '0.3', '\\(\\tfrac{1}{3}\\)', '0.29'], '\\(\\tfrac27 \\approx 0.286\\).', 'convert'],
    ['recurring', 'Which fraction gives a recurring decimal?', ['\\(\\tfrac{5}{12}\\)', '\\(\\tfrac{5}{16}\\)', '\\(\\tfrac{3}{20}\\)', '\\(\\tfrac{9}{12}\\)'], '\\(12 = 2^2 \\times 3\\). (\\(\\tfrac{9}{12} = \\tfrac34\\) terminates.)', 'recurring'],
    ['recurring', 'Write \\(\\tfrac{2}{9}\\) as a decimal.', ['\\(0.\\dot{2}\\)', '\\(0.\\dot{2}\\dot{9}\\)', '\\(0.29\\)', '\\(0.\\dot{4}\\dot{5}\\)'], '\\(2 \\div 9 = 0.222\\dots\\)', 'recurring'],
    ['recurring', 'What is \\(0.\\dot{6}\\dot{3}\\) written out?', ['0.636363…', '0.63333…', '0.6363', '0.66333…'], 'The block 63 repeats.', 'recurring'],
    ['recurring', 'What is the 20th digit after the point in \\(\\tfrac{1}{7} = 0.\\dot{1}4285\\dot{7}\\)?', ['4', '1', '2', '8'], 'Block of 6: \\(20 = 3 \\times 6 + 2\\), so the 2nd digit of the block.', 'recurring'],
  ],
  LONG: [
    { q: 'Write \\(\\tfrac{5}{8}\\), 0.6, \\(\\tfrac{3}{5}\\), \\(\\tfrac{7}{11}\\) and 0.62 in order of size, smallest first. Show your working.', m: 3, s: ['M1 for converting at least three of the fractions to decimals: 0.625, 0.6, \\(0.\\dot{6}\\dot{3}\\).', 'M1 for noticing \\(\\tfrac35 = 0.6\\).', 'A1 for 0.6 = \\(\\tfrac35\\), 0.62, \\(\\tfrac58\\), \\(\\tfrac{7}{11}\\).'], link: ['convert', 'See ordering fractions and decimals again'] },
    { q: 'Explain how you can tell, without dividing, that \\(\\tfrac{21}{70}\\) is a terminating decimal.', m: 2, s: ['M1 for simplifying: \\(\\tfrac{21}{70} = \\tfrac{3}{10}\\).', 'A1 for explaining the denominator 10 = 2 × 5 has only 2 and 5 as prime factors (so it is 0.3).'], link: ['recurring', 'See which fractions terminate again'] },
    { q: 'Use short division to write \\(\\tfrac{4}{11}\\) as a decimal. Give your answer in dot notation.', m: 2, s: ['M1 for a division showing the remainders 4, 7, 4, … repeating (or digits 3, 6, 3, 6).', 'A1 for \\(0.\\dot{3}\\dot{6}\\).'], link: ['recurring', 'See dot notation again'] },
  ],
});
