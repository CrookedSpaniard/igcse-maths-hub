FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['conversion', '10 litres ≈ 2.2 gallons. About how many gallons are 50 litres?', ['11', '22', '5', '110'], '\\(5 \\times 2.2\\).', 'conversion'],
    ['conversion', '5 miles = 8 km. How many miles are 40 km?', ['25', '64', '50', '32'], '\\(40 \\div 8 = 5\\), \\(5 \\times 5\\).', 'conversion'],
    ['conversion', 'A conversion graph between two currencies is…', ['a straight line through the origin', 'a curve', 'a horizontal line', 'a straight line that does not pass through the origin'], 'One currency is a fixed multiple of the other.', 'conversion'],
    ['conversion', 'From a graph, £30 = €35. How many euros is £90?', ['105', '95', '35', '120'], '\\(3 \\times 35\\).', 'conversion'],
    ['distance-time', 'On a distance–time graph, a horizontal line shows the object is…', ['stopped', 'at constant speed', 'speeding up', 'coming back'], 'Distance is not changing.', 'distance-time'],
    ['distance-time', 'A cyclist travels 18 km in 45 minutes. The speed is…', ['24 km/h', '40 km/h', '13.5 km/h', '2.5 km/h'], '\\(18 \\div 0.75\\).', 'distance-time'],
    ['distance-time', 'The line on a distance–time graph slopes downwards. The person is…', ['returning to the start', 'stopped', 'slowing down', 'going uphill'], 'Distance from the start is decreasing.', 'distance-time'],
    ['distance-time', 'Which part of a distance–time graph shows the fastest speed?', ['The steepest part', 'The flattest part', 'The highest point', 'The last part'], 'Gradient = speed.', 'distance-time'],
  ],
  LONG: [
    { q: 'Ali leaves home at 10:00 and walks 6 km to a shop in 1 hour 30 minutes. He stays for 30 minutes, then walks home at 4.8 km/h. (a) What is his speed on the way to the shop? (b) At what time does he get home?', m: 4, s: ['M1 for \\(6 \\div 1.5\\).', 'A1 for 4 km/h.', 'M1 for \\(6 \\div 4.8 = 1.25\\) hours.', 'A1 for 13:15.'], link: ['distance-time', 'See distance–time graphs again'] },
    { q: 'Draw a conversion graph for kilograms and pounds using 1 kg ≈ 2.2 lb, for 0 to 10 kg. Use it to estimate 7 kg in pounds.', m: 3, s: ['B1 for a straight line through \\((0, 0)\\).', 'B1 for a correct point such as \\((10, 22)\\).', 'B1 for 15.4 lb (± 0.5).'], link: ['conversion', 'See conversion graphs again'] },
    { q: 'A car travels 150 km in 2 hours 30 minutes. Work out its average speed.', m: 2, s: ['M1 for \\(150 \\div 2.5\\).', 'A1 for 60 km/h.'], link: ['distance-time', 'See speed again'] },
  ],
});
