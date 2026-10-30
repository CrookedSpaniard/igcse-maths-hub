FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['money', '5 pens at 65p and a ruler at £1.20. What is the total?', ['£4.45', '£5.85', '£3.25', '£4.25'], '\\(3.25 + 1.20\\).', 'money'],
    ['money', 'Ella earns £10.80 an hour for 20 hours. How much is that?', ['£216', '£208', '£108', '£2160'], '\\(20 \\times 10.80\\).', 'money'],
    ['money', 'The overtime rate is time and a half. The normal rate is £14. What is the overtime rate?', ['£21', '£15.50', '£28', '£14.50'], '\\(1.5 \\times 14\\).', 'money'],
    ['money', '£1 = €1.15. How many euros is £40?', ['€46', '€34.78', '€41.15', '€4.60'], '\\(40 \\times 1.15\\).', 'money'],
    ['time', 'Write 11:45 pm in the 24-hour clock.', ['23:45', '11:45', '21:45', '00:45'], '11 + 12 = 23.', 'time'],
    ['time', 'A journey starts at 08:50 and ends at 11:25. How long is it?', ['2 h 35 min', '3 h 25 min', '2 h 75 min', '2 h 25 min'], '10 min + 2 h + 25 min.', 'time'],
    ['time', 'Write 0.75 hours in minutes.', ['45 min', '75 min', '7.5 min', '40 min'], '\\(0.75 \\times 60\\).', 'time'],
    ['time', 'A bus leaves at 21:40 and the trip takes 50 minutes. When does it arrive?', ['22:30', '22:90', '21:90', '22:10'], '20 min to 22:00, then 30 min more.', 'time'],
  ],
  LONG: [
    { q: 'An electricity company charges a standing charge of 32p per day and 26.5p per unit. In 91 days a family uses 1240 units. Work out the total bill.', m: 3, s: ['M1 for \\(91 \\times 32\\) (= 2912p or £29.12).', 'M1 for \\(1240 \\times 26.5\\) (= 32 860p or £328.60).', 'A1 for £357.72.'], link: ['money', 'See bills again'] },
    { q: 'Raj is paid £12.60 an hour for the first 37 hours each week and time and a half after that. One week he works 42 hours. How much is he paid?', m: 3, s: ['M1 for \\(37 \\times 12.60\\) (= 466.20).', 'M1 for \\(5 \\times 1.5 \\times 12.60\\) (= 94.50).', 'A1 for £560.70.'], link: ['money', 'See wages and overtime again'] },
    { q: 'A train leaves London at 10:47 and arrives in Edinburgh at 15:09. (a) How long is the journey? (b) The distance is 632 km. Work out the average speed in km/h, to the nearest whole number.', m: 4, s: ['B1 for (a) 4 h 22 min.', 'M1 for converting to hours: \\(4 + \\tfrac{22}{60} = 4.366\\dots\\)', 'M1 for \\(632 \\div 4.366\\dots\\)', 'A1 for 145 km/h.'], link: ['time', 'See hours as decimals again'] },
  ],
});
