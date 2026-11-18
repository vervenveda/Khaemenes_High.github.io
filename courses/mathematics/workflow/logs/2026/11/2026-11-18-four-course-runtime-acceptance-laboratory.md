# High School Mathematics · Four-Course Runtime Acceptance Laboratory

**Date:** 2026-11-18  
**Courses:** Pre-Algebra · Algebra I · Geometry · Algebra II  
**Phase:** rendered-browser acceptance infrastructure  
**Source validation:** PASS  
**Production rendered sweep:** HOLD until executed from an HTTP(S) browser that can reach the Academy site

## Purpose

The four mathematics courses already reached source-controlled Exceptional status. This phase creates a real rendered-browser acceptance layer so responsive/device claims can be measured rather than inferred from HTML/CSS source.

## Runtime Acceptance Laboratory

Added:

`courses/mathematics/runtime-acceptance/index.html`

The laboratory is same-origin and non-destructive.

### Viewport profiles

- Desktop · 1440 × 900
- Tablet landscape · 1180 × 820
- Tablet portrait · 820 × 1180
- Phone · 390 × 844

### Core sweep

The Core Sweep measures three representative surfaces in each course:

- course landing;
- Unit 01 Lesson 01;
- Unit 01 formal mastery check.

That is 12 surfaces × 4 viewport profiles = 48 rendered cases.

### Full sweep

The Full Sweep adds:

- comprehensive final;
- Teacher / Records Center;
- Unit 01 applied investigation;
- Geometry Spaced Retention Lab.

All target routes were verified present on `main`.

## Automated acceptance checks

For each rendered case the laboratory checks:

- HTTP route health;
- same-origin iframe render;
- document title;
- main landmark;
- duplicate IDs;
- visible readable text below 16px;
- unnamed visible controls;
- button controls below 44px;
- document-level horizontal overflow;
- horizontally clipped interactive controls;
- visible GitHub repository links;
- canonical High School header count;
- canonical hamburger count;
- official ecosystem toolbar count;
- known floating-control duplication;
- fixed/sticky footer overlap;
- unexpected full-screen fixed overlays.

Math landing pages additionally require:

- exactly one canonical 333 ticker;
- exactly one canonical AutoPopulate ticker;
- mounted mathematics ticker-pair state.

## Storage failure fixture

Added:

`courses/mathematics/runtime-acceptance/storage-failure-fixture.html`

The fixture uses temporary diagnostic keys only.

It verifies:

1. a normal storage write is not reported persistent until read-back verification succeeds;
2. a deliberately forced `QuotaExceededError` produces:
   - `persisted:false`;
   - `verified:false`;
   - memory fallback retained;
   - readable in-memory recovery;
3. temporary diagnostic keys are cleaned afterward.

No learner records, grades, mastery evidence, or Academy identity keys are touched.

## Ticker parity repair discovered during runtime preparation

The fresh runtime-oriented audit found that canonical High School chrome automatically mounted the 333 + AutoPopulate pair for English Week 01, but not for all four mathematics landing pages.

The shared chrome now recognizes:

- Pre-Algebra landing;
- Algebra I landing;
- Geometry landing;
- Algebra II landing.

It mounts the official pair idempotently.

A timing defect was also addressed: Pre-Algebra already declared deferred ticker scripts later in the document. A script-tag existence check could therefore succeed before the ticker APIs had executed. The shared chrome now waits for the actual `VNV333Ticker.mount` and `VNV_TICKER.autoPopulate` APIs before mounting.

Source syntax validation of the repaired global chrome: PASS.

## Target topology validation

All Full Sweep routes were checked directly in the repository.

Every target surface exists.

Every target surface also includes:

- `course-entry-contract.js`;
- `high-school-global-chrome-v2.js`.

## Laboratory self-validation

- Runtime laboratory inline JavaScript syntax: PASS.
- Storage fixture inline JavaScript syntax: PASS.
- Global High School chrome after ticker repair syntax: PASS.
- All target routes: PASS.
- Shared course-entry + global chrome coverage on all target routes: PASS.

## Manual sign-offs intentionally not automated

The laboratory keeps these separate rather than falsely certifying them:

- physical tablet rotation and touch feel;
- browser Print / Save PDF pagination;
- Geometry diagram / CAD manipulation;
- disposable-learner assessment submit/correct/retake/export/recovery;
- keyboard-only and screen-reader operation;
- production loading of first-party VNV external services.

## Acceptance boundary

This phase does **not** change the department verdict that the curriculum/source architecture is Exceptional.

It changes the runtime state from “no standardized acceptance mechanism” to:

**RUNTIME ACCEPTANCE LABORATORY READY · PRODUCTION RENDERED SWEEP HOLD**

A production browser run of the Core Sweep should be the next acceptance action. Any FAIL should reopen only the affected page/category rather than weakening the source-level curriculum verdict.
