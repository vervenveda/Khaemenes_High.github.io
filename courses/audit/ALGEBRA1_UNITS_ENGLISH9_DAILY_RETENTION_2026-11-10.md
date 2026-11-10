# Algebra I Units 02–13 + English 9 Daily Lessons — Retention Follow-up
Date: November 10, 2026
Branch: `hardening/algebra-english-lesson-retention-2026-11-10`
Status: review only; no live deployment, no real learner records accessed, no STOS action.

## Actual source topology verified
- Algebra I Units 02–09 use dedicated unit core modules `units/unit-XX/assets/unitXX-core.js` for graded attempt history, best scores, and mastery.
- Algebra I Units 10–13 use the common `assets/unit-page-core.js` renderer. All these pages load the learner-scoping script early and the existing strict mastery-gate implementation.
- English 9's individual Week 1 day lessons use the separate `courses/language-arts/english-9/assets/daily-lesson.js` controller, including learner-scoped writing, baseline evidence, a formative attempt bank and prepared-evidence state. This is distinct from the 36-week course portal and course-wide weekly lesson module.

## Staged retention repairs
1. Algebra I Units 02–09 now use a save helper that requires exact storage readback following `setItem`. The existing retry/corrections and mastery UI already consult the saver outcome; no new 80% score policy or lesson unlock was introduced.
2. Algebra I Units 10–13 shared scored-attempt renderer now verifies readback before advancing the in-memory record and rendering successful scored/mastery state.
3. English 9's individual daily lesson `write()` now rechecks Academy learner identity, the active family ID and membership, and exact stored value before announcing a successful save. Its existing cross-tab record comparison and read-only/frozen failure handling remain.
4. Added synthetic/source regression tests: `courses/tests/algebra-english-daily-retention.test.cjs`. The earlier `courses/tests/algebra-english-retention.test.cjs` remains on this branch.

## Verification
- All eight updated dedicated unit modules passed JavaScript syntax inspection.
- Isolated synthetic execution of the Unit 08 save helper: accepted confirmed write; rejected readback mismatch and simulated quota failure.
- English 9 daily lesson and new regression source passed JS syntax checks.
- Complete Node test runner, human browser tests, multi-tab race, offline second-device restoration, cumulative assessment writers, and authored score provenance remain unverified.
- No academic evidence was rewritten or migrated; source changes only.

## Remaining gaps (not claimed fixed)
- Unit synthesis/essay and other draft-storage handlers beyond the unit-core scored-attempt helper still need a full field-by-field review, including storage failures. Do not claim all writing drafts are fully protected.
- Algebra I weekly mastery, midterm/final, Unit 10–13 project evidence, English 9 Week 02–36 independent lesson organizers and the 36-week portal remain separate persistence surfaces to inventory.
- Browser readback does not ensure durable cloud retention, protection against two-tab last-writer-wins, or transaction atomicity.
- Learner-scope uses browser-local account context. STOS T03 must ultimately verify identity, authorize writes, commit record + audit + receipt atomically, and restore on a second device.
- Older unidentified learner records must be preserved without silently claiming ownership.

## Next safe audit
Inspect Algebra I weekly/mastery/cumulative assessment writers plus English 9 Week 2–36 lesson field handlers, and prioritize any false success on failed persistence. Then perform synthetic browser storage/quota/cross-tab tests and update the T03 handoff.
