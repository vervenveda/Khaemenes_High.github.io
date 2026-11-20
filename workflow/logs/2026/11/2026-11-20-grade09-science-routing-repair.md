# 2026-11-20 · Grade 09 Science 9 routing repair

## Scope

Fresh course-routing audit for Integrated Science 9 from the Grade 09 Student Profile / Daily Lessons surfaces into the learner's current instructional step.

## Findings

The Science 9 continuation engine already tracked the learner's next unfinished **week**, but active weekly continuation published the course dashboard with:

`?view=week&week=N`

That required an extra click before reaching the detailed day lesson.

A second fallback issue was found after readiness completion but before a learner course record existed: the Grade 09 course registry hard-coded Unit 01 Day 01, skipping the actual Week 1 / Unit 00 detailed lesson sequence.

## Repairs

### Science continuation v1.2.0

`courses/shared/high-school-science-continuation.js`

For unfinished weekly work, the continuation now resolves the first incomplete detailed lesson and publishes that concrete URL.

Route contract:
- Unit 00: `diagnostic/lessons/day-XX.html`
- Units 01–12: `units/unit-XX/lessons/day-XX.html`

Weekly mastery and reassessment remain in the Science 9 week workspace because that is where the weekly mastery engine is administered.

Repair commit:
`3fdb8c762c75769ccf3034a6f05d4c2f0cc16c2f`

### Post-readiness fallback

`grades/grade-09/student-profile/student-course-registry.js`

The new-learner fallback now opens:

`diagnostic/lessons/day-01.html`

instead of incorrectly skipping to Unit 01 Day 01.

Repair commit:
`ee4300683d123ecf9e91455eee9c2286051425ae`

Pre-readiness first step remains the readiness diagnostic.

## Lesson topology verification

The 36-week Science 9 course map and published lesson directories agree:

- Unit 00: 1 week → 5 detailed lessons
- Unit 01: 2 weeks → 10 detailed lessons
- Units 02–12: 3 weeks each → 15 detailed lessons each
- Total: 36 weeks

The route formula therefore matches the published lesson topology.

## Regression coverage

New validator:

`tools/validate-grade09-science-routing.mjs`

It protects:
- 36-week / unit-week topology
- expected detailed lesson counts
- Science continuation direct-lesson resolver
- weekly mastery staying in the week workspace
- Grade 09 registry consumption of learner continuation
- post-readiness Unit 00 Day 01 fallback
- Daily Lessons use of `registry.resolveContinueFor(course.id)`
- pre-readiness readiness-diagnostic first step

Validator creation commit:
`3b54cc32a3f2189448fd33caab5ea9cf0ebe4814`

Workflow integration commit:
`c6ab89fa1389c3a45609fd9841b4404f8a6ad18c`

## Verification

Direct source-equivalent routing verification: **PASS**

Hosted GitHub Actions: **UNVERIFIED** — connector returned no workflow run.

Browser/device acceptance: **HOLD**
