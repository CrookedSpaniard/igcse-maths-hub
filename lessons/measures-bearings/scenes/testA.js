FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['units', '\\(3.2\\ \\text{km} =\\)', ['3200 m', '320 m', '32 000 m', '0.0032 m'], '\\(\\times 1000\\).', 'units'],
    ['units', '\\(450\\ \\text{g} =\\)', ['0.45 kg', '4.5 kg', '45 kg', '450 000 kg'], '\\(\\div 1000\\).', 'units'],
    ['units', '\\(1\\ \\text{cm}^2 =\\)', ['\\(100\\ \\text{mm}^2\\)', '\\(10\\ \\text{mm}^2\\)', '\\(1000\\ \\text{mm}^2\\)', '\\(1\\ \\text{mm}^2\\)'], '\\(10 \\times 10\\).', 'units'],
    ['units', '\\(2\\ \\text{m}^3\\) in \\(\\text{cm}^3\\) is…', ['2 000 000', '200', '20 000', '2000'], '\\(\\times 100^3\\).', 'units'],
    ['reading', 'A scale has 5 small divisions between 0 and 10. Each division is worth…', ['2', '5', '0.5', '10'], '\\(10 \\div 5 = 2\\).', 'reading'],
    ['reading', '16:35 in the 12-hour clock is…', ['4:35 pm', '6:35 pm', '4:35 am', '16:35 pm'], '\\(16 - 12 = 4\\), pm.', 'reading'],
    ['reading', 'The most sensible estimate for the height of a door is…', ['2 m', '20 m', '0.2 m', '200 m'], 'About 2 m.', 'reading'],
    ['compound', 'A force of 500 N acts on an area of 2 m². The pressure is…', ['250 N/m²', '1000 N/m²', '502 N/m²', '0.004 N/m²'], '\\(P = F \\div A\\).', 'compound'],
    ['compound', 'A runner covers \\(12\\) km in \\(1.5\\) hours. Her average speed is…', ['8 km/h', '18 km/h', '10.5 km/h', '13.5 km/h'], '\\(12 \\div 1.5\\).', 'compound'],
    ['compound', 'A car drives at \\(80\\) km/h for \\(45\\) minutes. It travels…', ['60 km', '36 km', '3600 km', '125 km'], '\\(80 \\times 0.75\\).', 'compound'],
    ['compound', 'Density \\(= 8\\ \\text{g/cm}^3\\), volume \\(= 25\\ \\text{cm}^3\\). The mass is…', ['200 g', '3.125 g', '33 g', '0.32 g'], '\\(M = D \\times V\\).', 'compound'],
    ['compound', '\\(2\\) h \\(20\\) min in hours is…', ['\\(2\\tfrac{1}{3}\\) h', '2.2 h', '2.02 h', '2.33 h exactly'], '\\(20 \\div 60 = \\tfrac13\\).', 'compound'],
  ],
  LONG: [
    { q: 'A lorry travels \\(150\\) km at an average speed of \\(60\\) km/h, then \\(90\\) km at \\(45\\) km/h. Work out its average speed for the whole journey.', m: 4, s: ['M1 for \\(150 \\div 60 = 2.5\\) h.', 'M1 for \\(90 \\div 45 = 2\\) h.', 'M1 for \\((150 + 90) \\div (2.5 + 2)\\).', 'A1 for \\(53.3\\) km/h (accept \\(53\\tfrac13\\)).'], link: ['compound', 'See speed again'] },
    { q: 'A gold bar is a cuboid \\(10\\) cm by \\(4\\) cm by \\(2.5\\) cm. Gold has a density of \\(19.3\\ \\text{g/cm}^3\\). Work out the mass of the bar in kilograms.', m: 3, s: ['M1 for volume \\(10 \\times 4 \\times 2.5 = 100\\ \\text{cm}^3\\).', 'M1 for \\(19.3 \\times 100 = 1930\\) g.', 'A1 for \\(1.93\\) kg.'], link: ['compound', 'See density again'] },
    { q: 'A rectangular field has an area of \\(0.36\\ \\text{km}^2\\). Write this area in square metres.', m: 2, s: ['M1 for \\(1\\ \\text{km}^2 = 1000^2 = 1\\,000\\,000\\ \\text{m}^2\\).', 'A1 for \\(360\\,000\\ \\text{m}^2\\).'], link: ['units', 'See area units again'] },
    { q: 'A ferry leaves at 22:40 and arrives the next day at 03:15. How long is the crossing? Give your answer in hours and minutes.', m: 2, s: ['M1 for counting on in parts, e.g. 22:40 → 00:00 is 1 h 20 min, then 3 h 15 min.', 'A1 for 4 h 35 min.'], link: ['reading', 'See time intervals again'] },
  ],
});
