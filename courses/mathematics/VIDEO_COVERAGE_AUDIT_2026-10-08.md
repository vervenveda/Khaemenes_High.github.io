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

## Verification pass 2 — 2026-10-08
- Compared both library directories by Git blob SHA: all 24 entries (23 JSON and README) match exactly; **no deletion authorized** because consumer references are not yet proven absent.
- Current repository tree contains 269 lesson HTML files across the five higher-math target course directories.
- External source checks locate public descriptions for the three proposed videos: number systems (`WxXZaP8Y8pI`), order of operations (`saTBf8AO4Ok`), and functions (`lGfsp2CWjok`). These support preliminary topic alignment only; embedded playback and caption accessibility remain untested.
- Preserve `enabled:false` on all staged placements until a browser-level verification and transcript fallback review.
- Caution: third-party video summaries are not definitive proof of mathematical accuracy; evaluate the actual lesson content before promoting a resource.

## Geometry candidate-backbone update — 2026-10-20

Geometry moved from **0 mapped candidates** to **11 staged disabled lesson placements**.

This is a conservative candidate map, not deployed student-facing video coverage. No Geometry placement is enabled.

Newly sourced listing-verified candidates include:
- Khan Academy: two-column geometric proof example.
- The Organic Chemistry Tutor: geometric transformations; right-triangle sine/cosine/tangent; introductory circle geometry; triangular-prism volume.

Existing Academy records were also reused for transversal angles, slope, scale drawings, Pythagorean theorem, elementary area, and surface-area nets.

Release status remains unchanged: `enabled:false` until whole-video review, playback, captions/transcript fallback, privacy-enhanced embed behavior, responsive lesson rendering, and exact objective alignment are verified.

## Algebra II candidate update — 2026-10-20

Algebra II increased from **1 staged placement** to **4 staged disabled placements**.

New listing-verified candidates:
- Parent-function transformations/end behavior — The Organic Chemistry Tutor.
- Solving logarithmic equations — The Organic Chemistry Tutor.
- Conditional probability and independence — Khan Academy.

No Algebra II placement is enabled. Complex numbers and rational-function/asymptote candidates remain intentionally unsourced after the current search did not return sufficiently trustworthy exact matches. No video IDs were guessed.

## Higher-math candidate backbone checkpoint — 2026-10-20

Current staged disabled placement counts:
- Algebra I: **10**
- Geometry: **17**
- Algebra II: **9**

No newly sourced candidate in this checkpoint is student-facing. The records are publisher/topic verified at listing level only.

Quality-control decisions preserved:
- No guessed YouTube IDs.
- No use of broad videos where a narrower lesson match is required.
- A calculus-heavy exponential-growth result was rejected for Algebra II despite topical overlap.
- Circle, congruence and construction candidates were mapped only where their described scope matches the lesson objective.
- All release gates remain: whole-video review, playback, captions/transcript fallback, privacy-enhanced embed behavior, responsive rendering and exact objective alignment.

## Third candidate-backbone checkpoint — 2026-10-20

Current staged disabled placement counts:
- Algebra I: **10**
- Geometry: **21**
- Algebra II: **16**

This pass materially strengthened Algebra II polynomial/complex/exponential/matrix/series coverage and Geometry triangle-center/circle-theorem coverage.

Quality control remains conservative:
- no guessed video IDs;
- no activation from search-result metadata alone;
- descriptive Academy title used only once where the provider search surfaced the video ID and detailed description but not its rendered title;
- all records remain pending whole-video playback, captions/transcript fallback, embed behavior, and exact lesson-objective review.
