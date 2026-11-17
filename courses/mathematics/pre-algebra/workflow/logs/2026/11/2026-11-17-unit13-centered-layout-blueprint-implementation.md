# Pre-Algebra · Unit 13 Centered Layout Blueprint Implementation

**Date:** 2026-11-17  
**Type:** repair · layout · chrome  
**Course:** Pre-Algebra  
**Unit:** 13 · Mathematical Modelling Capstone  
**Repository:** `vervenveda/Khaemenes_High.github.io`

## Scope

Completed the remaining Unit 13 migration to the canonical centered VNV/KA high-school architecture without changing academic content, scoring, learner records, assessment thresholds, or capstone mathematics.

## Affected paths

- `courses/mathematics/pre-algebra/units/unit-13/index.html`
- `courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-01-frame-meaningful-safe-answerable-question.html`
- `courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-02-select-variables-mathematics-data-representations.html`
- `courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-03-build-calculate-verify-revise-model.html`
- `courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-04-test-assumptions-sensitivity-uncertainty-fairness.html`
- `courses/mathematics/pre-algebra/units/unit-13/lessons/lesson-05-communicate-defend-reflect-readiness.html`

## Repairs committed

### Unit dashboard

- replaced the persistent two-column `.studio-analysis-layout` with a centered single-column analysis flow;
- preserved the modelling verification studio, scenario table, graph, recommendation panel, and all capstone calculations;
- changed the print layout to remain single-column rather than restoring the split rail;
- added the official VNV language/translator script;
- retained the existing high-school global chrome, dual ticker loader, ecosystem toolbar, and capstone logic.

### Lessons 01–05

- removed the legacy `310px` right rail from `.lesson-layout`;
- changed the lesson record panel from sticky side rail to normal document flow;
- changed lesson record actions to an equal two-column grid with one-column phone fallback;
- added one official 333 ticker instance;
- added one official AutoPopulate ticker instance;
- added the official VNV language/translator script;
- retained the existing global high-school chrome and lesson engine.

## Static/source verification

For the dashboard and all five lesson files:

- legacy `minmax(0,1fr) 310px` lesson rail: **0**
- sticky `.lesson-side`: **0**
- desktop `minmax(0,1.5fr) minmax(300px,.5fr)` analysis split: **0**
- Unit 13 lessons: official 333 ticker **1 each**
- Unit 13 lessons: AutoPopulate ticker **1 each**
- Unit 13 lessons: official translator **1 each**
- Unit 13 lessons: global high-school chrome **1 each**
- Unit 13 landing: translator added and global chrome retained

## Commit sequence

- `5d7a481a065fb73e4e1dcfb286319f0c0b6ae195` — center Unit 13 capstone analysis layout
- `07ef52948b5adb861e38d7035b0ab23075cfe47b` — Lesson 01 centered layout/chrome
- `1db24176f76191dd936e12f250389a23ac56e7a3` — Lesson 02 centered layout/chrome
- `91be3460272c21583d3d68c64079f3123032aa69` — Lesson 03 centered layout/chrome
- `3fd23d8fe8045877dfe414c6bf21023f2a814521` — Lesson 04 centered layout/chrome
- `be16f8ac126b4f02d4d26211b067cbe5b96f2d71` — Lesson 05 centered layout/chrome
- `ffbc9529ab4df3e543214b67a79c8d7b150d403b` — add translator to Unit 13 landing

## Preserved behavior

No intentional change was made to:

- mastery threshold or assessment logic;
- stored learner progress or evidence;
- capstone question bank;
- model calculations or scenario behavior;
- exports;
- lesson chronology;
- Algebra I readiness reflection content.

## Remaining HOLDs

1. **Browser/device acceptance:** desktop, tablet landscape/portrait, and phone rendering still require live acceptance.
2. **Course-wide typography/accessibility:** Unit 13, like earlier Pre-Algebra pages, still inherits embedded rules containing 14px and smaller presentation text. This conflicts with the Academy 16px minimum and must be handled in the course-wide closeout sweep rather than as an isolated Unit 13 exception.

## Next step

Run the Pre-Algebra course-wide consistency and acceptance sweep across the landing page, Units 01–13, lessons, chrome ownership, typography floor, equal grids, and responsive behavior. Record all remaining HOLDs before declaring the course architecture complete.
