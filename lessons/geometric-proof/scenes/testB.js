FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['circleproof', '\\(O\\) is the centre; \\(A\\), \\(B\\) on the circle. Triangle \\(OAB\\) is isosceles because…', ['\\(OA\\) and \\(OB\\) are radii', '\\(AB\\) is a tangent', 'it is in a semicircle', 'angles in the same segment are equal'], 'Radii are equal.', 'circleproof'],
    ['circleproof', '\\(AB\\) is a diameter and \\(C\\) is on the circle. \\(\\angle ACB = 90^\\circ\\) because…', ['the angle in a semicircle is 90°', 'a tangent is perpendicular to the radius', 'opposite angles of a cyclic quadrilateral add up to 180°', 'angles in a triangle add up to 180°'], 'Semicircle.', 'circleproof'],
    ['circleproof', 'A tangent makes \\(70^\\circ\\) with a chord. The angle in the alternate segment is…', ['\\(70^\\circ\\)', '\\(20^\\circ\\)', '\\(110^\\circ\\)', '\\(140^\\circ\\)'], 'Alternate segment theorem.', 'circleproof'],
    ['circleproof', 'Tangent at \\(A\\), centre \\(O\\), chord \\(AB\\), tangent–chord angle \\(55^\\circ\\). \\(\\angle OAB =\\)', ['\\(35^\\circ\\)', '\\(55^\\circ\\)', '\\(110^\\circ\\)', '\\(70^\\circ\\)'], 'Tangent ⟂ radius: \\(90 - 55\\).', 'circleproof'],
    ['proofs', 'In a proof you may NOT…', ['measure angles on the diagram', 'use letters for angles', 'use facts you already know', 'write one step per line'], 'Measurement is not proof.', 'proofs'],
    ['proofs', 'The exterior angle of a triangle equals…', ['the sum of the two opposite interior angles', 'the adjacent interior angle', '180°', 'half the opposite angle'], 'Exterior angle property.', 'proofs'],
    ['proofs', '\\(OA = OC\\) and \\(\\angle OCA = x\\). The exterior angle of triangle \\(OAC\\) at \\(O\\) is…', ['\\(2x\\)', '\\(x\\)', '\\(180 - x\\)', '\\(90 - x\\)'], '\\(x + x\\).', 'proofs'],
    ['proofs', 'Showing a result is true with one example…', ['is not a proof', 'is always a proof', 'is a proof for circles only', 'is a proof if the numbers are big'], 'A proof must cover every case.', 'proofs'],
  ],
  LONG: [
    { q: '\\(A\\), \\(B\\), \\(C\\) are points on a circle with centre \\(O\\). \\(TA\\) is the tangent at \\(A\\). The angle between \\(TA\\) and chord \\(AB\\) is \\(48^\\circ\\). Work out \\(\\angle AOB\\) and \\(\\angle OBA\\). Give reasons for each stage of your working.', m: 4, s: ['B1 \\(\\angle ACB = 48^\\circ\\) (alternate segment theorem), or \\(\\angle OAB = 42^\\circ\\) (tangent ⟂ radius).', 'B1 \\(\\angle AOB = 96^\\circ\\) (angle at the centre is twice the angle at the circumference).', 'B1 \\(\\angle OBA = 42^\\circ\\).', 'B1 reason: base angles of an isosceles triangle are equal (OA = OB, radii).'], link: ['circleproof', 'See reasons with circles again'] },
    { q: '\\(ABCD\\) is a cyclic quadrilateral. Prove that \\(\\angle ABC + \\angle ADC = 180^\\circ\\), using the theorem that the angle at the centre is twice the angle at the circumference.', m: 3, s: ['M1 join \\(OA\\), \\(OC\\); let \\(\\angle ABC = x\\), so the angle at the centre on that side is \\(2x\\).', 'M1 the reflex angle at the centre is \\(360 - 2x\\), so \\(\\angle ADC = 180 - x\\).', 'A1 \\(x + 180 - x = 180^\\circ\\), with reasons.'], link: ['proofs', 'See writing a proof again'] },
    { q: '\\(PA\\) and \\(PB\\) are tangents from \\(P\\) to a circle with centre \\(O\\). Prove that \\(OP\\) bisects \\(\\angle APB\\).', m: 3, s: ['B1 \\(\\angle OAP = \\angle OBP = 90^\\circ\\) (tangent ⟂ radius) and \\(OA = OB\\) (radii).', 'B1 \\(PA = PB\\) (tangents from a point are equal) and \\(OP\\) is common, so triangles \\(OAP\\) and \\(OBP\\) are congruent (SSS).', 'B1 so \\(\\angle APO = \\angle BPO\\): \\(OP\\) bisects \\(\\angle APB\\).'], link: ['circleproof', 'See tangents again'] },
  ],
});
