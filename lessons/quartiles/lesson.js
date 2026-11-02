window.LESSON = {
  id: 'quartiles',
  description: 'Interactive maths lesson on quartiles and the interquartile range (Higher tier): measures of spread, the range and the interquartile range, quartiles of a discrete data set, estimating the median, quartiles and interquartile range from a cumulative frequency graph, and comparing distributions with box plots. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.2.',
  intro: 'An average tells you about the middle of the data; a <b>measure of spread</b> tells you how spread out it is. In this lesson you will find the <b>quartiles</b> and the <b>interquartile range</b> of a list, estimate the <b>median</b> and quartiles from a <b>cumulative frequency graph</b>, and compare two sets of data using an average and a spread.',
  hero: `<svg class="st-net qu-hero" viewBox="0 0 300 200" role="img" aria-label="A box plot with its median line">
    <line x1="30" y1="100" x2="90" y2="100" class="qu-l"/><line x1="200" y1="100" x2="270" y2="100" class="qu-l"/>
    <line x1="30" y1="80" x2="30" y2="120" class="qu-l"/><line x1="270" y1="80" x2="270" y2="120" class="qu-l"/>
    <rect x="90" y="65" width="110" height="70" rx="4" class="qu-b"/>
    <line x1="140" y1="65" x2="140" y2="135" class="qu-m"><animate attributeName="x1" values="120;160;120" dur="5s" repeatCount="indefinite"/><animate attributeName="x2" values="120;160;120" dur="5s" repeatCount="indefinite"/></line>
    <text x="145" y="175" class="qu-t">IQR</text>
  </svg>`,
  parts: {
    A: { name: 'Spread and quartiles of a list' },
    B: { name: 'Quartiles from cumulative frequency' },
  },
  sections: [
    { id: 'spread', part: 'A', name: 'Measures of spread', short: 'Spread', icon: 'stats', color: '--c4', covers: ['H6.2B'], line: 'Range and interquartile range: how consistent is the data?' },
    { id: 'iqrlist', part: 'A', name: 'Quartiles of a list', short: 'Quartiles', icon: 'number', color: '--c1', covers: ['H6.2C'], line: 'Lower quartile, median, upper quartile and the IQR.' },
    { id: 'cfmedian', part: 'B', name: 'Median and quartiles from a graph', short: 'From a graph', icon: 'graph', color: '--c3', covers: ['H6.2A', 'H6.2D'], line: 'Read across at \\(\\frac n4\\), \\(\\frac n2\\) and \\(\\frac{3n}4\\).' },
    { id: 'boxplot', part: 'B', name: 'Comparing distributions', short: 'Comparing', icon: 'target', color: '--c6', covers: ['H6.2B', 'H6.2D'], line: 'Box plots; compare an average and a spread, in context.' },
  ],
  scenes: ['spread', 'iqrlist', 'testA', 'cfmedian', 'boxplot', 'testB'],
};
