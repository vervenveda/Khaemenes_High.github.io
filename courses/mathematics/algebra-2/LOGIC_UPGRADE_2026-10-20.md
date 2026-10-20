# Algebra II Shared Lesson Logic Upgrade — 2026-10-20

Status: **IMPLEMENTED — source-level validation passed**

This pass corrects the most important logic mismatch in the Algebra II learner journey: a lesson-completion checkbox is no longer sufficient to unlock the next lesson.

## New canonical lesson rule

Each lesson now requires evaluator-reviewed evidence at **80% or higher** before the following lesson opens. The historical `complete` field is retained only for compatibility and is synchronized to verified mastery; progression decisions use lesson mastery.

`Learn → Practice → Submit Assignment → Score Recorded → Mastery Checked → Local Review Available → Continue`

## Changes

- Added `lessonEvidence()`, `lessonMastered()`, and `allLessonsMastered()` to the Algebra II progression authority.
- Changed lesson prerequisites from checkbox completion to verified ≥80% lesson mastery.
- Changed unit-mastery prerequisites from “all lessons complete” to “all lessons mastered.”
- Added an evaluator lesson-score control and immutable attempt history to the existing local lesson record.
- The old checkbox is now a read-only mastery indicator; it cannot grant progression.
- A direct Next Lesson link is disabled until the current lesson reaches mastery.
- Added the shared five-stage workflow with distinct Draft / Submitted / Scored / Mastered / Reviewed states.
- Added local reflection/review, JSON evidence export, and print evidence header.
- Added the shared workflow assets to the Algebra II offline cache.

## Integrity

The readiness diagnostic, 13 unit assessments, projects, Midterm, Final, course question bank, learner notes, profile scope, and existing assessment records were preserved. The shared workflow never writes a passing grade and never fabricates a continuation link.

## Source validation

- Updated progression JavaScript parses successfully.
- Updated lesson-tools JavaScript parses successfully.
- Algebra II workflow adapter parses successfully.
- Updated service worker JavaScript parses successfully.
- Course structural counts remain unchanged.


## Presentation convergence — dark mathematics dashboard

Algebra II now uses the preferred Pre-Algebra dark dashboard language as a presentation-only layer.

### Changed

- Course entry defaults to dark presentation.
- New `assets/algebra2-dark-dashboard-v1.css` loads after the existing course presentation styles.
- Deep navy/charcoal surfaces, warm light text, restrained blue accents, gold highlights, 7 px corners, and the Academy Cinzel / Brandon Grotesque hierarchy are applied consistently.
- The shared lesson workflow inherits the same dark palette.
- Print mode remains white and evidence-friendly.
- The service-worker release cache includes the new dark-dashboard stylesheet.

### Preserved

No mastery, scoring, assessment, learner-record, question-bank, lesson-engine, unit-gate, cumulative exam, project, capstone, or progression logic was modified for this visual conversion.


## Mathematics-wide dashboard component parity

Algebra II participates in the shared landing/dashboard component pass through `../assets/math-dashboard-parity-v1.css`.

The pass standardizes Academy-first title hierarchy, hero proportions, lighter typography, 7 px controls, dashboard metrics, card depth, unit and lesson navigation, status presentation, support/tool cards, responsive behavior, and white print evidence while preserving this course's existing layout identity.

The shared layer is cached by this course's service worker for offline use. No mastery authority, score calculation, question bank, assessment engine, learner record, course gate, project, lab, or curriculum file was modified as part of this component-parity pass.

Khaemenes Mathematics upgrade sequencing policy: shared upgrades are applied to Pre-Algebra, Algebra I, Geometry, and Algebra II before the next upgrade category begins.


## Mathematics-wide student journey status pass

Algebra II now participates in the shared read-only student journey layer through `../assets/math-student-journey-v1.js` and `../assets/math-student-journey-v1.css`.

The course home summarizes the learner's current unit, current lesson, latest available attempt, best mastery evidence, next requirement, gate state, and one primary **Continue Learning** action. The summary reads the course's existing learner-scoped evidence and authoritative progression rules; it cannot write scores, award mastery, or bypass gates.

Where a true latest-attempt value is not stored, the interface shows an em dash rather than substituting the best score. Geometry weekly boundary gates, cumulative Midterm gates, Algebra II readiness, and course-specific unit mastery remain intact.

The shared journey assets are cached for offline course-home use.


## Mathematics-wide lesson learning parity

Algebra II now participates in the shared full lesson path:

`Learn → Worked Example → Practice → Game / Tool → Optional Video → Submit Assignment → 80% Mastery → Review → Evidence → Continue`

This is a presentation and learner-orientation upgrade built on the existing shared lesson workflow. The authoritative progression stages remain Submit, canonical mastery, and the course's existing continuation gate.

Worked Example, Game / Tool, Optional Video, and Evidence are support stages. Their availability is detected from existing lesson content and companion elements; they never grant mastery. When a reviewed video or game companion is not attached, the workflow reports that honestly rather than fabricating a resource.

Print/export evidence remains browser-local supporting evidence unless separately validated by an evaluator. The shared workflow JavaScript and all four course service workers parse successfully after the synchronized update.
