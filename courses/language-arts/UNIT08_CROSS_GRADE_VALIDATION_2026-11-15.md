# High School English · Unit 08 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 08 · Weeks 22–24 · English 9, 10, 11 and 12  
**Result:** PASS

## Developmental progression

| Grade | Unit 08 responsibility |
| --- | --- |
| English 9 | Explanatory structure → technical procedure → data/visual accessibility |
| English 10 | Foundational source texts → respectful religious-literary analysis → adaptation across media |
| English 11 | Comparative poetry → sustained analysis → ethical performance/digital interpretation |
| English 12 | Language/power/identity → visual/digital rhetoric → focused global-issue oral |

## Unit identities preserved

### English 9 · Informational & Technical Communication
- Week 22: Structures of Explanation
- Week 23: Technical Reading & Procedural Writing
- Week 24: Data, Visuals & Accessible Information
- Major assessment: explanatory article, tested procedure, and accessible infographic
- Usability, reproducibility, accuracy, labels, captions, alt text, contrast, reading order, and plain-language access are part of academic quality.

### English 10 · Classical, Mythic & Religious Adaptation
- Week 22: Mythical & Classical Source Texts
- Week 23: Religious Texts as Literature & Adaptation
- Week 24: Adaptation Across Media & Comparative Essay
- Major assessment: comparative adaptation essay or multimedia analysis
- Literary study of sacred/religious texts remains bounded to textual/cultural analysis and does not claim authority over belief, truth, sacred practice, or community identity.

### English 11 · Comparative Poetry, Performance & Digital Interpretation
- Week 22: Comparing Contemporaneous Poets
- Week 23: Poetry Analysis Essay
- Week 24: Poetry Performance and Digital Interpretation
- Major assessment: comparative poetry essay, oral interpretation, and accessible multimedia adaptation
- Provenance/translation notes remain visible; multimedia choices must clarify interpretation rather than decorate it.

### English 12 · Language, Power, Culture & Global Issues
- Week 22: Language, Identity, Dialect & Code-Switching
- Week 23: Visual Rhetoric, Film & Digital Texts
- Week 24: Global Issue Comparative Oral
- Major assessment: comparative oral or multimedia commentary on a focused global issue
- Language varieties are analyzed without deficit ranking; global-issue claims remain narrowly bounded to available literary/nonliterary evidence.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit08-evidence-v1.js`
- English 10 `assets/unit08-evidence-v1.js`
- English 11 `assets/unit08-evidence-v1.js`
- English 12 `assets/unit08-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Grade 9 topology validation

Weeks 22–24 use Grade 9 technical lesson cards with IDs:
- Week 22: `day-106`–`day-110`
- Week 23: `day-111`–`day-115`
- Week 24: `day-116`–`day-120`

The Unit 08 selector already recognizes `article.lesson[id^="day-"]`.

Post-validation:
- Week 22 instructional days detected: 5
- Week 23 instructional days detected: 5
- Week 24 instructional days detected: 5
- total Grade 9 Unit 08 instructional days covered: 15

## Loader topology

### English 9
Weeks 22–24 each contain one guarded direct Unit 08 loader.

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 08 evidence layer for Weeks 22–24.

Existing learner-record code remains authoritative; Unit 08 additions do not add or alter record-writing paths.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–24. Generic retrieval/exit prompts are suppressed wherever Unit 01–08 specialized layers are active.

## Source, representation and accessibility integrity

### Grade 9
- explanatory structure must match communicative purpose;
- procedures must expose hidden assumptions and handle exceptions;
- data displays require accurate titles, labels, scale, units, captions and source notes;
- accessibility is part of correctness.

### Grade 10
- recurring mythic/classical patterns do not prove identical cultural meaning;
- sacred/religious sources are analyzed respectfully within literary scope;
- adaptations are evaluated for transformation, gain/loss and medium-specific choices rather than simple fidelity.

### Grade 11
- contemporaneous comparison preserves individual craft and provenance;
- translation/original-language context limits stronger claims;
- oral/digital interpretations remain anchored in textual evidence;
- captioning, transcripts, contrast, descriptive text and reading order are part of the product standard.

### Grade 12
- dialect/register/code-switching are analyzed functionally, not ranked;
- multimodal analysis separates underlying content from framing/editing/interface effects;
- accessibility choices are rhetorical choices;
- global issues are narrowly defined to prevent stereotyping or universalizing from limited sources.

## Mastery boundary

Across all four grades:
- completion remains workflow;
- retrieval remains formative;
- existing quizzes/tests retain authority;
- technical products, adaptation essays, poetry essays/performances, multimedia products, and global-issue oral work require preserved student artifacts and evaluator judgment;
- no new storage key or grading authority was added.

## Release decision

**Unit 08 is approved as the eighth propagation family for the English 9–12 evidence architecture.**

Units 01–08 are now aligned and validated. The next recommended phase is Unit 09 across all four grades using the same content-first, grade-differentiated, validation-before-promotion procedure.
