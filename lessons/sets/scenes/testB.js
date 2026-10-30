FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['subsets', '\\(\\{x : x \\text{ is an integer}, -1 < x \\le 3\\}\\) is…', ['{0, 1, 2, 3}', '{−1, 0, 1, 2, 3}', '{0, 1, 2}', '{−1, 0, 1, 2}'], '−1 is not included, 3 is.', 'subsets'],
    ['subsets', 'A = {1, 2, 3, 4, 5, 6}. Which set is a subset of A?', ['{2, 4, 6}', '{0, 1, 2}', '{5, 6, 7}', '{1, 10}'], 'Every element of {2, 4, 6} is in A.', 'subsets'],
    ['subsets', 'If \\(B \\subset A\\), how is B drawn in a Venn diagram?', ['Inside circle A', 'Overlapping A', 'Separate from A', 'Outside ℰ'], 'Every element of B is in A.', 'subsets'],
    ['subsets', 'A = {factors of 20}. What is \\(n(A)\\)?', ['6', '20', '5', '4'], '1, 2, 4, 5, 10, 20.', 'subsets'],
    ['counting', '\\(n(A) = 15\\), \\(n(B) = 10\\), \\(n(A \\cap B) = 6\\). What is \\(n(A \\cup B)\\)?', ['19', '25', '31', '9'], '\\(15 + 10 - 6\\).', 'counting'],
    ['counting', '\\(n(A) = 15\\) and \\(n(A \\cap B) = 6\\). How many are in A only?', ['9', '21', '6', '15'], '\\(15 - 6\\).', 'counting'],
    ['counting', '32 people: 20 like apples, 18 like pears, 3 like neither. How many like both?', ['9', '6', '11', '3'], '\\(20 + 18 + 3 - 32 = 9\\).', 'counting'],
    ['counting', 'How many regions (including the outside) does a three-set Venn diagram have?', ['8', '7', '6', '9'], '\\(2^3 = 8\\).', 'counting'],
  ],
  LONG: [
    { q: 'In a group of 60 students, 35 have a laptop (L), 28 have a tablet (T) and 9 have neither. Draw a Venn diagram and find how many students have a laptop only.', m: 4, s: ['M1 for setting up \\((35 - x) + x + (28 - x) + 9 = 60\\), or 51 students with at least one device.', 'A1 for \\(x = 12\\) (both).', 'M1 for a Venn diagram with 23, 12, 16 and 9.', 'A1 for 23.'], link: ['counting', 'See an unknown in the overlap again'] },
    { q: 'ℰ = {x : x is an integer, 1 ≤ x ≤ 12}. A = {x : x is a factor of 12}. B = {x : x is a multiple of 4}. (a) List the elements of A. (b) Is \\(B \\subset A\\)? Give a reason.', m: 3, s: ['B1 for (a) {1, 2, 3, 4, 6, 12}.', 'B1 for No.', 'B1 for a reason, e.g. 8 is in B but not in A.'], link: ['subsets', 'See subsets again'] },
    { q: 'A survey of 50 people asked about three sports: 4 like all three, 10 like football and rugby, 9 like football and cricket, 7 like rugby and cricket (these include the 4), 25 like football, 20 like rugby, 18 like cricket. How many like none of the three?', m: 4, s: ['M1 for 4 in the centre and 6, 5, 3 in the two-set overlaps only.', 'M1 for football only 10, rugby only 7, cricket only 6.', 'M1 for adding all seven regions: 41.', 'A1 for 9.'], link: ['counting', 'See three sets again'] },
  ],
});
