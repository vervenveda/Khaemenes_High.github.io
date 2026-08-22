# VALIDATION

## Repository Foundation
- GitHub Pages root `index.html`: present
- `.nojekyll`: present
- README: present
- Course map: present
- shared CSS: present
- shared local-first JavaScript engine: present
- course data: present
- Assessment policy: present
- three cumulative-assessment blueprints: present
- Research Skills reference: present
- Psychology & Ethics reference: present
- APA Standards Alignment: present
- Psychology Word of the Day plan: present
- Completion Challenge / Reinforcement plan: present
- Aurora Completion & Enrichment plan: present
- Research Notebook: present
- Academic Journal guidance: present
- Final Project guidance: present
- External runtime dependencies required by curriculum architecture: none

## Curriculum Audit Status
- Weeks 1–13: **LOCKED**
- Every week contains a locked summary + 5 daily planning files

## Curriculum Totals
- Locked weeks: **13 / 13**
- Locked daily lesson plans: **65 / 65**
- Daily anchor vocabulary terms mapped: **65 / 65**
- Cumulative assessment blueprints: **3 / 3**
- Research Notebook checkpoints: **complete through Week 13**
- Final Research Brief rubric/requirements: **complete**

## Student-Facing Implementation Status
Implementation is proceeding week by week after the academic gate cleared.

Verified present:
- `assets/psych101.css` — shared responsive / print / reduced-motion styles
- `assets/psych101.js` — local drafts, notebook, journal, daily review, assessment/mastery, export/import utilities
- `data/course-data.js` — 13-week navigation metadata
- `lessons/index.html` — student lesson navigator
- `challenges/reaction-flash.html` — first local optional completion reward

### Week 1 — Psychology as a Science
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing pages present:
- `lessons/week-01/day-01.html` — What Is Psychology?
- `lessons/week-01/day-02.html` — Psychological Perspectives & Scientific Explanation
- `lessons/week-01/day-03.html` — Research Methods & Measurement
- `lessons/week-01/day-04.html` — Data, Correlation & Causal Reasoning
- `lessons/week-01/day-05.html` — Ethics, Replication & Scientific Judgment
- `assessments/week-01.html` — Week 1 mastery assessment + parallel retake

Every Week 1 lesson includes the permanent 17-part contract:
1. Retrieval Warm-Up
2. Essential Question
3. Learning Objectives
4. Psychology Word of the Day
5. Vocabulary in Context
6. Substantial Core Reading
7. Worked Example
8. Psychological Scientist's Desk
9. Data Lens
10. Claims Laboratory
11. Guided Investigation
12. Independent Assignment
13. Research Notebook Checkpoint
14. Academic Journal Reflection
15. 5-Question Daily Review
16. Local Completion Record
17. Optional Completion Challenge

Week 1 also preserves:
- local autosaved assignment/lab drafts
- Research Notebook and Journal stored separately
- reviewed ≠ mastered semantics
- print controls
- progress export
- challenge unlock only after successful daily review
- challenge play never affects mastery

### Shared Daily Lesson Engine Verification
`assets/psych101.js` now supports:
- local lesson drafts
- local Research Notebook entries
- local Academic Journal entries
- daily review scoring
- best daily-review score storage
- 80% daily completion threshold for optional challenge unlock
- weekly assessment score storage
- best-score reconstruction from actual attempts
- mastery reconstruction from assessment evidence rather than old completion flags
- reviewed status independent from mastery
- export/import bundle support

### Week 1 Assessment Verification
`assessments/week-01.html` implements:
- Form A: 10 mixed-format questions
- 4 core knowledge
- 2 application/scenario
- 2 research/evidence
- 1 data interpretation
- 1 ethics question
- 80% mastery threshold
- targeted concept review after a below-mastery attempt
- Form B: new parallel questions testing the same standards
- stored best score
- mastery derived from actual assessment attempts

## Current Production Totals
- Student-facing lessons implemented: **5 / 65**
- Weekly mastery assessments implemented: **1 / 13**
- Parallel-form retake systems implemented: **1 / 13**
- Local completion challenges implemented: **1** (`Reaction Flash`)
- Student Lesson Navigator: **implemented**
- Week 1 navigation: **complete**

## Week 11 Verification — Health Psychology
Week 11 includes stress as psychophysiological response, stressor/appraisal/response distinction, acute/chronic exposure, allostasis/allostatic load with non-diagnostic boundary, sleep/recovery, coping fit, actual vs perceived control, social support, health behavior/opportunity, resilience, wellness-claim auditing, and no required private health disclosure.

## Week 12 Verification — Disorders, Treatment & Ethics
Week 12 includes abnormality/classification in cultural/developmental context; symptom vs diagnosis; DSM-5-TR / ICD-11 literacy without self-diagnostic checklists; broad disorder-family literacy; dimensional/categorical reasoning; heterogeneity/comorbidity; biopsychosocial models; stigma; treatment literacy; efficacy/effectiveness; provider scopes; confidentiality; and explicit no-diagnosis/no-treatment-advice boundaries.

## Week 13 Verification — Applied Psychology & Research Synthesis
Week 13 includes applied fields, external validity/generalizability, effect size vs practical importance, implementation/feasibility, human factors/accessibility, ethical persuasion/privacy/autonomy, source independence, evidence synthesis, graph integrity, final Research Brief workshop/defense, and scientific humility.

## Standards Verification
Primary alignment is the **APA National Standards for High School Psychology Curricula (2022)**.

The course covers the Scientific Inquiry & Research Methods foundation and the Biological, Cognition, Development and Learning, Social and Personality, and Mental and Physical Health pillars.

See: `reference/STANDARDS_ALIGNMENT.md`.

## Permanent Quality Controls
Every implemented lesson must preserve scientific inquiry, data literacy, the Psychological Scientist's Desk, Claims Laboratory, Research Notebook checkpoint, academic/non-therapeutic journaling, mixed-format daily review, explicit limitations, person-level inference controls, print behavior, local-first progress, and optional rather than coercive enrichment.

Every weekly assessment must preserve the 10-question blueprint, 80% mastery, targeted correction below mastery, a parallel-form retake, and mastery reconstruction from actual attempts.

## Person-Level Interpretation Controls
- a trait score is not the whole person
- a reliable test is not automatically valid
- description does not by itself establish cause
- group averages do not justify exact individual predictions
- social influence does not erase agency
- culture does not define every member of a group
- explanation does not excuse harmful behavior
- stress is not automatically disorder
- symptom is not diagnosis
- diagnosis is not identity
- treatment evidence is not individualized advice
- psychology education does not qualify a student to diagnose people

## Enrichment Validation
Completion rewards remain optional, non-graded, local-first, non-coercive, bounded, accessible, and separate from mastery. Challenge performance is never treated as evidence about attention, intelligence, motivation, mental health, personality, or diagnosis.

## Architecture Verdict

**GREEN — COMPLETE.**

## Production Verdict

**AMBER — ACTIVE BUILD.**

Week 1 is now a complete reference implementation. Remaining production work includes 60 student-facing lessons, 12 weekly assessments/parallel retakes, 3 cumulative assessments, the Word Lab, Research Notebook/Journal/Progress interfaces, additional approved completion challenges, full link validation, accessibility checks, export/import recovery tests, and offline integrity testing.
