# IMPLEMENTATION NOTES

## Current Phase

**Phase 2 — Student-facing implementation.**

The curriculum architecture is now complete and locked for all 13 weeks / 65 daily lessons.

## Preserve Throughout Implementation

- Cinzel regular-weight title stack
- Brandon Grotesque regular-weight body stack with safe local fallbacks
- centered, symmetrical professional layout
- no heavy bold typography
- vanilla HTML/CSS/JavaScript
- no external runtime dependencies
- local progress only
- explicit export/import
- print-friendly lessons
- 80% mastery semantics
- research/data/ethics strands throughout
- academic journal rather than therapeutic disclosure
- Psychology Word of the Day synchronized by lesson identity
- optional Completion Challenge system after genuine academic completion
- no amateur diagnosis or individualized treatment advice
- accessible keyboard/touch/focus/reduced-motion behavior

## Target Runtime Structure

```text
psych-101/
  index.html
  assets/
    psych101.css
    psych101.js
  data/
    course-data.js
    word-bank.js
    challenge-map.js
  lessons/
    index.html
    week-01/
      day-01.html ... day-05.html
    ...
    week-13/
      day-01.html ... day-05.html
  assessments/
    week-01.html ... week-13.html
    cumulative-01.html
    cumulative-02.html
    cumulative-03.html
  reference/
    word-lab.html
    research-skills.html
    ethics.html
  research-notebook/
    index.html
  journal/
    index.html
  progress/
    index.html
  project/
    index.html
  challenges/
    index.html
    reaction-flash.html
    focus-catch.html
    focus-burst.html
    psych-word-reveal.html
    one-round-grid.html
```

## Shared Lesson Contract

Every student-facing daily lesson should render:
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

## Local Storage Namespace

Use versioned, course-specific keys such as:
- `psych101_grade9_progress_v1`
- `psych101_grade9_assessments_v1`
- `psych101_grade9_notebook_v1`
- `psych101_grade9_journal_v1`
- `psych101_grade9_words_v1`
- `psych101_grade9_preferences_v1`

Never trust a historical `completed=true` flag as mastery evidence. Reconstruct weekly mastery from assessment scores using the 80% threshold.

## Assessment Engine

- weekly assessment: 10 questions
- mastery: 80%+
- below mastery: targeted correction → parallel-form retake
- cumulative checkpoints: Weeks 4, 8, 12
- Week 13: synthesis check + Research Brief, not giant final exam
- reviewed/completed must remain distinct from mastered

## Psychology Word of the Day

Use:
`reference/PSYCHOLOGY_WORD_OF_THE_DAY_PLAN.md`

Do not call Arcade at runtime. Build an embedded 65-term Psychology bank.

## Completion Challenge / Reinforcement Layer

Use:
- `reference/COMPLETION_CHALLENGE_REINFORCEMENT_PLAN.md`
- `reference/AURORA_COMPLETION_ENRICHMENT_PLAN.md`

Rules:
- optional/non-graded;
- predictable availability after earned completion;
- no streak loss, loot boxes, or variable-ratio access;
- default micro challenge 10–60 sec;
- daily reward 1–3 min;
- weekly reward 3–7 min;
- clear Skip/Close/Return controls;
- no remote dependencies or analytics;
- challenge choice/performance never becomes psychological profiling data.

## First Local Challenge Set

1. Reaction Flash
2. Focus Catch
3. Focus Burst
4. Psych Word Reveal
5. One-Round Grid

## Implementation Order

1. shared CSS + app/progress engine
2. course data / navigation map
3. student-facing Week 1 as reference implementation
4. weekly assessment engine + mastery gating
5. Psychology Word Lab
6. Research Notebook / Journal / Progress interfaces
7. remaining Weeks 2–13
8. cumulative assessments
9. optional completion challenge modules
10. print/export/import and full forensic validation

## Production Gate

The architecture may be called **curriculum complete**, but the course is not yet **production complete** until all 65 student-facing lessons, assessments, progress logic, accessibility, print views, links, and offline behavior are implemented and audited.