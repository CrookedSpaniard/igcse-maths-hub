FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['circles', 'A circle has radius 7 cm. Its diameter is…', ['14 cm', '3.5 cm', '7 cm', '49 cm'], '\\(d = 2r\\).', 'circles'],
    ['circles', 'A circle has diameter 20 cm. Its circumference is…', ['62.8 cm', '31.4 cm', '314 cm', '1256.6 cm'], '\\(\\pi \\times 20\\).', 'circles'],
    ['circles', 'A circle has radius 10 cm. Its area is…', ['\\(314.2\\ \\text{cm}^2\\)', '\\(62.8\\ \\text{cm}^2\\)', '\\(31.4\\ \\text{cm}^2\\)', '\\(100\\ \\text{cm}^2\\)'], '\\(\\pi \\times 10^2\\).', 'circles'],
    ['circles', 'A circle has diameter 8 cm. Its area is…', ['\\(50.3\\ \\text{cm}^2\\)', '\\(201.1\\ \\text{cm}^2\\)', '\\(25.1\\ \\text{cm}^2\\)', '\\(12.6\\ \\text{cm}^2\\)'], 'Use \\(r = 4\\): \\(\\pi \\times 16\\).', 'circles'],
    ['circles', 'A semicircle has diameter 12 cm. Its perimeter is…', ['30.8 cm', '18.8 cm', '37.7 cm', '24.8 cm'], '\\(\\tfrac12 \\pi \\times 12 + 12\\).', 'circles'],
    ['circles', 'A circle has radius 9 cm. Its circumference in terms of \\(\\pi\\) is…', ['\\(18\\pi\\) cm', '\\(81\\pi\\) cm', '\\(9\\pi\\) cm', '\\(4.5\\pi\\) cm'], '\\(2\\pi \\times 9\\).', 'circles'],
    ['circles', 'The area of a circle is \\(49\\pi\\ \\text{cm}^2\\). Its radius is…', ['7 cm', '49 cm', '24.5 cm', '14 cm'], '\\(r^2 = 49\\).', 'circles'],
    ['circles', 'Doubling the radius of a circle makes its area…', ['4 times as big', '2 times as big', '3.14 times as big', '8 times as big'], '\\(\\pi(2r)^2 = 4\\pi r^2\\).', 'circles'],
  ],
  LONG: [
    { q: 'A bicycle wheel has a diameter of \\(66\\) cm. Work out how many complete turns the wheel makes when the bicycle travels \\(1\\) km.', m: 4, s: ['M1 for \\(\\pi \\times 66 = 207.3…\\) cm.', 'M1 for \\(1\\) km \\(= 100\\,000\\) cm.', 'M1 for \\(100\\,000 \\div 207.3…\\) (\\(= 482.2…\\)).', 'A1 for \\(482\\) complete turns.'], link: ['circles', 'See the circumference again'] },
    { q: 'A window is a rectangle \\(80\\) cm wide and \\(100\\) cm tall with a semicircle on top. The diameter of the semicircle is the top of the rectangle. Work out the area of the window, to the nearest square centimetre.', m: 4, s: ['M1 for \\(80 \\times 100 = 8000\\).', 'M1 for \\(\\tfrac12 \\times \\pi \\times 40^2\\) (\\(= 2513.2…\\)).', 'M1 for adding.', 'A1 for \\(10\\,513\\ \\text{cm}^2\\).'], link: ['circles', 'See semicircles again'] },
    { q: 'A circle has a circumference of \\(50\\) cm. Work out its area, to 3 significant figures.', m: 3, s: ['M1 for \\(r = 50 \\div 2\\pi\\) (\\(= 7.957…\\)).', 'M1 for \\(\\pi \\times 7.957…^2\\).', 'A1 for \\(199\\ \\text{cm}^2\\).'], link: ['circles', 'See working backwards again'] },
  ],
});
