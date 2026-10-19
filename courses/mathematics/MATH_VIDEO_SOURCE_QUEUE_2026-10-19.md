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
