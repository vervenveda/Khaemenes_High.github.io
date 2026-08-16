# Grade 09 Forensic Curriculum Audit

**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE — do not merge or publish until the full Grade 09 forensic gate is complete.

## Purpose

This audit verifies Grade 09 as an academically rigorous, coherent, interactive, readable, learner-safe program before work advances to Grade 10. It covers curriculum quality, answer integrity, repetition, progression, mastery gating, resources, accessibility, learner-state authority, readiness placement, support pathways, and cross-course coherence.

## Canonical authority and mastery rule

- Family Registry owns learner identity and formal placement.
- NAIB receives, interprets, delegates, and connects.
- Khaemenes Academy provides Archaemenes · Academy Scholar.
- Archaemenes mentors; Archaemenes does not award mastery or bypass gates.
- Formal Grade 09 course progression requires **80% mastery**.
- Preview/Grade 08 advanced access never silently creates Grade 09 mastery or placement.
- Reassessment remains available.
- Friendly reminders explain prerequisites rather than presenting dead locks.

## Grade 09 Readiness & Placement Gateway

`courses/readiness/grade-09/` provides separate evidence in Mathematics, Language Arts, Science, Social Studies, and Research & Academic Readiness. The gateway uses 50 common-core readiness items plus up to 10 follow-up verification items and produces subject-by-subject recommendations rather than one overall learner score.

Readiness evidence does not rewrite Family Registry, promote/demote a learner, or award course mastery. Current cut bands remain policy candidates rather than validated psychometric cut scores.

### Readiness repairs completed

- deterministic displayed-answer balancing without changing underlying scoring values;
- **E01** repaired so `Although` is assessed as contrast/concession rather than mixed causal language;
- **MV2** repaired because the earlier line item accidentally offered two mathematically correct points; the corrected item asks for the point **not** on the line.

### Readiness blockers still open

- second independent verification of remaining items/keys;
- exact/near-duplicate analysis;
- constructed-response/writing evidence before high-stakes placement use;
- cut-score calibration;
- browser/accessibility/learner-isolation testing.

## Grade 09 Foundations Studio

Five support paths are built as forensic candidates:

1. Mathematics Foundations;
2. Literacy Foundations;
3. Science Foundations & Lab Reasoning;
4. Global Inquiry Foundations;
5. Academic Research & Study Studio.

Each uses a 36-week × 5-day structure, learner-scoped formal state, separate preview state, 80% progression, checkpoints, and friendly prerequisite messaging.

Support may vary by domain. A support recommendation in one subject must not lower placement in unrelated subjects or change Grade 09 membership.

### Foundations forensic repairs

**Mathematics Foundations** now de-duplicates visible answer choices before shuffling, preserves exactly one correct visible value, and exposes source-level audit metadata for generated daily/mastery positions. The earlier exact-choice collision-construction defect is therefore repaired at source level.

**Literacy, Science, Global Inquiry, and Research/Study** originally repeated one substantive question family throughout a five-item daily check or ten-item mastery check. Those tracks now use spiral evidence pools combining the current skill, recent prerequisite skills, and foundational skill families. Their multiple-choice constructors also de-duplicate visible answer choices.

Remaining Foundations work is generated-space mathematical/semantic verification, fallback-frequency review, near-duplicate analysis, checkpoint quality, and browser/mobile/keyboard/print testing.

## Cross-course runtime-integrity repair

The forensic pass found a compatibility-layer syntax hazard: several hardening assets placed large iframe runtimes inside outer JavaScript template literals while the injected runtime itself contained unescaped template literals.

The affected layers were converted to explicit external iframe runtimes.

**Pre-Algebra**
- `prealgebra-forensic-repair-runtime.js`
- `prealgebra-content-integrity-runtime.js`
- `prealgebra-forensic-sanity-runtime.js`
- `prealgebra-mastery-runtime.js`

**Integrated Science 9**
- `science9-bridge-runtime.js`
- `science9-forensic-runtime.js`
- `science9-cumulative-runtime.js`

**Global Studies Honors 9**
- `global9-bridge-runtime.js`
- `global9-forensic-runtime.js`

This is a source-level repair, not browser certification.

## Formal course findings

### English 9

- 36 weeks / 180 daily lesson blocks remain preserved in `legacy.html`.
- Academy learner-scoped continuity and sequential 80% progression are staged.
- 36 dedicated weekly five-item banks = **180 weekly objective positions**.
- Five-day learning is differentiated into Inquiry/Vocabulary, Close Reading/Evidence, Writing/Reasoning, Seminar/Counterreading/Revision, and Mastery/Portfolio work tied to the actual week.
- Independent **18-item midterm** and **24-item final** replace historical cumulative reuse.
- Four-choice positions are deterministically rotated.
- An installed forensic audit checks assembled-bank count, answer indexes, duplicate visible choices, answer-position distribution, exact prompt duplicates, and weekly-to-cumulative exact overlap once executed in a browser.

#### New transfer-integrity repair

A deeper review found that one weekly objective position remained overly procedural: it mainly asked learners to identify a recommended reading approach instead of demonstrating the week's ELA skill.

`english9-transfer-integrity.js` / `english9-transfer-runtime.js` now replace one position in every weekly bank with an original transfer item using short original passages, editing problems, rhetoric/argument cases, source-tracing situations, literary-analysis scenarios, presentation choices, or portfolio evidence. The five-item count and 80% threshold remain unchanged.

**Remaining:** second-pass weekly/transfer/cumulative key verification, semantic duplicate scan, final answer-position audit, constructed-response rubric review, purpose-mapped resources, and browser/mobile/print/learner-switch testing.

### Integrated Science 9

- 36-week integrated science/investigation architecture remains substantial.
- Academy continuity and sequential 80% weekly progression are staged.
- Browser-safe external hardening runtimes replace the vulnerable nested-template pattern.
- Weekly forensic sets combine domain content, vocabulary-in-context, evidence/reproducibility, investigation design, CER, source evaluation, and safety/model-limit reasoning.
- Assessment Center navigation is available while milestone cards remain individually gated.

#### Critical learner-isolation repair

Legacy cumulative benchmark pages write generic browser-local keys rather than learner IDs. Earlier synchronization could therefore attach Learner A's result to Learner B after a learner switch.

That silent behavior is removed. Legacy cumulative results remain **unattributed** until explicitly confirmed for the active formal learner. Attribution is fingerprinted by assessment, score, total, and submission timestamp; a new attempt requires a new confirmation. Preview cannot claim formal evidence.

#### Science midterm and cumulative progression now explicit

A dedicated Week 18 Science midterm exists at `assessments/midterm/` with:

- 40 objective questions;
- objective mastery at **32/40 = 80%**;
- 4 constructed-response prompts preserved separately for Academy/adult review;
- learner-scoped formal storage;
- separate preview state;
- Week 19 requiring the objective midterm score to reach 80% in addition to prior weekly mastery.

Formal progression also requires learner-attributed cumulative evidence at the course milestones:

- **Week 13+** requires Units 01–04 cumulative mastery at 80%+;
- **Week 19+** requires the Week 18 Science midterm at 80%+;
- **Week 22+** requires Units 05–07 cumulative mastery at 80%+;
- **Week 28+** requires Units 08–09 cumulative mastery at 80%+.

Constructed responses remain evidence for review and are not silently machine-scored.

`assessments/midterm/CONTENT_REVIEW_2026-08-16.md` records a source-level review of all 40 objective domains and four written prompts. No high-confidence wrong key was found in that pass; second-person and browser verification remain required.

**Remaining:** generated-bank verification, exact/semantic duplicates, purpose-mapped resources, browser/mobile/print/learner-switch testing, and cumulative-attribution tests.

### Global Studies Honors 9

- 36 weeks / 180 lesson slots / 108 principal assignments remain.
- Original 70% mastery/local-student authority are superseded by hardened 80% learner-scoped progression.
- Academy bridge and forensic curriculum quality use browser-safe external runtimes.
- Each week follows a topic-linked historical-thinking sequence: inquiry → sourcing/corroboration → map/data/comparison → argument/counterclaim → synthesis/portfolio.
- Objective architecture remains **180 week-specific items + 18-item independent midterm + 24-item independent final**.
- Deterministic answer-position balancing runs after content corrections.
- A forensic audit harness is installed for final assembled-bank structural checks.

#### Historical content-integrity repairs

`CONTENT_INTEGRITY_PASS_2026-08-16.md` records the source-level pass. Five items were tightened before answer balancing:

1. **Week 13:** later-imperial Chinese examination wording now avoids implying one unchanged exam regime across all dynasties.
2. **Week 20:** Peace of Westphalia wording now avoids the `single birth certificate of modern sovereignty` oversimplification.
3. **Week 30:** the Great Depression item now tests multicausal explanation rather than a circular chronology statement.
4. **Week 31:** Holocaust terminology now identifies the genocide of European Jews specifically while recognizing other groups persecuted and murdered under distinct Nazi policies.
5. **Week 32:** proxy-war framing now preserves local causes, goals, and agency alongside outside sponsorship.

No indiscriminate rewrite was justified. The bank generally already avoids geographic determinism, one-cause history, source naïveté, and passive-local-actor framing.

**Remaining:** second independent verification of all 222 items, semantic duplicates, final runtime answer-position count, constructed-response rubrics, and browser/mobile/print/learner-switch testing.

### Grade 09 Mathematics / Pre-Algebra Bridge

- Mathematics Foundations remains the support path below Pre-Algebra.
- Original Pre-Algebra portal remains preserved byte-for-byte as `legacy.html` with blob SHA `1f86cf98681502de7be0749c79805faba14eea1f`.
- Academy-facing Pre-Algebra uses learner-scoped continuity and preview separation.
- Active bank generation covers number, integers, rational numbers, ratios/rates, percent, powers/roots, expressions, equations, inequalities, coordinate/functions, geometry, data/probability, and modelling.
- All 36 weeks receive dedicated five-item banks with varied parameters and deterministic answer placement.
- Exact-choice collision sanity runs after generation.
- GCF values are constructed so the intended GCF is guaranteed.
- Midterm uses **18 separately salted transfer banks**.
- Final uses **36 separately salted transfer banks**.
- Formal progression remains Monday→Friday + required evidence + 80% weekly mastery; Week 19 also requires an 80% midterm; final requires all 36 weeks plus midterm.
- Separate Foundation → Pre-Algebra verification contains 32 items; 26/32 = 81.25%, the first attainable whole-item result above the 80% threshold.

#### New arithmetic presentation repair

A rational-number family computed `2/3 × 3/n` correctly but could display the equivalent result `2/n` without reducing it even though the explanation instructed the learner to simplify. `prealgebra-content-integrity-runtime.js` now reduces that family to lowest terms across weekly, midterm, and final forensic banks before the sanity pass.

**Remaining:** exhaustive generated-bank enumeration/solving, near-duplicate analysis, second-person readiness verification, answer-distribution audit, tool mapping, and browser/mobile/print/learner-switch testing.

## Six forensic passes

### 1. Content integrity
Confirm one defensible answer for every objective item; verify calculations, units, dates, chronology, terminology, scientific claims, source claims, distractors, explanations, and constructed-response rubrics.

### 2. Duplication and template audit
Search all weekly/cumulative work for exact/near duplicate stems, answer choices, lesson bodies, prompts, model answers, copied cumulative items, and exploitable answer-position patterns.

### 3. Standards and rigor
Verify actual learner evidence demonstrates transfer, analysis, synthesis, application, communication, and independent work rather than standards labels alone.

### 4. Learning design and interactivity
Target sequence: `overview → lesson → workspace → tools/resources → assignment → mastery → portfolio/evidence → print/review`.

### 5. Resource federation
Resources must have a stated learning purpose and must not substitute for formal evidence.

### 6. UX, accessibility, and print
Verify readable layout, no overflow, keyboard operation, visible focus, mobile behavior, clean print, usable inputs, friendly locks, and no inappropriate answer exposure.

## Acceptance tests before A+++ or merge review

1. Every readiness/formal-course key independently verified.
2. Generated item spaces enumerated or robustly sampled with collision and numeric-edge testing.
3. Exact/semantic duplicates audited.
4. 79% keeps the next formal step locked; 80% unlocks exactly the intended step.
5. Reassessment remains available.
6. Midterm/final prerequisites work.
7. Learner A cannot inherit Learner B's progress, unlock state, or cumulative scores.
8. Preview/Grade 08 exploration never creates formal Grade 09 evidence.
9. NAIB remains interpretive/delegative rather than automatic placement authority.
10. Browser/mobile/keyboard/print/accessibility tests pass.
11. Science cumulative milestone gates use only learner-attributed evidence.
12. No merge/publish until the above evidence is reviewed.

## Current forensic verdict

**Grade 09 is materially stronger after this pass. Source-level work has now repaired runtime hazards, cross-learner Science attribution risk, readiness-item defects, the Science midterm/cumulative-gate gap, Foundations same-template repetition, Mathematics Foundations exact-choice construction, Global Studies historical imprecision, English weekly transfer weakness, and a Pre-Algebra fraction-simplification inconsistency.**

The program is still **not A+++ forensic validated** because second-person item verification and live/browser validation remain open. The branch should remain isolated from `main` until those proof steps pass.

---

Khaemenes Academy · Grade 09 Forensic Curriculum Gate · August 2026
