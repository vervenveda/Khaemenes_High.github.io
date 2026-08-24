# Khaemenes Mathematics Readiness & Placement

This folder contains the shared pre-course mathematics readiness layer for Khaemenes High School.

## Contract

- Shared readiness is **pre-course** and never counts as an instructional unit or week.
- Results do **not** count toward grades, course mastery, certificates, or completion.
- The result is stored locally under `KHAEMENES_MATH_READINESS_V1` and may be exported as JSON.
- Reassessment is intentional rather than automatic.
- For Algebra I, Geometry, Algebra II, Precalculus/Trigonometry, and Calculus I, the shared result is advisory placement evidence.
- **Pre-Algebra is the exception:** its course entrance authority remains the NAIB readiness gateway at `../pre-algebra/diagnostic/` and, when assigned, the conditional six-week Unit 0 refresher. A shared readiness result may inform review but cannot satisfy or bypass that gate.
- Readiness evidence must never overwrite instructional mastery records.

## Progressive tiers

1. Foundations — arithmetic, fractions, integers, ratios.
2. Algebra I readiness — expressions, equations, coordinates, linear foundations.
3. Geometry / Algebra II bridge — measurement, angles, systems, exponents.
4. Algebra II readiness — factoring, quadratics, functions, polynomials.
5. Precalculus readiness — rational expressions, exponential/logarithmic reasoning, right-triangle and trigonometric foundations.
6. Calculus I readiness — composition, inverses, and conceptual limit readiness.

A learner begins at Tier 1. Meeting a tier threshold unlocks the next tier. Falling below a threshold stops the assessment and produces the highest supported recommendation plus review domains.

## Files

- `index.html` — student-facing adaptive assessment and local result UI.
- `question-bank.js` — 48-question readiness bank, eight questions per tier.
- `readiness-map.json` — machine-readable placement contract.
- `course-readiness-bridge.js` — optional advisory notice for course pages; it explicitly defers to the Pre-Algebra NAIB gateway.
- `portal-entry.js` — optional Mathematics Hall launcher; it does not replace the Pre-Algebra diagnostic route.
- `validate-readiness.mjs` — structural regression validator.

## Integration rule

The engine may be linked from the Mathematics Hall without modifying individual course architecture. Course integrations should be added only from current course files. Do not resurrect the stale course-file replacements from historical PR #12.
