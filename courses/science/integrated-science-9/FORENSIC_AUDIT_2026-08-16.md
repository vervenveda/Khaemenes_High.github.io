# Integrated Science 9 — Forensic Curriculum Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet final A+++ certification

## Scope verified

Integrated Science 9 retains a 36-week sequence spanning laboratory readiness, scientific inquiry, cells, body systems, inheritance, ecology/evolution/biodiversity, atomic structure, chemical bonding and reactions, mechanics and energy, electricity/waves/information, Earth systems, climate/space, and sustainable engineering.

The recurring science-practice rhythm remains:

1. phenomenon / question;
2. concept and model;
3. evidence and data;
4. investigation / engineering;
5. synthesis, CER, mastery, reflection.

## Forensic defects and repair state

### 1. Conceptual mastery generator repetition

The legacy generator can produce several questions from one `quizType`, and some historical branches had only one substantive conceptual template.

The hardened quality layer now delegates to external `science9-forensic-runtime.js`, which builds a mixed weekly evidence set using:

- a domain/content question;
- vocabulary in scientific context;
- evidence quality and reproducibility;
- investigation design;
- Claim–Evidence–Reasoning;
- source evaluation;
- safety or model-limit reasoning.

The runtime uses the actual week's title, essential question, investigation, vocabulary, and mode so the evidence prompts remain tied to that week rather than becoming detached generic practice.

**Still required:** enumerate the complete generated item space, verify every answer/explanation and numeric range, and run exact/near-semantic duplicate analysis before A+++ approval.

### 2. Browser-safe hardening runtime

The forensic pass identified a source-level syntax hazard in the earlier injection architecture: large runtime strings were placed inside outer template literals while the injected body itself contained unescaped template literals.

Science hardening has now been separated into normal external iframe runtimes:

- `science9-bridge-runtime.js`;
- `science9-forensic-runtime.js`;
- `science9-cumulative-runtime.js`.

The loader scripts are small and use deterministic dynamic-script ordering where sequence matters. This removes the nested-template failure mode at source level.

Actual browser execution remains to be verified.

### 3. Mastery progression

Formal Grade 09 records use sequential progression:

- Week 1 available;
- Monday → Friday prerequisite order;
- weekly mastery after five required lessons;
- next week only after **80%+**;
- below-80 reassessment remains available;
- friendly reminders replace punitive/dead locks;
- preview mode remains non-formal.

### 4. Assessment Center overlock corrected

An earlier bridge layer could lock the entire Assessment Center until Week 18, which conflicted with the intended Week 12 Units 01–04 benchmark.

The Assessment Center itself is now kept available. Individual milestone links carry their own weekly prerequisite gates instead:

- Units 01–04 after Weeks 1–12;
- midterm after Weeks 1–18;
- Units 05–07 after Weeks 1–21;
- Units 08–09 after Weeks 1–27;
- final after Week 36.

### 5. Cumulative assessment evidence and learner isolation

The repository contains dedicated objective assessment pages for:

- Units 01–04 benchmark — `khaemenes_science_units01_04_benchmark_v1`;
- Units 05–07 benchmark — `khaemenes_science_units05_07_benchmark_v1`;
- Units 08–09 benchmark — `khaemenes_science_units08_09_benchmark_v1`;
- Comprehensive Final — `khaemenes_science9_final_exam_v1`.

Those assessment pages store browser-local result keys that do **not** inherently identify which Academy learner completed the assessment.

The earlier synchronizer could therefore attach a generic browser result to whichever formal learner happened to be active later. That was a genuine cross-learner evidence-attribution risk.

#### Repair

`science9-cumulative-runtime.js` now treats raw benchmark results as **unattributed evidence**.

In formal mode:

- a result is not copied into the learner record automatically;
- the active learner must be explicitly confirmed as the learner who completed the latest assessment;
- confirmation is stored under `khaemenes_science9_cumulative_claims_v1` by learner and assessment;
- the claim fingerprint includes submitted timestamp, score, and total;
- a new attempt invalidates the previous fingerprint and requires fresh attribution;
- preview mode cannot claim formal cumulative evidence;
- ordinary Science course saves preserve the learner's cumulative field instead of erasing it.

This is intentionally conservative. It is safer to leave a valid score unattributed than to silently assign one learner's benchmark to another.

### Midterm gap remains explicit

The current repository still does not expose a dedicated standalone midterm record/page comparable to the three cumulative benchmarks and final.

The hardened runtime therefore displays an explicit note and does **not** infer, manufacture, or silently substitute a midterm score.

Before final certification we still need either:

- a dedicated midterm assessment/record; or
- a documented Academy/adult-verification workflow that records midterm evidence explicitly.

### 6. Cumulative progression policy still open

Weekly prerequisite gating and milestone-opening weeks are now staged coherently. However, a final policy decision is still needed on whether passing each cumulative benchmark at 80% must itself block subsequent course weeks/high-stakes assessments.

That decision should be made together with the missing midterm solution so Science does not end up with inconsistent high-stakes progression rules.

## Academic rigor strengths

- scientific notebook evidence;
- variables and investigation planning;
- numeric data capture and graph interpretation;
- CER writing;
- source evaluation;
- uncertainty/limitations;
- laboratory safety verification;
- Foundation/Core/Extended depth preference;
- detailed unit folders;
- cumulative benchmarks;
- sustainable engineering capstone.

## Remaining A+++ repairs

- full generated-bank enumeration and answer verification;
- numeric generator range/unit/tolerance validation;
- exact/semantic duplicate analysis;
- verify each week's phenomenon/investigation/evidence product remains substantively distinct;
- confirm lesson-specific resource mappings;
- resolve the dedicated midterm-record gap;
- decide and enforce cumulative benchmark progression policy;
- compare final versus weekly/cumulative pools for excessive overlap;
- browser/mobile/keyboard/print/learner-switch/preview tests;
- explicitly test cumulative attribution with Learner A, switch to Learner B, and confirm no evidence transfers silently.

## Current verdict

**Substantial and materially safer after the forensic pass, but not yet A+++ certified.**

The course now has browser-safe hardening boundaries, sequential 80% weekly progression, independently staged assessment-center gates, a more varied forensic evidence layer, and explicit learner-safe cumulative attribution. Remaining work is concentrated in generated-bank verification, the missing midterm record, final cumulative-gate policy, and live/browser validation.
