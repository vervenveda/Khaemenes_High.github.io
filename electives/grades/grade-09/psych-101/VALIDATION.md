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
- `lessons/week-03/day-01.html` — Sensation & Transduction
- `lessons/week-03/day-02.html` — Vision, Hearing & the Other Senses
- `lessons/week-03/day-03.html` — Perception: Building Meaning
- `lessons/week-03/day-04.html` — Attention & Awareness
- `lessons/week-03/day-05.html` — Context, Experience & Perceptual Reality
- `assessments/week-03.html` — Week 3 mastery assessment + parallel retake

Week 3 verification includes:
- sensation vs perception
- sensory receptors and transduction
- absolute/difference thresholds as probabilistic measures
- sensory adaptation
- rods/cones, sound frequency/amplitude, touch, taste, smell, vestibular sense, proprioception
- multisensory / cross-modal processing
- bottom-up and top-down processing
- Gestalt organization, depth cues, and perceptual constancy
- illusions as evidence about normal perceptual rules rather than broken senses
- selective/divided attention
- inattentional blindness and change blindness
- visual-search reaction time and accuracy
- nuanced multitasking/task-switching reasoning
- perceptual set, context, expectation, expertise, and experience
- group pattern ≠ individual perceptual destiny
- physical reality remains measurable even when interpretation varies
- final position: perception is not identical to physical reality, but it is not arbitrary

Week 3 assessment includes Form A, targeted correction, parallel Form B, exact 80% mastery, stored best score, and explicit protection against relativism and group stereotyping.

## Weekly Assessment Verification
Weeks 1–3 each implement:
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

## Current Production Totals
- Student-facing lessons implemented: **15 / 65**
- Weekly mastery assessments implemented: **3 / 13**
- Parallel-form retake systems implemented: **3 / 13**
- Local completion challenges implemented: **1** (`Reaction Flash`)
- Student Lesson Navigator: **implemented**
- Weeks 1–3 navigation: **complete**

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

Weeks 1–3 are now complete reference-grade student implementations. Remaining production work: 50 student-facing lessons, 10 weekly assessments/parallel retakes, 3 cumulative assessments, Word Lab, Research Notebook/Journal/Progress interfaces, additional approved completion challenges, full link validation, accessibility checks, export/import recovery tests, and offline integrity testing.
