# Grade 9 Global Studies Honors — Repairs 01–02

## Repair 01 — Canonical source of truth

**Status:** COMPLETE

Production `index.html` now loads one curriculum database and one student runtime:

1. `course-data.js` — canonical curriculum/course database.
2. `app.js` — canonical student runtime.
3. `assets/grade09-socialstudies-mastery-v2.js` — progression policy layer.
4. Mentor, visual-cleanup, and beta scripts — presentation/integration layers only.

The former giant embedded `APP` database and duplicate embedded runtime were removed from production `index.html`.

### Why the modular source was selected

The modular database/runtime already contains richer instructional objects than the legacy embedded runtime, including:

- original weekly readings;
- defined vocabulary;
- key understandings;
- contextualized source studies;
- five structured daily lessons;
- three rubric-bearing weekly assignments;
- ten objective weekly quiz questions plus constructed response;
- written midterm/final components;
- standards and resource metadata;
- local progress, export/import, and read-aloud support.

### Pass condition

Production course behavior is now driven by edits to `course-data.js` and `app.js`; duplicate edits inside `index.html` are no longer required.

---

## Repair 02 — 80% mastery progression

**Status:** ACTIVE / FIRST PASS IMPLEMENTED

A public/student-facing mastery policy layer has been added.

### Current weekly unlock rule

The next week remains locked until the active student has:

- completed all five daily lessons;
- submitted all three principal assignments;
- earned a best objective weekly quiz score of at least **80%**.

### Semester checkpoint

Week 19 additionally requires a best objective **midterm score of at least 80%**.

### Honors distinction

The policy layer establishes **90%** as the honors/distinction target while preserving **80%** as the mastery floor.

### Human-evaluation boundary

Constructed responses, essays, source analyses, and nuanced historical/civic arguments remain teacher/evaluator-reviewed. The mastery layer does not pretend to auto-grade those judgments.

### Remaining Repair 02 work

- add a formal correction/error-analysis workflow after a sub-80 attempt;
- distinguish submitted assignments from evaluator-approved/scored assignments in progression and reporting;
- integrate mastery status directly into reports and the canonical grade engine;
- add runtime tests for locked direct URLs, retakes, Week 18→19 gating, and imported records.

---

## Offline alignment

The service worker cache was advanced to `khaemenes-global-studies-9-v2` and now includes the canonical modular runtime, mastery layer, mentor/cleanup/beta layers, and core local visual assets. This prevents the offline shell from silently serving the pre-repair architecture.

---

## Next repair

**Repair 03 — Grade-engine integrity.**

The published grading policy is 45% assignments, 20% weekly quizzes, 12% midterm, 18% final, and 5% journal/discussion/reflection. The canonical runtime must be rebuilt so those exact weights are calculated from actual academic scores rather than completion percentages.
