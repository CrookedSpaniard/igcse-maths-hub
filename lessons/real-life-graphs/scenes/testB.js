FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['speed-time', 'A car speeds up from 0 to 20 m/s in 5 s. Its acceleration is…', ['4 m/s²', '100 m/s²', '0.25 m/s²', '20 m/s²'], '\\(20 \\div 5\\).', 'speed-time'],
    ['speed-time', 'On a speed–time graph, the area under the graph gives…', ['the distance travelled', 'the acceleration', 'the speed', 'the time'], 'Speed × time.', 'speed-time'],
    ['speed-time', 'A lorry travels at 12 m/s for 30 s. How far does it go?', ['360 m', '42 m', '2.5 m', '180 m'], 'Rectangle: \\(12 \\times 30\\).', 'speed-time'],
    ['speed-time', 'A speed–time graph slopes downwards. The object is…', ['slowing down', 'going back', 'stopped', 'at constant speed'], 'The speed is decreasing.', 'speed-time'],
    ['other-graphs', 'Water is poured steadily into a bowl that is wider at the top. The depth–time graph…', ['gets less steep', 'gets steeper', 'is a straight line', 'is horizontal'], 'Each centimetre needs more water.', 'other-graphs'],
    ['other-graphs', 'A gym costs £20 to join plus £5 per visit. The cost–visits graph is…', ['a straight line starting at £20', 'a straight line through the origin', 'a curve', 'horizontal'], 'Fixed fee plus a constant rate.', 'other-graphs'],
    ['other-graphs', 'Which graph shape shows something increasing more and more quickly?', ['A curve getting steeper', 'A curve getting flatter', 'A straight line', 'A horizontal line'], 'Steeper = faster.', 'other-graphs'],
    ['other-graphs', 'A hot drink cools quickly at first, then more slowly. Temperature–time is…', ['a falling curve that gets flatter', 'a straight falling line', 'a rising curve', 'a horizontal line'], 'The rate of cooling decreases.', 'other-graphs'],
  ],
  LONG: [
    { q: 'A cyclist accelerates from rest to 8 m/s in 10 s, rides at 8 m/s for 40 s, then decelerates to rest in 6 s. (a) Find the acceleration. (b) Find the total distance travelled.', m: 4, s: ['B1 for 0.8 m/s².', 'M1 for splitting the area into shapes.', 'M1 for \\(40 + 320 + 24\\).', 'A1 for 384 m.'], link: ['speed-time', 'See area under the graph again'] },
    { q: 'Water is poured at a steady rate into a container made of a wide cylinder with a narrow cylinder on top. Sketch the graph of depth against time and explain its shape.', m: 2, s: ['B1 for two straight sections, the second steeper.', 'B1 for an explanation: the narrow part fills faster, so the depth rises more quickly.'], link: ['other-graphs', 'See filling containers again'] },
    { q: 'A speed–time graph for a train goes from 15 m/s to 5 m/s in a straight line over 20 seconds. Work out the deceleration and the distance travelled in that time.', m: 3, s: ['B1 for 0.5 m/s².', 'M1 for the area of a trapezium: \\(\\frac{15 + 5}{2} \\times 20\\).', 'A1 for 200 m.'], link: ['speed-time', 'See speed–time graphs again'] },
  ],
});
