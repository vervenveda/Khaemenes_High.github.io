# High School English · Unit 03 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 03 · Weeks 07–09 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 03 responsibility |
| --- | --- |
| English 9 | Analyze fiction → control point of view/structure → transfer analysis into original narrative craft |
| English 10 | Compare theme → analyze diction/syntax/voice → build and revise formal literary analysis |
| English 11 | Select lens → evaluate juxtaposition/figurative mood → argue, revise and orally defend |
| English 12 | Set poetic inquiry → choose close-reading method → preserve ambiguity → contextualize and audit |

## Unit identities preserved

### English 9 · Short Fiction & Narrative Craft
- Week 7: Character, Conflict & Setting
- Week 8: Point of View, Structure & Irony
- Week 9: Narrative Workshop
- Major assessment: polished short story with craft commentary and peer-review record
- Analytical skills from Weeks 7–8 are deliberately transferred into Week 9 craft decisions.

### English 10 · Theme, Voice & Literary Analysis
- Week 7: Universal Themes Across Texts
- Week 8: Diction, Syntax, Voice & Tone
- Week 9: Literary Analysis Essay & Revision
- Major assessment: multi-paragraph literary analysis essay and revision memo
- Theme and style observations become evidence inside formal argument.

### English 11 · Perspective, Juxtaposition & Literary Argument
- Week 7: Juxtaposition and Character Perspective
- Week 8: Mood Through Figurative Language
- Week 9: Literary Analysis, Revision & Portfolio
- Major assessment: publication-ready literary analysis essay, oral defense, revision memo and unit portfolio
- Learners choose the analytical lens and defend why it fits.

### English 12 · Poetry, Voice, Form & Advanced Interpretation
- Week 7: Poetic Speaker, Situation & Form
- Week 8: Figurative Language, Sound, Ambiguity & Image
- Week 9: Major Poets in Historical Context
- Major assessment: unseen-poem analysis, comparative poetry essay, recitation/performance and contextual commentary
- Senior prompts explicitly separate speaker from poet, context from textual evidence, and ambiguity from unsupported speculation.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit03-evidence-v1.js`
- English 10 `assets/unit03-evidence-v1.js`
- English 11 `assets/unit03-evidence-v1.js`
- English 12 `assets/unit03-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Loader topology

### English 9
- Week 07 → `week07-daily.js`
- Week 08 → `week08-daily.js`
- Week 09 → `week09-daily.js`

Each week engine contains one guarded Unit 03 loader.

### English 10–12
The existing grade `course.js` loads the corresponding Unit 03 evidence layer for Weeks 07–09.

Existing learner-record code inside these engines remains unchanged in authority; the Unit 03 additions are loaders only.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–09. Generic retrieval/exit prompts are suppressed wherever Unit 01, Unit 02 or Unit 03 specialized layers exist.

## Typography

Unit 03 inherits the centralized Academy evidence typography guard:
- 16px instructional/control floor
- 14px Cinzel eyebrow/category label
- 33px centered Cinzel section-head title
- 44px minimum touch target
- 7px radius
- bounded reading width
- responsive grids
- reduced-motion and print support

## Reading/source integrity

Reading dossiers remain the source-custody companions. Course-created fiction/poetry examples remain instructional texts rather than substitutes for authentic published works. Translation, historical context and biographical claims in senior poetry work remain bounded by available source evidence.

## Mastery boundary

Across all grades:
- completion remains workflow;
- retrieval remains formative practice;
- existing quiz/test gates remain authoritative;
- narrative craft, literary analysis, oral defense and senior poetry interpretation require preserved student work and evaluator judgment;
- no new learner-storage or assessment authority was added.

## Release decision

**Unit 03 is approved as the third propagation family for the English 9–12 evidence architecture.**

Units 01–03 are now aligned and validated. The next recommended phase is Unit 04 across all four grades, using the same content-first, grade-differentiated, validation-before-promotion method.
