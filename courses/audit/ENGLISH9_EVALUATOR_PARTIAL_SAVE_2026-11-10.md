# English 9 evaluator submissions — partial-retention follow-up
**Date:** 2026-11-10
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Review branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Deployment:** None. Do not treat staged fixes as present on the public English 9 course.

## Why this pass matters
Written assessment submission and the 'evidence prepared' progress marker are distinct browser-local records. If the submission writes successfully but progress writes fail, a new submission on retry can generate a different `submittedAt` value, invalidating a reviewer record tied to the original. The proper response is to preserve the existing matching submission and retry only the missing marker.

## Staged repairs
- **Week 03 / Day 15** `assets/week03-daily.js`: before creating a new receipt, checks that a valid existing submission still matches the current learner, locked independent draft word count, final response word count and conventions count. If so, retries writing only the completion flag.
- **Week 04 / Day 20** `assets/week04-assessment.js`: if existing submission and current writing are consistent, retries only the progress marker; reports partial preservation if the marker write fails.
- **Week 12 / Day 60** `assets/week12-assessment.js`: uses the existing matching portfolio submission rather than minting a new timestamp during marker recovery; failure is explicitly reported.
- **Week 13 / Day 65** `assets/week13-assessment.js`: same safeguard for the drama analysis portfolio and rubric submission.
- **Coverage** `courses/tests/english9-evaluator-partial-retention.test.cjs`: source regressions for all four recovery branches and isolated in-memory model of missing-marker recovery.

## What was verified
- JavaScript syntax: 4 changed assessment controllers and authored test file PASS.
- Static inspection: recovery path appears before creating new `submittedAt` timestamp and does not introduce any new grade/mastery rules.
- Synthetic in-memory partial-save model supports retaining the same submission during marker recovery.
- **Node tests not actually executed**, and **real browser save/reload/race and evaluator import tests not executed**.

## Remaining integrity boundaries
- Two separate `localStorage` writes are still **not atomic**. A crash or competing tab may interrupt the sequence even with an idempotent retry.
- Existing `write()` functions freeze after a storage conflict or failed save; returning to a valid session may require a controlled reload before retrying. Never overwrite uncertain records merely to recover a completion flag.
- Current 'same submission' checks use each week's preexisting consistency/validation definitions; these are local consistency checks, not authenticated T03 custody.
- If the student intentionally changes the submission, a new version may be required for evaluator review. Never overwrite a matching prior reviewed submission without a provenance-safe explicit revision history; versioning remains a future improvement.
- Parent-entered evaluator identities in browser storage are not authenticated authority. T03 must enforce reviewer role and immutable reference to the original submitted evidence.
- No course grades, learner records, scoring rubrics, existing browser storage, production pages or STOS terminals modified by this pass.

## Today's English 9 live test
The learner's real-world English 9 test is a separate observation of the **currently deployed** site. The staged review branch is **not** deployed, so no regression benefit should be assumed in her browser. Record which URL/build was used, whether writing survived refresh/reopen, any false 'Saved' status, and the next-lesson continuation shown. Avoid sharing student-identifying details or raw written work in a public issue.

## Next acceptance gates
1. Run actual Node tests, then controlled synthetic browser tests for 03/04/12/13 incomplete marker/unchanged submission; verify the original timestamp and review remain.
2. Run synthetic two-tab race and quota failure tests, including automatic browser reload after freeze.
3. After the T03 secure authority is commissioned, use a single append-only record + audit + receipt transaction with learner, reviewer and assessment version checks; test cross-device restore before merging.
