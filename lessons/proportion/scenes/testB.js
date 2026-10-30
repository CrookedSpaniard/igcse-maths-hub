FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['inverse', '\\(y \\propto \\frac{1}{x}\\) and \\(y = 5\\) when \\(x = 6\\). Find \\(y\\) when \\(x = 10\\).', ['3', '8.3', '30', '1.2'], '\\(k = 30\\).', 'inverse'],
    ['inverse', '\\(y = \\frac{k}{x^2}\\) and \\(y = 2\\) when \\(x = 3\\). What is \\(k\\)?', ['18', '6', '1.5', '\\(\\frac29\\)'], '\\(k = 2 \\times 9\\).', 'inverse'],
    ['inverse', '6 workers build a wall in 10 days. How long would 4 workers take?', ['15 days', '6.7 days', '8 days', '12 days'], '\\(k = 60\\) worker-days.', 'inverse'],
    ['inverse', 'Which equation shows \\(y\\) inversely proportional to \\(x\\)?', ['\\(xy = 20\\)', '\\(y = 20x\\)', '\\(y = x - 20\\)', '\\(y = x^2 + 20\\)'], '\\(xy = k\\).', 'inverse'],
    ['prop-problems', '\\(y \\propto x^2\\). \\(x\\) is multiplied by 5. \\(y\\) is multiplied by…', ['25', '5', '10', '125'], '\\(5^2\\).', 'prop-problems'],
    ['prop-problems', '\\(y \\propto \\frac{1}{x^2}\\). \\(x\\) is tripled. \\(y\\) is…', ['divided by 9', 'divided by 3', 'multiplied by 9', 'multiplied by 3'], '\\(3^2 = 9\\).', 'prop-problems'],
    ['prop-problems', '“\\(L\\) varies directly as the cube of \\(w\\).” Which formula?', ['\\(L = kw^3\\)', '\\(L = \\frac{k}{w^3}\\)', '\\(L = 3kw\\)', '\\(L = k\\sqrt[3]{w}\\)'], 'Directly: multiply by \\(k\\).', 'prop-problems'],
    ['prop-problems', '\\(y \\propto x\\). \\(x\\) increases by 30%. \\(y\\)…', ['increases by 30%', 'increases by 69%', 'decreases by 30%', 'stays the same'], 'Multiplied by 1.3.', 'prop-problems'],
  ],
  LONG: [
    { q: '\\(F\\) is inversely proportional to the square of \\(d\\). When \\(d = 5\\), \\(F = 8\\). (a) Find a formula for \\(F\\) in terms of \\(d\\). (b) Find \\(F\\) when \\(d = 4\\).', m: 4, s: ['M1 for \\(F = \\frac{k}{d^2}\\).', 'M1 for \\(k = 8 \\times 25 = 200\\).', 'A1 for \\(F = \\frac{200}{d^2}\\).', 'A1 for 12.5.'], link: ['inverse', 'See inverse proportion again'] },
    { q: '\\(y\\) is inversely proportional to \\(x\\). Complete the table: \\(x = 2, 5, \\square\\); \\(y = 15, \\square, 1.5\\).', m: 3, s: ['M1 for \\(k = 30\\).', 'A1 for \\(y = 6\\) when \\(x = 5\\).', 'A1 for \\(x = 20\\) when \\(y = 1.5\\).'], link: ['inverse', 'See finding k again'] },
    { q: 'The volume of a sphere is proportional to the cube of its radius. The radius increases by 10%. Work out the percentage increase in the volume.', m: 2, s: ['M1 for \\(1.1^3\\).', 'A1 for 33.1%.'], link: ['prop-problems', 'See percentage changes again'] },
  ],
});
