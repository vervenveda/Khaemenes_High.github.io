# Grade 9 Global Studies Honors — Forensic Curriculum Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet A+++ certified

## Executive finding

The Grade 9 Global Studies Honors package is structurally large and ambitious, but its original generated student portal did not meet the Academy's forensic A+++ standard.

The structural counts are real — 36 weeks, 180 Monday–Friday lesson slots, 108 principal assignments, weekly quizzes, a midterm, a final, and a civic capstone — but forensic inspection found that many original slots were generated from a small set of repeated substantive templates. Structural count alone is not curricular uniqueness.

## Confirmed original defects

1. 70% passing target instead of the Academy's 80% mastery threshold.
2. Repeated five-day substantive lesson shells with topic substitution.
3. Repeated three-assignment structures.
4. Small shared objective banks reused across many weeks.
5. Midterm/final reuse of weekly-bank questions.
6. Heavy correct-answer index-0 bias.
7. Independent local-student authority rather than Academy learner authority.

## Repairs staged on the hardening branch

- Academy learner continuity and learner-scoped records;
- Grade 08 preview isolation;
- 80% formal progression;
- Monday → Friday prerequisite sequence;
- three weekly evidence assignments before mastery;
- next week only after prior mastery;
- midterm after first-semester mastery and 80% midterm gate for Semester II;
- final after full-year mastery and required prior exam gate;
- friendly lock explanations and reassessment;
- five dedicated objective items for each of 36 weeks = **180 weekly objective items**;
- independent **18-item midterm**;
- independent **24-item final**;
- deterministic four-choice answer-position balancing.

## Runtime-integrity repair discovered in the forensic pass

Static inspection found that the previous Academy bridge and curriculum-quality layer placed large injected iframe programs inside outer JavaScript template literals while the injected code itself used unescaped template literals. That creates a lexical/syntax failure risk before the legacy runtime can initialize.

The affected layers have now been separated into normal external iframe runtimes:

- `global9-bridge-runtime.js` — learner-scoped Academy continuity, prerequisite gating, formal 80% progression, exam gates, friendly reminders;
- `global9-forensic-runtime.js` — differentiated historical-thinking lesson structure and purposeful resource federation.

The corresponding outer assets are now small loaders using `async=false` for deterministic dynamic-script ordering.

`global9-objective-bank.js` was separately inspected for the same nested-template defect. Its injected objective data use ordinary quoted strings rather than nested template literals, so this specific lexical defect was not found there.

This removes a source-level blocker. It is not a substitute for browser execution.

## Current curriculum differentiation

The valid forensic runtime now ties each week to its actual topic while preserving a rigorous common historical-thinking progression:

1. **Inquiry Launch** — chronology, geography, prior knowledge, evidence needs, uncertainty;
2. **Source & Corroboration Lab** — authorship, audience, purpose, context, proximity, corroboration, missing perspective;
3. **Map, Data & Comparison Studio** — spatial, quantitative, chronological, institutional, or comparative evidence with an explicit limitation;
4. **Argument, Counterclaim & Seminar** — claim, evidence, reasoning, qualification/counterclaim, revision;
5. **Synthesis & Portfolio** — topic-specific evidence-backed synthesis and reflection.

Purposeful resources are selected by topic from existing Verve N Veda systems such as ARSHIF, Evidence & Citation Studio, PLERA Search Gate, The Verifier, and Finance Hall. These links are supplemental and do not replace formal evidence.

The earlier detailed week-by-week upgrade file remains in repository history, but the active hardening runtime now prioritizes browser-safe topic-linked differentiation over a fragile nested injection string.

## Objective-assessment architecture

The hardening branch still contains:

- 36 × 5 week-specific items = **180 weekly items**;
- **18 independent midterm transfer items**;
- **24 independent final transfer items**;
- deterministic answer-position balancing after the objective bank loads.

This structurally fixes the original shared-bank and copied-exam defects.

## Remaining A+++ blockers

- independently verify every weekly, midterm, and final answer, distractor, date, chronology, geographic reference, and explanation;
- run exact and semantic duplicate analysis over all 222 objective items;
- confirm deterministic answer balancing produces an acceptable final distribution;
- confirm constructed-response rubrics;
- browser/mobile/keyboard/print/learner-switch/preview validation;
- verify external runtime load order against the preserved legacy page;
- confirm Learner A/B record isolation and Grade 08 preview non-persistence.

## Current verdict

**Global Studies is materially stronger and the forensic pass removed a source-level runtime blocker in addition to the earlier assessment-repetition repairs. The objective architecture is now structurally independent, the Academy runtime is learner-scoped, and lesson differentiation remains topic-linked. Independent factual/key verification and live integration testing remain before A+++ certification.**
