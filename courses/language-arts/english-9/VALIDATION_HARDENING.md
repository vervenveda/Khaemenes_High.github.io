# English 9 Hardening Validation

## Status

**ACTIVE FORENSIC CANDIDATE — Academy continuity, 80% progression, differentiated weekly learning, and independent cumulative assessments are staged on `hardening/archaemenes-highschool`.**

This is not a browser/deployment certification and is not yet A+++ validated.

The historical 36-week English 9 portal remains preserved unchanged as `legacy.html`. The Academy-facing `index.html` is a compatibility wrapper that layers learner continuity, mastery rules, and forensic curriculum improvements over the preserved portal.

## Authority model

```text
Academy Family Registry
  → NAIB delegation
  → Khaemenes Academy High School
  → Archaemenes · Academy Scholar
  → English 9 course context
```

- Family Registry owns learner identity and formal grade placement.
- English 9 does not create a second authoritative learner identity.
- Formal persistence requires an eligible High School learner in `grade-09`.
- Grade 08 / other preview access does not create a formal English 9 record.
- Archaemenes remains mentor; course evidence is not mentor-awarded mastery.

## Record isolation and mastery

Formal English 9 state is stored under `khaemenes_english9_records_by_learner_v1`, keyed by Academy learner ID.

The historical shared key is migration-only. Automatic migration occurs only when exactly one non-demo/non-default legacy learner can be identified and the migration claim is available for the active learner.

The Academy-facing bridge removes Add Student, Demo Student, and Delete Student authority, stages Monday→Friday prerequisite sequencing, requires 80% weekly mastery before subsequent progression, and requires the first-semester midterm itself to reach 80% before Week 19 opens.

Preview mode is explicitly non-formal.

## Forensic curriculum differentiation staged

`assets/english9-forensic-quality.js` now operates after the Academy bridge.

For all 36 weeks it:

- assigns a dedicated week-specific quiz key rather than relying on the old shared `quizKey` pools;
- builds five objective items per week from that week's named skill, suggested reading purpose, writing task, essential question, and vocabulary context — **180 weekly objective positions total**;
- deterministically rotates four-choice answer positions so the historical correct-answer index pattern is not preserved;
- replaces generic daily lesson-shell language with week-specific inquiry, close-reading/evidence, writing/reasoning, seminar/revision, and mastery/portfolio objectives tied to the actual week's reading and writing task;
- replaces the copied/shared historical midterm with an **18-item independent cumulative transfer assessment**;
- replaces the copied/shared historical final with a **24-item independent cumulative transfer assessment**.

The cumulative items emphasize unfamiliar transfer across literary analysis, inference, perspective, evidence integration, informational reading, rhetoric, argument, source evaluation, research integrity, poetry, drama, novel study, revision, conventions, presentation, and portfolio reflection.

## Curriculum preservation

PASS — the historical portal blob remains unchanged at `legacy.html`, including its 36-week scope, readings, writing tools, interactive organizers, reports, backups, and portfolio evidence.

The forensic layer changes the Academy-facing runtime curriculum without overwriting that preserved source.

## Remaining forensic/deployment checks

- independently verify all generated weekly items and all 42 new cumulative items;
- enumerate the 180 weekly runtime items and run exact/near-semantic duplicate analysis;
- verify deterministic answer-position distribution after runtime injection;
- inspect every transformed daily lesson for meaningful week-specific differentiation and no malformed text;
- review suggested-reading/access/copyright notes and any jurisdiction-specific standards references before production claims;
- confirm constructed-response/adult evaluation rubrics are sufficient;
- static syntax/integration check of bridge + forensic layer load order;
- browser-load wrapper and legacy frame;
- verify learner switching and learner A/B isolation;
- verify one-time migration with a historical record;
- verify preview work remains non-formal;
- verify report/export behavior after learner-scoped persistence;
- verify keyboard/mobile/print behavior.

No merge or publication is authorized by this validation file.
