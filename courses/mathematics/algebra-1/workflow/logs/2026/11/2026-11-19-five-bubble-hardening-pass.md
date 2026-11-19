# Algebra I · Five-Bubble Hardening Pass

**Date:** 2026-11-19  
**Type:** forensic audit · repair · hardening  
**Scope:** Algebra I learner-facing lesson/runtime architecture. Formal assessment content, question banks, answer keys, score thresholds, and prior attempts were preserved.

## Starting bubble set

1. Legacy category/eyebrow typography could outrank lesson titles.
2. Several lesson/unit records wrote to browser storage without read-back verification.
3. Learner ownership/scoping required confirmation and hardening around saved lesson evidence.
4. Native unit navigation and the Mathematics Engine could compete as progression authorities.
5. The shared adapter inferred next lessons from globals instead of consuming an explicit progression contract.

## Bubble 1 · Typography hierarchy

### Verified issue
Legacy unit HTML contains a high-specificity 55px eyebrow/kicker rule. Later-unit shared styles also enlarged hero eyebrows above the actual h1 hierarchy.

### Repair
- Algebra I Math Engine adapter bumped to **2.3.0**.
- Shared lesson fine-tune now forces category labels to 14px.
- Shared Algebra I responsive contract now holds eyebrow/kicker labels to 16px.
- Later-unit shared stylesheet now keeps hero category labels at 16px rather than 25–44px.

Commits:
- `f7c768e0815e77ff50839688d7a0a3bf07b84f31`
- `2533a8ec68e84c977c1085f8b1c0c02b622feb21`
- `aca9e02b0d881bc7a9248d1a1b151618eb0fc728`

## Bubble 2 · Verified persistence

### Verified issue
Unit 01 and dedicated Unit 02–09 cores returned success after `localStorage.setItem()` without verifying the value could be read back.

### Repair
- Unit 01 canonical attempt save now uses write/read-back verification.
- Unit 01 lesson writing, independent transfer drafts, and synthesis evidence now use verified persistence and truthful failure messaging.
- Units 02–09 dedicated course cores now verify writes by reading back the exact serialized record.
- Units 10–13 were inspected and already use the newer `writeState()` persistence verification path; no redundant edit was made.
- Shared lesson checklist persistence now verifies writes and exposes a learner-facing storage warning when persistence cannot be confirmed.

Commits:
- `b7408e3f6aa6529f0d6d43df9d65b2623fc7f17e`
- `3b82caedecf611473bd768704c699448d3c15d9a`
- Unit 02: `0abf796711a5ea3ce93d1840906bdd9e7af8270a`
- Unit 03: `b6e59012f22e6b250b654f5e1b23e2bb2fb2608b`
- Unit 04: `66cd1418f4513b6a208b06405581e1788de2bbeb`
- Unit 05: `001c524edfb9f4a219c3b7f4dd05dfc9acec3fed`
- Unit 06: `7c0eb0fd8f4a4379c324a926c5c7be4fdfeff322`
- Unit 07: `e1ea5ed0218ef6b6d9a7b3ae10fdd66ac4d01d3f`
- Unit 08: `9694075d0434f649321f69d01bf27101a5a4151f`
- Unit 09: `e411455f8453597c8f6742fc814aa3d1d3bac721`

## Bubble 3 · Learner scoping

### Deeper finding
The apparent unscoped Algebra I keys are intercepted by the existing `courses/shared/learner-scope-v1.js` layer. That layer:
- recognizes `khaemenes-algebra1-` keys,
- binds them to the active Academy learner,
- prevents cross-learner reads/writes,
- preserves ambiguous legacy records until an ownership decision is made,
- exposes recovery/export controls for preserved device work.

### Resolution
No second scoping system was added. The hardening pass instead made the Algebra I save paths verify that the already-scoped writes actually persisted. This preserves the single learner-scope authority and avoids double namespacing.

State: **architecture confirmed + persistence hardened**.

## Bubble 4 · Competing progression authorities

### Verified issue
Legacy unit renderers could display their own next-step container while the Mathematics Engine separately enforced its checklist + ≥80% completion gate.

### Repair
The Algebra I adapter now suppresses the legacy `#lessonNextStep` when the canonical completion card is active. The learner sees one final navigation authority.

Commit:
- `f7c768e0815e77ff50839688d7a0a3bf07b84f31`

## Bubble 5 · Inferred next-step routing

### Verified issue
The shared adapter previously searched global `KHAE_UNITxx` data and inferred lesson number + 1. That could not fully express weekly mastery boundaries.

### Repair
- Unit 01 now publishes its native Week 02 / Week 03 / unit-mastery progression logic through `KhaemenesAlgebra1ProgressionContract`.
- The dedicated Unit 02–09 gate publishes an explicit next-step contract that distinguishes lesson, weekly mastery, and unit mastery targets.
- The later Unit 10–13 strict mastery gate publishes the same contract shape.
- The Math Engine adapter consumes the explicit contract before any legacy fallback.

Commits:
- `b7408e3f6aa6529f0d6d43df9d65b2623fc7f17e`
- `2fe660a00bf76d147b49965389769914c21efb4b`
- `bfdf6309814e963860d62a295eb658a2c5a0ca8e`
- `f7c768e0815e77ff50839688d7a0a3bf07b84f31`

## Deployment/cache boundary

The service worker release cache was bumped from v45 to **v46-hardening-20261119** and the Algebra I Math Engine adapter was added to the release precache boundary so existing devices do not remain on the prior runtime cache.

Commit:
- `8e26485de5a3a2b9e68bc8635516bf9617986a25`

## Assessment safety

No edits were made to:
- weekly mastery question content,
- unit mastery question banks,
- midterm or final question content,
- answer keys,
- 80% thresholds,
- existing graded attempts,
- evaluator review evidence,
- official completion records.

## Static/source verification

PASS:
- all modified JavaScript files parse successfully,
- Math Engine adapter version 2.3.0 present,
- verified checklist persistence present,
- Unit 01 verified persistence present,
- Units 02–09 read-back persistence present,
- Units 10–13 existing verified write path confirmed,
- learner-scope authority confirmed,
- category-label typography override present,
- Unit 01 explicit progression contract present,
- dedicated-unit explicit progression contract present,
- later-unit explicit progression contract present,
- legacy next-step suppression present,
- service-worker cache v46 present.

## Remaining HOLD

- live browser/device acceptance,
- tablet portrait + landscape,
- phone layout,
- simulated storage-denial test,
- progression smoke tests at:
  - Unit 01 Lesson 03 → Week 02 mastery,
  - Unit 01 Lesson 06 → Week 03 mastery / Unit mastery,
  - one Unit 02–09 instructional-week boundary,
  - one Unit 10–13 instructional-week boundary,
- offline reload after service-worker v46 activation.

No live/browser PASS is claimed until those tests are run.
