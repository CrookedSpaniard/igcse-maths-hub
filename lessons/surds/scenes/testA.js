FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['meaning', 'Which of these is a surd?', ['\\(\\sqrt{20}\\)', '\\(\\sqrt{49}\\)', '\\(\\sqrt{\\tfrac{1}{4}}\\)', '\\(\\sqrt[3]{8}\\)'], '20 is not a square number.', 'meaning'],
    ['meaning', 'Work out \\(\\sqrt{2} \\times \\sqrt{18}\\)', ['6', '\\(\\sqrt{20}\\)', '36', '\\(2\\sqrt{9}\\)'], '\\(\\sqrt{36} = 6\\).', 'meaning'],
    ['meaning', 'Simplify \\(3\\sqrt{2} \\times 4\\sqrt{5}\\)', ['\\(12\\sqrt{10}\\)', '\\(7\\sqrt{10}\\)', '\\(12\\sqrt{7}\\)', '\\(7\\sqrt{7}\\)'], 'Numbers: 12. Roots: \\(\\sqrt{10}\\).', 'meaning'],
    ['meaning', 'Simplify \\(\\dfrac{\\sqrt{48}}{\\sqrt{3}}\\)', ['4', '16', '\\(\\sqrt{45}\\)', '\\(4\\sqrt{3}\\)'], '\\(\\sqrt{16} = 4\\).', 'meaning'],
    ['simplify', 'Simplify \\(\\sqrt{45}\\)', ['\\(3\\sqrt{5}\\)', '\\(5\\sqrt{3}\\)', '\\(9\\sqrt{5}\\)', '\\(15\\sqrt{3}\\)'], '\\(\\sqrt{9 \\times 5}\\).', 'simplify'],
    ['simplify', 'Simplify \\(\\sqrt{200}\\)', ['\\(10\\sqrt{2}\\)', '\\(2\\sqrt{10}\\)', '\\(100\\sqrt{2}\\)', '\\(20\\sqrt{10}\\)'], '\\(\\sqrt{100 \\times 2}\\).', 'simplify'],
    ['simplify', 'Simplify \\(\\sqrt{20} + \\sqrt{45}\\)', ['\\(5\\sqrt{5}\\)', '\\(\\sqrt{65}\\)', '\\(6\\sqrt{5}\\)', '\\(13\\sqrt{5}\\)'], '\\(2\\sqrt5 + 3\\sqrt5\\).', 'simplify'],
    ['simplify', 'Which pair are like surds?', ['\\(\\sqrt{8}\\) and \\(\\sqrt{50}\\)', '\\(\\sqrt{8}\\) and \\(\\sqrt{12}\\)', '\\(\\sqrt{3}\\) and \\(\\sqrt{30}\\)', '\\(\\sqrt{5}\\) and \\(\\sqrt{15}\\)'], '\\(2\\sqrt2\\) and \\(5\\sqrt2\\).', 'simplify'],
  ],
  LONG: [
    { q: 'Write \\(\\sqrt{98}\\) in the form \\(k\\sqrt{2}\\), where \\(k\\) is an integer.', m: 2, s: ['M1 for \\(\\sqrt{49 \\times 2}\\) or \\(\\sqrt{49} \\times \\sqrt{2}\\).', 'A1 for \\(7\\sqrt{2}\\).'], link: ['simplify', 'See simplifying surds again'] },
    { q: 'Simplify fully \\(\\sqrt{12} + \\sqrt{75} - \\sqrt{27}\\).', m: 3, s: ['M1 for at least two of \\(2\\sqrt3\\), \\(5\\sqrt3\\), \\(3\\sqrt3\\).', 'M1 for all three correct.', 'A1 for \\(4\\sqrt3\\).'], link: ['simplify', 'See adding surds again'] },
    { q: 'A rectangle has sides \\(\\sqrt{6}\\) cm and \\(\\sqrt{24}\\) cm. Show that its area is a whole number, and find it.', m: 2, s: ['M1 for \\(\\sqrt{6} \\times \\sqrt{24} = \\sqrt{144}\\).', 'A1 for 12 cm².'], link: ['meaning', 'See multiplying surds again'] },
  ],
});
