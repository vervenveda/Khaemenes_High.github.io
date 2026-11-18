# High School Mathematics Hardening — Fresh Audit + Implementation Checkpoint
**Date:** 2026-11-17  
**Courses:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Mastery policy:** unchanged at 80%

## Audit baseline

At the start of this pass the live repository contained:

| Course | Files | JS | CSS | HTML | JSON |
|---|---:|---:|---:|---:|---:|
| Pre-Algebra | 697 | 137 | 30 | 376 | 48 |
| Algebra I | 532 | 121 | 15 | 254 | 63 |
| Geometry | 428 | 31 | 2 | 296 | 45 |
| Algebra II | 309 | 11 | 2 | 206 | 44 |

The largest risk was architectural rather than curricular. Pre-Algebra carried the most duplicated runtime surfaces; Algebra I retained several overlapping legacy/mastery layers; Geometry and Algebra II were already substantially centralized.

## Fresh findings

1. **Active learner binding mismatch**
   - The canonical mathematics learner record assumed the active learner key was an object.
   - Existing High School account code can store `khaemenes_active_learner_v1` as a JSON string ID.
   - Result: a legitimately selected learner could be represented as `unscoped`.

2. **False-positive save risk**
   - Several lesson/assessment engines treated a successful `localStorage.setItem()` call as proof of persistence.
   - Some Geometry paths swallowed storage exceptions.
   - The course could therefore say “saved” without a read-back verification.

3. **Pre-Algebra duplication**
   - 13 unit lesson-core files represented only two unique source bodies.
   - 13 unit assessment-core files represented only three unique source bodies.
   - 13 unit stylesheets represented four source bodies before consolidation.

4. **Progress-reader scoping mismatch**
   - Algebra II already stores several progression records with learner-scoped keys.
   - The shared progress reader still preferred the legacy unscoped key.

5. **Evidence vocabulary was too coarse**
   - The shared ledger reduced most evidence to practice/mastered/evaluator-verified.
   - It did not explicitly preserve Reviewed, Retained, or Pending Review.

---

# Implemented hardening stack

## 1. Canonical learner-record authority

### Shared authority
`courses/mathematics/assets/math-learner-record-v1.js`

Now:
- accepts active learner identity as either a string ID or object;
- resolves family-registry learner metadata when available;
- keeps one learner/course canonical record key;
- filters learner-scoped legacy keys so another learner’s scoped record is not captured;
- separates learner-scoped and legacy-unscoped provenance;
- captures verified legacy writes immediately;
- captures course-state changes, page exit, visibility exit, and relevant save/submit actions;
- includes memory-only legacy evidence in export when persistent storage cannot enumerate it;
- never assigns historical unscoped evidence as proof of learner ownership.

## 2. Storage/recovery contract

### New shared storage adapter
`courses/mathematics/assets/math-storage-adapter-v1.js`

Provides:
- write → read-back verification;
- verified removal;
- page-memory fallback;
- storage-state events;
- storage probe/status;
- memory snapshot for recovery export.

### Live status surface
`courses/mathematics/assets/math-storage-health-v2.js`

Visible states:
- **Protected · Local Only**
- **Local Only · Learner Binding Needed**
- **Export Recommended · Memory Only**
- **Read Only · Export Recommended**

The banner updates when storage state, learner binding, or online/offline state changes.

### Verified writes wired into major authorities

**Algebra I**
- `assets/deep-lesson-engine-v1.js`
- `assets/exam-engine.js`
- `assessments/assets/weekly-mastery-engine-v2.js`

**Geometry**
- `assets/lesson-tools.js`
- `assets/assessment-engine.js`
- `assessments/assets/weekly-mastery-engine-v2.js`
- `records/record-engine-v2.js`

**Algebra II**
- `assets/algebra2-progression.js`
- `assets/app.js`

**Pre-Algebra**
- canonical lesson/assessment cores;
- Unit 01 special lesson/assessment cores;
- Unit 02 autosave-special assessment core;
- generic lesson engine;
- Unit 01–13 assessment wrappers.

No hardening path is permitted to claim “saved and verified” when persistence cannot be read back.

---

# 3. Shared engine consolidation

## Pre-Algebra lesson engine

Canonical:
`courses/mathematics/pre-algebra/assets/prealgebra-lesson-engine-core-v2.js`

Runtime routing:
- Unit 01 retains its special entry/readiness core.
- Units 02–13 route through the canonical lesson core.

The older per-unit core files are retained as rollback/parity artifacts but are no longer the active runtime authority for Units 02–13.

## Pre-Algebra assessment engine

Canonical:
`courses/mathematics/pre-algebra/assets/prealgebra-assessment-engine-core-v2.js`

Runtime routing:
- Unit 01 remains special.
- Unit 02 keeps its specialized autosave assessment core.
- Units 03–13 route through the canonical assessment core.

This avoids deleting specialized behavior before parity certification.

## Other courses

Algebra I, Geometry, and Algebra II were already materially more centralized than Pre-Algebra. This pass hardens their existing shared engines instead of creating parallel replacements.

---

# 4. Responsive CSS consolidation

Shared cross-course layer remains:
`courses/mathematics/assets/math-responsive-hardening-v1.css`

Pre-Algebra now uses:

### Canonical base
`courses/mathematics/pre-algebra/assets/prealgebra-unit-core-v2.css`

### Small shared submission overlay
`courses/mathematics/pre-algebra/assets/prealgebra-submission-language-v1.css`

Active Pre-Algebra stylesheet families are now:
1. Unit 01 special;
2. Units 02–05 canonical base + submission overlay;
3. Units 06–13 canonical base.

This replaces twelve duplicated active unit stylesheets with one common base plus one behavior-neutral overlay while preserving Unit 01’s special surface.

---

# 5. Longitudinal progression evidence ledger

### Evidence authority
`courses/mathematics/assets/math-evidence-authority-v1.js`

### Progression ledger
`courses/mathematics/assets/math-progression-ledger-v1.js`

Canonical status vocabulary:
- **Practice**
- **Reviewed**
- **Mastered**
- **Retained**
- **Pending Review**
- **Evaluator Verified**

The ledger also:
- preserves Not Recorded / Unavailable as non-score states;
- exposes a cumulative-final retention indicator;
- creates a pending-review queue;
- records storage and learner-binding warnings;
- recommends export when persistence/binding is unsafe;
- does not convert missing evidence to zero.

### Scoped progress reading

`courses/mathematics/assets/math-progress-contract-v1.js`

Now prefers:
`<legacy-key>:learner:<active-learner-id>`

and falls back to the legacy unscoped key only when no learner-scoped record is available.

---

# Validation

Added:
`courses/mathematics/tools/validate-hardening-v1.cjs`

The validator checks:
- shared hardening files exist;
- storage adapter loads before learner record;
- string-ID learner binding remains supported;
- memory-only evidence remains exportable;
- canonical evidence vocabulary remains intact;
- learner-scoped progress is preferred;
- Pre-Algebra lesson wrappers 02–13 use the canonical lesson core;
- Pre-Algebra assessment wrappers 03–13 use the canonical assessment core;
- Unit 01 and Unit 02 assessment exceptions remain isolated;
- Pre-Algebra CSS routes through the canonical base/overlay;
- Algebra I, Geometry, and Algebra II major engines remain connected to verified storage.

Source-level checks in this implementation pass also confirmed:
- shared JavaScript hardening files parse successfully;
- the nine major Algebra I/Geometry/Algebra II engine surfaces parse successfully;
- every Pre-Algebra lesson wrapper 02–13 points to the canonical lesson core;
- every Pre-Algebra assessment wrapper 03–13 points to the canonical assessment core;
- current Pre-Algebra unit CSS has exactly three active source families.

---

# Preserved invariants

- 80% mastery threshold is unchanged.
- Missing evidence is never scored as zero.
- Lower attempts remain learning evidence; best-score/mastery semantics are not downgraded.
- Historical unscoped records are preserved for recovery, not silently assigned to a learner.
- Existing curriculum, lesson content, games/tools/material mappings, readiness routing, Midterm, Final, and evaluator requirements remain intact.
- No legacy engine/core file was destructively deleted in this pass.

---

# Remaining certification work

The architecture is hardened, but this checkpoint does **not** claim live-device certification yet.

Before deleting rollback copies, run:
1. desktop Chrome/Safari/Opera parity;
2. tablet portrait + landscape;
3. storage-disabled / quota-failure simulation;
4. learner-switch isolation;
5. reload/pagehide recovery;
6. JSON export verification;
7. Pre-Algebra Unit 01/02 special-path parity;
8. assessment retry / mastery / evaluator-review parity.

Only after those pass should the unused duplicate Pre-Algebra core files be physically retired.
