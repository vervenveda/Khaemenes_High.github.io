# Chemistry 11 · Inquiry instructional-time evidence v1

**Course:** International Chemistry & Materials Science 11 · KH-SCI-CHEM11  
**Evidence model version:** 2026-11-22-inquiry-minutes-v1  
**Purpose:** establish a conservative, auditable source-level numerator and denominator for the course target of **>=25% qualifying inquiry/laboratory instructional time**.

## Denominator

The source schedule contains **180 daily lesson blocks** across 36 weeks. The canonical planning assumption is **50 minutes per block**.

- 180 blocks × 50 minutes = **9,000 planned instructional minutes**
- MID Week 18 and FINAL Week 36 remain in the denominator.
- No time is removed for reading, assessment support, correction, portfolio work, or ordinary instruction.

This is deliberately conservative because the denominator includes the entire planned course.

## What qualifies for the numerator

Minutes count only when the learner is doing one or more of the following:

1. framing or refining a scientific question, testable claim, model, or prediction;
2. generating, manipulating, or analyzing data or a design;
3. comparing competing explanations/models using evidence;
4. constructing or revising a CER/evidence-based explanation from an investigation or dataset.

The following do **not** count by themselves: lecture, passive reading, navigation, vocabulary review, routine calculation practice, protected summative testing, or answer review without transfer/revision.

## Minimum source-planned inquiry allocation

For each ordinary instructional week (Weeks 01–17 and 19–35), the weekly source contract reserves a minimum:

- **Monday — 15 minutes:** phenomenon/question/model framing;
- **Thursday — 50 minutes:** investigation/design/data-analysis block;
- **Friday — 15 minutes:** evidence-based CER synthesis/revision.

That is **80 qualifying minutes per ordinary week**.

Weeks 18 and 36 are assessment/support weeks and contribute **0 new inquiry minutes** to the numerator.

## Calculation

- Ordinary instructional weeks: **34**
- 34 weeks × 80 qualifying minutes = **2,720 qualifying inquiry minutes**
- Course denominator = **9,000 minutes**
- 2,720 / 9,000 = **0.3022**
- Planned source-level inquiry share = **30.22%**

Target threshold:

- 25% of 9,000 = **2,250 minutes**
- Margin above target = **470 minutes**

## Result

**SOURCE-PLANNED INQUIRY-TIME TARGET: PASS (30.22%)**

This result is intentionally limited to the **planned curriculum/source architecture**. It proves that the published course allocates at least 25% of scheduled instructional time to qualifying inquiry under the stated counting rules.

It does **not** claim that an individual learner actually completed 2,720 inquiry minutes. Actual learner time, teacher review, attendance, browser timing, or credit authority are separate evidence/runtime questions.

## Safety and pathway parity

A physical wet-lab is not required for minutes to qualify. A supplied-data, offline simulation, or safe design investigation counts when it preserves the same question/model/data/evidence/revision reasoning. Unsafe improvisation does not count.

Physical procedures requiring equipment, PPE, ventilation, disposal controls, or qualified supervision remain subject to the course safety boundary.

## Regression rule

The canonical source is `course-map.json` under:

- `course.instructional_time_model`
- each week’s `inquiry_minutes_plan`

CI must recompute the numerator and denominator from those records and fail if:

- the planned inquiry percentage falls below 25%;
- the reported totals do not equal the recomputed totals;
- an ordinary week lacks the Monday/Thursday/Friday minimum plan;
- Week 18 or Week 36 is counted as new inquiry time without an explicit future governance revision.
