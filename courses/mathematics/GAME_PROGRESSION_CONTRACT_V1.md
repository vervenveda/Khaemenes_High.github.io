# Khaemenes Mathematics Shared Game Progression Contract v1

**Recorded:** 2026-11-17  
**Scope:** shared mathematics learning games  
**Status:** canonical design contract

## Purpose

A shared mathematics game may support more than one course and more than one lesson.

The game must therefore distinguish:

- **course** — the curriculum context;
- **level** — the broad mathematical depth;
- **mode** — the exact lesson-specific challenge family.

These three values must not be treated as interchangeable.

## Canonical query contract

Shared game launchers may provide:

- `course`
- `unit`
- `lesson`
- `mode`
- `level`

### Level map

- `1` — Pre-Algebra foundation
- `2` — Algebra I / Geometry secondary level
- `3` — Algebra II advanced secondary level
- `4` — Precalculus / Trigonometry
- `5` — Calculus I

The level number is a broad progression marker only. The `course` value still controls subject context.

## Required behavior

If a game has multiple registry placements with different `mode` values, the game must not ignore `mode`.

It must do one of the following:

1. select a mode-specific challenge bank;
2. select a mode-specific subset of a shared bank;
3. alter the mathematical representation or reasoning target in a documented way.

Changing only labels while serving the same unrelated challenge set does not satisfy the contract.

## Pre-Algebra completion rule

A Pre-Algebra lesson counts as game-covered only when:

1. the lesson has a wired placement in `game-registry.json`;
2. the lesson runtime actually surfaces that placement;
3. the game opens successfully;
4. the game honors the mapped lesson mode when applicable;
5. the return route leads to the correct lesson;
6. game practice remains separate from official mastery.

## Higher-math synchronization

The preferred progression is:

`same game family -> higher course -> higher level -> more advanced mode`

Examples already present in the registry:

- Integer Compass:
  - Pre-Algebra signed contexts
  - Algebra I signed slope/rate
  - Geometry translation vectors
  - Algebra II vector components

- Estimate Defender:
  - Pre-Algebra reasonableness
  - Algebra I precision / percent error
  - Geometry measurement precision
  - Algebra II technology / logarithmic estimation

- Operation Stepper:
  - Pre-Algebra operation order / substitution
  - Algebra I formula evaluation
  - Geometry formula evaluation
  - Algebra II function composition

## Assessment boundary

Game scores are practice indicators.

They do not:
- award course mastery;
- replace lesson checks;
- replace unit assessments;
- alter protected assessment state.

## Implementation priority

1. Make Pre-Algebra registry placements visible across Units 04–13.
2. Repair multi-placement Pre-Algebra games so they honor `mode`.
3. Close the remaining regular-course lesson gaps.
4. Preserve Unit 13 as modelling/capstone where a game is not instructionally appropriate.
5. Reuse the same game families at higher levels rather than creating duplicate games.
