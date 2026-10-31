FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['stationary', 'At a stationary point, \\(\\frac{dy}{dx}\\) is…', ['0', '1', 'negative', 'undefined'], 'The tangent is flat.', 'stationary'],
    ['stationary', 'The turning point of \\(y = x^2 - 6x\\) has \\(x\\)-coordinate…', ['3', '6', '−3', '0'], '\\(2x - 6 = 0\\).', 'stationary'],
    ['stationary', 'The turning point of \\(y = 10x - x^2\\) is a…', ['maximum', 'minimum', 'root', 'asymptote'], '∩ shape.', 'stationary'],
    ['stationary', 'The stationary points of \\(y = x^3 - 12x\\) are at…', ['\\(x = \\pm 2\\)', '\\(x = \\pm 12\\)', '\\(x = 0\\)', '\\(x = \\pm 4\\)'], '\\(3x^2 = 12\\).', 'stationary'],
    ['kinematics', '\\(s = t^3 + 2t\\). The velocity at \\(t = 2\\) is…', ['14 m/s', '12 m/s', '10 m/s', '8 m/s'], '\\(3t^2 + 2\\).', 'kinematics'],
    ['kinematics', '\\(v = 4t^2 - 3\\). The acceleration at \\(t = 1\\) is…', ['8 m/s²', '1 m/s²', '4 m/s²', '5 m/s²'], '\\(a = 8t\\).', 'kinematics'],
    ['kinematics', 'A particle is momentarily at rest when…', ['\\(v = 0\\)', '\\(s = 0\\)', '\\(a = 0\\)', '\\(t = 0\\)'], 'Velocity zero.', 'kinematics'],
    ['kinematics', 'Acceleration is…', ['the rate of change of velocity', 'the rate of change of time', 'velocity × time', 'displacement ÷ time'], '\\(a = \\frac{dv}{dt}\\).', 'kinematics'],
  ],
  LONG: [
    { q: 'Find the coordinates of the stationary points of \\(y = x^3 - 3x^2 - 9x + 2\\) and say whether each is a maximum or a minimum.', m: 5, s: ['M1 for \\(\\frac{dy}{dx} = 3x^2 - 6x - 9\\).', 'M1 for setting it to 0 and solving: \\((x - 3)(x + 1) = 0\\).', 'A1 for \\(x = -1\\) and \\(x = 3\\).', 'A1 for \\((-1, 7)\\) and \\((3, -25)\\).', 'B1 for \\((-1, 7)\\) maximum, \\((3, -25)\\) minimum.'], link: ['stationary', 'See stationary points again'] },
    { q: 'A particle moves so that \\(s = 2t^3 - 9t^2 + 12t\\). (a) Find an expression for its velocity. (b) Find the times when it is at rest. (c) Find its acceleration when \\(t = 3\\).', m: 5, s: ['B1 for \\(v = 6t^2 - 18t + 12\\).', 'M1 for \\(6t^2 - 18t + 12 = 0\\).', 'A1 for \\(t = 1\\) and \\(t = 2\\).', 'M1 for \\(a = 12t - 18\\).', 'A1 for 18 m/s².'], link: ['kinematics', 'See kinematics again'] },
    { q: 'A farmer uses 40 m of fencing to make three sides of a rectangular pen against a wall. The width is \\(x\\) m, so the area is \\(A = x(40 - 2x)\\). Find the maximum area.', m: 4, s: ['M1 for \\(A = 40x - 2x^2\\) and \\(\\frac{dA}{dx} = 40 - 4x\\).', 'M1 for \\(40 - 4x = 0\\).', 'A1 for \\(x = 10\\).', 'A1 for 200 m².'], link: ['stationary', 'See maxima in problems again'] },
  ],
});
