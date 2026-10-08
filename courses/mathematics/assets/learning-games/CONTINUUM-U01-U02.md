# Mathematics Shared Games Continuum — Units 01–02

Checkpoint scope: Pre-Algebra Unit 01 Lesson 01 through Unit 02 Lesson 08.

## Finished

All 14 existing games in this span now have canonical shared copies under:

`courses/mathematics/assets/learning-games/`

1. U01-L01 — Number Family
2. U01-L02 — Factor Structure Lab
3. U01-L03 — Prime Spy / Composite Catch
4. U01-L04 — GCF / LCM Challenge
5. U01-L05 — Operation Stepper
6. U01-L06 — Estimate Defender
7. U02-L01 — Integer Compass
8. U02-L02 — Opposite Mirror
9. U02-L03 — Integer Rank
10. U02-L04 — Integer Sum Lab
11. U02-L05 — Opposite Shift
12. U02-L06 — Sign Forge
13. U02-L07 — Quotient Check / Dividing Integers
14. U02-L08 — Coordinated Mission Control

Audit result:
- 14/14 canonical shared game files present.
- 14/14 Pre-Algebra lesson-engine entries point to the shared canonical game.
- 57 total registry placements exist across Pre-Algebra, Algebra I, Geometry, and Algebra II.
- 57/57 target lesson routes exist.
- 43/43 higher-course placements contain the shared launcher, correct game id, and correct mode.
- 14/14 shared game inline JavaScript syntax checks pass.
- All recorded registry placements are marked wired.
- Legacy Pre-Algebra game copies remain intentionally retained as rollback compatibility.
- Earlier failed workflow states are ancestors of current main and were superseded by repair commits.
- Current release/deployment workflow state is green.

## Maintenance correction at this checkpoint

Repaired stale pre-migration return links in:
- Number Family
- Opposite Shift
- Dividing Integers

Each now returns to the actual Pre-Algebra lesson from the canonical shared game path.

## Deferred cleanup

Do not purge yet:
- `courses/mathematics/pre-algebra/learning-games/`
- `courses/mathematics/assets/assets/`

The nested `assets/assets/` tree is a duplicate cleanup target and no indexed references were found, but deletion is deferred until the shared-game migration is farther along and a dedicated reference audit is performed.

## Current step

Units 01 and 02 are audited and closed.

A dedicated `Mathematics Shared Games Validation` workflow now guards future migrations. It checks canonical game presence, legacy rollback presence, registry placements, Pre-Algebra engine mappings, higher-course launcher/game/mode wiring, canonical local links, and inline JavaScript syntax.

## Next

Proceed to Pre-Algebra Unit 03, Lesson 01 and continue the same process:
1. inspect the existing game;
2. identify legitimate Algebra I / Geometry / Algebra II progression;
3. upgrade the canonical shared game;
4. wire course lessons through the shared launcher;
5. retain legacy rollback copy;
6. run route, syntax, registry, and workflow checks.

## Long-term goal

One canonical Mathematics game library:

`courses/mathematics/assets/learning-games/`

with course-appropriate modes used by Pre-Algebra, Algebra I, Geometry, and Algebra II, followed by audited retirement of redundant legacy game trees.
