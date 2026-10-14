# Algebra I Unit 01 — instructional fortification (review-only supplement)

**Status:** authored repair material; NOT wired to a student lesson, graded question, mastery gate, or score store. This is a teacher-review and print-draft resource only. Existing lessons remain the authority. Do not deploy into active rendering during beta testing.

## Lesson 01 — Proof, verification, and counterexample

**Goal:** distinguish a solution check, evidence from several numerical cases, and a general algebraic argument.

**Worked comparison.** Claim: `3(x + 4) = 3x + 12` for every real number x.
1. A check at x = 2 gives 18 on each side. This verifies one case, not the universal claim.
2. The distributive property gives `3(x + 4) = 3·x + 3·4 = 3x + 12` for *every* real x. This is a general justification.
3. Contrast: `x² ≥ x` is **not** true for every real x; with x = 1/2, `x² = 1/4 < 1/2`. This one allowed counterexample disproves the universal claim.

**Guided repair.** A classmate says “I tested 0, 1, and 2; therefore `x² ≥ x` is always true.” Identify the logical error, produce a counterexample in (0,1), and explain why three checks cannot prove an identity.

**Self-check:** (a) state the domain, (b) distinguish numerical verification from a proof, (c) name the property used, (d) use a counterexample from the allowed domain when disproving a universal claim.

## Lesson 02 — Real-number sets and intervals

**Diagram specification:** draw nested regions Real ⊃ Rational ⊃ Integer ⊃ Whole; under the course's natural-number convention, Whole ⊃ Natural. Irrational numbers occupy the portion of the real-number region outside Rational. Label an example in each region and note that numbers belong to every containing set.

**Number line:** `-4 < x ≤ 2` uses an open circle at -4, a closed circle at 2, and shading between; interval `(-4, 2]`.

**Guided contrast:** `√36 = 6` is rational; `√7` is irrational. The radical glyph is not a classification test. `1.414` is a rational approximation, not an exact representation of `√2`.

**Self-check:** (a) classify the *value*, (b) identify the smallest set under the stated convention, (c) mark inclusion/exclusion independently at each endpoint, (d) preserve exact notation when requested.

## Lesson 03 — Operations and structural errors

**Side-by-side example:** compute `4 + 3(5 - 2)`.
- Valid: parentheses → `4 + 3(3) = 4 + 9 = 13`.
- Invalid: `4 + 3 = 7`, then `7(3) = 21`. Explain why adding 4 and 3 first violates operation priority.
- Repair: circle the grouped expression and identify the multiplication before addition.

**Distribution check:** `-3(2x - 5) = -6x + 15`. Substitute x = 2 in both forms: 3 = 3; substitution is an error check, while the distributive property justifies all x.

**Self-check:** (a) honor grouping and equal-priority left-to-right rules, (b) attach signs to terms, (c) name the property behind an alternative method, (d) check the result against the original expression.

## Lesson 04 — Unit cancellation and modelling

**Two-stage contextual problem:** A student cycles at a constant 54 km/h for 2.5 minutes. Find the modelled distance in metres.
1. `2.5 min × (1 h / 60 min) = 1/24 h`.
2. `54 km/h × 1/24 h = 2.25 km`.
3. `2.25 km × (1000 m / 1 km) = 2250 m`.
4. Reverse check: `2250 m = 2.25 km`, then `2.25 km ÷ 54 km/h = 1/24 h = 2.5 min`.
5. State the modelling assumption (constant speed, no stops).

**Diagram specification:** show fractions in a horizontal chain, crossing out each repeated unit in numerator and denominator. Units must cancel to metres.

**Self-check:** (a) write quantities with units, (b) use conversion fractions equal to one, (c) cancel the intended units, (d) verify order of magnitude and state assumptions.

## Lesson 05 — Accuracy, precision, and percentage error

**Measurement investigation.** A calibration reference is 50.0 cm.
- Instrument A readings: 49.9, 50.0, 50.1 cm. Mean = 50.0 cm; range = 0.2 cm.
- Instrument B readings: 52.0, 52.1, 52.0 cm. Mean = 52.033... cm; range = 0.1 cm.
- The tighter cluster makes B more *repeatable* in this sample, but its measurements are farther from the reference.
- A's mean matches the reference; that does not establish a universally unbiased instrument from only three observations.
- Mean percent error for B, using its unrounded mean, is `|52.033... - 50.0| / 50.0 × 100 ≈ 4.07%`. A's mean percent error is 0% for these readings. The accepted reference, not the measurement, is the denominator.
- If the accepted value is zero, the usual percent-error formula is undefined; report absolute error or another suitable measure instead.

**Visual specification:** one labelled horizontal number line at 49–53 cm, a reference line at 50.0, three points for A and three for B. Include a small table of means, ranges, and mean deviations.

**Student task:** compare accuracy and repeatability, identify a plausible systematic error for B, propose a calibration experiment, and explain sensible reported precision.

**Self-check:** (a) distinguish closeness to the reference from closeness among readings, (b) report units and rounding justified by measurements, (c) use the reference as percent-error denominator, (d) handle a zero reference without division, (e) distinguish observed evidence from general conclusions.

## Lesson 06 — Integrated evidence defence

**Worked model:** A cyclist travels at a constant 72 km/h for 15 minutes.
1. `15 min × (1 h / 60 min) = 0.25 h`.
2. Distance = `72 km/h × 0.25 h = 18 km`.
3. Reverse check: `18 km ÷ 72 km/h = 0.25 h = 15 min`.
4. The result 1080 km is unreasonable for fifteen minutes and typically reflects multiplying speed by the numeral 15 without converting minutes.
5. Acknowledge limits: speed may change, stops may occur, and the assumed rate may be measured imperfectly.

**Independent revision prompt:** show an incorrect solution, mark the *first* invalid step, repair with correct units, verify independently, and write a two-sentence claim/evidence/limitation conclusion.

**Self-check:** (a) organize claim, computation, and units, (b) correct the first invalid transformation, (c) reverse-check and estimate reasonableness, (d) state assumptions and limits without adding unsupported precision.

## Instructional deployment gate

Before adopting this supplement:
- Compare each section against the visible deep-lesson engine output; omit duplication.
- Teacher verifies computations and terminology and approves visual accessibility.
- Check that supplemental practice stays formative; do not award or alter grades from it.
- Complete a separate-learner browser walkthrough, print inspection and offline test.
- Merge only after the active beta-testing window and preserving learner profiles and STOS.
