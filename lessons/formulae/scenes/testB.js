// Questions on the Higher-only section (subject-h) come last; FD.tierTest drops them for Foundation students.
FD.tierTest({
  id: 'testB',
  part: 'B',
  Q: [
    ['subject', 'Make \\(x\\) the subject of \\(y = x - 8\\).', ['\\(x = y + 8\\)', '\\(x = y - 8\\)', '\\(x = 8 - y\\)', '\\(x = 8y\\)'], 'Add 8 to both sides.', 'subject'],
    ['subject', 'Make \\(n\\) the subject of \\(m = 6n + 1\\).', ['\\(n = \\frac{m - 1}{6}\\)', '\\(n = \\frac{m}{6} - 1\\)', '\\(n = 6m - 1\\)', '\\(n = \\frac{m + 1}{6}\\)'], 'Subtract 1, then divide by 6.', 'subject'],
    ['subject', 'Make \\(w\\) the subject of \\(A = lw\\).', ['\\(w = \\frac{A}{l}\\)', '\\(w = A - l\\)', '\\(w = Al\\)', '\\(w = \\frac{l}{A}\\)'], 'Divide by \\(l\\).', 'subject'],
    ['subject', 'Make \\(t\\) the subject of \\(v = u + at\\).', ['\\(t = \\frac{v - u}{a}\\)', '\\(t = \\frac{v}{a} - u\\)', '\\(t = v - u - a\\)', '\\(t = \\frac{u - v}{a}\\)'], 'Subtract \\(u\\), then divide by \\(a\\).', 'subject'],
    ['subject', 'Make \\(p\\) the subject of \\(q = 3(p - 2)\\).', ['\\(p = \\frac{q}{3} + 2\\)', '\\(p = \\frac{q + 2}{3}\\)', '\\(p = 3q + 2\\)', '\\(p = \\frac{q}{3} - 2\\)'], 'Divide by 3, then add 2.', 'subject'],
    ['subject', 'Make \\(r\\) the subject of \\(A = \\pi r^2\\), where \\(r > 0\\).', ['\\(r = \\sqrt{\\frac{A}{\\pi}}\\)', '\\(r = \\frac{A}{\\pi}\\)', '\\(r = \\sqrt{A} - \\pi\\)', '\\(r = \\frac{\\sqrt{A}}{\\pi}\\)'], 'Divide by π, then square root.', 'subject'],
    ['subject-h', 'Make \\(x\\) the subject of \\(ax = bx + c\\).', ['\\(x = \\frac{c}{a - b}\\)', '\\(x = \\frac{c}{a + b}\\)', '\\(x = \\frac{c - b}{a}\\)', '\\(x = c(a - b)\\)'], '\\(ax - bx = c\\), \\(x(a - b) = c\\).', 'subject-h'],
    ['subject-h', 'Make \\(h\\) the subject of \\(y = \\sqrt{h - 3}\\).', ['\\(h = y^2 + 3\\)', '\\(h = \\sqrt{y} + 3\\)', '\\(h = (y + 3)^2\\)', '\\(h = y^2 - 3\\)'], 'Square: \\(y^2 = h - 3\\).', 'subject-h'],
  ],
  LONG: [
    { q: 'Make \\(c\\) the subject of \\(a = \\dfrac{3c - 2}{5}\\).', m: 2, s: ['M1 for a correct first step, e.g. \\(5a = 3c - 2\\).', 'A1 for \\(c = \\dfrac{5a + 2}{3}\\).'], link: ['subject', 'See changing the subject again'] },
    { q: 'Make \\(d\\) the subject of \\(P = 4d - 3e\\).', m: 2, s: ['M1 for \\(P + 3e = 4d\\).', 'A1 for \\(d = \\dfrac{P + 3e}{4}\\).'], link: ['subject', 'See inverse operations again'] },
    { q: 'Make \\(x\\) the subject of \\(y = \\dfrac{2x + 1}{x - 4}\\).', m: 4, h: true, s: ['M1 for \\(y(x - 4) = 2x + 1\\).', 'M1 for collecting \\(x\\) terms: \\(xy - 2x = 4y + 1\\).', 'M1 for factorising: \\(x(y - 2) = 4y + 1\\).', 'A1 for \\(x = \\dfrac{4y + 1}{y - 2}\\).'], link: ['subject-h', 'See harder rearranging again'] },
  ],
});
