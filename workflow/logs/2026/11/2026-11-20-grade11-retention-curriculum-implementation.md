# 2026-11-20 · Grade 11 retention curriculum implementation

## Scope

Implemented the Grade 11 curriculum priorities from the curriculum-depth audit.

## Algebra II

Weeks after the opening phase now use an 8-current + 2-delayed weekly mastery structure while preserving the existing 10-question / 80% authority.

Delayed-question provenance is preserved by the shared mathematics weekly engine when supplied by the course adapter.

Commits:
- Algebra II adapter: `6721b039d8e208d4c7fe705d14cc97196ec9f2a3`
- shared math retention provenance: `eeea9e2960332df6722610eb75e4651f448f01bb`

## English 11

The existing five-question weekly form remains five questions.

Retention blueprint:
- Week 1: 5 current
- Weeks 2–36: 4 current + 1 delayed retrieval
- current passage/source anchor preserved
- 80% mastery unchanged
- new attempts preserve delayed provenance

Commits:
- retention implementation: `ff1fdb198dcb80f95ed5384b1e291f5266146cbd`
- canonical curriculum-reference correction: `931b81c56ccfcfcda31ea340cfa0551b8f455a73`

## Chemistry 11

Chemistry already has deep 36-week instruction and large cumulative Monte Carlo midterm/final practice banks.

Added a non-grading delayed-retrieval record to weekly workspaces. Learners retrieve a prior chemical principle, model, quantitative method, or evidence rule and apply it to the current phenomenon before verifying/correcting.

This evidence is stored separately and does not set or modify the reviewed weekly mastery score.

Commit:
`95ab2fcd15d49b4c6f14fa0b114cca97338437dc`

## Physical Education 11

Grade 11 no longer relies on the generic upper-grade preview pathway.

Created:
- `courses/physical-education/grade-11-instruction.json`
- `courses/physical-education/grade-11.html`

Verified:
- 36 weeks
- 180 daily lessons
- 25 question candidates per week
- 900 candidates total
- Week 1: 20 current questions
- Weeks 2–36: 15 current + 5 delayed retrieval
- teacher review required for formal mastery

Commits:
- instruction/bank: `61f266449342bc2fd17596916cb96cd94e684442`
- dedicated course: `e5f4097c389b46de23658dd749de119362eb1948`
- portal routing: `c850f2335f04b54a4ed52736739c1c2684c54871`

## Government, Law & Economics Honors

No structural curriculum change.

Existing model retained:
- 36 weeks
- 180 daily lessons
- 108 assignments
- 36 weekly quizzes
- retrieval review with new examples
- constructed response
- transfer/correction architecture

## Personal Finance Honors

No structural curriculum change.

Existing model retained:
- 18 weeks
- 90 daily lessons
- 54 assignments
- 18 weekly quizzes
- retrieval review with new examples
- transfer/correction architecture

## Regression validator

Added:
`tools/validate-grade11-retention-curriculum-v1.mjs`

Commit:
`995078d7afe5ce221c7ea627f50a4871163acfdc`

Integrated into:
`.github/workflows/no-page-regulator.yml`

Commit:
`8dcb821dc47a6dcd34464aa75c9cf244df3348f9`

## Verification

Source-equivalent Grade 11 retention validation: **PASS**

JavaScript parsing:
- Algebra II adapter: PASS
- shared mathematics weekly engine: PASS
- English 11 course engine: PASS
- Chemistry 11 inline engine: PASS
- PE 11 inline engine: PASS

PE 11 data:
- 36 weeks: PASS
- 180 daily lessons: PASS
- 25 candidates per week: PASS
- 900 candidates total: PASS

Hosted GitHub Actions: **UNVERIFIED** — no associated run returned.

Browser/device acceptance: **HOLD**

## Retention evidence boundary

Actual delayed-retention percentages are valid only for new attempts that preserve retrieval provenance. Older aggregate mastery records must not be retroactively interpreted as spaced-retention evidence.
