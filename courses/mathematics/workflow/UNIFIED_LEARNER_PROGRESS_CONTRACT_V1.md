# Unified Mathematics Learner Progress Contract v1

Status: Active on Pre-Algebra, Algebra I, Geometry, and Algebra II.

## Purpose

Expose a common read-only learner-record vocabulary for shared student profile, parent reporting, export, and future STOS adapters without replacing course-specific record engines.

## Canonical domains

### Progress
- completed_units
- completed_weeks
- completed_lessons
- course_percent

### Mastery
- threshold
- unit_mastery
- weekly_mastery
- midterm
- final
- average

### Evidence
- classwork
- assignments
- projects
- labs
- activities
- notes

### Portfolio
- artifacts
- weekly_entries
- capstone
- reflection_entries

## Missing evidence rule

Missing or unavailable evidence is never interpreted as zero. The adapter returns null plus an explicit status such as not_recorded or unavailable.

## Provenance rule

The adapter does not reassign historical, unscoped, or ambiguous records to a learner. Pre-Algebra keeps its explicit learner-scoped archive boundary and excludes legacy unattributed records.

## Mastery authority

The shared contract is observational only. It does not:
- unlock lessons or units;
- write scores;
- calculate official credit;
- replace course-specific mastery engines;
- authenticate identity;
- issue transcripts.

The authorized mastery target remains 80%.

## Runtime API

window.KhaemenesMathProgress.snapshot()

returns a normalized object with:
- schema
- course
- generated_at
- authority
- progress
- mastery
- evidence
- portfolio
- provenance

## Migration direction

New Student Progress, Parent Profile, learner exports, and STOS intake adapters should consume this normalized contract rather than directly depending on four different browser-local record dialects.
