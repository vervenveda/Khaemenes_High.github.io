# 2026-11-20 · Grade 09 retention curriculum implementation

## Scope

Implemented the recommendations from the Grade 09 curriculum-depth audit without changing existing Academy mastery thresholds or evaluator authority.

## Standard

Added:

`workflow/specs/grade09-retention-curriculum-standard-v1.md`

The standard distinguishes instructional quantity, learning quality, retention architecture, and observed retention. It prohibits claiming actual learner retention percentages without longitudinal evidence.

Commit:
`81c715d6093d76eaba3b9cee16e11a7c78b0abe1`

## Integrated Science 9

Weekly mastery now uses:
- Week 1: 10 current/readiness questions
- Weeks 2–36: exactly 8 current + 2 delayed-retrieval questions

The existing Monte Carlo engine now receives explicit source quotas. Weekly mastery remains 80%; official midterm/final authority is unchanged.

Delayed-item provenance and a separate delayed-retention percentage are preserved in each new submitted weekly Monte Carlo summary.

Commits:
- retention blueprint: `bec1f0e751fed2e3da52d1df8b13334d1580f93f`
- retention score recording: `8ddd2f0745b60944712714b0a52078f464b523a7`

## English 9

Added non-grading delayed retrieval to weekly pages:
- near-lag retrieval from approximately two weeks earlier
- longer-lag retrieval from approximately six weeks earlier
- retrieve first, verify second, record correction/refinement

These fields are explicitly excluded from the evaluator-reviewed weekly evidence-prepared calculation and cannot award or substitute for 8/10 mastery.

Commit:
`4400587ebe619480014b2be53711038165a4fed3`

## Physical Education 9

New weekly blueprint:
- Week 1: 20 current questions
- Weeks 2–36: exactly 15 current + 5 delayed-retrieval questions

The 80% local progression rule and teacher-review boundary are unchanged.

PE assessment attempts now preserve question provenance and compute separate current/delayed performance. Review screens display delayed-retention performance when available.

Commits:
- preserve provenance: `56b6ae09ef4c6f2eadff1744ec92c103652d0ed5`
- 15+5 weekly draw: `10fdb05c038b6d8e5eefa03a87075d6822b441ce`
- calculate delayed/current scores: `9506ddabf7f7a2625be759c6346119c4650821ca`
- review display: `d40fd291b32309fd3ae0e53d530fd112a4199dc4`
- renderer syntax correction: `f2f02fc7a9454bb373309f657734c5cb0d03ffeb`

## Protected reference models

No curriculum changes were made to:
- Pre-Algebra 8-current + 2-delayed mastery
- Algebra I 8-current + 2-delayed mastery
- Global Studies retrieval-before-review / constructed-response model
- Psychology 101 parallel-retake and cumulative-checkpoint model

These remain reference implementations under the new Grade 09 standard.

## Regression validator

Added:

`tools/validate-grade09-retention-curriculum-v1.mjs`

Commit:
`0a89ee37c73bdc41ab23b0c5621cdd6a3d1e1ac5`

Integrated into:
`.github/workflows/no-page-regulator.yml`

Commit:
`4959ab1cc1253d01a751e60104f18e6b27b58832`

## Verification

Source-equivalent retention validator: **PASS**

JavaScript parsing:
- Science 9 dashboard: PASS
- English 9 course engine: PASS
- PE assessment engine: PASS
- PE main executable inline course block: PASS

Hosted GitHub Actions: **UNVERIFIED** — no workflow run was returned for the integration commit.

Browser/device acceptance: **HOLD**

## Observed-retention boundary

Only new assessment attempts that contain delayed-item provenance can support an actual delayed-retention percentage.

Older aggregate mastery records must not be retroactively interpreted as delayed-retention evidence.

