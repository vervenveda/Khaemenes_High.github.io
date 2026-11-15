# High School English · Unit 11 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 11 · Weeks 31–33 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 11 responsibility |
| --- | --- |
| English 9 | Audience/genre analysis → multimodal prototype → visual/editorial revision → curated publication |
| English 10 | Drama elements/stagecraft → Shakespearean language/rhetoric → interpretive performance and defense |
| English 11 | Advanced drama analysis → oral interpretation/performance → launch of sustained long-form reading |
| English 12 | Independent long-form reading → critical lenses and competing interpretations → seminar leadership and literary defense |

## Unit identities preserved

### English 9 · Creative Media & Publication
- Week 31: Audience, Genre & Multimodal Composition
- Week 32: Editing, Layout & Visual Rhetoric
- Week 33: Publication Studio
- Major assessment: curated literary magazine, digital exhibit, or themed publication with editorial statement
- Integrity rule: publication decisions must be justified by audience need, clarity, accessibility, source responsibility, and testing.

### English 10 · Drama, Shakespeare & Performance
- Week 31: Drama Elements, Conflict, Irony & Stagecraft
- Week 32: Shakespearean Language, Rhetoric & Performance
- Week 33: Drama Analysis & Performance Project
- Major assessment: dramatic analysis and staged or recorded performance with reflection
- Integrity rule: performance is an interpretation of the text; major staging choices remain accountable to textual evidence.

### English 11 · Drama, Performance & Long-Form Reading
- Week 31: Drama Study: Juxtaposition, Rhetoric, and Conflict
- Week 32: Drama Performance and Oral Interpretation
- Week 33: Long-Form Novel Study Launch
- Major assessment: drama analysis/performance and long-form reading dossier with annotations, motif tracking, and conference
- Integrity rule: performance and sustained reading use different methods but both require evidence, provisional interpretation, and revision.

### English 12 · Long-Form Literature, Theory & Independent Seminar
- Week 31: Long-Form Novel or Drama: Independent Reading
- Week 32: Critical Lenses & Competing Interpretations
- Week 33: Independent Seminar & Literary Argument
- Major assessment: long-form reading dossier, independent literary argument, seminar leadership, and oral defense
- Integrity rule: a critical lens is a method for testing interpretation, not a formula; the learner must defend both explanatory power and limits.

## Evidence layers

New specialized scripts:
- English 9 `assets/unit11-evidence-v1.js`
- English 10 `assets/unit11-evidence-v1.js`
- English 11 `assets/unit11-evidence-v1.js`
- English 12 `assets/unit11-evidence-v1.js`

Each contains 15 grade-specific retrieval/transfer prompts covering every instructional day in Weeks 31–33.

Validation:
- JavaScript parse: PASS on all four
- prompt count: 15 on all four
- localStorage references: 0
- network fetch calls: 0
- new assessment/mastery authority: 0

## Loader topology

- English 9 Weeks 31–33 each contain the guarded direct Unit 11 loader.
- English 10–12 canonical `course.js` files contain guarded Unit 11 loaders for Weeks 31–33.
- Existing record, quiz, assessment and evaluator systems remain authoritative.

## Duplicate-prompt protection

The shared evidence engine specialized-unit boundary now covers Weeks 01–33 for English 9–12.

Shared evidence engine JavaScript parse: PASS.

## Visible unit maps

Each Unit 11 overview contains exactly one `#learning-architecture` section showing its grade-specific learning rhythm and integrity rule.

## Typography/accessibility repair

The forensic pass found a shared presentation regression on English 10–12 Weeks 31–33:
- body text forced to 14 px;
- eyebrow/kicker text forced to 55 px.

All nine affected Unit 11 weekly pages were normalized to the Academy presentation standard:
- body/control floor: 16 px;
- eyebrow/kicker: 14 px;
- H1: 33 px;
- H2: 24 px;
- print body: 16 px.

English 9 Weeks 31–33 were already compliant.

## Mastery boundary

Across all four grades:
- retrieval remains formative;
- completion remains workflow evidence;
- existing quizzes/tests retain objective assessment authority;
- publication, performance, long-form reading, seminar, writing and oral-defense artifacts require preserved student work and evaluator judgment;
- no new storage key, score writer, mastery switch, or assessment authority was introduced.

## Release decision

**Unit 11 is approved as the eleventh propagation family for the English 9–12 evidence architecture.**

Units 01–11 / Weeks 01–33 are now aligned and validated.

The remaining frontier is Unit 12 / Weeks 34–36 across all four grades.
