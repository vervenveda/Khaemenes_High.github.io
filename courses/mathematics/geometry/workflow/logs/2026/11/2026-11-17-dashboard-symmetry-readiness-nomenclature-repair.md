# 2026-11-17 · Geometry Dashboard Symmetry and Readiness Nomenclature Repair

- Repository: `vervenveda/Khaemenes_High.github.io`
- Timezone: America/New_York
- Type: repair · symmetry · nomenclature
- State: source repair PASS; rendered browser/device acceptance HOLD

## Dashboard symmetry

The Geometry dashboard rendered a major peer-card split as:
- Learner Record: `col4`
- Next Step: `col8`

This conflicted with the current centered/equal-grid Mathematics blueprint.

Repair:
- Learner Record -> `col6`
- Next Step -> `col6`

The same dashboard already has:
- four equal `col3` metric cards;
- three equal `col4` feature cards.

## Duplicate Games & Tools card

An older `injectGamesCard()` runtime appended an additional `col4` Math Games & Tools card even though the dashboard already contains a canonical Games & Tools card.

This created:
- duplicate functionality;
- an orphan fourth `col4` feature card;
- asymmetry in the feature row.

Repair:
- the injector now exits when a real `[data-games-view]` control already exists in the dashboard grid.

Commit:
- `bec5925d3a3fa4f6d350ba2930e8343623494520`

## Geometry readiness naming

The landing hero contained:
- `Open-Age · Algebra I Readiness · 36 Weeks`

The Geometry unit browser also contained:
- `Algebra I Readiness Diagnostic`

And the continuation guidance said:
- `Confirm Algebra I readiness...`

These were copied-forward labels. Algebra I competency may be prerequisite evidence, but the assessment itself is Geometry's readiness diagnostic.

Repairs:
- hero -> `Open-Age · Geometry Readiness · 36 Weeks`
- course map card -> `Geometry Readiness Diagnostic`
- continuation guidance -> `Confirm Geometry readiness...`

Commits:
- landing label: `846c4ad47c503ab02f5f2d1546afb7465f2184d7`
- app labels: `a746099cf1a3e4e9e4d14d36b9150c7158da3822`

## Boundaries

No readiness questions, prerequisite standards, scores, progression logic, learner data, or mastery gates were changed.

## Remaining HOLD

Rendered acceptance still needs a real JavaScript-capable viewport check. The available text crawler does not execute the Geometry presentation unifier, so it cannot certify final header/ticker/layout behavior.

## Next target

Review the lesson-support experience now that the former right sidebar is a centered support grid:
- Vocabulary;
- Learning Pathways;
- Connected Studio;
- Local Completion.

Goal: reduce page length and cognitive clutter with selective collapsible sections while keeping completion/mastery controls immediately usable.
