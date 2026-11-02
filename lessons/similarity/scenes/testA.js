FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['similar', 'A 5 cm side becomes 20 cm in a similar shape. The scale factor is…', ['4', '15', '0.25', '100'], '\\(20 \\div 5\\).', 'similar'],
    ['similar', 'Two shapes are similar with scale factor 3. An angle of \\(40^\\circ\\) in the small shape becomes…', ['\\(40^\\circ\\)', '\\(120^\\circ\\)', '\\(13.3^\\circ\\)', '\\(43^\\circ\\)'], 'Angles do not change.', 'similar'],
    ['similar', 'Which pair of rectangles is similar?', ['3 by 5 and 6 by 10', '3 by 5 and 5 by 7', '2 by 4 and 4 by 8.5', '1 by 2 and 3 by 4'], 'Both sides × 2.', 'similar'],
    ['similar', 'Shapes A and B are similar. 8 cm on A matches 12 cm on B. 10 cm on A matches…', ['15 cm', '14 cm', '6.7 cm', '120 cm'], '\\(k = 1.5\\).', 'similar'],
    ['simtri', '\\(DE \\parallel BC\\), \\(AD = 2\\), \\(DB = 4\\), \\(DE = 3\\). \\(BC = \\)', ['9', '6', '12', '4.5'], '\\(k = 6 \\div 2 = 3\\).', 'simtri'],
    ['simtri', '\\(DE \\parallel BC\\), \\(AD = 6\\), \\(AB = 15\\), \\(BC = 10\\). \\(DE = \\)', ['4', '25', '6.7', '9'], '\\(k = 2.5\\); \\(10 \\div 2.5\\).', 'simtri'],
    ['simtri', 'Triangles with the same three angles are…', ['similar', 'congruent', 'always isosceles', 'the same area'], 'Same angles: similar.', 'simtri'],
    ['simtri', '\\(DE \\parallel BC\\), \\(AE = 5\\), \\(AC = 8\\). The scale factor from \\(ADE\\) to \\(ABC\\) is…', ['1.6', '0.625', '3', '13'], '\\(8 \\div 5\\).', 'simtri'],
  ],
  LONG: [
    { q: 'In triangle \\(ABC\\), \\(D\\) is on \\(AB\\) and \\(E\\) is on \\(AC\\), with \\(DE\\) parallel to \\(BC\\). \\(AD = 6\\) cm, \\(DB = 3\\) cm, \\(DE = 8\\) cm and \\(AE = 7\\) cm. (a) Work out \\(BC\\). (b) Work out \\(EC\\).', m: 4, s: ['M1 for \\(k = \\frac{9}{6} = 1.5\\).', 'A1 (a) \\(BC = 12\\) cm.', 'M1 for \\(AC = 7 \\times 1.5 = 10.5\\).', 'A1 (b) \\(EC = 3.5\\) cm.'], link: ['simtri', 'See a triangle inside a triangle again'] },
    { q: 'A photograph is \\(15\\) cm wide and \\(10\\) cm tall. It is enlarged so that it is \\(36\\) cm wide. Work out the height of the enlargement.', m: 2, s: ['M1 for \\(k = 36 \\div 15 = 2.4\\).', 'A1 for \\(24\\) cm.'], link: ['similar', 'See the scale factor again'] },
    { q: 'A tree casts a shadow \\(12\\) m long. At the same time a \\(1.5\\) m post casts a shadow \\(2\\) m long. The triangles formed are similar. Work out the height of the tree.', m: 2, s: ['M1 for \\(k = 12 \\div 2 = 6\\) (or \\(\\frac{h}{12} = \\frac{1.5}{2}\\)).', 'A1 for \\(9\\) m.'], link: ['simtri', 'See similar triangles again'] },
  ],
});
