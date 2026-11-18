# Algebra I · Full Exceptional Source Re-Audit

**Date:** 2026-11-18  
**Course:** Khaemenes Algebra I / Integrated Mathematics I  
**Scope:** full 36-week source-controlled curriculum and evidence architecture  
**Source verdict:** **EXCEPTIONAL** across audited academic and architecture categories  
**Live browser/device acceptance:** **HOLD**

## Fresh-audit findings

Algebra I was already academically strong. Its distinctive strength is mixed evidence: cumulative exams require evaluator-reviewed constructed responses rather than relying only on selected response.

The fresh audit found three meaningful parity gaps:
1. Unit 10 had a smaller eligible mastery pool than neighboring mature units.
2. Units 01–09 selected 20 unit-mastery questions by simple random sampling rather than lesson-balanced sampling.
3. Weekly mastery had excellent five-dimension balance but lacked deliberate delayed retrieval.

## Quantitative architecture

- 36 weeks;
- 13 units;
- 87 detailed lessons;
- 435 shared questions = 5 per lesson across all 87 lessons;
- Units 01–09 also maintain dedicated 10-per-lesson unit banks;
- Units 11–13 have expanded 20-per-lesson rebuilds;
- Unit 10 now has an 80-item eligible pool = 10 per lesson.

### Canonical weekly mastery
Executable validation confirms:
- 36 weekly forms;
- 360 unique canonical questions;
- exactly 72 questions in each of five dimensions;
- Week 1 is non-graded readiness;
- Weeks 2–36 are graded.

Added `weekly-mastery-retrieval-v3.js`:
- graded Weeks 2–36 now retain 10 questions and five-dimension balance;
- each form uses 8 current-focus + 2 delayed-retrieval items;
- executable validation reports zero weekly blueprint errors.

Added `weekly-mastery-answer-key-v3.json` with 360 questions, answers, explanations, dimensions, and retrieval provenance.

## Unit mastery

### Units 01–09
The shared unit renderer now generates 20-question forms that are:
- lesson-balanced;
- difficulty-mixed;
- novelty-aware;
- 80% mastery;
- persisted only after verified storage succeeds.

Every lesson is represented before remaining slots are filled.

### Units 10–13
The legacy mastery engine already used lesson-balanced, difficulty-aware, novelty-aware selection.

Unit 10 was expanded from a 60-item eligible pool to **80 items**, and the engine now requires all 80 before accepting the pool.

New Unit 10 depth includes representation, multi-step application, error analysis, transfer, optimization, model domain, residual analysis, extrapolation, and parsimony.

## Cumulative assessment strength preserved

Algebra I intentionally keeps its stronger course-specific mixed-evidence structure:
- midterm: 60 selected-response + 6 constructed responses;
- final: 100 selected-response + 10 constructed responses;
- selected response, constructed reasoning, and overall evidence each have explicit mastery expectations;
- constructed responses are evaluator-reviewed rather than self-certified by the browser.

## Applied investigations

The shared project renderer already provides a 100-point analytic rubric:
- question / variables / units / ethics · 15;
- mathematical accuracy · 25;
- representations · 15;
- verification & sensitivity · 20;
- conclusion & limitations · 15;
- organization & reflection · 10.

The required process includes a precise ethical question, variables/units/domain/assumptions/data, multiple representations, independent verification, sensitivity testing, conclusion, limitation, and reflection.

## Teacher/evaluator architecture

All 13 unit teacher guides now carry the Exceptional-depth evidence standard.

The Teacher Portal exposes:
- the 360-question weekly mastery evaluator key;
- the Unit 13 answer key;
- assessment and record resources.

The Administration Guide now documents the 8-current + 2-delayed weekly retrieval architecture and exact five-dimension balance.

## Storage / learner-record integrity

The common unit renderer, late-unit mastery engine, and completion record now prefer the verified mathematics storage adapter and use read-back verification on fallback writes.

A unit mastery attempt is not accepted as a saved record when persistence cannot be verified.

Reflection-save messaging now reports verified persistence truthfully rather than always claiming “Saved locally.”

## Source-level rubric

| Category | Verdict |
| --- | --- |
| Scope and 36-week coherence | Exceptional |
| Lesson depth and quantity | Exceptional |
| Weekly mastery quality | Exceptional |
| Five-dimension reasoning coverage | Exceptional |
| Spaced retrieval / retention | Exceptional |
| Unit mastery architecture | Exceptional |
| Cumulative mixed-evidence assessment | Exceptional |
| Differentiation | Exceptional |
| Applied investigations / analytic rubrics | Exceptional |
| Teacher/evaluator documentation | Exceptional |
| Learner-record / storage resilience | Exceptional |
| Evidence authority / progression integrity | Exceptional |
| Accessibility / readability source architecture | Exceptional |
| Learning tools / resource integration | Exceptional |

## Acceptance boundary

**Source-controlled curriculum and architecture: EXCEPTIONAL.**

Runtime acceptance remains **HOLD** until representative desktop, tablet portrait, tablet landscape, phone, print, assessment-submission, and forced storage-failure tests are exercised live.
