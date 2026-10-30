// Shared namespace, helpers, icons, the sections and the saved progress.
window.FD = (() => {
  'use strict';
  const FD = { scenes: [], speed: 1 };

  FD.add = (scene) => FD.scenes.push(scene);

  // Build one element from an HTML string.
  FD.h = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  // Durations are divided by the playback speed.
  FD.dur = (ms) => ms / FD.speed;
  FD.wait = (ms) => new Promise((r) => setTimeout(r, FD.dur(ms)));
  FD.fmt = (n) => Math.round(n).toLocaleString('en-GB');
  FD.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  FD.shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  FD.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  FD.today = () => new Date().toLocaleDateString('en-GB');

  // Run fn(t) with t going 0 → 1 over ms (scaled by speed). Resolves when finished.
  FD.tween = (ms, fn) => new Promise((res) => {
    const t0 = performance.now(), d = FD.dur(ms);
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / d);
      fn(t);
      if (t < 1) requestAnimationFrame(tick); else res();
    };
    requestAnimationFrame(tick);
  });
  // Point at fraction t along a polyline [[x, y], …].
  FD.along = (pts, t) => {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    let d = t * seg.reduce((a, b) => a + b, 0);
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const k = seg[i] ? Math.min(1, d / seg[i]) : 1;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      d -= seg[i];
    }
    return pts[pts.length - 1];
  };

  FD.shake = (el) => {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  };
  FD.pulse = (el) => {
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  };

  // Segmented control: buttons with data-v, one is .on.
  FD.segSet = (root, v) => {
    root.querySelectorAll('button[data-v]').forEach((b) => {
      const on = b.dataset.v === String(v);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  };

  // Highlight one zone of a mock: root gets .focusing, matching [data-zone] gets .focus.
  FD.focus = (root, zones) => {
    const list = zones ? [].concat(zones) : [];
    root.classList.toggle('focusing', list.length > 0);
    const zs = [...root.querySelectorAll('[data-zone]')];
    zs.forEach((z) => { z.classList.toggle('focus', list.includes(z.dataset.zone)); z.classList.remove('focus-in'); });
    zs.filter((z) => z.classList.contains('focus')).forEach((z) => {
      for (let p = z.parentElement?.closest('[data-zone]'); p && root.contains(p); p = p.parentElement?.closest('[data-zone]')) p.classList.add('focus-in');
    });
  };

  // Small toast inside a mock.
  FD.toast = (host, html, ms = 2600) => {
    const t = FD.h(`<div class="toast">${html}</div>`);
    host.appendChild(t);
    setTimeout(() => t.classList.add('out'), FD.dur(ms));
    setTimeout(() => t.remove(), FD.dur(ms) + 400);
  };

  // Panels inside a stage: buttons [data-p] switch the visible [data-panel].
  FD.panels = (root, onShow) => {
    const show = (p) => {
      root.querySelectorAll('[data-panel]').forEach((x) => { x.hidden = x.dataset.panel !== p; });
      root.querySelectorAll('.ptabs button[data-p]').forEach((b) => {
        const on = b.dataset.p === p;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      root.dataset.panel = p;
      if (onShow) onShow(p);
    };
    root.querySelectorAll('.ptabs button[data-p]').forEach((b) => b.addEventListener('click', () => show(b.dataset.p)));
    return show;
  };

  // Copy text to the clipboard, with a fallback for older browsers.
  FD.copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  FD.download = (name, text, type = 'text/plain') => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  FD.slug = (s) => String(s || 'student').trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'student';

  // ---------- this lesson: its parts and sections (from lesson.js) ----------
  // window.LESSON = { id, parts: { A: { name, tier? } }, sections: [{ id, part, name, short, color, line, tier? }] }
  // tier 'H' = Higher tier only. Foundation students hide those parts with the tier switch.
  const L = window.LESSON;
  FD.META = (window.MH && window.MH.find(L.id)) || { title: L.title || L.id, area: 0, areaTitle: '', spec: '' };
  FD.LESSON = L;
  try { FD.tier = localStorage.getItem('mh-tier') === 'F' ? 'F' : 'H'; } catch (e) { FD.tier = 'H'; }
  FD.inTier = (x) => FD.tier === 'H' || !x || x.tier !== 'H';
  FD.ALL_PARTS = L.parts;
  FD.PARTS = Object.fromEntries(Object.entries(L.parts).filter(([, p]) => FD.inTier(p)));
  FD.ALL_SECTIONS = L.sections;
  FD.SECTIONS = L.sections.filter((s) => FD.inTier(s) && FD.PARTS[s.part]);
  FD.section = (id) => FD.ALL_SECTIONS.find((s) => s.id === id);
  FD.secIcon = (s) => (s && (FD.icon[s.icon] || FD.icon[s.id])) || '';
  FD.setTier = (t) => { try { localStorage.setItem('mh-tier', t); } catch (e) { /* ignore */ } location.reload(); };

  // ---------- saved progress: one key per lesson; name and class are shared by every lesson ----------
  const KEY = 'mh-' + L.id + '-v1';
  const blank = () => ({ v: 1, lesson: L.id, name: '', cls: '', seen: {}, last: '', step: 0, checks: {}, acts: {}, tests: {}, prac: {}, started: FD.today(), updated: '' });
  const readJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  FD.state = blank();
  FD.canSave = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) FD.state = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { FD.canSave = false; }
  const prof = readJSON('mh-profile', {});
  if (!FD.state.name && prof.name) FD.state.name = prof.name;
  if (!FD.state.cls && prof.cls) FD.state.cls = prof.cls;
  FD.results = FD.state.checks;

  let saveTimer = null;
  FD.save = (now) => {
    FD.state.updated = new Date().toISOString();
    clearTimeout(saveTimer);
    const write = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(FD.state));
        localStorage.setItem('mh-profile', JSON.stringify({ name: FD.state.name, cls: FD.state.cls }));
        // A summary per lesson, read by the hub (mastery map and "continue").
        const sum = readJSON('mh-summary', {});
        sum[L.id] = { pct: FD.percent ? FD.percent() : 0, at: FD.state.updated, last: FD.state.last };
        localStorage.setItem('mh-summary', JSON.stringify(sum));
        FD.canSave = true;
      } catch (e) { FD.canSave = false; }
    };
    if (now) write(); else saveTimer = setTimeout(write, 250);
    if (FD.onChange) FD.onChange();
  };
  FD.replaceState = (s) => {
    FD.state = Object.assign(blank(), s);
    FD.results = FD.state.checks;
    FD.save(true);
  };
  FD.resetState = () => { const { name, cls } = FD.state; FD.replaceState({ ...blank(), name, cls }); };
  FD.hasProgress = () => !!(Object.keys(FD.state.seen).length || Object.keys(FD.state.checks).length || Object.keys(FD.state.acts).length || Object.keys(FD.state.tests).length || Object.keys(FD.state.prac).length);

  FD.saveResult = (id, score, total) => {
    const r = FD.state.checks[id] || { tries: 0, best: 0 };
    FD.state.checks[id] = { score, total, tries: r.tries + 1, best: Math.max(r.best || 0, score), date: FD.today() };
    FD.save();
    if (FD.onResult) FD.onResult(id);
  };
  FD.markSeen = (id) => {
    if (FD.state.seen[id]) return;
    FD.state.seen[id] = FD.today();
    FD.save();
    if (FD.onResult) FD.onResult(id);
  };

  // ---------- icons (24×24 line icons) ----------
  const ic = (p) => `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  FD.icon = {
    start: ic('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>'),
    number: ic('<path d="M9 4L7 20M17 4l-2 16M4.5 9h16M3.5 15h16"/>'),
    algebra: ic('<path d="M4 7l6 10M10 7L4 17"/><path d="M14 12h6M17 9v6"/>'),
    graph: ic('<path d="M3.5 3.5v17h17"/><path d="M6 17c3-9 6-11 8-6s3 3 5-4"/>'),
    geometry: ic('<path d="M12 3.5L21 19.5H3z"/><path d="M8 19.5a4 4 0 0 0-2.3-3.6"/>'),
    vector: ic('<path d="M4 19L19 5"/><path d="M12.5 5H19v6.5"/>'),
    stats: ic('<path d="M4 20V11M9.5 20V5M15 20v-7M20.5 20V8"/>'),
    frac: ic('<path d="M7 9.5h4M9 7.5v4"/><path d="M5 12h14"/><circle cx="12" cy="16.5" r="2"/><path d="M15.5 4.5l-7 15"/>'),
    calc: ic('<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3.5" rx=".8"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>'),
    shapes: ic('<circle cx="8" cy="8" r="4.5"/><rect x="12" y="12" width="8.5" height="8.5" rx="1"/>'),
    dice: ic('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/>'),
    practice: ic('<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h5"/><path d="M15 15.5l1.5 1.5 3-3"/>'),
    target: ic('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>'),
    home: ic('<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6 10v10h12V10"/>'),
    bulb: ic('<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2v1.6h5V16c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
    terms: ic('<path d="M3.5 5h6a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H3.5z"/><path d="M20.5 5h-6A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h6.5z"/>'),
    final: ic('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 11l1.6 1.6 3-3M8.5 16.5h7"/>'),
    check: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>'),
    activity: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    progress: ic('<path d="M3.5 3.5v17h17"/><path d="M7.5 15l4-4.5 3 2.5 5-6"/>'),
    help: ic('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".5"/>'),
    tick: ic('<path d="M4.5 12.5l5 5 10-11"/>'),
    cross: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    copy: ic('<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>'),
    download: ic('<path d="M12 4v11M7 10.5l5 5 5-5"/><path d="M4.5 19.5h15"/>'),
    upload: ic('<path d="M12 15.5V4.5M7 9l5-5 5 5"/><path d="M4.5 19.5h15"/>'),
    key: ic('<circle cx="7.5" cy="12" r="3.5"/><path d="M11 12h10M17.5 12v3M20.5 12v2"/>'),
    lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    unlock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    play: ic('<path d="M7 4.5v15l12-7.5z"/>'),
    shield: ic('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/>'),
    search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    file: ic('<path d="M6 3h8l4.5 4.5V21H6z"/><path d="M14 3v4.5h4.5"/>'),
    printer: ic('<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="7.5" rx="1.5"/><path d="M7 14h10v6.5H7z"/>'),
    bt: ic('<path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9"/>'),
  };

  // ---------- short sounds (only after a click; muted by default in auto-play) ----------
  let actx = null;
  FD.audio = () => {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; }
    return actx;
  };
  FD.beep = (freq = 880, ms = 160, type = 'square', vol = 0.08, pan = 0) => {
    const a = FD.audio();
    if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000);
    let last = g;
    if (a.createStereoPanner) { const p = a.createStereoPanner(); p.pan.value = pan; g.connect(p); last = p; }
    o.connect(g); last.connect(a.destination);
    o.start(); o.stop(a.currentTime + ms / 1000 + 0.02);
  };

  return FD;
})();
