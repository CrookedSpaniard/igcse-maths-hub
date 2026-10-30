FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['triangles', 'Two angles of a triangle are \\(64^\\circ\\) and \\(49^\\circ\\). The third angle is…', ['\\(67^\\circ\\)', '\\(113^\\circ\\)', '\\(77^\\circ\\)', '\\(247^\\circ\\)'], '\\(180 - 64 - 49 = 67\\).', 'triangles'],
    ['triangles', 'An isosceles triangle has an apex angle of \\(28^\\circ\\). Each base angle is…', ['\\(76^\\circ\\)', '\\(28^\\circ\\)', '\\(152^\\circ\\)', '\\(62^\\circ\\)'], '\\((180 - 28) \\div 2 = 76\\).', 'triangles'],
    ['triangles', 'Each angle of an equilateral triangle is…', ['\\(60^\\circ\\)', '\\(90^\\circ\\)', '\\(45^\\circ\\)', '\\(180^\\circ\\)'], '\\(180 \\div 3 = 60\\).', 'triangles'],
    ['triangles', 'The exterior angle of a triangle equals…', ['the sum of the two opposite interior angles', 'the interior angle next to it', '180° minus the two opposite angles', '360° minus the interior angle'], 'Exterior angle = sum of the two opposite interior angles.', 'triangles'],
    ['triangles', 'A right-angled triangle has an angle of \\(34^\\circ\\). The third angle is…', ['\\(56^\\circ\\)', '\\(66^\\circ\\)', '\\(146^\\circ\\)', '\\(34^\\circ\\)'], '\\(180 - 90 - 34 = 56\\).', 'triangles'],
    ['problems', 'Triangle \\(ABC\\) is isosceles with \\(AB = AC\\) and \\(\\angle B = 52^\\circ\\). \\(\\angle A\\) is…', ['\\(76^\\circ\\)', '\\(52^\\circ\\)', '\\(64^\\circ\\)', '\\(128^\\circ\\)'], '\\(\\angle C = 52^\\circ\\) too, so \\(180 - 104 = 76\\).', 'problems'],
    ['problems', 'Which reason gets the mark in an exam?', ['Angles in a triangle add up to 180°', 'Triangle rule', 'It adds to 180', 'Because of the triangle'], 'Write the full angle fact.', 'problems'],
    ['problems', 'In triangle \\(PQR\\), \\(\\angle P = 41^\\circ\\) and \\(\\angle Q = 63^\\circ\\). The reflex angle at \\(R\\) is…', ['\\(284^\\circ\\)', '\\(76^\\circ\\)', '\\(256^\\circ\\)', '\\(104^\\circ\\)'], '\\(\\angle R = 76^\\circ\\); reflex \\(= 360 - 76 = 284\\).', 'problems'],
  ],
  LONG: [
    { q: 'The angles of a triangle are \\(x\\), \\(x + 25\\) and \\(2x - 5\\) (all in degrees). Work out the size of the largest angle.', m: 3, s: ['M1 for \\(x + x + 25 + 2x - 5 = 180\\).', 'M1 for \\(4x = 160\\), so \\(x = 40\\).', 'A1 for \\(75^\\circ\\).'], link: ['triangles', 'See the angle sum of a triangle again'] },
    { q: 'Triangle \\(ABC\\) is isosceles with \\(AB = AC\\). \\(\\angle BAC = 44^\\circ\\). The side \\(BC\\) is extended to \\(D\\). Work out \\(\\angle ACD\\). Give a reason for each stage of your working.', m: 4, s: ['M1 for \\((180 - 44) \\div 2 = 68^\\circ\\).', 'B1 for “base angles of an isosceles triangle are equal” (and angles in a triangle add up to 180°).', 'A1 for \\(\\angle ACD = 112^\\circ\\).', 'B1 for “angles on a straight line add up to 180°”.'], link: ['problems', 'See worked example 2 again'] },
    { q: '\\(AB\\) is parallel to \\(CD\\). A triangle \\(PQR\\) has \\(P\\) on \\(AB\\) and \\(Q\\), \\(R\\) on \\(CD\\). The angle between \\(AB\\) and \\(PQ\\) is \\(58^\\circ\\), and \\(\\angle PRQ = 71^\\circ\\). Work out \\(\\angle QPR\\), giving reasons.', m: 4, s: ['B1 for \\(\\angle PQR = 58^\\circ\\).', 'B1 for “alternate angles are equal”.', 'M1 for \\(180 - 58 - 71\\).', 'A1 for \\(51^\\circ\\) with “angles in a triangle add up to 180°”.'], link: ['problems', 'See worked example 1 again'] },
  ],
});
