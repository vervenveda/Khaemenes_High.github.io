# Distractor Quality & Misconception Mapping v1 — Rollout Record

**Date:** 2026-10-25  
**Status:** Active · staged backfill  
**Canonical contract:** `courses/shared/ASSESSMENT_DISTRACTOR_QUALITY_CONTRACT_V1.md`  
**Validator:** `tools/validate-distractor-quality-v1.mjs`

## Why this layer was added

The consolidated forensic assessment established that all 1,710 audited public objective items had valid answer keys, four-option contracts, unique choices, and item-level correct-answer explanations. It also exposed a remaining limitation: the repository did not carry a structured explanation for **why each wrong option is wrong and what misconception it diagnoses**.

Version 1 adds that missing layer without modifying the original learner-facing banks.

## Architecture

Misconception data live in companion JSON maps keyed by the bank's stable item ID.

This protects:

- existing question wording;
- existing answer keys;
- historical attempts and best scores;
- course-specific renderers;
- randomized option-order logic;
- local/offline operation.

The validator compares the misconception map against the live bank. Any change to the prompt, keyed answer, or mapped option text creates a drift failure and requires a fresh review.

## Reviewed tranches

### Algebra I

Map: `courses/mathematics/algebra-1/assets/assessment-misconceptions-v1.json`

- **13 reviewed items**
- **39 distractor rationales**
- one reviewed unit-anchor item in every Algebra I unit;
- **13/13 unit coverage**;
- each wrong option carries a kebab-case misconception tag and educator-facing rationale.

Examples of mapped misconceptions include:

- inverse-operation error;
- strict-vs-inclusive boundary;
- repeated-output misconception;
- coefficient/exponent confusion;
- convenience sampling;
- voluntary-response bias;
- premature rounding;
- hidden assumptions.

### Chemistry 11

Map: `courses/science/chemistry-11/assessment-misconceptions-v1.json`

- **100 reviewed items**
- **300 distractor rationales**
- legacy concept spine spanning **U1–U9 plus capstone**;
- ten seven-item quantitative families now mapped: density, ionic particle counting, weighted-average atomic mass, photon frequency/nm conversion, Boyle's law, molarity, percent yield, moles from molarity and volume, average reaction rate, and Kc;
- **29.5% of the 339-item Chemistry bank** now has reviewed misconception mapping.

Examples include:

- proton/neutron confusion;
- ionic-neutrality misconception;
- mass-only molecular polarity;
- catalyst changes equilibrium constant;
- equilibrium stops molecular motion;
- molarity unit confusion;
- pH linear-scale misconception;
- single-criterion sustainability decisions.

## Quantitative-family tranche

The second Chemistry tranche adds **70 quantitative items / 210 distractor rationales**. These are not generic error labels. The mapped alternatives identify recurring quantitative mistakes including:

- doubling or halving a density result;
- confusing atomic number, mass number, charge, electrons, and neutrons;
- using an unweighted isotope mean;
- shifting the nanometer exponent by a power of ten;
- treating Boyle's-law variables as directly proportional;
- multiplying instead of dividing in molarity;
- inverting the percent-yield ratio;
- using mL directly instead of converting to liters;
- multiplying concentration change by time or inverting the rate ratio;
- reversing the equilibrium expression, adding reactant concentrations, or summing all concentrations instead of evaluating Kc.

Chemistry's local question-bank auditor now validates the misconception map for prompt, answer, option-text, tag, and rationale drift.

## Current Academy-wide coverage

The consolidated forensic assessment audits **1,710 objective items**.

The first reviewed tranche therefore provides:

- **113 / 1,710 reviewed items = 6.6%**
- **339 explicit distractor rationales**

The percentage is intentionally reported as a warning rather than disguised as complete coverage.

## Validation contract

`node tools/validate-distractor-quality-v1.mjs`

The validator requires:

- the mapped item still exists;
- prompt text still matches;
- answer index still matches;
- correct-answer rationale still matches the bank explanation;
- every incorrect option appears exactly once;
- mapped option text still matches;
- misconception tags use kebab-case;
- rationales contain substantive reasoning;
- Algebra I spans all 13 units;
- Chemistry 11 spans the reviewed year-long concept spine.

The same checks are integrated into:

`node tools/forensic-assessment-audit.mjs`

## What v1 does not claim

The current staged rollout does not certify distractor rationale quality for all 1,710 items.

It also does not publish or inspect confidential secure-assessment distractors. Protected items may follow the same contract behind the authorized assessment boundary without exposing their content publicly.

## Next staged backfill

Recommended order:

1. Chemistry 11 remaining high-repetition quantitative families, prioritizing thermochemistry, equilibrium, acids/bases, electrochemistry, nuclear decay, and engineering decision analysis;
2. Algebra I remaining lesson-check families, prioritizing common error patterns;
3. Biology 10 and Physics 12 evidence/quantitative anchors;
4. English 10–12 passage-anchor items;
5. Grade 12 Social Studies source/data transfer items.

A course should set `distractorMappingRequired: true` only after the selected required scope has actually been reviewed. Until then, incomplete coverage remains a forensic warning rather than a learner-grading failure.
