# Geometry · Full Exceptional Source Re-Audit

**Date:** 2026-11-18  
**Course:** Khaemenes Geometry  
**Scope:** full 36-week source-controlled curriculum and evidence architecture  
**Source verdict:** **EXCEPTIONAL** across audited academic and architecture categories  
**Live browser/device acceptance:** **HOLD**

## Fresh-audit result

Geometry was the closest of the three courses to the Algebra II standard at the start of this pass. Its lesson architecture and formal assessment depth were already strong.

The fresh audit found source inconsistencies rather than a weak curriculum:
- teacher guides still described a historical 12-question unit check while the live checks are 20;
- projects had a strong descriptive quality matrix but lacked a transparent numeric analytic score;
- deliberate spaced retrieval was not separated from strict graded weekly/unit evidence;
- the main course-state writer needed verified persistence.

## Quantitative assessment architecture

- 36 weeks;
- 13 units;
- 90 detailed lessons;
- 180 study sessions;
- 3 differentiated pathways;
- 80% mastery.

### Canonical weekly mastery
The dedicated weekly depth bank verifies:
- 360 unique questions;
- 10 questions per week;
- exact five-dimension balance every week;
- across the course, each dimension is represented equally.

### Unit mastery
`unit-mastery-source-v2.js` generates:
- 20 questions per unit;
- every instructional week in the unit represented;
- 4 questions in each of five reasoning dimensions;
- 80% mastery;
- fail-closed behavior if the week-aligned depth bank is incomplete.

### Cumulative mixed evidence
Geometry retains:
- 60 selected-response midterm items + constructed reasoning;
- 100 selected-response final items + constructed reasoning;
- evaluator-reviewed written reasoning;
- strict completion evidence requirements.

## Lesson architecture

Geometry lessons already include:
- recall;
- visual / diagram interpretation;
- worked reasoning;
- guided practice;
- six-problem independent worksheet;
- error analysis;
- transfer;
- feedback;
- reflection;
- Foundation / Core / Extended pathways;
- local completion and notes;
- geometry/CAD/resource integration.

A redundant lesson-depth overlay was intentionally not added.

## Spaced retention

A separate non-gating `assessments/retention-lab.html` was added so graded weekly and unit banks remain uncontaminated.

Each generated retention form:
- contains 10 questions;
- preserves five-dimension balance;
- uses 8 current-focus + 2 delayed-retrieval items;
- records retention evidence only;
- never unlocks or blocks progression.

## Evaluator resources

Added `weekly-mastery-answer-key-v2.json`:
- 36 weeks;
- 360 canonical graded questions;
- answers, explanations, and dimensions.

The Assessment Center and Teacher Center now expose both:
- canonical weekly evaluator key;
- non-gating Retention Lab.

## Project scoring

All 13 investigations retain their descriptive quality matrix and now also contain a transparent 100-point analytic rubric:
- question / context / constraints / ethics · 15;
- geometric structure & accuracy · 25;
- representations & technical communication · 15;
- verification / precision / sensitivity · 20;
- conclusion / proof / limitations · 15;
- revision / reflection / defense · 10.

## Teacher guides

All 13 teacher guides now state the current Exceptional evidence standard.

The stale “12-question mastery” wording has been removed everywhere checked. Guides now describe:
- 10-question five-dimension weekly mastery;
- 20-question five-dimension unit mastery;
- 80% progression threshold;
- investigation and evidence-integrity expectations.

## Storage / record integrity

The main Geometry course-state writer now prefers the verified mathematics storage adapter and performs read-back verification on fallback writes.

The existing completion record engine already uses adapter-aware reads/writes and read-back fallback verification.

## Source-level rubric

| Category | Verdict |
| --- | --- |
| Scope and 36-week coherence | Exceptional |
| Lesson depth and learning quantity | Exceptional |
| Visual / diagram / proof reasoning | Exceptional |
| Weekly mastery quality | Exceptional |
| Five-dimension reasoning coverage | Exceptional |
| Unit mastery architecture | Exceptional |
| Spaced retrieval / retention | Exceptional |
| Cumulative mixed-evidence assessment | Exceptional |
| Differentiation | Exceptional |
| Applied investigations / analytic rubrics | Exceptional |
| Teacher/evaluator documentation | Exceptional |
| Learner-record / storage resilience | Exceptional |
| Evidence authority / progression integrity | Exceptional |
| Accessibility / readability source architecture | Exceptional |
| CAD, games, tools, and resource integration | Exceptional |

## Acceptance boundary

**Source-controlled curriculum and architecture: EXCEPTIONAL.**

Runtime acceptance remains **HOLD** until representative desktop, tablet portrait, tablet landscape, phone, print, assessment-submission, CAD/diagram rendering, and forced storage-failure tests are exercised live.
