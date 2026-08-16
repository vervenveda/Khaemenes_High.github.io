# Grade 09 Mathematics — Pre-Algebra Foundation/Bridge Forensic Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet A+++ certified

## Course role

Pre-Algebra remains the **Foundation / Bridge** Grade 09 mathematics pathway rather than the sole standard Grade 09 expectation.

Recommended continuum:

1. **Mathematics Foundations** — prerequisite rebuilding below Pre-Algebra.
2. **Pre-Algebra Bridge** — number/proportional/algebraic readiness before Algebra I.
3. **Algebra I / Integrated Mathematics I** — standard high-school algebra/functions pathway when prerequisite evidence supports it.
4. **Advanced verification** — Geometry or higher only when demonstrated evidence and Academy review support acceleration.

Formal placement and curriculum access remain separate. No mathematics page silently rewrites Academy grade placement.

## Preserved original course

The original monolithic Pre-Algebra portal is now preserved byte-for-byte as `legacy.html` (same source blob as the former `index.html`). The Academy-facing `index.html` is now a compatibility wrapper, following the same preservation pattern used in the hardened English, Science, and Global Studies portals.

The preserved 36-week scope still includes readiness diagnostic; number systems; integers; rational numbers; ratios/rates/proportions; percent and financial mathematics; powers/roots/scientific notation; variables/expressions; equations; inequalities; coordinates/functions/linear relationships; geometry/measurement; statistics/probability/sampling; and mathematical modelling.

## Confirmed original defects

### 1. Exact weekly quiz duplication

The original unit-bank architecture reused complete question sets across multiple weeks. Consecutive integer weeks repeated the same absolute-value, signed-addition, temperature-change, signed-product, and least-value items. Similar unit-bank reuse occurred elsewhere.

### 2. Correct-answer-position bias

Sampled original banks frequently stored the intended answer at index `0`, creating an exploitable pattern.

### 3. Unit banks were too small

Several weeks drew from the same small domain bank rather than requiring fresh transfer evidence.

### 4. The 80% target was not a complete progression authority

The original course expressed an 80% mastery target but allowed navigation that did not consistently enforce prerequisite day/week/exam gates.

### 5. Local student authority conflicted with Academy continuity

The original portal maintained its own student state and profile controls. That is appropriate for preserved open-age legacy practice, but not as the formal Academy Grade 09 authority.

## Repairs now staged

### Academy continuity and record isolation

`assets/prealgebra-academy-bridge.js` now:

- resolves formal eligibility from `KhaemenesHighContinuity`;
- treats only a formal `grade-09` Academy learner as formal evidence context;
- stores formal Pre-Algebra records under `khaemenes_pre_algebra_records_by_learner_v1`, keyed by learner ID;
- stores preview/practice separately;
- replaces the legacy local student list with the active Academy learner inside the compatibility runtime;
- hides local Add/Delete/Demo student authority;
- does not mutate Family Registry placement.

### Weekly bank diversity

`assets/prealgebra-forensic-quality.js` replaces the old shared unit-bank mapping on the hardened runtime with a dedicated five-item bank for each of the 36 weeks — **180 weekly objective positions**.

The generated families cover:

- number/operations;
- integers;
- rational numbers/fractions/decimals;
- ratios/rates/proportions;
- percent/financial reasoning;
- algebraic expressions/equations;
- coordinates/functions/linear reasoning;
- geometry/measurement;
- data/statistics/probability.

Choice positions are deterministically rotated instead of preserving the old index-0 bias. The midterm now draws one transfer item from each of Weeks 1–18; the final draws one transfer item from each of all 36 weeks rather than simply sampling four questions from a few shared domain banks.

This is a **structural repair, not yet an answer-integrity certification**. Generated numeric combinations and distractor collisions still require enumeration and independent verification.

### Formal 80% progression

`assets/prealgebra-mastery-gate.js` now stages formal Grade 09 progression rules:

- Week 1 available;
- future weeks require the preceding week to have 100% lesson completion, 100% required assignment completion, and at least 80% weekly mastery;
- daily learning checkboxes are sequential Monday → Friday;
- the weekly mastery check cannot be submitted until all five learning days and all three weekly evidence assignments are complete;
- Week 19 additionally requires Weeks 1–18 plus an 80% midterm;
- midterm submission is blocked before Weeks 1–18 are mastered;
- final submission is blocked before all 36 weeks and the 80% midterm requirement are satisfied;
- friendly reminder language explains what remains;
- reassessment remains available.

Preview mode remains exploratory and does not create formal mastery authority.

## Independent Foundation → Pre-Algebra verification

A new `readiness/` assessment provides **32 independent prerequisite-transfer items** across eight strands:

1. number operations;
2. fractions & decimals;
3. ratios & rates;
4. percent;
5. signed numbers;
6. expressions & equations;
7. coordinates & graphs;
8. geometry & data.

Candidate target: **26/32 (81.25%, satisfying the Academy's 80% minimum)**.

The assessment stores learner-scoped readiness evidence when a formal Grade 09 learner is present and separate preview evidence otherwise. It explicitly states that reaching the target is evidence for Academy/Family pathway review, not an automatic placement change.

## Forensic repair standard still required

Before A+++ approval:

- enumerate all 180 generated weekly objective positions and all midterm/final runtime selections;
- independently solve and verify every generated numeric combination;
- detect duplicate answer choices and impossible/ambiguous distractors;
- run exact and near-semantic duplicate analysis across weekly and cumulative pools;
- verify post-rotation answer-position distribution;
- verify all 32 readiness items and explanations independently;
- verify the readiness threshold/report language with Academy policy;
- confirm daily/mastery/exam gates under actual browser interaction;
- confirm learner A/B isolation and preview/formal separation;
- validate mobile, keyboard, print, calculator/tool links, and iframe compatibility.

## Resource federation

Scientific Calculator, Geometry Sanctuary/Sacred Geometry, logic/pattern games, Finance/Budget tools, and Ohmic CAD remain useful where each has an explicit lesson purpose. High-value future reusable apps include Equation Forge, Coordinate Cartographer, Function Machine Lab, and Data Detective.

## Current verdict

**The major structural Pre-Algebra defects are now staged for repair: original portal preserved, Academy learner authority layered in, 36 week-specific assessment banks installed, sequential 80% progression staged, and an independent Foundation → Pre-Algebra readiness verification added.**

The course is still a forensic candidate until generated-bank answer integrity, uniqueness, load-order, learner isolation, and browser/mobile/print tests pass.
