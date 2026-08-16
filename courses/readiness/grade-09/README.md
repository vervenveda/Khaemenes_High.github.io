# Grade 09 Readiness & Placement Gateway

**Branch:** `hardening/archaemenes-highschool`  
**Status:** Forensic candidate — not production placement authority yet.

## Purpose

The gateway helps Khaemenes Academy identify the strongest Grade 09 starting point in each subject without reducing a learner to one total score or treating support needs as failure.

It is modeled on useful architectural ideas from the Khaemenes Career Assessment Optimizer: separate evidence from interpretation, use weighted/normalized evidence transparently, request more evidence when a result is ambiguous or unusually strong, and keep exploratory recommendations distinct from formal authority.

The Grade 09 gateway differs from the Career Assessment in one critical way: it measures demonstrated academic performance rather than self-reported preferences.

## Domains

- Mathematics
- Language Arts
- Science
- Social Studies
- Research & Academic Readiness

Each domain is interpreted independently.

## Adaptive logic

The first stage is a common core diagnostic. A short targeted verification stage is triggered when a domain result is either:

- near the 80% readiness boundary; or
- strong enough to suggest advanced verification.

The intent is uncertainty reduction, not randomization for entertainment.

The current forensic-candidate engine uses:

- 50 core objective items;
- 10 targeted verification items;
- learner-local autosave;
- per-domain scoring;
- no single combined placement score;
- no automatic Family Registry write;
- a NAIB delegation request for readiness interpretation when the router is available.

## Recommendation bands

### Mathematics

- below 60% — Mathematics Foundations recommended;
- 60–79% — Pre-Algebra Bridge recommended;
- 80–91% — Algebra I / Integrated Math I ready;
- 92%+ — advanced mathematics verification recommended/supported.

### Other academic domains

- below 60% — subject Foundations track;
- 60–79% — targeted Bridge support;
- 80–91% — standard Grade 09 course ready;
- 92%+ — advanced verification recommended/supported.

These thresholds are **forensic-candidate policy thresholds**, not psychometrically validated cut scores. They require final Academy review before production use.

## Authority model

`Readiness evidence → NAIB interpretation/delegation → Family/Academy review → formal pathway confirmation → Family Registry placement/context`

The assessment never silently promotes, demotes, or changes formal grade placement.

Archaemenes may explain results and help learners review skills. Archaemenes does not award mastery or override placement authority.

## Foundations Studio

The readiness gateway links to `courses/foundations/grade-09/`, which defines five non-stigmatizing support tracks:

1. Mathematics Foundations
2. Literacy Foundations
3. Science Foundations & Lab Reasoning
4. Global Inquiry Foundations
5. Academic Research & Study Studio

A Grade 09 learner may use one support track while remaining standard or advanced in other subjects.

## Required forensic validation before production use

- verify every item and answer key;
- check exact and near-duplicate stems/choices;
- balance answer positions;
- broaden question types beyond multiple choice where appropriate;
- add rubric-scored writing/reasoning samples for stronger placement evidence;
- validate thresholds against actual Academy learner work;
- test resume/reset/print behavior;
- test NAIB available/unavailable behavior;
- test privacy and learner-switch behavior;
- accessibility/keyboard/mobile/browser testing;
- confirm Family Registry handoff does not create automatic placement changes.

## Principle

**The pathway changes. The learner's dignity and Grade 09 membership do not.**
