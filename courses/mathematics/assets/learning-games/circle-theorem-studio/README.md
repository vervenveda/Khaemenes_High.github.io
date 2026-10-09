# Circle Theorem Studio — Khaemenes Academy

Original, offline-capable, single-file Geometry learning game. No dependencies or external requests.

## Installation

Upload `index.html` to `courses/mathematics/assets/learning-games/circle-theorem-studio/index.html` in the High School repository. Keep this README alongside it.

## Launcher modes

`central`, `inscribed`, `chords`, `tangent`, `mixed` (also aliases `arc`, `chord`, `tangents`, `circles`).

Example (from a Geometry lesson):

```html
<script src="../../../../assets/shared-game-launcher.js" data-game="circle-theorem-studio" data-course="geometry" data-unit="08" data-lesson="01" data-mode="central" data-title="Circle Theorem Studio"></script>
```

Verify actual lesson placements before adding launcher tags or registering the game. Game is intentionally not a complete circle-theorem curriculum.

## Student experience

Four focused missions plus mixed practice; SVG diagrams; numeric answer checks; hints; worked solutions; unlimited retries; recent-question avoidance; local progress and JSON export; optional sound. No mastery unlocking is claimed.

## Known limits

Chord diagram is schematic, not to numerical scale. Inscribed and central missions focus on minor arcs; tangent mission tests the perpendicular-radius theorem. Advanced intersecting-chord, secant, tangent-secant and cyclic-quadrilateral theorems are not included. Browser accessibility and mathematical QA are pending.
