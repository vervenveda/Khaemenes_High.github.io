# High School Mathematics Hardening Rollout — 2026-11-17

## Courses

- Pre-Algebra
- Algebra I
- Geometry
- Algebra II

## Implemented shared hardening stack

### 1. Canonical learner-record consolidation

`courses/mathematics/assets/math-learner-record-v1.js`

Provides:
- one learner-scoped canonical record per mathematics course;
- active-learner binding when available;
- schema versioning;
- non-destructive capture of legacy course stores;
- verified canonical writes;
- provenance;
- event ledger;
- automatic refresh after save/submit/mastery actions;
- page-exit and visibility capture;
- JSON course-record export.

Legacy stores are preserved during migration. No historical score is deleted or downgraded.

### 2. Storage health and recovery status

`courses/mathematics/assets/math-storage-health-v2.js`

Provides:
- storage write/read verification;
- separate reporting for storage health vs learner identity binding;
- visible Protected learner record / Learner binding needed / Export recommended status;
- one-click course-record export;
- no false "saved" claim from the hardening layer when persistent storage cannot be verified.

### 3. Shared evidence authority

`courses/mathematics/assets/math-evidence-authority-v1.js`

Provides one evidence vocabulary across all four courses:
- best score;
- 80% mastery threshold;
- practice;
- mastered;
- evaluator-verified;
- not-recorded;
- cumulative Midterm / Final evidence;
- explicit browser-local trust classification.

Existing course authorities remain active underneath during migration.

### 4. Responsive hardening

`courses/mathematics/assets/math-responsive-hardening-v1.css`

Provides:
- 16px minimum practical text floor;
- 44px minimum controls;
- no horizontal-page overflow;
- image/SVG/canvas/video containment;
- table scrolling;
- tablet landscape single-column lesson/practice layout;
- two-column tablet → one-column phone grids;
- no critical hover dependency;
- reduced-motion handling;
- safe-area support.

This shared layer is additive. Existing course CSS has not yet been destructively retired.

### 5. Unified progression ledger

`courses/mathematics/assets/math-progression-ledger-v1.js`

Combines:
- canonical learner record;
- existing mathematics progress contract;
- normalized evidence authority;
- readiness information where applicable;
- lesson / week / unit status;
- Midterm / Final evidence;
- portfolio status and provenance.

No missing evidence is treated as a zero.

## Loader

`courses/mathematics/assets/math-hardening-loader-v1.js`

Loads the hardening stack idempotently.

## Lesson-surface rollout

Mounted through:
- canonical mathematics course shell;
- Pre-Algebra workflow adapter;
- Algebra I lesson resource bridge;
- Geometry shared lesson-tools;
- Algebra II shared lesson-tools.

Pre-Algebra early/middle/final unit engines were verified to load the shared workflow adapter, so the hardening layer reaches the heterogeneous unit lesson engines without 97 individual-page edits.

## Assessment-surface rollout

Mounted through shared assessment entry points:
- Pre-Algebra unit assessment wrapper;
- Pre-Algebra cumulative exam engine;
- Algebra I mastery authority;
- Algebra I cumulative exam engine;
- Algebra I weekly mastery engine;
- Geometry assessment engine;
- Geometry weekly mastery engine;
- Algebra II assessment engine.

## Engine-consolidation status

The shared authority layer is active, but old engines have NOT been deleted yet.

Reason:
- Pre-Algebra Unit 01 carries special NAIB/readiness entry behavior;
- several Pre-Algebra units include specialized companion logic;
- course-specific assessment engines contain differing evidence semantics;
- deleting them before behavioral parity would create a regression risk.

The next engine-consolidation stage should therefore:
1. extract each specialized behavior into config/hooks;
2. build one canonical lesson core and one canonical assessment core;
3. run parity fixtures against current unit behavior;
4. convert unit engines into thin loaders;
5. retire duplicates only after parity passes.

## Current hardening state

The five original hardening priorities are now implemented at the shared architecture level:
1. canonical learner record — active;
2. storage/recovery contract — active;
3. shared evidence authority — active;
4. responsive consolidation layer — active;
5. unified progression ledger — active.

Physical deletion of duplicated legacy engines/CSS remains intentionally deferred pending parity verification.

## Validation boundary

This checkpoint is source-level and architecture-level validation. It does not claim live Opera, tablet, Safari, Chrome, orientation-change, or multi-device runtime certification.
