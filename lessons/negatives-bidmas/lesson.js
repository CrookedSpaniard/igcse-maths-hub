window.LESSON = {
  id: 'negatives-bidmas',
  description: 'Interactive maths lesson on integers and directed numbers: place value, ordering negative numbers, adding, subtracting, multiplying and dividing negative numbers, and the order of operations (BIDMAS) with brackets and powers. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.1.',
  intro: 'Temperatures below zero, money you owe, floors below the ground: these are <b>negative numbers</b>. In this lesson you will order them on a <b>number line</b>, learn to <b>add, subtract, multiply and divide</b> them, and use <b>BIDMAS</b> so that everybody gets the same answer to the same calculation.',
  hero: `<svg class="st-net nb-hero" viewBox="0 0 300 200" role="img" aria-label="A number line from minus 5 to 5 with a jump from 3 back to minus 2">
    <line x1="20" y1="130" x2="280" y2="130" class="nb-ax"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${30 + i * 24}" y1="124" x2="${30 + i * 24}" y2="136" class="nb-ax"/><text x="${30 + i * 24}" y="156" class="nb-t">${i - 5 < 0 ? '−' + (5 - i) : i - 5}</text>`).join('')}
    <path d="M222 122Q162 40 102 122" class="nb-arc"><animate attributeName="stroke-dashoffset" values="200;0;0" dur="3s" repeatCount="indefinite"/></path>
    <circle cx="102" cy="130" r="8" class="nb-dot"><animate attributeName="opacity" values="0;0;1" dur="3s" repeatCount="indefinite"/></circle>
    <text x="162" y="60" class="nb-l">3 − 5 = −2</text>
  </svg>`,
  parts: {
    A: { name: 'Directed numbers' },
    B: { name: 'Order of operations' },
  },
  sections: [
    { id: 'integers', part: 'A', name: 'Place value and ordering integers', short: 'Ordering', icon: 'number', color: '--c4', line: 'The value of each digit, the number line and the signs < and >.' },
    { id: 'addsub', part: 'A', name: 'Adding and subtracting negative numbers', short: 'Add & subtract', icon: 'number', color: '--c1', line: 'Jumps on the number line; two minus signs together make a plus.' },
    { id: 'muldiv', part: 'A', name: 'Multiplying and dividing negative numbers', short: 'Multiply & divide', icon: 'number', color: '--c6', line: 'Same signs give a positive, different signs give a negative.' },
    { id: 'bidmas', part: 'B', name: 'The order of operations (BIDMAS)', short: 'BIDMAS', icon: 'calc', color: '--c3', line: 'Brackets, Indices, Division and Multiplication, Addition and Subtraction.' },
    { id: 'brackets', part: 'B', name: 'Brackets, powers and negatives', short: 'Brackets', icon: 'calc', color: '--c8', line: '\\((-3)^2\\) or \\(-3^2\\)? Fraction lines and placing brackets.' },
  ],
  scenes: ['integers', 'addsub', 'muldiv', 'testA', 'bidmas', 'brackets', 'testB'],
};
