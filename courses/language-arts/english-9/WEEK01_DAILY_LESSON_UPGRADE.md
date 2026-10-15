# English 9 — Individual Daily Lessons (Week 01)

Canonical source: `weeks/week-01/index.html`. Its twenty existing learning phases (five days × read/practice/write/check), original reading passages, and existing editable response keys were copied without changing assignment wording into individual days under `weeks/week-01/day-01/` through `day-05/`.

## Synchronization
- Each day uses Academy `khaemenes_active_learner_v1` plus shared entry-contract readiness and stable learner-scoped keys.
- Every response uses the **same** preexisting `khae-ela9-field:week-01-dayN-*` field key as the original Week 1 workspace. There is no migration or duplicate response record.
- Formative practice attempt history uses a new separate `khae-ela9-field:week-01-dayN-exercise-v1` key. Attempts are not teacher-reviewed mastery, grades, or certificates.
- The existing `khae-ela9-progress-v1` Boolean map gains `week-01-day-01` to `week-01-day-05` evidence-prepared flags. Existing `week-01` stays the authoritative *weekly evidence prepared* marker, controlled by the original weekly interface. Course credit still requires evaluator review.
- Day 1 original first-draft snapshot uses the existing `khae-ela9-field:week-01-baseline-snapshot` key; it is never overwritten.
- A same-key compare-before-write lock prevents stale-tab overwrites. When a write fails, leave the page open and export a recovery JSON with unsaved drafts.

## Safeguards
- Readiness gate, handwriting alternative, print styling, no third-party dependencies, lesson-specific exercise feedback, repeatable formative attempts, links to Week 1 / Unit 1 / English 9, and device-local JSON export.
- The original Week 1 route remains fully operational; individual lessons are an additive entry path rather than a replacement.
- The lessons do not change STOS or other course records.

## Next expansion
Audit the first five pages with student beta testers. Then add the same individual-page structure to Weeks 02–36 using **each existing weekly lesson as canonical source**; audit instructional quality and variety rather than blindly generating generic activities. Finally adapt the engine to English 10–12 course-scoped record contracts and correct duplicate objective assessment banks.
