# High School English · Unit 02 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 02 · Weeks 04–06 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 02 responsibility |
| --- | --- |
| English 9 | Cultural function → pattern → difference → qualified comparison |
| English 10 | Literary elements → character development → conflicting perspectives |
| English 11 | Select lens → evaluate style → compare theme across context |
| English 12 | Set inquiry → test literary relationship → defend transformation claim |

## Unit identities preserved

### English 9 · Myth, Epic & Archetype
- Week 4: Why Humans Make Myths
- Week 5: Epic Heroes & Cultural Values
- Week 6: Comparative Myth Synthesis
- Major assessment: comparative literary analysis with visual archetype map
- Source-custody rule remains explicit for authentic, sacred, oral and living traditions.

### English 10 · Coming-of-Age & Literary Layers
- Week 4: Literary Elements & Layers of Meaning
- Week 5: Characterization, Conflict & Coming-of-Age
- Week 6: Conflicting Perspectives & Point of View
- Focus: interaction among elements, developmental change, and competing viewpoints.

### English 11 · Literary Layers, Style & Universal Themes
- Week 4: Literary Elements: Evaluating Layers of Meaning
- Week 5: Style, Diction, Syntax, and Author Voice
- Week 6: Universal Themes from Different Times and Places
- Focus: strategic lens selection, style as evidence, context-sensitive thematic comparison.

### English 12 · Epic, Tragedy & World Literary Foundations
- Week 4: Epic, Myth, Archetype & Allusion
- Week 5: Tragedy, Character & Moral Choice
- Week 6: Comparative Foundations & Contemporary Adaptation
- Focus: inquiry design, influence/allusion evidence, moral defense, adaptation and transformation.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit02-evidence-v1.js`
- English 10 `assets/unit02-evidence-v1.js`
- English 11 `assets/unit02-evidence-v1.js`
- English 12 `assets/unit02-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- sessionStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

Existing course/daily engines continue to contain their established learner-record logic. Unit 02 wiring added one guarded loader per engine and did not introduce new storage keys or record-writing paths.

## Loader topology

### English 9
- Week 04 → `week04-daily.js`
- Week 05 → `week05-daily.js`
- Week 06 → `week06-daily.js`
Each engine loads the Grade 9 Unit 02 evidence layer once.

### English 10–12
The existing `course.js` in each grade loads the corresponding Unit 02 evidence layer for Weeks 04–06.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–06. Generic retrieval prompts are suppressed where Unit 01 or Unit 02 grade-specific layers exist.

## Typography

Unit 02 inherits the centralized evidence typography guard created during Unit 01 validation:
- minimum instructional/control text: 16px
- eyebrow/category label: 14px Cinzel
- centered section-head title: 33px Cinzel
- minimum interactive touch height: 44px
- bounded prose width
- responsive learning-cycle grid
- reduced-motion and print support

This guard safely outranks older embedded 55px eyebrow and sub-16px week styles when the evidence layer is active.

## Reading custody

Grade 9 Unit 02 contains an explicit authentic-text custody record requiring exact title/tradition, author/editor/translator where relevant, edition or stable source, passage locator, provenance/permission/public-domain basis, and local/offline or approved route.

Grades 10–12 retain the same Academy principle: course-created practice texts are instructional examples, while authentic literary works require proper source identification and should not be conflated with simulated materials.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- formative retrieval remains practice;
- quizzes retain existing thresholds and answer authority;
- comparative writing, interpretation, synthesis and senior defense remain dependent on preserved student evidence and evaluator judgment.

## Release decision

**Unit 02 is approved as the second propagation family for the English 9–12 evidence architecture.**

The recommended next phase is Unit 03 across all four grades, using the same procedure:
1. inventory actual content;
2. preserve grade-specific intellectual goals;
3. build 15-day spaced retrieval maps;
4. wire surgically;
5. validate syntax, duplicate prompts, typography and assessment/storage authority.
