# Algebra I Post-Abundance Forensic Audit — Five New Bubbles
Date: 2026-10-25
Branch: main
Audited head: 7ec9051dc7921d80c903508443331097e30cca2b

This pass intentionally looks beyond the newly certified Unit 01–09 abundance architecture and asks where Algebra I still has a quality or integrity discontinuity.

## Bubble 1 — Units 10–13 formal mastery answers are not immutable after grading

The late-unit formal mastery pages use `assets/legacy-mastery-engine-v2.js`.

That engine scores the selected radios but does not install a graded-state guard and does not disable submitted inputs. A learner can therefore change selections after a scored attempt and press Submit & Score again without beginning a controlled fresh attempt.

This is below the now-certified Units 01–09 contract.

Upgrade:
- lock all submitted answer controls;
- disable the score button after grading;
- expose an explicit fresh-retake control;
- append a new immutable attempt rather than allowing in-place answer mutation.

## Bubble 2 — Units 10–13 formal retakes are deterministic, not Monte Carlo

The legacy mastery engine builds a stable 20-item blueprint by sorting candidates by difficulty and ID. Reopening or resetting the assessment rebuilds the same item set.

Current formal mastery pool / delivered behavior:

- Unit 10: 40 available, same 20 selected each attempt.
- Unit 11: 30 visible to the legacy mastery engine, same 20 selected each attempt.
- Unit 12: 35 available, same 20 selected each attempt.
- Unit 13: 25 available, same 20 selected each attempt.

The content overlap of repeated attempts is therefore 20/20.

Unit 11 already contains a stronger 120-question rebuild in `assets/unit-11-content-upgrade.js`, but the formal mastery page loads `question-bank.js` plus the legacy mastery engine rather than the content-upgrade path. Its deeper bank is therefore not being used by formal mastery.

Upgrade:
- migrate Units 10–13 to abundance-enabled blueprint selection;
- use a minimum 30-item eligible pool per lesson/mastery surface where appropriate;
- load the existing Unit 11 rebuild into the formal assessment path;
- prefer unseen items from the immediately prior form;
- preserve lesson/difficulty coverage instead of blind shuffle.

## Bubble 3 — Late-unit evidence is materially weaker than Units 01–09 and persistence can fail silently

Legacy mastery attempts store score, item IDs, timestamps and trust metadata, but do not preserve:
- selected displayed option index;
- selected original option index;
- correct displayed/original indexes;
- selected/correct text;
- form version;
- bank version;
- selection policy;
- misconception metadata.

The save helper also catches `localStorage` failures without returning failure status. The learner-facing result still says the best score was “saved” even when persistence could have failed.

Upgrade:
- move Units 10–13 to `algebra1-answer-evidence-v2` parity;
- preserve form source/version and original/displayed option identity;
- make persistence return success/failure;
- never award or announce persisted mastery when evidence storage fails;
- add save → reload → evidence regression coverage for Units 10–13.

## Bubble 4 — Misconception diagnostics are incomplete and inactive in Units 10–13

The shared misconception map covers only part of the late-unit base bank:

- Unit 10: 16/40 mapped; 24 unmapped.
- Unit 11: 19/30 mapped; 11 unmapped.
- Unit 12: 16/35 mapped; 19 unmapped.
- Unit 13: 1/25 mapped; 24 unmapped.

That is 78 unmapped late-unit shared-bank items.

In addition, the legacy mastery engine does not call the modern misconception resolver or store misconception evidence, so even mapped items do not receive the Units 01–09 diagnostic behavior during formal mastery.

Upgrade:
- map all remaining late-unit items;
- connect Units 10–13 formal mastery to the misconception resolver;
- preserve review status in evidence;
- show learner-facing diagnosis only for reviewed mappings;
- keep provisional diagnoses evidence-only until reviewed.

## Bubble 5 — Unit 13 formal mastery under-measures the capstone modelling objectives

Unit 13 is the integrated modelling/defence capstone, but its 25 base mastery items are dominated by conceptual recognition questions about assumptions, sensitivity, evidence and limitations.

Audit signals:
- 23 of 25 authored correct answers currently occupy answer index 0 before display shuffling;
- the bank repeatedly asks variants of “state the question,” “change an input,” and “state assumptions/limitations”;
- there is little direct quantitative construction, calculation, sensitivity computation, competing-model comparison or numerical validation in the formal selected-response bank.

The project/oral-defence layer is stronger, but the formal mastery check should still sample quantitative modelling skill rather than mainly vocabulary-level judgement.

Upgrade:
- add multi-step numerical modelling items;
- require interpreting tables/graphs/parameters;
- include sensitivity calculations, error bounds and scenario comparisons;
- include model-choice and validation tasks with actual quantities;
- balance conceptual ethics/reasoning with executable Algebra I mathematics.

## Recommended execution order

1. Bubble 1 — immutable late-unit grading.
2. Bubble 3 — evidence parity and fail-closed persistence.
3. Bubble 2 — abundance/fresh retakes for Units 10–13.
4. Bubble 4 — late-unit misconception mapping and resolver integration.
5. Bubble 5 — deepen Unit 13 capstone mastery mathematics.

This order repairs assessment integrity first, then evidence reliability, then Monte Carlo freshness, then diagnostic depth, and finally the capstone curriculum-quality layer.

## Preserve

Do not weaken:
- 80% mastery threshold;
- canonical prerequisite gates;
- Midterm prerequisite for second-half units;
- learner-scoped local records;
- existing Unit 01–09 certified abundance architecture;
- reviewed-only learner-facing misconception feedback;
- closed-book cumulative Midterm/Final boundaries.
