# Algebra II · Engine Hardening Pass 02

**Date:** 2026-11-19  
**Type:** forensic audit · repair · hardening  
**Scope:** second-round progression authority, cumulative evidence-chain enforcement, recovery persistence, fail-closed behavior, and deployment rotation. Formal assessment content and scoring rules were preserved.

## Bubble 1 · Weekly mastery best-score validation

### Verified issue
`weekMastered()` accepted `Number(record.best) >= 80` directly, while other graded records used the safer 0–100 `recordedScore()` validator.

### Repair
Weekly `best` values now pass through the same validated score authority before they can unlock progression.

Commit:
- `d68979ae0922a9a5d35b51bc5dd8d5cdb2c5f10d`

## Bubble 2 · Legacy unit mastery could bypass the full evidence chain

### Verified issue
A valid or legacy unit mastery score could unlock the next unit even if lesson and weekly records were missing.

### Repair
Added `unitProgressionComplete(unit)`:

`unit mastery ≥80% + every lesson ≥80% + every instructional weekly gate ≥80%`

Next-unit entry now requires that full evidence chain, not the unit summary alone.

Commit:
- `d68979ae0922a9a5d35b51bc5dd8d5cdb2c5f10d`

## Bubble 3 · Midterm and Final prerequisite checks trusted unit summaries too strongly

### Verified issue
The Midterm checked Units 01–06 mastery summaries and the Final checked Units 01–13 plus Midterm, but neither re-verified the underlying lesson/week evidence chain.

### Repair
Midterm now verifies for Units 01–06:
- unit mastery,
- all lesson mastery,
- all unit weekly mastery.

Final now verifies for Units 01–13:
- unit mastery,
- all lesson mastery,
- all unit weekly mastery,
- reviewed Midterm mastery.

This closes legacy-summary bypasses while preserving all existing assessment content.

Commit:
- `d68979ae0922a9a5d35b51bc5dd8d5cdb2c5f10d`

## Bubble 4 · Locked lesson/unit pages could point to the wrong missing requirement

### Verified issue
At a week boundary, a locked lesson could tell the learner to return to the previous lesson even when that lesson was already mastered and the actual missing requirement was the prior weekly mastery gate.

Unit 07 could also direct the learner to the Midterm even when Unit 06's lesson/week/unit evidence chain was incomplete.

### Repair
Added:
- `lessonRequirement(unit, lesson)`
- `unitRequirement(unit)`

Locked pages and lesson cards now route to the **actual missing gate**:
- readiness,
- previous lesson,
- previous weekly mastery,
- previous unit evidence chain,
- Midterm.

Commits:
- `d68979ae0922a9a5d35b51bc5dd8d5cdb2c5f10d`
- `f89196a93f004f7b8bb0ff4a0e5916f7ffd4c1aa`

## Bubble 5 · Recovery writes and failure mode

### Verified issue
Lesson note drafts, overwrite recovery archives, and learner-change emergency drafts used direct `localStorage.setItem()` without read-back verification.

The unit landing page also replaced all unit content when the progression script failed to load.

### Repair
- normal draft writes now verify exact read-back,
- overwritten-note recovery archives verify exact read-back,
- learner-change emergency drafts verify exact read-back,
- recovery controls now respect the 16px screen minimum,
- unit pages preserve curriculum content in read-only fail-closed mode when progression authority is unavailable,
- lesson and mastery navigation are disabled in that recovery state,
- retry remains available without granting progression credit.

Commits:
- `dc8e3f52a8913782c573a017ef20a1f281a4cd0b`
- `b884da86d18a4554774367cdef2e8a04c3b2e476`
- `16d692c7c1fc19782e4cdc07c0d8f272eb2b0843`

## Deployment boundary

Service-worker cache advanced from **v15-hardening-20261119** to **v16-hardening-r2-20261119** so current devices rotate onto the second-round runtime.

Commit:
- `6f42f8de682b57d43bd140742a15155d05733436`

## Assessment safety

No edits were made to:
- diagnostic questions,
- weekly mastery questions,
- unit mastery questions,
- Midterm or Final questions,
- answer keys,
- question-selection dimensions,
- 80% mastery thresholds,
- historical learner attempts.

The changes affect prerequisite verification and runtime authority only.

## Static/source verification

PASS:
- progression authority parses,
- lesson engine parses,
- unit progress engine parses,
- assessment engine parses,
- service worker parses,
- weekly best score uses validated 0–100 authority,
- full unit evidence-chain authority present,
- next-unit unlock uses full evidence chain,
- Midterm rechecks lesson + weekly evidence,
- Final rechecks lesson + weekly evidence,
- weekly-boundary lock routes to weekly mastery,
- locked unit routes to the actual missing gate,
- draft write verification present,
- overwrite archive verification present,
- learner-change emergency draft verification present,
- recovery controls 16px,
- unit progression failure is non-destructive/read-only,
- service-worker v16 boundary present.

## Remaining HOLD

- live browser/device acceptance,
- tablet portrait and landscape,
- phone layout,
- simulated storage denial,
- corrupted weekly-best fixture test,
- legacy unit-summary-with-missing-lessons fixture test,
- Unit 07 missing-Unit-06-evidence routing test,
- weekly-boundary lock messaging test,
- offline reload after v16 activation.

No live/browser PASS is claimed until those checks are run.
