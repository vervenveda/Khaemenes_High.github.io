# IMPLEMENTATION NOTES

## Current Phase

**Phase 2 — Student-facing implementation.**

Academic architecture is complete and locked for all **13 weeks / 65 daily lessons**.

Current production state:
- Weeks 1–4: fully student-facing
- 20 / 65 student-facing lessons implemented
- 4 / 13 weekly mastery assessments implemented
- 4 / 13 parallel-form retake systems implemented
- Cumulative Assessment I implemented
- Cumulative Assessments II–III pending
- first local completion challenge implemented: Reaction Flash
- next production batch: **Week 5 — Memory & Language**

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

Every student-facing daily lesson renders:
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

Use versioned, course-specific keys:
- `psych101_grade9_progress_v1`
- `psych101_grade9_assessments_v1`
- `psych101_grade9_notebook_v1`
- `psych101_grade9_journal_v1`
- `psych101_grade9_words_v1`
- `psych101_grade9_preferences_v1`

Never trust a historical `completed=true` flag as mastery evidence. Reconstruct weekly mastery from assessment scores using the 80% threshold.

## Assessment Engine

Implemented behavior:
- weekly assessment: 10 questions
- mastery: 80%+
- below mastery: targeted correction → parallel-form retake
- best score reconstructed from stored attempts
- reviewed/completed remains distinct from mastered
- Cumulative Assessment I stores checkpoint evidence separately from weekly mastery

Remaining assessment work:
- Weeks 5–13 weekly assessments
- Cumulative Assessment II after Week 8
- Cumulative Assessment III after Week 12
- Week 13 synthesis check + Research Brief defense

## Psychology Word of the Day

Use:
`reference/PSYCHOLOGY_WORD_OF_THE_DAY_PLAN.md`

All 65 anchor terms are already mapped academically.

Do not call Arcade at runtime. Build an embedded 65-term Psychology bank and lesson-synchronized Word Lab.

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

Current implementation:
1. Reaction Flash — complete

Next approved local modules:
2. Focus Catch
3. Focus Burst
4. Psych Word Reveal
5. One-Round Grid

## Implementation Order — Current

1. shared CSS + app/progress engine — **DONE**
2. course data / navigation map — **DONE**
3. Week 1 reference implementation — **DONE**
4. weekly assessment/mastery engine — **DONE / REUSED BY EACH WEEK**
5. Weeks 2–4 student implementation — **DONE**
6. Cumulative Assessment I — **DONE**
7. Week 5 — Memory & Language — **NEXT**
8. Weeks 6–8 + Cumulative Assessment II
9. Weeks 9–12 + Cumulative Assessment III
10. Week 13 + Final Research Brief interface
11. Psychology Word Lab
12. Research Notebook / Journal / Progress interfaces
13. remaining optional completion challenges
14. print/export/import recovery + full forensic validation

## Batch Rule

For each remaining week, proceed in this order:

1. inspect the five locked curriculum plans;
2. implement Day 1 only;
3. verify the 17-part contract and links;
4. implement Days 2–5 individually;
5. implement the weekly Form A assessment;
6. implement targeted correction + parallel Form B;
7. update navigation, manifest, validation, and production counts;
8. only then mark the week student-ready.

This preserves the one-item-at-a-time build discipline and prevents a partially implemented week from being represented as complete.

## Production Gate

**Curriculum complete:** yes.

**Production complete:** no.

Production completion requires all 65 student-facing lessons, 13 weekly assessments and parallel retakes, 3 cumulative assessments, progress/reference interfaces, accessibility, print views, navigation, export/import recovery, and offline behavior to be implemented and audited.