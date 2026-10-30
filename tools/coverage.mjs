// Specification coverage: is every 4MA1 statement (js/spec.js) taught by a lesson?
// Each section in a lesson's lesson.js lists the statements it teaches: sections[].covers = ['F1.2A', …].
// Usage: node tools/coverage.mjs            → whole course
//        node tools/coverage.mjs <id> …     → only these lessons (what they still have to cover)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/syllabus.js'), 'utf8'), ctx);
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/spec.js'), 'utf8'), ctx);
const { MH, MH_SPEC: SPEC } = ctx.window;
const only = process.argv.slice(2);
const ids = new Set(SPEC.map((s) => s.id));

const covered = new Map(); // statement id → [lesson/section]
const problems = [];
const ready = [];
for (const l of MH.lessons) {
  const file = path.join(root, 'lessons', l.id, 'lesson.js');
  if (!fs.existsSync(file)) continue;
  const c = { window: {} };
  try { vm.runInNewContext(fs.readFileSync(file, 'utf8'), c); } catch (e) { problems.push(`${l.id}: lesson.js does not run (${e.message})`); continue; }
  const L = c.window.LESSON;
  ready.push(l.id);
  for (const s of L.sections || []) {
    const hSec = s.tier === 'H' || (L.parts[s.part] || {}).tier === 'H' || l.tier === 'H';
    for (const id of s.covers || []) {
      if (!ids.has(id)) { problems.push(`${l.id}/${s.id}: "${id}" is not a statement in js/spec.js`); continue; }
      if (id.startsWith('H') && !hSec) problems.push(`${l.id}/${s.id}: Higher statement ${id} is in a section that Foundation students see (tag the section or part tier: 'H')`);
      if (!covered.has(id)) covered.set(id, []);
      covered.get(id).push(`${l.id}/${s.id}`);
    }
  }
}

const scope = only.length ? SPEC.filter((s) => only.includes(s.lesson)) : SPEC;
const missing = scope.filter((s) => !covered.has(s.id));
const byLesson = {};
missing.forEach((s) => (byLesson[s.lesson] ||= []).push(s));

console.log(`Lessons built: ${ready.length} of ${MH.lessons.length}`);
console.log(`Statements covered: ${scope.length - missing.length} of ${scope.length}${only.length ? ` (lessons: ${only.join(', ')})` : ''}`);
for (const [lesson, list] of Object.entries(byLesson)) {
  console.log(`\n${lesson}${ready.includes(lesson) ? '' : ' (not built yet)'} — ${list.length} missing:`);
  list.forEach((s) => console.log(`   ${s.id}  ${s.text}`));
}
if (problems.length) { console.log('\nProblems:'); problems.forEach((p) => console.log('   ' + p)); }
const ok = !missing.length && !problems.length;
console.log(ok ? '\n✓ Full coverage.' : '');
process.exit(ok ? 0 : 1);
