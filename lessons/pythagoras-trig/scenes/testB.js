FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['sohcahtoa', 'You know the opposite side and want the adjacent side. Use…', ['tan', 'sin', 'cos', "Pythagoras' theorem"], 'TOA.', 'sohcahtoa'],
    ['sohcahtoa', '\\(\\cos\\theta =\\)', ['\\(\\frac{\\text{adj}}{\\text{hyp}}\\)', '\\(\\frac{\\text{opp}}{\\text{hyp}}\\)', '\\(\\frac{\\text{opp}}{\\text{adj}}\\)', '\\(\\frac{\\text{hyp}}{\\text{adj}}\\)'], 'CAH.', 'sohcahtoa'],
    ['sohcahtoa', 'Hypotenuse 20 cm, angle \\(30^\\circ\\). The opposite side is…', ['10 cm', '17.3 cm', '11.5 cm', '40 cm'], '\\(20 \\sin 30\\).', 'sohcahtoa'],
    ['sohcahtoa', 'Adjacent 12 cm, angle \\(60^\\circ\\). The hypotenuse is…', ['24 cm', '6 cm', '13.9 cm', '20.8 cm'], '\\(12 \\div \\cos 60\\).', 'sohcahtoa'],
    ['trigangles', 'Opposite 4 cm, adjacent 4 cm. The angle is…', ['\\(45^\\circ\\)', '\\(30^\\circ\\)', '\\(60^\\circ\\)', '\\(90^\\circ\\)'], '\\(\\tan^{-1} 1\\).', 'trigangles'],
    ['trigangles', 'Opposite 3 cm, hypotenuse 6 cm. The angle is…', ['\\(30^\\circ\\)', '\\(60^\\circ\\)', '\\(26.6^\\circ\\)', '\\(63.4^\\circ\\)'], '\\(\\sin^{-1} 0.5\\).', 'trigangles'],
    ['trigangles', 'Adjacent 9 cm, hypotenuse 15 cm. The angle is…', ['\\(53.1^\\circ\\)', '\\(36.9^\\circ\\)', '\\(31.0^\\circ\\)', '\\(59.0^\\circ\\)'], '\\(\\cos^{-1}(0.6)\\).', 'trigangles'],
    ['trigangles', 'To find an angle from \\(\\tan\\theta = 0.8\\) you press…', ['\\(\\tan^{-1}\\)', '\\(\\tan\\)', '\\(\\sin^{-1}\\)', '\\(1/\\tan\\)'], 'Inverse tan.', 'trigangles'],
  ],
  LONG: [
    { q: 'A ladder 7 m long leans against a wall and makes an angle of \\(72^\\circ\\) with the ground. How high up the wall does it reach? Give your answer to 3 s.f.', m: 3, s: ['M1 for using sin (opposite and hypotenuse).', 'M1 for \\(7 \\sin 72^\\circ\\).', 'A1 for 6.66 m.'], link: ['sohcahtoa', 'See finding a side again'] },
    { q: 'In triangle \\(ABC\\), \\(\\angle B = 90^\\circ\\), \\(AB = 8.4\\) cm and \\(BC = 5.2\\) cm. Work out \\(\\angle BAC\\) to 1 d.p.', m: 3, s: ['M1 for \\(\\tan\\angle BAC = \\frac{5.2}{8.4}\\).', 'M1 for \\(\\tan^{-1}\\).', 'A1 for \\(31.8^\\circ\\).'], link: ['trigangles', 'See finding an angle again'] },
    { q: 'A rectangle is 12 cm long. Its diagonal makes an angle of \\(28^\\circ\\) with the longer side. Work out the length of the diagonal, to 3 s.f.', m: 3, s: ['M1 for cos with the adjacent side 12.', 'M1 for \\(12 \\div \\cos 28^\\circ\\).', 'A1 for 13.6 cm.'], link: ['sohcahtoa', 'See a side underneath again'] },
  ],
});
