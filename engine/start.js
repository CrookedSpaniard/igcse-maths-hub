// The Start page of every lesson, built from lesson.js (LESSON.intro, LESSON.hero).
FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state, L = FD.LESSON, M = FD.META;
    const first = FD.SECTIONS[0];
    const part = (p) => {
      const secs = FD.SECTIONS.filter((s) => s.part === p);
      const t = S.tests['test' + p];
      return `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name}${FD.PARTS[p].tier === 'H' ? ' <i class="hbadge">H</i>' : ''}</h3>
        <ul class="st-list">${secs.map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.secIcon(s)}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}${s.tier === 'H' && FD.PARTS[p].tier !== 'H' ? ' <i class="hbadge">H</i>' : ''}</b><small>${s.line}</small></span>${S.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          ${FD.TESTS['test' + p] ? `<li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${t && t.done ? '<span class="st-done">✓</span>' : ''}</button></li>` : ''}
        </ul>
      </section>`;
    };
    const hidden = FD.ALL_SECTIONS.length - FD.SECTIONS.length;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Area ${M.area} · ${M.areaTitle} · Specification ${M.spec}</p>
          <h2>${M.title}</h2>
          <p>${L.intro}</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' && FD.scenes.some((x) => x.id === S.last) ? '▶ Continue where I left off' : `▶ Start: ${first ? first.name : ''}`}</button>
            <button class="btn ghost on-dark" id="sProg">${FD.icon.progress} My progress</button>
          </div>
        </div>
        ${L.hero || ''}
      </section>

      <section class="card tier-box">
        <div><b>Tier: ${FD.tier === 'F' ? 'Foundation' : 'Higher'}</b>
        <span class="small muted">${FD.tier === 'F' ? (hidden ? `${hidden} Higher-only section${hidden > 1 ? 's are' : ' is'} hidden.` : 'Everything in this lesson is in the Foundation tier.') : 'You see everything, including the parts marked <i class="hbadge">H</i> (Higher only).'}</span></div>
        <button class="btn ghost" id="sTier">Switch to ${FD.tier === 'F' ? 'Higher' : 'Foundation'}</button>
      </section>

      <div class="st-cols">${Object.keys(FD.PARTS).map(part).join('')}</div>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>
      <p class="small muted">Want to repeat this lesson from zero? <button class="link-btn danger" id="sReset">↺ Reset my progress</button></p>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. Exam-style questions are written for practice in the style of ${window.MH ? window.MH.spec : 'the exam'}; real past papers are on <a href="https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-a-2016.html" target="_blank" rel="noopener">Pearson’s website</a>.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start' && FD.scenes.some((x) => x.id === FD.state.last)) FD.goto(FD.state.last, FD.state.step || 0);
      else if (first) FD.goto(first.id);
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    $('#sTier').addEventListener('click', () => FD.setTier(FD.tier === 'F' ? 'H' : 'F'));
    $('#sReset').addEventListener('click', () => FD.openProgress('reset'));
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
