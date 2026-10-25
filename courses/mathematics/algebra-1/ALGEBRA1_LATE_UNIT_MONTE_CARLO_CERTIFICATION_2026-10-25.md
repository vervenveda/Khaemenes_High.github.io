# Algebra I Late-Unit Monte Carlo Certification — 2026-10-25

**Browser-certified code head:** `7b9f2f5a10fd86df0801ee71fe80ef118177a5f3`  
**Workflow:** Algebra I Browser Regression  
**Workflow run:** `40210099886`  
**Browser job:** `121219288857`  
**Result:** PASS

## Bubble 2 — CLOSED

Units 10–13 no longer rebuild the same fixed 20-question mastery form on every attempt.

### Certified eligible pools

- Unit 10: **60 eligible / 20 delivered**
- Unit 11: **120 eligible / 20 delivered**
- Unit 12: **60 eligible / 20 delivered**
- Unit 13: **60 eligible / 20 delivered**

Unit 11 now reuses its existing 120-question content rebuild in formal mastery.

Units 10, 12 and 13 add a new `late-unit-abundant-bank-v1.js` containing **80 additional stable questions**:
- Unit 10: +20
- Unit 12: +25
- Unit 13: +35

## Selection contract

The late-unit mastery runtime now:

- represents every lesson on every 20-question form;
- uses difficulty-balanced seeded selection;
- stores the form seed in evidence;
- balances learner-visible correct-answer positions;
- prefers unseen items from the immediately prior form;
- fails closed unless each lesson has enough depth to support an immediate low-overlap retake;
- requires 60 eligible items for Units 10, 12 and 13 and 120 for Unit 11.

The certified immediate-retake contract is **0/20 repeated items** for Units 10–13.

## Evidence preserved

The previously certified integrity work remains active:

- submitted answers lock after grading;
- fresh attempts append rather than mutate prior evidence;
- `algebra1-answer-evidence-v2` is preserved;
- original/displayed selected and correct indexes are stored;
- displayed option order is stored;
- bank version, selection policy, eligible-pool size and form seed are stored;
- failed browser persistence does not issue or claim saved mastery.

## Browser certification

Chromium tested:

**Unit 10 → Unit 11 → Unit 12 → Unit 13 formal mastery**

For every unit it verified:

- 20-item form;
- eligible pool size of 60/120/60/60;
- immutable grading;
- balanced visible answer positions;
- explicit fresh-attempt control;
- 0/20 immediate retake overlap;
- saved form seed and reconstructable evidence;
- second attempt appended;
- reload persistence;
- no page or console errors.

The existing Unit 01–09 browser regression also passed on the same code head.

## Validation coverage

The same run passed:

- runtime assessment-bank validation;
- late-unit immutable-evidence validation;
- late-unit Monte Carlo abundance validation;
- full Algebra I assessment-depth validation;
- dedicated misconception validation;
- consolidated forensic assessment integration;
- Unit 01–09 Chromium regression;
- Unit 10–13 Chromium regression.

## Remaining post-abundance bubbles

- Bubble 1 — CLOSED: immutable late-unit grading.
- Bubble 2 — CLOSED: abundant low-overlap late-unit retakes.
- Bubble 3 — CLOSED: reconstructable evidence and fail-closed persistence.
- Bubble 4 — OPEN: late-unit misconception mapping and resolver integration.
- Bubble 5 — OPEN: Unit 13 formal mastery still deserves a dedicated capstone-depth review even though this abundance migration added more quantitative modelling items.

Recommended next move: Bubble 4, bringing Units 10–13 misconception coverage and reviewed-only learner feedback up to the same runtime standard as Units 01–09.
