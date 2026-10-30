window.LESSON = {
  id: 'decimals',
  description: 'Interactive maths lesson on decimals: decimal place value, ordering decimals, multiplying and dividing by powers of 10, calculating with decimals, converting between fractions and decimals, terminating and recurring decimals, and converting recurring decimals to fractions (Higher). Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.3.',
  intro: 'A <b>decimal</b> is another way to write a fraction: the digits after the point are tenths, hundredths and thousandths. In this lesson you will use <b>place value</b> to order and calculate with decimals, switch between <b>fractions and decimals</b>, and find out why some fractions give <b>recurring decimals</b> that go on for ever. Higher tier: turn a recurring decimal back into a fraction.',
  hero: `<svg class="st-net dc-hero" viewBox="0 0 300 200" role="img" aria-label="A hundred square with 37 squares shaded: 0.37">
    ${Array.from({ length: 100 }, (_, i) => `<rect x="${40 + (i % 10) * 13}" y="${30 + Math.floor(i / 10) * 13}" width="12" height="12" class="${(i % 10) * 10 + Math.floor(i / 10) < 37 ? 'dc-on' : 'dc-off'}"/>`).join('')}
    <text x="232" y="96" class="dc-l">0.37</text>
    <text x="232" y="124" class="dc-s">37 hundredths</text>
    <rect x="40" y="30" width="38" height="130" class="dc-scan"><animate attributeName="opacity" values="0;.35;0" dur="3s" repeatCount="indefinite"/></rect>
  </svg>`,
  parts: {
    A: { name: 'Working with decimals' },
    B: { name: 'Fractions and decimals' },
    C: { name: 'Recurring decimals to fractions', tier: 'H' },
  },
  sections: [
    { id: 'placevalue', part: 'A', name: 'Decimal place value and powers of 10', short: 'Place value', icon: 'number', color: '--c4', line: 'Tenths, hundredths, thousandths; ordering; × and ÷ by 10, 100, 1000.' },
    { id: 'calc', part: 'A', name: 'Calculating with decimals', short: 'Calculating', icon: 'calc', color: '--c1', line: 'Line up the points to add; count decimal places to multiply.' },
    { id: 'convert', part: 'B', name: 'Converting fractions and decimals', short: 'Converting', icon: 'frac', color: '--c3', line: 'Place value one way, division the other.' },
    { id: 'recurring', part: 'B', name: 'Terminating and recurring decimals', short: 'Recurring', icon: 'frac', color: '--c6', line: 'Dot notation, and which fractions give recurring decimals.' },
    { id: 'rec2frac', part: 'C', name: 'Recurring decimals to fractions', short: 'To fractions', icon: 'algebra', color: '--c8', line: 'Multiply by 10, 100 or 1000 and subtract to remove the tail.', tier: 'H' },
  ],
  scenes: ['placevalue', 'calc', 'testA', 'convert', 'recurring', 'testB', 'rec2frac', 'testC'],
};
