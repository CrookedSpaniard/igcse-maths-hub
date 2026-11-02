window.LESSON = {
  id: 'probability',
  description: 'Interactive maths lesson on probability: the language of probability and the probability scale from 0 to 1, probabilities from equally likely outcomes, the probability of an event not happening, relative frequency from experiments with a dice and coin simulator, and expected frequency. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 6.3.',
  intro: '<b>Probability</b> measures how likely something is to happen, on a scale from 0 (impossible) to 1 (certain). In this lesson you will use the words of probability, work out probabilities when all the outcomes are <b>equally likely</b>, find the probability of something <b>not</b> happening, estimate probabilities from <b>experiments</b>, and predict how many times something should happen: the <b>expected frequency</b>.',
  hero: `<svg class="st-net pb-hero" viewBox="0 0 300 200" role="img" aria-label="A probability scale from 0 to 1 with a marker moving along it">
    <line x1="30" y1="110" x2="270" y2="110" class="pb-ax"/>
    ${[0, 0.5, 1].map((v) => `<line x1="${30 + v * 240}" y1="100" x2="${30 + v * 240}" y2="120" class="pb-ax"/><text x="${30 + v * 240}" y="145" class="pb-t">${v}</text>`).join('')}
    <circle cx="90" cy="110" r="11" class="pb-d"><animate attributeName="cx" values="90;230;160;90" dur="6s" repeatCount="indefinite"/></circle>
    <rect x="115" y="30" width="44" height="44" rx="8" class="pb-die"/><circle cx="128" cy="43" r="4" class="pb-pip"/><circle cx="146" cy="61" r="4" class="pb-pip"/><circle cx="137" cy="52" r="4" class="pb-pip"/>
  </svg>`,
  parts: {
    A: { name: 'Probability from equally likely outcomes' },
    B: { name: 'Experiments and expected frequency' },
  },
  sections: [
    { id: 'scale', part: 'A', name: 'The language of probability', short: 'Scale', icon: 'dice', color: '--c4', covers: ['F6.3A', 'F6.3B'], line: 'Impossible, unlikely, even chance, likely, certain: from 0 to 1.' },
    { id: 'theory', part: 'A', name: 'Equally likely outcomes', short: 'Calculating', icon: 'frac', color: '--c1', covers: ['F6.3A', 'F6.3C', 'F6.3H'], line: 'P = favourable outcomes ÷ total; P(not A) = 1 − P(A).' },
    { id: 'relfreq', part: 'B', name: 'Relative frequency', short: 'Experiments', icon: 'stats', color: '--c3', covers: ['F6.3G'], line: 'Estimate a probability from what happened in an experiment.' },
    { id: 'expected', part: 'B', name: 'Expected frequency', short: 'Expected', icon: 'target', color: '--c6', covers: ['F6.3J', 'F6.3G'], line: 'Expected number = probability × number of trials.' },
  ],
  scenes: ['scale', 'theory', 'testA', 'relfreq', 'expected', 'testB'],
};
