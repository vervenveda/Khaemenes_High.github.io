# High School English · Unit 04 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 04 · Weeks 10–12 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 04 responsibility |
| --- | --- |
| English 9 | Poetry evidence → sound/form → translation and performance |
| English 10 | Central ideas/structure → rhetorical situation → formal rhetorical analysis |
| English 11 | Context/tradition → structure/features → evaluative rhetoric and ethical appeals |
| English 12 | Rhetorical criteria → cross-text analysis → accountable civic advocacy |

## Unit identities preserved

### English 9 · Poetry, Voice & Form
- Week 10: Image, Diction & Figurative Language
- Week 11: Sound, Rhythm & Form
- Week 12: Comparison, Translation & Performance
- Major assessment: four-poem portfolio, comparative analysis, and formal oral reading
- Performance and translation choices must be defended from textual evidence.

### English 10 · American Speeches, Essays & Rhetoric
- Week 10: Historical American Speeches: Central Ideas & Structure
- Week 11: Purpose, Audience, Rhetorical Situation & Appeals
- Week 12: Rhetorical Devices, Figurative Language & Analysis Essay
- Major assessment: rhetorical analysis essay on a historical American speech or essay
- Structural and situational analysis feed the final essay rather than becoming isolated terminology exercises.

### English 11 · Classical Rhetoric, Structure & Persuasion
- Week 10: Classical Period Speeches and Essays: Context
- Week 11: Evaluating Text Structures and Features
- Week 12: Rhetorical Appeals: Logos, Ethos, Pathos, Kairos
- Major assessment: rhetorical situation dossier and timed analysis
- Comparative rhetorical traditions remain context-sensitive; students evaluate appeals and ethics rather than merely identify them.

### English 12 · Rhetoric, Public Discourse & Ethical Persuasion
- Week 10: Rhetorical Situation, Purpose & Ethical Appeals
- Week 11: Rhetorical Analysis Across Speeches & Essays
- Week 12: Public Speaking, Debate & Civic Discourse
- Major assessment: rhetorical analysis, public-address performance, and annotated evaluation
- Seniors separate effectiveness from ethical quality and defend evidence standards in public advocacy.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit04-evidence-v1.js`
- English 10 `assets/unit04-evidence-v1.js`
- English 11 `assets/unit04-evidence-v1.js`
- English 12 `assets/unit04-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Loader topology

### English 9
- Week 10 → `week10-daily.js`
- Week 11 → `week11-daily.js`
- Week 12 → `week12-daily.js`

Each week engine contains one guarded Unit 04 loader.

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 04 evidence layer for Weeks 10–12.

Existing local learner-record logic remains pre-existing course authority; Unit 04 additions are loader-only.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–12. Generic retrieval/exit prompts are suppressed wherever Unit 01–04 specialized layers are active.

## Typography and accessibility

Unit 04 inherits the centralized Academy evidence typography guard:
- 16px instructional/control floor
- 14px Cinzel eyebrow/category label
- 33px centered Cinzel section-head title
- 44px minimum touch target
- 7px radius
- bounded prose width
- responsive grids
- reduced-motion and print support

Grade 9 performance work additionally preserves accessible oral-performance pathways; performance interpretation should remain evidence-based rather than confidence-based.

## Reading/source integrity

- Grade 9 translation claims remain bounded by the supplied translation evidence.
- Grade 10 historical American rhetoric requires stable/authentic source identification.
- Grade 11 comparative rhetorical traditions must not be flattened into a single classical model.
- Grade 12 public discourse requires transparent evidence and fair representation of opposing views.

Course-created practice texts remain instructional examples and do not substitute for authentic-source custody where authentic works are assigned.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- retrieval remains formative;
- existing quizzes/tests retain authority;
- poetry performance, rhetorical analysis, timed analysis and civic speaking require preserved artifacts and evaluator judgment;
- no new storage key or grading authority was added.

## Release decision

**Unit 04 is approved as the fourth propagation family for the English 9–12 evidence architecture.**

Units 01–04 are now aligned and validated. The next recommended phase is Unit 05 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
