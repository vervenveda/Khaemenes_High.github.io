# Algebra I Shared Lesson Logic Upgrade — 2026-10-20

Status: **IMPLEMENTED — source-level validation passed**

This upgrade preserves the existing Algebra I curriculum, question banks, mastery authority, strict progression, cumulative exams, applied laboratories, records, and course map. It adds one shared student-facing lesson workflow without creating an alternate mastery path.

## Standardized lesson logic

`Learn → Practice → Submit Assignment → Score Recorded → Mastery Checked → Local Review Available → Continue through the existing course gate`

The five visible milestones are Learn, Practice, Submit, Mastery, and Review & Continue. Assignment state is separately identified as Draft, Submitted, Scored, Mastered, and Reviewed.

## Integrity rules

- Canonical Algebra I mastery remains the only authority for the 80% gate.
- Workflow completion markers never grant mastery.
- The native graded lesson button is presented as **Submit Assignment**.
- Existing randomized attempts, feedback, retakes, weekly gates, unit gates, Midterm, Final, and completion evidence remain unchanged.
- A new submission clears the local review marker so a later attempt can be reviewed independently.
- Continue links are copied only from an already available canonical next-step link; the shared workflow never fabricates an unlock.
- Reflection, review status, and workflow markers are browser-local supporting evidence only.
- JSON export explicitly identifies itself as non-authoritative browser-local evidence.
- Print mode adds a centered Khaemenes Academy / course / unit / lesson evidence heading plus learner-name and date lines.

## Shared architecture

- `../assets/course-lesson-workflow-v1.js`
- `../assets/course-lesson-workflow-v1.css`
- `assets/algebra1-workflow-adapter-v1.js`
- Existing `lesson-resource-bridge-v1.js` loads the adapter across lesson pages.
- Service-worker release cache bumped to the shared-workflow release and includes the shared workflow plus the existing Algebra I student-experience assets.

## Source validation

- Shared workflow JavaScript parses successfully.
- Algebra I adapter JavaScript parses successfully.
- Updated lesson bridge JavaScript parses successfully.
- Updated service worker JavaScript parses successfully.
- No curriculum, assessment-bank, mastery-authority, or record-engine files were replaced.


## Presentation convergence — dark mathematics dashboard

A presentation-only dark dashboard layer now aligns Algebra I with the preferred Pre-Algebra visual identity.

### Changed

- Course entry defaults to dark presentation.
- New `assets/algebra1-dark-dashboard-v1.css` loads after the existing Algebra I student-experience stylesheet.
- The new layer uses deep navy/charcoal panels, warm light text, restrained blue accents, gold highlights, 7 px corners, and the existing Cinzel / Brandon Grotesque hierarchy.
- Shared lesson workflow cards inherit the same dark palette.
- Print mode remains white and evidence-friendly.
- Service-worker release cache now includes the dark dashboard stylesheet.

### Preserved

No mastery, scoring, assessment, learner-record, question-bank, lesson-engine, unit-gate, Midterm, Final, project, lab, or progression logic was modified for this visual conversion.

The existing mastery authority, strict mastery gates, and deep lesson engine remain separate from the presentation layer and continue to parse successfully.


## Mathematics-wide dashboard component parity

Algebra I participates in the shared landing/dashboard component pass through `../assets/math-dashboard-parity-v1.css`.

The pass standardizes Academy-first title hierarchy, hero proportions, lighter typography, 7 px controls, dashboard metrics, card depth, unit and lesson navigation, status presentation, support/tool cards, responsive behavior, and white print evidence while preserving this course's existing layout identity.

The shared layer is cached by this course's service worker for offline use. No mastery authority, score calculation, question bank, assessment engine, learner record, course gate, project, lab, or curriculum file was modified as part of this component-parity pass.

Khaemenes Mathematics upgrade sequencing policy: shared upgrades are applied to Pre-Algebra, Algebra I, Geometry, and Algebra II before the next upgrade category begins.


## Mathematics-wide student journey status pass

Algebra I now participates in the shared read-only student journey layer through `../assets/math-student-journey-v1.js` and `../assets/math-student-journey-v1.css`.

The course home summarizes the learner's current unit, current lesson, latest available attempt, best mastery evidence, next requirement, gate state, and one primary **Continue Learning** action. The summary reads the course's existing learner-scoped evidence and authoritative progression rules; it cannot write scores, award mastery, or bypass gates.

Where a true latest-attempt value is not stored, the interface shows an em dash rather than substituting the best score. Geometry weekly boundary gates, cumulative Midterm gates, Algebra II readiness, and course-specific unit mastery remain intact.

The shared journey assets are cached for offline course-home use.


## Mathematics-wide lesson learning parity

Algebra I now participates in the shared full lesson path:

`Learn → Worked Example → Practice → Game / Tool → Optional Video → Submit Assignment → 80% Mastery → Review → Evidence → Continue`

This is a presentation and learner-orientation upgrade built on the existing shared lesson workflow. The authoritative progression stages remain Submit, canonical mastery, and the course's existing continuation gate.

Worked Example, Game / Tool, Optional Video, and Evidence are support stages. Their availability is detected from existing lesson content and companion elements; they never grant mastery. When a reviewed video or game companion is not attached, the workflow reports that honestly rather than fabricating a resource.

Print/export evidence remains browser-local supporting evidence unless separately validated by an evaluator. The shared workflow JavaScript and all four course service workers parse successfully after the synchronized update.
