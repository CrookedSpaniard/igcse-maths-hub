FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['complete-square', 'Write \\(x^2 + 10x + 3\\) in the form \\((x + p)^2 + q\\).', ['\\((x + 5)^2 - 22\\)', '\\((x + 5)^2 + 3\\)', '\\((x + 10)^2 - 97\\)', '\\((x + 5)^2 - 25\\)'], '\\((x + 5)^2 - 25 + 3\\).', 'complete-square'],
    ['complete-square', 'The turning point of \\(y = (x + 3)^2 - 4\\) is…', ['\\((-3, -4)\\)', '\\((3, -4)\\)', '\\((-3, 4)\\)', '\\((3, 4)\\)'], 'Minimum when \\(x = -3\\).', 'complete-square'],
    ['complete-square', 'Solve \\((x - 2)^2 = 5\\).', ['\\(x = 2 \\pm \\sqrt5\\)', '\\(x = 7\\)', '\\(x = -2 \\pm \\sqrt5\\)', '\\(x = \\pm\\sqrt7\\)'], 'Square root both sides.', 'complete-square'],
    ['formula', 'For \\(2x^2 - 5x + 1 = 0\\), what is \\(b^2 - 4ac\\)?', ['17', '33', '23', '−17'], '\\(25 - 8\\).', 'formula'],
    ['formula', 'How many real roots does \\(x^2 + x + 3 = 0\\) have?', ['None', 'One', 'Two', 'Three'], '\\(1 - 12 < 0\\).', 'formula'],
    ['formula', 'Solve \\(x^2 - 4x + 1 = 0\\) to 2 d.p.', ['3.73 and 0.27', '4.24 and −0.24', '2 and 2', '3.41 and 0.59'], '\\(\\frac{4 \\pm \\sqrt{12}}{2}\\).', 'formula'],
    ['quad-context', 'A rectangle is \\(x\\) by \\(x + 2\\) and has area 48. Which equation?', ['\\(x^2 + 2x - 48 = 0\\)', '\\(x^2 + 2 = 48\\)', '\\(2x + 2 = 48\\)', '\\(x^2 + 2x + 48 = 0\\)'], '\\(x(x + 2) = 48\\).', 'quad-context'],
    ['lin-quad', 'Where does \\(y = x + 6\\) meet \\(y = x^2\\)?', ['\\((3, 9)\\) and \\((-2, 4)\\)', '\\((3, 9)\\) only', '\\((-3, 9)\\) and \\((2, 4)\\)', '\\((6, 36)\\)'], '\\(x^2 - x - 6 = 0\\).', 'lin-quad'],
  ],
  LONG: [
    { q: '(a) Write \\(x^2 - 6x + 4\\) in the form \\((x + p)^2 + q\\). (b) Hence solve \\(x^2 - 6x + 4 = 0\\), giving your answers in surd form.', m: 4, s: ['M1 for \\((x - 3)^2\\).', 'A1 for \\((x - 3)^2 - 5\\).', 'M1 for \\(x - 3 = \\pm\\sqrt5\\).', 'A1 for \\(x = 3 \\pm \\sqrt5\\).'], link: ['complete-square', 'See completing the square again'] },
    { q: 'The sides of a right-angled triangle are \\(x\\), \\(x + 7\\) and \\(x + 8\\) cm. Show that \\(x^2 - 2x - 15 = 0\\) and find the length of the shortest side.', m: 4, s: ['M1 for \\(x^2 + (x + 7)^2 = (x + 8)^2\\).', 'A1 for expanding to \\(x^2 - 2x - 15 = 0\\).', 'M1 for \\((x - 5)(x + 3) = 0\\).', 'A1 for 5 cm (rejecting \\(-3\\)).'], link: ['quad-context', 'See quadratics in context again'] },
    { q: 'Solve the simultaneous equations \\(y = 2x - 1\\) and \\(x^2 + y^2 = 34\\).', m: 5, s: ['M1 for substituting: \\(x^2 + (2x - 1)^2 = 34\\).', 'A1 for \\(5x^2 - 4x - 33 = 0\\).', 'M1 for solving the quadratic, e.g. \\((5x + 11)(x - 3) = 0\\).', 'A1 for \\(x = 3, y = 5\\).', 'A1 for \\(x = -2.2, y = -5.4\\).'], link: ['lin-quad', 'See a line and a curve again'] },
  ],
});
