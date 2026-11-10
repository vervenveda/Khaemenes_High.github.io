# Reaudit — Algebra I Weekly, Cumulative, Synthesis and English 9 Retention
**Date:** November 10, 2026
**Repo:** `vervenveda/Khaemenes_High.github.io`
**Branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Mode:** Review-branch code changes, synthetic validation; no production merge, live learner data access, T01/T03 changes, or authenticated cloud records.

## Baseline rechecked
- Algebra I Unit 01 and Units 02–09 graded attempt save helpers on branch already use exact browser storage readback; Units 10–13 use `assets/unit-page-core.js` with an explicit write/readback check.
- English 9 36-week portal `saveState` and individual `assets/course.js`, plus Week 1 `assets/daily-lesson.js`, have learner-facing retention checks staged; different stores and evidence roles remain separate.
- The existing strict 80% Algebra I lesson/unit/weekly/cumulative mastery rules remain unchanged.

## Newly verified findings
1. **Weekly mastery save false-success and stale tab risk.** `assessments/assets/weekly-mastery-engine-v2.js` previously returned true solely if `localStorage.setItem` did not throw, without readback or a prior-value check. Weekly answers, drafts, scored attempt snapshots and best records used this same writer.
2. **Weekly corrupt state overwrite risk.** Original JSON parsing defaults to empty state for malformed storage; silently replacing malformed historical data would risk losing retained evidence.
3. **Algebra I Unit 02–09 synthesis save false-success.** Each unit's synthesis writer displayed `Written evidence saved locally` immediately after `setItem` without readback.
4. **Cumulative midterm/final false-success.** `assets/exam-engine.js` saved answer drafts without verifying success and wrote attempt history and reviewer-graded mastery without checking storage readback.
5. **Evaluator review orphan risk.** When the originally submitted attempt could not be found, the review code would append an updated attempt to attempt history instead of failing closed; this could misrepresent academic evidence provenance.

## Repairs staged
- Algebra I weekly engine now uses an observed raw-storage snapshot, checks expected value before saving, verifies exact stored serialized bytes afterward, and fails closed after another-tab/learner-context storage event. It also refuses to overwrite unparseable or structurally invalid weekly records.
- All eight Algebra I Unit 02–09 synthesis writers confirm the exact saved JSON before displaying success.
- Cumulative exam engine now verifies draft readback; submitted attempts and evaluator reviews use conflict-checked, readback-confirmed evidence writing. Reviewer updates require an existing matching attempt. Failure to save does not display new mastery; failed draft reset restores in-memory form state.
- New regression suite: `courses/tests/algebra1-weekly-cumulative-retention.test.cjs`, in addition to prior staged Algebra I + English 9 retention suites.

## Verification performed
- JavaScript parsing PASS for weekly mastery engine, cumulative exam engine, new regression source and eight modified synthesis writers.
- Isolated synthetic V8 runtime PASS: weekly state write confirmed; competing storage change rejected; malformed weekly JSON rejected; cumulative result saved with readback; mismatched result state and thrown storage quota rejected.
- The `node --test` suite has been authored but **not executed**; real browser multi-tab/worker/offline tests, cross-device restoration and end-to-end evaluator workflow are pending.

## Security and durability boundaries
- `localStorage` has no atomic compare-and-swap. A race between reading and writing can still lose state across simultaneous tabs despite detection of previously observed conflicts.
- Browser-scoped learner identity, typed evaluator role and client-side mastery results are not authenticated T03 authority.
- Readback confirms presence in this browser store at that instant, not fsync, durable server backup or second-device recovery.
- Previously saved raw/legacy evidence is preserved; no automatic owner claims, migrations or deletions.
- Synthesis and exam scoring, full question banks and 80% rules were not altered.
- The remaining English 9 Week 02–36 managed weekly modules, Algebra I other writing handlers, historical record provenance and account cloud receipt design need separate audit.

## Next acceptance steps
1. Run Node and controlled browser tests with two synthetic siblings including tab races, quota errors, malformed records and reset/retake.
2. Inventory English 9 Week 02–36 managed writing fields and their save success/feedback; align with this write/readback contract.
3. When T03 commissioning is independently verified, implement authenticated learner identity and atomic attempt + audit + receipt with replay and cross-device restore; protect T01.
