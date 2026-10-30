FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['lines', '\\(83\\) mm is the same as…', ['8.3 cm', '0.83 cm', '83 cm', '8.03 cm'], '\\(\\div 10\\).', 'lines'],
    ['lines', 'A line starts at the 2.4 cm mark and ends at the 9.1 cm mark. Its length is…', ['6.7 cm', '11.5 cm', '7.7 cm', '6.3 cm'], '\\(9.1 - 2.4\\).', 'lines'],
    ['lines', 'A length "to the nearest millimetre" of 5.27 cm is written…', ['53 mm', '52 mm', '5 mm', '527 mm'], '\\(52.7\\) mm rounds to 53 mm.', 'lines'],
    ['lines', 'Each small mark on a centimetre ruler is…', ['1 mm', '1 cm', '0.1 mm', '10 mm'], 'There are 10 small marks in each centimetre.', 'lines'],
    ['triangles', 'Which three lengths can make a triangle?', ['5 cm, 6 cm, 9 cm', '2 cm, 3 cm, 7 cm', '4 cm, 4 cm, 9 cm', '1 cm, 2 cm, 3 cm'], 'The two shorter sides must add up to more than the longest.', 'triangles'],
    ['triangles', 'To construct a triangle from three sides you need…', ['a ruler and compasses', 'a protractor only', 'compasses only', 'a protractor and compasses'], 'Ruler for the base, compasses for the arcs.', 'triangles'],
    ['triangles', 'To construct a triangle with two sides and the included angle you need…', ['a ruler and a protractor', 'compasses only', 'a protractor only', 'nothing but a ruler'], 'Measure the lengths and the angle.', 'triangles'],
    ['triangles', 'A constructed triangle has angles \\(35^\\circ\\) and \\(95^\\circ\\). The third should measure…', ['\\(50^\\circ\\)', '\\(60^\\circ\\)', '\\(130^\\circ\\)', '\\(230^\\circ\\)'], '\\(180 - 130\\).', 'triangles'],
  ],
  LONG: [
    { q: 'Describe, step by step, how to construct triangle \\(PQR\\) with \\(PQ = 8\\) cm, \\(QR = 5\\) cm and \\(PR = 6.5\\) cm using a ruler and compasses.', m: 3, s: ['B1 for drawing \\(PQ = 8\\) cm with a ruler.', 'B1 for arcs of radius 6.5 cm from \\(P\\) and 5 cm from \\(Q\\) that cross at \\(R\\).', 'B1 for joining \\(R\\) to \\(P\\) and \\(Q\\), leaving the arcs showing.'], link: ['triangles', 'See the three-sides construction again'] },
    { q: 'Explain why it is impossible to construct a triangle with sides 3 cm, 4 cm and 8 cm.', m: 2, s: ['M1 for comparing \\(3 + 4 = 7\\) with \\(8\\).', 'A1 for: 7 is less than 8, so the arcs from the ends of the 8 cm side cannot meet.'], link: ['triangles', 'See the Try it again'] },
    { q: 'A triangle has \\(AB = 7\\) cm, \\(\\angle A = 45^\\circ\\) and \\(\\angle B = 60^\\circ\\). (a) Which instruments do you need to construct it? (b) What size will \\(\\angle C\\) be?', m: 2, s: ['B1 (a) a ruler and a protractor.', 'B1 (b) \\(75^\\circ\\).'], link: ['triangles', 'See two angles and a side again'] },
  ],
});
