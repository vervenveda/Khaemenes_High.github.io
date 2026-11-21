# 2026-11-20 — Student Portfolio learner identity and academic refresh hardening

**Scope:** Existing `portfolio/index.html`, read-only academic report and Student Records connection checker only. No new account store, no duplicate UI owner, no T03 sync.
**Source finding:** Portfolio retained initial learner's `entries` and rendered cards while open. Existing `active()` rechecked only Course Entry Contract's learner when a user explicitly saved; switching Academy learner could leave previously rendered work visible until page reload. This is privacy risk when a device is shared by students.

## Surgical repair
1. `portfolio/index.html`: lock an open Portfolio to the initial learner ID, current Academy registry + active learner selection + Grade 09–12 agreement. Optionally cross-check shared Grade Context and Pins service once loaded; initial page does not depend on deferred script timing.
2. On browser focus, page restore, cross-tab storage change or Academy learner-changed event, a mismatched learner causes the initial learner's DOM cards and in-memory `entries` to be cleared and Save/Export/Import/Print controls disabled with reload guidance. It does **not** erase any saved localStorage or portfolio backup. Existing export schema remains `khae-learning-portfolio-v1`.
3. Publish a read-only initial learner lock for the existing `portfolio-academic-report.js` and `portfolio-student-record-connections.js`, so neither may accept stale initial-learner context.
4. Academic report rechecks on focus/storage and falls back to an identity-required message on mismatch. Record Inventory clears cached counts and disables export on a learner change.
5. Added `tests/portfolio-learner-identity-stale-tab.test.mjs` and wired six assertions into existing `.github/workflows/student-portfolio-workspace-regression.yml`. Existing readiness review and learner-confirmed Algebra I diagnostic link stay untouched, no scores or mastery changed.

## Original Grade 9 readiness and Cloud status
- Family-reported Algebra I readiness 36/36 remains in its original course owner (source record **not** read from the child's browser).
- User-confirmed link of an otherwise unscoped existing local diagnostic is a **separate, explicit action**; never auto-link merely because an adult/learner appears selected.
- Portfolio's academic report excludes readiness from official final course grade, prevents fabricated credits and labels records browser-local. Account Cloud T03, authenticated learner binding, durable protected receipt and second-device recovery all **HOLD**.
- No live personal account data, Guardian permissions, family IDs, private credentials, VNV homepage or 333 Network modified.

## Verification
Pending exact-SHA final GitHub Actions success; preliminary added test initially used a wrong literal declaration token (`const learner` vs existing `,learner`) and was corrected in the isolated regression without modifying Portfolio runtime. Do not claim PASS until rerun succeeds.
