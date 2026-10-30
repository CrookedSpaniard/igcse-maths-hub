# Build progress log

Each session building lessons keeps one file here and adds a line **every time it finishes a lesson**, and **when it starts the next one**:

- `progress/area-1.md`: session "Maths Hub: Area 1 lessons (Number)".
- `progress/area-2-3.md`: session "Maths Hub: Areas 2–3 lessons (Algebra, Graphs)".
- `progress/area-4-6.md`: session "Maths Hub: Areas 4–6 lessons (Geometry, Vectors, Stats)".

The format is one line per event, newest last:

```
2026-10-30 10:15 · started  · decimals
2026-10-30 11:02 · done     · decimals · audit ✓ · coverage ✓
```

If a session stops (for example when the usage limit is reached), it resumes from its log:
- It finishes the lesson that was "started" but not "done", checking what is already on disk first.
- Then it carries on with the next lesson in its list.

A lesson only counts as finished when both commands pass:
- `node tools/audit.mjs http://localhost:5202 <id>` says "No problems found".
- `node tools/coverage.mjs <id>` says "✓ Full coverage".
