# Mathematics Learning Games — Placement Review (2026-10-14)

**Scope:** 22 `canonical-unplaced` games from `game-registry.json`; 70 canonical games total at review. **Decision:** approve 17 clear Pre-Algebra lesson targets for a *future wiring pass*, preserve five multi-unit Algebra I formative games as intentionally unplaced. Approval of a target is not a claim that the lesson is already linked, tested in a browser, or mastered.

## Seventeen approved lesson targets (not yet wired)

| Game folder | Course | Unit | Lesson |
|---|---|---|---|
| ratio-table-trail | Pre-Algebra | 04 | 02 |
| proportion-solver-mission | Pre-Algebra | 04 | 05 |
| percent-benchmark-studio | Pre-Algebra | 05 | 01 |
| percent-of-quantity-lab | Pre-Algebra | 05 | 02 |
| percent-rate-whole-detective | Pre-Algebra | 05 | 03 |
| percent-change-mission | Pre-Algebra | 05 | 04 |
| market-math-mission | Pre-Algebra | 05 | 05 |
| small-business-math-lab | Pre-Algebra | 05 | 06 |
| interest-fees-decision-lab | Pre-Algebra | 05 | 07 |
| percentage-point-change-studio | Pre-Algebra | 05 | 08 |
| power-grouping-quest | Pre-Algebra | 06 | 01 |
| exponent-pattern-explorer | Pre-Algebra | 06 | 02 |
| exponent-properties-lab | Pre-Algebra | 06 | 03 |
| perfect-powers-roots-quest | Pre-Algebra | 06 | 04 |
| irrational-root-estimation-quest | Pre-Algebra | 06 | 05 |
| scientific-notation-signal-lab | Pre-Algebra | 06 | 06 |
| scientific-notation-operations-mission | Pre-Algebra | 06 | 07 |

The 17 source games identify these destinations in their title or return link. Verify exact unit-map route, existing lesson engine placement and gameplay before marking `wired:true` or adding registry placements. Do not infer that a game returning to a lesson is launched *from* that lesson.

## Five approved as standalone formative games, not single-lesson placements

- `algebra-reasoning-foundations` — Algebra I Unit 01, four questions.
- `algebra-structure-balance-challenge` — Algebra I Units 02–04, nine questions.
- `algebra-functions-systems-challenge` — Algebra I Units 05–07, twelve questions.
- `algebra-exponents-radicals-challenge` — Algebra I Units 08–11, sixteen questions.
- `algebra-evidence-modelling-challenge` — Algebra I Units 12–13, sixteen questions.

These games passed automated full-round playthrough and are registered with `migration_state: formative-standalone-no-mastery-integration`. They must not write official grades or unlock mastery. A future learning-resource directory may link them as optional review activities without creating an official placement.

## Release gates for Pre-Algebra wiring

1. Check the exact target route exists in the current unit map.
2. Inspect existing lesson game references and remove only demonstrably obsolete duplicates.
3. Confirm each game's canonical `index.html` and `README.md` are present (add missing READMEs).
4. Wire one canonical shared-game route per approved lesson, preserving the current graded flow, question bank and 80% gate.
5. Mark a registry placement `wired:true` only when the launcher/lesson-engine evidence is present and the shared-game validator passes.
6. Verify game returns, persistence isolation, offline cache, browser controls and disabled/locked states.
7. Do not change unrelated math games or private STOS components.

This review is a placement approval record only. No active lesson route or game registry field was changed by its creation.
