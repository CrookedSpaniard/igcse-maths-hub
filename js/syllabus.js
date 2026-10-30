// The whole course: 6 content areas of Pearson Edexcel International GCSE Mathematics A (4MA1),
// split into lessons. Used by the hub and by every lesson (header, next/previous lesson).
// tier: 'F' = Foundation and Higher, 'H' = Higher tier only.
// ready: true once the lesson folder exists in lessons/<id>/.
window.MH = {
  spec: 'Pearson Edexcel International GCSE Mathematics A (4MA1)',
  areas: [
    {
      n: 1, title: 'Numbers and the number system', short: 'Number', tone: 'a1', icon: 'number',
      lessons: [
        { id: 'factors-primes', spec: '1.1', tier: 'F', title: 'Factors, multiples and primes', line: 'Prime factor decomposition, HCF and LCM.' },
        { id: 'negatives-bidmas', spec: '1.1', tier: 'F', title: 'Negative numbers and order of operations', line: 'Calculating with directed numbers and BIDMAS.' },
        { id: 'fractions', spec: '1.2', tier: 'F', title: 'Fractions', line: 'Equivalent fractions, mixed numbers and the four operations.' },
        { id: 'decimals', spec: '1.3', tier: 'F', title: 'Decimals and recurring decimals', line: 'Decimal notation, converting fractions; recurring decimals to fractions (H).' },
        { id: 'powers-roots', spec: '1.4', tier: 'F', title: 'Powers, roots and indices', line: 'Squares, cubes, roots and the laws of indices.' },
        { id: 'surds', spec: '1.4', tier: 'H', title: 'Surds', line: 'Simplifying surds and rationalising denominators.' },
        { id: 'sets', spec: '1.5', tier: 'F', title: 'Sets and Venn diagrams', line: 'Set notation, unions, intersections and Venn diagrams.' },
        { id: 'percentages', spec: '1.6', tier: 'F', title: 'Percentages', line: 'Percentages of amounts, percentage change and reverse percentages.' },
        { id: 'growth-decay', spec: '1.6', tier: 'F', title: 'Compound interest and depreciation', line: 'Simple and compound interest; repeated percentage change.' },
        { id: 'ratio', spec: '1.7', tier: 'F', title: 'Ratio and proportion', line: 'Simplifying and sharing in a ratio, best buys and exchange rates.' },
        { id: 'accuracy-bounds', spec: '1.8', tier: 'F', title: 'Rounding, estimation and bounds', line: 'Decimal places, significant figures, error intervals; upper and lower bounds (H).' },
        { id: 'standard-form', spec: '1.9', tier: 'F', title: 'Standard form', line: 'Writing and calculating with numbers in standard form.' },
        { id: 'applying-number', spec: '1.10–1.11', tier: 'F', title: 'Applying number and using a calculator', line: 'Money, time, compound measures and calculator skills.' },
      ],
    },
    {
      n: 2, title: 'Equations, formulae and identities', short: 'Algebra', tone: 'a2', icon: 'algebra',
      lessons: [
        { id: 'algebra-basics', spec: '2.1', tier: 'F', title: 'Algebraic notation and index laws', line: 'Terms, expressions, simplifying and index laws in algebra.' },
        { id: 'expand-factorise', spec: '2.2', tier: 'F', title: 'Expanding and factorising', line: 'Single, double and triple brackets; factorising quadratics.' },
        { id: 'algebraic-fractions', spec: '2.2', tier: 'H', title: 'Algebraic fractions', line: 'Simplifying, adding and dividing algebraic fractions.' },
        { id: 'formulae', spec: '2.3', tier: 'F', title: 'Substitution and changing the subject', line: 'Using formulae and rearranging them.' },
        { id: 'linear-equations', spec: '2.4', tier: 'F', title: 'Linear equations', line: 'Solving equations with brackets, fractions and unknowns on both sides.' },
        { id: 'proportion', spec: '2.5', tier: 'H', title: 'Direct and inverse proportion', line: 'Setting up and using y ∝ x, x², √x and 1/x.' },
        { id: 'simultaneous', spec: '2.6', tier: 'F', title: 'Simultaneous equations', line: 'Elimination, substitution; one linear and one quadratic (H).' },
        { id: 'quadratics', spec: '2.7', tier: 'F', title: 'Quadratic equations', line: 'Factorising, the quadratic formula and completing the square (H).' },
        { id: 'inequalities', spec: '2.8', tier: 'F', title: 'Inequalities', line: 'Number lines, solving inequalities, regions; quadratic inequalities (H).' },
      ],
    },
    {
      n: 3, title: 'Sequences, functions and graphs', short: 'Graphs', tone: 'a3', icon: 'graph',
      lessons: [
        { id: 'sequences', spec: '3.1', tier: 'F', title: 'Sequences', line: 'Term-to-term rules, the nth term; arithmetic series (H).' },
        { id: 'functions', spec: '3.2', tier: 'H', title: 'Functions', line: 'Function notation, domain and range, composite and inverse functions.' },
        { id: 'straight-lines', spec: '3.3', tier: 'F', title: 'Straight-line graphs', line: 'y = mx + c, gradients, parallel and perpendicular lines.' },
        { id: 'real-life-graphs', spec: '3.3', tier: 'F', title: 'Real-life graphs', line: 'Distance–time, speed–time and conversion graphs.' },
        { id: 'curves', spec: '3.3', tier: 'F', title: 'Quadratic, cubic and reciprocal graphs', line: 'Tables of values, plotting and recognising curves.' },
        { id: 'graphical-solutions', spec: '3.3', tier: 'H', title: 'Solving equations with graphs', line: 'Intersections, roots and turning points.' },
        { id: 'calculus', spec: '3.4', tier: 'H', title: 'Differentiation', line: 'Gradients of curves, stationary points and kinematics.' },
      ],
    },
    {
      n: 4, title: 'Geometry and trigonometry', short: 'Geometry', tone: 'a4', icon: 'geometry',
      lessons: [
        { id: 'angles', spec: '4.1', tier: 'F', title: 'Angles, lines and triangles', line: 'Angle facts, parallel lines and triangles.' },
        { id: 'polygons', spec: '4.2', tier: 'F', title: 'Polygons', line: 'Interior and exterior angles; quadrilaterals.' },
        { id: 'symmetry', spec: '4.3', tier: 'F', title: 'Symmetry', line: 'Lines of symmetry and rotational symmetry.' },
        { id: 'measures-bearings', spec: '4.4', tier: 'F', title: 'Measures, scales and bearings', line: 'Scale drawings, bearings and compound measures.' },
        { id: 'constructions', spec: '4.5', tier: 'F', title: 'Constructions and loci', line: 'Ruler-and-compasses constructions and loci.' },
        { id: 'circle-theorems', spec: '4.6', tier: 'F', title: 'Circle properties and theorems', line: 'Tangents and chords; the circle theorems (H).' },
        { id: 'geometric-proof', spec: '4.7', tier: 'F', title: 'Geometric reasoning', line: 'Giving reasons and writing geometric proofs.' },
        { id: 'pythagoras-trig', spec: '4.8', tier: 'F', title: "Pythagoras' theorem and trigonometry", line: 'Right-angled triangles: Pythagoras and SOHCAHTOA.' },
        { id: 'further-trig', spec: '4.8', tier: 'H', title: 'Sine rule, cosine rule and 3D', line: 'Non-right-angled triangles, area ½ab sin C, 3D problems and trig graphs.' },
        { id: 'area-perimeter', spec: '4.9', tier: 'F', title: 'Perimeter and area', line: 'Polygons, circles; arcs and sectors (H).' },
        { id: 'volume-surface', spec: '4.10', tier: 'F', title: 'Surface area and volume', line: 'Prisms, cylinders; cones, pyramids and spheres.' },
        { id: 'similarity', spec: '4.11', tier: 'F', title: 'Similarity', line: 'Similar shapes; area and volume scale factors (H).' },
      ],
    },
    {
      n: 5, title: 'Vectors and transformation geometry', short: 'Vectors', tone: 'a5', icon: 'vector',
      lessons: [
        { id: 'vectors', spec: '5.1', tier: 'H', title: 'Vectors', line: 'Vector notation, magnitude and geometric proofs.' },
        { id: 'transformations', spec: '5.2', tier: 'F', title: 'Transformations', line: 'Translations, reflections, rotations and enlargements.' },
      ],
    },
    {
      n: 6, title: 'Statistics and probability', short: 'Statistics', tone: 'a6', icon: 'stats',
      lessons: [
        { id: 'charts', spec: '6.1', tier: 'F', title: 'Charts and diagrams', line: 'Bar charts, pie charts, stem-and-leaf and scatter graphs.' },
        { id: 'histograms-cf', spec: '6.1', tier: 'H', title: 'Histograms and cumulative frequency', line: 'Frequency density, cumulative frequency and box plots.' },
        { id: 'averages', spec: '6.2', tier: 'F', title: 'Averages and range', line: 'Mean, median, mode and range from lists and tables.' },
        { id: 'quartiles', spec: '6.2', tier: 'H', title: 'Quartiles and interquartile range', line: 'Estimating the median and quartiles, comparing distributions.' },
        { id: 'probability', spec: '6.3', tier: 'F', title: 'Probability', line: 'Probability scale, relative frequency and expected outcomes.' },
        { id: 'combined-probability', spec: '6.3', tier: 'F', title: 'Combined events and tree diagrams', line: 'Sample spaces, tree diagrams; conditional probability (H).' },
      ],
    },
  ],
};
window.MH.lessons = window.MH.areas.flatMap((a) => a.lessons.map((l) => ({ ...l, area: a.n, areaTitle: a.title })));
window.MH.find = (id) => window.MH.lessons.find((l) => l.id === id);
