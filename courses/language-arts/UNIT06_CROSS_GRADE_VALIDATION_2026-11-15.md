# High School English · Unit 06 Cross-Grade Validation
## English 9–12 · Evidence-Based Architecture v1

**Validation date:** 2026-11-15  
**Scope:** Unit 06 · Weeks 16–18 · English 9, 10, 11 and 12  
**Result:** PASS WITH ONE GRADE 9 SELECTOR REPAIR COMPLETED

## Developmental progression

| Grade | Unit 06 responsibility |
| --- | --- |
| English 9 | Rhetorical situation → reasoning/evidence → speech writing and delivery |
| English 10 | Multi-source synthesis → portfolio revision → midterm diagnosis and correction |
| English 11 | Rhetorical analysis → oral seminar → cumulative method selection and midyear defense |
| English 12 | Cross-text synthesis → research design → midterm transfer and senior midyear defense |

## Unit identities preserved

### English 9 · Rhetoric & Public Voice
- Week 16: The Rhetorical Situation
- Week 17: Reasoning, Evidence and Fallacies
- Week 18: Speech Writing and Delivery
- Major assessment: four-to-six-minute evidence-based speech with rhetorical analysis
- Unit 06 intentionally retrieves earlier reading, argument, and performance habits into public voice.

### English 10 · Synthesis & Midyear Mastery
- Week 16: Expository Synthesis Across Sources
- Week 17: Grammar, Style, Vocabulary & Writing Portfolio
- Week 18: Midterm Review, Assessment & Reflection
- Major assessment: source synthesis project, writing portfolio conference, and cumulative midterm
- Review begins with retrieval and interleaving before rereading.

### English 11 · Rhetorical Composition & Midyear Mastery
- Week 16: Rhetorical Analysis Essay Workshop
- Week 17: Oral Rhetoric and Seminar
- Week 18: Midterm Review and Midterm Test
- Major assessment: rhetorical analysis essay, oral presentation, cumulative midterm, corrections, and midyear conference
- Students must select methods for unfamiliar problems rather than rely on blocked review.

### English 12 · Synthesis, Research Design & Midyear Mastery
- Week 16: Source-Based Synthesis & Cross-Text Reasoning
- Week 17: Research Question, Scope & Annotated Bibliography
- Week 18: Midterm Examination & Midyear Conference
- Major assessment: source-based synthesis essay, research prospectus, cumulative midterm, corrections analysis, and midyear conference
- Senior work preserves source authority, tension, research feasibility, ethics, and auditable evidence trails.

## Runtime/source validation

New specialized evidence scripts:
- English 9 `assets/unit06-evidence-v1.js`
- English 10 `assets/unit06-evidence-v1.js`
- English 11 `assets/unit06-evidence-v1.js`
- English 12 `assets/unit06-evidence-v1.js`

All four:
- JavaScript parse: PASS
- localStorage references: 0
- network fetch calls: 0
- assessment-write logic: 0
- new mastery authority: 0

## Grade 9 topology repair

Weeks 16–18 use `article.lesson[id^="day"]` containers rather than the other Grade 9/upper-grade lesson class families.

The Grade 9 Unit 06 selector was expanded to recognize the existing canonical lesson markup rather than changing curriculum structure.

Repair commit:
`14a780400861a8667d46f225f535f0222752ef37`

Post-repair:
- Week 16 daily sections detected: 5
- Week 17 daily sections detected: 5
- Week 18 daily sections detected: 5
- total Grade 9 Unit 06 instructional days covered: 15

## Loader topology

### English 9
Weeks 16–18 each contain one direct guarded Unit 06 loader.

### English 10–12
The canonical grade `course.js` loads the corresponding Unit 06 evidence layer for Weeks 16–18.

Existing learner-record and assessment code remains authoritative; Unit 06 additions do not create new record-writing paths.

## Duplicate-prompt protection

The shared evidence engine now recognizes specialized English 9–12 Weeks 01–18. Generic retrieval/exit prompts are suppressed wherever Unit 01–06 specialized layers are active.

## Midyear assessment boundary

The Unit 06 evidence architecture supports preparation, retrieval, correction and reflection but does not:
- alter midterm question banks;
- alter answer keys;
- alter score thresholds;
- award midterm mastery;
- replace portfolio or conference evidence;
- change correction records.

Midterm and evaluator authorities remain with the existing assessment/record systems.

## Typography and accessibility

Unit 06 inherits the centralized Academy evidence typography guard:
- 16px instructional/control floor
- 14px Cinzel eyebrow/category label
- 33px centered Cinzel section-head title
- 44px minimum touch target
- 7px radius
- bounded prose width
- responsive layouts
- reduced-motion and print support

Grade 9 continues to support handwriting or typing without requiring external tools for core participation.

## Release decision

**Unit 06 is approved as the sixth propagation family for the English 9–12 evidence architecture.**

Units 01–06 are now aligned and validated, completing the first-semester Unit 01–06 evidence architecture. The next recommended phase is Unit 07 across all four grades, beginning the second-semester sequence with the same content-first, grade-differentiated, validation-before-promotion method.
