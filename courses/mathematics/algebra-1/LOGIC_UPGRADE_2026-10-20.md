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
