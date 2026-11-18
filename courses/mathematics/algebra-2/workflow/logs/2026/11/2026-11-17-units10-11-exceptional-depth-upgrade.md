# Algebra II · Units 10–11 Exceptional-Depth Upgrade

**Date:** 2026-11-17  
**Scope:** Unit 10 Trigonometric Functions & Periodic Models; Unit 11 Trigonometric Identities, Equations & Oblique Triangles  
**Change class:** curriculum depth · differentiated practice · assessment · retrieval · representations · proof/transfer  
**Mastery authority:** unchanged at 80%

## Goal

Advance Units 10–11 to the same Exceptional standard established in Units 01–09. The trig block must demonstrate exact reasoning, multiple representations, domain/range control, proof, periodic retention, modelling, geometric verification, and transfer rather than formula recall alone.

## Implemented

### Metadata-rich depth bank
- Added `assets/algebra2-depth-bank-units10-11-v1.js`.
- Unit 10: 60 questions = 10 lessons × 6.
- Unit 11: 48 questions = 8 lessons × 6.
- Total: 108 new questions.
- Every item includes unit, lesson, instructional week, difficulty/pathway level, reasoning dimension, skill, explanation, and misconception metadata.
- Difficulty is evenly distributed: 36 Foundation-level, 36 Core-level, 36 Extended-level.
- Five reasoning dimensions are represented: procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning.

### Genuine pathway differentiation
- Foundation practice: 12 items.
- Core practice: 16 items.
- Extended practice: 20 items.
- Pathway configs explicitly bind Foundation/Core/Extended selection to the appropriate depth ceiling.

### Mastery and retake depth
- Unit 10 and Unit 11 mastery checks increased from 10 to 20 questions.
- Both use the five-dimension `depthBlueprint`.
- Existing retake behavior continues to prioritize items not used on the immediately prior form.
- 80% remains the progression threshold.

### Long-term retrieval
Created seven non-gating spaced-retrieval forms:
- Unit 10: Weeks 25, 26, 27, 28.
- Unit 11: Weeks 29, 30, 31.
- Each form contains 10 items: 6 current-week + 4 delayed-retrieval items.
- Week 25 returns to Unit 09 / Week 24.
- Week 29 returns to Unit 10 / Week 28.

### Lesson depth and multiple representations
Added `assets/algebra2-exceptional-lesson-depth-units10-11-v1.js` and attached it to all 18 lessons.

Each lesson receives:
- three varied worked examples;
- multiple representations such as unit-circle coordinates, graph transformations, reciprocal structure, data/residual models, vectors, identity chains, labeled triangles, or navigation diagrams;
- a Reason & Prove prompt;
- a Retrieval Bridge reaching into earlier learning.

The depth studio is instructional only and does not write grades, mastery, progression, or learner records.

### Teacher-facing evidence standard
Unit 10 and Unit 11 teacher guides now explicitly define the Exceptional evidence pattern:
- lesson evidence;
- differentiated pathways;
- spaced retrieval;
- 20-question balanced mastery;
- corrections;
- analytic applied investigation;
- retention evidence.

## Source validation

PASS:
- 108 total new depth items.
- Unit counts: 60 / 48.
- Six depth items per lesson across all 18 lessons.
- Difficulty counts: 36 / 36 / 36.
- No invalid answer indexes detected.
- No duplicate depth IDs detected.
- Depth-bank loader recognizes Units 10–11.
- Unit landing pages link Weeks 25–31 retrieval resources.
- All 18 lesson pages attach the Exceptional lesson-depth studio.
- Foundation/Core/Extended configs are 12/16/20 with explicit pathway binding.
- Unit mastery configs are 20 questions with `depthBlueprint:true`.
- Retrieval configs correctly mix 4 delayed + 6 current items.
- Unit projects retain 100-point analytic rubrics.
- Existing strong Unit 11 triangle diagram/verification content was preserved.
- 80% mastery authority and existing learner records were not changed.

## Acceptance state

**Source architecture and curriculum-depth validation: PASS.**

**Live browser/device acceptance: HOLD** until representative desktop, tablet portrait/landscape, and phone runs verify layout, lesson-depth rendering, graph/diagram behavior, assessment generation, storage behavior, and print output.

## Next batch

Finish Algebra II Units 12–13 with the same Exceptional architecture. Then run a full Algebra II Exceptional re-audit before returning to remaining Geometry and Pre-Algebra rubric gaps and re-scoring all four mathematics courses.
