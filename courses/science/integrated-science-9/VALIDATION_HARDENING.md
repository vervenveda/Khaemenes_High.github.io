# Integrated Science 9 Hardening Validation

## Status

**STATIC PASS — Academy continuity wrapper installed on `hardening/archaemenes-highschool`.**

The existing 36-week Integrated Science 9 curriculum is preserved unchanged as `legacy.html`. The public course entry point now resolves Academy learner continuity before formal course persistence is enabled.

## Authority model

```text
Academy Family Registry
  → NAIB delegation
  → Khaemenes Academy High School
  → Archaemenes · Academy Scholar
  → Integrated Science 9 course context
```

Formal Science 9 persistence requires `stage: high` and `grade: grade-09` from the Academy Family Registry.

## Learner-scoped record

Formal course state uses `khaemenes_science9_records_by_learner_v1` and preserves:

- Foundation / Core / Extended pathway preference;
- daily lesson completion;
- mastery scores and attempts;
- notebook notes;
- exit reflections;
- data / graph records;
- safety verification;
- course creation/update timestamps.

The older `khae-grade09-integrated-science-portal-v1` record is migration-only. One-time migration excludes the generated `Student 1` and `Demo Scientist` records and only auto-migrates a single unambiguous historical learner.

## Student identity controls

PASS — the Academy-facing portal removes the legacy Add Student / Add Demo / Delete Student surface. The active learner comes from the Academy Family Registry.

The Science pathway selector remains a course preference; it cannot change formal grade placement.

## Advanced preview

PASS — a Grade 08 or otherwise non-formal learner may explore lessons, simulations, data tools, and generated practice without writing a formal Science 9 record.

## Curriculum preservation

PASS — the historical portal blob remains unchanged at `legacy.html`, retaining the complete 36-week integrated course across life science, chemistry, physics, Earth/space systems, environmental science, engineering, CER, data analysis, safety, cumulative assessments, and capstone work.

## Remaining deployment checks

- browser-load wrapper and legacy frame;
- Registry learner switching;
- pathway persistence for a formal learner;
- preview non-persistence;
- one-time legacy migration;
- safety/data/report persistence after reload;
- assessment links;
- mobile and print behavior.

No merge or publication is authorized by this validation file.
