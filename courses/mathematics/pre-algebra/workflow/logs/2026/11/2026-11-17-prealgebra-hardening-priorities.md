# Pre-Algebra Hardening Priorities — 2026-11-17

## Audit scope

This pass reviewed:
- readiness gateway and Unit 0 routing;
- generic lesson engine and workflow adapter;
- unit assessment wrapper and cumulative assessment engine;
- shared course UI and presentation layers;
- game/resource integration;
- repository topology and duplicated engine surfaces.

Current topology snapshot:
- 376 HTML files
- 111 JavaScript files
- 48 JSON files
- 13 unit lesson engines
- 26 unit assessment engine/core files
- 25 unit-level CSS files

The curriculum itself is strong. The main remaining risks are operational resilience, authority consistency, and maintainability.

---

## Priority 1 — Create one canonical learner-record authority

### Finding

The generic lesson engine still reads and writes browser `localStorage` directly through each unit's `progress_key`.

The course also uses additional browser-local keys for:
- readiness / NAIB routing;
- Unit 0 exit evidence;
- unit mastery results;
- workflow state;
- cumulative midterm/final results;
- local reflections and attempts.

This means learner progress is logically consistent but physically fragmented across browser-local records.

### Risk

A browser change, storage denial, Opera/private-storage behavior, tablet reset, origin change, or partial key corruption can make valid progress appear missing even when other course evidence remains intact.

This is the highest-priority hardening issue because it affects learner record recovery.

### Hardening target

Create a canonical `prealgebra-learner-record-v1` adapter with:
- one read API;
- one write API;
- schema versioning;
- learner identity binding;
- per-record provenance;
- migration from legacy keys;
- checksum / structural validation;
- export bundle containing all units, attempts, reflections, assessment evidence and resource activity;
- read-only recovery when persistent storage is unavailable.

Browser localStorage may remain a cache, but it should no longer be treated as the only course record.

---

## Priority 2 — Collapse lesson and assessment authority into shared engines

### Finding

Pre-Algebra currently carries:
- 13 unit-local `lesson-engine.js` files;
- 13 `assessment-engine.js` files;
- 13 `assessment-engine-core.js` files;
- shared wrappers and workflow adapters layered on top.

This creates multiple implementation points for the same mastery rules.

### Risk

A future bug fix can reach Unit 04 but miss Unit 11, or a storage/gating rule can diverge between units.

The current 80% policy is conceptually consistent, but duplication makes that consistency expensive to preserve.

### Hardening target

Move to:
- one canonical Pre-Algebra lesson engine;
- one canonical unit-assessment engine;
- unit JSON/config for content and routing;
- thin unit loaders only.

The shared engine should enforce:
- 80% mastery;
- retry without destructive reset;
- best-score preservation;
- attempt history;
- review vs mastery distinction;
- next-lesson gating;
- assessment restrictions;
- learner-scope verification.

---

## Priority 3 — Build explicit storage-failure and recovery behavior into lessons

### Finding

The generic lesson engine catches some reads but its normal save path still assumes browser storage is writable.

Cumulative assessments correctly describe browser-local results as non-authoritative and exportable, but ordinary lesson records do not yet have equally strong failure/recovery behavior.

### Risk

On a device where localStorage exists but is inaccessible, quota-limited, partitioned, or cleared, a learner can complete work without realizing the save did not persist.

### Hardening target

Add a course-wide storage health contract:
- test storage at lesson startup;
- visible status: Protected / Local Only / Export Recommended / Read Only;
- verify every write by reading it back;
- preserve unsaved work in memory when writes fail;
- one-click lesson + course export;
- import/recovery validation;
- conflict detection for multiple tabs/devices;
- never show “saved” unless the write verifies.

This should mirror the stronger note-recovery architecture already used elsewhere in the high-school system.

---

## Priority 4 — Consolidate responsive presentation and reduce CSS competition

### Finding

The current responsive design is substantially improved:
- body text reaches 16px or more;
- controls use 44px minimum touch targets;
- grids collapse at 800px / 520px;
- centered layout is present.

However, Pre-Algebra still contains:
- shared `course-ui.css`;
- canonical blueprint CSS;
- Unit 01 special blueprint CSS;
- 13 unit CSS files;
- 12 additional unit-specific blueprint files.

That is roughly 25 unit-level CSS surfaces in addition to shared course styling.

### Risk

Tablet/browser differences can expose specificity conflicts, especially when orientation changes or older unit pages load a different combination of style layers.

### Hardening target

Create one responsive Pre-Algebra lesson stylesheet with:
- 16px absolute text floor;
- 44×44 minimum interactive target;
- equal-width controls;
- no fixed-width side columns;
- two-column tablet → one-column phone collapse;
- horizontal table wrappers;
- orientation-change stability;
- `100dvh` / safe-area handling where appropriate;
- Opera/Chromium/Safari-compatible CSS only;
- reduced-motion handling;
- no critical functionality dependent on hover.

Then retire unit-local presentation overrides where they are redundant.

---

## Priority 5 — Unify progression evidence from readiness through final

### Finding

The course has strong separate components:
- 30-question readiness diagnostic;
- six-strand routing;
- Unit 0 refresher;
- 13 unit mastery checks;
- 36 weekly checks;
- midterm;
- final;
- constructed-response evaluator review;
- 80% mastery policy.

But these evidence layers do not yet resolve through one canonical longitudinal record.

### Risk

A learner may have valid lesson mastery, weekly mastery, Unit 0 evidence, exported work, and midterm/final evidence that are individually correct but difficult to reconcile into one student-facing or parent-facing course history.

### Hardening target

Create a single progression evidence ledger that records:
- readiness route;
- Unit 0 status;
- lesson best score and attempts;
- weekly mastery;
- unit mastery;
- midterm selected-response score;
- constructed-response review;
- final evidence;
- corrections;
- game/resource activity as non-grade indicators;
- export provenance.

The ledger should distinguish:
- Practice
- Reviewed
- Mastered
- Retained
- Assessment pending review
- Assessment verified by evaluator

No lower or newer record should erase stronger prior evidence.

---

## Recommended repair order

1. Canonical learner-record adapter
2. Storage health / recovery contract
3. Shared lesson + assessment engines
4. Responsive CSS consolidation
5. Unified progression evidence ledger

The first two should be treated together because they directly protect learner work.

## Important non-finding

The deeper audit did **not** identify a curriculum-content collapse. The readiness gateway, 80% mastery policy, weekly specificity requirement, mixed-evidence midterm/final model, lesson-aware games/tools/materials, and centered responsive presentation are all strong foundations.

The hardening need is primarily architectural: fewer authorities, stronger recovery, and one trustworthy learner evidence path.
