# Algebra I · Landing Page Blueprint

**Parent authority:** [Canonical High School Landing Page Blueprint](CANONICAL_HIGH_SCHOOL_LANDING_PAGE_BLUEPRINT.md)  
**Canonical landing route:** `courses/mathematics/algebra-1/index.html`  
**Recorded:** 2026-11-17

## Current source observation

Current landing has no persistent sidebar, but contains several asymmetric content splits such as 1.15fr/.85fr alongside strong equal grids.

This observation is diagnostic only. It does not make legacy architecture authoritative.

## Required target architecture

Maintain the no-sidebar architecture and normalize major course sections to equal grids or full-width centered sections. Diagnostic, units, honors pathway, progress, resources, and assessments remain distinct but visually balanced.

## Course-specific rules

- Keep diagnostic and mastery gates unchanged.
- Do not turn functional control rows into oversized equal cards.
- Replace major 1.15/.85 content splits where they represent peer sections.
- Full canonical chrome and translator on public learning surfaces.

## Header and local navigation rule

Algebra I uses exactly one canonical High School ecosystem header. Course-specific navigation may remain as one compact unbranded Algebra I navigation strip below canonical chrome.

The local strip may expose Course Home, Course, Units, Lessons, Assessments, Vocabulary, Labs, Teacher, or equivalent Algebra I routes. It must not repeat the Academy/K badge, institutional logo/lockup, or a second hero identity.

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
