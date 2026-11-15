# High School English · Unit 09 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 09 · Weeks 25–27 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 09 responsibility |
| --- | --- |
| English 9 | Sustained novel reading → whole-text pattern tracking → long-form literary analysis |
| English 10 | Inquiry design → source evaluation → ethical paraphrase/citation → foundational synthesis |
| English 11 | Literary research → source taxonomy → scholarly disagreement → source integration |
| English 12 | Advanced methods/search → literature review → gap/significance → academic draft and peer review |

## Unit identities preserved

### English 9 · The Novel & Sustained Inquiry
- Week 25: Launching a Sustained Fiction Study
- Week 26: Character Arcs, Motifs & Themes
- Week 27: Critical Perspectives & Literary Analysis
- Major assessment: 1,200–1,500-word literary analysis and independent reading conference
- Interpretations are expected to change as later evidence complicates earlier claims.

### English 10 · Research Foundations
- Week 25: Research Questions, Scope & Inquiry Design
- Week 26: Source Reliability, Bias & Lateral Reading
- Week 27: Note-Taking, Paraphrase, Citation & Synthesis
- Major assessment: research proposal, annotated bibliography, source evaluation matrix, and synthesis paragraph
- Reliability, relevance, authority, validity, and bias are evaluated separately rather than collapsed into a single source label.

### English 11 · Literary Research, Source Evaluation & Synthesis
- Week 25: Literary Research Questions and Scope
- Week 26: Primary and Secondary Sources
- Week 27: Synthesis and Source Integration
- Major assessment: research proposal, annotated bibliography, source credibility audit, synthesis matrix, and conference
- Research supports and complicates interpretation but does not replace analysis of the literary text.

### English 12 · Advanced Research & Academic Writing
- Week 25: Advanced Search, Databases & Research Methods
- Week 26: Literature Review & Synthesis of Scholarship
- Week 27: Academic Argument Draft, Citation & Peer Review
- Major assessment: research question, proposal, annotated bibliography, synthesis matrix, literature review, conference, and documented draft
- Search methods, source types, research design, gap claims, citation, and peer review remain explicit and auditable.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit09-evidence-v1.js`
- English 10 `assets/unit09-evidence-v1.js`
- English 11 `assets/unit09-evidence-v1.js`
- English 12 `assets/unit09-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Grade 9 topology validation

Weeks 25–27 use Grade 9 lesson IDs:
- Week 25: `day-121`–`day-125`
- Week 26: `day-126`–`day-130`
- Week 27: `day-131`–`day-135`

The Unit 09 selector already recognizes `article.lesson[id^="day-"]`.

Post-validation:
- Week 25 instructional days detected: 5
- Week 26 instructional days detected: 5
- Week 27 instructional days detected: 5
- total Grade 9 Unit 09 instructional days covered: 15

## Loader topology

### English 9
Weeks 25–27 each contain one guarded direct Unit 09 loader.

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 09 evidence layer for Weeks 25–27.

Existing learner-record code remains authoritative; Unit 09 additions do not add or alter record-writing paths.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–27. Generic retrieval/exit prompts are suppressed wherever Unit 01–09 specialized layers are active.

## Source and authorship integrity

### Grade 9
- sustained reading claims must use evidence across the whole text;
- character/motif/theme claims are revised when later sections complicate them;
- critical lenses are tools for testing interpretations, not labels that predetermine them.

### Grade 10
- research questions include scope and explicit boundaries;
- source quality is evaluated by claim-specific criteria;
- paraphrase must preserve meaning without copying source syntax/structure;
- citation maintains traceability;
- synthesis is organized by ideas rather than source sequence.

### Grade 11
- the primary literary text remains the central interpretive authority;
- primary, secondary, visual, quantitative and multimedia evidence are assigned distinct functions;
- scholarly disagreement is mapped fairly;
- integrated research must not erase student analytical ownership.

### Grade 12
- search method and research design constrain responsible conclusions;
- literature reviews distinguish agreement in findings, methods and interpretation;
- gap claims require evidence from the search/literature record;
- citations are audited for actual sentence-level support;
- peer review is evaluated rather than followed automatically.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- retrieval remains formative;
- existing quizzes/tests retain authority;
- literary analyses, research proposals, source audits, annotated bibliographies, literature reviews, documented drafts, and conferences require preserved student artifacts and evaluator judgment;
- no new storage key or grading authority was added.

## Release decision

**Unit 09 is approved as the ninth propagation family for the English 9–12 evidence architecture.**

Units 01–09 are now aligned and validated. The next recommended phase is Unit 10 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
