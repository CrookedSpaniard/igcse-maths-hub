FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['cubic-recip', 'Which equation has an S-shaped graph through the origin?', ['\\(y = x^3\\)', '\\(y = x^2\\)', '\\(y = \\frac{1}{x}\\)', '\\(y = 2x\\)'], 'A cubic.', 'cubic-recip'],
    ['cubic-recip', 'The graph of \\(y = \\frac{6}{x}\\) passes through…', ['\\((2, 3)\\)', '\\((2, 12)\\)', '\\((0, 6)\\)', '\\((3, 3)\\)'], '\\(6 \\div 2 = 3\\).', 'cubic-recip'],
    ['cubic-recip', '\\(y = x^3 - x\\). What is \\(y\\) when \\(x = 2\\)?', ['6', '8', '4', '2'], '\\(8 - 2\\).', 'cubic-recip'],
    ['cubic-recip', 'The lines that a reciprocal graph \\(y = \\frac{k}{x}\\) approaches but never meets are called…', ['asymptotes', 'tangents', 'roots', 'intercepts'], 'Here they are the axes.', 'cubic-recip'],
    ['trig-graphs', 'What is the largest value of \\(y = \\cos x\\)?', ['1', '360', '90', 'It has no largest value'], 'The wave goes between −1 and 1.', 'trig-graphs'],
    ['trig-graphs', 'What is the period of \\(y = \\tan x\\)?', ['180°', '360°', '90°', '45°'], 'It repeats every 180°.', 'trig-graphs'],
    ['trig-graphs', '\\(\\sin 40° = 0.643\\). Which other angle between 0° and 360° has sine 0.643?', ['140°', '320°', '220°', '50°'], '\\(180° - 40°\\).', 'trig-graphs'],
    ['trig-graphs', 'At which angle is \\(\\sin x = -1\\)?', ['270°', '90°', '180°', '360°'], 'The lowest point of the sine wave.', 'trig-graphs'],
  ],
  LONG: [
    { q: '(a) Complete a table of values for \\(y = x^3 - 3x\\) for \\(x = -2, -1, 0, 1, 2\\). (b) Write down the coordinates of the turning points shown in your table.', m: 3, s: ['B2 for −2, 2, 0, −2, 2 (B1 for at least three).', 'B1 for \\((-1, 2)\\) and \\((1, -2)\\).'], link: ['cubic-recip', 'See cubic graphs again'] },
    { q: 'Sketch the graph of \\(y = \\cos x\\) for \\(0° \\le x \\le 360°\\). Mark the coordinates where the graph meets the axes.', m: 3, s: ['B1 for the correct shape.', 'B1 for \\((0, 1)\\).', 'B1 for \\((90, 0)\\) and \\((270, 0)\\).'], link: ['trig-graphs', 'See trigonometric graphs again'] },
    { q: 'Solve \\(\\sin x = -0.5\\) for \\(0° \\le x \\le 360°\\).', m: 2, s: ['M1 for one correct angle, 210° or 330°, or use of the symmetry of the graph.', 'A1 for 210° and 330°.'], link: ['trig-graphs', 'See symmetry of the sine graph again'] },
  ],
});
