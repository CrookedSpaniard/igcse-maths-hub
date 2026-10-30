// Maths helpers shared by every lesson:
//   • KaTeX: any text written as \( … \) or \[ … \] is typeset automatically.
//   • Random numbers and fractions for generated questions.
//   • The "num" check type (typed numeric answers: 12, -3.5, 3/4, 1 1/2).
//   • FD.practice: endless random questions with a worked method after each answer.
//   • FD.work: a worked example whose lines appear one by one.
//   • FD.axes: coordinate axes in SVG for graphs.
(() => {
  'use strict';
  const FD = window.FD;

  // ---------- KaTeX ----------
  const opts = {
    delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
    throwOnError: false,
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input'],
  };
  // Questions, answers and methods use full-size fractions (\frac → \dfrac) so they are easy to read.
  const big = { ...opts, macros: { '\\frac': '\\dfrac', '\\tfrac': '\\dfrac' } };
  const BIG = '.chk-q, .qz-q, .opt, .num-want, .method, .long > p, .scheme, .mbig';
  FD.typeset = (el) => {
    if (!window.renderMathInElement || !el) return;
    (el.matches && el.matches(BIG) ? [el] : []).concat([...el.querySelectorAll(BIG)]).forEach((b) => window.renderMathInElement(b, big));
    window.renderMathInElement(el, opts);
  };
  FD.tex = (s, display) => (window.katex ? window.katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  // Typeset anything new that appears on the page (scenes, checks, dialogs).
  let pending = false;
  const mo = new MutationObserver((list) => {
    if (pending) return;
    if (!list.some((m) => [...m.addedNodes].some((n) => (n.nodeType === 1 || n.nodeType === 3) && !(n.parentElement && n.parentElement.closest('.katex')) && /\\[([]/.test(n.textContent || '')))) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; FD.typeset(document.body); });
  });
  document.addEventListener('DOMContentLoaded', () => { FD.typeset(document.body); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); });

  // ---------- numbers ----------
  FD.rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  FD.rndNZ = (a, b) => { let v = 0; while (v === 0) v = FD.rnd(a, b); return v; };
  FD.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  FD.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  FD.lcm = (a, b) => Math.abs(a * b) / FD.gcd(a, b);
  FD.round = (x, dp = 0) => { const k = 10 ** dp; return Math.round((x + Number.EPSILON) * k) / k; };
  FD.sigfig = (x, sf) => (x === 0 ? 0 : +x.toPrecision(sf));
  // A number written the British way: 12 345.6 → "12 345.6" (thin spaces would confuse students typing; use commas).
  FD.num = (x, dp) => (dp == null ? +x : +(+x).toFixed(dp)).toLocaleString('en-GB', { maximumFractionDigits: 10 });
  // Fraction n/d simplified, as [n, d] with d > 0.
  FD.simp = (n, d) => { const g = FD.gcd(n, d), s = d < 0 ? -1 : 1; return [s * n / g, s * d / g]; };
  // TeX for a fraction (simplified), e.g. FD.ftex(6, 8) → "\frac{3}{4}"; whole numbers stay whole.
  FD.ftex = (n, d, mixed) => {
    [n, d] = FD.simp(n, d);
    if (d === 1) return String(n);
    if (mixed && Math.abs(n) > d) { const w = Math.trunc(n / d), r = Math.abs(n % d); return `${w}\\tfrac{${r}}{${d}}`; }
    return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
  };
  // Read what a student typed: "12", "-3.5", "3/4", "1 1/2", "−2", "1,250", "45%".
  FD.parseNum = (raw) => {
    let s = String(raw || '').trim().replace(/[−–]/g, '-').replace(/×/g, '*').replace(/%$/, '').trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
    let m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return (m[1] ? -1 : 1) * (+m[2] + +m[3] / +m[4]);
    m = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
    if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2];
    m = s.match(/^-?(\d+\.?\d*|\.\d+)$/);
    if (m) return +s;
    return NaN;
  };
  const norm = (s) => String(s || '').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/\*/g, '×');

  // ---------- the "num" check type ----------
  // { type: 'num', q, a: number | string | [answers…], fields?: [label…], tol?, unit?, anyOrder?, why }
  //   a number is compared with tolerance tol (default: exact to 6 decimal places);
  //   a string is compared as text (spaces and case ignored), e.g. '(x+3)(x-2)'.
  TYPES.num = (it, body, finish) => {
    const ans = [].concat(it.a);
    const fields = it.fields || ans.map(() => '');
    body.innerHTML = `
      <div class="num-row">${fields.map((f, k) => `
        <label class="num-f">${f ? `<span>${f}</span>` : ''}<input class="num-in" inputmode="${typeof ans[k] === 'number' ? 'decimal' : 'text'}" autocomplete="off" spellcheck="false" aria-label="${f || 'Your answer'}">${it.unit ? `<em>${it.unit}</em>` : ''}</label>`).join('')}
        <button class="btn small-btn chk-go" disabled>Check answer</button>
      </div>
      ${it.hint ? `<p class="chk-hint">${it.hint}</p>` : ''}`;
    const ins = [...body.querySelectorAll('.num-in')], go = body.querySelector('.chk-go');
    // form: 'mixed' (must be like 2 3/4), 'fraction' (like 11/4) or 'simplest' (a fraction that cannot be simplified).
    const shape = (v) => {
      const s = String(v).trim().replace(/[−–]/g, '-');
      if (it.form === 'mixed') return /^-?\d+\s+\d+\s*\/\s*\d+$/.test(s);
      const m = s.match(/^-?(\d+)\s*\/\s*(\d+)$/);
      if (it.form === 'fraction') return !!m;
      const mx = s.match(/^-?\d+\s+(\d+)\s*\/\s*(\d+)$/);
      if (it.form === 'simplest') return m ? FD.gcd(+m[1], +m[2]) === 1 : mx ? FD.gcd(+mx[1], +mx[2]) === 1 && +mx[1] < +mx[2] : /^-?\d+$/.test(s);
      return true;
    };
    const ok = (v, a) => (typeof a === 'number' ? Math.abs(FD.parseNum(v) - a) <= (it.tol != null ? it.tol : 1e-6) && shape(v) : norm(v) === norm(a));
    ins.forEach((i) => {
      i.addEventListener('input', () => { go.disabled = ins.some((x) => !x.value.trim()); });
      i.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !go.disabled) go.click(); });
    });
    go.addEventListener('click', () => {
      if (body.dataset.done) return;
      body.dataset.done = 1;
      go.hidden = true;
      let score = 0;
      const left = ans.slice();
      ins.forEach((i, k) => {
        i.readOnly = true;
        let hit;
        if (it.anyOrder) { const j = left.findIndex((a) => a != null && ok(i.value, a)); hit = j >= 0; if (hit) left[j] = null; } else hit = ok(i.value, ans[k]);
        score += hit;
        i.classList.add(hit ? 'right' : 'wrong');
        if (!hit && !it.show) i.insertAdjacentHTML('afterend', `<span class="num-want">${typeof ans[k] === 'number' && !it.anyOrder ? FD.num(ans[k]) : ''}</span>`);
      });
      if (score < ans.length && (it.show || it.anyOrder || ans.some((a) => typeof a !== 'number'))) body.insertAdjacentHTML('beforeend', `<p class="num-want">Answer: ${it.show || ans.join(', ')}</p>`);
      finish(score);
    });
    return ans.length;
  };

  // ---------- practice: endless random questions ----------
  FD.PRACS = [];
  FD.PRAC_TARGET = 5;
  FD.pracDone = (id) => ((FD.state.prac[id] || {}).right || 0) >= FD.PRAC_TARGET;
  // FD.practice({ section, intro?, gens: [() => item, …] }) — item is any check item (num, mcq, tf, multi…).
  FD.practice = (cfg) => {
    const sec = FD.section(cfg.section), id = 'prac-' + cfg.section;
    FD.PRACS.push(id);
    FD.add({
      id, title: 'Practice: ' + sec.name, icon: 'practice', color: sec.color, practice: true, page: true,
      mount(el, nav) {
        const P = () => FD.state.prac[id] || (FD.state.prac[id] = { right: 0, tries: 0, streak: 0, best: 0 });
        const nextSc = FD.scenes[FD.scenes.findIndex((s) => s.id === id) + 1];
        el.innerHTML = `
          <div class="chk-head" style="--c:var(${sec.color})">
            <span class="chk-ic">${FD.icon.practice}</span>
            <div><p class="kick">Practice · new numbers every time</p><h2>${sec.name}</h2></div>
            <p class="chk-score" id="prScore" aria-live="polite"></p>
          </div>
          <p class="lead">${cfg.intro || `Answer the question, then read the method. Get <b>${FD.PRAC_TARGET} right</b> to complete this practice. You can keep going as long as you like.`}</p>
          <div class="card prac-card" id="prCard"></div>
          <div class="chk-btns prac-btns">
            <button class="btn primary" id="prNew">New question ↻</button>
            <button class="btn ghost" id="prNext">Continue: ${nextSc ? nextSc.tab || nextSc.title : 'Next'} ▶</button>
            <button class="btn ghost" id="prBack">◀ Back to the section</button>
          </div>`;
        const card = el.querySelector('#prCard');
        const score = () => {
          const p = P();
          el.querySelector('#prScore').innerHTML = `<b>${p.right}</b> right${p.streak > 1 ? ` · 🔥 ${p.streak} in a row` : ''}`;
          el.classList.toggle('prac-done', FD.pracDone(id));
        };
        const ask = () => {
          const it = FD.pick(cfg.gens)();
          card.innerHTML = `<p class="chk-q">${it.q}</p><div class="chk-body"></div><div class="chk-fb" hidden></div>`;
          const n = TYPES[it.type || 'num'](it, card.querySelector('.chk-body'), (got) => {
            const p = P(), full = got === n, wasDone = FD.pracDone(id);
            p.tries++;
            if (full) { p.right++; p.streak++; p.best = Math.max(p.best, p.streak); } else p.streak = 0;
            FD.save();
            const fb = card.querySelector('.chk-fb');
            fb.hidden = false;
            fb.className = 'chk-fb ' + (full ? 'good' : 'bad');
            fb.innerHTML = `<b>${full ? '✓ Correct!' : '✗ Not quite.'}</b> ${it.why ? `<div class="method"><span class="kick">Method</span>${it.why}</div>` : ''}`;
            if (!wasDone && FD.pracDone(id)) { FD.toast(card, `🎉 Practice complete: ${FD.PRAC_TARGET} right!`); if (FD.onResult) FD.onResult(id); }
            score();
            el.querySelector('#prNew').focus();
          });
          score();
          const inp = card.querySelector('input');
          if (inp) inp.focus({ preventScroll: true });
        };
        el.querySelector('#prNew').addEventListener('click', ask);
        el.querySelector('#prNext').addEventListener('click', nav.next);
        el.querySelector('#prBack').addEventListener('click', () => FD.goto(cfg.section));
        ask();
      },
    });
  };

  // ---------- worked example: lines of working revealed one by one ----------
  // const w = FD.work(host, [[tex, note?], …]); w.upto(k) shows lines 0..k (k = -1 hides all).
  FD.work = (host, lines, cls = '') => {
    const box = FD.h(`<div class="work ${cls}">${lines.map(([t, n]) => `<div class="wl"><span class="wl-m">\\(\\displaystyle ${t}\\)</span>${n ? `<span class="wl-n">${n}</span>` : ''}</div>`).join('')}</div>`);
    host.appendChild(box);
    FD.typeset(box);
    const rows = [...box.children];
    return {
      el: box,
      upto(k) { rows.forEach((r, i) => { r.classList.toggle('on', i <= k); r.classList.toggle('now', i === k); }); },
    };
  };

  // ---------- coordinate axes (SVG) ----------
  // const ax = FD.axes({ w: 480, h: 360, x: [-5, 5], y: [-5, 5], step: 1, pad: 28 });
  // ax.X(x), ax.Y(y) → pixels; ax.grid() → SVG markup; ax.path(f, a?, b?) → path data for y = f(x).
  FD.axes = ({ w = 480, h = 360, x = [-5, 5], y = [-5, 5], step = 1, ystep = step, pad = 28, labels = true }) => {
    const X = (v) => pad + ((v - x[0]) / (x[1] - x[0])) * (w - 2 * pad);
    const Y = (v) => h - pad - ((v - y[0]) / (y[1] - y[0])) * (h - 2 * pad);
    const ticks = (a, b, s) => { const t = []; for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) t.push(+v.toFixed(6)); return t; };
    const x0 = FD.clamp(0, x[0], x[1]), y0 = FD.clamp(0, y[0], y[1]);
    const grid = () => `
      <g class="ax-grid">${ticks(x[0], x[1], step).map((v) => `<line x1="${X(v)}" y1="${Y(y[0])}" x2="${X(v)}" y2="${Y(y[1])}"/>`).join('')}${ticks(y[0], y[1], ystep).map((v) => `<line x1="${X(x[0])}" y1="${Y(v)}" x2="${X(x[1])}" y2="${Y(v)}"/>`).join('')}</g>
      <g class="ax-axes"><line x1="${X(x[0])}" y1="${Y(y0)}" x2="${X(x[1]) + 6}" y2="${Y(y0)}" marker-end="url(#axArr)"/><line x1="${X(x0)}" y1="${Y(y[0])}" x2="${X(x0)}" y2="${Y(y[1]) - 6}" marker-end="url(#axArr)"/></g>
      <defs><marker id="axArr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ax-arr"/></marker></defs>
      ${labels ? `<g class="ax-lbl">${ticks(x[0], x[1], step).filter((v) => v !== 0).map((v) => `<text x="${X(v)}" y="${Y(y0) + 15}">${String(v).replace('-', '−')}</text>`).join('')}${ticks(y[0], y[1], ystep).filter((v) => v !== 0).map((v) => `<text x="${X(x0) - 8}" y="${Y(v) + 4}" class="ax-ly">${String(v).replace('-', '−')}</text>`).join('')}
        <text x="${X(x[1]) + 2}" y="${Y(y0) - 8}" class="ax-name">x</text><text x="${X(x0) + 10}" y="${Y(y[1]) + 4}" class="ax-name">y</text></g>` : ''}`;
    const path = (f, a = x[0], b = x[1], n = 240) => {
      let d = '', pen = false;
      for (let i = 0; i <= n; i++) {
        const xv = a + ((b - a) * i) / n, yv = f(xv);
        if (!isFinite(yv) || yv < y[0] - (y[1] - y[0]) || yv > y[1] + (y[1] - y[0])) { pen = false; continue; }
        d += `${pen ? 'L' : 'M'}${X(xv).toFixed(1)} ${Y(yv).toFixed(1)}`;
        pen = true;
      }
      return d;
    };
    return { X, Y, grid, path, w, h };
  };
})();
