# Algebra II Exceptional-Depth Rollout
**Date:** 2026-11-17  
**Pilot:** Unit 01 · Advanced Functions, Transformations & Inverses

## Completed in Unit 01

### Question abundance and metadata
- Added `assets/algebra2-depth-bank-v1.js`.
- 36 new depth questions + 12 existing Unit 01 questions = 48 available Unit 01 questions.
- Six new questions per lesson.
- New depth bank is evenly divided across difficulty levels:
  - 12 Foundation-level;
  - 12 Core-level;
  - 12 Extended-level.
- Every new item carries:
  - unit;
  - lesson;
  - instructional week;
  - difficulty;
  - minimum pathway;
  - reasoning dimension;
  - skill;
  - explanation;
  - misconception tag.

### Real pathway differentiation
- Foundation Practice: 12 scaffolded / access-level items.
- Core Practice: 16 mixed items through Core difficulty.
- Extended Practice: 20 items including Extended reasoning.
- Shared assessment selector now respects pathway difficulty metadata.

### Retake novelty
- The selector reads the immediately prior form and prefers unused question IDs.
- Unit 01 formal mastery draws 20 from the 36-item depth pool.
- The second form can therefore use as many as 16 previously unseen depth questions before reuse is necessary.
- Attempt records retain previous-form overlap metadata.

### Balanced formal mastery
Unit 01 formal mastery is now 20 questions and deliberately balances:
- procedural fluency;
- multi-step application;
- representation / interpretation;
- error analysis;
- transfer reasoning.

The selector also tracks lesson coverage and difficulty counts in the attempt record.

### Cumulative assessment hardening
- Midterm and Final now load the Unit 01 depth bank.
- Shared cumulative selection now balances item count by unit rather than allowing a larger unit bank to dominate the exam.
- Remaining units still require larger banks before cumulative retake novelty can be called Exceptional course-wide.

### Representation and worked-example depth
Added `assets/algebra2-unit01-depth-companion-v1.js` to all six Unit 01 lessons.
Each lesson now receives:
- an accessible lesson-specific SVG representation;
- three additional deep examples;
- explicit boundary / misconception / transfer treatment;
- a representation checkpoint requiring two forms of the same idea.

The six visuals cover:
- function mapping;
- domain/range constraints;
- transformation point mapping;
- composition pipeline;
- inverse reflection;
- piecewise boundaries.

### Weekly retention
Added two non-gating retention checks:
- `units/unit-01/retrieval/week-01.html`
- `units/unit-01/retrieval/week-02.html`

Week 02 deliberately mixes:
- 6 Week 02 items;
- 4 Week 01 items.

This begins the delayed-retrieval layer without adding another progression gate.

### Evaluator reliability
`assets/lesson-tools.js` no longer accepts an arbitrary typed 0–100 lesson score.
Lesson evidence is now calculated from a common weighted rubric:
- Conceptual understanding · 25%
- Procedure & accuracy · 25%
- Reasoning & justification · 20%
- Verification & representation · 15%
- Transfer & communication · 15%

Rubric provenance is stored with the lesson attempt.
The 80% mastery threshold remains unchanged.

## Validation

Source-level validation completed:
- assessment engine syntax: PASS;
- lesson tools syntax: PASS;
- depth bank syntax: PASS;
- Unit 01 depth companion syntax: PASS;
- 36 depth questions present;
- 12 / 12 / 12 difficulty split;
- 6 questions for each of six lessons;
- 18 Week 01 + 18 Week 02 depth items;
- all five formal reasoning dimensions have enough items for the 20-question blueprint;
- all six lesson pages load the depth companion;
- practice pages load the depth bank and declare fixed pathway/count;
- mastery page loads depth bank with 20-question depth blueprint;
- both retention pages load the depth bank and are marked non-gating retrieval evidence.

Validator source:
`algebra-2/tools/validate-unit01-exceptional-depth-v1.cjs`

## Status against Exceptional Standard

| Dimension | Unit 01 status |
|---|---|
| Conceptual depth | Exceptional |
| Procedural fluency | Exceptional |
| Reasoning | Exceptional |
| Modelling / application | Exceptional |
| Multiple representations | Exceptional |
| Differentiation | Exceptional |
| Practice abundance | Exceptional |
| Retake validity | Exceptional for Unit 01 |
| Retention | Exceptional pilot pattern |
| Constructed / defended evidence | Exceptional |
| Evaluator reliability | Exceptional |
| Learner route clarity | Strong / next visual UX pass |
| Accessibility / cognitive load | Strong / live-device certification pending |

## Propagation order

1. Units 02–03 · Polynomial / complex-number depth.
2. Units 04–05 · Rational / radical depth.
3. Units 06–07 · Exponential / logarithmic depth.
4. Units 08–09 · Systems, matrices, sequences, series.
5. Units 10–11 · Trigonometry and identities.
6. Unit 12 · Probability, distributions, inference.
7. Unit 13 · Advanced modelling capstone.
8. Build the 36-week Algebra II retrieval ledger from the completed unit banks.
9. Re-audit the complete Algebra II course against Exceptional Standard v1.
10. Apply the smaller targeted refinements to Geometry and Pre-Algebra; protect Algebra I from unnecessary scope expansion.


## Units 02–03 completed

### Unit 02 · Polynomial Functions & Complex Numbers
- 48 new metadata-rich depth questions.
- 6 new questions for each of 8 lessons.
- Difficulty split: 16 Foundation / 16 Core / 16 Extended.
- 12 / 16 / 20 differentiated practice counts.
- 20-question balanced mastery blueprint.
- Weeks 03–05 non-gating spaced retrieval.
- Lesson-specific representation companion covers polynomial structure, equivalent forms, end behavior, powers of i, complex arithmetic, complex quadratic roots, complex plane, and complete factorization.

### Unit 03 · Polynomial Equations, Division & Graphs
- 42 new metadata-rich depth questions.
- 6 new questions for each of 7 lessons.
- Difficulty split: 14 Foundation / 14 Core / 14 Extended.
- 12 / 16 / 20 differentiated practice counts.
- 20-question balanced mastery blueprint.
- Weeks 06–08 non-gating spaced retrieval.
- Lesson-specific representation companion covers long division, synthetic division, factor/remainder relationships, Rational Root Theorem, solving higher-degree equations, multiplicity/graph behavior, and residual/model-limit reasoning.

### Shared architecture improvements
- Assessment engine auto-loads unit depth banks instead of requiring script edits on every page.
- Lesson tools auto-load Units 02–03 representation companions.
- Retakes continue to prioritize unseen questions.
- Cumulative exam selection remains unit-balanced.
- Algebra II learner-facing lessons, assessment/practice surfaces, and unit pages now enforce a 16 px minimum screen readability floor with 44 px minimum form controls.
- The common five-part lesson evidence rubric and 80% mastery threshold remain unchanged.

### Validation status
Source-level checks pass for:
- JavaScript syntax in the shared engine, lesson tools, depth bank, and representation companion;
- 48 Unit 02 + 42 Unit 03 new questions;
- six new questions per lesson;
- balanced difficulty inventories;
- unique IDs;
- valid answer indexes / answer text;
- sufficient inventory in all five reasoning dimensions.

Validator source:
`algebra-2/tools/validate-units02-03-exceptional-depth-v1.cjs`

### Next propagation block
Units 04–05 · Rational functions, radical functions, rational exponents.
