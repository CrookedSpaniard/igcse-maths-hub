window.LESSON = {
  id: 'fractions',
  description: 'Interactive maths lesson on fractions: equivalent fractions, simplifying, mixed numbers and improper fractions, adding, subtracting, multiplying and dividing fractions, and fractions of amounts. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.2.',
  intro: 'A <b>fraction</b> is a part of a whole. In this lesson you will see why <b>equivalent fractions</b> are equal, switch between <b>mixed numbers</b> and <b>improper fractions</b>, then learn to <b>add, subtract, multiply and divide</b> fractions and find a <b>fraction of an amount</b>, with no calculator needed.',
  hero: `<svg class="st-net fr-hero" viewBox="0 0 300 200" role="img" aria-label="One half shown as 1 of 2 parts, 2 of 4 parts and 4 of 8 parts">
    ${[2, 4, 8].map((n, r) => Array.from({ length: n }, (_, i) => `<rect x="${20 + (i * 200) / n}" y="${22 + r * 56}" width="${200 / n - 4}" height="38" rx="5" class="${i < n / 2 ? 'fr-on' : 'fr-off'}"><animate attributeName="opacity" values="1;.55;1" dur="3s" begin="${r * .6}s" repeatCount="indefinite"/></rect>`).join('') + `<text x="262" y="${47 + r * 56}" class="fr-lbl">${n / 2}/${n}</text>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Understanding fractions' },
    B: { name: 'Calculating with fractions' },
  },
  sections: [
    { id: 'equivalent', part: 'A', name: 'Equivalent fractions and simplifying', short: 'Equivalent', icon: 'frac', color: '--c4', line: 'Same amount, different numbers. Simplest form using the HCF.' },
    { id: 'mixed', part: 'A', name: 'Mixed numbers and improper fractions', short: 'Mixed numbers', icon: 'frac', color: '--c3', line: 'Converting both ways, and ordering fractions.' },
    { id: 'addsub', part: 'B', name: 'Adding and subtracting fractions', short: 'Add & subtract', icon: 'frac', color: '--c1', line: 'Make the denominators the same first.' },
    { id: 'muldiv', part: 'B', name: 'Multiplying and dividing fractions', short: 'Multiply & divide', icon: 'frac', color: '--c6', line: 'Multiply straight across; to divide, flip and multiply.' },
    { id: 'amounts', part: 'B', name: 'Fractions of amounts', short: 'Of amounts', icon: 'frac', color: '--c8', line: 'Divide by the denominator, multiply by the numerator.' },
  ],
  scenes: ['equivalent', 'mixed', 'testA', 'addsub', 'muldiv', 'amounts', 'testB'],
};
