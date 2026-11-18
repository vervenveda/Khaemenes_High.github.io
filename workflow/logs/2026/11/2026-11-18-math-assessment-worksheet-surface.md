# November 18, 2026 · Mathematics assessment worksheet surface

## Founder direction

Use the professional Algebra I printable progression as the visual model for online mathematics assessments:
- one-column online problem flow instead of printable two-column compression;
- ample solving space beneath each problem;
- simplified Academy presentation with less top-of-page clutter;
- retain the existing lower-left Mathematics Tools button rather than adding a second toolbar.

## Shared assessment presentation

Added:
`courses/mathematics/assets/math-assessment-workspace-v1.css`

The shared surface provides:
- parchment / charcoal / restrained gold Academy treatment;
- Brandon-style body stack and Cinzel-style heading stack without external font downloads;
- compact Academy header treatment;
- centered one-column assessment workspace;
- full-width problem cards;
- responsive choices and workspaces;
- large lined problem-solving areas;
- simplified assessment record card;
- tablet / phone single-column behavior;
- printable layout support.

## Existing lower-left Tools launcher

Reused:
`courses/mathematics/assets/math-learning-tools-v2.js`

No second assessment toolbar was created.

Assessment mode now presents:
- Notepad
- Calculator
- Whiteboard
- Graph
- Formula
- Help

The final examination remains closed-book: Formula stays visible but disabled there. Scratch tools do not change scoring or mastery.

The Notepad is session-only. The Whiteboard is an in-page scratch canvas. Both are explicitly non-grading.

## Algebra I

Applied the shared assessment surface to:
- readiness diagnostic;
- midterm;
- 36-week final.

The existing assessment engine now places an ungraded "Show your work" area beneath every selected-response question. Work is stored inside the assessment draft and included as a `work_snapshot` in exported/submitted evidence, but it is not included in auto-scoring.

## Pre-Algebra

The cumulative Midterm/Final view now switches the same course page into the shared assessment surface.

Each cumulative question has an ungraded problem-solving workspace stored with the resumable assessment draft.

The existing lower-left Tools button switches dynamically between:
- ordinary course-resource mode; and
- assessment-tool mode.

The Pre-Algebra final sets assessment mode to `final`, allowing the shared Tools policy to disable Formula support for the closed-book final.

### Weekly mastery checks

The 10-question weekly mastery check is no longer embedded beneath the five-session planner and assignment stack.

The weekly page now shows a compact Start / Resume Mastery Check card. Opening it:
- enters the same one-column assessment surface used by cumulative assessments;
- hides the old course hero, sidebar, and course tabs for a focused assessment workspace;
- preserves one stable randomized 10-question form for the active draft;
- preserves selected answers;
- preserves an ungraded Show Your Work area beneath every question;
- keeps the canonical 2-per-reasoning-dimension blueprint and delayed-retrieval design;
- uses the existing lower-left Math Tools launcher in assessment mode;
- returns to the weekly planner after verified submission.

Weekly draft schema:
`prealgebra-weekly-mastery-draft-v1`

Submitted attempts now include a `work_snapshot` for problem-solving evidence. Work is not included in the automatic score.

The 80% weekly mastery threshold, question banks, question IDs, reasoning dimensions, delayed-retrieval design, prior attempt history, and best-score calculation are unchanged.

## Safety boundary

No question bank, answer key, mastery threshold, scoring equation, learner identity, prior attempt history, grade, or authoritative learner record was deleted or rewritten by this presentation pass.

## Source validation

PASS:
- `math-learning-tools-v2.js` JavaScript parse.
- Algebra I `exam-engine.js` JavaScript parse.
- Pre-Algebra primary inline runtime parse.
- weekly mastery dedicated workspace, stable draft, answer/work persistence, and planner return path are present.
- diagnostic / midterm / final all reference the shared assessment stylesheet.
- diagnostic / midterm / final all reference the existing Math Tools launcher.
- no new MutationObserver added to the shared assessment presentation or Math Tools launcher.
- regression contract added:
  `tests/math-assessment-worksheet-surface.test.mjs`

## Acceptance boundary

Source implementation is complete.

Live browser acceptance should verify:
- desktop, laptop, tablet portrait, tablet landscape, and phone;
- first / middle / final question sections;
- work-area draft persistence;
- existing lower-left Tools launcher opens only once;
- Notepad / Calculator / Whiteboard / Graph / Formula / Help;
- Formula disabled on closed-book final;
- print output;
- no horizontal overflow;
- no overlap with lower-right ecosystem toolbar.

Status: **SOURCE IMPLEMENTATION PASS · LIVE DEVICE ACCEPTANCE PENDING**.

## Algebra I weekly and unit mastery expansion

The worksheet assessment system now extends beyond the Algebra I diagnostic, midterm, and final.

### 36-week mastery center

`assessments/weekly-mastery.html` now uses the shared one-column worksheet surface and the existing lower-left Math Tools launcher.

The weekly mastery engine now preserves:
- selected answers;
- ungraded Show Your Work fields under every question;
- work in the weekly draft;
- a non-scoring `work_snapshot` in submitted weekly evidence;
- scratch reset when a fresh weekly attempt is deliberately started.

The existing 10-question weekly blueprint, 80% threshold, five reasoning dimensions, lesson prerequisites, unit prerequisites, alternate forms, and progression authority are unchanged.

### Unit mastery checks · Units 01–13

All 13 formal unit mastery pages now use:
- `math-assessment-workspace-v1.css`;
- the existing `math-learning-tools-v2.js` lower-left Tools launcher;
- `algebra-1/assets/unit-assessment-workspace-v1.js`.

The unit enhancer is presentation-only. It adds large lined scratch areas after rendered questions and stores those notes in `sessionStorage` for the active browser session. It does not write scores, best values, mastery flags, unlock evidence, learner grades, or question-bank changes.

No MutationObserver is used. The enhancer makes a finite startup pass and re-runs only after an explicit new-attempt control.

### Focused-view ownership

`focused-assessment-v1.js` now stands down whenever `math-assessment-surface` is active. This prevents the older one-question-at-a-time controller from hiding or reorganizing questions on the new worksheet-style mastery surfaces.

### Legacy typography override

Several Algebra I mastery pages still contain embedded legacy typography rules forcing 14px body text and 55px eyebrow text. The shared assessment theme now includes a higher-specificity assessment override so those legacy declarations cannot defeat the professional 18px worksheet standard.

### Current Algebra I assessment coverage

The shared assessment presentation now covers:
- readiness diagnostic;
- 36 weekly mastery checks;
- 13 formal unit mastery checks;
- midterm;
- final.

Regression coverage was expanded in:
`tests/math-assessment-worksheet-surface.test.mjs`.

Source validation confirms the weekly engine, unit enhancer, focused-view controller, legacy mastery engine, and Math Tools launcher parse without JavaScript syntax errors. All 13 unit mastery HTML pages currently reference the shared theme, the existing Math Tools launcher, and the unit worksheet enhancer.

Status remains: **SOURCE IMPLEMENTATION PASS · LIVE DEVICE ACCEPTANCE PENDING**.

