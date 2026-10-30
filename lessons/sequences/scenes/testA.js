FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['term-rules', 'What is the next term of 4, 9, 14, 19, …?', ['24', '23', '25', '29'], 'Add 5.', 'term-rules'],
    ['term-rules', 'What is the term-to-term rule for 81, 27, 9, 3, …?', ['Divide by 3', 'Subtract 54', 'Subtract 3', 'Multiply by 3'], 'Each term is a third of the one before.', 'term-rules'],
    ['term-rules', 'The nth term is \\(n^2 + 1\\). What is the 4th term?', ['17', '9', '16', '10'], '\\(16 + 1\\).', 'term-rules'],
    ['term-rules', 'Which sequence is arithmetic?', ['2, 5, 8, 11', '1, 2, 4, 8', '1, 4, 9, 16', '1, 1, 2, 3'], 'It goes up by 3 each time.', 'term-rules'],
    ['nth-term', 'The nth term of 6, 11, 16, 21, … is…', ['\\(5n + 1\\)', '\\(6n + 5\\)', '\\(n + 5\\)', '\\(5n + 6\\)'], 'Difference 5; one more than \\(5n\\).', 'nth-term'],
    ['nth-term', 'The nth term of 10, 7, 4, 1, … is…', ['\\(13 - 3n\\)', '\\(10 - 3n\\)', '\\(3n + 7\\)', '\\(-3n + 10\\)'], 'Difference −3; compare with \\(-3n\\).', 'nth-term'],
    ['nth-term', 'Is 64 a term of \\(4n + 2\\)?', ['No: \\(n = 15.5\\)', 'Yes: \\(n = 16\\)', 'Yes: \\(n = 15\\)', 'No: \\(n = 16.5\\)'], '\\(4n = 62\\).', 'nth-term'],
    ['nth-term', 'The nth term is \\(7n - 3\\). What is the 100th term?', ['697', '700', '704', '397'], '\\(700 - 3\\).', 'nth-term'],
  ],
  LONG: [
    { q: 'Here are the first terms of a sequence: 2, 9, 16, 23, … (a) Find an expression for the nth term. (b) Is 150 a term? Give a reason.', m: 3, s: ['B1 for \\(7n - 5\\).', 'M1 for \\(7n - 5 = 150\\).', 'A1 for “no, \\(n = 22.1…\\) is not a whole number”.'], link: ['nth-term', 'See the nth term again'] },
    { q: 'Pattern 1 has 5 dots, pattern 2 has 8 dots, pattern 3 has 11 dots. How many dots are in pattern 20?', m: 2, s: ['M1 for \\(3n + 2\\) or adding 3 repeatedly.', 'A1 for 62.'], link: ['term-rules', 'See growing patterns again'] },
    { q: 'Write down the first three terms of the sequence with nth term \\(2n^2 - 1\\).', m: 2, s: ['M1 for at least one correct term.', 'A1 for 1, 7, 17.'], link: ['term-rules', 'See position-to-term rules again'] },
  ],
});
