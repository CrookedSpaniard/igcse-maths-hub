FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['areavol', 'Lengths are multiplied by 4. Areas are multiplied by…', ['16', '4', '8', '64'], '\\(4^2\\).', 'areavol'],
    ['areavol', 'Lengths are multiplied by 3. Volumes are multiplied by…', ['27', '9', '3', '6'], '\\(3^3\\).', 'areavol'],
    ['areavol', 'Similar shapes have lengths in the ratio \\(2 : 5\\). Their areas are in the ratio…', ['\\(4 : 25\\)', '\\(2 : 5\\)', '\\(8 : 125\\)', '\\(4 : 10\\)'], 'Square both.', 'areavol'],
    ['areavol', 'A small shape has area \\(6\\ \\text{cm}^2\\). A similar shape is twice as long. Its area is…', ['\\(24\\ \\text{cm}^2\\)', '\\(12\\ \\text{cm}^2\\)', '\\(48\\ \\text{cm}^2\\)', '\\(36\\ \\text{cm}^2\\)'], '\\(6 \\times 4\\).', 'areavol'],
    ['simprob', 'Two similar solids have volumes 16 and 54 cm³. The length scale factor is…', ['1.5', '3.375', '2.25', '38'], '\\(\\sqrt[3]{54/16} = \\sqrt[3]{3.375}\\).', 'simprob'],
    ['simprob', 'Two similar jugs: capacities 1 litre and 8 litres. The small one is 15 cm tall. The large one is…', ['30 cm tall', '120 cm tall', '60 cm tall', '45 cm tall'], '\\(k = \\sqrt[3]{8} = 2\\).', 'simprob'],
    ['simprob', 'Areas of similar solids are in the ratio \\(9 : 16\\). Their volumes are in the ratio…', ['\\(27 : 64\\)', '\\(9 : 16\\)', '\\(81 : 256\\)', '\\(3 : 4\\)'], '\\(k = \\tfrac43\\).', 'simprob'],
  ],
  LONG: [
    { q: 'Two similar cylinders, P and Q, have surface areas \\(72\\ \\text{cm}^2\\) and \\(162\\ \\text{cm}^2\\). The volume of P is \\(64\\ \\text{cm}^3\\). Work out the volume of Q.', m: 3, s: ['M1 for \\(k^2 = \\frac{162}{72} = 2.25\\).', 'M1 for \\(k = 1.5\\) and \\(64 \\times 1.5^3\\).', 'A1 for \\(216\\ \\text{cm}^3\\).'], link: ['simprob', 'See from area to volume again'] },
    { q: 'A model of a ship is made to a scale of \\(1 : 50\\). The deck of the model has an area of \\(300\\ \\text{cm}^2\\). (a) Work out the area of the real deck in \\(\\text{m}^2\\). (b) The real ship holds \\(500\\ \\text{m}^3\\) of cargo. How much would the model hold, in \\(\\text{cm}^3\\)?', m: 4, s: ['M1 (a) for \\(300 \\times 50^2 = 750\\,000\\ \\text{cm}^2\\).', 'A1 (a) \\(75\\ \\text{m}^2\\).', 'M1 (b) for \\(500 \\div 50^3\\) (\\(= 0.004\\ \\text{m}^3\\)).', 'A1 (b) \\(4000\\ \\text{cm}^3\\).'], link: ['areavol', 'See k² and k³ again'] },
    { q: 'Two similar bottles have heights \\(12\\) cm and \\(18\\) cm. The larger bottle holds \\(675\\) ml. How much does the smaller bottle hold?', m: 3, s: ['M1 for \\(k = 1.5\\).', 'M1 for \\(675 \\div 1.5^3\\).', 'A1 for \\(200\\) ml.'], link: ['simprob', 'See capacity again'] },
  ],
});
