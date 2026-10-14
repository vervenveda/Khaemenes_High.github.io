# Mathematics game and course synchronization — forensic checkpoint

**Date:** 2026-10-14 · **Branch:** `main` · **Status:** source/CI checks passed; browser playthroughs and optional placement review remain separate.

## 1. Canonical inventory — complete

- 70 canonical game folders each have an `index.html` and exactly one matching registry key.
- 48 games currently have at least one registered lesson placement; 22 are explicitly unplaced.
- Existing canonical paths and retired-path protection remain under `courses/mathematics/tools/validate-shared-games.mjs`.

## 2. Broken and outdated lesson routes — verified

- Site-wide route validation checks file references.
- Game-specific validation checks each declared placement, its lesson, canonical game path, and required launcher.
- New `courses/mathematics/tools/test-cross-course-game-sync.mjs` independently checks that actual Algebra I, Geometry and Algebra II launcher tags have exact matching registry unit, lesson, game ID, and mode. It also detects duplicate launchers and unregistered game IDs.
- Pre-Algebra's dynamic lesson-engine mapping remains checked by `validate-shared-games.mjs` rather than imposing the higher-course HTML launcher format on it.

## 3. Duplicate-version protection — verified, no destructive purge

- Existing registry declares 33 retired game paths and the validator forbids executable copies at those paths.
- No canonical game folders were removed or overwritten during this audit.
- Do not delete unverified variants based on similar names alone: different learning modes and prerequisite levels can be intentional.

## 4. Curriculum/lesson alignment — reconciled where already wired

The registry currently contains these declared placements:

| Course | Registered game placements |
| --- | ---: |
| Pre-Algebra | 36 |
| Algebra I | 50 |
| Geometry | 42 |
| Algebra II | 82 |
| **Total** | **210** |

**22 currently unplaced** should not be treated as broken. Seventeen are independent Pre-Algebra/number-learning resources whose best lesson destinations require content-level review; five are new formative Algebra I challenge rounds.

### Suggested *future*, not yet wired, placements for the five standalone formative challenges

| Game | Suggested student review point | Why placement is deferred |
| --- | --- | --- |
| Algebra Reasoning Foundations | Algebra I Unit 01 end-of-unit review | Four questions covering several lessons, not a substitute for mastery |
| Structure & Balance Challenge | Algebra I Unit 04 end-of-unit review | Mixes concepts from Units 02–04 |
| Functions & Systems Challenge | Algebra I Unit 07 end-of-unit review | Mixes Units 05–07; avoid showing advanced tasks prematurely |
| Exponents to Radicals Challenge | Algebra I Unit 11 end-of-unit review | Mixes Units 08–11 |
| Evidence & Modelling Challenge | Algebra I Unit 13 capstone review | Mixes Units 12–13; cannot replace capstone evidence |

No new active lesson links, course progression, grade calculations, or STOS artifacts were changed. These recommendations should be adopted only after beta testing and teacher review.

## 5. Regression coverage — extended and passing

- Existing Mathematics Shared Games Validation checks registry coverage, local links, game scripts, storage evidence, offline cache and lesson routes.
- New exact cross-course synchronization test runs in this workflow on `main`.
- The separate `test-algebra-formative-gameplay.mjs` simulates the five new formative games, including 57 mixed-answer questions, answer gating and restart.
- Additional mobile layout, browser events, spoken feedback, mathematical spot-checking and printed materials still require a live-device QA phase; source and CI checks cannot certify them.

## Protection rules

- Retain **80% official mastery gating**, canonical learner-scoped evidence and offline support.
- Keep the five new games registered as `canonical-unplaced` with no formal grading or lesson unlocks.
- Keep all changes in canonical `main`, preserve STOS files and do not create competing game copies.
