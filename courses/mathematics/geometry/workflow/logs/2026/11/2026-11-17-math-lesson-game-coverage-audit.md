# 2026-11-17 · Mathematics Lesson-to-Game Coverage Audit

- Repository: `vervenveda/Khaemenes_High.github.io`
- Scope: Pre-Algebra, Algebra I, Geometry
- Type: architecture audit · lesson companions · learning games
- State: source audit PASS

## Finding

The Academy mathematics architecture is already substantially built around a **lesson + targeted game/practice companion + worksheet/practice + mastery** model.

The shared canonical registry is:

- `courses/mathematics/assets/learning-games/game-registry.json`

Registry status observed:
- 82 canonical games
- 338 wired placements across math courses

The shared launcher is:

- `courses/mathematics/assets/shared-game-launcher.js`

It explicitly identifies game progress as local practice rather than official course assessment.

## Pre-Algebra

Official lesson files discovered: **103** including Unit 00 refresher.

Registered wired placements:
- 87 placements
- 86 unique lesson IDs with at least one game
- **83.5% raw lesson coverage**

Unit coverage:
- Unit 00: 0/6
- Unit 01: 6/6
- Unit 02: 8/8
- Unit 03: 8/8
- Unit 04: 8/8
- Unit 05: 8/8
- Unit 06: 7/7
- Unit 07: 6/8
- Unit 08: 7/8
- Unit 09: 7/7
- Unit 10: 7/8
- Unit 11: 6/8
- Unit 12: 8/8
- Unit 13: 0/5

The older explicit dynamic-game audit confirms Units 01–03 contain **22 explicit game companions** with exact lesson-return routing.

One Pre-Algebra lesson currently has two registered games:
- U01 L04: `gcf-lcm-challenge` + `group-or-cycle`

Unit 13 is a modelling/capstone sequence and is intentionally not game-covered in the current registry.

## Algebra I

Official lesson files discovered: **87**.

Registered wired placements:
- 88 placements
- 81 unique lessons with at least one game
- **93.1% lesson coverage**

Only six lesson files are uncovered in the current registry:
- U03 L05 · Literal Equations & Rearranging Formulas
- U03 L07 · Rate / Mixture / Distance / Financial Equation Models
- U13 L01–L04 · capstone modelling sequence

Several Algebra I lessons have two registered games.

The canonical lesson runtime:
- `courses/mathematics/algebra-1/assets/algebra1-lesson-companions-v1.js`

loads the central game registry and attaches games by exact unit/lesson placement.

The runtime states:
- games are optional practice;
- games never award mastery;
- games never replace the lesson check.

## Geometry

Official lesson files discovered: **90**.

Registered wired placements:
- 70 placements
- 63 unique lessons with at least one game
- **70% lesson coverage**

Several Geometry lessons already have two games, including:
- U02 L01
- U02 L02
- U03 L02
- U03 L03
- U03 L04
- U06 L01
- U06 L08

Uncovered Geometry lessons are concentrated in:
- U01 L04
- most of Unit 09
- Unit 11
- Unit 12
- Unit 13

This is important because many of those later units may be better served by **labs / CAD / modelling tools** rather than arcade-style games.

## Architecture conclusion

The Academy mathematics experience should not be designed as:

`lesson -> assessment`

The established pattern is closer to:

`interactive lesson / worksheet -> targeted game or lab -> written/evidence practice -> mastery check -> review`

The game/lab is a reinforcement companion, not the grading authority.

## Geometry implication

Geometry should reach parity with the successful Pre-Algebra / Algebra I model by:

1. preserving the interactive worksheet as the main lesson surface;
2. attaching a targeted game or lab only when it directly reinforces the lesson;
3. using existing shared games before creating new ones;
4. using OHMIC / Scientific Calculator / Higher Learning-inspired labs for concepts that are better modeled than gamified;
5. leaving capstone/modeling lessons game-free where a project/lab is pedagogically stronger.

## Immediate prototype implication

Unit 01 Lesson 01 should first prove the interactive worksheet architecture.

For future Geometry rollout, each lesson should receive one of:
- targeted game;
- interactive math lab;
- CAD/design task;
- calculator investigation;
- proof/reasoning studio;
- no companion when the lesson is better served by focused written reasoning.

This avoids forcing a game onto every lesson while preserving the engagement architecture that already works across Pre-Algebra and Algebra I.
