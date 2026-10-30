(() => {
  'use strict';

  // 24×24 stroke icons for the six areas
  const ICONS = {
    number: '<path d="M9 4L7 20M17 4l-2 16M4.5 9h16M3.5 15h16"/>',
    algebra: '<path d="M4 7l6 10M10 7L4 17"/><path d="M14 12h6M17 9v6"/>',
    graph: '<path d="M3.5 3.5v17h17"/><path d="M6 17c3-9 6-11 8-6s3 3 5-4"/>',
    geometry: '<path d="M12 3.5L21 19.5H3z"/><path d="M8 19.5a4 4 0 0 0-2.3-3.6"/>',
    vector: '<path d="M4 19L19 5"/><path d="M12.5 5H19v6.5"/>',
    stats: '<path d="M4 20V11M9.5 20V5M15 20v-7M20.5 20V8"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[k] || ''}</svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const $ = (s) => document.querySelector(s);

  const MH = window.MH;
  let tier = 'H';
  try { tier = localStorage.getItem('mh-tier') === 'F' ? 'F' : 'H'; } catch (e) { /* storage blocked */ }
  const sum = read('mh-summary', {});
  const pctOf = (id) => (sum[id] ? sum[id].pct || 0 : 0);
  const inTier = (l) => tier === 'H' || l.tier !== 'H';

  // ---------- areas and lesson cards ----------
  const main = $('#units'), links = $('#unitLinks');
  let i = 0;
  MH.areas.forEach((a) => {
    const sec = document.createElement('section');
    sec.className = 'unit tone-' + a.tone;
    sec.id = 'area-' + a.n;
    sec.setAttribute('aria-labelledby', 'area-' + a.n + '-title');
    sec.innerHTML = `
      <div class="unit-head">
        <span class="unit-num" aria-hidden="true">${pad(a.n)}</span>
        <div class="unit-titles">
          <p class="unit-kicker">Area ${a.n}</p>
          <h2 id="area-${a.n}-title">${esc(a.title)}</h2>
        </div>
        <span class="unit-count">${a.lessons.length} lessons</span>
      </div>
      <div class="grid">
        ${a.lessons.map((l) => `
          <a class="lcard soon ${inTier(l) ? '' : 'off-tier'}" href="lessons/${l.id}/" data-id="${l.id}" style="--i:${i++}"
             data-search="${esc((l.spec + ' ' + l.title + ' ' + l.line + ' area ' + a.n + ' ' + a.title).toLowerCase())}">
            <span class="lcard-top">
              <span class="lcard-ic">${svg(a.icon)}</span>
              <span class="lcard-code">${esc(l.spec)}${l.tier === 'H' ? ' <i class="hbadge" title="Higher tier only">H</i>' : ''}</span>
            </span>
            <h3>${esc(l.title)}</h3>
            <p>${esc(l.line)}</p>
            <span class="lbar" aria-hidden="true"><i style="--v:${pctOf(l.id)}%"></i></span>
            <span class="lcard-foot">
              <span class="lcard-pct">${pctOf(l.id) ? pctOf(l.id) + '% done' : ''}</span>
              <span class="go">Coming soon</span>
            </span>
          </a>`).join('')}
      </div>`;
    main.appendChild(sec);
    const link = document.createElement('a');
    link.href = '#area-' + a.n;
    link.className = 'tone-' + a.tone;
    link.innerHTML = `<b>${a.n}</b> ${esc(a.short)}`;
    link.title = `Area ${a.n} · ${a.title}`;
    links.appendChild(link);
  });
  $('#lessonCount').textContent = MH.lessons.length;

  // A lesson is "ready" when its folder has been published.
  const ready = new Set();
  const markReady = (id) => {
    ready.add(id);
    const c = main.querySelector(`.lcard[data-id="${id}"]`);
    c.classList.remove('soon');
    c.querySelector('.go').innerHTML = 'Open lesson <span class="arr" aria-hidden="true">→</span>';
  };
  (window.MH_READY || []).forEach((id) => { if (MH.find(id)) markReady(id); });
  mine();

  // ---------- my maths: mastery per area, overall %, continue ----------
  function mine() {
    const lessons = MH.lessons.filter(inTier);
    const all = lessons.length ? Math.round(lessons.reduce((n, l) => n + pctOf(l.id), 0) / lessons.length) : 0;
    $('#allPct').innerHTML = `${all}<small>%</small>`;
    $('#mastery').innerHTML = MH.areas.map((a) => {
      const ls = a.lessons.filter(inTier), p = ls.length ? Math.round(ls.reduce((n, l) => n + pctOf(l.id), 0) / ls.length) : 0;
      return `<a class="ms tone-${a.tone}" href="#area-${a.n}" title="Area ${a.n} · ${esc(a.title)}: ${p}%"><small>${a.n} · ${esc(a.short)}</small><span class="ms-bar"><i style="--v:${p}%"></i></span><b>${p}%</b></a>`;
    }).join('');
    const recent = Object.entries(sum).filter(([id]) => ready.has(id)).sort((x, y) => String(y[1].at).localeCompare(String(x[1].at)));
    const prof = read('mh-profile', {});
    $('#meLine').innerHTML = recent.length
      ? `${prof.name ? `Hi ${esc(prof.name.split(' ')[0])}! ` : ''}Average across the ${lessons.length} lessons in your tier (${tier === 'F' ? 'Foundation' : 'Higher'}).`
      : 'Open a lesson to start. Your progress is saved on this device.';
    const next = recent.length ? MH.find(recent[0][0]) : MH.lessons.find((l) => ready.has(l.id) && inTier(l));
    $('#cont').innerHTML = next ? `<a class="hbtn primary" href="lessons/${next.id}/">▶ ${recent.length ? 'Continue' : 'Start'}: ${esc(next.title)}</a>` : '';
  }

  // ---------- tier ----------
  const tierBtns = [...document.querySelectorAll('#tier button')];
  tierBtns.forEach((b) => {
    const on = b.dataset.t === tier;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
    b.addEventListener('click', () => { try { localStorage.setItem('mh-tier', b.dataset.t); } catch (e) { /* storage blocked */ } location.reload(); });
  });

  // ---------- progress code ----------
  $('#cCopy').addEventListener('click', async () => {
    const code = await window.MHCode.make();
    let ok = true;
    try { await navigator.clipboard.writeText(code); } catch (e) { ok = false; }
    $('#cMsg').innerHTML = ok ? `<b class="good">✓ Code copied</b> (${code.length.toLocaleString('en-GB')} characters). Paste it in an email to yourself.` : '<b class="bad">Could not copy automatically.</b> Select the code below and copy it.';
    if (!ok) $('#cIn').value = code;
  });
  $('#cLoad').addEventListener('click', async () => {
    try {
      const all = await window.MHCode.read($('#cIn').value);
      const p = all['mh-profile'] ? JSON.parse(all['mh-profile']) : {};
      if (Object.keys(window.MHCode.collect()).some((k) => k !== 'mh-tier') && !confirm(`Load the maths progress of ${p.name || 'this code'}? It will replace the progress saved on this device.`)) return;
      window.MHCode.apply(all);
      location.reload();
    } catch (e) {
      $('#cMsg').innerHTML = `<b class="bad">${esc(e.message || 'That code did not work.')}</b>`;
    }
  });

  // ---------- search ----------
  const input = $('#search'), empty = $('#empty');
  input.addEventListener('input', () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
      .map((w) => new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    let shown = 0;
    main.querySelectorAll('.unit').forEach((sec) => {
      let n = 0;
      sec.querySelectorAll('.lcard').forEach((c) => { const ok = words.every((w) => w.test(c.dataset.search)); c.hidden = !ok; if (ok) n++; });
      sec.hidden = n === 0;
      shown += n;
    });
    empty.hidden = shown > 0;
    $('#emptyQ').textContent = input.value.trim();
  });

  // ---------- projector mode ----------
  const pj = $('#btnProjector');
  const setPj = (on) => {
    document.body.classList.toggle('projector', on);
    pj.setAttribute('aria-pressed', String(on));
    try { localStorage.setItem('mh-projector', on ? '1' : '0'); } catch (e) { /* storage blocked */ }
  };
  try { if (localStorage.getItem('mh-projector') === '1') setPj(true); } catch (e) { /* storage blocked */ }
  pj.addEventListener('click', () => setPj(!document.body.classList.contains('projector')));
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey) setPj(!document.body.classList.contains('projector'));
    if (e.key === '/') { e.preventDefault(); input.focus(); }
  });
})();
