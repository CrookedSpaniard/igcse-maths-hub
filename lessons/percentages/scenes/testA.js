FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['meaning', 'Write 45% as a fraction in its simplest form.', ['\\(\\tfrac{9}{20}\\)', '\\(\\tfrac{45}{10}\\)', '\\(\\tfrac{4}{5}\\)', '\\(\\tfrac{1}{45}\\)'], '\\(\\tfrac{45}{100} = \\tfrac{9}{20}\\).', 'meaning'],
    ['meaning', 'Write 3% as a decimal.', ['0.03', '0.3', '3.0', '0.003'], '\\(3 \\div 100\\).', 'meaning'],
    ['meaning', 'Write \\(\\tfrac{7}{8}\\) as a percentage.', ['87.5%', '78%', '0.875%', '8.75%'], '\\(0.875 \\times 100\\).', 'meaning'],
    ['meaning', 'Which is the smallest?', ['0.31', '32%', '\\(\\tfrac{1}{3}\\)', '\\(\\tfrac{8}{25}\\)'], '31%, 32%, 33.3%, 32%.', 'meaning'],
    ['ofamount', 'Find 25% of 84.', ['21', '42', '25', '33.6'], 'A quarter of 84.', 'ofamount'],
    ['ofamount', 'Find 12% of £350.', ['£42', '£4.20', '£35', '£308'], '\\(0.12 \\times 350\\).', 'ofamount'],
    ['ofamount', 'What is 18 as a percentage of 60?', ['30%', '18%', '42%', '3.3%'], '\\(\\tfrac{18}{60} \\times 100\\).', 'ofamount'],
    ['ofamount', 'Which calculation finds 6% of 250?', ['\\(0.06 \\times 250\\)', '\\(0.6 \\times 250\\)', '\\(250 \\div 6\\)', '\\(6 \\times 250\\)'], 'The multiplier for 6% is 0.06.', 'ofamount'],
  ],
  LONG: [
    { q: 'There are 240 students in Year 10. 35% of them walk to school. \\(\\tfrac{3}{8}\\) of them come by bus. The rest come by car. How many students come by car?', m: 4, s: ['M1 for \\(0.35 \\times 240\\) (= 84).', 'M1 for \\(\\tfrac38 \\times 240\\) (= 90).', 'M1 for \\(240 - 84 - 90\\).', 'A1 for 66.'], link: ['ofamount', 'See percentages of amounts again'] },
    { q: 'Mia scored 34 out of 40 in maths and 41 out of 50 in science. In which test did she do better? Show your working.', m: 3, s: ['M1 for \\(\\tfrac{34}{40} \\times 100\\) or 85%.', 'M1 for \\(\\tfrac{41}{50} \\times 100\\) or 82%.', 'A1 for maths, with both percentages.'], link: ['ofamount', 'See one number as a percentage of another again'] },
    { q: 'Write these in order of size, smallest first: 0.6, 58%, \\(\\tfrac{3}{5}\\), \\(\\tfrac{5}{8}\\), 0.59.', m: 2, s: ['M1 for converting all to the same form, e.g. 60%, 58%, 60%, 62.5%, 59%.', 'A1 for 58%, 0.59, 0.6 = \\(\\tfrac35\\), \\(\\tfrac58\\) (0.6 and \\(\\tfrac35\\) in either order).'], link: ['meaning', 'See comparing again'] },
  ],
});
