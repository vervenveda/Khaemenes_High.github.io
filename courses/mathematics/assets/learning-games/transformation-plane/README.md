# Transformation Plane · Sovereign Geometry Game 08

Self-contained, original, offline-capable vanilla HTML/CSS/JS learning game.

## Installation

Extract `index.html` and `README.md` to:

`courses/mathematics/assets/learning-games/transformation-plane/`

After uploading, use the Academy's shared-game launcher in appropriate Geometry lesson pages. Example:

```html
<script src="../../../../assets/shared-game-launcher.js" data-game="transformation-plane" data-course="geometry" data-unit="02" data-lesson="01" data-mode="translate" data-title="Transformation Plane"></script>
```

Supported `mode` values: `translate`, `reflect`, `rotate`, `dilate`, `mixed` (plus full-word aliases). Verify exact lesson titles before linking.

## Learning missions

1. Translation by a vector.
2. Reflection over x-axis, y-axis, y=x, or y=-x.
3. Counterclockwise rotation 90°, 180°, or 270° about the origin.
4. Dilation by positive integer factors 2 or 3 about the origin.
5. Mixed practice.

## Student features

- SVG coordinate grid with accessible textual descriptions.
- Fresh generated questions, recent-question avoidance, unlimited retries.
- Hints and worked solutions, without marking revealed answers correct.
- Browser-local progress and JSON export; no telemetry, CDN, accounts, or network.

## Scope and verification

Only point transformations are currently included; polygon transformations, arbitrary centers of rotation/dilation, fractional scale factors, and compositions are future extensions. Browser and accessibility QA should be performed before final student certification.
