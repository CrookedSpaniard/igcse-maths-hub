FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['triarea', 'Sides 5 cm and 12 cm with \\(30^\\circ\\) between them. Area =', ['15 cm²', '30 cm²', '60 cm²', '26.0 cm²'], '\\(\\tfrac12 \\times 5 \\times 12 \\times 0.5\\).', 'triarea'],
    ['triarea', 'In \\(\\tfrac12 ab\\sin C\\), \\(C\\) is…', ['the angle between \\(a\\) and \\(b\\)', 'opposite \\(a\\)', 'always 90°', 'the smallest angle'], 'Included angle.', 'triarea'],
    ['triarea', 'Sides 7 and 7, angle \\(90^\\circ\\). Area =', ['24.5', '49', '12.25', '14'], '\\(\\tfrac12 \\times 49\\).', 'triarea'],
    ['triarea', 'Area 20 cm², sides 8 cm and 10 cm, acute included angle. The angle is…', ['\\(30^\\circ\\)', '\\(60^\\circ\\)', '\\(14.5^\\circ\\)', '\\(45^\\circ\\)'], '\\(\\sin\\theta = 20 \\div 40 = 0.5\\).', 'triarea'],
    ['threed', 'A cuboid is 2 by 3 by 6. The space diagonal is…', ['7', '11', '\\(\\sqrt{13}\\)', '6.7'], '\\(\\sqrt{4 + 9 + 36}\\).', 'threed'],
    ['threed', 'A cube has edge 5 cm. Its space diagonal is…', ['8.66 cm', '7.07 cm', '15 cm', '25 cm'], '\\(5\\sqrt3\\).', 'threed'],
    ['threed', 'The angle between a line and a plane is measured to…', ['the line’s projection on the plane', 'the nearest edge', 'the vertical', 'the normal'], 'Projection.', 'threed'],
    ['threed', 'Base diagonal 10 cm, height 10 cm. Angle between the space diagonal and the base…', ['\\(45^\\circ\\)', '\\(30^\\circ\\)', '\\(60^\\circ\\)', '\\(35.3^\\circ\\)'], '\\(\\tan^{-1} 1\\).', 'threed'],
  ],
  LONG: [
    { q: 'Triangle \\(ABC\\) has \\(AB = 9\\) cm, \\(BC = 14\\) cm and \\(\\angle ABC = 118^\\circ\\). Work out its area, to 3 s.f.', m: 2, s: ['M1 for \\(\\tfrac12 \\times 9 \\times 14 \\times \\sin 118^\\circ\\).', 'A1 for \\(55.6\\ \\text{cm}^2\\).'], link: ['triarea', 'See ½ab sin C again'] },
    { q: 'A cuboid \\(ABCDEFGH\\) has \\(AB = 12\\) cm, \\(BC = 5\\) cm and \\(CG = 8\\) cm. Work out (a) the length of \\(AG\\), (b) the angle between \\(AG\\) and the base \\(ABCD\\). Give your answers to 3 s.f.', m: 5, s: ['M1 for \\(AC = \\sqrt{144 + 25} = 13\\).', 'M1 for \\(AG = \\sqrt{13^2 + 8^2}\\).', 'A1 (a) 15.3 cm.', 'M1 for \\(\\tan\\theta = \\frac{8}{13}\\).', 'A1 (b) \\(31.6^\\circ\\).'], link: ['threed', 'See 3D problems again'] },
    { q: 'A square-based pyramid has a base of side 6 cm. Its top is 9 cm vertically above the centre of the base. Work out the angle between a sloping edge and the base, to 1 d.p.', m: 3, s: ['M1 for half the diagonal \\(= \\frac{\\sqrt{72}}{2} = 4.24…\\).', 'M1 for \\(\\tan\\theta = \\frac{9}{4.24…}\\).', 'A1 for \\(64.8^\\circ\\).'], link: ['threed', 'See the angle with a plane again'] },
  ],
});
