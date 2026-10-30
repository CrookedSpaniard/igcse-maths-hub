window.LESSON = {
  id: 'geometric-proof',
  description: 'Interactive maths lesson on geometric reasoning: giving a reason for every angle, using the standard wording of angle facts for lines, triangles, polygons and circles, and writing short geometric proofs. Step-by-step reasoning chains, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 4.7.',
  intro: 'In geometry questions, a correct number is only half the story: you must also say <b>why</b>. In this lesson you will learn the <b>standard reasons</b> examiners expect, build <b>chains of reasoning</b> one angle at a time, and (Higher) write reasons and short <b>proofs</b> with circle theorems.',
  hero: `<svg class="st-net gp-hero" viewBox="0 0 300 200" role="img" aria-label="A chain of reasons ticked off one by one">
    ${[0, 1, 2].map((i) => `<g><rect x="40" y="${30 + i * 52}" width="220" height="38" rx="9" class="gp-b"/><text x="60" y="${55 + i * 52}" class="gp-t">${['x = 65°', 'y = 65°', 'z = 50°'][i]}</text><text x="236" y="${56 + i * 52}" class="gp-k">✓<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${(.2 + i * .2).toFixed(1)};${(.3 + i * .2).toFixed(1)};1" dur="3s" repeatCount="indefinite"/></text></g>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Giving reasons' },
    B: { name: 'Reasons with circles and proofs', tier: 'H' },
  },
  sections: [
    { id: 'reasons', part: 'A', name: 'Standard reasons for angles', short: 'Reasons', icon: 'geometry', color: '--c1', line: 'Name the angle fact for every step.', covers: ['F4.7A'] },
    { id: 'polyreasons', part: 'A', name: 'Reasoning with polygons', short: 'Polygons', icon: 'shapes', color: '--c5', line: 'Chains of facts with regular polygons and isosceles triangles.', covers: ['F4.7A'] },
    { id: 'circleproof', part: 'B', name: 'Reasons with circle theorems', short: 'Circle reasons', icon: 'target', color: '--c6', line: 'Every circle fact needs its standard wording.', covers: ['H4.7A'] },
    { id: 'proofs', part: 'B', name: 'Writing a geometric proof', short: 'Proofs', icon: 'target', color: '--c8', line: 'Show that a result is always true, step by step.', covers: ['H4.7A'] },
  ],
  scenes: ['reasons', 'polyreasons', 'testA', 'circleproof', 'proofs', 'testB'],
};
