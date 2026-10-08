# Khaemenes Academy · Quadratic Graph Lab v1

Original, sovereign, self-contained HTML/CSS/JavaScript educational game. No dependencies or remote resources.

## Install

Extract `quadratic-graph-lab/` into:

`courses/mathematics/assets/learning-games/quadratic-graph-lab/`

The existing `courses/mathematics/assets/shared-game-launcher.js` can open the game from any lesson with:

```html
<script src="../../../../assets/shared-game-launcher.js" data-game="quadratic-graph-lab" data-course="algebra1" data-unit="10" data-lesson="01" data-mode="vertex" data-title="Quadratic Graph Lab"></script>
```

Supported `mode` values: `vertex`, `parabola` (Level 1); `symmetry`, `axis` (Level 2); `roots`, `zeros` (Level 3); `transform`, `transformations` (Level 4). Students can change levels independently.

## Coverage

1. Vertex of y = a(x-h)^2 + k.
2. Axis of symmetry x=h.
3. Two distinct integer real roots, with possible fractional vertex coordinates.
4. Single-step shifts, reflections, and vertical stretches from y=x^2.

## Privacy, accessibility, and assessment

All content runs locally; no accounts, analytics, CDNs, or third-party scripts. SVG graph has a descriptive text equivalent. Keyboard-operable native controls and status messages. LocalStorage is optional and failure-tolerant; JSON progress export included. Incorrect answers do not reset the game. Practice progress does not modify course mastery or assessments.

## QA note

This is v1. Static integrity and math generation checks should be completed before classroom release; browser and assistive-technology testing remain required. The displayed graph shows a fixed coordinate window and may clip portions of the parabola outside that window.
