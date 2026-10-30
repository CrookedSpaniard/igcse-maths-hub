FD.test({
  id: 'testC',
  part: 'C',
  Q: [
    ['negzero', 'Work out \\(9^0\\)', ['1', '0', '9', '90'], 'Any non-zero number to the power 0 is 1.', 'negzero'],
    ['negzero', 'Work out \\(2^{-5}\\)', ['\\(\\tfrac{1}{32}\\)', '\\(-32\\)', '\\(-10\\)', '\\(\\tfrac{1}{10}\\)'], '\\(\\frac{1}{2^5}\\).', 'negzero'],
    ['negzero', 'Work out \\(\\left(\\tfrac{1}{3}\\right)^{-2}\\)', ['9', '\\(\\tfrac19\\)', '\\(-9\\)', '6'], 'Flip: \\(3^2 = 9\\).', 'negzero'],
    ['negzero', 'Write \\(\\dfrac{1}{x^4}\\) as a power of \\(x\\).', ['\\(x^{-4}\\)', '\\(x^{\\frac14}\\)', '\\(-x^4\\)', '\\(x^{4}\\)'], 'One over means a negative index.', 'negzero'],
    ['fractional', 'Work out \\(49^{\\frac12}\\)', ['7', '24.5', '\\(\\tfrac{1}{49}\\)', '2401'], '\\(\\sqrt{49}\\).', 'fractional'],
    ['fractional', 'Work out \\(27^{\\frac23}\\)', ['9', '18', '3', '81'], '\\((\\sqrt[3]{27})^2 = 3^2\\).', 'fractional'],
    ['fractional', 'Work out \\(100^{-\\frac12}\\)', ['\\(\\tfrac{1}{10}\\)', '\\(-10\\)', '\\(-50\\)', '\\(\\tfrac{1}{50}\\)'], '\\(\\frac{1}{\\sqrt{100}}\\).', 'fractional'],
    ['fractional', 'Which is equal to \\(\\sqrt[5]{x^2}\\)?', ['\\(x^{\\frac25}\\)', '\\(x^{\\frac52}\\)', '\\(x^{10}\\)', '\\(x^{-3}\\)'], 'Root = bottom, power = top.', 'fractional'],
  ],
  LONG: [
    { q: 'Work out \\(\\left(\\dfrac{16}{81}\\right)^{-\\frac34}\\). Give your answer as a fraction.', m: 3, s: ['M1 for flipping: \\(\\left(\\frac{81}{16}\\right)^{\\frac34}\\), or for \\(\\sqrt[4]{16} = 2\\) and \\(\\sqrt[4]{81} = 3\\).', 'M1 for cubing: \\(\\frac{27}{8}\\) or \\(\\frac{8}{27}\\).', 'A1 for \\(\\frac{27}{8}\\).'], link: ['fractional', 'See negative fractional indices again'] },
    { q: 'Find the value of \\(n\\): (a) \\(5^n = \\frac{1}{125}\\) (b) \\(8^n = 2\\) (c) \\(4^n = 8\\)', m: 3, s: ['B1 for (a) \\(-3\\).', 'B1 for (b) \\(\\frac13\\).', 'B1 for (c) \\(\\frac32\\) (since \\(4^{\\frac32} = 2^3 = 8\\)).'], link: ['fractional', 'See fractional indices again'] },
    { q: 'Write \\(\\dfrac{\\sqrt{x}}{x^3}\\) as a single power of \\(x\\).', m: 2, s: ['M1 for \\(\\sqrt{x} = x^{\\frac12}\\).', 'A1 for \\(x^{-\\frac52}\\).'], link: ['negzero', 'See negative indices again'] },
  ],
});
