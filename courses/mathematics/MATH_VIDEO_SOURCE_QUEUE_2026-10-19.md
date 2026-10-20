# Khaemenes Academy · Mathematics Video Acquisition Queue
Updated 2026-10-19

## Existing architecture to retain
- Canonical reusable records: `courses/mathematics/assets/video-library/*.json`.
- Course placements: `courses/mathematics/{pre-algebra,algebra-1,geometry,algebra-2}/video-map.json`.
- Pre-Algebra presentation: optional privacy-enhanced `youtube-nocookie.com/embed/<id>` player with title and instructional alignment note, independent of mastery.
- Existing Pre-Algebra source records and lesson embeds must remain in place.
- `instructor-index.json` tracks candidate source channels, pending direct attribution checks. **Do not invent publisher names or URLs.**

## First-choice instructor sourcing
Search additional videos from the instructors already selected by the Academy first, **after verifying the channel that published each existing video ID**. Search new educators only when current channels lack adequate material. Keep attribution and video verification separate from topical recommendation.

## Acquisition list (exact instructional subjects — not claimed existing video titles)
| Order | Course | Video subject to source | Suggested learning purpose | Status |
|---|---|---|---|---|
| 01 | Algebra I | Algebraic notation, expressions and variables | Unit 01 readiness | candidate_needed |
| 02 | Algebra I | Equations and inverse operations | Solve and verify one/two-step equations | candidate_needed |
| 03 | Algebra I | Multi-step equations and distributive property | Algebraic transformations | candidate_needed |
| 04 | Algebra I | Linear inequalities, intervals and number lines | Graph solution sets | candidate_needed |
| 05 | Algebra I | Slope and rate of change | Tables, graphs and contexts | candidate_needed |
| 06 | Algebra I | Slope-intercept, point-slope and standard form | Multiple linear representations | candidate_needed |
| 07 | Algebra I | Systems by graphing, substitution and elimination | Interpret solutions | candidate_needed |
| 08 | Algebra I | Domain, range and function notation | Interpret functions | candidate_needed |
| 09 | Algebra I | Exponent properties and scientific notation | Structural reasoning | candidate_needed |
| 10 | Algebra I | Polynomial operations, factoring and zeros | Polynomial fluency | candidate_needed |
| 11 | Algebra I | Quadratic graphs, roots and formula | Compare solution methods | candidate_needed |
| 12 | Algebra I | Unit analysis, significant figures and percent error | Unit 01 Lessons 4–6 | candidate_needed |
| 13 | Algebra I | Mathematical error analysis and verification | Unit 01 Lesson 6 | candidate_needed |
| 14 | Geometry | Definitions, constructions and angle relationships | Geometry foundations | candidate_needed |
| 15 | Geometry | Proof and logical reasoning | Justify claims | candidate_needed |
| 16 | Geometry | Congruence and similarity | Triangle relationships | candidate_needed |
| 17 | Geometry | Transformations and coordinate geometry | Visual representations | candidate_needed |
| 18 | Geometry | Pythagorean theorem and trigonometry | Right triangles | candidate_needed |
| 19 | Geometry | Circles, area, surface area and volume | Measurement | candidate_needed |
| 20 | Algebra II | Function transformations and inverses | Advanced functions | candidate_needed |
| 21 | Algebra II | Complex numbers and polynomial zeros | Polynomial structure | candidate_needed |
| 22 | Algebra II | Polynomial and rational functions | Division, roots and asymptotes | candidate_needed |
| 23 | Algebra II | Exponential and logarithmic functions | Growth and inverse relationships | candidate_needed |
| 24 | Algebra II | Sequences, statistics and probability | Modeling | candidate_needed |

## Existing candidate reuse: do not duplicate
- Algebra I Unit 01 Lesson 02: `MATH-NUMBER-SYSTEMS-001`.
- Algebra I Unit 01 Lesson 03: `MATH-ORDER-OF-OPERATIONS-001`.
- Algebra II Unit 01 Lesson 01: `MATH-FUNCTIONS-001`.
- The shared library contains 23 original topic records; their publishers, captions and embed behavior are **not globally certified**.
- Pre-Algebra's compatible-number estimation, fractions, integers and number-line records may be useful as prerequisite review, not substitutes for advanced topics.

## Publishing gate
1. Verify video title, exact video ID and channel on the provider page.
2. Evaluate mathematical accuracy, audience level, captions and transcript/text alternative.
3. Test privacy-enhanced embedded playback on phone, tablet and desktop; never promise an embed is guaranteed advertisement-free.
4. Add or update a canonical shared record, preserving existing record IDs.
5. Map to *specific lesson objectives* in a course's `video-map.json`.
6. Use the Pre-Algebra presentation style and keep the item optional; do not alter 80% mastery logic.
7. Confirm offline reading remains available if video cannot load.

This queue is a sourcing plan, not certification that its proposed videos already exist.

## Candidate videos sourced from Academy-selected instructor (October 19, 2026)

These are **staged, disabled** canonical video records. Publisher verified through video listings; student playback, subtitles and transcript alternatives **not yet checked**.

| Instructor | Video title | Shared record | Intended Algebra I skill |
|---|---|---|---|
| The Organic Chemistry Tutor | How To Solve Linear Equations In Algebra | `solving-linear-equations.json` | Solve and verify linear equations |
| The Organic Chemistry Tutor | The Slope Formula - Algebra | `slope-formula.json` | Find slope between two points |
| The Organic Chemistry Tutor | Factoring Trinomials & Polynomials, Basic Introduction - Algebra | `factoring-trinomials-introduction.json` | Introductory polynomial factoring |

Do not turn on course placement until classroom-level checking of the video, embed, captions and lesson alignment is complete. New candidates remain disabled and do not change mastery.

## Second sourcing pass — confirmed preferred-instructor candidates

The following four records are staged in the canonical Mathematics library and **disabled**. YouTube listings identify The Organic Chemistry Tutor as publisher, and descriptions match the broad subject. No student playback, caption support, transcript alternative or specific lesson placement has yet been certified.

| Title | Video ID | Shared record |
|---|---|---|
| How To Solve Linear Inequalities, Basic Introduction, Algebra | DrZJKdXlZ3I | `linear-inequalities-introduction.json` |
| Solving Systems of Equations By Elimination & Substitution With 2 Variables | oKqtgz2eo-Y | `systems-elimination-substitution.json` |
| Evaluating Functions - Basic Introduction \| Algebra | HyNie_PYgsY | `evaluating-functions-introduction.json` |
| How To Solve Quadratic Equations By Factoring - Algebra Introduction | aj4akBeGjuo | `quadratic-equations-factoring.json` |

Review full videos, mathematical rigor, student age, captions, transcripts, embed behavior and the precise lesson objective before enabling any placement. Existing Pre-Algebra embeds and all 80% mastery records remain unchanged.

## Geometry sourcing pass — 2026-10-20

Geometry now has **11 staged disabled placements** in `geometry/video-map.json`.

Six placements reuse existing Academy library records:
- U04-L01 — transversal angles (Khan Academy)
- U04-L03 — slope formula (The Organic Chemistry Tutor)
- U05-L06 — scale drawings (Khan Academy)
- U06-L01 — Pythagorean theorem (Math Antics)
- U10-L01 — area prerequisite/review (Math Antics)
- U11-L04 — surface area from nets (Khan Academy)

Five additional canonical records were sourced and staged:
- U01-L06 — two-column proof example (Khan Academy)
- U02-L01 — translations/reflections/rotations candidate (The Organic Chemistry Tutor)
- U06-L05 — sine/cosine/tangent right-triangle candidate (The Organic Chemistry Tutor)
- U08-L01 — introductory circle geometry candidate (The Organic Chemistry Tutor)
- U11-L01 — prism-volume candidate (The Organic Chemistry Tutor)

All remain `enabled:false`. Publisher/topic listing checks are complete for the five newly sourced records; full playback, captions/transcript fallback, age/lesson fit, and privacy-enhanced embed behavior remain release gates.

## Algebra II sourcing pass — 2026-10-20

Algebra II now has **4 staged disabled placements** in `algebra-2/video-map.json`:

- U01-L01 — existing function-notation prerequisite review.
- U01-L03 — parent-function transformations and end behavior (The Organic Chemistry Tutor).
- U07-L05 — solving logarithmic equations (The Organic Chemistry Tutor).
- U12-L03 — conditional probability and independence (Khan Academy).

All remain `enabled:false`.

Highest-priority Algebra II sourcing gaps now:
1. Imaginary unit, powers of i, complex-number operations and complex plane.
2. Polynomial division, rational roots, multiplicity and complete factorization.
3. Rational functions: restrictions, holes and asymptotes.
4. Exponential structure, continuous growth and exponential equations.
5. Matrix operations and row reduction.
6. Arithmetic/geometric sequences, finite/infinite series and sigma notation.
7. Trigonometric identities/equations and oblique triangles.
8. Binomial/normal distributions and statistical inference.

Do not activate any staged placement until full playback, captions/transcript fallback, privacy-enhanced embed behavior and exact lesson alignment are verified.

## Second higher-math sourcing checkpoint — 2026-10-20

### Geometry
Geometry now has **17 staged disabled placements**.

Newly added in this pass:
- U01-L04 — angle-bisector compass/straightedge construction (Khan Academy).
- U03-L02 — SSS/SAS triangle congruence (The Organic Chemistry Tutor).
- U03-L03 — ASA/AAS triangle congruence support (same source; HL remains separate).
- U05-L03 — similar triangles and proportional sides (The Organic Chemistry Tutor).
- U08-L05 — tangent/secant circle relationships (The Organic Chemistry Tutor).
- U08-L06 — tangent-angle/arc theorem support (The Organic Chemistry Tutor).

Remaining Geometry sourcing priorities:
1. Segments/rays/notation and midpoint/partition if a strong visual source is found.
2. Reflections, rotations and composition of transformations beyond the current introductory transformation candidate.
3. HL congruence and CPCTC/multi-step proofs.
4. Triangle centers and perpendicular/angle bisectors.
5. Central/inscribed angles, chords, power theorems and circle equations.
6. Pyramids, cones, spheres, cross-sections and volume scaling.

### Algebra II
Algebra II now has **9 staged disabled placements**.

Second batch added:
- U04-L05 — rational-function holes and asymptotes (The Organic Chemistry Tutor).
- U09-L04 — geometric series introduction (Khan Academy).
- U11-L05 — solving trigonometric equations on intervals (The Organic Chemistry Tutor).
- U11-L07 — Law of Cosines for SSS/SAS triangles (The Organic Chemistry Tutor).
- U12-L05 — normal-distribution introduction (Khan Academy).

Remaining Algebra II sourcing priorities:
1. Complex numbers and complex plane.
2. Polynomial division, rational root theorem, multiplicity and full factorization.
3. Exponential functions/growth at Algebra II level (reject calculus-heavy substitutes).
4. Matrices and row reduction.
5. Arithmetic sequences, infinite series and sigma notation.
6. Trigonometric identities and Law of Sines/ambiguous case.
7. Binomial distributions, expected value, z-scores and statistical inference.

All staged placements remain `enabled:false`.

## Third higher-math sourcing checkpoint — 2026-10-20

### Algebra II
Algebra II now has **16 staged disabled placements**.

Newly added in this pass:
- U02-L05 — complex-number operations (The Organic Chemistry Tutor).
- U02-L07 — complex plane / modulus support from the same source.
- U03-L01 — polynomial long division (The Organic Chemistry Tutor).
- U03-L02 — synthetic division and remainder-theorem support (The Organic Chemistry Tutor).
- U06-L02 — exponential growth and decay word problems at Algebra/Precalculus level (The Organic Chemistry Tutor).
- U08-L05 — elementary row operations with matrices (The Organic Chemistry Tutor).
- U09-L05 — infinite geometric series (Khan Academy).

Remaining Algebra II priorities:
1. Powers of i / introductory imaginary unit if a cleaner dedicated source is found.
2. Rational Root Theorem, multiplicity and complete factorization.
3. Exponential equations / continuous growth beyond the current growth-decay companion.
4. Matrix inverse/determinant and nonlinear-system matrix applications.
5. Arithmetic sequences, sigma notation and binomial theorem.
6. Fundamental trig identities, Law of Sines and ambiguous case.
7. Binomial distributions, z-scores and inference.

### Geometry
Geometry now has **21 staged disabled placements**.

Newly added in this pass:
- U03-L07 — incenter, circumcenter, orthocenter and centroid (The Organic Chemistry Tutor).
- U08-L02 — central angles / arc-length support from a circle-geometry overview.
- U08-L03 — inscribed angles / intercepted arcs support from the same source.
- U08-L06 — chord-chord, secant-tangent and secant-secant power theorems (The Organic Chemistry Tutor).

All placements remain `enabled:false`.

## Fourth higher-math sourcing checkpoint — 2026-10-20

### Algebra II
Algebra II now has **21 staged disabled placements**.

Newly added:
- U03-L04 — Rational Zero Theorem and polynomial zeros (The Organic Chemistry Tutor).
- U06-L05 — solving exponential equations with logarithms (The Organic Chemistry Tutor).
- U08-L06 — matrix inverse by row reduction (The Organic Chemistry Tutor).
- U09-L06 — sigma notation and summation (Khan Academy).
- U11-L06 — Law of Sines with SSA ambiguous case (The Organic Chemistry Tutor).

Remaining Algebra II priorities:
1. Dedicated powers-of-i / imaginary-unit source.
2. Multiplicity/graph behavior and complete factorization.
3. Continuous growth and the constant e.
4. Determinants and matrix transformations.
5. Arithmetic sequences and binomial theorem.
6. Fundamental trig identities.
7. Binomial distributions, z-scores, percentiles and inference.

### Geometry
Geometry now has **22 staged disabled placements**.

Newly added:
- U11-L06 — cross-sections of prisms, cylinders, pyramids and cones plus solids of revolution (eMATHinstruction).

Remaining Geometry priorities:
1. HL congruence / CPCTC multi-step proof support.
2. Circle equations and coordinate-circle applications.
3. Pyramids, cones, spheres and volume/surface-area relationships.
4. Similarity scaling in three dimensions.

All placements remain `enabled:false`.
