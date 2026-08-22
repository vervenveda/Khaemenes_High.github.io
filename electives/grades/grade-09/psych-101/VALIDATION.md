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
- Locked weeks: **13 / 13**
- Locked daily lesson plans: **65 / 65**
- Daily anchor vocabulary terms mapped: **65 / 65**
- Cumulative assessment blueprints: **3 / 3**
- Research Notebook checkpoints: **complete through Week 13**
- Final Research Brief rubric/requirements: **complete**

## Shared Student Engine
`assets/psych101.js` supports:
- local lesson drafts
- local Research Notebook entries
- local Academic Journal entries
- daily review scoring and best-score storage
- 80% daily completion threshold for optional challenge unlock
- weekly assessment score storage
- best-score reconstruction from actual attempts
- mastery reconstructed from assessment evidence, not old completion flags
- reviewed status independent from mastery
- export/import bundle support

## Permanent Student Lesson Contract
Every implemented lesson must include:
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

## Week 1 — Psychology as a Science
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing files:
- `lessons/week-01/day-01.html`
- `lessons/week-01/day-02.html`
- `lessons/week-01/day-03.html`
- `lessons/week-01/day-04.html`
- `lessons/week-01/day-05.html`
- `assessments/week-01.html`

Coverage includes scientific definition of psychology, observation vs inference, multiple perspectives, operational definitions, sampling, reliability/validity, correlation/causation, graph integrity, ethics, replication, converging evidence, and the Week 1 scientific investigation.

Week 1 assessment includes Form A, targeted correction, parallel Form B, exact 80% mastery, stored best score, and mastery derived from actual attempts.

## Week 2 — Brain, Nervous System & Consciousness
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing files:
- `lessons/week-02/day-01.html` — Neurons & Neural Communication
- `lessons/week-02/day-02.html` — Nervous System & Endocrine System
- `lessons/week-02/day-03.html` — Brain Organization & Neural Networks
- `lessons/week-02/day-04.html` — Consciousness, Sleep & Biological Rhythms
- `lessons/week-02/day-05.html` — Studying the Brain, Neuroplasticity & Evidence
- `assessments/week-02.html` — Week 2 mastery assessment + parallel retake

Week 2 verification includes:
- neuron, action potential, synapse, neurotransmitter, receptor
- rejection of one-chemical/one-emotion explanations
- CNS/PNS, somatic/autonomic, sympathetic/parasympathetic, endocrine/hormonal communication
- homeostasis as dynamic regulation
- physiology interpreted without mind-reading
- brainstem, cerebellum, thalamus, hypothalamus, hippocampal systems, amygdala, cortex, lobes
- localization + network reasoning
- left-brain/right-brain personality myth correction
- consciousness, circadian rhythm, non-REM/REM, sleep-performance reasoning
- no private sleep disclosure or classroom diagnosis
- EEG, fMRI, lesion evidence, behavioral measures
- neuroplasticity without unlimited-change claims
- converging evidence and method limitations
- Brain & Behavior Report

Week 2 assessment includes Form A, targeted correction, parallel Form B, exact 80% mastery, stored best score, and biological interpretation guardrails.

## Current Production Totals
- Student-facing lessons implemented: **10 / 65**
- Weekly mastery assessments implemented: **2 / 13**
- Parallel-form retake systems implemented: **2 / 13**
- Local completion challenges implemented: **1** (`Reaction Flash`)
- Student Lesson Navigator: **implemented**
- Weeks 1–2 navigation: **complete**

## Standards Verification
Primary alignment is the **APA National Standards for High School Psychology Curricula (2022)**. The course covers the Scientific Inquiry & Research Methods foundation and the Biological, Cognition, Development and Learning, Social and Personality, and Mental and Physical Health pillars.

See: `reference/STANDARDS_ALIGNMENT.md`.

## Permanent Quality Controls
Every implemented lesson preserves scientific inquiry, data literacy, the Psychological Scientist's Desk, Claims Laboratory, Research Notebook checkpoint, academic/non-therapeutic journaling, mixed-format daily review, explicit limitations, person-level inference controls, print behavior, local-first progress, and optional rather than coercive enrichment.

Every weekly assessment preserves the 10-question blueprint, 80% mastery, targeted correction below mastery, parallel-form retake, and mastery reconstruction from actual attempts.

## Person-Level Interpretation Controls
- biology influences behavior but is not destiny
- neurotransmitter ≠ fixed emotion or personality
- brain activity ≠ explanation by itself
- network ≠ single center
- physiological change ≠ mind-reading
- sleep state ≠ personality
- group average ≠ individual destiny
- symptom ≠ diagnosis
- diagnosis ≠ identity
- treatment evidence ≠ individualized advice
- psychology education does not qualify a student to diagnose people

## Enrichment Validation
Completion rewards remain optional, non-graded, local-first, non-coercive, bounded, accessible, and separate from mastery. Challenge performance is never treated as evidence about attention, intelligence, motivation, mental health, personality, or diagnosis.

## Architecture Verdict
**GREEN — COMPLETE.**

## Production Verdict
**AMBER — ACTIVE BUILD.**

Weeks 1 and 2 are now complete reference-grade student implementations. Remaining production work: 55 student-facing lessons, 11 weekly assessments/parallel retakes, 3 cumulative assessments, Word Lab, Research Notebook/Journal/Progress interfaces, additional approved completion challenges, full link validation, accessibility checks, export/import recovery tests, and offline integrity testing.
