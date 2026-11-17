# Pre-Algebra · Landing Page Blueprint

**Parent authority:** [Canonical High School Landing Page Blueprint](CANONICAL_HIGH_SCHOOL_LANDING_PAGE_BLUEPRINT.md)  
**Canonical landing route:** `courses/mathematics/pre-algebra/index.html`  
**Recorded:** 2026-11-17

## Current source observation

Main landing already loads `prealgebra-vnv-ka-blueprint-v1.css`, which converts the old split-pane shell into a centered course app. Unit and lesson generations still contain 300–350px side-panel patterns.

This observation is diagnostic only. It does not make legacy architecture authoritative.

## Required target architecture

Use `assets/prealgebra-vnv-ka-blueprint-v1.css` as Pre-Algebra landing-page styling authority beneath the universal contract. Main app remains centered ≤1120px. Units and lessons must finish migration to centered single-column shells; former side-panel controls become full-width/collapsible/equal-grid sections.

## Course-specific rules

- Retire remaining 310/330/333/350px major side rails.
- Keep equal unit/lesson/resource grids.
- Translator must be present consistently on ordinary learning pages.
- Preserve 80% mastery, unit progression, scorebook, exports, and learner evidence.

## Shared requirements

- exactly one eligible 333 ticker and one AutoPopulate ticker;
- exactly one official High School header and enriched hamburger;
- translator on ordinary public/student learning surfaces;
- one official six-control ecosystem toolbar where eligible;
- one centered primary hero;
- no persistent left or right side column;
- major peer card groups equal-width and symmetrical;
- minimum 16px readable text;
- centered footer;
- responsive 4/2/1, 3/2/1, or 2/1 grid behavior as content count requires;
- no changes to learner records, scoring, mastery, assessment history or course chronology during visual normalization.

## Acceptance

A repair is not complete until rendered output is checked at desktop, tablet and phone widths and the workflow log records affected files, commit SHA, static/browser results, remaining holds and any intentional exception.
