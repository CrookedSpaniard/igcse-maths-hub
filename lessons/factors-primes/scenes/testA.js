FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['factors', 'Which number is a factor of 45?', ['9', '4', '90', '6'], '\\(45 = 9 \\times 5\\).', 'factors'],
    ['factors', 'Which number is prime?', ['37', '39', '51', '1'], '37 has exactly two factors. \\(39 = 3 \\times 13\\), \\(51 = 3 \\times 17\\), and 1 has only one factor.', 'factors'],
    ['factors', 'How many factors does 20 have?', ['6', '5', '4', '8'], '1, 2, 4, 5, 10, 20.', 'factors'],
    ['factors', 'Which is a cube number?', ['64', '36', '16', '100'], '\\(64 = 4^3\\).', 'factors'],
    ['factors', 'Which number is a multiple of 7 and a square number?', ['49', '14', '21', '25'], '\\(49 = 7 \\times 7 = 7^2\\).', 'factors'],
    ['primefactors', 'Write 72 as a product of its prime factors.', ['\\(2^3 \\times 3^2\\)', '\\(2^2 \\times 3^3\\)', '\\(8 \\times 9\\)', '\\(2 \\times 36\\)'], '\\(72 = 8 \\times 9 = 2^3 \\times 3^2\\).', 'primefactors'],
    ['primefactors', 'What is \\(2^2 \\times 3 \\times 5^2\\)?', ['300', '150', '60', '900'], '\\(4 \\times 3 \\times 25 = 300\\).', 'primefactors'],
    ['primefactors', 'Which is <b>not</b> a prime factor of 210?', ['11', '2', '5', '7'], '\\(210 = 2 \\times 3 \\times 5 \\times 7\\).', 'primefactors'],
    ['primefactors', '\\(150 = 2 \\times 3 \\times 5^n\\). What is \\(n\\)?', ['2', '1', '3', '5'], '\\(150 = 2 \\times 3 \\times 25\\) and \\(25 = 5^2\\).', 'primefactors'],
  ],
  LONG: [
    { q: 'Write 540 as a product of its prime factors. Give your answer in index form.', m: 3, s: ['M1 for a correct first step, e.g. a factor tree or repeated division with at least two correct splits.', 'M1 for all the primes 2, 2, 3, 3, 3, 5 found (the product may be unordered).', 'A1 for \\(2^2 \\times 3^3 \\times 5\\).'], link: ['primefactors', 'See factor trees again'] },
    { q: 'Ana says, “Every odd number is a prime number.” Give an example to show that she is wrong.', m: 1, s: ['B1 for any odd number that is not prime, with its factors, e.g. \\(9 = 3 \\times 3\\) or \\(15 = 3 \\times 5\\) (also accept 1).'], link: ['factors', 'See prime numbers again'] },
    { q: 'From the list 4, 9, 12, 17, 27, 36, 41, write down (a) the square numbers, (b) the prime numbers, (c) the cube number.', m: 3, s: ['B1 for 4, 9 and 36 (and no others).', 'B1 for 17 and 41 (and no others).', 'B1 for 27.'], link: ['factors', 'See squares, cubes and primes again'] },
  ],
});
