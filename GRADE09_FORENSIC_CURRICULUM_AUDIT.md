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

### Forensic repairs in this pass

- Added deterministic displayed-answer balancing without changing underlying scoring values.
- Repaired **E01**, whose earlier wording mixed contrast and causation; the item now asks specifically what `Although` signals.
- Repaired **MV2**, which previously had two mathematically correct points on the stated line. The corrected item asks for the point **not** on the line and now has one defensible answer.

### Readiness blockers still open

- independent second-person verification of all remaining items/keys;
- exact/near-duplicate analysis;
- constructed-response/writing evidence before high-stakes placement use;
- cut-score calibration;
- browser/accessibility/learner-isolation testing.

## Grade 09 Foundations Studio

Five support paths remain built as forensic candidates:

1. Mathematics Foundations;
2. Literacy Foundations;
3. Science Foundations & Lab Reasoning;
4. Global Inquiry Foundations;
5. Academic Research & Study Studio.

Each uses a 36-week × 5-day structure, learner-scoped formal state, separate preview state, 80% progression, checkpoints, and friendly prerequisite messaging.

Support may vary by domain. A support recommendation in one subject must not lower placement in unrelated subjects or change Grade 09 membership.

### Foundation-course forensic finding

A static sample of the **Mathematics Foundations** generator found that its generic distractor constructor does not yet guarantee de-duplication of dynamically generated visible choices. Certain symmetric fraction/decimal or numeric-offset cases can theoretically create repeated choices.

Therefore all five Foundations tracks remain correctly classified as forensic candidates pending generated-space enumeration, collision checks, independent key verification, cumulative checkpoint review, and browser testing.

## Source-level runtime integrity finding

The most important cross-course defect found in this forensic pass was a compatibility-layer syntax hazard.

Several hardening assets placed a large iframe runtime inside an outer JavaScript template literal while the injected runtime itself contained unescaped template literals. That can terminate the outer string early and prevent the hardening runtime from loading at all.

### Converted to external iframe runtimes

**Pre-Algebra**
- `prealgebra-forensic-repair-runtime.js`
- `prealgebra-forensic-sanity-runtime.js`
- `prealgebra-mastery-runtime.js`

**Integrated Science 9**
- `science9-bridge-runtime.js`
- `science9-forensic-runtime.js`
- `science9-cumulative-runtime.js`

**Global Studies Honors 9**
- `global9-bridge-runtime.js`
- `global9-forensic-runtime.js`

The corresponding outer assets are now small loaders; dynamic external scripts use deterministic ordering where sequence matters.

This is a source-level repair, not browser certification.

## Formal course findings

### English 9

- 36 weeks / 180 daily lesson blocks remain preserved.
- Academy learner-scoped continuity and sequential 80% progression are staged.
- 36 dedicated weekly five-item banks = **180 weekly objective positions**.
- Five-day learning is differentiated into Inquiry/Vocabulary, Close Reading/Evidence, Writing/Reasoning, Seminar/Counterreading/Revision, and Mastery/Portfolio work tied to the actual week.
- Independent **18-item midterm** and **24-item final** replace historical cumulative reuse.
- Four-choice positions are deterministically rotated.
- Static inspection did not reveal the nested-template defect found in other converted layers.

**Remaining:** independent weekly/cumulative key verification, semantic duplicate scan, answer-position audit, constructed-response rubric review, purpose-mapped resources, browser/mobile/print/learner-switch testing.

### Integrated Science 9

- 36-week integrated science/investigation architecture remains substantial.
- Academy continuity and sequential 80% weekly progression are staged.
- Browser-safe external hardening runtimes now replace the vulnerable nested-template pattern.
- Weekly forensic sets combine domain content, vocabulary-in-context, evidence/reproducibility, investigation design, CER, source evaluation, and safety/model-limit reasoning.
- The Assessment Center is no longer incorrectly locked as one block until Week 18; individual milestone cards are gated at Weeks 12, 18, 21, 27, and 36.

#### Critical learner-isolation repair

The existing cumulative benchmark pages write generic browser-local keys rather than learner IDs. Earlier synchronization could therefore copy a score completed by Learner A into Learner B's formal record after a learner switch.

That silent behavior has been removed. Raw cumulative results are now **unattributed** until explicitly confirmed for the active formal learner. Attribution is fingerprinted by assessment, score, total, and submission timestamp; a new attempt requires a new confirmation. Preview cannot claim formal evidence. Ordinary Science saves now preserve the cumulative field.

A standalone Science midterm record/page is still absent and is deliberately not fabricated.

**Remaining:** generated-bank verification, numeric/unit checks, exact/semantic duplicates, dedicated midterm solution, final cumulative progression policy, resource mapping, browser/mobile/print/learner-switch and cumulative-attribution tests.

### Global Studies Honors 9

- 36 weeks / 180 lesson slots / 108 principal assignments remain.
- Original 70% mastery/local-student authority are superseded by hardened 80% learner-scoped progression.
- Academy bridge and forensic curriculum quality now use browser-safe external runtimes.
- Each week follows a topic-linked historical-thinking sequence: inquiry → sourcing/corroboration → map/data/comparison → argument/counterclaim → synthesis/portfolio.
- Purposeful resources are selected by topic from existing Verve N Veda systems.
- Objective architecture remains **180 week-specific items + 18-item independent midterm + 24-item independent final**.
- Deterministic answer-position balancing remains after the bank loads.
- `global9-objective-bank.js` was inspected for the same nested-template defect; that specific defect was not found in its quoted objective-data body.

**Remaining:** independent verification of all 222 objective items, semantic duplicates, final answer-position count, constructed-response rubrics, browser/mobile/print/learner-switch testing.

### Grade 09 Mathematics / Pre-Algebra Bridge

- Mathematics Foundations remains the support path below Pre-Algebra.
- Original Pre-Algebra portal remains preserved byte-for-byte as `legacy.html` with blob SHA `1f86cf98681502de7be0749c79805faba14eea1f`.
- Academy-facing Pre-Algebra uses learner-scoped continuity and preview separation.
- Nested-template hardening risk has been removed from the new repair/mastery layers through external runtimes.
- Active bank generation now explicitly covers number, integers, rational numbers, ratios/rates, percent, powers/roots, expressions, equations, inequalities, coordinate/functions, geometry, data/probability, and modelling.
- All 36 weeks receive dedicated five-item banks with varied parameters and deterministic answer placement.
- A final exact-choice collision sanity pass is staged.
- An initial GCF-generator assumption was caught during this forensic pass and corrected by constructing values whose intended GCF is guaranteed.
- Midterm uses **18 separately salted transfer banks**.
- Final uses **36 separately salted transfer banks**.
- Formal progression remains Monday→Friday + required evidence + 80% weekly mastery; Week 19 also requires an 80% midterm; final requires all 36 weeks plus midterm.
- Separate Foundation → Pre-Algebra verification contains 32 items; 26/32 = 81.25%, the first attainable whole-item result above the 80% threshold.

**Remaining:** exhaustive generated-bank enumeration/solving, near-duplicate analysis, second-person readiness verification, answer-distribution audit, tool mapping, browser/mobile/print/learner-switch testing.

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
11. Science midterm and cumulative progression policy are resolved explicitly.
12. No merge/publish until the above evidence is reviewed.

## Current forensic verdict

**Grade 09 is materially stronger after this pass. The work uncovered and repaired source-level runtime hazards, one real cross-learner Science evidence-attribution risk, two readiness-item defects, and several Pre-Algebra generator weaknesses that were not visible in a simple architecture count.**

The program is still **not A+++ forensic validated** because independent item verification and live/browser validation remain open. The branch should remain isolated from `main` until those proof steps pass.

---

Khaemenes Academy · Grade 09 Forensic Curriculum Gate · August 2026
