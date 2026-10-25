# Khaemenes High · Consolidated Forensic Assessment — 2026-10-24

**Canonical instrument:** `tools/forensic-assessment-audit.mjs`  
**Compatibility entry point:** `tools/validate-phase2-assessment-evidence.mjs`  
**Current classification:** **PASS WITH WARNINGS**

## Purpose

This document consolidates the four Phase 2 assessment findings into one forensic assessment standard. The instrument inspects the underlying public banks and runtime contracts directly rather than merely chaining four independent PASS/FAIL scripts.

The assessment covers:

1. Grade 12 Social Studies transfer/source/data reasoning;
2. English 10–12 passage/source anchoring and randomized-form guarantees;
3. Algebra I learner-visible answer-position balance and answer mapping;
4. Biology 10, Chemistry 11, and Physics & Engineering 12 ordinary-week transfer evidence plus public secure-assessment blueprints;
5. Academy-wide duplicate prompts, explanation coverage, option/answer validity, structured distractor-rationale metadata, and public/private assessment boundaries.

The specialist course engines remain authoritative for their own learner records and grading behavior. The consolidated audit does not replace them.

## Consolidated snapshot

| Measure | Current result |
| --- | ---: |
| Public objective items inspected | **1,710** |
| Exact duplicate prompts within audited banks | **0** |
| Items with an item-level explanation | **1,710 / 1,710 (100%)** |
| Four-option objective items | **1,710 / 1,710 (100%)** |
| Valid keyed answers | **1,710 / 1,710 (100%)** |
| Reviewed misconception-mapped items | **113 / 1,710 (6.6%)** |
| Explicit reviewed distractor rationales | **339** |
| Grade 12 Social Studies weekly banks passing transfer rule | **36 / 36** |
| English 10–12 weekly passage/source anchors | **108 / 108** |
| Upper-science ordinary weeks with transfer evidence | **102 / 102** |
| Algebra I lesson-check bank | **87 lessons / 435 items** |
| Algebra I visible five-question answer distribution | **2 / 1 / 1 / 1** |

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

**Status: PASS**

The forensic bank contains:

- **87 lessons**;
- **435 lesson-check questions**;
- **0 exact duplicate prompts**;
- **100% explanation coverage**;
- **100% four-option coverage**;
- **100% unique-choice coverage**;
- **100% valid keyed-answer contracts**.

The learner-visible five-question lesson form now uses a randomized **2/1/1/1** correct-position schedule before first render. The later DOM shuffler recognizes the balanced-form marker and does not disturb the mapped answer order.

Raw authored answer positions remain **123 / 116 / 104 / 92**, but those positions are not exposed as a fixed learner pattern by the lesson renderer.

The template-similarity heuristic marks approximately **49.2%** of Algebra I items as belonging to repeated structural families. This is recorded as a diagnostic signal rather than a defect because mathematics legitimately reuses problem structures. Exact prompt duplication remains zero.

Formal Unit Mastery remains outside this lesson-form modification and was not weakened.

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

The template-similarity heuristic marks approximately **51.6%** of the Chemistry bank as belonging to repeated structural families. The first quantitative misconception tranche now covers ten of those seven-item families, so repeated structures increasingly function as controlled diagnostic variants rather than merely repeated numerical shells. The similarity percentage itself is retained as a structural signal and is not falsely reduced by metadata alone.

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

## 5. Academy-wide warning — distractor rationale metadata

**Status: WARN**

Every audited objective item contains an explanation of the keyed response, but none of the 1,710 audited items currently exposes a standardized structured field such as:

`distractorRationales`

for the three incorrect alternatives.

That means the forensic instrument can verify:

- that distractors are distinct;
- that the keyed answer is valid;
- that an explanation exists;
- that exact prompts are not duplicated;
- that runtime answer placement is protected where applicable;

but it cannot yet mechanically certify **why each individual distractor is plausible and diagnostically useful**.

This warning does not invalidate the four completed Phase 2 repairs. It identifies the next assessment-quality metadata layer.

Recommended future contract for newly authored or substantially revised selected-response items:

- one rationale for the keyed answer;
- one misconception/error rationale for each distractor;
- cognitive category;
- source/stimulus anchor where applicable;
- difficulty/complexity tag;
- stable item ID and bank version.

Backfilling the remaining items remains a staged item-writing project rather than an automatic bulk-generation exercise. The v1 validator enforces prompt/key/option drift protection so reviewed rationales cannot silently follow a changed item.

## Distractor Quality & Misconception Mapping v1 rollout

The v1 contract is now active at `courses/shared/ASSESSMENT_DISTRACTOR_QUALITY_CONTRACT_V1.md`.

Current reviewed coverage:
- Algebra I: **13 items / 39 distractor rationales / 13 of 13 units represented**;
- Chemistry 11: **100 items / 300 distractor rationales / 29.5% bank coverage / U1–U9 plus capstone and ten quantitative families represented**;
- Academy-wide: **113 / 1,710 items (6.6%) / 339 distractor rationales**.

Dedicated validation: `node tools/validate-distractor-quality-v1.mjs`.

The consolidated audit treats incomplete legacy coverage as a warning while failing any drift inside already-reviewed mappings.

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
