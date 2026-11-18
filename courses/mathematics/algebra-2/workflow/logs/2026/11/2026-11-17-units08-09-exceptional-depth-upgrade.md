# Algebra II · Units 08–09 Exceptional-Depth Upgrade

**Date:** 2026-11-17  
**Scope:** Unit 08 Nonlinear Systems & Matrices; Unit 09 Sequences, Series & the Binomial Theorem  
**Change class:** curriculum depth · differentiated practice · assessment · retrieval · representations · proof/transfer  
**Mastery authority:** unchanged at 80%

## Goal

Advance Units 08–09 to the same Exceptional standard established in Units 01–07. Content presence alone is not sufficient; the units must demonstrate depth, representation, reasoning, retention, differentiation, verification, and evidence quality.

## Implemented

### Metadata-rich depth bank
- Added `assets/algebra2-depth-bank-units08-09-v1.js`.
- Unit 08: 36 questions = 6 lessons × 6.
- Unit 09: 42 questions = 7 lessons × 6.
- Total: 78 new questions.
- Every item includes unit, lesson, instructional week, difficulty/pathway level, reasoning dimension, skill, explanation, and misconception metadata.
- Difficulty is evenly distributed: 26 Foundation-level, 26 Core-level, 26 Extended-level.
- Five reasoning dimensions are represented: procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning.

### Genuine pathway differentiation
- Foundation practice: 12 items.
- Core practice: 16 items.
- Extended practice: 20 items.
- Pathway configs explicitly bind Foundation/Core/Extended selection to the appropriate depth ceiling.

### Mastery and retake depth
- Unit 08 and Unit 09 mastery checks increased from 10 to 20 questions.
- Both use the five-dimension `depthBlueprint`.
- Existing retake behavior continues to prioritize items not used on the immediately prior form.
- 80% remains the progression threshold.

### Long-term retrieval
Created five non-gating spaced-retrieval forms:
- Unit 08: Weeks 20 and 21.
- Unit 09: Weeks 22, 23, and 24.
- Each form contains 10 items: 6 current-week + 4 delayed-retrieval items.
- Week 20 returns to Unit 07 / Week 19.
- Week 22 returns to Unit 08 / Week 21.

### Lesson depth and multiple representations
Added `assets/algebra2-exceptional-lesson-depth-units08-09-v1.js` and attached it to all 13 lessons.

Each lesson receives:
- three varied worked examples;
- multiple representations such as graph, algebra, table, matrix, difference table, partial sums, or contextual models;
- a Reason & Prove prompt;
- a Retrieval Bridge reaching into earlier learning.

The depth studio is instructional only and does not write grades, mastery, progression, or learner records.

### Teacher-facing evidence standard
Unit 08 and Unit 09 teacher guides now explicitly define the Exceptional evidence pattern:
- lesson evidence;
- differentiated pathways;
- spaced retrieval;
- 20-question balanced mastery;
- corrections;
- analytic applied investigation;
- retention evidence.

## Source validation

PASS:
- 78 total new depth items.
- Unit counts: 36 / 42.
- Six depth items per lesson across all 13 lessons.
- Difficulty counts: 26 / 26 / 26.
- No invalid answer indexes detected.
- Depth-bank loader recognizes Units 08–09.
- Unit landing pages link Weeks 20–24 retrieval resources.
- All 13 lesson pages attach the Exceptional lesson-depth studio.
- Foundation/Core/Extended configs are 12/16/20 with explicit pathway binding.
- Unit mastery configs are 20 questions with `depthBlueprint:true`.
- Retrieval configs correctly mix 4 delayed + 6 current items.
- Unit projects retain 100-point analytic rubrics.
- 80% mastery authority and existing learner records were not changed.

## Acceptance state

**Source architecture and curriculum-depth validation: PASS.**

**Live browser/device acceptance: HOLD** until representative desktop, tablet portrait/landscape, and phone runs verify layout, lesson-depth rendering, assessment generation, storage behavior, and print output.

## Next batch

Apply the same Exceptional architecture to Algebra II Units 10–11, then finish Units 12–13. After Algebra II closes, return to remaining Geometry and Pre-Algebra rubric gaps and re-score all four mathematics courses.
