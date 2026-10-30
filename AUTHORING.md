# How to build a lesson (IGCSE Maths Hub)

The site is static HTML/CSS/JS with **no build step**. Every lesson lives in its own folder, `lessons/<id>/`.
The lesson ids, titles, spec references and tiers are already in `js/syllabus.js`. Use those ids exactly.

**`lessons/fractions/` is the reference lesson.** Read all of it before building a new one, then copy its patterns.

## Files in a lesson
```
lessons/<id>/lesson.js      window.LESSON = { id, description, intro, hero, parts, sections, scenes }
lessons/<id>/lesson.css     styles for this lesson only (optional)
lessons/<id>/scenes/*.js    one file per section (scene + practice + check), plus testA.js / testB.js
lessons/<id>/index.html     GENERATED, never edit by hand
```

Generate (or regenerate) the page with `node tools/new-lesson.mjs <id>`. This also refreshes `js/ready.js`, which is how the hub knows the lesson exists.

In the ANIMACIONES folder, Bash cannot write files. Use Write/Edit, or run node through the node_repl tool with `child_process.execFileSync('node', [...])`.

## lesson.js
- **`parts`**: `{ A: { name }, B: { name, tier: 'H' } }`. A part with `tier: 'H'` is Higher only.
- **`sections`**: `[{ id, part, name, short, icon, color, line, tier? }]`.
  - Add `tier: 'H'` to a section that is Higher only.
  - `icon` is a key of `FD.icon`: number, algebra, graph, geometry, vector, stats, frac, calc, shapes, dice, practice, target.
  - `color` is one of `--c1` … `--c9`.
- **`scenes`**: the scene files in order. Usually: sections of part A, then `testA`, then sections of part B, then `testB`.
- **`intro`**: the HTML text on the Start page.
- **`hero`**: an optional animated SVG on the Start page. Use `class="st-net"`, white or yellow on navy.

Use 2–3 parts and 3–6 sections per lesson. Follow the spec, and put the Higher-only content (marked H in the spec) in sections or parts tagged `tier: 'H'`.

## Section file pattern (see `lessons/fractions/scenes/equivalent.js`)
1. **`FD.add({...})`**: the animated scene.
   - Fields: `section: true` and `interactive: true` when the scene has a "Try it" step.
   - `vocab`: key words, written with TeX.
   - `mount(el)`: builds the stage and returns an api.
   - `steps`: `[{ title, text, tip?, on(api, ctx) }]`.
   - Animate with `await ctx.sleep(ms)` and stop when it returns false.
   - The last step is usually **Try it** (sliders and buttons).
2. **`FD.practice({ section, gens: [() => item, …] })`**: random questions.
   - Every generator returns a fresh item and a full method in `why`.
   - Numbers must always give clean answers. Loop until they do.
3. **`FD.check({ section, items: [...] })`**: 4–6 questions marked on the spot.
   - Item types: `mcq` (first option is the correct one), `tf`, `multi`, `sort`, `num`.

**`num` items**: `{ type: 'num', q, a, why, ... }`.
- `a` is a number, a string, or an array of answers (with `fields: [labels]` and `anyOrder`).
- `tol`: tolerance for rounded answers.
- `form`: `'simplest'`, `'fraction'` or `'mixed'`.
- `show`: the answer shown in TeX when the student is wrong.
- `hint`: how to type the answer.
- Students can type `3/4`, `1 1/2`, `-2.5`, `1,250` or `45%`.

**Tests** (see `testA.js`):
- `FD.test({ id: 'testA', part: 'A', Q: [[sectionId, question, [correct, …wrong], why, sectionId]], LONG: [{ q, m, s: [mark scheme lines], link }] })`.
- Write 8–10 multiple-choice questions and 3 exam-style questions.
- Write mark schemes in Pearson style: M1 = method, A1 = accuracy, B1 = independent mark.

## Maths helpers (`engine/maths.js`)
- **Writing maths**: put it anywhere as `\\( … \\)` inside JS strings (the backslashes are doubled). It is typeset automatically. `FD.tex(s, display)` gives the HTML directly.
- **Worked examples**: `FD.work(host, [[tex, note], …])` returns `{ upto(k) }`, which reveals the lines one by one. This is the standard worked-example format.
- **Graphs**: `FD.axes({ w, h, x: [a, b], y: [c, d], step })` returns `{ X, Y, grid(), path(f) }`. Put `grid()` inside an `<svg class="graph">` and draw curves with `<path class="curve" d="${ax.path(f)}">`.
- **Numbers**: `FD.rnd`, `FD.rndNZ`, `FD.pick`, `FD.gcd`, `FD.lcm`, `FD.round`, `FD.sigfig`, `FD.num`, `FD.simp`, `FD.ftex(n, d, mixed)`.
- **From `engine/core.js`**: `FD.h`, `FD.tween(ms, t => …)`, `FD.wait`, `FD.toast`, `FD.segSet`, `FD.panels`, `FD.shuffle`.
- **CSS classes** in `engine/maths.css`:
  - `.mbig` for a big formula.
  - `.mbox` for a card.
  - `.ctrls` and `.ctrl` for sliders (label + `input[type=range]` + `output`).
  - `.graph`, `.curve` and `.pt` for graphs.
  - `.verdict` for a feedback line.

## Rules
- **Do not edit `engine/`, `js/syllabus.js`, `js/hub.js`, `index.html` or another lesson's folder.**
  - If the engine needs something, define it inside your lesson (e.g. `FD.myHelper = …` at the top of a scene file, like `FD.fracBar` in Fractions).
  - Report anything worth sharing in your final message.
- Every student-facing text is in **British English**: colour, centre, metres, organise, "maths". Write dates as dd/mm/yyyy.
- The site is used on computers and tablets, never on phones.
  - Lay out scenes with `@container stage (max-width: 40rem)` for narrow stages (the stage is a size container).
  - Use `minmax(0, 1fr)` and `min-width: 0` in grids.
- Scene code must only query its own root element, never `document`.
- Write everything from scratch. The revision notes in the shared drive are for scope only.
  - Never copy text, questions or diagrams from revision websites or past papers.
  - Exam-style questions are original. Never claim they are real past-paper questions.
- **Check your lesson in the browser.**
  - Run the preview server `igcse-maths-hub` from `.claude/launch.json` (port 5202), or reuse it if it is already running.
  - Then run the overflow audit until it says "No problems found": `node tools/audit.mjs http://localhost:5202 <id>`.
  - The browser caches scripts. Use a hard reload, or `fetch(url, {cache: 'reload'})` on each file, after editing.
- Do not commit, create repos or deploy. The main session does that.
