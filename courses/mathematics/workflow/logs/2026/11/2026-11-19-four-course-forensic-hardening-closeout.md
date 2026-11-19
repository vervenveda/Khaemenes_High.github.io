# High School Mathematics · Four-Course Forensic Hardening Closeout

**Date:** 2026-11-19  
**Courses:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Type:** repair · regression · comparative hardening  
**Origin:** fresh four-course forensic sweep  
**Assessment safety:** no question banks, answer keys, mastery thresholds, historical learner attempts, or formal scoring content were weakened or replaced.

## Executive result

The forensic repair priorities identified in the fresh four-course sweep were implemented at their authority points.

### Cross-course release parity
PASS:
- Pre-Algebra Mathematics Engine adapter source = v2.3.0.
- Algebra I Mathematics Engine adapter source = v2.3.0.
- Geometry Mathematics Engine adapter source = v2.3.0.
- Repository-native parity repair corrected **276 stale query tokens**:
  - Pre-Algebra: 97
  - Algebra I: 88
  - Geometry: 91
- post-repair stale adapter tokens: **0**
- Mathematics Engine lesson-shell integrity: **PASS** on repeated post-repair heads.

Repair tooling:
- `courses/mathematics/tools/repair-math-engine-adapter-tokens.mjs`
- `.github/workflows/math-engine-adapter-token-parity-repair.yml`

## Pre-Algebra

### Evidence-chain authority
Added:
- `assets/prealgebra-cumulative-gates-v1.js`

The cumulative authority now verifies:
- every expected lesson at ≥80%;
- every assigned instructional weekly mastery gate at ≥80%;
- formal unit mastery at ≥80%;
- reviewed mixed-evidence Midterm mastery before Final entry.

Canonical lesson counts:
- U01 6
- U02 8
- U03 8
- U04 8
- U05 8
- U06 7
- U07 8
- U08 8
- U09 7
- U10 8
- U11 8
- U12 8
- U13 5

Canonical instructional week map:
- U01: 2–3
- U02: 4–6
- U03: 7–9
- U04: 10–12
- U05: 13–15
- U06: 16–17
- U07: 18–20
- U08: 21–23
- U09: 24–25
- U10: 26–29
- U11: 30–32
- U12: 33–35
- U13: 36

### Midterm
The standalone Midterm now:
- loads Academy course-entry and learner-scope authority;
- fails closed on direct entry until Units 01–07 complete the full lesson + weekly + unit chain;
- requires verified persistence semantics.

### Final
The Final now:
- requires Units 01–13 full lesson + weekly + unit evidence chain;
- requires reviewed Midterm mastery;
- rejects explicit storage-adapter `verified:false`.

### Shared lesson persistence
The Pre-Algebra lesson core now requires:
- `persisted===true`
- and `verified!==false`
when using the shared storage adapter.

## Algebra I

### Legacy mastery fallback removed
The canonical mastery authority advanced to **v1.5**.

Removed:
- bare historical `completed` flags synthesizing 80% unit mastery;
- bare historical `completed` flags synthesizing 80% lesson mastery.

Added:
- `unitLessonRefs(unit)`
- `unitWeekRefs(unit)`
- `unitProgressionComplete(unit)`

A prior unit is now complete only when:
- formal unit mastery is numeric and ≥80%;
- every required lesson is mastered;
- every required weekly gate is mastered.

### Gate parity
Full-chain authority is now consumed by:
- dedicated Units 02–09 gates;
- strict later-unit gates;
- weekly mastery engine;
- Midterm/Final prerequisite depth gate.

### Persistence parity
Hardened:
- cumulative exam engine;
- weekly mastery engine;
- dedicated Unit 02–09 cores;
- late-unit persistence validators.

Shared storage writes reject explicit `verified:false`; direct storage fallback requires exact write/read-back equality.

### Offline hardening
Algebra I release cache advanced to:
- `khaemenes-algebra1-v47-evidence-offline-20261119`

Canonical High School global chrome is now precached for cold-offline lesson loading.

### Validator modernization
Updated stale validators to current contracts:
- assessment-depth v1.5 authority;
- strict mastery gates;
- Unit 01 deployed absolute dependency paths;
- Units 01–03 offline deployed-path handling;
- versioned adapter cache keys;
- draft failure wording;
- Resource Studio canonical chrome/ticker/toolbar;
- late-unit persistence semantics;
- live Unit 10–13 v3 mastery engine.

Confirmed green before closeout:
- Algebra I Whole-Course Validation — PASS
- Algebra I Responsive + Deep Lesson Validation — PASS
- Mathematics Engine lesson-shell integrity — PASS
- Release Head Integrity — PASS

## Geometry

### Full prior-unit evidence chain
`unit-index-gates.js` now validates:
- finite numeric scores in range 0–100;
- lesson mastery;
- weekly mastery;
- formal unit mastery.

Added:
- `unitLessonIds(unit)`
- `unitProgressionComplete(unit)`

Unit 07 now requires:
- full Unit 06 lesson + weekly + unit evidence chain;
- reviewed Midterm mastery.

Later units require the full prior-unit chain rather than a summary score alone.

### Regression surface
Added read-only:
- `window.KhaemenesGeometryUnitGateV2`

This exists for deterministic regression and does not alter grading or learner records.

## Algebra II

The previously hardened Algebra II authority remains the cross-course reference implementation.

During downstream validator modernization:
- Midterm continuity fixtures were upgraded to represent the legitimate Units 01–06 evidence chain;
- historical mastery fixtures now preserve an earlier passing unit score after a failed retake only when underlying lesson/week evidence is complete.

No Algebra II runtime authority was weakened.

## New deterministic evidence regression

Added:
- `pre-algebra/workflow/tests/validate-engine-evidence-chain.mjs`
- `algebra-1/workflow/tests/validate-engine-evidence-chain.mjs`
- `geometry/workflow/tests/validate-engine-evidence-chain.mjs`
- `.github/workflows/math-course-engine-evidence-regression.yml`

GitHub Actions result:
- **Pre-Algebra engine regression: PASS**
- **Algebra I engine regression: PASS**
- **Geometry engine regression: PASS**

Algebra II retains its existing:
- **Engine HOLD Regression PASS 12/12**

The four courses now all have deterministic engine/evidence regression proof.

## Browser / rendered boundary at closeout

The existing Runtime Acceptance Laboratory remains the department authority for:
- tablet landscape;
- tablet portrait;
- phone;
- full production rendered sweep;
- physical rotation/touch acceptance;
- live service-worker/offline reload acceptance.

At the time this closeout entry was written:
- dedicated source/fixture regression: PASS;
- Mathematics Engine integrity: PASS;
- Algebra I whole-course: PASS;
- Algebra I responsive/deep: PASS;
- Chrome-dependent launch/browser jobs were still active and therefore **not claimed PASS**.

This document must be updated if those browser-dependent runs resolve during the same repair session.

## Current comparative status

| Category | Pre-Algebra | Algebra I | Geometry | Algebra II |
| --- | --- | --- | --- | --- |
| Curriculum architecture | Exceptional | Exceptional | Exceptional | Exceptional |
| Full evidence-chain authority | PASS | PASS | PASS | PASS |
| Verified persistence semantics | PASS hardened paths | PASS hardened paths | PASS hardened paths | PASS |
| Adapter release parity | PASS | PASS | PASS | N/A architecture |
| Deterministic engine regression | PASS | PASS | PASS | PASS 12/12 |
| Rendered tablet/phone acceptance | HOLD | HOLD | HOLD | HOLD |
| Physical/browser-device acceptance | HOLD | HOLD | HOLD | HOLD |

## Assessment firewall

No repair in this pass changed:
- formal assessment question content;
- answer keys;
- 80% mastery thresholds;
- constructed-response rubrics;
- evaluator authority requirements;
- historical learner attempts;
- official grades.

All changes strengthened release integrity, prerequisite evidence, persistence verification, regression coverage, or validation accuracy.
