FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['notation', 'Which of these is a vector?', ['A velocity of 12 m/s due east', 'A speed of 12 m/s', 'A mass of 12 kg', 'A time of 12 s'], 'Only the velocity has a direction.', 'notation'],
    ['notation', 'A vector goes 2 left and 6 down. As a column vector it is…', [`\\(${FD.cv(-2, -6)}\\)`, `\\(${FD.cv(2, 6)}\\)`, `\\(${FD.cv(-6, -2)}\\)`, `\\(${FD.cv(2, -6)}\\)`], 'Left and down are negative; across goes on top.', 'notation'],
    ['notation', '\\(A\\) is \\((3, -1)\\) and \\(B\\) is \\((7, 4)\\). \\(\\overrightarrow{AB}\\) is…', [`\\(${FD.cv(4, 5)}\\)`, `\\(${FD.cv(-4, -5)}\\)`, `\\(${FD.cv(10, 3)}\\)`, `\\(${FD.cv(4, 3)}\\)`], '\\(B - A\\).', 'notation'],
    ['notation', '\\(\\overrightarrow{PQ} = \\mathbf{p}\\). Which is \\(\\overrightarrow{QP}\\)?', ['\\(-\\mathbf{p}\\)', '\\(\\mathbf{p}\\)', '\\(2\\mathbf{p}\\)', '\\(\\tfrac12\\mathbf{p}\\)'], 'The opposite direction.', 'notation'],
    ['scalar', `\\(3${FD.cv(4, -2)}\\) =`, [`\\(${FD.cv(12, -6)}\\)`, `\\(${FD.cv(7, 1)}\\)`, `\\(${FD.cv(12, -2)}\\)`, `\\(${FD.cv(4, -6)}\\)`], 'Multiply both numbers.', 'scalar'],
    ['scalar', `Which vector is parallel to \\(${FD.cv(3, -1)}\\)?`, [`\\(${FD.cv(-6, 2)}\\)`, `\\(${FD.cv(6, 2)}\\)`, `\\(${FD.cv(-1, 3)}\\)`, `\\(${FD.cv(4, 0)}\\)`], `\\(${FD.cv(-6, 2)} = -2${FD.cv(3, -1)}\\).`, 'scalar'],
    ['scalar', `\\(${FD.cv(8, -20)} = k${FD.cv(2, -5)}\\). \\(k\\) =`, ['4', '−4', '6', '\\(\\tfrac14\\)'], '\\(8 \\div 2 = 4\\).', 'scalar'],
    ['modulus', `\\(\\left|${FD.cv(9, 12)}\\right|\\) =`, ['15', '21', '\\(\\sqrt{21}\\)', '225'], '\\(\\sqrt{81 + 144} = \\sqrt{225}\\).', 'modulus'],
    ['modulus', `The modulus of \\(${FD.cv(-1, 3)}\\) is…`, ['\\(\\sqrt{10}\\)', '\\(\\sqrt{8}\\)', '2', '4'], '\\(\\sqrt{1 + 9}\\).', 'modulus'],
  ],
  LONG: [
    { q: `\\(\\mathbf{a} = ${FD.cv(5, -3)}\\). (a) Write down \\(-2\\mathbf{a}\\) as a column vector. (b) Find \\(|\\mathbf{a}|\\), giving your answer to 3 significant figures.`, m: 3, s: [`B1 for \\(${FD.cv(-10, 6)}\\).`, 'M1 for \\(\\sqrt{5^2 + (-3)^2}\\) or \\(\\sqrt{34}\\).', 'A1 for 5.83.'], link: ['modulus', 'See the modulus again'] },
    { q: '\\(P\\) is the point \\((-2, 5)\\) and \\(Q\\) is the point \\((4, -3)\\). (a) Write \\(\\overrightarrow{PQ}\\) as a column vector. (b) Find the length of \\(PQ\\).', m: 3, s: [`B1 for \\(${FD.cv(6, -8)}\\).`, 'M1 for \\(\\sqrt{6^2 + 8^2}\\).', 'A1 for 10.'], link: ['notation', 'See column vectors again'] },
    { q: `\\(\\mathbf{u} = ${FD.cv(2, 7)}\\) and \\(\\mathbf{v} = ${FD.cv(-6, -21)}\\). Show that \\(\\mathbf{u}\\) and \\(\\mathbf{v}\\) are parallel.`, m: 2, s: [`M1 for writing \\(\\mathbf{v} = -3\\mathbf{u}\\) or showing \\(-6 \\div 2 = -21 \\div 7 = -3\\).`, 'A1 for the conclusion: \\(\\mathbf{v}\\) is a multiple of \\(\\mathbf{u}\\), so they are parallel.'], link: ['scalar', 'See scalar multiples again'] },
  ],
});
