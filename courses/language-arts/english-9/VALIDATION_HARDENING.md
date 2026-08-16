# English 9 Hardening Validation

## Status

**STATIC PASS — Academy continuity wrapper installed on `hardening/archaemenes-highschool`.**

The existing 36-week English 9 curriculum is preserved unchanged as `legacy.html`. The public course entry point is now a small Academy-connected wrapper.

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

## Record isolation

Formal English 9 state is stored under `khaemenes_english9_records_by_learner_v1`, keyed by the Academy learner ID.

The historical shared key is migration-only. Automatic migration occurs only when exactly one non-demo/non-default legacy learner can be identified and the migration claim is available for the active learner.

The legacy curriculum portal is preserved for compatibility, while Add Student, Demo Student, and Delete Student authority is removed from the Academy-facing entry point.

## Curriculum preservation

PASS — the historical portal blob is preserved unchanged at `legacy.html`, including:

- 36-week scope;
- Monday–Friday lessons;
- reading suggestions;
- writing and annotation tools;
- weekly quizzes and reassessment;
- midterm and final;
- reports and local backup features;
- portfolio-oriented evidence.

## Preview boundary

PASS — advanced Grade 08 learners may explore the portal in preview mode, but preview practice is not written into a formal Grade 09 English record.

## Remaining deployment checks

- browser-load the wrapper and legacy frame;
- verify Registry learner switching;
- verify one-time migration with a real historical record;
- verify preview work remains non-formal;
- verify report/export behavior after learner-scoped persistence;
- verify mobile and print behavior.

No merge or publication is authorized by this validation file.
