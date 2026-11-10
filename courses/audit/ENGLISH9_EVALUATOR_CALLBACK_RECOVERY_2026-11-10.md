# English 9 — Synthetic evaluator partial-save and retry verification
**Date:** 2026-11-10
**Branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Production:** Untouched. No student records opened or modified.

## Tested source surfaces
- Week 03 Day 15 assessment submission inside `assets/week03-daily.js`
- Week 04 Day 20 assessment in `assets/week04-assessment.js`
- Week 12 Day 60 assessment in `assets/week12-assessment.js`
- Week 13 Day 65 assessment in `assets/week13-assessment.js`

## Controlled execution results
In an isolated JavaScript synthetic callback harness, the actual submit-click handler for **each of the four** assessment days was extracted from the staged source and executed with mock DOM controls and synthetic records.

For every handler:
1. The original submission write succeeded.
2. The separate course-progress marker write was forced to fail.
3. The original submission persisted, with no corresponding completion marker.
4. The user-facing status reported incomplete retention.
5. After the synthetic progress writer recovered, a second invocation of the same handler successfully recorded the missing marker.
6. Submission bytes, `submittedAt`, and submission-write count remained unchanged (one submission write total).

**Result:** 4/4 synthetic callback scenarios passed.

## Additional improvement
The Week 12 submit handler previously followed its partial-save warning with `sync()`, which replaced that warning with the generic submission status. It now calls `sync()` first and shows the partial-save warning afterwards, keeping the failure message visible.

## Repeatable regression artifact
New Node regression source: `courses/tests/english9-evaluator-callback-recovery.test.cjs`.
It parses the actual callback bodies from the source files and drives them against synthetic records and controls. That authored Node test file and all four assessment modules passed JavaScript syntax checks. **The Node test runner has not been executed**; controlled callback execution was performed in the isolated JavaScript tool runtime, not in a full browser.

## Gaps and cautions
- Actual browser lifecycle (close/reopen, offline mode, reload, focus, cross-tab storage events) was **not** exercised.
- Record storage is still a multi-key browser transaction, not an atomic server commit. The write helpers may freeze on failure and require a controlled reload before recovery; browser reload success was not verified.
- These callback tests mock the form validation/eligibility and evaluator context. They **do not prove** the original question bank, human review, rubrics or authored writing evaluations behave correctly end to end.
- Typed local evaluator information is not authenticated reviewer authority. Official records must be validated through STOS T03 after commissioning, with durable attempt+review+audit+receipt and same-submission identity preserved.
- Today's student use of the deployed English 9 site is not testing this branch. Do not merge or deploy based solely on synthetic outcomes.
- No legacy records were migrated, reassigned or deleted. No live grades, production files or STOS T01/T03 runtime were changed.

## Next safety gates
1. Run the Node test sources on the review branch (without secrets), then browser-test an actual synthetic learner completing and reopening a lesson.
2. Simulate failed progress writes before a browser reload, verify correct recovery without replacing the original submission or invalidating its review.
3. Introduce T03 record custody only with verified commissioning receipts and server-enforced learner and guardian authorization; retain T01 protection.
