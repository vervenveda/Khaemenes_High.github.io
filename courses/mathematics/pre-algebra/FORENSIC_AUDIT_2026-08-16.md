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

The original monolithic Pre-Algebra portal remains preserved byte-for-byte as `legacy.html`, with blob SHA `1f86cf98681502de7be0749c79805faba14eea1f`. The Academy-facing `index.html` is a compatibility wrapper.

The preserved 36-week scope still includes readiness diagnostic; number systems; integers; rational numbers; ratios/rates/proportions; percent and financial mathematics; powers/roots/scientific notation; variables/expressions; equations; inequalities; coordinates/functions/linear relationships; geometry/measurement; statistics/probability/sampling; and mathematical modelling.

## Confirmed original defects

- exact weekly quiz duplication across multiple weeks;
- strong correct-answer-position bias;
- shared unit banks too small to establish fresh weekly transfer;
- advisory rather than complete 80% progression authority;
- local student/profile authority conflicting with formal Academy learner continuity.

## Repairs now staged

### Academy continuity and record isolation

`assets/prealgebra-academy-bridge.js` resolves formal eligibility from High School continuity, treats only formal Grade 09 Academy context as formal evidence, stores learner-scoped records, separates preview/practice state, hides legacy student CRUD authority, and does not mutate Family Registry placement.

### Browser-safe runtime boundary

The forensic pass found that large runtime bodies embedded inside an outer JavaScript template literal can fail when the injected body itself contains unescaped template literals.

Pre-Algebra has therefore been moved to explicit external runtimes:

- `prealgebra-forensic-repair-runtime.js`;
- `prealgebra-forensic-sanity-runtime.js`;
- `prealgebra-mastery-runtime.js`.

Their corresponding hardening files are now small iframe loaders. Dynamic runtime loading is ordered with `async=false` where sequence matters.

This is a source-level repair; actual browser execution remains to be tested.

### Rebuilt weekly and cumulative assessment architecture

The active hardening path now generates a dedicated five-item bank for every week and explicitly maps the curriculum into:

- number/operations;
- integers;
- rational numbers/fractions/decimals;
- ratios/rates/proportions;
- percent/financial reasoning;
- powers/roots/scientific notation;
- expressions;
- equations;
- inequalities;
- coordinates/functions/linear relationships;
- geometry/measurement;
- data/statistics/probability;
- mathematical modelling.

This corrects the earlier undercoverage in which powers/roots and inequalities could fall back to generic number-style evidence.

The new generator also:

- varies numeric/context parameters by week;
- distributes answer positions deterministically;
- constructs GCF items from values whose intended GCF is actually guaranteed;
- runs an exact-choice collision sanity pass after generation;
- creates **18 separately salted midterm transfer banks** rather than reusing weekly items;
- creates **36 separately salted final transfer banks** rather than reusing weekly items.

The result is structurally independent weekly/midterm/final evidence. This is not yet an exhaustive mathematical answer certification.

### Formal 80% progression

Formal Grade 09 progression now stages:

- Week 1 available;
- future weeks require the preceding week to have 100% lesson completion, 100% required assignment completion, and at least 80% weekly mastery;
- daily learning is sequential Monday → Friday;
- weekly mastery cannot be submitted before all five learning days and all three weekly evidence assignments are complete;
- Week 19 additionally requires Weeks 1–18 plus an 80% midterm;
- midterm submission is blocked before Weeks 1–18 are mastered;
- final submission is blocked before all 36 weeks and the 80% midterm requirement are satisfied;
- friendly reminders explain unmet prerequisites;
- reassessment remains available.

Preview mode remains exploratory and does not create formal mastery authority.

## Independent Foundation → Pre-Algebra verification

The separate `readiness/` assessment contains **32 prerequisite-transfer items** across number operations, fractions/decimals, ratios/rates, percent, signed numbers, expressions/equations, coordinates/graphs, and geometry/data.

Candidate pass requirement is **26/32 = 81.25%**, the first attainable whole-item result at or above the Academy's 80% minimum. The result is evidence for Academy/Family pathway review, not an automatic placement change.

Static review of the 32-item file in this pass found the displayed calculations/keys coherent in the inspected source. It still requires independent second-person verification and browser execution before production use.

## Foundation-course forensic note

The separate Mathematics Foundations generator was also sampled during this pass. Its instructional scope is substantial, but the generic multiple-choice generator does not yet guarantee de-duplication of dynamically produced distractors. For example, fraction/decimal symmetry or numeric-offset generation can theoretically produce repeated visible choices in some seeds.

That means Mathematics Foundations remains correctly classified as a forensic candidate; generated choice-collision enumeration is still required before A+++ validation.

## Forensic repair standard still required

Before A+++ approval:

- enumerate generated weekly, midterm, final, and Mathematics Foundations item spaces;
- independently solve and verify generated numeric combinations;
- detect exact/near-semantic duplicate stems and any remaining distractor collisions;
- verify post-rotation answer-position distribution;
- independently verify the 32 readiness items and explanations;
- browser-test 79%/80% transitions, reassessment, Week 19, midterm/final locks, and learner switching;
- confirm Learner A/B isolation and preview/formal separation;
- validate mobile, keyboard, print, tool links, and iframe compatibility.

## Current verdict

**Pre-Algebra is materially stronger after this forensic pass: the original portal is preserved, Academy learner authority is layered in, the nested-runtime syntax hazard is removed, missing mathematics domains are represented, weekly/cumulative banks are structurally independent, common distractor-collision classes are guarded, and formal 80% progression remains explicit.**

The course is still a forensic candidate until generated-answer integrity and live/browser validation pass.
