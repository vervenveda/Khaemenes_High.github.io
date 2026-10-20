# Geometry Shared Lesson Logic Upgrade — 2026-10-20

Status: **IMPLEMENTED — source-level validation passed**

The Geometry curriculum, 90 visual lessons, evaluator-scored lesson mastery, weekly gates, unit mastery, cumulative assessments, investigations, capstone, and completion evidence remain authoritative and unchanged.

## Standardized learner logic

`Learn → Practice → Submit Assignment → Score Recorded → Mastery Checked → Local Review Available → Continue through the existing Geometry gate`

The shared workflow now makes Draft, Submitted, Scored, Mastered, and Reviewed visibly different states. The native evaluator-reviewed lesson score remains the source of the 80% lesson gate.

## Integrity rules

- The existing Geometry lesson-progress record remains the canonical lesson-mastery source.
- The shared workflow never changes the evaluator score or grants mastery.
- The evaluator mastery action is presented to the learner-facing workflow as **Submit Assignment**.
- Existing Geometry next-step logic is reused; no alternate unlock URL is generated.
- Foundation, Core, and Extended pathways remain intact.
- Local reflection/review status is supporting evidence only and never unlocks progression.
- Exported workflow JSON is marked non-authoritative browser-local evidence.
- Print mode adds a centered Khaemenes Academy / Geometry / unit / lesson evidence heading with learner-name and date lines.

## Shared architecture

- `../assets/course-lesson-workflow-v1.js`
- `../assets/course-lesson-workflow-v1.css`
- `assets/geometry-workflow-adapter-v1.js`
- Existing `assets/lesson-tools.js` loads the adapter for every unlocked lesson.
- Service-worker cache bumped and now includes the shared workflow assets.

## Validation

- Geometry adapter JavaScript parses successfully.
- Updated lesson-tools JavaScript parses successfully.
- Updated service worker JavaScript parses successfully.
- No lesson HTML, question bank, assessment engine, strict progression engine, or completion-record engine was replaced.


## Presentation convergence — dark mathematics dashboard

Geometry now uses the preferred Pre-Algebra dark dashboard language as a presentation-only layer.

### Changed

- Course entry defaults to dark presentation.
- New `assets/geometry-dark-dashboard-v1.css` loads after the existing course presentation styles.
- Deep navy/charcoal surfaces, warm light text, restrained blue accents, gold highlights, 7 px corners, and the Academy Cinzel / Brandon Grotesque hierarchy are applied consistently.
- The shared lesson workflow inherits the same dark palette.
- Print mode remains white and evidence-friendly.
- The service-worker release cache includes the new dark-dashboard stylesheet.

### Preserved

No mastery, scoring, assessment, learner-record, question-bank, lesson-engine, unit-gate, cumulative exam, project, capstone, or progression logic was modified for this visual conversion.


## Mathematics-wide dashboard component parity

Geometry participates in the shared landing/dashboard component pass through `../assets/math-dashboard-parity-v1.css`.

The pass standardizes Academy-first title hierarchy, hero proportions, lighter typography, 7 px controls, dashboard metrics, card depth, unit and lesson navigation, status presentation, support/tool cards, responsive behavior, and white print evidence while preserving this course's existing layout identity.

The shared layer is cached by this course's service worker for offline use. No mastery authority, score calculation, question bank, assessment engine, learner record, course gate, project, lab, or curriculum file was modified as part of this component-parity pass.

Khaemenes Mathematics upgrade sequencing policy: shared upgrades are applied to Pre-Algebra, Algebra I, Geometry, and Algebra II before the next upgrade category begins.


## Mathematics-wide student journey status pass

Geometry now participates in the shared read-only student journey layer through `../assets/math-student-journey-v1.js` and `../assets/math-student-journey-v1.css`.

The course home summarizes the learner's current unit, current lesson, latest available attempt, best mastery evidence, next requirement, gate state, and one primary **Continue Learning** action. The summary reads the course's existing learner-scoped evidence and authoritative progression rules; it cannot write scores, award mastery, or bypass gates.

Where a true latest-attempt value is not stored, the interface shows an em dash rather than substituting the best score. Geometry weekly boundary gates, cumulative Midterm gates, Algebra II readiness, and course-specific unit mastery remain intact.

The shared journey assets are cached for offline course-home use.
