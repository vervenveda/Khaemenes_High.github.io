# Khaemenes Academy — Linear Systems Mission v1

Original standalone vanilla HTML/CSS/JavaScript learning game. No CDN, network, third-party engine, or analytics.

## Install
Extract this folder to `courses/mathematics/assets/learning-games/linear-systems-mission/` and open `index.html`. It works offline.

## Lesson launcher
Use existing `courses/mathematics/assets/shared-game-launcher.js` with `data-game="linear-systems-mission"` and `data-mode="graph"`, `"substitution"`, `"elimination"`, or `"classify"`. Modes select the initial level, but students may switch levels.

## Content
1. Graphing and identifying intersections.
2. Solving by substitution.
3. Solving by elimination.
4. Classifying parallel and coincident lines (no or infinitely many solutions).

The game uses integer-solution systems for Levels 1–3 and preserves attempts without restarting after an incorrect answer. Scores are practice-only and do not update course mastery. Local progress uses localStorage; JSON export is optional.

## QA status
Static checks and generated-math verification should be completed before student rollout. Manual browser, accessibility, and live launcher checks are still required. Avoid linking it to systems of inequalities; this game covers systems of equations.
