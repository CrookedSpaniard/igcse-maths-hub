window.LESSON = {
  id: 'powers-roots',
  description: 'Interactive maths lesson on powers and roots: square and cube numbers, square and cube roots, estimating roots, index notation, the laws of indices for multiplying, dividing and raising powers to a power, and zero, negative and fractional indices (Higher). Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.4.',
  intro: 'A <b>power</b> is a short way to write repeated multiplication: \\(2 \\times 2 \\times 2 \\times 2 \\times 2 = 2^5\\). In this lesson you will build <b>squares and cubes</b>, undo them with <b>roots</b>, and learn the <b>laws of indices</b> that make powers easy to multiply and divide. You will also find out what <b>zero and negative</b> powers mean. Higher tier: <b>fractional</b> powers.',
  hero: `<svg class="st-net pw-hero" viewBox="0 0 300 200" role="img" aria-label="Squares of side 1, 2 and 3 and the powers 1, 4 and 9">
    ${[1, 2, 3].map((n, k) => { const s = 22, x0 = [30, 80, 160][k], y0 = 150 - n * s; let g = ''; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += `<rect x="${x0 + i * s}" y="${y0 + j * s}" width="${s - 3}" height="${s - 3}" rx="3" class="pw-sq"><animate attributeName="opacity" values=".35;1;1" dur="3s" begin="${(i + j) * 0.15 + k * 0.4}s" repeatCount="indefinite"/></rect>`; return g + `<text x="${x0 + (n * s) / 2}" y="180" class="pw-l">${n}² = ${n * n}</text>`; }).join('')}
    <text x="262" y="70" class="pw-big">x²</text>
  </svg>`,
  parts: {
    A: { name: 'Powers and roots' },
    B: { name: 'Laws of indices, zero and negative powers' },
    C: { name: 'Fractional indices', tier: 'H' },
  },
  sections: [
    { id: 'squares', part: 'A', name: 'Squares, cubes and roots', short: 'Squares & roots', icon: 'shapes', color: '--c4', covers: ['F1.4A', 'F1.4B'], line: 'Square and cube numbers, their roots, and estimating roots.' },
    { id: 'notation', part: 'A', name: 'Index notation', short: 'Index notation', icon: 'number', color: '--c1', covers: ['F1.4C'], line: 'Base and index; working out powers; writing products with powers.' },
    { id: 'laws', part: 'B', name: 'The laws of indices', short: 'Index laws', icon: 'algebra', color: '--c3', covers: ['F1.4C'], line: 'Multiply: add the indices. Divide: subtract. Power of a power: multiply.' },
    { id: 'negzero', part: 'B', name: 'Zero and negative indices', short: 'Zero & negative', icon: 'algebra', color: '--c6', covers: ['F1.4C'], line: '\\(a^0 = 1\\) and \\(a^{-n} = \\frac{1}{a^n}\\).' },
    { id: 'fractional', part: 'C', name: 'Fractional indices', short: 'Fractional', icon: 'algebra', color: '--c8', covers: ['H1.4C'], line: '\\(a^{\\frac1n}\\) is a root; \\(a^{\\frac mn}\\): root first, then power.', tier: 'H' },
  ],
  scenes: ['squares', 'notation', 'testA', 'laws', 'negzero', 'testB', 'fractional', 'testC'],
};
