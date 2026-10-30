FD.test({
  id: 'testB',
  part: 'B',
  Q: [
    ['bounds', 'A length is 23 cm to the nearest cm. What is the lower bound?', ['22.5 cm', '22 cm', '22.9 cm', '23.5 cm'], '23 − 0.5.', 'bounds'],
    ['bounds', 'A mass is 3.8 kg to 1 d.p. What is the upper bound?', ['3.85 kg', '3.9 kg', '3.89 kg', '3.75 kg'], '3.8 + 0.05.', 'bounds'],
    ['bounds', 'A crowd is 4700 to the nearest 100. Which is the error interval?', ['\\(4650 \\le n < 4750\\)', '\\(4600 \\le n < 4800\\)', '\\(4695 \\le n < 4705\\)', '\\(4650 < n \\le 4750\\)'], 'Half of 100 is 50.', 'bounds'],
    ['bounds', 'A time is 12 s to the nearest 2 seconds. What is the lower bound?', ['11 s', '10 s', '11.5 s', '11.9 s'], 'Half of 2 is 1.', 'bounds'],
    ['bounds', '\\(x\\) truncated to a whole number is 7. Which is true?', ['\\(7 \\le x < 8\\)', '\\(6.5 \\le x < 7.5\\)', '\\(6 < x \\le 7\\)', '\\(7 < x \\le 8\\)'], 'Truncating chops off the decimals.', 'bounds'],
    ['bounds', 'Which value could round to 5.0 (1 d.p.)?', ['4.97', '5.05', '4.94', '5.1'], '\\(4.95 \\le x < 5.05\\).', 'bounds'],
    ['bounds', 'A volume is 650 ml to 2 significant figures. What is the upper bound?', ['655 ml', '650.5 ml', '700 ml', '660 ml'], '2 s.f. here means the nearest 10.', 'bounds'],
    ['bounds', 'In an error interval, which bound is NOT included?', ['The upper bound', 'The lower bound', 'Both', 'Neither'], 'The upper bound would round up.', 'bounds'],
  ],
  LONG: [
    { q: 'The length of a field is 120 m, correct to the nearest 10 m. Write down the error interval for the length \\(L\\).', m: 2, s: ['B1 for 115 and 125 seen.', 'B1 for \\(115 \\le L < 125\\).'], link: ['bounds', 'See error intervals again'] },
    { q: 'A number \\(y\\) is rounded to 2 decimal places. The result is 0.37. Write down the error interval for \\(y\\).', m: 2, s: ['B1 for 0.365 or 0.375.', 'B1 for \\(0.365 \\le y < 0.375\\).'], link: ['bounds', 'See other degrees of accuracy again'] },
    { q: 'Sam says, “3.5 rounded to the nearest whole number is 4, so 4 has upper bound 4.5 and so does 3.5.” Explain the mistake and write the error interval for a value that is 4 to the nearest whole number.', m: 2, s: ['B1 for explaining that bounds belong to the rounded value (4), not the original number.', 'B1 for \\(3.5 \\le x < 4.5\\).'], link: ['bounds', 'See half a unit each way again'] },
  ],
});
