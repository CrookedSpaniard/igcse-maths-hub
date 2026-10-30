FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['muldiv', '\\((2 \\times 10^{4}) \\times (4 \\times 10^{3}) = \\)', ['\\(8 \\times 10^{7}\\)', '\\(8 \\times 10^{12}\\)', '\\(6 \\times 10^{7}\\)', '\\(8 \\times 10^{1}\\)'], 'Add the powers.', 'muldiv'],
    ['muldiv', '\\((7 \\times 10^{5}) \\times (3 \\times 10^{-2}) = \\)', ['\\(2.1 \\times 10^{4}\\)', '\\(21 \\times 10^{3}\\)', '\\(2.1 \\times 10^{3}\\)', '\\(2.1 \\times 10^{-10}\\)'], '\\(21 \\times 10^3 = 2.1 \\times 10^4\\).', 'muldiv'],
    ['muldiv', '\\((8 \\times 10^{9}) \\div (2 \\times 10^{3}) = \\)', ['\\(4 \\times 10^{6}\\)', '\\(4 \\times 10^{3}\\)', '\\(6 \\times 10^{6}\\)', '\\(4 \\times 10^{12}\\)'], 'Subtract the powers.', 'muldiv'],
    ['muldiv', '\\((3 \\times 10^{2}) \\div (6 \\times 10^{5}) = \\)', ['\\(5 \\times 10^{-4}\\)', '\\(0.5 \\times 10^{-3}\\)', '\\(2 \\times 10^{-3}\\)', '\\(5 \\times 10^{-3}\\)'], '\\(0.5 \\times 10^{-3}\\), then tidy.', 'muldiv'],
    ['addsub', '\\(6 \\times 10^{3} + 4 \\times 10^{2} = \\)', ['\\(6.4 \\times 10^{3}\\)', '\\(10 \\times 10^{5}\\)', '\\(1 \\times 10^{6}\\)', '\\(6.4 \\times 10^{2}\\)'], '6000 + 400.', 'addsub'],
    ['addsub', '\\(5 \\times 10^{-2} - 2 \\times 10^{-3} = \\)', ['\\(4.8 \\times 10^{-2}\\)', '\\(3 \\times 10^{1}\\)', '\\(3 \\times 10^{-1}\\)', '\\(4.8 \\times 10^{-3}\\)'], '0.05 − 0.002 = 0.048.', 'addsub'],
    ['addsub', 'A calculator display shows 6.3E+08. What is this?', ['\\(6.3 \\times 10^{8}\\)', '\\(6.3^{8}\\)', '\\(6.3 \\times 8\\)', '\\(6.3 \\times 10^{-8}\\)'], 'E+08 means × 10⁸.', 'addsub'],
    ['addsub', 'Which is \\(2.4 \\times 10^{4} + 3.1 \\times 10^{4}\\)?', ['\\(5.5 \\times 10^{4}\\)', '\\(5.5 \\times 10^{8}\\)', '\\(7.44 \\times 10^{8}\\)', '\\(5.5 \\times 10^{16}\\)'], 'Same power: add the A parts.', 'addsub'],
  ],
  LONG: [
    { q: 'Work out \\((4.5 \\times 10^{6}) \\times (3 \\times 10^{-2})\\). Give your answer in standard form.', m: 2, s: ['M1 for \\(13.5 \\times 10^{4}\\) or 135 000.', 'A1 for \\(1.35 \\times 10^{5}\\).'], link: ['muldiv', 'See multiplying again'] },
    { q: 'Work out \\(\\dfrac{3.6 \\times 10^{-4}}{9 \\times 10^{3}}\\). Give your answer in standard form.', m: 2, s: ['M1 for \\(0.4 \\times 10^{-7}\\).', 'A1 for \\(4 \\times 10^{-8}\\).'], link: ['muldiv', 'See dividing again'] },
    { q: 'Work out \\(7.2 \\times 10^{5} - 9 \\times 10^{4}\\). Give your answer in standard form.', m: 2, s: ['M1 for 720 000 − 90 000 (= 630 000).', 'A1 for \\(6.3 \\times 10^{5}\\).'], link: ['addsub', 'See subtracting again'] },
  ],
});
