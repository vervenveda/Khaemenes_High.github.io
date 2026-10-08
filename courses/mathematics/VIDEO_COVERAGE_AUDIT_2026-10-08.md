# Mathematics video coverage audit — 2026-10-08

Status: preliminary inventory and conservative mapping pass. No student-facing video activation.

## Canonical library
- Shared registry: `assets/video-library/` (23 topic JSON records).
- Duplicate-looking registry: `assets/assets/video-library/`. Compare file contents and consumers before any cleanup.
- Pre-Algebra legacy records and its existing `video-map.json` are preserved.
- Shared records do not own lesson placement; course-specific `video-map.json` does.

## Newly staged, disabled placements
| Course | Lesson | Shared asset | Intended use |
| --- | --- | --- | --- |
| Algebra I | Unit 01 Lesson 02 | MATH-NUMBER-SYSTEMS-001 | Real number classification |
| Algebra I | Unit 01 Lesson 03 | MATH-ORDER-OF-OPERATIONS-001 | Numerical expression operations |
| Algebra II | Unit 01 Lesson 01 | MATH-FUNCTIONS-001 | Function notation prerequisite review |

All mappings use `enabled: false`. Neither video playback nor captions/transcript accessibility has been certified. No lesson player has been wired to these maps.

## Topic gaps to source or produce
These are **catalog-level** gaps, not a claim that individual lessons lack all instructional media.

| Course | Priority subjects |
| --- | --- |
| Algebra I | Equations and inequalities; slope and linear functions; systems; exponent rules; polynomials and factoring; quadratic equations and graphs |
| Geometry | Basic definitions and constructions; logic and proof; congruence; similarity; transformations; right-triangle trigonometry; circles; measurement and volume |
| Algebra II | Advanced function transformations and inverses; complex numbers; polynomial, rational, exponential and logarithmic functions; sequences and probability |
| Precalculus / Trigonometry | Unit circle and radians; trigonometric functions, graphs and identities; vectors; conics; advanced functions |
| Calculus I | Limits and continuity; derivative rules and applications; integrals; Fundamental Theorem of Calculus |

## Release gates
1. Compare the duplicate-looking registry directories by SHA/content, including runtime import paths.
2. Check each provider video ID for availability, topical accuracy, age suitability, caption accessibility, and transcript or text alternative.
3. Inventory every higher-math lesson and any existing inline embeds; match by lesson objective, not filename alone.
4. Add tested student-facing player integration with accessible fallback; only then change placement `enabled` to `true`.
5. Validate course navigation, responsive display, and regression checks on the published GitHub Pages site.

Do not delete legacy assets, assume a YouTube embed is live, or represent staged placements as deployed video lessons.
