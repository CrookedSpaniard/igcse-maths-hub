FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['measures', 'Find the mean of 5, 9, 4, 10, 7.', ['7', '9', '35', '6'], '\\(35 \\div 5\\).', 'measures'],
    ['measures', 'Find the median of 8, 2, 11, 5, 6, 9.', ['7', '5.5', '6', '8'], '2, 5, 6, 8, 9, 11: halfway between 6 and 8.', 'measures'],
    ['measures', 'What is the mode of 4, 7, 7, 2, 4, 7, 9?', ['7', '4', '9', '3'], '7 appears three times.', 'measures'],
    ['measures', 'What is the range of 13, 6, 21, 9, 17?', ['15', '21', '6', '13'], '\\(21 - 6\\).', 'measures'],
    ['measures', 'House prices in a street include one mansion. Which average is least affected by it?', ['The median', 'The mean', 'The range', 'They are all affected equally'], 'One extreme value hardly moves the middle.', 'measures'],
    ['measures', 'Which average can be used for favourite colours?', ['The mode', 'The mean', 'The median', 'None of them'], 'Colours are not numbers.', 'measures'],
    ['meanprob', 'The mean of 8 numbers is 6. What is their total?', ['48', '14', '0.75', '2'], '\\(8 \\times 6\\).', 'meanprob'],
    ['meanprob', 'Four numbers have a mean of 10. Three of them are 8, 12 and 7. What is the fourth?', ['13', '10', '27', '9'], '\\(40 - 27\\).', 'meanprob'],
  ],
  LONG: [
    { q: 'Zara’s scores in five spelling tests are 14, 17, 12, 18 and 14. (a) Work out her mean score. (b) After a sixth test her mean score is 16. What did she score in the sixth test?', m: 4, s: ['M1 for \\(14 + 17 + 12 + 18 + 14 = 75\\).', 'A1 for (a) 15.', 'M1 for \\(6 \\times 16 = 96\\).', 'A1 for (b) 21.'], link: ['meanprob', 'See finding a missing value again'] },
    { q: 'A team of 12 adults has a mean age of 38. A team of 8 children has a mean age of 13. Work out the mean age of all 20 people.', m: 3, s: ['M1 for \\(12 \\times 38 = 456\\) or \\(8 \\times 13 = 104\\).', 'M1 for \\((456 + 104) \\div 20\\).', 'A1 for 28.'], link: ['meanprob', 'See combining groups again'] },
    { q: 'Here are the numbers of emails Tom received on 8 days: 12, 3, 9, 15, 3, 7, 40, 11. (a) Find the median. (b) Explain why the median is a better average than the mean for this data.', m: 3, s: ['M1 for the values in order: 3, 3, 7, 9, 11, 12, 15, 40.', 'A1 for (a) 10.', 'B1 for (b) the value 40 is an outlier, which pulls the mean up (accept equivalent).'], link: ['measures', 'See choosing an average again'] },
  ],
});
