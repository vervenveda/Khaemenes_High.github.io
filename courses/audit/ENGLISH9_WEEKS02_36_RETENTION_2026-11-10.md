# English 9 Weeks 02–36 — Course Lesson Retention and Family Isolation Audit
Date: November 10, 2026
Branch: `hardening/algebra-english-lesson-retention-2026-11-10`
Status: review-only; no production deployment or learner-record migration.

## Actual course-storage topology
- Weeks 02–13 use one dedicated `courses/language-arts/english-9/assets/weekXX-daily.js` controller per week. Each manages its own daily written evidence, formative practice, prepared-evidence markers and, in relevant weeks, evaluator-reviewed independent writing.
- Their shared record naming includes `khae-ela9-field:*` and `khae-ela9-progress-v1`, with learner-specific scoping through `KhaemenesCourseEntryContract`. The weeks retain distinct authoring/assessment logic, including rubric-reviewed writing, which was not changed.
- Inspected Week 14, Week 20 and Week 36 pages load the shared `assets/course.js` controller for generic lesson fields and completion buttons. The same shared controller was already hardened on this branch for learner context, concurrent saved-state changes and write/readback. All Week 14–36 page entry points are **not independently confirmed** in this pass.
- English 9 also has a separate 36-week portal state and Week 01 individual-day controller. Neither state should be treated as a replacement for authored writing evidence in the week-specific stores.

## Newly staged repairs
1. **Weeks 02–13 per-week daily writers**: all twelve controllers now confirm that the Academy learner returned by the course-entry contract matches the selected learner and that the selected family registry lists that exact learner.
2. **Weeks 02–13 readback**: all daily field and formative/assessment records passing through each week's `write()` require exact value readback before the UI says 'Saved on this device'. A no-op storage writer or exception cannot report success.
3. **Weeks 02–13 tab and family-change detection**: the existing snapshot-of-last-read mechanism is preserved, and storage events for active family or family registry now freeze further writes, in addition to selected learner and observed field changes.
4. **Shared Week 14+ writer**: `assets/course.js` no longer permits new writes to an unassigned browser key when no Academy learner is selected. The page becomes read-only for personal course work; older unassigned records are left in place without automatic ownership attribution or deletion. Family/registry storage changes also trigger reload.
5. **Regression coverage**: new `courses/tests/english9-weeks02-36-retention.test.cjs` checks all 12 specialist writers, the shared writer and synthetic Week 02 successful/failed/sibling-switch saves. Earlier English 9 retention source tests were updated for the read-only unassigned rule.

## Validation performed
- Parsed each of the 12 specialist controllers as JavaScript after changes: **12/12 PASS**.
- Inspected each controller and confirmed active-family membership guard, exact storage readback, and cross-tab family storage-event observation: **12/12 PASS**.
- Ran the actual Week 02 `write()` function with isolated synthetic in-memory storage: verified write accepted; no-op write rejected; learner switch rejected before writing.
- Shared `course.js` and authored regression sources passed JavaScript syntax checks.
- **Did not run** the full Node test suite or end-to-end browser UI, offline reload, simultaneous-tab racing, or second-device restore. Tests were authored, not certified as executed by Node.

## Preserved academic behavior
- All original English 9 lesson writing fields, teacher-reviewed independent writing, original source passages, quizzes, 8/10 or 80% evaluations and mastery gates remain unchanged.
- No preexisting student record was read, deleted, claimed, overwritten, exported or migrated.

## Remaining risks and acceptance criteria
- Browser `localStorage` readback is not an atomic commit, durable cloud receipt or cross-device backup. A race between two tabs can still cause lost updates.
- Special-purpose Day 15 and other evaluator submissions sometimes update multiple separately scoped keys (submission, review, prepared progress). They are **not atomic**; an interrupted save can leave records requiring reconciliation. No automatic grade recovery was introduced.
- Need a course-wide Week 01–36 browser test matrix with synthetic siblings, browser reload, storage quota/full, local preview, question retries, authoring edits, reviewer receipts, malformed JSON, and offline return.
- Need a protected T03 Account Cloud record+audit+receipt API with authenticated learner/family, idempotent attempt IDs, version conflicts, replay recovery, and second-device restoration. Do not activate T03 before commissioning evidence.
- Existing legacy/unassigned keys require export and provenance review before ownership claim; do not silently merge into an authenticated learner.

## Next recommended steps
1. Run the automated Node tests and a synthetic browser save/reopen workflow for Week 02, Week 13 and Week 20.
2. Inspect Week 02–13 multi-key evaluator submission, receipt and progress writes for partial-save repair paths, without changing evaluation standards.
3. Inventory Elementary Grade 1–5 and French 101 lesson/quiz retention in the same evidence contract.
