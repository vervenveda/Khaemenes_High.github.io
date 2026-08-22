# UNIT 0 — FOUNDATIONS & READINESS EXIT ASSESSMENT
## STATUS: LOCKED BLUEPRINT

**Assessment ID:** `KH-MATH-PA-U00-EXIT`  
**Purpose:** Determine whether the learner has completed the conditional refresher and is ready to enter Official Unit 1.

## Non-Negotiable Rule

**Unit 0 mastery does not award or replace Pre-Algebra course completion.** It records readiness to begin the official course.

On successful exit:

**Unit 0 → Official Unit 1**

There is no additional placement gate between Unit 0 mastery and Official Unit 1.

## Mastery Standard

- **80% or higher overall**
- required reasoning corrections completed
- essential prerequisite strands must show sufficient evidence
- no correct-answer disclosure before submission
- new parallel form used for a retake

## Recommended Form A Blueprint — 30 Items

| Strand | Items | Essential |
|---|---:|---|
| Number Foundations | 5 | Yes |
| Rational & Proportional Reasoning | 5 | Yes |
| Algebraic Reasoning | 5 | Yes |
| Functions & Coordinates | 5 | Supporting |
| Geometry & Measurement | 5 | Supporting |
| Data & Probability | 5 | Supporting |
| **Total** | **30** | |

### Item Mix
Within the 30 items, include approximately:
- 12 direct prerequisite-skill items;
- 8 application/context items;
- 5 error-analysis/reasoning items;
- 3 representation or data-reading items;
- 2 multi-strand transfer items.

The exit assessment must not be a copy of the Readiness Gateway. It measures the same prerequisite constructs with **new numbers, new contexts, new representations, and new question IDs**.

## Stable Question IDs

Form A IDs:
- `PA-U00-A-NF-001` through `PA-U00-A-NF-005`
- `PA-U00-A-RP-001` through `PA-U00-A-RP-005`
- `PA-U00-A-AR-001` through `PA-U00-A-AR-005`
- `PA-U00-A-FC-001` through `PA-U00-A-FC-005`
- `PA-U00-A-GM-001` through `PA-U00-A-GM-005`
- `PA-U00-A-DP-001` through `PA-U00-A-DP-005`

Form B uses the same structure with `B` instead of `A` and entirely new items.

## Essential-Strand Rule

A high total score must not hide a critical gap.

Direct exit to Unit 1 requires:
- overall score **≥ 80%**; and
- Number Foundations **≥ 80%**; and
- Rational & Proportional Reasoning **≥ 80%**; and
- Algebraic Reasoning **≥ 80%**.

Supporting strands below 80% are written to the NAIB Refresh record and become targeted supports during the official course; they do not automatically block entry when the overall and essential-strand rules are satisfied.

## Below-Mastery Workflow

If the learner does not meet the exit rule:

1. show overall score and strand profile;
2. identify missed concepts without exposing a reusable answer key prematurely;
3. require **reasoning corrections** for missed standards;
4. give targeted practice only in the affected strands;
5. administer **parallel Form B**;
6. recompute mastery from the actual new attempt;
7. route to Official Unit 1 once the exit rule is satisfied.

Do not recycle the exact same questions until memorization substitutes for understanding.

## Reasoning Correction Contract

For each required correction, the learner records:
1. stable question ID;
2. the mathematical idea that was misunderstood;
3. why the original approach failed;
4. corrected reasoning/work;
5. one new example solved correctly.

A changed answer without reasoning is not a completed correction.

## Student Interface Requirements

The eventual assessment page must include:
- question navigator;
- Previous / Next controls;
- visible answered/unanswered states;
- pre-submission review screen;
- Submit control;
- keyboard usability;
- responsive layout;
- high-contrast and clear focus states;
- printable result report;
- no premature answer disclosure;
- saved attempt record;
- clear distinction between Form A and Form B.

## Attempt Record

Store:
- `assessment_id`
- `assessment_version`
- `form`
- `timestamp`
- `attempt_number`
- `raw_score`
- `percent`
- `strand_scores`
- `strengths`
- `refresh_priorities`
- `correction_status`
- `route`

## NAIB Output

On every exit attempt, update only the appropriate records:

### Refresh
What still needs reinforcement now.

### Readiness
Whether the learner is ready to enter Official Unit 1.

Do **not** overwrite:
- prior Course Mastery;
- prior Retention;
- previous course completion.

## Successful Exit Record

When mastery is achieved, NAIB receives:

- route: `advance`
- destination: `KH-MATH-PA-U01`
- unit_0_status: `mastered`
- threshold: `80`
- corrections: `complete`
- timestamp
- strand profile

The student-facing message should be simple:

> **Foundations confirmed. You are ready to begin Official Unit 1.**

## Verdict

**GREEN — LOCKED BLUEPRINT**

Unit 0 is a support bridge with a real exit standard, not a holding area. Mastery sends the learner directly into the official 36-week Pre-Algebra curriculum.
