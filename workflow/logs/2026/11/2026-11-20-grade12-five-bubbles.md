# 2026-11-20 · Grade 12 five-bubble cleanup

## Bubble 1 · Senior Capstone schedule parity
Grade 12's shared eight-class plan now uses Senior Capstone in the former Grade 12 Psychology/Life Skills slot. Grades 9–11 are unchanged.

Updated:
- courses/shared/high-school-eight-class.js
- courses/shared/high-school-course-pins.js

The Grade 12 Student Profile, Schedule, Class Progress, and Portfolio expected-course list now receive the same Senior Capstone course id.

## Bubble 2 · Grade 12 PE direct routing and identity repair
Grade 12 PE now routes directly to:
- courses/physical-education/grade-12.html

Corrected inherited template identifiers:
- page title and hero now say Physical Education 12
- assessment identities now use g12-week-*
- local assessment schema now uses khae-pe-g12-*
- Grade 12 landing and pin metadata use the dedicated Grade 12 surface

Existing student records were not reset or migrated.

## Bubble 3 · Senior Capstone portfolio / transcript evidence chain
Senior Capstone now loads the Academy learner/continuation contracts and publishes:
- courseId: senior-capstone
- Grade 12 learner-scoped progress
- next-step continuation
- evaluator-confirmed checkpoint scores only
- explicit provisional/evaluator-review boundaries

Because the Portfolio academic report derives Grade 12 expected courses from the shared eight-class plan, Senior Capstone now appears in the Grade 12 report and can contribute locally reported evaluator checkpoint evidence.

Learner self-completion cannot create an evaluator score or final transcript grade.

## Bubble 4 · Grade 12 route sweep coverage
The Grade 9–12 execution sweep now contains 20 entries and explicitly includes:
- Physical Education 12
- Senior Capstone

Grades 9–11 retain three grade-core entries each. Grade 12 now requires five: English, Science, Social Studies, PE, and Senior Capstone. Placement mathematics remains separate.

Updated:
- courses/shared/grade-09-12-execution-sweep-v1.json
- tests/test-grade-09-12-execution-sweep.cjs

## Bubble 5 · Senior Capstone depth
All 36 weeks now include milestone-specific:
- required deliverable
- evidence/source requirement
- 20-point rubric
- defense prompt
- five differentiated daily tasks

Rubrics vary by milestone type: question framing, source synthesis, proposal/method, prototype/build, evidence analysis, revision/testing, ethics/accessibility, presentation/defense, and archive/transition.

Evaluator checkpoints remain Weeks 9, 18, 24, 34, 35, and 36.

## Regression hardening
Updated tests/test-grade12-course-parity.cjs to require:
- Senior Capstone in the Grade 12 schedule contract
- Senior Capstone pin metadata
- direct PE12 route
- no Grade 11 / Grade 10 identity leakage in PE12
- Capstone continuation publication
- evaluator checkpoint scoring
- weekly rubric rendering

## Commits
- Grade 12 schedule: 89ae768a28f6099176ec4c9bce75a233d8a4fdad
- pins / PE route metadata: e581fd16ef43912e20623763cfe3fb546a280f1f
- Grade 12 landing PE route: e361aa719f097c982b2b30bab7010639ff6b8643
- PE12 identity repair: 9e905d1a6079508a85017a007d79eb889626bcee
- Capstone depth: d17a1fb8ff2fdd75573ddeca7ecd93debc9de7b4
- Capstone ledger integration: 2035ddb8b26294c81c25e428dce3231c4bf17f2a
- execution sweep: 818f0bba478d5d4dd1078e204074067cec219adc
- sweep test: 0401e793f736b93b5e76f5394ef83806f79d470d
- Grade 12 parity test: 2f668e3be547613dd25cc2b7595be3d3ee07da53

## Verification boundary
Source contracts are updated. Hosted GitHub Actions and browser/device acceptance remain separate verification stages and must not be represented as passed until observed.
