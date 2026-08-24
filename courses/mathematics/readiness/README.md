# Khaemenes Mathematics Readiness & Placement

This folder is the shared pre-course mathematics readiness layer for Khaemenes High School.

## Contract

- Placement is **pre-course**, not an instructional unit or week.
- Placement results do **not** count toward course grades, mastery, instructional completion, certificates, or 80% course gates.
- The engine is advisory. NAIB, a teacher, family, or learner may review the recommendation.
- Reassessment is intentional rather than automatic.
- The result is stored locally under `KHAEMENES_MATH_READINESS_V1` and may be exported as JSON.
- Every mathematics course must still begin instruction at **Unit 01 / Week 1**.

## Progressive tiers

1. Foundations — arithmetic, fractions, integers, ratios.
2. Algebra I readiness — expressions, equations, coordinates, linear foundations.
3. Geometry / Algebra II bridge — measurement, angles, systems, exponents.
4. Algebra II readiness — factoring, quadratics, functions, polynomials.
5. Precalculus readiness — rational expressions, exponential/logarithmic reasoning, right-triangle and trigonometric foundations.
6. Calculus I readiness — composition, inverses, and conceptual limit readiness.

A learner begins at Tier 1. Meeting a tier threshold unlocks the next tier. Falling below a threshold stops the assessment and produces the highest supported course recommendation plus review domains.

## Files

- `index.html` — student-facing adaptive assessment and local result UI.
- `question-bank.js` — 48-question readiness bank, eight questions per tier.
- `readiness-map.json` — machine-readable placement/course contract for NAIB and validators.
- `validate-readiness.mjs` — structural regression validator.

## Integration rule

Mathematics portal and course-entry buttons may link to `readiness/` before direct course entry. Course pages may read the saved readiness record, but they must not require a placement record to render Unit 01 unless a later Academy policy explicitly adds such a gate.
