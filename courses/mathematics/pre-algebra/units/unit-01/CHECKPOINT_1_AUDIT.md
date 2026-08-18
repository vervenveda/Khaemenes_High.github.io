# Unit 01 Forensic Audit · Checkpoint 1

## Scope
Unit home, shared design system, shared progress state, progression gate, and mastery-threshold consistency.

## Confirmed findings

1. **Mastery threshold drift** — `unit-map.json` and the newer engines used 80%, while the embedded unit-map fallback, README, teacher guide, and pathway practice configs still contained 70%/75% values.
2. **Manual review could masquerade as mastery** — the dashboard's `Mark Reviewed` control wrote directly into `completedLessons`, the same array used by scored lesson mastery.
3. **Progression-gate code existed but had no visible gate** — `unit-dashboard.js` contained `data-mastery-gate` logic, but Unit 01 had no matching gated control or `masteryGateMessage` element.
4. **Two dashboard status targets were missing** — `lessonCompletionCount` and `masteryGateMessage` were referenced by JavaScript but absent from `index.html`.
5. **Shared lesson theme regression** — lesson pages still referenced legacy tokens such as `--bg2`, `--gold2`, `--serif`, `--rs`, and `--text`; the refreshed `unit.css` no longer defined those aliases. The theme engine toggled `data-theme`, but `unit.css` had no dark-theme variable block, so the toggle could not produce a complete visual theme change.
6. **Relative-link integrity is good** — static link checking found no broken local `href`, stylesheet, script, or image paths inside Unit 01.
7. **JavaScript syntax is good** — all three shared Unit 01 engines pass `node --check` after the checkpoint changes.

## Corrections in this checkpoint

- Standardized progression mastery to **80%**.
- Added `reviewedLessons` as a separate progress state.
- Added migration logic: old manual completion marks without an 80%+ score become review marks instead of mastery.
- Lesson mastery is now score-derived from `lessonScores >= 80`.
- Unit 2 unlock requires **all six lesson practices at 80%+ AND the Unit 1 Mastery Check at 80%+**.
- Added a visible Unit 2 progression panel to Unit Home.
- Added the missing lesson-mastery count target.
- Restored legacy sacred CSS aliases and added a real shared dark theme.
- Updated Unit 01 README and teacher guide to the 80% standard.
- Standardized Foundation/Core/Extended practice result thresholds to 80% for this reference implementation.

## Next checkpoint
Lesson 01 forensic pass: lesson structure, reading depth, worked examples, 20 unique practice questions, workbook interaction, print behavior, reflection, accessibility, and navigation.
