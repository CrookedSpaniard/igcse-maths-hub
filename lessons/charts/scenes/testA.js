FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['tables', 'The frequencies in a table are 5, 12, 9 and 4. How many values are there?', ['30', '12', '26', '4'], 'Add them.', 'tables'],
    ['tables', 'In which class does a height of 150 cm go?', ['\\(140 < h \\le 150\\)', '\\(150 < h \\le 160\\)', 'both', 'neither'], '≤ 150 includes 150.', 'tables'],
    ['tables', 'A two-way table: 40 students, 22 are girls, 9 boys wear glasses. How many boys do not wear glasses?', ['9', '18', '13', '31'], '\\(18 - 9\\).', 'tables'],
    ['barpie', 'A pie chart shows 60 people. What angle stands for 1 person?', ['6°', '60°', '3°', '0.6°'], '\\(360 \\div 60\\).', 'barpie'],
    ['barpie', 'A pie chart of 90 cars has a 120° sector for red cars. How many cars are red?', ['30', '40', '120', '45'], '\\(\\tfrac{120}{360} \\times 90\\).', 'barpie'],
    ['barpie', 'In a pictogram ■ = 6 books. How many books is ■■■ and half a ■?', ['21', '18', '3.5', '24'], '\\(3 \\times 6 + 3\\).', 'barpie'],
    ['barpie', 'Which chart is best to show each category as a fraction of the whole?', ['A pie chart', 'A scatter graph', 'A stem-and-leaf diagram', 'A frequency polygon'], 'The circle is the whole.', 'barpie'],
    ['barpie', 'In a bar chart the tallest bar shows…', ['the most common category', 'the total', 'the median', 'the range'], 'The highest frequency.', 'barpie'],
  ],
  LONG: [
    { q: 'The table shows the favourite fruit of 72 students: apple 20, banana 14, grape 26, orange 12. Work out the angle for each sector of a pie chart.', m: 3, s: ['M1 for \\(360 \\div 72 = 5°\\) per student.', 'A1 for at least two correct angles.', 'A1 for 100°, 70°, 130°, 60°.'], link: ['barpie', 'See pie chart angles again'] },
    { q: 'A two-way table shows 80 people: 45 are adults; 28 of the adults and 15 of the children own a bike. How many people do not own a bike?', m: 3, s: ['M1 for 35 children.', 'M1 for 17 adults or 20 children without a bike.', 'A1 for 37.'], link: ['tables', 'See two-way tables again'] },
    { q: 'A pie chart shows the votes of 300 people. The sector for “yes” has an angle of 132°. How many people voted “yes”?', m: 2, s: ['M1 for \\(\\tfrac{132}{360} \\times 300\\).', 'A1 for 110.'], link: ['barpie', 'See reading a pie chart again'] },
  ],
});
