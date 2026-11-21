# 2026-11-20 — Grade 09 Algebra I readiness: Schedule ↔ Portfolio recovery guidance

**Scope:** existing Grade 09 dedicated Schedule page, existing shared Schedule reader, existing Student Portfolio and course-owned diagnostic. **No account/assessment record writes** in this change. **No Account Cloud sync.**

## Founder learner context
- The founder reported that the existing Grade 9 learner passed a readiness assessment; earlier family report records Algebra I readiness `36/36` on Nov 19. This value remains **unverified against an original learner-scoped attempt** on the originating browser.
- Both Academy Home and High School prior browser inspections reported existing Account ID and institutional ID presence; those are not service login credentials, and ID equality/cloud persistence remain unverified.
- Do not create new accounts, retake the assessment, change placement, overwrite learner-scoped records or attribute unscoped evidence without explicit confirmation.

## Wiring verified
1. `portfolio/portfolio-academic-report.js` already renders learner-scoped Algebra I readiness separately from official grades; unscoped evidence requires `Review & Link My Saved Algebra I Result`, explicit owner confirmation, readback, and no deletion of the original.
2. `courses/shared/algebra1-readiness-continuation-publisher.js` accepts only a learner-scoped `KH-MATH-A1-DIAGNOSTIC` attempt (36 items, numeric score, timestamp) and publishes an idempotent readiness-only pseudo-course to the existing continuation ledger. It does not change grades, award credit or sync to Account Cloud.
3. `grades/grade-09/student-profile/student-course-registry.js` uses learner-scoped readiness evidence when resolving existing Algebra I next lessons. Explicit math-pathway preference is a separate owner and is never changed by the new Schedule review.
4. `grades/grade-09/student-profile/schedule/index.html` now adds a lightweight Algebra I readiness review section below the overview and a direct link to the existing `portfolio/index.html?grade=09#homeschoolReport`.
5. `grades/shared/high-school-schedule-page.js` checks the current Grade 09 learner identity from existing Schedule authorities, reads **only scoped** original readiness through `CourseEntryContract.readJSON`, validates assessment ID/36-question score/percent/timestamp and any present attribution, and presents a status. Missing or unscoped evidence is not attached and gets review instructions rather than a fabricated grade. On no validated learner, the section is hidden.
6. Grade 10–12 Schedule pages do not render the Grade 09 section. No new engine or browser storage key was introduced.

## Safety and required real-device acceptance
- On the originating Grade 09 browser, open `grades/grade-09/student-profile/schedule/`. The status should either state that a learner-scoped readiness attempt is saved or direct to Portfolio review.
- Open Student Portfolio and press `Refresh Academic Evidence`. If an eligible unscoped original exists, `Review & Link My Saved Algebra I Result` requires explicit confirmation that the selected learner completed it; preserve raw source separately before acting. Do not manufacture the 36/36 result.
- Reopen Schedule to verify the learner-scoped evidence status updates; independently confirm math pathway/pins and actual lesson continuation. A readiness result alone is not enrollment, an official grade or proof of Account Cloud persistence.
- Any cross-device persistence still depends on authenticated Academy Account Cloud and native STOS T03 commissioning; none was enabled.

## Verification
Eight new synthetic tests added at `tests/grade09-readiness-schedule-portfolio-review.test.mjs`, included with ten existing Schedule/Portfolio source tests in `.github/workflows/grade09-schedule-portfolio-audit.yml`. Exact outcome appended after CI completes.
