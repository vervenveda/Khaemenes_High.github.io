# Polynomial Factoring Forge v1

An original, sovereign, single-file, offline mathematics game for Khaemenes Academy.

## Install
Extract this folder into:
`courses/mathematics/assets/learning-games/polynomial-factoring-forge/`

Open `index.html` directly or through the existing shared-game-launcher.js.

## Lesson modes
- `?mode=expand` or `?mode=distribution`: Level 1 — multiply binomials and combine terms
- `?mode=factor` or `?mode=factoring`: Level 2 — factor monic quadratics
- `?mode=zeros`: Level 3 — solve factored quadratic equations using zero-product principle
- `?mode=advanced` or `?mode=nonmonic`: Level 4 — factor quadratics with leading coefficient greater than 1

Students can change levels independently. The game saves practice locally and exports JSON; it does not write grades or unlock lessons. No third-party dependencies or network calls.

## QA checklist
1. Test correct and incorrect answers at all four levels, including negative coefficients and swapped factor order.
2. Test mobile, keyboard-only, screen reader, and offline use.
3. Verify progress persistence and export.
4. Test lesson launcher mode selection before connecting to lessons.

Copyright © Jennifer Kay Pearl · Khaemenes Academy.
