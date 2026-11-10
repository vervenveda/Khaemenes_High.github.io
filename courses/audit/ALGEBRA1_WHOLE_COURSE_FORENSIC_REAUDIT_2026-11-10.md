# Algebra I — Fresh whole-course forensic reaudit
**Date:** 2026-11-10
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Review branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Status:** read source, stage targeted repair and regression; no live deployment or student data accessed.

## Audited topology
- Course landing `courses/mathematics/algebra-1/index.html`: 36-week/13-unit/87-lesson pathway with placement/readiness, units, gated lessons, weekly mastery, midterm/final and modelling.
- Unit 01: `units/unit-01/assets/unit01.js`; Units 02–09: dedicated `unitXX-core.js` files; Units 10–13: shared `assets/unit-page-core.js`.
- Weekly mastery: `assessments/assets/weekly-mastery-engine-v2.js` with 36-week question bank, 10 selected questions, 8/10 threshold, lesson prerequisites and cumulative midterm gate.
- Cumulative assessments: `assets/exam-engine.js`, with selected-response history, written reasoning, structured evaluator review, old selected-only attempt classification and explicit non-authoritative browser trust labels.
- Central mastery gate: `assets/mastery-authority-v1.js`, reads dedicated and shared unit/lesson scores, weekly records and cumulative reviewer records. Browser-local records are not authenticated school grades or T03 receipts.

## Verified existing protections
- Reviewed all 10 relevant unit runtime sources covering Units 01–13: **all parsed successfully**.
- Unit 01–09 dedicated scored records and synthesis save paths contain exact browser readback checks.
- Units 10–13 shared scored-record writer verifies saved bytes.
- Weekly scored attempt/draft writer compares prior value, checks readback, detects stale tab/learner context and refuses malformed weekly records.
- Cumulative attempt/evaluator writer checks prior value and exact readback. It refuses evaluator review when the referenced original attempt cannot be found.
- Existing 80% proficiency rule for units, lessons and graded weekly mastery, and structured written-review requirement in cumulative exams, remain.
- Review branch was 59 commits ahead of `main` and zero behind at the start of this audit.

## New confirmed defect and staged repair
**Cumulative Save Draft false confirmation.** The old `assets/exam-engine.js` Save Draft button unconditionally replaced the status with `Draft saved locally.` even if `saveDraft()` returned false. A storage quota error or failed write could mislead students into closing the lesson and losing constructed-response work.

Repair: the button now announces `Draft saved on this device and verified.` **only if `saveDraft()` returns true**. The existing failure warning is left visible. This does not change scoring, student records, lesson unlocks or review roles.

Added `courses/tests/algebra1-save-feedback-forensic.test.cjs` to regress the misleading confirmation and document the legacy completion inference risk.

**Controlled isolated test performed:** invoking the actual new button handler against a synthetic failing `saveDraft` left the existing status unchanged; invoking it with successful `saveDraft` produced the verified-save notice. Changed engine and new test source passed JS syntax parsing. The authored Node test suite and full browser end-to-end testing have **not** run in this turn.

## New/remaining audit bubbles — do NOT treat as corrected
1. **Legacy completion-only mastery provenance:** central authority `unitEvidence()` and `lessonEvidence()` convert `shared-progress.completed` IDs to an inferred score of exactly 80 when the numeric score is missing. This may be compatibility behavior, but an old completion flag is not direct proof of a graded attempt. Before changing it, inventory legitimate legacy learners and tests; do not silently revoke recorded unlocks or grant official grades.
2. **Malformed cumulative drafts:** `loadDraft()` falls back to an empty object when draft JSON is invalid. Subsequent writes may overwrite those original bytes without an export/quarantine path. A new fail-closed draft recovery contract is needed before protecting this path.
3. **Two-stage cumulative submit:** submit persists the draft as submitted and then appends the graded result separately; failure of the second write can leave state inconsistent. The handler attempts to reset the draft, but if that reset also fails, a reload may show `submitted:true` with no corresponding history. Need idempotent transaction recovery, not automatic grade attribution.
4. **Browser-only integrity:** localStorage readback is not atomic across concurrent tabs or durable across devices. Typed evaluator role/attestation does not authenticate the adult. A T03 record+audit+receipt server write must be proven independently.
5. **Actual assessments and lesson depth:** source inspection proves the existence of the course map and grading engines, not that every authored unit question is mathematically correct, distinctive, aligned to learning standards, free of duplicates or meets desired instructional depth. Requires content-level sampling and browser interaction.

## Next priority
1. Add non-destructive malformed cumulative draft protection and interrupted-submit reconciliation with exact attempt ID, without changing scores or legacy ownership.
2. Review raw legacy completion-only records as non-authoritative until they can be matched to recorded graded attempts; preserve original bytes.
3. Run actual Node regression suite plus a synthetic two-learner browser workflow, including failures/reopen, 80% unlocks and reviewer path.
4. Once commissioning receipts establish operational T03, implement authenticated, idempotent, append-only attempts with durable storage, audit and second-device recovery. Keep T01 protected.

**No live course, student data, existing records, or STOS terminal was modified.**
