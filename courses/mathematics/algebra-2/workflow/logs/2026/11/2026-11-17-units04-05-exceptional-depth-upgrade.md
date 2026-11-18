# Algebra II · Units 04–05 Exceptional-Depth Upgrade

**Date:** 2026-11-17  
**Scope:** Unit 04 Rational Expressions, Equations & Functions; Unit 05 Radical Functions & Rational Exponents  
**Change class:** curriculum depth · differentiated practice · assessment · retrieval · representation · reasoning  
**Mastery authority:** unchanged at 80%

## Goal

Advance Algebra II from broad curricular completeness to an Exceptional standard in the categories previously identified as below target: conceptual depth, procedural fluency, reasoning/proof, multiple representations, pathway differentiation, practice quantity, assessment/retake depth, and long-term retrieval.

## Implemented

### Metadata-rich depth bank
- Added `assets/algebra2-depth-bank-units04-05-v1.js`.
- Unit 04: 48 questions = 8 lessons × 6.
- Unit 05: 36 questions = 6 lessons × 6.
- Total: 84 new questions.
- Every item carries unit, lesson, instructional week, difficulty/pathway level, reasoning dimension, skill, explanation, and misconception metadata.
- Difficulty distribution is even: 28 Foundation-level, 28 Core-level, 28 Extended-level.
- Five assessment dimensions are represented: procedural fluency, multi-step application, representation/interpretation, error analysis, and transfer reasoning.

### Genuine pathway differentiation
- Foundation forms increased to 12 items and are restricted to Foundation-accessible depth.
- Core forms increased to 16 items and include Foundation + Core depth.
- Extended forms increased to 20 items and include the full depth range.
- Pathway language now explicitly distinguishes scaffolded access, complete unit mastery, and proof/parameter/modelling transfer.

### Mastery and retake depth
- Unit 04 and Unit 05 mastery forms increased from 10 to 20 questions.
- Both use the five-dimension depth blueprint.
- Existing engine behavior that prioritizes unseen questions on the immediately prior retake remains active.
- Existing 80% progression threshold is preserved.

### Long-term retrieval
Created non-gating spaced-retrieval forms:
- Unit 04: Weeks 09, 10, 11.
- Unit 05: Weeks 12, 13.
- Each form contains 10 items: 6 current-week + 4 delayed-retrieval items.
- Week 09 deliberately reaches back to Unit 03 / Week 08.
- Week 12 deliberately reaches back to Unit 04 / Week 11.

### Lesson depth and multiple representations
Added `assets/algebra2-exceptional-lesson-depth-v1.js` and attached it to all 14 Unit 04–05 lessons.

Each lesson now receives an instructional-only depth studio with:
- three varied worked examples;
- symbolic/structural, tabular/quantitative, and graphical/contextual representations;
- a Reason & Prove prompt requiring justification or counterexample;
- a Retrieval Bridge that deliberately returns to prior learning.

The depth studio does not write grades, mastery, progression, or learner records.

### Teacher-facing evidence standard
Unit 04 and Unit 05 teacher guides now explicitly define the Exceptional evidence pattern:
- lesson evidence;
- differentiated pathway work;
- spaced retrieval;
- 20-question balanced mastery;
- corrections;
- analytic applied investigation;
- retention evidence.

## Source validation

PASS:
- 84 total new depth items.
- Unit counts: 48 / 36.
- Six items per lesson across all 14 lessons.
- Difficulty counts: 28 / 28 / 28.
- No invalid answer indexes detected.
- Depth-bank loader recognizes Units 04–05.
- Unit landing pages link all five retrieval forms.
- Representative Unit 04 and Unit 05 lessons load the Exceptional lesson-depth studio.
- Foundation/Core/Extended configs are 12/16/20 with explicit pathway binding.
- Unit mastery configs are 20 questions with `depthBlueprint:true`.
- Retrieval configs correctly mix 4 delayed + 6 current items.
- Project pages retain 100-point analytic rubrics.
- 80% mastery threshold and progression authority were not changed.

## Acceptance state

**Source architecture and curriculum-depth validation: PASS.**

**Live browser/device acceptance: HOLD** until representative desktop, tablet landscape/portrait, and phone runs verify layout, interaction, depth-studio rendering, randomized assessment generation, storage behavior, and print output.

## Next batch

Apply the same Exceptional architecture to Algebra II Units 06–07, then continue systematically through Units 08–13. After Algebra II closes, return to the remaining Geometry and Pre-Algebra rubric gaps and re-score all four courses.
