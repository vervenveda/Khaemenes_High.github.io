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
