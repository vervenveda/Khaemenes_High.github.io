# Khaemenes High · Consolidated Forensic Assessment — 2026-10-24

**Canonical instrument:** `tools/forensic-assessment-audit.mjs`  
**Compatibility entry point:** `tools/validate-phase2-assessment-evidence.mjs`  
**Current classification:** **PASS WITH WARNINGS**

## Purpose

This document consolidates the four Phase 2 assessment findings into one forensic assessment standard. The instrument inspects the underlying public banks and runtime contracts directly rather than merely chaining four independent PASS/FAIL scripts.

The assessment covers:

1. Grade 12 Social Studies transfer/source/data reasoning;
2. English 10–12 passage/source anchoring and randomized-form guarantees;
3. Algebra I runtime-authoritative dedicated Units 01–09 banks, shared alternate/late-unit bank, answer-position balance, fresh retakes, selected-answer evidence, and misconception mapping;
4. Biology 10, Chemistry 11, and Physics & Engineering 12 ordinary-week transfer evidence plus public secure-assessment blueprints;
5. Academy-wide duplicate prompts, explanation coverage, option/answer validity, structured distractor-rationale metadata, and public/private assessment boundaries.

The specialist course engines remain authoritative for their own learner records and grading behavior. The consolidated audit does not replace them.

## Consolidated snapshot

| Measure | Current result |
| --- | ---: |
| Public objective items inspected | **2,320** |
| Items with an item-level explanation | **2,320 / 2,320 (100%)** |
| Four-option objective items | **2,320 / 2,320 (100%)** |
| Valid keyed answers | **2,320 / 2,320 (100%)** |
| Reviewed misconception-mapped items | **810 / 2,320 (34.9%)** |
| Provisional lesson-family misconception mappings | **410 / 2,320 (17.7%)** |
| Any misconception mapping | **1,220 / 2,320 (52.6%)** |
| Explicit reviewed distractor rationales | **2,430** |
| Provisional distractor rationales | **1,230** |
| Grade 12 Social Studies weekly banks passing transfer rule | **36 / 36** |
| English 10–12 weekly passage/source anchors | **108 / 108** |
| Upper-science ordinary weeks with transfer evidence | **102 / 102** |
| Algebra I dedicated runtime banks · Units 01–09 | **61 lessons / 610 items** |
| Algebra I shared alternate/late-unit bank | **87 lessons / 435 items** |
| Units 02–09 visible ten-question answer balance | **3 / 3 / 2 / 2, position assignment randomized** |
| Shared late-unit five-question answer balance | **2 / 1 / 1 / 1, position assignment randomized** |

## 1. Grade 12 Social Studies

**Status: PASS**

The canonical Grade 12 course-data bank contains **360 objective items** across 36 weekly assessments.

Forensic results:

- 36/36 weekly banks contain 10 questions and `transfer-v3` metadata;
- maximum stand-alone vocabulary recall found in any weekly bank: **0/10**;
- minimum transfer/source/data/map/case reasoning found in any weekly bank: **10/10**;
- exact duplicate prompt rate: **0%**;
- template-cluster signal under the current heuristic: **0%**;
- explanation coverage: **100%**;
- four-option coverage: **100%**;
- unique-choice coverage: **100%**;
- valid-answer coverage: **100%**;
- authored answer positions: **88 / 94 / 92 / 86**, showing no material authored-position concentration.

This exceeds the audit floor of no more than 20% stand-alone vocabulary recall and at least 50% disciplinary transfer.

## 2. English 10–12

**Status: PASS**

Each upper-English course uses `v4-passage-anchored`.

Coverage:

- English 10: 36/36 weekly anchors;
- English 11: 36/36 weekly anchors;
- English 12: 36/36 weekly anchors;
- total: **108/108**.

The weekly runtime also enforces a `passage-anchor` source quota, so an anchor is not merely present in the seven-item candidate pool; at least one must appear in the learner's randomized five-question form.

The supplemental banks contain **216 items** total. Across those items:

- exact duplicate prompts: **0**;
- explanation coverage: **100%**;
- four-option coverage: **100%**;
- unique-choice coverage: **100%**;
- valid-answer coverage: **100%**.

The raw supplemental schema stores the keyed option first, so its authored positions are intentionally 72/0/0/0 in each grade. This is **not the learner-visible order**. The first-party Monte Carlo engine's `balancedOptionOrders()` materializes a balanced option order and remaps the keyed answer before display. Supplemental item IDs are also scoped to the bank version so a changed bank cannot silently reuse an old active-form identity.

## 3. Algebra I

**Status: PASS · source/runtime contract + representative Chromium regression**

Algebra I now has two distinct public assessment sources and the forensic system treats them separately rather than using one as a proxy for the other.

### Runtime-authoritative Units 01–09

The dedicated banks contain **610 items across 61 lessons**:

- Unit 01: 60 items / 6 lessons;
- Unit 02: 70 / 7;
- Unit 03: 70 / 7;
- Unit 04: 60 / 6;
- Unit 05: 70 / 7;
- Unit 06: 80 / 8;
- Unit 07: 70 / 7;
- Unit 08: 60 / 6;
- Unit 09: 70 / 7.

Every dedicated lesson contains **10 authored questions**. Unit 01's former 8-question runtime slice has been removed, restoring the intended 10-question lesson-check contract and an exact **8/10 = 80%** mastery threshold.

Units 02–09 now rebuild the learner-visible option order before the first attempt. Their ten-question forms distribute keyed answers **3/3/2/2 across the four visible positions**, with the positions receiving three correct answers randomized each form. The original authored order remains unchanged in the bank.

All **55 Unit 02–09 lessons** also have five aligned items in the shared bank. The runtime therefore has a **15-item aligned lesson pool**: ten dedicated questions plus five aligned alternates. First attempts use the ten dedicated questions; fresh retakes use five aligned alternates plus five dedicated questions rather than merely moving the same answer labels.

Units 02–09 save immutable, versioned answer snapshots containing:

- item ID and source;
- selected learner-visible option index;
- selected original-bank option index;
- correct learner-visible option index;
- correct original-bank option index;
- selected and correct text;
- form version and form sources.

That makes the learner's actual error pattern available for future misconception analysis without rewriting completed attempts.

### Shared bank

The separate shared bank contains **435 items across 87 lesson groups**. It remains authoritative for aligned alternates and later-unit assessment surfaces. Its lesson renderer balances five-question forms at **2/1/1/1** learner-visible correct positions and preserves answer mapping.

The shared misconception map currently covers **271/435 items** with **813 reviewed distractor rationales**, including every normalized repeated family with three or more variants identified in the prior pass.

### Dedicated misconception mapping

The live Units 01–09 banks now have their own direct companion map:

`courses/mathematics/algebra-1/units/dedicated-assessment-misconceptions-v1.json`

Coverage is **610/610 dedicated items / 1,830 distractor rationales**. Certification is deliberately split:

- Units **01, 05, and 09**: **200 items / 600 rationales**, marked `lesson-family-reviewed-v1`;
- Units **02–04 and 06–08**: **410 items / 1,230 rationales**, marked `lesson-family-provisional-v1` pending item-level refinement.

The provisional mappings are useful diagnostic scaffolds, but they are **not represented as fully reviewed item-level certification**.

Drift validation now compares dedicated item IDs, prompt text, keyed answer, explanation, wrong-option indexes, option text, misconception tags, and rationale completeness directly against the live 610-item banks.

### Browser execution boundary

The repository now contains:

`courses/mathematics/algebra-1/tools/browser-regression-units01-05-09.mjs`

and:

`.github/workflows/algebra1-browser-regression.yml`

The Playwright/Chromium journey opens the actual representative Unit 01, Unit 05, and Unit 09 lesson pages and verifies first attempt → submit → immutable answer lock → fresh retake → saved evidence → reload. The workflow also runs the runtime-bank and dedicated-misconception validators before browser execution, so a source-contract failure prevents a misleading browser PASS.

**Certified browser run 40167547597: PASS.** Unit 01, Unit 05, and Unit 09 each rendered ten-question first forms and ten-question retakes, preserved two attempts through reload, and produced no browser/page console errors. Unit 05 and Unit 09 retakes explicitly contained both dedicated and aligned-alternate items.

## 4. Upper Science

**Status: PASS for the four Phase 2 requirements; diagnostic warnings retained**

### Biology 10
- public bank: **180 items**;
- ordinary instructional weeks with evidence/quantitative/model/application/method/design item: **34/34**;
- exact duplicate prompts: **0**;
- explanation/four-option/valid-answer coverage: **100%**.

Raw authored answer positions are **154 / 20 / 6 / 0**.

### Chemistry 11
- public bank: **339 items**;
- ordinary instructional weeks with transfer evidence: **34/34**;
- exact duplicate prompts: **0**;
- explanation/four-option/valid-answer coverage: **100%**.

Raw authored answer positions are **335 / 4 / 0 / 0**.

The template-similarity heuristic marks approximately **51.6%** of the Chemistry bank as belonging to repeated structural families. All 25 high-repetition Chemistry families and the remaining evidence/model spine are misconception-mapped. Chemistry 11 now has complete public-bank coverage, so repeated structures function as controlled diagnostic variants and any future unmapped or drifted public item is a hard validation failure. The similarity percentage itself is retained as a structural signal and is not falsely reduced by metadata alone.

### Chemistry misconception-map certification

Chemistry 11 now has **339/339 public selected-response items** mapped to **1,017 explicit distractor rationales**. The course sets `distractorMappingRequired: true`; the dedicated validator, Chemistry local bank audit, and consolidated forensic assessment all fail if coverage is lost or if a reviewed prompt, key, explanation, or option text drifts without re-review.

### Physics & Engineering 12
- public bank: **180 items**;
- ordinary instructional weeks with transfer evidence: **34/34**;
- exact duplicate prompts: **0**;
- explanation/four-option/valid-answer coverage: **100%**.

Raw authored answer positions are **120 / 20 / 19 / 21**.

### Why the science raw-position skew is not automatically a learner-facing defect

All three public science portals load the first-party Monte Carlo engine and build public practice midterm/final forms through `openSession()` followed by `materialize()`. The shared engine's balanced option-order routine moves the keyed response to balanced learner-visible positions and remaps the answer index.

Therefore the authored-position figures above remain an **item-bank forensic signal**, not evidence that the public Monte Carlo practice forms reveal those patterns.

This finding does **not** certify the option balance of protected supervised assessments, because those confidential forms are intentionally outside the public repository.

### Secure blueprint status

All three upper-science assessment pages link a public `SECURE_ASSESSMENT_BLUEPRINT.md`.

Each blueprint records:

- the 80% mastery floor;
- Week 18 cumulative midterm;
- Week 36 comprehensive final;
- public cognitive evidence families;
- ordinary-week transfer expectations;
- closed-book secure-summative policy;
- correction/history boundaries;
- educator-reviewed performance evidence;
- accommodation principles;
- material that is safe to publish;
- material that must remain protected.

The public course maps continue to identify the protected summative design as a **15-item midterm** and **30-item final**. Public Monte Carlo practice forms may use different lengths; practice-form length is not represented as the secure exam length.

## 5. Academy-wide warning — misconception review depth

**Status: WARN**

The audit now distinguishes **reviewed** misconception metadata from **provisional lesson-family scaffolds**.

Across the **2,320** distinct public objective items in the consolidated scope:

- **810 items (34.9%)** have reviewed misconception mapping;
- **410 items (17.7%)** have provisional Algebra I lesson-family mapping;
- **1,220 items (52.6%)** therefore have some structured misconception mapping;
- reviewed mappings contain **2,430 distractor rationales**;
- provisional mappings contain another **1,230 rationales**.

The remaining warning is no longer “no distractor rationale system exists.” The system exists and is enforced with drift protection. The warning is now about **review depth and remaining unmapped courses/items**.

Provisional Algebra I mappings are intentionally not promoted to reviewed status until their individual distractors receive item-level scrutiny. Likewise, unmapped Social Studies, English, Biology, and Physics items should be backfilled in staged, subject-reviewed tranches rather than by silently bulk-labeling wrong answers.

This warning does not lower the 80% mastery rule, change historical attempts, expose protected assessments, or prevent current learner use.

## Distractor Quality & Misconception Mapping v1 rollout

The v1 contract is active at `courses/shared/ASSESSMENT_DISTRACTOR_QUALITY_CONTRACT_V1.md`.

Current mapping status:

- Algebra I shared bank: **271 / 435 reviewed items / 813 rationales**;
- Algebra I dedicated Units 01–09: **610 / 610 mapped**, split into **200 reviewed representative items / 600 rationales** and **410 provisional items / 1,230 rationales**;
- Chemistry 11: **339 / 339 reviewed items / 1,017 rationales / mapping required**;
- consolidated reviewed coverage: **810 / 2,320 (34.9%)**;
- consolidated any-mapping coverage: **1,220 / 2,320 (52.6%)**.

Dedicated Algebra validation:

`node courses/mathematics/algebra-1/tools/validate-dedicated-misconceptions-v1.mjs`

Runtime-aware Algebra validation:

`node courses/mathematics/algebra-1/tools/validate-runtime-assessment-banks.mjs`

The consolidated audit fails drift inside reviewed mappings and reports provisional coverage separately rather than treating provisional lesson-family tags as full certification.

## Running the unified forensic assessment

Default human-readable report:

`node tools/forensic-assessment-audit.mjs`

Machine-readable JSON:

`node tools/forensic-assessment-audit.mjs --json`

Treat warnings as CI failures:

`node tools/forensic-assessment-audit.mjs --strict-warnings`

The former Phase 2 command now routes through the same canonical instrument:

`node tools/validate-phase2-assessment-evidence.mjs`

## Certification boundary

This consolidated forensic assessment certifies the **public repository's** banks, item contracts, runtime randomization/remapping contracts, source-anchor requirements, public cognitive blueprints, and documented security boundaries.

It does **not** inspect or claim to certify confidential supervised midterm/final prompts, keys, form-generation secrets, private reviewer notes, authentication/signing material, or private learner records that are intentionally absent from the public repository.

A public blueprint is evidence of intended secure-assessment design; it is not evidence that a confidential form has been independently administered or psychometrically validated.
