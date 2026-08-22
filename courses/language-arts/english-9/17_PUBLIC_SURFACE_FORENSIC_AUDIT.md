# English 9 Public-Surface Forensic Audit

Branch: `audit/language-arts-a-plus-plus-plus`

Status: ACTIVE — course-wide regression and hardening pass.

## Scope

Audit every learner-facing English 9 surface, including:

- English I landing and student portal
- Grade 9 Language Arts route inside the course package
- 12 unit landing pages
- 36 weekly lesson pages / 180 daily instructional blocks
- assessment center
- diagnostic
- midterm examination
- final examination
- portfolio
- public rubrics
- public records that affect progression, grades, or completion
- shared course CSS/JS that controls learner-facing behavior

The public-surface rule is strict: learner-facing pages may expose approved educational destinations and learning purpose, but not credentials, tokens, private endpoints, protected routes, internal repositories, infrastructure/service topology, administrative maps, storage/orchestration details, or answer keys intended to remain protected.

## Audit dimensions

Each public page is checked for:

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

### Core course
- `landing.html`
- `index.html` student portal
- `grades/grade-09/index.html`

### Units
- `units/unit-01/index.html` through `units/unit-12/index.html`

### Weekly lessons
- `weeks/week-01/index.html` through `weeks/week-36/index.html`

### Assessments
- `assessments/index.html`
- `assessments/diagnostic/index.html`
- `assessments/midterm/index.html`
- `assessments/final/index.html`

### Portfolio
- `portfolio/index.html`

### Rubrics
- `rubrics/literary-analysis.html`
- `rubrics/narrative.html`
- `rubrics/argument.html`
- `rubrics/research.html`
- `rubrics/speaking.html`

### Learner-facing records
- `records/index.html`
- `records/annual-calendar.html`
- `records/attendance-log.html`
- `records/reading-log.html`
- `records/gradebook.html`
- `records/completion-certificate.html`

## Critical findings — immediate remediation required

### CRITICAL 01 — High-stakes answer keys are embedded in public client code

The diagnostic, midterm, and final currently include JavaScript `ANSWERS` objects in the same public HTML delivered to students. This makes the key inspectable in source/devtools and means the objective sections cannot be treated as protected high-stakes assessment evidence.

Required disposition:
- Diagnostic may remain explicitly formative/open if desired.
- Midterm and final may not be represented as secure hidden-key exams while answer keys live in public client code.
- For a fully public static course, secure hidden-answer assessment requires either an authorized non-public scoring mechanism or a different assessment model built around fresh transfer tasks and human-reviewed evidence.

### CRITICAL 02 — Mastery records are manually writable client-side and current logic does not preserve mastery history

`assets/course.js` allows a learner-facing number field to write a mastery score directly into `localStorage`. This is useful as a local record, but it is not authoritative verification. The current implementation also replaces the prior record rather than preserving first/latest/best score and attempt count, conflicting with the course mastery manifest's `preservePriorMastery` and attempt-history requirements.

Required disposition:
- Treat browser mastery as a local progress record, not cryptographically authoritative proof.
- Preserve first/latest/best score, attempt count, mastered-at timestamp, threshold, and prior mastery.
- Never allow a later lower retake to erase established mastery.
- Keep educator/human review authoritative for complex work.

### HIGH 03 — No dedicated weekly quiz directory or canonical unit-test implementation exists

The course has a 36-week instructional sequence and many weekly pages state that defined scored checks require ≥80%, but there is no `quizzes/` directory and the assessment center exposes only diagnostic, midterm, final, and portfolio. Unit pages currently accept manually entered “verified” scores rather than linking to a canonical scored unit assessment.

Required disposition:
- Decide which weekly checks are practice, which are human-reviewed performance evidence, and which are canonical objective assessments.
- Build or identify the canonical assessment source for each unit before calling the unit gate fully verified.
- Use the Pre-Algebra pattern as the structural benchmark without forcing Language Arts into math-style itemization where authentic writing/speaking evidence is the better measure.

### HIGH 04 — Public rubrics are generic templates rather than criterion-specific scoring instruments

All five inspected rubrics repeat the same generic level descriptors across every criterion. For example, “Specific, controlled, insightful, and independent” is used for claim, evidence, reasoning, organization, language, delivery, source quality, citation, etc. This is not sufficiently diagnostic for A+++ scoring or targeted corrective learning.

Required disposition:
- Rewrite every rubric cell so the descriptor names observable evidence for that criterion.
- Align 4/3/2/1 levels with the 80% mastery model.
- Prevent style, charisma, accent, disability, or polish from substituting for the actual competency.

### HIGH 05 — `grades/grade-09/index.html` contains route/canonical problems

The file lives inside `courses/language-arts/english-9/grades/grade-09/` but its canonical and relative asset/course links point toward a different `/grades/grade-09/language-arts/` structure. Relative paths require normalization or this legacy page should be replaced by a clean redirect/route page.

### HIGH 06 — Public shell normalization is incomplete

A number of later unit/week/assessment/portfolio/rubric pages still use the older High School / Language Arts header and text-only Beta treatment rather than the standardized English I shell:

`Course Portal · Eiren · Beta`

This is a continuity defect, not a reason to rewrite strong pedagogy.

### HIGH 07 — Portfolio still carries a stale PROSE route and completion terminology

`portfolio/index.html` links to an older encoded PROSE path instead of the verified editorial gateway and still exposes a “Mark Portfolio Complete” control. Portfolio completion may be recorded, but it must not be confused with final course mastery.

### MEDIUM 08 — Certificate/gradebook are manually editable local records

The public gradebook and completion certificate are appropriate printable local documents only if clearly treated as records requiring educator verification. They cannot constitute tamper-resistant credential verification in a static client-only application.

Required disposition:
- Keep the existing educator-verification language.
- Do not imply that local browser fields create authoritative institutional records.
- Gate any “course mastered” language on reviewed evidence, not merely typed local values.

## Strong findings to preserve

- 12-unit / 36-week / 180-day architecture is coherent.
- Weekly pedagogy is substantially hardened and often excellent.
- Eiren boundaries are increasingly explicit and protect student authorship.
- Beta is consistently described as separate from mastery.
- Later lessons explicitly prohibit public exposure of credentials, protected endpoints, repository secrets, infrastructure topology, or network mapping.
- Unit progression consistently targets an 80% threshold.
- Corrective learning / reassessment language is embedded throughout the hardened lessons.
- PROSE, Evidence Studio, ARSHIF, Bazaar Art, Aurora tools, the translator, and sovereign games are strongest when tied to a specific learning move rather than used as decoration.
- Week 36 correctly separates mentor/tool preparation from independently scored performance.

## Regression order

1. Shared `course.js` mastery/state logic
2. Assessment center + diagnostic + midterm + final
3. Public rubrics
4. English I landing + student portal + Grade 9 route
5. Units 1–12 shells and assessment links
6. Weeks 1–36 shells, Beta/Eiren/tool routes, prerequisite checks
7. Portfolio
8. Records affecting grade/mastery/completion
9. Broken-link and canonical-route pass
10. Accessibility pass
11. Public-secret/network-mapping pass
12. Final Week 1 → Week 36 progression simulation

## Release rule

English 9 is not an A+++ release candidate until all CRITICAL and HIGH findings are resolved or explicitly documented as unavoidable limitations of a fully public static course.