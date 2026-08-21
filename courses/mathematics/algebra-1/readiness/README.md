# Algebra I Cross-Course Readiness Bridge

This directory defines the academic handoff contract for `KH-MATH-A1`.

It is intentionally separate from `algebra1-profile-bridge.js`, which controls learner-profile pinning and does not represent academic readiness.

## Purpose

The bridge carries forward evidence without turning course progression into a binary gate.

A receiving course should know:

- which prerequisite skill families appear secure;
- which prerequisite skill families still need reinforcement;
- what evidence supports those judgments;
- which Foundation, Core, or Extended supports may be appropriate;
- that the receiving-course diagnostic remains the placement check.

A prior course grade and a readiness profile are related but are not the same record.

## Incoming handoff: Pre-Algebra → Algebra I

Pre-Algebra evidence is mapped into Algebra I prerequisite families for:

- number and rational-number fluency;
- proportional reasoning;
- powers and roots;
- expressions and algebraic structure;
- equations;
- inequalities;
- functions and linear relationships;
- coordinate geometry;
- statistics and data reasoning;
- mathematical modelling.

The Algebra I readiness diagnostic confirms or adjusts the initial routing. Prior evidence should reduce unnecessary repetition, not bypass diagnostic evidence.

## Outgoing handoff: Algebra I → Geometry

Geometry receives relevant evidence in:

- precision and mathematical reasoning;
- linear-equation fluency used in geometric relationships;
- coordinate and linear-model reasoning;
- systems and intersection constraints;
- radicals and distance reasoning;
- coordinate geometry;
- modelling and explanation.

A learner may be ready for Geometry overall while still receiving Foundation support in a particular prerequisite family.

## Outgoing handoff: Algebra I → Algebra II

Algebra II receives relevant evidence in:

- functions and linear models;
- systems;
- exponents and radicals;
- polynomial structure and factoring;
- quadratic reasoning;
- statistics and evidence;
- mathematical modelling.

## Evidence rule

Transition evidence should preserve skill-family status separately from the course-grade calculation.

The preferred record contains:

- course ID and completion status;
- mastery target;
- per-skill best score and attempt count where available;
- evidence types used;
- support flags;
- recommended pathway;
- evidence timestamp.

Status vocabulary follows the shared four-level model:

1. Beginning
2. Developing
3. Proficient
4. Mastered

## Routing rule

Prior evidence informs the first support recommendation. The receiving-course diagnostic then confirms or adjusts that recommendation.

Unfinished learning in one prerequisite family should not automatically prevent progression when the learner is otherwise ready. Instead, the receiving course should surface targeted Foundation reinforcement at the point of need.

## Machine-readable contract

See `transition-contract.json` for canonical skill-family mappings and required evidence fields.
