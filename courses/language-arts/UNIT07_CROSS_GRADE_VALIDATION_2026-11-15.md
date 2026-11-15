# High School English · Unit 07 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 07 · Weeks 19–21 · English 9, 10, 11 and 12  
**Result:** PASS WITH ONE GRADE 9 SELECTOR REPAIR COMPLETED

## Developmental progression

| Grade | Unit 07 responsibility |
| --- | --- |
| English 9 | Research question → search strategy → credibility/lateral reading → synthesis/citation |
| English 10 | Poetic ambiguity → connotation/mood → sound/structure → comparative interpretation |
| English 11 | Poetry + historical context → cross-tradition comparison → provenance/translation-aware synthesis |
| English 12 | Modern global perspective → displacement/postcolonial context → translation/adaptation/intertextuality |

## Unit identities preserved

### English 9 · Research, Evidence & Media Literacy
- Week 19: Research Questions & Search Strategy
- Week 20: Credibility, Bias & Lateral Reading
- Week 21: Synthesis, Citation & Research Reporting
- Major assessment: annotated bibliography, source audit, and 900–1,200-word research report
- Research literacy explicitly inherits first-semester evidence, qualification, and fairness standards.

### English 10 · Poetry, Ambiguity & Sound
- Week 19: Poetic Speaker, Layers & Ambiguity
- Week 20: Figurative Language, Mood & Connotation
- Week 21: Poetic Structure, Sound & Comparative Analysis
- Major assessment: comparative poetry analysis essay and expressive reading
- Ambiguity is preserved when multiple readings remain defensible from textual evidence.

### English 11 · Poetry Across Periods, Places & Traditions
- Week 19: Poetry and the Issues of Its Time Period
- Week 20: Poetry Across Classical, Medieval, Renaissance, British & Colonial Traditions
- Week 21: Realism, Naturalism, Modernism, and Contemporary Poetry
- Major assessment: comparative poetry notebook, unseen-poem analysis, and contextual interpretation
- Historical period, movement, translation, and tradition labels remain secondary to close reading and source evidence.

### English 12 · Modern & Contemporary World Literature
- Week 19: Modern World Short Fiction & Perspective
- Week 20: Postcolonial, Diasporic & Displacement Narratives
- Week 21: Translation, Adaptation & Intertextuality
- Major assessment: comparative global-literature essay and seminar
- Seniors must distinguish textual evidence from contextual knowledge and explicitly state uncertainty, missing voices, and translation/adaptation limits.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit07-evidence-v1.js`
- English 10 `assets/unit07-evidence-v1.js`
- English 11 `assets/unit07-evidence-v1.js`
- English 12 `assets/unit07-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Grade 9 topology repair

Weeks 19–21 use Grade 9 research-day IDs in the form `day-91` through `day-105`, rather than the earlier `day91` form.

The selector was expanded to recognize `article.lesson[id^="day-"]` while preserving the existing curriculum markup.

Repair commit:
`b16235e97df9eab09cc5823a2f7c83df63075b21`

Post-repair:
- Week 19 research days detected: 5
- Week 20 research days detected: 5
- Week 21 research days detected: 5
- total Grade 9 Unit 07 instructional days covered: 15

## Loader topology

### English 9
Weeks 19–21 each contain one guarded direct Unit 07 loader.

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 07 evidence layer for Weeks 19–21.

Existing learner-record code remains authoritative; Unit 07 additions do not add or alter record-writing paths.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–21. Generic retrieval/exit prompts are suppressed wherever Unit 01–07 specialized layers are active.

## Source and interpretation integrity

### Grade 9 research
- search-result snippets are discovery aids, not source validation;
- bias and reliability are treated as distinct questions;
- lateral reading requires leaving the source to verify authority/claims;
- citation supports attribution and reader traceability;
- synthesis is organized by ideas/source roles rather than source-by-source stacking.

### Grade 10 poetry
- speaker is not automatically poet;
- ambiguity is not treated as vagueness;
- mood claims require language evidence;
- oral reading choices must be justified from sound, syntax, punctuation, or structure.

### Grade 11 contextual poetry
- textual and contextual evidence are kept distinct;
- literary-period labels do not substitute for close reading;
- translation/provenance information limits stronger claims;
- similarity does not prove influence or identical values.

### Grade 12 world literature
- postcolonial, diasporic, refugee, immigrant, Indigenous, and displaced perspectives are not treated as interchangeable;
- contextual knowledge cannot replace textual evidence;
- missing perspectives and uncertainty are surfaced explicitly;
- translator/adaptor choices are separated from what can be known directly about the source text;
- influence/allusion claims require evidence beyond resemblance.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- retrieval remains formative;
- existing quizzes/tests retain authority;
- research reports, comparative essays, unseen-poem analysis, contextual interpretations, seminars, and senior global-literature arguments require preserved student artifacts and evaluator judgment;
- no new storage key or grading authority was added.

## Release decision

**Unit 07 is approved as the seventh propagation family for the English 9–12 evidence architecture.**

Units 01–07 are now aligned and validated. The next recommended phase is Unit 08 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
