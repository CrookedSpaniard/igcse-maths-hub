// Minutes after midnight → "09:05" (24-hour) or "9:05 am" (12-hour).
FD.hhmm = (m) => { m = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
FD.ampm = (m) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0'); return `${h % 12 === 0 ? 12 : h % 12}:${mm} ${h < 12 ? 'am' : 'pm'}`; };

// Timeline from t0 to t1 (minutes): the duration split into chunks (to the next hour, whole hours, the rest).
FD.tline = (host) => {
  host.innerHTML = '<svg class="tl" viewBox="0 0 600 140" role="img"></svg>';
  const svg = host.querySelector('svg');
  return (t0, t1, shown = 9) => {
    const a0 = Math.floor(t0 / 60) * 60, a1 = Math.ceil(t1 / 60) * 60, X = (t) => 30 + ((t - a0) / (a1 - a0)) * 540, step = (a1 - a0) / 60 > 8 ? 120 : 60;
    let s = `<line class="tl-ax" x1="20" y1="90" x2="580" y2="90"/>`;
    for (let t = a0; t <= a1; t += step) s += `<line class="tl-ax" x1="${X(t)}" y1="84" x2="${X(t)}" y2="96"/><text class="tl-t" x="${X(t)}" y="118">${FD.hhmm(t)}</text>`;
    const cuts = [t0]; const first = Math.ceil(t0 / 60) * 60; if (first > t0 && first < t1) cuts.push(first); const last = Math.floor(t1 / 60) * 60; if (last > cuts[cuts.length - 1] && last < t1) cuts.push(last); cuts.push(t1);
    cuts.slice(0, -1).forEach((c, i) => { if (i >= shown) return; const d = cuts[i + 1] - c; s += `<rect class="tl-bar" x="${X(c) + 1}" y="56" width="${Math.max(2, X(cuts[i + 1]) - X(c) - 2)}" height="22" rx="4"/>${X(cuts[i + 1]) - X(c) > 40 ? `<text class="tl-seg" x="${(X(c) + X(cuts[i + 1])) / 2}" y="48">${d >= 60 ? `${d / 60} h` : `${d} min`}</text>` : ''}`; });
    s += `<text class="tl-end" x="${Math.max(X(t0), 50)}" y="20">${FD.hhmm(t0)}</text><text class="tl-end" x="${Math.min(X(t1), 550)}" y="20">${FD.hhmm(t1)}</text>`;
    svg.innerHTML = s;
    svg.setAttribute('aria-label', `Timeline from ${FD.hhmm(t0)} to ${FD.hhmm(t1)}`);
  };
};
FD.dur = (d) => `${Math.floor(d / 60)} h ${d % 60} min`;

FD.add({
  id: 'time',
  title: 'Time and timetables',
  tab: 'Time',
  icon: 'graph',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['24-hour clock', 'Hours from 00:00 to 23:59. 3:45 pm is 15:45.'],
    ['Duration', 'How long something lasts. Count up to the next hour, then whole hours, then the rest.'],
    ['Hours as decimals', '60 minutes in an hour, not 100: 2.5 hours = 2 h 30 min, and 15 min = 0.25 h.'],
  ],
  mount(el) {
    const a = FD.board(el, 'ti-s', '<div id="tl"></div>', `
      <label class="ctrl">Start <input type="range" id="r0" min="0" max="1380" step="5" value="545"><output id="o0">09:05</output></label>
      <label class="ctrl">End <input type="range" id="r1" min="0" max="1435" step="5" value="830"><output id="o1">13:50</output></label>`, () => sync());
    a.tl = FD.tline(a.$('#tl'));
    const sync = () => {
      let t0 = +a.$('#r0').value, t1 = +a.$('#r1').value; if (t1 <= t0) { t1 = t0 + 5; a.$('#r1').value = t1; }
      a.$('#o0').textContent = FD.hhmm(t0); a.$('#o1').textContent = FD.hhmm(t1);
      a.tl(t0, t1);
      a.big(`${FD.hhmm(t0)} \\to ${FD.hhmm(t1)}: \\; ${FD.dur(t1 - t0).replace(/ /g, '\\ ')} = ${FD.round((t1 - t0) / 60, 3)} \\text{ hours}`);
      a.msg(`${FD.ampm(t0)} to ${FD.ampm(t1)} on the 12-hour clock.`);
    };
    ['#r0', '#r1'].forEach((s) => a.$(s).addEventListener('input', sync));
    a.tl(545, 830);
    return a;
  },
  steps: [
    {
      title: '12-hour and 24-hour clock',
      text: '<p>After midday, add 12 to the hours: 3:45 pm = <b>15:45</b>. Before 10 am, put a 0 in front: 9:05 am = <b>09:05</b>.</p><p>Midnight is 00:00.</p>',
      async on(a, ctx) {
        a.reset(); a.tl(545, 945);
        await a.lines([['9{:}05 \\text{ am} = 09{:}05', ''], ['3{:}45 \\text{ pm} = 15{:}45', '+ 12'], ['12{:}20 \\text{ am} = 00{:}20', 'just after midnight']], ctx, 1300);
      },
    },
    {
      title: 'How long?',
      text: '<p>A train leaves at 09:35 and arrives at 13:10. How long is the journey?</p><p>Count up in chunks: to the next hour, whole hours, then the rest.</p>',
      tip: 'Do not subtract times like ordinary numbers: 13.10 − 9.35 = 3.75 is wrong!',
      async on(a, ctx) {
        a.reset();
        for (let k = 1; k <= 3; k++) { a.tl(575, 790, k); if (!(await ctx.sleep(900))) return; }
        await a.lines([['25 \\text{ min} + 3 \\text{ h} + 10 \\text{ min}', '09:35 → 10:00 → 13:00 → 13:10'], ['= 3 \\text{ h } 35 \\text{ min}', '']], ctx, 1300);
      },
    },
    {
      title: 'Hours and minutes as decimals',
      text: '<p>There are <b>60</b> minutes in an hour. To change minutes to hours, divide by 60. To change a decimal of an hour to minutes, multiply by 60.</p>',
      async on(a, ctx) {
        a.reset(); a.tl(540, 705);
        await a.lines([['2 \\text{ h } 45 \\text{ min} = 2 + \\tfrac{45}{60} = 2.75 \\text{ h}', ''], ['3.2 \\text{ h} = 3 \\text{ h} + 0.2 \\times 60 = 3 \\text{ h } 12 \\text{ min}', ''], ['\\text{pay for } 2.75 \\text{ h at } \\pounds 12 = \\pounds 33', 'use the decimal']], ctx, 1300);
      },
    },
    {
      title: 'Reading a timetable',
      text: '<p>Bus times: Ashby 07:50, 08:25, 09:10 · Bridgeton 08:12, 08:47, 09:32 · Carlow 08:40, 09:15, 10:00.</p><p>Kim must be in Carlow by 09:30. Which is the latest bus she can catch from Ashby, and how long is the ride?</p>',
      async on(a, ctx) {
        a.reset(); a.tl(505, 555);
        await a.lines([['\\text{arrive } 09{:}15 \\le 09{:}30', 'the 08:25 bus'], ['08{:}25 \\to 09{:}15 = 50 \\text{ min}', '']], ctx, 1400);
      },
    },
    {
      title: 'Try it: how long?',
      text: '<p>Choose a start and an end time. The timeline splits the time into easy chunks.</p>',
      on(a) { a.reset(); a.tryMode(true); },
    },
  ],
});

FD.practice({
  section: 'time',
  gens: [
    () => { const t0 = FD.rnd(36, 200) * 5, d = FD.rnd(7, 70) * 5, t1 = t0 + d; return { type: 'num', q: `A film starts at ${FD.hhmm(t0)} and ends at ${FD.hhmm(t1)}. How long is the film, in minutes?`, a: d, why: `${FD.hhmm(t0)} to ${FD.hhmm(t1)} is ${FD.dur(d)} = ${d} minutes.` }; },
    () => { const m = FD.rnd(13 * 12, 23 * 12) * 5; return { type: 'mcq', q: `Write ${FD.ampm(m)} in the 24-hour clock.`, opts: [FD.hhmm(m), FD.hhmm(m - 720), FD.hhmm(m + 60), `${Math.floor(m / 60) - 12}${String(m % 60).padStart(2, '0')}`].filter((v, i, s) => s.indexOf(v) === i), why: `After midday add 12 to the hours: ${FD.hhmm(m)}.` }; },
    () => { const h = FD.rnd(1, 6), mm = FD.pick([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]), dec = FD.dec(h + mm / 60), toDec = FD.rnd(0, 1); return toDec ? { type: 'num', q: `Write ${h} hours ${mm} minutes as a decimal number of hours.`, a: dec, why: `\\(${mm} \\div 60 = ${FD.dec(mm / 60)}\\), so ${dec} hours.` } : { type: 'num', q: `${dec} hours is ${h} hours and how many minutes?`, a: mm, why: `\\(${FD.dec(mm / 60)} \\times 60 = ${mm}\\) minutes.` }; },
    () => { const t0 = FD.rnd(60, 250) * 5, d = FD.rnd(8, 60) * 5; return { type: 'mcq', q: `A journey starts at ${FD.hhmm(t0)} and takes ${FD.dur(d)}. When does it end?`, opts: [FD.hhmm(t0 + d), FD.hhmm(t0 + d + 40), FD.hhmm(t0 + d - 60), FD.hhmm(t0 + Math.floor(d / 60) * 100 % 1440)].filter((v, i, s) => s.indexOf(v) === i), why: `Add the hours, then the minutes: ${FD.hhmm(t0)} + ${FD.dur(d)} = ${FD.hhmm(t0 + d)}.` }; },
  ],
});

FD.check({
  section: 'time',
  items: [
    { type: 'mcq', q: 'Write 7:20 pm in the 24-hour clock.', opts: ['19:20', '07:20', '17:20', '1920 pm'], why: '7 + 12 = 19.' },
    { type: 'num', q: 'A lesson runs from 10:50 to 12:15. How long is it, in minutes?', a: 85, why: '10 min + 1 h + 15 min = 85 min.' },
    { type: 'num', q: 'Write 1 hour 24 minutes in hours, as a decimal.', a: 1.4, why: '\\(24 \\div 60 = 0.4\\).' },
    { type: 'tf', q: '3.5 hours is 3 hours 50 minutes.', a: false, why: '0.5 h = 30 minutes.' },
  ],
});
