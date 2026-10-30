FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['af-simplify', 'Simplify \\(\\frac{8x^2y}{12xy^2}\\).', ['\\(\\frac{2x}{3y}\\)', '\\(\\frac{2xy}{3}\\)', '\\(\\frac{x}{y}\\)', '\\(\\frac{2}{3}\\)'], '\\(8 \\div 4 = 2\\), \\(12 \\div 4 = 3\\), cancel \\(x\\) and \\(y\\).', 'af-simplify'],
    ['af-simplify', 'Simplify \\(\\frac{x^2 - 4x}{x^2 - 16}\\).', ['\\(\\frac{x}{x + 4}\\)', '\\(\\frac{x}{x - 4}\\)', '\\(\\frac{-4x}{-16}\\)', '\\(\\frac{1}{x + 4}\\)'], '\\(\\frac{x(x - 4)}{(x + 4)(x - 4)}\\).', 'af-simplify'],
    ['af-simplify', 'Simplify \\(\\frac{x^2 + x - 6}{x^2 + 6x + 9}\\).', ['\\(\\frac{x - 2}{x + 3}\\)', '\\(\\frac{x + 2}{x + 3}\\)', '\\(\\frac{x - 2}{x - 3}\\)', '\\(\\frac{-6}{9}\\)'], '\\(\\frac{(x + 3)(x - 2)}{(x + 3)^2}\\).', 'af-simplify'],
    ['af-simplify', 'Which can be simplified?', ['\\(\\frac{3x + 6}{x + 2}\\)', '\\(\\frac{x + 6}{x + 2}\\)', '\\(\\frac{x^2 + 1}{x + 1}\\)', '\\(\\frac{x + 3}{x - 3}\\)'], '\\(3x + 6 = 3(x + 2)\\), so it simplifies to 3.', 'af-simplify'],
    ['af-muldiv', 'Simplify \\(\\frac{2x}{3} \\times \\frac{9}{4x^2}\\).', ['\\(\\frac{3}{2x}\\)', '\\(\\frac{18x}{12x^2}\\)', '\\(\\frac{3x}{2}\\)', '\\(\\frac{2}{3x}\\)'], '\\(\\frac{18x}{12x^2} = \\frac{3}{2x}\\).', 'af-muldiv'],
    ['af-muldiv', 'Simplify \\(\\frac{x}{x + 1} \\div \\frac{x^2}{x + 1}\\).', ['\\(\\frac{1}{x}\\)', '\\(x\\)', '\\(\\frac{x^3}{(x + 1)^2}\\)', '1'], 'Flip: \\(\\frac{x}{x + 1} \\times \\frac{x + 1}{x^2}\\).', 'af-muldiv'],
    ['af-muldiv', 'Simplify \\(\\frac{x^2 - 9}{5} \\times \\frac{10}{x + 3}\\).', ['\\(2(x - 3)\\)', '\\(2(x + 3)\\)', '\\(\\frac{x - 3}{2}\\)', '\\(10(x - 3)\\)'], '\\(\\frac{(x + 3)(x - 3) \\times 10}{5(x + 3)}\\).', 'af-muldiv'],
    ['af-muldiv', 'The first step in working out \\(\\frac{a}{b} \\div \\frac{c}{d}\\) is to write…', ['\\(\\frac{a}{b} \\times \\frac{d}{c}\\)', '\\(\\frac{b}{a} \\times \\frac{c}{d}\\)', '\\(\\frac{a - c}{b - d}\\)', '\\(\\frac{a}{b} \\times \\frac{c}{d}\\)'], 'Keep, change, flip.', 'af-muldiv'],
  ],
  LONG: [
    { q: 'Simplify fully \\(\\dfrac{2x^2 + 5x - 3}{x^2 - 9}\\).', m: 3, s: ['M1 for \\((2x - 1)(x + 3)\\).', 'M1 for \\((x + 3)(x - 3)\\).', 'A1 for \\(\\dfrac{2x - 1}{x - 3}\\).'], link: ['af-simplify', 'See simplifying again'] },
    { q: 'Simplify fully \\(\\dfrac{x^2 - 25}{3x} \\div \\dfrac{x + 5}{6x^2}\\).', m: 3, s: ['M1 for multiplying by the reciprocal \\(\\frac{6x^2}{x + 5}\\).', 'M1 for factorising \\(x^2 - 25 = (x + 5)(x - 5)\\).', 'A1 for \\(2x(x - 5)\\) or \\(2x^2 - 10x\\).'], link: ['af-muldiv', 'See dividing again'] },
    { q: 'Sam writes \\(\\dfrac{x + 4}{x + 8} = \\dfrac{4}{8} = \\dfrac{1}{2}\\). Explain the mistake.', m: 1, s: ['B1 for saying that \\(x\\) is a term, not a factor, so it cannot be cancelled (e.g. a counter-example such as \\(x = 2\\) gives \\(\\frac{6}{10}\\), not \\(\\frac12\\)).'], link: ['af-simplify', 'See cancelling factors again'] },
  ],
});
