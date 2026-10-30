// Overflow audit: opens every scene and step of the given lessons at 1440, 1280 and 1024 px
// and in projector mode, and reports anything that spills out of its box.
// Usage: node tools/audit.mjs http://localhost:5202 fractions [more lesson ids…]
// Needs Playwright (PW env var = path to playwright's index.mjs if it is not installed here).
const PW = process.env.PW || '/Users/antoniofajardonavarro/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const [base, ...ids] = process.argv.slice(2);
if (!base || !ids.length) { console.error('Usage: node tools/audit.mjs <base-url> <lesson-id>…'); process.exit(1); }

// Runs in the page: returns a list of problems in what is visible now.
const probe = () => {
  const out = [];
  const name = (el) => (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || el.tagName.toLowerCase();
  const scrollable = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll)/.test(s.overflowX)) return true; } return false; };
  const roots = [...document.querySelectorAll('#stage, #page, .narration, .top')].filter((r) => r.offsetParent || r.getClientRects().length);
  roots.forEach((root) => {
    // HTML text wider than its own box
    root.querySelectorAll('*').forEach((el) => {
      if (el.closest('svg, .katex, .katex-display, .tabs, select, option') || !el.getClientRects().length) return;
      const s = getComputedStyle(el);
      if (s.display === 'inline' || s.visibility === 'hidden' || s.opacity === '0') return;
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && !/(auto|scroll|hidden|clip)/.test(s.overflowX) && el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') out.push(`text wider than box: ${name(el)} (${el.scrollWidth} > ${el.clientWidth}) "${(el.textContent || '').trim().slice(0, 40)}"`);
    });
    // boxes poking out of their parent
    root.querySelectorAll('.card, .mbox, .wl, .num-row, .chk-item, .opt, .btn, .ctrl, svg').forEach((el) => {
      const p = el.parentElement; if (!p || el.closest('.katex') || scrollable(el) || !el.getClientRects().length) return;
      const r = el.getBoundingClientRect(), q = p.getBoundingClientRect();
      if (r.width && (r.right > q.right + 2 || r.left < q.left - 2)) out.push(`box sticks out of its parent: ${name(el)} in ${name(p)} (${Math.round(r.left - q.left)}, ${Math.round(q.right - r.right)})`);
    });
    // SVG text outside its svg
    root.querySelectorAll('svg text').forEach((t) => {
      const svg = t.ownerSVGElement; if (!svg || !t.getClientRects().length || !t.textContent.trim()) return;
      const r = t.getBoundingClientRect(), q = svg.getBoundingClientRect();
      if (r.left < q.left - 1 || r.right > q.right + 1 || r.top < q.top - 1 || r.bottom > q.bottom + 1) out.push(`SVG text outside its svg: "${t.textContent.trim().slice(0, 30)}" in ${name(svg)}`);
    });
  });
  return out;
};

const browser = await chromium.launch();
let total = 0;
for (const id of ids) {
  for (const [w, h, proj] of [[1440, 900, false], [1280, 800, false], [1024, 768, false], [1280, 800, true]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.addInitScript((p) => { try { localStorage.setItem('mh-projector', p ? '1' : '0'); sessionStorage.setItem('mh-greeted-' + location.pathname.split('/').filter(Boolean).pop(), '1'); } catch (e) { /* ignore */ } }, proj);
    await page.goto(`${base}/lessons/${id}/`, { waitUntil: 'networkidle' });
    const scenes = await page.evaluate(() => window.FD.scenes.map((s) => ({ id: s.id, steps: s.page ? 1 : s.steps.length })));
    const found = new Map();
    for (const sc of scenes) {
      for (let k = 0; k < sc.steps; k++) {
        await page.evaluate(([sid, step]) => { window.FD.speed = 8; window.FD.goto(sid, step); }, [sc.id, k]);
        await page.waitForTimeout(1600);
        for (const p of await page.evaluate(probe)) { const key = p; if (!found.has(key)) found.set(key, `${sc.id}#${k + 1}`); }
      }
    }
    const label = `${id} @ ${w}px${proj ? ' projector' : ''}`;
    if (errs.length) console.log(`✗ ${label}: JS errors\n   ` + [...new Set(errs)].join('\n   '));
    if (found.size) { console.log(`✗ ${label}: ${found.size} problem(s)`); for (const [p, where] of found) console.log(`   [${where}] ${p}`); } else if (!errs.length) console.log(`✓ ${label}`);
    total += found.size + errs.length;
    await page.close();
  }
}
await browser.close();
console.log(total ? `\n${total} problem(s) found.` : '\nNo problems found.');
process.exit(total ? 1 : 0);
