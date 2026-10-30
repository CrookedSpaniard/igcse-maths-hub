FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['laws', 'Simplify \\(7^3 \\times 7^6\\)', ['\\(7^9\\)', '\\(7^{18}\\)', '\\(49^9\\)', '\\(7^3\\)'], 'Add the indices.', 'laws'],
    ['laws', 'Simplify \\(4^{10} \\div 4^2\\)', ['\\(4^8\\)', '\\(4^5\\)', '\\(1^8\\)', '\\(4^{12}\\)'], 'Subtract the indices.', 'laws'],
    ['laws', 'Simplify \\((6^3)^5\\)', ['\\(6^{15}\\)', '\\(6^8\\)', '\\(6^{243}\\)', '\\(30^3\\)'], 'Multiply the indices.', 'laws'],
    ['laws', 'Work out \\(\\dfrac{2^7}{2^4}\\)', ['8', '16', '3', '64'], '\\(2^3 = 8\\).', 'laws'],
    ['laws', 'Simplify \\(3x^4 \\times 2x^5\\)', ['\\(6x^9\\)', '\\(5x^9\\)', '\\(6x^{20}\\)', '\\(5x^{20}\\)'], 'Multiply 3 × 2, add 4 + 5.', 'laws'],
    ['laws', 'Simplify \\(\\dfrac{12y^8}{4y^2}\\)', ['\\(3y^6\\)', '\\(8y^6\\)', '\\(3y^4\\)', '\\(3y^{10}\\)'], '\\(12 \\div 4 = 3\\), \\(8 - 2 = 6\\).', 'laws'],
    ['laws', 'Simplify \\((5a^3)^2\\)', ['\\(25a^6\\)', '\\(10a^6\\)', '\\(25a^5\\)', '\\(5a^6\\)'], '\\(5^2 = 25\\), \\(3 \\times 2 = 6\\).', 'laws'],
    ['laws', 'Why can \\(2^3 \\times 5^4\\) not be simplified with the index laws?', ['The bases are different', 'The indices are different', 'It is too big', 'It can: it is \\(10^7\\)'], 'The laws only work for the same base.', 'laws'],
    ['negzero', 'Work out \\(9^0\\)', ['1', '0', '9', '90'], 'Any non-zero number to the power 0 is 1.', 'negzero'],
    ['negzero', 'Work out \\(2^{-5}\\)', ['\\(\\tfrac{1}{32}\\)', '\\(-32\\)', '\\(-10\\)', '\\(\\tfrac{1}{10}\\)'], '\\(\\frac{1}{2^5}\\).', 'negzero'],
    ['negzero', 'Work out \\(\\left(\\tfrac{1}{3}\\right)^{-2}\\)', ['9', '\\(\\tfrac19\\)', '\\(-9\\)', '6'], 'Flip: \\(3^2 = 9\\).', 'negzero'],
    ['negzero', 'Write \\(\\dfrac{1}{x^4}\\) as a power of \\(x\\).', ['\\(x^{-4}\\)', '\\(x^{\\frac14}\\)', '\\(-x^4\\)', '\\(x^{4}\\)'], 'One over means a negative index.', 'negzero'],
  ],
  LONG: [
    { q: '\\(\\dfrac{3^8 \\times 3^5}{3^{10}} = 3^n\\). (a) Find the value of \\(n\\). (b) Work out the value of \\(3^n\\).', m: 2, s: ['B1 for (a) \\(n = 3\\).', 'B1 (ft) for (b) 27.'], link: ['laws', 'See the index laws again'] },
    { q: 'Simplify fully \\(\\dfrac{(2x^3)^4}{4x^5}\\)', m: 3, s: ['M1 for \\(16x^{12}\\) as the numerator.', 'M1 for dividing: \\(16 \\div 4\\) or \\(x^{12 - 5}\\).', 'A1 for \\(4x^7\\).'], link: ['laws', 'See power of a power again'] },
    { q: '\\(2^a \\times 2^b = 2^{10}\\) and \\(2^a \\div 2^b = 2^4\\). Find \\(a\\) and \\(b\\).', m: 3, s: ['M1 for \\(a + b = 10\\).', 'M1 for \\(a - b = 4\\).', 'A1 for \\(a = 7\\), \\(b = 3\\).'], link: ['laws', 'See multiplying and dividing again'] },
  ],
});
