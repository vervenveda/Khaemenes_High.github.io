# Mathematics Learning Games Library

This directory is the shared home for reusable Mathematics learning games created from this point forward.

## Naming rule

Game folders must be named by mathematical topic, concept, or durable game identity — never by course placement.

Good examples:

- `number-family`
- `factors-and-multiples`
- `prime-spy`
- `gcf-lcm-challenge`
- `operation-stepper`
- `estimate-defender`
- `integer-compass`
- `opposite-mirror`
- `integer-rank`
- `integer-sum-lab`
- `sign-forge`
- `dividing-integers`
- `coordinate-mission-control`
- `fraction-quotient`
- `fraction-forge`
- `rational-rank`
- `common-ground`
- `scale-forge`
- `reciprocal-relay`
- `decimal-signal`
- `rational-navigator`
- `ratio-atelier`

Do not prefix shared games with `unit-XX`, `lesson-XX`, a course code, or a grade number.

## Course placement

A shared game does not own a lesson assignment. Pre-Algebra, Algebra 1, Geometry, or another course may reference the same game wherever it is instructionally appropriate.

Course-specific lesson-to-game placement should live in the course's lesson engine, companion map, or future `game-map.json` — not in the shared folder name.

## Existing Pre-Algebra games

The already-connected games under `courses/mathematics/pre-algebra/learning-games/` remain there unchanged. They are not duplicated or moved as part of this cutover because preserving working lesson connections takes priority over folder normalization.

Those existing games may be migrated later only through an explicit copy/map/verify compatibility process.

## New-game rule

Beginning with the next reusable Mathematics game, create the canonical game here:

```text
courses/mathematics/assets/learning-games/<topic-or-game-name>/
```

Then connect the pertinent course lesson to that shared path.

## Reuse rule

A game may serve multiple courses when its mathematical objective is appropriate. Reuse the same canonical game rather than cloning course-specific copies.
