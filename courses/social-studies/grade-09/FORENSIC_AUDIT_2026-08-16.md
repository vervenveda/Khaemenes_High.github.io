# Grade 9 Global Studies Honors — Forensic Curriculum Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet A+++ certified

## Executive finding

The Grade 9 Global Studies Honors package is structurally large and ambitious, but its current generated student portal does not yet meet the Academy's forensic A+++ standard.

The structural counts are real — 36 weeks, 180 Monday–Friday lesson slots, 108 principal assignments, weekly quizzes, a midterm, a final, and a civic capstone — but the forensic inspection found that many of those slots are generated from a small set of repeated substantive templates.

A structural count therefore must not be treated as proof of curricular uniqueness.

## Preservation rule

The pre-forensic generated portal must remain preserved as `legacy.html` while the Academy-facing `index.html` becomes the continuity/gating surface. The wrapper is not deployment-ready until that preserved portal is attached on the active hardening branch.

## Defects confirmed

### 1. Mastery target conflict

The generated portal sets `passingTarget: 70` and `honorsTarget: 85`. The Academy-wide formal progression requirement is **80% mastery**. An optional honors distinction may remain above 80%, but it cannot lower the Academy advancement threshold.

### 2. Repeated weekly lesson bodies

Across the year, the same five substantive lesson shells recur with topic names substituted:

1. Monday — `Frame the Inquiry`
2. Tuesday — `Read Like a Historian`
3. Wednesday — `Map, Measure, and Compare`
4. Thursday — `Discuss, Debate, and Write`
5. Friday — `Synthesize and Demonstrate`

A predictable weekly rhythm is useful. Repeating nearly identical warmups, lesson bodies, assignment wording, and evidence descriptions for unrelated historical periods is not sufficient for A+++ approval.

### 3. Repeated assignment bodies

Each week repeats `Source Lab`, `Atlas & Data Investigation`, and `Evidence-Based Argument` with the topic substituted. The repair should preserve these disciplinary practices while changing the actual source set, data problem, historical method, evidence structure, and student product.

### 4. Shared five-question quiz banks

Weeks point to small shared banks such as inquiry, geography, civics, economics, belief, conflict, empires, ideas, and history. Many weeks therefore receive exactly the same five objective questions.

### 5. Midterm and final reuse weekly-bank items

The cumulative exams reuse objective questions directly from the same shared weekly banks, reducing assessment validity.

### 6. Correct-answer position bias

A large proportion of the current bank uses answer index `0`. The repair requires distributed answer positions and no systematic positional cue.

### 7. Independent local learner identity

The current portal still creates First Student / Demo Student / Add/Delete records under a shared browser key. The hardened entry must use the active Academy Grade 09 learner and learner-scoped records. Grade 08 advanced preview remains exploratory only.

## A+++ differentiation examples

- Agricultural Revolution — archaeology evidence matrix, domestication/settlement map, health/inequality trade-off analysis.
- Persia and Greek World — imperial administration comparison, primary-source sourcing, citizenship/participation analysis.
- Rome and Han — bureaucracy/frontier comparison and institutional endurance model.
- Indian Ocean — monsoon-route map, merchant evidence, exchange-network causal model.
- Mongol expansion / Black Death — network-flow map, mortality evidence, source corroboration, systems causation.
- Renaissance / printing — image/text source comparison, print-diffusion evidence, communication-network analysis.
- Atlantic slavery — voyage data, testimony/source ethics, coerced-labor system map, resistance analysis.
- Industrial Revolution — production/urbanization data, labor evidence, competing measures of improvement.
- Imperialism — map changes, economic evidence, resistance perspectives, competing causal explanations.
- World Wars / Holocaust / genocide — careful chronology, institutional evidence, survivor-source protocols, perpetrator/bystander/resistance analysis.
- Cold War — proxy-conflict mapping, competing perspectives, systems model.
- Decolonization — self-determination sources, independence timelines, comparative state-building.
- Globalization — trade/development/migration data with explicit limitations.
- Comparative government / media literacy — lateral reading, source triangulation, institutional comparison.
- Civic capstone — nonpartisan evidence file, stakeholder map, options matrix, public product, reflection.

## Formal 80% progression target

The hardened course will enforce:

- Week 1 available to the eligible Grade 09 learner;
- Monday → Friday instructional sequence;
- all three substantial weekly evidence assignments completed before the formal weekly mastery check;
- weekly mastery check opens only after required evidence is reached;
- next week opens only after the current mastery check reaches **80% or higher**;
- midterm opens after first-semester mastery;
- Semester II opens only after the midterm reaches **80% or higher**;
- final opens after full-year mastery plus the required midterm gate;
- friendly reminders explain locked states;
- reassessment remains available;
- preview access does not create formal mastery.

## Resource federation targets

Existing Verve N Veda matches include ARSHIF, The Verifier, World Wire / Global News Digest, Evidence & Citation Studio, PLERA Search, Ancients Trivia, Civic Compass Trivia, High School Voter Portal, and Finance Hall / Budget Planner. They should be assigned only when the lesson gives the learner a clear reason to use them.

## Suggested ecosystem gaps

- **Source Sleuth** — sourcing, corroboration, lateral reading, reliability, citation.
- **Timeline Atlas** — chronology + geography + migration/trade/empire layers.
- **Civic Decision Lab** — nonpartisan stakeholder, constitutional, evidence, trade-off simulation.
- **Data Detective** — graph/data interpretation and misleading-display analysis across subjects.

## Current verdict

**Substantial foundation; forensic repair required.**

The chronological/global scope is worth preserving. The principal A+++ blockers are substantive lesson repetition, assignment repetition, shared quiz reuse, repeated exam items, answer-position bias, old 70% progression, and independent local student identity.
