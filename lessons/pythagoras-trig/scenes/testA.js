FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['pythagoras', 'The hypotenuse is…', ['the side opposite the right angle', 'the shortest side', 'the base', 'the side next to the right angle'], 'Opposite the right angle; the longest side.', 'pythagoras'],
    ['pythagoras', 'Shorter sides 5 cm and 12 cm. The hypotenuse is…', ['13 cm', '17 cm', '7 cm', '169 cm'], '\\(\\sqrt{25 + 144}\\).', 'pythagoras'],
    ['pythagoras', 'Hypotenuse 10 cm, one side 6 cm. The other side is…', ['8 cm', '11.7 cm', '4 cm', '64 cm'], '\\(\\sqrt{100 - 36}\\).', 'pythagoras'],
    ['pythagoras', 'Shorter sides 2 cm and 3 cm. The hypotenuse is…', ['\\(\\sqrt{13}\\) cm', '5 cm', '\\(\\sqrt{5}\\) cm', '13 cm'], '\\(4 + 9 = 13\\).', 'pythagoras'],
    ['pythapps', 'The distance between \\((0, 0)\\) and \\((6, 8)\\) is…', ['10', '14', '48', '7'], '\\(\\sqrt{36 + 64}\\).', 'pythapps'],
    ['pythapps', 'A square has sides of 5 cm. Its diagonal is…', ['7.07 cm', '10 cm', '25 cm', '5 cm'], '\\(\\sqrt{50}\\).', 'pythapps'],
    ['pythapps', 'Which set of sides makes a right-angled triangle?', ['9, 12, 15', '4, 5, 6', '6, 7, 9', '2, 3, 4'], '\\(81 + 144 = 225\\).', 'pythapps'],
    ['pythapps', 'A 6.5 m ladder has its foot 2.5 m from a wall. It reaches up the wall…', ['6 m', '7 m', '4 m', '9 m'], '\\(\\sqrt{42.25 - 6.25} = 6\\).', 'pythapps'],
  ],
  LONG: [
    { q: '\\(A\\) is the point \\((-2, 3)\\) and \\(B\\) is the point \\((6, -3)\\). Work out the length of \\(AB\\).', m: 3, s: ['M1 for differences 8 and 6.', 'M1 for \\(\\sqrt{8^2 + 6^2}\\).', 'A1 for 10.'], link: ['pythapps', 'See distance between points again'] },
    { q: 'An isosceles triangle has two sides of 9 cm and a base of 10 cm. Work out its area. Give your answer to 3 significant figures.', m: 4, s: ['M1 for half the base, 5 cm.', 'M1 for height \\(\\sqrt{81 - 25} = \\sqrt{56}\\).', 'M1 for \\(\\frac12 \\times 10 \\times \\sqrt{56}\\).', 'A1 for \\(37.4\\ \\text{cm}^2\\).'], link: ['pythapps', 'See isosceles triangles again'] },
    { q: 'A ship sails 7 km due north, then 4 km due east. How far is it from its starting point? Give your answer to 1 decimal place.', m: 3, s: ['M1 for a right-angled triangle with sides 7 and 4.', 'M1 for \\(\\sqrt{49 + 16}\\).', 'A1 for 8.1 km.'], link: ['pythagoras', "See Pythagoras' theorem again"] },
  ],
});
