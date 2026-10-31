FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['obtuse', '\\(\\sin 150^\\circ =\\)', ['\\(0.5\\)', '\\(-0.5\\)', '\\(0.866\\)', '\\(-0.866\\)'], '\\(\\sin 30^\\circ\\).', 'obtuse'],
    ['obtuse', 'Which angle has \\(\\cos\\theta < 0\\)?', ['\\(110^\\circ\\)', '\\(70^\\circ\\)', '\\(20^\\circ\\)', '\\(89^\\circ\\)'], 'Obtuse angles have negative cosines.', 'obtuse'],
    ['obtuse', '\\(\\sin\\theta = 0.8\\), \\(\\theta\\) obtuse. \\(\\theta \\approx\\)', ['\\(126.9^\\circ\\)', '\\(53.1^\\circ\\)', '\\(143.1^\\circ\\)', '\\(36.9^\\circ\\)'], '\\(180 - 53.1\\).', 'obtuse'],
    ['sinerule', 'The sine rule needs…', ['a side and its opposite angle', 'all three sides', 'a right angle', 'two sides and the included angle'], 'An opposite pair.', 'sinerule'],
    ['sinerule', '\\(A = 30^\\circ\\), \\(a = 6\\), \\(B = 45^\\circ\\). \\(b \\approx\\)', ['8.49', '4.24', '12', '3'], '\\(6 \\sin 45 \\div \\sin 30\\).', 'sinerule'],
    ['cosinerule', '\\(b = 3\\), \\(c = 5\\), \\(A = 120^\\circ\\). \\(a =\\)', ['7', '4.36', '8', '5.83'], '\\(9 + 25 + 15 = 49\\).', 'cosinerule'],
    ['cosinerule', 'Three sides are known. To find an angle use…', ['the cosine rule', 'the sine rule', 'SOHCAHTOA', '\\(\\tfrac12 ab \\sin C\\)'], 'Cosine rule.', 'cosinerule'],
    ['cosinerule', 'In \\(a^2 = b^2 + c^2 - 2bc\\cos A\\), angle \\(A\\) is…', ['between sides \\(b\\) and \\(c\\)', 'opposite side \\(b\\)', 'always acute', 'a right angle'], 'The included angle, opposite \\(a\\).', 'cosinerule'],
  ],
  LONG: [
    { q: 'In triangle \\(PQR\\), \\(PQ = 11\\) cm, \\(\\angle P = 48^\\circ\\) and \\(\\angle Q = 67^\\circ\\). Work out \\(QR\\), to 3 s.f.', m: 3, s: ['M1 for \\(\\angle R = 65^\\circ\\).', 'M1 for \\(\\frac{QR}{\\sin 48^\\circ} = \\frac{11}{\\sin 65^\\circ}\\).', 'A1 for 9.02 cm.'], link: ['sinerule', 'See the sine rule again'] },
    { q: 'Two boats leave a harbour. One sails 12 km on a bearing of \\(040^\\circ\\), the other 9 km on a bearing of \\(110^\\circ\\). How far apart are they? Give 3 s.f.', m: 3, s: ['M1 for the angle between the courses, \\(70^\\circ\\).', 'M1 for \\(d^2 = 12^2 + 9^2 - 2 \\times 12 \\times 9 \\cos 70^\\circ\\).', 'A1 for 12.3 km.'], link: ['cosinerule', 'See the cosine rule again'] },
    { q: 'A triangle has sides 6 cm, 9 cm and 13 cm. Work out the largest angle, to 1 d.p.', m: 3, s: ['M1 for using the angle opposite 13 cm.', 'M1 for \\(\\cos\\theta = \\frac{36 + 81 - 169}{108}\\).', 'A1 for \\(118.8^\\circ\\).'], link: ['cosinerule', 'See finding an angle again'] },
  ],
});
