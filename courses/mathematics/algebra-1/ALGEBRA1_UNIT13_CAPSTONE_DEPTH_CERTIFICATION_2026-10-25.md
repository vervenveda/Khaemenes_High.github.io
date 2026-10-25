# Algebra I Unit 13 Capstone-Depth Certification — 2026-10-25

**Browser-certified code head:** `8e5485c04aadae0094986ee91b93971f62264507`  
**Workflow:** Algebra I Browser Regression  
**Workflow run:** `40212174060`  
**Browser job:** `121225546041`  
**Result:** PASS

## Bubble 5 — CLOSED

Unit 13 formal mastery now measures quantitative and integrated modelling depth rather than relying primarily on conceptual recognition.

## Before and after

Before this pass, Unit 13 formal mastery exposed a 60-item pool:
- 25 shared/base items;
- 35 late-abundant items.

The project and oral-defence requirements already demanded calculation, validation, revision, sensitivity testing, uncertainty, fairness and defensible conclusions, but the formal selected-response layer did not guarantee comparable mathematical depth on every generated form.

After this pass, Unit 13 exposes an **80-item formal mastery pool**:
- 25 shared/base items;
- 35 late-abundant items;
- **20 dedicated quantitative/integrated capstone-depth items**.

The 20 new depth items are distributed evenly:
- Lesson 01: 4
- Lesson 02: 4
- Lesson 03: 4
- Lesson 04: 4
- Lesson 05: 4

## Certified form blueprint

Each Unit 13 formal mastery attempt still delivers **20 questions** with an **80% mastery threshold (16/20)**.

The Unit 13 selector now uses:

`lesson-balanced-capstone-depth-low-overlap-v1`

Every generated form guarantees:
- 4 questions from each of the five formal lessons;
- **exactly 2 quantitative/integrated capstone-depth items from each lesson**;
- **10 quantitative/integrated capstone-depth items total**;
- 10 complementary support/reasoning items;
- balanced learner-visible correct-answer positions;
- unseen-first low-overlap selection;
- **0/20 immediate retake overlap** while the certified pool contract is intact.

The form version is:

`algebra1-unit13-capstone-depth-v1`

The bank version is:

`unit13-capstone-depth-v1`

## Quantitative depth added

The new capstone-depth bank requires students to execute Algebra I mathematics in modelling contexts, including:
- solving constraint and threshold inequalities;
- interpreting rates with units;
- building linear models from tables and points;
- distinguishing additive and multiplicative structure;
- comparing competing models and finding break-even points;
- evaluating exponential models;
- optimizing quadratic models;
- propagating simple measurement uncertainty through a model;
- calculating sensitivity under changed inputs and assumptions;
- comparing group and holdout errors using mean absolute error;
- evaluating decision thresholds;
- communicating scenario-based uncertainty.

These items supplement rather than replace the qualitative modelling questions about assumptions, ethics, domain, data quality, fairness, limitations and defensible conclusions.

## Evidence contract

Unit 13 attempt evidence now records:
- `capstoneQuantitativeMinimum: 10`;
- the actual `capstoneQuantitativeCount`;
- per-lesson quantitative counts;
- each answer's `capstoneDepth` and `capstoneSkill`;
- form seed, bank version and selection policy;
- original and learner-visible selected/correct option indexes;
- displayed option order;
- misconception-map source and review status;
- immutable attempt history.

The previously certified answer-locking and fail-closed persistence behavior remains intact.

## Project and oral-defence alignment

The existing Unit 13 project enhancement was discovered to be authored but dormant. It is now actively loaded by:

`units/unit-13/projects/algebra-i-integrated-modelling-portfolio-oral-defence.html`

The active portfolio requires:
- at least three complementary representations;
- integration of multiple Algebra I ideas;
- explicit calculations with units;
- independent verification of key calculations;
- comparison with evidence or constraints;
- at least one revision caused by evidence;
- sensitivity testing of at least two inputs or assumptions;
- identification of recommendation-changing thresholds;
- uncertainty, limitations and fairness analysis;
- a bounded recommendation;
- oral defence and reflection.

Its formal mastery description now matches the **80-item pool / 20 delivered / quantitative depth** architecture.

## Answer-key parity

`units/unit-13/assessment/answer-key.json` is now:

`khaemenes.algebra1.unit13.answer-key.v2`

It covers all **80 active Unit 13 formal mastery items** and records:
- lesson;
- difficulty;
- category;
- source;
- answer index and text;
- explanation;
- capstone-depth status.

The previous stale/incomplete answer-key state is no longer used as the formal pool record.

## Misconception coverage after capstone expansion

The late formal mastery universe now contains **320 active items** across Units 10–13.

Coverage:
- **33 exact reviewed records**
- **287 family-provisional-v1 records**
- **320/320 active items mapped**
- **19 Unit 11 stale-ID overrides remain safely provisional**
- all **20 new Unit 13 capstone-depth items remain provisional**
- provisional learner-facing diagnosis remains suppressed.

The new depth items were not bulk-promoted to reviewed status.

## Offline support

The Algebra I cache manifests include:
- `assets/unit13-capstone-depth-bank-v1.js`;
- `units/unit-13/projects/unit-13-project-upgrade.js`;
- the late-unit misconception map and resolver;
- the previously certified abundance assets.

The capstone-depth architecture therefore remains available within the course's offline-first design.

## Validation and browser certification

The exact certified head passed:
- syntax checks;
- runtime assessment-bank validation;
- late-unit immutable evidence validation;
- late-unit Monte Carlo abundance validation;
- late-unit misconception coverage validation;
- **Unit 13 capstone-depth validation**;
- full Algebra I assessment-depth validation;
- dedicated misconception-map validation;
- consolidated forensic assessment integration;
- Unit 01–09 Chromium regression;
- Unit 10–13 Chromium regression.

Chromium explicitly verified for Unit 13:
- eligible pool size = **80**;
- delivered items = **20**;
- quantitative/integrated count = **10**;
- quantitative count by lesson = **2 / 2 / 2 / 2 / 2**;
- immutable submitted controls;
- balanced answer positions;
- reviewed-only misconception feedback;
- **0/20 immediate retake overlap**;
- the same capstone-depth requirement on the retake;
- v2 reconstructable evidence;
- two attempts retained after reload;
- no browser/page console errors.

## Five-bubble status

- Bubble 1 — **CLOSED:** immutable late-unit grading.
- Bubble 2 — **CLOSED:** abundant low-overlap late-unit retakes.
- Bubble 3 — **CLOSED:** reconstructable evidence and fail-closed persistence.
- Bubble 4 — **CLOSED:** complete active misconception coverage with reviewed-only learner feedback.
- Bubble 5 — **CLOSED:** Unit 13 quantitative/integrated capstone-depth mastery.

## Remaining review-quality boundary

Closing these five runtime/curriculum bubbles does **not** mean every misconception diagnosis is human-reviewed.

Still provisional:
- **410** dedicated Units 01–09 misconception records from the earlier review boundary;
- **287** late-unit active records, including the 19 Unit 11 stale-ID overrides and all 20 new Unit 13 capstone-depth items.

These records should remain provisional until item-by-item distractor review. They should not be bulk relabeled as reviewed.
