// Writes lessons/<id>/index.html from the lesson's lesson.js and its scene files.
// Usage: node tools/new-lesson.mjs <id>
// The scene order is the order of the files listed in LESSON.scenes (in lessons/<id>/lesson.js).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) { console.error('Usage: node tools/new-lesson.mjs <id>'); process.exit(1); }
const dir = path.join(root, 'lessons', id);
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/syllabus.js'), 'utf8'), ctx);
vm.runInNewContext(fs.readFileSync(path.join(dir, 'lesson.js'), 'utf8'), ctx);
const L = ctx.window.LESSON, meta = ctx.window.MH.find(id);
if (!meta) { console.error(`No lesson "${id}" in js/syllabus.js`); process.exit(1); }
for (const s of L.scenes) if (!fs.existsSync(path.join(dir, 'scenes', s + '.js'))) { console.error(`Missing scenes/${s}.js`); process.exit(1); }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const html = `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(meta.title)} · IGCSE Maths Hub</title>
  <meta name="description" content="${esc(L.description || meta.line)}">
  <link rel="icon" type="image/png" href="../../logo.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>
  <link rel="stylesheet" href="../../engine/styles.css">
  <link rel="stylesheet" href="../../engine/lesson.css">
  <link rel="stylesheet" href="../../engine/scenes.css">
  <link rel="stylesheet" href="../../engine/maths.css">${fs.existsSync(path.join(dir, 'lesson.css')) ? '\n  <link rel="stylesheet" href="lesson.css">' : ''}
</head>
<body class="area-${meta.area}">
  <header class="top">
    <div class="top-inner">
      <div class="brand">
        <a class="logo" href="../../hub/" role="img" aria-label="British School Alzira · Xàtiva · Gandia · back to the IGCSE Maths Hub"></a>
        <div class="titles">
          <p class="kicker">IGCSE Maths · Area ${meta.area} · ${esc(meta.areaTitle)}</p>
          <h1>${esc(meta.title)}${meta.tier === 'H' ? ' <i class="hbadge" title="Higher tier only">H</i>' : ''}</h1>
        </div>
      </div>
      <div class="top-actions">
        <a class="chip-btn hub-link" href="../../hub/" title="All the maths lessons">⌂ Hub</a>
        <button class="chip-btn prog-btn" id="btnProgress" title="See, copy and move your progress">📊 My progress <b id="progPct">0%</b></button>
        <button class="chip-btn" id="btnHelp" title="How to use this website" aria-label="How to use this website">? Help</button>
        <button class="chip-btn" id="btnProjector" aria-pressed="false" title="Bigger text for the classroom projector (P)">Projector mode</button>
        <button class="chip-btn" id="btnFull" title="Full screen (F)">Full screen</button>
      </div>
    </div>
    <nav class="tabs" id="tabs" aria-label="Scenes"></nav>
  </header>

  <main>
    <section class="lab" id="lab">
      <div class="card stage-card">
        <div class="stage-head">
          <span class="scene-ic" id="sceneIc"></span>
          <h2 id="sceneTitle"></h2>
          <span class="try" id="tryBadge" hidden>Interactive · try it</span>
        </div>
        <div class="stage" id="stage"></div>
      </div>

      <aside class="side">
        <div class="card narration" id="narration" aria-live="polite">
          <p class="step-count" id="stepCount"></p>
          <h3 id="stepTitle"></h3>
          <div class="step-text" id="stepText"></div>
          <p class="tip" id="stepTip" hidden></p>
        </div>
        <div class="card vocab" id="vocab" hidden>
          <h4>Key words</h4>
          <dl id="vocabList"></dl>
        </div>
      </aside>
    </section>

    <section class="page" id="page" hidden></section>
  </main>

  <footer class="controls" id="controls">
    <button class="btn ghost" id="btnReset" title="Restart this scene (R)">↺ <span>Restart</span></button>
    <button class="btn ghost" id="btnBack" title="Back (←)">◀ <span>Back</span></button>
    <button class="btn primary" id="btnPlay" title="Play / pause (Space)">▶ Play</button>
    <button class="btn ghost" id="btnNext" title="Next (→)"><span>Next</span> ▶</button>
    <label class="speed">Speed
      <select id="speed">
        <option value="0.5">0.5×</option>
        <option value="1" selected>1×</option>
        <option value="1.5">1.5×</option>
        <option value="2">2×</option>
      </select>
    </label>
    <div class="progress" aria-hidden="true"><div id="progressFill"></div></div>
  </footer>

  <script src="../../js/syllabus.js"></script>
  <script src="lesson.js"></script>
  <script src="../../engine/core.js"></script>
  <script src="../../engine/check.js"></script>
  <script src="../../engine/activity.js"></script>
  <script src="../../engine/test.js"></script>
  <script src="../../engine/maths.js"></script>
  <script src="../../engine/code.js"></script>
  <script src="../../engine/start.js"></script>
${L.scenes.map((s) => `  <script src="scenes/${s}.js"></script>`).join('\n')}
  <script src="../../engine/progress.js"></script>
  <script src="../../engine/app.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log(`lessons/${id}/index.html written (${L.scenes.length} scene files).`);

// The hub opens only lessons listed here: every lessons/<id>/ that has an index.html.
const ready = fs.readdirSync(path.join(root, 'lessons')).filter((d) => fs.existsSync(path.join(root, 'lessons', d, 'index.html'))).sort();
fs.writeFileSync(path.join(root, 'js/ready.js'), `// Written by tools/new-lesson.mjs: the lessons that exist. Do not edit by hand.\nwindow.MH_READY = ${JSON.stringify(ready)};\n`);
console.log(`js/ready.js: ${ready.length} lesson(s) ready.`);
