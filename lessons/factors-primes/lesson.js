window.LESSON = {
  id: 'factors-primes',
  description: 'Interactive maths lesson on factors, multiples and prime numbers: factor pairs, square and cube numbers, prime factor decomposition with factor trees and index notation, and finding the HCF and LCM, including word problems. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.1.',
  intro: 'Every whole number is built from <b>prime numbers</b>, like a wall is built from bricks. In this lesson you will find <b>factors</b> and <b>multiples</b>, break numbers into <b>prime factors</b> with a factor tree, and use them to find the <b>highest common factor (HCF)</b> and the <b>lowest common multiple (LCM)</b>, then solve real problems with them.',
  hero: `<svg class="st-net fp-hero" viewBox="0 0 300 200" role="img" aria-label="A factor tree: 60 splits into 6 and 10, then into the primes 2, 3, 2 and 5">
    <path class="fp-e" d="M150 34L95 92M150 34L205 92M95 92L65 150M95 92L125 150M205 92L175 150M205 92L235 150"/>
    <g class="fp-n"><circle cx="150" cy="34" r="20"/><text x="150" y="40">60</text></g>
    <g class="fp-n"><circle cx="95" cy="92" r="20"/><text x="95" y="98">6</text></g>
    <g class="fp-n"><circle cx="205" cy="92" r="20"/><text x="205" y="98">10</text></g>
    ${[[65, 2], [125, 3], [175, 2], [235, 5]].map(([x, p], i) => `<g class="fp-n fp-p"><circle cx="${x}" cy="150" r="20"><animate attributeName="r" values="20;23;20" dur="2.4s" begin="${i * .4}s" repeatCount="indefinite"/></circle><text x="${x}" y="156">${p}</text></g>`).join('')}
    <text class="fp-t" x="150" y="192">60 = 2² × 3 × 5</text>
  </svg>`,
  parts: {
    A: { name: 'Factors, multiples and primes' },
    B: { name: 'HCF and LCM' },
  },
  sections: [
    { id: 'factors', part: 'A', name: 'Factors, multiples and primes', short: 'Factors', icon: 'number', color: '--c1', line: 'Factor pairs, multiples, primes, square and cube numbers.' },
    { id: 'primefactors', part: 'A', name: 'Prime factor decomposition', short: 'Prime factors', icon: 'number', color: '--c3', line: 'Factor trees and writing a number with index notation.' },
    { id: 'hcflcm', part: 'B', name: 'Finding the HCF and LCM', short: 'HCF & LCM', icon: 'number', color: '--c4', line: 'Listing, and the Venn diagram of prime factors.' },
    { id: 'problems', part: 'B', name: 'HCF and LCM problems', short: 'Problems', icon: 'target', color: '--c6', line: 'Is it HCF or LCM? Sharing, cutting and things that repeat.' },
  ],
  scenes: ['factors', 'primefactors', 'testA', 'hcflcm', 'problems', 'testB'],
};
