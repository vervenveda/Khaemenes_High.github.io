# Mathematics Learning Games × Course Synchronization Audit
**Date:** 2026-10-14 · **Status:** read-only placement review (no student lesson rewiring)

## Canonical inventory

- **70** registered canonical games in `game-registry.json`, including five new optional Algebra I formative challenges.
- **210** declared placements: Pre-Algebra **36**, Algebra I **50**, Geometry **42**, Algebra II **82**.
- Those placements touch **35**, **43**, **35**, and **80** distinct unit/lesson identifiers respectively. This is *coverage of declared placements*, not proof of every canonical course lesson being supplied with a game.
- **22 games are unplaced** (17 existing standalone resources and five new Algebra I formative challenges). They are not necessarily defective or obsolete.
- Registry statuses: **24 canonical-v3**, **24 canonical-v1**, **22 canonical-unplaced**. A status difference alone is not grounds to delete an older game.

## Confirmed synchronization risks

1. **No single student-facing game index explains the full four-course progression.** The launcher is a page-level companion; the registry is the authoritative placement ledger. Give students an optional game library organized by course and topic, with an explicit distinction between formative exploration and mastery.
2. **Multiple games share certain lessons.** The most conspicuous are Algebra I U01-L02, U02-L07, U04-L01, U06-L01, U06-L02, U09-L06 and U10-L03; Geometry U02-L01, U02-L02, U03-L02/03/04, U06-L01 and U06-L08. Two assignments can be valuable, but lesson cards should distinguish **Core companion** vs **Optional extension**, not show competing equal-priority launch buttons.
3. **Unplaced games require individual topic and difficulty review.** 17 earlier standalone games remain unplaced. Do not auto-wire or delete them based on names. Record content evidence and verify a matching lesson before promotion.
4. **The five newly created Algebra I formative games contain broad multi-lesson question banks.** Assign them as *unit review / independent practice*, not as graded lesson checks. They write no mastery evidence; requiring 80% from these games would be a misleading course gate.
5. **Legacy paths are retained in some canonical-v3 registry entries.** Existing `retired_paths` document old filenames that may still be needed for backlinks and migration. Audit actual references before purging, and do not change STOS files.

## Proposed student-friendly placement plan (not yet wired)

| Game | Target destination | Role | Constraint |
|---|---|---|---|
| Algebra Reasoning Foundations | Algebra I U01 resources / unit review | Optional formative | Keep the existing U01 lesson-specific companions |
| Structure & Balance Challenge | Algebra I Units 02–04 review page | Optional formative | Do not treat as lesson-specific assessment |
| Functions & Systems Challenge | Algebra I Units 05–07 review page | Optional formative | May supplement—not replace—specialized slope and function games |
| Exponents to Radicals Challenge | Algebra I Units 08–11 review page | Optional formative | Maintain dedicated polynomial/quadratic/radical labs |
| Evidence & Modelling Challenge | Algebra I Units 12–13 study / capstone preparation | Optional formative | Not certified evidence for the capstone |

### High-value unplaced topical candidates to verify

- `exponent-pattern-explorer`, `exponent-properties-lab`: compare content with Pre-Algebra powers and Algebra I Unit 08 before placement.
- `scientific-notation-operations-mission`, `scientific-notation-signal-lab`: compare with Algebra I Unit 08 scientific notation; choose core vs extension by difficulty.
- `irrational-root-estimation-quest`, `perfect-powers-roots-quest`: compare Pre-Algebra number systems with Algebra I Unit 11 radical work; avoid redundant lessons.
- `ratio-table-trail`, `proportion-solver-mission`: review Pre-Algebra proportional reasoning and Algebra I Unit 03 modelling.
- `interest-fees-decision-lab`, `market-math-mission`, `small-business-math-lab`: review Algebra I Unit 12 finance and Unit 13 capstone modelling; verify numerical accuracy, fairness, fees, and assumptions.
- Percentage-themed games: evaluate prerequisite level and any repeated question/response patterns before choosing one as core.

## Release gates for clean synchronization

1. Compare every proposed placement against actual unit-map lesson file and mathematical skill objective.
2. Confirm the registry's `mode`, `query` and `wired` data matches the shipped HTML launcher attributes. For older placements with no explicit mode in the URL, preserve existing semantics unless verified.
3. No new game should create or unlock official mastery. Required lesson, week, unit, midterm and final thresholds stay at **80%**.
4. Add a labeled `Core game` and `Optional extension` priority on pages with multiple assignments only after browser testing.
5. Verify all canonical relative URLs, game feedback and restart, offline precache, learner isolation, tablet and Linux browsers, and source integrity.
6. Complete beta testing before changing active lesson scripts or retiring legacy aliases. Do not modify STOS.

## Audit limitations

Repository tests verify many canonical paths, game behaviors, and offline caches. This audit has **not** independently reproduced every one of the 70 games in a real browser, confirmed accuracy of every game question, or established that every lesson title and every query-mode pair matches the rendered activity. Treat proposed placements as review candidates, not production-ready wiring instructions.
