window.LESSON = {
  id: 'accuracy-bounds',
  description: 'Interactive maths lesson on accuracy: rounding to the nearest 10, 100 or 1000, to decimal places and to significant figures, estimating calculations, upper and lower bounds and error intervals, and (Higher) using bounds in calculations. Animated worked examples, random practice, checks and tests. Pearson Edexcel International GCSE Mathematics A (4MA1), specification 1.8.',
  intro: 'Most measurements are <b>rounded</b>. In this lesson you will round to the nearest 10, 100 or 1000, to <b>decimal places</b> and to <b>significant figures</b>, and use rounding to <b>estimate</b> answers. Then you will find the <b>upper and lower bounds</b> of a rounded value. Higher tier: use bounds to find the biggest and smallest possible answers to a calculation.',
  hero: `<svg class="st-net ab-hero" viewBox="0 0 300 200" role="img" aria-label="A number line from 3.5 to 4.5 with the interval that rounds to 4 shaded">
    <line x1="20" y1="120" x2="280" y2="120" class="ab-ax"/>
    <rect x="50" y="108" width="200" height="24" rx="4" class="ab-in"><animate attributeName="opacity" values=".4;1;.4" dur="3s" repeatCount="indefinite"/></rect>
    <circle cx="50" cy="120" r="7" class="ab-c"/><circle cx="250" cy="120" r="7" class="ab-o"/>
    <text x="50" y="158" class="ab-t">3.5</text><text x="150" y="158" class="ab-t">4</text><text x="250" y="158" class="ab-t">4.5</text>
    <text x="150" y="70" class="ab-l">3.5 ≤ x &lt; 4.5</text>
  </svg>`,
  parts: {
    A: { name: 'Rounding and estimating' },
    B: { name: 'Upper and lower bounds' },
    C: { name: 'Calculating with bounds', tier: 'H' },
  },
  sections: [
    { id: 'rounding', part: 'A', name: 'Rounding to powers of 10 and decimal places', short: 'Rounding', icon: 'number', color: '--c4', covers: ['F1.8A', 'F1.8B'], line: 'Look at the next digit: 5 or more rounds up.' },
    { id: 'sigfig', part: 'A', name: 'Significant figures', short: 'Sig. figs', icon: 'number', color: '--c1', covers: ['F1.8B'], line: 'Count from the first non-zero digit.' },
    { id: 'estimate', part: 'A', name: 'Estimating', short: 'Estimating', icon: 'calc', color: '--c3', covers: ['F1.8D'], line: 'Round every number to 1 significant figure, then calculate.' },
    { id: 'bounds', part: 'B', name: 'Upper and lower bounds', short: 'Bounds', icon: 'graph', color: '--c6', covers: ['F1.8C'], line: 'Half a unit either side; error intervals.' },
    { id: 'boundcalc', part: 'C', name: 'Bounds in calculations', short: 'In calculations', icon: 'target', color: '--c8', covers: ['H1.8A'], line: 'Which bounds give the biggest or smallest answer?', tier: 'H' },
  ],
  scenes: ['rounding', 'sigfig', 'estimate', 'testA', 'bounds', 'testB', 'boundcalc', 'testC'],
};
