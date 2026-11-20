# 2026-11-20 · Integrated Science 9 assessment shell verification

Integrated Science 9 assessment presentation was normalized to the canonical VNV/Khaemenes shell while retaining science assessment authority.

## Covered

- Assessment Center
- Unit 00 readiness / diagnostic
- five cumulative benchmark surfaces plus final practice
- Unit 01–12 mastery quizzes
- Unit 01–12 unit assessments

## Preserved assessment authority

- shared Monte Carlo runtime
- cumulative and unit question banks
- readiness app and routing
- unit quiz and assessment app runtimes
- learner scope `integrated-science-9`
- published 80% mastery/correction/retest rules
- human-scored constructed-response boundaries

## Regression validator

`tools/validate-science9-assessment-vnv-shell.mjs`

Source-equivalent verification:
- Units 01–06 core unit surfaces: PASS
- Units 07–12 core unit surfaces: PASS
- Assessment Center/readiness/cumulative surfaces: PASS

Hosted Actions run: unverified.
Browser/device acceptance: HOLD.
