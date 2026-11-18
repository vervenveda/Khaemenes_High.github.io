# Pre-Algebra · Full Exceptional Source Re-Audit

**Date:** 2026-11-18  
**Course:** Khaemenes Open-Age Pre-Algebra  
**Scope:** full 36-week source-controlled curriculum and evidence architecture  
**Source verdict:** **EXCEPTIONAL** across audited academic and architecture categories  
**Live browser/device acceptance:** **HOLD**

## Fresh-audit finding

The largest gap was not missing curriculum. It was a mismatch between the published evidence contract and the learner runtime: documentation promised a distinct 10-question weekly mastery check for all 36 weeks, while the planner still served historical five-question domain sets and stored only a percentage/answer array. An old 80% five-question result could therefore resemble a current 80% result.

## Major repairs

### Canonical weekly mastery v2
Added `assets/prealgebra-weekly-mastery-v2.js`.

Validated against the actual 36-week planner:
- 36 weekly forms;
- 360 unique questions;
- 10 questions per week;
- exactly 72 questions in each reasoning dimension across the course:
  - procedural fluency;
  - multi-step application;
  - representation / interpretation;
  - error analysis;
  - transfer / reasoning.
- Week 1: 10 current-focus questions.
- Weeks 2–36: 8 current-focus + 2 delayed-retrieval questions.
- zero weekly blueprint errors in executable validation.
- duplicate-option collisions found during validation were repaired before acceptance.

### Evidence migration
The planner now records:
- assessment version;
- question count;
- unique question IDs;
- reasoning dimensions;
- delayed-retrieval provenance.

Only valid `prealgebra-weekly-mastery-v2` ten-question attempts can satisfy the weekly progression gate. Historical five-question attempts remain preserved as provenance but no longer unlock progression.

### Weekly evaluator key
Added `assessments/weekly-mastery-answer-key-v2.json`:
- 36 weeks;
- 360 questions;
- answer, explanation, reasoning dimension, and retrieval provenance.

### Project scoring
Units 01–12 gained a transparent 100-point analytic investigation rubric; Unit 13 already had one.

Common analytic categories:
- question / context / constraints / ethics · 15;
- mathematical structure & accuracy · 25;
- representations & communication · 15;
- verification / precision / sensitivity · 20;
- conclusion & limitations · 15;
- revision / reflection / defense · 10.

### Teacher/evaluator architecture
Added the central `teacher/index.html` Teacher & Records Center.

All 13 unit teacher guides now carry the Exceptional-depth evidence standard and state:
- canonical weekly mastery;
- differentiated pathway expectations;
- unit mastery evidence;
- 80% threshold;
- analytic investigation scoring;
- legacy-evidence integrity rule.

The Administration Guide and `course-map.json` now describe the actual v2 weekly architecture.

### Storage and record integrity
The main planner now prefers the verified mathematics storage adapter and performs read-back verification on fallback writes.

The completion record now:
- uses adapter-aware reads/writes;
- verifies persistence before saying it was saved;
- can export even if browser persistence is unavailable;
- distinguishes exported evidence from local persistence;
- captures recovery provenance into the canonical learner record.

## Course-specific rigor preserved

Pre-Algebra intentionally retains its stronger mixed-evidence cumulative design rather than imitating Algebra II question counts mechanically:
- 56 selected-response midterm items + required constructed reasoning;
- 80 selected-response final items + required constructed reasoning;
- evaluator-scored written work;
- 80% mastery contract;
- unit mastery forms generally 20–24 items with lesson evidence prerequisites.

## Source-level rubric

| Category | Verdict |
| --- | --- |
| Scope and 36-week coherence | Exceptional |
| Lesson depth and quantity | Exceptional |
| Weekly mastery quality | Exceptional |
| Five-dimension reasoning coverage | Exceptional |
| Spaced retrieval / retention | Exceptional |
| Unit mastery architecture | Exceptional |
| Cumulative mixed-evidence assessment | Exceptional |
| Differentiation | Exceptional |
| Applied investigations / analytic rubrics | Exceptional |
| Teacher/evaluator documentation | Exceptional |
| Learner-record / storage resilience | Exceptional |
| Evidence authority / progression integrity | Exceptional |
| Accessibility / readability source architecture | Exceptional |
| Learning tools / resource integration | Exceptional |

## Acceptance boundary

**Source-controlled curriculum and architecture: EXCEPTIONAL.**

Runtime acceptance remains **HOLD** until representative desktop, tablet portrait, tablet landscape, phone, print, assessment-submission, and forced storage-failure tests are exercised live.
