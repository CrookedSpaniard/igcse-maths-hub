FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['hcflcm', 'What is the HCF of 18 and 30?', ['6', '3', '90', '2'], '\\(18 = 2 \\times 3^2\\), \\(30 = 2 \\times 3 \\times 5\\). Shared: \\(2 \\times 3 = 6\\).', 'hcflcm'],
    ['hcflcm', 'What is the LCM of 6 and 9?', ['18', '54', '3', '36'], 'Multiples of 9: 9, 18. 18 is also a multiple of 6.', 'hcflcm'],
    ['hcflcm', '\\(A = 2^4 \\times 3\\) and \\(B = 2^2 \\times 3^2\\). What is the HCF of \\(A\\) and \\(B\\)?', ['12', '144', '36', '6'], 'Lower powers: \\(2^2 \\times 3 = 12\\).', 'hcflcm'],
    ['hcflcm', '\\(A = 2^4 \\times 3\\) and \\(B = 2^2 \\times 3^2\\). What is the LCM of \\(A\\) and \\(B\\)?', ['144', '12', '432', '72'], 'Higher powers: \\(2^4 \\times 3^2 = 16 \\times 9 = 144\\).', 'hcflcm'],
    ['hcflcm', 'In the Venn diagram of the prime factors of two numbers, the LCM is…', ['the product of every prime in the diagram', 'the product of the overlap', 'the sum of every prime', 'the biggest prime'], 'Every prime, each one once.', 'hcflcm'],
    ['problems', 'Two buses leave together. One leaves every 10 minutes and one every 15 minutes. After how many minutes do they next leave together?', ['30', '5', '150', '25'], 'LCM of 10 and 15 is 30.', 'problems'],
    ['problems', '48 apples and 60 oranges are shared into identical bags with nothing left over. What is the largest number of bags?', ['12', '6', '4', '240'], 'HCF of 48 and 60 is 12.', 'problems'],
    ['problems', 'Which question is answered with an LCM?', ['When will two flashing lights next flash together?', 'What is the longest equal length to cut two ropes into?', 'How many identical teams can be made from 20 girls and 24 boys?', 'What is the biggest square tile for a floor?'], 'Repeating events → LCM. The others are HCF problems.', 'problems'],
  ],
  LONG: [
    { q: '\\(A = 2^3 \\times 3^2 \\times 5\\) and \\(B = 2 \\times 3^3 \\times 7\\). (a) Find the HCF of \\(A\\) and \\(B\\). (b) Find the LCM of \\(A\\) and \\(B\\). You may leave your answers in index form.', m: 3, s: ['B1 for HCF \\(= 2 \\times 3^2\\) (= 18).', 'M1 for taking the highest power of each prime, with at least 3 of the 4 primes correct.', 'A1 for LCM \\(= 2^3 \\times 3^3 \\times 5 \\times 7\\) (= 7560).'], link: ['hcflcm', 'See HCF and LCM in index form again'] },
    { q: 'Two lights are switched on at the same time. Light A flashes every 14 seconds. Light B flashes every 21 seconds. How many times in 5 minutes do they flash at the same time (not counting the start)?', m: 3, s: ['M1 for listing multiples or using prime factors to find the LCM.', 'M1 for LCM = 42 seconds and dividing 300 by 42.', 'A1 for 7.'], link: ['problems', 'See repeating events again'] },
    { q: 'Ravi has 72 red beads and 90 blue beads. He makes identical bracelets using all the beads. (a) What is the greatest number of bracelets he can make? (b) How many red beads and how many blue beads are on each bracelet?', m: 3, s: ['M1 for finding the HCF of 72 and 90, e.g. from prime factors \\(2^3 \\times 3^2\\) and \\(2 \\times 3^2 \\times 5\\).', 'A1 for 18 bracelets.', 'B1 (ft) for 4 red and 5 blue on each.'], link: ['problems', 'See largest equal groups again'] },
  ],
});
