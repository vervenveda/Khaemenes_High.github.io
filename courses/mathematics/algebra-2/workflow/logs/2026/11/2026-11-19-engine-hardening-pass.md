# Algebra II · Engine Hardening Pass

**Date:** 2026-11-19  
**Type:** forensic audit · repair · hardening  
**Scope:** Algebra II progression, lesson record, unit progress, assessment navigation, presentation runtime, and offline deployment. Formal assessment content, answer keys, mastery thresholds, and historical attempts were preserved.

## Bubble 1 · Weekly mastery boundaries were not enforced at lesson entry

### Verified issue
The central `lessonUnlocked(unit, lesson)` authority checked:
- course readiness,
- prior-unit mastery,
- Midterm for second-half entry,
- prior-lesson mastery,

but it did **not** require the previous instructional week's mastery check when the next lesson crossed a week boundary.

### Repair
A canonical lesson→week map was generated directly from `course-data.js` and added to `algebra2-progression.js`.

`lessonUnlocked()` now requires:
1. unit entry authorization,
2. previous lesson ≥80% mastery,
3. prior instructional week ≥80% mastery when the lesson crosses into a new week.

Commit:
- `b56389efd1c18f10f1af6a036fe9648b3a07385b`

## Bubble 2 · No explicit next-step contract

### Verified issue
Lesson pages carried static Next Lesson links while the real course progression also includes:
- weekly mastery gates,
- unit mastery,
- Midterm,
- Final,
- Completion Record.

Static links could not express the full progression contract.

### Repair
Added `nextTarget(unit, lesson)` to the canonical Algebra II progression authority.

It resolves the authorized next step in this order:
- current lesson mastery,
- next lesson in same week,
- weekly mastery at a week boundary,
- remaining weekly gate at end of unit,
- unit mastery,
- Unit 06 → Midterm,
- next unit,
- Unit 13 → Final,
- Final mastered → Completion Record.

Commit:
- `b56389efd1c18f10f1af6a036fe9648b3a07385b`

## Bubble 3 · Lesson shell trusted static navigation and final lesson lacked a progression action

### Verified issue
`lesson-tools.js` enabled/disabled the existing primary hero link based only on lesson mastery. It did not replace the destination with the canonical next-step decision.

Unit 13 Lesson 05 had no primary progression link at all.

### Repair
- Lesson engine now consumes `progress.nextTarget(unitNumber, lessonNumber)`.
- Primary lesson action is rewritten to the authorized target.
- If a lesson has no primary progression action, the engine creates one.
- Until lesson mastery is demonstrated, the progression action remains locked.
- After mastery, it can route to a lesson, weekly gate, unit mastery, Midterm, Final, or Completion Record.

Commits:
- `8893c28fb3075c68843f929d957fbcc864f33526`
- `e5b191cda3e5d709c5686cc6ef91178d134a130a`

## Bubble 4 · Persistence and unit progress semantics

### Verified issue
The Algebra II progression adapter accepted a storage-adapter write on `persisted===true` without honoring an explicit negative verification result.

The unit landing page also described lesson records as merely "completed" even though the canonical authority requires mastery evidence.

### Repair
- `writeJSON()` now accepts shared-adapter storage only when persisted and not explicitly `verified:false`.
- Existing direct-local fallback continues exact write/read-back verification.
- Lesson note success wording now explicitly says the saved record was verified.
- Unit progress now calls the canonical `lessonMastered(id)` authority rather than reading `complete` directly.
- Unit landing progress now reports **lessons at 80% mastery**, not lessons merely marked complete.

Commits:
- `b56389efd1c18f10f1af6a036fe9648b3a07385b`
- `8893c28fb3075c68843f929d957fbcc864f33526`
- `0c57dcb469a476be043313713df8115d9e1badbf`

## Bubble 5 · Cumulative-gate navigation, typography, and offline runtime

### Assessment navigation
The shared assessment engine previously offered a generic next-unit action after formal unit mastery.

Now:
- Unit 06 mastery → **Midterm**
- Unit 13 mastery → **Final**
- other unit mastery → next unit

Commit:
- `703298c8891f09671182e654c6bb44b4754ba94e`

### Typography
Legacy Algebra II HTML still embeds 14px body text and 55px eyebrow/kicker rules.

Shared runtime hardening now:
- maintains a 16px ordinary-text floor,
- forces eyebrow/kicker category labels to 14px,
- preserves the lesson title as the dominant heading.

Commits:
- `bef74aa002a6ebcb28d4f3e64f28f111e8138977`
- `6bd6f6b2f87e1bca40ca1a2e06605844355ae834`

### Offline runtime
The lesson engine dynamically loads `algebra2-presentation-unifier-v1.js`, but that file was not part of the offline CORE list.

The service worker now:
- advances from v14 to **v15-hardening-20261119**,
- precaches the Algebra II presentation unifier,
- rotates prior Algebra II caches during activation.

Commit:
- `4c106248d116d022c3befa2a22e7ccbee0df08b5`

## Learner ownership

Algebra II already uses:
- `courses/shared/learner-scope-v1.js`,
- an active Academy learner check,
- learner-scoped storage keys,
- cross-tab note conflict detection,
- draft recovery/export,
- fail-closed read-only recovery when progression authority cannot load.

No duplicate learner-scoping system was added.

## Assessment safety

No edits were made to:
- diagnostic question content,
- weekly mastery item content,
- unit mastery question banks,
- Midterm or Final questions,
- answer keys,
- evidence dimensions,
- 80% thresholds,
- historical attempts.

The assessment-engine change in this pass is navigation only. Persistence strengthening occurred centrally in the progression storage authority.

## Static/source verification

PASS:
- `algebra2-progression.js` parses,
- `lesson-tools.js` parses,
- `unit-progress.js` parses,
- `assessment-engine.js` parses,
- presentation unifier parses,
- service worker parses,
- canonical lesson→week map present,
- weekly boundary enforcement present,
- explicit next-target authority present,
- Final mastery authority present,
- Unit 13 → Final target present,
- Final → Completion target present,
- verified adapter persistence present,
- lesson shell consumes explicit next target,
- missing primary progression action is created when needed,
- unit progress uses mastery authority,
- Unit 06 assessment navigation points to Midterm,
- Unit 13 assessment navigation points to Final,
- typography hierarchy override present,
- service-worker v15 boundary present,
- presentation unifier available offline.

## Remaining HOLD

- live browser/device acceptance,
- tablet portrait and landscape,
- phone layout,
- simulated storage denial,
- offline reload after v15 activation,
- boundary smoke tests:
  - Unit 01 Lesson 03 → Week 02 mastery,
  - Unit 01 Lesson 06 → Week 03 mastery / Unit mastery,
  - Unit 10 week 27→28, 28→29, and 29→30 transitions,
  - Unit 06 mastery → Midterm,
  - Unit 13 Lesson 05 → Unit mastery → Final,
  - Final mastered → Completion Record.

No live/browser PASS is claimed until those checks are run.
