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
- cumulative assessment score storage
- best-score reconstruction from actual attempts
- mastery reconstructed from assessment evidence, not old completion flags
- reviewed status independent from mastery
- export/import bundle support

## Permanent Student Lesson Contract
Every implemented lesson includes:
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

## Week 2 — Brain, Nervous System & Consciousness
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing files:
- `lessons/week-02/day-01.html`
- `lessons/week-02/day-02.html`
- `lessons/week-02/day-03.html`
- `lessons/week-02/day-04.html`
- `lessons/week-02/day-05.html`
- `assessments/week-02.html`

Coverage includes neurons/neurotransmitters, CNS/PNS, autonomic/endocrine regulation, brain regions and network reasoning, consciousness and sleep, EEG/fMRI/lesion evidence, neuroplasticity, and strong biological-determinism / mind-reading guardrails.

## Week 3 — Sensation, Perception & Attention
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing files:
- `lessons/week-03/day-01.html`
- `lessons/week-03/day-02.html`
- `lessons/week-03/day-03.html`
- `lessons/week-03/day-04.html`
- `lessons/week-03/day-05.html`
- `assessments/week-03.html`

Coverage includes sensation vs perception, sensory receptors and transduction, probabilistic thresholds, sensory adaptation, major sensory systems, multisensory processing, bottom-up/top-down processing, Gestalt organization, depth cues, perceptual constancy, illusions, selective/divided attention, inattentional/change blindness, visual-search data, perceptual set, context, expertise, experience, and explicit protection against relativism and group stereotyping.

## Week 4 — Learning & Behavior
**GREEN — FULL WEEK IMPLEMENTED**

Student-facing files:
- `lessons/week-04/day-01.html` — Classical Conditioning
- `lessons/week-04/day-02.html` — Operant Conditioning
- `lessons/week-04/day-03.html` — Shaping, Schedules & Habit Formation
- `lessons/week-04/day-04.html` — Observational Learning, Modeling & Cognition
- `lessons/week-04/day-05.html` — Learning Systems, Applications & Ethical Behavior Change
- `assessments/week-04.html` — Week 4 mastery assessment + parallel retake

Week 4 verification includes:
- US, UR, neutral stimulus, CS, CR
- acquisition, extinction, spontaneous recovery, generalization, discrimination
- conditioning as predictive relationship rather than mere repetition
- reinforcement and punishment defined by future behavior
- positive = add; negative = remove
- negative reinforcement ≠ punishment
- reward ≠ reinforcer unless behavior increases
- Antecedent → Behavior → Consequence analysis
- shaping through successive approximations
- fixed/variable ratio and interval schedules
- baseline and repeated-measurement reasoning
- habit models used without “21-day” mythology
- observational learning, modeling, attention, retention, production, motivation, and vicarious consequences
- learning ≠ immediate performance
- media/modeling claims calibrated rather than made automatic
- immediate practice performance distinguished from delayed retention
- ethical behavior change: transparency, autonomy, proportionality, fairness, access barriers, constructive alternatives
- explicit distinction that a completion reward is a reinforcer candidate until future target behavior actually increases

## Weekly Assessment Verification
Weeks 1–4 each implement:
- 10-question mixed-format Form A
- 4 core knowledge
- 2 application/scenario
- 2 research/evidence
- 1 data interpretation
- 1 ethics/context/limitation item
- exact 80% mastery threshold
- targeted concept review below mastery
- a parallel Form B using new questions on the same standards
- stored best score
- mastery derived from actual attempts rather than completion flags

## Cumulative Assessment I — Weeks 1–4
**GREEN — IMPLEMENTED**

`assessments/cumulative-01.html` includes:
- 30 integrated items
- 8 core knowledge
- 7 application/scenario
- 5 research-design
- 4 data interpretation
- 4 cross-unit synthesis
- 2 ethics/limitations
- exact 80% checkpoint mastery
- targeted correction below mastery
- independent parallel Form B with 30 new scenarios on the same standards
- cumulative score stored separately from weekly mastery
- cross-unit transfer among scientific methods, biology, perception/attention, and learning

## Current Production Totals
- Student-facing lessons implemented: **20 / 65**
- Weekly mastery assessments implemented: **4 / 13**
- Parallel-form weekly retake systems implemented: **4 / 13**
- Cumulative assessments implemented: **1 / 3**
- Cumulative parallel retakes implemented: **1 / 3**
- Local completion challenges implemented: **1** (`Reaction Flash`)
- Student Lesson Navigator: **implemented**
- Weeks 1–4 navigation: **complete**

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
- physiological change ≠ mind-reading
- sensation ≠ perception
- interpretation ≠ invention
- attention ≠ eyesight
- illusion ≠ broken perception
- perceptual variation ≠ anything goes
- reinforcement ≠ bribery
- negative ≠ bad
- explanation ≠ justification
- behavior modification ≠ controlling people
- learning ≠ only observable conditioning
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

Weeks 1–4 and Cumulative Assessment I are now complete student-facing production batches. Remaining production work: 45 student-facing lessons, 9 weekly assessments/parallel retakes, 2 cumulative assessments, Word Lab, Research Notebook/Journal/Progress interfaces, additional approved completion challenges, full link validation, accessibility checks, export/import recovery tests, and offline integrity testing.
