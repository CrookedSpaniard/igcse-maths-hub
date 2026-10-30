FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['units', 'Change 2.4 km into metres.', ['2400 m', '240 m', '24 000 m', '0.0024 m'], '× 1000.', 'units'],
    ['units', 'Change 650 g into kilograms.', ['0.65 kg', '6.5 kg', '65 kg', '0.065 kg'], '÷ 1000.', 'units'],
    ['units', 'How many cm² are in 1 m²?', ['10 000', '100', '1000', '1 000 000'], '\\(100 \\times 100\\).', 'units'],
    ['units', 'A tank holds 5000 cm³. How many litres is that?', ['5 litres', '50 litres', '0.5 litres', '500 litres'], '1000 cm³ = 1 litre.', 'units'],
    ['calculator', 'Which key sequence works out \\(\\dfrac{6 + 9}{3}\\)?', ['( 6 + 9 ) ÷ 3 =', '6 + 9 ÷ 3 =', '6 + ( 9 ÷ 3 ) =', '6 ÷ 3 + 9 ='], 'Brackets round the top.', 'calculator'],
    ['calculator', 'Work out \\(\\sqrt{2.5^2 + 6^2}\\).', ['6.5', '8.5', '42.25', '6.25'], '\\(\\sqrt{42.25}\\).', 'calculator'],
    ['calculator', 'A calculator shows 3.14159… Rounded to 3 significant figures this is…', ['3.14', '3.141', '3.1', '3.142'], 'Three figures.', 'calculator'],
    ['calculator', 'What does −2^4 give on a calculator?', ['−16', '16', '−8', '8'], 'Only the 2 is raised to the power.', 'calculator'],
  ],
  LONG: [
    { q: 'Work out \\(\\dfrac{\\sqrt{19.6 + 4.8^2}}{3.1 \\times 0.8}\\). (a) Write down all the figures on your calculator display. (b) Give your answer to 2 decimal places.', m: 2, s: ['B1 for (a) 2.6330367… (accept 2.633).', 'B1 (ft) for (b) 2.63.'], link: ['calculator', 'See writing down and rounding again'] },
    { q: 'A rectangular garden is 12.5 m by 8 m. Work out its area in cm².', m: 2, s: ['M1 for 100 m² seen, or 1250 cm × 800 cm.', 'A1 for 1 000 000 cm².'], link: ['units', 'See area units again'] },
    { q: 'A fish tank is 60 cm long, 30 cm wide and 40 cm high. How many litres of water does it hold when full?', m: 3, s: ['M1 for \\(60 \\times 30 \\times 40\\) (= 72 000 cm³).', 'M1 for dividing by 1000.', 'A1 for 72 litres.'], link: ['units', 'See volume and capacity again'] },
  ],
});
