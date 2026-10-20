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
