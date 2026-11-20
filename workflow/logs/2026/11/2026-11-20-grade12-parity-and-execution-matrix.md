# 2026-11-20 · Grade 12 parity implementation and 9–12 execution expansion

## Scope
Implemented the next priorities from the Grades 9–12 forensic curriculum audit on main. Changes were surgical and preserve specialist assessment authorities and existing learner records.

## Grade 12 Physical Education
Created a dedicated senior course:
- `courses/physical-education/grade-12-instruction.json`
- `courses/physical-education/grade-12.html`

Structure:
- 36 weeks
- 180 daily lessons
- 25 authored assessment candidates per week
- 900 total candidates
- Week 1: 20 current
- Weeks 2–36: 15 current + 5 delayed retrieval
- browser attempts remain provisional
- formal mastery requires authorized teacher review

The shared PE portal now routes Grade 12 directly to the dedicated course.

Commits:
- data: `1352564ca3e86b68b555be1c2c321a18d71088f5`
- course surface: `ccb7a7fa91acf1ece8b8f1923e7d94f7e7c14c2e`
- route: `1aa56cf7b156850a85f444a91371d6b6361162c6`

## Physics & Engineering 12
Forensic review found the existing course already contains:
- 36 weeks
- five-day weekly instruction
- weekly inquiry/lab expectations
- 80% weekly mastery gating
- large tagged question bank
- misconception diagnostics
- 40-question cumulative midterm practice
- 50-question cumulative final practice
- 36 durable weekly lesson directories

No rebuild was performed.

Added a separate non-grading delayed-retrieval record to weekly evidence:
- retrieve a prior principle/model/equation/evidence rule/lab limitation before checking notes
- apply it to the current phenomenon
- verify and record correction
- retrieval evidence cannot create, replace, or raise the reviewed mastery score

Commit: `1041269a2a86e39b7313fc266ef301919b065538`

## Senior Capstone
Created a dedicated Grade 12 Senior Capstone:
- `courses/capstone/senior-capstone/course-map.json`
- `courses/capstone/senior-capstone/index.html`

Structure:
- 36 weeks
- five evidence actions per week
- proposal defense
- midyear conference
- final capstone defense
- artifact/source/revision/feedback custody
- exportable local evidence
- learner self-completion cannot certify a grade

Grade 12 landing now has a direct Open Senior Capstone route.

Commits:
- map: `e7f76e25f48764b1fc6e824d01a824fc4f11eb36`
- executable surface: `0002eb4b95199ce1b98672a64745809eb7a82e5a`
- Grade 12 route: `b4befe33bf74b5ccc061e131d831856c8df51d64`

## Senior mathematics handoff
Verified the High School outbound routes for:
- Precalculus & Trigonometry
- Calculus I

Both targets exist in `vervenveda/Khaemenes_Higher_Learning.github.io` as complete 36-week Higher Learning courses.

Boundary:
- outbound destination: VERIFIED
- High School -> Higher Learning course availability: VERIFIED
- automatic Higher Learning completion/assessment return into High School portfolio/transcript: NOT CERTIFIED

Do not represent the advanced-math round trip as complete until a tested return-record bridge exists.

## Canonical execution matrix
Expanded:
`courses/shared/course-execution-matrix-v1.json`

The matrix now contains 22 canonical executable/handoff entries covering:
- Pre-Algebra through Algebra II
- English 9–12
- Science 9–12
- Social Studies 9–12
- PE 10–12
- Senior Capstone
- Precalculus/Trigonometry handoff
- Calculus I handoff

The two Higher Learning mathematics courses remain `placement-handoff` with `assessment_authority: not-complete`.

Commit: `5e62112cf9f1ded67d9c5f7ff06d3e34b1f467f7`

## Regression coverage
Added:
`tests/test-grade12-course-parity.cjs`

It requires:
- PE12 36 weeks × 5 days
- 25 candidates per week
- 15+5 delayed-retention policy
- Physics 12 delayed-retrieval layer
- Senior Capstone 36×5
- Grade 12 capstone route
- advanced-math handoff boundary

Integrated into:
`.github/workflows/course-execution-matrix.yml`

The workflow now watches PE and Capstone paths and runs the Grade 12 parity regression.

Commits:
- test: `54634c07c01aba230f38d07f33352b6bdaea2a6d`
- workflow: `d7c42a6a18776d11f046253f04ad179cc44c8b98`

## Verification boundary
Source contracts are in place. Hosted GitHub Actions and real-browser/device acceptance must be checked separately before claiming full runtime certification.

No existing student records were reset. No specialist assessment bank was replaced. No automatic mastery or credit authority was introduced.
