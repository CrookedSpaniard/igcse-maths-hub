FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['parts', 'A line joining two points on a circle is a…', ['chord', 'tangent', 'radius', 'sector'], 'Chord.', 'parts'],
    ['parts', 'The region between two radii and an arc is a…', ['sector', 'segment', 'chord', 'tangent'], 'Sector.', 'parts'],
    ['parts', 'A circle has radius 6.5 cm. Its diameter is…', ['13 cm', '3.25 cm', '6.5 cm', '42.25 cm'], '\\(2 \\times 6.5\\).', 'parts'],
    ['parts', 'A line that touches a circle at exactly one point is a…', ['tangent', 'chord', 'diameter', 'arc'], 'Tangent.', 'parts'],
    ['tangents', 'The angle between a tangent and the radius at the point of contact is…', ['\\(90^\\circ\\)', '\\(180^\\circ\\)', '\\(60^\\circ\\)', 'it varies'], 'Tangent ⟂ radius.', 'tangents'],
    ['tangents', 'Two tangents from \\(P\\) touch a circle at \\(A\\) and \\(B\\). Then…', ['\\(PA = PB\\)', '\\(PA = 2PB\\)', '\\(PA \\perp PB\\)', '\\(PA\\) is a diameter'], 'Tangents from a point are equal.', 'tangents'],
    ['tangents', 'Tangents \\(PA\\), \\(PB\\); centre \\(O\\); \\(\\angle APB = 40^\\circ\\). \\(\\angle AOB =\\)', ['\\(140^\\circ\\)', '\\(40^\\circ\\)', '\\(80^\\circ\\)', '\\(320^\\circ\\)'], '\\(360 - 90 - 90 - 40\\).', 'tangents'],
    ['tangents', 'A chord is 18 cm long. The perpendicular from the centre cuts it into two parts of…', ['9 cm each', '6 cm and 12 cm', '18 cm each', '3 cm each'], 'It bisects the chord.', 'tangents'],
  ],
  LONG: [
    { q: '\\(PT\\) is a tangent to a circle, centre \\(O\\), at \\(T\\). \\(\\angle TPO = 28^\\circ\\). Work out \\(\\angle TOP\\). Give a reason for each stage of your working.', m: 3, s: ['B1 \\(\\angle OTP = 90^\\circ\\).', 'B1 reason: the tangent is perpendicular to the radius.', 'B1 \\(\\angle TOP = 62^\\circ\\) (angles in a triangle add up to 180°).'], link: ['tangents', 'See tangent and radius again'] },
    { q: 'Tangents from \\(P\\) touch a circle with centre \\(O\\) at \\(A\\) and \\(B\\). \\(\\angle AOB = 124^\\circ\\). (a) Work out \\(\\angle APB\\). (b) What type of triangle is \\(PAB\\)? Give a reason.', m: 3, s: ['M1 \\(360 - 90 - 90 - 124\\).', 'A1 (a) \\(56^\\circ\\).', 'B1 (b) isosceles, because tangents from a point are equal (PA = PB).'], link: ['tangents', 'See two tangents again'] },
    { q: 'Explain the difference between a sector and a segment of a circle.', m: 2, s: ['B1 sector: bounded by two radii and an arc.', 'B1 segment: bounded by a chord and an arc.'], link: ['parts', 'See sectors and segments again'] },
  ],
});
