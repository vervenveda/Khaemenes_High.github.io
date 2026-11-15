# High School English · Unit 12 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 12 · Weeks 34–36 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 12 responsibility |
| --- | --- |
| English 9 | Curate evidence of growth → synthesis capstone → cumulative corrections → oral defense → readiness for English 10 |
| English 10 | Complete sustained novel study → portfolio conference → cumulative corrections → transition to English III |
| English 11 | Complete global/long-form synthesis → prove scaffold fading and independence → student-led defense → senior-readiness plan |
| English 12 | Produce authentic senior contribution → graduation portfolio/oral defense → cumulative corrections → postsecondary literacy transfer |

## Unit identities preserved

### English 9 · Capstone Portfolio & Oral Defense
- Week 34: Portfolio Curation & Reflection
- Week 35: Capstone Synthesis Project
- Week 36: Cumulative Examination & Oral Defense
- Major evidence: portfolio, synthesis capstone, cumulative final examination, and oral defense
- Integrity rule: completion is not the capstone claim; growth, transfer, correction, and readiness must be shown through preserved evidence.

### English 10 · Novel Study, Final Portfolio & Examination
- Week 34: Long-Form Novel Study: Character, Motif & Structure
- Week 35: Novel Themes, Perspectives & Final Portfolio Conference
- Week 36: Final Review, Final Examination & Completion
- Major evidence: novel analysis, student-led portfolio conference, cumulative final examination, and completion record
- Integrity rule: English III readiness requires whole-text analysis, representative portfolio evidence, independent strategy use, and explicit correction of misunderstandings.

### English 11 · Global Synthesis, Portfolio & Final Examination
- Week 34: Novel Themes, Motifs, and Author Choices
- Week 35: Final Portfolio and Student-Led Conference
- Week 36: Final Review and Final Test
- Major evidence: long-form comparative analysis, final portfolio, student-led conference, cumulative final, corrections, and readiness plan
- Integrity rule: senior readiness is demonstrated by independent judgment, synthesis, revision, and transfer—not a final score alone.

### English 12 · Capstone Inquiry, Graduation Portfolio & Final
- Week 34: Senior Capstone: Inquiry, Creation & Contribution
- Week 35: Graduation Portfolio & Oral Defense
- Week 36: Cumulative Final & Postsecondary Literacy Plan
- Major evidence: senior capstone, graduation portfolio, oral defense, cumulative final, corrections, and postsecondary literacy plan
- Integrity rule: graduation-level mastery requires independent transfer, transparent method and limitations, ethical authorship, and a defensible postsecondary plan.

## Evidence layers

New specialized scripts:
- English 9 `assets/unit12-evidence-v1.js`
- English 10 `assets/unit12-evidence-v1.js`
- English 11 `assets/unit12-evidence-v1.js`
- English 12 `assets/unit12-evidence-v1.js`

Each contains 15 grade-specific retrieval/transfer prompts covering all instructional days in Weeks 34–36.

Validation:
- JavaScript parse: PASS on all four
- prompt count: 15 on all four
- localStorage references: 0
- network fetch calls: 0
- score/storage/mastery mutation code: 0

A broad keyword scan sees the instructional word “mastery” in some student-facing prompt text. This is prose only; there is no score writer, storage mutation, assessment submission, project-score mutation, or mastery switch in the Unit 12 evidence scripts.

## Loader topology

- English 9 Weeks 34–36 contain guarded direct Unit 12 loaders.
- English 10–12 canonical `course.js` files contain guarded Unit 12 loaders for Weeks 34–36.
- Existing learner records, weekly quizzes, unit assessments, cumulative exams, portfolio review and evaluator systems remain authoritative.

## Duplicate-prompt protection

The shared `courses/shared/evidence-based-english-v1.js` specialized-unit boundary now covers Weeks 01–36 for English 9–12.

Shared evidence engine JavaScript parse: PASS.

## Visible unit maps

Each Unit 12 overview contains exactly one `#learning-architecture` section with a grade-specific capstone learning rhythm and integrity rule.

## Typography/accessibility repair

The forensic pass found the same inherited presentation regression on English 10–12 Weeks 34–36 that appeared in Unit 11:
- body text forced to 14 px;
- eyebrow/kicker text forced to 55 px.

All nine affected Unit 12 weekly pages were normalized to:
- body/control floor: 16 px;
- eyebrow/kicker: 14 px;
- H1: 33 px;
- H2: 24 px;
- print body: 16 px.

English 9 Weeks 34–36 were already compliant.

## Mastery boundary

Across all four grades:
- retrieval remains formative;
- workflow completion is not academic mastery;
- existing quizzes/tests/finals retain objective assessment authority;
- portfolio, capstone, performance, conference, oral defense, research, long-form analysis and readiness claims require preserved student work and evaluator judgment;
- no new storage key, score writer, mastery switch, or assessment authority was introduced.

## Release decision

**Unit 12 is approved as the twelfth and final propagation family for the English 9–12 evidence architecture.**

Units 01–12 / Weeks 01–36 are now aligned and validated across all four high-school English grades.
