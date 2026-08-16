# Integrated Science 9 — Forensic Curriculum Audit

**Date:** 2026-08-16  
**Branch:** `hardening/archaemenes-highschool`  
**Status:** ACTIVE REPAIR — not yet final A+++ certification

## Scope verified

Integrated Science 9 retains a 36-week sequence spanning laboratory readiness, scientific inquiry, cells, body systems, inheritance, ecology/evolution/biodiversity, atomic structure, chemical bonding and reactions, mechanics and energy, electricity/waves/information, Earth systems, climate/space, and sustainable engineering.

The published course architecture uses a sound recurring science-practice rhythm:

1. phenomenon / question;
2. concept and model;
3. evidence and data;
4. investigation / engineering;
5. synthesis, CER, mastery, reflection.

The recurring rhythm is retained, but substantive prompts and assessment items must remain meaningfully different from week to week.

## Forensic defects confirmed

### 1. Conceptual mastery generator repetition

The legacy generator historically produced six questions from a single `quizType`. Several conceptual `quizType` branches had only one substantive question template. This allowed the same question to appear repeatedly in one generated set with answer order changed.

**Repair begun:** `assets/science9-forensic-quality.js` now constructs a mixed six-item set with domain-specific questions plus applied evidence/CER/source-evaluation questions. The goal is to prevent a six-question mastery check from becoming six cosmetic variants of one item.

This first diversity layer reduces immediate repetition but is not the final semantic-uniqueness certification. Every domain bank still requires final cross-week exact/near-duplicate analysis before A+++ approval.

### 2. Mastery progression was advisory rather than enforced

The legacy page displayed an 80% target but allowed learners to jump ahead.

**Repair implemented:** formal Grade 09 records now use sequential progression:

- Week 1 available;
- lessons progress Monday → Friday;
- weekly mastery check opens after the five required lessons;
- next week opens only after the preceding mastery score reaches **80% or higher**;
- below-80 attempts retain reassessment access and keep the next required week locked;
- friendly explanatory reminders replace dead/punitive locks.

Preview mode remains exploratory and does not create formal mastery authority.

### 3. Cumulative assessment gating needed separate thresholds

The Science assessment center includes diagnostic/safety verification, cumulative tests, a midterm checkpoint, and a final.

**Repair begun:** cumulative links are now treated separately rather than locking the whole assessment area. Thresholds are:

- Diagnostic / safety verification: available at course start;
- Units 01–04 cumulative: after Weeks 1–12 reach 80% mastery;
- Midterm checkpoint: after Weeks 1–18 reach 80% mastery;
- Units 05–07 cumulative: after Weeks 1–21 reach 80% mastery;
- Units 08–09 cumulative: after Weeks 1–27 reach 80% mastery;
- Final: after all 36 weekly mastery gates reach 80%.

**Remaining blocker:** external cumulative/midterm/final assessment scores must be integrated into the learner-scoped formal Science 9 record so later high-stakes gates can require the appropriate prior test score, not merely weekly completion.

## Academic rigor findings

### Strengths

- authentic scientific notebook fields;
- variables and investigation planning;
- numeric data capture;
- graphing;
- CER writing;
- source evaluation;
- explicit uncertainty and limitations;
- lab-safety verification;
- Foundation / Core / Extended course pathway preference;
- detailed unit folders with models, investigations, templates, and support artifacts;
- cumulative assessment structure;
- sustainable engineering capstone.

### Required A+++ repairs

- expand conceptual assessment banks sufficiently to eliminate repeated substantive items across the year;
- confirm every automatically scored answer and explanation;
- test numeric generators for valid ranges, units, tolerances, and non-pathological values;
- verify each week has a genuinely distinct phenomenon, investigation, and evidence product;
- connect unit-specific tools to the week where they are needed instead of leaving resources detached;
- integrate cumulative test scores with formal progression;
- confirm final assessment does not duplicate weekly or cumulative items excessively;
- run browser/mobile/print tests after static repairs.

## Resource federation targets

Recommended existing Verve N Veda resources for Science 9 include:

- Khaemenes Scientific Calculator — quantitative science, physics, chemistry, data checks;
- Solanar — weather, Earth systems, atmosphere, climate observation;
- Solanar Planetarium — astronomy and space-system study;
- Solanar TraceLab — observation / tracing / weather-data work;
- High School Weather Academy — meteorology extension;
- The Verifier Science News / EcoPulse — source evaluation and contemporary evidence;
- River to Road — ecology, pollution, stewardship, field/service learning;
- Ohmic CAD — engineering design and prototyping;
- Evidence & Citation Studio — research provenance and scientific sourcing.

Resource links should appear only when a lesson explicitly uses them.

## Suggested new science applications

Potential ecosystem gaps worth building later:

- Cell Systems Lab;
- Periodic / Bond Builder;
- Chemistry Equation Balancer;
- Motion & Forces Lab;
- Climate Data Studio;
- CER Evidence Challenge.

These should be designed for reusable curricular value rather than decorative gamification.

## Current forensic verdict

**Promising / substantial / not yet A+++ certified.**

The course scope and scientific-practice architecture are strong. The principal defects are assessment-bank diversity, cumulative-score integration, and final cross-week uniqueness verification. Sequential 80% mastery gating is now part of the hardened Academy-facing Science 9 path.
