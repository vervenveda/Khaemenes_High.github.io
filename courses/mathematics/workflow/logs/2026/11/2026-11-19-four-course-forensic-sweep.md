# High School Mathematics · Four-Course Forensic Sweep

**Date:** 2026-11-19  
**Courses:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Type:** forensic audit · comparative architecture review  
**Scope:** engine authority, learner-record safety, progression, cumulative assessment gates, release/cache integrity, regression coverage, runtime acceptance status, and curriculum architecture.  
**Change policy:** audit only. No assessment content, scoring logic, learner records, or curriculum content changed in this sweep.

## Executive finding

All four courses remain academically deep and source-rich. The fresh sweep does **not** support treating the four runtimes as equally hardened.

Current order of engine maturity:

1. **Algebra II** — strongest deterministic engine hardening and dedicated regression proof.
2. **Geometry** — strong architecture; summary-chain and adapter release-token gaps remain.
3. **Algebra I** — strong architecture; legacy completion fallbacks and cumulative persistence verification need hardening.
4. **Pre-Algebra** — strong curriculum/assessment depth; cumulative gating and release-token consistency require the most immediate runtime work.

All four courses retain rendered-browser/device acceptance HOLD.

---

## Cross-course finding 1 · Mathematics Engine release-token drift

### Pre-Algebra
Adapter source:
- `prealgebra-math-lesson-v2-adapter.js` = **2.3.0**

Representative lessons still request:
- `prealgebra-math-lesson-v2-adapter.js?v=2.2.3`

The repository-wide Mathematics Engine lesson-shell integrity workflow currently reports this drift across many Pre-Algebra lessons.

### Algebra I
Adapter source:
- `algebra1-math-lesson-v2-adapter.js` = **2.3.0**

Representative lessons still request:
- `algebra1-math-lesson-v2-adapter.js?v=2.2.3`

Service worker v46 also precaches:
- `algebra1-math-lesson-v2-adapter.js?v=2.2.3`

### Geometry
Adapter source:
- `geometry-math-lesson-v2-adapter.js` = **2.3.0**

Representative lessons still request:
- `geometry-math-lesson-v2-adapter.js?v=2.2.3`

Service worker v19 also precaches:
- `geometry-math-lesson-v2-adapter.js?v=2.2.3`

### Algebra II
No Mathematics Engine adapter-token mismatch. Algebra II uses its own central progression architecture and service-worker v16.

**Verdict:** high-priority cross-course release repair for Pre-Algebra, Algebra I, and Geometry.

---

## Pre-Algebra

### Strengths
- Rich mixed-evidence Midterm and Final.
- Midterm: 56 selected + 7 constructed.
- Final: 100 selected + 10 constructed.
- Final uses 70/30 weighting and 80/80/80 selected/constructed/overall standard.
- Legacy selected-only Final evidence is imported as non-mastery evidence.
- Lesson core verifies direct local writes by read-back and exposes persistence warnings.
- Math Engine adapter 2.3.0 checklist gate remains ≥80%.

### Forensic bubbles

1. **Release-token drift** — lesson references remain at v2.2.3 while adapter is v2.3.0.
2. **Midterm direct-entry prerequisite gap** — the Midterm page loads storage/recovery/UI helpers but no explicit progression/prerequisite authority was found.
3. **Final summary-only prerequisite chain** — Final verifies 13 unit mastery summaries but does not re-verify lesson + weekly evidence underneath each unit.
4. **Cumulative storage adapter verification** — Midterm/Final `writeJSON()` accepts `persisted===true` without rejecting an explicit `verified:false` result.
5. **Regression proof gap** — no dedicated Pre-Algebra deterministic engine HOLD fixture suite comparable to Algebra II.

### Current status
- Curriculum / assessment depth: **Exceptional**
- Lesson engine architecture: **Exceptional source architecture**
- Progression integrity: **Strong**
- Persistence hardening: **Strong**
- Release integrity: **Needs repair**
- Deterministic regression proof: **Strong / incomplete**
- Rendered acceptance: **HOLD**

---

## Algebra I

### Strengths
- Shared Mathematics Engine adapter 2.3.0.
- Explicit progression contracts for Unit 01, Units 02–09, and later units.
- Dedicated unit gates enforce lesson and weekly boundaries.
- Mixed-evidence cumulative assessments with structured evaluator review.
- Evaluator identity, role, note, attestation, and review schema are validated by the mastery authority.
- Unit runtimes were upgraded to verified write/read-back persistence paths.

### Forensic bubbles

1. **Release-token drift** — lessons and service worker still reference adapter v2.2.3 while adapter source is v2.3.0.
2. **Legacy completion-to-mastery fallback** — `mastery-authority-v1.js` can convert legacy `completed` flags into an 80% mastery candidate when no numeric score exists for some shared lesson/unit records.
3. **Cumulative exam persistence verification** — `exam-engine.js` accepts shared storage adapter `persisted===true` without checking explicit `verified:false`.
4. **Legacy evidence provenance remains a gate-sensitive area** — current authority intentionally supports multiple historical stores; numeric provenance should outrank bare completion flags everywhere.
5. **Dedicated engine fixture gap** — strong validators exist, but there is not yet a focused Algebra I progression/persistence fixture suite equivalent to Algebra II's 12-case HOLD harness.

### Current status
- Curriculum / assessment depth: **Exceptional**
- Progression architecture: **Exceptional**
- Persistence hardening: **Strong–Exceptional**
- Legacy evidence safety: **Strong / needs one more pass**
- Release integrity: **Needs repair**
- Regression proof: **Strong**
- Rendered acceptance: **HOLD**

---

## Geometry

### Strengths
- 90/90 standard lessons enrolled in the Mathematics Engine.
- Shared adapter 2.3.0.
- Final-course `finalMastered()` defect repaired.
- Native Geometry progression contract is now exposed to the Math Engine.
- Lesson/assessment persistence requires verified storage semantics in the hardened paths.
- Mixed-evidence Midterm and Final.
- Unit checks and weekly gates retain the 80% standard.
- Geometry release and higher-math local regression were previously recorded PASS.

### Forensic bubbles

1. **Release-token drift** — lessons and service worker still request adapter v2.2.3 while source is v2.3.0.
2. **Prior-unit summary trust** — `unit-index-gates.js` unlocks later units from prior unit summary mastery rather than re-verifying the complete prior lesson + weekly + unit evidence chain.
3. **Unit 07 entry has the same summary-chain shape** — Unit 06 summary + Midterm are checked, but underlying Unit 06 lesson/week chain is not re-proven at entry.
4. **Score normalization is weaker than Algebra II** — some Geometry gate readers use `Number(...)` or boolean mastery flags directly rather than one shared validated 0–100 score parser.
5. **Curriculum specificity follow-up remains separate** — prior audits identified Unit 06 template/specificity concerns; this is curricular, not an engine failure, and should be handled after runtime hardening.

### Current status
- Curriculum architecture: **Exceptional**
- Progression architecture: **Strong–Exceptional**
- Persistence hardening: **Exceptional in hardened lesson/assessment paths**
- Evidence-chain hardening: **Strong**
- Release integrity: **Needs repair**
- Regression proof: **Strong**
- Rendered acceptance: **HOLD**

---

## Algebra II

### Strengths
- Central progression authority with exact lesson→week map.
- Full evidence-chain unit progression:
  - lesson mastery,
  - weekly mastery,
  - unit mastery.
- Midterm re-verifies Units 01–06 lesson/week/unit evidence.
- Final re-verifies Units 01–13 lesson/week/unit evidence plus Midterm.
- Explicit next target resolves:
  - lesson,
  - weekly mastery,
  - unit mastery,
  - Midterm,
  - next unit,
  - Final,
  - Completion Record.
- Verified draft, archive, learner-change recovery, and storage-denial handling.
- Non-destructive fail-closed read-only recovery.
- Service-worker v16.
- Dedicated GitHub Actions HOLD regression: **PASS 12/12**.

### Remaining HOLDs
Only rendered-environment acceptance remains:
- tablet portrait,
- tablet landscape,
- phone,
- live offline reload / service-worker activation,
- visual recovery-banner/control acceptance.

### Current status
- Curriculum architecture: **Exceptional**
- Progression architecture: **Exceptional**
- Persistence hardening: **Exceptional**
- Evidence-chain hardening: **Exceptional**
- Release integrity: **Exceptional**
- Regression proof: **Exceptional**
- Rendered acceptance: **HOLD**

---

## Four-course comparative matrix

| Category | Pre-Algebra | Algebra I | Geometry | Algebra II |
| --- | --- | --- | --- | --- |
| Curriculum architecture | Exceptional | Exceptional | Exceptional | Exceptional |
| Lesson-engine architecture | Exceptional | Exceptional | Exceptional | Exceptional |
| Explicit next-step authority | Strong | Exceptional | Exceptional | Exceptional |
| Weekly-boundary protection | Strong | Exceptional | Strong–Exceptional | Exceptional |
| Full prior-unit evidence-chain recheck | Partial | Partial / legacy-sensitive | Partial | Exceptional |
| Cumulative assessment depth | Exceptional | Exceptional | Exceptional | Exceptional |
| Verified persistence semantics | Strong | Strong–Exceptional | Strong–Exceptional | Exceptional |
| Learner scoping | Strong | Strong | Strong | Strong–Exceptional |
| Adapter/cache release integrity | **Repair** | **Repair** | **Repair** | Pass |
| Dedicated deterministic engine regression | Incomplete | Incomplete | Strong | **PASS 12/12** |
| Rendered device acceptance | HOLD | HOLD | HOLD | HOLD |

---

## Recommended repair order

### Priority 1 · Release-token parity
Repair all v2.2.3 lesson/service-worker references for:
1. Pre-Algebra
2. Algebra I
3. Geometry

Then rerun Mathematics Engine lesson-shell integrity.

### Priority 2 · Evidence-chain parity
Bring Pre-Algebra, Algebra I, and Geometry to Algebra II's stricter rule:
- no summary-only progression when underlying required evidence is missing;
- no bare completion flag treated as a numeric mastery score.

### Priority 3 · Cumulative persistence verification
Require shared storage adapter writes to satisfy:
- `persisted===true`
- and not `verified===false`

Apply to:
- Pre-Algebra Midterm/Final,
- Algebra I cumulative exam engine,
- any Geometry remaining summary writers/readers that do not use the hardened path.

### Priority 4 · Course-local regression fixtures
Add deterministic progression/storage suites for:
- Pre-Algebra,
- Algebra I,
- Geometry.

Algebra II is the current regression blueprint.

### Priority 5 · Rendered acceptance
Use the existing four-course Runtime Acceptance Laboratory for:
- desktop,
- tablet landscape,
- tablet portrait,
- phone,
- storage failure,
- live offline reload.

Only after those runs should browser/device HOLD be promoted to PASS.

## Overall department verdict

The four-course curriculum remains **Exceptional**.

The fresh forensic engine verdict is more nuanced:

- **Algebra II: Exceptional hardened engine**
- **Geometry: Strong–Exceptional hardened engine; evidence-chain + release parity remaining**
- **Algebra I: Strong–Exceptional hardened engine; legacy evidence + release parity remaining**
- **Pre-Algebra: Strong hardened engine supporting Exceptional curriculum; cumulative gate + release parity require immediate attention**

The next surgical move should be the shared **adapter/cache release-token parity repair**, because it is already producing a real red repository-wide integrity workflow and affects three courses at once.
