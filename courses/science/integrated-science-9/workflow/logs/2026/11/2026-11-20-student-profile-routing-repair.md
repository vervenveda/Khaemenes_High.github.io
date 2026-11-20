# 2026-11-20 · Student Profile → Science 9 routing repair

Science 9 class continuation was audited from the Grade 09 Student Profile / Daily Lessons surfaces.

## Repaired

- unfinished weekly work now publishes the first incomplete detailed lesson rather than stopping at the course dashboard week view
- post-readiness / pre-course-record fallback now opens Unit 00 Day 01 instead of skipping to Unit 01
- weekly mastery/reassessment remains in the Science 9 week workspace

## Verified route topology

- Unit 00: 5 detailed lessons
- Unit 01: 10 detailed lessons
- Units 02–12: 15 detailed lessons each
- 36 weeks total

New regression validator:
`tools/validate-grade09-science-routing.mjs`

Source-equivalent routing verification: PASS.
Hosted CI: unverified.
Browser/device acceptance: HOLD.
