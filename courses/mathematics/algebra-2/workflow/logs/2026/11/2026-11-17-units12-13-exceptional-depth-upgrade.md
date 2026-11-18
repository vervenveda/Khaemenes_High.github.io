# Algebra II · Units 12–13 Exceptional-Depth Upgrade

**Date:** 2026-11-17  
**Scope:** Unit 12 Probability, Distributions & Statistical Inference; Unit 13 Advanced Mathematical Modelling Capstone  
**Change class:** curriculum depth · differentiated practice · assessment · retrieval · representations · proof/transfer · evidence integrity  
**Mastery authority:** unchanged at 80%

## Goal

Complete the Algebra II Exceptional-depth conversion by bringing the probability/statistics and capstone units to the same evidence standard as Units 01–11.

## Implemented

### Metadata-rich depth bank
- Added `assets/algebra2-depth-bank-units12-13-v1.js`.
- Unit 12: 42 questions = 7 lessons × 6.
- Unit 13: 30 questions = 5 lessons × 6.
- Total: 72 new questions.
- Every item includes unit, lesson, instructional week, difficulty/pathway level, reasoning dimension, skill, explanation, and misconception metadata.
- Difficulty is evenly distributed: 24 Foundation-level, 24 Core-level, 24 Extended-level.
- Five reasoning dimensions are represented: procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning.

### Genuine pathway differentiation
- Foundation practice: 12 items.
- Core practice: 16 items.
- Extended practice: 20 items.
- Unit 13 Extended work explicitly includes model critique and evaluation, not merely harder calculation.

### Mastery and retake depth
- Unit 12 and Unit 13 mastery checks increased from 10 to 20 questions.
- Both use the five-dimension `depthBlueprint`.
- Existing retake behavior continues to prioritize items not used on the immediately prior form.
- 80% remains the progression threshold.

### Long-term retrieval
Created three non-gating spaced-retrieval forms:
- Unit 12: Weeks 32 and 33.
- Unit 13: Week 34.
- Each form contains 10 items: 6 current-week + 4 delayed-retrieval items.
- Week 32 returns to Unit 11 / Week 31.
- Week 34 returns to Unit 12 / Week 33.

### Lesson depth and multiple representations
Added `assets/algebra2-exceptional-lesson-depth-units12-13-v1.js` and attached it to all 12 lessons.

Unit 12 depth work includes counting structure, probability rules, conditional/Bayes reasoning, binomial conditions, standardization, sampling design, bias, causality, graphical integrity, and uncertainty communication.

Unit 13 depth work includes ethical question framing, variable/data provenance, model selection, reproducibility, residual and holdout validation, sensitivity, fairness, uncertainty, extrapolation limits, oral defense, and documented revision.

The depth studio is instructional only and does not write grades, mastery, progression, or learner records.

### Teacher-facing evidence standard
Unit 12 and Unit 13 teacher guides now explicitly define the Exceptional evidence pattern and require separation of mathematical result, uncertainty, limitation, and recommendation.

## Source validation

PASS:
- 72 total new depth items.
- Unit counts: 42 / 30.
- Six depth items per lesson across all 12 lessons.
- Difficulty counts: 24 / 24 / 24.
- No invalid answer indexes detected.
- No duplicate depth IDs detected.
- Depth-bank loader recognizes Units 12–13.
- Unit landing pages link Weeks 32–34 retrieval resources.
- All 12 lesson pages attach the Exceptional lesson-depth studio.
- Foundation/Core/Extended configs are 12/16/20 with explicit pathway binding.
- Unit mastery configs are 20 questions with `depthBlueprint:true`.
- Retrieval configs correctly mix 4 delayed + 6 current items.
- Unit projects retain 100-point analytic rubrics.
- 80% mastery authority and existing learner records were not changed.

## Acceptance state

**Source architecture and curriculum-depth validation: PASS.**

**Live browser/device acceptance: HOLD** until representative desktop, tablet portrait/landscape, and phone runs verify layout, lesson-depth rendering, assessment generation, storage behavior, and print output.

## Next step

Run a fresh full-course Algebra II Exceptional re-audit. Do not award Exceptional to any category that lacks current source evidence or live acceptance where live acceptance is required.
