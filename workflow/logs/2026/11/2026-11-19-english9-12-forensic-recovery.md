# English 9–12 · surgical forensic continuation and regulator recovery
Date: 2026-11-19 ET
Repository: vervenveda/Khaemenes_High.github.io
Scope: English landing-page retired loader removal, Grade 10–12 Class continuation alias correction, read-only route guards.

## Verified source defects
1. English 10, 11, 12 landing pages each referenced removed assets/high-school-global-chrome-v2.js (404 at main). English 9 landing did not reference it. These stale loads conflicted with the retired page-regulator policy.
2. courses/shared/high-school-english-continuation.js publishes historical upper-English identifiers ela10, ela11, ela12. grades/shared/grade09-blueprint-upper-grade.js looked up saved continuation only by the schedule IDs english-10, english-11, english-12. Therefore matching published records were bypassed and Class fell back to FIRST_STEPS instead of resolving saved continuation. This is a lookup issue; historical record identity must remain unchanged.

## Exact changes
- 735a612, e0a1959, 1a1ccc1: removed only the retired global-chrome script reference from English 10, 11, 12 course landings. Native course shell, curriculum, and independent tools unchanged. No replacement global style layer injected.
- 16deef9: added narrow English 10–12 historical ID aliases in upper-grade Student Profile Class resolver. Same-course, same-origin URL containment guards apply to English snapshots; invalid destination uses the existing FIRST_STEPS route. No grade, progress, or learner storage writes introduced.
- 64d532d, 43f8f5f, feca9c4: rotated version token for Grades 10–12 shared Class manager imports to request repaired source from the existing service-worker/runtime environment.
- 2a0f9f3: added source test verifying all four grade-specific Week 1 first steps and assessment indexes, retired chrome absence on English landings, and upper-English continuation alias contract.
- 0200201: added GitHub workflow high-school-english-class-routes.yml for source route checks, JS syntax, and retired regulator validator.

## Source paths independently confirmed
- English 9: weeks/week-01/day-01/index.html
- English 10: weeks/week-01/monday/index.html
- English 11: weeks/week-01/lessons/day-01.html
- English 12: weeks/week-01/lessons/day-01.html
- English 9,10,11,12 assessments/index.html all exist.
- English 10,11,12 weeks/week-01/index.html all exist.

## Safety boundaries
No lesson file rewritten. No assessment, quiz, final, midterm, mastery threshold, learner record, legacy course identifier, or account cloud modified. No Vervenveda index change. No replacement page regulator or CSS layer introduced. Public course landings and registered learner routes retain their existing architecture.

## Remaining holds
- New Actions workflows committed, but their successful execution and latest deploy outcome are NOT independently certified here.
- The pages themselves do not separately load every official shared chrome component after retired loader removal. Existing native header/toolbar remains; canonical ticker/header/footer runtime parity needs separate browser proof and a non-invasive single-owner architecture decision. Do NOT automatically add a substitute chrome overlay.
- Test real Grade 9–12 authenticated Class buttons, saved upper-English weekly navigation and actual day-level resume with synthetic learner state.
- Evaluate existing independent English 10 curriculum drift / English 9 Week 3 progress test mismatches reported in the Nov 18 release-gate log; no claim of their resolution.
- Inspect English 9 latest CSS consolidation on device before changing appearance; avoid new CSS specificity layers.
