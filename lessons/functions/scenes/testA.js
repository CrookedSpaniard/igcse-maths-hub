FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['mapping', '\\(f(x) = 3x - 7\\). What is \\(f(5)\\)?', ['8', '−2', '22', '15'], '\\(15 - 7\\).', 'mapping'],
    ['mapping', '\\(g : x \\mapsto x^2 - 4\\). What is \\(g(-3)\\)?', ['5', '−13', '13', '−5'], '\\(9 - 4\\).', 'mapping'],
    ['mapping', '\\(f(x) = 2x + 9\\). Solve \\(f(x) = 1\\).', ['\\(x = -4\\)', '\\(x = 4\\)', '\\(x = 5\\)', '\\(x = 11\\)'], '\\(2x = -8\\).', 'mapping'],
    ['mapping', 'Which mapping is not a function?', ['An input with two different outputs', 'Two inputs with the same output', 'Each input with one output', '\\(x \\mapsto 5\\) for every \\(x\\)'], 'A function gives exactly one output for each input.', 'mapping'],
    ['domain-range', 'Which value must be excluded from the domain of \\(f(x) = \\frac{2}{x - 5}\\)?', ['5', '−5', '0', '2'], 'It makes the denominator 0.', 'domain-range'],
    ['domain-range', 'The domain of \\(f(x) = \\sqrt{x + 2}\\) is…', ['\\(x \\ge -2\\)', '\\(x \\ge 2\\)', '\\(x > 0\\)', 'all \\(x\\)'], '\\(x + 2 \\ge 0\\).', 'domain-range'],
    ['domain-range', '\\(f(x) = 3x\\) with domain \\(1 \\le x \\le 4\\). The range is…', ['\\(3 \\le f(x) \\le 12\\)', '\\(1 \\le f(x) \\le 4\\)', '\\(f(x) \\ge 3\\)', '\\(0 \\le f(x) \\le 12\\)'], '\\(f(1) = 3\\), \\(f(4) = 12\\).', 'domain-range'],
    ['domain-range', 'The range of \\(f(x) = x^2 - 5\\) for all \\(x\\) is…', ['\\(f(x) \\ge -5\\)', '\\(f(x) \\ge 0\\)', '\\(f(x) \\ge 5\\)', 'all numbers'], '\\(x^2 \\ge 0\\).', 'domain-range'],
  ],
  LONG: [
    { q: '\\(f(x) = \\dfrac{x + 3}{x - 1}\\). (a) Find \\(f(5)\\). (b) Which value of \\(x\\) must be excluded from the domain of \\(f\\)? (c) Solve \\(f(x) = 3\\).', m: 4, s: ['B1 for \\(f(5) = 2\\).', 'B1 for \\(x = 1\\).', 'M1 for \\(x + 3 = 3(x - 1)\\).', 'A1 for \\(x = 3\\).'], link: ['mapping', 'See function notation again'] },
    { q: '\\(g(x) = 2x^2 - 1\\) with domain \\(-1 \\le x \\le 3\\). Find the range of \\(g\\).', m: 2, s: ['M1 for finding the minimum \\(g(0) = -1\\) or the maximum \\(g(3) = 17\\).', 'A1 for \\(-1 \\le g(x) \\le 17\\).'], link: ['domain-range', 'See domain and range again'] },
    { q: '\\(h(x) = 7 - 2x\\). Find \\(h(a + 2)\\) in its simplest form.', m: 2, s: ['M1 for \\(7 - 2(a + 2)\\).', 'A1 for \\(3 - 2a\\).'], link: ['mapping', 'See expressions as inputs again'] },
  ],
});
