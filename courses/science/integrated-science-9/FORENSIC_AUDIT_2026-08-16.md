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

`assets/science9-forensic-quality.js` now mixes domain-specific items with applied evidence/CER/source-evaluation questions so a weekly set is not merely repeated cosmetic variants of one concept.

**Still required:** enumerate the complete generated item space, verify every answer/explanation and numeric range, and run exact/near-semantic duplicate analysis before A+++ approval.

### 2. Mastery progression

Formal Grade 09 records now use sequential progression:

- Week 1 available;
- Monday → Friday prerequisite order;
- weekly mastery after five required lessons;
- next week only after **80%+**;
- below-80 reassessment remains available;
- friendly reminders replace punitive/dead locks;
- preview mode remains non-formal.

### 3. Cumulative assessment evidence

The repository contains dedicated objective assessment pages for:

- Units 01–04 benchmark — `khaemenes_science_units01_04_benchmark_v1`;
- Units 05–07 benchmark — `khaemenes_science_units05_07_benchmark_v1`;
- Units 08–09 benchmark — `khaemenes_science_units08_09_benchmark_v1`;
- Comprehensive Final — `khaemenes_science9_final_exam_v1`.

Each of those pages records submitted objective score/total/attempts locally.

**New repair:** `assets/science9-cumulative-sync.js` reads only submitted assessment evidence, converts it to a transparent percentage, and synchronizes it into the active formal learner's Science 9 record under cumulative evidence. The assessment view also displays the recorded score and whether the Academy's 80% threshold has been reached.

The synchronizer preserves that cumulative evidence when the legacy course save routine runs rather than allowing normal weekly saves to erase it.

It does **not** invent a score when no submitted record exists.

### Midterm gap remains explicit

The current repository does not expose a dedicated standalone midterm record/page comparable to the three cumulative benchmarks and final. The hardened runtime therefore displays an explicit note and does **not** infer, manufacture, or silently substitute a midterm score.

Before final certification we still need either:

- a dedicated midterm assessment/record; or
- a documented Academy/adult-verification workflow that records midterm evidence explicitly.

### 4. Cumulative milestone gating

The intended schedule remains:

- diagnostic / safety at course start;
- Units 01–04 after Weeks 1–12;
- midterm after Weeks 1–18;
- Units 05–07 after Weeks 1–21;
- Units 08–09 after Weeks 1–27;
- final after Week 36.

Weekly prerequisite gating is staged. Cumulative objective scores are now captured in learner evidence, but **later milestone gates still need a final policy decision and browser-tested implementation for whether each prior cumulative assessment must itself be 80% before the next high-stakes milestone opens.**

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
- decide and enforce cumulative-to-cumulative 80% progression policy;
- compare final versus weekly/cumulative pools for excessive overlap;
- static syntax/load-order check of bridge + forensic + cumulative-sync layers;
- browser/mobile/keyboard/print/learner-switch/preview tests.

## Resource federation targets

Existing ecosystem resources worth purpose-mapping include the Scientific Calculator, Solanar, Planetarium, TraceLab, Weather Academy, The Verifier/EcoPulse, River to Road, Ohmic CAD, and Evidence & Citation Studio. They should appear only where the lesson has a defined learning use.

Potential future reusable apps include Cell Systems Lab, Bond Builder, Chemistry Equation Balancer, Motion & Forces Lab, Climate Data Studio, and CER Evidence Challenge.

## Current verdict

**Substantial and increasingly well-integrated, but not yet A+++ certified.**

The course now has sequential 80% weekly progression, a more diverse forensic question layer, and learner-scoped synchronization of the repository's existing submitted cumulative objective evidence. Remaining work is concentrated in bank verification, the missing midterm record, cumulative-gate policy, resource mapping, and live/browser validation.
