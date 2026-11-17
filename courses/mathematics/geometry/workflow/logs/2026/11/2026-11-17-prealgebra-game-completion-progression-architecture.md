# 2026-11-17 · Pre-Algebra Game Completion and Progression Architecture

- Repository: `vervenveda/Khaemenes_High.github.io`
- Type: repair · game runtime · progression architecture
- State: shared runtime bridge PASS; mode completion pending

## Founder direction

Complete Pre-Algebra games first, then reuse the same game families at higher mathematical levels through progressive modes.

## Coverage baseline

Pre-Algebra:
- 103 lesson files including Unit 00 refresher
- 86 unique lessons with registered game placements
- 83.5% raw coverage
- regular course coverage is substantially higher once Unit 00 and Unit 13 capstone are separated from ordinary lessons

Algebra I:
- 81/87 lessons with registered games
- 93.1%

Geometry:
- 63/90 lessons with registered games
- 70%

## Runtime gap discovered

Later Pre-Algebra lesson engines did not directly load:
- `game-registry.json`
- `shared-game-launcher.js`

Therefore registry placement did not itself prove that the student could see the game.

## Repair completed

Created:
- `courses/mathematics/pre-algebra/assets/prealgebra-game-registry-bridge-v1.js`

Behavior:
- path-scoped to Pre-Algebra lesson pages;
- Units 01–03 are intentionally skipped because they retain their explicit validated companion maps;
- Units 04–13 read the central game registry;
- exact unit/lesson placements are resolved dynamically;
- duplicate existing game links/scripts are avoided;
- shared launcher is used rather than recreating companion UI;
- practice remains separate from official mastery.

Commits:
- initial bridge: `fdc4b92f60877d9992d16213db2c9982c3bc734d`
- corrected shared-assets root / Unit01–03 preservation: `fef29716c9475675eec871fb18ec68af11b159c3`

Canonical High School chrome now loads the bridge on Pre-Algebra lesson routes:
- commit `4550263ddb646846dee38da13e6b19921655ad87`

## Level parameter added

The shared game launcher now passes a backward-compatible `level` query parameter.

Current mapping:
- 1 Pre-Algebra
- 2 Algebra I / Geometry
- 3 Algebra II
- 4 Precalculus / Trigonometry
- 5 Calculus I

Commit:
- `7fd99800f8894d55c8567abbac4756a357a1b602`

Games that do not yet read `level` continue operating unchanged.

## Critical mode audit finding

The registry already stores lesson-specific `mode` values, but several shared game engines with multiple Pre-Algebra placements do not currently read the `mode` parameter.

Examples:
- Operation Stepper
- Coordinated Mission Control
- Equation Balance Lab
- Inequality Number Line
- Slope & Rate Studio
- Congruence / Similarity Lab
- Statistics Detective
- Probability Quest
- Algebra Structure & Balance Challenge
- Algebra Functions & Systems Challenge
- Equivalence Forge
- Boundary & Area Lab

This means game completion must be measured by **correct lesson mode**, not merely presence of a link.

## Canonical contract

Created:
- `courses/mathematics/GAME_PROGRESSION_CONTRACT_V1.md`

Commit:
- `305278e5cd8cc15c3abad17dfd6e61dec2bcf0c5`

The contract defines:
- course context;
- broad level;
- lesson mode;
- completion criteria;
- higher-math synchronization;
- mastery boundary.

## Remaining regular-course gaps

After excluding Unit 00 refresher and Unit 13 capstone, the remaining uncovered Pre-Algebra lessons are concentrated in:
- U07 L07
- U07 L08
- U08 L07
- U10 L04
- U11 L01
- U11 L08

These should first be matched to existing game families. New games should be created only where no honest reusable engine exists.

## Next repair order

1. Make multi-placement Pre-Algebra game engines honor `mode`.
2. Validate correct lesson return routes.
3. Close the six regular-course coverage gaps.
4. Recalculate Pre-Algebra coverage.
5. Only after Pre-Algebra is stable, propagate the same level/mode pattern upward to Algebra I, Geometry, Algebra II, Precalculus and Calculus.
