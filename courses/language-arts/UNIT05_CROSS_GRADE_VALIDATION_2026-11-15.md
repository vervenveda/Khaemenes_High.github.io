# High School English · Unit 05 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 05 · Weeks 13–15 · English 9, 10, 11 and 12  
**Result:** PASS WITH ONE TOPOLOGY REPAIR COMPLETED

## Developmental progression

| Grade | Unit 05 responsibility |
| --- | --- |
| English 9 | Drama as literature/performance → duty/power/consequence → seminar and staged interpretation |
| English 10 | Opposing arguments → claim/counterclaim/rebuttal → oral argument and debate |
| English 11 | Rhetorical force → multiple arguments on shared evidence → contemporaneous comparative reasoning |
| English 12 | Argument architecture → fallacies/fairness → media verification and quantitative evidence |

## Unit identities preserved

### English 9 · Drama, Choice & Consequence
- Week 13: Reading Drama as Literature and Performance
- Week 14: Duty, Power and Consequence
- Week 15: Seminar and Dramatic Interpretation
- Major assessment: literary analysis, Socratic seminar, and staged interpretation
- Drama is treated as both text and performance; stagecraft choices remain evidence-based.

### English 10 · Argument, Debate & Civic Discourse
- Week 13: Opposing Arguments & Validity
- Week 14: Claim, Evidence, Counterclaim & Rebuttal
- Week 15: Oral Argument, Discussion & Formal Debate
- Major assessment: evidence-based argument essay with oral defense or formal debate
- Fair representation and listening are part of argument quality.

### English 11 · Comparative Argument & Civic Discourse
- Week 13: Rhetorical Devices and Figurative Force
- Week 14: Multiple Arguments on the Same Topic
- Week 15: Contemporaneous Authors and Shared Topics
- Major assessment: source-based argument evaluation, deliberative seminar, and evidence-based civic argument
- Shared evidence, different warrants, framing, counterclaims, and context are explicitly compared.

### English 12 · Argument, Logic, Media & Information Literacy
- Week 13: Argument Architecture: Claims, Evidence & Warrants
- Week 14: Fallacies, Counterargument & Intellectual Fairness
- Week 15: Media Literacy, Misinformation & Quantitative Evidence
- Major assessment: multi-source issue dossier, argument comparison, media-verification lab, deliberative seminar, and formal civic argument
- Seniors must preserve a verifiable reasoning trail from original source to public claim.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit05-evidence-v1.js`
- English 10 `assets/unit05-evidence-v1.js`
- English 11 `assets/unit05-evidence-v1.js`
- English 12 `assets/unit05-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Grade 9 topology repair

Validation identified that Weeks 14–15 use `article.lesson-detail[id^="day"]` rather than the upper-grade `article.lesson-day` structure.

The Grade 9 Unit 05 selector was repaired to match the existing canonical markup instead of rewriting the curriculum pages.

Repair commit:
`173a42ab883c5c8c00a22ef3c610d7c3df78a898`

Post-repair:
- Week 14 daily sections detected: 5
- Week 15 daily sections detected: 5
- Week 13 remains on the standalone daily engine
- total Grade 9 Unit 05 instructional days covered: 15

## Loader topology

### English 9
- Week 13 → `week13-daily.js`
- Week 14 → direct guarded loader on weekly classroom
- Week 15 → direct guarded loader on weekly classroom

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 05 evidence layer for Weeks 13–15.

Existing learner-record logic remains pre-existing course authority; Unit 05 additions do not add or alter record-writing paths.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–15. Generic retrieval/exit prompts are suppressed wherever Unit 01–05 specialized layers are active.

## Typography and accessibility

Unit 05 inherits the centralized Academy evidence typography guard:
- 16px instructional/control floor
- 14px Cinzel eyebrow/category label
- 33px centered Cinzel section-head title
- 44px minimum touch target
- 7px radius
- bounded prose width
- responsive layouts
- reduced-motion and print support

Grade 9 weekly pages continue to support handwriting or typing pathways; no external tool is required for core participation.

## Reading/source integrity

- Grade 9 dramatic interpretation distinguishes textual evidence from staging choice.
- Grade 10 argument comparison requires neutral representation of opposing positions.
- Grade 11 source sets require transparent sourcing and varied perspectives.
- Grade 12 media literacy requires provenance, corroboration, date/context checks, quantitative scrutiny, and clear distinction between source, report, commentary, social amplification, and algorithmic presentation.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- retrieval remains formative;
- existing quizzes/tests retain authority;
- dramatic interpretation, argument writing, debate, deliberative seminar, media-verification dossier, and civic argument require preserved artifacts and evaluator judgment;
- no new storage key or grading authority was added.

## Release decision

**Unit 05 is approved as the fifth propagation family for the English 9–12 evidence architecture.**

Units 01–05 are now aligned and validated. The next recommended phase is Unit 06 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
