# English 9–12 Release-Readiness Forensic Report

**Date:** 2026-11-15  
**Repository:** `vervenveda/Khaemenes_High.github.io`  
**Scope:** English 9, 10, 11, 12  
**Mode:** non-destructive release-readiness consolidation after Unit 01–12 evidence-architecture propagation

## PASS · academic continuum

- English 9–12 each retain 12 units and 36 weeks.
- Unit 01–12 evidence-alignment records exist for all four grades.
- The four-grade scaffold fade is explicit:
  - English 9 · Foundation
  - English 10 · Intermediate
  - English 11 · Advanced
  - English 12 · Senior Scholar
- Units 01–12 preserve grade-specific content rather than duplicating one course four times.
- Completion remains distinct from mastery.
- The 80% mastery rule is now represented in the shared canonical governance contract and grade manifests.
- Human review remains authoritative for complex writing, speaking, research, portfolio, oral-defense, multimedia, and capstone evidence.

## REPAIRED · governance consolidation

A single source of truth now governs the four English courses:

- `ENGLISH_9_12_A_PLUS_PLUS_PLUS_CANONICAL_CONTRACT.md`
- `ENGLISH_9_12_A_PLUS_PLUS_PLUS_CONTRACT.json`

Grade-local master specifications are overlays only. This prevents future policy drift and avoids maintaining four competing versions of the same mastery/accessibility contract.

## REPAIRED · typography parity

The course stylesheets now contain `KHAEMENES_ENGLISH_RELEASE_TYPOGRAPHY_V1`.

This higher-specificity release rule supersedes the older Week 01–30 embedded template values without rewriting approximately 120 week hubs:
- body/input/control text → 16px
- eyebrow/kicker text → 14px

The newer Week 31–36 pages already used the intended typography.

## REPAIRED · verified English 9 metadata/wording

- Week 25 duplicate phrase `connected connected` corrected.
- Weeks 28–36 now have descriptive metadata.
- The correction was deliberately limited to directly verified defects rather than relying on an incomplete code-search index.

## ADDED · release regression protection

Each grade now has:
`tests/release-readiness-parity.mjs`

The test guards:
- 12 unit routes
- 36 week routes
- Unit 01–12 evidence-alignment records
- duplicate IDs on weekly hubs
- canonical typography override
- 80% mastery contract
- completion ≠ mastery
- 12 / 36 / 180 course-shape contract

## REPAIRED · English 9 unit-assessment topology

English 9 now exposes twelve stable canonical assessment routes:

`assessments/unit-01/` through `assessments/unit-12/`.

These routes do not invent a second assessment system. They point to the existing evaluator-reviewed Scholarly Demonstrations and final-week mastery sections already embedded in the course.

- Units 01–04 → dedicated final-day Scholarly Demonstration pages.
- Units 05–12 → final-week `#assessment` mastery sections.
- Mastery remains 8/10 (80%) after evaluator review.
- Below mastery, the learner revises the weakest criterion and resubmits.
- Completion controls do not grant mastery.
- No automatic Monte Carlo reshuffle was introduced into these human-reviewed products.

The machine-readable authority map is:
`english-9/UNIT_ASSESSMENT_AUTHORITY_MAP.json`.

## HOLD · assessment runtime parity

English 9 midterm/final still use an older manual scoring runtime.

English 10–12 use the newer high-school assessment adapter and learning-context bridge.

Migration should be treated as an assessment-system project, not a presentation change, because it affects persistence, attempt history, retakes, best-score preservation, and learning-evidence publication.

## HOLD · regression depth parity

- English 9 has extensive legacy regression coverage.
- English 10 has Week 01 behavior/regression tests plus the new release parity test.
- English 11 and English 12 now have the release parity test but not the same deep behavioral suite as English 9.

Recommended next step: build shared cross-grade regression fixtures instead of cloning every English 9 test four times.

## HOLD · reading-pack completeness

The visible offline reading pack remains named for Weeks 01–06 in each course. Source-custody architecture extends beyond that point, but a full 36-week offline reading-package audit remains a separate release task.

## Release status

**Curriculum architecture:** PASS  
**Governance consolidation:** PASS  
**Verified presentation cleanup:** PASS  
**Unit evidence alignment:** PASS  
**Assessment topology parity:** PASS  
**Deep regression parity:** HOLD  
**Full offline reading-package parity:** HOLD

The next highest-value release task is the assessment architecture decision, followed by shared regression fixtures and the complete 36-week reading-package audit.
