window.LESSON = {
  id: 'averages',
  description: 'Interactive maths lesson on averages and range: the mean, median, mode and range of a list, choosing the best average, problems with the mean, averages from frequency tables, and an estimate of the mean and the modal class for grouped data. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.2.',
  intro: 'An <b>average</b> is one number that represents a whole set of data. In this lesson you will find the <b>mean, median and mode</b> and the <b>range</b>, decide which average is best, solve problems with the mean, and work out averages from <b>frequency tables</b>, including an <b>estimate of the mean</b> for grouped data.',
  hero: `<svg class="st-net av-hero" viewBox="0 0 300 200" role="img" aria-label="Uneven stacks of blocks levelling out to the mean">
    ${[[2, 5], [5, 5], [3, 5], [6, 5], [4, 5]].map(([h, m], i) => Array.from({ length: Math.max(h, m) }, (_, k) => `<rect x="${40 + i * 46}" y="${160 - (k + 1) * 22}" width="36" height="19" rx="3" class="${k < h ? 'av-b' : 'av-g'}"><animate attributeName="opacity" values="${k < h ? '1;1;1' : '0;0;1'}" dur="4s" repeatCount="indefinite"/></rect>`).join('')).join('')}
    <line x1="30" y1="${160 - 4 * 22}" x2="270" y2="${160 - 4 * 22}" class="av-m"/>
    <text x="150" y="190" class="av-l">mean = 4</text>
  </svg>`,
  parts: {
    A: { name: 'Averages of a list' },
    B: { name: 'Averages from tables' },
  },
  sections: [
    { id: 'measures', part: 'A', name: 'Mean, median, mode and range', short: 'MMMR', icon: 'stats', color: '--c4', covers: ['F6.2A', 'F6.2B'], line: 'Four ways to sum up a list, and which average to use.' },
    { id: 'meanprob', part: 'A', name: 'Problems with the mean', short: 'Mean problems', icon: 'target', color: '--c1', covers: ['F6.2A', 'F6.2B'], line: 'Total = mean × number of values.' },
    { id: 'freqtable', part: 'B', name: 'Averages from a frequency table', short: 'Frequency tables', icon: 'stats', color: '--c3', covers: ['F6.2B'], line: 'Add an fx column; find where the middle value lies.' },
    { id: 'grouped', part: 'B', name: 'Grouped data', short: 'Grouped', icon: 'stats', color: '--c6', covers: ['F6.2C', 'F6.2D'], line: 'Use midpoints to estimate the mean; the modal class.' },
  ],
  scenes: ['measures', 'meanprob', 'testA', 'freqtable', 'grouped', 'testB'],
};
