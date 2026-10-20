# Khaemenes Academy · Grade 10 United States History Honors

**Production student portal:** [index.html](index.html). This is the active browser application and contains its current embedded APP curriculum, state handling, student dashboard, Monte Carlo assessment adapter calls, records, and reporting logic.

**Other runtime files:** `app.js` and `course-data.js` are retained for compatibility and reference. They are **not** loaded by the active `index.html`; do not update them assuming the production student portal will change. Do not delete or replace them until a migration and parity test have been completed.

## Course
- 36 weeks, five lesson days each week, three principal assignments weekly.
- Weekly objective mastery threshold: **80%**; midterm 80% before opening Week 19.
- The final is gated on completion of Week 36 and midterm objective mastery.
- Weekly assignments must be submitted, but checkbox completion is not equivalent to a teacher-scored academic grade.
- Activity progress and objective quiz results are visible. An authoritative course grade remains **pending teacher grading** until rubric-based assignment, journal, and written-exam evidence is recorded.
- Assessment attempts and learner records remain in browser localStorage. Export JSON before clearing browser data.

## Known limitations and next hardening
1. Weekly quizzes in the embedded APP are five-question banks in some weeks; expand to reviewed ten-or-more question banks and test randomization/distractor quality.
2. Course grading still needs a teacher-scored rubric and official gradebook integration; current activity percentage is *not* a transcript grade.
3. Browser-only records are not tamper-resistant. Offline exports provide backup, not trusted credential verification.
4. Implement a deliberate migration to one external curriculum source and runtime only after comparison tests on existing student records.
5. Audit offline caching, printable student evidence with Academy-first titles, and teacher-review handoff before declaring release complete.

## Progression regression checks
- New learner: Week 2 disabled.
- Quiz below 80%, even with other boxes checked: next week disabled.
- Quiz at least 80% with missing assignments or lesson: next week disabled.
- All five lessons, all three assignments and quiz at least 80%: next week enabled.
- Week 18 complete but midterm below 80%: Week 19 disabled.
- Import/export retains previously saved records and the same storage key.
- Academic grade is not inferred from checkboxes.

## Midterm paths (October 2026)
- The **active student portal** (`index.html`) contains a 40-item reviewed objective midterm pool. Its shared Monte Carlo assessment adapter normally draws **30** questions, randomizing question and answer order while retaining the same 80% objective mastery threshold.
- The **standalone printable exam** (`assessments/midterm.html`) remains a separate 50-objective-question form with three teacher-scored written responses and its own browser draft store. It is **not** a synchronized view of the portal bank, and completing it does **not automatically update the portal's 80% midterm gate**.
- For official progression, use the portal midterm; use the separate exam only as a supervised supplementary/printable assessment until a deliberate grading/record bridge is developed. Teacher-scored written work must be reviewed separately and should not be represented as an automatically certified course grade.
- Follow-up: verify randomized form persistence, offline printing, teacher rubric, and cross-path evidence reporting in a browser.
