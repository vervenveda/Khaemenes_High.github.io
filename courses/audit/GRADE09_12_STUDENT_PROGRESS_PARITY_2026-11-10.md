# Grades 09–12 — Student Progress / Class Progress forensic parity audit
Date: 2026-11-10
Review branch: `hardening/algebra-english-lesson-retention-2026-11-10`
Mode: targeted development-branch source repair; no live enrollment, grade, STOS or production mutations.

## Confirmed defect
Grade 09 profile referenced `grades/shared/student-course-progress-bars.js`, which builds its chart by calling `window.KhaemenesLearningContinuation?.readLearner(learnerId)`, but the Grade 09 profile **omitted** the Academy `khaemenes-learning-continuation.js` loader. Consequently the reader was undefined unless some other script loaded it by chance; all class progress percentages could appear as Not reported despite saved continuation snapshots.
Grades 10, 11, 12 loaded the continuation reader before their progress dialogs.

## Corrections made
1. Grade 09 profile now loads the Academy learning-continuation reader before Grade 09 registry and progress rendering. The malformed literal `\\n` between two script elements was also replaced with an actual newline.
2. Grades 10–12 shared progress dialog now responds to the continuation-ready event, window focus and relevant cross-tab storage notifications, re-reading only when the dialog is open. Existing learner-grade isolation is preserved.
3. `courses/tests/high-school-student-progress-parity.test.cjs` checks required loader presence and order in all four grades, graph/dialog/toolbar parity and read-only, nonfabricated presentation patterns.

## Four grade source checks
- Grade 09: catalog, student identity, continuation reader, chart, toolbar and class progress dialog present and ordered.
- Grades 10–12: each uses the same shared eight-class catalog and grade-aware dialog; each imports the continuation reader first.
- Dynamic student/course state is subject to existing grade and learner identity checks. No blank data is converted into a zero score.
- Grade 09 math slot is determined by the existing course registry; world language slot is determined by the learner's selection. Unselected classes are not automatically inferred.

## Important limits and further validation
- A frontend reader cannot create course snapshots that have never been **published** by the original course. Grade 09 English, mathematics and science have continuation publisher adapters in the repository, but full subject-by-subject publisher coverage (including language, electives, social studies, PE and Psychology) remains to be inventoried. No scores should be synthesized from pin state or generic lesson completion markers.
- No actual browser test was completed: verify interactive toolbar launch; both graph filters; exact chosen mathematics and language courses; live score updates after completing a real lesson; persistence after reload; Grade 09–12 learner/grade isolation; mobile layout; and keyboard/focus behavior.
- Static source contract checks were inspected through GitHub. The new Node test file is staged; a green CI execution has **not** been established.
- Existing Algebra I/Pre-Algebra progress provenance and sovereign STOS authority are separate from these presentation repairs. Do not imply the course continuation snapshots are authoritative grades or T03 receipts.

## Acceptance workflow
1. Simulated learner per grade, with distinct course IDs and known synthetic continuation snapshots.
2. Open Student Progress: confirm 8 slots and correct percentage/assessment separation; missing values show Not reported.
3. Switch selected math/language where supported and verify the graph follows the chosen class, without altering transfer authority.
4. Change lesson progress in course app, return to profile and confirm the publisher's snapshot has actually updated.
5. Repeat across tabs / reload, with sibling and different grade selected, and confirm privacy and non-leakage.
6. Only after this is green, consider further publisher integration on a course-by-course basis.
