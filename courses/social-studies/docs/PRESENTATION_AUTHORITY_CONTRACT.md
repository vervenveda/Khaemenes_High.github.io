# Social Studies Presentation Authority Contract

The canonical presentation owner is:

`courses/social-studies/assets/social-studies-canonical-vnv-shell-v1.css`

Course-specific CSS may define layout only: grids, spacing, sizing, overflow, responsive behavior, print structure, and positioning.

Course CSS must not own:
- colors or backgrounds
- font families, weights, or fixed presentation sizes
- borders or radii as visual styling
- shadows
- hero/card/button palettes
- footer presentation

Grade 9 `app.html` and Grade 11 Personal Finance must load the canonical stylesheet and set `data-social-studies-grade-shell="v1"`.

Embedded legacy typography blocks are prohibited.

The canonical shell owns accessible font scaling through `--font-scale` with a 16px minimum.
