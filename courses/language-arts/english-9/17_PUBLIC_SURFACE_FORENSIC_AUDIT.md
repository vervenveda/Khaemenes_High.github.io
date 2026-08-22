# English 9 Public-Surface Forensic Audit

Branch: `audit/language-arts-a-plus-plus-plus`

Status: ACTIVE — course-wide regression and hardening pass.

## Scope

Audit every learner-facing English 9 surface, including the English I landing and portal, Grade 9 route, 12 unit pages, 36 weekly lessons / 180 daily blocks, assessment center, diagnostic, midterm, final, portfolio, five rubrics, learner-facing records, and shared course CSS/JS.

The public-surface rule is strict: learner-facing pages may expose approved educational destinations and learning purpose, but not credentials, tokens, private endpoints, protected routes, internal repositories, infrastructure/service topology, administrative maps, storage/orchestration details, or answer keys intended to remain protected.

## Audit dimensions

1. Academic alignment and Grade 9 rigor
2. Accuracy and internal consistency
3. 80% mastery integrity
4. Corrective learning / reassessment behavior
5. Eiren mentor continuity and assessment boundary
6. Beta Program continuity
7. Tool/app/game relevance rather than decorative linking
8. Student authorship and source provenance
9. Assessment validity and answer-key exposure
10. Accessibility: structure, keyboard, focus, contrast, print, alternate response modes, captions/transcripts where applicable
11. Navigation and canonical route integrity
12. Local-first persistence behavior
13. Broken or stale public links
14. Duplicate/stale legacy content
15. Public information leakage / network mapping
16. Portfolio and grade-record continuity
17. Rubric validity and scoring specificity
18. Progression from Academy → High School → Grade 9 → Language Arts → English I → Unit → Week → Assessment → mastery → next unit

## Public inventory identified

- Core course: `landing.html`, `index.html`, `grades/grade-09/index.html`
- Units: `units/unit-01/index.html` through `units/unit-12/index.html`
- Weekly lessons: `weeks/week-01/index.html` through `weeks/week-36/index.html`
- Assessments: `assessments/index.html`, diagnostic, midterm, final
- Portfolio: `portfolio/index.html`
- Rubrics: literary analysis, narrative, argument, research, speaking/listening
- Records: index, annual calendar, attendance log, reading log, gradebook, completion certificate

## Findings and remediation state

### CRITICAL 01 — Public answer-key exposure — REMEDIATED BY ASSESSMENT-MODEL CHANGE

Original issue: diagnostic, midterm, and final contained public JavaScript answer keys.

Remediation:
- diagnostic is now explicitly a released formative self-scored form; its open key is intentional and cannot satisfy mastery
- midterm public page no longer contains an active answer key or auto-score
- final public page no longer contains an active answer key or auto-score
- midterm and final are explicitly labeled released forms
- live cumulative mastery must use fresh or meaningfully changed unfamiliar material plus human-reviewed evidence
- historical public keys remain recoverable in Git history, so the exact old forms are permanently considered released

### CRITICAL 02 — Mastery history was not preserved — PARTIALLY REMEDIATED

Completed:
- first score preserved
- latest score preserved
- best score preserved
- attempt count preserved
- mastered-at timestamp preserved
- lower later score no longer erases prior mastery
- legacy records normalized
- prerequisite logic consumes preserved best mastery

Documented limitation: browser/localStorage mastery remains a local record, not tamper-resistant institutional verification.

### HIGH 03 — No dedicated weekly quiz / canonical unit-test implementation — ARCHITECTURE REMEDIATED; PAGE INTEGRATION PENDING

Original issue: the 36-week course repeatedly referenced scored checks at ≥80%, but no canonical unit evidence contract identified what actually satisfied each gate.

Remediation completed:
- created `18_UNIT_MASTERY_ASSESSMENT_MAP.md`
- created machine-readable `assets/unit-mastery-map.json`
- all 12 units now have defined authoritative evidence sets
- each unit has explicit suggested weights totaling 100%
- authentic writing, research, speaking, publication, and oral-defense evidence remain central where appropriate
- weekly checks are now classified conceptually as practice, teacher-reviewed checkpoint, transfer check, or evidence record
- unit reassessment rules preserve targeted correction and fresh/meaningfully changed evidence
- Eiren/Beta/tool/game boundaries are explicit

Pending:
- integrate these evidence contracts visibly into all 12 unit landing pages
- label every weekly scored check by its actual assessment class
- replace generic/manual “verified score” language with component-aware local records where practical
- determine whether any dedicated objective quiz pages are educationally useful after authentic performance evidence is accounted for

### HIGH 04 — Generic public rubrics — REMEDIATED

All five rubrics were rebuilt with criterion-specific observable 4/3/2/1 descriptors. Each is a 20-point instrument; 16/20 corresponds to 80% when that rubric is designated as authoritative evidence. Safeguards now prevent political agreement, charisma, accent, disability, visual polish, or source quantity from substituting for the target competency.

### HIGH 05 — Grade 9 route/canonical defects — REMEDIATED

Repaired canonical path, relative assets/scripts, Course Portal/Eiren/Beta continuity, portfolio/assessment links, and explicit 80% corrective-learning contract.

### HIGH 06 — Public shell normalization incomplete — OPEN

A number of later unit/week/record pages still use older header/footer patterns rather than the standardized `Course Portal · Eiren · Beta` shell. This is a continuity defect, not a pedagogy defect.

### HIGH 07 — Portfolio stale route / completion terminology — REMEDIATED

Normalized PROSE route, replaced “Mark Portfolio Complete” with evidence-readiness language, separated readiness from final mastery, and strengthened Eiren/Beta/authenticity/growth-claim language.

### HIGH 08 — Objective section could be mistaken for full mastery — REMEDIATED ON PUBLIC ASSESSMENT FORMS

- diagnostic labels objective result as formative signal only
- midterm public page reports response completion only, not a score
- final public page reports response completion only, not a score
- midterm/final writing require human review
- public forms explicitly state that cumulative mastery requires fresh transfer and required performance evidence

### HIGH 09 — Midterm/final cumulative coverage too narrow — REMEDIATED FOR RELEASED FORMS

Midterm now samples unfamiliar informational/rhetorical and literary material plus synthesis/language work and a cross-text analytical essay.

Final now samples unfamiliar informational and literary passages, research/source judgment, argument/counterclaim, language, evidence/inference, synthesis, and a cumulative research-supported argument. It explicitly states that final course mastery also requires portfolio, oral defense, fresh transfer, reassessment where needed, and verified Unit 12 evidence.

### MEDIUM 10 — Assessment radio groups need stronger semantic grouping — OPEN

Current forms use labeled radio inputs but should migrate each question to `fieldset` + `legend` for more reliable screen-reader context.

### MEDIUM 11 — Certificate/gradebook are manually editable local records — OPEN / DOCUMENTED LIMITATION

Keep educator-verification language; do not imply browser fields create authoritative credentials. Course-mastered language must depend on reviewed evidence.

## Strong findings to preserve

- coherent 12-unit / 36-week / 180-day architecture
- substantially hardened weekly pedagogy
- explicit Eiren authorship boundaries
- Beta separate from mastery
- public-secret / network-mapping boundary embedded in later lessons
- 80% progression logic throughout
- targeted corrective learning and reassessment language
- integrated tools are strongest when tied to a defined learning move
- Week 36 correctly separates preparation support from independently scored performance
- diagnostic routing treats results as instructional routes, not grades
- corrective learning map targets the missed skill rather than forcing full-unit repetition
- canonical unit mastery evidence contracts now exist for all 12 units

## Regression order

1. Shared `course.js` mastery/state logic — first remediation completed
2. Assessment center + diagnostic + midterm + final — major remediation completed; accessibility semantics still pending
3. Public rubrics — remediated
4. English I landing + student portal + Grade 9 route — Grade 9 route remediated
5. Units 1–12 shells and assessment links — NEXT: integrate canonical unit evidence contracts
6. Weeks 1–36 shells, Beta/Eiren/tool routes, prerequisite checks — then classify weekly checks
7. Portfolio — first remediation completed
8. Records affecting grade/mastery/completion
9. Broken-link and canonical-route pass
10. Accessibility pass
11. Public-secret/network-mapping pass
12. Final Week 1 → Week 36 progression simulation

## Release rule

English 9 is not an A+++ release candidate until all CRITICAL and HIGH findings are resolved or explicitly documented as unavoidable limitations of a fully public static course.