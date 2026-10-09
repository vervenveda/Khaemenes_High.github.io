# Right Triangle Trig — Khaemenes Academy

Original sovereign HTML/CSS/JavaScript learning game. No CDN, third-party libraries, tracking, or network requests.

## Install

Place `index.html` at:

`courses/mathematics/assets/learning-games/right-triangle-trig/index.html`

## Lesson launcher

Use the shared launcher from a Geometry lesson (`units/unit-XX/lessons/uXX-lYY.html`):

```html
<script src="../../../../assets/shared-game-launcher.js" data-game="right-triangle-trig" data-course="geometry" data-unit="06" data-lesson="01" data-mode="ratios" data-title="Right Triangle Trig"></script>
```

Supported `mode` values: `ratios`, `sides`, `angles`, `pythagorean`, `mixed`. Aliases include `sohcahtoa`, `side`, `angle`, `inverse`, `trig`.

## Content and limitations

* Five missions: ratio identification, missing side, missing angle, Pythagorean connections, and mixed practice.
* Diagram is schematic, not to scale. All trig angle calculations use degrees.
* Numeric responses are rounded to the nearest tenth, with tolerance ±0.15.
* Local progress saved in localStorage; JSON export and reset included.
* Unlimited retry, hints and worked explanations.
* No mastery gate or gradebook writeback; do not represent as a graded assessment.
* No live browser/accessibility audit yet. Verify on target devices before student-facing certification.
