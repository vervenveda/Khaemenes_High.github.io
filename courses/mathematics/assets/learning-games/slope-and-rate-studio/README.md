# Khaemenes Academy · Slope & Rate Studio v1

Original sovereign learning game, implemented in a single self-contained `index.html` file. No CDNs, frameworks, remote calls, or third-party assets.

## Installation

Extract the directory to `courses/mathematics/assets/learning-games/slope-and-rate-studio/` in `vervenveda/Khaemenes_High.github.io`.

Once uploaded, link using the existing `courses/mathematics/assets/shared-game-launcher.js` and register lesson placements in `courses/mathematics/assets/learning-games/game-registry.json`.

Suggested first placements: Algebra I slope/rate lessons, plus suitable Pre-Algebra unit-rate and slope lessons after inspecting the exact lesson objectives. Launcher query `mode=unit-rate`, `mode=slope`, or `mode=intercept` selects the initial level; learners can change it.

## Studios

1. Unit rates and proportional tables (positive integer rates)
2. Slope from two points (positive or negative rational slopes)
3. Y-intercept in slope-intercept form (integer intercepts)

All generated answers are derived from the same mathematical parameters used for the displayed graph/table. Answer parsing accepts integers, decimals and fractions. Feedback does not reset a question. Progress uses localStorage, and JSON export is available. No grades or mastery unlocks are written to a course engine.

## QA checklist

- Test offline from `index.html` and via the GitHub Pages path.
- Test positive/negative and fractional slopes, and zero/negative intercepts.
- Verify keyboard-only input, status feedback, small-screen layout, and screen reader graph description.
- Verify no repeats in recent-question history under typical use and that a wrong answer preserves the challenge.
- Verify launcher query mode selects the expected initial level.

This version is a practice companion, not a replacement for instruction, tests, or gradebook.
