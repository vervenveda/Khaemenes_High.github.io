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
