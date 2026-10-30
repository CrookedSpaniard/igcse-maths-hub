window.LESSON = {
  id: 'applying-number',
  description: 'Interactive maths lesson on applying number in everyday life: money problems such as bills, wages and currency conversion, time calculations with the 12- and 24-hour clock and timetables, converting metric units of length, mass, capacity, area and volume, and using a scientific calculator efficiently. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specifications 1.10 and 1.11.',
  intro: 'Maths you use every day: working out a <b>bill</b> or a <b>wage</b>, changing <b>currency</b>, reading a <b>timetable</b>, converting <b>units</b> such as cm and m or cm² and m², and using a <b>scientific calculator</b> without mistakes.',
  hero: `<svg class="st-net an-hero" viewBox="0 0 300 200" role="img" aria-label="A calculator with keys lighting up">
    <rect x="95" y="20" width="110" height="165" rx="12" class="an-body"/>
    <rect x="107" y="32" width="86" height="30" rx="4" class="an-scr"/>
    <text x="187" y="54" class="an-d">3.65</text>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${110 + (i % 3) * 28}" y="${74 + Math.floor(i / 3) * 27}" width="22" height="20" rx="4" class="an-k"><animate attributeName="opacity" values="1;.35;1" dur="2.4s" begin="${(i * 0.2) % 2.4}s" repeatCount="indefinite"/></rect>`).join('')}
  </svg>`,
  parts: {
    A: { name: 'Money and time' },
    B: { name: 'Units and calculators' },
  },
  sections: [
    { id: 'money', part: 'A', name: 'Money: bills, wages and currencies', short: 'Money', icon: 'calc', color: '--c4', covers: ['F1.10A', 'F1.10C'], line: 'Bills and receipts, hourly pay and overtime, converting currencies.' },
    { id: 'time', part: 'A', name: 'Time and timetables', short: 'Time', icon: 'graph', color: '--c1', covers: ['F1.10C', 'F1.10A'], line: '12- and 24-hour clock, durations, timetables and hours as decimals.' },
    { id: 'units', part: 'B', name: 'Metric units', short: 'Units', icon: 'shapes', color: '--c3', covers: ['F1.10B', 'F1.10A'], line: 'Length, mass and capacity; area and volume units.' },
    { id: 'calculator', part: 'B', name: 'Using a scientific calculator', short: 'Calculator', icon: 'calc', color: '--c6', covers: ['F1.11A'], line: 'Brackets, fractions, powers and roots; reading and rounding the display.' },
  ],
  scenes: ['money', 'time', 'testA', 'units', 'calculator', 'testB'],
};
