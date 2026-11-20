# 2026-11-20 · Grade 10 retention curriculum implementation

## Scope

Implemented the Grade 10 curriculum priorities identified by the curriculum-depth audit.

## Geometry

Weekly mastery now preserves the existing 10-question / 80% authority while changing Weeks 2–36 to an 8-current + 2-delayed retrieval structure.

The weekly record now preserves separate current and delayed performance. Existing completed mastery remains preserved; unfinished legacy drafts are reset when their composition is no longer compatible.

Commit:
`23817f5b347755755e1bcbe5fbfeac4f7fc36654`

## Biology 10

Biology's canonical weekly bank contains five authored questions per week. The retention design therefore uses the same 20% delayed-retrieval proportion without artificially enlarging the test:

- Week 1: 5 current
- Weeks 2–36: 4 current + 1 delayed

The Monte Carlo engine uses source quotas and preserves delayed provenance in new submitted practice records.

Commit:
`c3fc81818baf4fc9229c2563874cad07d201ee68`

## Physical Education 10

Grade 10 no longer uses the generic Grades 10–12 three-question preview pathway.

Created:

`courses/physical-education/grade-10-instruction.json`

Verified totals:
- 36 weeks
- 180 daily lessons
- 25 question candidates per week
- 900 assessment candidates total

Created dedicated course surface:

`courses/physical-education/grade-10.html`

Weekly local progression:
- Week 1: 20 current questions
- Weeks 2–36: 15 current + 5 delayed retrieval
- 80% browser-local progression target
- teacher review remains required for formal mastery

The existing PE portal routes Grade 10 directly to this dedicated course.

Commits:
- instruction and bank: `0d15e31a75bbf0be8043e4891b3377aae2d0fd53`
- dedicated Grade 10 course: `cdbdb8c6231bdae2dabe7adf6ae19a31ccc243e7`
- portal routing: `34a02bef7e1e8055010fa87c8935cabfbdd3f30a`

## English 10

The existing five-question weekly form remains five questions.

Retention blueprint:
- Week 1: five current
- Weeks 2–36: four current + one delayed retrieval
- at least one current passage/source anchor remains required
- 80% mastery unchanged

New attempts preserve delayed provenance and a separate delayed score.

Commit:
`a83543f2b816935344c333924ba0cbeb6c3982ef`

## U.S. History Honors

No structural curriculum change.

Its existing 36-week / 180-day / 108-assignment / retrieval-before-review model remains a Grade 10 reference implementation.

## Regression validator

Added:

`tools/validate-grade10-retention-curriculum-v1.mjs`

Commit:
`588e7bd951fcf3123be4c81bff26f71056241fc2`

Integrated into the main regression workflow:

`.github/workflows/no-page-regulator.yml`

Commit:
`54cdb6e3859d693bcad882f99efc853bad9da9c1`

## Verification

Source-equivalent Grade 10 retention validation: **PASS**

JavaScript parsing:
- Geometry weekly mastery: PASS
- Biology 10 dashboard: PASS
- English 10 course engine: PASS
- PE assessment engine: PASS
- PE 10 inline course engine: PASS

PE 10 data:
- 36 weeks: PASS
- 180 daily lessons: PASS
- 25 candidates each week: PASS
- 900 total candidates: PASS

Hosted GitHub Actions: **UNVERIFIED** — no associated workflow run returned.

Browser/device acceptance: **HOLD**

## Retention evidence boundary

Actual delayed-retention percentages are valid only for new attempts that preserve retrieval provenance. Older aggregate scores must not be retroactively interpreted as spaced-retention evidence.
