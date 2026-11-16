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

## REPAIRED · assessment runtime parity

English 9 midterm and final now use the shared high-school assessment infrastructure with a fixed-form policy:

- existing midterm bank preserved at 12 items;
- existing final bank preserved at 16 items;
- existing answer keys preserved exactly;
- closed-book objective assessment;
- 80% objective mastery target;
- learner-scoped attempt history and best-score retention;
- same question and answer order on correction attempt;
- writing remains separate and human-reviewed.

The shared Monte Carlo engine now supports optional `openFixedSession`; its default randomized behavior is unchanged for existing Grade 10–12 assessments.

This resolves the runtime gap without forcing English 9 into reshuffled retries.

## REPAIRED · shared cross-grade regression parity

A single canonical regression suite now protects all four courses:

`courses/language-arts/tests/english-9-12-regression.mjs`

Each grade exposes a thin `tests/cross-grade-regression.mjs` wrapper so the same source of truth runs from English 9, 10, 11, or 12.

The shared suite protects:
- canonical governance and grade roles;
- 12 units / 36 weeks / 180 daily blocks;
- all 48 unit routes;
- all 48 unit reading dossiers;
- all 48 Unit 01–12 evidence-alignment records;
- all 144 weekly hubs;
- duplicate IDs on audited unit, week, and assessment pages;
- 16px body / 14px eyebrow release typography;
- 12 canonical unit-assessment routes per grade;
- English 9 human-review unit authority;
- English 10–12 objective unit-bank structure;
- diagnostic, midterm, and final route presence;
- English 9 fixed-form cumulative banks;
- shared assessment-adapter syntax and fixed-form compatibility.

English 9 still has more historical week-specific behavior tests than Grades 10–12. Those are useful course-specific tests, but the release-critical cross-grade invariants are now protected from one shared suite instead of four drifting copies.

## HOLD · reading-pack completeness

The visible offline reading pack remains named for Weeks 01–06 in each course. Source-custody architecture extends beyond that point, but a full 36-week offline reading-package audit remains a separate release task.

## Release status

**Curriculum architecture:** PASS  
**Governance consolidation:** PASS  
**Verified presentation cleanup:** PASS  
**Unit evidence alignment:** PASS  
**Assessment topology parity:** PASS  
**Shared cross-grade regression parity:** PASS  
**Full offline reading-package parity:** HOLD

The next highest-value release task is the assessment architecture decision, followed by shared regression fixtures and the complete 36-week reading-package audit.
