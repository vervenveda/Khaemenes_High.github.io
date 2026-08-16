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

The corresponding outer assets are now small loaders using deterministic dynamic-script ordering.

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

The hardening branch contains:

- 36 × 5 week-specific items = **180 weekly items**;
- **18 independent midterm transfer items**;
- **24 independent final transfer items**;
- deterministic answer-position balancing after the objective bank loads;
- a browser forensic-audit harness for count/choice/index/duplicate/answer-position/weekly-overlap checks;
- a post-bank content-integrity correction layer that runs **before** answer balancing.

This structurally fixes the original shared-bank and copied-exam defects.

## Historical content-integrity pass

`CONTENT_INTEGRITY_PASS_2026-08-16.md` records a source-level wording/key review of the hardened objective architecture.

Five items were tightened rather than rewriting the bank indiscriminately:

1. **Week 13 — imperial Chinese examinations:** revised to `later imperial China` so the question does not imply one unchanged examination regime across all dynasties.
2. **Week 20 — Peace of Westphalia:** revised to avoid the common oversimplification that the 1648 settlements single-handedly created modern sovereignty.
3. **Week 30 — Great Depression:** replaced a circular chronology item with a multicausal explanation involving financial, banking, demand, trade, policy, and international monetary stresses.
4. **Week 31 — Holocaust terminology:** revised to distinguish the Holocaust specifically as the genocide of European Jews while recognizing other groups targeted by Nazi persecution and mass murder under distinct policies.
5. **Week 32 — proxy-war framing:** revised to retain local causes, goals, and agency while still identifying outside-power sponsorship.

The correction layer is `assets/global9-content-integrity-fix.js` and loads after the objective bank but before answer balancing and the forensic-audit harness.

No broad rewrite was justified by this pass. The bank generally already avoids geographic determinism, single-cause explanations, uniform institutional claims, passive-local-actor framing, correlation/causation errors, and treating source types as self-interpreting evidence.

## Remaining A+++ blockers

- second independent verification of every weekly, midterm, and final answer, distractor, date, chronology, geographic reference, and explanation;
- execute the installed browser forensic audit and record exact/semantic duplicate findings and post-balance answer-position distribution;
- confirm constructed-response rubrics;
- browser/mobile/keyboard/print/learner-switch/preview validation;
- verify external runtime load order against the preserved legacy page;
- confirm Learner A/B record isolation and Grade 08 preview non-persistence.

## Current verdict

**Global Studies is materially stronger. The forensic process removed the source-level runtime blocker, repaired the original assessment architecture, and tightened five historically important items where the previous wording risked oversimplification or imprecision. The course remains a forensic candidate pending second-pass content verification and live/browser evidence.**
