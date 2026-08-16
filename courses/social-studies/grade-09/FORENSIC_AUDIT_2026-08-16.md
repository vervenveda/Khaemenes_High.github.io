# Grade 9 Global Studies Honors — Forensic Curriculum Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet A+++ certified

## Executive finding

The Grade 9 Global Studies Honors package is structurally large and ambitious, but its generated student portal does not yet meet the Academy's forensic A+++ standard.

The structural counts are real — 36 weeks, 180 Monday–Friday lesson slots, 108 principal assignments, weekly quizzes, a midterm, a final, and a civic capstone — but forensic inspection found that many of those slots were generated from a small set of repeated substantive templates.

A structural count therefore must not be treated as proof of curricular uniqueness.

## Preservation rule

The pre-forensic generated portal is retained as `legacy.html` while the Academy-facing `index.html` becomes the continuity/gating surface. The original course is being repaired rather than discarded.

## Defects confirmed

### 1. Mastery target conflict

The generated portal uses `passingTarget: 70` and `honorsTarget: 85`. Formal Academy progression requires **80% mastery**. Honors distinction may remain higher, but it cannot lower the advancement threshold.

### 2. Repeated weekly lesson bodies

The old course repeatedly used the same five substantive lesson shells with topic substitution: `Frame the Inquiry`, `Read Like a Historian`, `Map, Measure, and Compare`, `Discuss, Debate, and Write`, and `Synthesize and Demonstrate`.

A stable weekly rhythm is useful; identical substantive work is not.

### 3. Repeated assignment bodies

The same `Source Lab`, `Atlas & Data Investigation`, and `Evidence-Based Argument` structures recurred nearly every week with only the topic substituted.

### 4. Shared five-question quiz banks

Many weeks point to the same small inquiry/geography/civics/economics/belief/conflict/empires/ideas/history banks and therefore receive exactly the same objective questions.

### 5. Midterm and final reuse weekly-bank items

The cumulative exams reuse objective questions from the same weekly banks, materially reducing assessment independence.

### 6. Correct-answer position bias

A large proportion of the current bank uses answer index `0`, creating a test-taking cue unrelated to content mastery.

### 7. Independent local learner identity

The generated portal creates First Student / Demo Student / Add/Delete records under a shared browser key. The hardened path must instead use the active Academy Grade 09 learner and learner-scoped records.

## Repairs staged in the forensic layer

- Academy learner authority replaces the independent local student selector in the hardened entry.
- Formal Global Studies records are learner-scoped.
- Grade 08 advanced preview remains exploratory and cannot write formal Grade 09 mastery.
- Formal passing/advancement threshold is 80%.
- Lessons gate in Monday → Friday sequence.
- The three substantial weekly evidence assignments are required before the weekly mastery check.
- The next week remains locked until the prior weekly mastery check reaches 80% or higher.
- The midterm waits for first-semester mastery; Semester II also requires the midterm to reach 80%.
- The final waits for full-year mastery plus the required prior assessment gate.
- Friendly reminders explain why a lesson, quiz, week, or exam remains locked.
- The 36 weeks receive topic-specific forensic inquiry upgrades so the actual source work, map/data task, argument, and synthesis product differ by historical context.
- Week-level Verve N Veda tools are assigned with an explicit academic purpose.

## Differentiation examples now defined

- Agricultural Revolution — archaeology evidence matrix, domestication/settlement map, health/inequality trade-off analysis.
- Persia and Greek World — imperial administration comparison, primary-source sourcing, citizenship/participation analysis.
- Rome and Han — bureaucracy/frontier comparison and institutional endurance model.
- Indian Ocean — monsoon-route map, merchant evidence, exchange-network causal model.
- Mongol expansion / Black Death — network-flow map, mortality evidence, source corroboration, systems causation.
- Renaissance / printing — image/text source comparison, print-diffusion evidence, communication-network analysis.
- Atlantic slavery — voyage data, testimony/source ethics, coerced-labor system map, resistance analysis.
- Industrial Revolution — production/urbanization data, labor evidence, competing measures of improvement.
- Imperialism — map changes, economic evidence, resistance perspectives, competing causal explanations.
- World Wars / Holocaust / genocide studies — careful chronology, institutional evidence, survivor-source protocols, perpetrator/bystander/resistance analysis.
- Cold War — proxy-conflict mapping, competing perspectives, systems model.
- Decolonization — self-determination sources, independence timelines, comparative state-building.
- Globalization — trade/development/migration data with explicit limitations.
- Comparative government / media literacy — lateral reading, source triangulation, institutional comparison.
- Civic capstone — nonpartisan evidence file, stakeholder map, options matrix, public product, reflection.

## Formal 80% progression target

1. Week 1 available to the eligible Grade 09 learner.
2. Monday → Friday instructional sequence.
3. Three substantial weekly evidence assignments completed before the formal weekly mastery check.
4. Weekly mastery check opens only after required evidence is reached.
5. Next week opens only after the current mastery check reaches **80% or higher**.
6. Midterm opens after first-semester mastery.
7. Semester II opens only after the midterm reaches **80% or higher**.
8. Final opens after full-year mastery plus the required midterm gate.
9. Reassessment remains available.
10. Preview access does not create formal mastery.

## Resource federation targets

The staged week mappings use appropriate combinations of ARSHIF, The Verifier, World Wire, Evidence & Citation Studio, PLERA Search, Ancients Trivia, Civic Compass Trivia, High School Voter Portal, and Finance Hall. Each resource has an explicit learning purpose.

## Remaining A+++ blockers

- replace/rebuild the shared weekly objective banks with sufficiently large, week-specific, semantically unique assessment sets;
- rebalance correct-answer positions;
- make midterm/final objective items independent from weekly questions;
- verify every objective answer, distractor, explanation, date, chronology, geography, and historical claim;
- add/verify constructed-response rubrics;
- static syntax/integration check of the new wrapper/bridge/quality layer;
- browser, mobile, print, learner-switch, preview, and deployment validation.

## Current verdict

**Substantial foundation with meaningful forensic repairs staged; not yet A+++ certified.**
