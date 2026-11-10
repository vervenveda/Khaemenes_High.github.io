# English 9 — Same-device save, reopen and sibling-isolation retention test
**Date:** 2026-11-10
**Repository:** `vervenveda/Khaemenes_High.github.io`
**Review branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Scope:** `courses/language-arts/english-9/assets/course.js` (shared weekly lesson controller); staged only.

## Source findings
1. Shared weekly progress saved and read back, but `load()` returned an empty object when stored JSON was corrupt. A subsequent progress save could overwrite the original damaged record, destroying recoverable historical evidence.
2. The controller's generic writing field input handler did not compare against a previously observed field value. It could overwrite a later same-field change made in another browser tab.
3. Missing Academy learner context already denied new writes, but a generic field could still load unassigned browser content for display; that content should not be assumed to belong to the current visitor.

## Staged repairs
- Read the existing progress record once into a raw snapshot; validate JSON shape and boolean completion values before permitting future writes.
- Fail closed on invalid/unreadable progress. Do not silently overwrite the original, even if the page shows an empty working view. Show a 16px+ retention warning.
- Load progress only after learner/family context is validated; preserve existing unassigned keys without displaying or writing them in a new unverified visitor session.
- For generic `[data-save-field]` lesson responses, remember the raw saved value at page load and compare that value immediately before each write. Freeze the field's save path if a newer value exists in another tab; require exact readback before announcing success.
- Do not read a learner's personal writing into the field when no verified learner context is available; keep such fields read-only until the right session is established.
- No academic score, 80% mastery threshold, teacher review logic, or authored lesson content was changed.

## Synthetic controlled execution actually performed
Using an isolated JavaScript harness and in-memory storage, the actual extracted progress and writing-save blocks from this review branch were executed:
- Student A saved Week 14 completion; reopening as A restored it.
- Switching to synthetic Student B began with separate progress; saving a Week 15 marker under B did not alter A's Week 14 record.
- Returning to A restored the original completion without B's marker.
- Existing malformed progress bytes were left untouched, and a new write was denied.
- A saved writing draft reopened with its exact original value.
- A second learner's writing workspace was blank.
- A later same-field write from another tab was not overwritten by an older open editor.
- An attempted write after switching the active learner was denied.

**Controlled isolated outcomes: PASS.**

## Repeatable test artifact
`courses/tests/english9-save-reopen-sibling-isolation.test.cjs` contains three Node `node --test` regression cases using excerpts of the actual controller. The test file and modified controller passed JavaScript syntax checks. **The full Node runner has not been invoked** and no actual browser was controlled.

## Outstanding acceptance gates
- Browser-level lesson open/refresh/close/reopen for Week 02, 13 and 20 with two synthetic learners, including real event handling, quota exhaustion, and two tabs.
- Inspect unique Week 14–36 entry points for any independent writers bypassing shared `course.js`.
- Distinguish `evidence prepared` from graded/teacher-reviewed mastery. Do not auto-promote browser-local completion flags to authoritative grades.
- Original historic unassigned/uncertain learner evidence remains unchanged and requires manual provenance review before migration.
- Readback proves only same-device state at a moment in time; not crash-proof atomic transactions, encrypted record custody, backup, or second-device recovery.
- STOS T03 requires its own proven commissioning, authenticated student and parent permissions, durable record+audit+receipt and restore validation; none implemented here.
- Never use a student's live lesson data for synthetic tests; production code and T01/T03 terminal state were untouched.

## Today's student session
The production English 9 course remains unchanged. The student's real experience on that version is an independent acceptance observation, not a deployment test of this review branch.
