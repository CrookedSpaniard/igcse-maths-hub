FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['simplify', 'Simplify 45 : 60', ['3 : 4', '9 : 12', '4 : 3', '15 : 20'], 'HCF 15.', 'simplify'],
    ['simplify', 'Simplify 1.5 kg : 600 g', ['5 : 2', '15 : 6', '1 : 400', '2 : 5'], '1500 : 600.', 'simplify'],
    ['simplify', 'Apples : pears = 5 : 3. What fraction are pears?', ['\\(\\tfrac38\\)', '\\(\\tfrac35\\)', '\\(\\tfrac53\\)', '\\(\\tfrac58\\)'], '8 parts, 3 are pears.', 'simplify'],
    ['simplify', 'Write 4 : 18 in the form 1 : n.', ['1 : 4.5', '1 : 14', '2 : 9', '1 : 0.22'], '\\(18 \\div 4\\).', 'simplify'],
    ['share', 'Share £40 in the ratio 3 : 5. The smaller share is…', ['£15', '£25', '£8', '£24'], '\\(40 \\div 8 = 5\\), \\(3 \\times 5\\).', 'share'],
    ['share', 'Share 90 in the ratio 2 : 3 : 4. The largest share is…', ['40', '30', '45', '20'], '\\(90 \\div 9 = 10\\).', 'share'],
    ['share', 'Squash : water = 1 : 6. How much water goes with 50 ml of squash?', ['300 ml', '350 ml', '56 ml', '8.3 ml'], '\\(6 \\times 50\\).', 'share'],
    ['share', 'Two shares are in the ratio 4 : 7. The difference is 18. What is the smaller share?', ['24', '42', '6', '72'], '3 parts = 18, 1 part = 6.', 'share'],
  ],
  LONG: [
    { q: 'Tom, Ella and Raj share £720 in the ratio 2 : 3 : 7. How much more does Raj get than Tom?', m: 3, s: ['M1 for \\(720 \\div 12\\) (= 60).', 'M1 for \\(7 \\times 60\\) and \\(2 \\times 60\\), or \\(5 \\times 60\\).', 'A1 for £300.'], link: ['share', 'See sharing in a ratio again'] },
    { q: 'In a school the ratio of boys to girls is 5 : 4. There are 120 more boys than girls. How many students are there in the school?', m: 3, s: ['M1 for 1 part = 120.', 'M1 for 9 × 120.', 'A1 for 1080.'], link: ['share', 'See when you know the difference again'] },
    { q: 'Concrete is made from cement, sand and gravel in the ratio 1 : 2 : 4 by mass. Ali has 15 kg of cement, 25 kg of sand and 70 kg of gravel. What is the greatest mass of concrete he can make?', m: 3, s: ['M1 for finding how many “parts” each ingredient allows: 15, 12.5, 17.5.', 'M1 for using the sand: 12.5 kg per part, total 7 parts.', 'A1 for 87.5 kg.'], link: ['share', 'See when you know one share again'] },
  ],
});
