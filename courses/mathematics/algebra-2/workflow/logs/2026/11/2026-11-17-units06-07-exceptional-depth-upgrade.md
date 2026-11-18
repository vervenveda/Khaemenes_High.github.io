# Algebra II · Units 06–07 Exceptional-Depth Upgrade

**Date:** 2026-11-17  
**Scope:** Unit 06 Exponential Functions & Growth Models; Unit 07 Logarithmic Functions & Equations  
**Change class:** curriculum depth · differentiated practice · assessment · retrieval · representations · proof/transfer  
**Mastery authority:** unchanged at 80%

## Goal

Advance Units 06–07 to the same Exceptional standard already established in Units 01–05, with no category treated as complete merely because content exists. Depth, representation, reasoning, retention, differentiation, and evidence quality must all be explicit.

## Implemented

### Metadata-rich depth bank
- Added `assets/algebra2-depth-bank-units06-07-v1.js`.
- Unit 06: 42 questions = 7 lessons × 6.
- Unit 07: 42 questions = 7 lessons × 6.
- Total: 84 new questions.
- Every item includes unit, lesson, instructional week, difficulty/pathway level, reasoning dimension, skill, explanation, and misconception metadata.
- Difficulty is evenly distributed: 28 Foundation-level, 28 Core-level, 28 Extended-level.
- Five reasoning dimensions are represented: procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning.

### Genuine pathway differentiation
- Foundation practice: 12 items.
- Core practice: 16 items.
- Extended practice: 20 items.
- Pathway configs explicitly bind Foundation/Core/Extended selection to the appropriate depth ceiling.

### Mastery and retake depth
- Unit 06 and Unit 07 mastery checks increased from 10 to 20 questions.
- Both use the five-dimension `depthBlueprint`.
- Existing retake behavior continues to prioritize items not used on the immediately prior form.
- 80% remains the progression threshold.

### Long-term retrieval
Created six non-gating spaced-retrieval forms:
- Unit 06: Weeks 14, 15, 16.
- Unit 07: Weeks 17, 18, 19.
- Each form contains 10 items: 6 current-week + 4 delayed-retrieval items.
- Week 14 returns to Unit 05 / Week 13.
- Week 17 returns to Unit 06 / Week 16.

### Lesson depth and multiple representations
Added `assets/algebra2-exceptional-lesson-depth-units06-07-v1.js` and attached it to all 14 lessons.

Each lesson receives:
- three varied worked examples;
- multiple representations such as symbolic, table, graph, residual, scale, or contextual models;
- a Reason & Prove prompt;
- a Retrieval Bridge reaching into earlier learning.

The depth studio is instructional only and does not write grades, mastery, progression, or learner records.

### Teacher-facing evidence standard
Unit 06 and Unit 07 teacher guides now explicitly define the Exceptional evidence pattern:
- lesson evidence;
- differentiated pathways;
- spaced retrieval;
- 20-question balanced mastery;
- corrections;
- analytic applied investigation;
- retention evidence.

## Source validation

PASS:
- 84 total new depth items.
- Unit counts: 42 / 42.
- Six depth items per lesson across all 14 lessons.
- Difficulty counts: 28 / 28 / 28.
- No invalid answer indexes detected.
- Depth-bank loader recognizes Units 06–07.
- Unit landing pages link Weeks 14–19 retrieval resources.
- All 14 lesson pages attach the Exceptional lesson-depth studio.
- Foundation/Core/Extended configs are 12/16/20 with explicit pathway binding.
- Unit mastery configs are 20 questions with `depthBlueprint:true`.
- Retrieval configs correctly mix 4 delayed + 6 current items.
- Unit projects retain 100-point analytic rubrics.
- 80% mastery authority and existing learner records were not changed.

## Acceptance state

**Source architecture and curriculum-depth validation: PASS.**

**Live browser/device acceptance: HOLD** until representative desktop, tablet portrait/landscape, and phone runs verify layout, depth-studio rendering, assessment generation, storage behavior, and print output.

## Next batch

Apply the same Exceptional architecture to Algebra II Units 08–09, then continue through Units 10–13. After Algebra II closes, return to the remaining Geometry and Pre-Algebra rubric gaps and re-score all four mathematics courses.
