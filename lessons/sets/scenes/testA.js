FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['notation', 'A = {2, 3, 5, 7}. Which statement is true?', ['\\(5 \\in A\\)', '\\(4 \\in A\\)', '\\(3 \\notin A\\)', '\\(7 \\notin A\\)'], '5 is listed in A.', 'notation'],
    ['notation', 'Which set is the empty set?', ['{odd multiples of 2}', '{0}', '{1}', '{even primes}'], 'No multiple of 2 is odd. {0} has one element, 0; {even primes} = {2}.', 'notation'],
    ['notation', "ℰ = {1, 2, …, 8} and A = {1, 2, 3}. What is \\(A'\\)?", ['{4, 5, 6, 7, 8}', '{1, 2, 3}', '{1, 2, …, 8}', '∅'], 'Everything in ℰ not in A.', 'notation'],
    ['notation', 'In a Venn diagram, the rectangle shows…', ['the universal set ℰ', 'the empty set', 'the intersection', 'set A'], 'Everything being considered.', 'notation'],
    ['venn', 'A = {a, b, c, d} and B = {c, d, e}. What is \\(A \\cap B\\)?', ['{c, d}', '{a, b, c, d, e}', '{e}', '{a, b}'], 'In both.', 'venn'],
    ['venn', 'A = {a, b, c, d} and B = {c, d, e}. What is \\(A \\cup B\\)?', ['{a, b, c, d, e}', '{c, d}', '{a, b, e}', '{a, b, c, d, c, d, e}'], 'In either, each once.', 'venn'],
    ['venn', "Which region is \\((A \\cup B)'\\)?", ['Outside both circles', 'The overlap', 'Inside A only', 'Inside both circles'], 'Not in A or B.', 'venn'],
    ['venn', "Which region is \\(A \\cap B'\\)?", ['In A but not in B', 'In B but not in A', 'The overlap', 'Outside A'], 'In A and not in B.', 'venn'],
  ],
  LONG: [
    { q: 'ℰ = {1, 2, 3, …, 15}, A = {multiples of 3}, B = {odd numbers}. (a) List the elements of \\(A \\cap B\\). (b) Draw a Venn diagram to show the sets. (c) How many elements are in \\((A \\cup B)\'\\)?', m: 4, s: ['B1 for (a) {3, 9, 15}.', 'M1 for a Venn diagram with at least 2 regions correct.', 'A1 for a fully correct Venn diagram: A only {6, 12}, both {3, 9, 15}, B only {1, 5, 7, 11, 13}, outside {2, 4, 8, 10, 14}.', 'B1 (ft) for (c) 5.'], link: ['venn', 'See filling a Venn diagram again'] },
    { q: 'ℰ = {letters of the alphabet}. P = {letters in the word PEAR}, Q = {letters in the word PLATE}. List the elements of (a) \\(P \\cap Q\\) (b) \\(P \\cup Q\\).', m: 2, s: ['B1 for (a) {P, E, A}.', 'B1 for (b) {P, E, A, R, L, T}.'], link: ['venn', 'See unions and intersections again'] },
    { q: 'Shade the region \\(A \\cap B\'\\) on a Venn diagram and describe it in words.', m: 2, s: ['B1 for shading the part of A outside B only.', 'B1 for a correct description, e.g. “elements in A but not in B”.'], link: ['venn', 'See shading regions again'] },
  ],
});
