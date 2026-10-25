# Algebra I · Browser Pre-Audit & Dedicated Assessment Mapping · 2026-10-25

**Branch:** main  
**Scope:** representative Unit 01 → Unit 05 → Unit 09 learner journeys and runtime-authoritative Units 01–09 assessment banks  
**Mastery floor:** 80%  
**Browser certification:** GitHub-hosted Chromium regression configured; final result recorded below when execution completes.

## Pre-audit finding

The earlier five-bubble Algebra I audit correctly identified real assessment-validity problems. The current main branch now contains source-level repairs for all five:

| Bubble | Current source-level status | Evidence |
| --- | --- | --- |
| Unit 01 graded only 8/10 authored lesson questions | **Repaired** | Unit 01 runtime caps lesson forms at 10, not 8. |
| Units 02–09 exposed authored answer-position concentration on first attempt | **Repaired** | Runtime balances learner-visible positions before first render while preserving keyed mapping. |
| Units 02–09 retry reshuffled options but reused the same questions | **Repaired** | Each lesson has 10 dedicated + 5 aligned alternate questions; retakes use 5 aligned alternates + 5 dedicated. |
| Forensic audit treated the 435-item shared bank as a proxy for learner-facing first-half banks | **Repaired** | Runtime audit now inspects all 610 dedicated Units 01–09 items separately and the consolidated audit counts them as distinct public objective items. |
| Units 02–09 did not preserve selected-answer evidence | **Repaired** | Versioned immutable snapshots preserve delivered/original selected and correct indexes plus item source. |

These repairs preserve the 80% gate, best-score history, immutable submitted attempts, offline alternate-bank caching, and existing mastery authority.

## Representative browser journey

The real-browser harness is:

`courses/mathematics/algebra-1/tools/browser-regression-units01-05-09.mjs`

The GitHub Actions workflow is:

`.github/workflows/algebra1-browser-regression.yml`

The harness serves the checked-out repository locally and opens the actual lesson HTML through Playwright Chromium. It tests representative Lesson 01 pages in Units 01, 05, and 09.

For each representative unit it verifies:

1. exactly 10 questions render on the first lesson form;
2. all questions can be answered and submitted;
3. submitted radio inputs become immutable/disabled;
4. the saved attempt contains a ten-item `answerSnapshot`;
5. Units 05 and 09 preserve delivered/original answer-index mapping and balanced visible correct positions;
6. a retake produces a fresh form;
7. Units 05 and 09 retakes contain aligned alternate items rather than only reordered choices;
8. the second attempt appends rather than overwrites the first;
9. page reload preserves attempt history and best-score evidence;
10. the representative browser page produces no JavaScript/page-console errors.

The workflow deliberately runs source/runtime validators before Chromium. A validator failure blocks browser execution instead of allowing a browser PASS to hide a broken assessment contract.

## Dedicated Units 01–09 misconception mapping

The direct companion map is:

`courses/mathematics/algebra-1/units/dedicated-assessment-misconceptions-v1.json`

It covers the complete learner-facing dedicated corpus:

- **610 / 610 dedicated objective items mapped**;
- **1,830 distractor rationales**;
- Units **01, 05, 09**: **200 items / 600 rationales**, status `lesson-family-reviewed-v1`;
- Units **02–04, 06–08**: **410 items / 1,230 rationales**, status `lesson-family-provisional-v1`.

The provisional label is intentional. It means those distractors have a curriculum-aligned lesson-family diagnosis, but have not yet been promoted to item-level reviewed certification.

The validator:

`courses/mathematics/algebra-1/tools/validate-dedicated-misconceptions-v1.mjs`

checks stable IDs, unit/lesson assignment, prompt drift, answer-key drift, explanation drift, exact wrong-option coverage, option-text drift, misconception tag format, rationale substance, representative reviewed counts, and provisional counts.

## Consolidated assessment correction

The Academy-wide forensic instrument now counts the 610 dedicated Algebra items separately from the 435-item shared Algebra bank.

Current consolidated public-objective scope is therefore:

- Social Studies 12: 360;
- English 10–12 supplemental assessment items: 216;
- Algebra I shared/alternate bank: 435;
- Algebra I dedicated Units 01–09 banks: 610;
- upper science public banks: 699;
- **total: 2,320 objective items**.

Misconception mapping is reported in two tiers:

- **810 / 2,320 reviewed items (34.9%)** with **2,430 reviewed distractor rationales**;
- **410 / 2,320 provisional items (17.7%)** with **1,230 provisional rationales**;
- **1,220 / 2,320 items (52.6%)** have some structured misconception mapping.

This distinction prevents provisional lesson-family metadata from being presented as completed item-level review.

## Execution log

The first GitHub-hosted browser attempt correctly stopped before browser execution because the runtime validator exposed two validator defects:

1. its path root was one level model too shallow for repo-root-relative paths;
2. it searched for the old literal `function balanceOptions` even though the live repaired cores define `const balanceOptions=(chosen)=>...`.

Both validator defects were repaired. They were test-infrastructure errors, not learner-runtime failures.

The current workflow rerun executes against those corrections.

## Remaining certification boundary

Until the representative Chromium job completes successfully, the source/runtime contracts are verified but the end-to-end browser journey is not certified.

After browser PASS, the remaining curriculum-quality work is to refine the **410 provisional dedicated mappings** item by item, beginning with Units 02–04 and then Units 06–08, while keeping the 610-item runtime banks and learner history unchanged.
