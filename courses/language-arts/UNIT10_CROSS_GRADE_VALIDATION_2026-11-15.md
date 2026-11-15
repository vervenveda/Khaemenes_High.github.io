# High School English · Unit 10 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 10 · Weeks 28–30 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 10 responsibility |
| --- | --- |
| English 9 | Fair issue framing → evidence/warrant testing → counterclaim/rebuttal → debate → revised position paper |
| English 10 | Expository research synthesis → nuanced research argument → accessible digital publication → formal presentation |
| English 11 | Research-supported literary analysis → complex exposition → narrative craft → ethical multimodal publication |
| English 12 | Authentic postsecondary narrative → professional/civic communication → accessible multimedia publication → digital citizenship |

## Unit identities preserved

### English 9 · Argument, Debate & Civic Reasoning
- Week 28: Issue Framing & Counterclaims
- Week 29: Evidence, Rebuttal & Ethical Persuasion
- Week 30: Debate & Position Paper
- Major assessment: 1,200–1,600-word position paper and structured debate
- Core rule: a civic position remains revisable when stronger evidence or reasoning appears.

### English 10 · Research Writing & Digital Publication
- Week 28: Expository Research Writing
- Week 29: Argument Research Writing
- Week 30: Digital Publication, Multimedia & Presentation
- Major assessment: research paper, publication-ready digital product, and formal presentation
- Core rule: design may clarify evidence but may not exaggerate or replace evidence.

### English 11 · Research Writing, Narrative Craft & Publication
- Week 28: Literary Analysis with Research
- Week 29: Expository Analysis of Complex Texts
- Week 30: Narrative Perspective, Digital Publication & Presentation
- Major assessment: multi-source research paper, complex narrative, digital presentation, publication checklist, and author reflection
- Core rule: genre and medium may change, but evidence, interpretation, invention, and source ownership remain distinct.

### English 12 · College, Career, Civic & Digital Communication
- Week 28: College, Scholarship & Reflective Narrative
- Week 29: Workplace, Civic & Professional Communication
- Week 30: Accessible Multimedia Publication & Digital Citizenship
- Major assessment: postsecondary communication portfolio with personal statement, résumé, professional correspondence, proposal, and accessible multimedia publication
- Core rule: consequential communication must be defensible in relation to audience, evidence, ethics, accessibility, and intended outcome.

## Evidence layers

New specialized scripts:
- English 9 `assets/unit10-evidence-v1.js`
- English 10 `assets/unit10-evidence-v1.js`
- English 11 `assets/unit10-evidence-v1.js`
- English 12 `assets/unit10-evidence-v1.js`

Each contains 15 retrieval/transfer prompts, one for every instructional day in Weeks 28–30.

Validation:
- JavaScript parse: PASS on all four
- prompt count: 15 on all four
- localStorage references: 0
- network fetch calls: 0
- new assessment/mastery authority: 0

## Loader topology

### English 9
Weeks 28, 29 and 30 each contain exactly one guarded direct Unit 10 loader.

### English 10–12
Each canonical grade `course.js` contains the guarded Unit 10 loader for Weeks 28–30.

The new layer is presentation/instructional only. Existing learner-record, quiz, assessment, and evaluator systems remain authoritative.

## Duplicate-prompt protection

The shared `courses/shared/evidence-based-english-v1.js` specialized-unit boundary now covers Weeks 01–30 for English 9–12.

Result:
- generic retrieval/exit prompts remain available outside specialized units;
- generic prompts are suppressed for Unit 10;
- Unit 10 receives only its grade-specific specialized prompts.

Shared evidence engine JavaScript parse: PASS.

## Visible unit maps

Each Unit 10 overview contains one `#learning-architecture` section showing the grade-specific three-week learning rhythm, developmental responsibility, and Unit 10 integrity rule.

## Mastery boundary

Across all four grades:
- retrieval remains formative;
- completion remains workflow evidence;
- existing quizzes/tests retain objective assessment authority;
- writing, debate, research, publication, presentation and portfolio artifacts require preserved student work and evaluator judgment;
- no new storage key, score writer, mastery switch, or assessment authority was introduced.

## Release decision

**Unit 10 is approved as the tenth propagation family for the English 9–12 evidence architecture.**

Units 01–10 / Weeks 01–30 are now aligned and validated.

The next recommended phase is Unit 11 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
