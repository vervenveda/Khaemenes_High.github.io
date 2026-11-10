# Algebra I + English 9 — Lesson and Record Retention Audit
**Date:** November 10, 2026
**Branch:** `hardening/algebra-english-lesson-retention-2026-11-10`
**Scope:** Source-level forensic retention audit and staged safe write-verification repairs. No production merge, real learner record access, live server changes or STOS commissioning.

## English 9: actual record flow
1. The 36-week portal at `courses/language-arts/english-9/index.html` uses `ELA9_36_WEEK_PORTAL_V2` for a multi-student local state model: lessons, notes, reading, annotation, CER, vocabulary, exit tickets, weekly quiz attempts, midterm and final attempts. It performs structural validation and detects whole-object changes from another browser tab.
2. Its `saveState()` previously called `localStorage.setItem()` without verifying readback. It now re-reads the saved serialized record before acknowledging success, and on Academy-linked sessions checks that the currently selected learner matches the loaded English 9 record's Academy learner ID.
3. Weekly lesson pages share `courses/language-arts/english-9/assets/course.js`. Their lighter `khae-ela9-progress-v1` state (prepared/completed buttons) and `khae-ela9-field:*` notes previously silently swallowed storage write errors and still displayed completion. The lesson writer now checks Academy family/learner consistency, compares against its last read record to detect cross-tab divergence, and confirms readback. A failed checkbox save restores the previous in-memory flag and does not show completion. Writing fields show a retention warning when their save cannot be confirmed.
4. These two English 9 state models are **not identical**: the 36-week portal record is an origin-wide multi-student JSON document; standalone weekly lesson pages use learner-scoped storage. A dashboard completion summary is not proof of a saved written response or a formal grade.
5. **No existing English 9 lesson, note, quiz, exam or academic record was rewritten, imported, deleted or migrated** by the branch changes.

## Algebra I: actual record flow
1. Course index `courses/mathematics/algebra-1/index.html` links to 13 units, 87 lessons and 36-week mastery. The inspected Unit 01 lessons use `units/unit-01/assets/unit01.js` for randomized scored attempts, lesson writing drafts and onward progression.
2. The Unit 01 attempt record uses `khaemenes-algebra1-unit01-a3-v1` including attempts, best scores and answer snapshots. The `save()` writer now requires a successful readback of exactly the serialized record before the UI reports graded mastery and offers the next step.
3. Unit 01's lesson-writing draft writer now verifies readback before saying a draft was saved. Written work remains formative and does not independently award mastery.
4. `courses/shared/learner-scope-v1.js` intercepts Algebra I storage prefixes, directs records to learner-scoped keys and preserves ambiguous historical browser-wide records for explicit ownership resolution. It must remain in the call chain when testing scoped saves. Do not blindly migrate, claim or delete legacy raw keys.
5. `assets/mastery-authority-v1.js` continues to read unit, lesson, weekly, midterm and final evidence with the existing 80% rules. **No assessment gate, source precedence, Monte Carlo question bank, scoring or existing learner-scope mapping was changed.**

## Verification and regression
- JavaScript syntax inspection passed: English 9 lesson module, 36-week portal inline script, Algebra I Unit 01 runtime and new test source.
- Isolated synthetic execution of the Algebra I graded-attempt save helper: normal write accepted, quota/storage exception rejected, and missing readback rejected.
- Repeatable synthetic/source regression tests authored at `courses/tests/algebra-english-retention.test.cjs` (6 cases). Full `node --test`, interactive course lesson/browser tests and cross-device restoration tests **not executed**.
- No live learner data accessed or modified.

## Open integrity problems
1. **English 9 two-store reconciliation:** The 36-week portal and standalone weekly evidence are different data families. T03 import must map both and preserve their provenance instead of guessing which represents mastery.
2. **English 9 whole-document updates:** The portal detects another-tab changes and pauses writes, but it is still not an atomic, server-serialized transaction. Unsaved in-memory changes require deliberate recovery.
3. **Algebra I provenance:** The Unit 01 and other unit/weekly/cumulative evidence keys require a full inventory by course and learner. A browser-local mastery result must not automatically become authenticated official achievement at T03.
4. **Incomplete coverage:** This pass instrumented Algebra I Unit 01 specifically, **not all 13 units, 87 lessons, weekly banks or cumulative assessment writers**. Other units and English 9 week-specific modules still need independent verification.
5. **Durability:** Browser localStorage and readback are same-device checks, not backups, append-only audit journals, cross-device recovery or authenticated server receipts.
6. **Real-world failure tests:** Need simulated quota exhaustion, two-browser-tab racing submissions, offline refresh, learner switch mid-assessment and import/export restoration with two synthetic student accounts.

## T03-facing retention acceptance contract
For each submitted lesson or assessment: authenticated family/learner binding, course ID, exact authored lesson/attempt ID, original question bank/version when relevant, score/feedback, original timestamps, append-only immutable attempt record, explicit mastery decision, and one durable atomic record + audit + receipt transaction; after cross-device reload verify the returned receipt and exact learner identity. Parent observer access must never write student scores. Never infer official mastery from continuation/navigation snapshots or a client-side storage key alone.

**Rollback:** These changes live only on the review branch. Keep main, prior browser stores and STOS terminals unchanged until automated/browser acceptance evidence is complete.
