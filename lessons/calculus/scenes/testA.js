FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['gradient-curve', 'The gradient of a curve at a point is the gradient of the…', ['tangent at that point', 'chord to the origin', 'normal', 'axis'], 'The tangent just touches the curve.', 'gradient-curve'],
    ['gradient-curve', 'A tangent goes through \\((0, -1)\\) and \\((2, 7)\\). Its gradient is…', ['4', '3', '8', '−4'], '\\(\\frac{8}{2}\\).', 'gradient-curve'],
    ['gradient-curve', 'Where a curve goes down from left to right, its gradient is…', ['negative', 'positive', 'zero', 'undefined'], 'Going down.', 'gradient-curve'],
    ['gradient-curve', 'Which graph has a variable rate of change?', ['\\(y = x^2\\)', '\\(y = 3x + 1\\)', '\\(y = 5\\)', '\\(y = -x\\)'], 'Straight lines have constant gradients.', 'gradient-curve'],
    ['differentiate', 'Differentiate \\(y = x^6\\).', ['\\(6x^5\\)', '\\(x^5\\)', '\\(6x^6\\)', '\\(5x^6\\)'], 'Power down, reduce by 1.', 'differentiate'],
    ['differentiate', 'Differentiate \\(y = 4x^3 + 2x\\).', ['\\(12x^2 + 2\\)', '\\(12x^2 + 2x\\)', '\\(4x^2 + 2\\)', '\\(7x^2\\)'], 'Term by term.', 'differentiate'],
    ['differentiate', 'Find the gradient of \\(y = x^2 - 5x\\) at \\(x = 3\\).', ['1', '−6', '11', '−1'], '\\(2(3) - 5\\).', 'differentiate'],
    ['differentiate', 'Differentiate \\(y = \\frac{2}{x}\\).', ['\\(-\\frac{2}{x^2}\\)', '\\(\\frac{2}{x^2}\\)', '\\(2\\)', '\\(-2x\\)'], '\\(2x^{-1} \\to -2x^{-2}\\).', 'differentiate'],
  ],
  LONG: [
    { q: '\\(y = 2x^3 - 5x^2 + 4x - 7\\). (a) Find \\(\\dfrac{dy}{dx}\\). (b) Find the gradient of the curve at the point where \\(x = 2\\).', m: 4, s: ['B2 for \\(6x^2 - 10x + 4\\) (B1 for two correct terms).', 'M1 for substituting \\(x = 2\\).', 'A1 for 8.'], link: ['differentiate', 'See differentiating again'] },
    { q: 'Find \\(\\dfrac{dy}{dx}\\) when \\(y = x^4 + \\dfrac{3}{x^2}\\).', m: 2, s: ['M1 for writing \\(3x^{-2}\\) or one correct term.', 'A1 for \\(4x^3 - 6x^{-3}\\) or \\(4x^3 - \\frac{6}{x^3}\\).'], link: ['differentiate', 'See negative powers again'] },
    { q: 'The curve \\(y = x^2 + kx\\) has gradient 7 at \\(x = 2\\). Find \\(k\\).', m: 2, s: ['M1 for \\(2(2) + k = 7\\).', 'A1 for \\(k = 3\\).'], link: ['differentiate', 'See gradient at a point again'] },
  ],
});
