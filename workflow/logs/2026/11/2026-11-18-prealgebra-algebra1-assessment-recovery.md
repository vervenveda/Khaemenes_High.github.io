# November 18, 2026 · Pre-Algebra and Algebra I assessment recovery

## Trigger

Founder reported broken and disorganized assessment elements while reviewing Pre-Algebra and Algebra I.

## Confirmed Algebra I defects

1. `exam-engine.js` already paged the 36-question diagnostic into 12-question sections.
2. `focused-assessment-v1.js` also hid all but one question and watched the assessment DOM with a MutationObserver.
3. The two presentation systems could compete over the same question set.
4. Midterm and Final were not using the sectioned paging model even though they contain 60 and 100 selected-response questions.
5. Save Draft verified persistence internally but the Save button always announced success.
6. Cumulative assessments could boot without the written-reasoning depth module and present a selected-response-only path inconsistent with the mixed-evidence mastery authority.
7. Result persistence failure could throw after submission without restoring an editable draft state.

## Algebra I repairs

- Long EXAM_CONFIG assessments now use one exam-engine paging owner whenever question count exceeds 12.
- Focused Assessment excludes EXAM_CONFIG pages.
- Mastery Authority no longer injects Focused Assessment on diagnostic and cumulative assessment routes.
- Save Draft reports success only after verified persistence.
- Draft lock is verified before submission.
- Result persistence failure restores the draft rather than claiming a recorded attempt.
- Midterm and Final fail closed if the required written-reasoning/evaluator-review module is unavailable.
- Question-count messaging is dynamic rather than hard-coded to 36.

Commits:
- `639a44387235715d94c4631ca9e5a5de5c2d803b`
- `396ecb90c622e286e9a347389d13c43eb82b3593`
- `418963ebe62586dd5bfdffd4deaf54e5b606f000`
- `8e2543ce3607b46a63b0851e062c332f489c7615`

## Confirmed Pre-Algebra defects

1. Midterm and Final were rendered simultaneously in two half-width columns.
2. Midterm has 28 questions and Final has 52 questions.
3. Every cumulative question was individually collapsed inside `details`, creating a fragmented assessment surface.
4. Both forms were regenerated whenever the Assessments view rendered.
5. No resumable cumulative draft preserved the randomized form and current selections.
6. Weekly mastery submission announced success even when `save()` could not verify persistence.
7. `prealgebra-course-gates-v1.js` used a MutationObserver on the week list merely to redecorate gate state after render.
8. The printable report template contained a literal `</script>` inside the main inline JavaScript template string. HTML parsing therefore could terminate the actual parent script early, causing the remaining Pre-Algebra runtime to fail.

## Pre-Algebra repairs

- Assessment Center now shows one cumulative assessment at a time in a full-width card.
- Midterm and Final switch through explicit tabs.
- Each assessment is grouped into readable ten-question sections.
- The active randomized form and selected answers are preserved as a local resumable draft.
- Draft clearing rolls back if persistence cannot be verified.
- Cumulative submission rolls back attempts, best score and draft state if persistence fails.
- Weekly mastery submission similarly rolls back on failed persistence.
- Week-gate UI now responds to the explicit `khaemenes-prealgebra-rendered` event instead of a MutationObserver.
- The embedded report script tag was removed from the print template, eliminating the parent-script termination bug.
- Question banks, 80% mastery policy, existing attempt history and learner records were not rewritten or deleted.

Commits:
- `f64d9e5572d91ede3e168123690b445e090bdcc0`
- `943aba3b627f1ed2474a42fe6c0059d1b5b7262b`
- `368cf99aa03f9fb7dc805ff3270f7b0291c0d134`
- `e6e6260feed12b5afeecd1a79541f939d0a8b9c9`

## Validation

Current committed source was re-fetched and checked.

PASS:
- Algebra I exam engine JavaScript syntax.
- Algebra I focused assessment JavaScript syntax.
- Algebra I mastery authority JavaScript syntax.
- Pre-Algebra course-gate JavaScript syntax.
- Both Pre-Algebra inline JavaScript blocks parse.
- No duplicate HTML IDs found in the Pre-Algebra entrance.
- No executable MutationObserver remains in Pre-Algebra course-gate decoration.
- Printable report no longer contains an embedded script terminator.
- Regression source contract added in `tests/math-assessment-organization-recovery.test.mjs`.

Regression commit:
- `e396a3cc7a76624a71b9dd6559c10b66eeff684b`

## Acceptance boundary

This is a source-level recovery and organization pass. Live browser acceptance is still required for:
- answering through first/middle/final sections;
- reload/resume of a draft;
- midterm/final switching;
- tablet portrait and landscape;
- print layout;
- submission and retry;
- closed-book behavior where applicable;
- service-worker stale-cache delivery.

Do not clear learner storage to test these repairs.
